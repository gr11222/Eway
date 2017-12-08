
var assetDataLength = 0;
var selectDataLength = 0;

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



//资产维护-- 查询资产类型  所属工厂  服务商
function searchSysInfosPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("询资产类型  所属工厂  服务商传值="+jsonData);
		return jsonData;
}
function searchSysInfos(){
	$("#facSelect").html("");
	$("#assetType").html("");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:searchSysInfosPara(),
		success:function(msg){		
//			loadingStop();
			console.log("查询资产类型  所属工厂  服务商返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("OK")!= -1){
				createSysInfoSelect(msg);
				funLabelSearch();
			}else{
				windowStart("查询资产类型 、所属工厂 、服务商失败",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//			loadingStop();
			
//			windowStart("查询资产类型 、所属工厂 、服务商失败",false);
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询资产类型 、所属工厂 、服务商权限",false);
            }else{
            	windowStart("查询资产类型 、所属工厂 、服务商失败",false);
            }
		}
	})
}
function createSysInfoSelect(msg){
	if(msg.factoryItems != undefined && msg.factoryItems.length > 0  )
	{
//		var theData = msg.factoryItems;
//		var str = "<option value=''>请选择</option>";
//		for(var i = 0 ; i < theData.length ; i++ )
//		{
//			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
//		}
//		$("#buildingowner").html(str);
//		$("#editfactoryAreaModal").html(str);
//		
	}
//	if(msg.CompanyItems != undefined && msg.CompanyItems.length > 0  )
//	{
//		var theData = msg.CompanyItems;
//		var str = "<option value=''>请选择</option>";
//		for(var i = 0 ; i < theData.length ; i++ )
//		{
//			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
////			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";
//		}
////		$("#companyName").html(str);
//		$("#editfuwushangModal").html(str);
//		
//	}
	if(msg.DeviceItems != undefined && msg.DeviceItems.length > 0  )
	{
		var theData = msg.DeviceItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0 ; i < theData.length ; i++ )
		{
			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";
		
		}
		$("#assetType").html(str);
//		$("#editassetTypeModal").html(str);
	}
//	if(msg.projectItems != undefined && msg.projectItems.length > 0  )
//	{
//		var theData = msg.projectItems;
//		var str = "<option value=''>请选择</option>";
//		for(var i = 0 ; i < theData.length ; i++ )
//		{
//			str += "<option value='"+theData[i]["projectId"]+"'>"+theData[i]["nameCn"]+"</option>";
////			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";
//		
//		}
//		$("#projectName").html(str);
//
//	}
	//建筑
	if(msg.buildingItems != undefined && msg.buildingItems.length > 0  )
	{
		var theData = msg.buildingItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0 ; i < theData.length ; i++ )
		{
			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";

		}
		$("#facSelect").html(str);
//		$("#editfactoryAreaModal").html(str);
	}
}
function funLabelSearchCheck(){
	var timeReg =  /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	
	if($("#endTime").val().length >0 )
	{
		if($("#startTime").val().length == 0 )
		{
			windowStart("请输入开始时间",true);
			return false;
		}
		if(!timeReg.test($("#startTime").val()))
		{
			 windowStart("开始时间格式不正确,正确的日期格式为yyyy-mm-dd",false);
			 return false;
		}
	}
	if($("#startTime").val().length >0 )
	{
		if($("#endTime").val().length == 0 )
		{
			windowStart("请输入结束时间",true);
			return false;
		}
		if(!timeReg.test($("#endTime").val()))
		{
			 windowStart("结束时间格式不正确,正确的日期格式为yyyy-mm-dd",false);
			 return false;
		}
	}

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
	return true;
}
function funLabelSearchPara(){
	var facId = -1;
	var assetId = -1;
	if($("#facSelect").val().length > 0 )
	{
		facId =$("#facSelect").val();
	}
	if($("#assetType").val().length > 0 )
	{
		assetId =$("#assetType").val();
	}
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"startTime",$("#startTime").val());
		jsonData = setJson(jsonData,"endTime",$("#endTime").val());
		jsonData = setJson(jsonData,"keyWord",$("#keyWord").val());
		jsonData = setJson(jsonData,"factoryId",parseInt(facId));
		jsonData = setJson(jsonData,"deviceId",parseInt(assetId));
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("查询标签传值="+jsonData);
		return jsonData;
}
function funLabelSearch(){
	if(!funLabelSearchCheck())
	{
		return;
	}
	assetDataLength = 0;
	selectDataLength = 0;
 	$("#dataContent").html("");
	loadingStart("dataContent");

	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=QRCodeRelationSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:funLabelSearchPara(),
		success:function(msg){		
			loadingStop();
			console.log("查询点检返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1 )
			{
				$("#dataContent").html("");
				createLabelTableInfos(msg);
			}
			else
			{
				windowStart("查询标签信息失败",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
//			createLabelTableInfos();
//			windowStart("查询标签信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询标签信息权限",false);
            }else{
            	windowStart("查询标签信息失败",false);
            }
		}
	})
}
function createLabelTableInfos(msg)
{

	if(!msg.items || msg.items.length < 1)
	{
		 $("#dataContent").html("");
		 var str = "";
		 str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		 str += "提示:<br/>当前条件下无标签信息";
		 str += "</div>";
		 $("#dataContent").html(str);
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
	str += "<tr>";
	str += "<th class='text-center'><input type='checkbox' id='allCheckBox'>  全选</th>";
	str += "<th class='text-center'>标签编号</th>";
	str += "<th class='text-center'>资产名称</th>";
	str += "<th class='text-center'>资产类型</th>";
	str += "<th class='text-center'>服务商</th>";
	str += "<th class='text-center'>关联物业</th>";
	str += "<th class='text-center'>管理</th>";
	str += "</tr></thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
		str += "<tr class='the-qrcode-class' theData='"+JSON.stringify(realData[i])+"'>";
		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'><input type='checkbox' class='each-CheckBox' theData='"+JSON.stringify(realData[i])+"' theId='"+realData[i]["id"]+"'> "+(i+1)+"</th>";
		str += "<th class='text-center' style='width: 30%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["deviceCode"]+"</th>";
		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["nameCn"]+"</th>";
		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["deviceTypeNameCn"]+"</th>";
		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["company"]+"</th>";
		var companyData = realData[i]["items"];
		var childStr = "";
		for(var j = 0 ; j < companyData.length; j++ )
		{
			childStr += companyData[j]["propertyNameCn"]+",";
//			str += "<div style='width:auto;height:20px;float:left;padding:2px;'>";
////			str += "<input type='checkbox' propertyId='"+companyData[j]["propertyId"]+"' id='chebox-company-class"+i+"' class='chebox-company-class' / >";
//			str += '<label class="chebox-company-class" propertyId="'+companyData[j]["propertyId"]+'" for="chebox-company-class'+i+'" style="font-size:10px;cursor:pointer;font-weight:normal">'+companyData[j]["propertyNameCn"]+'</label>';
//			str += "</div>";
		}
		childStr =childStr.substring(0,childStr.length-1);
		str += "<th class='text-center' style='width: 25%;word-wrap: break-word;word-break: break-all;'>"+childStr+"</th>";
		str += "<th class='text-center' style='width: 5%;word-wrap: break-word;word-break: break-all;'><a style='cursor:pointer' class='delete-qrcode' theId='"+realData[i]["id"]+"'><img src='../img/dele.png'></a></th>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#dataContent").html(str);
	$(".delete-qrcode").click(function(){
		if(!confirm("是否确认删除?")){
			return;
		}
		deleteQrCode(parseInt($(this).attr("theId")));
	})
	$("#allCheckBox").change(function(){
		if($(this).prop("checked"))
		{
			selectDataLength = assetDataLength;
			$(".each-CheckBox").each(function(){
				$(this).prop("checked",true);
			})
		}
		else
		{
			selectDataLength = 0 ;
			$(".each-CheckBox").each(function(){
				$(this).prop("checked",false);
			})
		}
	})
	$(".each-CheckBox").click(function(e){
		var e = e||event;
		e.stopPropagation();
		if($(this).prop("checked"))
		{
			selectDataLength++;
			if(selectDataLength == assetDataLength)
			{
				$("#allCheckBox").prop("checked",true);
			}
			else
			{
				$("#allCheckBox").prop("checked",false);
			}
		}
		else
		{
			selectDataLength--;
			if(selectDataLength == assetDataLength)
			{
				$("#allCheckBox").prop("checked",true);
			}
			else
			{
				$("#allCheckBox").prop("checked",false);
			}
		}
	})
//	$(".the-qrcode-class").click(function(e){
//		var theData = eval("("+$(this).attr("theData")+")");
//		$("#assetNumModal").val(theData.deviceCode);
//		$("#assetNameModal").val(theData.nameCn);
//		$("#assetFactoryModal").val(theData.factoryNameCn);
//		$("#assetTypeModal").val(theData.deviceTypeNameCn);
//		$("#assetBusinessModal").val(theData.manufactureNameCn);
//		$("#labelInfosModal").modal("show");
//	})
	
}
//删除
function deleteQrCodePara(theId){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"id",theId);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("标签删除传值="+jsonData);
		return jsonData;
}
function deleteQrCode(theId){

	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=QRCodeDeleteRelationCmd",
		contentType:"application/text,charset=utf-8",
		data:deleteQrCodePara(theId),
		success:function(msg){		
		
			console.log("标签删除返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1 )
			{
				
				windowStart("标签删除成功",true);
				funLabelSearch();
			}
			else
			{
				windowStart("标签删除失败",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//			windowStart("标签删除失败",false);
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无删除标签权限",false);
            }else{
            	windowStart("标签删除失败",false);
            }
		}
	})
}

//用户维护---获取物业公司和角色

function funGetSysInfosPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("查询公司传值="+jsonData);
		return jsonData;
}
function funGetSysInfos(){
	
	loadingStart("dataRealContent");

	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleAndPropertySearchCmd",
		contentType:"application/text,charset=utf-8",
		data:funGetSysInfosPara(),
		success:function(msg){		
			loadingStop();
			console.log("查询公司返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1 )
			{
//				$("#dataRealContent").html("<div style='position:relative;width:100%;top:30%;text-align:center;font-size:28px;font-weight:bold'>请按条件查询用户信息</div>");
			
				createSysInfosTable(msg);
			}
			else
			{
				windowStart("查询公司信息失败",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			
//			windowStart("查询公司信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询公司信息权限",false);
            }else{
            	windowStart("查询公司信息失败",false);
            }
		}
	})
}
function createSysInfosTable(msg)
{
	if(msg.PropertyItmes != undefined && msg.PropertyItmes.length > 0 )
	{
		var  realData =  msg.PropertyItmes;
		var str = "";
		for( var i = 0 ; i < realData.length; i++ )
		{
			str += "<div style='width:auto;height:30px;float:left;padding:2px 4px'>";
			str += "<input type='checkbox' theId='"+realData[i]["classifyId"]+"' class='label-wuye-class' id='label-wuye"+i+"'/><label for='label-wuye"+i+"' style='cursor:pointer;font-size:10px'>"+realData[i]["nameCn"]+"</label>";
			str += "</div>";
		}
		
		$("#dataRealContent").html(str);
		if($(".each-CheckBox:checked").length == 1){
				
			
			var theData = eval("("+$(".each-CheckBox:checked").attr("theData")+")").items;
			for(var i  = 0; i < theData.length;i++ )
			{
				
				$(".label-wuye-class").each(function(){
					
					if(parseInt(theData[i]["propertyId"]) == parseInt($(this).attr("theId")))
					{
						$(this).prop("checked",true);
					}
				})
			}
		}
		else{
//			$("#addDataModal").modal("show");
//			funGetSysInfos();
			$(".label-wuye-class").prop("checked",false);
		}
	}

	
}
function funSetWuYePara(){
	var deviceItems = [] ;
	var companyItems = [];
   	 $(".each-CheckBox:checked").each(function(){
		var theObj = {};
		theObj.deviceId = parseInt($(this).attr("theId"));
		deviceItems.push(theObj);
	})
	$(".label-wuye-class:checked").each(function(){
		var theObj = {};
		theObj.propertyId = parseInt($(this).attr("theId"));
		companyItems.push(theObj);
	})
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"propertyItems",companyItems);
		jsonData = setJson(jsonData,"deviceItems",deviceItems);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		console.log("设置物业公司传值="+jsonData);
		return jsonData;
}
function funSetWuYe(){

	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=QRCodeRelationCmd",
		contentType:"application/text,charset=utf-8",
		data:funSetWuYePara(),
		success:function(msg){		
			
			console.log("设置物业返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1 )
			{
//				$("#dataRealContent").html("<div style='position:relative;width:100%;top:30%;text-align:center;font-size:28px;font-weight:bold'>请按条件查询用户信息</div>");
				$("#addDataModal").modal("hide");
				windowStart("物业公司绑定成功",true);
				funLabelSearch();
			}
			else
			{
				windowStart("物业公司绑定失败",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无绑定物业公司信息权限",false);
            }else{
            	windowStart("物业公司绑定失败",false);
            }
//			windowStart("物业公司绑定失败",false);
		}
	})
}
$(document).ready(function(){
	$(".time-picker").datepicker("setValue");
	$(".time-picker").val("");
	$("#btnSetWuYe").click(function(){
		if($(".each-CheckBox:checked").length < 1 )
		{
//			alert("请选择需要绑定物业公司的标签");
			windowStart("请选择需要绑定物业公司的标签",false);
			return;
		}
		$("#addDataModal").modal("show");
		funGetSysInfos();	
	})
	searchSysInfos();
	$("#btnSearData").click(function(){
		funLabelSearch();
	})
	$("#facSelect").change(function(){
		if(!$(this).val())
		{
			return;
		}
		funLabelSearch();
	})
	$("#assetType").change(function(){
		if(!$(this).val())
		{
			return;
		}
		funLabelSearch();
	})
	$("#btnAddWuYe").click(function(){
		funSetWuYe();
	})
})
