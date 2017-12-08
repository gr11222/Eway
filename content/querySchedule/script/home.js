var status = 1;
var checkedList = [];
var delId;
var rTime = "";

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

//*************************************************查询任务**********************************************
function funSearchTaskPara() {
	var jsonData = setJson(null, "startTime", $("#queryTime1").val());
	jsonData = setJson(jsonData, "endTime", $("#queryTime2").val());
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询任务传值=" + jsonData);
	return jsonData;
}

function funSearchTask() {
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAgendaInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funSearchTaskPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				console.log(JSON.stringify(msg));
				createSetScheduleTableInfos(msg);
			} else {
				windowStart("查询失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无添加任务权限", false);
			} else {
				windowStart("添加任务失败", false);
			}
		}
	});
}

function createSetScheduleTableInfos(msg) {
	$("#dataContent").html("");
	if(!msg.items || msg.items.length < 1) {
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前日期无任务信息";
		str += "</div>";
		$("#dataContent").html(str);
		return;
	}
	var realData = msg.items;
	var str = " ";

	for(var i = 0; i < realData.length; i++) {
		str += '<div class="data-content-list" style="cursor: pointer" date="' + realData[i]["agendaDate"] + '">';
		str += '<div class="list-one">';
		str += '<div class="key-word-style">';
		str += '<p>执行日期：</p>';
		str += '</div>';
		str += '<div class="list-bottom">';
		str += '<p>' + realData[i]["agendaDate"] + '</p>';
		str += '</div>';
		str += '</div>';
		str += '<div class="list-two">';
		str += '<div class="key-word-style">';
		str += '<p>任务数量：</p>';
		str += '</div>';
		str += '<div class="list-bottom">';
		str += '<p>' + realData[i]["taskCount"] + '</p>';
		str += '</div></div>';
		str += '<div class="list-three" style="line-height: 70px;">';
		str += '</div></div>';
		str += '';
	}
	$("#dataContent").html(str);
	$(".date-time-style").datepicker("setValue");
	$(".date-time-style").val($("#queryTime").val());
	$(".data-content-list").click(function() {
		$("#taskDevice").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "请选择任务查看设备内容！";
		str += "</div>";
		$("#taskDevice").html(str);
		$("#taskMan").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "请选择任务查看人员名单！";
		str += "</div>";
		$("#taskMan").html(str);
		funTaskInfos($(this).attr("date"));
	})

}

//*************************************************查询任务详细信息**********************************************
function funTaskInfosPara(date) {
	var jsonData = setJson(null, "agendaDate", date);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询任务详细信息传值=" + jsonData);
	return jsonData;
}

function funTaskInfos(date) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAgendaItemInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funTaskInfosPara(date),
		success: function(msg) {
			console.log("任务详细信息返回值=" + JSON.stringify(msg));

			createTableOneInfos(msg);
			$("#TaskModal").modal("show");
		},
		error: function() {
			loadingStop();
			console.log("fail");
		}
	});
}
//*************************************************任务列表**********************************************
function createTableOneInfos(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#taskContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前日期无任务信息";
		str += "</div>";
		$("#taskContent").html(str);
		return;
	}
	$("#taskContent").html("");
	var data = msg.items;
	var str = "";
	for(var i = 0; i < data.length; i++) {
		str += '<div class="task-content-list" deviceCn=' + JSON.stringify(data[i]["deviceCn"]) + '  userItem=' + JSON.stringify(data[i]["userItem"]) + '>';
		str += '<div class="list-one" style="width: 31%;float: left;text-align: center;">';
		str += '<p>' + data[i]["routeCn"] + '</p>';
		str += '</div><div class="list-two" style="width: 31%;float: left;text-align: center;">';
		str += '<span >包含设备总数：</span>';
		str += '<span >' + data[i]["deviceCount"] + '</span>';
		str += '</div><div class="list-three" style="width: 35%;float: left;text-align: center;">';
		if(!data[i]["remindTime"]) {
			str += '<p></p>';
		} else {
			if(data[i]["remindTime"].length == 10) {
				str += '<p>' + data[i]["remindTime"] + '</p>';
			} else {
				var remindTime = [];
				remindTime = data[i]["remindTime"].split(":");
				str += '<p>' + remindTime[0] + ':' + remindTime[1] + '</p>';
			}

		}

		str += '</div></div>';
	}
	$("#taskContent").html(str);
	$(".task-content-list").click(function() {
		//	event.stopPropagation(event);		
		var msg = $(this).attr("deviceCn");
		if($(this).attr("deviceCn") == "undefined") {
			$("#taskDevice").html("");
			var str = "";
			str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
			str += "提示:<br/>当前条件下无设备内容信息";
			str += "</div>";
			$("#taskDevice").html(str);
		} else {
			createTableTwoInfos(msg);
		}
		var msg1 = $(this).attr("userItem");
		if($(this).attr("userItem") == "undefined") {
			$("#taskMan").html("");
			var str = "";
			str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
			str += "提示:<br/>当前条件下无人员名单信息";
			str += "</div>";
			$("#taskMan").html(str);
		} else {
			createTableThreeInfos(msg1);
		}

	})
}

//*************************************************设备内容**********************************************
function createTableTwoInfos(msg) {
	var data = eval("(" + msg + ")");
	$("#taskDevice").html("");
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>设备名称</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < data.length; i++) {
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='width:10%'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + data[i] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#taskDevice").html(str);
}
//*************************************************人员名单**********************************************
function createTableThreeInfos(msg1) {
	var data = eval("(" + msg1 + ")");
	console.log(data);
	$("#taskMan").html("");
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>人员名单</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < data.length; i++) {
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + data[i]["userCn"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#taskMan").html(str);
}

function funDateCheck() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	if($("#queryTime1").val().length > 0 && $("#queryTime2").val().length == 0) {
		windowStart("请输入结束时间", false);
		return false;
	}
	if($("#queryTime1").val().length == 0 && $("#queryTime2").val().length > 0) {
		windowStart("请输入开始时间", false);
		return false;
	}
	if($("#queryTime1").val().length > 0) {
		if(!timeReg.test($("#queryTime1").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if($("#queryTime2").val().length > 0) {
		if(!timeReg.test($("#queryTime2").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if($("#queryTime1").val().length > 0 && $("#queryTime2").val().length > 0) {
		var startTime = $("#queryTime1").val().split("-");
		var endTime = $("#queryTime2").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间", false);
			return false;
		}
	}
	return true;
}

$(document).ready(function() {
	$(".input-style").datepicker("setValue");
	//	$(".input-style").val("");

	$("#btnSearch").click(function() {
		if(!funDateCheck()) {
			return;
		}
		funSearchTask();
	})
	$("#btnClose").click(function() {
		$("#TaskModal").modal("hide");
	})

})