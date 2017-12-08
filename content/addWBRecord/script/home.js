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



//维保查询
function funWbSearchPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"startTime","");
		jsonData = setJson(jsonData,"endTime","");
		jsonData = setJson(jsonData,"keyWord","");
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
	$("#pageTotalInfo2").html("第 "+curren_page2+"页/共 "+totalPage+" 页");
	var realData =  msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center td-width-2'>标签ID</th>";
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
//			str += "<td class='text-center td-width-2'>"+realData[i]["tagModel"]+"</td>";
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

//新增
function funAddRecordPara(){
	
	
	
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"repairInfos",$("#wbResult").val());
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"deviceId",$("#assetId").val());

		console.log("新增记录传值="+jsonData);
		return jsonData;
}
function funAddRecord(){
	if(!$("#assetId").val()){
	
		windowStart("请输入资产ID",false);
		return;
	}
	
	if(!$("#wbResult").val()){
		
		windowStart("请输入点检记录",false);
		return;
	}
	
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=PtRepairRecordAddCmd",
		contentType:"application/text,charset=utf-8",
		data:funAddRecordPara(),
		success:function(msg){
			console.log("新增记录返回值="+JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1){
				$("#addModal").modal("hide");
				$("#assetId").val("");
				$("#wbResult").val("");
				
				windowStart("新增记录成功",true);
				data_page_index2 = 0;
				curren_page2 = 1;
				total_page2 = 0;
				funWbSearch();
			}else{
	
				 windowStart("新增记录失败",false);
				
			}

		},
		error:function(XMLHttpRequest, textStatus, errorThrown){

			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                windowStart("当前用户无权执行新增记录操作",false);
            }else{
            	windowStart("新增记录失败",false);
            }
		}
	})
}
//批量导入
function uploadFile(){
	$.ajaxFileUpload({
        url:'/DevOpsNoSpring/servlet/DevOpsService?cmd=PtMaintainExcelUploadCmd',  //需要链接到服务器地址
        secureuri:false,
        fileElementId:'filePath',          //文件选择框的id属性
        dataType: 'text',                  //服务器返回的格式，可以是json
        success: function (data, status)
        {
        
        	var dataStr = data;
        	dataStr = dataStr.substr(dataStr.indexOf(">"),dataStr.length);
        	dataStr = dataStr.substr(1,dataStr.length-7);
        	
        	if(dataStr == "OK"){
        		$("#fileModal").modal("hide");
        		$("#filePath").val("");
        		 windowStart("文件导入成功",true);
        		data_page_index2 = 0;
				curren_page2 = 1;
				total_page2 = 0;
				funWbSearch();
        	}else{
        		 windowStart("文件导入失败",false);
        	}

        },
        error: function (data, status, e)
        {
        	var xmlRequest = XMLHttpRequest.status;
        	if(xmlRequest=="401"){
        		windowStart("用户无权限执行批量导入操作",false);
        	}else{
        		windowStart("文件导入失败",false);
        	}
        	 
        }
    });
}

$(document).ready(function(){
	funWbSearch();
	//新增弹窗
	$("#btnAddRecord").click(function(){
		$("#assetId").val("");
		$("#wbResult").val("");
		$("#addModal").modal("show");
	})
	//新增
	$("#btnRealAdd").click(function(){
		funAddRecord();
	})
	
	$("#btnImportRecord").click(function(){
		$("#fileModal").modal("show");
	})
	$("#btnUploadFile").click(function(){
		if(!$("#filePath").val())
		{
			 windowStart("请选择文件",false);
			return;
		}
		 uploadFile();
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
	//维保打印
	
	//维保分页操作
	//上一页
	$("#btnPageBefore2").click(function(){
		if(total_page2 == 0)
		{
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
		if(total_page2 == 0)
		{
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
		if(total_page2 == 0)
		{
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
