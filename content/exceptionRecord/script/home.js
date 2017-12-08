var theNum = 0;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
// var funPtSearch = -1;
var typeId = -1;
var assetId = -1;
var month;

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

//类型
function getDeviceTypePara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询设备类型传值=" + jsonData);
	return jsonData;
}

function getDeviceType() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAssetTypeAndInfoRelationListCmd",
		contentType: "application/text,charset=utf-8",
		data: getDeviceTypePara(),
		success: function(msg) {
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询设备类型返回值=" + JSON.stringify(msg));
				createDeviceType(msg);
			} else {
				windowStart("查询类型失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询类型权限", false);
			} else {
				windowStart("查询类型失败", false);
			}
		}
	})
}

function createDeviceType(msg) {
	if (!msg.item || msg.item.length == 0) {
		return;
	}
	var str = "";
	var theData = msg.item;
	for (var i = 0; i < theData.length; i++) {
		str += "<option  theDevice='" + JSON.stringify(theData[i]["assetItem"]) + "' value='" + theData[i]["typeId"] + "'>" + theData[i]["typeName"] + "</option>";
	}
	$("#thePointDeviceType").append(str);
	$("#thePointDeviceType").change(elChange);
}

function elChange() {
	var childData = eval("(" + $("#thePointDeviceType option:selected").attr("theDevice") + ")");
	var str = "<option value=-1>全部</option>";
	if (childData != undefined && childData.length > 0) {
		for (var i = 0; i < childData.length; i++) {
			str += "<option value='" + childData[i]["assetId"] + "'>" + childData[i]["assetName"] + "</option>";
		}
		$("#theDeviceSelect").html(str);
	} else {
		$("#theDeviceSelect").html(str);
	}
}

//点检
function funPtSearchPara() {
	var jsonData = setJson(null, "typeId", parseInt(typeId));
	jsonData = setJson(jsonData, "assetId", parseInt(assetId));
	jsonData = setJson(jsonData, "month", parseInt(month));
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询巡检记录传值=" + jsonData);
	return jsonData;
}

function funPtSearch() {
	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAlarmSourceInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funPtSearchPara(),
		success: function(msg) {
			loadingStop();
			//			windowRemove();
			console.log("查询巡检记录返回值=" + JSON.stringify(msg));
			$("#pageNumId").val("");
			createPtTableInfos(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询巡检记录权限", false);
			} else {
				windowStart("查询巡检记录失败", false);
			}
		}
	})
}

function createPtTableInfos(msg) {
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	if(total_page==0){
		total_page=1;
	}
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");
	if(msg.totalNumber == 0) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无巡检异常记录信息";
		str += "</div>";
		$("#ptcontent").html(str);
		return;
	}

	var titleData = msg.titleItem;
	var realData = msg.checkItem;
	var str = "";
	str += "<table class='mainTable table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' style='width:5%' title='序号'>序号</th>";
	for (var i = 0; i < titleData.length; i++) {
			str+="<th class='text-center'  title="+titleData[i]["nameCn"]+">"+titleData[i]["nameCn"]+"</th>";
	}
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr class='table-content'>";
		str += "<td class='text-center'  title='" + (i + 1) + "'>" + (i + 1) + "</td>";
		for (var j = 0; j < realData[i]["values"].length; j++) {
			str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["values"][j] + "'>" + realData[i]["values"][j] + "</td>";	
		}
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
}
$(document).ready(function() {
	getDeviceType();
	Date.prototype.Format = function (fmt) { 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	var date = new Date().Format("yyyy-MM-dd");
    var mo = parseInt(date.split('-')[1]);
    month = mo;
	$("#selectMouth").val(mo);
	// funPtSearch();
	//点检
	$("#btnSearchDianJian").click(function() {
		if($("#thePointDeviceType").val() == -1){
			windowStart("请选择类型", false);
			return;
		}
		typeId = $("#thePointDeviceType").val();
		assetId = $("#theDeviceSelect").val();
		month = $("#selectMouth").val();
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		$("#pageTotalInfo").val("");
		funPtSearch();
	})

	//点检分页操作
	//上一页
	$("#btnPageBefore").click(function() {
			if (!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
			if (total_page == 0) {
				return;
			}
			// if(parseInt(startDate) > parseInt(endDate)) {

			// 	windowStart("时间范围有误", false);
			// 	return;
			// }

			if (curren_page == 1) {
				windowStart("当前为首页", false);
				return;
			}
			data_page_index -= data_number;
			curren_page -= 1;
			funPtSearch();
		})
		//下一页
	$("#btnPageNext").click(function() {
			if (!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
			if (total_page == 0) {
				return;
			}
			// if(parseInt(startDate) > parseInt(endDate)) {

			// 	windowStart("时间范围有误", false);
			// 	return;
			// }

			if (total_page == curren_page) {
				windowStart("当前为尾页", false);
				return;
			}
			data_page_index += data_number;
			curren_page += 1;
			funPtSearch();
		})
		//跳转页
	$("#btnPageJump").click(function() {
			if (!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
			if (total_page == 0) {
				return;
			}
			// if(parseInt(startDate) > parseInt(endDate)) {

			// 	windowStart("时间范围有误", false);
			// 	return;
			// }
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
			funPtSearch();
		})
		//点检分页操作

})