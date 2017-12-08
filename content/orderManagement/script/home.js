

var timer = null;
var startTime = "";
var endTime = "";
var orderCode ="",telNumber="",user="";
var orderstate =-1;
var theContent = "todayDataContent";
function setJson(jsonStr, name, value, array) {
	if(!jsonStr) jsonStr = "{}";
	var jsonObj = JSON.parse(jsonStr);
	if(array) {
		jsonObj[name] = eval("[" + value + "]");
	} else {
		jsonObj[name] = value;
	}
	return JSON.stringify(jsonObj)
}

//---------------菜品类型查询------------------------------


/***********菜品类型************/


function getTodayRecordPara() {
	
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "startTime",startTime);
	jsonData = setJson(jsonData, "endTime", endTime);
	jsonData = setJson(jsonData, "orderCode", orderCode);
	jsonData = setJson(jsonData, "telNumber", telNumber);
	jsonData = setJson(jsonData, "user",user);
	jsonData = setJson(jsonData, "orderState",orderstate);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询订单传值=" + jsonData);
	return jsonData;
}

function getTodayRecord() {
//	loadingStart("todayDataContent");
//	return; 
	$("#"+theContent).html("");
	if(theContent == "lastDataContent"){
		var timeReg =  /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	
		if($("#startDate").val().length > 0 )
		{
			if(!timeReg.test($("#startDate").val()))
			{
				 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
				 return;
			}
		}
		if($("#endDate").val().length > 0 )
		{
			if(!timeReg.test($("#endDate").val()))
			{
				 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
				 return;
			}
		}
	
		if($("#startDate").val().length > 0 &&$("#endDate").val().length > 0 )
		{
			var startTime = $("#startDate").val().split("-");
			var endTime = $("#endDate").val().split("-");
			var startDate = new Date(parseInt(startTime[0]),parseInt(startTime[1]),parseInt(startTime[2]));
			var endDate = new Date(parseInt(endTime[0]),parseInt(endTime[1]),parseInt(endTime[2]));
			if(parseInt(startDate.getTime()) > parseInt(endDate.getTime()))
			{
				windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间",false);
			    return;
			}
		}
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishInfoOrderSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: getTodayRecordPara(),
		success: function(msg) {
			console.log("查询查询订单返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				
				createTodayRecord(msg);
				
			} else {
				windowStart(msg.resp.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
//			var msg = {
//				"orderList":[
//					{
//						"orderCode":"1211231312313",
//						"orderTime":"2016-16-16 10:23:33",
//						"orderUser":"张三",
//						"orderstate":1,
//						"count":12,
//						"priceCount":138,
//						"orderItem":[
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							},
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							},
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							}
//						]
//						
//					},
//					{
//						"orderCode":"1211231312313",
//						"orderTime":"2016-16-16 10:23:33",
//						"orderUser":"张三",
//						"orderstate":0,
//						"count":12,
//						"priceCount":138,
//						"orderItem":[
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							},
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							},
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							}
//						]
//					},
//					{
//						"orderCode":"1211231312313",
//						"orderTime":"2016-16-16 10:23:33",
//						"orderUser":"张三",
//						"orderstate":2,
//						"count":12,
//						"priceCount":138,
//						"orderItem":[
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							},
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							},
//							{
//								"dishInfoId":15,
//								"nameCn":"宫保鸡丁",
//								"count":1,
//								"price":125,
//								"priceCount":133
//							}
//						]
//					}
//				]
//			};
//			createTodayRecord(msg);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询订单权限", false);
			} else {
				windowStart("查询订单失败", false);
			}
		}
	})
}

function createTodayRecord(msg){
	
	if(!msg.orderList || msg.orderList.length == 0)
	{
		var str = "";
		str += "<div style='position:relative;width:100%;top:30%;text-align:center;font-size:26px'>";
		str += "当前系统中无订单信息";
		str += "</div>";
		$("#"+theContent).html(str);
		return;
	}
	var theData = msg.orderList;
	var str = "";
	for(var i = 0 ; i < theData.length;i++)
	{
		str += "<div class='recoad-data-style'>";
		//基本信息：编号、时间、订单人
		str += "<div class='recoad-basic-infos'>";
		str += "<span style='padding-left:10px'>订单编号:"+theData[i]["orderCode"]+"</span>";
		str += "<span style='padding-left:15px'>订单时间:"+theData[i]["orderTime"]+"</span>";
		str += "<span style='padding-left:15px'>订单人:"+theData[i]["orderUser"]+"</span>";
		str += "</div>";
		//订单列表
		var theHeight = 0;
		theHeight = theData[i]["orderItem"].length*30 + 90;
		str += "<div class='record-list' style='height:"+theHeight+"px'>";
		//列表左侧
		str += "<div class='record-list-left'>订单详情</div>";
		//列表左侧
		//列表右侧
		
		
//		$(".record-list").height(theHeight);
		str += "<div class='record-list-right' style='padding-left:20px;height:auto'>";
		for(var j= 0 ; theData[i]["orderItem"]!= undefined && j< theData[i]["orderItem"].length; j++ )
		{
			str += "<div style='width:100%;height:30px;'>";
			str += "<div style='width:20%;float:left;'>"+theData[i]["orderItem"][j]["nameCn"]+"</div>";
			str += "<div style='width:20%;float:left;'>份数:   "+theData[i]["orderItem"][j]["count"]+"</div>";
			str += "<div style='width:20%;float:left;'>单价:   "+theData[i]["orderItem"][j]["price"]+"</div>";
			
			str += "</div>";
		}
		
		str += "</div>";
		str += "<div style='width:100%'>";
		str += "<div class='record-list-left'>商品总数</div>";
		str += "<div class='record-list-right' style='padding-left:20px'>"+theData[i]["count"]+"</div>";
		
		str  += "</div>";
		str += "<div style='width:100%'>";
		str += "<div class='record-list-left'>商品总价</div>";
		str += "<div class='record-list-right' style='padding-left:20px;color:red'>"+theData[i]["priceCount"]+" 元</div>";
		str  += "</div>";
		//列表左侧
		str += "<div style='width:100%;height:40px;line-height:40px;text-align:right'>";
		if(parseInt(theData[i]["orderState"] )== 0)
		{
			str += "<span style='padding-right:20px'>";
			str += "<a class='btn btn-danger btn-unstall-info' theNum='"+theData[i]["orderCode"]+"'  style='width:80px'>失效</a>";
			str += "</span>";
		}
		else if(parseInt(theData[i]["orderState"] )== 1)
		{
			str += "<span style='color :#636363;padding-right:20px;font-size:18px;font-weight:bold'>";
			str += "订单已失效";
			str += "</span>";
		}
		else if(parseInt(theData[i]["orderState"] )== 2)
		{
			str += "<span style='color:#00B83F;padding-right:20px;font-size:18px;font-weight:bold'>";
			str += "订单已处理";
			str += "</span>";
		}
		str += "</div>";
		str += "</div>";
		str += "</div>";
	}
	$("#"+theContent).html(str);
	
	$(".btn-unstall-info").click(function(){
		unstallInfos($(this).attr("theNum"));
	})
}


function unstallInfosPara(theNum){
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "orderCode",theNum);
	
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("订单失效传值=" + jsonData);
	return jsonData;
}
function unstallInfos(theNum){
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishInfoOrderInvalidCmd",
		contentType: "application/text,charset=utf-8",
		data: unstallInfosPara(theNum),
		success: function(msg) {
			console.log("订单失效返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				
				windowStart("执行订单已失效", true);
				getTodayRecord();
			} else {
				windowStart(msg.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无对订单执行失效权限", false);
			} else {
				windowStart("执行订单失效操作失败", false);
			}
		}
	})
}

//
function getTimeInfos(){
	clearInterval(timer);
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth()+1;
	var day = today.getDate();
	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();
	if(month < 10)
	{
		month = "0"+month;
	}
	if(day < 10)
	{
		day = "0"+day;
	}
	if(hour < 10)
	{
		hour = "0"+hour;
	}
	if(min < 10)
	{
		min = "0"+min;
	}
	if(sec < 10)
	{
		sec = "0"+sec;
	}
	var str = "当前时间 :  "+year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec;
	$("#timeInfos").html(str);
	timer = setInterval(getTimeInfos,1000);
}



$(document).ready(function() {
	getTimeInfos();
	
	getTodayRecord();
	$(".time-picker").datepicker("setValue");
	
	$(".li-click").click(function(){
		if(parseInt($(this).attr("theNum")) == 0 )
		{
			clearInterval(timer);
			getTimeInfos();
			startTime = "";
			endTime = "";
			orderCode =$("#recordNum").val();
			telNumber=$("#phone").val();
			user=$("#thePeople").val();
			orderstate =parseInt($("#recordStatus").val());
			theContent = "todayDataContent";
		}
		else
		{
			clearInterval(timer);
			startTime = $("#startDate").val() +" 00:00:00";
			endTime = $("#endDate").val() +" 23:59:59";
			orderCode =$("#lastrecordNum").val();
			telNumber=$("#lastphone").val();
			user=$("#lastthePeople").val();
			orderstate =parseInt($("#lastrecordStatus").val());
			theContent = "lastDataContent";
			
		}
		getTodayRecord();
	})
	$("#btnSearchInfos").click(function(){
		clearInterval(timer);
		getTimeInfos();
		startTime = "";
		endTime = "";
		orderCode =$("#recordNum").val();
		telNumber=$("#phone").val();
		user=$("#thePeople").val();
		orderstate =parseInt($("#recordStatus").val());
		theContent = "todayDataContent";
		getTodayRecord();
	})
	$("#btnlastSearchInfos").click(function(){
		clearInterval(timer);
		startTime = $("#startDate").val() +" 00:00:00";
		endTime = $("#endDate").val() +" 23:59:59";
		orderCode =$("#lastrecordNum").val();
		telNumber=$("#lastphone").val();
		user=$("#lastthePeople").val();
		orderstate =parseInt($("#lastrecordStatus").val());
		theContent = "lastDataContent";
		getTodayRecord();
	})
})