var theNum = 0;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var data_page_index2 = 0;
var data_number2 = 17;
var curren_page2 = 1;
var total_page2 = 0;
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
//查询信息
function funGetRepairInfoPara(){

	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"company",$("#company").val());
		jsonData = setJson(jsonData,"project",$("#projectName").val());
		jsonData = setJson(jsonData,"deviceName",$("#deviceNameInfo").val());
		jsonData = setJson(jsonData,"lableCode",$("#labelNumber").val());
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
//		jsonData = setJson(jsonData,"index",data_page_index);
//		jsonData = setJson(jsonData,"number",data_number);
		console.log("查询异常信息传值="+jsonData);
		return jsonData;
}
function funGetRepairInfo(){
	
	$("#ptcontent").html("");
	repair_length = 0;
	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAlarmReportSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:funGetRepairInfoPara(),
		success:function(msg){		
			loadingStop();
//			windowRemove();
			console.log("查询异常信息返回值="+JSON.stringify(msg));	
			$("#ptcontent").html("");
			$("#pageNumId").val("");

			createRepairTableInfos(msg);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询异常信息权限",false);
            }else{
            	windowStart("查询异常信息失败",false);
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
		 str += "提示:<br/>当前条件下无设备异常信息";
		 str += "</div>";
		 $("#ptcontent").html(str);
		
		return;
	}
//	var total = msg.totalNumber;
//	var totalPage = Math.ceil(parseInt(total)/data_number);
//	total_page = totalPage;
//	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
//	
	var realData =  msg.items;
	
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>设备名称</div></th>";
	str += "<th class='text-center'><div class='checkbox'>标签编号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>产生报警总数</div></th>";
	str += "<th class='text-center'><div class='checkbox'>最后一次报警时间</div></th>";
	str += "</thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
		str+= "<tr >";
		str += "<td class='text-center' style='width:5%'>"+(i+1)+"</td>";
		str += "<td class='text-center'  style='width:25%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["deviceName"]+"</td>";
		str += "<td class='text-center'  style='width:20%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["lableCode"]+"</td>";
		str += "<td class='text-center'  style='width:15%;word-wrap: break-word;word-break: break-all;'><a href='javascript:void(0)' class='jump-top-alarm'>"+realData[i]["count"]+"</a></td>";
		str += "<td class='text-center'  style='width:35%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["alarmTime"]+"</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	//../../alarmInfo/html/home.html
//	$(".jump-top-alarm").click(function(){
//		
//		window.parent.document.getElementsByName("iframeContent")[0].location.href="../../alarmInfo/html/home.html";
//		
//	})
}


//导出信息
function funExportInfo(){
	
	
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAlarmReportExportCmd",
		contentType:"application/text,charset=utf-8",
		data:funGetRepairInfoPara(),
		success:function(msg){		
			console.log("导出异常信息返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("FAIl") != -1)
			{
				windowStart("导出异常信息失败",false);
			}
			else if( msg.responseCommand.toUpperCase().indexOf("NODATA") != -1)
			{
				windowStart("当前条件下无异常信息",false);
			}
			else
			{
				window.location.href = "../../../../"+msg.responseCommand;
			}
//			window.location.href = "../../../../"+msg.responseCommand;
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无导出异常信息权限",false);
            }else{
            	windowStart("导出异常信息失败",false);
            }
//			windowStart("查询点检信息失败",false);
		}
	})
}



//打印信息
function printDeviceInfo(){
	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	var htmlTitle = "<html><head><meta charset='utf-8'><title>批量打印二维码</title></head><body>";
	var htmlhead = "";
	var str = "";
    htmlhead += "<div>";
    htmlhead += $("#ptcontent").html();
    htmlhead += "</div>";
    var htmlFoot = '</body></html>'
    str = htmlTitle + htmlhead + htmlFoot;
    
	newWindow.document.write(str);

    newWindow.print();
    newWindow.close();
}

$(document).ready(function(){
	$("#btnSearchRepair").click(function(){
		
//		data_page_index = 0;
//		curren_page = 1;
//		total_page = 0;
		funGetRepairInfo();
	})
	
	
	//点检分页操作
	//上一页
	$("#btnPageBefore").click(function(){
//		if(total_page == 0)
//		{
//			return;
//		}
//		
//		if(curren_page == 1)
//		{
//			windowStart("当前为首页",false);
//			return;
//		}
//		data_page_index -= data_number;
//		curren_page -= 1;
		funGetRepairInfo();
	})
	//下一页
	$("#btnPageNext").click(function(){
//		if(total_page == 0)
//		{
//			return;
//		}
//		
//		if(total_page == curren_page)
//		{
//			windowStart("当前为尾页",false);
//			return;
//		}
//		data_page_index += data_number;
//		curren_page += 1;
		funGetRepairInfo();
	})
	//跳转页
	$("#btnPageJump").click(function(){
//		if(total_page == 0)
//		{
//			return;
//		}
//		
//		var numReg = /^[0-9]+$/;
//		if(!numReg.test($("#pageNumId").val()))
//		{
//			windowStart("页码输入有误",false);
//			return;
//		}
//		if(parseInt($("#pageNumId").val()) < 1 )
//		{
//			windowStart("页码输入有误",false);
//			return;
//		}
//		if(parseInt($("#pageNumId").val()) > total_page)
//		{
//			windowStart("页码输入有误",false);
//			return;
//		}
//		data_page_index = (parseInt($("#pageNumId").val()) - 1)*data_number;
//		curren_page = parseInt($("#pageNumId").val());
		funGetRepairInfo();
	})
	//点检分页操作
	
	
	//导出
	$("#btnExportInfos").click(function(){
		funExportInfo();
	})
	//打印
	$("#btnPrintInfos").click(function(){
		printDeviceInfo();
	})
	funGetRepairInfo();
})
