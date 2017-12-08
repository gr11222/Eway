
var edit_id = -1;
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




function funAddDataPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"id",-1);
		jsonData = setJson(jsonData,"classifyNameCn",$("#dataNameModal").val());
		jsonData = setJson(jsonData,"typeCode",$("#typeCodeModal").val());
		jsonData = setJson(jsonData,"dateTime","");
		jsonData = setJson(jsonData,"propertyId",-1);
		jsonData = setJson(jsonData,"creator",localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"note",$("#noteModal").val());
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("添加资产类型传值="+jsonData);
		return jsonData;
}
function funAddData(){
//	$("#ptcontent").html("");
//	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceClassifyAddCmd",
		contentType:"application/text,charset=utf-8",
		data:funAddDataPara(),
		success:function(msg){		
//			loadingStop();
//			windowRemove();
			console.log("添加资产类型返回值="+JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK")!= -1)
			{
				$("#addDataModal").modal("hide");
				windowStart("添加资产类型成功",true);
				assetDataInIt();
				searchAssetType();
			}
			else
			{
				windowStart("添加资产类型失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
//               alert("当前用户无添加资产类型权限");
                 windowStart("当前用户无添加资产类型权限",false);
            }else{
            	windowStart("添加资产类型失败",false);
            }
			
		}
	})
}
function searchAssetTypePara(){
	var startTime = "",endTime = "";
	if($("#startTime").val().length > 0 ){
		startTime = $("#startTime").val()+" 00:00:00";
	}
	if($("#endTime").val().length > 0 ){
		endTime = $("#endTime").val()+" 23:59:59";
	}
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"keyWord",$("#typeName").val());
		jsonData = setJson(jsonData,"startTime",startTime);
		jsonData = setJson(jsonData,"endTime",endTime);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"items","",true);
		console.log("查询资产类型传值="+jsonData);
		return jsonData;
}
function searchAssetType(){
	var timeReg =  /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
//	{
//		windowStart("时间范围有误,请填写时间范围",false);
//	    return;
//	}
   if($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
		windowStart("请输入结束时间", false);
		return;
	}
	if($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
		windowStart("请输入开始时间", false);
		return;
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
//	if($("#startTime").val().length == 0 )
//	{
//		if($("#endTime").val().length> 0 )
//			windowStart("时间范围有误,请重新选取时间范围",false);
//			 return;
//		}
//	}
//	if($("#endTime").val().length == 0 )
//	{
//		if($("#startTime").val().length> 0 )
//		{
//			windowStart("时间范围有误,请重新选取时间范围",false);
//			 return;
//		}
//	}
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
	loadingStart("dataContent");

	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceClassifySearchCmd",
		contentType:"application/text,charset=utf-8",
		data:searchAssetTypePara(),
		success:function(msg){		
			loadingStop();
			console.log("查询资产类型返回值="+JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK")!= -1)
			{
				$("#keyWord").val("");
				 createAssetTypeInfos(msg);			
//				windowStart("资产类型查询完毕",true);
			}
			else
			{
			
				windowStart("资产类型查询失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
            	windowStart("当前用户无查询资产类型权限",false);
//               alert("");
            }else{
            	
            	windowStart("资产类型查询失败",false);
            }
			
		}
	})
}
function createAssetTypeInfos(msg)
{
	if(!msg.items || msg.items.length < 1)
	{
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:100%;top:30%;margin:0px auto;font-size:25px;font-weight: bold;text-align:center">';
		str += "提示:<br/>当前条件下无资产信息！";
		str += "</div>";
		$("#dataContent").html(str);
		return;
	}
	
	var theData = msg.items;
	var  str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' >序号</th>";
	str += "<th class='text-center'>类型名称</th>";
	str += "<th class='text-center'>类型说明</th>";
	str += "<th class='text-center'>信息管理</th>";
	str += "</thead><tbody>";
	for( var i = 0 ; i < theData.length; i++ )
	{
		str += "<tr>";
		str += "<td class='text-center' style='width:8%;word-wrap: break-word;word-break: break-all;'>"+(i+1)+"</td>";
		str += "<td class='text-center' style='width:30%;word-wrap: break-word;word-break: break-all;'>"+theData[i]["classifyNameCn"]+"</td>";
		str += "<td class='text-center' style='width:54%;word-wrap: break-word;word-break: break-all;'>"+theData[i]["note"]+"</td>";
		str += "<td class='text-center' style='width:8%;word-wrap: break-word;word-break: break-all;'>";
		str += "<span><a href='javascript:void(0)' class='edit-infos'  theId='"+theData[i]["id"]+"' theData='"+JSON.stringify(theData[i])+"'><img src='../img/edit.png'></a></span>";
		str += "<span style='padding-left:5px'><a theId='"+theData[i]["id"]+"' class='delete-infos' href='javascript:void(0)'>";
		str += "<img src='../img/dele.png'>";
		str += "</a></span></td>";
		str += "</td></tr>";
	}
	str += "</tbody><table>";

	$("#dataContent").html(str);
	
	$(".delete-infos").click(function(){
		if(!confirm("是否确认删除")){
			return;
		}
		funDeleteData(parseInt($(this).attr("theId")));
	})
	$(".edit-infos").click(function(){
		edit_id = parseInt($(this).attr("theId"));
		var theData =  eval("("+$(this).attr("theData")+")");
		$("#editdataNameModal").val(theData.classifyNameCn);
		$("#editnoteModal").val(theData.note);
		$("#edittypeCodeModal").val(theData.typeCode);
		$("#editDataModal").modal("show");
		
	})
}
//删除
function funDeleteDataPara(theId){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"id",theId);
		jsonData = setJson(jsonData,"classifyNameCn","");
		jsonData = setJson(jsonData,"typeCode","");
		jsonData = setJson(jsonData,"dateTime","");
		jsonData = setJson(jsonData,"note","");
		jsonData = setJson(jsonData,"propertyId",-1);
		jsonData = setJson(jsonData,"creator",localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("删除资产类型传值="+jsonData);
		return jsonData;
}
function funDeleteData(theId){

//	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceClassifyDeleteCmd",
		contentType:"application/text,charset=utf-8",
		data:funDeleteDataPara(theId),
		success:function(msg){		
//			loadingStop();
//			windowRemove();
			console.log("删除资产类型返回值="+JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK")!= -1)
			{
			
				windowStart("删除资产类型成功",true);
	
				searchAssetType();
			}
			else if(msg.responseCommand.toUpperCase().indexOf("OCCUPY")!= -1)
			{
				windowStart("当前资产正在使用，无法删除！",false);
			}else{
				windowStart("删除资产类型失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
//               alert("当前用户无删除资产类型权限");
             	windowStart("当前用户无删除资产类型权限",false);
            }else{
            	windowStart("删除资产类型失败",false);
            }
//			windowStart("删除资产类型失败",false);
		}
	})
}
function assetDataInIt(){
	$("#dataNameModal").val("");
	$("#typeCodeModal").val("");
	$("#noteModal").val("");
}




//修改


function funEditDataPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"id",edit_id);
		jsonData = setJson(jsonData,"classifyNameCn",$("#editdataNameModal").val());
		jsonData = setJson(jsonData,"typeCode",$("#edittypeCodeModal").val());
		jsonData = setJson(jsonData,"dateTime","");
		jsonData = setJson(jsonData,"propertyId",-1);
		jsonData = setJson(jsonData,"creator",localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"note",$("#editnoteModal").val());
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("添加资产类型传值="+jsonData);
		return jsonData;
}
function funEditData(){
//	$("#ptcontent").html("");
//	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceClassifyUpdateCmd",
		contentType:"application/text,charset=utf-8",
		data:funEditDataPara(),
		success:function(msg){		
//			loadingStop();
//			windowRemove();
			console.log("添加资产类型返回值="+JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK")!= -1)
			{
				$("#editDataModal").modal("hide");
				windowStart("修改资产类型成功",true);
				$("#editnoteModal").val("");
				searchAssetType();
			}
			else
			{
				windowStart("修改资产类型失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
//               alert("当前用户无添加资产类型权限");
                 windowStart("当前用户无修改资产类型权限",false);
            }else{
            	windowStart("修改资产类型失败",false);
            }
			
		}
	})
}
$(document).ready(function(){
	$(".the-datepicker").datepicker("setValue");
	$(".the-datepicker").val("");
	searchAssetType();
	$("#btnAddInfos").click(function(){
		$("#dataNameModal").val("");
		$("#typeCodeModal").val("");
		$("#noteModal").val("");
		$("#addDataModal").modal("show");
	})
	
	$("#btnSearData").click(function(){
		
		searchAssetType();
	})
	
	$("#btnAddRealBtn").click(function(){
		if(!$("#dataNameModal").val())
		{
			windowStart("请输入类型名称",false);
			return;
		}
		var numReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5])+$/;		
		if(!numReg.test($("#dataNameModal").val())){
			windowStart("类型名称只能输入中英文、数字",false);
			return;
		}
		var firstReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
		if(!firstReg.test($("#dataNameModal").val())){
			windowStart("类型名称必须以中文或英文开头",false);
			return;
		}		
	//	var enReg = /^[a-zA-Z0-9\-]+$/;
		var enReg = /^[a-zA-Z][a-zA-Z0-9-]*$/;
		if(!$("#typeCodeModal").val())
		{
//			alert("请输入名称");
			windowStart("请输入类型编号",false);
			return;
		}
		if(!enReg.test($("#typeCodeModal").val())){
			windowStart("类型编号只能输入英文、数字、中横线",false);
			return;
		}
		var codeFirstReg = /^[a-zA-Z]{1}/;
		if(!codeFirstReg.test($("#typeCodeModal").val())){
			windowStart("类型编号必须以英文开头",false);
			return;
		}
//	    if(!$("#noteModal").val())
//		{
////			alert("请输入名称");
//			windowStart("请输入类型说明",false);
//			return;
//		}
		funAddData();
	})
	$("#btnEditRealBtn").click(function(){
		if(!$("#editdataNameModal").val())
		{
//			alert("请输入名称");
			windowStart("请输入类型名称",false);
			return;
		}
		var numReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5])+$/;
		if(!numReg.test($("#editdataNameModal").val())){
			windowStart("类型名称只能输入中英文、数字",false);
			return;
		}
		var enReg = /^[a-zA-Z0-9_]+$/;
		if(!$("#edittypeCodeModal").val())
		{
//			alert("请输入名称");
			windowStart("请输入类型编号",false);
			return;
		}
		if(!enReg.test($("#edittypeCodeModal").val())){
			windowStart("类型编号只能输入英文、数字、下划线",false);
			return;
		}
//		if(!$("#editnoteModal").val())
//		{
////			alert("请输入名称");
//			windowStart("请输入类型说明",false);
//			return;
//		}
		
		funEditData();
	})
	
	searchAssetType();
})
