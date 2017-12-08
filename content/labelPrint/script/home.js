var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var assetDataLength = 0;
var selectDataLength = 0;

function EscapeString(str) {
	return escape(str).replace(/\%/g, "\$");
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
	console.log("询资产类型  所属工厂  服务商传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	$("#buildingowner").html("");
	$("#editfactoryAreaModal").html("");
	$("#companyName").html("");
	$("#editfuwushangModal").html("");
	$("#deviceTypeName").html("");
	$("#editassetTypeModal").html("");
	$("#buildingowner").html("");
	$("#editfactoryAreaModal").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("查询资产类型  所属工厂  服务商返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoSelect(msg);
				funLabelSearch();
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
	//	if(msg.factoryItems != undefined && msg.factoryItems.length > 0  )
	//	{
	////		var theData = msg.factoryItems;
	////		var str = "<option value=''>请选择</option>";
	////		for(var i = 0 ; i < theData.length ; i++ )
	////		{
	////			str += "<option value='"+theData[i]["classifyId"]+"'>"+theData[i]["nameCn"]+"</option>";
	////		}
	////		$("#buildingowner").html(str);
	////		$("#editfactoryAreaModal").html(str);
	////		
	//	}
	if(msg.propertyItems != undefined && msg.propertyItems.length > 0) {
		var theData = msg.propertyItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//		str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";
		}
		$("#companyName").html(str);
		//		$("#editfuwushangModal").html(str);
		//		
	}
	if(msg.DeviceItems != undefined && msg.DeviceItems.length > 0) {
		var theData = msg.DeviceItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";

		}
		$("#assetType").html(str);
		//		$("#editassetTypeModal").html(str);
	}
	if(msg.projectItems != undefined && msg.projectItems.length > 0) {
		var theData = msg.projectItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
			//			str += "<option value='"+theData[i]["nameCn"]+"'>"+theData[i]["nameCn"]+"</option>";

		}
		$("#projectName").html(str);

	}
	//建筑
	if(msg.buildingItems != undefined && msg.buildingItems.length > 0) {
		var theData = msg.buildingItems;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";

		}
		$("#BuildSelect").html(str);
		//		$("#editfactoryAreaModal").html(str);
	}
}

function funCheckDate() {
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

function funLabelSearchPara() {
	var buildingNum = -1;
	var assetId = -1;

	//	if($("#BuildSelect").val().length > 0 )
	//	{
	//		buildingNum =$("#BuildSelect").val();
	//	}
	if($("#assetType").val().length > 0) {
		assetId = $("#assetType").val();
	}
	var jsonData = setJson(null, "startTime", $("#startTime").val());
	jsonData = setJson(jsonData, "endTime", $("#endTime").val());
	jsonData = setJson(jsonData, "keyWord", $("#keyWord").val());
	//jsonData = setJson(jsonData, "factoryId", -1);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "buildId", parseInt($("#BuildSelect  option:selected").val()));
	jsonData = setJson(jsonData, "deviceId", parseInt(assetId));
	//		if ($("#companyName").val()==null) {
	//			jsonData = setJson(jsonData,"company","");
	//		} else{
	jsonData = setJson(jsonData, "companyId", parseInt($("#companyName").val()));
	//		}
	jsonData = setJson(jsonData, "projectId", parseInt($("#projectName option:selected").val()));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询点检传值=" + jsonData);
	return jsonData;
}

function funLabelSearch() {
	if(!funCheckDate()) {
		return;
	}
	assetDataLength = 0;
	selectDataLength = 0;
	$("#dataContent").html("");
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=QRCodeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funLabelSearchPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询点检返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#dataContent").html("");
				createLabelTableInfos(msg);
			} else {
				windowStart("查询标签信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			//			createLabelTableInfos();
			//			windowStart("查询标签信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询标签信息权限", false);
			} else {
				windowStart("查询标签信息失败", false);
			}
		}
	})
}

function createLabelTableInfos(msg) {

	if(!msg.items || msg.items.length < 1) {
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无标签信息";
		str += "</div>";
		$("#dataContent").html(str);
		return;
	}
	//	var total = msg.totalNumber;
	//	var totalPage = Math.ceil(parseInt(total)/data_number);
	//	total_page = totalPage;
	//	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	//	
	total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");

	var realData = msg.items;
	assetDataLength = realData.length;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<tr>";
	str += "<th class='text-center' style='width: 10%;'><input type='checkbox' id='allCheckBox'>  全选</th>";
	str += "<th class='text-center' style='width: 30%;'>标签编号</th>";
	str += "<th class='text-center' style='width: 18%;'>资产名称</th>";
	str += "<th class='text-center' style='width: 10%;'>资产类型</th>";
	str += "<th class='text-center' style='width: 17%;'>服务商</th>";
	str += "<th class='text-center' style='width: 14%;'>所属建筑</th>";
	str += "<th class='text-center' style='width: 5%;'>管理</th>";
	str += "</tr></thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		str += "<tr class='the-qrcode-class' theData='" + JSON.stringify(realData[i]) + "'>";
		str += "<td class='text-center' style='width: 5%;word-wrap: break-word;word-break: break-all;' title='"+(i + 1) +"'><input type='checkbox' class='each-CheckBox' theData='" + JSON.stringify(realData[i]) + "'> " + (i + 1) + "</td>";
		str += "<td class='text-center' style='width: 35%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["deviceCode"]+"'>" + realData[i]["deviceCode"] + "</td>";
		str += "<td class='text-center' style='width: 18%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["nameCn"]+"'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center' style='width: 10%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["deviceTypeNameCn"]+"'>" + realData[i]["deviceTypeNameCn"] + "</td>";
		str += "<td class='text-center' style='width: 17%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["company"]+"'>" + realData[i]["company"] + "</td>";
		str += "<td class='text-center' style='width: 9%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["building"]+"'>" + realData[i]["building"] + "</td>";
		str += "<td class='text-center' style='width: 5%;word-wrap: break-word;word-break: break-all;'><a style='cursor:pointer' class='delete-qrcode' theId='" + realData[i]["id"] + "'><img src='../img/dele.png'></a></td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#dataContent").html(str);
	$("#allCheckBox").change(function() {
		if($(this).prop("checked")) {
			selectDataLength = assetDataLength;
			$(".each-CheckBox").each(function() {
				$(this).prop("checked", true);
			})
		} else {
			selectDataLength = 0;
			$(".each-CheckBox").each(function() {
				$(this).prop("checked", false);
			})
		}
	})
	$(".each-CheckBox").click(function(e) {
		var e = e || event;
		e.stopPropagation();
		if($(this).prop("checked")) {
			selectDataLength++;
			if(selectDataLength == assetDataLength) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		} else {
			selectDataLength--;
			if(selectDataLength == assetDataLength) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		}
	})
	$(".delete-qrcode").click(function(e) {
		var e = e || event;
		e.stopPropagation();
		if(!confirm("是否确认删除?")) {
			return;
		}
		deleteQrCode(parseInt($(this).attr("theId")));
	})

	$(".the-qrcode-class").click(function(e) {
		$("#qrcodeWatch").removeAttr("src", "");
		var e = e || event;
		e.stopPropagation();
		var theData = eval("(" + $(this).attr("theData") + ")");
		$("#qrcodeWatch").attr("src", "../../../../../" + theData.filePath);
		$("#labelInfosModal").modal("show");
	})

}
//删除
function deleteQrCodePara(theId) {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", theId);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("标签删除传值=" + jsonData);
	return jsonData;
}

function deleteQrCode(theId) {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=QRCodeDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: deleteQrCodePara(theId),
		success: function(msg) {

			console.log("标签删除返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("标签删除成功", true);
				funLabelSearch();
			} else {
				windowStart("标签删除失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			windowStart("标签删除失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除标签权限", false);
			} else {
				windowStart("标签删除失败", false);
			}
		}
	})
}
//批量打印
//大号纸
function printAllQrCode() {
	//	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	//	var htmlTitle = "<html><head><meta charset='utf-8'><title>批量打印二维码</title></head><body>";
	var htmlhead = "";

	var str = "<div id='printId'>";
	$(".each-CheckBox:checked").each(function() {
			var theData = eval("(" + $(this).attr("theData") + ")");
			var assetCode = theData.deviceCode;

			var theNum = 0;
			var codeStr = "";
			var index = 0;
			for(var i = 0; i < 5; i++) {
				codeStr += assetCode.substring(index, index + 5) + "-";
				index += 5;
			}
			codeStr = codeStr.substring(0, codeStr.length - 1);

			var assetName = theData.nameCn;
			var thePath = "../../../../../" + theData.filePath;
			console.log(theData.filePath);
			htmlhead += "<div style='width:100%;padding:0px;height:339.4px'>";
			htmlhead += "<div style='width:100%;height:40px;text-align:center;font-size:16px;word-wrap: break-word;word-break: break-all;line-height:40px;padding-top:20px'>" + codeStr + "</div>";
			htmlhead += "<div style='width:100%;height:40px;text-align:center;font-size:16px;word-wrap: break-word;word-break: break-all;line-height:40px'>" + assetName + "</div>";
			htmlhead += "<div style='width:100%;height:259.4px;text-align:center;'><img src='" + thePath + "' style='margin-top:30px' width='200' height='200'/></div>";
			htmlhead += "</div>";
		})
		//  var htmlFoot = '</body></html>'
	str += htmlhead + "</div>";

	$(".body-div-style").append(str);
	$("#printId").jqprint();
	//	newWindow.document.write(str);
	//  newWindow.print();
	//  newWindow.close();
}

//小号纸
function printAllQrCodeForSmall() {

	//	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	//	
	//	var htmlTitle = "<html id='aaaa'><head><meta charset='utf-8'><title>批量打印二维码</title></head><body>";
	$("#printId").remove();
	var htmlhead = "";
	var str = "<div id='printId'>";
	$(".each-CheckBox:checked").each(function() {
			var theData = eval("(" + $(this).attr("theData") + ")");
			var assetCode = theData.deviceCode;
			var theNum = 0;
			var codeStr = "";
			var index = 0;
			for(var i = 0; i < 5; i++) {
				codeStr += assetCode.substring(index, index + 5) + "-";
				index += 5;
			}
			codeStr = codeStr.substring(0, codeStr.length - 1);

			var assetName = theData.nameCn;
			//  	 alert(theData.filePath);
			var thePath = "../../../../../" + theData.filePath;
			htmlhead += "<div style='width:100%;height:212.49px;'>";
			htmlhead += "<div style='width:100%;height:25px;text-align:center;font-size:10px;word-wrap: break-word;word-break: break-all;padding:0px 5px;padding-top:20px'>" + codeStr + "</div>";
			htmlhead += "<div style='width:100%;height:25px;text-align:center;font-size:10px;word-wrap: break-word;word-break: break-all;padding-top:30px'>" + assetName + "</div>";
			htmlhead += "<div style='width:100%;height:126.4px;text-align:center;margin-top:20px;'><img src='" + thePath + "' width='100' height='100'/></div>";
			htmlhead += "</div>";
		})
		//  var htmlFoot = '</body></html>'
	str += htmlhead + "</div>";

	$(".body-div-style").append(str);
	$("#printId").jqprint();
	return;
	//	newWindow.document.write(str);
	//
	//  newWindow.print();
	//  newWindow.close();
	//  newWindow.reload();
}

$(document).ready(function() {
	$(".time-picker").datepicker("setValue");
	$(".time-picker").val("");
	searchSysInfos();
	//	$("#btnAddFacData").click(function(){
	//		$("#addDataModal").modal("show");
	//	})
	$("#btnSearData").click(function() {
		   data_page_index = 0;
		curren_page=1;
		$("#pageNumId").val("");
			funLabelSearch();
		})
		//	$("#facSelect").change(function(){
		//		if(!$(this).val())
		//		{
		//			return;
		//		}
		//		funLabelSearch();
		//	})
		//	$("#assetType").change(function(){
		//		if(!$(this).val())
		//		{
		//			return;
		//		}
		//		funLabelSearch();
		//	})
	$("#btnPrintLabel").click(function() {
		if($(".each-CheckBox:checked").length == 0) {
			windowStart("请选择需要打印的标签", true);
			return;
		}
		//		printAllQrCode();
		$("#pageSizeModal").modal("show");
	})
	$("#btnForPrintLabel").click(function() {
			$("#pageSizeModal").modal("hide");
			if(parseInt($("#pageSize").val()) == 1) {
				printAllQrCodeForSmall();
			} else {
				printAllQrCode();
			}
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
			funLabelSearch();
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
			funLabelSearch();
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
			funLabelSearch();
			$("#pageNumId").val('');
		})
		//分页操作
})