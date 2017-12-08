var theNum = 0;
var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var is_start_auto = 0;
var isFinish = 0;
var theEditStatus = 0;
var editData = {};
var isShenHe = -1;
var repair_length = 0;
var is_boHui = -1;
var templateCode = -1;
var theIsEditUrl = "";
var editAlarmData;
var editCode;

function EscapeString(str) {
	return escape(str).replace(/\%/g, "\$");
}

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

// function funGetAssetTypeJson(){
// 	var jsonData = setJson(null,"AccountName",localStorage.getItem("userAccountName"));
// 	console.log("查询资产类型传值="+jsonData);
// }
// function funGetAssetType(){
// 	$.ajax({
// 		type:"post",
// 		dataType:'json',
// 		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
// 		contentType:"application/text,charset=utf-8",
// 		data:funGetAssetTypeJson(),
// 		success:function(msg){		
// 			console.log("查询资产类型返回值="+JSON.stringify(msg));	
// 		},
// 		error:function(XMLHttpRequest, textStatus, errorThrown){
// 			var xmlRequest = XMLHttpRequest.status;
// 			windowStart(errorThrown,false);
// 		}
// 	})
// }
// funGetAssetType();

function funGetAssetInfoPara() {
	var startTime = "",
		endTime = "";
	if ($("#startTime").val().length > 0) {
		startTime = $("#startTime").val() + " 00:00:00";
	}
	if ($("#endTime").val().length > 0) {
		endTime = $("#endTime").val() + " 23:59:59";
	}
	var jsonData = setJson(null, "companyId", parseInt($("#company").val()));
	jsonData = setJson(jsonData, "startTime", startTime);
	jsonData = setJson(jsonData, "endTime", endTime);
	jsonData = setJson(jsonData, "projectId", parseInt($("#projectName").val()));
	jsonData = setJson(jsonData, "assettypeId", parseInt($("#deviceType").val()));
	jsonData = setJson(jsonData, "buildingId", parseInt($("#building").val()));
	jsonData = setJson(jsonData, "keyWord", $("#assetNum").val());
	jsonData = setJson(jsonData, "assetCode", $("#theAssetCode").val());
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "isEnable", $("#isStartAlarm").val());
	// jsonData = setJson(jsonData,"items","",true);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	console.log("查询资产信息传值=" + jsonData);
	return jsonData;
}

function funGetAssetInfo() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
	//	{
	//		windowStart("报警时间选择有误,请填写时间范围",false);
	//	    return;
	//	}
	if ($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
		windowStart("请输入结束时间", false);
		return false;
	}
	if ($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
		windowStart("请输入开始时间", false);
		return false;
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

	if ($("#startTime").val().length > 0 && $("#endTime").val().length > 0) {
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2]));
		if (parseInt(startDate.getTime()) > parseInt(endDate.getTime())) {
			windowStart("报警时间选择有误,请重新选取时间范围,注意:时间范围中的开始时间不能大于结束时间", false);
			return;
		}
	}
	$("#ptcontent").html("");
	repair_length = 0;
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsEarlyWarningValueSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetAssetInfoPara(),
		success: function(msg) {
			loadingStop();
			//			windowRemove();
			// console.log("查询资产信息返回值="+JSON.stringify(msg));	
			$("#ptcontent").html("");
			$("#pageNumId").val("");
			createAssetTableInfos(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			//			var msg = {"requestCommand":"","responseCommand":"OK","company":"","project":"","startTime":"2016-07-11 00:00:00","endTime":"2016-07-11 23:59:59","deviceType":"","building":"","keyWord":"","AccountName":"SuperUser","items":[{"id":50,"assetCode":"50","nameCn":"七层电表","nameEn":"pomSeven","company":"实想科技","typeName":"电表","enable":1,"dateTime":"","items":[{"templateCode":"SensePOM","nameCn":"电表","nameEn":"PowerMeter","dataType":"chart","defaultValue":"","allValue":"","sign":1},{"templateCode":"SensePOM","nameCn":"备注","nameEn":"Note","dataType":"chart","defaultValue":"","allValue":"","sign":0}]},{"id":53,"assetCode":"53","nameCn":"电梯机房二","nameEn":"liftTwo","company":"实想科技","typeName":"电梯机房","enable":0,"dateTime":"","items":[{"templateCode":"SenseLIFT","nameCn":"报警装置应急照明是否有效","nameEn":"AlarmLamp","dataType":"select","defaultValue":"正常","allValue":"正常,异常,需检修","sign":0},{"templateCode":"SenseLIFT","nameCn":"安全检验合格标志警示标志是否完好","nameEn":"AlarmFlag","dataType":"select","defaultValue":"正常","allValue":"正常,异常,需检修","sign":0},{"templateCode":"SenseLIFT","nameCn":"机房各运转部件室内温度有无异常","nameEn":"AlarmTemp","dataType":"select","defaultValue":"正常","allValue":"正常,异常,需检修","sign":0},{"templateCode":"SenseLIFT","nameCn":"运行制动等操作指令是否有效","nameEn":"AlarmOrder","dataType":"select","defaultValue":"正常","allValue":"正常,异常,需检验","sign":0},{"templateCode":"SenseLIFT","nameCn":"运行是否正常有无异常的振动或噪声","nameEn":"AlarmRunning","dataType":"select","defaultValue":"正常","allValue":"正常,异常,需检验","sign":0},{"templateCode":"SenseLIFT","nameCn":"机房门窗有无关闭好","nameEn":"DoorsWindows","dataType":"select","defaultValue":"正常","allValue":"正常,异常,需检验","sign":0},{"templateCode":"SenseLIFT","nameCn":"备注","nameEn":"Note","dataType":"chart","defaultValue":"","allValue":"","sign":0}]},{"id":73,"assetCode":"73","nameCn":"一号消防间","nameEn":"FEROne","company":"地铁和谐大厦","typeName":"消防","enable":0,"dateTime":"","items":[{"templateCode":"SenseFER","nameCn":"运行是否正常","nameEn":"Running","dataType":"radio","defaultValue":"是","allValue":"是,否","sign":0},{"templateCode":"SenseFER","nameCn":"挡鼠板是否完好","nameEn":"BlockBat","dataType":"radio","defaultValue":"是","allValue":"是,否","sign":0},{"templateCode":"SenseFER","nameCn":"配电柜外观","nameEn":"ElectricBoxApperence","dataType":"radio","defaultValue":"正常","allValue":"正常,故障","sign":0},{"templateCode":"SenseFER","nameCn":"开启方式","nameEn":"OpenMode","dataType":"radio","defaultValue":"手动","allValue":"自动,手动","sign":0},{"templateCode":"SenseFER","nameCn":"消防器材是否齐备","nameEn":"FireEquipement","dataType":"radio","defaultValue":"是","allValue":"是,否","sign":0},{"templateCode":"SenseFER","nameCn":"备注","nameEn":"Note","dataType":"chart","defaultValue":"","allValue":"","sign":0}]}]};
			//			createAssetTableInfos(msg);
			//			return;
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询资产信息权限", false);
			} else {
				windowStart("查询资产信息失败", false);
			}
			//			windowStart("查询点检信息失败",false);
		}
	})
}

function createAssetTableInfos(msg) {
	if (!msg.item || msg.item.length < 1) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无报警信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
	var total = msg.totalNumber;

	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");
	//	
	var realData = msg.item;

	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<tr><th class=''><input type='checkbox' id='allCheckBox'>全选</th>";
	str += "<th class='text-center'>资产编号</th>";
	str += "<th class='text-center'>中文名称</th>";
	str += "<th class='text-center'>英文名称</th>";
	str += "<th class='text-center'>服务商</th>";
	str += "<th class='text-center'>资产类型</th>";
	str += "<th class='text-center'>所属建筑</th>";
	str += "<th class='text-center'>安装位置</th>";
	str += "<th class='text-center'>是否启用报警</th>";
	str += "<th class='text-center'>修改时间</th>";
	str += "<th class='text-center'>管理</th>";
	str += "</tr></thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		var theData = JSON.stringify(realData[i]);
		str += "<tr class='tr-watch-info' theData='" + theData + "' style='cursor:default'>";
		str += "<td class='' style='width:5%'><input type='checkbox' theData='" + theData + "'   class='repair-checkbox' theId='" + realData[i]["assetId"] + "'><span style='padding-left:5px'>" + (i + 1) + "</span></td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["assetCode"] + "'>" + realData[i]["assetCode"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["nameCn"] + "'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["nameEn"] + "'>" + realData[i]["nameEn"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["company"] + "'>" + realData[i]["company"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["assettypeName"] + "'>" + realData[i]["assettypeName"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["building"] + "'>" + realData[i]["building"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["position"] + "'>" + realData[i]["position"] + "</td>";
		if (parseInt(realData[i]["isEnable"]) == 1) {
			str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='是'>是</td>";

		} else {
			str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='否'>否</td>";

		}

		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["dateTime"] + "'>" + realData[i]["dateTime"] + "</td>";
		if (parseInt(realData[i]["isEnable"]) == 1) {
			str += "<td class='text-center' style='width:5%;word-wrap: break-word;word-break: break-all;'><span><a href='javascript:void(0)' theData='" + theData + "' class='edit-assetInfo'><img src='../img/edit.png'></a></span></td>";

		} else {
			str += "<td class='text-center' style='width:5%;word-wrap: break-word;word-break: break-all;'></td>";
		}


		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	$("#allCheckBox").change(function() {
		if ($(this).prop("checked")) {
			repair_length = $(".repair-checkbox").length;
			$(".repair-checkbox").prop("checked", true);
		} else {
			repair_length = 0;
			$(".repair-checkbox").prop("checked", false);
		}
	})
	$(".repair-checkbox").click(function(e) {
		var e = e || event;
		e.stopPropagation();
		if ($(this).prop("checked")) {
			repair_length++;
			if (repair_length == $(".repair-checkbox").length) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}


		} else {
			repair_length--;
			if (repair_length == $(".repair-checkbox").length) {
				$("#allCheckBox").prop("checked", true);
			} else {
				$("#allCheckBox").prop("checked", false);
			}
		}
	})

	$(".edit-assetInfo").click(function(e) {
			var e = e || event;
			e.stopPropagation();
			var realData = eval("(" + $(this).attr("theData") + ")");
			console.log(realData)
			var theData = realData.items;

			if (parseInt(realData.enable) == 0) {
				windowStart("未启用状态的报警不可以修改", false);
				return;
			}
			// editCode = theData[0]["templateCode"];
			editAlarmData = realData;
			funSearchEditInfoModal(realData);
		})
		//查看
	$(".tr-watch-info").click(function(e) {
		var e = e || event;
		e.stopPropagation();
		var realData = eval("(" + $(this).attr("theData") + ")");
		//		var theData = realData.items;
		if (parseInt(realData.enable) == 0) {
			windowStart("当前报警未设置报警阈值", false);
			return;
		}
		funWatchEditInfoModal(realData);
	})
}
//点击修改获取上次设定的值
function funSearchEditInfoModalPara(theData) {
	var jsonData = setJson(null, "assetId", theData.assetId);

	jsonData = setJson(jsonData, "tplCode", theData.typeCode);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//localStorage.getItem("userName")
	console.log("获取上次设定报警阈值传值=" + jsonData);
	return jsonData;
}

function funSearchEditInfoModal(theData) {
	$("#edittempContent").html("");

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsEarlyWarningViewSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funSearchEditInfoModalPara(theData),
		success: function(msg) {
			console.log("获取上次设定报警阈值返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				funCreateEditModalInfo(msg);
			} else {
				windowStart("获取上次设定报警阈值失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无获取上次设定报警阈值权限", false);
			} else {
				windowStart("获取上次设定报警阈值失败", false);
			}
		}
	})
}

function funCreateEditModalInfo(msg) {
	$("#edittempContent").html("");
	var realData = msg;
	
	var theData = msg.item;
	var theData_code = realData.item;
	templateCode = theData_code["viewType"];
	$("#editAlarmValueModal").modal("show");
	var str = "";
	str += "<form  class='form-horizontal'>";
	for (var i = 0; i < theData.length; i++) {
		if (theData[i]["nameCn"] == "备注") {
			continue;
		}
		str += '<div class="form-group">';
		str += ' <label for="pageInfo-' + i + '" class=" col-lg-4 col-md-4 col-sm-4 col-xs-4  control-label label-style" style="padding-top:8px">' + theData[i]["nameCn"] + '</label>';
		var theType = theData[i]["viewType"];
		if (theType == "int") {
			str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
			str += '<input templateCode="' + theData[i]["viewType"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-pageinfo" id="pageInfo-' + i + '" placeholder="' + theData[i]["defaultValue"] + '">';
			str += '</div>';
		} else if (theType == "radio") {
			var radio_arr = theData[i]["allValue"].split(",");
			str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8  ">';
			for (var j = 0; j < radio_arr.length; j++) {
				if (j != 0) {
					str += '<div class="radio" style="float:left;margin-left:5px">';
				} else {
					str += '<div class="radio" style="float:left;">';
				}

				if (radio_arr[j] == theData[i]["defaultValue"]) {
					str += "<label>";
					str += '<input style="margin-top:2px" templateCode="' + theData[i]["viewType"] + '" theValue="' + radio_arr[j] + '"  type="radio"  allValue="' + theData[i]["allValue"] + '"  name="radio' + i + '" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" checked="checked" theType="' + theType + '" class="radio-pageinfo" id="pageInfo-' + i + 'radio' + j + '">';
					str += radio_arr[j] + "</label>";
				} else {
					str += "<label>";
					str += '<input style="margin-top:2px" templateCode="' + theData[i]["viewType"] + '" theValue="' + radio_arr[j] + '" type="radio"  allValue="' + theData[i]["allValue"] + '"  name="radio' + i + '"  nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="radio-pageinfo" id="pageInfo-' + i + 'radio' + j + '">';
					str += radio_arr[j] + "</label>";
				}
				str += '</div>';
			}

			str += '</div>';
		} else if (theType == "select") {
			var select_arr = theData[i]["allValue"].split(",");
			str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
			str += '<select type="text" class="form-control select-pageinfo" id="pageInfo-' + i + '">';

			for (var j = 0; j < select_arr.length; j++) {
				if (j == 0) {
					str += "<option templateCode='' allValue=''  nameCn='" + theData[i]["nameCn"] + "'  nameEn='' theType='' selected='selected' value=''>";
					str += "请选择";
					str += "</option>";
				}
				if (select_arr[j] == theData[i]["defaultValue"]) {
					str += "<option 'templateCode=" + theData[i]["viewType"] + "' allValue='" + theData[i]["allValue"] + "'  nameCn='" + theData[i]["nameCn"] + "'  nameEn='" + theData[i]["nameEn"] + "' theType='" + theType + "' selected='selected' value='" + select_arr[j] + "'>";
					str += select_arr[j];
					str += "</option>";
				} else {
					str += "<option 'templateCode=" + theData[i]["viewType"] + "' allValue='" + theData[i]["allValue"] + "' nameCn='" + theData[i]["nameCn"] + "'  nameEn='" + theData[i]["nameEn"] + "' theType='" + theType + "' value='" + select_arr[j] + "'>";
					str += select_arr[j];
					str += "</option>";
				}

			}
			str += '</select>';
			str += '</div>';
		} else {
			if (parseInt(theData[i]["sign"]) == 1) {
				str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
				if (theData[i]["defaultValue"].length > 0) {
					var theValue = theData[i]["defaultValue"].split(",");

					//				   		 str += '<input placeholder="下限" style="width:48%;float:left;" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+'" value="'+theValue[0]+'">';
					//				   		 str += '<input placeholder="上限"  style="width:48%;float:left;margin-left:4%" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+1+'" value="'+theValue[1]+'">';
					str += '<div class="input-group" style="width:48%;float:left;">';
					str += '<div class="input-group-addon">下限</div>';
					str += '<input type="text" placeholder="下限"  templateCode="' + theData[i]["viewType"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-fanwei" id="fanwei-' + i + '" value="' + theValue[0] + '">';
					str += '</div>';
					str += '<div class="input-group" style="width:48%;float:left;margin-left:4%">';
					str += '<div class="input-group-addon">上限</div>';
					str += '<input type="text"  placeholder="上限"    templateCode="' + theData[i]["viewType"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-fanwei" id="fanwei-' + i + 1 + '" value="' + theValue[1] + '">';
					str += '</div>';
				} else {
					str += '<div class="input-group" style="width:48%;float:left;">';
					str += '<div class="input-group-addon">下限</div>';
					str += '<input type="text" placeholder="下限" templateCode="' + theData[i]["viewType"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-fanwei" id="fanwei-' + i + '" value="">';
					str += '</div>';
					str += '<div class="input-group" style="width:48%;float:left;margin-left:4%">';
					str += '<div class="input-group-addon">上限</div>';
					str += '<input type="text"  placeholder="上限"   templateCode="' + theData[i]["viewType"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-fanwei" id="fanwei-' + i + 1 + '" value="">';
					str += '</div>';
					//				   		str += '<input placeholder="下限"  style="width:48%;float:left;" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+'" value="">';
					//				   	    str += '<input placeholder="上限"  style="width:48%;float:left;margin-left:4%" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+1+'" value="">';
				}

				str += '</div>';
			} else {
				var theType = 'text';
				if (theData[i]["nameEn"] == "PowerMeter") {
					theType = 'number';
				}
				str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
				str += '<input type="' + theType + '" templateCode="' + theData[i]["viewType"] + '" defaultValue="' + theData[i]["defaultValue"] + '" allValue="' + theData[i]["allValue"] + '"  nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '"  theType="' + theType + '" class="form-control input-pageinfo" id="pageInfo-' + i + '" placeholder="' + theData[i]["defaultValue"] + '">';
				str += '</div>';
			}

		}

		str += '</div>';
	}
	//		str += '<div class="form-group" style="padding-top:10px">';
	//		str += '<label for="editaccepter" class="col-lg-4 col-md-4 col-sm-4 col-xs-4  control-label label-style">指定报警人</label>';	    
	//		str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
	//	    str += '<input type="text" id="editaccepter" class="form-control">';
	//	  	str += '</div>';	
	//		str += '</div>';
	str += "</form>";
	$("#edittempContent").html(str);

	//		$("#editAlarmValueModal").modal("show");
}
//查看上次设置的详细信息
//点击查看获取上次设定的值
function funWatchEditInfoModalPara(theData) {
	var jsonData = setJson(null, "assetId", theData.assetId);

	jsonData = setJson(jsonData, "tplCode", theData.typeCode);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//localStorage.getItem("userName")
	console.log("获取上次设定报警阈值传值=" + jsonData);
	return jsonData;
}

function funWatchEditInfoModal(theData) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsEarlyWarningViewSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funWatchEditInfoModalPara(theData),
		success: function(msg) {
			console.log("获取上次设定报警阈值返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				funCreateWatchModalInfo(msg);
			} else {
				windowStart("获取上次设定报警阈值失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无获取上次设定报警阈值权限", false);
			} else {
				windowStart("获取上次设定报警阈值失败", false);
			}
		}
	})
}

function funCreateWatchModalInfo(msg) {
	$("#edittempContent").html("");
	var realData = msg;

	var theData = msg.item;

	var str = "";
	str += "<form  class='form-horizontal'>";
	for (var i = 0; i < theData.length; i++) {
		if (theData[i]["nameCn"] == "备注") {
			continue;
		}
		str += '<div class="form-group">';
		str += ' <label for="pageInfo-' + i + '" class=" col-lg-4 col-md-4 col-sm-4 col-xs-4  control-label label-style" style="padding-top:8px">' + theData[i]["nameCn"] + '</label>';
		var theType = theData[i]["dataType"];
		if (theType == "int") {
			str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
			str += '<input disabled="disabled" templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control"  placeholder="' + theData[i]["defaultValue"] + '">';
			str += '</div>';
		} else if (theType == "radio") {
			var radio_arr = theData[i]["allValue"].split(",");
			str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8  ">';
			for (var j = 0; j < radio_arr.length; j++) {
				if (j != 0) {
					str += '<div class="radio" style="float:left;margin-left:5px">';
				} else {
					str += '<div class="radio" style="float:left;">';
				}

				if (radio_arr[j] == theData[i]["defaultValue"]) {
					str += "<label>";
					str += '<input disabled="disabled" style="margin-top:2px" templateCode="' + theData[i]["templateCode"] + '" theValue="' + radio_arr[j] + '"  type="radio"  allValue="' + theData[i]["allValue"] + '"  name="radio' + i + '" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" checked="checked" theType="' + theType + '"  >';
					str += radio_arr[j] + "</label>";
				} else {
					str += "<label>";
					str += '<input disabled="disabled" style="margin-top:2px" templateCode="' + theData[i]["templateCode"] + '" theValue="' + radio_arr[j] + '" type="radio"  allValue="' + theData[i]["allValue"] + '"  name="radio' + i + '"  nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="radio-pageinfo" >';
					str += radio_arr[j] + "</label>";
				}
				str += '</div>';
			}

			str += '</div>';
		} else if (theType == "select") {
			var select_arr = theData[i]["allValue"].split(",");
			str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
			str += '<select type="text" disabled="disabled" class="form-control " >';

			for (var j = 0; j < select_arr.length; j++) {
				if (j == 0) {
					str += "<option templateCode='' allValue=''  nameCn='" + theData[i]["nameCn"] + "'  nameEn='' theType='' selected='selected' value=''>";
					str += "请选择";
					str += "</option>";
				}
				if (select_arr[j] == theData[i]["defaultValue"]) {
					str += "<option 'templateCode=" + theData[i]["templateCode"] + "' allValue='" + theData[i]["allValue"] + "'  nameCn='" + theData[i]["nameCn"] + "'  nameEn='" + theData[i]["nameEn"] + "' theType='" + theType + "' selected='selected' value='" + select_arr[j] + "'>";
					str += select_arr[j];
					str += "</option>";
				} else {
					str += "<option 'templateCode=" + theData[i]["templateCode"] + "' allValue='" + theData[i]["allValue"] + "' nameCn='" + theData[i]["nameCn"] + "'  nameEn='" + theData[i]["nameEn"] + "' theType='" + theType + "' value='" + select_arr[j] + "'>";
					str += select_arr[j];
					str += "</option>";
				}

			}
			str += '</select>';
			str += '</div>';
		} else {
			if (parseInt(theData[i]["sign"]) == 1) {
				str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
				if (theData[i]["defaultValue"].length > 0) {
					var theValue = theData[i]["defaultValue"].split(",");

					//				   		 str += '<input placeholder="下限" style="width:48%;float:left;" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+'" value="'+theValue[0]+'">';
					//				   		 str += '<input placeholder="上限"  style="width:48%;float:left;margin-left:4%" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+1+'" value="'+theValue[1]+'">';
					str += '<div class="input-group" style="width:48%;float:left;">';
					str += '<div class="input-group-addon">下限</div>';
					str += '<input disabled="disabled" type="text" placeholder="下限"  templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control"  value="' + theValue[0] + '">';
					str += '</div>';
					str += '<div class="input-group" style="width:48%;float:left;margin-left:4%">';
					str += '<div class="input-group-addon">上限</div>';
					str += '<input disabled="disabled" placeholder="上限"   type="text" templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control" value="' + theValue[1] + '">';
					str += '</div>';
				} else {
					str += '<div class="input-group" style="width:48%;float:left;">';
					str += '<div class="input-group-addon">下限</div>';
					str += '<input disabled="disabled" type="text" placeholder="下限" templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control "  value="">';
					str += '</div>';
					str += '<div class="input-group" style="width:48%;float:left;margin-left:4%">';
					str += '<div class="input-group-addon">上限</div>';
					str += '<input disabled="disabled" placeholder="上限"   type="text"  templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control" value="">';
					str += '</div>';
					//				   		str += '<input placeholder="下限"  style="width:48%;float:left;" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+'" value="">';
					//				   	    str += '<input placeholder="上限"  style="width:48%;float:left;margin-left:4%" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+1+'" value="">';
				}

				str += '</div>';
			} else {
				var theType = 'text';
				if (theData[i]["nameEn"] == "PowerMeter") {
					theType = 'number';
				}
				str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
				str += '<input disabled="disabled" type="' + theType + '" templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '"  theType="' + theType + '" class="form-control" placeholder="' + theData[i]["defaultValue"] + '">';
				str += '</div>';
			}

		}

		str += '</div>';
	}

	str += "</form>";
	$("#watchtempContent").html(str);
	$("#watchAlarmValueModal").modal("show");
}

//获取资产编号、公司、项目
function funGetSystemInfosPara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	//		jsonData = setJson(jsonData,"responseCommand","");
	//		jsonData = setJson(jsonData,"company","",true);
	//		jsonData = setJson(jsonData,"project","",true);
	//		jsonData = setJson(jsonData,"assetCode","",true);
	//		jsonData = setJson(jsonData,"AccountName",localStorage.getItem("userAccountName"));

	console.log("查询资产编号、公司、项目传值=" + jsonData);
	return jsonData;
}

function funGetSystemInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOspEarlyWarningValueQueryCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetSystemInfosPara(),
		success: function(msg) {
			loadingStop();
			//			windowRemove();
			console.log("获取资产编号、公司、项目返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSystemInfos(msg);
				// funGetAssetInfo();
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无获取资产编号、项目和公司信息的权限", false);
			} else {
				windowStart("获取资产编号、项目和公司信息失败", false);
			}
		}
	})
}

function createSystemInfos(msg) {
	if (msg.company != undefined && msg.company.length > 0) {
		var theData = msg.company;
		var str = "";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#company").append(str);
	}

	if (msg.project != undefined && msg.project.length > 0) {
		var theData = msg.project;
		var str = "";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["projectId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#projectName").append(str);
	}
	if (msg.devicetype != undefined && msg.devicetype.length > 0) {
		var theData = msg.devicetype;
		var str = "";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#deviceType").append(str);
	}
	if (msg.buildingItems != undefined && msg.buildingItems.length > 0) {
		var theData = msg.buildingItems;
		var str = "";
		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["classifyId"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
		$("#building").append(str);
	}
	if (msg.assetCode != undefined && msg.assetCode.length > 0) {
		$(".li-id-class").unbind("click");
		$("#deviceName").unbind("keyup");
		$("#assetCodeContent").html("");
		var str = "";
		var theData = msg.assetCode;
		var str = "";
		str += "<ul style='margin:0px;padding:0px'>";
		for (var i = 0; i < theData.length; i++) {
			str += "<li class='li-id-class hide' style='width:100%;height:20px;line-height:20px;cursor:default'   theAssetCode='" + theData[i] + "'>" + theData[i] + "</li>";
		}
		str += "</ul>";
		$("#assetCodeContent").html(str);
		$("#theAssetCode").bind("keyup", function() {
			var theValue = $(this).val();
			var realValue = -1;
			if ($(this).val().length > 0) {
				for (var i = 0; i < $(".li-id-class").length; i++) {
					if ($(".li-id-class").eq(i).attr("theAssetCode").indexOf(theValue) != -1) {

						$(".li-id-class").eq(i).removeClass("hide");
					} else {
						$(".li-id-class").eq(i).addClass("hide");
					}
				}
			}
			$(".li-id-class").bind("click", function() {

				realValue = $(this).attr("theAssetCode");
				$("#theAssetCode").val(realValue);
				$(".li-id-class").addClass("hide");
			});
		})
	}

}


//设置报警阈值
function setAlarmValueInfoPara() {

	var theValue_arr = [];

	for (var i = 0; i < $(".input-pageinfo").length; i++) {
		var obj = {};
		obj.templateCode = $(".input-pageinfo").eq(i).attr("templateCode");
		obj.nameCn = $(".input-pageinfo").eq(i).attr("nameCn");
		obj.nameEn = $(".input-pageinfo").eq(i).attr("nameEn");
		obj.dataType = $(".input-pageinfo").eq(i).attr("theType");
		obj.defaultValue = $(".input-pageinfo").eq(i).val();
		obj.allValue = $(".input-pageinfo").eq(i).attr("allValue");
		obj.sign = 0;
		theValue_arr.push(obj);
	}
	for (var i = 0; i < $(".select-pageinfo").length; i++) {
		var obj = {};
		obj.templateCode = $(".select-pageinfo :eq(" + i + ") :selected").attr("templateCode");
		obj.nameCn = $(".select-pageinfo :eq(" + i + ") :selected").attr("nameCn");
		obj.nameEn = $(".select-pageinfo :eq(" + i + ") :selected").attr("nameEn");
		obj.dataType = $(".select-pageinfo :eq(" + i + ") :selected").attr("theType");
		obj.defaultValue = $(".select-pageinfo").eq(i).val();
		obj.allValue = $(".select-pageinfo :eq(" + i + ") :selected").attr("allValue");
		obj.sign = 0;
		theValue_arr.push(obj);
	}
	//	radio-pageinfo
	for (var i = 0; i < $(".radio-pageinfo:checked").length; i++) {
		var obj = {};
		obj.templateCode = $(".radio-pageinfo:checked").eq(i).attr("templateCode");
		obj.nameCn = $(".radio-pageinfo:checked").eq(i).attr("nameCn");
		obj.nameEn = $(".radio-pageinfo:checked").eq(i).attr("nameEn");
		obj.dataType = $(".radio-pageinfo:checked").eq(i).attr("theType");
		obj.defaultValue = $(".radio-pageinfo:checked").eq(i).attr("theValue");
		obj.allValue = $(".radio-pageinfo:checked").eq(i).attr("allValue");
		obj.sign = 0;
		theValue_arr.push(obj);
	}
	if ($(".input-fanwei").length > 0) {
		if ($(".input-fanwei").eq(0).val().length > 0) {
			var obj = {};
			obj.templateCode = $(".input-fanwei").eq(0).attr("templateCode");
			obj.nameCn = $(".input-fanwei").eq(0).attr("nameCn");
			obj.nameEn = $(".input-fanwei").eq(0).attr("nameEn");
			obj.dataType = $(".input-fanwei").eq(0).attr("theType");
			obj.defaultValue = $(".input-fanwei").eq(0).val() + "," + $(".input-fanwei").eq(1).val();
			obj.allValue = $(".input-fanwei").eq(0).attr("allValue");
			obj.sign = 1;
			theValue_arr.push(obj);
		} else {
			var obj = {};
			obj.templateCode = $(".input-fanwei").eq(0).attr("templateCode");
			obj.nameCn = $(".input-fanwei").eq(0).attr("nameCn");
			obj.nameEn = $(".input-fanwei").eq(0).attr("nameEn");
			obj.dataType = $(".input-fanwei").eq(0).attr("theType");
			obj.defaultValue = "";
			obj.sign = 1;
			obj.allValue = $(".input-fanwei").eq(0).attr("allValue");
			theValue_arr.push(obj);
		}
	}

	var theArr = [];
	for (var i = 0; i < $(".repair-checkbox:checked").length; i++) {
		var theObj = {};
		var theData = eval("(" + $(".repair-checkbox:checked").eq(i).attr("theData") + ")");
		theObj.id = parseInt(theData.assetId);
		theObj.assetCode = theData.assetCode;
		theObj.nameCn = theData.nameCn;
		theObj.nameEn = theData.nameEn;
		theObj.company = theData.company;
		theObj.typeName = theData.assettypeName;
		theObj.building = theData.building;
		theObj.position = theData.position;
		theObj.enable = parseInt(theData.isEnable);
		theObj.dateTime = theData.dateTime;
		//			theObj.accepter =$("#accepter").val();
		theObj.accepter = "";
		theObj.items = theValue_arr;
		theArr.push(theObj);
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "company", "");
	jsonData = setJson(jsonData, "project", "");
	jsonData = setJson(jsonData, "startTime", "");
	jsonData = setJson(jsonData, "endTime", "");
	jsonData = setJson(jsonData, "deviceType", -1);
	jsonData = setJson(jsonData, "building", -1);
	jsonData = setJson(jsonData, "keyWord", "");
	jsonData = setJson(jsonData, "enable", "");
	jsonData = setJson(jsonData, "items", theArr);
	jsonData = setJson(jsonData, "AccountName", localStorage.getItem("userAccountName"));
	//localStorage.getItem("userName")

	console.log("添加报警阈值传值=" + jsonData);
	return jsonData;
}

function setAlarmValueInfo() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsEarlyWarningValueAddCmd",
		contentType: "application/text,charset=utf-8",
		data: setAlarmValueInfoPara(),
		success: function(msg) {
			console.log("添加报警阈值返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("添加报警阈值成功", true);
				$("#setAlarmValueModal").modal("hide");
				$("#tempContent").html("");
				funGetAssetInfo();
			} else {
				windowStart("添加报警阈值失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无添加报警阈值权限", false);
			} else {
				windowStart("添加报警阈值失败", false);
			}
		}
	})
}

//修改报警阈值
function editAlarmValueInfoPara() {

	var theValue_arr = [];

	for (var i = 0; i < $(".input-pageinfo").length; i++) {
		var obj = {};
		obj.templateCode = $(".input-pageinfo").eq(i).attr("templateCode");
		obj.nameCn = $(".input-pageinfo").eq(i).attr("nameCn");
		obj.nameEn = $(".input-pageinfo").eq(i).attr("nameEn");
		obj.dataType = $(".input-pageinfo").eq(i).attr("theType");
		if ($(".input-pageinfo").eq(i).val() == "") {
			obj.defaultValue = $(".input-pageinfo").eq(i).attr("defaultValue");
		} else {
			obj.defaultValue = $(".input-pageinfo").eq(i).val();
		}

		obj.allValue = $(".input-pageinfo").eq(i).attr("allValue");
		obj.templateCode = editCode;
		obj.sign = 0;
		theValue_arr.push(obj);
	}
	for (var i = 0; i < $(".select-pageinfo").length; i++) {
		var obj = {};
		obj.templateCode = $(".select-pageinfo :eq(" + i + ") :selected").attr("templateCode");
		obj.nameCn = $(".select-pageinfo :eq(" + i + ") :selected").attr("nameCn");
		obj.nameEn = $(".select-pageinfo :eq(" + i + ") :selected").attr("nameEn");
		obj.dataType = $(".select-pageinfo :eq(" + i + ") :selected").attr("theType");
		obj.defaultValue = $(".select-pageinfo").eq(i).val();
		obj.allValue = $(".select-pageinfo :eq(" + i + ") :selected").attr("allValue");
		obj.templateCode = editCode;
		obj.sign = 0;
		theValue_arr.push(obj);
	}
	//	radio-pageinfo
	for (var i = 0; i < $(".radio-pageinfo:checked").length; i++) {
		var obj = {};
		obj.templateCode = $(".radio-pageinfo:checked").eq(i).attr("templateCode");
		obj.nameCn = $(".radio-pageinfo:checked").eq(i).attr("nameCn");
		obj.nameEn = $(".radio-pageinfo:checked").eq(i).attr("nameEn");
		obj.dataType = $(".radio-pageinfo:checked").eq(i).attr("theType");
		obj.defaultValue = $(".radio-pageinfo:checked").eq(i).attr("theValue");
		obj.allValue = $(".radio-pageinfo:checked").eq(i).attr("allValue");
		obj.templateCode = editCode;
		obj.sign = 0;
		theValue_arr.push(obj);
	}
	//范围
	if ($(".input-fanwei").length > 0) {
		if ($(".input-fanwei").eq(0).val().length > 0) {
			var obj = {};
			obj.templateCode = $(".input-fanwei").eq(0).attr("templateCode");
			obj.nameCn = $(".input-fanwei").eq(0).attr("nameCn");
			obj.nameEn = $(".input-fanwei").eq(0).attr("nameEn");
			obj.dataType = $(".input-fanwei").eq(0).attr("theType");
			obj.defaultValue = $(".input-fanwei").eq(0).val() + "," + $(".input-fanwei").eq(1).val();
			obj.allValue = $(".input-fanwei").eq(0).attr("allValue");
			obj.templateCode = editCode;
			obj.sign = 1;
			theValue_arr.push(obj);
		} else {
			var obj = {};
			obj.templateCode = $(".input-fanwei").eq(0).attr("templateCode");
			obj.nameCn = $(".input-fanwei").eq(0).attr("nameCn");
			obj.nameEn = $(".input-fanwei").eq(0).attr("nameEn");
			obj.dataType = $(".input-fanwei").eq(0).attr("theType");
			obj.defaultValue = "";
			obj.templateCode = editCode;
			obj.sign = 1;
			obj.allValue = $(".input-fanwei").eq(0).attr("allValue");
			theValue_arr.push(obj);
		}
	}

	var theArr = [];
	//	for(var  i = 0 ; i < $(".repair-checkbox:checked").length; i++ )
	//	{
	var theObj = {};
	var theData = editAlarmData;
	theObj.id = parseInt(theData.assetId);
	theObj.assetCode = theData.assetCode;
	theObj.nameCn = theData.nameCn;
	theObj.nameEn = theData.nameEn;
	theObj.company = theData.company;
	theObj.typeName = theData.typeName;
	theObj.building = theData.building;
	theObj.position = theData.position;
	theObj.enable = parseInt(theData.isEnable);
	theObj.dateTime = theData.dateTime;
	//			theObj.accepter = $("#editaccepter").val();
	theObj.accepter = "";
	theObj.items = theValue_arr;
	theArr.push(theObj);
	//	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "company", "");
	jsonData = setJson(jsonData, "project", "");
	jsonData = setJson(jsonData, "startTime", "");
	jsonData = setJson(jsonData, "endTime", "");
	jsonData = setJson(jsonData, "deviceType", -1);
	jsonData = setJson(jsonData, "building", -1);
	jsonData = setJson(jsonData, "keyWord", "");
	jsonData = setJson(jsonData, "enable", "");
	jsonData = setJson(jsonData, "items", theArr);
	jsonData = setJson(jsonData, "AccountName", localStorage.getItem("userAccountName"));
	//localStorage.getItem("userName")
	console.log("修改报警阈值传值=" + jsonData);
	return jsonData;
}

function editAlarmValueInfo() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsEarlyWarningValueUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: editAlarmValueInfoPara(),
		success: function(msg) {
			console.log("修改报警阈值返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("修改报警阈值成功", true);
				$("#editAlarmValueModal").modal("hide");
				$("#edittempContent").html("");
				funGetAssetInfo();
			} else {
				windowStart("修改报警阈值失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无修改报警阈值权限", false);
			} else {
				windowStart("修改报警阈值失败", false);
			}
		}
	})
}

//修改报警阈值
//清空报警阈值

function clearAlarmValueInfoPara() {
	var theArr = [];
	for (var i = 0; i < $(".repair-checkbox:checked").length; i++) {
		var theObj = {};
		var theData = eval("(" + $(".repair-checkbox:checked").eq(i).attr("theData") + ")");
		theObj.id = parseInt(theData.assetId);
		theObj.assetCode = "";
		theObj.nameCn = "";
		theObj.nameEn = "";
		theObj.company = "";
		theObj.typeName = "";
		theObj.building = "";
		theObj.position = "";
		theObj.enable = -1;
		theObj.dateTime = "";
		theObj.accepter = "";
		theObj.items = [];
		theArr.push(theObj);
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "company", "");
	jsonData = setJson(jsonData, "project", "");
	jsonData = setJson(jsonData, "startTime", "");
	jsonData = setJson(jsonData, "endTime", "");
	jsonData = setJson(jsonData, "deviceType", -1);
	jsonData = setJson(jsonData, "building", -1);
	jsonData = setJson(jsonData, "keyWord", "");
	jsonData = setJson(jsonData, "items", theArr);
	jsonData = setJson(jsonData, "AccountName", localStorage.getItem("userAccountName"));
	//localStorage.getItem("userName")
	console.log("清空报警阈值传值=" + jsonData);
	return jsonData;
}

function clearAlarmValueInfo() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsEarlyWarningValueDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: clearAlarmValueInfoPara(),
		success: function(msg) {
			console.log("清空报警阈值返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("清空报警阈值成功", true);

				funGetAssetInfo();
			} else {
				windowStart("清空报警阈值失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无清空报警阈值权限", false);
			} else {
				windowStart("清空报警阈值失败", false);
			}
		}
	})
}

$(document).ready(function() {
	$("#jieDaiRen").val(localStorage.getItem("userAccountName"));
	$(".input-style").datepicker("setValue");
	$(".input-style").val("");
	//获取模板
	funGetSystemInfos();
	funGetAssetInfo();
	//点检
	$("#btnSearchRepair").click(function() {
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		$("#pageNumId").val("");
		funGetAssetInfo();
	})


	//点检分页操作
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
			funGetAssetInfo();
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
			funGetAssetInfo();
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
			funGetAssetInfo();
		})
		//点检分页操作


	//报警值设置

	$("#btnSetValue").click(function() {
		if ($(".repair-checkbox:checked").length == 0) {
			windowStart("请选择需要设置报警阈值的报警", false);
			return;
		}
		var isEqule = true;
		var isEdit = true;

		for (var i = 0; i < $(".repair-checkbox:checked").length; i++) {
			if (i == $(".repair-checkbox:checked").length - 1) {
				break;
			} else {
				var theData = eval("(" + $(".repair-checkbox:checked").eq(i).attr("theData") + ")");
				var otheData = eval("(" + $(".repair-checkbox:checked").eq(i + 1).attr("theData") + ")");
				if (theData.typeName != otheData.typeName) {
					isEqule = false;
					break;
				}
			}
		}
		if (!isEqule) {
			windowStart("请选择相同类型的资产信息设置报警阈值", false);

			return;
		}
		var isLike = true;

		for (var i = 0; i < $(".repair-checkbox:checked").length; i++) {

			var theData = eval("(" + $(".repair-checkbox:checked").eq(i).attr("theData") + ")");

			if (parseInt(theData.isEnable) == 1) {
				isLike = false;
				break;
			}
		}
		if (!isLike) {

			windowStart("只能为未启用报警状态的报警进行设置", false);
			return;
		}
		$("#setAlarmValueModal").modal("show");
		var theData = eval("(" + $(".repair-checkbox:checked").eq(0).attr("theData") + ")").item;
		templateCode = theData["typeCode"];

		var str = "";
		str += "<form  class='form-horizontal'>"
		for (var i = 0; i < theData.length; i++) {
			if (theData[i]["nameCn"] == "备注") {
				continue;
			}
			str += '<div class="form-group">';
			str += ' <label for="pageInfo-' + i + '" class=" col-lg-4 col-md-4 col-sm-4 col-xs-4  control-label label-style" style="padding-top:8px">' + theData[i]["nameCn"] + '</label>';
			var theType = theData[i]["viewType"];
			if (theType == "int") {
				str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
				str += '<input templateCode="' + theData[i]["typeCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-pageinfo" id="pageInfo-' + i + '" placeholder="' + theData[i]["defaultValue"] + '">';
				str += '</div>';


			} else if (theType == "radio") {
				var radio_arr = theData[i]["allValue"].split(",");
				str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8  ">';
				for (var j = 0; j < radio_arr.length; j++) {
					if (j != 0) {
						str += '<div class="radio" style="float:left;margin-left:5px">';
					} else {
						str += '<div class="radio" style="float:left;">';
					}

					if (radio_arr[j] == theData[i]["defaultValue"]) {
						str += "<label>";
						str += '<input style="margin-top:2px" templateCode="' + theData[i]["templateCode"] + '" theValue="' + radio_arr[j] + '"  type="radio"  allValue="' + theData[i]["allValue"] + '"  name="radio' + i + '" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" checked="checked" theType="' + theType + '" class="radio-pageinfo" id="pageInfo-' + i + 'radio' + j + '">';
						str += radio_arr[j] + "</label>";
					} else {
						str += "<label>";
						str += '<input style="margin-top:2px" templateCode="' + theData[i]["templateCode"] + '" theValue="' + radio_arr[j] + '" type="radio"  allValue="' + theData[i]["allValue"] + '"  name="radio' + i + '"  nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="radio-pageinfo" id="pageInfo-' + i + 'radio' + j + '">';
						str += radio_arr[j] + "</label>";
					}
					str += '</div>';
				}

				str += '</div>';
			} else if (theType == "select") {
				var select_arr = theData[i]["allValue"].split(",");
				str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
				str += '<select type="text" class="form-control select-pageinfo" id="pageInfo-' + i + '">';
				for (var j = 0; j < select_arr.length; j++) {
					if (j == 0) {
						str += "<option templateCode='' allValue=''  nameCn='" + theData[i]["nameCn"] + "'  nameEn='' theType='' selected='selected' value=''>";
						str += "请选择";
						str += "</option>";
					}
					if (select_arr[j] == theData[i]["defaultValue"]) {
						str += "<option 'templateCode=" + theData[i]["templateCode"] + "' allValue='" + theData[i]["allValue"] + "'  nameCn='" + theData[i]["nameCn"] + "'  nameEn='" + theData[i]["nameEn"] + "' theType='" + theType + "' selected='selected' value='" + select_arr[j] + "'>";
						str += select_arr[j];
						str += "</option>";
					} else {
						str += "<option 'templateCode=" + theData[i]["templateCode"] + "' allValue='" + theData[i]["allValue"] + "' nameCn='" + theData[i]["nameCn"] + "'  nameEn='" + theData[i]["nameEn"] + "' theType='" + theType + "' value='" + select_arr[j] + "'>";
						str += select_arr[j];
						str += "</option>";
					}

				}
				str += '</select>';
				str += '</div>';
			} else {
				if (parseInt(theData[i]["sign"]) == 1) {
					str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
					if (theData[i]["defaultValue"].length > 0) {
						var theValue = theData[i]["defaultValue"].split(",");
						//				   		 str += '<input style="width:48%;float:left;" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+'" value="'+theValue[0]+'">';
						//				   		 str += '<input style="width:48%;float:left;margin-left:4%" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+1+'" value="'+theValue[1]+'">';
						str += '<div class="input-group" style="width:48%;float:left;">';
						str += '<div class="input-group-addon">下限</div>';
						str += '<input type="text" placeholder="下限"  templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-fanwei" id="fanwei-' + i + '" value="' + theValue[0] + '">';
						str += '</div>';
						str += '<div class="input-group" style="width:48%;float:left;margin-left:4%">';
						str += '<div class="input-group-addon">上限</div>';
						str += '<input type="text" placeholder="上限"    templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-fanwei" id="fanwei-' + i + 1 + '" value="' + theValue[1] + '">';
						str += '</div>';
					} else {

						//				   		 str += '<input style="width:48%;float:left;" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+'" value="">';
						//				   		 str += '<input style="width:48%;float:left;margin-left:4%" templateCode="'+theData[i]["templateCode"]+'" allValue="'+theData[i]["allValue"]+'"  type="text" nameCn="'+theData[i]["nameCn"]+'"  nameEn="'+theData[i]["nameEn"]+'" theType="'+theType+'" class="form-control input-fanwei" id="fanwei-'+i+1+'" value="">';
						str += '<div class="input-group" style="width:48%;float:left;">';
						str += '<div class="input-group-addon">下限</div>';
						str += '<input type="text" placeholder="下限"  templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-fanwei" id="fanwei-' + i + '" value="">';
						str += '</div>';
						str += '<div class="input-group" style="width:48%;float:left;margin-left:4%">';
						str += '<div class="input-group-addon">上限</div>';
						str += '<input type="text"  placeholder="上限"   templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  type="text" nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '" theType="' + theType + '" class="form-control input-fanwei" id="fanwei-' + i + 1 + '" value="">';
						str += '</div>';
					}

					str += '</div>';
				} else {
					var theType = 'text';
					if (theData[i]["nameEn"] == "PowerMeter") {
						theType = 'number';
					}
					str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
					str += '<input type="' + theType + '" templateCode="' + theData[i]["templateCode"] + '" allValue="' + theData[i]["allValue"] + '"  nameCn="' + theData[i]["nameCn"] + '"  nameEn="' + theData[i]["nameEn"] + '"  theType="' + theType + '" class="form-control input-pageinfo" id="pageInfo-' + i + '" placeholder="' + theData[i]["defaultValue"] + '">';
					str += '</div>';
				}

			}

			str += '</div>';
		}
		//		str += '<div class="form-group" style="padding-top:10px">';
		//		str += '<label for="accepter" class="col-lg-4 col-md-4 col-sm-4 col-xs-4  control-label label-style">指定报警人</label>';	    
		//		str += '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">';
		//	    str += '<input type="text" id="accepter" class="form-control">';
		//	  	str += '</div>';	
		//		str += '</div>';
		str += "</form>";
		$("#tempContent").html(str);


	})
	$("#btnAddValue").click(function() {

		setAlarmValueInfo();
	})
	$("#editbtnAddFactory").click(function() {
		editAlarmValueInfo();
	})

	$("#btnClearValue").click(function() {
		if ($(".repair-checkbox:checked").length == 0) {
			windowStart("请选择需要清空报警阈值的报警", false);
			return;
		}
		var isEnabled = true;
		for (var i = 0; i < $(".repair-checkbox:checked").length; i++) {
			var theData = eval("(" + $(".repair-checkbox:checked").eq(i).attr("theData") + ")");
			if (parseInt(theData.enable) == 0) {
				isEnabled = false;
				break;
			}
		}
		if (!isEnabled) {
			windowStart("请选择已设置报警阈值的报警", false);
			return;
		}
		if (!confirm("是否确认清空?")) {
			return;
		}
		clearAlarmValueInfo();
	})

})