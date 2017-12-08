var theNum = 0;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var data_page_index2 = 0;
var data_number2 = 17;
var curren_page2 = 1;
var total_page2 = 0;
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


//点检

function nodataInfos(boxId){
	var str = "";
	str += "<div style='position:absolute;width:100%;top:30%'>";
	
	str += "<div style='width:100%;text-align:center;font-size:22px;font-weight:bold'>";
	str += "当前条件下无数据";
	str += "</div>";
	str += "</div>";
	$("#"+boxId).html(str);
}
function getPointCheckHighInfoPara(){

	var startTime = "",endTime = "";
	if($("#startTime").val().length > 0  ){
		startTime = $("#startTime").val()+" 00:00:00";
	}
	if($("#endTime").val().length > 0  ){
		endTime = $("#endTime").val()+" 23:59:59";
	}

	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"sum",0);
		jsonData = setJson(jsonData,"keyword","");
		jsonData = setJson(jsonData,"index",data_page_index);
		jsonData = setJson(jsonData,"number",data_number);
		jsonData = setJson(jsonData,"startTime",startTime);
		jsonData = setJson(jsonData,"endTime",endTime);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"items","",true);
		jsonData = setJson(jsonData,"templateCode",$("#thePointDeviceType").val());
		console.log(jsonData);
		return jsonData;
}
function getPointCheckHighInfo(){
	$("#searchContent1").html("");
	loadingStart("searchContent1");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=PtCheckBasicInfoByTemplateCmd",
		contentType:"application/text,charset=utf-8",
		data:getPointCheckHighInfoPara(),
		success:function(msg){
			loadingStop();
			console.log(JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1)
			{
				createHighInfos(msg);
			}
			else
			{
				windowStart("获取设备点检信息失败",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			windowStart("获取设备点检信息失败",false);
		}
	})
}
function createHighInfos(msg)
{
	$("#searchContent1").html("");
	if(!msg.items ||  msg.items.length < 1)
	{
		nodataInfos("ptcontent");
		return;
	}
	var str = "";
	var theData = msg.items;
	var total = msg.sum;
	var totalPage = Math.ceil(parseInt(total)/data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	
	var str = "";
	str += "<table class='table table-bordered table-for-search'><thead>";
	str += "<tr>";
	str += "<th style='width:30%'>设备名称</th>";
	str += "<th style='width:55%'>时间</th>";
	str += "<th style='width:15%' class='hide'>状态</th>";
	str += "<th style='width:15%'>点检人</th>";
	str += "</tr>";
	str += "</thead><tbody>";
	for( var i = 0 ; i < theData.length; i++)
	{
		str += "<tr class='table-for-staus-tr' status='"+theData[i]["deviceStatus"]+"'>";
		str += "<td  style='width:30%'>"+theData[i]["deviceName"]+"</td>";
		str += "<td  style='width:55%'>"+theData[i]["checkTime"]+"</td>";
		if(parseInt(theData[i]["deviceStatus"]) == 0)
		{
			str += "<td class='hide' style='width:15%'><div style='width:60px;height:40px;margin:0px auto;'>未运行</div></td>";
		}else if(parseInt(theData[i]["deviceStatus"]) == 1){
			str += "<td class='hide' style='width:15%'><div style='width:60px;height:40px;margin:0px auto;color:#2FB472'>运行中</div></td>";
		}else{
			str += "<td class='hide' style='width:15%'><div class='table-fault' style=''>故障</div></td>";
		}
		var realData = {};
		 realData.items = [];
		 realData.items = theData[i]["items"];
		str += "<td  style='width:15%'>"+theData[i]["checkUser"]+"</td>";
		str += "</tr>";
	}
	str += "</tbody></table>";
	$("#ptcontent").html(str);
	
	
}


//点检

$(document).ready(function(){
	
	$(".input-style").datepicker("setValue");

	//点检
	$("#btnSearchDianJian").click(function(){
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		getPointCheckHighInfo();
	})
	
	//点检分页操作
	//上一页
	$("#btnPageBefore").click(function(){
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		
		if(curren_page == 1)
		{
			windowStart("当前为首页",false);
			return;
		}
		data_page_index -= data_number;
		curren_page -= 1;
		getPointCheckHighInfo();
	})
	//下一页
	$("#btnPageNext").click(function(){
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		
		if(total_page == curren_page)
		{
			windowStart("当前为尾页",false);
			return;
		}
		data_page_index += data_number;
		curren_page += 1;
		getPointCheckHighInfo();
	})
	//跳转页
	$("#btnPageJump").click(function(){
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
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
		getPointCheckHighInfo();
	})
	//点检分页操作
})
