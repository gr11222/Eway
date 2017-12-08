var theNum = 0;
var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var alarm_length = 0;
var delete_alarm_data = {};

function cusSort(arr) {
	arr.sort(function(a, b) {
		return a.localeCompare(b);
	})
	return arr;
}

function createobjData(data1, data2) {
	//	console.log();
	var arr = [];
	for(var i = 0; i < data1.length; i++) {

		for(var j = 0; j < data2.length; j++) {
			if(data1[i] == data2[j]["nameCn"]) {
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
	$("#companyName1").html("");
	$("#projectName1").html("");
	$("#toolStyle").html("");
	$("#facilitator").html("");

	//	$("#editassetTypeModal").html("");
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
				funGetDayCheckInfo();
				funSPASearch();
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
		var currenData = msg.factoryItems;
		var dataArr = [];
		for(var i = 0; i < currenData.length; i++) {
			dataArr.push(currenData[i]["nameCn"]);
		}

		var sortData = cusSort(dataArr);

		var theData = createobjData(sortData, currenData);

		var str = "<option value=''>请选择</option>";
		//		for(var i = 0 ; i < theData.length ; i++ )
		//		{
		//			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
		//		}
		$("#companyName1").html(str);

	}

	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#projectName1").html(str);
	}
	//	if(msg.deviceModelItems != undefined && msg.deviceModelItems.length > 0  )
	//	{
	//		var theData = msg.deviceModelItems;
	//		var str = "<option value=''>请选择</option>";
	//		for(var i = 0 ; i < theData.length ; i++ )
	//		{
	//			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
	//		}
	//		$("#alarmCondition").html(str);	
	//	}

	if(msg.DeviceItems != undefined && msg.DeviceItems.length > 0) {
		var currenData = msg.DeviceItems;
		var dataArr = [];
		for(var i = 0; i < currenData.length; i++) {
			dataArr.push(currenData[i]["nameCn"]);
		}

		var sortData = cusSort(dataArr);

		var theData = createobjData(sortData, currenData);

		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#toolStyle").html(str);
	}
	if(msg.CompanyItems != undefined && msg.CompanyItems.length > 0) {
		var currenData = msg.CompanyItems;
		var dataArr = [];
		for(var i = 0; i < currenData.length; i++) {
			dataArr.push(currenData[i]["nameCn"]);
		}

		var sortData = cusSort(dataArr);

		var theData = createobjData(sortData, currenData);

		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#facilitator").html(str);
	}
}
//备品备件参数
function sparPASearchPara() {
	loadingStart("dataContent");
	var deviceClassifyId = -1;
	var companyId = -1;
	if($("#toolStyle").val().length > 0) {
		deviceClassifyId = parseInt($("#toolStyle").val());
	}
	if($("#facilitator").val() != undefined && $("#facilitator").val() != null && $("#facilitator").val().length > 0) {
		companyId = parseInt($("#facilitator").val());
	}
	var startTime = "",
		endTime = "";
	if($("#startTime5").val().length > 0) {
		startTime = $("#startTime5").val() + " 00:00:00";
	}
	if($("#endTime5").val().length > 0) {
		endTime = $("#endTime5").val() + " 23:59:59";
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "enterprise", $("#companyName1").val());
	jsonData = setJson(jsonData, "project", $("#projectName1").val());
	jsonData = setJson(jsonData, "aclState", $("#alarmCondition").val());
	jsonData = setJson(jsonData, "deviceClassifyId", deviceClassifyId);
	jsonData = setJson(jsonData, "deviceModel", $("#model").val());
	jsonData = setJson(jsonData, "companyId", companyId);
	jsonData = setJson(jsonData, "startTime", startTime);
	jsonData = setJson(jsonData, "endTime", endTime);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询备品备件报警传值=" + jsonData);
	return jsonData;
}

function funSPASearch() {
	$("#spacontent").html("");
	loadingStart("spacontent");
	alarm_length = 0;
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSparePartsAlarmSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: sparPASearchPara(),
		success: function(msg) {
			loadingStop();
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSparPartsAlarmTableInfos(msg);
				console.log(JSON.stringify(msg));
			}
		},
		error: function() {
			loadingStop();
			console.log("fail");
		}
	});
}

function createSparPartsAlarmTableInfos(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#spacontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无备品备件报警信息";
		str += "</div>";
		$("#spacontent").html(str);
		return;
	}
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");
	var realData = msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead><tr>";
	str += "<th class=''><input type='checkbox' id='all-checkbox'>全选</th>";
	str += "<th class='text-center' ><div class='checkbox'>报警编号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>备品类型</div></th>";
	str += "<th class='text-center'><div class='checkbox'>备品型号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>服务商</div></th>";
	str += "<th class='text-center'><div class='checkbox'>报警时间</div></th>";
	str += "<th class='text-center'><div class='checkbox'>剩余件数</div></th>";
	str += "<th class='text-center'><div class='checkbox'>报警件数</div></th>";
	str += "<th class='text-center'><div class='checkbox'>报警状态</div></th>";
	str += "<th class='text-center'><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";

	for(var i = 0; i < realData.length; i++) {
		var data = JSON.stringify(realData[i]);
		str += "<tr  style='cursor:default'>";
		str += "<td class='' style='width:6%;'><input state='" + realData[i]["aclState"] + "' data='" + data + "' theId='" + realData[i]["id"] + "' type='checkbox' class='each-checkbox'><span style='padding-left:5px'>" + (i + 1) + "</span></td>";
		str += "<td class='text-center' style='width:14%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["alarmCode"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceClassifyName"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceModel"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["company"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["alarmTime"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["spareNum"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["alarmLimit"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["aclState"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'><a data='" + data + "' theId='" + realData[i]["id"] + "'  href='javascript:void(0)' class='delete-alarm' ><img src='../img/dele.png'/></a></td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#spacontent").html(str);

	$("#all-checkbox").change(function() {
		if($(this).prop("checked")) {
			$(".each-checkbox").prop("checked", true);
			alarm_length = $(".each-checkbox").length;
		} else {
			$(".each-checkbox").prop("checked", false);
			alarm_length = 0;
		}
	})
	$(".each-checkbox").change(function() {
		if($(this).prop("checked")) {
			alarm_length++;
			if(alarm_length == $(".each-checkbox").length) {
				$("#all-checkbox").prop("checked", true);
			} else {
				$("#all-checkbox").prop("checked", false);
			}

		} else {
			alarm_length--;
			if(alarm_length == $(".each-checkbox").length) {
				$("#all-checkbox").prop("checked", true);
			} else {
				$("#all-checkbox").prop("checked", false);
			}
		}
	})
	$(".delete-alarm").click(function() {
		if(!confirm("是否确认删除?")) {
			return;
		}
		ackOrDel = "删除";
		delete_alarm_data = eval("(" + $(this).attr("data") + ")");
		funSPAlarmInfos();
	})
}
//响应报警
function funSPAlarmInfosPara() {
	var dataArr = [];
	if(ackOrDel == "响应") {
		for(var i = 0; i < $(".each-checkbox:checked").length; i++) {
			var theData = eval("(" + $(".each-checkbox:checked").eq(i).attr("data") + ")");
			var obj = {};
			obj.id = parseInt(theData.id);
			obj.alarmCode = theData.alarmCode;
			obj.deviceClassifyId = theData.deviceClassifyId;
			obj.deviceModel = theData.deviceModel;
			obj.company = theData.company;
			obj.alarmTime = theData.alarmTime;
			obj.spareNum = parseInt(theData.spareNum);
			obj.alarmLimit = parseInt(theData.alarmLimit);
			obj.aclState = theData.aclState;
			obj.aclUser = localStorage.getItem("userAccountName");
			obj.deviceClassifyName = "";
			obj.companyId = parseInt(theData.companyId);
			obj.dispose = "响应";
			obj.aclTime = "";
			dataArr.push(obj);
		}
	} else {
		var theData = delete_alarm_data;
		var obj = {};
		obj.id = parseInt(theData.id);
		obj.alarmCode = theData.alarmCode;
		obj.deviceClassifyId = parseInt(theData.deviceClassifyId);
		obj.deviceModel = theData.deviceModel;
		obj.company = theData.company;
		obj.alarmTime = theData.alarmTime;
		obj.spareNum = parseInt(theData.spareNum);
		obj.alarmLimit = parseInt(theData.alarmLimit);
		obj.aclState = theData.aclState;
		obj.aclUser = localStorage.getItem("userAccountName");
		obj.deviceClassifyName = "";
		obj.companyId = parseInt(theData.companyId);
		obj.dispose = "删除";
		obj.aclTime = "";
		dataArr.push(obj);
	}
	var jsonData = setJson(jsonData, "items", dataArr);
	console.log("响应或删除报警传值=" + jsonData);
	return jsonData;
}

function funSPAlarmInfos() {
	var theUrl = "";

	if(ackOrDel == "响应") {
		theUrl = "DevOpsSparePartsAlarmUpdateCmd";

	} else {
		theUrl = "DevOpsSparePartsAlarmDeleteCmd";

	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=" + theUrl,
		contentType: "application/text,charset=utf-8",
		data: funSPAlarmInfosPara(),
		success: function(msg) {

			console.log("报警响应返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				if(ackOrDel == "响应") {
					windowStart("响应报警成功", true);
				} else {
					windowStart("删除报警成功", true);
				}
				funSPASearch();
			} else {
				if(ackOrDel == "响应") {
					if(msg.responseCommand.indexOf("No") != -1) {
						windowStart("响应报警失败,请选择未响应状态的报警进行相应操作", false);
					} else if(msg.responseCommand.indexOf("Finish") != -1) {
						windowStart("所选报警已经响应,不能重复响应", false);
					} else {
						windowStart("响应报警失败", false);
					}
				} else {
					windowStart("删除报警失败", false);
				}
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				if(ackOrDel == "响应") {
					windowStart("当前用户无响应报警权限", false);
				} else {
					windowStart("当前用户无删除报警权限", false);
				}

			} else {
				if(ackOrDel == "响应") {
					windowStart("响应报警失败", false);
				} else {
					windowStart("删除报警失败", false);
				}
			}
			//			windowStart("查询点检信息失败",false);
		}
	})
}

function funGetDayCheckInfo() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime5").val().length == 0 || $("#endTime5").val().length == 0) {
	//		windowStart("时间范围有误,请填写时间范围", false);
	//		return;
	//	}
	if($("#startTime5").val().length > 0 && $("#endTime5").val().length == 0) {
		windowStart("请输入结束时间", false);
		return false;
	}
	if($("#startTime5").val().length == 0 && $("#endTime5").val().length > 0) {
		windowStart("请输入开始时间", false);
		return false;
	}
	if($("#startTime5").val().length > 0) {
		if(!timeReg.test($("#startTime5").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if($("#endTime5").val().length > 0) {
		if(!timeReg.test($("#endTime5").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if($("#startTime5").val().length > 0 && $("#endTime5").val().length > 0) {
		var startTime = $("#startTime5").val().split("-");
		var endTime = $("#endTime5").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间", false);
			return false;
		}

	}
	return true;
}

function alarmCheck() {
	//	var lable=$(".each-checkbox:checked").eq(0).attr("state");
	var isAck = false;
	for(var i = 0; i < $(".each-checkbox:checked").length; i++) {
		if($(".each-checkbox:checked").eq(i).attr("state") == "已响应") {
			isAck = true;
			break;
		}
	}
	if(isAck) {
		windowStart("请选择未响应状态的报警信息", false);
		return false;
	}
	return true;
}

$(document).ready(function() {
	$(".input-style").datepicker("setValue");
	$(".input-style").val("");
	searchSysInfos();
	$("#btnSearchSparPartsAlarm").click(function() {
			if(!funGetDayCheckInfo()) {
				return;
			}
			data_page_index = 0;
		curren_page = 1;
		total_page = 0;
			funSPASearch();
		})
		//响应
	$("#btnSPAalarm").click(function() {

		if($(".each-checkbox:checked").length == 0) {
			windowStart("请选择需要响应的报警信息", false);
			return;
		}
		if(!alarmCheck()) {
			return;
		}
		ackOrDel = "响应";
		//		funGetDayCheckInfo();
		funSPAlarmInfos();
	})
	
	//备品分页操作
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
			funSPASearch();
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
			funSPASearch();
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
			funSPASearch();
		})
		//备品分页操作
})