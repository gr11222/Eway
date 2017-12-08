var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var data_page_index2 = 0;
var data_number2 = 17;
var curren_page2 = 1;
var total_page2 = 0;
var key;
var realData;
var status = -1;
var lableorder_length = 0;

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

//--------获得下拉选项---------
function searchSysInfosPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "items", "", true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询下拉选择传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	$("#selectPA").html("");
	$("#selectBuyer").html("");
	$("#buyer").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSaleCompanyTagQueryItemCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询下拉选择返回值=" + JSON.stringify(msg));
				createSysInfoSelect(msg);
			} else {
				windowStart("查询下拉选择失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询权限", false);
			} else {
				windowStart("查询失败", false);
			}
		}
	})
}

function createSysInfoSelect(msg) {
	//PA
	if(msg.item != undefined && msg.item.length > 0) {
		var theData = msg.item;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["saleid"] + "' data='" + JSON.stringify(theData[i]) + "'>" + theData[i]["sale"] + "</option>";
		}
		$("#selectPA").html(str);

	}
	//购买方
	if(msg.item != undefined && msg.item.length > 0) {
		var str = "<option value='-1'>请选择PA</option>";
		$("#selectBuyer").html(str);
	}
}

//--------查询---------
function funLOSearch() {
	$("#dataContent").html("");
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSaleCompanyTagSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: lableOrderSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				$("#pageNumId").val("");
				console.log(JSON.stringify(msg));
				createlableOrderTableInfos(msg);
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
			//windowStart("查询失败", false);
			console.log("fail");
		}
	});
}

function lableOrderSearchPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	var queryItem = setJson(null, "saleid", parseInt($("#selectPA").val()));
	queryItem = setJson(queryItem, "buyersid", parseInt($("#selectBuyer").val()));
	queryItem = setJson(queryItem, "orderCode", $("#workOrderNo").val());
	if($("#startTime").val() == "") {
		queryItem = setJson(queryItem, "startTime", $("#startTime").val());
	} else {
		queryItem = setJson(queryItem, "startTime", $("#startTime").val() + " 00:00:00");
	}
	if($("#endTime").val() == "") {
		queryItem = setJson(queryItem, "endTime", $("#endTime").val());
	} else {
		queryItem = setJson(queryItem, "endTime", $("#endTime").val() + " 23:59:59");
	}
	queryItem = setJson(queryItem, "index", data_page_index);
	queryItem = setJson(queryItem, "number", data_number);
	queryItem = setJson(queryItem, "status", parseInt(status));
	jsonData = setJson(jsonData, "queryItem", eval("(" + queryItem + ")"));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "totalNumber", total);
	console.log("标签工单查询传值=" + jsonData);
	return jsonData;
}

function createlableOrderTableInfos(msg) {
	if(!msg.item || msg.item.length < 1) {
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无标签工单信息";
		str += "</div>";
		$("#dataContent").html(str);
		return;
	}
	total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");
	$("#dataContent").html("");
	realData = msg.item;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>工单编号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>PA人员</div></th>";
	str += "<th class='text-center'><div class='checkbox'>购买方</div></th>";
	str += "<th class='text-center'><div class='checkbox'>标签总数</div></th>";
	str += "<th class='text-center'><div class='checkbox'>操作时间</div></th>";
	str += "<th class='text-center'><div class='checkbox'>工单状态</div></th>";
	str += "</thead><tbody>";

	for(var i = 0; i < realData.length; i++) {
		var theData = JSON.stringify(realData[i]);
		str += "<tr  style='cursor:default'>";
		str += "<td class='' style='width:5%'><input type='checkbox'  status='" + realData[i]["status"] + "'  data='" + theData + "'  class='lableorder-checkbox' theId='" + realData[i]["id"] + "'></td>";
		str += "<td class='text-center' style='width:10%'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["orderCode"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["sale"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["buyers"] + "</td>"
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["tagCount"] + "</td>";
		str += "<td class='text-center' style='width:20%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["insertTime"] + "</td>";
		switch(realData[i]["status"]) {
			case 0:
				str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>草稿</td>";
				break;
			case 1:
				str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>已提交</td>";
				break;
			case 2:
				str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>已驳回</td>";
				break;
			case 3:
				str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>已审核</td>";
				break;
			default:
				break;
		}
	}
	str += "</tbody><table>";
	$("#dataContent").html(str);

	$("#allCheckBox").change(function() {
		if($(this).prop("checked")) {
			$(".lableorder-checkbox").prop("checked", true);
			lableorder_length = $(".lableorder-checkbox").length;
		} else {
			$(".lableorder-checkbox").prop("checked", false);
			lableorder_length = 0;
		}
	})
	$(".lableorder-checkbox").change(function() {
		if($(this).prop("checked")) {
			lableorder_length++;
			if(lableorder_length == $(".lableorder-checkbox").length) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}

		} else {
			lableorder_length--;
			if(lableorder_length == $(".lableorder-checkbox").length) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		}
	})

}

//--------工单审核，驳回---------

function funLOCheckAndReject() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSaleCompanyTagOrderCommitCmd",
		contentType: "application/text,charset=utf-8",
		data: lableLOCheckAndRejectPara(),
		success: function(msg) {
			//if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
			if(key == "审核") {
				windowStart("工单审核成功", true);
				funLOSearch();
			} else {
				windowStart("工单驳回成功", true);
				funLOSearch();
			}
			//}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无审核和驳回权限", false);
			} else {
				windowStart("操作失败", false);
			}
			console.log("fail");
		}
	});
}

function lableLOCheckAndRejectPara() {
	var dataArr = [];
	if(key == "审核") {
		for(var i = 0; i < $(".lableorder-checkbox:checked").length; i++) {
			var theData = eval("(" + $(".lableorder-checkbox:checked").eq(i).attr("data") + ")");
			var obj = {};
			obj.id = parseInt(theData.id);
			obj.status = 3;
			dataArr.push(obj);
		}
	}
	if(key == "驳回") {
		for(var i = 0; i < $(".lableorder-checkbox:checked").length; i++) {
			var theData = eval("(" + $(".lableorder-checkbox:checked").eq(i).attr("data") + ")");
			var obj = {};
			obj.id = parseInt(theData.id);
			obj.status = 2;
			dataArr.push(obj);
		}
	}
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "commitProperty", dataArr);
	console.log("工单审核或驳回传值=" + jsonData);
	return jsonData;
}

function funGetDayCheckInfo() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0) {
	//		windowStart("时间范围有误,请填写时间范围", false);
	//		return;
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
	if($("#workOrderNo").val().length > 0) {
		var numReg =  /^[a-zA-Z0-9]+$/;
		if(!numReg.test($("#workOrderNo").val())) {
			windowStart("工单编号格式有误，请重新填写", false);
			return false;
		}
	}
    return true;
}

function lableCheck() {
	var isAck = false;
	if($(".lableorder-checkbox:checked").length != 1) {
		for(var i = 1; i < $(".lableorder-checkbox:checked").length; i++) {
			if($(".lableorder-checkbox:checked").eq(0).attr("status") != $(".lableorder-checkbox:checked").eq(i).attr("status")) {

				isAck = true;
				break;
			}

		}

	}
	if(isAck) {
		windowStart("请选择相同状态的工单", false);
		return false;
	}
	if($(".lableorder-checkbox:checked").eq(0).attr("status") == 3 && key == "审核") {
		windowStart("已审核不能再审核", false);
		return false;
	}
	if($(".lableorder-checkbox:checked").eq(0).attr("status") == 3 && key == "驳回") {
		windowStart("已审核不能再驳回", false);
		return false;
	}

	if($(".lableorder-checkbox:checked").eq(0).attr("status") == 2 ) {
		windowStart("不能对已驳回标签进行操作", false);
		return false;
	}
//	if($(".lableorder-checkbox:checked").eq(0).attr("status") == 2 && key == "审核") {
//		windowStart("已驳回不能再", false);
//		return false;
//	}
	return true;
}

$(document).ready(function() {
	$(".input-style").datepicker("setValue");
	$(".input-style").val("");
	searchSysInfos();
	$("#btnSearchLableOrder").click(function() {
		if (!funGetDayCheckInfo()) {
			return;
		}
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		funLOSearch();
	})
	$(".btn-hover").click(function() {
		$(".btn-hover").each(function() {
			$(this).removeClass("btn-primary");
			$(this).addClass("btn-default");
		})
		$(this).removeClass("btn-default");
		$(this).addClass("btn-primary");
		status = $(this).attr("theEq");
		data_page_index = 0;
		data_number = 17;
		curren_page = 1;
		funLOSearch();
	})
	$("#btnCheck").click(function() {
		key = "审核";
		if(!lableCheck()) {
			return;
		}
		funLOCheckAndReject();
	})
	$("#btnReject").click(function() {
		key = "驳回";
		if(!lableCheck()) {
			return;
		}
		funLOCheckAndReject();
	})

	$("#selectPA").change(function() {
		var str;
		if($("#selectPA").find("option:selected").attr("value") == "-1") {
			str = "<option value='-1'>请选择PA</option>";
		} else {
			var data = eval('(' + $("#selectPA").find("option:selected").attr("data") + ')');
			str = "<option value='-1'>请选择</option>";
			str += "<option value='" + data.buyersid + "'>" + data.buyers + "</option>";
		}

		$("#selectBuyer").html(str);
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
			funLOSearch();
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
			funLOSearch();
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
			funLOSearch();
		})
		//分页操作
})