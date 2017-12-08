var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;

var idOfRepair;
var repairList = [];
// var addRepairList = [];
var theData_length;
var state = 4;

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
	var jsonData = setJson(null, "repairUser", $("#manName").val());
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
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairWorkOrderSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetInfoPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询信息返回值=" + JSON.stringify(msg));
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
				windowStart("当前用户无查询信息权限", false);
			} else {
				windowStart("查询信息失败", false);
			}
		}
	})
}

function createInfos(msg) {
	if (!msg.item || msg.item.length < 1) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无维修信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
	var realData = msg.item;

	var str = "";
	str += "<table class='mainTable table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' style='width:5%' >选择</th>";
	str += "<th class='text-center' style='width:10%' >编号</th>";
	str += "<th class='text-center' style='width:20%'>标签编号</th>";
	str += "<th class='text-center'  >设备名称</th>";
	str += "<th class='text-center' >内容</th>";
	str += "<th class='text-center' >状态</th>";
	str += "<th class='text-center'>报修人</th>";
	str += "<th class='text-center'>分配人</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr class='table-content'>";
		str += "<td class='text-center'><input type='radio' class='repairRadio' name='repairContent' theData='" + JSON.stringify(realData[i]) + "' repairId='"+realData[i]["repairId"]+"' orderState='"+realData[i]["orderState"]+"'/></td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairCode"] + "'>" + realData[i]["repairCode"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["qrCode"] + "'>" + realData[i]["qrCode"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["assetName"] + "'>" + realData[i]["assetName"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairContent"] + "'>" + realData[i]["repairContent"] + "</td>";
		if(realData[i]["orderState"]==0){
			realData[i]["orderState"] = '未处理';
		}
		if(realData[i]["orderState"]==1){
			realData[i]["orderState"] = '维修中';
		}
		if(realData[i]["orderState"]==2){
			realData[i]["orderState"] = '待确认';
		}
		if(realData[i]["orderState"]==3){
			realData[i]["orderState"] = '验收驳回';
		}
		if(realData[i]["orderState"]==4){
			realData[i]["orderState"] = '已验收';
		}
		if(realData[i]["orderState"]==-1){
			realData[i]["orderState"] = '已忽略';
		}
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["orderState"] + "'>" + realData[i]["orderState"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairUser"] + "'>" + realData[i]["repairUser"] + "</td>";
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
// --------------------------------------------------验收信息--------------------------------------------------
//验收信息
function passInfoPara() {
	var jsonData = setJson(null, "repairId", parseInt(idOfRepair));
	jsonData = setJson(jsonData, "orderState", state);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("验收传值=" + jsonData);
	return jsonData;
}

function passInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairWorkOrderSubmitCmd",
		contentType: "application/text,charset=utf-8",
		data: passInfoPara(),
		success: function(msg) {
			console.log("验收返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1){
				funGetInfo();
				windowStart("操作成功", false);
			}else{
				windowStart("操作失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无操作权限", false);
			} else {
				windowStart("操作失败", false);
			}
		}
	})
}


$(document).ready(function() {
	$(".input-style").datepicker("setValue");
	funGetInfo();
	//查询
	$("#btnSearch").click(function() {
		data_page_index = 0;
 		curren_page = 1;
		funGetInfo();
	})
	$("#btnPass").on('click',function(){
		if ($(".repairRadio:checked").attr('orderState')==4||$(".repairRadio:checked").attr('orderState')==-1) {
			windowStart("当前状态不能验收", false);
		}
		else if($(".repairRadio:checked").length>0){
			idOfRepair = $(".repairRadio:checked").attr('repairId');
			state = 4;
			passInfo();
		}else{
			windowStart("请选择", false);
			return;
		}
	})
	$("#btnNoPass").on('click',function(){
		if ($(".repairRadio:checked").attr('orderState')==3||$(".repairRadio:checked").attr('orderState')==4||$(".repairRadio:checked").attr('orderState')==-1) {
			windowStart("当前状态不能验收未通过", false);
		}
		else if($(".repairRadio:checked").length>0){
			idOfRepair = $(".repairRadio:checked").attr('repairId');
			state = 3;
			passInfo();
		}else{
			windowStart("请选择", false);
			return;
		}
	})
	//上一页
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