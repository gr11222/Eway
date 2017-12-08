var theNum = 0;
var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var is_start_auto = 0;
var  isFinish = 0;
var theEditStatus = 0;
var editData= {};
var isShenHe = -1;
var repair_length = 0;
var is_boHui = -1;
function EscapeString(str) {
    return escape(str).replace(/\%/g,"\$");
}

function setJson(jsonStr, name, value, array)
{
    if(!jsonStr)jsonStr="{}";
    var jsonObj = JSON.parse(jsonStr);
    if (array) {
        jsonObj[name] = eval("["+value+"]");
    }
    else {
        jsonObj[name] = value;
    }
    return JSON.stringify(jsonObj) 
}
//获取资产编号、公司、项目
function funGetSystemInfosPara(){
	var jsonData = setJson(null,"userAccountName",localStorage.getItem("userAccountName"));
//		jsonData = setJson(jsonData,"responseCommand","");
//		jsonData = setJson(jsonData,"company","",true);
//		jsonData = setJson(jsonData,"project","",true);
//		jsonData = setJson(jsonData,"assetCode","",true);
//		jsonData = setJson(jsonData,"AccountName",localStorage.getItem("userAccountName"));
		console.log("查询资产编号、公司、项目传值="+jsonData);
		return jsonData;
}
function funGetSystemInfos(){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOspEarlyWarningValueQueryCmd",
		contentType:"application/text,charset=utf-8",
		data:funGetSystemInfosPara(),
		success:function(msg){		
			loadingStop();
//			windowRemove();
			console.log("获取资产编号、公司、项目返回值="+JSON.stringify(msg));	
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1)
			{
				createSystemInfos(msg);
				funAlarmInfo();
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无获取资产编号、项目和公司信息的权限",false);
            }else{
            	windowStart("获取资产编号、项目和公司信息失败",false);
            }
		}
	})
}

function createSystemInfos(msg){
	if(msg.company != undefined && msg.company.length > 0) {
		var theData = msg.company;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["nameCn"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#company").html(str);
	}
	
	if(msg.project != undefined && msg.project.length > 0) {
		var theData = msg.project;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["nameCn"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#projectName").html(str);
	}
	if(msg.buildingItems != undefined && msg.buildingItems.length > 0) {
		var theData = msg.buildingItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#building").html(str);
	}
	if(msg.assetCode != undefined && msg.assetCode.length > 0 )
	{
		$(".li-id-class").unbind("click");
		$("#deviceName").unbind("keyup");
		$("#assetCodeContent").html("");
		var str = "";
		var theData = msg.assetCode;
		var str = "";
		str += "<ul style='margin:0px;padding:0px'>";
		for(var i = 0 ; i < theData.length ; i++ )
		{
			str += "<li class='li-id-class hide' style='width:100%;height:20px;line-height:20px;cursor:default'   theAssetCode='"+theData[i]+"'>"+theData[i]+"</li>";	
		}
		str += "</ul>";
		$("#assetCodeContent").html(str);
		$("#theAssetCode").keyup(function(){
			var theValue = $(this).val();
			var realValue = -1;
			if($(this).val().length > 0 )
			{
				for( var i = 0 ; i < $(".li-id-class").length;i++)
				{
					if( $(".li-id-class").eq(i).attr("theAssetCode").indexOf(theValue) != -1)
					{
						
						 $(".li-id-class").eq(i).removeClass("hide");
					}
					else
					{
						 $(".li-id-class").eq(i).addClass("hide");
					}
				}
			}
			$(".li-id-class").bind("click",function(){
				realValue = $(this).attr("theAssetCode");
				$("#theAssetCode").val(realValue);
				$(".li-id-class").addClass("hide");
			});
		})
	}
	
}

function funAlarmInfoPara(){

	var startTime = "",endTime = "";
	if($("#startTime").val().length > 0 )
	{
		startTime  = $("#startTime").val()+" 00:00:00";
	}
	if($("#endTime").val().length > 0 )
	{
		endTime  = $("#endTime").val()+" 23:59:59";
	}
	var jsonData = setJson(null,"requestCommand","");
//		jsonData = setJson(jsonData,"responseCommand","");
//		jsonData = setJson(jsonData,"company",$("#company").val());
//		jsonData = setJson(jsonData,"startTime",startTime);
//		jsonData = setJson(jsonData,"endTime",endTime);
//		jsonData = setJson(jsonData,"building",$("#theBuilding").val());
//		jsonData = setJson(jsonData,"project",$("#projectName").val());
//		jsonData = setJson(jsonData,"alarmState",$("#alarmStatus").val());
//		jsonData = setJson(jsonData,"alarmUser",$("#alarmMan").val());
//		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
//		jsonData = setJson(jsonData,"index",data_page_index);
//		jsonData = setJson(jsonData,"number",data_number);
//		jsonData = setJson(jsonData,"assetCode",$("#theAssetCode").val());
		
		
		var jsonData = setJson(null,"company",$("#company").val());
		jsonData = setJson(jsonData,"project",$("#projectName").val());
		jsonData = setJson(jsonData,"alarmState",$("#alarmStatus").val());
		jsonData = setJson(jsonData,"building",parseInt($("#building").val()));
		jsonData = setJson(jsonData,"startTime",startTime);
		jsonData = setJson(jsonData,"endTime",endTime);
		jsonData = setJson(jsonData,"alarmUser",$("#alarmMan").val());
		jsonData = setJson(jsonData,"assetCode",$("#theAssetCode").val());
		jsonData = setJson(jsonData,"index",data_page_index);
		jsonData = setJson(jsonData,"number",data_number);
		jsonData = setJson(jsonData,"accountName",localStorage.getItem("userAccountName"));
		console.log("查询报警传值="+jsonData);
		return jsonData;
}
function funAlarmInfo(){
	var timeReg =  /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
//	{
//		windowStart("报警时间选择有误,请填写时间范围",false);
//	    return;
//	}
if($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
			windowStart("请输入结束时间", false);
			return false;
		}
			if($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
			windowStart("请输入开始时间", false);
			return false;
		}
	if($("#startTime").val().length > 0 )
	{
		if(!timeReg.test($("#startTime").val()))
		{
			 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
			 return;
		}
	}
	if($("#endTime").val().length > 0 )
	{
		if(!timeReg.test($("#endTime").val()))
		{
			 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
			 return;
		}
	}
	
	if($("#startTime").val().length > 0 &&$("#endTime").val().length > 0 )
	{
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]),parseInt(startTime[1]),parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]),parseInt(endTime[1]),parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime()))
		{
			windowStart("报警时间选择有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间",false);
		    return;
		}
	}
	$("#ptcontent").html("");
	repair_length = 0;
	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAlarmValueLogInfoSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:funAlarmInfoPara(),
		success:function(msg){		
			loadingStop();
//			windowRemove();
			console.log("查询报警返回值="+JSON.stringify(msg));	
			$("#ptcontent").html("");
			$("#pageNumId").val("");

			createAlarmTableInfos(msg);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询报警日志权限",false);
            }else{
            	windowStart("查询报警日志失败",false);
            }
//			windowStart("查询点检信息失败",false);
		}
	})
}
function createAlarmTableInfos(msg)
{
	if(!msg.items || msg.items.length < 1)
	{
		$("#ptcontent").html("");
		var str = "";
		 str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		 str += "提示:<br/>当前条件下无报警信息";
		 str += "</div>";
		 $("#ptcontent").html(str);
		
		return;
	}
	//分页
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total)/data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
//	
	var realData =  msg.items;
	
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<tr><th class='text-center'>序号</th><th class='text-center'>报警编号</th>";
	str += "<th class='text-center'>报警时间</th>";
	str += "<th class='text-center'>报警设备</th>";
	str += "<th class='text-center'>所属建筑</th>";
	str += "<th class='text-center'>安装位置</th>";
	str += "<th class='text-center'>报警人</th>";
	str += "<th class='text-center'>报警参数</th>";
	str += "<th class='text-center'>报警状态</th>";
	str += "<th class='text-center'>响应人</th>";
	str += "<th class='text-center'>响应时间</th>";
	str += "<th class='text-center'>处理结果</th>";
	str += "</tr></thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
	
		str+= "<tr  style='cursor:default'>";
		str += "<td class='text-center'  style='width:4%;word-wrap: break-word;word-break: break-all;'>"+(i+1)+"</td>";
		str += "<td class='text-center'  style='width:9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmCode"]+"</td>";
		str += "<td class='text-center'  style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmTime"]+"</td>";
		str += "<td class='text-center'  style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmDevName"]+"</td>";
		str += "<td class='text-center' style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["building"]+"</td>";
		str += "<td class='text-center' style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["position"]+"</td>";
		str += "<td class='text-center' style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmUser"]+"</td>";
		str += "<td class='text-center' style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmProperty"]+"</td>";
		str += "<td class='text-center' style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["aclState"]+"</td>";
		str += "<td class='text-center' style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["aclUser"]+"</td>";
		
		str += "<td class='text-center' style='width:8.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["aclTime"]+"</td>";
		
		str += "<td class='text-center' style='width:6.9%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["dispose"]+"</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	
}

$(document).ready(function(){
	
	$(".input-style").datepicker("setValue");
	// $(".input-style").val("");
	funGetSystemInfos();
	//点检
	$("#btnSearchRepair").click(function(){
		
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		$("#pageNumId").val("");
		funAlarmInfo();
	})
	
	
	//点检分页操作
	//上一页
	$("#btnPageBefore").click(function(){
		if(total_page == 0)
		{
			return;
		}
		
		if(curren_page == 1)
		{
			windowStart("当前为首页",false);
			return;
		}
		data_page_index -= data_number;
		curren_page -= 1;
		funAlarmInfo();
	})
	//下一页
	$("#btnPageNext").click(function(){
		if(total_page == 0)
		{
			return;
		}
		
		if(total_page == curren_page)
		{
			windowStart("当前为尾页",false);
			return;
		}
		data_page_index += data_number;
		curren_page += 1;
		funAlarmInfo();
	})
	//跳转页
	$("#btnPageJump").click(function(){
		if(total_page == 0)
		{
			return;
		}		
		var numReg = /^[0-9]+$/;
		if(!numReg.test($("#pageNumId").val()))
		{
			windowStart("页码输入有误",false);
			return;
		}
		if(parseInt($("#pageNumId").val()) < 1 )
		{
			windowStart("页码输入有误",false);
			return;
		}
		if(parseInt($("#pageNumId").val()) > total_page)
		{
			windowStart("页码输入有误",false);
			return;
		}
		data_page_index = (parseInt($("#pageNumId").val()) - 1)*data_number;
		curren_page = parseInt($("#pageNumId").val());
		$("#pageNumId").val("");
		funAlarmInfo();
	})
	//点检分页操作
	
	
})
