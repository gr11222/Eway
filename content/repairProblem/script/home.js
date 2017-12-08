var theNum = 0;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var data_page_index2 = 0;
var data_number2 = 17;
var curren_page2 = 1;
var total_page2 = 0;
var is_start_auto = 0;
var isFinish = 0;
var theEditStatus = 0;
var editData = {};
var isShenHe = -1;
var repair_length = 0;
var is_boHui = -1;
var peopleAndDevice = "";

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

// 查询系统信息
function searchSysInfosPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询系统信息传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	$("#beipinType").html("");
	$("#fuwushangType").html("");

	$.ajax({
		type: "post",
		dataType: 'json',
		async: "false",
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("查询系统信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoSelect(msg);
				funGetRepairInfo();
			} else {
				windowStart("查询系统信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询系统信息权限", false);
			} else {
				windowStart("查询系统信息失败", false);
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
	}
	//项目
	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#projectName").html(str);
	}
	//建筑
	if(msg.buildingItems != undefined && msg.buildingItems.length > 0) {
		var theData = msg.buildingItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["nameCn"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#building").html(str);
	}

}

function funGetRepairInfoPara() {
	var startTime = "",
		endTime = "";
	if($("#startTime").val().length > 0) {
		startTime = $("#startTime").val() + " 00:00:00";
	}
	if($("#endTime").val().length > 0) {
		endTime = $("#endTime").val() + " 23:59:59";
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "reportPerson", $("#jiedaiPeople").val());
	jsonData = setJson(jsonData, "startTime", startTime);
	jsonData = setJson(jsonData, "endTime", endTime);
	jsonData = setJson(jsonData, "status", $("#baoxiuStatus").val());
	jsonData = setJson(jsonData, "building", $("#building").val());
	jsonData = setJson(jsonData, "keyword", $("#keyWordInput").val());
	jsonData = setJson(jsonData, "receptionUser", $("#baoxiuPeople").val());
	jsonData = setJson(jsonData, "companyId", parseInt($("#company").val()));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	console.log("查询报修单传值=" + jsonData);
	return jsonData;
}

function funGetRepairInfo() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
	//	{
	//		windowStart("时间范围有误,请填写时间范围",false);
	//	    return;
	//	}
	if($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
		windowStart("请输入结束时间", false);
		return false;
	}
	if($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
		windowStart("请输入开始时间", false);
		return false;
	}
	if($("#startTime").val().length > 0) {
		if(!timeReg.test($("#startTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return;
		}
	}
	if($("#endTime").val().length > 0) {
		if(!timeReg.test($("#endTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return;
		}
	}
	//	if($("#startTime").val().length == 0 )
	//	{
	//		if($("#endTime").val().length> 0 )
	//		{
	//			windowStart("时间范围有误,请重新选取时间范围",false);
	//			 return;
	//		}
	//	}
	//	if($("#endTime").val().length == 0 )
	//	{
	//		if($("#startTime").val().length> 0 )
	//		{
	//			windowStart("时间范围有误,请重新选取时间范围",false);
	//			 return;
	//		}
	//	}
	if($("#startTime").val().length > 0 && $("#endTime").val().length > 0) {
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间", false);
			return;
		}
	}
	$("#ptcontent").html("");
	repair_length = 0;
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsMaintenanceOrderSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetRepairInfoPara(),
		success: function(msg) {
			loadingStop();
			//			windowRemove();
			console.log("查询报修返回值=" + JSON.stringify(msg));
			$("#ptcontent").html("");
			$("#pageNumId").val("");

			createRepairTableInfos(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询点检信息权限", false);
			} else {
				windowStart("查询点检信息失败", false);
			}
			//			windowStart("查询点检信息失败",false);
		}
	})
}

function createRepairTableInfos(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无报修单信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");

	var realData = msg.items;

	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";

	str += "<th class='' ><div class='checkbox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>报修单编号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>报修日期</div></th>";
	str += "<th class='text-center'><div class='checkbox'>报修人</div></th>";
	str += "<th class='text-center'><div class='checkbox'>报修电话</div></th>";
	str += "<th class='text-center'><div class='checkbox'>接待人</div></th>";
	str += "<th class='text-center'><div class='checkbox'>维修人员</div></th>";
	str += "<th class='text-center'><div class='checkbox'>报修设备</div></th>";
	str += "<th class='text-center'><div class='checkbox'>设备所属建筑</div></th>";
	str += "<th class='text-center'><div class='checkbox'>安装位置</div></th>";
	str += "<th class='text-center'><div class='checkbox'>报修单状态</div></th>";
	str += "<th class='text-center'><div class='checkbox'>备注</div></th>";
	str += "<th class='text-center'><div class='checkbox'>信息管理</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var theData = JSON.stringify(realData[i]);
		str += "<tr class='tr-watch-info' theData='" + theData + "' style='cursor:default'>";

		str += "<td class='' style='width:6%'><input type='checkbox'  class='repair-checkbox' theId='" + realData[i]["id"] + "' status='" + realData[i]["status"] + "'></td>";
		str += "<td class='text-center' style='width:4%'>" + (i + 1) + "</td>";
		str += "<td class='text-center'  style='width:8%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["orderCode"] + "</td>";
		str += "<td class='text-center'  style='width:8%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["disposeTime"] + "</td>";
		str += "<td class='text-center'  style='width:8%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["reportPerson"] + "</td>";
		str += "<td class='text-center' style='width:7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["telephone"] + "</td>";
		str += "<td class='text-center' style='width:7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["receptionUser"] + "</td>";
		str += "<td class='text-center' style='width:7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["repairUser"] + "</td>";
		str += "<td class='text-center' style='width:8%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceNameCn"] + "</td>";
		str += "<td class='text-center' style='width:8%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["building"] + "</td>";
		str += "<td class='text-center' style='width:8%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["position"] + "</td>";
		var theStatus = "";
		switch(parseInt(realData[i]["status"])) {
			case 0:
				theStatus = "草稿";
				break;
			case 5:
				theStatus = "待审核";
				break;
			case 6:
				theStatus = "审批已驳回";
				break;
			case 7:
				theStatus = "维修已驳回";
				break;
			case 8:
				theStatus = "报修已审批";
				break;
			case 9:
				theStatus = "设备已维修";
				break;
			case 4:
				theStatus = "已完成";
				break;
		}
		str += "<td class='text-center' style='width:7%;word-wrap: break-word;word-break: break-all;'>" + theStatus + "</td>";
		str += "<td class='text-center' style='width:7%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["note"] + "</td>";

		str += "<td class='text-center' style='width:6%;word-wrap: break-word;word-break: break-all;'>";
		if(parseInt(realData[i]["status"]) == 7 || parseInt(realData[i]["status"]) == 8 || parseInt(realData[i]["status"]) == 9 || parseInt(realData[i]["status"]) == 4 || parseInt(realData[i]["status"]) == 5) {
			str += "<span>";
			str += "<a href='javascript:void(0)' theId='" + realData[i]["id"] + "' class='delete-repairInfos'><img src='../img/dele.png'></a>";
			str += "</span>";
		} else {
			str += "<span>";
			str += "<a href='javascript:void(0)' class='edit-repairInfos' theData='" + theData + "'><img src='../img/edit.png'></a>";
			str += "</span>";
			str += "<span style='padding-left:10px'>";
			str += "<a href='javascript:void(0)' theId='" + realData[i]["id"] + "' class='delete-repairInfos'><img src='../img/dele.png'></a>";
			str += "</span>";
		}

		str += "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	$("#allCheckBox").change(function() {
		if($(this).prop("checked")) {
			repair_length = $(".repair-checkbox").length;
			$(".repair-checkbox").prop("checked", true);
		} else {
			repair_length = 0;
			$(".repair-checkbox").prop("checked", false);
		}
	})
	$(".repair-checkbox").click(function(event) {
		event.stopPropagation();
		if($(this).prop("checked")) {
			repair_length++;
			if(repair_length == $(".repair-checkbox").length) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}

		} else {
			repair_length--;
			if(repair_length == $(".repair-checkbox").length) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		}
	})
	$(".edit-repairInfos").click(function(event) {
		$(".init-value").val("");
		event.stopPropagation();
		var theData = eval("(" + $(this).attr("theData") + ")");
		editData = eval("(" + $(this).attr("theData") + ")");
		$("#editbaoxiuMan").val(theData.reportPerson);
		$("#editbaoxiuPhone").val(theData.telephone);
		$("#editjieDaiRen").val(theData.receptionUser);
		$("#editdeviceName").val(theData.deviceNameCn);
		$("#editdeviceNum").val(theData.deviceId);
		$("#editdeviceBuilding").val(theData.building);
		$("#editguzhangText").val(theData.faultReport);
		$("#editanzhuangPosition").val(theData.position);
		$("#editweixiuRenweixiuRen").val(theData.repairUser);
		$("#editbeizhuInfo").val(theData.note);
		if(parseInt(theData.status) != 0) {
			$("#btneditAddCaoGao").hide();
		} else {
			$("#btneditAddCaoGao").show();
		}
		theEditStatus = parseInt(theData.status);
		$("#editlanelModal").modal("show");
	})
	$(".delete-repairInfos").click(function(event) {
		event.stopPropagation();
		if(!confirm("是否确认删除?")) {
			return;
		}
		funDeleteRepairInfo($(this).attr("theId"));
	})

	$(".tr-watch-info").click(function(event) {
		event.stopPropagation();
		var theData = eval("(" + $(this).attr("theData") + ")");
		$("#infoContent").html("");
		var str = "";
		str += "<table class='table table-bordered'>";
		str += "<tr>";
		str += "<td style='width:13%;'>报修单编号";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.orderCode;
		str += "</td>";
		str += "<td style='width:13%;'>报修时间";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.disposeTime;
		str += "</td>";
		str += "</tr>";
		//2

		str += "<tr>";
		str += "<td style='width:13%;'>报修人";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.reportPerson;
		str += "</td>";
		str += "<td style='width:13%;'>报修电话";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.telephone;
		str += "</td>";
		str += "</tr>";
		//3

		str += "<tr>";
		str += "<td style='width:13%;'>接待人";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.receptionUser;
		str += "</td>";
		str += "<td style='width:13%;'>维修人员";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.repairUser;
		str += "</td>";
		str += "</tr>";
		//4

		str += "<tr>";
		str += "<td style='width:13%;'>报修设备";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.deviceNameCn;
		str += "</td>";
		str += "<td style='width:13%;'>设备所属建筑";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.building;
		str += "</td>";
		str += "</tr>";
		//5
		str += "<tr>";
		str += "<td style='width:13%;'>故障描述";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.faultReport;
		str += "</td>";
		str += "<td style='width:13%;'>报修单状态";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		var theStatus = "";
		switch(parseInt(theData["status"])) {
			case 0:
				theStatus = "草稿";
				break;
			case 5:
				theStatus = "待审核";
				break;
			case 6:
				theStatus = "审批已驳回";
				break;
			case 7:
				theStatus = "维修已驳回";
				break;
			case 8:
				theStatus = "报修已审批";
				break;
			case 9:
				theStatus = "设备已维修";
				break;
			case 4:
				theStatus = "已完成";
				break;
		}
		str += theStatus;
		str += "</td>";
		str += "</tr>";
		//6

		str += "<tr>";
		str += "<td style='width:13%;'>安装位置";
		str += "</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.position;
		str += "</td>";
		str += "<td style='width:13%;'>";
		str += "备注</td>";
		str += "<td style='width:37%;word-wrap: break-word;word-break: break-all;'>";
		str += theData.note;
		str += "</td>";
		str += "</tr>";
		str += "</table>";
		$("#infoContent").html(str);
		$("#lanelModalInfos").modal("show");
	})
}

function funAddRepairInfoCheck() {
	var cnEnReg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
	var textReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5])+$/;
	var firstCnEnReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
	var deviceNumReg = /^[[0-9A-Za-z]+$/;
	var isMob = /^(([0-9]{3,4}-){1}[0-9]{7,8}$)|((13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$)/;
	if(!$("#baoxiuMan").val()) {
		windowStart("请输入报修人", false);
		return false;
	}
	if(!cnEnReg.test($("#baoxiuMan").val())) {
		windowStart("报修人只能输入中英文", false);
		return false;
	}
	if(!$("#baoxiuPhone").val()) {
		windowStart("请输入报修电话", false);
		return false;
	}
	var theValue = $('#baoxiuPhone').val().trim();
	if(!isMob.test(theValue)) {
		windowStart("请输入正确的电话号码,如区号-号码、有效的11位手机号码", false);
		return false;
	}

	//	var phoneReg = /^[0-9]+$/;
	//
	//	if(!phoneReg.test($("#baoxiuPhone").val())) {
	//		windowStart("报修电话只能输入数字", false);
	//		return;
	//	}
	if(!$("#jieDaiRen").val()) {
		windowStart("请输入接待人", false);
		return false;
	}
	if(!textReg.test($("#jieDaiRen").val())) {
		windowStart("接待人只能输入中英文和数字", false);
		return false;
	}
	if(!$("#deviceName").val()) {
		windowStart("请输入报修设备名称", false);
		return false;
	}
	var isHasDevice = false;
	for(var i = 0; i < $("#assetIdContent").find("li").length; i++) {
		if($("#assetIdContent").find("li").eq(i).attr("theName") == $("#deviceName").val()) {
			isHasDevice = true;
			break;
		}
	}
	if(!isHasDevice) {
		windowStart("所输入的设备名称在系统中不存在", false);
		return false;
	}
	if(!$("#deviceNum").val()) {
		windowStart("请输入报修标签编号", false);
		return false;
	}
	var isHasNum = false;
	for(var i = 0; i < $("#deviceNumContent").find("li").length; i++) {
		if($("#deviceNumContent").find("li").eq(i).attr("theId") == $("#deviceNum").val()) {
			isHasNum = true;
			break;
		}
	}
	if(!isHasNum) {
		windowStart("所输入的标签编号在系统中不存在", false);
		return false;
	}
	if(!$("#deviceBuilding").val()) {
		windowStart("请输入设备所属建筑", false);
		return false;
	}
	if(!textReg.test($("#deviceBuilding").val())) {
		windowStart("设备所属建筑只能输入中英文和数字", false);
		return false;
	}
	if(!$("#guzhangText").val()) {
		windowStart("请输入故障描述", false);
		return false;
	}
	if(!$("#anzhuangPosition").val()) {
		windowStart("请输入安装位置", false);
		return false;
	}
	if(!textReg.test($("#anzhuangPosition").val())) {
		windowStart("安装位置只能输入中英文和数字", false);
		return false;
	}
	if($("#guzhangText").val().length > 0) {
		if($("#guzhangText").val().length > 400) {
			windowStart("故障描述的内容长度不允许大于200个汉字", false);
			return false;
		}
		//		if(!textReg.test($("#guzhangText").val())) {
		//			windowStart("故障描述只能输入中英文和数字", false);
		//			return false;
		//		}
		if(!firstCnEnReg.test($("#guzhangText").val())) {
			windowStart("故障描述应以中英文开头", false);
			return false;
		}
	}
	if($("#weixiuRenweixiuRen").val().length > 0) {
		if($("#weixiuRenContent").find("li").length != 0) {
			var isHasPeople = false;
			for(var i = 0; i < $("#weixiuRenContent").find("li").length; i++) {
				if($("#weixiuRenContent").find("li").eq(i).attr("theId") == $("#deviceNum").val()) {
					isHasPeople = true;
					break;
				}
			}
			if(!isHasPeople) {
				windowStart("所输入的维修人员在系统中不存在", false);
				return false;
			}
		} else {
			windowStart("系统中暂无维修人员", false);
			return false;
		}

	}
	return true;
}

function funAddRepairInfoPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", -1);
	jsonData = setJson(jsonData, "orderCode", "");
	jsonData = setJson(jsonData, "reportPerson", $("#baoxiuMan").val());
	jsonData = setJson(jsonData, "telephone", $("#baoxiuPhone").val());
	jsonData = setJson(jsonData, "receptionUser", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "deviceNameCn", $("#deviceName").val());
	jsonData = setJson(jsonData, "deviceId", $("#deviceNum").val());
	jsonData = setJson(jsonData, "building", $("#deviceBuilding").val());
	jsonData = setJson(jsonData, "faultReport", $("#guzhangText").val());
	jsonData = setJson(jsonData, "repairUser", $("#weixiuRenweixiuRen").val());
	jsonData = setJson(jsonData, "disposeTime", "");
	jsonData = setJson(jsonData, "note", $("#beizhuInfo").val());
	jsonData = setJson(jsonData, "position", $("#anzhuangPosition").val());
	jsonData = setJson(jsonData, "status", isFinish);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加报修单传值=" + jsonData);
	return jsonData;
}

function funAddRepairInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsMaintenanceOrderAddDraftCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddRepairInfoPara(),
		success: function(msg) {
			console.log("录入报修单返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#lanelModal").modal("hide");
				windowStart("报修单已录入", true);
				funGetRepairInfo();
			} else {
				windowStart("报修单录入失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无录入报修单权限", false);
			} else {
				windowStart("报修单录入失败", false);
			}
		}
	})
}

//修改
function funEditRepairInfoCheck() {
	var textReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5])+$/;
	var deviceNumReg = /^[[0-9A-Za-z]+$/;
	var isMob = /^(([0-9]{3,4}-){1}[0-9]{7,8}$)|((13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$)/;
	if(!$("#editbaoxiuMan").val()) {
		windowStart("请输入报修人", false);
		return false;
	}
	if(!textReg.test($("#editbaoxiuMan").val())) {
		windowStart("报修人只能输入中英文和数字", false);
		return false;
	}
	if(!$("#editbaoxiuPhone").val()) {
		windowStart("请输入报修电话", false);
		return false;
	}
	var theValue = $('#editbaoxiuPhone').val().trim();
	if(!isMob.test(theValue)) {
		windowStart("请输入正确的电话号码,如区号-号码、有效的11位手机号码", false);
		return false;
	}
	var phoneReg = /^[0-9]+$/;

	if(!phoneReg.test($("#editbaoxiuPhone").val())) {
		windowStart("报修电话只能输入数字", false);
		return;
	}
	if(!$("#editjieDaiRen").val()) {
		windowStart("请输入接待人", false);
		return false;
	}
	if(!textReg.test($("#editjieDaiRen").val())) {
		windowStart("接待人只能输入中英文和数字", false);
		return false;
	}
	if(!$("#editdeviceName").val()) {
		windowStart("请输入报修设备名称", false);
		return false;
	}
	if(!textReg.test($("#editdeviceName").val())) {
		windowStart("设备名称只能输入中英文和数字", false);
		return false;
	}
	if(!$("#editdeviceNum").val()) {
		windowStart("请输入报修标签编号", false);
		return false;
	}
	if(!deviceNumReg.test($("#editdeviceNum").val())) {
		windowStart("标签编号只能输入英文和数字", false);
		return false;
	}
	if(!$("#editdeviceBuilding").val()) {
		windowStart("请输入设备所属建筑", false);
		return false;
	}
	if(!textReg.test($("#editdeviceBuilding").val())) {
		windowStart("设备所属建筑只能输入中英文和数字", false);
		return false;
	}
	if(!$("#editanzhuangPosition").val()) {
		windowStart("请输入安装位置", false);
		return false;
	}
	if(!textReg.test($("#editanzhuangPosition").val())) {
		windowStart("安装位置只能输入中英文和数字", false);
		return false;
	}
	if($("#editguzhangText").val().length > 0) {
		if($("#editguzhangText").val().length > 400) {
			windowStart("故障描述的内容长度不允许大于200个汉字", false);
			return false;
		}
		if(!textReg.test($("#editguzhangText").val())) {
			windowStart("故障描述只能输入中英文和数字", false);
			return false;
		}
	}
	return true;
}

function funEditRepairInfoPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", editData.id);
	jsonData = setJson(jsonData, "orderCode", editData.orderCode);
	jsonData = setJson(jsonData, "reportPerson", $("#editbaoxiuMan").val());
	jsonData = setJson(jsonData, "telephone", $("#editbaoxiuPhone").val());
	jsonData = setJson(jsonData, "receptionUser", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "deviceNameCn", $("#editdeviceName").val());
	jsonData = setJson(jsonData, "deviceId", $("#editdeviceNum").val());
	jsonData = setJson(jsonData, "building", $("#editdeviceBuilding").val());
	jsonData = setJson(jsonData, "faultReport", $("#editguzhangText").val());
	jsonData = setJson(jsonData, "repairUser", $("#editweixiuRenweixiuRen").val());
	jsonData = setJson(jsonData, "disposeTime", editData.disposeTime);
	jsonData = setJson(jsonData, "note", $("#editbeizhuInfo").val());
	jsonData = setJson(jsonData, "position", $("#editanzhuangPosition").val());
	jsonData = setJson(jsonData, "status", theEditStatus);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("修改报修单传值=" + jsonData);
	return jsonData;
}

function funEditRepairInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsMaintenanceOrderUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funEditRepairInfoPara(),
		success: function(msg) {
			console.log("修改报修单返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editlanelModal").modal("hide");
				windowStart("报修单已修改", true);
				funGetRepairInfo();
			} else {
				if(msg.responseCommand.toUpperCase().indexOf("FINISH") != -1) {
					windowStart("报修单状态为已完成状态时不可以修改", false);
				} else {
					windowStart("报修单修改失败", false);
				}

			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改报修单权限", false);
			} else {
				windowStart("报修单修改失败", false);
			}
		}
	})
}

//修改

//修改
//删除
function funDeleteRepairInfoPara(theId) {
	var theArr = [];
	var obj = {};
	obj.id = parseInt(theId);
	obj.status = -1;
	theArr.push(obj);
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "commitProperty", theArr);
	console.log("删除报修单传值=" + jsonData);
	return jsonData;
}

function funDeleteRepairInfo(theId) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsMaintenanceOrderDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteRepairInfoPara(theId),
		success: function(msg) {
			console.log("删除报修单返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editlanelModal").modal("hide");
				windowStart("报修单已删除", true);
				funGetRepairInfo();
			} else {
				windowStart("报修单删除失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除报修单权限", false);
			} else {
				windowStart("报修单删除失败", false);
			}
		}
	})
}

//删除

//审核和驳回

function funShenHeRepairInfoPara() {
	var theArr = [];
	for(var i = 0; i < $(".repair-checkbox:checked").length; i++) {
		var obj = {};
		obj.id = parseInt($(".repair-checkbox:checked").eq(i).attr("theId"));
		obj.status = isShenHe;
		theArr.push(obj);

	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "commitProperty", theArr);
	console.log("审核或驳回报修单传值=" + jsonData);
	return jsonData;
}

function funShenHeRepairInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsMaintenanceOrderCommitCmd",
		contentType: "application/text,charset=utf-8",
		data: funShenHeRepairInfoPara(),
		success: function(msg) {
			console.log("审核或驳回报修单返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("NEVER") != -1) {
				windowStart("当前用户无驳回权限", true);
			} else if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editlanelModal").modal("hide");
				if(isShenHe == 8) {
					windowStart("报修单已审核", true);
				} else {
					windowStart("报修单已驳回", true);
				}
				funGetRepairInfo();
			} else {

				if(isShenHe == 8) {
					if(msg.responseCommand.toUpperCase().indexOf("NO") != -1) {
						windowStart("所选报修单状态不一致", true);
					} else if(msg.responseCommand.toUpperCase().indexOf("FINISH") != -1) {
						windowStart("所选报修单状态已完成,不可以进行审核操作", true);
					} else if(msg.responseCommand.toUpperCase().indexOf("DRAFT") != -1) {
						windowStart("草稿状态的报修单不可以进行审核操作", true);
					} else {
						windowStart("报修单审核失败", true);
					}
				} else {
					if(msg.responseCommand.toUpperCase().indexOf("NO") != -1) {
						windowStart("所选报修单状态不一致", true);
					} else if(msg.responseCommand.toUpperCase().indexOf("FINISH") != -1) {
						windowStart("所选报修单状态已完成,不可以进行驳回操作", true);
					} else if(msg.responseCommand.toUpperCase().indexOf("DRAFT") != -1) {
						windowStart("草稿状态的报修单不可以进行驳回操作", true);
					} else {
						windowStart("报修单驳回失败", true);
					}

				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				if(isShenHe == 8) {
					windowStart("当前用户无审核报修单权限", true);
				} else {
					windowStart("当前用户无驳回报修单权限", true);
				}

			} else {
				if(isShenHe == 8) {
					windowStart("报修单审核失败", true);
				} else {
					windowStart("报修单驳回失败", true);
				}
			}
		}
	})
}

//审核和驳回
//获取指派维修人员和设备
function funGetRepairPeoplePara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "nameItems", "", true);
	jsonData = setJson(jsonData, "deviceItems", "", true);
	console.log("获取指派维修人员和设备传值=" + jsonData);
	return jsonData;
}

function funGetRepairPeople() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairUserAndDeviceSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetRepairPeoplePara(),
		success: function(msg) {
			console.log("获取人员和设备返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				peopleAndDevice = msg;
				createPeopleAndDevice(msg);

			} else {
				windowStart("获取人员和设备失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无获取人员和设备权限", false);
			} else {
				windowStart("获取人员和设备失败", false);
			}
		}
	})
}

function createPeopleAndDevice(msg) {
	if(msg.deviceItems != undefined && msg.deviceItems.length > 0) {
		var theData = msg.deviceItems;
		var str = "";
		var deviceNumStr = "";
		var editStr = "";
		var editDeviceNumStr = "";
		str += "<ul style='margin:0px;padding:0px'>";
		deviceNumStr += "<ul style='margin:0px;padding:0px'>";
		editStr += "<ul style='margin:0px;padding:0px'>";
		editDeviceNumStr += "<ul style='margin:0px;padding:0px'>";
		for(var i = 0; i < theData.length; i++) {
			str += "<li class='li-id-class hide'  theId='" + theData[i]["deviceId"] + "' theName='" + theData[i]["deviceNameCn"] + "'  theBuilding='" + theData[i]["deviceBuildingNameCn"] + "'>" + theData[i]["deviceNameCn"] + "</li>";
			deviceNumStr += "<li class='li-id-class-3 hide'  theId='" + theData[i]["deviceId"] + "' theName='" + theData[i]["deviceNameCn"] + "' theBuilding='" + theData[i]["deviceBuildingNameCn"] + "'>" + theData[i]["deviceId"] + "</li>";
			editStr += "<li class='li-id-class-4 hide'  theId='" + theData[i]["deviceId"] + "' theName='" + theData[i]["deviceNameCn"] + "' theBuilding='" + theData[i]["deviceBuildingNameCn"] + "'>" + theData[i]["deviceNameCn"] + "</li>";
			editDeviceNumStr += "<li class='li-id-class-5 hide'  theId='" + theData[i]["deviceId"] + "' theName='" + theData[i]["deviceNameCn"] + "' theBuilding='" + theData[i]["deviceBuildingNameCn"] + "'>" + theData[i]["deviceId"] + "</li>";
		}
		str += "</ul>";
		deviceNumStr += "</ul>";
		$("#assetIdContent").html(str);
		$("#deviceNumContent").html(deviceNumStr);
		$("#editassetIdContent").html(editStr);
		$("#editdeviceNumContent").html(editDeviceNumStr);
	}
	if(msg.nameItems != undefined && msg.nameItems.length > 0) {
		var theData = msg.nameItems;
		var str = "";
		var editStr = "";
		str += "<ul style='margin:0px;padding:0px'>";
		editStr += "<ul style='margin:0px;padding:0px'>";
		for(var i = 0; i < theData.length; i++) {
			str += "<li class='li-id-class-2 hide'  theId='" + theData[i]["repairUser"] + "' theBuilding='" + theData[i]["deviceBuildingNameCn"] + "'>" + theData[i]["repairUser"] + "</li>";
			editStr += "<li class='li-id-class-6 hide'  theId='" + theData[i]["repairUser"] + "' theBuilding='" + theData[i]["deviceBuildingNameCn"] + "'>" + theData[i]["repairUser"] + "</li>";
		}
		str += "</ul>";
		editStr += "</ul>";
		$("#weixiuRenContent").html(str);
		$("#editweixiuRenContent").html(editStr);
	}
}

function returnCheck() {
	for(var i = 0; i < $(".repair-checkbox:checked").length; i++) {
		if(parseInt($(".repair-checkbox:checked").eq(i).attr("status")) == 7) {
			windowStart("维修已驳回不能再次驳回", false);
			return false;
		}
	}
	return true;
}

//function shenheCheck() {
//	for(var i = 0; i < $(".repair-checkbox:checked").length; i++) {
//		if(parseInt($(".repair-checkbox:checked").eq(i).attr("status")) == 7) {
//			windowStart("维修已驳回不能再次驳回", false);
//			return false;
//		}
//	}
//	return true;
//}

$(document).ready(function() {
	$("#jieDaiRen").val(localStorage.getItem("userAccountName"));
	$(".input-style").datepicker("setValue");
	$(".input-style").val("");
	searchSysInfos();

	//获取指派维修人员

	//点检
	$("#btnSearchRepair").click(function() {
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		$("#pageTotalInfo").val("");
		funGetRepairInfo();
	})

	//点检分页操作
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
			funGetRepairInfo();
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
			funGetRepairInfo();
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
			funGetRepairInfo();
		})
		//点检分页操作

	$("#btnAddRepair").click(function() {
			$("#baoxiuMan").val("");
			$("#baoxiuPhone").val("");
			$("#deviceName").val("");
			$("#deviceNum").val("");
			$("#deviceBuilding").val("");
			$("#guzhangText").val("");
			$("#anzhuangPosition").val("");
			$("#beizhuInfo").val("");
			$("#weixiuRenweixiuRen").val("");
			funGetRepairPeople();
			$("#lanelModal").modal("show");
		})
		//保存草稿
	$("#btnAddCaoGao").click(function() {
			if(!funAddRepairInfoCheck()) {
				return;
			}
			isFinish = 0;
			funAddRepairInfo();
		})
		//提交
	$("#btnAddSubmit").click(function() {
			if(!funAddRepairInfoCheck()) {
				return;
			}
			isFinish = 5;
			funAddRepairInfo();
		})
		//模糊过滤设备
	$("#deviceName").keyup(function() {
			var theValue = $(this).val();
			var realValue = -1;
			$(".li-id-class").unbind("click");
			if($(this).val().length > 0) {
				for(var i = 0; i < $(".li-id-class").length; i++) {
					if($(".li-id-class").eq(i).attr("theName").indexOf(theValue) != -1) {

						$(".li-id-class").eq(i).removeClass("hide");
					} else {
						$(".li-id-class").eq(i).addClass("hide");
					}
				}
			}
			$(".li-id-class").bind("click", function() {
				realValue = $(this).attr("theName");
				$("#deviceName").val(realValue);
				$("#deviceNum").val($(this).attr("theId"));
				$("#deviceBuilding").val($(this).attr("theBuilding"));
				$(".li-id-class").addClass("hide");
			});
		})
		//修改设备名
	$("#editdeviceName").keyup(function() {
			var theValue = $(this).val();
			var realValue = -1;
			$(".li-id-class-4").unbind("click");
			if($(this).val().length > 0) {
				for(var i = 0; i < $(".li-id-class-4").length; i++) {
					if($(".li-id-class-4").eq(i).attr("theName").indexOf(theValue) != -1) {

						$(".li-id-class-4").eq(i).removeClass("hide");
					} else {
						$(".li-id-class-4").eq(i).addClass("hide");
					}
				}
			}
			$(".li-id-class-4").bind("click", function() {
				realValue = $(this).attr("theName");
				$("#editdeviceName").val(realValue);
				$("#editdeviceNum").val($(this).attr("theId"));
				$("#editdeviceBuilding").val($(this).attr("theBuilding"));
				$(".li-id-class-4").addClass("hide");
			});
		})
		//设备编号过滤查询
	$("#deviceNum").keyup(function() {
			var theValue = $(this).val();
			var realValue = -1;
			$(".li-id-class-3").unbind("click");
			if($(this).val().length > 0) {
				for(var i = 0; i < $(".li-id-class-3").length; i++) {
					if($(".li-id-class-3").eq(i).attr("theId").indexOf(theValue) != -1) {
						$(".li-id-class-3").eq(i).removeClass("hide");
					} else {
						$(".li-id-class-3").eq(i).addClass("hide");
					}
				}
			}
			$(".li-id-class-3").bind("click", function() {
				realValue = $(this).attr("theId");
				$("#deviceName").val($(this).attr("theName"));
				$("#deviceNum").val(realValue);
				$("#deviceBuilding").val($(this).attr("theBuilding"));
				$(".li-id-class-3").addClass("hide");
			});
		})
		//修改设备号
	$("#editdeviceNum").keyup(function() {
			var theValue = $(this).val();
			var realValue = -1;
			$(".li-id-class-5").unbind("click");
			if($(this).val().length > 0) {
				for(var i = 0; i < $(".li-id-class-5").length; i++) {
					if($(".li-id-class-5").eq(i).attr("theId").indexOf(theValue) != -1) {

						$(".li-id-class-5").eq(i).removeClass("hide");
					} else {
						$(".li-id-class-5").eq(i).addClass("hide");
					}
				}
			}
			$(".li-id-class-5").bind("click", function() {
				realValue = $(this).attr("theId");
				$("#editdeviceName").val($(this).attr("theName"));
				$("#editdeviceNum").val(realValue);
				$("#editdeviceBuilding").val($(this).attr("theBuilding"));
				$(".li-id-class-5").addClass("hide");
			});

		})
		//维保人模糊查询
	$("#weixiuRenweixiuRen").keyup(function() {
			var theValue = $(this).val();
			var realValue = -1;
			$(".li-id-class-2").unbind("click");
			if($(this).val().length > 0) {

				for(var i = 0; i < $(".li-id-class-2").length; i++) {
					if($(".li-id-class-2").eq(i).attr("theId").indexOf(theValue) != -1) {

						$(".li-id-class-2").eq(i).removeClass("hide");
					} else {
						$(".li-id-class-2").eq(i).addClass("hide");
					}
				}
			}
			$(".li-id-class-2").bind("click", function() {
				realValue = $(this).attr("theId");
				$("#weixiuRenweixiuRen").val(realValue);
				$(".li-id-class-2").addClass("hide");
			});

		})
		//修改维保人
	$("#editweixiuRenweixiuRen").keyup(function() {
		var theValue = $(this).val();
		var realValue = -1;
		$(".li-id-class-6").unbind("click");
		if($(this).val().length > 0) {

			for(var i = 0; i < $(".li-id-class-6").length; i++) {
				if($(".li-id-class-6").eq(i).attr("theId").indexOf(theValue) != -1) {

					$(".li-id-class-6").eq(i).removeClass("hide");
				} else {
					$(".li-id-class-6").eq(i).addClass("hide");
				}
			}
		}
		$(".li-id-class-6").bind("click", function() {
			realValue = $(this).attr("theId");
			$("#editweixiuRenweixiuRen").val(realValue);
			$(".li-id-class-6").addClass("hide");
		});
	})
	$("#guzhangText").blur(function() {
		//		var textReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5])+$/;
		var firstCnEnReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
		if($("#guzhangText").val().length > 400) {
			windowStart("故障描述的内容长度不允许大于200个汉字", false);
			return false;
		}
		//		if(!textReg.test($("#guzhangText").val())) {
		//			windowStart("故障描述只能输入中英文和数字", false);
		//			return false;
		//		}
		if(!firstCnEnReg.test($("#guzhangText").val())) {
			windowStart("故障描述应以中英文开头", false);
			return false;
		}
	})
	$("#baoxiuMan").blur(function() {
		var cnEnReg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
		if(!$("#baoxiuMan").val()) {
			windowStart("请输入报修人", false);
			return false;
		}
		if(!cnEnReg.test($("#baoxiuMan").val())) {
			windowStart("报修人只能输入中英文", false);
			return false;
		}
	})
	$("#btneditCaoGao").click(function() {
		if(!funEditRepairInfoCheck()) {
			return;
		}
		theEditStatus = 0;
		funEditRepairInfo();
	})

	$("#btneditSubmit").click(function() {
		if(!funEditRepairInfoCheck()) {
			return;
		}
		if(theEditStatus == 0) {
			theEditStatus = 5;
		}
		funEditRepairInfo();
	})

	$("#btnShenHeRepair").click(function() {
		if($(".repair-checkbox:checked").length == 0) {
			windowStart("请选择报修单", false);
			return;
		}
//		if(!shenheCheck()) {
//			return;
//		}
		isShenHe = 8;
		funShenHeRepairInfo();
	})
	$("#btnReturnRepair").click(function() {
		if($(".repair-checkbox:checked").length == 0) {
			windowStart("请选择报修单", false);
			return;
		}
		if(!returnCheck()) {
			return;
		}
		isShenHe = 6;
		funShenHeRepairInfo();
	})

})