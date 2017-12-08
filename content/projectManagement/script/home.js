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
var isFinish = 0;
var theEditStatus = 0;
var editData = {};
var isShenHe = -1;
var repair_length = 0;
var is_boHui = -1;
var edit_id = -1;
var companyModal;

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
//查询信息
function funGetBuildInfoPara() {

	// var obj = {};
	// obj.requestCommand = "";
	// obj.responseCommand = "";
	var start_time = "";
	var end_time = "";
	// var searchObj = {};
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
	// searchObj.name = $("#projectName").val();
	// searchObj.startTime = start_time;
	// searchObj.endTime = end_time;
	var jsonData = setJson(null, "name", $("#projectName").val());
	jsonData = setJson(jsonData, "startTime", start_time);
	jsonData = setJson(jsonData, "endTime", end_time);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData,"index",data_page_index);
	jsonData = setJson(jsonData,"number",data_number);
	console.log("查询项目信息传值=" + jsonData);
	return jsonData;
}

function funGetBuildInfo() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
	//	{
	//		windowStart("时间范围有误,请填写时间范围",false);
	//	    return;
	//	}
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
	if ($("#startTime").val().length > 0 && $("#endTime").val().length == 0) {
		windowStart("请输入结束时间", false);
		return;
	}
	if ($("#startTime").val().length == 0 && $("#endTime").val().length > 0) {
		windowStart("请输入开始时间", false);
		return;
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
	repair_length = 0;
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsProjectInfoSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetBuildInfoPara(),
		success: function(msg) {
			loadingStop();
			//			windowRemove();
			console.log("查询项目信息返回值=" + JSON.stringify(msg));
			$("#ptcontent").html("");
			$("#pageNumId").val("");

			createRepairTableInfos(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询项目信息权限", false);
			} else {
				windowStart("查询项目信息失败", false);
			}
			//			windowStart("查询点检信息失败",false);
		}
	})
}

function createRepairTableInfos(msg) {
	if (!msg.item || msg.item.length < 1) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无项目信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
		var total = msg.totalNumber;
		var totalPage = Math.ceil(parseInt(total)/data_number);
		total_page = totalPage;
		$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	//	
	var realData = msg.item;

	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' >序号</th>";
	// str += "<th class='text-center' >项目编号</th>";
	str += "<th class='text-center'>项目名称</th>";
	str += "<th class='text-center'>所属公司</th>";
	str += "<th class='text-center'>负责建筑</th>";

	str += "<th class='text-center'>管理</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < realData.length; i++) {
		str += "<tr >";
		str += "<td class='text-center' style='width:5%' title='" + (i + 1) + "'>" + (i + 1) + "</td>";
		// str += "<td class='text-center'  style='width:25%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["id"] + "</td>";
		str += "<td class='text-center'  style='width:30%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["name"] + "'>" + realData[i]["name"] + "</td>";
		str += "<td class='text-center'  style='width:15%;word-wrap: break-word;word-break: break-all;' title='" + realData[i]["companyName"] + "'>" + realData[i]["companyName"] + "</td>";
		var projectStr = "";
		if (realData[i].item != undefined && realData[i].item.length > 0) {
			var theProJectArr = realData[i].item;

			for (var j = 0; j < theProJectArr.length; j++) {
				projectStr += theProJectArr[j]["buildingName"] + "、";
			}
			projectStr = projectStr.substring(0, projectStr.length - 1);

		}
		str += "<td class='text-center'  style='width:15%;word-wrap: break-word;word-break: break-all;' title='" + projectStr + "'>" + projectStr + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>";
		str += "<span><a class='edit-class' theData='" + JSON.stringify(realData[i]) + "'  theId='" + realData[i]["id"] + "' href='javascript:void(0)'><img src='../img/edit.png' /></a><span>";
		str += "<span style='padding-left:10px'><a theId='" + realData[i]["id"] + "' class='delete-class' href='javascript:void(0)'><img src='../img/dele.png' /></a><span>";

		str += "</td>";

		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	//../../alarmInfo/html/home.html
	$(".edit-class").click(function() {
		edit_id = parseInt($(this).attr("theId"));
		var theData = eval("(" + $(this).attr("theData") + ")");
		$("#editprojectNameCnModal").val(theData.name);
		$("#editcompanyModal").val(theData.companyId);
		$("#editnoteModal").val(theData.note);
		$(".editreal-check-infos").prop("checked", false);
		var projectInfo = theData.item;
		for (var i = 0; projectInfo != undefined && i < projectInfo.length; i++) {
			$(".editreal-check-infos").each(function() {
				if (parseInt(projectInfo[i]["buildingId"]) == parseInt($(this).attr("theId"))) {

					$(this).prop("checked", true);
				}
			})

		}
		$("#editpanelBuild").hide();

		$("#editDataModal").modal("show");
	})

	//删除
	$(".delete-class").click(function() {
		if (!confirm("是否确认删除?")) {
			return;
		}
		funDeleteBuildIngInfo(parseInt($(this).attr("theId")));
	})
}

//添加信息
//添加信息
function funAddProjectInfoCheck() {
	//	var cnCheck = /^[\u4e00-\u9fa5]+$/;
	//	var enReg = /^[a-zA-Z]+$/;
	//允许中英数字，以中英开头
	var cnEnCheck = /^[a-zA-Z\u4e00-\u9fa5]+$/;
	if (!$("#projectNameCnModal").val()) {
		windowStart("请输入项目名称", false);
		return false;
	}
	if (!cnEnCheck.test($("#projectNameCnModal").val())) {
		windowStart("项目名称只能为中英文", false);
		return false;
	}
	if ($("#projectNameCnModal").val().length > 100) {
		windowStart("项目名称不可以超过100个字符", false);
		return false;
	}
	if ($("#companyModal").val() == -1) {
		windowStart("请选择所属公司", false);
		return false;
	}
	if ($(".real-check-infos:checked").length == 0) {
		windowStart("请选择负责建筑", false);
		return false;
	}
	//	if(!$("#noteModal").val())
	//	{
	//		windowStart("请输入备注",false);
	//		return false;
	//	}
	if ($("#noteModal").val().length > 1000) {
		windowStart("备注不能超过1000个字符", false);
		return false;
	}
	return true;
}

function funAddBuildIngInfoPara() {
	// var obj = {};
	// obj.requestCommand = "";
	// obj.responseCommand = "";
	// var dataObj = {};
	// var dataArr = [];
	// dataObj.id = -1;
	var name = $("#projectNameCnModal").val();
	var companyId = $("#companyModal").val();
	// dataObj.companyName = $("#companyModal option:selected").text();
	var item = [];
	if ($(".real-check-infos:checked").length > 0) {
		for (var i = 0; i < $(".real-check-infos:checked").length; i++) {
			// var buildOBJ = {};
			// buildOBJ.buildingId = parseInt($(".real-check-infos:checked").eq(i).attr("theId"));
			// buildOBJ.buildingName = $(".real-check-infos:checked").eq(i).attr("theName");
			item.push(parseInt($(".real-check-infos:checked").eq(i).attr("theId")));
		}
	} else {
		item = [];
	}

	var note = $("#noteModal").val();
	// dataObj.insertTime = "";
	// dataObj.updateTime = "";
	// dataArr.push(dataObj);
	var jsonData = setJson(null, "name", name);
	jsonData = setJson(jsonData, "companyId", parseInt(companyId));
	// jsonData = setJson(jsonData, "bulidIds", item.join(','));
	if(item.length==1){
		jsonData = setJson(jsonData, "bulidIds", item[0]+',');
	}else{
		jsonData = setJson(jsonData, "bulidIds", item.join(','));	
	}
	jsonData = setJson(jsonData, "note", note);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//		jsonData = setJson(jsonData,"index",data_page_index);
	//		jsonData = setJson(jsonData,"number",data_number);
	console.log("添加项目信息传值=" + jsonData);
	return jsonData;
}

function funAddBuildIngInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsProjectInfoAddCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddBuildIngInfoPara(),
		success: function(msg) {
			console.log("添加项目信息信息返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addDataModal").modal("hide");
				windowStart("添加项目信息成功", true);
				funGetBuildInfo();
			} else if (msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("项目名称已存在", false);
			} else {
				windowStart("添加项目信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无添加项目信息信息权限", false);
			} else {
				windowStart("添加项目信息失败", false);
			}
		}
	})
}

//修改
function funEditProjectInfoCheck() {
	if (!$("#editprojectNameCnModal").val()) {
		windowStart("请输入项目名称", false);
		return false;
	}
	var cnEnCheck = /^[a-zA-Z\u4e00-\u9fa5]+$/;
	if (!cnEnCheck.test($("#editprojectNameCnModal").val())) {
		windowStart("项目名称只能为中英文", false);
		return false;
	}
	if ($("#editprojectNameCnModal").val().length > 100) {
		windowStart("项目名称不可以超过100个自己", false);
		return false;
	}
	if ($("#editcompanyModal").val()==-1) {
		windowStart("请选择所属公司", false);
		return false;
	}
	if ($(".editreal-check-infos:checked").length == 0) {
		windowStart("请选择负责建筑", false);
		return false;
	}
	//	if(!$("#editnoteModal").val())
	//	{
	//		windowStart("请输入备注",false);
	//		return false;
	//	}
	if ($("#editnoteModal").val().length > 1000) {
		windowStart("备注不能超过1000个字符", false);
		return false;
	}
	return true;
}

function funEditBuildIngInfoPara() {
	// var obj = {};
	// obj.requestCommand = "";
	// obj.responseCommand = "";
	// var dataObj = {};
	// var dataArr = [];
	var id = edit_id;
	var name = $("#editprojectNameCnModal").val();
	var companyId = $("#editcompanyModal").val();
	// dataObj.companyName = $("#companyModal option:selected").text();
	var item = [];
	if ($(".editreal-check-infos:checked").length > 0) {
		for (var i = 0; i < $(".editreal-check-infos:checked").length; i++) {
			// var buildOBJ = {};
			// buildOBJ.buildingId = parseInt($(".editreal-check-infos:checked").eq(i).attr("theId"));
			// buildOBJ.buildingName = $(".editreal-check-infos:checked").eq(i).attr("theName");
			item.push(parseInt($(".editreal-check-infos:checked").eq(i).attr("theId")));
		}
	} else {
		item = [];
	}

	var note = $("#editnoteModal").val();
	var jsonData = setJson(null, "name", name);
	jsonData = setJson(jsonData, "id", id);
	jsonData = setJson(jsonData, "companyId", parseInt(companyId));
	if(item.length==1){
		jsonData = setJson(jsonData, "bulidIds", item[0]+',');
	}else{
		jsonData = setJson(jsonData, "bulidIds", item.join(','));	
	}
	jsonData = setJson(jsonData, "note", note);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//		jsonData = setJson(jsonData,"index",data_page_index);
	//		jsonData = setJson(jsonData,"number",data_number);
	console.log("修改项目信息传值=" + jsonData);
	return jsonData;
}

function funEditBuildIngInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsProjectInfoUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funEditBuildIngInfoPara(),
		success: function(msg) {
			console.log("修改项目信息信息返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editDataModal").modal("hide");
				windowStart("修改项目信息成功", true);
				funGetBuildInfo();
			} else if (msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("项目名称已存在", false);
			}else {
				windowStart("修改项目信息失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无修改项目信息信息权限", false);
			} else {
				windowStart("修改项目信息失败", false);
			}
		}
	})
}

//删除
function funDeleteBuildIngInfoPara(theId) {
	// var obj = {};
	// obj.requestCommand = "";
	// obj.responseCommand = "";
	// var dataObj = {};
	// var dataArr = [];
	var id = theId;
	// dataObj.name = "";
	// dataObj.companyId = -1;
	// dataObj.companyName = "";
	// dataObj.item = [];
	// dataObj.note = "";
	// dataObj.insertTime = "";
	// dataObj.updateTime = "";
	// dataArr.push(dataObj);
	var jsonData = setJson(null, "id", id);
	// jsonData = setJson(jsonData, "queryItem", {});
	// jsonData = setJson(jsonData, "item", dataArr);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//		jsonData = setJson(jsonData,"index",data_page_index);
	//		jsonData = setJson(jsonData,"number",data_number);
	console.log("删除项目信息传值=" + jsonData);
	return jsonData;
}

function funDeleteBuildIngInfo(theId) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsProjectInfoDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteBuildIngInfoPara(theId),
		success: function(msg) {
			console.log("删除项目信息信息返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("删除项目信息成功", true);
				funGetBuildInfo();
			} else if (msg.resp.responseCommand.toUpperCase().indexOf("OCCUPY") != -1) {
				windowStart("该项目有关联数据不能删除", false);
			} else {
				windowStart("删除项目信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无删除项目信息信息权限", false);
			} else {
				windowStart("删除项目信息失败", false);
			}
		}
	})
}

//获取项目和公司信息
function getSystemInfosPara() {
	var obj = {};
	obj.requestCommand = "";
	obj.responseCommand = "";
	var jsonData = setJson(null, "resp", obj);
	jsonData = setJson(jsonData, "buildItem", "", true);
	jsonData = setJson(jsonData, "defaultValue", "", true);
	jsonData = setJson(jsonData, "companyItem", "", true);
	jsonData = setJson(jsonData, "accountName", localStorage.getItem("userAccountName"));
	//		jsonData = setJson(jsonData,"index",data_page_index);
	//		jsonData = setJson(jsonData,"number",data_number);
	console.log("查询建筑和公司信息传值=" + jsonData);
	return jsonData;
}

function getSystemInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsGetCompanyAndBuildCmd",
		contentType: "application/text,charset=utf-8",
		data: getSystemInfosPara(),
		success: function(msg) {
			console.log("获取公司和建筑信息信息返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createSysInfoList(msg);
			} else {
				windowStart("取建筑和公司信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无获取建筑和公司信息信息权限", false);
			} else {
				windowStart("取建筑和公司信息失败", false);
			}
		}
	})
}

function createSysInfoList(msg) {
	if (msg.buildItem != undefined && msg.buildItem.length > 0) {
		var theData = msg.buildItem;
		var str = "";
		var editStr = "";
		for (var i = 0; i < theData.length; i++) {
			str += '<div class="checkbox" style="float:left">';
			str += "<label>";
			str += '<input class="real-check-infos" theId="' + theData[i]["id"] + '" theName="' + theData[i]["name"] + '" type="checkbox">';
			str += theData[i]["name"];
			str += "</label>";
			str += "</div>";
			editStr += '<div class="checkbox" style="float:left">';
			editStr += "<label>";
			editStr += '<input class="editreal-check-infos" theId="' + theData[i]["id"] + '" theName="' + theData[i]["name"] + '" type="checkbox">';
			editStr += theData[i]["name"];
			editStr += "</label>";
			editStr += "</div>";
		}
		$("#buildContent").html(str);
		$("#editbuildContent").html(editStr);
	}
	companyModal = msg;
	if (msg.companyItem != undefined && msg.companyItem.length > 0) {
		var theData = msg.companyItem;
		var str = "";

		for (var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["id"] + "'>" + theData[i]["name"] + "</optioin>";
		}
		$("#companyModal").append(str);
		$("#editcompanyModal").append(str);
	}
}

$(document).ready(function() {
	$(".date-picker").datepicker("setValue");
	$(".date-picker").val("");
	getSystemInfos();
	//添加
	$("#btnAddInfos").click(function() {
		//		$("#factoryShengModal").val("省份");
		//		$("#factoryCityModal").val("市");
		//		$("#factoryAreaModal").val("区、县");
		$("#projectNameCnModal").val("");
		$("#companyModal").val("");
		$("#noteModal").val("");
		$("#panelBuild").hide();
		$(".real-check-infos").prop("checked", false);
		$("#addDataModal").modal("show");
	})
	$("#btnAddMadeInfo").click(function() {

		if (!funAddProjectInfoCheck()) {
			return;
		}
		funAddBuildIngInfo();
	})

	//添加结束
	//查询
	$("#btnSearchRepair").click(function() {

				data_page_index = 0;
				curren_page = 1;
				total_page = 0;
		funGetBuildInfo();
	})

	//上一页
	$("#btnPageBefore").click(function() {
					if(total_page == 0)
					{
						return;
					}
					
					if(curren_page == 1)
					{
						windowStart("当前为首页",false);
						return;
					}
					data_page_index -= data_number;
					curren_page -= 1;
			funGetBuildInfo();
		})
		//下一页
	$("#btnPageNext").click(function() {
					if(total_page == 0)
					{
						return;
					}
					
					if(total_page == curren_page)
					{
						windowStart("当前为尾页",false);
						return;
					}
					data_page_index += data_number;
					curren_page += 1;
			funGetBuildInfo();
		})
		//跳转页
	$("#btnPageJump").click(function() {
					if(total_page == 0)
					{
						return;
					}
					
					var numReg = /^[0-9]+$/;
					if(!numReg.test($("#pageNumId").val()))
					{
						windowStart("页码输入有误",false);
						return;
					}
					if(parseInt($("#pageNumId").val()) < 1 )
					{
						windowStart("页码输入有误",false);
						return;
					}
					if(parseInt($("#pageNumId").val()) > total_page)
					{
						windowStart("页码输入有误",false);
						return;
					}
					data_page_index = (parseInt($("#pageNumId").val()) - 1)*data_number;
					curren_page = parseInt($("#pageNumId").val());
			funGetBuildInfo();
		})
		//查询结束

	//修改 
	$("#btnEditMadeInfo").click(function() {
			if (!funEditProjectInfoCheck()) {
				return;
			}
			funEditBuildIngInfo();
		})
		//修改结束

	$("#dropdownMenu1").click(function() {
		$("#panelBuild").toggle();
	})
	$("#btnSureCheck").click(function() {
		$("#panelBuild").hide();
	})

	$("#theEditBuild").click(function() {
		$("#editpanelBuild").toggle();
	})
	$("#editbtnSureCheck").click(function() {
			$("#editpanelBuild").hide();
		})
		//	$("span[aria-hidden='true']").click(function(){
		//		$("#panelBuild").hide();
		//	})
		//	$(".modal-open").click(function(){
		//		alert(1);
		//	})

	funGetBuildInfo();
})