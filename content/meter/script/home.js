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
function funPtSearchPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"startTime",$("#startTime").val()+" 00:00:00");
		jsonData = setJson(jsonData,"endTime",$("#endTime").val()+" 23:59:59");''
		jsonData = setJson(jsonData,"deviceId",$("#keyWord").val());
//		jsonData = setJson(jsonData,"items","",true);
//		jsonData = setJson(jsonData,"temitems","",true);
//		jsonData = setJson(jsonData,"totalNumber",0);
		jsonData = setJson(jsonData,"index",data_page_index);
		jsonData = setJson(jsonData,"number",data_number);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("查询电表机房数据传值="+jsonData);
		return jsonData;
}
function funPtSearch(){
	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=PtCheckSearchByTempPomCmd",
		contentType:"application/text,charset=utf-8",
		data:funPtSearchPara(),
		success:function(msg){		
			loadingStop();
//			windowRemove();
			console.log("查询电表机房数据返回值="+JSON.stringify(msg));	
			$("#ptcontent").html("");
			$("#pageNumId").val("");
			createPtTableInfos(msg);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询电表信息权限",false);
            }else{
            	windowStart("查询电表数据失败",false);
            }
//			windowStart("查询点检信息失败",false);
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
		 str += "提示:<br/>当前条件下无电表数据信息";
		 str += "</div>";
		 $("#ptcontent").html(str);
		
		return;
	}
//	var total = msg.totalNumber;
//	var totalPage = Math.ceil(parseInt(total)/data_number);
//	total_page = totalPage;
//	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	
	var realData =  msg.items;
	var titleData = msg.temitems;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	
	for(var i = 0 ; i < titleData.length; i++ )
	{
		str += "<th class='text-center'>"+titleData[i]["nameCn"]+"</th>";
	}
	
	
	str += "</thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
		if(realData[i]["items"]!= undefined && realData[i]["items"].length != 0)
		{
			var tdData = realData[i]["items"];
			str+= "<tr>";
			for(var j = 0 ; j < tdData.length; j++ )
			{
				if(parseInt(tdData[j]["defaultValue"]) == -1)
				{
					str += "<td class='text-center'>未检测</td>";
				}
				else
				{
					str += "<td class='text-center'>"+tdData[j]["defaultValue"]+"</td>";
				}
				
			}
			str += "</tr>";
		}
		
		
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	
}




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
		curren_page = 1;
		total_page = 0;
		funPtSearch();
	})
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
})
