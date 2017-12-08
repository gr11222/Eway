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

function cusSort(arr){  
  
  arr.sort(function(a,b){  
    	return a.localeCompare(b);  
  })  
  
  return arr;
  
}
function createobjData(data1,data2){
//	console.log();
	
	var arr = [];
	
	for(var  i = 0 ; i < data1.length;i++ )
	{
		
		for(var  j = 0 ; j < data2.length;j++ )
		{
			if(data1[i] == data2[j]["nameCn"])
			{
				console.log(1);
				var obj = {};
				obj.nameCn = data1[i];
				obj.classifyId =  data2[j]["classifyId"];
				arr.push(obj);
			}else{
				continue;
			}
		}
	}
	return arr;
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

function funGetRepairInfoPara(){
	var deviceClassifyId = -1,companyId=-1;
	var  startTime = "",endTime="";
	if($("#beipinType").val().length > 0 )
	{
		deviceClassifyId  = parseInt($("#beipinType").val());
	}
	if($("#fuwuShangSelect").val()!= undefined && $("#fuwuShangSelect").val()!= null&&$("#fuwuShangSelect").val().length > 0 )
	{
		companyId  = parseInt($("#fuwuShangSelect").val());
	}
	if($("#startTime").val().length > 0 )
	{
		startTime  = $("#startTime").val()+" 00:00:00";
	}
	if($("#endTime").val().length > 0 )
	{
		endTime  = $("#endTime").val()+" 23:59:59";
	}
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"enterprise",$("#company").val());
		jsonData = setJson(jsonData,"project",$("#projectName").val());
		jsonData = setJson(jsonData,"aclState",$("#alarmStatus").val());
		jsonData = setJson(jsonData,"deviceClassifyId",deviceClassifyId);
		jsonData = setJson(jsonData,"deviceModel",$("#beipinModel").val());
		jsonData = setJson(jsonData,"companyId",companyId);
		jsonData = setJson(jsonData,"startTime",startTime);
		jsonData = setJson(jsonData,"endTime",endTime);
		jsonData = setJson(jsonData, "index", data_page_index);
	    jsonData = setJson(jsonData, "number", data_number);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		
		
		console.log("查询日志传值="+jsonData);
		return jsonData;
}
function funGetRepairInfo(){
	var timeReg =  /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
//	{
//		windowStart("时间范围有误,请填写时间范围",false);
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
	if($("#startTime").val().length == 0 )
	{
		if($("#endTime").val().length> 0 )
		{
			windowStart("时间范围有误,请重新选取时间范围",false);
			 return;
		}
	}
	if($("#endTime").val().length == 0 )
	{
		if($("#startTime").val().length> 0 )
		{
			windowStart("时间范围有误,请重新选取时间范围",false);
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
			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间",false);
		    return;
		}
	}
	$("#ptcontent").html("");
	repair_length = 0;
	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSparePartsAlarmLogSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:funGetRepairInfoPara(),
		success:function(msg){		
			loadingStop();
//			windowRemove();
			console.log("查询日志返回值="+JSON.stringify(msg));	
			
			createRepairTableInfos(msg);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询点检信息权限",false);
            }else{
            	windowStart("查询点检信息失败",false);
            }
//			windowStart("查询点检信息失败",false);
		}
	})
}
function createRepairTableInfos(msg)
{
	if(!msg.items || msg.items.length < 1)
	{
		$("#ptcontent").html("");
		var str = "";
		 str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		 str += "提示:<br/>当前条件下无备品备件日志信息";
		 str += "</div>";
		 $("#ptcontent").html(str);
		
		return;
	}
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total)/data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	
	var realData =  msg.items;
	
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";

	str += "<th class='text-cente' >序号</th>";
	str += "<th class='text-center' >报警编号</th>";
	str += "<th class='text-center' >备品类型</th>";
	str += "<th class='text-center'>备品型号</th>";
	str += "<th class='text-center'>服务商</th>";
	str += "<th class='text-center'>报警时间</th>";
	str += "<th class='text-center'>剩余件数</th>";
	str += "<th class='text-center'>预警件数</th>";
	str += "<th class='text-center'>报警状态</th>";
	str += "<th class='text-center'>操作人</th>";
	str += "<th class='text-center'>操作时间</th>";
	str += "<th class='text-center'>处理结果</th>";
	str += "</thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
		var theData = JSON.stringify(realData[i]);
		str+= "<tr>";
		
		str += "<td class='text-center' style='width:6%'>"+(i+1)+"</td>";
		str += "<td class='text-center'  style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmCode"]+"</td>";
		str += "<td class='text-center'  style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["deviceClassifyName"]+"</td>";
		str += "<td class='text-center'  style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["deviceModel"]+"</td>";
		str += "<td class='text-center' style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["company"]+"</td>";
		str += "<td class='text-center' style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmTime"]+"</td>";
		str += "<td class='text-center' style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["spareNum"]+"</td>";
		str += "<td class='text-center' style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmLimit"]+"</td>";
		str += "<td class='text-center' style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["aclState"]+"</td>";
		str += "<td class='text-center' style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["aclUser"]+"</td>";
		str += "<td class='text-center' style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["aclTime"]+"</td>";
		str += "<td class='text-center' style='width:8.545454%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["dispose"]+"</td>";
		
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	
}


//资产维护-- 查询资产类型  所属工厂  服务商
function searchSysInfosPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("查询资产类型  所属工厂  服务商传值="+jsonData);
		return jsonData;
}
function searchSysInfos(){
	$("#beipinType").html("");
	$("#fuwuShangSelect").html("");
	$("#projectName").html("");
//	$("#editassetTypeModal").html("");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:searchSysInfosPara(),
		success:function(msg){		
//			loadingStop();
			console.log("查询资产类型  所属工厂  服务商返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("OK")!= -1){
				createSysInfoSelect(msg);
				funGetRepairInfo();
			}else{
				windowStart("查询资产类型 、所属工厂 、服务商失败",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//			loadingStop();
			
//			windowStart("查询资产类型 、所属工厂 、服务商失败",false);
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询资产类型 、所属工厂 、服务商权限",false);
            }else{
            	windowStart("查询资产类型 、所属工厂 、服务商失败",false);
            }
		}
	})
}
function createSysInfoSelect(msg){
	if(msg.factoryItems != undefined && msg.factoryItems.length > 0  )
	{
		var theData = msg.factoryItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0 ; i < theData.length ; i++ )
		{
			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
		$("#factoryModal").html(str);
		$("#editfactoryModal").html(str);
//		$("#editfactoryAreaModal").html(str);
		
	}
	if(msg.CompanyItems != undefined && msg.CompanyItems.length > 0  )
	{
		var currenData =  msg.CompanyItems;
		var dataArr = [];
		for(var i = 0 ; i < currenData.length ; i++ )
		{
			dataArr.push(currenData[i]["nameCn"]);
		}
		
		var sortData= cusSort(dataArr);
		
		
		var theData = createobjData(sortData,currenData);
		
		var str = "<option value=''>请选择</option>";
		for(var i = 0 ; i < theData.length ; i++ )
		{
			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
		$("#fuwuShangSelect").html(str);
		$("#madeByModal").html(str);
		$("#editmadeByModal").html(str);
		
	}
	if(msg.DeviceItems != undefined && msg.DeviceItems.length > 0  )
	{
		var currenData =  msg.DeviceItems;
		var dataArr = [];
		for(var i = 0 ; i < currenData.length ; i++ )
		{
			dataArr.push(currenData[i]["nameCn"]);
		}
		
		var sortData= cusSort(dataArr);
		
		
		var theData = createobjData(sortData,currenData);
		
		var str = "<option value=''>请选择</option>";
		for(var i = 0 ; i < theData.length ; i++ )
		{
			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
		$("#beipinType").html(str);
		$("#beipinTypeModal").html(str);
		$("#editbeipinTypeModal").html(str);
	}
	if(msg.providerItems != undefined && msg.providerItems.length > 0  )
	{
		var currenData =  msg.providerItems;
		var dataArr = [];
		for(var i = 0 ; i < currenData.length ; i++ )
		{
			dataArr.push(currenData[i]["nameCn"]);
		}
		
		var sortData= cusSort(dataArr);
		
		
		var theData = createobjData(sortData,currenData);
		
		var str = "<option value=''>请选择</option>";
		for(var i = 0 ; i < theData.length ; i++ )
		{
			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
		$("#bpGiveModal").html(str);
		$("#editbpGiveModal").html(str);
//		$("#editfactoryAreaModal").html(str);
		
	}
	
	if(msg.projectItems != undefined && msg.projectItems.length > 0  )
	{
		var theData = msg.projectItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0 ; i < theData.length ; i++ )
		{
			str += "<option value='"+theData[i]["projectId"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
		$("#projectName").html(str);
	
	}
	
}
$(document).ready(function(){
	
	
	$(".input-style").datepicker("setValue");
	
	searchSysInfos();
	//点检
	$("#btnSearchRepair").click(function(){
		
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		funGetRepairInfo();
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
		funGetRepairInfo();
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
		funGetRepairInfo();
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
		funGetRepairInfo();
	})
	//点检分页操作

})
