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
var edit_id = -1;

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
//查询信息
function funGetJobInfoPara() {

	var jsonData = setJson(null, "jobName", $("#projectName").val());
   jsonData = setJson(jsonData, "index", data_page_index);
   jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("查询职位信息传值=" + jsonData);
	return jsonData;
}

function funGetJobInfo() {

	$("#ptcontent").html("");

	loadingStart("ptcontent");

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsJobManageSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetJobInfoPara(),
		success: function(msg) {
			loadingStop();

			console.log("查询职位信息返回值=" + JSON.stringify(msg));

			$("#ptcontent").html("");
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createJobTableInfos(msg);
			} else {
				windowStart("查询职位信息失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询职位信息权限", false);
			} else {
				windowStart("查询职位信息失败", false);
			}

		}
	})
}

function createJobTableInfos(msg) {
	if(!msg.item || msg.item.length < 1) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无职位信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
   total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");
	var realData = msg.item;
   
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' >序号</th>";
	str += "<th class='text-center'>职位名称</th>";
	str += "<th class='text-center'>备注</th>";
	str += "<th class='text-center'>管理</th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		str += "<tr >";
		str += "<td class='text-center' style='width:5%'>" + (i + 1) + "</td>";
		str += "<td class='text-center'  style='width:25%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["jobName"] + "</td>";
		str += "<td class='text-center'  style='width:30%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["note"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>";
		str += "<span><a class='edit-class' theData='" + JSON.stringify(realData[i]) + "'  theId='" + realData[i]["jobId"] + "' href='javascript:void(0)'><img src='../img/edit.png' /></a><span>";
		str += "<span style='padding-left:10px'><a theId='" + realData[i]["jobId"] + "' class='delete-class' href='javascript:void(0)'><img src='../img/dele.png' /></a><span>";

		str += "</td>";

		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	//../../alarmInfo/html/home.html
	$(".edit-class").click(function() {
		edit_id = parseInt($(this).attr("theId"));
		var theData = eval("(" + $(this).attr("theData") + ")");
		$("#editprojectNameCnModal").val(theData.jobName);
		$("#editnoteModal").val(theData.note);

		$("#editDataModal").modal("show");
	})

	//删除
	$(".delete-class").click(function() {
		if(!confirm("是否确认删除?")) {
			return;
		}
		funDeleteJobInfo(parseInt($(this).attr("theId")));
	})
}

//添加信息
//添加信息
function funAddProjectInfoCheck() {

	if(!$("#projectNameCnModal").val()) {
		windowStart("请输入职位名称", false);
		return false;
	}
	var check = /^[a-zA-Z\u4e00-\u9fa5]+$/;     //只能为中英文
	if( !check.test($("#projectNameCnModal").val())) {
		windowStart("职位名称只能为中、英文", false);
		return false;
	}
	if($("#noteModal").val().length > 1000) {
		windowStart("备注不能超过1000个字符", false);
		return false;
	}
	return true;
}

function funAddBuildIngInfoPara() {

	var jsonData = setJson(null, "jobId", -1);
	jsonData = setJson(jsonData, "jobName", $("#projectNameCnModal").val());
	jsonData = setJson(jsonData, "note", $("#noteModal").val());
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("添加职位信息传值=" + jsonData);
	return jsonData;
}

function funAddJobInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsJobManageAddCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddBuildIngInfoPara(),
		success: function(msg) {
			console.log("添加项目信息信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addDataModal").modal("hide");
				windowStart("添加职位信息成功", true);
				funGetJobInfo();
			}else if(msg.failReason == "职位名称已存在"){
				windowStart("职位名称已存在", false);
			}else {
				windowStart("添加职位信息失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无添加职位信息信息权限", false);
			} else {
				windowStart("添加职位信息失败", false);
			}
		}
	})
}

//修改

function funEditBuildIngInfoPara() {
	var jsonData = setJson(null, "jobId", edit_id);
	jsonData = setJson(jsonData, "jobName", $("#editprojectNameCnModal").val());
	jsonData = setJson(jsonData, "note", $("#editnoteModal").val());
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("修改职位信息传值=" + jsonData);
	return jsonData;
}

function funEditJobInfo() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsJobManageUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funEditBuildIngInfoPara(),
		success: function(msg) {
			console.log("修改项目信息信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editDataModal").modal("hide");
				windowStart("修改项职位信息成功", true);
				funGetJobInfo();
			} else {
				windowStart(msg.failRason, false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改职位信息信息权限", false);
			} else {
				windowStart("修改职位信息失败", false);
			}
		}
	})
}

//删除
function funDeleteBuildIngInfoPara(theId) {
	var jsonData = setJson(null, "jobId", theId);
	jsonData = setJson(jsonData, "jobName", "");
	jsonData = setJson(jsonData, "note", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("删除职位信息传值=" + jsonData);
	return jsonData;
}

function funDeleteJobInfo(theId) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsJobManageDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteBuildIngInfoPara(theId),
		success: function(msg) {
			console.log("删除职位信息信息返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("删除职位信息成功", true);
				funGetJobInfo();
			}else if(msg.responseCommand.toUpperCase().indexOf("OCCUPY") != -1) {
				windowStart("已被占用不能删除", false);
				funGetJobInfo();
			} 
			else {
				windowStart("删除职位信息失败", false);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除职位信息信息权限", false);
			} else {
				windowStart("删除职位信息失败", false);
			}
		}
	})
}

$(document).ready(function() {
	$('#addDataModal').on('hidden.bs.modal', function () {
		$("#projectNameCnModal").val('');
		$("#noteModal").val('');

	})
	$('#editDataModal').on('hidden.bs.modal', function () {
		$("#editprojectNameCnModal").val('');
		$("#editnoteModal").val('');
		
	})
	funGetJobInfo();
	//添加
	$("#btnAddInfos").click(function() {

		$("#addDataModal").modal("show");
	})
	$("#btnAddMadeInfo").click(function() {

		if(!funAddProjectInfoCheck()) {
			return;
		}
		funAddJobInfo();
	})

	//添加结束
	//查询
	$("#btnSearchRepair").click(function() {
        data_page_index = 0;
		curren_page=1;
		$("#pageNumId").val("");
		funGetJobInfo();
	})

	//修改 
	$("#btneditMadeInfo").click(function() {
			if(!$("#editprojectNameCnModal").val()) {
				windowStart("请输入职位名称", false);
				return;
			}
			if($("#editnoteModal").val().length > 1000) {
				windowStart("备注不能超过1000个字符", false);
				return;
			}
			funEditJobInfo();
		})
		//修改结束

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
			funGetJobInfo();
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
			funGetJobInfo();
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
			funGetJobInfo();
			$("#pageNumId").val("");
		})
		//分页操作

})