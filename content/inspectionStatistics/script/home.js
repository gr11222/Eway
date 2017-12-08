// 1 表示查询巡检总数
// 2 表示查询维保总数
// 3 表示查询报修单总数
// 4 表示查询触发报警总数
// 5 表示查询巡检路线总数
// 6 表示查询漏检总数
//主页分页
var total = -1;
var data_page_index = 0;
var data_number = 10;
var curren_page = 1;
var total_page = 0;
//弹出框分页
var total1 = -1;
var data_page_index1 = 0;
var data_number1 = 10;
var curren_page1 = 1;
var total_page1 = 0;

var tableHead = [];
var tableContent = [];
var popTableHead = [];
var popTableContent = [];
var userAccount;
var userInfos;
var sign;
var user;

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

//********************************获得用户********************************
function searchUserInfosPara() {
	var jsonData = setJson(null, "resp", {});
	jsonData = setJson(jsonData, "account", "", true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询用户传值=" + jsonData);
	return jsonData;
}

function searchUserInfos() {
	$("#userName").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDataPagingUserQueryCriteriaCmd",
		contentType: "application/text,charset=utf-8",
		data: searchUserInfosPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询用户返回值=" + JSON.stringify(msg));
				createUserInfoSelect(msg);
				funMSChartSearch();
			} else {
				windowStart("查询用户失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询用户权限", false);
			} else {
				windowStart("查询用户失败", false);
			}
		}
	})
}

function createUserInfoSelect(msg) {
	//用户
	if(msg.account != undefined && msg.account.length > 0) {
		userAccount = msg.account;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < userAccount.length; i++) {
			str += "<option value='" + userAccount[i]["account"] + "'>" + userAccount[i]["nameCn"] + "</option>";
		}
		$("#userName").html(str);
	}
}
//********************************查询********************************
function funDSSearch() {
	$("#dataContent").html("");
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDataStatisticsSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: dataStatisticsSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				//$("#pageNumId").val("");
				console.log(JSON.stringify(msg));
				userInfos = msg;
				createDataStatisticsTableInfos(userInfos);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询权限", false);
			} else {
				windowStart("查询失败", false);
			}
			console.log("fail");
		}
	});
}

function dataStatisticsSearchPara() {
	var account = [];
	if($("#userName").val() == "-1") {
		for(var i = 0; i < userAccount.length; i++) {
			var arr = {};
			arr.account = userAccount[i]["account"];
			arr.nameCn = userAccount[i]["nameCn"];
			account.push(arr);
		}
	} else {
		var arr = {};
		arr.account = $("#userName").val();
		arr.nameCn = $("#userName option:selected").text();
		account.push(arr);
	}

	var jsonData = setJson(null, "propertyId", parseInt($("#company").val()));
	jsonData = setJson(jsonData, "projectId", parseInt($("#project").val()));
	jsonData = setJson(jsonData, "typeCode", parseInt($("#orderByItem").val()));
	jsonData = setJson(jsonData, "sign", parseInt($("#orderBy").val()));
	jsonData = setJson(jsonData, "account", account);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("数据统计查询传值=" + jsonData);
	return jsonData;

}

//*******************************创建表格***********************************
function createDataStatisticsTableInfos(userInfos) {
	tableHead[1] = "<th class='text-center' ><div class='checkbox'>巡检总数</div></th>";
	tableHead[2] = "<th class='text-center' ><div class='checkbox'>维保总数</div></th>";
	tableHead[3] = "<th class='text-center' ><div class='checkbox'>报修单总数</div></th>";
	tableHead[4] = "<th class='text-center' ><div class='checkbox'>触发报警总数</div></th>";
	tableHead[5] = "<th class='text-center' ><div class='checkbox'>巡检路线总数</div></th>";
	tableHead[6] = "<th class='text-center' ><div class='checkbox'>漏检统计</div></th>";

	//total = userInfos.totalNumber;

	if(!userInfos.item || userInfos.item.length < 1) {
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无数据统计信息";
		str += "</div>";
		$("#dataContent").html(str);
		return;
	}
	realData = userInfos.item;
	total_page = Math.ceil(parseInt(realData.length) / data_number);
	$("#pageTotalInfo").html("");
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + total_page + " 页");
	$("#dataContent").html("");

	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	//	str += "<th class='' ><div class='checkbox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>用户名</div></th>";
	var tital = realData[0].item;
	for(var i = 0; i <= 5; i++) {
		switch(tital[i]["sign"]) {
			case 1:
				str += tableHead[1];
				break;
			case 2:
				str += tableHead[2];
				break;
			case 3:
				str += tableHead[3];
				break;
			case 4:
				str += tableHead[4];
				break;
			case 5:
				str += tableHead[5];
				break;
			case 6:
				str += tableHead[6];
				break;
			default:
				str += tableHead[1];
				break;
		}
	}
	str += "</thead><tbody>";
	var topNum;
	if(realData.length > data_number * curren_page) {
		topNum = data_number * curren_page;
	} else {
		topNum = realData.length;
	}
	for(var i = data_number * (curren_page - 1); i < topNum; i++) {
		var data = realData[i].item;
		for(var m = 0; m < 6; m++) {
			switch(data[m]["sign"]) {
				case 1:
					tableContent[m] = "<td class='text-center' style='width:10%'><a style='cursor:pointer' class='checkInfos' sign='" + data[m]["sign"] + "' user='" + realData[i].account + "'>" + data[m]["count"] + "</a></td>";
					break;
				case 2:
					tableContent[m] = "<td class='text-center' style='width:10%'><a style='cursor:pointer' class='checkInfos' sign='" + data[m]["sign"] + "' user='" + realData[i].account + "'>" + data[m]["count"] + "</a></td>";
					break;
				case 3:
					tableContent[m] = "<td class='text-center' style='width:10%'><a style='cursor:pointer' class='checkInfos' sign='" + data[m]["sign"] + "' user='" + realData[i].account + "'>" + data[m]["count"] + "</a></td>";
					break;
				case 4:
					tableContent[m] = "<td class='text-center' style='width:10%'>" + data[m]["count"] + "</td>";
					break;
				case 5:
					tableContent[m] = "<td class='text-center' style='width:10%'><a style='cursor:pointer' class='checkInfos' sign='" + data[m]["sign"] + "' user='" + realData[i].account + "'>" + data[m]["count"] + "</a></td>";
					break;
				case 6:
					tableContent[m] = "<td class='text-center' style='width:10%'>" + data[m]["count"] + "</td>";
					break;
				default:
					break;
			}
		}
		str += "<tr  style='cursor:default'>";
		//       str += "<td class='' style='width:6%'><input type='checkbox'  class='repair-checkbox' theId='"+realData[i]["id"]+"'></td>";
		str += "<td class='text-center' style='width:10%'>" + realData[i].account + "</td>";
		for(var n = 0; n < 6; n++) {
			str += tableContent[n];
		}
		str += "</td>"
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#dataContent").html(str);
	$(".checkInfos").click(function() {
		sign = $(this).attr("sign");
		user = $(this).attr("user");
		$("#user").text(user);
		switch(parseInt(sign)) {
			case 1:
				$("#lable").text("资产名称");
				$("#time").text("巡检时间");
				break;
			case 2:
				$("#lable").text("资产名称");
				$("#time").text("维保时间");
				break;
			case 3:
				$("#lable").text("资产名称");
				$("#time").text("提交时间");
				break;
			case 5:
				$("#lable").text("路线名称");
				$("#time").text("完成时间");
				break;
		}
		total1 = -1;
		data_page_index1 = 0;
		data_number1 = 10;
		curren_page1 = 1;
		total_page1 = 0;
		$("#showInfosModal").modal("show");
		funUserInfosSearch();
	})

}

//********************************查询各项********************************
function funUserInfosSearch() {
	$("#listPart").html("");
	loadingStart("listPart");
	$(".startLoadingId").css("top", "80px");
	$(".startLoadingId").css("left", "15px");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDataStatisticsBasicInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: UserInfosSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				console.log(JSON.stringify(msg));
				createTable(msg);

			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询权限", false);
			} else {
				windowStart("查询失败", false);
			}
			console.log("fail");
		}
	});
}

function UserInfosSearchPara() {
	var jsonData = setJson(null, "sign", parseInt(sign));
	jsonData = setJson(jsonData, "keyWord", $("#keyWord").val());
	if($("#startTime").val() == "") {
		jsonData = setJson(jsonData, "insertTime", $("#startTime").val());
	} else {
		jsonData = setJson(jsonData, "insertTime", $("#startTime").val() + " 00:00:00");
	}
	if($("#endTime").val() == "") {
		jsonData = setJson(jsonData, "endTime", $("#endTime").val());
	} else {
		jsonData = setJson(jsonData, "endTime", $("#endTime").val() + " 23:59:59");
	}
	jsonData = setJson(jsonData, "userAccountName", user);
	jsonData = setJson(jsonData, "index", data_page_index1);
	jsonData = setJson(jsonData, "number", data_number1);
	console.log("个人各项查询传值=" + jsonData);
	return jsonData;

}
//********************************各项弹出框的表格********************************
function createTable(msg) {
	total1 = msg.totalNumber;

	switch(parseInt(sign)) {
		case 1:
			popTableHead[1] = "<th class='text-center' ><div class='checkbox'>序号</div></th>";
			popTableHead[2] = "<th class='text-center' ><div class='checkbox'>资产名称</div></th>";
			popTableHead[3] = "<th class='text-center' ><div class='checkbox'>类型</div></th>";
			popTableHead[4] = "<th class='text-center' ><div class='checkbox'>型号</div></th>";
			popTableHead[5] = "<th class='text-center' ><div class='checkbox'>标签编号</div></th>";
			popTableHead[6] = "<th class='text-center' ><div class='checkbox'>巡检时间</div></th>";
			break;
		case 2:
			popTableHead[1] = "<th class='text-center' ><div class='checkbox'>序号</div></th>";
			popTableHead[2] = "<th class='text-center' ><div class='checkbox'>资产名称</div></th>";
			popTableHead[3] = "<th class='text-center' ><div class='checkbox'>类型</div></th>";
			popTableHead[4] = "<th class='text-center' ><div class='checkbox'>型号</div></th>";
			popTableHead[5] = "<th class='text-center' ><div class='checkbox'>标签编号</div></th>";
			popTableHead[6] = "<th class='text-center' ><div class='checkbox'>维保时间</div></th>";
			break;
		case 3:
			popTableHead[1] = "<th class='text-center' ><div class='checkbox'>序号</div></th>";
			popTableHead[2] = "<th class='text-center' ><div class='checkbox'>资产名称</div></th>";
			popTableHead[3] = "<th class='text-center' ><div class='checkbox'>类型</div></th>";
			popTableHead[4] = "<th class='text-center' ><div class='checkbox'>报修单编号</div></th>";
			popTableHead[5] = "<th class='text-center' ><div class='checkbox'>标签编号</div></th>";
			popTableHead[6] = "<th class='text-center' ><div class='checkbox'>提交时间</div></th>";
			break;
		case 5:
			popTableHead[1] = "<th class='text-center' ><div class='checkbox'>序号</div></th>";
			popTableHead[2] = "<th class='text-center' ><div class='checkbox'>路线名称</div></th>";
			popTableHead[3] = "<th class='text-center' ><div class='checkbox'>包含设备</div></th>";
			popTableHead[4] = "<th class='text-center' ><div class='checkbox'>完成时间</div></th>";
			break;

	}
	switch(parseInt(sign)) {
		case 1:
			if(!msg.check || msg.check.length < 1) {
				$("#listPart").html("");
				var str = "";
				str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
				str += "提示:<br/>当前条件下无巡检统计信息";
				str += "</div>";
				$("#listPart").html(str);
				return;
			}
			break;
		case 2:
			if(!msg.check || msg.check.length < 1) {
				$("#listPart").html("");
				var str = "";
				str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
				str += "提示:<br/>当前条件下无维保统计信息";
				str += "</div>";
				$("#listPart").html(str);
				return;
			}
			break;
		case 3:
			if(!msg.repairOrder || msg.repairOrder.length < 1) {
				$("#listPart").html("");
				var str = "";
				str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
				str += "提示:<br/>当前条件下无报修单统计信息";
				str += "</div>";
				$("#listPart").html(str);
				return;
			}
			break;
		case 5:
			if(!msg.checkRoute || msg.checkRoute.length < 1) {
				$("#listPart").html("");
				var str = "";
				str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
				str += "提示:<br/>当前条件下无巡检路线统计信息";
				str += "</div>";
				$("#listPart").html(str);
				return;
			}
			break;

	}

	realData = msg.item;
	total_page1 = Math.ceil(parseInt(total1) / data_number);
	$("#pageTotalInfo1").html("");
	$("#pageTotalInfo1").html("第 " + curren_page1 + "页/共 " + total_page1 + " 页");
	$("#listPart").html("");

	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	//	str += "<th class='' ><div class='checkbox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	//	str += "<th class='text-center' ><div class='checkbox'>用户名</div></th>";
	for(var i = 0; i < popTableHead.length - 1; i++) {
		str += popTableHead[i + 1];
	}
	str += "</thead><tbody>";
	switch(parseInt(sign)) {
		case 1:
			var data = msg.check;
			for(var m = 0; m < data.length; m++) {
				str += "<tr  style='cursor:default'>";
				//       str += "<td class='' style='width:6%'><input type='checkbox'  class='repair-checkbox' theId='"+realData[i]["id"]+"'></td>";
				str += "<td class='text-center' style='width:10%'>" + (m + 1) + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["nameCn"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["type"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["model"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["labelCode"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["checkTime"] + "</td>";
				str += "</tr>";

			}
			break;
		case 2:
			var data = msg.check;
			for(var m = 0; m < data.length; m++) {
				str += "<tr  style='cursor:default'>";
				//       str += "<td class='' style='width:6%'><input type='checkbox'  class='repair-checkbox' theId='"+realData[i]["id"]+"'></td>";
				str += "<td class='text-center' style='width:10%'>" + (m + 1) + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["nameCn"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["type"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["model"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["labelCode"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["checkTime"] + "</td>";
				str += "</tr>";

			}
			break;
		case 3:
			var data = msg.repairOrder;
			for(var m = 0; m < data.length; m++) {
				str += "<tr  style='cursor:default'>";
				//       str += "<td class='' style='width:6%'><input type='checkbox'  class='repair-checkbox' theId='"+realData[i]["id"]+"'></td>";
				str += "<td class='text-center' style='width:10%'>" + (m + 1) + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["nameCn"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["type"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["number"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["labelCode"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["submitTime"] + "</td>";
				str += "</tr>";

			}
			break;
		case 5:
			var data = msg.checkRoute;
			for(var m = 0; m < data.length; m++) {
				str += "<tr  style='cursor:default'>";
				//       str += "<td class='' style='width:6%'><input type='checkbox'  class='repair-checkbox' theId='"+realData[i]["id"]+"'></td>";
				str += "<td class='text-center' style='width:10%'>" + (m + 1) + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["nameCn"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["count"] + "</td>";
				str += "<td class='text-center' style='width:10%'>" + data[m]["finishTime"] + "</td>";
				str += "</tr>";

			}
			break;
	}
	str += "</tbody><table>";
	$("#listPart").html(str);
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

function funCheck() {
	var numReg = /^[0-9]*[1-9][0-9]*$/;
	if(parseInt($("#buyer").val()) == -1) {
		windowStart("请选择购买方", false);
		return false;
	}
	if($("#applyNum").val() == "") {
		windowStart("请输入申请数量", false);
		return false;
	}
	if(!numReg.test($("#applyNum").val())) {
		windowStart("输入申请数量格式有误", false);
		return false;
	}
	if(parseInt($("#applyNum").val()) > 50000) {
		windowStart("输入申请数量太多了，请重新填写", false);
		return false;
	}
	return true;
}

function funEditCheck() {
	var numReg = /^[0-9]*[1-9][0-9]*$/;
	if(parseInt($("#editBuyer").val()) == -1) {
		windowStart("请选择购买方", false);
		return false;
	}
	if($("#editApplyNum").val() == "") {
		windowStart("请输入申请数量", false);
		return false;
	}
	if(!numReg.test($("#editApplyNum").val())) {
		windowStart("输入申请数量格式有误", false);
		return false;
	}
	if(parseInt($("#editApplyNum").val()) > 50000) {
		windowStart("输入申请数量太多了，请重新填写", false);
		return false;
	}
	return true;
}
$(document).ready(function() {
	$(".input-style-time").datepicker("setValue");
	$(".input-style-time").val("");
	searchUserInfos();

	$("#company").change(function() {
		searchUserInfos();
	});
	$("#project").change(function() {
		searchUserInfos();
	});
	$("#btnSearchDataStatistics").click(function() {
		funDSSearch();
	})
	$("#btnSearch").click(function() {
			funUserInfosSearch();
		})
		//****************分页操作****************
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
			createDataStatisticsTableInfos(userInfos);
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
			createDataStatisticsTableInfos(userInfos);
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
		createDataStatisticsTableInfos(userInfos);
	})

	//****************弹出框分页操作****************
	//上一页
	$("#btnPageBefore1").click(function() {
			if(total_page1 == 0) {
				return;
			}

			if(curren_page1 == 1) {
				windowStart("当前为首页", false);
				return;
			}
			data_page_index1 -= data_number1;
			curren_page1 -= 1;
			funUserInfosSearch();
		})
		//下一页
	$("#btnPageNext1").click(function() {
			if(total_page1 == 0) {
				return;
			}

			if(total_page1 == curren_page1) {
				windowStart("当前为尾页", false);
				return;
			}
			data_page_index1 += data_number1;
			curren_page1 += 1;
			funUserInfosSearch();
		})
		//跳转页
	$("#btnPageJump1").click(function() {
		if(total_page1 == 0) {
			return;
		}
		var numReg = /^[0-9]+$/;
		if(!numReg.test($("#pageNumId1").val())) {
			windowStart("页码输入有误", false);
			return;
		}
		if(parseInt($("#pageNumId1").val()) < 1) {
			windowStart("页码输入有误", false);
			return;
		}
		if(parseInt($("#pageNumId1").val()) > total_page1) {
			windowStart("页码输入有误", false);
			return;
		}
		data_page_index1 = (parseInt($("#pageNumId1").val()) - 1) * data_number1;
		curren_page1 = parseInt($("#pageNumId1").val());
		funUserInfosSearch();
	})
})