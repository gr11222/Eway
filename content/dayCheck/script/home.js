
$(document).ready(function(){
	$(".input-style").datepicker("setValue");
	$(".input-style").val("");
	funGetDayCheckInfo();
	$("#searchbtn").click(function(){	
		funGetDayCheckInfo();	
	})
	$("#btnPrint3").click(function(){
		printDayCheckReport();
	})
	$("#btnExportDayCheck").click(function(){
		funExportDCInfo();
	})
})

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
function funDcSearchPara(){	
	var startTime = "",endTime = "";
	if($("#startTime4").val().length > 0  ){
		startTime = $("#startTime4").val()+" 00:00:00";
	}
	if($("#endTime4").val().length > 0  ){
		endTime = $("#endTime4").val()+" 23:59:59";
	}
	var jsonData=setJson(null,"requestCommand","");
	    jsonData=setJson(jsonData,"responseCommand","");
	    jsonData = setJson(jsonData,"tableName",$("#selectoptions").val());
	    jsonData = setJson(jsonData,"viewName",$("#selectoptions option:selected").text());
	    jsonData = setJson(jsonData,"arrayList","",true);	    
	    var queryCond = setJson(null,"startTime",startTime);
	    queryCond = setJson(queryCond,"endTime",endTime);
	    queryCond = setJson(queryCond,"interval",1);	  
	    jsonData = setJson(jsonData,"queryCond",eval("("+queryCond+")"));
	    console.log("查询日巡传值="+jsonData);
		return jsonData;		
}



function funDcSearch(){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DataStatisSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:funDcSearchPara(),
		success:function(msg){
			loadingStop();
			$("#dataContent").html("");
			console.log(JSON.stringify(msg));
			createDayCheckTableInfos(msg);
			
		},
		error:function(){
			loadingStop();
			console.log("fail");
		}
	});
}

function createDayCheckTableInfos(msg){
    if(!msg.dataInfo || msg.dataInfo.length < 1)
	{
		$("#dataContent").html("");
		var str = "";
		 str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		 str += "提示:<br/>当前条件下无日巡表信息";
		 str += "</div>";
		 $("#dataContent").html(str);
		
		return;
	}
	var tital = msg.tableInfo.colName;
	var str=" ";
	str += "<table class='table table-bordered table-for-search'><thead>";
	str += "<tr>";
	str += "<th style='' class='text-center'>日期</th>";
	for(var i=0;i<tital.length;i++){
		var tital_arr = tital[i].split("-");
		str += "<th style='' class='text-center'>"+tital_arr[1]+"</th>";
	}
	str += "</tr>";
	str += "</thead><tbody>";
	var theData =  msg.dataInfo;
	for(var i=0;i<theData.length;i++){
		str += "<tr>";
		var rowDataInfo_arr =theData[i]["item"];
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;'>"+theData[i]["row"]+"</td>";
		for( var j = 0 ; j < rowDataInfo_arr.length; j++ )
		{
			str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;'>"+rowDataInfo_arr[j]["data"]+"</td>";
		}
	    str += "</tr>";
	}
	str += "</tbody></table>";
	$("#dataContent").html(str);
}
//日期校验
function funGetDayCheckInfo(){
	var timeReg =  /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
//	if($("#startTime4").val().length == 0 || $("#endTime4").val().length == 0 )
//	{
//		windowStart("时间范围有误,请填写时间范围",false);
//	    return;
//	}
	if($("#startTime4").val().length > 0 )
	{
		if(!timeReg.test($("#startTime4").val()))
		{
			 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
			 return;
		}
	}
	if($("#endTime4").val().length > 0 )
	{
		if(!timeReg.test($("#endTime4").val()))
		{
			 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
			 return;
		}
	}
	if($("#startTime4").val().length > 0 &&$("#endTime4").val().length > 0 )
	{
		var startTime = $("#startTime4").val().split("-");
		var endTime = $("#endTime4").val().split("-");
		var startDate = new Date(parseInt(startTime[0]),parseInt(startTime[1]),parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]),parseInt(endTime[1]),parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime()))
		{
			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间",false);
		    return;
		}
		
	}
	$("#dataContent").html("");
        loadingStart("dataContent");
		funDcSearch();
}
//导出
function funExportDCInfo(){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DataStatisExportCmd",
		contentType:"application/text,charset=utf-8",
		data:funDcSearchPara(),
		success:function(msg){		
			console.log("导出日巡表返回值="+JSON.stringify(msg));			
			if(msg.resp.responseCommand.toUpperCase().indexOf("FAIl") != -1)
			{
				windowStart("导出日巡表信息失败",false);
			}
			else if( msg.resp.responseCommand.toUpperCase().indexOf("NODATA") != -1)
			{
				windowStart("当前条件下无日巡表信息",false);
			}
			else
			{
				window.location.href = "../../../../"+msg.resp.responseCommand;
			}

		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//			loadingStop();
//			alert("导出点检统计信息失败");
//			windowStart("导出维保记录统计信息失败",false);
//			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
               windowStart("当前用户无导出日巡表记录权限",false);
            }else{
          	   windowStart("导出日巡表记录统计信息失败",false);
            }
		}
	})
}
//打印
function printDayCheckReport(){
	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	var htmlTitle = "<html><head><title>日巡表统计</title></head><body>";
    var htmlhead = $("#dataContent").html();
    var htmlFoot = '</body></html>'
	newWindow.document.write(htmlTitle + htmlhead + htmlFoot);
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
}