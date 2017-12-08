var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;

var idOfRepair;
var repairList = [];
// var addRepairList = [];
var theData_length;
var theNum = 0;
var selectType = 0;

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
	jsonData = setJson(jsonData, "queryType", theNum);
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
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairSpecialInfoSearchCmd",
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
		if(theNum == 0){
			str += "提示:<br/>当前条件下无报修信息";	
		}
		if(theNum == 1){
			str += "提示:<br/>当前条件下无维修信息";	
		}
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
	var realData = msg.item;

	var str = "";
	str += "<table class='mainTable table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' style='width:5%' >选择</th>";
	str += "<th class='text-center' style='width:10%' >编号</th>";
	str += "<th class='text-center' >内容</th>";
	str += "<th class='text-center'>报修人</th>";
	str += "<th class='text-center'>分配人</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr class='table-content'>";
		str += "<td class='text-center'><input type='radio' class='repairRadio' name='repairContent' theData='" + JSON.stringify(realData[i]) + "' repairId='"+realData[i]["repairId"]+"' /></td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairCode"] + "'>" + realData[i]["repairCode"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairContent"] + "'>" + realData[i]["repairContent"] + "</td>";
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




// --------------------------------------------------添加信息--------------------------------------------------
//添加信息
function addInfoPara() {
	var jsonData = setJson(null, "repairId", parseInt(idOfRepair));
	jsonData = setJson(jsonData, "userId", repairList.join(','));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加信息传值=" + jsonData);
	return jsonData;
}

function addInfo() {
	var theUrl;
	if(theNum == 0){
		theUrl = 'DevOpsRepairAllocateUserAddCmd';
	}else{
		theUrl = 'DevOpsRepairWorkOrderUserUpdateCmd';
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd="+theUrl,
		contentType: "application/text,charset=utf-8",
		data: addInfoPara(),
		success: function(msg) {
			console.log("分配返回值=" + JSON.stringify(msg));
			repairList = [];
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1){
				funGetInfo();
				windowStart("分配成功", false);
			}else{
				windowStart("分配失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无分配权限", false);
			} else {
				windowStart("分配失败", false);
			}
		}
	})
		$("#addDataModal").modal("hide");
}
// --------------------------------------------------添加信息结束-----------------------------------------------
//---------------------------------------------------获取职位--------------------------------------
function workPara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("获取职位传值=" + jsonData);
	return jsonData;
}

function work() {
	loadingStart("modalTable");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAccountJobSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: workPara(),
		success: function(msg) {
			loadingStop();

			console.log("获取职位返回值=" + JSON.stringify(msg));
			var str='';
			if(msg["jobItem"]){
				for (var i = 0; i < msg["jobItem"].length; i++) {
					str+='<option value="'+msg["jobItem"][i]["jobId"]+'">'+msg["jobItem"][i]["jobName"]+'</option>';
				}
				$("#workName").append(str);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询人员信息权限", false);
			} else {
				windowStart("查询人员信息失败", false);
			}
		}
	})
}

//---------------------------------------------------获取忽略原因--------------------------------------
function ignorePara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("获取职位传值=" + jsonData);
	return jsonData;
}

function ignoreAjax() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairIgnoreSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: workPara(),
		success: function(msg) {
			console.log("获取忽略原因返回值=" + JSON.stringify(msg));
			var str='';
			if(msg["item"]){
				for (var i = 0; i < msg["item"].length; i++) {
					str+='<option value="'+msg["item"][i]["enumId"]+'">'+msg["item"][i]["enumPara"]+'</option>';
				}
				$("#ignore").append(str);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询忽略原因权限", false);
			} else {
				windowStart("查询忽略原因失败", false);
			}
		}
	})
}
//---------------------------------------------------上传忽略原因--------------------------------------
function addIgnorePara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData, "exeType", theNum);
		jsonData = setJson(jsonData, "repairId", parseInt(idOfRepair));
		jsonData = setJson(jsonData, "ignoreId", parseInt($("#ignore").val()));
	console.log("提交忽略原因传值=" + jsonData);
	return jsonData;
}

function addIgnoreAjax() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairIgnoreExeCmd",
		contentType: "application/text,charset=utf-8",
		data: addIgnorePara(),
		success: function(msg) {
			console.log("提交忽略原因返回值=" + JSON.stringify(msg));
		$("#ignoreDataModal").modal('hide')
			funGetInfo();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无提交忽略原因权限", false);
			} else {
				windowStart("提交忽略原因失败", false);
			}
		}
	})
}
//---------------------------------------------------绘制添加页面的表格--------------------------------------
function addTablePara() {
	var jsonData = setJson(null, "userName", $("#userName").val());
	    jsonData = setJson(jsonData, "positionId", parseInt($("#workName").val()));
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询增加表格信息传值=" + jsonData);
	return jsonData;
}

function addTable() {
	loadingStart("modalTable");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairAllocateUserSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: addTablePara(),
		success: function(msg) {
			loadingStop();
			console.log("查询增加表格信息返回值=" + JSON.stringify(msg));
			addTableCreate(msg);
			// $("#userName").html("");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询人员信息权限", false);
			} else {
				windowStart("查询人员信息失败", false);
			}
		}
	})
}

function addTableCreate(msg) {
	if (!msg.userItem) {
		var str = "";
		str += "<div style='text-align:center;font-size:20px;font-weight:bold;padding-top:180px;'>当前条件下无人员信息</div>";
		$("#modalTable").html(str);
		return;
	}
	var realData = msg.userItem;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='margin-top:10px;'><thead>";
	str += "<th class='' style='width:6%'><input type='checkbox' class='all-checkbox'/ >全选</th>";
	str += "<th class='text-center td-width'>用户名称</th>";
	str += "<th class='text-center td-width'>联系方式</th>";
	str += "<th class='text-center td-width'>角色名称</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr>";
		str += "<td class='' style='width:6%'><input theId='" + realData[i]["userId"] + "' type='checkbox' class='each-checkbox'/ ></td>";
		str += "<td class='text-center' style='width:3%' title='" + realData[i]["userName"] + "'>" + realData[i]["userName"] + "</td>";
		str += "<td class='text-center td-width' title='" + realData[i]["telNumber"] + "'>" + realData[i]["telNumber"] + "</td>";
		str += "<td class='text-center td-width' title='" + realData[i]["viewRole"] + "'>" + realData[i]["viewRole"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#modalTable").html(str);
	console.log(repairList);
	theData_length = repairList.length;
	if(theData_length == realData.length){
		$(".all-checkbox").prop("checked", true);
	}
	for (var i = 0; i < repairList.length; i++) {
		for (var j = 0; j < $(".each-checkbox").length; j++) {
			if (repairList[i] == $(".each-checkbox").eq(j).attr("theId")) {
				$(".each-checkbox").eq(j).prop("checked", true);
			}
		}
	}
	$(".all-checkbox").change(function() {
		if ($(this).prop("checked")) {
			theData_length = realData.length;
			$(".each-checkbox").prop("checked", true);
			for (var i = 0; i < $(".each-checkbox").length; i++) {
				if (((repairList.indexOf(parseInt($(".each-checkbox").eq(i).attr('theId')))) == -1)) {
					repairList.push(parseInt($(".each-checkbox").eq(i).attr('theId')));
				}
			}
			console.log(repairList);
		} else {
			theData_length = 0;
			$(".each-checkbox").prop("checked", false);
			for (var i = 0; i < $(".each-checkbox").length; i++) {
				repairList.pop();
			}
			console.log(repairList);
		}
	})
	$(".each-checkbox").change(function() {
		if ($(this).prop("checked")) {
			for (var i = 0; i < $(".each-checkbox").length; i++) {
				if (((repairList.indexOf(parseInt($(this).attr('theId')))) == -1)) {
					repairList.push(parseInt($(this).attr('theId')));
				}
			}
			console.log(repairList);
			theData_length++;
			console.log(theData_length);
			console.log(realData.length);

			if (theData_length == realData.length) {
				$(".all-checkbox").prop("checked", true);
			} else {
				$(".all-checkbox").prop("checked", false);
			}

		} else {
			theData_length--;
			var index = repairList.indexOf(parseInt($(this).attr("theId")));
			console.log(parseInt($(this).attr("theId")));
			console.log(repairList);
			console.log(index);
			if (!(index == -1)) {
				repairList.splice(index, 1);
				console.log(repairList);
			}
			// if (theData_length == realData.length) {
			// 	$(".all-checkbox").prop("checked", true);
			// } else {
				$(".all-checkbox").prop("checked", false);
			// }

		}
	})
}
// -----------------------------------------------------增加表格结束---------------------------------------

$(document).ready(function() {
	$('#addDataModal').on('hidden.bs.modal', function () {
  		$("#workName").val('');
  		$("#userName").val('');
  		repairList = [];
	})
	$(".input-style").datepicker("setValue");
	ignoreAjax();
	funGetInfo();
	//查询
	$("#btnSearch").click(function() {
		data_page_index = 0;
 		curren_page = 1;
		funGetInfo();
	})
	$("#btnIgnore").click(function() {
		if($(".repairRadio:checked").length>0){
		idOfRepair = $(".repairRadio:checked").attr('repairId');
		$("#ignoreDataModal").modal('show');
	}else{
		windowStart("请选择维修项", false);
		return;
	}
	})
	$("#btnIgnoreOK").click(function() {
		addIgnoreAjax();
		
	})
	work();

$(".li-table-change").on('mouseover',function(){
	var theLeft = parseInt($(this).attr("thenum")) * 120 + "px";
		$(".border-style").animate({
			"left": theLeft
		}, 100);
})
$(".li-table-change").click(function() {
		// if($(this).attr("thenum")==1){
		// 	$("#btnAddInfos").attr("disabled",true);
		// }else{
		// 	$("#btnAddInfos").attr("disabled",false);
		// }
		theNum = parseInt($(this).attr("thenum"));
		var theLeft = theNum * 120 + "px";
		$(".border-style").css({
			"left": theLeft
		});
		data_page_index = 0;
		curren_page = 1;
		funGetInfo();
		$("#pageNumId").val("");
	})
	$(".li-table-change").mouseout(function() {
			var theLeft = theNum * 120 + "px";
			$(".border-style").animate({
				"left": theLeft
			}, 100);
		})
	$("#btnAddInfos").on('click',function(){
	if($(".repairRadio:checked").length>0){
		idOfRepair = $(".repairRadio:checked").attr('repairId');
		var data = eval("(" + $(".repairRadio:checked").attr("theData") + ")");
		if(data["allocateUser"]){
			for (var i = 0; i < data["allocateUser"].length; i++) {
				repairList.push(data["allocateUser"][i]["userId"]);
			}	
		}
		$("#addDataModal").modal('show');
		addTable();
		$("#modalTable").scrollTop(0);
	}else{
		windowStart("请选择维修项", false);
		return;
	}
})
$("#btnAddMadeInfo").on('click',function(){
	if(repairList.length==0){
		windowStart("请分配人员", false);
		return;
	}
	addInfo();
})
$("#btnModalSearch").on('click',function(){
	addTable();
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