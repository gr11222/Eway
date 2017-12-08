var theNum = 0;
var labelType = 0;
var asset_editInf = {};
var data_length = 0;
var theData_length = 0;
var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;

function EscapeString(str) {
	return escape(str).replace(/\%/g, "\$");
}

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

//资产维护-- 查询资产类型  所属工厂  服务商
function searchSysInfosPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("询资产类型  所属工厂  服务商传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	// $("#buildingowner").html("");
	$("#editfactoryAreaModal").html("");
	// $("#companyName").html("");
	$("#editfuwushangModal").html("");
	// $("#deviceTypeName").html("");
	$("#editassetTypeModal").html("");
	// $("#buildingowner").html("");
	$("#editfactoryAreaModal").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		async: "false",
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("查询资产类型  所属工厂  服务商返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoSelect(msg);
				funSearchAsset();
			} else {
				windowStart("查询资产类型 、所属工厂 、服务商失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();

			//			windowStart("查询资产类型 、所属工厂 、服务商失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询资产类型 、所属工厂 、服务商权限", false);
			} else {
				windowStart("查询资产类型 、所属工厂 、服务商失败", false);
			}
		}
	})
}

function createSysInfoSelect(msg) {
	if(msg.factoryItems != undefined && msg.factoryItems.length > 0) {
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
	if(msg.propertyItems != undefined && msg.propertyItems.length > 0) {
		var theData = msg.propertyItems;
		var str = "";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
			$("#companyName").append(str);
	}
	if(msg.CompanyItems != undefined && msg.CompanyItems.length > 0) {
		var theData = msg.CompanyItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
				// $("#companyName").append(str);
		$("#editfuwushangModal").html(str);
		$("#fuwushangModal").html(str);

	}
	if(msg.DeviceItems != undefined && msg.DeviceItems.length > 0) {
		var theData = msg.DeviceItems;
		var str = "<option value=''>请选择</option>";
		var str2 = "";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			str2 += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";

		}
		$("#deviceTypeName").append(str2);
		$("#assetTypeModal").html(str);
		$("#editassetTypeModal").html(str);
	}
	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";

		}
		$("#projectName").append(str);
		$("#idOfProject").append(str);
		$("#editIdOfproject").append(str);



	}
	//建筑
	if(msg.buildingItems != undefined && msg.buildingItems.length > 0) {
		var theData = msg.buildingItems;
		var str = "<option value='-1'>请选择</option>";
		var str2 = "";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			str2 += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#buildingowner").append(str2);
		$("#editfactoryAreaModal").html(str);
		$("#buildingModal").html(str);
	}
}
//资产维护---增加资产
function funAddAssetPara() {
	var jsonData = setJson(null, "typeId", parseInt($("#assetTypeModal").val()));
	jsonData = setJson(jsonData, "companyId", parseInt($("#fuwushangModal").val()));
	jsonData = setJson(jsonData, "nameCn", $("#assetNameModal").val());
	jsonData = setJson(jsonData, "nameEn", $("#assetNameEnModal").val());
	jsonData = setJson(jsonData, "buildingId", parseInt($("#buildingModal").val()));
	jsonData = setJson(jsonData, "position", $("#position").val());
	jsonData = setJson(jsonData, "deviceModel", $("#assetDevice").val());
	jsonData = setJson(jsonData, "projectId", parseInt($("#idOfProject").val()));
	jsonData = setJson(jsonData, "number", parseInt($("#assetNum").val()));
	// jsonData = setJson(jsonData, "deviceType", parseInt($("#assetTypeModal").val()));
	// jsonData = setJson(jsonData, "insertTime", "");
	// jsonData = setJson(jsonData, "updateTime", "");
	// jsonData = setJson(jsonData, "code", "");
	// jsonData = setJson(jsonData, "deviceModel", "");
	// jsonData = setJson(jsonData, "labelOrNot", -1);
	// jsonData = setJson(jsonData, "number", parseInt($("#assetNum").val()));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("增加资产传值=" + jsonData);
	return jsonData;
}

function funAddAsset() {
	//	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceBasicInfoAddCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddAssetPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("增加资产信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addAssetModal").modal("hide");
				$("#assetTypeModal").val("");
				$("#factoryAreaModal").val("");
				$("#fuwushangModal").val("");
				$("#assetNameEnModal").val("");
				$("#assetNameModal").val("");
				$("#position").val("");

				windowStart("资产信息增加成功", true);
				// data_page_index = 0;
				// curren_page = 1;
				funSearchAsset();
			} else {
				windowStart("增加资产信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无增加资产信息权限", false);
			} else {
				windowStart("增加资产信息失败", false);
			}
			//			windowStart("增加资产信息失败",false);
		}
	})
}
//资产维护---查询资产
function funSearchAssetPara() {
	var startTime = "",
		endTime = "";
	if($("#startTime").val().length > 0) {
		startTime = $("#startTime").val() + " 00:00:00";
	}
	if($("#endTime").val().length > 0) {
		endTime = $("#endTime").val() + " 23:59:59";
	}

	var jsonData = setJson(null, "companyId", parseInt($("#companyName").val()));
	jsonData = setJson(jsonData, "projectId", parseInt($("#projectName").val()));
	jsonData = setJson(jsonData, "buildingId", parseInt($("#buildingowner").val()));
	jsonData = setJson(jsonData, "startTime", startTime);
	jsonData = setJson(jsonData, "endTime", endTime);
	jsonData = setJson(jsonData, "keyWord", $("#keyWord").val());
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "assteType", parseInt($("#deviceTypeName").val()));
	jsonData = setJson(jsonData, "labelOrNot", labelType);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询资产信息传值=" + jsonData);
	return jsonData;
}

function funSearchAsset() {
	//	var timeReg =  /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
	//	{
	//		windowStart("时间范围有误,请填写时间范围",false);
	//	    return false;
	//	}
	//	if($("#startTime").val().length > 0 )
	//	{
	//		if(!timeReg.test($("#startTime").val()))
	//		{
	//			 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
	//			 return false;
	//		}
	//	}
	//	if($("#endTime").val().length > 0 )
	//	{
	//		if(!timeReg.test($("#endTime").val()))
	//		{
	//			 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
	//			 return false;
	//		}
	//	}
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
	//	if($("#startTime").val().length > 0 &&$("#endTime").val().length > 0 )
	//	{
	//		var startTime = $("#startTime").val().split("-");
	//		var endTime = $("#endTime").val().split("-");
	//		var startDate = new Date(parseInt(startTime[0]),parseInt(startTime[1]),parseInt(startTime[2]));
	//		var endDate = new Date(parseInt(endTime[0]),parseInt(endTime[1]),parseInt(endTime[2]));
	//		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime()))
	//		{
	//			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间",false);
	//		    return;
	//		}
	//	}
	if(labelType == 0) {
		$("#dataRealContent1").html("");
		loadingStart("dataRealContent1");
	} else if(labelType == 1) {
		$("#dataRealContent2").html("");
		loadingStart("dataRealContent2");
	} else {
		$("#dataRealContent3").html("");
		loadingStart("dataRealContent3");
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceBasicInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funSearchAssetPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询资产信息返回值=" + JSON.stringify(msg));

			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createAssetTableInfos(msg);
			} else {
				windowStart("查询资产信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();

			//			windowStart("查询资产信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询资产信息权限", false);
			} else {
				windowStart("查询资产信息失败", false);
			}
		}
	})
}

function createAssetTableInfos(msg) {
	$(".deleteInfo-class").unbind("click");
	$(".editInfo-class").unbind("click");
	$(".create-qrcode").unbind("click");
	if(!msg.items || msg.items.length < 1) {
		if(labelType == 0) {
			$("#dataRealContent1").html("");
		} else if(labelType == 1) {
			$("#dataRealContent2").html("");
		} else {
			$("#dataRealContent3").html("");
		}
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无资产信息";
		str += "</div>";
		if(labelType == 0) {
			$("#dataRealContent1").html(str);
		} else if(labelType == 1) {
			$("#dataRealContent2").html(str);
		} else {
			$("#dataRealContent3").html(str);
		}
		return;
	}
	total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");
	var realData = msg.items;
	data_length = realData.length;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='' style='width:6%'><input type='checkbox' class='all-checkbox'/ >全选</th>";
	str += "<th class='text-center td-width' style='width:6%'>序号</th>";
	str += "<th class='text-center td-width'>资产编号</th>";
	str += "<th class='text-center td-width'>中文名称</th>";
	str += "<th class='text-center td-width'>英文名称</th>";
	str += "<th class='text-center td-width'>服务商</th>";
	str += "<th class='text-center td-width'>资产类型</th>";
	str += "<th class='text-center td-width'>资产型号</th>";
	str += "<th class='text-center td-width'>所属建筑</th>";
	str += "<th class='text-center td-width'>生成二维码</th>";
	str += "<th class='text-center td-width'>安装位置</th>";
	str += "<th class='text-center td-width'>修改时间</th>";
	str += "<th class='text-center td-width'>管理</th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		str += "<tr>";
		str += "<td class='' style='width:6%'><input theId='" + realData[i]["id"] + "'  theData='" + JSON.stringify(realData[i]) + "' type='checkbox' class='each-checkbox'/ ></td>";
		str += "<td class='text-center' style='width:3%' title='"+(i + 1)+"'>" + (i + 1) + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["assetModel"]+"'>" + realData[i]["assetModel"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["nameCn"]+"'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["nameEn"]+"'>" + realData[i]["nameEn"] + "</td>";

		str += "<td class='text-center td-width' title='"+realData[i]["company"]+"'>" + realData[i]["company"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["assetType"]+"'>" + realData[i]["assetType"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["deviceModel"]+"'>" + realData[i]["deviceModel"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["building"]+"'>" + realData[i]["building"] + "</td>";
		if(parseInt(realData[i]["labelOrNot"]) == -1) {
			str += "<td class='text-center td-width' title='生成二维码'><a class='create-qrcode'  datas='" + JSON.stringify(realData[i]) + "' href='javascript:void(0)' >生成二维码</a></td>";
		} else {
			str += "<td class='text-center td-width' title='已生成'>已生成</td>";
		}

		str += "<td class='text-center td-width' title='"+realData[i]["position"]+"'>" + realData[i]["position"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["updateTime"]+"'>" + realData[i]["updateTime"] + "</td>";
		str += "<td class='text-center td-width' style='width:10%'>";
		str += "<span><a href='javascript:void(0)' theData='" + JSON.stringify(realData[i]) + "' class='editInfo-class'><img src='../img/edit.png' width='18' height='18'></a></span>";
		str += "<span style='padding-left:10px'><a href='javascript:void(0)' theId='" + realData[i]["id"] + "' class='deleteInfo-class'><img src='../img/dele.png' width='18' height='18'></a></span>";
		str += "</td>";
		str += "</tr>";

	}
	str += "</tbody><table>";
	if(labelType == 0) {
		$("#dataRealContent1").html(str);
	} else if(labelType == 1) {
		$("#dataRealContent2").html(str);
	} else {
		$("#dataRealContent3").html(str);
	}

	$(".all-checkbox").change(function() {
		if($(this).prop("checked")) {
			theData_length = data_length;
			$(".each-checkbox").prop("checked", false);
			$(this).parent().parent().parent().parent().find('.each-checkbox').prop("checked", true);
		} else {
			theData_length = 0;
			$(".each-checkbox").prop("checked", false);
			// $(this).parent().parent().parent().parent().find('.each-checkbox').prop("checked", false);

		}
		console.log($(".each-checkbox:checked").length)
	})
	$(".each-checkbox").change(function() {
		if($(this).prop("checked")) {

			theData_length++;
			if(theData_length == data_length) {
				$(".all-checkbox").prop("checked", true); 
			} else {
				$(".all-checkbox").prop("checked", false);
			}

		} else {
			theData_length--;
			if(theData_length == data_length) {
				$(".all-checkbox").prop("checked", true);
			} else {
				$(".all-checkbox").prop("checked", false);
			}

		}
	})
	$(".deleteInfo-class").bind("click", function() {
		if(!confirm("是否确认删除?")) {
			return;
		}
		funDeleteAsset(parseInt($(this).attr("theId")));
	})
	$(".editInfo-class").bind("click", function() {
		asset_editInf = eval("(" + $(this).attr("theData") + ")");
		$("#editfuwushangModal").val(asset_editInf.companyId);
		$("#editassetTypeModal").val(asset_editInf.assetId);
		//		$("#editfactoryAreaModal option").each(function(){
		//			if($(this).text() == asset_editInf.building){
		//				$(this).attr("selected",true);
		//			}
		//		})
		$("#editfactoryAreaModal").val(asset_editInf.buildingId);
		$("#editAssetDevice").val(asset_editInf.deviceModel);
		$("#editassetNameModal").val(asset_editInf.nameCn);
		$("#editassetNameEnModal").val(asset_editInf.nameEn);
		$("#assetAddrModal").val(asset_editInf.position);
		$("#editIdOfproject").val(asset_editInf.projectId);
		$("#editAssetModal").modal("show");
	})
	$(".create-qrcode").bind("click", function() {
		var theData = eval("(" + $(this).attr("datas") + ")");
		funCreateQrcode(theData);
	});
}

//资产维护---删除资产
function funDeleteAssetPara(theId) {
	var jsonData = setJson(null, "id", theId);
	// jsonData = setJson(jsonData, "deviceType", -1);
	// jsonData = setJson(jsonData, "companyId", -1);
	// jsonData = setJson(jsonData, "nameCn", "");
	// jsonData = setJson(jsonData, "nameEn", "");
	// jsonData = setJson(jsonData, "insertTime", "");
	// jsonData = setJson(jsonData, "updateTime", "");
	// jsonData = setJson(jsonData, "code", "");
	// jsonData = setJson(jsonData, "buildingId", -1);
	// jsonData = setJson(jsonData, "position", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("删除资产信息传值=" + jsonData);
	return jsonData;
}

function funDeleteAsset(theId) {
	//	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceBasicInfoDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteAssetPara(theId),
		success: function(msg) {
			//			loadingStop();
			console.log("删除资产信息返回值=" + JSON.stringify(msg));

			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("删除资产信息成功", true);
				// data_page_index = 0;
				// curren_page = 1;
				funSearchAsset();
			} else {
				windowStart(msg.failReason, false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();
			//			windowStart("删除资产信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除资产信息权限", false);
			} else {
				windowStart("删除资产信息失败", false);
			}
		}
	})
}
//资产维护---修改资产
function funEditAssetPara() {

	var buildingId = -1;
	if($("#editfactoryAreaModal").val().length > 0) {
		buildingId = parseInt($("#editfactoryAreaModal").val());
	}
	var jsonData = setJson(null, "id", parseInt(asset_editInf.id));
	jsonData = setJson(jsonData, "typeId", parseInt($("#editassetTypeModal").val()));
	jsonData = setJson(jsonData, "companyId", parseInt($("#editfuwushangModal").val()));
	jsonData = setJson(jsonData, "nameCn", $("#editassetNameModal").val());
	jsonData = setJson(jsonData, "nameEn", $("#editassetNameEnModal").val());
	// jsonData = setJson(jsonData, "insertTime", "");
	// jsonData = setJson(jsonData, "updateTime", "");
	// jsonData = setJson(jsonData, "code", "");
	jsonData = setJson(jsonData, "buildingId", buildingId);
	jsonData = setJson(jsonData, "position", $("#assetAddrModal").val());
	jsonData = setJson(jsonData, "deviceModel", $("#editAssetDevice").val());
	jsonData = setJson(jsonData, "projectId", parseInt($("#editIdOfproject").val()));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("修改资产信息传值=" + jsonData);
	return jsonData;
}

function funEditAsset() {
	//	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceBasicInfoUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funEditAssetPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("修改资产信息返回值=" + JSON.stringify(msg));

			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("资产信息已修改", true);
				$("#editAssetModal").modal("hide");
				funSearchAsset();
			} else {
				windowStart("资产信息修改失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改资产信息权限", false);
			} else {
				windowStart("资产信息修改失败", false);
			}
			//			windowStart("资产信息修改失败",false);
		}
	})
}
//二维码
function funCreateQrcodePara(theData) {
	var qrcodeArr = [];
	var theId = parseInt(theData.id);

	// var obj = {};
	// obj.requestCommand = "";
	// obj.responseCommand = "";
	// obj.text = "deviceId=" + theId;
	// obj.tagId = theId;
	// obj.userAccountName = localStorage.getItem("userAccountName");
	qrcodeArr.push(theId);
	var jsonData = setJson(null, "item", qrcodeArr);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("二维码传值=" + jsonData);

	return jsonData;
}

function funCreateQrcode(theData) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=QRCodeCreateCmd",
		contentType: "application/text,charset=utf-8",
		data: funCreateQrcodePara(theData),
		success: function(msg) {
			console.log("生成二维码返回值=" + JSON.stringify(msg));
			//			$("#codeDeviceId").text(theData.tagId);
			//			$("#qrCodeImg").attr("src","/file/"+msg.responseCommand);
			//			$("#qrCodeModal").modal("show");
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				// data_page_index = 0;
				// curren_page = 1;
				funSearchAsset();
				windowStart(msg.failReason, true);
				}
			else{
				funSearchAsset();
				windowStart(msg.failReason, true);
			}
			// } else if(msg.responseCommand.toUpperCase().indexOf("NULL") != -1) {
			// 	windowStart("二维码未绑定建筑", false);
			// } else if(msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
			// 	windowStart("二维码已经存在", false);
			// } else {
			// 	windowStart("二维码生成失败", false);
			// }
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			windowStart("二维码生成失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无生成二维码权限", false);
			} else {
				windowStart("二维码生成失败", false);
			}
		}
	})
}

//批量生成二维码
function funCreateAllQrcodePara() {
	var qrcodeArr = [];
	// alert($(".each-checkbox:checked").length);
	for(var i = 0; i < $(".each-checkbox:checked").length; i++) {
		var theData = eval("(" + $(".each-checkbox:checked").eq(i).attr("theData") + ")");
		var theId = parseInt(theData.id);
		// var obj = {};
		// obj.requestCommand = "";
		// obj.responseCommand = "";
		// obj.text = "deviceId=" + theId;
		// obj.tagId = theId;
		// obj.userAccountName = localStorage.getItem("userAccountName");
		qrcodeArr.push(theId);
	}
	var jsonData = setJson(jsonData, "item", qrcodeArr);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("二维码传值=" + jsonData);
	return jsonData;
}

function funCreateAllQrcode() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=QRCodeCreateCmd",
		contentType: "application/text,charset=utf-8",
		data: funCreateAllQrcodePara(),
		success: function(msg) {
			console.log("生成二维码返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart(msg.failReason, true);
				// data_page_index = 0;
				// curren_page = 1;
				funSearchAsset();
			} else {
				windowStart(msg.failReason, false);
				funSearchAsset();
				
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无生成二维码权限", false);
			} else {
				windowStart("二维码生成失败", false);
			}
		}
	})
}

//查找设备
function funSearchDevicePara() {
	var theId = -1;

	//	for(var i = 0; i < $(".each-checkbox:checked").length; i++) {
	//		var theData = eval("(" + $(".each-checkbox:checked").eq(i).attr("theData") + ")");
	//		console.log(theData);
	//		theId = parseInt(theData.assetId);
	//
	//	}
	$(".each-checkbox:checked").each(function() {
		var theData = eval("(" + $(this).attr("theData") + ")");
		console.log(theData);
		theId = parseInt(theData.assetId);
	})
	var jsonData = setJson(null, "typeId", theId);
	//	jsonData = setJson(jsonData, "responseCommand", "");
	//	jsonData = setJson(jsonData, "item", "", true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询设备传值=" + jsonData);
	return jsonData;
}

function funSearchDevice() {
	$("#replaceDeviceNameModal").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceBasicInfoItemCmd",
		contentType: "application/text,charset=utf-8",
		data: funSearchDevicePara(),
		success: function(msg) {
			console.log("查询设备返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createDeviceList(msg);
			} else {
				windowStart("设备查询失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询设备权限", false);
			} else {
				windowStart("设备查询失败", false);
			}
		}
	})
}

function createDeviceList(msg) {
	if(!msg.item || msg.item.length == 0) {
		return;
	}

	var str = "";
	var theData = msg.item;
	str += "<option value=''>请选择</option>";
	for(var i = 0; i < theData.length; i++) {
		str += "<option value='" + theData[i]["deviceId"] + "'>" + theData[i]["deviceName"] + "</option>";
	}

	$("#replaceDeviceNameModal").html(str);
}

//替换设备
function funReplaceDevicePara() {
	var theId = -1;
	for(var i = 0; i < $(".each-checkbox:checked").length; i++) {
		var theData = eval("(" + $(".each-checkbox:checked").eq(i).attr("theData") + ")");
		theId = parseInt(theData.id);
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "newAsset", parseInt($("#replaceDeviceNameModal").val()));
	jsonData = setJson(jsonData, "oldAsset", theId);
	//jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
	console.log("替换传值=" + jsonData);
	return jsonData;
}

function funReplaceDevice() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceBasicInfoReplaceCmd",
		contentType: "application/text,charset=utf-8",
		data: funReplaceDevicePara(),
		success: function(msg) {
			console.log("替换设备返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#tiHuanAssetModal").modal("hide");
				windowStart("设备替换成功", false);
				// data_page_index = 0;
				// curren_page = 1;
				funSearchAsset();
			} else {
				windowStart("设备替换失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#tiHuanAssetModal").modal("hide");
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无操作设备替换权限", false);
			} else {
				windowStart("设备替换失败", false);
			}
		}
	})
}

function funGetDayCheckInfo() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0) {
	//		windowStart("时间范围有误,请填写时间范围", false);
	//		return false;
	//	}
	if($("#startTime").val().length > 0) {
		if(!timeReg.test($("#startTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if($("#endTime").val().length > 0) {
		if(!timeReg.test($("#endTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
		windowStart("请输入结束时间", false);
		return false;
	}
	if($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
		windowStart("请输入开始时间", false);
		return false;
	}
	if($("#startTime").val().length > 0 && $("#endTime").val().length > 0) {
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1])-1, parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("开始时间不能大于结束时间", false);
			return false;
		}
	}
	return true;
}

$(document).ready(function() {
	$(".time-picker").datepicker("setValue");
	$(".time-picker").val("");
	searchSysInfos();
	//funSearchAsset();
	$("#btnAddFacData").click(function() {
		$("#addAssetModal").modal("show");
		$("#assetNameModal").val("");
		$("#assetDevice").val("");
		$("#assetNameEnModal").val("");
		$("#assetTypeModal").val("");
		$("#fuwushangModal").val("");
		$("#buildingModal").val("");
		$("#position").val("");
		$("#idOfProject").val("");
		$("#assetNum").val("");

	})
	//资产维护---添加
	$("#btnAddFactory").click(function() {
			if(!$("#assetNameModal").val()) {
				windowStart("请输入中文名称", false);
				return;
			}
			var cnCheck = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
			if(!cnCheck.test($("#assetNameModal").val())) {
				windowStart("中文名称只能输入中英文和数字", false);
				return;
			}
			var firstReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
			if(!firstReg.test($("#assetNameModal").val())) {
				windowStart("中文名称只能以中,英文开头", false);
				return;
			}
			if(!$("#assetNameEnModal").val()) {
				windowStart("请输入英文名称", false);
				return;
			}
			//	var cnCheck = /^[\u4e00-\u9fa5]+$/;
			var enCheck = /^[a-zA-Z]+$/;
			if($("#assetNameEnModal").val().length > 0) {
				if(!enCheck.test($("#assetNameEnModal").val())) {
					windowStart("英文名称只能输入英文", false);
					return;
				}
			}
			if(!$("#assetTypeModal").val()) {
				windowStart("请选择资产类型", false);
				return;
			}
			if(!$("#assetDevice").val()) {
				windowStart("请输入资产型号", false);
				return;
			}
			if(!$("#fuwushangModal").val()) {
				windowStart("请选择服务商", false);
				return;
			}
			if($("#buildingModal").val() == -1) {
				windowStart("请选择所属建筑", false);
				return;
			}
			if(!$("#idOfProject").val()) {
				windowStart("请选择所属项目", false);
				return;
			}
			var RegEx = /^[0-9]+$/;
			if($("#assetNum").val().length==0){
				windowStart("请输入资产数量", false);
				return;
			}
			if(!RegEx.test($("#assetNum").val())||parseInt($("#assetNum").val())<1){
				windowStart("资产数量为正整数", false);
				return;
			}
			funAddAsset();
		})
		//资产维护---修改
	$("#btneditFactory").click(function() {
			if(!$("#editassetNameModal").val()) {
				windowStart("请输入中文名称", false);
				return;
			}
			var cnCheck = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
			if(!cnCheck.test($("#editassetNameModal").val())) {
				windowStart("中文名称只能输入中,英文和数字", false);
				return;
			}
			var firstReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
			if(!firstReg.test($("#editassetNameModal").val())) {
				windowStart("中文名称只能以中,英文开头", false);
				return;
			}
			if(!$("#editassetNameEnModal").val()) {
				windowStart("请输入英文名称", false);
				return;
			}
			//	var cnCheck = /^[\u4e00-\u9fa5]+$/;
			var enCheck = /^[a-zA-Z]+$/;
			//		if(!cnCheck.test($("#editassetNameModal").val()))
			//		{
			//		
			//			windowStart("中文名称只能输入中文",false);
			//			return;
			//		}

			if($("#editassetNameEnModal").val().length > 0) {
				if(!enCheck.test($("#editassetNameEnModal").val())) {
					windowStart("英文名称只能输入英文", false);
					return;
				}
			}
			if(!$("#editassetTypeModal").val()) {
				windowStart("请选择资产类型", false);
				return;
			}
			if(!$("#editAssetDevice").val()) {
				windowStart("请输入资产型号", false);
				return;
			}
			if(!$("#editfuwushangModal").val()) {
				windowStart("请选择服务商", false);
				return;
			}
			if($("#editfactoryAreaModal").val()==-1){
						windowStart("请选择所属建筑",false);
						return ;
					}
			if(!$("#editIdOfproject").val()){
						windowStart("请选择所属项目",false);
						return ;
					}		
			funEditAsset();
			//		$("#editAssetModal").modal("show");
		})
		////资产维护---查询
	$("#btnSearData").click(function() {
		var date1 = $("#startTime").val().split("-");
		var date2 = $("#endTime").val().split("-");
		var startTime = new Date(date1[0], date1[1], date1[2]).getTime();
		var endTime = new Date(date2[0], date2[1], date2[2]).getTime();
		//		if(parseInt(startTime) > parseInt(endTime))
		//		{
		//			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间",false);
		//			return;
		//		}
		if(!funGetDayCheckInfo()) {
			return;
		}
		data_page_index = 0;
		curren_page = 1;
		$("#pageNumId").val("");
		funSearchAsset();
	})
	$(".li-table-change").mouseover(function() {

		var theLeft = parseInt($(this).attr("thenum")) * 120 + "px";

		$(".border-style").animate({
			"left": theLeft
		}, 100);
	})
	$(".li-table-change").click(function() {
		theNum = parseInt($(this).attr("thenum"));
		total = -1;
		data_page_index = 0;
		data_number = 17;
		curren_page = 1;
		total_page = 0;
		var theLeft = theNum * 120 + "px";
		$(".border-style").css({
			"left": theLeft
		});
		$(".data-real-content").each(function() {
			$(this).addClass("hide");
		})
		$(".data-real-content").eq(theNum).removeClass("hide");
		if(theNum == 0) {
			labelType = 0;
		} else if(theNum == 1) {
			labelType = 1;
		} else {
			labelType = -1;
		}
		data_page_index = 0;
		curren_page = 1;
		$("#pageNumId").val("");
		funSearchAsset();
		//		$(".content-for-animate").animate({"left":"-100%"},100);
		//		if(theNum == 0)
		//		{
		//			$(".content-1").eq(1).animate({"opacity":"0","filter":"alpha(opacity=0)","zIndex":"4"},100);
		//			$(".content-1").eq(0).animate({"opacity":"1","filter":"alpha(opacity=100)","zIndex":"5"},100);
		//		}
		//		else
		//		{
		//			$(".content-1").eq(0).animate({"opacity":"0","filter":"alpha(opacity=0)","zIndex":"4"},100);
		//			$(".content-1").eq(1).animate({"opacity":"1","filter":"alpha(opacity=100)","zIndex":"5"},100);
		//		}
	})
	$(".li-table-change").mouseout(function() {
			var theLeft = theNum * 120 + "px";
			$(".border-style").animate({
				"left": theLeft
			}, 100);
		})
		//批量生成二维码
	$("#btnPrintQrcodeInfos").click(function() {
		if($(".each-checkbox:checked").length == 0) {
			windowStart("请选择需要生成二维码的资产信息", false);
			return;
		}
		funCreateAllQrcode();
	})

	//替换
	$("#btnTiHuanDeviceData").click(function() {
		if($(".each-checkbox:checked").length == 0) {
			windowStart("请选择需要替换设备的资产信息", false);
			return;
		}
		if($(".each-checkbox:checked").length > 1) {
			windowStart("替换功能只能对一条数据进行操作", false);
			return;
		}
		funSearchDevice();
		$("#tiHuanAssetModal").modal("show");
	})
	$("#btnTiHuanDevice").click(function() {
		if(!$("#replaceDeviceNameModal").val()) {
			windowStart("请选择设备", false);
			return;
		}
		funReplaceDevice();
	})

	//分页操作
	//上一页
	$("#btnPageBefore").click(function() {
			if(total_page == 0) {
				return;
			}
			if(curren_page == 1) {
				windowStart("当前为首页", false);
				return;
			}
			data_page_index -= data_number;
			curren_page -= 1;
			funSearchAsset();
		})
		//下一页
	$("#btnPageNext").click(function() {
			if(total_page == 0) {
				return;
			}
			if(total_page == curren_page) {
				windowStart("当前为尾页", false);
				return;
			}
			data_page_index += data_number;
			curren_page += 1;
			funSearchAsset();
		})
		//跳转页
	$("#btnPageJump").click(function() {
			if(total_page == 0) {
				return;
			}
			var numReg = /^[0-9]+$/;
			if(!numReg.test($("#pageNumId").val())) {
				windowStart("页码输入有误", false);
				return;
			}
			if(parseInt($("#pageNumId").val()) < 1) {
				windowStart("页码输入有误", false);
				return;
			}
			if(parseInt($("#pageNumId").val()) > total_page) {
				windowStart("页码输入有误", false);
				return;
			}
			data_page_index = (parseInt($("#pageNumId").val()) - 1) * data_number;
			curren_page = parseInt($("#pageNumId").val());
			$("#pageNumId").val("");
			funSearchAsset();
		})
		//分页操作
})