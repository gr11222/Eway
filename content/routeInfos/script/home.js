var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var delete_alarm_data;
var edit_data;
var ackOrDel;
var addOrDel;
var okOrNext = 1; //1：ok，2：next
var theDeviceData = []; //最终绑定设备
var theDelDeviceData = []; //起始绑定设备
var uncheckedDeviceData = []; //未绑定设备
var routeId;
var msg_project;
var theId = "0";
var isRevise = true;

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

//*************************************查询主页下拉选择*************************************
function searchSysInfosPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询下拉选择传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	loadingStart("data-content");
	$("#select-company").html("");
	$("#select-project").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			console.log("查询下拉选择返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoSelect(msg);
				funRISearch();
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
		$("#select-company").html(str);
	}
	//项目
	if (msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		msg_project = str;
		$("#select-project").html(str);
		$("#project").html(str);
	}
}
//*************************************查询设备列表下拉*************************************
function searchSysInfosPara1() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("绑定设备列表传值=" + jsonData);
	return jsonData;
}

function searchSysInfos1() {
	$("#uncheckedList").html("");
	loadingStart("uncheckedList");
	$("#option-belongto").html("");
	$("#option-type").html("");
	$("#option-lable").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsLabelSearchByDeviceCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara1(),
		success: function(msg) {
			console.log("绑定设备列表返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoSelect1(msg);

			} else {
				windowStart("绑定列表失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无绑定列表权限", false);
			} else {
				windowStart("绑定列表失败", false);
			}
		}
	})
}

function createSysInfoSelect1(msg) {
	//所属建筑
	if (msg.buildingItems != undefined && msg.buildingItems.length > 0) {
		var theData = msg.buildingItems;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#option-belongto").html(str);
	}
	//设备类型
	if (msg.deviceItems != undefined && msg.deviceItems.length > 0) {
		var theData = msg.deviceItems;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#option-type").html(str);
	}
	funRIAddSearch();
}
//*************************************主页面查询*************************************
function funRISearch() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSearchTaskRouteToDeviceCmd",
		contentType: "application/text,charset=utf-8",
		data: routeInfosSearchPara(),
		success: function(msg) {
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				createRouteInfoTableInfos(msg);
				console.log(JSON.stringify(msg));
			}
		},
		error: function() {
			loadingStop();
			console.log("查询失败");
		}
	});
}

function routeInfosSearchPara() {
	var jsonData = setJson(null, "companyId", parseInt($("#select-company").val()));
	jsonData = setJson(jsonData, "projectId", parseInt($("#select-project").val()));
	jsonData = setJson(jsonData, "routeName", $("#routename").val());
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("任务信息传值=" + jsonData);
	return jsonData;
}
//*************************************查询任务*************************************
function createRouteInfoTableInfos(msg) {
	if (!msg.items || msg.items.length < 1) {
		$("#data-content").html("");
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无任务信息";
		str += "</div>";
		$("#data-content").html(str);
		return;
	}
	total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");
	$("#data-content").html("");
	var realData = msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='height:30px;'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>任务名称</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备数量</div></th>";
	str += "<th class='text-center'><div class='checkbox'>完成时间（分钟）</div></th>";
	str += "<th class='text-center'><div class='checkbox'>备注</div></th>";
	str += "<th class='text-center'><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		var data = JSON.stringify(realData[i]);
		// routeId = realData[i]["id"];
		var noteData;
		if (!realData[i]["note"]) {
			noteData = "";
		} else {
			noteData = realData[i]["note"];
		}
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + (i + 1) + "'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:20%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["routeName"] + "'><a href='javascript:void(0)' class='route_name' theData='" + data + "'>" + realData[i]["routeName"] + "</a></td>";
		str += "<td class='text-center'  style='width:15%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["deviceCount"] + "'>" + realData[i]["deviceCount"] + "</td>";
		str += "<td class='text-center'  style='width:15%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["workTime"] + "'>" + realData[i]["workTime"] + "</td>";
		str += "<td class='text-center' style='width:25%;word-wrap: break-word;word-break: break-all;' title='" + noteData + "'>" + noteData + "</td>";
		str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>";
		str += "<span>";
		str += "<a href='javascript:void(0)' class='edit' theData='" + data + "'><img src='../img/edit.png'></a>";
		str += "</span>";
		str += "<span style='padding-left:10px'>";
		str += "<a href='javascript:void(0)'  class='delete-alarm' theData='" + data + "'><img src='../img/dele.png'></a>";
		str += "</span>";
		str += "</td>"
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#data-content").html(str);
	$("#all-checkbox").change(function() {
		if ($(this).prop("checked")) {
			$(".each-checkbox").prop("checked", true);
			alarm_length = $(".each-checkbox").length;
		} else {
			$(".each-checkbox").prop("checked", false);
			alarm_length = 0;
		}
	})
	$(".each-checkbox").change(function() {
		if ($(this).prop("checked")) {
			alarm_length++;
			if (alarm_length == $(".each-checkbox").length) {
				$("#all-checkbox").prop("checked", true);
			} else {
				$("#all-checkbox").prop("checked", false);
			}
		} else {
			alarm_length--;
			if (alarm_length == $(".each-checkbox").length) {
				$("#all-checkbox").prop("checked", true);
			} else {
				$("#all-checkbox").prop("checked", false);
			}
		}
	})
	$(".delete-alarm").click(function() {
		if (!confirm("是否确认删除?")) {
			return;
		}
		ackOrDel = "删除";
		delete_alarm_data = eval("(" + $(this).attr("theData") + ")");
		funRouteInfos();
	})
	$(".edit").click(function() {
		ackOrDel = "修改";
		edit_data = eval("(" + $(this).attr("theData") + ")");
		$("#routename2").val(edit_data.routeName);
		$("#note1").val(edit_data.note);
		$("#editDataModal").modal("show");
	})
	$(".route_name").click(function() {
		funIsRevise(eval("(" + $(this).attr("theData") + ")").id);
		if (eval("(" + $(this).attr("theData") + ")").deviceItem != undefined) {
			okOrNext = 1;
			var checkedData = [];
			theDeviceData = [];
			routeId = eval("(" + $(this).attr("theData") + ")").id;
			checkedData = eval("(" + $(this).attr("theData") + ")").deviceItem;
			for (var i = 0; i < checkedData.length; i++) {
				theDeviceData[i] = checkedData[i];
			}
			theDelDeviceData = eval("(" + $(this).attr("theData") + ")").deviceItem;
			createCheckedList();
			console.log(theDelDeviceData);
		} else {
			okOrNext = 2;
			theDelDeviceData = [];
			theDeviceData = [];
			routeId = eval("(" + $(this).attr("theData") + ")").id;
			var str = "";
			str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
			str += "提示:<br/>当前条件下无设备信息";
			str += "</div>";
			$("#checkedList").html(str);
		}

		$("#searchDataModal").modal("show");
		searchSysInfos1();
		//	funRIAddSearch();
	})
}
//-------------------------------------判断是否可以修改
function funIsRevisePara(id) {
	var jsonData = setJson(null, "routeId", id);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询是否可以修改传值=" + jsonData);
	return jsonData;
}
function funIsRevise(id) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTaskRouteIsRunningCmd",
		contentType: "application/text,charset=utf-8",
		data: funIsRevisePara(id),
		success: function(msg) {
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#btnRIOk").attr('disabled',false);
			}else{
				$("#btnRIOk").attr('disabled',true);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("修改权限请求无权限", false);
			} else {
				windowStart("修改权限请求错误", false);
			}
		}
	})
}


//*************************************新建任务*************************************
function funRouteInfosNextSearch() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTaskRouteAddCmd",
		contentType: "application/text,charset=utf-8",
		data: searchAddInfosPara(),
		success: function(msg) {
			//if(msg.responseCommand.toUpperCase().indexOf("FAIL") != -1) {
			//windowStart("查询任务名称，备注返回值失败", false);
			//}
			console.log('新建任务返回值'+JSON.stringify(msg))
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("新建任务成功", true);
				console.log("新建任务返回值=" + JSON.stringify(msg));
				// routeId = parseInt(msg.requestCommand);
				if (okOrNext == 1) {
					$("#addDataModal").modal("hide");
					theDeviceData = [];
					funRISearch();
				} else {
					theDeviceData = [];
					funRISearch();
					$("#addDataModal").modal("hide");
					$("#searchDataModal").modal("show");
					searchSysInfos1();
					routeId = msg.routeId;
					theDelDeviceData = [];
					createCheckedList();
					funRIAddSearch();
				}
			} else if (msg.resp.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("任务名称已存在", false);
			} else {
				windowStart("新建任务失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无新建任务权限", false);
			} else {
				windowStart("信息填写错误，请重新填写", false);
			}
		}
	})
}

function searchAddInfosPara() {
	//	var jsonData = setJson(null, "requestCommand", "");
	//	jsonData = setJson(jsonData, "responseCommand", "");
	var jsonData = setJson(null, "routeName", $("#routename1").val());
	jsonData = setJson(jsonData, "note", $("#note").val());
	jsonData = setJson(jsonData, "projectId", parseInt($("#project").val()));
	jsonData = setJson(jsonData, "workTime", parseInt($("#workTime").val()));
	jsonData = setJson(jsonData, "id", -1);
	//item = setJson(item, "deviceCount", -1);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("新建任务传值=" + jsonData);
	return jsonData;
}
//*************************************任务删除，修改*************************************
function funSPAlarmInfosPara() {
	var jsonData;
	if (ackOrDel == "修改") {
		var data = edit_data;
		var jsonData = setJson(null, "id", data.id);
		jsonData = setJson(jsonData, "routeName", $("#routename2").val());
		jsonData = setJson(jsonData, "projectId", -1);
		jsonData = setJson(jsonData, "workTime", -1);
		jsonData = setJson(jsonData, "note", $("#note1").val());
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	} else {
		var data = delete_alarm_data;
		var jsonData = setJson(null, "id", data.id);
		jsonData = setJson(jsonData, "routeName", data.name);
		jsonData = setJson(jsonData, "projectId", -1);
		jsonData = setJson(jsonData, "workTime", -1);
		jsonData = setJson(jsonData, "note", "");
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	}
	console.log("修改或删除传值=" + jsonData);
	return jsonData;
}

function funRouteInfos() {
	var theUrl = "";
	if (ackOrDel == "修改") {
		theUrl = "DevOpsTaskRouteUpdateCmd";
	} else {
		theUrl = "DevOpsTaskRouteDeleteCmd";
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=" + theUrl,
		contentType: "application/text,charset=utf-8",
		data: funSPAlarmInfosPara(),
		success: function(msg) {
			console.log("修改返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				if (ackOrDel == "修改") {
					windowStart("修改任务成功", true);
					$("#editDataModal").modal("hide");

				} else {
					windowStart("删除任务成功", true);
				}
				funRISearch();
			} 
			else if(msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1){
				windowStart("任务名称已存在", true);

			}else {
				if (ackOrDel == "修改") {
					windowStart("修改任务失败", false);
					$("#editDataModal").modal("hide");
				} else {
					windowStart("删除任务失败", false);
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				if (ackOrDel == "修改") {
					windowStart("当前用户无修改权限", false);
					$("#editDataModal").modal("hide");
				} else {
					windowStart("当前用户无删除权限", false);
				}
			} else {
				if (ackOrDel == "修改") {
					windowStart("修改失败", false);
					$("#editDataModal").modal("hide");
				} else {
					windowStart("删除失败", false);
				}
			}
		}
	})
}
//*************************************备选设备列表查询*************************************
function routeInfosAddSearchPara() {
	var jsonData = setJson(null, "buildingId", parseInt($("#option-belongto").val()));
	jsonData = setJson(jsonData, "typeId", parseInt($("#option-type").val()));
	jsonData = setJson(jsonData, "key", $("#option-keyWord").val());
	jsonData = setJson(jsonData, "startTime", $("#startTime").val());
	jsonData = setJson(jsonData, "endTime", $("#endTime").val());
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("设备列表查询传值=" + jsonData);
	return jsonData;
}

function funRIAddSearch() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceInCheckRouteInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: routeInfosAddSearchPara(),
		success: function(msg) {
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				uncheckedDeviceData = msg.deviceInfoItems;
				createRouteInfoTableInfos1();
				console.log(JSON.stringify(msg));
			}
		},
		error: function() {
			console.log("fail");
		}
	});
}

function createRouteInfoTableInfos1() {
	if (!uncheckedDeviceData || uncheckedDeviceData.length < 1) {
		$("#uncheckedList").html("");
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无设备信息";
		str += "</div>";
		$("#uncheckedList").html(str);
		return;
	}
	$("#uncheckedList").html("");
	var realData = uncheckedDeviceData;
	var str = "";
	str += "<table class='table1 table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>设备名称</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备编号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备类型</div></th>";
	str += "<th class='text-center'><div class='checkbox'>所属建筑</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>安装位置</div></th>";
	//	str += "<th class='text-center' ><div class='checkbox'>标签编号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		var times = 0;
		var data = JSON.stringify(realData[i]);
		if (theDeviceData) {
			if (theDeviceData.length != 0) {
				for (var j = 0; j < theDeviceData.length; j++) {
					if (realData[i]["id"] == theDeviceData[j]["id"]) {
						times++;
					} else {
						continue;
					}
				}
			}
		}

		if (times == 0) {
			str += "<tr  style='cursor:default'>";
			str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["nameCn"] + "'>" + realData[i]["nameCn"] + "</td>";
			str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["devcieNo"] + "'>" + realData[i]["devcieNo"] + "</td>";
			str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["typeName"] + "'>" + realData[i]["typeName"] + "</td>";
			str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["building"] + "'>" + realData[i]["building"] + "</td>";
			if (realData[i]["position"] != undefined && realData[i]["position"].length > 0) {
				str += "<td class='text-center td-width' style='width:15%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["position"] + "'>" + realData[i]["position"] + "</td>";
			} else {
				str += "<td class='text-center td-width' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
			}
			//		str += "<td class='text-center' style='width:30%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["lableCode"] + "</td>";
			str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>";
			str += "<a data='" + data + "' theId='" + realData[i]["id"] + "'  href='javascript:void(0)' class='add' status='0' >加入任务列表</a>";
			str += "</td>";
			str += "</tr>";
		}

	}
	str += "</tbody><table>";
	$("#uncheckedList").html(str);
	if ($(".table1 tbody").text()=='') {
		$("#uncheckedList").html("");
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无设备信息";
		str += "</div>";
		$("#uncheckedList").html(str);
		return;
	}
	$(".add").click(function() {
		theDeviceData.push(eval("(" + $(this).attr("data") + ")"));
		// uncheckedDeviceData
		for (var i = 0; i < uncheckedDeviceData; i++) {
			if (uncheckedDeviceData[i]["id"] == eval("(" + $(this).attr("data") + ")").id) {
				theDeviceData.splice($(this).attr("data"), 1);
			}
		}
		console.log(theDeviceData)
		createRouteInfoTableInfos1();
		createCheckedList();
	})

}
//********************************************已选设备列表**********************************************
function createCheckedList() {
	if (!theDeviceData || theDeviceData.length < 1) {
		$("#checkedList").html("");
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前任务无设备信息";
		str += "</div>";
		$("#checkedList").html(str);
		return;
	}
	$("#checkedList").html("");
	var realData = theDeviceData;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' ><thead>";
	str += "<th class='text-center' style='width:10%;'><div class='checkbox'>单选</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备名称</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备编号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备类型</div></th>";
	str += "<th class='text-center'><div class='checkbox'>所属建筑</div></th>";
	str += "<th class='text-center'><div class='checkbox'>安装位置</div></th>";
	//	str += "<th class='text-center' ><div class='checkbox'>标签编号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		c = 0;
		var data = JSON.stringify(realData[i]);
		str += "<tr  style='cursor:default'>";
		str += "<td class=' text-center' ><input tip='" + i + "' type='radio' name='aa' data='" + data + "' class='checkbox-checked' /></td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["nameCn"] + "'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["devcieNo"] + "'>" + realData[i]["devcieNo"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["typeName"] + "'>" + realData[i]["typeName"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["building"] + "'>" + realData[i]["building"] + "</td>";
		if (realData[i]["position"] != undefined && realData[i]["position"].length > 0) {
			str += "<td class='text-center td-width' style='width:15%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["position"] + "'>" + realData[i]["position"] + "</td>";
		} else {
			str += "<td class='text-center td-width' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		}
		//		str += "<td class='text-center' style='width:30%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["lableCode"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>";
		str += "<a  tip='" + i + "' data='" + data + "' theId='" + realData[i]["id"] + "'  href='javascript:void(0)' class='del' status='0' >移除任务列表</a>";
		str += "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#checkedList").html(str);
	$(".del").click(function() {
		theDeviceData.splice($(this).attr("tip"), 1);
		createRouteInfoTableInfos1();
		createCheckedList();
	})

}

function check() {
	var c = 0;
	$(".checkbox-checked").each(function() {
		if ($(this).prop("checked")) {

			c++;
		}
	})
	if (c == 0) {
		return false;
	}
	return true;
}
//*************************************设备加入任务*************************************
function funAddRouteInfosPara() {
	var items = [];
	console.log(theDeviceData);
	var jsonData = setJson(null, "routeId", routeId);
	for (var i = 0; i < theDeviceData.length; i++) {
		var obj = {};
		obj.nodeNumber = i + 1;
		obj.deviceId = theDeviceData[i]["id"];
		items.push(obj);
	}
	jsonData = setJson(jsonData, "items", items);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("设备加入任务传值=" + jsonData);
	return jsonData;
}

function funAddRouteInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAddDeviceToTaskRouteCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddRouteInfosPara(),
		success: function(msg) {
			console.log("加入任务返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				if (okOrNext == 2) {
					windowStart("加入任务成功", true);
					funRISearch();
				} else {
					windowStart("修改任务成功", true);
					funRISearch();
				}
			} else {
				if (okOrNext == 2) {
					windowStart("加入任务失败", true);
				} else {
					windowStart("修改任务失败", true);
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				if (okOrNext == 1) {
					windowStart("当前用户无加入任务权限", false);
				} else {
					windowStart("当前用户无修改任务权限", false);
				}
			} else {
				if (okOrNext == 1) {
					windowStart("加入任务失败", false);
				} else {
					windowStart("修改任务失败", false);
				}
			}
		}
	})
}
//*************************************设备移除任务*************************************
function funDelRouteInfosPara() {
	var items = [];
	console.log(theDelDeviceData);
	var jsonData = setJson(null, "routeId", routeId);
	for (var i = 0; i < theDelDeviceData.length; i++) {
		var obj = {};
		obj.nodeNumber = i + 1;
		obj.deviceId = theDelDeviceData[i]["id"];
		items.push(obj);
	}
	jsonData = setJson(jsonData, "items", items);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("移除任务传值=" + jsonData);
	return jsonData;
}

function funDelRouteInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeleteDeviceToTaskRouteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDelRouteInfosPara(),
		success: function(msg) {
			console.log("加入任务返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				//				windowStart("移除任务成功", false);
				funAddRouteInfos();
			} else {
				windowStart("移除任务失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无移除任务权限", false);
			} else {
				windowStart("移除任务失败", false);
			}
		}
	})
}

//*************************************已绑设备列表*************************************
function funDeviceSearch() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSearchTaskRouteToDeviceCmd",
		contentType: "application/text,charset=utf-8",
		data: deviceSearchPara(),
		success: function(msg) {
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				funCreateDeviceTable(msg)
				console.log(JSON.stringify(msg));
			}
		},
		error: function() {
			loadingStop();
			console.log("fail");
		}
	});
}

function deviceSearchPara() {
	var jsonData = setJson(null, "resp", {});
	jsonData = setJson(jsonData, "query", {});
	var item = setJson(null, "id", routeId);
	item = setJson(item, "deviceCount", 0);
	jsonData = setJson(jsonData, "item", item, true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("绑定设备信息传值=" + jsonData);
	return jsonData;
}

function funCreateDeviceTable(msg) {
	if (!msg.item[0]["item"] || msg.item[0]["item"].length < 1) {
		$("#deviceList").html("");
		var str = "";
		str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
		str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
		str += "<th class='text-center' ><div class='checkbox'>设备名称</div></th>";
		str += "<th class='text-center'><div class='checkbox'>设备编号</div></th>";
		str += "<th class='text-center'><div class='checkbox'>设备类型</div></th>";
		str += "<th class='text-center'><div class='checkbox'>所属建筑</div></th>";
		str += "<th class='text-center' ><div class='checkbox'>安装位置</div></th>";
		str += "<th class='text-center' ><div class='checkbox'>标签编号</div></th>";
		str += "<th class='text-center' ><div class='checkbox'>操作</div></th>";
		str += "</thead><tbody>";
		str += "</tbody></table>";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无已绑定设备信息";
		str += "</div>";
		$("#deviceList").html(str);
		return;
	}
	var str = "";
	var data = msg.item[0]["item"];
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>设备名称</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备编号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备类型</div></th>";
	str += "<th class='text-center'><div class='checkbox'>所属建筑</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>安装位置</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>标签编号</div></th>";
	//	str += "<th class='text-center' ><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";
	for (var i = 0; i < data.length; i++) {
		var realData = eval("(" + JSON.stringify(data[i]) + ")");
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='width:10%' title='" + (i + 1) + "'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData["nameCn"] + "'>" + realData["nameCn"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData["deviceNo"] + "'>" + realData["deviceNo"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData["deviceClassifyCn"] + "'>" + realData["deviceClassifyCn"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData["buildingCn"] + "'>" + realData["buildingCn"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData["position"] + "'>" + realData["position"] + "</td>";
		str += "<td class='text-center' style='width:20%;word-wrap: break-word;word-break: break-all;' title='" + realData["labelQr"] + "'>" + realData["labelQr"] + "</td>";
		//		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'><a href='javascript:void(0)'  class='delDevice' theData='" + JSON.stringify(data[i]) + "'  theId='" + realData["id"] + "'><img src='../img/dele.png'></a></td>";
		str += "</tr>";
	}
	str += "</tbody></table>";
	$("#deviceList").html(str);
}

function addTaskCheck() {
	if (parseInt($("#project").val()) == -1) {
		windowStart("请选择所属项目", false);
		return false;
	}
	var textReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5])+$/;
	if ($("#routename1").val() == "") {
		windowStart("请输入任务名称", false);
		return false;
	}
	if (!textReg.test($("#routename1").val())) {
		windowStart("任务名称只能输入中英文和数字", false);
		return false;
	}
	var firstReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
	if (!firstReg.test($("#routename1").val())) {
		windowStart("任务名称第一个字符必须为中英文", false);
		return false;
	}
	var numReg = /^[1-9]\d*$/;
	if ($("#workTime").val() == "") {
		windowStart("请输入预计完成时间", false);
		return false;
	}
	if (!numReg.test($("#workTime").val())) {
		windowStart("预计完成时间只能输入正整数", false);
		return false;
	}
	if (parseInt($("#workTime").val()) > 14400) {
		windowStart("输入的预计完成时间值过大，请重新输入", false);
		return false;
	}
	return true;
}

function fundateCheck() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0) {
	//		windowStart("时间范围有误,请填写时间范围", false);
	//		return;
	//	}
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
	if ($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
		windowStart("请输入结束时间", false);
		return false;
	}
	if ($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
		windowStart("请输入开始时间", false);
		return false;
	}
	if ($("#startTime").val().length > 0 && $("#endTime").val().length > 0) {
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if (parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("开始时间不能大于结束时间", false);
			return false;
		}
	}
	return true;
}

$(document).ready(function() {
	$('#searchDataModal').on("hidden.bs.modal", function() {
		$('#searchDataModal input').val('');
		$('#searchDataModal select').val('');
	})
	$(".input-style-time").datepicker("setValue");
	$(".input-style-time").val("");
	searchSysInfos();
	//查询任务
	$("#btnSearchRouteInfos").click(function() {
			data_page_index = 0;
			curren_page = 1;
			$("#pageNumId").val("");
			funRISearch();
		})
		//新建任务
	$("#btnRIAdd").click(function() {
			$("#project").html(msg_project);
			$("#routename1").val("");
			$("#note").val("");
			$("#workTime").val("");
			$("#addDataModal").modal("show");
		})
		//新建任务的下一步
	$("#btnAddRealBtn").click(function() {
			if (!addTaskCheck()) {
				return;
			}
			okOrNext = 2;
			funRouteInfosNextSearch();
		})
		//新建任务的完成
	$("#btnAddOkBtn").click(function() {
			if (!addTaskCheck()) {
				return;
			}
			okOrNext = 1;
			$("#checkedList").html('');
			funRouteInfosNextSearch();
		})
		//查询设备
	$("#btnRISearch1").click(function() {
			if (!fundateCheck()) {
				return;
			}
			loadingStart("uncheckedList");
			funRIAddSearch();
		})
		//查询已选设备
	$("#btnCheckedList").click(function() {
			$("#deviceModal").modal("show");
			funDeviceSearch();
		})
		//确认添加设备
	$("#btnRIOk").click(function() {
			funDelRouteInfos();
			$("#searchDataModal").modal("hide");
			//			funRISearch();
		})
		//修改任务信息
	$("#btnEditBtn").click(function() {
		if ($("#routename2").val() == "") {
			windowStart("任务名称不得为空", false);
			return;
		}
		var textReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5])+$/;
		if (!textReg.test($("#routename2").val())) {
			windowStart("任务名称只能输入中英文和数字", false);
			return;
		}
		var firstReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
		if (!firstReg.test($("#routename2").val())) {
			windowStart("任务名称第一个字符必须为中英文", false);
			return;
		}
		ackOrDel = "修改";
		funRouteInfos();
	})
	$("#btnCancel").click(function() {
			$("#searchDataModal").modal("hide");
		})
		//分页操作
		//上一页
	$("#btnPageBefore").click(function() {
			if (total_page == 0) {
				return;
			}
			if (curren_page == 1) {
				windowStart("当前为首页", false);
				return;
			}
			data_page_index -= data_number;
			curren_page -= 1;
			funRISearch();
		})
		//下一页
	$("#btnPageNext").click(function() {
			if (total_page == 0) {
				return;
			}
			if (total_page == curren_page) {
				windowStart("当前为尾页", false);
				return;
			}
			data_page_index += data_number;
			curren_page += 1;
			funRISearch();
		})
		//跳转页
	$("#btnPageJump").click(function() {
			if (total_page == 0) {
				return;
			}
			var numReg = /^[0-9]+$/;
			if (!numReg.test($("#pageNumId").val())) {
				windowStart("页码输入有误", false);
				return;
			}
			if (parseInt($("#pageNumId").val()) < 1) {
				windowStart("页码输入有误", false);
				return;
			}
			if (parseInt($("#pageNumId").val()) > total_page) {
				windowStart("页码输入有误", false);
				return;
			}
			data_page_index = (parseInt($("#pageNumId").val()) - 1) * data_number;
			curren_page = parseInt($("#pageNumId").val());
			funRISearch();
			$("#pageNumId").val('');
		})
		//分页操作
	$("#top").click(function() {
		if (!check()) {
			windowStart("请选择需要排序的设备", true);
			return;
		}
		$(".checkbox-checked").each(function() {
			if ($(this).prop("checked")) {
				var i = $(this).attr("tip");
				if (i == 0) {
					windowStart("当前设备已置顶", true);
					return;
				}
				var temp;
				temp = theDeviceData[i];
				theDeviceData.splice(i, 1);
				theDeviceData.unshift(temp);
				console.log(theDeviceData);
				createCheckedList();
			}
		})
	})
	$("#up").click(function() {
		if (!check()) {
			windowStart("请选择需要排序的设备", true);
			return;
		}
		$(".checkbox-checked").each(function() {
			if ($(this).prop("checked")) {
				var i = $(this).attr("tip");
				if (i == 0) {
					windowStart("当前设备已置顶", true);
					return;
				}
				var one;
				var two;
				one = theDeviceData[i - 1];
				two = theDeviceData[i];
				theDeviceData.splice(i - 1, 2, two, one);
				console.log(theDelDeviceData);
				createCheckedList();
			}
		})
	})
	$("#down").click(function() {
		if (!check()) {
			windowStart("请选择需要排序的设备", true);
			return;
		}
		$(".checkbox-checked").each(function() {
			if ($(this).prop("checked")) {
				var i = $(this).attr("tip");
				if (i == theDeviceData.length - 1) {
					windowStart("当前设备已置底", true);
					return;
				}
				var one;
				var two;
				one = theDeviceData[i];
				two = theDeviceData[++i];
				theDeviceData.splice(i - 1, 2, two, one);
				console.log(theDeviceData);
				createCheckedList();
			}
		})
	})
	$("#bottom").click(function() {
		if (!check()) {
			windowStart("请选择需要排序的设备", true);
			return;
		}
		$(".checkbox-checked").each(function() {
			if ($(this).prop("checked")) {
				var i = $(this).attr("tip");
				if (i == theDeviceData.length - 1) {
					windowStart("当前设备已置底", true);
					return;
				}
				var temp;
				temp = theDeviceData[i];
				theDeviceData.splice(i, 1);
				theDeviceData.push(temp);
				console.log(theDeviceData);
				createCheckedList();
			}
		})
	})
})