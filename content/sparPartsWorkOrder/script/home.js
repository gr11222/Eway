var theNum = 0;
var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var total1 = -1;
var data_page_index1 = 0;
var data_number1 = 17;
var curren_page1 = 1;
var total_page1 = 0;
var labelType = 0;
var asset_editInf = {};
var allAssetStatus = 0,
	hasLabelAssetStatus = 0;
var editAllData = {};
var editLabelData = {};
var sunMitNumForOut = 1;
var submitForIn = 1;
var data_length = 0;
var label_length = 0;
var printData = '';
var allSelect;

function EscapeString(str) {
	return escape(str).replace(/\%/g, "\$");
}
//排序

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
	$("#beipinType").html("");
	$("#fuwushangType").html("");

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsStockOrderQuerySearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("查询资产类型  所属工厂  服务商返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoSelect(msg);
				allSelect = msg;
				SearchBeiPinInfos();
			} else {
				windowStart("查询系统信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();

			//			windowStart("查询资产类型 、所属工厂 、服务商失败",false);
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
	if(msg.items != undefined && msg.items.length > 0) {
		var theData = msg.items;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#companyName").html(str);
		$("#companyName2").html(str);

	}
	//项目
	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#projectName").html(str);
		$("#projectName2").html(str);
	}
	//服务商
	if(msg.CompanyItems != undefined && msg.CompanyItems.length > 0) {
		var currenData = msg.CompanyItems;
		var dataArr = [];
		for(var i = 0; i < currenData.length; i++) {
			dataArr.push(currenData[i]["nameCn"]);
		}

		var sortData = cusSort(dataArr);

		var theData = createobjData(sortData, currenData);

		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		//		$("#fuwushang").html(str);
		//		$("#fuwushang2").html(str);
		//		$("#spMadeByModal").html(str);
		//		$("#spMadeByModal2").html(str);
		$("#editspMadeByModal").html(str);
		$("#editspMadeByModal2").html(str);
	}
	//备品类型
	if(msg.DeviceItems != undefined && msg.DeviceItems.length > 0) {
		var currenData = msg.DeviceItems;
		var dataArr = [];
		for(var i = 0; i < currenData.length; i++) {
			dataArr.push(currenData[i]["nameCn"]);
		}
		var sortData = cusSort(dataArr);
		var theData = createobjData(sortData, currenData);

		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		//		$("#deviceTypeName").html(str);
		//		$("#deviceTypeName2").html(str);
		//		$("#beipinTypeModal").html(str);
		//		$("#beipinTypeModal2").html(str);		
		$("#editbeipinTypeModal").html(str);
		$("#editbeipinTypeModal2").html(str);
	}
	//备品备品型号
	if(msg.deviceModelItems != undefined && msg.deviceModelItems.length > 0) {
		var currenData = msg.deviceModelItems;
		var dataArr = [];
		for(var i = 0; i < currenData.length; i++) {
			dataArr.push(currenData[i]["nameCn"]);
		}

		var sortData = cusSort(dataArr);

		var theData = createobjData(sortData, currenData);

		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		//		$("#beipinModel").html(str);
		//		$("#beipinModel2").html(str);
		//		$("#spTypeNumModel").html(str);
		//		$("#spTypeNumModel2").html(str);
		$("#editspTypeNumModel").html(str);
		$("#editspTypeNumModel2").html(str);
	}

	//备品类型  型号  服务商 级联

	if(msg.queryItems.item != undefined && msg.queryItems.item.length > 0) {
		var theData = msg.queryItems.item;
		var str = "";
		var str = "<option value=''>请选择</option>";

		for(var i = 0; i < theData.length; i++) {
			str += "<option  theChildren='" + JSON.stringify(theData[i]) + "'  value='" + theData[i]["id"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
	}
	//类型
	$("#deviceTypeName").html(str);
	$("#deviceTypeName2").html(str);
	$("#beipinTypeModal").html(str);
	$("#beipinTypeModal2").html(str);
	$("#beipinModel").html("<option value=''>请选择</option>");
	$("#beipinModel2").html("<option value=''>请选择</option>");
	$("#fuwushang").html("<option value=''>请选择</option>");
	$("#fuwushang2").html("<option value=''>请选择</option>");
	$("#spTypeNumModel").html("<option value=''>请选择</option>");
	$("#spTypeNumModel2").html("<option value=''>请选择</option>");
	$("#spMadeByModal").html("<option value=''>请选择</option>");
	$("#spMadeByModal2").html("<option value=''>请选择</option>");
	//出库工单 查询处级联
	$("#deviceTypeName").change(function() {
		if($(this).val().length == 0) {
			$("#" + $(this).attr("theSecId")).html("<option value=''>请选择</option>");
			$("#" + $(this).attr("thrId")).html("<option value=''>请选择</option>");

			return;
		}
		createSecInfo(eval("(" + $("#deviceTypeName option:selected").attr("theChildren") + ")"), $(this).attr("theSecId"));
	})

	//采购工单查询处级联

	$("#deviceTypeName2").change(function() {
		if($(this).val().length == 0) {
			$("#" + $(this).attr("theSecId")).html("<option value=''>请选择</option>");
			$("#" + $(this).attr("thrId")).html("<option value=''>请选择</option>");

			return;
		}

		createSecInfo(eval("(" + $("#deviceTypeName2 option:selected").attr("theChildren") + ")"), $(this).attr("theSecId"));
	})

	// 出库工单添加级联

	$("#beipinTypeModal").change(function() {
			if($(this).val().length == 0) {
				$("#" + $(this).attr("theSecId")).html("<option value=''>请选择</option>");
				$("#" + $(this).attr("thrId")).html("<option value=''>请选择</option>");

				return;
			}

			createSecInfo(eval("(" + $("#beipinTypeModal option:selected").attr("theChildren") + ")"), $(this).attr("theSecId"));
		})
		// 出库工单添加级联

	$("#beipinTypeModal2").change(function() {
			if($(this).val().length == 0) {
				$("#" + $(this).attr("theSecId")).html("<option value=''>请选择</option>");
				$("#" + $(this).attr("thrId")).html("<option value=''>请选择</option>");

				return;
			}

			createSecInfo(eval("(" + $("#beipinTypeModal2 option:selected").attr("theChildren") + ")"), $(this).attr("theSecId"));
		})
		//型号
		//	$("#beipinModel").html(str);
		//	$("#beipinModel2").html(str);
		//	$("#spTypeNumModel").html(str);
		//	$("#spTypeNumModel2").html(str);
		//	$("#editspTypeNumModel").html(str);
		//	$("#editspTypeNumModel2").html(str);
		//服务商
		//	$("#fuwushang").html(str);
		//	$("#fuwushang2").html(str);
		//	$("#spMadeByModal").html(str);
		//	$("#spMadeByModal2").html(str);
		//	$("#editspMadeByModal").html(str);
		//	$("#editspMadeByModal2").html(str);

	//备品型号加级联事件
	//1   查询处

	//2 新增出
	//3 修改处
	//4 采购工单 查询处
	//5 采购工单 新增出
	//6 采购工单 修改处
}

function createSecInfo(theData, selectId) {

	$("#" + selectId).html("");
	$("#" + selectId).unbind("change");
	var str = "<option value=''>请选择</option>";
	var secData = theData.item;
	for(var i = 0; i < secData.length; i++) {
		str += "<option theChildren='" + JSON.stringify(secData[i]) + "'  value='" + secData[i]["id"] + "'>" + secData[i]["nameCn"] + "</option>";

	}
	$("#" + selectId).html(str);

	$("#" + selectId).bind("change", function() {
		if($(this).val().length == 0) {
			$("#" + $(this).attr("thrId")).html("<option value=''>请选择</option>");

			return;
		}
		createThrInfo(eval("(" + $("#" + selectId + " option:selected").attr("theChildren") + ")"), $(this).attr("thrId"));

	})
}

function createThrInfo(theData, selectId) {
	$("#" + selectId).html("");
	$("#" + selectId).unbind("change");
	var str = "<option value=''>请选择</option>";

	var secData = theData.item;
	for(var i = 0; i < secData.length; i++) {
		str += "<option  value='" + secData[i]["id"] + "'>" + secData[i]["nameCn"] + "</option>";

	}
	$("#" + selectId).html(str);

}
// 查询全部资产备品备件信息
function SearchBeiPinInfosPara() {

	var start_time = "";
	var end_time = "";
	if($("#startTime").val().length > 0) {
		start_time = $("#startTime").val() + " 00:00:00";
	}
	if($("#endTime").val().length > 0) {
		end_time = $("#endTime").val() + " 23:59:59";
	}
	var theType = -1;

	if($("#deviceTypeName").val().length > 0) {
		theType = parseInt($("#deviceTypeName").val());
	}
	var fuWu = -1;
	if($("#fuwushang").val().length > 0) {
		fuWu = parseInt($("#fuwushang").val());
	}
	var deviceModelId = -1;
	if($("#beipinModel").val().length > 0) {
		deviceModelId = parseInt($("#beipinModel").val());
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "enterprise", $("#companyName").val());
	jsonData = setJson(jsonData, "project", $("#projectName").val());
	jsonData = setJson(jsonData, "deviceClassifyId", theType);
	jsonData = setJson(jsonData, "companyId", fuWu);
	jsonData = setJson(jsonData, "deviceModelId", deviceModelId);
	jsonData = setJson(jsonData, "orderCode", $("#workNum").val());
	jsonData = setJson(jsonData, "startTime", start_time);
	jsonData = setJson(jsonData, "endTime", end_time);
	jsonData = setJson(jsonData, "status", parseInt(allAssetStatus));
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询出库工单传值=" + jsonData);
	return jsonData;
}

function SearchBeiPinInfos() {
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
	if($("#startTime").val().length == 0) {
		if($("#endTime").val().length > 0) {
			windowStart("时间范围有误,请重新选取时间范围", false);
			return;
		}
	}
	if($("#endTime").val().length == 0) {
		if($("#startTime").val().length > 0) {
			windowStart("时间范围有误,请重新选取时间范围", false);
			return;
		}
	}
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
	data_length = 0;
	$("#dataContent1").html("");
	loadingStart("dataContent1");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsStockOrderSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: SearchBeiPinInfosPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询全部资产备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createAllAssetTable(msg);
			} else {
				windowStart("查询全部资产备品备件信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();

			//			windowStart("查询资产类型 、所属工厂 、服务商失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询全部资产备品备件信息权限", false);
			} else {
				windowStart("查询全部资产备品备件信息失败", false);
			}
		}
	})
}

function createAllAssetTable(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#dataContent1").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无备品备件工单信息";
		str += "</div>";
		$("#dataContent1").html(str);
		return;
	}

	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");
	var theData = msg.items;

	var str = "";
	printData = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	printData += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";

	str += "<th class=''><input type='checkbox' id='checkboxForAll'>  全选</th>";
	str += "<th class='text-center'>序号</th>";
	printData += "<th class='text-center'>序号</th>";

	str += "<th class='text-center'>工单编号</th>";
	printData += "<th class='text-center'>工单编号</th>";

	str += "<th class='text-center'>备品类型</th>";
	printData += "<th class='text-center'>备品类型</th>";

	str += "<th class='text-center'>备品型号</th>";
	printData += "<th class='text-center'>备品型号</th>";

	str += "<th class='text-center '>服务商</th>";
	printData += "<th class='text-center '>服务商</th>";

	//	str += "<th class='text-center td-width'>提供商</th>";
	//	str += "<th class='text-center td-width'>目标资产</th>";
	str += "<th class='text-center'>申请件数</th>";
	printData += "<th class='text-center'>申请件数</th>";

	str += "<th class='text-center '>申请人</th>";
	printData += "<th class='text-center '>申请人</th>";

	str += "<th class='text-center'>申请时间</th>";
	printData += "<th class='text-center'>申请时间</th>";

	str += "<th class='text-center '>状态</th>";
	printData += "<th class='text-center '>状态</th>";

	str += "<th class='text-center' >操作</th>";
	str += "</thead><tbody>";
	printData += "</thead><tbody>";
	for(var i = 0; i < theData.length; i++) {
		str += "<tr  >";
		str += "<td class=' td-width' style='width:6%'><input theData='" + JSON.stringify(theData[i]) + "' type='checkbox' class='checkbox-for-all'/></td>";
		str += "<td class='text-center td-width' style='width:9.4%'>" + (i + 1) + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + (i + 1) + "</td>";

		str += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["orderCode"] + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["orderCode"] + "</td>";

		str += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["deviceClassifyNameCn"] + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["deviceClassifyNameCn"] + "</td>";

		str += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["deviceModel"] + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["deviceModel"] + "</td>";

		str += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["company"] + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["company"] + "</td>";

		//		str += "<td class='text-center td-width'>"+theData[i]["providerNameCn"]+"</td>";
		//		str += "<td class='text-center td-width'>"+theData[i]["targetDeviceNameCn"]+"</td>";
		str += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["applyNum"] + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["applyNum"] + "</td>";

		str += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["applicanter"] + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["applicanter"] + "</td>";

		str += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["applyTime"] + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + theData[i]["applyTime"] + "</td>";

		var status = "";
		var theEditClass = "";
		switch(parseInt(theData[i]["status"])) {
			case 0:
				status = "草稿";
				break;
			case 1:
				status = "待审核";
				theEditClass = "hide";
				break;
			case 2:
				status = "已驳回";
				break;
			case 3:
				status = "已审核";
				theEditClass = "hide";
				break;
			case 4:
				status = "已完成";
				theEditClass = "hide";
				break;
		}
		str += "<td class='text-center td-width' style='width:9.4%'>" + status + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + status + "</td>";

		str += "<td class='text-center td-width' style='width:9.4%'>";
		str += "<span  style='padding-left:6px' class='" + theEditClass + "'><a href='javascript:void(0)' theData='" + JSON.stringify(theData[i]) + "'  class='edit-all-class'><img src='../img/edit.png' width='18' height='18'></a></span>";
		str += "<span style='padding-left:6px'><a href='javascript:void(0)'  theId='" + theData[i]["id"] + "' class='delete-all-class'><img src='../img/dele.png' width='18' height='18'></a></span>";
		str += "</td>";

		str += "</tr>";
		printData += "</tr>";
	}
	str += "</tbody><table>";
	printData += "</tbody><table>";
	$("#dataContent1").html(str);
	$(".delete-all-class").click(function() {
		if(!confirm("是否确认删除?")) {
			return;
		}
		delAllAssetinfo(parseInt($(this).attr("theId")));
	})
	$(".edit-all-class").click(function() {
		editAllData = eval("(" + $(this).attr("theData") + ")");
		$("#editbeipinTypeModal").val(editAllData.deviceClassifyId);
		$("#editspNums").val(editAllData.applyNum);
		$("#editspTypeNumModel").val(editAllData.deviceModelId);
		$("#editspMadeByModal").val(editAllData.companyId);
		$("#editDataModal").modal("show");
	})

	$("#checkboxForAll").change(function() {
		if($(this).prop("checked")) {
			data_length = $(".checkbox-for-all").length;
			$(".checkbox-for-all").prop("checked", true);
		} else {
			data_length = 0;
			$(".checkbox-for-all").prop("checked", false);
		}
	})
	$(".checkbox-for-all").change(function() {
		if($(this).prop("checked")) {
			data_length++;
			if(data_length == $(".checkbox-for-all").length) {
				$("#checkboxForAll").prop("checked", true);
			} else {
				$("#checkboxForAll").prop("checked", false);
			}

		} else {
			data_length--;
			if(data_length == $(".checkbox-for-all").length) {
				$("#checkboxForAll").prop("checked", true);
			} else {
				$("#checkboxForAll").prop("checked", false);
			}
		}
	})
}

//添加全部资产
function addAllAssetinfoPara() {
	var theNum = 0;

	if($("#spNums").val().length > 0) {
		theNum = parseInt($("#spNums").val());
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", -1);
	jsonData = setJson(jsonData, "orderCode", "");
	jsonData = setJson(jsonData, "deviceModelId", parseInt($("#spTypeNumModel").val()));
	jsonData = setJson(jsonData, "deviceClassifyId", parseInt($("#beipinTypeModal").val()));
	jsonData = setJson(jsonData, "companyId", parseInt($("#spMadeByModal").val()));
	jsonData = setJson(jsonData, "applyNum", theNum);
	jsonData = setJson(jsonData, "applicanter", "");
	jsonData = setJson(jsonData, "applyTime", "");
	jsonData = setJson(jsonData, "status", 0);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加备品备件信息传值=" + jsonData);
	return jsonData;
}

function addAllAssetinfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsStockOrderAddDraftCmd",
		contentType: "application/text,charset=utf-8",
		data: addAllAssetinfoPara(),
		success: function(msg) {

			console.log("添加备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addDataModal").modal("hide");
				windowStart("添加备品备件信息成功", true);
				SearchBeiPinInfos();
			} else {
				windowStart("添加备品备件信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无添加备品备件信息权限", false);
			} else {
				windowStart("添加备品备件信息失败", false);
			}
		}
	})
}
//删除全部资产
function delAllAssetinfoPara(theId) {

	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", parseInt(theId));
	jsonData = setJson(jsonData, "orderCode", "");
	jsonData = setJson(jsonData, "deviceModelId", -1);
	jsonData = setJson(jsonData, "deviceClassifyId", -1);
	jsonData = setJson(jsonData, "companyId", -1);
	jsonData = setJson(jsonData, "applyNum", -1);
	jsonData = setJson(jsonData, "applicanter", "");
	jsonData = setJson(jsonData, "applyTime", "");
	jsonData = setJson(jsonData, "status", 0);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("删除备品备件信息传值=" + jsonData);
	return jsonData;
}

function delAllAssetinfo(theId) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsStockOrderDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: delAllAssetinfoPara(theId),
		success: function(msg) {

			console.log("删除备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("删除备品备件信息成功", true);
				SearchBeiPinInfos();
			} else {
				windowStart("删除备品备件信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除备品备件信息权限", false);
			} else {
				windowStart("删除备品备件信息失败", false);
			}
		}
	})
}

//修改 
function editAllAssetinfoPara() {
	var theNum = 0;

	if($("#editspNums").val().length > 0) {
		theNum = parseInt($("#editspNums").val());
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", parseInt(editAllData.id));
	jsonData = setJson(jsonData, "orderCode", editAllData.orderCode);
	jsonData = setJson(jsonData, "deviceModelId", parseInt($("#editspTypeNumModel").val()));
	jsonData = setJson(jsonData, "deviceClassifyId", parseInt($("#editbeipinTypeModal").val()));
	jsonData = setJson(jsonData, "companyId", parseInt($("#editspMadeByModal").val()));
	jsonData = setJson(jsonData, "applyNum", theNum);
	jsonData = setJson(jsonData, "applicanter", "");
	jsonData = setJson(jsonData, "applyTime", "");
	jsonData = setJson(jsonData, "status", 0);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("修改备品备件信息传值=" + jsonData);
	return jsonData;
}

function editAllAssetinfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsStockOrderUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: editAllAssetinfoPara(),
		success: function(msg) {

			console.log("修改备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editDataModal").modal("hide");
				windowStart("修改备品备件信息成功", true);
				SearchBeiPinInfos();
			} else {
				windowStart("修改备品备件信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改备品备件信息权限", false);
			} else {
				windowStart("修改备品备件信息失败", false);
			}
		}
	})
}

//提交
function funSubMitInfoForAllPara() {
	var json_arr = [];

	for(var i = 0; i < $(".checkbox-for-all:checked").length; i++) {
		var theData = eval("(" + $(".checkbox-for-all:checked").eq(i).attr("theData") + ")");

		var obj = {};

		//			obj.deviceClassifyId = parseInt(theData.deviceClassifyId) ;
		//			obj.deviceClassifyNameCn = theData.deviceClassifyNameCn; 
		//			obj.deviceModel = theData.deviceModel;
		//			obj.deviceModelId = theData.deviceModelId;
		//			obj.manufacturerId = parseInt(theData.manufacturerId);
		//			obj.manufacturerNameCn = theData.manufacturerNameCn;
		//			obj.providerId = parseInt(theData.providerId);
		//			obj.providerNameCn = theData.providerNameCn;
		//			obj.targetDeviceId = parseInt(theData.targetDeviceId);
		//			obj.targetDeviceNameCn = theData.targetDeviceNameCn;
		//			obj.applyNum = parseInt(theData.applyNum);
		//			obj.applicanter = 1;
		obj.id = parseInt(theData.id);
		obj.status = sunMitNumForOut;
		json_arr.push(obj);
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	jsonData = setJson(jsonData, "commitProperty", json_arr);
	console.log("提交备品备件信息传值=" + jsonData);
	return jsonData;
}

function funSubMitInfoForAll() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsStockOrderCommitCmd",
		contentType: "application/text,charset=utf-8",
		data: funSubMitInfoForAllPara(),
		success: function(msg) {

			console.log("提交备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("备品备件信息提交成功", true);
				SearchBeiPinInfos();
			} else {
				windowStart("备品备件信息提交失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无提交备品备件信息权限", false);
			} else {
				windowStart("提交备品备件信息失败", false);
			}
		}
	})
}

//已生成标签资产
// 1 查询
function SearchBeiPinInfosForHasLabelPara() {

	var start_time = "";
	var end_time = "";
	if($("#startTime2").val().length > 0) {
		start_time = $("#startTime2").val() + " 00:00:00";
	}
	if($("#endTime2").val().length > 0) {
		end_time = $("#endTime2").val() + " 23:59:59";
	}
	var theType = -1;
	if($("#deviceTypeName2").val().length > 0) {
		theType = parseInt($("#deviceTypeName2").val());
	}
	var fuWu = -1;
	if($("#fuwushang2").val().length > 0) {
		fuWu = parseInt($("#fuwushang2").val());
	}
	var deviceModelId = -1;
	if($("#beipinModel2").val().length > 0) {
		deviceModelId = parseInt($("#beipinModel2").val());
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "enterprise", $("#companyName2").val());
	jsonData = setJson(jsonData, "project", $("#projectName2").val());
	jsonData = setJson(jsonData, "deviceClassifyId", theType);
	jsonData = setJson(jsonData, "companyId", fuWu);
	jsonData = setJson(jsonData, "deviceModelId", deviceModelId);
	jsonData = setJson(jsonData, "orderCode", $("#workNum2").val());
	jsonData = setJson(jsonData, "startTime", start_time);
	jsonData = setJson(jsonData, "endTime", end_time);
	jsonData = setJson(jsonData, "status", parseInt(hasLabelAssetStatus));
	jsonData = setJson(jsonData, "index", data_page_index1);
	jsonData = setJson(jsonData, "number", data_number1);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询采购工单传值=" + jsonData);
	return jsonData;
}

function SearchBeiPinInfosForHasLabel() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
	//	{
	//		windowStart("时间范围有误,请填写时间范围",false);
	//	    return;
	//	}
	if($("#startTime2").val().length > 0) {
		if(!timeReg.test($("#startTime2").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return;
		}
	}
	if($("#endTime2").val().length > 0) {
		if(!timeReg.test($("#endTime2").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return;
		}
	}
	if($("#startTime2").val().length == 0) {
		if($("#endTime2").val().length > 0) {
			windowStart("时间范围有误,请重新选取时间范围", false);
			return;
		}
	}
	if($("#endTime2").val().length == 0) {
		if($("#startTime2").val().length > 0) {
			windowStart("时间范围有误,请重新选取时间范围", false);
			return;
		}
	}
	if($("#startTime2").val().length > 0 && $("#endTime2").val().length > 0) {
		var startTime = $("#startTime2").val().split("-");
		var endTime = $("#endTime2").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间", false);
			return;
		}
	}
	label_length = 0;
	$("#dataContent2").html("");
	loadingStart("dataContent2");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPurchaseOrderSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: SearchBeiPinInfosForHasLabelPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询资产类型  所属工厂  服务商返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createLabelAssetTable(msg);
			} else {
				windowStart("查询全部资产备品备件信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();

			//			windowStart("查询资产类型 、所属工厂 、服务商失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询全部资产备品备件信息权限", false);
			} else {
				windowStart("查询全部资产备品备件信息失败", false);
			}
		}
	})
}

function createLabelAssetTable(msg) {
	if(!msg.items || msg.items.length == 0) {
		//		var str = "";
		//		str = "<div style='position:relative;width:100%;text-align:center;top:30%;font-size:26px;font-weight:bold'>当前条件下无数据!</div>";
		//		$("#dataContent2").html("");
		var str = "";
		printData = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无备品备件工单信息";
		str += "</div>";
		$("#dataContent2").html(str);
		return;
	}
	var total1 = msg.totalNumber;
	var totalPage1 = Math.ceil(parseInt(total1) / data_number1);
	total_page1 = totalPage1;
	$("#pageTotalInfo1").html("第 " + curren_page1 + "页/共 " + totalPage1 + " 页");
	var theData = msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	printData += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";

	str += "<th class=''><input type='checkbox' id='checkboxForLabel'>  全选</th>";
	str += "<th class='text-center'>序号</th>";
	printData += "<th class='text-center'>序号</th>";

	str += "<th class='text-center'>工单编号</th>";
	printData += "<th class='text-center'>工单编号</th>";

	str += "<th class='text-center'>备品类型</th>";
	printData += "<th class='text-center'>备品类型</th>";

	str += "<th class='text-center'>备品型号</th>";
	printData += "<th class='text-center'>备品型号</th>";

	str += "<th class='text-center'>服务商</th>";
	printData += "<th class='text-center'>服务商</th>";

	//	str += "<th class='text-center td-width'>提供商</th>";
	//	str += "<th class='text-center td-width'>目标资产</th>";
	str += "<th class='text-center'>申请件数</th>";
	printData += "<th class='text-center'>申请件数</th>";

	str += "<th class='text-center'>申请人</th>";
	printData += "<th class='text-center'>申请人</th>";

	str += "<th class='text-center'>申请时间</th>";
	printData += "<th class='text-center'>申请时间</th>";

	str += "<th class='text-center'>状态</th>";
	printData += "<th class='text-center'>状态</th>";

	str += "<th class='text-center' style='width:10%'>操作</th>";
	str += "</thead><tbody>";
	printData += "</thead><tbody>";

	for(var i = 0; i < theData.length; i++) {
		str += "<tr  >";
		printData += "<tr  >";

		str += "<td class='td2-width' style='width:6%'><input theData='" + JSON.stringify(theData[i]) + "' type='checkbox' class='checkbox-for-label'/></td>";
		str += "<td class='text-center td-width' style='width:9.4%'>" + (i + 1) + "</td>";
		printData += "<td class='text-center td-width' style='width:9.4%'>" + (i + 1) + "</td>";

		str += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["orderCode"] + "</td>";
		printData += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["orderCode"] + "</td>";

		str += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["deviceClassifyNameCn"] + "</td>";
		printData += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["deviceClassifyNameCn"] + "</td>";

		str += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["deviceModel"] + "</td>";
		printData += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["deviceModel"] + "</td>";

		str += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["company"] + "</td>";
		printData += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["company"] + "</td>";

		//		str += "<td class='text-center td-width'>"+theData[i]["providerNameCn"]+"</td>";
		//		str += "<td class='text-center td-width'>"+theData[i]["targetDeviceNameCn"]+"</td>";
		str += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["applyNum"] + "</td>";
		printData += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["applyNum"] + "</td>";

		str += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["applicanter"] + "</td>";
		printData += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["applicanter"] + "</td>";

		str += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["applyTime"] + "</td>";
		printData += "<td class='text-center td2-width' style='width:9.4%'>" + theData[i]["applyTime"] + "</td>";

		var status = "",
			theEditClass = "";
		switch(parseInt(theData[i]["status"])) {
			case 0:
				status = "草稿";
				break;
			case 1:
				status = "待审核";
				theEditClass = "hide";
				break;
			case 2:
				status = "已驳回";
				break;
			case 3:
				status = "已审核";
				theEditClass = "hide";
				break;
			case 4:
				status = "已完成";
				theEditClass = "hide";
				break;
		}
		str += "<td class='text-center td2-width' style='width:9.4%'>" + status + "</td>";
		printData += "<td class='text-center td2-width' style='width:9.4%'>" + status + "</td>";

		str += "<td class='text-center td2-width' style='width:9.4%'>";

		str += "<span class='" + theEditClass + "'  style='padding-left:6px'><a href='javascript:void(0)' theData='" + JSON.stringify(theData[i]) + "'  class='edit-all-class-2'><img src='../img/edit.png' width='18' height='18'></a></span>";
		str += "<span style='padding-left:6px'><a href='javascript:void(0)'  theId='" + theData[i]["id"] + "' class='delete-all-class-2'><img src='../img/dele.png' width='18' height='18'></a></span>";
		str += "</td>";

		str += "</tr>";
		printData += "</tr>";

	}
	str += "</tbody><table>";
	printData += "</tbody><table>";
	$("#dataContent2").html(str);
	$(".delete-all-class-2").click(function() {
		if(!confirm("是否确认删除?")) {
			return;
		}
		delAllAssetinfoForLabel(parseInt($(this).attr("theId")));
	})
	$(".edit-all-class-2").click(function() {
		editLabelData = eval("(" + $(this).attr("theData") + ")");
		$("#editbeipinTypeModal2").val(editLabelData.deviceClassifyId);
		$("#editspNums2").val(editLabelData.applyNum);
		$("#editspTypeNumModel2").val(editLabelData.deviceModelId);
		$("#editspMadeByModal2").val(editLabelData.companyId);
		$("#editDataModal2").modal("show");
	})

	$("#checkboxForAll").change(function() {
		if($(this).prop("checked")) {
			label_length = $(".checkbox-for-all").length;
			$(".checkbox-for-all").prop("checked", true);
		} else {
			label_length = 0;
			$(".checkbox-for-all").prop("checked", false);
		}
	})
	$(".checkbox-for-label").change(function() {
		if($(this).prop("checked")) {
			label_length++;
			if(label_length == $(".checkbox-for-label").length) {
				$("#checkboxForLabel").prop("checked", true);
			} else {
				$("#checkboxForLabel").prop("checked", false);
			}

		} else {
			label_length--;
			if(label_length == $(".checkbox-for-label").length) {
				$("#checkboxForLabel").prop("checked", true);
			} else {
				$("#checkboxForLabel").prop("checked", false);
			}
		}
	})
}

//删除
function delAllAssetinfoForLabelPara(theId) {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", parseInt(theId));
	jsonData = setJson(jsonData, "orderCode", "");
	jsonData = setJson(jsonData, "deviceModelId", -1);
	jsonData = setJson(jsonData, "deviceClassifyId", -1);
	jsonData = setJson(jsonData, "companyId", -1);
	jsonData = setJson(jsonData, "applyNum", -1);
	jsonData = setJson(jsonData, "applicanter", "");
	jsonData = setJson(jsonData, "applyTime", "");
	jsonData = setJson(jsonData, "status", 0);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("删除备品备件信息传值=" + jsonData);
	return jsonData;
}

function delAllAssetinfoForLabel(theId) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPurchaseOrderDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: delAllAssetinfoForLabelPara(theId),
		success: function(msg) {

			console.log("删除备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("删除备品备件信息成功", true);
				SearchBeiPinInfosForHasLabel();
			} else {
				windowStart("删除备品备件信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除备品备件信息权限", false);
			} else {
				windowStart("删除备品备件信息失败", false);
			}
		}
	})
}

//修改
function editAllAssetinfoForLabelPara() {
	var theNum = 0;

	if($("#editspNums2").val().length > 0) {
		theNum = parseInt($("#editspNums2").val());
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", parseInt(editLabelData.id));
	jsonData = setJson(jsonData, "orderCode", editLabelData.orderCode);
	jsonData = setJson(jsonData, "deviceModelId", parseInt($("#editspTypeNumModel2").val()));
	jsonData = setJson(jsonData, "deviceClassifyId", parseInt($("#editbeipinTypeModal2").val()));
	jsonData = setJson(jsonData, "companyId", parseInt($("#editspMadeByModal2").val()));
	jsonData = setJson(jsonData, "applyNum", theNum);
	jsonData = setJson(jsonData, "applicanter", "");
	jsonData = setJson(jsonData, "applyTime", "");
	jsonData = setJson(jsonData, "status", 0);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("修改备品备件信息传值=" + jsonData);
	return jsonData;
}

function editAllAssetinfoForLabel() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPurchaseOrderUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: editAllAssetinfoForLabelPara(),
		success: function(msg) {

			console.log("修改备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editDataModal2").modal("hide");
				windowStart("修改备品备件信息成功", true);
				SearchBeiPinInfosForHasLabel();
			} else {
				windowStart("修改备品备件信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改备品备件信息权限", false);
			} else {
				windowStart("修改备品备件信息失败", false);
			}
		}
	})
}

//添加
function addAllAssetForLabelPara() {
	var theNum = 0;

	if($("#spNums2").val().length > 0) {
		theNum = parseInt($("#spNums2").val());
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", -1);
	jsonData = setJson(jsonData, "orderCode", "");
	jsonData = setJson(jsonData, "deviceModelId", parseInt($("#spTypeNumModel2").val()));
	jsonData = setJson(jsonData, "deviceClassifyId", parseInt($("#beipinTypeModal2").val()));
	jsonData = setJson(jsonData, "companyId", parseInt($("#spMadeByModal2").val()));
	jsonData = setJson(jsonData, "applyNum", theNum);
	jsonData = setJson(jsonData, "applicanter", "");
	jsonData = setJson(jsonData, "applyTime", "");
	jsonData = setJson(jsonData, "status", 0);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加备品备件信息传值=" + jsonData);
	return jsonData;
}

function addAllAssetForLabel() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPurchaseOrderAddDraftCmd",
		contentType: "application/text,charset=utf-8",
		data: addAllAssetForLabelPara(),
		success: function(msg) {

			console.log("添加备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addDataModal2").modal("hide");
				windowStart("添加备品备件信息成功", true);
				SearchBeiPinInfosForHasLabel();
			} else {
				windowStart("添加备品备件信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无添加备品备件信息权限", false);
			} else {
				windowStart("添加备品备件信息失败", false);
			}
		}
	})
}

//提交
function funSubMitInfoForLablePara() {
	var json_arr = [];
	for(var i = 0; i < $(".checkbox-for-label:checked").length; i++) {
		var theData = eval("(" + $(".checkbox-for-label:checked").eq(i).attr("theData") + ")");
		var obj = {};

		obj.id = parseInt(theData.id);
		obj.status = submitForIn;
		json_arr.push(obj);
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	jsonData = setJson(jsonData, "commitProperty", json_arr);
	console.log("提交备品备件信息传值=" + jsonData);
	return jsonData;
}

function funSubMitInfoForLable() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPurchaseOrderCommitCmd",
		contentType: "application/text,charset=utf-8",
		data: funSubMitInfoForLablePara(),
		success: function(msg) {

			console.log("提交备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("备品备件信息提交成功", true);
				SearchBeiPinInfosForHasLabel();
			} else {
				windowStart("备品备件信息提交失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无提交备品备件信息权限", false);
			} else {
				windowStart("提交备品备件信息失败", false);
			}
		}
	})
}

//打印出库工单
function funPrintDataInfos() {
	// var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	var str = "<div id='printId'>";
	str += printData;
	str += "</div>";
	// var htmlTitle = "<html><head><title>打印出库工单</title></head><body>"
	// var htmlhead = $("#dataContent1").html();
	// var htmlFoot = '</body></html>'
	// newWindow.document.write(htmlTitle + printData + htmlFoot);
	// newWindow.document.close();
	$(".body-div-style").append(str);
	$("#printId").jqprint();
	// newWindow.close();
}
//打印采购工单
function funPrintCaigou() {
	// var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	// var htmlTitle = "<html><head><title>打印采购工单</title></head><body>"
	//    // var htmlhead = $("#dataContent2").html();
	//    var htmlFoot = '</body></html>'
	// newWindow.document.write(htmlTitle + printData + htmlFoot);
	//    newWindow.document.close();
	//    newWindow.jqprint();
	//    newWindow.close();
	var str = "<div id='printId'>";
	str += printData;
	str += "</div>";
	$(".body-div-style").append(str);
	$("#printId").jqprint();
}
$(document).ready(function() {
	$(".datepicker-class").datepicker("setValue");
	$(".datepicker-class").val("");

	$(".li-table-change").mouseover(function() {

		var theLeft = parseInt($(this).attr("thenum")) * 120 + "px";

		$(".border-style").animate({
			"left": theLeft
		}, 100);
	})
	$(".li-table-change").click(function() {
		theNum = parseInt($(this).attr("thenum"));

		var theLeft = theNum * 120 + "px";
		$(".border-style").css({
			"left": theLeft
		});
		$(".data-real-content").each(function() {
			$(this).addClass("hide");
		})
		$(".data-real-content").eq(theNum).removeClass("hide");
		if(theNum == 0) {
			allAssetStatus = 0;
			labelType = 0;
		} else if(theNum == 1) {
			labelType = 1;
			hasLabelAssetStatus = 0
		} else {
			labelType = -1;
		}

	})
	$(".li-table-change").mouseout(function() {
		var theLeft = theNum * 120 + "px";
		$(".border-style").animate({
			"left": theLeft
		}, 100);
	})
	$(".btn-hover").click(function() {
		$(".btn-hover").each(function() {
			$(this).removeClass("btn-primary");
			$(this).addClass("btn-default");
		})
		$(this).removeClass("btn-default");
		$(this).addClass("btn-primary");
		$(".btn-items-position").each(function() {
			$(this).addClass("hide");
		})
		allAssetStatus = $(this).attr("theEq");
		$(".btn-items-position").eq(parseInt($(this).attr("theEq"))).removeClass("hide");
		SearchBeiPinInfos();
	})
	$(".btn-hover2").click(function() {
			$(".btn-hover2").each(function() {
				$(this).removeClass("btn-primary");
				$(this).addClass("btn-default");
			})
			$(this).removeClass("btn-default");
			$(this).addClass("btn-primary");
			$(".btn-items-position2").each(function() {
				$(this).addClass("hide");
			})
			hasLabelAssetStatus = $(this).attr("theEq");
			$(".btn-items-position2").eq(parseInt($(this).attr("theEq"))).removeClass("hide");
			SearchBeiPinInfosForHasLabel();
		})
		//全部资产
		// - 查询
	$("#btnSearchBeiPinInfos").click(function() {
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		SearchBeiPinInfos();
	})
	$("#btnNewInfos").click(function() {
			if(allSelect.queryItems.item != undefined && allSelect.queryItems.item.length > 0) {
				var theData = allSelect.queryItems.item;
				var str = "";
				var str = "<option value=''>请选择</option>";
				for(var i = 0; i < theData.length; i++) {
					str += "<option  theChildren='" + JSON.stringify(theData[i]) + "'  value='" + theData[i]["id"] + "'>" + theData[i]["nameCn"] + "</option>";
				}
			}
			//类型
			$("#beipinTypeModal").html(str);
			$("#spTypeNumModel").html("<option value=''>请选择</option>");
			$("#spMadeByModal").html("<option value=''>请选择</option>");
			$("#spNums").val("1");
			$("#addDataModal").modal("show");
		})
		// -添加
	$("#btnAddForOrder").click(function() {
		if($("#beipinTypeModal").val() == "") {
			windowStart("请选择备品类型", false);
			return;
		}
		if($("#spTypeNumModel").val() == "") {
			windowStart("请选择备品型号", false);
			return;
		}
		if($("#spMadeByModal").val() == "") {
			windowStart("请选择服务商", false);
			return;
		}
		if($("#spNums").val() == "") {

			windowStart("请输入申请备品件数", false);
			return;

		}
		var numReg = /^[1-9]\d*$/;
		if($("#spNums").val().length > 0) {
			if(!numReg.test(parseInt($("#spNums").val()))) {
				windowStart("申请备品件数只能输入正整数", false);
				return;
			}
		}
		addAllAssetinfo();
	})

	searchSysInfos();
	$("#editbtnAddForOrder").click(function() {
		var numReg = /^[1-9]\d*$/;
		if($("#editspNums").val().length > 0) {
			if(!numReg.test(parseInt($("#editspNums").val()))) {
				windowStart("申请备品件数只能输入正整数", false);
				return;
			}
		}
		editAllAssetinfo();
	})
	$("#theAssetModal").keyup(function() {
		var theValue = $(this).val();
		var realValue = -1;
		$(".li-id-class").unbind("click");
		if($(this).val().length > 0) {

			for(var i = 0; i < $(".li-id-class").length; i++) {
				if($(".li-id-class").eq(i).attr("theId").indexOf(theValue) != -1) {

					$(".li-id-class").eq(i).removeClass("hide");
				} else {
					$(".li-id-class").eq(i).addClass("hide");
				}
			}
		}
		$(".li-id-class").bind("click", function() {
			realValue = parseInt($(this).attr("theId"));
			$("#theAssetModal").val(realValue);
			$(".li-id-class").addClass("hide");
		});

	})
	$("#edittheAssetModal").keyup(function() {
		var theValue = $(this).val();
		var realValue = -1;

		$(".li-id-class-edit").unbind("click");
		if($(this).val().length > 0) {

			for(var i = 0; i < $(".li-id-class-edit").length; i++) {
				console.log($(".li-id-class-edit").eq(i).attr("theId"));
				if($(".li-id-class-edit").eq(i).attr("theId").indexOf(theValue) != -1) {

					$(".li-id-class-edit").eq(i).removeClass("hide");
				} else {
					$(".li-id-class-edit").eq(i).addClass("hide");
				}
			}
		}
		$(".li-id-class-edit").bind("click", function() {
			realValue = parseInt($(this).attr("theId"));
			$("#edittheAssetModal").val(realValue);
			$(".li-id-class-edit").addClass("hide");
		});

	})

	//---提交
	$(".btnSubMitForone").click(function() {
			if($(".checkbox-for-all:checked").length == 0) {
				windowStart("请选择需要提交的备品备件信息", false);
				return;
			}
			sunMitNumForOut = parseInt($(this).attr("submitNum"));
			funSubMitInfoForAll();
		})
		//已生成标签资产
		//	hasLabelAssetStatus
	$("#btnSearchBeiPinInfos2").click(function() {
		SearchBeiPinInfosForHasLabel();
	})

	$("#btnNewInfos2").click(function() {		
		if(allSelect.queryItems.item != undefined && allSelect.queryItems.item.length > 0) {
				var theData = allSelect.queryItems.item;
				var str = "";
				var str = "<option value=''>请选择</option>";
				for(var i = 0; i < theData.length; i++) {
					str += "<option  theChildren='" + JSON.stringify(theData[i]) + "'  value='" + theData[i]["id"] + "'>" + theData[i]["nameCn"] + "</option>";
				}
			}
			//类型
			$("#beipinTypeModal2").html(str);
			$("#spTypeNumModel2").html("<option value=''>请选择</option>");
			$("#spMadeByModal2").html("<option value=''>请选择</option>");
			$("#spNums2").val("1");
			$("#addDataModal2").modal("show");
	})
	$("#btnAddForOrder2").click(function() {
		if($("#beipinTypeModal2").val() == "") {
			windowStart("请选择备品类型", false);
			return;
		}
		if($("#spTypeNumModel2").val() == "") {
			windowStart("请选择备品型号", false);
			return;
		}
		if($("#spMadeByModal2").val() == "") {
			windowStart("请选择服务商", false);
			return;
		}
		if($("#spNums2").val() == "") {

			windowStart("请输入申请备品件数", false);
			return;

		}
		var numReg = /^[1-9]\d*$/;
		if($("#spNums2").val().length > 0) {
			if(!numReg.test(parseInt($("#spNums2").val()))) {
				windowStart("采购备品件数只能输入正整数", false);
				return;
			}
		}
		addAllAssetForLabel();
	})
	$("#editbtnAddForOrder2").click(function() {
		var numReg = /^[1-9]\d*$/;
		if($("#editspNums2").val().length > 0) {
			if(!numReg.test($("#editspNums2").val())) {
				windowStart("采购备品件数只能输入正整数", false);
				return;
			}
		}
		editAllAssetinfoForLabel();
	})
	$(".btnSubMitForone2").click(function() {
		if($(".checkbox-for-label:checked").length == 0) {
			windowStart("请选择需要提交的备品备件信息", false);
			return;
		}
		submitForIn = parseInt($(this).attr("submitNum"));
		funSubMitInfoForLable();
	})

	$("#btnPrint").click(function() {
		funPrintDataInfos();

	})
	$("#btnPrint2").click(function() {

		funPrintCaigou();
	})

	//出库工单分页操作
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
			SearchBeiPinInfos();

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
			SearchBeiPinInfos();

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
			SearchBeiPinInfos();

		})
		//备品分页操作

	//出库工单分页操作
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
			SearchBeiPinInfosForHasLabel();

		})
		//下一页
	$("#btnPageNext1").click(function() {
			if(total_page1 == 0) {
				return;
			}

			if(total_page1 == curren_page) {
				windowStart("当前为尾页", false);
				return;
			}

			data_page_index1 += data_number1;
			curren_page1 += 1;
			SearchBeiPinInfosForHasLabel();

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
			$("#pageNumId1").val("");
			SearchBeiPinInfosForHasLabel();
		})
		//备品分页操作
})