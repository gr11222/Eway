var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var routeInfos; //选中任务
var manInfos = []; //已选人员列表
var uncheckMan = []; // 未选人员列表
var checkedMan = []; //已选人员列表
var roles = []; //角色列表
var delMan = []; //删除人员列表
var editRouteId; //修改任务的id
var editManInfos = []; //修改时人员列表
var theDeviceData = []; //任务设备信息
var alarm_length = 0;
var data_length;
var routeId;

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
//排序
function cusSort(arr) {
	arr.sort(function(a, b) {
		return a.localeCompare(b);
	})
	return arr;
}

function createobjData(data1, data2) {
	var arr = [];
	for(var i = 0; i < data1.length; i++) {
		for(var j = 0; j < data2.length; j++) {
			if(data1[i] == data2[j]["nameCn"]) {
				console.log(1);
				var obj = {};
				obj.nameCn = data1[i];
				obj.classifyId = data2[j]["classifyId"];
				arr.push(obj);
			} else {
				continue;
			}
		}
	}
	return arr;
}



//*******************************************查询筛选项*******************************************
function searchSysInfosPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询下拉选择传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	$("#selectCompany").html("");
	$("#selectProject").html("");
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
				searchRouteInfos();
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
		$("#selectCompany").html(str);
	}
	//项目
	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#selectProject").html(str);
	}

	//角色
	if(msg.roleItems != undefined && msg.roleItems.length > 0) {
		var theData = msg.roleItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			var obj = {};
			obj.id = theData[i]["classifyId"];
			obj.name = theData[i]["nameCn"];
			roles.push(obj);
		}
		$("#userTypeforSearch").html(str);
		$("#userTypeforSearch1").html(str);
	}
}

//*******************************************主页任务信息查询*******************************************
function searchRouteInfosPara() {
	var jsonData = setJson(null, "companyId", parseInt($("#selectCompany").val()));
	jsonData = setJson(jsonData, "projectId", parseInt($("#selectProject").val()));
	jsonData = setJson(jsonData, "routeName", $("#routename").val());
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询任务信息传值=" + jsonData);
	return jsonData;
}

function searchRouteInfos() {
	alarm_length = 0;
	$("#dataContent1").html("");
	loadingStart("dataContent1");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSearchTaskRouteToUserCmd",
		contentType: "application/text,charset=utf-8",
		data: searchRouteInfosPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询任务信息返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createRouteInfoTable(msg);
			} else {
				windowStart("查询任务信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询任务信息权限", false);
			} else {
				windowStart("查询任务信息失败", false);
			}
		}
	})
}

function createRouteInfoTable(msg) {
	
	if(!msg.items || msg.items.length == 0) {
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无任务信息";
		str += "</div>";
		$("#dataContent1").html(str);
		return;
	}
	total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");
	var theData = msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center'>单选</th>"; // <input type='checkbox' id='checkboxForAll'>
	str += "<th class='text-center'>序号</th>";
	str += "<th class='text-center'>任务名称</th>";
	str += "<th class='text-center'>设备数量</th>";
	str += "<th class='text-center'>备注</th>";
	str += "<th class='text-center '>设备详情</th>";
	str += "<th class='text-center'>操作</th>";
	str += "<th class='text-center '>角色</th>";
	str += "</thead><tbody>";
	for(var i = 0; i < theData.length; i++) {
		str += "<tr>";
		str += "<td class=' text-center td-width' style='width:6%'><input theData='" + JSON.stringify(theData[i]) + "' del='" + JSON.stringify(theData[i]["userItem"]) + "' type='checkbox' class='checkbox-for-all'/></td>";
		str += "<td class='text-center td-width' style='width:6%;word-wrap: break-word;word-break: break-all;' title='"+(i + 1)+"'>" + (i + 1) + "</td>";
		str += "<td class='text-center td-width' style='width:14%;word-wrap: break-word;word-break: break-all;' title='"+theData[i]["routeName"]+"'>" + theData[i]["routeName"] + "</td>";
		str += "<td class='text-center td-width' style='width:10%;word-wrap: break-word;word-break: break-all;' title='"+theData[i]["deviceCount"]+"'>" + theData[i]["deviceCount"] + "</td>";
		str += "<td class='text-center td-width' style='width:10%;word-wrap: break-word;word-break: break-all;' title='"+theData[i]["note"]+"'>"+theData[i]["note"]+"</td>";
		if(theData[i]["deviceCount"] == 0) {
			str += "<td class='text-center td-width' style='width:10%;word-wrap: break-word;word-break: break-all;' title='暂无设备'>暂无设备</td>";
		} else {
			str += "<td class='text-center td-width' style='width:10%;word-wrap: break-word;word-break: break-all;' title='查看'><a href='javascript:void(0)' theData='" + JSON.stringify(theData[i]) + "'  class='look-devices'>查看</a></td>";
		}
		if(theData[i]["userItem"] == undefined) {
			str += "<td class='text-center td-width' style='width:10%;word-wrap: break-word;word-break: break-all;' title='暂无人员'>暂无人员</td>";
		} else {
			str += "<td class='text-center td-width' style='width:10%;word-wrap: break-word;word-break: break-all;' title='修改指派人员'><a href='javascript:void(0)' theData='" + JSON.stringify(theData[i]["userItem"]) + "' data='" + JSON.stringify(theData[i]) + "' id='" + JSON.stringify(theData[i]["id"]) + "' class='edit-class'>修改指派人员</a></td>";
		}
		if(theData[i]["userItem"]){
			var listOfMan;
			var manArr = [];
			listOfMan = theData[i]["userItem"];
			// console.log(theData[i]["userItem"]);
			// console.log('sdasad');
			for (var j = 0; j < listOfMan.length; j++) {
				if(manArr.indexOf(listOfMan[j].roleCn) != -1){
					
				}else{
					manArr.push(listOfMan[j].roleCn);
				}
			}
			manArr = manArr.join(',');
			str += "<td class='text-center td-width' style='width:10%;word-wrap: break-word;word-break: break-all;' title='"+manArr+"'>"+manArr+"</td>";
		}else{
			str += "<td class='text-center td-width' style='width:10%;word-wrap: break-word;word-break: break-all;'></td>";
		}
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#dataContent1").html(str);
	$(".edit-class").click(function() {
		checkedMan = eval("(" + $(this).attr("theData") + ")");
		editRouteId = eval("(" + $(this).attr("id") + ")");
		routeInfos = eval("(" + $(this).attr("data") + ")");
		funEditRouteManSearch();
		createCheckedList();

		$("#editManModal").modal("show");
		editManInfos = [];
		delMan = [];
	})
	$(".look-devices").click(function() {
		theDeviceData = eval("(" + $(this).attr("theData") + ")").deviceItem;
		createDeviceList();
		$("#deviceModal").modal("show");
	})
}
//*************************************************已选择人员列表*****************************************************
function createCheckedList() {
	
	$("#manCheckedList").html("");
	if(!checkedMan || checkedMan.length < 1) {
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无人员信息";
		str += "</div>";
		$("#manCheckedList").html(str);
		return;
	}
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' style='width:25%'><div class='checkbox'>用户名称</div></th>";
	str += "<th class='text-center' style='width:25%'><div class='checkbox'>角色</div></th>";
	str += "<th class='text-center' style='width:25%'><div class='checkbox'>联系方式</div></th>";
	str += "<th class='text-center' style='width:25%'><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";

	console.log(checkedMan);
	for(var i = 0; i < checkedMan.length; i++) {
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='word-wrap: break-word;word-break: break-all;' title='"+checkedMan[i]["userName"]+"'>" + checkedMan[i]["userName"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='"+checkedMan[i]["roleCn"]+"'>" + checkedMan[i]["roleCn"] + "</td>";
		if(checkedMan[i]["cell"] == undefined) {
			str += "<td class='text-center' style='word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='word-wrap: break-word;word-break: break-all;' title='"+checkedMan[i]["cell"]+"'>" + checkedMan[i]["cell"] + "</td>";
		}
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;'><a href='javascript:void(0)' class='remove' tip='"+i+"' theData='" + JSON.stringify(checkedMan[i]) + "'>移除</a></td>";
		str += "</tr>";
	}

	str += "</tbody><table>";
	$("#manCheckedList").html(str);
	$("#editManModal").modal("show");
	$(".remove").click(function() {
		// delMan = [];
		console.log(delMan);
		checkedMan.splice($(this).attr("tip"), 1);
		delMan.push(eval("("+$(this).attr("theData")+")"));
		createCheckedList();
        funCreateEditManTable();
	})
}

//*****************************************设备绑定任务**************************************
function setManPara() {
	var item = [];
	for(var j = 0; j < manInfos.length; j++) {
		var obj = {};
		obj.id = "";
		obj.routeId = routeInfos.id;
		obj.userId = manInfos[j].userId;
		for(var m = 0; m < roles.length; m++) {
			if(manInfos[j].roleCn == roles[m]["name"]) {
				obj.userRole = roles[m]["id"];
				break;
			}
		}
		obj.operationType = -1;
		item.push(obj);
	}
	var jsonData = setJson(null, "items", item);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("绑定巡检人员传值=" + jsonData);
	return jsonData;
}

function setManInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAddUserToTaskRouteCmd",
		contentType: "application/text,charset=utf-8",
		data: setManPara(),
		success: function(msg) {
			console.log("指派人员返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addManModal").modal("hide");
				windowStart("指派人员成功", true);
				searchRouteInfos();
			} else {
				windowStart("指派人员失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无指派人员权限", false);
			} else {
				windowStart("指派人员失败", false);
			}
		}
	})
}
//**********************************取消绑定任务传值*******************************
function removeManPara() {
	console.log(delMan);
	var item = [];
	for(var j = 0; j < delMan.length; j++) {

		var obj = {};
		obj.id = "";
		obj.routeId = editRouteId;
		obj.userId = delMan[j].userId;
		for(var m = 0; m < roles.length; m++) {
			if(delMan[j].roleCn == roles[m]["name"]) {
				obj.userRole = roles[m]["id"];
				break;
			}
		}
		obj.operationType = -1;
		item.push(obj);
	}
	var jsonData = setJson(null, "items", item);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("移除传值=" + jsonData);
	return jsonData;
}

function removeMan() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeleteUserToTaskRouteCmd",
		contentType: "application/text,charset=utf-8",
		data: removeManPara(),
		success: function(msg) {
			console.log("取消分配返回值=" + JSON.stringify(msg));
			var i = 0;
			$(".checkbox-for-all2").each(function() {
				if($(this).prop("checked")) {
					editManInfos[i] = eval("(" + $(this).attr("theData") + ")");
					i++;
				}
			})
			console.log(editManInfos);
			editMan();
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				//	windowStart("取消分配成功", true);
				var i = 0;
				$(".checkbox-for-all2").each(function() {
					if($(this).prop("checked")) {
						editManInfos[i] = eval("(" + $(this).attr("theData") + ")");
					}
				})
				if(editManInfos.length == 0) {
					windowStart("人员修改成功", true);
					$("#editManModal").modal("hide");
					searchRouteInfos();
				} else {
					editMan();
				}
			} else {
				windowStart("取消分配失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无取消分配权限", false);
			} else {
				windowStart("取消分配失败", false);
			}
		}
	})
}
//**********************************快速取消绑定任务传值*******************************
function removeAllManPara() {
	var item = [];
	for(var j = 0; j < delMan.length; j++) {

		var obj = {};
		obj.id = "";
		obj.routeId = routeInfos.id;
		obj.userId = delMan[j].userId;
		for(var m = 0; m < roles.length; m++) {
			if(delMan[j].roleCn == roles[m]["name"]) {
				obj.userRole = roles[m]["id"];
				break;
			}
		}
		obj.operationType = -1;
		item.push(obj);
	}
	var jsonData = setJson(null, "items", item);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("移除传值=" + jsonData);
	return jsonData;
}

function removeAllMan() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeleteUserToTaskRouteCmd",
		contentType: "application/text,charset=utf-8",
		data: removeAllManPara(),
		success: function(msg) {
			console.log("取消分配返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("取消分配成功", true);
				searchRouteInfos();
			} else {
				windowStart("取消分配失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无取消分配权限", false);
			} else {
				windowStart("取消分配失败", false);
			}
		}
	})
}
//*******************************************新增时人员列表*******************************************
function funRouteManSearch() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsUserByTaskRouteReadCmd",
		contentType: "application/text,charset=utf-8",
		data: manSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				console.log(JSON.stringify(msg));
				funCreateManTable(msg);
			}
		},
		error: function() {
			loadingStop();
			console.log("fail");
		}
	});
}

function manSearchPara() {
	var jsonData = setJson(null, "userCn", $("#userNameforSearch").val());
	jsonData = setJson(jsonData, "roleId", parseInt($("#userTypeforSearch").val()));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("巡检人员查询传值=" + jsonData);
	return jsonData;
}

function funCreateManTable(msg) {
	if(!msg.userItem || msg.userItem.length < 1) {
		$("#manList").html("");
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无人员信息";
		str += "</div>";
		$("#manList").html(str);
		return;
	}
	var str = "";
	var data = msg.userItem;
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' style='width:10%'><input type='checkbox' id='checkboxForAll1'>  全选</th>";
	str += "<th class='text-center'  style='width:15%'><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center'  style='width:25%'><div class='checkbox'>用户名称</div></th>";
	str += "<th class='text-center'  style='width:20%'><div class='checkbox'>角色</div></th>";
	str += "<th class='text-center'  style='width:20%'><div class='checkbox'>联系方式</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < data.length; i++) {
		str += "<tr  style='cursor:default'>";
		str += "<td class=' text-center' ><input theData='" + JSON.stringify(data[i]) + "' type='checkbox' class='checkbox-for-all1'/></td>";
		str += "<td class='text-center' title='"+(i + 1)+"'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='word-wrap: break-word;word-break: break-all;' title='"+data[i]["userName"]+"'>" + data[i]["userName"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='"+data[i]["roleCn"]+"'>" + data[i]["roleCn"] + "</td>";
		if(data[i]["cell"] == undefined) {
			str += "<td class='text-center' style='word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='word-wrap: break-word;word-break: break-all;' title='"+data[i]["cell"]+"'>" + data[i]["cell"] + "</td>";
		}
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#manList").html(str);
	$("#checkboxForAll1").change(function() {
		if($(this).prop("checked")) {
			data_length = $(".checkbox-for-all1").length;
			$(".checkbox-for-all1").prop("checked", true);
		} else {
			data_length = 0;
			$(".checkbox-for-all1").prop("checked", false);
		}
	})
	$(".checkbox-for-all1").change(function() {
		if($(this).prop("checked")) {
			data_length++;
			if(data_length == $(".checkbox-for-all1").length) {
				$("#checkboxForAll1").prop("checked", true);
			} else {
				$("#checkboxForAll1").prop("checked", false);
			}

		} else {
			data_length--;
			if(data_length == $(".checkbox-for-all1").length) {
				$("#checkboxForAll1").prop("checked", true);
			} else {
				$("#checkboxForAll1").prop("checked", false);
			}
		}
	})
}
//*******************************************修改时人员列表*******************************************
function funEditRouteManSearch() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsUserByTaskRouteReadCmd",
		contentType: "application/text,charset=utf-8",
		data: editManSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				console.log(JSON.stringify(msg));
				uncheckMan=msg.userItem;
				funCreateEditManTable();
			}
		},
		error: function() {
			loadingStop();
			console.log("fail");
		}
	});
}

function editManSearchPara() {
	var jsonData = setJson(null, "userCn", $("#userNameforSearch1").val());
	jsonData = setJson(jsonData, "roleId", parseInt($("#userTypeforSearch1").val()));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("人员查询传值=" + jsonData);
	return jsonData;
}
function isSame(){
	if (uncheckMan.length==0) {
		return false;
	}
	var sameTimes=0;
	for(var i=0;i<uncheckMan.length ;i++){
		for(var j=0;j<checkedMan.length;j++){
			if (uncheckMan[i]["userId"]==checkedMan[j]["userId"]) {
				sameTimes++;
			}
		}
	}
	if (sameTimes==uncheckMan.length) {
		return false;
	}
	return true;
}
 
function funCreateEditManTable() {
	console.log(uncheckMan);
	if(!isSame()) {
		$("#manUncheckedList").html("");
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无人员信息";
		str += "</div>";
		$("#manUncheckedList").html(str);
		return;
	}
	var str = "";
	var data = uncheckMan;
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>选项</th>";
	str += "<th class='text-center' ><div class='checkbox'>用户名称</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>角色</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>联系方式</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < data.length; i++) {
		var time = 0;
		for(var j = 0; j < checkedMan.length; j++) {

			if(parseInt(checkedMan[j]["userId"]) == parseInt(data[i]["userId"])) {
				time++;
			}
		}
		if(time == 0) {
			str += "<tr  style='cursor:default'>";
			str += "<td class=' text-center' style='width:20%'><input theData='" + JSON.stringify(data[i]) + "' type='checkbox' class='checkbox-for-all2' id=‘checkbox-for-all2’/></td>";
			str += "<td class='text-center' style='width:25%;word-wrap: break-word;word-break: break-all;' title='"+data[i]["userName"]+"'>" + data[i]["userName"] + "</td>";
			str += "<td class='text-center'  style='width:20%;word-wrap: break-word;word-break: break-all;' title='"+data[i]["roleCn"]+"'>" + data[i]["roleCn"] + "</td>";
			if(data[i]["cell"] == undefined) {
				str += "<td class='text-center' style='width:20%;word-wrap: break-word;word-break: break-all;' ></td>";
			} else {
				str += "<td class='text-center' style='width:20%;word-wrap: break-word;word-break: break-all;' title='"+data[i]["cell"]+"'>" + data[i]["cell"] + "</td>";
			}
			str += "</tr>";
		}
	}
	str += "</tbody><table>";
	$("#manUncheckedList").html(str);
	$("#checkboxForAll2").change(function() {
		if($(this).prop("checked")) {
			data_length = $(".checkbox-for-all2").length;
			$(".checkbox-for-all2").prop("checked", true);
		} else {
			data_length = 0;
			$(".checkbox-for-all2").prop("checked", false);
		}
	})
	$(".checkbox-for-all2").change(function() {
		if($(this).prop("checked")) {
			data_length++;
			if(data_length == $(".checkbox-for-all2").length) {
				$("#checkboxForAll1").prop("checked", true);
			} else {
				$("#checkboxForAll1").prop("checked", false);
			}

		} else {
			data_length--;
			if(data_length == $(".checkbox-for-all2").length) {
				$("#checkboxForAll1").prop("checked", true);
			} else {
				$("#checkboxForAll1").prop("checked", false);
			}
		}
	})
}
//************************************修改任务传值*********************************
function editManPara() {
	var item = [];
	for(var j = 0; j < editManInfos.length; j++) {
		var obj = {};
		obj.id = "";
		obj.routeId = editRouteId;
		obj.userId = editManInfos[j].userId;
		for(var m = 0; m < roles.length; m++) {
			if(editManInfos[j].roleCn == roles[m]["name"]) {
				obj.userRole = roles[m]["id"];
				break;
			}
		}
		obj.operationType = -1;
		item.push(obj);

	}
	var jsonData = setJson(null, "items", item);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("绑定人员传值=" + jsonData);
	return jsonData;
}

function editMan() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAddUserToTaskRouteCmd",
		contentType: "application/text,charset=utf-8",
		data: editManPara(),
		success: function(msg) {
			console.log("人员修改返回值=" + JSON.stringify(msg));
			if(msg.responseCommand == undefined){
				$("#editManModal").modal("hide");
				windowStart("人员修改成功", true);
				return;
			}
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				//				$("#setRoutInfoModal").modal("hide");
				windowStart("人员修改成功", true);
				$("#editManModal").modal("hide");
				searchRouteInfos();
			} else if(msg.failReason == "当前绑定已存在，不能重复绑定") {
				windowStart("当前绑定已存在，不能重复绑定", false);
			} else {
				windowStart("人员修改失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无人员修改权限", false);
			} else {
				windowStart("人员修改失败", false);
			}
		}
	})
}
//*******************************************查看任务的设备列表*******************************************
function createDeviceList() {
	if(!theDeviceData || theDeviceData.length < 1) {
		$("#checkedList").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前任务无设备信息";
		str += "</div>";
		$("#checkedList").html(str);
		return;
	}
	$("#checkedList").html("");
	var realData = theDeviceData;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>设备名称</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备编号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备类型</div></th>";
	str += "<th class='text-center'><div class='checkbox'>所属建筑</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>安装位置</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var data = JSON.stringify(realData[i]);
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='width:10%' title='"+(i + 1)+"'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["nameCn"]+"'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["devcieNo"]+"'>" + realData[i]["devcieNo"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["typeName"]+"'>" + realData[i]["typeName"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["building"]+"'>" + realData[i]["building"] + "</td>";
		if(realData[i]["position"] != undefined && realData[i]["position"].length > 0) {
			str += "<td class='text-center td-width' style='width:15%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["position"]+"'>" + realData[i]["position"] + "</td>";
		} else {
			str += "<td class='text-center td-width' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		}
		//		str += "<td class='text-center' style='width:30%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["lableCode"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#checkedList").html(str);
}
//*****************************************ready***********************************************
$(document).ready(function() {
	$('#addManModal').on("hidden.bs.modal", function() {
		$("#userNameforSearch").val('');
		$('#userTypeforSearch').val('');
	});
	$('#editManModal').on("hidden.bs.modal", function() {
		$("#userNameforSearch1").val('');
		$('#userTypeforSearch1').val('');
	});
	// $('#setRoutInfoModal').on("hidden.bs.modal", function() {
	// 	$("#userNameforSearch1").val('');
	// 	$('#userTypeforSearch1').val('');
	// });
	searchSysInfos();
	//查询页面信息
	$("#btnSearchUserInfos").click(function() {
		   data_page_index = 0;
		  curren_page=1;
		  $("#pageNumId").val("");
			searchRouteInfos();
		})
		//人员分配
	$("#btnFenPei").click(function() {
			if($(".checkbox-for-all:checked").length == 0) {
				windowStart("请选择需要指派人员的任务", false);
				return;
			}
			if($(".checkbox-for-all:checked").length > 1) {
				windowStart("请选择一条需要指派人员的任务", false);
				return;
			}
			if($(".checkbox-for-all:checked").attr("del") != "undefined") {
				windowStart("当前任务已指派过人员", false);
				return;
			}
			$(".checkbox-for-all").each(function() {
				if($(this).prop("checked")) {
					routeInfos = eval("(" + $(this).attr("theData") + ")");
				}
			})
			funRouteManSearch();
			$("#addManModal").modal("show");
		})
		//取消分配
	$("#btnCancle").click(function() {
			if($(".checkbox-for-all:checked").length == 0) {
				windowStart("请选择需要取消指派人员的任务", false);
				return;
			}
			if($(".checkbox-for-all:checked").length > 1) {
				windowStart("请选择一条需要取消指派人员的任务", false);
				return;
			}
			if($(".checkbox-for-all:checked").attr("del") == "undefined") {
				windowStart("未指派不能做取消指派", false);
				return;
			}
			$(".checkbox-for-all").each(function() {
				if($(this).prop("checked")) {
					routeInfos = eval("(" + $(this).attr("theData") + ")");
					delMan = eval("(" + $(this).attr("del") + ")");
				}
			})
			removeAllMan();
		})
		//查询人员
	$("#btnSearchMan").click(function() {
			funRouteManSearch();
		})
		//指派人员
	$("#btnAddMan").click(function() {
			var i = 0;
			manInfos = [];
			$(".checkbox-for-all1").each(function() {
				if($(this).prop("checked")) {
					manInfos[i] = eval("(" + $(this).attr("theData") + ")");
					i++;
				}
			})
			console.log(manInfos);
			if(manInfos.length==0){
				windowStart("请选择需要的指派人员", false);
				return;
			}
			setManInfos();

			//		$("#manModal").modal("hide");
		})
		//修改查询人员
	$("#btnEditSearchMan").click(function() {
			funEditRouteManSearch();
		})
		//修改指派人员
	$("#btnEditMan").click(function() {
		if(delMan.length != 0) {
			removeMan();
			return;
		} 
			var i = 0;
			$(".checkbox-for-all2").each(function() {
				if($(this).prop("checked")) {
					editManInfos[i] = eval("(" + $(this).attr("theData") + ")");
					i++;
				}
			})
			console.log(editManInfos);
			editMan();
		
	})
	$("#btnCancle1").click(function() {
		$("#addManModal").modal("hide");
	})
	$("#btnCancle2").click(function() {
			$("#editManModal").modal("hide");
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
			searchRouteInfos();
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
			searchRouteInfos();
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
			searchRouteInfos();
			$('#pageNumId').val('');
		})
		//分页操作
})