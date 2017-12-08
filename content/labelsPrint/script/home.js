var assetDataLength = 0;
var selectDataLength = 0;
var theEq = -1;
var key = 0; //0所有，1单张
var Data;

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
	$("#buildingowner").html("");
	$("#editfactoryAreaModal").html("");
	$("#companyName").html("");
	$("#editfuwushangModal").html("");
	$("#deviceTypeName").html("");
	$("#editassetTypeModal").html("");
	$("#buildingowner").html("");
	$("#editfactoryAreaModal").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("查询资产类型  所属工厂  服务商返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoSelect(msg);
				//	funLabelSearch();
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
	//	if(msg.factoryItems != undefined && msg.factoryItems.length > 0  )
	//	{
	////		var theData = msg.factoryItems;
	////		var str = "<option value=''>请选择</option>";
	////		for(var i = 0 ; i < theData.length ; i++ )
	////		{
	////			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
	////		}
	////		$("#buildingowner").html(str);
	////		$("#editfactoryAreaModal").html(str);
	////		
	//	}
	//公司
	if(msg.propertyItems != undefined && msg.propertyItems.length > 0) {
		var theData = msg.propertyItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#companyName").html(str);
	}
	//项目
	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		//		$("#project").html(projectSelect);
		$("#projectName").html(str);
		//		$("#addProjectName").html(projectSelect);
	}
	if(msg.CompanyItems != undefined && msg.CompanyItems.length > 0) {
		var theData = msg.CompanyItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
		//		$("#companyName").html(str);
		$("#facilitator").html(str);

	}
	if(msg.DeviceItems != undefined && msg.DeviceItems.length > 0) {
		var theData = msg.DeviceItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";

		}
		$("#assetType").html(str);
		//		$("#editassetTypeModal").html(str);
	}
	//	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
	//		var theData = msg.projectItems;
	//		var str = "<option value=''>请选择</option>";
	//		for(var i = 0; i < theData.length; i++) {
	//			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
	//			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";
	//
	//		}
	//		$("#projectName").html(str);
	//
	//	}
	//	//建筑
	//	if(msg.buildingItems != undefined && msg.buildingItems.length > 0) {
	//		var theData = msg.buildingItems;
	//		var str = "<option value=''>请选择</option>";
	//		for(var i = 0; i < theData.length; i++) {
	//			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
	//
	//		}
	//		$("#BuildSelect").html(str);
	//		//		$("#editfactoryAreaModal").html(str);
	//	}
}

function funCheckDate() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	if($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
		windowStart("时间范围有误,请选取结束时间", false);
		return false;
	}
	if($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
		windowStart("时间范围有误,请选取开始时间", false);
		return false;
	}
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
	if($("#startTime").val().length > 0 && $("#endTime").val().length > 0) {
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间", false);
			return false;
		}
	}
	return true;
}

function funLabelSearchPara() {
	var buildingNum = -1;
	var assetId = -1;

	var resp = setJson(null, "requestCommand", "");
	resp = setJson(resp, "responseCommand", "")
	var jsonData = setJson(null, "resp", eval("(" + resp + ")"));
	var query = setJson(null, "enterprise", "");
	query = setJson(query, "project", $("#projectName").val());
	query = setJson(query, "nameCn", $("#assetName").val());
	query = setJson(query, "classifyId", parseInt($("#assetType").val()));
	query = setJson(query, "companyId", parseInt($("#facilitator").val()));
	query = setJson(query, "deviceModel", $("#assetModel").val());
	if($("#startTime").val() == "") {
		query = setJson(query, "startTime", $("#startTime").val());
	} else {
		query = setJson(query, "startTime", $("#startTime").val() + " 00:00:00");
	}
	if($("#endTime").val() == "") {
		query = setJson(query, "endTime", $("#endTime").val());
	} else {
		query = setJson(query, "endTime", $("#endTime").val() + " 23:59:59");
	}
	query = setJson(query, "sign", theEq);
	jsonData = setJson(jsonData, "query", eval("(" + query + ")"));
	jsonData = setJson(jsonData, "items", "", true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//  var jsonData='{"query":{"enterprise":"","project":"","nameCn":"","classifyId":-1,"companyId":-1,"deviceModel":"","startTime":"","endTime":"","sign":-1},"userAccountName":"ZFZero"}';
	console.log("标签打印查询传值=" + jsonData);
	return jsonData;
}

function funLabelSearch() {
	if(!funCheckDate()) {
		return;
	}
	assetDataLength = 0;
	selectDataLength = 0;

	$("#dataContent").html("");
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagBasicInfoPrintCmd",
		contentType: "application/text,charset=utf-8",
		data: funLabelSearchPara(),
		success: function(msg) {

			loadingStop();
			console.log("查询标签打印返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#dataContent").html("");
				createLabelTableInfos(msg);
			} else {
				windowStart("查询标签信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();

			//			createLabelTableInfos();
			//			windowStart("查询标签信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询标签信息权限", false);
			} else {
				windowStart("查询标签信息失败", false);
			}
			console.log("fail");
		}
	})
}

function createLabelTableInfos(msg) {

	if(!msg.items || msg.items.length < 1) {
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

	var realData = msg.items;
	assetDataLength = realData.length;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<tr>";
	//	str += "<th class='text-center'><input type='checkbox' id='allCheckBox'>  全选</th>";
	str += "<th class='' ><div class='CheckBox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center'>资产名称</th>";
	str += "<th class='text-center'>英文名称</th>";
	str += "<th class='text-center'>资产类型</th>";
	str += "<th class='text-center'>服务商</th>";
	str += "<th class='text-center'>型号</th>";
	str += "<th class='text-center'>所属建筑</th>";
	str += "<th class='text-center'>安装位置</th>";
	str += "<th class='text-center'>创建时间</th>";
	str += "<th class='text-center' style='width:19%'>标签编号123</th>";
	str += "<th class='text-center'>操作</th>";
	str += "</tr></thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var theData = JSON.stringify(realData[i]);
		str += "<tr class='the-qrcode-class' theData='" + JSON.stringify(realData[i]) + "'>";
		str += "<td class='' style='width:6%'><input type='checkbox'  status='" + realData[i]["status"] + "'  theData='" + theData + "'  class='each-CheckBox' theId='" + realData[i]["id"] + "'></td>";
		str += "<td class='text-center' style='width:4%'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameEn"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["type"] + "</td>";
		str += "<td class='text-center' style='width: 8%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["company"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceModel"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["building"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["position"] + "</td>";
		str += "<td class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["time"] + "</td>";
		str += "<td class='text-center' style=';word-wrap: break-word;word-break: break-all;'>" + realData[i]["qrCode"] + "</td>";
		str += "<td class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'><a style='cursor:pointer' class='print-qrcode' Data='" + theData + "'>打印标签</a></td>";
		//		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'><input type='checkbox' class='each-CheckBox' theData='" + JSON.stringify(realData[i]) + "'> " + (i + 1) + "</th>";
		//		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceCode"] + "</th>";
		//		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceCode"] + "</th>";
		//		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceCode"] + "</th>";
		//		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceCode"] + "</th>";
		//		
		//		str += "<th class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceTypeNameCn"] + "</th>";
		//		str += "<th class='text-center' style='width: 17%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["company"] + "</th>";
		//		str += "<th class='text-center' style='width: 9%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["building"] + "</th>";
		//		str += "<th class='text-center' style='width: 5%;word-wrap: break-word;word-break: break-all;'><a style='cursor:pointer' class='delete-qrcode' theId='" + realData[i]["id"] + "'><img src='../img/dele.png'></a></th>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#dataContent").html(str);
	$("#allCheckBox").change(function() {
		if($(this).prop("checked")) {
			selectDataLength = assetDataLength;
			$(".each-CheckBox").each(function() {
				$(this).prop("checked", true);
			})
		} else {
			selectDataLength = 0;
			$(".each-CheckBox").each(function() {
				$(this).prop("checked", false);
			})
		}
	})
	$(".each-CheckBox").click(function(e) {
		var e = e || event;
		e.stopPropagation();
		if($(this).prop("checked")) {
			selectDataLength++;
			if(selectDataLength == assetDataLength) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		} else {
			selectDataLength--;
			if(selectDataLength == assetDataLength) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		}
	})
	$(".delete-qrcode").click(function(e) {
		var e = e || event;
		e.stopPropagation();
		if(!confirm("是否确认删除?")) {
			return;
		}
		deleteQrCode(parseInt($(this).attr("theId")));
	})

	$(".the-qrcode-class").click(function(e) {
		$("#qrcodeWatch").removeAttr("src", "");
		var e = e || event;
		e.stopPropagation();
		var theData = eval("(" + $(this).attr("theData") + ")");
		$("#qrcodeWatch").attr("src", "../../../../../" + theData.filePath);
		$("#labelInfosModal").modal("show");
	})

	$(".print-qrcode").click(function(e) {

		var e = e || event;
		e.stopPropagation();
		key = 1;
		Data = eval("(" + $(this).attr("Data") + ")");
		$("#pageSizeModal").modal("show");
	})
}
//删除
function deleteQrCodePara(theId) {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", theId);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("标签删除传值=" + jsonData);
	return jsonData;
}

function deleteQrCode(theId) {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=QRCodeDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: deleteQrCodePara(theId),
		success: function(msg) {

			console.log("标签删除返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("标签删除成功", true);
				funLabelSearch();
			} else {
				windowStart("标签删除失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			windowStart("标签删除失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除标签权限", false);
			} else {
				windowStart("标签删除失败", false);
			}
		}
	})
}
//批量打印
//大号纸
function printAllQrCode() {
	//	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	//	var htmlTitle = "<html><head><meta charset='utf-8'><title>批量打印二维码</title></head><body>";
	var htmlhead = "";

	var str = "<div id='printId'>";
	$(".each-CheckBox:checked").each(function() {
			var theData = eval("(" + $(this).attr("theData") + ")");
			var assetCode = theData.qrCode;
			var theNum = 0;
			var codeStr = "";
			var index = 0;
			for(var i = 0; i < 5; i++) {
				codeStr += assetCode.substring(index, index + 5) + "-";
				index += 5;
			}
			codeStr = codeStr.substring(0, codeStr.length - 1);

			var assetName = theData.nameCn;
			var thePath = "../../../../../" + theData.filePath;
			console.log(theData.filePath);
			htmlhead += "<div style='width:100%;padding:0px;height:339.4px'>";
			htmlhead += "<div style='width:100%;height:40px;text-align:center;font-size:16px;word-wrap: break-word;word-break: break-all;line-height:40px;padding-top:20px'>" + codeStr + "</div>";
			htmlhead += "<div style='width:100%;height:40px;text-align:center;font-size:16px;word-wrap: break-word;word-break: break-all;line-height:40px'>" + assetName + "</div>";
			htmlhead += "<div style='width:100%;height:259.4px;text-align:center;'><img src='" + thePath + "' style='margin-top:30px' width='200' height='200'/></div>";
			htmlhead += "</div>";
		})
		//  var htmlFoot = '</body></html>'
	str += htmlhead + "</div>";

	$(".body-div-style").append(str);
	$("#printId").jqprint();
	//	newWindow.document.write(str);
	//  newWindow.print();
	//  newWindow.close();
}

//小号纸
function printAllQrCodeForSmall() {

	//	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	//	
	//	var htmlTitle = "<html id='aaaa'><head><meta charset='utf-8'><title>批量打印二维码</title></head><body>";
	$("#printId").remove();
	var htmlhead = "";
	var str = "<div id='printId'>";
	$(".each-CheckBox:checked").each(function() {
			var theData = eval("(" + $(this).attr("theData") + ")");
			var assetCode = theData.qrCode;
			var theNum = 0;
			var codeStr = "";
			var index = 0;
			for(var i = 0; i < 5; i++) {
				codeStr += assetCode.substring(index, index + 5) + "-";
				index += 5;
			}
			codeStr = codeStr.substring(0, codeStr.length - 1);

			var assetName = theData.nameCn;
			//  	 alert(theData.filePath);
			var thePath = "../../../../" + theData.filePath;
			htmlhead += "<div style='width:100%;height:212.49x;'>";
			htmlhead += "<div style='width:100%;height:25px;text-align:center;font-size:10px;word-wrap: break-word;word-break: break-all;padding:0px 5px;padding-top:20px'>" + codeStr + "</div>";
			htmlhead += "<div style='width:100%;height:25px;text-align:center;font-size:10px;word-wrap: break-word;word-break: break-all;padding-top:30px'>" + assetName + "</div>";
			htmlhead += "<div style='width:100%;height:126.4px;text-align:center;margin-top:20px;'><img src='" + thePath + "' width='100' height='100'/></div>";
			htmlhead += "</div>";
		})
		//  var htmlFoot = '</body></html>'
	str += htmlhead + "</div>";

	$(".body-div-style").append(str);
	$("#printId").jqprint();
	return;
	//	newWindow.document.write(str);
	//
	//  newWindow.print();
	//  newWindow.close();
	//  newWindow.reload();
}

//单个打印
//大号纸
function printQrCode() {
	//	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	//	var htmlTitle = "<html><head><meta charset='utf-8'><title>批量打印二维码</title></head><body>";

	var htmlhead = "";
	var str = "<div id='printId'>";
	//	var theData = eval("(" + $(this).attr("theData") + ")");
	var assetCode = Data.qrCode;
	var theNum = 0;
	var codeStr = "";
	var index = 0;
	for(var i = 0; i < 5; i++) {
		codeStr += assetCode.substring(index, index + 5) + "-";
		index += 5;
	}
	codeStr = codeStr.substring(0, codeStr.length - 1);
	var assetName = Data.nameCn;
	var thePath = "../../../../" + Data.filePath;
	console.log(Data.filePath);
	htmlhead += "<div style='width:100%;padding:0px;height:339.4px'>";
	htmlhead += "<div style='width:100%;height:40px;text-align:center;font-size:16px;word-wrap: break-word;word-break: break-all;line-height:40px;padding-top:20px'>" + codeStr + "</div>";
	htmlhead += "<div style='width:100%;height:40px;text-align:center;font-size:16px;word-wrap: break-word;word-break: break-all;line-height:40px'>" + assetName + "</div>";
	htmlhead += "<div style='width:100%;height:259.4px;text-align:center;'><img src='" + thePath + "' style='margin-top:30px' width='200' height='200'/></div>";
	htmlhead += "</div>";
	//  var htmlFoot = '</body></html>'
	str += htmlhead + "</div>";
	$(".body-div-style").append(str);
	$("#printId").jqprint();
	//	newWindow.document.write(str);
	//  newWindow.print();
	//  newWindow.close();
}

//小号纸
function printQrCodeForSmall() {

	//	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	//	
	//	var htmlTitle = "<html id='aaaa'><head><meta charset='utf-8'><title>批量打印二维码</title></head><body>";
	$("#printId").remove();
	var htmlhead = "";
	var str = "<div id='printId'>";
	var assetCode = Data.qrCode;
	var theNum = 0;
	var codeStr = "";
	var index = 0;
	for(var i = 0; i < 5; i++) {
		codeStr += assetCode.substring(index, index + 5) + "-";
		index += 5;
	}
	codeStr = codeStr.substring(0, codeStr.length - 1);
	var assetName = Data.nameCn;
	//  	 alert(theData.filePath);
	var thePath = "../../../../" + Data.filePath;
	htmlhead += "<div style='width:100%;height:212.49x;'>";
	htmlhead += "<div style='width:100%;height:25px;text-align:center;font-size:10px;word-wrap: break-word;word-break: break-all;padding:0px 5px;padding-top:20px'>" + codeStr + "</div>";
	htmlhead += "<div style='width:100%;height:25px;text-align:center;font-size:10px;word-wrap: break-word;word-break: break-all;padding-top:30px'>" + assetName + "</div>";
	htmlhead += "<div style='width:100%;height:126.4px;text-align:center;margin-top:20px;'><img src='" + thePath + "' width='100' height='100'/></div>";
	htmlhead += "</div>";
	//  var htmlFoot = '</body></html>'
	str += htmlhead + "</div>";

	$(".body-div-style").append(str);
	$("#printId").jqprint();
	return;
	//	newWindow.document.write(str);
	//
	//  newWindow.print();
	//  newWindow.close();
	//  newWindow.reload();
}

$(document).ready(function() {
	$(".time-picker").datepicker("setValue");
	$(".time-picker").val("");
	searchSysInfos();
	//	$("#btnAddFacData").click(function(){
	//		$("#addDataModal").modal("show");
	//	})
	$("#btnSearchLablesPrint").click(function() {
			funLabelSearch();
		})
		//	$("#facSelect").change(function(){
		//		if(!$(this).val())
		//		{
		//			return;
		//		}
		//		funLabelSearch();
		//	})
		//	$("#assetType").change(function(){
		//		if(!$(this).val())
		//		{
		//			return;
		//		}
		//		funLabelSearch();
		//	})
	$("#btnPrintLabel").click(function() {
		if($(".each-CheckBox:checked").length == 0) {
			windowStart("请选择需要打印的标签", true);
			return;
		}
		//		printAllQrCode();
		key = 0;
		$("#pageSizeModal").modal("show");
	})
	$("#btnForPrintLabel").click(function() {
		$("#pageSizeModal").modal("hide");
		if(key == 1) {
			if(parseInt($("#pageSize").val()) == 1) {
				printQrCodeForSmall();
			} else {
				printQrCode();
			}
		} else {
			if(parseInt($("#pageSize").val()) == 1) {
				printAllQrCodeForSmall();
			} else {
				printAllQrCode();
			}
		}
	})

})