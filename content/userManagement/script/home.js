
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




function funGetSysInfoPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		console.log("查询公司和角色传值="+jsonData);
		return jsonData;
}
function funGetSysInfo(){
	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/SearchPtCheckRecord",
		contentType:"application/text,charset=utf-8",
		data:funGetSysInfoPara(),
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


$(document).ready(function(){

	$("#btnAddFacData").click(function(){
		$("#addDataModal").modal("show");
	})
	$(".tab-click-class").click(function(){
		$(".tab-click-class").each(function(){
			$(this).removeClass("active");
			$(".eq-content").addClass("hide");
		})
		var theNum = parseInt($(this).attr("theNum"));
		$(this).addClass("active");
		$(".eq-content").eq(theNum).removeClass("hide");
	})
	$(".btn-change-click").bind("click",function(){
		if(parseInt($(this).find(".btnCircleChange").attr("changeStatus")) == 0 )
		{
			$(this).find(".btnCircleChange").attr("changeStatus","1");
			$(this).find(".circle-btn").animate({left:"30px"},100);
			$(this).find(".circle-inside").css("background","#63B218");
			$(this).find(".circle-inside").animate({width:"100%"},100);
		}
		else
		{
			$(this).find(".btnCircleChange").attr("changeStatus","0");
			$(this).find(".circle-btn").animate({left:"1px"},100);
			$(this).find(".circle-inside").css("background","#CCCCCC");
			$(this).find(".circle-inside").animate({width:"20px"},100);
		}
		
	})
})
