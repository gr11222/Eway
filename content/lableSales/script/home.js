//提交1
//驳回2
//审核3
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
var status = -1;
var editData = {};
var submitData = {};
var deleteData = {};
var ResubData = {};

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
	//购买方
	if(msg.item != undefined && msg.item.length > 0) {
		var str = "<option value='-1'>请选择PA</option>";
		$("#selectBuyer").html(str);
	}
	//购买方
	if(msg.item != undefined && msg.item.length > 0) {
		var theData = msg.item;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {

			if(i == 0) {
				str += "<option value='" + theData[i]["buyersid"] + "'>" + theData[i]["buyers"] + "</option>";
			} else {
				for(var m = 0; m < i; m++) {
					if(theData[i]["buyersid"] != theData[m]["buyersid"]) {
						str += "<option value='" + theData[i]["buyersid"] + "'>" + theData[i]["buyers"] + "</option>";
						break;
					}
				}

			}

		}
		$("#buyer").html(str);
		$("#editBuyer").html(str);
	}
}

//---------------------------------------------查询----------------------------------------
function funLSSearch() {
	$("#dataContent").html("");
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSaleCompanyTagSearchByPACmd",
		contentType: "application/text,charset=utf-8",
		data: lableSalesSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				$("#pageNumId").val("");
				console.log(JSON.stringify(msg));
				createlableSalesTableInfos(msg);
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

function lableSalesSearchPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	var queryItem = setJson(null, "saleid", parseInt($("#selectPA").val()));
	queryItem = setJson(queryItem, "buyersid", parseInt($("#selectBuyer").val()));
	queryItem = setJson(queryItem, "orderCode", "");
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
	console.log("标签销售查询传值=" + jsonData);
	return jsonData;

}

function createlableSalesTableInfos(msg) {
	total = msg.totalNumber;
	$("#total").text(total);
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("");
	if(!msg.item || msg.item.length < 1) {
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无标签销售信息";
		str += "</div>";
		$("#dataContent").html(str);
		return;
	}
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");
	$("#dataContent").html("");
	realData = msg.item;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	//	str += "<th class='' ><div class='checkbox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>PA人员</div></th>";
	str += "<th class='text-center'><div class='checkbox'>购买方</div></th>";
	str += "<th class='text-center'><div class='checkbox'>标签总数</div></th>";
	str += "<th class='text-center'><div class='checkbox'>创建时间</div></th>";
	str += "<th class='text-center'><div class='checkbox'>经办人</div></th>";
	str += "<th class='text-center'><div class='checkbox'>申请状态</div></th>";
	str += "<th class='text-center'><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		str += "<tr  style='cursor:default'>";
		//       str += "<td class='' style='width:6%'><input type='checkbox'  class='repair-checkbox' theId='"+realData[i]["id"]+"'></td>";
		str += "<td class='text-center' style='width:10%'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["sale"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["buyers"] + "</td>"
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["tagCount"] + "</td>";
		str += "<td class='text-center' style='width:20%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["insertTime"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["operator"] + "</td>";
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
		//   str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["status"]+"</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>";
		if(realData[i]["status"] == 0 || realData[i]["status"] == 2) {
			//		草稿或已驳回:0,2
			str += "<span>";
			str += "<a href='javascript:void(0)' class='edit-lablesales' theData='" + JSON.stringify(realData[i]) + "'><img src='../img/edit.png'></a>";
			str += "</span>";
			str += "<span style='padding-left:10px'>";
			str += "<a href='javascript:void(0)' theId='" + realData[i]["id"] + "' class='deleteUser' theData='" + JSON.stringify(realData[i]) + "'><img src='../img/dele.png'></a>";
		} else if(realData[i]["status"] == 3) {
			//		已审核:3
			str += "<span>";
			str += "<a href='javascript:void(0)' class='resub-class' theData='" + JSON.stringify(realData[i]) + "'><img src='../img/re.png'></a>";
			str += "</span>";
		}
		str += "</td>"
		str += "</tr>";
	}
	str += "</tbody><table>";

	$("#dataContent").html(str);

	$(".edit-lablesales").click(function() {
		var theData = eval("(" + $(this).attr("theData") + ")");
		editData = eval("(" + $(this).attr("theData") + ")");
		$("#editApplyMan").text(localStorage.getItem("userAccountName"));
		$("#editBuyer").val(theData.buyersid);
		$("#editApplyNum").val(theData.tagCount);
		$("#editNote").val(theData.note);
		$("#editLablesModal").modal("show");
	})

	$(".deleteUser").click(function() {
		deleteData = eval("(" + $(this).attr("theData") + ")");
		console.log(deleteData);
		if(!confirm("是否确认删除?")) {
			return;
		}
		funLSDelete();
	})

	$(".resub-class").click(function() {
		ResubData = eval("(" + $(this).attr("theData") + ")");
		console.log(ResubData);
		$("#reSubApplyMan").text(localStorage.getItem("userAccountName"));
		$("#reSubBuyer").text(ResubData.buyers);
		$("#reSubApplyNum").val(ResubData.tagCount);
		$("#reSubNote").val(ResubData.note);
		$("#reSubLablesModal").modal("show");
	})
}

//--------------------------------------------申请确定-------------------------------------
function funLSApply() {
	$.ajax({
		type: "post",
		dataType: 'json',
		//DevOpsSaleCompanyTagAddDraftCmd
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSaleCompanyTagAddDraftCmd",
		contentType: "application/text,charset=utf-8",
		data: lableSalesApplyPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				if(key == "确定") {
					$("#lablesApplyModal").modal("hide");
					windowStart("申请标签成功", true);
				} else {
					$("#lablesApplyModal").modal("hide");
					windowStart("保存草稿成功", true);
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#lablesApplyModal").modal("hide");
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无申请标签权限", false);
			} else {
				windowStart("申请标签失败", false);
			}
			console.log("fail");
		}
	});
}

function lableSalesApplyPara() {
	if(key == "确定") {
		//		var jsonData = setJson(null,"requestCommand","");
		//		jsonData = setJson(jsonData,"responseCommand","");
		var jsonData = setJson(null, "resp", {});
		var items = setJson(null, "status", 1);
		items = setJson(items, "buyers", $("#buyer").find("option:selected").text());
		items = setJson(items, "tagCount", parseInt($("#applyNum").val()));
		items = setJson(items, "note", $("#note").val());
		items = setJson(items, "orderCode", "");
		items = setJson(items, "id", -1);
		items = setJson(items, "buyersid", parseInt($("#buyer").val()));
		items = setJson(items, "saleid", -1);
		items = setJson(items, "sale", localStorage.getItem("userAccountName"));
		items = setJson(items, "insertTime", "");
		items = setJson(items, "operator", "");
		items = setJson(items, "imgPath", "");
		jsonData = setJson(jsonData, "item", items, true);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData, "totalNumber", total);
	}
	if(key == "草稿") {
		var jsonData = setJson(null, "resp", {});
		var items = setJson(null, "status", 0);
		items = setJson(items, "buyers", $("#buyer").find("option:selected").text());
		items = setJson(items, "tagCount", parseInt($("#applyNum").val()));
		items = setJson(items, "note", $("#note").val());
		items = setJson(items, "orderCode", "");
		items = setJson(items, "id", -1);
		items = setJson(items, "buyersid", parseInt($("#buyer").val()));
		items = setJson(items, "saleid", -1);
		items = setJson(items, "sale", localStorage.getItem("userAccountName"));
		items = setJson(items, "insertTime", "");
		items = setJson(items, "operator", "");
		items = setJson(items, "imgPath", "");
		jsonData = setJson(jsonData, "item", items, true);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData, "totalNumber", total);
	}
	console.log("标签申请或保存草稿传值=" + jsonData);
	return jsonData;

}

//-------------------------------------------修改-------------------------------------------
function funLSEdit() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSaleCompanyTagUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: lableSalesEditPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				if(key == "确定") {
					$("#editLablesModal").modal("hide");
					windowStart("修改标签成功", true);
				} else {
					$("#editLablesModal").modal("hide");
					windowStart("保存草稿成功", true);
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#editLablesModal").modal("hide");
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改标签权限", false);
			} else {
				windowStart("修改标签失败", false);
			}
			console.log("fail");
		}
	});
}

function lableSalesEditPara() {
	if(key == "确定") {
		var jsonData = setJson(null, "resp", {});
		var items = setJson(null, "status", 1);
		items = setJson(items, "buyers", $("#editBuyer").find("option:selected").text());
		items = setJson(items, "tagCount", parseInt($("#editApplyNum").val()));
		items = setJson(items, "note", $("#editNote").val());
		items = setJson(items, "orderCode", "");
		items = setJson(items, "id", editData.id);
		items = setJson(items, "buyersid", editData.buyersid);
		items = setJson(items, "saleid", editData.saleid);
		items = setJson(items, "sale", localStorage.getItem("userAccountName"));
		items = setJson(items, "insertTime", editData.insertTime);
		items = setJson(items, "operator", editData.operator);
		items = setJson(items, "imgPath", editData.imgPath);
		jsonData = setJson(jsonData, "item", items, true);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData, "totalNumber", total);
	}
	if(key == "草稿") {
		var jsonData = setJson(null, "resp", {});
		var items = setJson(null, "status", 0);
		items = setJson(items, "buyers", $("#editBuyer").find("option:selected").text());
		items = setJson(items, "tagCount", parseInt($("#editApplyNum").val()));
		items = setJson(items, "note", $("#editNote").val());
		items = setJson(items, "orderCode", "");
		items = setJson(items, "id", editData.id);
		items = setJson(items, "buyersid", editData.buyersid);
		items = setJson(items, "saleid", editData.saleid);
		items = setJson(items, "sale", localStorage.getItem("userAccountName"));
		items = setJson(items, "insertTime", editData.insertTime);
		items = setJson(items, "operator", editData.operator);
		items = setJson(items, "imgPath", editData.imgPath);
		jsonData = setJson(jsonData, "item", items, true);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData, "totalNumber", total);
	}
	console.log("标签修改或保存草稿传值=" + jsonData);
	return jsonData;

}

//------------------------------------------删除----------------------------------------------

function funLSDelete() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSaleCompanyTagDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: lableSalesDeletePara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				windowStart("删除成功", true);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除权限", false);
			} else {
				windowStart("删除失败", false);
			}
			console.log("fail");
		}
	});
}

function lableSalesDeletePara() {
	var jsonData = setJson(null, "resp", {});
	var items = setJson(null, "status", 0);
	items = setJson(items, "buyers", deleteData.buyer);
	items = setJson(items, "tagCount", deleteData.tagCount);
	items = setJson(items, "note", deleteData.note);
	items = setJson(items, "orderCode", "");
	items = setJson(items, "id", deleteData.id);
	items = setJson(items, "buyersid", deleteData.buyersid);
	items = setJson(items, "saleid", deleteData.saleid);
	items = setJson(items, "sale", deleteData.sale);
	items = setJson(items, "insertTime", deleteData.insertTime);
	items = setJson(items, "operator", deleteData.operator);
	items = setJson(items, "imgPath", deleteData.imgPath);
	jsonData = setJson(jsonData, "item", items, true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "totalNumber", total);
	console.log("删除传值=" + jsonData);
	return jsonData;
}

//------------------------------------------再次申请----------------------------------------------
function funLSReApply() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsSaleCompanyTagAddDraftCmd",
		contentType: "application/text,charset=utf-8",
		data: lableSalesReApplyPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				if(key == "确定") {
					$("#reSubLablesModal").modal("hide");
					windowStart("重新申请标签成功", true);
				} else {
					$("#reSubLablesModal").modal("hide");
					windowStart("重新保存草稿成功", true);
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#reSubLablesModal").modal("hide");
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无重新申请标签权限", false);
			} else {
				windowStart("重新申请标签失败", false);
			}
			console.log("fail");
		}
	});
}

function lableSalesReApplyPara() {
	if(key == "确定") {
		//		var jsonData = setJson(null,"requestCommand","");
		//		jsonData = setJson(jsonData,"responseCommand","");
		var jsonData = setJson(null, "resp", {});
		var items = setJson(null, "status", 1);
		items = setJson(items, "buyers", ResubData.buyers);
		items = setJson(items, "tagCount", $("#reSubApplyNum").val());
		items = setJson(items, "note", $("#reSubNote").val());
		items = setJson(items, "orderCode", ResubData.orderCode);
		items = setJson(items, "id", ResubData.id);
		items = setJson(items, "buyersid", ResubData.buyersid);
		items = setJson(items, "saleid", ResubData.saleid);
		items = setJson(items, "sale", localStorage.getItem("userAccountName"));
		items = setJson(items, "insertTime", ResubData.insertTime);
		items = setJson(items, "operator", ResubData.operator);
		items = setJson(items, "imgPath", ResubData.imgPath);
		jsonData = setJson(jsonData, "item", items, true);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData, "totalNumber", total);
	}
	if(key == "草稿") {
		var jsonData = setJson(null, "resp", {});
		var items = setJson(null, "status", 0);
		items = setJson(items, "buyers", ResubData.buyers);
		items = setJson(items, "tagCount", $("#reSubApplyNum").val());
		items = setJson(items, "note", $("#reSubNote").val());
		items = setJson(items, "orderCode", ResubData.orderCode);
		items = setJson(items, "id", ResubData.id);
		items = setJson(items, "buyersid", ResubData.buyersid);
		items = setJson(items, "saleid", ResubData.saleid);
		items = setJson(items, "sale", localStorage.getItem("userAccountName"));
		items = setJson(items, "insertTime", ResubData.insertTime);
		items = setJson(items, "operator", ResubData.operator);
		items = setJson(items, "imgPath", ResubData.imgPath);
		jsonData = setJson(jsonData, "item", items, true);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData, "totalNumber", total);
	}
	console.log("标签重新申请或重新保存草稿传值=" + jsonData);
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
	if(parseInt($("#applyNum").val())>50000) {
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
	if(parseInt($("#editApplyNum").val())>50000) {
		windowStart("输入申请数量太多了，请重新填写", false);
		return false;
	}
	return true;
}
$(document).ready(function() {
	$(".input-style").datepicker("setValue");
	$(".input-style").val("");
	searchSysInfos();
	$("#btnLablesApply").click(function() {
		$("#applyMan").text(localStorage.getItem("userAccountName"));
		$("#buyer").val("");
		$("#applyNum").val("");
		$("#note").val("");
		$("#lablesApplyModal").modal("show");
	})
	$("#btnSearchLableSales").click(function() {
		if(!funGetDayCheckInfo()) {
			return;
		}
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		funLSSearch();
	})
	$("#btnApplyBtn").click(function() {
		if(!funCheck()) {
			return;
		}
		key = "确定";
	   funLSApply();
	})
	$("#btnSaveBtn").click(function() {
		if(!funCheck()) {
			return;
		}
		key = "草稿"
		funLSApply();
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
		funLSSearch();
	})
	$("#btnEditApplyBtn").click(function() {
		if(!funEditCheck()) {
			return;
		}
		key = "确定";
		funLSEdit();
	})
	$("#btnEditSaveBtn").click(function() {
		if(!funEditCheck()) {
			return;
		}
		key = "草稿"
		funLSEdit();
	})
	$("#btnReSubApplyBtn").click(function() {
		if(!funEditCheck()) {
			return;
		}
		key = "确定";
		funLSReApply();
	})
	$("#btnReSubSaveBtn").click(function() {
		if(!funEditCheck()) {
			return;
		}
		key = "草稿"
		funLSReApply();
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
			funLSSearch();
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
			funLSSearch();
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
			funLSSearch();
		})
		//分页操作

})