var total = -1;
var data_page_index = 0;
var data_number = 6;
var curren_page = 1;
var total_page = 0;
var status = 1;
var checkedList = [];
var delId;
var rTime = ""; //提醒时间
var todayDate;
var task_length;
var man_length;

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

//*************************************************查询任务**********************************************
function funSearchTaskPara() {
	var jsonData = setJson(null, "agendaDate", $("#queryTime").val());
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询任务传值=" + jsonData);
	return jsonData;
}

function funSearchTask() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTaskAgendaSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funSearchTaskPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				createSetScheduleTableInfos(msg);
			}

		},
		error: function() {
			loadingStop();
			console.log("fail");
		}
	});
}

function createSetScheduleTableInfos(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前日期无任务信息";
		str += "</div>";
		$("#dataContent").html(str);
		return;
	}
	total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");
	var realData = msg.items;
	var str = " ";

	for(var i = 0; i < realData.length; i++) {
		str += '<div class="data-content-list">';
		str += '<div class="list-one">';
		str += '<div class="key-word-style" style="  margin-left: 15%;">';
		str += '<p>任务名称：</p>';
		str += '</div>';
		str += '<div class="list-bottom" style="  margin-left: 15%;margin-top:5px">';
		if(realData[i]["deviceCn"] != undefined || realData[i]["userItem"] != undefined) {
			str += "<a style='cursor: pointer;' class='routeCn' deviceCn='" + JSON.stringify(realData[i]["deviceCn"]) + "' userItem='" + JSON.stringify(realData[i]["userItem"]) + "'>" + realData[i]["routeCn"] + "</a>";
		} else {
			str += '<p>' + realData[i]["routeCn"] + '</p>';
		}
		str += '</div>';
		str += '</div>';
		str += '<div class="list-two" >';
		str += '<div class="key-word-style" style="  margin-left: 10%;">';
		str += '<p>设置开始时间：</p>';
		str += '</div>';
		str += '<div class="list-bottom" style="  margin-left: 10%;">';
		var time = [];
		time = realData[i]["remindTime"].split(" ");
		var times = time[1].split(":");
		if(time[1] == "null") {
			str += '<span><input type="text" class="input-style date-time-style" name="queryTime1" id="queryTime1" value="" disabled="true"/></span>';
			str += '<span style="margin-left:20px"><select  class="finish-time" name="finishTime" id="finishTime">';
			str += '<option value="0:00">0:00</option><option value="1:00">1:00</option><option value="2:00">2:00</option><option value="3:00">3:00</option>';
			str += '<option value="4:00">4:00</option><option value="5:00">5:00</option><option value="6:00">6:00</option><option value="7:00">7:00</option>';
			str += '<option value="8:00">8:00</option><option value="9:00">9:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option>';
			str += '<option value="12:00">12:00</option><option value="13:00">13:00</option><option value="14:00">14:00</option><option value="15:00">15:00</option>';
			str += '<option value="16:00">16:00</option><option value="17:00">17:00</option><option value="18:00">18:00</option><option value="19:00">19:00</option>';
			str += '<option value="20:00">20:00</option><option value="21:00">21:00</option><option value="22:00">22:00</option><option value="23:00">23:00</option>';
			str += '</select></span>';
		} else {

			str += '<span><input type="text" class="input-style date-time-style" name="queryTime1" id="queryTime1" disabled="true" value="' + time[0] + '"/></span>';
			//	str += '<span style="margin-left:20px"><input type="text" class="finish-time" name="finishTime" id="finishTime"  value="' + time[1] + '"/></span>';

			str += '<span style="margin-left:20px"><select  class="finish-time" name="finishTime" id="finishTime" value>';
			str += '<option disabled selected style="display:none">' + times[0] + ":" + times[1] + '</option>';
			str += '<option value="0:00">0:00</option><option value="1:00">1:00</option><option value="2:00">2:00</option><option value="3:00">3:00</option>';
			str += '<option value="4:00">4:00</option><option value="5:00">5:00</option><option value="6:00">6:00</option><option value="7:00">7:00</option>';
			str += '<option value="8:00">8:00</option><option value="9:00">9:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option>';
			str += '<option value="12:00">12:00</option><option value="13:00">13:00</option><option value="14:00">14:00</option><option value="15:00">15:00</option>';
			str += '<option value="16:00">16:00</option><option value="17:00">17:00</option><option value="18:00">18:00</option><option value="19:00">19:00</option>';
			str += '<option value="20:00">20:00</option><option value="21:00">21:00</option><option value="22:00">22:00</option><option value="23:00">23:00</option>';
			str += '</select></span>';
		}
		str += '</div></div>';
		str += '<div class="list-three" style="line-height: 70px;">';
		//	if(!realData[i]["remindTime"] || realData[i]["remindTime"] == "") {
		str += '<span><a class="btn btn-success btnConfirm" id="btnConfirm" style="width: 100px;" agendaId="' + realData[i]["agendaId"] + '">确定</a></span>';
		str += '<span><a style="cursor: pointer;margin-left:100px" class="del" agendaId="' + realData[i]["agendaId"] + '"><img src="../img/dele.png" style=""/></a></span>';
		//	} else {
		//		str += '<span><a style="cursor: pointer;margin-left:200px" class="del" agendaId="' + realData[i]["agendaId"] + '"><img src="../img/dele.png" style=""/></a></span>';
		//	}
		str += '</div></div>';
		str += '';
	}
	$("#dataContent").html(str);
	$(".date-time-style").datepicker("setValue");
	$(".date-time-style").val($("#queryTime").val());
	$(".btnConfirm").click(function() {
		delId = $(this).attr("agendaId");
		rTime = $(this).parent().parent().parent().find("#finishTime").val();
		funAddRemindTime();
	})
	$(".del").click(function() {
		if(!confirm("是否确认删除?")) {
			return;
		}
		delId = $(this).attr("agendaId");
		funDeleteTask();
	})
	$(".routeCn").click(function() {
		$("#detailModal").modal("show");
		createrouteInfos($(this).attr("deviceCn"), $(this).attr("userItem"));
	})
}
//*************************************************路线信息**********************************************
function createrouteInfos(deviceCn, userItem) {
	if(!eval("(" + deviceCn + ")") || eval("(" + deviceCn + ")").length < 1) {
		$("#deviceCn").html("");
		var str = "";
		str += '<div style="position:relative;width: 100%;top:40%;font-size: 30px;font-weight: bold;text-align:center;">';
		str += '当前任务未绑定设备！';
		str += '</div>';
		$("#deviceCn").html(str);
		return;
	}
	$("#deviceCn").html("");
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>设备名称</div></th>";
	str += "</thead><tbody>";
	for(var m = 0; m < eval("(" + deviceCn + ")").length; m++) {
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='width:30%'>" + (m + 1) + "</td>";
		str += "<td class='text-center' style='width:70%;word-wrap: break-word;word-break: break-all;'>" + eval("(" + deviceCn + ")")[m] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#deviceCn").html(str);
	//------------------------------------------------------------------------------------------	
	if(!eval("(" + userItem + ")") || eval("(" + userItem + ")").length < 1) {
		$("#userItem").html("");
		var str = "";
		str += '<div style="position:relative;width: 100%;top:40%;font-size: 30px;font-weight: bold;text-align:center;">';
		str += '当前任务未分配人员！';
		str += '</div>';
		$("#userItem").html(str);
		return;
	}
	$("#userItem").html("");
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>人员列表</div></th>";
	str += "</thead><tbody>";
	for(var m = 0; m < eval("(" + userItem + ")").length; m++) {
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='width:70%;word-wrap: break-word;word-break: break-all;'>" + eval("(" + userItem + ")")[m]["userCn"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#userItem").html(str);
}
//*************************************************查询3种状态的任务**********************************************
function funSSSearchPara() {
	var jsonData = setJson(null, "agendaDate", $("#queryTime").val());
	jsonData = setJson(jsonData, "index", -1);
	jsonData = setJson(jsonData, "number", -1);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询3种状态的任务传值=" + jsonData);
	return jsonData;
}

function funSSSearch() {
	var cmd;
	switch(parseInt(status)) {
		case 1:
			cmd = "DevOpsMyselfCreateTaskSearchCmd";
			break;
		case 2:
			cmd = "DevOpsAssignedToMeTaskSearchCmd";
			break;
		case 3:
			cmd = "DevOpsMySubTaskSearchCmd";
			break;
	}
	console.log("当前命令=" + cmd);
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=" + cmd,
		contentType: "application/text,charset=utf-8",
		data: funSSSearchPara(),
		success: function(msg) {
			loadingStop();
			console.log(JSON.stringify(msg));
			createTableOneInfos(msg);
		},
		error: function() {
			loadingStop();
			console.log("fail");
		}
	});
}
//*************************************************3种任务列表**********************************************
function createTableOneInfos(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#taskContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		switch(parseInt(status)) {
			case 1:
				str += "提示:<br/>当前条件下无我创建的任务信息";
				break;
			case 2:
				str += "提示:<br/>当前条件下无指派给我的任务信息";
				break;
			case 3:
				str += "提示:<br/>当前条件下无我下属的任务信息";
				break;
			default:
				break;
		}
		str += "</div>";
		$("#taskContent").html(str);
		return;
	}
	var data = msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='' ><div class='checkbox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>任务名称</div></th>";
	str += "<th class='text-center'><div class='checkbox'>任务包含的设备数</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < data.length; i++) {
		str += "<tr  class='rows' device='" + JSON.stringify(data[i]["deviceCn"]) + "'  man='" + JSON.stringify(data[i]["userItem"]) + "'   style='cursor:default' >";
		str += "<td class='' style='width:6%'><input type='checkbox'  class='checkbox-all'  id='checkboxs' routeId='" + JSON.stringify(data[i]["routeId"]) + "'></td>";
		str += "<td class='text-center' style='width:10%'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + data[i]["routeCn"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + data[i]["deviceCount"] + "</td>"
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#taskContent").html(str);
	$(".rows").click(function() {
		event.stopPropagation(event);
		var msg = eval("(" + $(this).attr("device") + ")");
		if($(this).attr("device") == "undefined") {
			$("#taskDevice").html("");
			var str = "";
			str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
			str += "提示:<br/>当前条件下无设备内容信息";
			str += "</div>";
			$("#taskDevice").html(str);
		} else {
			createTableTwoInfos(msg);
		}

		var msg1 = $(this).attr("man");
		if($(this).attr("man") == "undefined") {
			$("#taskMan").html("");
			var str = "";
			str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
			str += "提示:<br/>当前条件下无人员名单信息";
			str += "</div>";
			$("#taskMan").html(str);
		} else {
			createTableThreeInfos(msg1);
		}

		if($(this).find("input").attr("userid")) {
			var checked = $(this).find("input").attr("userid").split(",");
			console.log(checked);
			$(".man-checkbox").each(function() {
				for(var i = 0; i < checked.length; i++) {
					if(parseInt($(this).attr("theid")) == parseInt(checked[i])) {
						$(this).prop("checked", true);
					}
				}
			})
		}
		//	$(this).children().eq(0).find("input").prop("checked", true);

	})

	$("#allCheckBox").change(function() {
		if($(this).prop("checked")) {
			task_length = $(".checkbox-all").length;
			$(".checkbox-all").prop("checked", true);
		} else {
			task_length = 0;
			$(".checkbox-all").prop("checked", false);
		}
	})
	$(".checkbox-all").click(function(event) {
		event.stopPropagation();
		if($(this).prop("checked")) {
			task_length++;
			if(task_length == $(".checkbox-all").length) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}

		} else {
			task_length--;
			if(task_length == $(".checkbox-all").length) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		}
	})
}
//*************************************************设备内容**********************************************
function createTableTwoInfos(msg) {
	var data = msg;
	$("#taskDevice").html("");
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>设备名称</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < data.length; i++) {
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='width:10%'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + data[i] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#taskDevice").html(str);
}
//*************************************************人员名单**********************************************
function createTableThreeInfos(msg1) {
	var data = eval("(" + msg1 + ")");
	$("#taskMan").html("");
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='' ><div class='checkbox'><label for='allCheckBox1' style='font-weight:bold'><input type='checkbox' id='allCheckBox1' class='allCheckBox1'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>人员名称</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < data.length; i++) {
		str += "<tr  style='cursor:default'>";
		str += "<td class='' style='width:6%'><input type='checkbox'  class='man-checkbox' theId='" + data[i]["userId"] + "'></td>";
		str += "<td class='text-center' style='width:10%'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + data[i]["userCn"] + "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#taskMan").html(str);
	$(".man-checkbox").click(function() {
		checkedList = [];
		$(".man-checkbox").each(function() {
			if($(this).prop("checked")) {
				if(checkedList.length > 0) {
					var times = 0;
					for(var i = 0; i < checkedList.length; i++) {
						if($(this).attr("theId") == checkedList[i]) {
							times++;
						}
					}
					if(times == 0) {
						checkedList.push($(this).attr("theId"));
					}
				} else {
					checkedList.push($(this).attr("theId"));
				}
			}
		})
		$(".rows").find("input").attr("userId", "");
		$(".rows").find("input").attr("userId", checkedList);
	})

	$("#allCheckBox1").change(function() {
		if($(this).prop("checked")) {
			$(".man-checkbox").prop("checked", true);
			man_length = $(".man-checkbox").length;
			$(".man-checkbox").each(function() {
				if($(this).prop("checked")) {
					if(checkedList.length > 0) {
						var times = 0;
						for(var i = 0; i < checkedList.length; i++) {
							if($(this).attr("theId") == checkedList[i]) {
								times++;
							}
						}
						if(times == 0) {
							checkedList.push($(this).attr("theId"));
						}
					} else {
						checkedList.push($(this).attr("theId"));
					}
				}
			})
			$(".rows").find("input").attr("userId", "");
			$(".rows").find("input").attr("userId", checkedList);

		} else {
			$(".man-checkbox").prop("checked", false);
			man_length = 0;
			$(".rows").find("input").attr("userId", "");

		}
	})
	$(".man-checkbox").change(function() {
		if($(this).prop("checked")) {
			man_length++;
			if(man_length == $(".man-checkbox").length) {
				$("#allCheckBox1").prop("checked", true);
			} else {
				$("#allCheckBox1").prop("checked", false);
			}
		} else {
			man_length--;
			if(man_length == $(".man-checkbox").length) {
				$("#allCheckBox1").prop("checked", true);
			} else {
				$("#allCheckBox1").prop("checked", false);
			}
		}
	})
}
//***************************************************新增任务***************************************************
function funAddTaskPara() {
	var items = [];
	$(".checkbox-all").each(function() {
		if($(this).prop("checked")) {
			var obj = {};
			obj.remindTime = "";
			obj.routeId = $(this).attr("routeId");
			var userItem = [];
			for(var i = 0; i < checkedList.length; i++) {
				var obj1 = {};
				obj1.userId = checkedList[i];
				obj1.userCn = "";
				userItem.push(obj1);
			}
			obj.userItem = userItem;
			items.push(obj);
		}
	})
	var jsonData = setJson(null, "agendaDate", $("#queryTime").val());
	jsonData = setJson(jsonData, "items", items);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("新增任务传值=" + jsonData);
	return jsonData;
}

function funAddTask() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTaskAgendaAddCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddTaskPara(),
		success: function(msg) {
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				$("#addTaskModal").modal("hide");
				windowStart("添加任务成功", true);
				data_page_index = 0;
				curren_page = 1;
				funSearchTask();
			} else {
				windowStart("添加任务失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无添加任务权限", false);
			} else {
				windowStart("添加任务失败", false);
			}
			console.log("fail");
		}
	});
}

//***************************************************复制日程***************************************************
function funCopyTaskPara() {
	var jsonData = setJson(null, "agendaDate", $("#queryTime").val());
	jsonData = setJson(jsonData, "copyDate", $("#copyQueryTime").val());
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("新增任务传值=" + jsonData);
	return jsonData;
}

function funCopyTask() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTaskAgendaCopyCmd",
		contentType: "application/text,charset=utf-8",
		data: funCopyTaskPara(),
		success: function(msg) {
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				windowStart("复制日程成功", true);
				$("#copyModal").modal("hide");
				data_page_index = 0;
				curren_page = 1;
				funSearchTask();
			} else {
				windowStart("复制日程失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无复制日程权限", false);
			} else {
				windowStart("复制日程失败", false);
			}
			console.log("fail");
		}
	});
}

//***************************************************删除日程***************************************************
function funDeleteTaskPara() {
	var jsonData = setJson(null, "agendaId", delId);
	jsonData = setJson(jsonData, "copyDate", $("#copyQueryTime").val());
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("删除日程传值=" + jsonData);
	return jsonData;
}

function funDeleteTask() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTaskAgendDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteTaskPara(),
		success: function(msg) {
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				windowStart("删除日程成功", true);
				data_page_index = 0;
				curren_page = 1;
				funSearchTask();
			} else {
				windowStart("删除日程失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除日程权限", false);
			} else {
				windowStart("删除日程失败", false);
			}
			console.log("fail");
		}
	});
}

//***************************************************设置提醒时间***************************************************
function funAddRemindTimePara() {
	var jsonData = setJson(null, "agendaId", delId);
	jsonData = setJson(jsonData, "remindTime", rTime);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("设置提醒时间传值=" + jsonData);
	return jsonData;
}

function funAddRemindTime() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsTaskAgendaByTimeUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddRemindTimePara(),
		success: function(msg) {
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				windowStart("设置提醒时间成功", true);
				data_page_index = 0;
				curren_page = 1;
				funSearchTask();
			} else {
				windowStart("设置提醒时间失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无设置提醒时间权限", false);
			} else {
				windowStart("设置提醒时间失败", false);
			}
			console.log("fail");
		}
	});
}

function funDateCheck() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	if($("#queryTime").val().length == 0) {
		windowStart("请选择日期", false);
		return false;
	}
	if($("#queryTime").val().length > 0) {
		if(!timeReg.test($("#queryTime").val())) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	return true;
}

function funCheckLegally(checkDate) {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	console.log(checkDate);
	if(checkDate.length == 0) {
		windowStart("请选择日期", false);
		return false;
	}
	if(checkDate.length > 0) {
		if(!timeReg.test(checkDate)) {
			windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
			return false;
		}
	}
	if(true) {
		var startTime = todayDate.split("-");
		var endTime = checkDate.split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("日期有误,请重新选取日期,注意:新任务日期不得早于当前日期", false);
			return false;
		}
	}
	return true;
}

$(document).ready(function() {
	$(".input-style").datepicker("setValue");
	todayDate = $("#queryTime").val();
	console.log(todayDate);
	//$("#addTaskModal").modal("show");
	funSearchTask();
	$("#btnAddTask").click(function() {
		if(!funCheckLegally($("#queryTime").val())) {
			return;
		}
		$(".btn-hover").each(function() {
			if($(this).attr("theEq") == "1") {
				$(this).removeClass("btn-default");
				$(this).addClass("btn-primary");
			} else {
				$(this).removeClass("btn-primary");
				$(this).addClass("btn-default");
			}
		})
		$("#taskDevice").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "请选择任务查看设备内容！";
		str += "</div>";
		$("#taskDevice").html(str);
		$("#taskMan").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "请选择任务查看人员名单！";
		str += "</div>";
		$("#taskMan").html(str);
		status = 1;
		funSSSearch();
		$("#addTaskModal").modal("show");
	})
	$(".btn-hover").click(function() {
		$(".btn-hover").each(function() {
			$(this).removeClass("btn-primary");
			$(this).addClass("btn-default");
		})
		$(this).removeClass("btn-default");
		$(this).addClass("btn-primary");
		status = $(this).attr("theEq");
		funSSSearch();
	})
	$("#btnSearch").click(function() {
		if(!funDateCheck()) {
			return;
		}
		data_page_index = 0;
		curren_page = 1;
		$("#pageNumId").val("");
		funSearchTask();
	})
	$("#btnOk").click(function() {
		funAddTask();
	})
	$("#btnCancle").click(function() {
		$("#addTaskModal").modal("hide");
	})
	$("#btnCopy").click(function() {
		$("#copyQueryTime").val(todayDate);
		$("#copyModal").modal("show");
	})
	$("#btnCopyOk").click(function() {
		if(!funCheckLegally($("#copyQueryTime").val())) {
			return;
		}
		funCopyTask();
	})
	$("#btnCopyCancel").click(function() {
			$("#copyModal").modal("hide");
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
			funSearchTask();
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
			funSearchTask();
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
			funSearchTask();
		})
		//分页操作
})