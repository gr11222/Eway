var theObjData;
var projectSelect;
//var afterRemove;
var removeData;
var theName = "";
var theProject = "";
var theId;
var theNote;
var topGroup;
var theQrCode;

var project1;
var groupname1;
var note1;

var project2;
var groupname2;
var note2;

var sonOrPar;
var qcode;
function setJson(jsonStr, name, value, array) {
	if (!jsonStr) jsonStr = "{}";
	var jsonObj = JSON.parse(jsonStr);
	if (array) {
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
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询下拉选择返回值=" + JSON.stringify(msg));
				createSysInfoSelect(msg);
				funLGSearch();
			} else {
				windowStart("查询下拉选择失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询下拉选择权限", false);
			} else {
				windowStart("查询下拉选择失败", false);
			}
		}
	})
}

function createSysInfoSelect(msg) {
	//公司
	if (msg.propertyItems != undefined && msg.propertyItems.length > 0) {
		var theData = msg.propertyItems;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#company").html(str);
		$("#companyName").html(str);

	}
	//项目
	if (msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		projectSelect = "<option value='-1'>请选择</option>";
		for (var i = 0; i < theData.length; i++) {
			projectSelect += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#project").html(projectSelect);
		$("#projectName").html(projectSelect);
		$("#addProjectName").html(projectSelect);
	}
	//资产类型
	if (msg.DeviceItems != undefined && msg.DeviceItems.length > 0) {
		var theData = msg.DeviceItems;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";

		}
		$("#assetType").html(str);
		//		$("#editassetTypeModal").html(str);
	}
	if (msg.CompanyItems != undefined && msg.CompanyItems.length > 0) {
		var theData = msg.CompanyItems;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 0; i < theData.length; i++) {
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
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: labelGroupSearchPara(),
		success: function(msg) {
				var str = '<div style="position:relative;width:100%;top:40%;font-size: 30px;font-weight: bold;text-align:center;">';
				str += '请选择分组，以查询分组和设备信息！';
				str += '</div>';
				$("#deviceList").html(str);
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
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
	// var query = setJson(null, "code", "");
	// query = setJson(query, "property", parseInt($("#company").val()));
	// query = setJson(query, "project", parseInt($("#project").val()));
	// query = setJson(query, "nameCn", $("#groupName").val());
	// if ($("#startTime").val() == "") {
	// 	query = setJson(query, "insertTime", "");
	// } else {
	// 	query = setJson(query, "insertTime", $("#startTime").val() + " 00:00:00");
	// }
	// if ($("#endTime").val() == "") {
	// 	query = setJson(query, "endTime", "");
	// } else {
	// 	query = setJson(query, "endTime", $("#endTime").val() + " 23:59:59");
	// }
	var startTime;
	if ($("#startTime").val() == "") {
		startTime = "";
	} else {
		startTime = $("#startTime").val() + " 00:00:00";
	}
	var endTime;
	if ($("#endTime").val() == "") {
		endTime = "";
	} else {
		endTime = $("#endTime").val() + " 23:59:59";
	}
	var jsonData = setJson(null, "companyId", parseInt($("#company").val()));
	jsonData = setJson(jsonData, "projectId", parseInt($("#project").val()));
	jsonData = setJson(jsonData, "groupCN", $("#groupName").val());
	jsonData = setJson(jsonData, "startTime", startTime);
	jsonData = setJson(jsonData, "endTime", endTime);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("标签分组信息传值=" + jsonData);
	return jsonData;

}

function createGroupTreeInfos(msg) {
	if (!msg.item || msg.item.length < 1) {
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
	var realDataone = msg.item;
	var str = "<div id='treeRoot' onselectstart='return false' ondragstart='return false'>";
	for (var i = 0; i < realDataone.length; i++) {
		str += "<div class='treeNode' >";
		//		str += "<img theData='"+JSON.stringify(realDataone[i])+"' src='../img/right.png' onclick='theObjData=JSON.stringify('"+realDataone[i]+"');expandCollapse(this.parentNode)' class='treeLinkImage' parentNum='1'>";
		//		str += "<span theData='"+JSON.stringify(realDataone[i])+"'  class='category' onclick='expandCollapse(this.parentNode)'>" + realDataone[i]["nameCn"] + "</span>";
		//		
		str += "<img theQr='"+realDataone[i].qrCode+"' theNote='" + realDataone[i].remark + "' theId='" + realDataone[i].groupId + "' theData='" + realDataone[i].groupCode + "' theProject='" + realDataone[i].projectId + "' theName='" + realDataone[i].groupCN + "' src='../img/right.png' class='treeLinkImage img-one' >";
		str += "<span theQr='"+realDataone[i].qrCode+"' theNote='" + realDataone[i].remark + "' theId='" + realDataone[i].groupId + "' theData='" + realDataone[i].groupCode + "' theProject='" + realDataone[i].projectId + "' theName='" + realDataone[i].groupCN + "' class='category node-one'   >" + realDataone[i]["groupCN"] + "</span>";

		if (realDataone[i]["elem"]!=undefined && realDataone[i]["elem"].length > 0) {
			str += "<div class='treeSubnodesHidden'>";
			for (var m = 0; m < realDataone[i]["elem"].length; m++) {
				var realDatatwo = realDataone[i]["elem"];

				str += "<div class='treeNode' >";
				str += "<img theQr='"+realDataone[i].qrCode+"' theNote='" + realDatatwo[m].remark + "' theId='" + realDatatwo[m].groupId + "' theData='" + realDatatwo[m].groupCode + "' theProject='" + realDatatwo[m].projectId + "' theName='" + realDatatwo[m].groupCN + "' src='../img/right.png'  class='treeLinkImage img-two' >";
				str += "<span theQr='"+realDataone[i].qrCode+"' theNote='" + realDatatwo[m].remark + "' theId='" + realDatatwo[m].groupId + "' theData='" + realDatatwo[m].groupCode + "' theProject='" + realDatatwo[m].projectId + "' theName='" + realDatatwo[m].groupCN + "' class='category node-two' >" + realDatatwo[m]["groupCN"] + "</span>";
				if (realDatatwo[m]["elem"]!=undefined && realDatatwo[m]["elem"].length > 0) {
					str += "<div class='treeSubnodesHidden'>";
					for (var n = 0; n < realDatatwo[m]["elem"].length; n++) {
						var realDatathree = realDatatwo[m]["elem"];
						str += "<div class='treeNode'>";
						str += "<a href='#' theQr='"+realDataone[i].qrCode+"' theNote='" + realDatathree[n].remark + "' theId='" + realDatathree[n].groupId + "' theData='" + realDatathree[n].groupCode + "' theProject='" + realDatathree[n].projectId + "' class='treeUnselected node-three'  >" + realDatathree[n]["groupCN"] + "</a>";
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
		theQrCode= $(this).attr("theQr");
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		$("#groupInfosQr").text(theQrCode);
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
		theQrCode= $(this).attr("theQr");
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		$("#groupInfosQr").text(theQrCode);
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
		theQrCode= $(this).attr("theQr");
		$("#groupInfosQr").text(theQrCode);
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
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
		theQrCode= $(this).attr("theQr");
		$("#groupInfosQr").text(theQrCode);
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		expandCollapse(this.parentNode);
		funGroupDeviceSearch();
	})
	$(".node-three").click(function() {
		$("#btnAddSubGroup").addClass("hide");
		theObjData = $(this).attr("theData");
		theNote = $(this).attr("theNote");
		theQrCode= $(this).attr("theQr");
		$("#groupInfosQr").text(theQrCode);
		$("#groupInfosName").text(theName);
		$("#groupInfosNote").text(theNote);
		clickAnchor(this);
		funGroupDeviceSearch();
	})
}

//-------------------------------------------新建分组------------------------------
function funLGAdd() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupAddCmd",
		contentType: "application/text,charset=utf-8",
		data: labelGroupAddPara(),
		success: function(msg) {
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("新建分组成功", true);
				$("#addGroupModal2").modal("hide");
				funLGSearch();
				console.log(JSON.stringify(msg));

			}else{
				windowStart("新建分组失败", false);
			}
		},
		error: function() {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无新建分组权限", false);
			} else {
				windowStart("新建分组失败", false);
			}
			console.log("fail");
		}
	});
}

function labelGroupAddPara() {
	var item = setJson(null, "projectId", parseInt(project1));
	item = setJson(item, "groupCN", groupname1);
	item = setJson(item, "remark", note1);
	item = setJson(item, "qrCode", qcode);
	item = setJson(item, "fatherId", 0);
	item = setJson(item, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("新建分组信息传值=" + item);
	return item;

}

//-------------------------------------------新建子分组------------------------------
function funLGAddSub() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupAddCmd",
		contentType: "application/text,charset=utf-8",
		data: labelGroupAddSubPara(),
		success: function(msg) {
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("新建子分组成功", true);
				funLGSearch();
				$("#addGroupModal2").modal("hide");
				console.log(JSON.stringify(msg));

			}else{
				windowStart("新建子分组失败", false);
			}
		},
		error: function() {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无新建子分组权限", false);
			} else {
				windowStart("新建子分组失败", false);
			}
			console.log("fail");
		}
	});
}

function labelGroupAddSubPara() {
	var item = setJson(null, "projectId", theProject);
	item = setJson(item, "groupCN", groupname2);
	item = setJson(item, "remark", note2);
	item = setJson(item, "qrCode", qcode);
	item = setJson(item, "fatherId", theId);
	item = setJson(item, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("新建子分组信息传值=" + item);
	return item;
}

//------------------------------时间校验---------------------------
function funDateCheck() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	if ($("#startTime").val().length > 0) {
		if (!timeReg.test($("#startTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if ($("#endTime").val().length > 0) {
		if (!timeReg.test($("#endTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if ($("#startTime").val().length > 0 && $("#endTime").val().length > 0) {
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if (parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间", false);
			return false;
		}
	}
	return true;
}

function funAlertDateCheck() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	if ($("#startTime1").val().length > 0) {
		if (!timeReg.test($("#startTime1").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if ($("#endTime1").val().length > 0) {
		if (!timeReg.test($("#endTime1").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if ($("#startTime1").val().length > 0 && $("#endTime1").val().length > 0) {
		var startTime = $("#startTime1").val().split("-");
		var endTime = $("#endTime1").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if (parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
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
	var query = setJson(null, "enterprise", $("#companyName").val());
	query = setJson(query, "project", theProject);
	query = setJson(query, "nameCn", $("#assetName").val());
	query = setJson(query, "classifyId", parseInt($("#assetType").val()));
	query = setJson(query, "companyId", parseInt($("#facilitator").val()));
	query = setJson(query, "deviceModel", $("#assetModel").val());
	if ($("#startTime1").val() == "") {
		query = setJson(query, "startTime", $("#startTime1").val());
	} else {
		query = setJson(query, "startTime", $("#startTime1").val() + " 00:00:00");
	}
	if ($("#endTime1").val() == "") {
		query = setJson(query, "endTime", $("#endTime1").val());
	} else {
		query = setJson(query, "endTime", $("#endTime1").val() + " 23:59:59");
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
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
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
			if (xmlRequest == "401") {
				windowStart("当前用户无查询分组设备权限！", false);
			} else {
				windowStart("查询分组设备失败", false);
			}
			console.log("fail");
		}
	})
}

function createLabelTableInfos(msg) {

	if (!msg.items || msg.items.length < 1) {
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
	for (var i = 0; i < realData.length; i++) {
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
		if ($(this).prop("checked")) {
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
		if ($(this).prop("checked")) {
			selectDataLength++;
			if (selectDataLength == assetDataLength) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		} else {
			selectDataLength--;
			if (selectDataLength == assetDataLength) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		}
	})
	$(".delete-qrcode").click(function(e) {
		var e = e || event;
		e.stopPropagation();
		if (!confirm("是否确认删除?")) {
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

//*******************************添加资产*******************************
function funLGAddDevice() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupAssetAddCmd",
		contentType: "application/text,charset=utf-8",
		data: labelGroupAddDevicePara(),
		success: function(msg) {
			console.log(JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("已添加资产不能再次添加！", false);
				return;

			}
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("添加资产成功", true);
				$("#addDeviceModal").modal("hide");
				funGroupDeviceSearch();

			}
		},
		error: function() {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无添加资产权限", false);
			} else {
				windowStart("添加资产失败", false);
			}
			console.log("fail");
		}
	});
}

function labelGroupAddDevicePara() {
	var dataArr = [];
	var jsonData = setJson(null, "groupId", theId);
	for (var i = 0; i < $(".each-CheckBox:checked").length; i++) {
		var theData = eval("(" + $(".each-CheckBox:checked").eq(i).attr("theId") + ")");
		dataArr.push(theData);
	}
	jsonData = setJson(jsonData, "assetId", dataArr);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加资产传值=" + jsonData);
	return jsonData;
}

//*************************************各分组的设备列表*************************************
function funGroupDeviceSearchPara() {
	var jsonData = setJson(null, "groupId", parseInt(theId));
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
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupAssetSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGroupDeviceSearchPara(),
		success: function(msg) {

			loadingStop();
			console.log("查询设备列表返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#deviceList").html("");
				// var realData = msg.item;
				// var theData = JSON.stringify(realData[0]);
				// topGroup = theData;
				createGroupDeviceTableInfos(msg);
			} else {
				windowStart("查询标签信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询标签信息权限", false);
			} else {
				windowStart("查询标签信息失败", false);
			}
			console.log("fail");
		}
	})
}

function createGroupDeviceTableInfos(msg) {
	if (!msg.item || msg.item.length < 2) {
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
	str += "<th class='text-center'>名称</th>";
	str += "<th class='text-center'>创建时间</th>";
	str += "<th class='text-center'>标签编号</th>";
	str += "<th class='text-center'>操作</th>";
	str += "</tr></thead><tbody>";
	for (var i = 1; i < realData.length; i++) {
		var theData = JSON.stringify(realData[i]);
		str += "<tr class='the-qrcode-class' >";
		str += "<td class='text-center' style='width: 20%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center' style='width: 30%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["dateTiem"] + "</td>";
		str += "<td class='text-center' style='width: 30%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["qrCode"] + "</td>";
		// if (realData[i]["qr"] != undefined && realData[i]["qr"].length > 0) {
		// 	str += "<td class='text-center' style='width: 30%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["qrCode"] + "</td>";
		// } else {
		// 	str += "<td class='text-center' style='width: 30%;word-wrap: break-word;word-break: break-all;'></td>";
		// }
		if (parseInt(realData[i]["isGroup"]) == 1) {
			str += "<td class='text-center' style='width: 20%;word-wrap: break-word;word-break: break-all;'><a data='" + theData + "' theId='" + realData[i]["itemId"] + "'  href='javascript:void(0)' class='delGroup'  >分组失效</a>";
		} else {
			str += "<td class='text-center' style='width: 20%;word-wrap: break-word;word-break: break-all;'><a data='" + theData + "' theId='" + realData[i]["itemId"] + "'  href='javascript:void(0)' class='delDevice'  >移除设备</a>";
		}

		str += "</tr>";
	}
	str += "</tbody><table>";
	// console.log(realData[0]["qrCode"]);
	// $("#groupInfosQr").html(realData[0]["qrCode"])
	$("#deviceList").html(str);
	$(".delGroup").click(function() {
		removeData = $(this).attr("theId");
		funLGRemoveSubGroup();
	})
	$(".delDevice").click(function() {
		removeData = $(this).attr("theId");
		funLGRemoveDevice();
	})
}

//*******************************移除主分组*******************************
function funLGRemoveGroup() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupInvalidCmd",
		contentType: "application/text,charset=utf-8",
		data: labelGroupRemoveGroupPara(),
		success: function(msg) {
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("分组失效成功", true);
				//				afterRemove=theObjData;
				funLGSearch();
				$("#deviceList").html("");
				var str = "";
				str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
				str += "提示:<br/>当前条件下无分组和设备信息";
				str += "</div>";
				$("#deviceList").html(str);
				console.log(JSON.stringify(msg));
			}
		},
		error: function() {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无分组失效权限", false);
			} else {
				windowStart("分组失效失败", false);
			}
			console.log("fail");
		}
	});
}

function labelGroupRemoveGroupPara() {
	// var data = eval("(" + removeData + ")");
	var jsonData = setJson(null, "groupId", theId);
	// jsonData = setJson(jsonData, "id", parseInt(data.id));
	// jsonData = setJson(jsonData, "parent", "");
	// jsonData = setJson(jsonData, "property", "-1");
	// jsonData = setJson(jsonData, "project", -1);
	// jsonData = setJson(jsonData, "nameEn", "");
	// jsonData = setJson(jsonData, "nameCn", data.nameCn);
	// jsonData = setJson(jsonData, "note", "");
	// jsonData = setJson(jsonData, "isLeaf", "");
	// jsonData = setJson(jsonData, "insertTime", data.insertTime);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	// jsonData = setJson(jsonData, "elem", "", true);
	console.log("分组失效传值=" + jsonData);

	return jsonData;
}

//*******************************移除子分组*******************************
function funLGRemoveSubGroup() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupInvalidCmd",
		contentType: "application/text,charset=utf-8",
		data: labelGroupRemoveSubGroupPara(),
		success: function(msg) {
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("分组失效成功", true);
				//				afterRemove=theObjData;
				funLGSearch();
				$("#deviceList").html("");
				var str = "";
				str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
				str += "提示:<br/>当前条件下无分组和设备信息";
				str += "</div>";
				$("#deviceList").html(str);
				console.log(JSON.stringify(msg));
			}
		},
		error: function() {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无分组失效权限", false);
			} else {
				windowStart("分组失效失败", false);
			}
			console.log("fail");
		}
	});
}

function labelGroupRemoveSubGroupPara() {
	// var data = eval("(" + removeData + ")");
	var jsonData = setJson(null, "groupId", removeData);
	// jsonData = setJson(jsonData, "id", parseInt(data.id));
	// jsonData = setJson(jsonData, "parent", "");
	// jsonData = setJson(jsonData, "property", "-1");
	// jsonData = setJson(jsonData, "project", -1);
	// jsonData = setJson(jsonData, "nameEn", "");
	// jsonData = setJson(jsonData, "nameCn", data.nameCn);
	// jsonData = setJson(jsonData, "note", "");
	// jsonData = setJson(jsonData, "isLeaf", "");
	// jsonData = setJson(jsonData, "insertTime", data.insertTime);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	// jsonData = setJson(jsonData, "elem", "", true);
	console.log("分组失效传值传值=" + jsonData);

	return jsonData;
}

//*******************************移除设备*******************************
function funLGRemoveDevice() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagGroupAssetDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: labelGroupRemoveDevicePara(),
		success: function(msg) {
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("移除设备成功", true);
				//				 afterRemove=theObjData;
				funGroupDeviceSearch();
				console.log(JSON.stringify(msg));

			}
		},
		error: function() {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无移除设备权限", false);
			} else {
				windowStart("移除设备失败", false);
			}
			console.log("fail");
		}
	});
}

function labelGroupRemoveDevicePara() {
	// var data = eval("(" + removeData + ")");
	// var item = setJson(null, "id", parseInt(data.id));
	// item = setJson(item, "nameCn", data.nameCn);
	// item = setJson(item, "insertTime", data.insertTime);
	// item = setJson(item, "qr", data.qr);
	// item = setJson(item, "sign", -1);
	// item = setJson(item, "note", "");
	var jsonData = setJson(null, "groupId", parseInt(theId));
	jsonData = setJson(jsonData, "assetId", parseInt(removeData));
	// jsonData = setJson(jsonData, "groupCode", theObjData);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("移除设备传值=" + jsonData);
	return jsonData;
}

//*************************************树*************************************
var treeSelected = null; //选中的树节点
var imgPlus = new Image();
imgPlus.src = "../img/right.png";
var imgMinus = new Image();
imgMinus.src = "../img/bottom.png";

function expandCollapse(el) {
	//如果父节点有字节点（class 属性为treeSubnodesHidden），展开所有子节点
	if (el.className != "treeNode") {

		return; //判断父节点是否为一个树节点，如果树节点不能展开，请检查是否节点的class属性是否为treeNode
	}
	//	parentNum=$(this).attr("parentNum");
	var child;
	var imgEl; //图片子节点，在树展开时更换图片
	for (var i = 0; i < el.childNodes.length; i++) {
		child = el.childNodes[i];
		if (child.src) {
			imgEl = child;
		} else if (child.className == "treeSubnodesHidden") {
			child.className = "treeSubnodes"; //原来若隐藏，则展开
			imgEl.src = imgMinus.src; //更换图片
			break;
		} else if (child.className == "treeSubnodes") {
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
	if (treeSelected != null) {
		setSubNodeClass(treeSelected, 'A', 'treeUnselected');
	}
	setSubNodeClass(el, 'A', 'treeSelected');
	treeSelected = el;

}

function setSubNodeClass(el, nodeName, className) {
	var child;
	for (var i = 0; i < el.childNodes.length; i++) {
		child = el.childNodes[i];
		if (child.nodeName == nodeName) {
			child.className = className;
			break;
		}
	}
}


function getInfoAssetPara() {
	var buildingNum = -1;
	var assetId = -1;

	var resp = setJson(null, "requestCommand", "");
	resp = setJson(resp, "responseCommand", "")
	var jsonData = setJson(null, "resp", eval("(" + resp + ")"));
	var query = setJson(null, "enterprise","");
	query = setJson(query, "project", theProject);
	query = setJson(query, "nameCn", $("#userName").val());
	query = setJson(query, "classifyId", -1);
	query = setJson(query, "companyId", -1);
	query = setJson(query, "deviceModel", "");
	// if ($("#startTime1").val() == "") {
		query = setJson(query, "startTime", "");
	// } else {
	// 	query = setJson(query, "startTime", $("#startTime1").val() + " 00:00:00");
	// }
	// if ($("#endTime1").val() == "") {
		query = setJson(query, "endTime", "");
	// } else {
	// 	query = setJson(query, "endTime", $("#endTime1").val() + " 23:59:59");
	// }
	query = setJson(query, "sign", 1);
	jsonData = setJson(jsonData, "query", eval("(" + query + ")"));
	jsonData = setJson(jsonData, "items", "", true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//  var jsonData='{"query":{"enterprise":"","project":"","nameCn":"","classifyId":-1,"companyId":-1,"deviceModel":"","startTime":"","endTime":"","sign":-1},"userAccountName":"ZFZero"}';
	console.log("资产查询传值=" + jsonData);
	return jsonData;
}

function getInfoAsset() {
	assetDataLength = 0;
	selectDataLength = 0;
	$("#modalTable2").html("");
	loadingStart("modalTable2");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagBasicInfoPrintCmd",
		contentType: "application/text,charset=utf-8",
		data: getInfoAssetPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询分组设备返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				makeTable(msg);
			} else {
				windowStart("查询分组设备失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询分组设备权限！", false);
			} else {
				windowStart("查询分组设备失败", false);
			}
			console.log("fail");
		}
	})
}
function makeTable(msg){
	qcode = 0;
	var realData = msg.items;
	if(realData.length==0){
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无资产信息";
		str += "</div>";
		$("#modalTable2").html(str);
		return;
	}
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='margin-top:10px;'><thead>";
	str += "<th class='' style='width:10%'>选择</th>";
	str += "<th class='text-center td-width'>资产名称</th>";
	str += "<th class='text-center td-width'>资产类型</th>";
	// str += "<th class='text-center td-width'>备注</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr>";
		str += "<td class='' style='width:6%'><input theId='" + realData[i]["qrCode"] + "' type='radio' name='3' class='each-checkbox3'/ ></td>";
		str += "<td class='text-center' title='" + realData[i]["nameCn"] + "'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center td-width' title='" + realData[i]["type"] + "'>" + realData[i]["type"] + "</td>";
		// str += "<td class='text-center td-width' title='" + realData[i]["note"] + "'>" + realData[i]["note"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#modalTable2").html(str);
	$(".each-checkbox3").click(function(){
		qcode = $(this).attr('theId');
	})
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
		sonOrPar = 1;
	})
	$("#btnAddSubGroup").click(function() {
		if (theName == "") {
			windowStart("请选择主分组", false);
			return;
		}
		$("#parentGroup").text(theName);
		$("#addSubGroupName").val("");
		$("#addSubNote").val("");
		sonOrPar = 0;
		$("#addSubGroupModal").modal("show");
	})
	$("#btnClose").click(function() {
		$("#addDeviceModal").modal("hide");
	})
	$("#btnAddDeviceBtn").click(function() {
		if (theName == "") {
			windowStart("请选择主分组", false);
			return;
		}
		$("#addDeviceModal").modal("show");
		funLabelSearch();
	})
	$("#btnDelGroup").click(function() {
		if (theName == "") {
			windowStart("请选择主分组", false);
			return;
		}
		// removeData = topGroup;
		funLGRemoveGroup();
	})
	$("#btnSearchLabelGroup").click(function() {
		if (!funDateCheck()) {
			return;
		}
		loadingStart("data");
		funLGSearch();
	})
	$("#btnAddRealBtn").click(function() {
		if (qcode == 0) {
			windowStart("请选择资产", false);
			return;
		}
		if(sonOrPar == 1){
			funLGAdd();
		}else{
			funLGAddSub();
		}
	})
	$("#btnAddSubRealBtn").click(function() {
		if ($("#addSubGroupName").val() == "") {
			windowStart("分组名称不能为空", false);
			return;
		}
		funLGAddSub();
	})
	$("#btnSearchDevice").click(function() {
		if (!funAlertDateCheck()) {
			return;
		}
		funLabelSearch();
	})
	$("#btnAddDevice").click(function() {
		if ($(".each-CheckBox:checked").length == 0) {
			windowStart("请选择要添加的资产", false);
			return;
		}
		funLGAddDevice();
	})
	$("#btnCancelAdd").click(function() {
		$("#addGroupModal").modal("hide");
	})
	$("#btnCancelAddSub").click(function() {
		$("#addSubGroupModal").modal("hide");
	})

	$("#btnNext").on('click',function(){
		if($("#addProjectName").val() == -1){
			windowStart("请选择所属项目", false);
			return;
		}
		if(!$("#addGroupName").val()){
			windowStart("请输入分组名称", false);
			return;
		}
		project1 = $("#addProjectName").val();
		groupname1 = $("#addGroupName").val();
		theProject=$("#addProjectName").val();
		note1 = $("#addNote").val();
		$("#addGroupModal").modal('hide');
		$("#addGroupModal2").modal('show');
		getInfoAsset();

		// project2 = $("#addSubGroupName").val();
	})
	$("#btnNext2").on('click',function(){
		if(!$("#addSubGroupName").val()){
			windowStart("请输入分组名称", false);
			return;
		}
		groupname2 = $("#addSubGroupName").val();
		note2 = $("#addSubNote").val();
		$("#addSubGroupModal").modal('hide');
		$("#addGroupModal2").modal('show');
		getInfoAsset();
		// project2 = $("#addSubGroupName").val();
	})
	$("#btnModalSearch3").on('click',function(){
		getInfoAsset();
	})
})