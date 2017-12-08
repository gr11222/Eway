var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;

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
	// jsonData = setJson(jsonData, "queryType", 0);
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
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairAllocateInfoSearchCmd",
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
		str += "提示:<br/>当前条件下无报修信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
	var realData = msg.item;

	var str = "";
	str += "<table class='mainTable table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' style='width:5%' >序号</th>";
	str += "<th class='text-center' style='width:10%' >编号</th>";
	str += "<th class='text-center' style='width:20%'>标签编号</th>";
	str += "<th class='text-center'  >设备名称</th>";
	str += "<th class='text-center' style='width:20%'>内容</th>";
	str += "<th class='text-center'>报修人</th>";
	// str += "<th class='text-center'>分配人</th>";
	str += "<th class='text-center'>操作</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr class='table-content'>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + (i+1) + "'>" + (i+1) + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairCode"] + "'>" + realData[i]["repairCode"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["qrCode"] + "'>" + realData[i]["qrCode"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["assetName"] + "'>" + realData[i]["assetName"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairContent"] + "'>" + realData[i]["repairContent"] + "</td>";
		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + realData[i]["repairUser"] + "'>" + realData[i]["repairUser"] + "</td>";
		// 	if(realData[i]["allocateUser"]){
		// 	var participantName = [];
		// 	for (var j = 0; j < realData[i]["allocateUser"].length; j++) {
		// 		participantName.push(realData[i]["allocateUser"][j]["userName"]);
		// 	}	
		// 		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title='" + participantName.join(",") + "'>" + participantName.join(",") + "</td>";
		// }else{
		// 		str += "<td class='text-center'  style='word-wrap: break-word;word-break: break-all;' title=''></td>";
		// }
		str += "<td class='text-center td-width' style='width:10%'>";
		str += "<span style='padding-left:10px'><a href='javascript:void(0)' theId='" + realData[i]["repairId"] + "' class='deleteInfo-class'><img src='../img/dele.png' width='18' height='18'></a></span>";
		str += "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	$(".deleteInfo-class").bind("click", function() {
			if(!confirm("是否确认删除?")) {
				return;
			}
			funDeleteAsset(parseInt($(this).attr("theId")));
		})
	}
// --------------------------------------------------查询信息结束---------------------------------------------

//---------------------------------------------------删除--------------------------------------
//资产维护---删除资产
function funDeleteAssetPara(theId) {
	var jsonData = setJson(null, "repairId", parseInt(theId));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("删除资产信息传值=" + jsonData);
	return jsonData;
}

function funDeleteAsset(theId) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairAllocateInfoDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteAssetPara(theId),
		success: function(msg) {
			console.log("删除报修单返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("删除报修单成功", true);
				funGetInfo();
			} else {
				windowStart("删除报修单失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除报修单权限", false);
			} else {
				windowStart("删除报修单失败", false);
			}
		}
	})
}

//---------------------------------------------------获取标签编号
function funGetRepairNumPara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("获取标签编号传值=" + jsonData);
	return jsonData;
}

function funGetRepairNum() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairAssetInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetRepairNumPara(),
		success: function(msg) {
			console.log("获取标签编号传值返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createRepairTable(msg);
			} else {
				windowStart("获取标签编号失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无获取标签编号权限", false);
			} else {
				windowStart("获取标签编号失败", false);
			}
		}
	})
}

function createRepairTable(msg) {
		var theData = msg.item;
		var str = "";
		str += "<ul style='margin:0px;padding:0px'>";
		for(var i = 0; i < theData.length; i++) {
			str += "<li class='li-id-class hide'  theId='" + theData[i]["qrCode"] + "' theName='" + theData[i]["assetName"] + "'>" + theData[i]["assetName"] + "</li>";
		}
		str += "</ul>";
		$("#equipmentNameContent").html(str);
}

// --------------------------------------------------添加信息--------------------------------------------------
//添加信息
function addInfoPara() {
	var jsonData = setJson(null, "qrCode", $("#lableNum").val());
	jsonData = setJson(jsonData, "repairCode", $("#num").val());
	jsonData = setJson(jsonData, "repairContent", $("#content").val());
	jsonData = setJson(jsonData, "repairUser", $("#repairMan").val());
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加信息传值=" + jsonData);
	return jsonData;
}

function addInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairAllocateInfoAddCmd",
		contentType: "application/text,charset=utf-8",
		data: addInfoPara(),
		success: function(msg) {
			console.log("报修单生成返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1){
				funGetInfo();
				windowStart("报修单创建成功", false);
			}else{
				windowStart("报修单创建失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无创建报修单权限", false);
			} else {
				windowStart("创建报修单失败", false);
			}
		}
	})
		$("#addDataModal").modal("hide");
}
// --------------------------------------------------添加信息结束-----------------------------------------------

$(document).ready(function() {
	$('#addDataModal').on('hidden.bs.modal', function () {
  		$("#num").val('');
  		$("#repairMan").val('');
  		$("#content").val('');
  		$("#equipmentName").val('');
  		$("#lableNum").val('');
})
	$(".input-style").datepicker("setValue");
	funGetInfo();
	funGetRepairNum();
	//查询
	$("#btnSearch").click(function() {
		data_page_index = 0;
 		curren_page = 1;
		funGetInfo();
	})
	$("#btnAddInfos").on('click',function(){
		$("#addDataModal").modal('show');
})
			//模糊过滤
	$("#equipmentName").keyup(function() {
			var theValue = $(this).val();
			var realValue = "";
			$(".li-id-class").unbind("click");
			if($(this).val().length > 0) {
				for(var i = 0; i < $(".li-id-class").length; i++) {
					if($(".li-id-class").eq(i).attr("theName").indexOf(theValue) != -1) {
						$(".li-id-class").eq(i).removeClass("hide");
					} else {
						$(".li-id-class").eq(i).addClass("hide");	
					}
				}
			}
			$(".li-id-class").bind("click", function() {
				realValue = $(this).attr("theName");
				$("#equipmentName").val(realValue);
				$("#lableNum").val($(this).attr("theId"));
				$(".li-id-class").addClass("hide");
			});
		})
$("#btnAddRealBtn").on('click',function(){
	var reg1 = /^[\u4e00-\u9fa5a-zA-Z]/;
	var reg2 = /^[\u4e00-\u9fa5a-zA-Z]+[\u4e00-\u9fa5a-zA-Z0-9\-_]*$/;
	if(!$("#num").val()){
		windowStart("请输入编号", false);
		return;
	}
	if(!$("#repairMan").val()){
		windowStart("请输入报修人", false);
		return;
	}
	if(!reg1.test($("#repairMan").val())){
		windowStart("报修人应以中英文开头", false);
		return;
	}
	if(!reg2.test($("#repairMan").val())){
		windowStart("报修人应输入中英文、数字", false);
		return;
	}
	if(!$("#content").val()){
		windowStart("请输入内容", false);
		return;
	}
	if(!$("#equipmentName").val()){
		windowStart("请输入设备名称", false);
		return;
	}
	if(!$("#lableNum").val()){
		windowStart("请输入标签编号", false);
		return;
	}
	addInfo();
})
// $("#btnModalSearch").on('click',function(){
// 	addTable();
// })
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