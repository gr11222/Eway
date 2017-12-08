var theObjData;
var projectSelect;
var removeData;
var theName = "";
var theProject = "";
var theId;
var theNote;
var topGroup;

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

//**************************查询下拉选择***********************************
function searchSysInfosPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询下拉选择传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	$("#select-company").html("");
	$("#select-project").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询下拉选择返回值=" + JSON.stringify(msg));
				createSysInfoSelect(msg);
				funLGSearch();
			} else {
				windowStart("查询下拉选择失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询下拉选择权限", false);
			} else {
				windowStart("查询下拉选择失败", false);
			}
		}
	})
}

function createSysInfoSelect(msg) {
	//公司
	if(msg.propertyItems != undefined && msg.propertyItems.length > 0) {
		var theData = msg.propertyItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#company").html(str);
		$("#companyName").html(str);

	}
	//项目
	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		projectSelect = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			projectSelect += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#project").html(projectSelect);
		$("#projectName").html(projectSelect);
		$("#addProjectName").html(projectSelect);
	}
	//资产类型
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
}

//***************************************树结构查询**************************
function funLGSearch() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupCompositeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: labelGroupSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				console.log(JSON.stringify(msg));
				createGroupTreeInfos(msg);
			}

		},
		error: function() {
			//	loadingStop();
			console.log("fail");
		}
	});
}

function labelGroupSearchPara() {
	var query = setJson(null, "code", "");
	query = setJson(query, "property", parseInt($("#company").val()));
	query = setJson(query, "project", parseInt($("#project").val()));
	query = setJson(query, "nameCn", $("#groupName").val());
	if($("#startTime").val() == "") {
		query = setJson(query, "insertTime", "");
	} else {
		query = setJson(query, "insertTime", $("#startTime").val() + " 00:00:00");
	}
	if($("#endTime").val() == "") {
		query = setJson(query, "endTime", "");
	} else {
		query = setJson(query, "endTime", $("#endTime").val() + " 23:59:59");
	}
	var jsonData = setJson(null, "resp", {});
	jsonData = setJson(jsonData, "tree", "", true);
	jsonData = setJson(jsonData, "query", eval("(" + query + ")"));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("标签分组信息传值=" + jsonData);
	return jsonData;

}

function createGroupTreeInfos(msg) {
	if(!msg.tree || msg.tree.length < 1) {
		$("#leftNav").html("");
		var str = "";
		str += '<div style="position:relative;width:100px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无分组信息";
		str += "</div>";
		$("#leftNav").html(str);
		$("#deviceList").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无分组和设备信息";
		str += "</div>";
		$("#deviceList").html(str);
		return;
	}
	//$("#leftNav").html("");
	var realDataone = msg.tree;
	var str = "<div id='treeRoot' onselectstart='return false' ondragstart='return false'>";
	for(var i = 0; i < realDataone.length; i++) {
		str += "<div class='treeNode' >";
		//		str += "<img theData='"+JSON.stringify(realDataone[i])+"' src='../img/right.png' onclick='theObjData=JSON.stringify('"+realDataone[i]+"');expandCollapse(this.parentNode)' class='treeLinkImage' parentNum='1'>";
		//		str += "<span theData='"+JSON.stringify(realDataone[i])+"'  class='category' onclick='expandCollapse(this.parentNode)'>" + realDataone[i]["nameCn"] + "</span>";
		//		
		str += "<img theNote='" + realDataone[i].note + "' theId='" + realDataone[i].id + "' theData='" + realDataone[i].code + "' theProject='" + realDataone[i].project + "' theName='" + realDataone[i].nameCn + "' src='../img/right.png' class='treeLinkImage img-one' >";
		str += "<span theNote='" + realDataone[i].note + "' theId='" + realDataone[i].id + "' theData='" + realDataone[i].code + "' theProject='" + realDataone[i].project + "' theName='" + realDataone[i].nameCn + "' class='category node-one'   >" + realDataone[i]["nameCn"] + "</span>";

		if(realDataone[i]["elem"].length > 0) {
			str += "<div class='treeSubnodesHidden'>";
			for(var m = 0; m < realDataone[i]["elem"].length; m++) {
				var realDatatwo = realDataone[i]["elem"];

				str += "<div class='treeNode' >";
				str += "<img theNote='" + realDatatwo[m].note + "' theId='" + realDatatwo[m].id + "' theData='" + realDatatwo[m].code + "' theProject='" + realDatatwo[m].project + "' theName='" + realDatatwo[m].nameCn + "' src='../img/right.png'  class='treeLinkImage img-two' >";
				str += "<span theNote='" + realDatatwo[m].note + "' theId='" + realDatatwo[m].id + "' theData='" + realDatatwo[m].code + "' theProject='" + realDatatwo[m].project + "' theName='" + realDatatwo[m].nameCn + "' class='category node-two' >" + realDatatwo[m]["nameCn"] + "</span>";
				if(realDatatwo[m]["elem"].length > 0) {
					str += "<div class='treeSubnodesHidden'>";
					for(var n = 0; n < realDatatwo[m]["elem"].length; n++) {
						var realDatathree = realDatatwo[m]["elem"];
						str += "<div class='treeNode'>";
						str += "<a href='#' theNote='" + realDatathree[n].note + "' theId='" + realDatathree[n].id + "' theData='" + realDatathree[n].code + "' theProject='" + realDatathree[n].project + "' class='treeUnselected node-three'  >" + realDatathree[n]["nameCn"] + "</a>";
						str += "</div>";
					}
					str += "</div>";
				}
				str += "</div>";

			}
			str += "</div>";
		}
		str += "</div>";
	}
	str += "</div>";
	$("#leftNav").html(str);
	$(".img-one").click(function() {
		$("#btnAddSubGroup").removeClass("hide");
		//		afterRemove=$(this).attr("theData");
		theObjData = $(this).attr("theData");
		theNote = $(this).attr("theNote");
		theId = $(this).attr("theId");
		theName = $(this).attr("theName");
		theProject = $(this).attr("theProject");
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		$("#groupInfosQr").text("");
		expandCollapse(this.parentNode);
		funGroupDeviceSearch();
	})
	$(".node-one").click(function() {
		$("#btnAddSubGroup").removeClass("hide");
		//		afterRemove=$(this).attr("theData");
		theObjData = $(this).attr("theData");
		theNote = $(this).attr("theNote");
		theId = $(this).attr("theId");
		theName = $(this).attr("theName");
		theProject = $(this).attr("theProject");
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		$("#groupInfosQr").text("");
		expandCollapse(this.parentNode);
		funGroupDeviceSearch();
	})
	$(".img-two").click(function() {
		$("#btnAddSubGroup").removeClass("hide");
		theObjData = $(this).attr("theData");
		theNote = $(this).attr("theNote");
		theId = $(this).attr("theId");
		theName = $(this).attr("theName");
		theProject = $(this).attr("theProject");
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		$("#groupInfosQr").text("");
		expandCollapse(this.parentNode);
		funGroupDeviceSearch();
	})
	$(".node-two").click(function() {
		$("#btnAddSubGroup").removeClass("hide");
		theObjData = $(this).attr("theData");
		theNote = $(this).attr("theNote");
		theId = $(this).attr("theId");
		theName = $(this).attr("theName");
		theProject = $(this).attr("theProject");
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		$("#groupInfosQr").text("");
		expandCollapse(this.parentNode);
		funGroupDeviceSearch();
	})
	$(".node-three").click(function() {
		$("#btnAddSubGroup").addClass("hide");
		theObjData = $(this).attr("theData");
		theNote = $(this).attr("theNote");
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		$("#groupInfosQr").text("");
		clickAnchor(this);
		funGroupDeviceSearch();
	})
}

//------------------------------时间校验---------------------------
function funDateCheck() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;

	if($("#endTime").val().length > 0) {
		if($("#startTime").val().length == 0) {
			windowStart("请输入开始时间", true);
			return false;
		}
		if(!timeReg.test($("#startTime").val())) {
			windowStart("开始时间格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if($("#startTime").val().length > 0) {
		if($("#endTime").val().length == 0) {
			windowStart("请输入结束时间", true);
			return false;
		}
		if(!timeReg.test($("#endTime").val())) {
			windowStart("结束时间格式不正确,正确的日期格式为yyyy-mm-dd", false);
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

//------------------------------资产查询---------------------------
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
	query = setJson(query, "sign", 1);
	jsonData = setJson(jsonData, "query", eval("(" + query + ")"));
	jsonData = setJson(jsonData, "items", "", true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//  var jsonData='{"query":{"enterprise":"","project":"","nameCn":"","classifyId":-1,"companyId":-1,"deviceModel":"","startTime":"","endTime":"","sign":-1},"userAccountName":"ZFZero"}';
	console.log("资产查询传值=" + jsonData);
	return jsonData;
}

function funLabelSearch() {
	assetDataLength = 0;
	selectDataLength = 0;

	$("#listPart").html("");
	loadingStart("listPart");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagBasicInfoPrintCmd",
		contentType: "application/text,charset=utf-8",
		data: funLabelSearchPara(),
		success: function(msg) {

			loadingStop();
			console.log("查询分组设备返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#dataContent").html("");
				createLabelTableInfos(msg);
			} else {
				windowStart("查询分组设备失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();

			//			createLabelTableInfos();
			//			windowStart("查询标签信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询分组设备权限", false);
			} else {
				windowStart("查询分组设备失败", false);
			}
			console.log("fail");
		}
	})
}

function createLabelTableInfos(msg) {

	if(!msg.items || msg.items.length < 1) {
		$("#listPart").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无标签信息";
		str += "</div>";
		$("#listPart").html(str);
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
	str += "<th class='text-center'><input type='checkbox' id='allCheckBox'>  全选</th>";
	//str += "<th class='' ><div class='CheckBox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	//str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center'>资产名称</th>";
	str += "<th class='text-center'>英文名称</th>";
	str += "<th class='text-center'>资产类型</th>";
	str += "<th class='text-center'>服务商</th>";
	str += "<th class='text-center'>资产型号</th>";
	str += "<th class='text-center'>所属建筑</th>";
	str += "<th class='text-center'>安装位置</th>";
	str += "<th class='text-center'>创建时间</th>";
	str += "<th class='text-center'>标签编号</th>";
	//str += "<th class='text-center'>操作</th>";
	str += "</tr></thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var theData = JSON.stringify(realData[i]);
		str += "<tr class='the-qrcode-class' theData='" + JSON.stringify(realData[i]) + "'>";
		str += "<td class='text-center' style='width:10%;'><input   data='" + theData + "' theId='" + realData[i]["id"] + "' type='checkbox' class='each-CheckBox'><span style='padding-left:5px'>" + (i + 1) + "</span></td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameEn"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["type"] + "</td>";
		str += "<td class='text-center' style='width: 8%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["company"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceModel"] + "</td>";
		str += "<td class='text-center' style='width: 7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["building"] + "</td>";
		str += "<td class='text-center' style='width: 13%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["position"] + "</td>";
		str += "<td class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["time"] + "</td>";
		str += "<td class='text-center' style='width: 20%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["qrCode"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#listPart").html(str);
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
		$("#qrcodeWatch").attr("src", "../../../../" + theData.filePath);
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

//*************************************各分组的设备列表*************************************
function funGroupDeviceSearchPara() {
	var jsonData = setJson(null, "resp", {});
	jsonData = setJson(jsonData, "groupCode", theObjData);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("设备列表查询传值=" + jsonData);
	return jsonData;
}

function funGroupDeviceSearch() {
	$("#deviceList").html("");
	loadingStart("deviceList");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupLabelSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGroupDeviceSearchPara(),
		success: function(msg) {

			loadingStop();
			console.log("查询设备列表返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#deviceList").html("");
				var realData = msg.item;
				var theData = JSON.stringify(realData[0]);
				topGroup = theData;
				createGroupDeviceTableInfos(msg);
			} else {
				windowStart("查询标签信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
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

function createGroupDeviceTableInfos(msg) {

	if(!msg.item || msg.item.length < 1) {
		$("#deviceList").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无分组和设备信息";
		str += "</div>";
		$("#deviceList").html(str);
		return;
	}

	var realData = msg.item;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<tr>";
	//str += "<th class='text-center'><input type='checkbox' id='allCheckBox'>  全选</th>";
	//str += "<th class='' ><div class='CheckBox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center'>名称</th>";
	str += "<th class='text-center'>创建时间</th>";
	str += "<th class='text-center'>标签编号</th>";
	str += "</tr></thead><tbody>";
	for(var i = 1; i < realData.length; i++) {
		var theData = JSON.stringify(realData[i]);
		str += "<tr class='the-qrcode-class' lableId='" + realData[i]["qr"] + "'>";
		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["insertTime"] + "</td>";
		if(realData[i]["qr"] != undefined && realData[i]["qr"].length > 0) {
			str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;' >" + realData[i]["qr"] + "</td>";
		} else {
			str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'></td>";
		}

		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#deviceList").html(str);
	$(".the-qrcode-class").click(function() {
		var id = $(this).attr("lableId");
		funDeviceList(id);
	})
}
//*******************************设备列表*******************************
function funDeviceList(id) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDataStatisticsGroupByAlarmCmd",
		contentType: "application/text,charset=utf-8",
		data: deviceListPara(id),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#routeModal").modal("show");
				createDeviceInfos(msg);
				console.log(JSON.stringify(msg));
			}
		},
		error: function() {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无移除分组权限", false);
			} else {
				windowStart("移除分组失败", false);
			}
			console.log("fail");
		}
	});
}

function deviceListPara(id) {
	var jsonData = setJson(null, "lableId", id);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("设备列表查询传值=" + jsonData);
	return jsonData;
}

function createDeviceInfos(msg) {

	if(!msg.item || msg.item.length < 1) {
		$("#listPart").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无报警信息";
		str += "</div>";
		$("#listPart").html(str);
		return;
	}

	var headData = msg.temitems;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<tr>";
	//str += "<th class='text-center'><input type='checkbox' id='allCheckBox'>  全选</th>";
	//str += "<th class='' ><div class='CheckBox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
		str += "<th class='text-center'>报警编号</th>";
		str += "<th class='text-center'>报警设备</th>";
		str += "<th class='text-center'>报警参数</th>";
		str += "<th class='text-center'>报警状态</th>";
		str += "<th class='text-center'>报警人</th>";
		str += "<th class='text-center'>报警时间</th>";

	str += "</tr></thead><tbody>";
	for(var i = 1; i < realData.length; i++) {
//		var theData = JSON.stringify(realData[i]);
		str += "<tr class='the-qrcode-class' >";
//		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["alarmCode"] + "</td>";
		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["alarmDevName"] + "</td>";
		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["alarmProperty"] + "</td>";
		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["aclState"] + "</td>";
		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["alarmUser"] + "</td>";
		str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["alarmTime"] + "</td>";
//		if(realData[i]["qr"] != undefined && realData[i]["qr"].length > 0) {
//			str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;' >" + realData[i]["qr"] + "</td>";
//		} else {
//			str += "<td class='text-center' style='width: 33%;word-wrap: break-word;word-break: break-all;'></td>";
//		}
//
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#listPart").html(str);
}
//*************************************树*************************************
var treeSelected = null; //选中的树节点
var imgPlus = new Image();
imgPlus.src = "../img/right.png";
var imgMinus = new Image();
imgMinus.src = "../img/bottom.png";

function expandCollapse(el) {
	//如果父节点有字节点（class 属性为treeSubnodesHidden），展开所有子节点
	if(el.className != "treeNode") {

		return; //判断父节点是否为一个树节点，如果树节点不能展开，请检查是否节点的class属性是否为treeNode
	}
	//	parentNum=$(this).attr("parentNum");
	var child;
	var imgEl; //图片子节点，在树展开时更换图片
	for(var i = 0; i < el.childNodes.length; i++) {
		child = el.childNodes[i];
		if(child.src) {
			imgEl = child;
		} else if(child.className == "treeSubnodesHidden") {
			child.className = "treeSubnodes"; //原来若隐藏，则展开
			imgEl.src = imgMinus.src; //更换图片
			break;
		} else if(child.className == "treeSubnodes") {
			child.className = "treeSubnodesHidden"; //原来若展开，则隐藏
			imgEl.src = imgPlus.src; //更换图片
			break;
		}
	}

}

//子节点点击事件，设置选中节点的样式
function clickAnchor(el) {
	selectNode(el.parentNode);
	el.blur();
}

function selectNode(el) {
	if(treeSelected != null) {
		setSubNodeClass(treeSelected, 'A', 'treeUnselected');
	}
	setSubNodeClass(el, 'A', 'treeSelected');
	treeSelected = el;

}

function setSubNodeClass(el, nodeName, className) {
	var child;
	for(var i = 0; i < el.childNodes.length; i++) {
		child = el.childNodes[i];
		if(child.nodeName == nodeName) {
			child.className = className;
			break;
		}
	}
}
//*************************************树end*************************************

$(document).ready(function() {
	$(".input-style-time").datepicker("setValue");
	$(".input-style-time").val("");
	searchSysInfos();
	$("#btnAddGroup").click(function() {
		$("#addProjectName").html(projectSelect);
		$("#addGroupName").val("");
		$("#addNote").val("");
		$("#addGroupModal").modal("show");
	})
	$("#btnAddSubGroup").click(function() {
		if(theName == "") {
			windowStart("请选择主分组", false);
			return;
		}
		$("#parentGroup").text(theName);
		$("#addSubGroupName").val("");
		$("#addSubNote").val("");
		$("#addSubGroupModal").modal("show");
	})
	$("#btnClose").click(function() {
		$("#addDeviceModal").modal("hide");
	})
	$("#btnAddDeviceBtn").click(function() {
		if(theName == "") {
			windowStart("请选择主分组", false);
			return;
		}
		$("#addDeviceModal").modal("show");
		funLabelSearch();
	})
	$("#btnDelGroup").click(function() {
		if(theName == "") {
			windowStart("请选择主分组", false);
			return;
		}
		removeData = topGroup;
		funLGRemoveGroup();
	})
	$("#btnSearchLabelGroup").click(function() {
		if(!funDateCheck()) {
			return;
		}
		loadingStart("data");
		funLGSearch();
	})
	$("#btnAddRealBtn").click(function() {
		if($("#addProjectName").val() == "-1") {
			windowStart("请先选择一个项目", false);
			return;
		}
		if($("#addGroupName").val() == "") {
			windowStart("分组名称不能为空", false);
			return;
		}
		funLGAdd();
	})
	$("#btnAddSubRealBtn").click(function() {
		if($("#addSubGroupName").val() == "") {
			windowStart("分组名称不能为空", false);
			return;
		}
		funLGAddSub();
	})
	$("#btnSearchDevice").click(function() {
		if(!funDateCheck()) {
			return;
		}
		funLabelSearch();
	})
	$("#btnAddDevice").click(function() {
		if(theName == "") {
			windowStart("请选择要添加资产的分组", false);
			return;
		}
		funLGAddDevice();
	})
})