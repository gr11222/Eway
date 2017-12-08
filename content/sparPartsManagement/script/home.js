var theNum = 0;
var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var data_page_index2 = 0;
var data_number2 = 17;
var curren_page2 = 1;
var total_page2 = 0;
var edit_id = -1;
var theRuKuData = {};
var thData_length = 0;
var isAdd_RUku = false;
var theRealId = -1;
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
	console.log("查询资产类型  所属工厂  服务商传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	$("#beipinType").html("");
	$("#fuwuShangSelect").html("");
	$("#beipinTypeModal").html("");
	$("#fuwushangModal").html("");
	$("#factoryModal").html("");
	$("#projectName").html("");
	//$("#editassetTypeModal").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			//loadingStop();
			console.log("查询资产类型  所属工厂  服务商返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoSelect(msg);
				allSelect = msg;
				funSearch();
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

		var theData = msg.factoryItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#factoryModal").html(str);
		$("#editfactoryModal").html(str);
		//		$("#editfactoryAreaModal").html(str);

	}
	if(msg.CompanyItems != undefined && msg.CompanyItems.length > 0) {
		//		var theData = msg.CompanyItems;
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
		$("#fuwuShangSelect").html(str);
		$("#madeByModal").html(str);
		$("#editmadeByModal").html(str);

	}
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
		$("#beipinType").html(str);
		$("#beipinTypeModal").html(str);
		$("#editbeipinTypeModal").html(str);
	}
	if(msg.providerItems != undefined && msg.providerItems.length > 0) {
		var currenData = msg.providerItems;
		var dataArr = [];
		for(var i = 0; i < currenData.length; i++) {
			dataArr.push(currenData[i]["nameCn"]);
		}

		var sortData = cusSort(dataArr);

		var theData = createobjData(sortData, currenData);

		var theData = msg.providerItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#bpGiveModal").html(str);
		$("#editbpGiveModal").html(str);
		//		$("#editfactoryAreaModal").html(str);

	}

	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#projectName").html(str);
		$("#editProtect").html(str);

	}

}
//查询备品备件信息
function funSearchPara() {

	var deviceClassifyId = -1;
	var companyId = -1;
	if($("#beipinType").val().length > 0) {
		deviceClassifyId = parseInt($("#beipinType").val());
	}
	if($("#fuwuShangSelect").val() != undefined && $("#fuwuShangSelect").val() != null && $("#fuwuShangSelect").val().length > 0) {
		companyId = parseInt($("#fuwuShangSelect").val());
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "enterprise", $("#companyName").val());
	jsonData = setJson(jsonData, "project", $("#projectName").val());
	jsonData = setJson(jsonData, "deviceClassifyId", deviceClassifyId);
	jsonData = setJson(jsonData, "deviceModel", $("#beipinNum").val());
	jsonData = setJson(jsonData, "companyId", companyId);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询备品备件传值=" + jsonData);
	return jsonData;
}

function funSearch() {
	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSparePartsSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funSearchPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询备品备件返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#beipinType").val("");
				$("#fuwushangType").val("");
				createTableInfos(msg);
				thData_length = 0;
			} else {
				windowStart("查询查询备品备件信息失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询备品备件权限", false);
			} else {
				windowStart("查询查询备品备件信息失败", false);
			}
			//			windowStart("查询点检信息失败",false);
		}
	})
}

function createTableInfos(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无备品备件信息";
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
	str += "<th class='text-center'><input type='checkbox' id='allCheckId'/>  全选</th>";
	//	str += "<th class='text-center td-width'>序号</th>";
	str += "<th class='text-center td-width'>备品类型</th>";
	str += "<th class='text-center td-width'>备品型号</th>";
	str += "<th class='text-center td-width'>服务商</th>";
	str += "<th class='text-center td-width'>备品件数</th>";
	str += "<th class='text-center td-width'>报警限额</th>";
	str += "<th class='text-center td-width' >管理</th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var spareNum = "";
		var alarmLimit = "";
		if(parseInt(realData[i]["spareNum"]) == 0) {
			spareNum = 0;
		} else {
			spareNum = parseInt(realData[i]["spareNum"]);
		}
		if(parseInt(realData[i]["alarmLimit"]) == -1) {
			alarmLimit = "";
		} else {
			alarmLimit = parseInt(realData[i]["alarmLimit"]);
		}
		str += "<tr>";
		str += "<td class='text-center ' style='width: 10%;word-wrap: break-word;word-break: break-all;'><input type='checkbox' class='ecah-check-class' theData='" + JSON.stringify(realData[i]) + "'/>  " + (i + 1) + "</td>";
		str += "<td class='text-center' style='width: 15.6%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceClassifyNameCn"] + "</td>";
		str += "<td class='text-center ' style='width:15.6%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["deviceModel"] + "</td>";
		str += "<td class='text-center' style='width:15.6%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["companyNameCn"] + "</td>";
		//		str += "<td class='text-center td-width'>"+realData[i]["factoryNameCn"]+"</td>";
		str += "<td class='text-center' style='width: 15.6%;word-wrap: break-word;word-break: break-all;'>" + spareNum + "</td>";
		str += "<td class='text-center' style='width: 15.6%;word-wrap: break-word;word-break: break-all;'>" + alarmLimit + "</td>";
		str += "<td class='text-center' style='width:12%'>";
		str += "<span><a datas='" + JSON.stringify(realData[i]) + "' href='javascript:void(0)' class='edit-datainfos'><img src='../img/edit.png'></a></span>";
		str += "<span style='padding-left:5px'><a datas='" + JSON.stringify(realData[i]) + "' href='javascript:void(0)' class='delete-datainfos'><img src='../img/dele.png'></a></span>";
		//<span style='padding-left:5px'><a datas='"+JSON.stringify(realData[i])+"' href='javascript:void(0)' class='delete-userinfos'><img src='../img/dele.png'></a></span>
		str += "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	$(".edit-datainfos").click(function() {
		var theData = eval("(" + $(this).attr("datas") + ")");
		edit_id = parseInt(theData.id);
		$("#editbeipinTypeModal").val(theData.deviceClassifyId);
		$("#editbpModalNum").val(theData.deviceModel);
		$("#editmadeByModal").val(theData.companyId);
		//		$("#editbpGiveModal").val(theData.providerId);
		//		$("#editfactoryModal").val(theData.factoryId);
		if(parseInt(theData.spareNum) == 0) {
			$("#editbpShuLiangModal").val("");
		} else {
			$("#editbpShuLiangModal").val(theData.spareNum);
		}
		if(parseInt(theData.alarmLimit) == -1) {
			$("#editalarmNumModal").val("");
		} else {
			$("#editalarmNumModal").val(theData.alarmLimit);
		}
		$("#editDataModal").modal("show");
	})
	$(".delete-datainfos").click(function() {
		if(!confirm("是否确认删除?")) {
			return;
		}
		var theId = parseInt(eval("(" + $(this).attr("datas") + ")").id);
		delSPInfos(theId);
	})

	$("#allCheckId").change(function() {
		if($(this).prop("checked")) {
			thData_length = $(".ecah-check-class").length;
			$(".ecah-check-class").prop("checked", true);
		} else {
			thData_length = 0;
			$(".ecah-check-class").prop("checked", false);
		}
	})

	$(".ecah-check-class").change(function() {
		if($(this).prop("checked")) {
			thData_length++;
			if(thData_length == $(".ecah-check-class").length) {
				$("#allCheckId").prop("checked", true);
			} else {
				$("#allCheckId").prop("checked", false);
			}

		} else {
			thData_length--;
			// if(thData_length == $(".ecah-check-class").length) {
			// 	$("#allCheckId").prop("checked", true);
			// } else {
				$("#allCheckId").prop("checked", false);
			// }
		}
	})
}

//添加备品 备件信息
function addSPInfosCheck() {
	var numReg = /^[0-9]+$/;
	if(!$("#beipinTypeModal").val()) {
		windowStart("请选择备品类型", false);
		return false;
	}
	if(!$("#bpModalNum").val()) {
		windowStart("请填写备品型号", false);
		return false;
	}
	var enReg = /^[a-zA-Z][a-zA-Z0-9-]*$/;
	if(!enReg.test($("#bpModalNum").val())) {
		windowStart("备品型号只能输入英文、数字、中横线", false);
		return;
	}
	var firstReg = /^[a-zA-Z]{1}/;
	if(!firstReg.test($("#bpModalNum").val())) {
		windowStart("备品型号必须以英文开头", false);
		return;
	}
	if($("#bpModalNum").val().indexOf("%") != -1) {
		windowStart("备品型号不允许输入%", false);
		return false;
	}
	if(!$("#madeByModal").val()) {
		windowStart("请选择服务商", false);
		return false;
	}
	if(!$("#bpShuLiangModal").val()) {
		windowStart("请输入备品件数", false);
		return false;
	}
	if(parseInt($("#bpShuLiangModal").val()) > 50000) {
		windowStart("超过最大限额", false);
		return false;
	}
	if(!numReg.test($("#bpShuLiangModal").val())) {
		windowStart("备品件数只能填写正整数和0", false);
		return false;
	}
	if($("#alarmNumModal").val().length > 0) {
		if(!numReg.test($("#alarmNumModal").val())) {
			windowStart("报警限额只能填写正整数和0", false);
			return false;
		}

	}
	if(parseInt($("#alarmNumModal").val()) > parseInt($("#bpShuLiangModal").val())) {
		windowStart("报警限额不能大于备品件数", false);
		return false;
	}
	return true;
}

function addSPInfosPara() {
	var bpNum = -1;
	var alarmNum = 0;

	if($("#bpShuLiangModal").val().length > 0) {
		bpNum = parseInt($("#bpShuLiangModal").val());

	}
	if($("#alarmNumModal").val().length > 0) {
		alarmNum = parseInt($("#alarmNumModal").val());

	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "id", -1);
	jsonData = setJson(jsonData, "deviceClassifyId", parseInt($("#beipinTypeModal").val()));
	jsonData = setJson(jsonData, "deviceModel", $("#bpModalNum").val());
	jsonData = setJson(jsonData, "companyId", parseInt($("#madeByModal").val()));
	jsonData = setJson(jsonData, "spareNum", bpNum);
	jsonData = setJson(jsonData, "alarmLimit", alarmNum);
	jsonData = setJson(jsonData, "insertTime", "");
	jsonData = setJson(jsonData, "updateTime", "");
	console.log("添加备品备件传值=" + jsonData);
	theRuKuData = eval("(" + jsonData + ")");
	return jsonData;
}

function addSPInfos() {
	theRealId = -1;
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSparePartsAddCmd",
		contentType: "application/text,charset=utf-8",
		data: addSPInfosPara(),
		success: function(msg) {
			console.log("添加备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addDataModal").modal("hide");
				windowStart("备品备件信息添加成功", true);
				$(".init-for-add").val("");
				funSearch();
			} else if(msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				theRealId = parseInt(msg.requestCommand);
				$("#addDataModal").modal("hide");
				$("#isInsetCangKuModal").modal("show");
			} else {
				windowStart("添加备品备件失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无添加备品备件权限", false);
			} else {
				windowStart("添加备品备件失败", false);
			}
			//			windowStart("查询点检信息失败",false);
		}
	})
}

// 修改
function editSPInfosCheck() {
	var numReg = /^[0-9]+$/;
	if(!$("#editbeipinTypeModal").val()) {
		windowStart("请选择备品类型", true);
		return false;
	}
	if(!$("#editbpModalNum").val()) {
		windowStart("请填写备品型号", true);
		return false;
	}
	if(!$("#editmadeByModal").val()) {
		windowStart("请选择服务商", true);
		return false;
	}

	if($("#editbpShuLiangModal").val().length > 0) {
		if(!numReg.test($("#editbpShuLiangModal").val())) {
			windowStart("备品件数只能填写正整数和0", true);
			return false;
		}

	}
	if($("#editalarmNumModal").val().length > 0) {
		if(!numReg.test($("#editalarmNumModal").val())) {
			windowStart("报警限额只能填写正整数和0", true);
			return false;
		}

	}
	return true;
}

function editSPInfosPara() {
	var bpNum = 0;
	var alarmNum = -1;
	if($("#editbpShuLiangModal").val().length > 0) {
		bpNum = parseInt($("#editbpShuLiangModal").val());

	}
	if($("#editalarmNumModal").val().length > 0) {
		alarmNum = parseInt($("#editalarmNumModal").val());

	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "id", edit_id);
	jsonData = setJson(jsonData, "deviceClassifyId", parseInt($("#editbeipinTypeModal").val()));
	jsonData = setJson(jsonData, "deviceModel", $("#editbpModalNum").val());
	jsonData = setJson(jsonData, "companyId", parseInt($("#editmadeByModal").val()));
	jsonData = setJson(jsonData, "spareNum", bpNum);
	jsonData = setJson(jsonData, "alarmLimit", alarmNum);
	jsonData = setJson(jsonData, "insertTime", "");
	jsonData = setJson(jsonData, "updateTime", "");
	console.log("修改备品备件传值=" + jsonData);
	return jsonData;
}

function editSPInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSparePartsUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: editSPInfosPara(),
		success: function(msg) {
			console.log("修改备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editDataModal").modal("hide");
				windowStart("备品备件信息修改成功", true);
				funSearch();
			} else {
				windowStart("修改备品备件失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改备品备件权限", false);
			} else {
				windowStart("修改备品备件失败", false);
			}

		}
	})
}

//删除
function delSPInfosPara(theId) {

	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "id", theId);
	jsonData = setJson(jsonData, "deviceClassifyId", -1);
	jsonData = setJson(jsonData, "deviceModel", "");
	jsonData = setJson(jsonData, "companyId", -1);
	jsonData = setJson(jsonData, "spareNum", 0);
	jsonData = setJson(jsonData, "alarmLimit", 0);
	jsonData = setJson(jsonData, "insertTime", "");
	jsonData = setJson(jsonData, "updateTime", "");
	console.log("删除备品备件传值=" + jsonData);
	return jsonData;
}

function delSPInfos(theId) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSparePartsDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: delSPInfosPara(theId),
		success: function(msg) {
			console.log("删除备品备件信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("备品备件信息删除成功", true);
				funSearch();
			} else if(msg.responseCommand.toUpperCase().indexOf("OCCUPY") != -1) {
				windowStart("当前备品备件正在使用中，无法删除！", false);
			} else {
				windowStart("删除备品备件失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除备品备件权限", false);
			} else {
				windowStart("删除备品备件失败", false);
			}
			//			windowStart("查询点检信息失败",false);
		}
	})
}

//入库

function rukuSPInfosPara() {
	theRuKuData.spareNum = 0;
	theRuKuData.id = parseInt(theRealId);

	theRuKuData.spareNum = parseInt($("#ruKubpShuLiangModal").val());
	console.log("备品备件入库传值=" + JSON.stringify(theRuKuData));
	return JSON.stringify(theRuKuData);
}

function rukuSPOtherPara() {
	var theData = eval("(" + $(".ecah-check-class:checked").eq(0).attr("theData") + ")");
	var jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "spareId", parseInt(theData.id));
	jsonData = setJson(jsonData, "projectId", -1);
	jsonData = setJson(jsonData, "number", parseInt($("#ruKubpShuLiangModal").val()));
	console.log("备品备件入库传值=" + jsonData);
	return jsonData;
}

function ruKuSPInfos() {
	var theData = "";
	if(isAdd_RUku) {
		theData = rukuSPInfosPara();
	} else {
		theData = rukuSPOtherPara();
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSparePartsInStorageCmd",
		contentType: "application/text,charset=utf-8",
		data: theData,
		success: function(msg) {
			console.log("入库信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#ruKuModal").modal("hide");
				windowStart("备品备件已入库", true);

				funSearch();
			} else {
				windowStart("备品备件入库失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无操作备品备件入库权限", false);
			} else {
				windowStart("备品备件入库失败", false);
			}

		}
	})
}

//出库

function chukuSPInfosPara() {
	var theData = eval("(" + $(".ecah-check-class:checked").eq(0).attr("theData") + ")");
	var jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "spareId", parseInt(theData.id));
	// jsonData = setJson(jsonData, "deviceClassifyId", theData.deviceClassifyId);
	// jsonData = setJson(jsonData, "deviceModel", theData.deviceModel);
	jsonData = setJson(jsonData, "projectId", parseInt($("#editProtect").val()));
	// jsonData = setJson(jsonData, "companyId", theData.companyId);
	jsonData = setJson(jsonData, "number", parseInt($("#outruKubpShuLiangModal").val()));
	// jsonData = setJson(jsonData, "alarmLimit", parseInt(theData.alarmLimit));
	// jsonData = setJson(jsonData, "insertTime", "");
	// jsonData = setJson(jsonData, "updateTime", "");
	console.log("备品备件出库传值=" + jsonData);
	return jsonData;
}

function chuKuSPInfos() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSparePartsOutStorageCmd",
		contentType: "application/text,charset=utf-8",
		data: chukuSPInfosPara(),
		success: function(msg) {
			console.log("出库信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#chuKuModal").modal("hide");
				windowStart("备品备件已出库", true);

				funSearch();
			} else {
				windowStart("备品备件出库失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无操作备品备件出库权限", false);
			} else {
				windowStart("备品备件出库失败", false);
			}

		}
	})
}

$(document).ready(function() {
	//查询 服务商、资产类型、所属工厂
	searchSysInfos();
	//查询备品
	$("#btnSearData").click(function() {

		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		funSearch();
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
			funSearch();
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
			funSearch();
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
			funSearch();
		})
		//备品分页操作

	//新增
	$("#btnAddBeiPin").click(function() {
		if(allSelect.DeviceItems != undefined && allSelect.DeviceItems.length > 0) {
			var currenData = allSelect.DeviceItems;
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
			$("#beipinTypeModal").html(str);
		}
		if(allSelect.CompanyItems != undefined && allSelect.CompanyItems.length > 0) {
			var currenData = allSelect.CompanyItems;
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
			$("#madeByModal").html(str);
		}
		$("#bpModalNum").val("");
		$("#bpShuLiangModal").val("1");
		$("#alarmNumModal").val("0");
		$("#addDataModal").modal("show");
	})
	$("#btnAddRealBtn").click(function() {
			if(!addSPInfosCheck()) {
				return;
			}
			addSPInfos();
		})
		//修改
	$("#btnEditRealBtn").click(function() {
		if(!$("#editbpShuLiangModal").val()) {
			windowStart("请输入备品件数", false);
			return;
		}
		var numReg = /^[0-9]+$/;
		if(!numReg.test($("#editbpShuLiangModal").val()) || parseInt($("#ruKubpShuLiangModal").val()) < 1) {
			windowStart("入库数量只能为正整数", false);
			return;
		}
		if(!numReg.test($("#editalarmNumModal").val())) {
			windowStart("报警限额只能为正整数或0", false);
			return;
		}
		editSPInfos();
	})

	$("#btnAckedRuKu").click(function() {
		isAdd_RUku = true;
		$("#isInsetCangKuModal").modal("hide");
		$("#beipinTypeModalText").text($("#beipinTypeModal option:selected").text());
		$("#beipinnumModalText").text($("#bpModalNum").val());
		$("#fuwushangModalText").text($("#madeByModal option:selected").text());
		$("#ruKuModal").modal("show");

	})

	//入库

	$("#btnSureRuku").click(function() {
		if(!$("#ruKubpShuLiangModal").val()) {
			windowStart("请填写入库数量", false);
			return;
		}
		var numReg = /^[0-9]+$/;
		if(!numReg.test($("#ruKubpShuLiangModal").val()) || parseInt($("#ruKubpShuLiangModal").val()) < 1) {
			windowStart("入库数量必须为正整数", false);
			return;
		}
		ruKuSPInfos();
	})

	//页面入库按钮
	$("#btnInsertInfo").click(function() {
			if($(".ecah-check-class:checked").length == 0) {
				windowStart("请选择需要入库的备品备件", false);
				return;

			}
			if($(".ecah-check-class:checked").length > 1) {
				windowStart("只能对一个备品备件进行入库操作", false);
				return;

			}
			isAdd_RUku = false;
			var theData = eval("(" + $(".ecah-check-class:checked").eq(0).attr("theData") + ")");
			$("#beipinTypeModalText").text(theData.deviceClassifyNameCn);
			$("#beipinnumModalText").text(theData.deviceModel);
			$("#fuwushangModalText").text(theData.companyNameCn);
			$("#ruKubpShuLiangModal").val("1");
			$("#ruKuModal").modal("show");
		})
		//页面出库按钮
	$("#btnOutInfo").click(function() {

		if($(".ecah-check-class:checked").length == 0) {
			windowStart("请选择需要出库的备品备件", false);
			return;

		}
		if($(".ecah-check-class:checked").length > 1) {
			windowStart("只能对一个备品备件进行出库操作", false);
			return;
		}
		if(!confirm("确认出库?")) {
			return;
		}
		var theData = eval("(" + $(".ecah-check-class:checked").eq(0).attr("theData") + ")");
		$("#outbeipinTypeModalText").text(theData.deviceClassifyNameCn);
		$("#outbeipinnumModalText").text(theData.deviceModel);
		$("#outfuwushangModalText").text(theData.companyNameCn);
		$("#outruKubpShuLiangModal").val("1");
		$("#editProtect").val("");
		if(theData.spareNum.length == 0) {
			$("#totalNumInput").text(0);
		} else {
			$("#totalNumInput").text(theData.spareNum);
		}

		$("#chuKuModal").modal("show");
	})

	$("#outbtnSureRuku").click(function() {
		if(!$("#outruKubpShuLiangModal").val()) {
			windowStart("请填写出库数量", false);
			return;
		}
		var numReg = /^[0-9]+$/;
		if(!numReg.test($("#outruKubpShuLiangModal").val()) || parseInt($("#ruKubpShuLiangModal").val()) < 1) {
			windowStart("出库数量必须为正整数", false);
			return;
		}
		var theData = eval("(" + $(".ecah-check-class:checked").eq(0).attr("theData") + ")");
		if(parseInt($("#outruKubpShuLiangModal").val()) > theData.spareNum) {
			windowStart("出库数量不能大于库存数量", false);
			return;
		}
		if(!$("#editProtect").val()) {
			windowStart("请选择所属项目", false);
			return;
		}
		chuKuSPInfos();
	})
})