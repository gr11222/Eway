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


//维保打印
function printWeiBaoReport(){
	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	var htmlTitle = "<html><head><title>维保记录统计</title></head><body>";
    var htmlhead = $("#weibaoDataContent").html();
    var htmlFoot = '</body></html>'
	newWindow.document.write(htmlTitle + htmlhead + htmlFoot);
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
}
//维保查询
function funWbSearchPara(){
	var startTime = "",endTime = "";
	if($("#startTime2").val().length > 0  ){
		startTime = $("#startTime2").val()+" 00:00:00";
	}
	if($("#endTime2").val().length > 0  ){
		endTime = $("#endTime2").val()+" 23:59:59";
	}
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"startTime",startTime);
		jsonData = setJson(jsonData,"endTime",endTime);
		jsonData = setJson(jsonData,"keyWord",$("#keyWord").val());
		jsonData = setJson(jsonData,"index",data_page_index2);
		jsonData = setJson(jsonData,"number",data_number2);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("查询维保传值="+jsonData);
		return jsonData;
}
function funWbSearch(){
	$("#weibaoDataContent").html("");
	loadingStart("weibaoDataContent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=RepairRecordSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:funWbSearchPara(),
		success:function(msg){	
			loadingStop();
//			if($("body").find("#tipWindowBox").length > 0 )
//			{
//				windowRemove();
//			}
			console.log("查询维保返回值="+JSON.stringify(msg));	
			$("#weibaoDataContent").html("");
			$("#pageNumId2").val("");
			createWbTableInfos(msg);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
//			alert("查询维保信息失败");
//			windowStart("查询维保信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询维保信息权限",false);
            }else{
            	windowStart("查询维保信息失败",false);
            }
		}
	})
}
function createWbTableInfos(msg)
{
	if(!msg.items || msg.items.length < 1)
	{
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无维保记录统计信息";
		str += "</div>";
		$("#weibaoDataContent").html(str);
		return;
	}
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total)/data_number2);
	total_page2 = totalPage;
	$("#pageTotalInfo2").html("第 "+curren_page2+" 页/共 "+totalPage+" 页");
	var realData =  msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center td-width-2' style='width:16%'>标签ID</th>";
	str += "<th class='text-center td-width-2'>标签名称</th>";
	str += "<th class='text-center td-width-2'>标签类型</th>";
//	str += "<th class='text-center td-width-2 '>标签型号</th>";
	str += "<th class='text-center td-width-2'>维保人</th>";
	str += "<th class='text-center td-width-2'>维保时间</th>";
	str += "<th class='text-center td-width-2' style='width:12%'>维保记录</th>";
	str += "</thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
//		if( realData[i]["pairs"].length < 1)
//		{
//			continue;
//		}
		if(realData[i]["pairs"] == undefined || realData[i]["pairs"].length < 1)
		{
			str += "<tr>";
			str += "<td class='text-center td-width-2' title='"+realData[i]["tagId"]+"'>"+realData[i]["tagId"]+"</td>";
			str += "<td class='text-center td-width-2' title='"+realData[i]["tagName"]+"'>"+realData[i]["tagName"]+"</td>";
			str += "<td class='text-center td-width-2' title='"+realData[i]["tagType"]+"'>"+realData[i]["tagType"]+"</td>";
			str += "<td class='text-center td-width-2' title='"+realData[i]["tagModel"]+"'>"+realData[i]["tagModel"]+"</td>";
			str += "<td class='text-center td-width-2'></td>";
			str += "<td class='text-center td-width-2'></td>";
			str += "<td class='text-center td-width-2'></td>";
			str += "<td class='text-center td-width-2'></td>";
			str += "<td class='text-center td-width-2' style='width:16%'></td>";
			str += "</tr>";
			continue;
		}
		var checkData = realData[i]["pairs"];
		for( var j = 0 ;  j < checkData.length ; j++ )
		{
			str += "<tr>";
			str += "<td class='text-center td-width-2' title='"+realData[i]["tagId"]+"'>"+realData[i]["tagId"]+"</td>";
			str += "<td class='text-center td-width-2' title='"+realData[i]["tagName"]+"'>"+realData[i]["tagName"]+"</td>";
			str += "<td class='text-center td-width-2' title='"+realData[i]["tagType"]+"'>"+realData[i]["tagType"]+"</td>";
//			str += "<td class='text-center td-width-2'>"+realData[i]["tagModel"]+"</td>";
			str += "<td class='text-center td-width-2' title='"+checkData[j]["checkUser"]+"'>"+checkData[j]["checkUser"]+"</td>";
			str += "<td class='text-center td-width-2' title='"+checkData[j]["checkTime"]+"'>"+checkData[j]["checkTime"]+"</td>";
			str += "<td class='text-center td-width-2 ' style='width:16%' title='"+checkData[j]["note"]+"'>"+checkData[j]["note"]+"</td>";
			str += "</tr>";
		}
		
	}
	str += "</tbody><table>";
	$("#weibaoDataContent").html(str);
}

//维保导出

function funExportWbInfo(){
	loadingStart("weibaoDataContent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=RepairRecordExportCmd",
		contentType:"application/text,charset=utf-8",
		data:funWbSearchPara(),
		success:function(msg){		
			loadingStop();
			console.log("导出维保返回值="+JSON.stringify(msg));	
			
			if(msg.responseCommand == "NoData"){
				windowStart("当前无数据不能导出",false);
			}else{
				window.location.href="../../../../../"+msg.responseCommand;	
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
//			alert("导出点检统计信息失败");
//			windowStart("导出维保记录统计信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无导出维保记录统计信息权限",false);
            }else{
            	windowStart("导出维保记录统计信息失败",false);
            }
		}
	})
}

function funCheckDate() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	if($("#startTime2").val().length > 0) {
		if(!timeReg.test($("#startTime2").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if($("#endTime2").val().length > 0) {
		if(!timeReg.test($("#endTime2").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
		if($("#startTime2").val().length > 0 && $("#endTime2").val().length == 0) {
			windowStart("请输入结束时间", false);
			return false;
		}
			if($("#startTime2").val().length == 0 && $("#endTime2").val().length > 0) {
			windowStart("请输入开始时间", false);
			return false;
		}
	if($("#startTime2").val().length > 0 && $("#endTime2").val().length > 0) {
		var startTime = $("#startTime2").val().split("-");
		var endTime = $("#endTime2").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1])-1, parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("开始时间不能大于结束时间", false);
			return false;
		}
	}
	return true;
}

$(document).ready(function(){
	$(".input-style").datepicker("setValue");
	$(".input-style").val("");
	funWbSearch();
	$("#btnSearchWeiBao").click(function(){
        if (!funCheckDate()) {
        	return;
        }
		data_page_index2 = 0;
		curren_page2 = 1;
		total_page2 = 0;
		$("#pageNumId2").val("");
		funWbSearch();
	})
	//维保打印
	$("#btnPrintWeiBao").click(function(){
		if($("#weibaoDataContent").find("table").hasClass("table"))
		{
			printWeiBaoReport();
		}
		else
		{
			windowStart("当前页面无可打印数据",false);
		}
	})
	$("#btnExportWeiBao").click(function(){
		funExportWbInfo();
	})
	//维保分页操作
	//上一页
	$("#btnPageBefore2").click(function(){
		var startTime = $("#startTime2").val().split("-");
		var endTime = $("#endTime2").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page2 == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		
		if(curren_page2 == 1)
		{
			windowStart("当前为首页",false);
			return;
		}
		data_page_index2 -= data_number2;
		curren_page2 -= 1;
		funWbSearch();
	})
	//下一页
	$("#btnPageNext2").click(function(){
		var startTime = $("#startTime2").val().split("-");
		var endTime = $("#endTime2").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page2 == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		
		if(total_page2 == curren_page2)
		{
			windowStart("当前为尾页",false);
			return;
		}
		data_page_index2 += data_number2;
		curren_page2 += 1;
		
		funWbSearch();
	})
	//跳转页
	$("#btnPageJump2").click(function(){
		var startTime = $("#startTime2").val().split("-");
		var endTime = $("#endTime2").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page2 == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		var numReg = /^[0-9]+$/;
		if(!numReg.test($("#pageNumId2").val()))
		{
			windowStart("页码输入有误",false);
			return;
		}
		if(parseInt($("#pageNumId2").val()) < 1 )
		{
			windowStart("页码输入有误",false);
			return;
		}
		if(parseInt($("#pageNumId2").val()) > total_page2)
		{
			windowStart("页码输入有误",false);
			return;
		}
		data_page_index2 = (parseInt($("#pageNumId2").val()) - 1)*data_number2;
		curren_page2 = parseInt($("#pageNumId2").val());
		funWbSearch();
	})
	//维保分页操作
})
