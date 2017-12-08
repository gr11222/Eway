
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


$(document).ready(function(){
	_init_area();
	
	$("#btnAddFacData").click(function(){
		$("#addDataModal").modal("show");
	})
	$("#btnAddCompany").click(function(){
		if(!$("#companyTypeModal").val()){
			alert("请选择企业类型");
			return;
		}
		$("#addDataModal").modal("hide");
		if(parseInt($("#companyTypeModal").val()) == 0)
		{
			$("#addDataModal2").modal("show");
			$("#factoryShengModal").val("省份");
			$("#factoryCityModal").val("市");
			$("#factoryAreaModal").val("区、县");
		}
		else if(parseInt($("#companyTypeModal").val()) == 1)
		{
			$("#addDataModal3").modal("show");
		}
		else
		{
			$("#addDataModal4").modal("show");
		}
		
	})
})
