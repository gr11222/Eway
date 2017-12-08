var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var data_page_index2 = 0;
var data_number2 = 17;
var curren_page2 = 1;
var total_page2 = 0;

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

//------------------------------获得下拉选项---------------------------------------
function searchSysInfosPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(null, "responseCommand", "");
	jsonData = setJson(jsonData, "item", "", true);
	jsonData = setJson(jsonData, "number", -1);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询下拉选择传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	$("#selectPA").html("");
	$("#selectBuyer").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagBasicInfoQueryItemCmd",
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
				windowStart("当前用户无查询下拉选择权限", false);
			} else {
				windowStart("查询下拉选择失败", false);
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

	//PA
	if(msg.item != undefined && msg.item.length > 0) {
		var theData = msg.item;
		var str = "";
		for(var i = 0; i < theData.length; i++) {
		//	str += "<option value='-1'>请选择</option>";
			str += "<option value='" + theData[i]["saleid"] + "' data='" + JSON.stringify(theData[i]) + "'>" + theData[i]["sale"] + "</option>";
		}
		$("#PA").html(str);

	}

	//购买方
	if(msg.item != undefined && msg.item.length > 0) {
		var str = "<option value='-1'>请选择PA</option>";
		$("#selectBuyer").html(str);
	}

	//购买方
	if(msg.item != undefined && msg.item.length > 0) {
//		var theData = msg.item;
//		var str = "";
//		for(var i = 0; i < theData.length; i++) {
//			str += "<option value='" + theData[i]["buyersid"] + "' data='" + JSON.stringify(theData[i]) + "'>" + theData[i]["buyers"] + "</option>";
//		}
		var data = eval('(' + $("#PA").find("option:selected").attr("data") + ')');
		var str = "<option value='" + data.buyersid + "'>" + data.buyers + "</option>";
		$("#buyer").html(str);

	}
}

//---------------------------------------------查询----------------------------------------
function funLGSearch() {
	$("#dataContent").html("");
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagBasicInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: lableGenerateSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				$("#pageNumId").val("");
				console.log(JSON.stringify(msg));
				createlableGenerateTableInfos(msg);
			}
		},
		error: function() {
			loadingStop();
			windowStart("查询失败", false);
			console.log("fail");
		}
	});
}

function lableGenerateSearchPara() {
	var jsonData = setJson(null, "resp", {});
	var queryItem = setJson(null, "saleid", parseInt($("#selectPA").val()));
	queryItem = setJson(queryItem, "buyersid", parseInt($("#selectBuyer").val()));
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
	queryItem = setJson(queryItem, "isEnable", parseInt($("#selectUse").val()));
	queryItem = setJson(queryItem, "isalreadyPaid", parseInt($("#selectCharge").val()));
	queryItem = setJson(queryItem, "index", data_page_index);
	queryItem = setJson(queryItem, "number", data_number);
	jsonData = setJson(jsonData, "queryItem", eval("(" + queryItem + ")"));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "totalNumber", total);
	jsonData = setJson(jsonData, "item", "", true);
	console.log("标签生成查询传值=" + jsonData);
	return jsonData;
}

function createlableGenerateTableInfos(msg) {
	if(!msg.item || msg.item.length < 1) {
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无标签生成信息";
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
	//	str += "<th class='' ><div class='checkbox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center'><div class='checkbox'>标签编号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>PA人员</div></th>";
	str += "<th class='text-center'><div class='checkbox'>购买方</div></th>";
	str += "<th class='text-center'><div class='checkbox'>是否使用</div></th>";
	str += "<th class='text-center'><div class='checkbox'>是否计费</div></th>";
	str += "<th class='text-center'><div class='checkbox'>生效时间</div></th>";
	str += "<th class='text-center'><div class='checkbox'>过期时间</div></th>";
	str += "<th class='text-center'><div class='checkbox'>操作人</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		str += "<tr  style='cursor:default'>";
		//       str += "<td class='' style='width:6%'><input type='checkbox'  class='repair-checkbox' theId='"+realData[i]["id"]+"'></td>";
		str += "<td class='text-center' style='width:5%'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["id"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["sale"] + "</td>"
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["buyers"] + "</td>";
		if(realData[i]["isEnable"] == 0) {
			str += "<td class='text-center' style='width:8%;word-wrap: break-word;word-break: break-all;'>否</td>";
		} else {
			str += "<td class='text-center' style='width:8%;word-wrap: break-word;word-break: break-all;'>是</td>";
		}
		if(realData[i]["alreadyPaid"] == 0) {
			str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>未计费</td>";
		} else {
			str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>计费</td>";
		}
		str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["insertTime"] + "</td>";
		str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["expiryDate"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["operator"] + "</td>";
	}
	str += "</tbody><table>";

	$("#dataContent").html(str);
}

//--------------------------------------------生成标签弹出框查询-------------------------------------
function funLGApply() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagBasicInfoQueryTagNumCmd",
		contentType: "application/text,charset=utf-8",
		data: lableGenerateApplyPara(),
		success: function(msg) {
			console.log("标签生成弹出框返回值=" + JSON.stringify(msg));
			createSelect(msg);
			$("#restNum").text(msg.number);
			//			$("#restNum").val(msg.number);
		},
		error: function() {
			console.log("fail");
		}
	});
}

function lableGenerateApplyPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(null, "responseCommand", "");
	//		var items = setJson(null, "saleid", -1);
	//		items = setJson(items, "buyersid", -1);
	//		items = setJson(items, "startTime",  $("#startTime").val() + " 00:00:00");
	//		items = setJson(items, "endTime", $("#endTime").val() + " 23:59:59");
	//		items = setJson(items, "orderCode", "");
	//		items = setJson(items, "isEnable", "");
	//	    items = setJson(items, "alreadyPaid", "");
	//		items = setJson(items, "index", -1);
	//		items = setJson(items, "number", parseInt($("#buyer").val()));
	jsonData = setJson(jsonData, "saleid", parseInt($("#PA").val()));
	jsonData = setJson(jsonData, "buyersid", parseInt($("#buyer").val()));
	jsonData = setJson(jsonData, "number", -1);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("标签生成弹出框传值=" + jsonData);
	return jsonData;

}

function createSelect(msg) {
	//PA
	if(msg.item != undefined && msg.item.length > 0) {
		var theData = msg.item;
		for(var i = 0; i < theData.length; i++) {
			var str = "<option value='" + theData[i]["saleid"] + "'>" + theData[i]["buyers"] + "</option>";
		}

	}
	$("#PA").html(str);

	//购买方
	if(msg.item != undefined && msg.item.length > 0) {
		var theData = msg.item;
		for(var i = 0; i < theData.length; i++) {
			if(i == 0) {
				var str = "<option value='" + theData[i]["buyersid"] + "'>" + theData[i]["buyers"] + "</option>";
			} else {
				for(var m = 0; m < i; m++) {
					if(theData[i]["buyersid"] != theData[m]["buyersid"]) {
						str += "<option value='" + theData[i]["buyersid"] + "'>" + theData[i]["buyers"] + "</option>";
						break;
					}
				}
			}

		}
	}
	$("#buyer").html(str);

}

//-------------------------------------------生成标签-------------------------------------------
function funLGEConfirm() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTagBasicInfoAddCmd",
		contentType: "application/text,charset=utf-8",
		data: lableGenerateConfirmPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				$("#lablesGenerateModal").modal("hide");
				windowStart("生成标签成功", true);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#lablesGenerateModal").modal("hide");
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无生成标签权限", false);
			} else {
				windowStart("生成标签失败", false);
			}
			console.log("fail");
		}
	});
}

function lableGenerateConfirmPara() {
	var jsonData = setJson(null, "resp", {});
	var items = setJson(null, "id", -1);
	items = setJson(items, "buyersid", parseInt($("#buyer").val()));
	items = setJson(items, "saleid", parseInt($("#PA").val()));
	items = setJson(items, "labelQrid", -1);
	items = setJson(items, "isEnable", 0);
	items = setJson(items, "alreadyPaid", 0);
	items = setJson(items, "insertTime", "");
	items = setJson(items, "expiryDate", null);
	items = setJson(items, "disused", 0);
	items = setJson(items, "operator", localStorage.getItem("userAccountName"));
	items = setJson(items, "sum", parseInt($("#generateNum").val()));
	jsonData = setJson(jsonData, "item", items, true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("标签生成传值=" + jsonData);
	return jsonData;

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

$(document).ready(function() {
	$(".input-style").datepicker("setValue");
	$(".input-style").val("");
	searchSysInfos();
	$("#btnLablesGenerate").click(function() {
		$("#buyer").val("");
		$("#restNum").val("");
		$("#generateNum").val("");
		funLGApply();
		$("#lablesGenerateModal").modal("show");
	})
	$("#btnSearchLableGenerate").click(function() {
		if(!funGetDayCheckInfo()) {
			return;
		}
		funLGSearch();
	})
	$("#btnGenerate").click(function() {
		var numReg = /^[0-9]*[1-9][0-9]*$/;
		if(parseInt($("#buyer").val()) == -1) {
			windowStart("请选择购买方", false);
			return;
		}
		if($("#generateNum").val()=="") {
			windowStart("请输入生成标签数量", false);
			return;
		}
		if(parseInt($("#generateNum").val()) > parseInt($("#restNum").text())) {
			windowStart("生成标签数量不得大于剩余标签数量", false);
			return;
		}
		if(!numReg.test($("#generateNum").val())) {
			windowStart("输入生成数量格式有误", false);
			return false;
		}
	//	funLGEConfirm();
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
  $("#PA").change(function() {
		funLGApply();
	})
	$("#buyer").change(function() {
		funLGApply();
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
			funLGSearch();
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
			funLGSearch();
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
			funLGSearch();
		})
		//分页操作
})