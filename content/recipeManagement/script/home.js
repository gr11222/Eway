var timer = null;
var startTime = "";
var endTime = "";
var orderCode = "",
	telNumber = "",
	user = "";
var orderstate = -1;
var theContent = "todayDataContent";
var dinnerType = "0%1%2%";
var theMap = new Map();
var menuId = [];
var isSearchType = false;
var add_data_boj = [];
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

//---------------菜品类型查询------------------------------
function getFoodTypesPara() {
	var jsonData = setJson(null, "requestCommand", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "failReason", "");
	console.log("查询菜品类型传值=" + jsonData);
	return jsonData;
}
function getFoodTypesInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishMenuReadTypeAndInfoListCmd",
		contentType: "application/text,charset=utf-8",
		data: getFoodTypesPara(),
		success: function(msg) {
			console.log("查询菜品类型返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {

				createFoodTypesInfos(msg);

			} else {
				windowStart(msg.resp.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询食谱权限", false);
			} else {
				windowStart("查询食谱失败", false);
			}
		}
	})
}
// modal的下拉列表
function createFoodTypesInfos(msg) {

	if (!msg.item || msg.item.length == 0) {
		return;
	}
	var theData = msg.item;
	var str = "";
	for (var i = 0; i < theData.length; i++) {
		str += "<option theItems='" + JSON.stringify(theData[i]) + "'  value='" + theData[i]["dishTypeId"] + "' theName='" + theData[i]["dishTypeName"] + "'>" + theData[i]["dishTypeName"] + "</option>";
	}
	$(".food-type-select").html(str);
	var theRealData = eval("(" + $(".food-type-select option:selected").attr("theItems") + ")");
	var childStr = "";
	if (theRealData.dishItem) {
		var childrenData = theRealData.dishItem
		for (var i = 0; i < childrenData.length; i++) {
			childStr += "<option  value='" + childrenData[i]["dishInfoId"] + "' theName='" + childrenData[i]["nameCn"] + "'>" + childrenData[i]["nameCn"] + "</option>";
		}
	}
	$(".food-info-select").html(childStr);
	$(".food-type-select").change(function() {
		$(".food-info-select").html("");
		var theRealData = eval("(" + $(".food-type-select option:selected").attr("theItems") + ")");
		var childStr = "";
		if (theRealData.dishItem) {
			var childrenData = theRealData.dishItem
			for (var i = 0; i < childrenData.length; i++) {
				childStr += "<option  value='" + childrenData[i]["dishInfoId"] + "' theName='" + childrenData[i]["nameCn"] + "'>" + childrenData[i]["nameCn"] + "</option>";
			}
		}
		$(".food-info-select").html(childStr);
	})

}
/***********菜品类型************/
function getTodayRecordPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "startTime", startTime);
	jsonData = setJson(jsonData, "endTime", endTime);
	jsonData = setJson(jsonData, "menuType", dinnerType);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询食谱传值=" + jsonData);
	return jsonData;
}
function getTodayRecord() {
	$("#" + theContent).html("");
	$('.content_main').html("");
	if (theContent == "lastDataContent") {
		var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;

		if ($("#startDate").val().length > 0) {
			if (!timeReg.test($("#startDate").val())) {
				windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
				return;
			}
		}
		if ($("#endDate").val().length > 0) {
			if (!timeReg.test($("#endDate").val())) {
				windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd", false);
				return;
			}
		}
		if ($("#startDate").val().length > 0 && $("#endDate").val().length > 0) {
			var startTime = $("#startDate").val().split("-");
			var endTime = $("#endDate").val().split("-");
			var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
			var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
			if (parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
				windowStart("时间范围有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间", false);
				return;
			}
		}
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishMenuManageSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: getTodayRecordPara(),
		success: function(msg) {
			console.log("查询食谱返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createTodayRecord(msg);
			} else {
				windowStart(msg.resp.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询食谱权限", false);
			} else {
				windowStart("查询食谱失败", false);
			}
		}
	})
}
function createTodayRecord(msg) {
	if (!msg.item || msg.item.length == 0) {
		var str = "";
		str += "<div style='position:relative;width:300px;top:30%;margin:0 auto;font-size:20px'>";
		str +="提示：<br />"
		str += "当前时间无食谱信息";
		str += "</div>";
		$("#" + theContent).html(str);
		return;
	}
	var str = "";
	var theData = msg.item;
	str += "<div style='width:100%;height:35px'>";
	str += '<ul class="nav nav-tabs" role="tablist">';
	for (var i = 0; i < theData.length; i++) {
		var dateTime = theData[i].datetime.split(" ");
		if (i == 0) {
			str += '<li role="presentation" class="active"><a style="font-size:12px" aria-controls="content_' + i + '" href="#content_' + i + '" role="tab" data-toggle="tab">' + dateTime[0] + '</a></li>';
		} else {
			str += '<li role="presentation" ><a href="#content_' + i + '" style="font-size:12px" aria-controls="content_' + i + '" role="tab" data-toggle="tab">' + dateTime[0] + '</a></li>';
		}
	}
	str += '</ul>';
	str += "</div>";
	str += '<div class="tab-content">';
	for (var i = 0; i < theData.length; i++) {
		if (i == 0) {
			str += ' <div role="tabpanel" style="width:100%;height:475px;overflow:auto" class="tab-pane active" id="content_' + i + '">';
		} else {
			str += ' <div role="tabpanel" style="width:100%;height:475px;overflow:auto"  class="tab-pane"  id="content_' + i + '">';
		}
		str += "<div style='width:100%;padding:5px'>";
		for (var j = 0; j < theData[i]["item"].length; j++) {
			str += "<div style='width:100%;font-size:20px;;clear:both'>";
			if (parseInt(theData[i]["item"][j].menuType) == 0) {
				str += "早餐";
			} else if (parseInt(theData[i]["item"][j].menuType) == 1) {
				str += "中餐";
			} else {
				str += "晚餐";
			}
			str += "</div>";
			str += "<div style='width:100%'>";
			for (var m = 0; theData[i]["item"][j]["items"] != undefined && m < theData[i]["item"][j]["items"].length; m++) {
				str += "<div style='width:20%;height:315px;float:left'>";
				str += "<div style='width:100%;height:220px;line-height:220px;text-align:center'>";
				str += "<img src='../../../dishPicture/" + theData[i]["item"][j]["items"][m]["dishInfoPic"] + "' width='180' height='200'>";
				str += "</div>";
				str += "<div  class='jieshao-content'>";
				str += "<span style='padding-left:30px'>" + theData[i]["item"][j]["items"][m]["nameCn"] + "</span>";
				str += "</div>";
				str += "<div  class='jieshao-content'>";
				str += "<span style='padding-left:30px'>" + theData[i]["item"][j]["items"][m]["dishCuisineName"] + "</span><span style='padding-left:15px'>口味:" + theData[i]["item"][j]["items"][m]["dishTasteName"] + "</span>";
				str += "</div>";
				str += "<div  class='price-content'>";
				str += "<span  style='padding-left:30px'>" + theData[i]["item"][j]["items"][m]["price"] + " 元/份</span>";
				str += "</div>";
				str += "</div>";
			}
			str += "</div>";
		}
		str += "</div>";
		str += "</div>";
	}
	str += '</div>';
	$("#" + theContent).html(str);
}
function getTimeInfos() {
	clearInterval(timer);
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var day = today.getDate();
	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	var str = "当前时间 :  " + year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
	$("#timeInfos").html(str);
	timer = setInterval(getTimeInfos, 1000);
}
function setStartTime() {
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var day = today.getDate();
	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	var str = year + "-" + month + "-" + day + " 00:00:00";
	startTime = str;
}
//------------------modal
function getDateRecordPara() {

	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "startTime", $("#startFoodTime").val() + " 00:00:00");
	jsonData = setJson(jsonData, "endTime", "");
	jsonData = setJson(jsonData, "menuType", "0%1%2%");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询食谱传值=" + jsonData);
	return jsonData;
}

function getDateRecord() {

	$("#theDataContent").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishMenuManageSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: getDateRecordPara(),
		success: function(msg) {
			console.log("查询食谱返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				funCreateFoodInfos(msg);
			} else {
				windowStart(msg.resp.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询食谱权限", false);
			} else {
				windowStart("查询食谱失败", false);
			}
		}
	})
}
function funCreateFoodInfos(msg) {
	console.log('获取返回值：' + JSON.stringify(msg));
	var theData = {};
	if (msg.item != undefined && msg.item.length > 0) {
		theData = msg.item;
		for (var i = 0; i < theData.length; i++) {
			menuId.push(parseInt(theData[i]["menuId"]));
		}
	}
	var str = "";
	var day_length = 1;
	//大于等于等于7
	var str = "";
	str += "<div style='width:100%;height:45px'>";
	str += '<ul class="nav nav-tabs" role="tablist">';
	for (var i = 0; i < day_length; i++) {
		var time_str = $("#startFoodTime").val();
		if (i == 0) {
			str += '<li role="presentation" class="active"><a style="font-size:12px" href="#content_' + i + '" role="tab" data-toggle="tab">' + time_str + '</a></li>';
		} else {
			str += '<li role="presentation" ><a href="#content_' + i + '" style="font-size:12px" role="tab" data-toggle="tab">' + time_str + '</a></li>';
		}
	}
	str += '</ul>';
	str += "</div>";
	str += '<div class="tab-content" style="width:100%;height:350px;padding:0px;overflow:hidden">';
	for (var i = 0; i < day_length; i++) {
		if (i == 0) {
			str += ' <div role="tabpanel" style="width:100%;height:340px;padding:5px;overflow:hidden;" class="tab-pane active" id="content_' + i + '">';
		} else {
			str += ' <div role="tabpanel" style="width:100%;height:340px;padding:5px;overflow:hidden;"  class="tab-pane"  id="content_' + i + '">';
		}
		str += "<div style='width:100%;height:40px;'>";
		str += "<span>菜品类型</span>";
		str += "<span style='padding-left:10px'><select style='width:150px;height:30px' class='food-type-select'></select></span>";
		str += "<span style='padding-left:10px'>菜品</span>";
		str += "<span style='padding-left:10px'><select style='width:150px;height:30px' class='food-info-select'></select></span>";
		str += "<span style='padding-left:10px'>就餐时间</span>";
		str += "<span style='padding-left:10px'><select style='width:150px;height:30px' class='food-time-select'>";
		str += "<option value='0'>早餐</option>";
		str += "<option value='1'>中餐</option>";
		str += "<option value='2'>晚餐</option>";
		str += "</select></span>";
		str += "<span style='padding-left:10px'><a class='btn btn-primary' id='btntheAddInfos'><span class='glyphicon glyphicon-plus'></span></a></span>";
		str += "</div>";
		if (msg.item != undefined && msg.item.length > 0) {
			for (var m = 0; m < theData[i]["item"].length; m++) {
				var theClass = "";
				var theType = "";
				if (parseInt(theData[i]["item"][m]["menuType"]) == 0) {
					theClass = "zao-content";
					theType = "早餐";
				} else if (parseInt(theData[i]["item"][m]["menuType"]) == 1) {
					theClass = "zhong-content";
					theType = "中餐";
				} else {
					theClass = "wan-content";
					theType = "晚餐";
				}
				str += "<div style='width:100%;height:100px;border-bottom:1px solid #CCCCCC'>";
				str += "<div style='width:20%;height:100px;line-height:40px;font-size:20px;float:left'>" + theType + "</div>";
				str += "<div style='width:80%;height:100px;overflow:auto;;float:left' theMenuId='" + theData[i]["item"][m]["menuId"] + "' class='" + theClass + "'>";
				if (theData[i]["item"][m]["items"] != undefined && theData[i]["item"][m]["items"].length > 0) {
					str += "<div style='width:100%'>";
					for (var j = 0; j < theData[i]["item"][m]["items"].length; j++) {
						str += "<div class='food-idInfos' theFoodId='" + theData[i]["item"][m]["items"][j]["dishInfoId"] + "' style='width:25%;height:25px;line-height:25px;font-size:12px;float:left'><span>" + theData[i]["item"][m]["items"][j]["dishCuisineName"] + ":  <span style='  '>" + theData[i]["item"][m]["items"][j]["nameCn"] + "</span>" + "</span></div>";
						//						str += "<div style='width:30%;height:25px;line-height:25px;font-size:12px;float:left'></div>";
					}
					str += "</div>";
				}
				str += "</div>";
				str += "</div>";
			}
		} else {
			//早餐
			str += "<div style='width:100%;height:100px;border-bottom:1px solid #CCCCCC;overflow:auto;'>";
			str += "<div style='width:20%;line-height:40px;font-size:20px'>早餐</div>";
			str += "<div style='width:100%;overflow:auto;' theMenuId='-1'  class='zao-content'></div>";
			str += "</div>";
			//中餐
			str += "<div style='width:100%;height:100px;border-bottom:1px solid #CCCCCC;overflow:auto;'>";
			str += "<div style='width:20%;line-height:40px;font-size:20px'>中餐</div>";
			str += "<div style='width:100%;overflow:auto;' theMenuId='-1' class='zhong-content'></div>";
			str += "</div>";
			//晚餐
			str += "<div style='width:100%;height:100px;overflow:auto;'  >";
			str += "<div style='width:20%;line-height:40px;font-size:20px'>晚餐</div>";
			str += "<div style='width:100%;overflow:auto;' theMenuId='-1' class='wan-content'></div>";
			str += "</div>";
		}
		str += "</div>";
	}
	$("#theDataContent").html(str);
	//等于1
	getFoodTypesInfos();
	//添加食谱点击
	$("#btntheAddInfos").click(function() {
			var str = "";
			str += "<div style='width:100%'>";
			str += "<div class='food-idInfos' theFoodId='" + $(".food-info-select").val() + "' style='width:25%;height:25px;line-height:25px;font-size:12px;float:left'><span>" + $(".food-type-select option:selected").attr("theName") + ":    <span>" + $(".food-info-select option:selected").attr("theName") + "</span>" + "</span></div>";
			//		str += "<div style='width:30%;height:25px;line-height:25px;font-size:12px;float:left'></div>";
			str += "</div>";
			if (parseInt($(".food-time-select").val()) == 0) {
				$(".zao-content").append(str);
			} else if (parseInt($(".food-time-select").val()) == 1) {
				$(".zhong-content").append(str);
			} else {
				$(".wan-content").append(str);
			}
		})
	//确认添加点击
	$("#btnSureFood").click(function() {
		var arr = [];
		var class_arr = ["zao-content", "zhong-content", "wan-content"];
		for (var i = 0; i < class_arr.length; i++) {
			var obj = {};
			obj.dishMenuId = parseInt($("." + class_arr[i]).attr("theMenuId"));
			obj.dateTime = $("#startFoodTime").val();
			obj.items = [];
			var childObj = {};
			childObj.menuType = i;
			childObj.dishInfoId = [];
			for (var j = 0; j < $("." + class_arr[i]).find(".food-idInfos").length; j++) {
				childObj.dishInfoId.push($("." + class_arr[i]).find(".food-idInfos").eq(j).attr("theFoodId"));
			}
			obj.items.push(childObj);
			arr.push(obj);
		}
		AddDateRecord(arr);
		$("#FoodModal").modal("hide");
		getTodayRecord();
	})
}
//添加
function addDateRecordPara(arr) {

	var jsonData = setJson(null, "dishItem", arr);

	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("操作食谱传值=" + jsonData);
	return jsonData;
}

function AddDateRecord(arr) {

	$("#theDataContent").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishMenuManageAddAndUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: addDateRecordPara(arr),
		success: function(msg) {
			console.log("添加修改食谱返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("操作食谱信息成功", true);

			} else {
				windowStart(msg.resp.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无操作食谱权限", false);
			} else {
				windowStart("操作食谱失败", false);
			}
		}
	})
}
$(document).ready(function() {
	setStartTime();
	getTimeInfos();
	getTodayRecord();
	$(".time-picker").datepicker("setValue");
	//当前 往期切换点击
	$(".li-click").click(function() {
		if (parseInt($(this).attr("theNum")) == 0) {
			clearInterval(timer);
			getTimeInfos();
			setStartTime();
			endTime = "";
			theContent = "todayDataContent";
		} else {
			clearInterval(timer);
			startTime = $("#startDate").val() + " 00:00:00";
			endTime = $("#endDate").val() + " 23:59:59";
			theContent = "lastDataContent";
		}

		getTodayRecord();
	})
	//查询点击
	$("#btnlastSearchInfos").click(function() {
		clearInterval(timer);
		startTime = $("#startDate").val() + " 00:00:00";
		endTime = $("#endDate").val() + " 23:59:59";
		theContent = "lastDataContent";
		dinnerType = "";
		for (var i = 0; i < $(".dinner-type-2:checked").length; i++) {
			dinnerType += $(".dinner-type-2:checked").eq(i).attr("theNum") + "%";
		}
		dinnerType = dinnerType.substring(0, dinnerType.length - 1);
		getTodayRecord();
	})
	//二级联动
	$(".dinner-type").change(function() {
		dinnerType = "";
		for (var i = 0; i < $(".dinner-type:checked").length; i++) {
			dinnerType += $(".dinner-type:checked").eq(i).attr("theNum") + "%";
		}
		dinnerType = dinnerType.substring(0, dinnerType.length - 1);
		getTodayRecord();
	})
	//添加点击 modal show
	$("#btnAddFondInfo").click(function() {
		$("#FoodModal").modal("show");
	})
	//modal 日期确认点击
	$("#benStartMake").click(function() {
		getDateRecord();
	});
})