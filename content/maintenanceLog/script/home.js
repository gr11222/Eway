var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;

var idOfRepair;
var repairList = [];
// var addRepairList = [];
var theData_length;

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

//-------------------------------------------查询信息--------------------------------------------------------
function funGetInfoPara() {
	var start_time = "";
	var end_time = "";
	if (!$("#startTime").val()) {
		start_time = "";
	} else {
		start_time = $("#startTime").val() + " 00:00:00";
	}
	if (!$("#endTime").val()) {
		end_time = "";
	} else {
		end_time = $("#endTime").val() + " 23:59:59";
	}
	var jsonData = setJson(null, "assetName", $("#manName").val());
	jsonData = setJson(jsonData, "startTime", start_time);
	jsonData = setJson(jsonData, "endTime", end_time);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	console.log("查询页面信息传值=" + jsonData);
	return jsonData;
}

function funGetInfo() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	if ($("#startTime").val().length == 0 && $("#endTime").val().length == 0) {
		windowStart("时间范围有误,请填写时间范围", false);
		return;
	}
	if ($("#startTime").val().length > 0) {
		if (!timeReg.test($("#startTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return;
		}
	}
	if ($("#endTime").val().length > 0) {
		if (!timeReg.test($("#endTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return;
		}
	}
	if ($("#startTime").val().length == 0) {
		if ($("#endTime").val().length > 0) {
			windowStart("请输入开始时间", false);
			return;
		}
	}
	if ($("#endTime").val().length == 0) {
		if ($("#startTime").val().length > 0) {
			windowStart("请输入结束时间", false);
			return;
		}
	}
	if ($("#startTime").val().length > 0 && $("#endTime").val().length > 0) {
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1])-1, parseInt(endTime[2]));
		if (parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("开始时间不能大于结束时间", false);
			return;
		}
	}
	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairOperateRecordSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetInfoPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询日志返回值=" + JSON.stringify(msg));
			total = msg.totalNumber;
			var totalPage = Math.ceil(parseInt(total) / data_number);
			total_page = totalPage;
			if(totalPage===0){
				totalPage = 1;
			}
			$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");
			createInfos(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询日志权限", false);
			} else {
				windowStart("查询日志失败", false);
			}
		}
	})
}

function createInfos(msg) {
	if (!msg.item || msg.item.length < 1) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无日志信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
	var realData = msg.item;

	var str = "";
	str += "<table class='mainTable table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' style='width:5%' >序号</th>";
	str += "<th class='text-center' >内容</th>";
	str += "<th class='text-center' >设备名称</th>";
	str += "<th class='text-center' >操作人</th>";
	str += "<th class='text-center' >时间</th>";
	str += "<th class='text-center' >操作类型</th>";
	str += "<th class='text-center' >忽略原因</th>";
	str += "<th class='text-center'>分配人</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr class='table-content'>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + (i+1) + "'>" + (i+1) + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairContent"] + "'>" + realData[i]["repairContent"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["assetName"] + "'>" + realData[i]["assetName"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["operateUser"] + "'>" + realData[i]["operateUser"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["operateTime"] + "'>" + realData[i]["operateTime"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["operateType"] + "'>" + realData[i]["operateType"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["IgnoreReason"] + "'>" + realData[i]["IgnoreReason"] + "</td>";
			if(realData[i]["allocateUser"]){
			var participantName = [];
			for (var j = 0; j < realData[i]["allocateUser"].length; j++) {
				participantName.push(realData[i]["allocateUser"][j]["userName"]);
			}	
				str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + participantName.join(",") + "'>" + participantName.join(",") + "</td>";
		}else{
				str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title=''></td>";
		}
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	}
// --------------------------------------------------查询信息结束---------------------------------------------


$(document).ready(function() {
	$(".input-style").datepicker("setValue");
	funGetInfo();
	//查询
	$("#btnSearch").click(function() {
		data_page_index = 0;
 		curren_page = 1;
		funGetInfo();
	})
	//上一页2
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
			funGetInfo();

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
			funGetInfo();

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
		funGetInfo();
		$("#pageNumId").val("");

	})
})