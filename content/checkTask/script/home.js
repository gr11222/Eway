
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var is_start_auto = 0;
var repair_length = 0;
var edit_id = -1;
var meetingType;
var person;
var theData_length;
var total = -1;

var data_page_index2 = 0;
var data_number2 = 17;
var curren_page2 = 1;
var total_page2 = 0;

var data_page_index3 = 0;
var data_number3 = 17;
var curren_page3 = 1;
var total_page3 = 0;

var taskNamePara; //任务名称
var taskType; //任务周期类型
var cyclen;
var cyclem;
var cycles;
var taskStart; //任务描述
var taskStartDay; //任务开始日期
var taskStartEnd; //任务结束日期
var cycleArr = []; //执行时间数组
// var taskRoad; //巡检路线
var taskMan = []; //任务执行人

var addOrEdit = 0; //判断是修改还是新建 0是新建 1是修改

// function EscapeString(str) {
//     return escape(str).replace(/\%/g,"\$");
// }
var flag1 = 0; //上一步是否点击过
var flag2 = 0;
var flag3 = 0;
var flag4 = 0;

var task_name; //搜索项 任务名称
var start_time = "";
var end_time = "";

var roadTask;//巡检路线

var roadSearch='';//巡检路线搜索
var checkMan='';//执行人搜索
var checkManId=-1;//执行人搜索Id

var idOfTask;//修改任务ID

var timeList = [];//修改开始时间

var theDataLen = 0;//多选的总数
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
//-----------------------------------------获取周期类型----------------------------------------
function funGetTimeTypePara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	return jsonData;
	console.log("获取周期类型传值=" + jsonData);
}

function funGetTimeType() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTaskCycleByBasicTaskCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetTimeTypePara(),
		success: function(msg) {
			console.log("获取周期类型返回值=" + JSON.stringify(msg));
			createTableInfos(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			windowStart("获取周期类型失败", false);
		}
	})
}

function createTableInfos(msg) {
	var mto = msg.item; //周期信息
	var str = '';
	if (mto) {
		for (var i = 0; i < mto.length; i++) {
			str += "<option value='" + mto[i].cycleId + "' cycleN= '" + mto[i].propertyN + "' cycleM= '" + mto[i].propertyM + "'>" + mto[i].cycleName + "</option>";
		}
		$("#checkCycle").append(str);
	}
}

//-----------------------------------------获取执行人角色列表----------------------------------------
function funGetRolePara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	return jsonData;
	console.log("获取周期类型传值=" + jsonData);
}

function funGetRoleType() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsViewRoleByBasicTaskCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetRolePara(),
		success: function(msg) {
			console.log("获取执行人角色列表返回值=" + JSON.stringify(msg));
			var roleOp = msg.item;
			var str = '';
			if (roleOp) {
				for (var i = 0; i < roleOp.length; i++) {
					str += "<option value='" + roleOp[i].viewRoleId + "'>" + roleOp[i].viewRoleName + "</option>";
				}
				$("#roleName").append(str);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			windowStart("获取执行人角色列表失败", false);
		}
	})
}

function createTableInfos(msg) {
	var mto = msg.item; //周期信息
	var str = '';
	if (mto) {
		for (var i = 0; i < mto.length; i++) {
			str += "<option value='" + mto[i].cycleId + "' cycleN= '" + mto[i].propertyN + "' cycleM= '" + mto[i].propertyM + "'>" + mto[i].cycleName + "</option>";
		}
		$("#checkCycle").append(str);
	}
}

//-------------------------------------------查询信息--------------------------------------------------------
function funGetInfoPara() {
	var jsonData = setJson(null, "taskName", task_name);
	jsonData = setJson(jsonData, "startTime", start_time);
	jsonData = setJson(jsonData, "endTime", end_time);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	console.log("查询页面信息传值=" + jsonData);
	return jsonData;
}

function funGetInfo() {

	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBasicTaskSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetInfoPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询信息返回值=" + JSON.stringify(msg));
			total = msg.totalNumber;
			var totalPage = Math.ceil(parseInt(total) / data_number);
			total_page = totalPage;
			if (totalPage === 0) {
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
		str += "提示:<br/>当前条件下无任务信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
	var realData = msg.item;
	var str = "";
	str += "<table class='mainTable table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' style='width:5%' >序号</th>";
	str += "<th class='text-center' >任务名称</th>";
	str += "<th class='text-center'>首次任务开始时间</th>";
	str += "<th class='text-center'>巡检路线</th>";
	str += "<th class='text-center' style='width:15%'>执行人</th>";
	str += "<th class='text-center'>操作</th>";

	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr >";
		str += "<td class='text-center'  title='" + (i + 1) + "'>" + (i + 1) + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["taskName"] + "'>" + realData[i]["taskName"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["startTime"] + "'>" + realData[i]["startTime"] + "</td>";
		str += "<td class='text-center taskNode'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["routeName"] + "'><a class='roleClick' href='javascript:void(0)'  data='" + JSON.stringify(realData[i]["routeItem"]) + "'>" + realData[i]["routeName"] + "</a></td>";
		if (realData[i]["userItem"]) {
			var participantName = [];
			for (var j = 0; j < realData[i]["userItem"].length; j++) {
				participantName.push(realData[i]["userItem"][j].userName);
			}
			str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + participantName.join(",") + "'>" + participantName.join(",") + "</td>";
		} else {
			str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title=''></td>";
		}
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;'>";
		str += "<span><a theData='" + JSON.stringify(realData[i]) + "' class='edit-class' href='javascript:void(0)'><img src='../img/edit.png' /></a><span>";
		str += "<span style='padding-left:10px'><a theId='" + realData[i]["taskId"] + "' class='delete-class' href='javascript:void(0)'><img src='../img/dele.png' /></a><span>";
		str += "</td>";
		str += "</tr>";
	}
		str += "</tbody><table>";
		$("#ptcontent").html(str);
		$(".edit-class").click(function(e) {
			flag1 = 0;
			flag2 = 0;
			flag3 = 0;
			flag4 = 0;
			e.stopPropagation();
			addOrEdit = 1;
			$("#cycleDiv").html("");
			$("#addMeetingName").val("");
			$("#checkCycle").val("");
			$("#taskStartTime").val("");
			$("#taskEndTime").val("");
			$("#userName3").val("");
			$("#userName4").val("");
			$("#btnAddMadeInfoText").html("确认修改");
			$("#addDataModal").modal("show");
			var theData = eval("(" + $(this).attr("theData") + ")");
			taskMan = [];
			data_page_index2 = 0;
			curren_page2 = 1;
			data_page_index3 = 0;
			curren_page3 = 1;
			idOfTask = theData["taskId"];
			roadTask = theData["routeId"];
			// cycleArr = [];
			for (var i = 0; i < theData["userItem"].length; i++) {
				taskMan.push(theData["userItem"][i]["userId"]);
			}
			$("#addMeetingName").val(theData.taskName);
			$("#addMeetingContent").val(theData.content);
			editParaAjax(idOfTask);
		})

		//删除
		$(".delete-class").click(function(e) {
			e.stopPropagation()
			if (!confirm("是否确认删除")) {
				return;
			}
			funDeleteMeetingInfo(parseInt($(this).attr("theId")));
		})
		//查看任务路线
		$(".roleClick").click(function() {
			$("#addDataModal5").modal('show');
			var roadData = eval("(" + $(this).attr("data") + ")");
			var str = "";
			str += "<table class='table table-bordered table-striped table-hover table-condensed' style='margin-top:10px;'><thead>";
			str += "<th class='text-center td-width' style='width:6%'>序号</th>";
			str += "<th class='text-center td-width'>设备名称</th>";
			str += "<th class='text-center td-width'>设备编号</th>";
			str += "<th class='text-center td-width'>设备类型</th>";
			str += "<th class='text-center td-width'>所属建筑</th>";
			str += "<th class='text-center td-width'>安装位置</th>";
			str += "</thead><tbody>";
			for (var i = 0; i < roadData.length; i++) {
				str += "<tr>";
				str += "<td class='' style='width:6%;text-align:center'>"+(i+1)+"</td>";
				str += "<td class='text-center' title='" + roadData[i]["assetName"] + "'>" + roadData[i]["assetName"] + "</td>";
				str += "<td class='text-center td-width' title='" + roadData[i]["assetCode"] + "'>" + roadData[i]["assetCode"] + "</td>";
				str += "<td class='text-center td-width' title='" + roadData[i]["assettype"] + "'>" + roadData[i]["assettype"] + "</td>";
				str += "<td class='text-center td-width' title='" + roadData[i]["building"] + "'>" + roadData[i]["building"] + "</td>";
				str += "<td class='text-center td-width' title='" + roadData[i]["position"] + "'>" + roadData[i]["position"] + "</td>";
				str += "</tr>";
			}
			str += "</tbody><table>";
			$("#checkRoad").html(str);
		})
	
}
// --------------------------------------------------查询信息结束---------------------------------------------

//---------------------------------------------------删除任务------------------------------------------------
function funDeleteMeetingInfoPara(id) {
	var jsonData = setJson(null, "taskId", id);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("删除信息传值=" + jsonData);
	return jsonData;
}

function funDeleteMeetingInfo(id) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBasicTaskDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteMeetingInfoPara(id),
		success: function(msg) {
			console.log("删除信息返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("删除任务成功", true);
				funGetInfo();
			}else{
				windowStart(msg.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无删除任务权限", false);
			} else {
				windowStart("删除任务失败", false);
			}
		}
	})
}
//---------------------------------------------------删除任务结束----------------------------------------------

//---------------------------------------------------修改信息--------------------------------------------
//添加信息
function editInfoPara() {
	var jsonData = setJson(null, "taskName", taskNamePara);
	jsonData = setJson(jsonData, "taskId", parseInt(idOfTask));
	jsonData = setJson(jsonData, "cycletypeId", parseInt(cycles));
	jsonData = setJson(jsonData, "propertyN", parseInt(cyclen));
	jsonData = setJson(jsonData, "propertyM", parseInt(cyclem));
	jsonData = setJson(jsonData, "timeList",cycleArr.join(',') ); //时间，多个用,分割的字符串-------------------
	jsonData = setJson(jsonData, "startDate", taskStartDay); 
	jsonData = setJson(jsonData, "endDate", taskEndDay); 
	jsonData = setJson(jsonData, "routeId", parseInt(roadTask)); 
	jsonData = setJson(jsonData, "userIds", taskMan.join(',')); 
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("修改信息传值=" + jsonData);
	return jsonData;
}

function editInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBasicTaskUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: editInfoPara(),
		success: function(msg) {
			console.log("修改信息返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addDataModal4").modal("hide");
				funGetInfo();
				meetingJoinPara = [];
				windowStart("修改任务成功", true);
			} else if (msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("任务名称已存在", false);
				return;
			} else if (msg.responseCommand.toUpperCase().indexOf("NOUPDATE") != -1) {
				windowStart("任务已开始", false);
				return;
			} else {
				windowStart("修改任务失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无修改权限", false);
			} else {
				windowStart("修改信息失败", false);
			}
		}
	})
}
//---------------------------------------------------修改信息结束--------------------------------------------

//添加信息
function addInfoPara() {
	var jsonData = setJson(null, "taskName", taskNamePara);
	jsonData = setJson(jsonData, "cycletypeId", parseInt(cycles));
	jsonData = setJson(jsonData, "propertyN", parseInt(cyclen));
	jsonData = setJson(jsonData, "propertyM", parseInt(cyclem));
	jsonData = setJson(jsonData, "timeList",cycleArr.join(',') ); //时间，多个用,分割的字符串-------------------
	jsonData = setJson(jsonData, "startDate", taskStartDay); 
	jsonData = setJson(jsonData, "endDate", taskEndDay); 
	jsonData = setJson(jsonData, "routeId", parseInt(roadTask)); 
	jsonData = setJson(jsonData, "userIds", taskMan.join(',')); 
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加信息传值=" + jsonData);
	return jsonData;
}

function addInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBasicTaskAddCmd",
		contentType: "application/text,charset=utf-8",
		data: addInfoPara(),
		success: function(msg) {
			console.log("添加信息返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("任务名称已存在", false);
				return;
			}
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addDataModal4").modal("hide");
				funGetInfo();
				meetingJoinPara = [];
				windowStart("添加任务成功", true);
				return;
			}
			else{
				$("#addDataModal4").modal("hide");
				meetingJoinPara = [];
				windowStart("添加任务失败", true);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无添加权限", false);
			} else {
				windowStart("添加信息失败", false);
			}
		}
	})
}
// --------------------------------------------------添加信息结束-----------------------------------------------


//---------------------------------------------------绘制巡检路线的表格--------------------------------------
function addTablePara3() {
	var jsonData = setJson(null, "routeName", roadSearch);
	jsonData = setJson(jsonData, "index", data_page_index2);
	jsonData = setJson(jsonData, "number", data_number2);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询巡检路线传值=" + jsonData);
	return jsonData;
}

function addTable3() {
	loadingStart("modalTable3");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRouteInfoByBasicTaskCmd",
		contentType: "application/text,charset=utf-8",
		data: addTablePara3(),
		success: function(msg) {
			loadingStop();
			console.log("查询巡检路线返回值=" + JSON.stringify(msg));
			var totalPage2 = Math.ceil(parseInt(msg.totalNumber) / data_number);
			total_page2 = totalPage2;
			if (totalPage2 === 0) {
				totalPage2 = 1;
			}
			$("#pageTotalInfo2").html("第 " + curren_page2 + " 页/共 " + totalPage2 + " 页");
			addTableCreate3(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询巡检路线权限", false);
			} else {
				windowStart("查询巡检路线失败", false);
			}
		}
	})
}

function addTableCreate3(msg) {
	if (!msg.item) {
		var str = "";
		str += "<div style='text-align:center;font-size:20px;font-weight:bold;padding-top:180px;'>提示:<br/>当前条件下无巡检路线信息</div>";
		$("#modalTable3").html(str);
		return;
	}
	var realData = msg.item;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='margin-top:10px;'><thead>";
	str += "<th class='' style='width:6%'>选择</th>";
	str += "<th class='text-center td-width'>路线名称</th>";
	str += "<th class='text-center td-width'>完成时间(分钟)</th>";
	str += "<th class='text-center td-width'>备注</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr>";
		str += "<td class='' style='width:6%'><input theId='" + realData[i]["routeId"] + "' type='radio' name='3' class='each-checkbox3'/ ></td>";
		str += "<td class='text-center' title='" + realData[i]["routeName"] + "'>" + realData[i]["routeName"] + "</td>";
		str += "<td class='text-center td-width' title='" + realData[i]["taskTime"] + "'>" + realData[i]["taskTime"] + "</td>";
		str += "<td class='text-center td-width' title='" + realData[i]["note"] + "'>" + realData[i]["note"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#modalTable3").html(str);
	console.log(roadTask);
	for (var j = 0; j < $(".each-checkbox3").length; j++) {
		if (roadTask == $(".each-checkbox3").eq(j).attr("theId")) {
			$(".each-checkbox3").eq(j).prop("checked", true);
		}
	}
	$(".each-checkbox3").change(function() {
		roadTask = $(this).attr('theId');
		console.log(roadTask);
	})
}

//---------------------------------------------------绘制执行人的表格--------------------------------------
function addTablePara4() {
	var jsonData = setJson(null, "userName", checkMan);
	jsonData = setJson(jsonData, "viewRoleId",parseInt(checkManId));
	jsonData = setJson(jsonData, "index", data_page_index3);
	jsonData = setJson(jsonData, "number", data_number3);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询执行人信息传值=" + jsonData);
	return jsonData;
}

function addTable4() {
	loadingStart("modalTable4");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsUserInfoByBasicTaskCmd",
		contentType: "application/text,charset=utf-8",
		data: addTablePara4(),
		success: function(msg) {
			loadingStop();
			console.log("查询执行人信息返回值=" + JSON.stringify(msg));
			if(msg.userItem!=undefined){
				theDataLen = msg.userItem.length;	
			}
			var totalPage3 = Math.ceil(parseInt(msg.totalNumber) / data_number);
			total_page3 = totalPage3;
			if (totalPage3 === 0) {
				totalPage3 = 1;
			}
			$("#pageTotalInfo3").html("第 " + curren_page3 + " 页/共 " + totalPage3 + " 页");
			addTableCreate4(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询执行人信息权限", false);
			} else {
				windowStart("查询执行人信息失败", false);
			}
		}
	})
}

function addTableCreate4(msg) {
	if (!msg.userItem) {
		var str = "";
		str += "<div style='text-align:center;font-size:20px;font-weight:bold;padding-top:180px;'>提示:<br/>当前条件下无执行人信息</div>";
		$("#modalTable4").html(str);
		return;
	}
	var realData = msg.userItem;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='margin-top:10px;'><thead>";
	str += "<th class='' style='width:6%'><input type='checkbox' class='all-checkbox1'/ >全选</th>";
	str += "<th class='text-center td-width'>用户名称</th>";
	str += "<th class='text-center td-width'>角色名称</th>";
	str += "<th class='text-center td-width'>联系方式</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr>";
		str += "<td class='' style='width:6%'><input theId='" + realData[i]["userId"] + "' type='checkbox' class='each-checkbox1'/ ></td>";
		str += "<td class='text-center' style='width:3%' title='" + realData[i]["userName"] + "'>" + realData[i]["userName"] + "</td>";
		str += "<td class='text-center td-width' title='" + realData[i]["viewRoleName"] + "'>" + realData[i]["viewRoleName"] + "</td>";
		str += "<td class='text-center td-width' title='" + realData[i]["telNumber"] + "'>" + realData[i]["telNumber"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#modalTable4").html(str);
	console.log(taskMan);
	for (var i = 0; i < taskMan.length; i++) {
		for (var j = 0; j < $(".each-checkbox1").length; j++) {
			if (taskMan[i] == $(".each-checkbox1").eq(j).attr("theId")) {
				$(".each-checkbox1").eq(j).prop("checked", true);
			}
		}
	}
	if($(".each-checkbox1:checked").length == theDataLen){
		$(".all-checkbox1").prop("checked", true);
	}
	$(".all-checkbox1").change(function() {
		if ($(this).prop("checked")) {
			$(".each-checkbox1").prop("checked", true);
			for (var i = 0; i < $(".each-checkbox1").length; i++) {
				if (((taskMan.indexOf(parseInt($(".each-checkbox1").eq(i).attr('theId')))) == -1)) {
					taskMan.push(parseInt($(".each-checkbox1").eq(i).attr('theId')));
				}
			}
			console.log(taskMan);
		} else {
			theData_length = 0;
			$(".each-checkbox1").prop("checked", false);
			for (var i = 0; i < $(".each-checkbox1").length; i++) {
				if (!((taskMan.indexOf(parseInt($(".each-checkbox1").eq(i).attr('theId')))) == -1)) {
					taskMan.splice((taskMan.indexOf(parseInt($(".each-checkbox1").eq(i).attr('theId')))),1);
				}
			}
			console.log(taskMan);
		}
	})
	$(".each-checkbox1").change(function() {
		if ($(this).prop("checked")) {
			taskMan.push(parseInt($(this).attr('theId')));
			console.log(taskMan);
			if($(".each-checkbox1:checked").length == theDataLen){
				$(".all-checkbox1").prop("checked", true);
			}
		} else {
			var index = taskMan.indexOf(parseInt($(this).attr("theId")));
			console.log(taskMan);
			if (!(index == -1)) {
				taskMan.splice(index, 1);
				console.log(taskMan);
			}
				$(".all-checkbox1").prop("checked", false);
		}
	})
}

//修改点击获取历史信息
function editPara(id) {
	var jsonData = setJson(null, "taskId", id);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询修改信息传值=" + jsonData);
	return jsonData;
}

function editParaAjax(id) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBasicTaskPortionSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: editPara(id),
		success: function(msg) {
			console.log("查询修改信息返回值=" + JSON.stringify(msg));
			var theData = msg.item;
			$("#checkCycle").val(theData.cycletypeId);
			var str = '';
			if ($("#checkCycle option:selected").attr('cycleN')==0) {
				str+='<div class="clearfix"><label for="cycleN" class="col-sm-3 control-label" style="font-size: 12px;">*请填写N的数值(只能填数字):</label><div class="col-sm-9"><input class="form-control" id="cycleN"></div></div>';
			}
			if ($("#checkCycle option:selected").attr('cycleM')==0) {
				str+='<div class="clearfix"><label for="cycleM" class="col-sm-3 control-label" style="font-size: 12px;">*请填写M的数值(只能填数字):</label><div class="col-sm-9"><input class="form-control" id="cycleM"></div></div>';
			}
			$("#cycleDiv").html(str);
			if ($("#checkCycle option:selected").attr('cycleN')==0) {
				$("#cycleN").val(theData.propertyN);
			}
			if ($("#checkCycle option:selected").attr('cycleM')==0) {
				$("#cycleM").val(theData.propertyM);
			}
			timeList = theData.timeList.split(',');
			
			$("#taskStartTime").val(theData.startDate);
			$("#taskEndTime").val(theData.endDate);

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询修改信息权限", false);
			} else {
				windowStart("查询修改信息失败", false);
			}
		}
	})
}

//时间校验
function checkTime(a, b) {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	if (a.val().length == 0 && b.val().length == 0) {
		windowStart("时间范围有误,请填写时间范围", false);
		return false;
	}
	if (a.val().length > 0) {
		if (!timeReg.test(a.val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if (b.val().length > 0) {
		if (!timeReg.test(b.val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if (a.val().length == 0) {
		if (b.val().length > 0) {
			windowStart("请输入开始时间", false);
			return false;
		}
	}
	if (b.val().length == 0) {
		if (a.val().length > 0) {
			windowStart("请输入结束时间", false);
			return false;
		}
	}
	if (a.val().length > 0 && b.val().length > 0) {
		var startTime = a.val().split("-");
		var endTime = b.val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]) - 1, parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]) - 1, parseInt(endTime[2]));
		if (parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("开始时间不能大于结束时间", false);
			return false;
		}
	}
	return true;
}
// ------------------------------------------------------
$(document).ready(function() {
	$('#addDataModal2').on('hidden.bs.modal', function() {
		$("#userName").val('');
	})
	$('#addDataModal3').on('hidden.bs.modal', function() {
		$("#userName2").val('');
	})
	$(".input-style").datepicker("setValue");
	task_name = ''; //搜索项 任务名称
	start_time = $("#startTime").val();
	end_time = $("#endTime").val();
	funGetTimeType();
	funGetRoleType();
	funGetInfo();

	//新建
	$("#btnAddInfos").click(function() {
			flag1 = 0;
			flag2 = 0;
			flag3 = 0;
			flag4 = 0;
			addOrEdit = 0;
			$("#btnAddMadeInfoText").html("确认添加");
			$("#cycleDiv").html("");
			$("#addMeetingName").val("");
			$("#checkCycle").val("");
			$("#taskStartTime").val("");
			$("#taskEndTime").val("");
			$("#userName3").val("");
			$("#userName4").val("");
			$("#addDataModal").modal("show");
			roadTask = undefined;
			cycleArr = [];
			taskMan = [];
			timeList = [];
			data_page_index2 = 0;
			curren_page2 = 1;
			data_page_index3 = 0;
			curren_page3 = 1;
			var str = '';
			if ($("#checkCycle option:selected").attr('cycleN')==0) {
				str+='<div class="clearfix"><label for="cycleN" class="col-sm-3 control-label" style="font-size: 12px;">*请填写N的数值(只能填数字):</label><div class="col-sm-9"><input class="form-control" id="cycleN"></div></div>';
			}
			if ($("#checkCycle option:selected").attr('cycleM')==0) {
				str+='<div class="clearfix"><label for="cycleM" class="col-sm-3 control-label" style="font-size: 12px;">*请填写M的数值(只能填数字):</label><div class="col-sm-9"><input class="form-control" id="cycleM"></div></div>';
			}
			$("#cycleDiv").html(str);
		})

	//change
	$("#checkCycle").on('change',function(){
		// console.log(("#checkCycle option:selected"));
		flag2 = 0;
		timeList = [];
		var str = '';
		if ($("#checkCycle option:selected").attr('cycleN')==0) {
			str+='<div class="clearfix"><label for="cycleN" class="col-sm-3 control-label" style="font-size: 12px;">*请填写N的数值(只能填数字):</label><div class="col-sm-9"><input class="form-control" id="cycleN"></div></div>';
		}
		if ($("#checkCycle option:selected").attr('cycleM')==0) {
			str+='<div class="clearfix"><label for="cycleM" class="col-sm-3 control-label" style="font-size: 12px;">*请填写M的数值(只能填数字):</label><div class="col-sm-9"><input class="form-control" id="cycleM"></div></div>';
		}
		$("#cycleDiv").html(str);
	})
		//下一步
	$("#btnNext").on("click", function() {
		var reg = /^[0-9]+$/;
		if (!$("#addMeetingName").val()) {
			windowStart("请输入任务名称", false);
			return;
		};
		taskNamePara = $("#addMeetingName").val();
		if($("#cycleN").length>0){
			if(!$("#cycleN").val()){
				windowStart("请输入N值", false);
				return;
			}
			if(!reg.test($("#cycleN").val())){
				windowStart("N值为数字", false);
				return;
			}
		}
		if($("#cycleM").length>0){
			if(!$("#cycleM").val()){
				windowStart("请输入M值", false);
				return;
			}
			if(!reg.test($("#cycleM").val())){
				windowStart("M值为数字", false);
				return;
			}
		}
		cycles = $("#checkCycle").val();
		if($("#checkCycle option:selected").attr('cycleN')==0){
			cyclen = $("#cycleN").val();
		}else{
			cyclen = $("#checkCycle option:selected").attr('cycleN');
		}
		if($("#checkCycle option:selected").attr('cycleM')==0){
			cyclem = $("#cycleM").val();
		}else{
			cyclem = $("#checkCycle option:selected").attr('cycleM');
		}
		$("#addDataModal").modal("hide");
		$("#addDataModal2").modal("show");

		if (flag2 == 0) {
			var str = '';
			for (var i = 0; i < cyclem; i++) {
				str+='<div class="clearfix" style="margin-bottom:5px;"><label class="col-sm-3 control-label" style="font-size: 12px;">*请设置第'+(i+1)+'次的任务开始时间:</label><div class="col-sm-9"><input class="form-control inputTime" type="time" ></div></div>';
			}
			$("#setTime").html(str);
			if(timeList.length>0){
				for (var i = 0; i < $(".inputTime").length; i++) {
					$(".inputTime").eq(i).val(timeList[i]);
				}	
			}
			flag2 = 1;
		}
	})

	$("#btnBefore2").on('click', function() {
			$("#addDataModal").modal("show");
			$("#addDataModal2").modal("hide");
		})
		//下一步2
	$("#btnNext2").on("click", function() {
		var cycleArr2 = [];
		for (var i = 0; i < $(".inputTime").length; i++) {
			if(!$(".inputTime").eq(i).val()){
				windowStart("请填写任务开始时间", false);
				return;
			}
		}
		if(!$("#taskStartTime").val()){
			windowStart("请填写任务开始日期", false);
			return;
		}
		if(!$("#taskEndTime").val()){
			windowStart("请填写任务结束日期", false);
			return;
		}
		if (!checkTime($("#taskStartTime"), $("#taskEndTime"))) {
			return;
		};

		for (var i = 0; i < $(".inputTime").length; i++) {
			cycleArr2.push($(".inputTime").eq(i).val());
		}
		cycleArr = cycleArr2;
		taskStartDay = $("#taskStartTime").val() + " 00:00:00";
		taskEndDay = $("#taskEndTime").val() + " 00:00:00";
		$("#addDataModal2").modal("hide");
		$("#addDataModal3").modal("show");
		if (flag3 == 0) {
			flag3 = 1;
			addTable3();
			$("#modalTable3").scrollTop(0)
		}
		console.log(cycleArr)
	})
	$("#btnBefore3").on('click', function() {
			$("#addDataModal2").modal("show");
			$("#addDataModal3").modal("hide");
		})
		//下一步3
	$("#btnNext3").on("click", function() {

		if (!roadTask) {
			windowStart("请选择巡检路线", false);
			return;
		}
		$("#addDataModal3").modal("hide");
		$("#addDataModal4").modal("show");
		if (flag4 == 0) {
			flag4 = 1;
			addTable4();
			$("#modalTable4").scrollTop(0)
		}
	})
	$("#btnBefore4").on('click', function() {
			$("#addDataModal3").modal("show");
			$("#addDataModal4").modal("hide");
		})
		//确认添加
	$("#btnAddMadeInfo").click(function() {
		if (taskMan.length==0) {
			windowStart("请选择任务执行人", false);
			return;
		}
		if (addOrEdit == 0) {
			addInfo();

		} else {
			editInfo();

		}
		// $("#addDataModal4").modal("hide");
		flag1 = 0;
		flag2 = 0;
		flag3 = 0;
		flag4 = 0;
	})

	$("#btnModalSearch3").on("click", function() {
		data_page_index2 = 0;
		curren_page2 = 1;
		roadSearch = $("#userName3").val();
		addTable3();
	})
	$("#btnModalSearch4").on("click", function() {
		data_page_index3 = 0;
		curren_page3 = 1;
		checkMan = $("#userName4").val();
		checkManId = parseInt($("#roleName").val());
		addTable4();
	})
		//添加结束
		//查询
	$("#btnSearch").click(function() {
		if (!checkTime($("#startTime"), $("#endTime"))) {
			return;
		};
		data_page_index = 0;
		curren_page = 1;
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
		task_name = $("#meetingName").val();
		funGetInfo();
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

	//上一页2
	$("#btnPageBefore2").click(function() {
			if (total_page2 == 0) {
				return;
			}

			if (curren_page2 == 1) {
				windowStart("当前为首页", false);
				return;
			}
			data_page_index2 -= data_number2;
			curren_page2 -= 1;
			addTable3();

		})
		//下一页2
	$("#btnPageNext2").click(function() {
			if (total_page2 == 0) {
				return;
			}

			if (total_page2 == curren_page2) {
				windowStart("当前为尾页", false);
				return;
			}
			data_page_index2 += data_number2;
			curren_page2 += 1;
			addTable3();

		})
		//跳转页2
	$("#btnPageJump2").click(function() {
		if (total_page2 == 0) {
			return;
		}

		var numReg = /^[0-9]+$/;
		if (!numReg.test($("#pageNumId2").val())) {
			windowStart("页码输入有误", false);
			return;
		}
		if (parseInt($("#pageNumId2").val()) < 1) {
			windowStart("页码输入有误", false);
			return;
		}
		if (parseInt($("#pageNumId2").val()) > total_page2) {
			windowStart("页码输入有误", false);
			return;
		}
		data_page_index2 = (parseInt($("#pageNumId2").val()) - 1) * data_number2;
		curren_page2 = parseInt($("#pageNumId2").val());
		addTable3();
		$("#pageNumId2").val("");

	})

	//上一页3
	$("#btnPageBefore3").click(function() {
			if (total_page3 == 0) {
				return;
			}

			if (curren_page3 == 1) {
				windowStart("当前为首页", false);
				return;
			}
			data_page_index3 -= data_number3;
			curren_page3 -= 1;
			addTable4();

		})
		//下一页3
	$("#btnPageNext3").click(function() {
			if (total_page3 == 0) {
				return;
			}

			if (total_page3 == curren_page3) {
				windowStart("当前为尾页", false);
				return;
			}
			data_page_index3 += data_number3;
			curren_page3	 += 1;
			addTable4();

		})
		//跳转页3
	$("#btnPageJump3").click(function() {
		if (total_page3 == 0) {
			return;
		}

		var numReg = /^[0-9]+$/;
		if (!numReg.test($("#pageNumId3").val())) {
			windowStart("页码输入有误", false);
			return;
		}
		if (parseInt($("#pageNumId3").val()) < 1) {
			windowStart("页码输入有误", false);
			return;
		}
		if (parseInt($("#pageNumId3").val()) > total_page3) {
			windowStart("页码输入有误", false);
			return;
		}
		data_page_index3 = (parseInt($("#pageNumId3").val()) - 1) * data_number;
		curren_page3 = parseInt($("#pageNumId3").val());
		addTable4();
		$("#pageNumId3").val("");

	})
})