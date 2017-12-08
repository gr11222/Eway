var theNum = 0;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var data_page_index2 = 0;
var data_number2 = 17;
var curren_page2 = 1;
var total_page2 = 0;
var is_start_auto = 0;

var clickEle = -1;

function EscapeString(str) {
	return escape(str).replace(/\%/g, "\$");
}

function UnEscapeString(str) {
	return unescape(str.replace(/\u/g, "\$"));
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


//查找巡检人
function getManList() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=ptCheckUserQueryByTempleteCmd",
		contentType: "application/text,charset=utf-8",
		data: getManListPara(),
		success: function(msg) {
			createManList(msg);
			console.log("查询巡检人返回值=" + JSON.stringify(msg));
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询巡检人权限", false);
			} else {
				windowStart("查询巡检人失败", false);
			}

		}
	})
}

function getManListPara() {
	var jsonData = setJson(null, "item", "", true);
	jsonData = setJson(jsonData, "tpdId", -1);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	return jsonData;
}

function createManList(msg) {
	var str = "<option value=''>请选择</option>";
	if(msg.item != undefined && msg.item.length > 0) {
		var theData = msg.item;
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["account"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
	}
	$("#checkUser").html(str);
}
//类型
function getDeviceTypePara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	//		jsonData = setJson(jsonData,"assetItems","",true);
	console.log("查询设备类型传值=" + jsonData);
	return jsonData;
}

function getDeviceType() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairAssetClassItemCmd",
		contentType: "application/text,charset=utf-8",
		data: getDeviceTypePara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1){
				console.log("查询设备类型返回值=" + JSON.stringify(msg));
				createDeviceType(msg);
				getManList();
			}else{
				windowStart("查询类型失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询类型权限", false);
			} else {
				windowStart("查询类型失败", false);
			}

		}
	})
}
function createDeviceType(msg) {
	if(!msg.typeItem || msg.typeItem.length == 0) {
		return;
	}
	var str = "";
	var theData = msg.typeItem;
	for(var i = 0; i < theData.length; i++) {
		str += "<option  theDevice='" + JSON.stringify(theData[i]["assetItem"]) + "' value='" + theData[i]["typeId"] + "'>" + theData[i]["typeName"] + "</option>";
	}
	$("#thePointDeviceType").append(str);
	$("#thePointDeviceType").change(elChange);
}
function elChange() {
		var childData = eval("(" + $("#thePointDeviceType option:selected").attr("theDevice") + ")");
		var str = "<option value=''>全部</option>";
		if(childData != undefined && childData.length > 0) {
				for(var i = 0; i < childData.length; i++) {
					str += "<option value='" + childData[i]["qrCode"] + "'>" + childData[i]["nameCn"] + "</option>";
				}
				$("#theDeviceSelect").html(str);
			}else{
				$("#theDeviceSelect").html(str);
			}
	}

//查询
function funPtSearchPara() {
	var jsonData = setJson(null, "typeId", parseInt($("#thePointDeviceType").val()));
	jsonData = setJson(jsonData, "qrCode", $("#theDeviceSelect").val());
	jsonData = setJson(jsonData, "maintainUser",$("#checkUser").val());
	if(!$("#startTime").val()){
		jsonData = setJson(jsonData, "startTime","");
	}else{
		jsonData = setJson(jsonData, "startTime",$("#startTime").val() + " 00:00:00");	
	}
	if(!$("#endTime").val()){
		jsonData = setJson(jsonData, "endTime","");
	}else{
		jsonData = setJson(jsonData, "endTime",$("#endTime").val() + " 23:59:59");	
	}
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询传值=" + jsonData);
	return jsonData;
}

function funPtSearch() {
	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsMaintainRecordSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funPtSearchPara(),
		success: function(msg) {
			$("#pageNumId").val("");       
			console.log("查询返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1){
				loadingStop();
				// $("#ptcontent").html("");
				createPtTableInfos(msg);
			}else{
				loadingStop();
				windowStart("查询信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询信息权限", false);
			} else {
				windowStart("查询信息失败", false);
			}
			//			windowStart("查询点检信息失败",false);
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
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + total_page + " 页");
	if(msg.totalNumber == 0) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无保养统计信息";
		str += "</div>";
		$("#ptcontent").html(str);
		return;
	}

	var titleData = msg.titleItem;
	var realData = msg.rowItem;
	var str = "";
	str += "<table class='mainTable table table-bordered table-striped table-hover table-condensed'><thead>";
	// str += "<th class='text-center' style='width:5%' title='请选择'>请选择</th>";
	str += "<th class='text-center' style='width:5%' title='序号'>序号</th>";
	for (var i = 0; i < titleData.length; i++) {
		if(i==0){	
			str+="<th class='text-center' style='width:20%'  title="+titleData[i]["elementCN"]+">"+titleData[i]["elementCN"]+"</th>";
		}else{
			str+="<th class='text-center'  title="+titleData[i]["elementCN"]+">"+titleData[i]["elementCN"]+"</th>";
		}
	}
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr class='table-content'>";
		// str += "<td class='' style='text-align:center'><input type='checkbox'  class='repair-checkbox' theId='" + realData[i]["id"] + "' status='" + realData[i]["status"] + "'></td>";
		str += "<td class='text-center'  title='" + (i + 1) + "'>" + (i + 1) + "</td>";
		for (var j = 0; j < realData[i]["colItem"].length; j++) {
			// if(j==realData[i]["colItem"].length-1){
			// 	if(realData[i]["colItem"][j]==''){
			// 		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='无相册 '>无相册 </td>";
			// 	}else{
			// 		var imgArr = realData[i]["colItem"][j].split('*');
			// 		console.log(imgArr)
			// 		str += "<td class='text-center' ><a style='cursor:pointer' class='lookpic' paths='" + realData[i]["colItem"][j] + "'><img src='../img/" + imgArr.length + ".png'></a></td>";
			// 	}
			// }else{
				str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["colItem"][j] + "'>" + realData[i]["colItem"][j] + "</td>";		
			// }
		}
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	// $(".lookpic").click(function() {
	// 	var theData = $(this).attr("paths").split("*");
	// 	var str = "<div class='demo' >";
	// 	str += "<div >";
	// 	str += "<button type='button' class='close' data-dismiss='modal' aria-label='Close' style='margin-right: 20px;font-size: 50px;color: #FFFFFF;'><span aria-hidden='true' style='color:#FFFFFF'>&times;</span></button>";
	// 	str += "</div>";
	// 	str += "<a class='control prev'></a><a class='control next abs'></a>";
	// 	str += "<div class='slider'>";
	// 	str += "<ul>";
	// 	for(var i = 0; i < theData.length; i++) {
	// 		var path = decodeUnicode(theData[i]);
	// 		str += "<li><img src='../../../.." + path + "' /></li>";
	// 	}
	// 	str += "</ul>";
	// 	str += "</div>";
	// 	str += "</div>";
	// 	window.parent.getValueFromChildren(str);

	// })
}

function decodeUnicode(path) {
	path = path.replace(/\\/g, "%");
	return unescape(path);
}

$(document).ready(function() {
		//时间判断
function fundateCheck() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
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
	if($("#startTime").val().length == 0 && $("#endTime").val().length == 0) {
			windowStart("时间范围有误,请填写时间范围", false);
			return;
		}
	if($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
			windowStart("请输入结束时间", false);
			return false;
		}
			if($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
			windowStart("请输入开始时间", false);
			return false;
		}
	if($("#startTime").val().length > 0 && $("#endTime").val().length > 0) {
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1])-1, parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1])-1, parseInt(endTime[2]));
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("开始时间不能大于结束时间", false);
			return false;
		}
	}
	return true;
}
	$(".input-style").datepicker("setValue");
	getDeviceType();

	//点检
	$(".dateClick").click(function() {
		if ($("#thePointDeviceType").val()==-1) {
			windowStart("请选择类型", false);
			return;
		}
		if($(this).attr('dateData')!=-1){
			$(".input-style").val("");
			clickEle = $(this).attr('dateData');
			funPtSearch();
		}else{
			if(!fundateCheck()) {
					return;
				}
			data_page_index = 0;
			curren_page = 1;
			total_page = 0;
			$("#pageTotalInfo").val("");
			clickEle = $(this).attr('dateData');
			funPtSearch();	
		}
	})
		//点检分页操作
		//上一页
	$("#btnPageBefore").click(function() {
		if(!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
			if(total_page == 0) {
				return;
			}
			if(curren_page == 1) {
				windowStart("当前为首页", false);
				return;
			}
			data_page_index -= data_number;
			curren_page -= 1;
			funPtSearch();
		})
		//下一页
	$("#btnPageNext").click(function() {
		if(!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
			if(total_page == 0) {
				return;
			}
			if(total_page == curren_page) {
				windowStart("当前为尾页", false);
				return;
			}
			data_page_index += data_number;
			curren_page += 1;
			funPtSearch();
		})
		//跳转页
	$("#btnPageJump").click(function() {
		if(!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
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
			funPtSearch();
		})
})