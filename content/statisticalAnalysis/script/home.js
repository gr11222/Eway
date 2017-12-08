
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


function userLogout() {
    if(!window.confirm('确认退出？')){
    	return false;
    } 
    var IpAdress = window.location.href.split("/"); 
   	window.location.href = IpAdress[0]+IpAdress[1]+"//"+IpAdress[2]+"/logOut";
}



function realClick(){
	$(".nav-click").bind("click",function(){
		$(".nav-click").each(function(){
			
			$(this).removeClass("li-active");
			$(this).addClass("li-unactive");
			$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+".png");
			$(this).css({"background":"rgba(59,149,227,1)","color":"rgba(255,255,255,1)"});
//			$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+".png");
			
		})
		$(this).removeClass("li-unactive");
		$(this).addClass("li-active");
		$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+"_active.png");
		$(this).css({"background":"rgba(255,255,255,1)","color":"rgba(31,126,208,1)"});
		window.location.replace($(this).attr("linkHref"));
	})
}
function navClickFunction(){
	
	$(".nav-click").mouseover(function(){
		if($(this).hasClass("li-unactive"))
		{
			
			$(this).css({"background":"rgba(255,255,255,1)","color":"rgba(31,126,208,1)"});
			$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+"_active.png");
		
		}
	})
	$(".nav-click").mouseout(function(){
		if($(this).hasClass("li-unactive"))
		{
			
			$(this).css({"background":"rgba(59,149,227,1)","color":"rgba(255,255,255,1)"});
			$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+".png");
			
		}
	})
}


function funPtSearchPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"startTime",$("#startTime").val()+" 00:00:00");
		jsonData = setJson(jsonData,"endTime",$("#endTime").val()+" 23:59:59");
		jsonData = setJson(jsonData,"keyWord",$("#searchTip").val());
		jsonData = setJson(jsonData,"index",data_page_index);
		jsonData = setJson(jsonData,"number",data_number);
		console.log("查询点检传值="+jsonData);
		return jsonData;
}
function funPtSearch(){
	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/SearchPtCheckRecord",
		contentType:"application/text,charset=utf-8",
		data:funPtSearchPara(),
		success:function(msg){		
			loadingStop();
//			windowRemove();
			console.log("查询点检返回值="+JSON.stringify(msg));	
			$("#ptcontent").html("");
			$("#pageNumId").val("");
			createPtTableInfos(msg);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			
			windowStart("查询点检信息失败",false);
		}
	})
}
function createPtTableInfos(msg)
{
	if(!msg.items || msg.items.length < 1)
	{
		$("#ptcontent").html("");
		var str = "";
		 str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		 str += "提示:<br/>当前条件下无点检记录统计信息";
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
	str += "<th class='text-center td-width'>标签ID</th>";
	str += "<th class='text-center td-width'>标签名称</th>";
	str += "<th class='text-center td-width'>标签类型</th>";
	str += "<th class='text-center td-width'>标签型号</th>";
	str += "<th class='text-center td-width'>点检人</th>";
	str += "<th class='text-center td-width'>点检时间</th>";
	str += "<th class='text-center td-width'>运行状态</th>";
	str += "<th class='text-center td-width'>仪表数值</th>";
	str += "<th class='text-center td-width' style='width:12%'>点检记录</th>";
	str += "</thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
		
		if(realData[i]["pairs"] == undefined || realData[i]["pairs"].length < 1)
		{
			str += "<tr>";
			str += "<td class='text-center td-width'><a href='javascript:void(0)' style='text-decoration:underline'>"+realData[i]["tagId"]+"</a></td>";
			str += "<td class='text-center td-width'>"+realData[i]["tagName"]+"</td>";
			str += "<td class='text-center td-width'>"+realData[i]["tagType"]+"</td>";
			str += "<td class='text-center td-width'>"+realData[i]["tagModel"]+"</td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width' style='width:12%'></td>";
			str += "</tr>";
			continue;
		}
		var checkData = realData[i]["pairs"];
		for( var j = 0 ;  j < checkData.length ; j++ )
		{
			str += "<tr  class='pt-chart-click' tagName='"+realData[i]["tagName"]+"' theData='"+JSON.stringify(checkData)+"'>";
			str += "<td class='text-center td-width'><a href='javascript:void(0)' style='text-decoration:underline'>"+realData[i]["tagId"]+"</a></td>";
			str += "<td class='text-center td-width'>"+realData[i]["tagName"]+"</td>";
			str += "<td class='text-center td-width'>"+realData[i]["tagType"]+"</td>";
			str += "<td class='text-center td-width'>"+realData[i]["tagModel"]+"</td>";
			
			str += "<td class='text-center td-width'>"+checkData[j]["checkUser"]+"</td>";
			str += "<td class='text-center td-width'>"+checkData[j]["checkTime"]+"</td>";
			var status = "";
			var color_style = "";
			if(parseInt(checkData[j]["status"]) == 0 )
			{
				status = "未运行"; 
				color_style = "";
			}
			else if(parseInt(checkData[j]["status"]) == 1)
			{
				status = "运行中";
				color_style = "color:green";
			}
			else
			{
				status = "故障";
				color_style = "color:red";
			}
			str += "<td class='text-center td-width' style='"+color_style+"'>"+status+"</td>";
			str += "<td class='text-center td-width'>"+checkData[j]["checkValue"]+"</td>";
			str += "<td class='text-center td-width' style='width:12%'>"+checkData[j]["note"]+"</td>";
			str += "</tr>";
		}
		
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	$(".pt-chart-click").click(function(){
		createLineChart(eval("("+$(this).attr("theData")+")"),$(this).attr("tagName"));
	})
}

function createLineChart(theData,tagName)
{
	console.log(JSON.stringify(theData));
//	return;
	$("#lanelModal").modal("show");
	
	var data_arr = [];
	var axis_arr = [];
	var real_data_arr = [];
	for(var i = 0 ; i < theData.length ; i++ )
	{
		axis_arr.push(theData[i]["checkTime"]);
		data_arr.push(parseFloat(theData[i]["checkValue"]));
		
	}
	for( var  i = 0 ; i < axis_arr.length ; i++ )
	{
		var dataArr = [];
		dataArr.push(axis_arr[i]);
		dataArr.push(data_arr[i]);
		real_data_arr.push(dataArr);
	}
	$("#chartContent").highcharts({
		chart: {
            type: 'spline',
            zoomType:"x"
        },
        credits: {
            enabled: false
        },
        title: {
            text: "标签："+tagName,
            style:{
            	fontWeight:"bold",
            	fontSize:16
            }
        },
        
        xAxis: {
//      	 type: 'category',
            categories: axis_arr,
//          labels: {
//              rotation: -20,
//              style: {
//                  fontSize: '4px',
//                  fontFamily: '微软雅黑, sans-serif'
//              }
//          }
        },
        
        yAxis: {
//          title: {
//              text: 'Temperature (°C)'
//          }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
//      series:[{
//          name: tagName,
//          data: real_data_arr
//      }]
        series: [{
            name: tagName,
            data: data_arr
        }]
	})
}
function funExportPtInfo(){
	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/ExportPtCheckRecord",
		contentType:"application/text,charset=utf-8",
		data:funPtSearchPara(),
		success:function(msg){	
			loadingStop();
			console.log("导出点检返回值="+JSON.stringify(msg));
			
			window.location.href="/file"+msg.responseCommand;
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){

			windowStart("导出点检统计信息失败",false);
		}
	})
}

function printReport(){
	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	var htmlTitle = "<html><head><title>点检记录统计</title></head><body>"
    var htmlhead = $("#ptcontent").html();
    var htmlFoot = '</body></html>'
	newWindow.document.write(htmlTitle + htmlhead + htmlFoot);
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
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
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"startTime",$("#startTime2").val()+" 00:00:00");
		jsonData = setJson(jsonData,"endTime",$("#endTime2").val()+" 23:59:59");
		jsonData = setJson(jsonData,"keyWord",$("#searchTip2").val());
		jsonData = setJson(jsonData,"index",data_page_index2);
		jsonData = setJson(jsonData,"number",data_number2);
		console.log("查询维保传值="+jsonData);
		return jsonData;
}
function funWbSearch(){
	$("#weibaoDataContent").html("");
	loadingStart("weibaoDataContent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/SearchRepairRecord",
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
			windowStart("查询维保信息失败",false);
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
	$("#pageTotalInfo2").html("第 "+curren_page2+"页/共 "+totalPage+" 页");
	var realData =  msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center td-width-2'>标签ID</th>";
	str += "<th class='text-center td-width-2'>标签名称</th>";
	str += "<th class='text-center td-width-2'>标签类型</th>";
	str += "<th class='text-center td-width-2'>标签型号</th>";
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
			str += "<td class='text-center td-width-2'>"+realData[i]["tagId"]+"</td>";
			str += "<td class='text-center td-width-2'>"+realData[i]["tagName"]+"</td>";
			str += "<td class='text-center td-width-2'>"+realData[i]["tagType"]+"</td>";
			str += "<td class='text-center td-width-2'>"+realData[i]["tagModel"]+"</td>";
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
			str += "<td class='text-center td-width-2'>"+realData[i]["tagId"]+"</td>";
			str += "<td class='text-center td-width-2'>"+realData[i]["tagName"]+"</td>";
			str += "<td class='text-center td-width-2'>"+realData[i]["tagType"]+"</td>";
			str += "<td class='text-center td-width-2'>"+realData[i]["tagModel"]+"</td>";
			str += "<td class='text-center td-width-2'>"+checkData[j]["checkUser"]+"</td>";
			str += "<td class='text-center td-width-2'>"+checkData[j]["checkTime"]+"</td>";
			str += "<td class='text-center td-width-2 ' style='width:16%'>"+checkData[j]["note"]+"</td>";
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
		url:"/AssetWebServlet/ExportRepairRecord",
		contentType:"application/text,charset=utf-8",
		data:funWbSearchPara(),
		success:function(msg){		
			loadingStop();
			console.log("导出维保返回值="+JSON.stringify(msg));	
			
			
			window.location.href="/file"+msg.responseCommand;
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//			alert("导出点检统计信息失败");
			windowStart("导出维保记录统计信息失败",false);
		}
	})
}

$(document).ready(function(){
//	windowStart("查询点检信息失败",false); 
	window.onresize = function(){
		$(".data-content-style").width($(".body-div-style").width() - 166);
					console.log($(".data-content-style").width());
	}
	$("#btnLogOut").click(function(){
		userLogout()
	})
	realClick()
	navClickFunction();
	$("#startTime").datepicker("setValue");
	$("#endTime").datepicker("setValue");
	$("#startTime2").datepicker("setValue");
	$("#endTime2").datepicker("setValue");
	$(".li-table-change").mouseover(function(){
		
		var theLeft = parseInt($(this).attr("thenum")) * 120+"px";
	
		$(".border-style").animate({"left":theLeft},100);
	})
	$(".li-table-change").click(function(){
		theNum = parseInt($(this).attr("thenum"));
		var theLeft = theNum * 120+"px";
		$(".border-style").css({"left":theLeft});
//		$(".content-for-animate").animate({"left":"-100%"},100);
		if(theNum == 0)
		{
			$(".content-1").eq(1).animate({"opacity":"0","filter":"alpha(opacity=0)","zIndex":"4"},100);
			$(".content-1").eq(0).animate({"opacity":"1","filter":"alpha(opacity=100)","zIndex":"5"},100);
		}
		else
		{
			$(".content-1").eq(0).animate({"opacity":"0","filter":"alpha(opacity=0)","zIndex":"4"},100);
			$(".content-1").eq(1).animate({"opacity":"1","filter":"alpha(opacity=100)","zIndex":"5"},100);
		}
	})
	$(".li-table-change").mouseout(function(){
		var theLeft = theNum * 120+"px";
		$(".border-style").animate({"left":theLeft},100);
	})
//
	//查询点检
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
		funPtSearch();
	})
	$("#btnExportDianJian").click(function(){
		funExportPtInfo();
	})
	//点检打印
	$("#btnPrintDianJian").click(function(){
		printReport();
	})
	
	//维保打印
	$("#btnPrintWeiBao").click(function(){
		printWeiBaoReport();
	})
	$("#btnSearchWeiBao").click(function(){
		var startTime = $("#startTime2").val().split("-");
		var endTime = $("#endTime2").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(parseInt(startDate) > parseInt(endDate))
		{
			windowStart("时间范围有误",false);
			return;
		}
		data_page_index2 = 0;
		curren_page2 = 1;
		total_page2 = 0;
		
		funWbSearch();
	})
	$("#btnExportWeiBao").click(function(){
		funExportWbInfo();
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
		funPtSearch();
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
		funPtSearch();
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
		funPtSearch();
	})
	//点检分页操作
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
