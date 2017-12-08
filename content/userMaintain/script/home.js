var theNum = 0;
var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var li_index = 0;
var add_userId = "";
var isNext = false;
var userTypeInfos;
var positionModalInfos;
var tips;
var edit_userContact_account = "";
var is_edit_add_account = false;
var node_click_info = "";
var organizationId;

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

//用户维护---获取角色，职位
function funSearchSysInfosPara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询职位传值=" + jsonData);
	return jsonData;
}

function funSearchSysInfos() {
	$("#companySelect").html("");
	$("#companyModal").html("");
	$("#userType").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsViewRoleAndQuartersSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funSearchSysInfosPara(),
		success: function(msg) {
			console.log("查询职位返回值=" + JSON.stringify(msg));
			createSysInfos(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询职位信息权限", false);
			} else {
				windowStart("查询职位信息失败", false);
			}
		}
	})
}

function createSysInfos(msg) {
	positionModalInfos = msg;
	if (msg.quarters != undefined && msg.quarters.length > 0) {
		var realData = msg.quarters;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 0; i < realData.length; i++) {
			str += "<option value='" + realData[i]["id"] + "'>" + realData[i]["name"] + "</option>";
		}
		$("#positionModal").html(str);
		$("#positionModal1").html(str);
		//	$("#companyModal").html(str);
		//	$("#editcompanyModal").html(str);
	}
	userTypeInfos = msg;
	if (msg.viewRole != undefined && msg.viewRole.length > 0) {
		var realData = msg.viewRole;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 0; i < realData.length; i++) {
			str += "<option value='" + realData[i]["id"] + "'>" + realData[i]["name"] + "</option>";
		}
		$("#userType").html(str);
		$("#edituserType").html(str);
	}
}

//用户维护---获取物业公司和角色
// function funGetSysInfosPara() {
// 	var jsonData = setJson(null, "requestCommand", "");
// 	jsonData = setJson(jsonData, "responseCommand", "");
// 	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
// 	console.log("查询角色和公司传值=" + jsonData);
// 	return jsonData;
// }

// function funGetSysInfos() {
// 	$("#userType").html("");
// 	loadingStart("dataRealContent1");
// 	$.ajax({
// 		type: "post",
// 		dataType: 'json',
// 		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleAndPropertySearchCmd",
// 		contentType: "application/text,charset=utf-8",
// 		data: funGetSysInfosPara(),
// 		success: function(msg) {
// 			loadingStop();
// 			console.log("查询角色和公司返回值=" + JSON.stringify(msg));
// 			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
// 				//$("#ptcontent").html("<div style='position:relative;width:100%;top:30%;text-align:center;font-size:28px;font-weight:bold'>请按条件查询用户信息</div>");
// 				createSysInfosSelect(msg);
// 				funSearchUserInfos();
// 			} else {
// 				windowStart("查询角色和公司信息失败", false);
// 			}
// 		},
// 		error: function(XMLHttpRequest, textStatus, errorThrown) {
// 			loadingStop();
// 			//windowStart("查询角色和公司信息失败",false);
// 			var xmlRequest = XMLHttpRequest.status;
// 			if (xmlRequest == "401") {
// 				windowStart("当前用户无查询角色和公司信息权限", false);
// 			} else {
// 				windowStart("查询角色和公司信息失败", false);
// 			}
// 		}
// 	})
// }

// function createSysInfosSelect(msg) {
// 	//	if(msg.roleItmes != undefined && msg.roleItmes.length > 0 )
// 	//	{
// 	//		var  realData =  msg.roleItmes;
// 	//		var str = "<option value=''>请选择</option>";
// 	//		for( var i = 0 ; i < realData.length; i++ )
// 	//		{
// 	//			str += "<option value='"+realData[i]["classifyId"]+"'>"+realData[i]["nameCn"]+"</option>";
// 	//		}
// 	//		
// 	//		$("#userType").html(str);
// 	//		$("#edituserType").html(str);
// 	//	}
// 	if (msg.PropertyItmes != undefined && msg.PropertyItmes.length > 0) {
// 		var realData = msg.PropertyItmes;
// 		var str = "<option value=''>请选择</option>";
// 		for (var i = 0; i < realData.length; i++) {
// 			str += "<option value='" + realData[i]["classifyId"] + "'>" + realData[i]["nameCn"] + "</option>";
// 		}
// 		$("#companySelect").html(str);
// 		//	$("#companyModal").html(str);
// 		//	$("#editcompanyModal").html(str);
// 	}
// 	//	var total = msg.totalNumber;
// 	//	var totalPage = Math.ceil(parseInt(total)/data_number);
// 	//	total_page = totalPage;
// 	//	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
// 	//	
// }

// 用户维护－－－添加基本信息
function funAddUserInfosPara() {
	var propertyClassifyId = -1;
	var roleClassifyId = -1;
	//	if($("#companyModal").val().length > 0 )
	//	{
	//		propertyClassifyId = parseInt($("#companyModal").val());
	//	}
	if ($("#userType").val().length > 0) {
		roleClassifyId = parseInt($("#userType").val());
	}
	if (node_click_info != "") {
		var theNodeInfo = eval("(" + node_click_info + ")");
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", -1);
	jsonData = setJson(jsonData, "personName", $("#userName").val());
	jsonData = setJson(jsonData, "PWD", $("#userPassword").val());
	jsonData = setJson(jsonData, "userPicture", "");
	jsonData = setJson(jsonData, "account", $("#userAccount").val());
	jsonData = setJson(jsonData, "viewRoleId", roleClassifyId);
	// if (node_click_info == "") {
	// 	jsonData = setJson(jsonData, "OrganizationId", -1);
	// } else {
	// 	jsonData = setJson(jsonData, "OrganizationId", theNodeInfo.id);
	// }
	if (!$("#departmentModal").val()) {
		jsonData = setJson(jsonData, "OrganizationId", -1);
	} else {
		if(node_click_info == ""){
			jsonData = setJson(jsonData, "OrganizationId", -1);
		}else{
			jsonData = setJson(jsonData, "OrganizationId", theNodeInfo.id);
		}
	}
	if ($("#positionModal").val() == "") {
		jsonData = setJson(jsonData, "quartersId", -1);
	} else {
		jsonData = setJson(jsonData, "quartersId", parseInt($("#positionModal").val()));
	}

	//	jsonData = setJson(jsonData,"roleClassifyId",roleClassifyId);
	//	jsonData = setJson(jsonData,"propertyClassifyId",propertyClassifyId);
	jsonData = setJson(jsonData, "insertTime", "");
	jsonData = setJson(jsonData, "updateTime", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加用户传值=" + jsonData);
	return jsonData;
}

function funAddUserInfos() {
	//	$("#dataRealContent1").html("");
	//	loadingStart("dataRealContent1");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAccountAddCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddUserInfosPara(),
		success: function(msg) {
			//loadingStop();
			console.log("添加用户返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				add_userId = msg.requestCommand;
				windowStart("添加用户信息成功", true);
				if (isNext) {
					$("#lanelModal").modal("hide");
					$("#lanelModal2").modal("show");
				} else {
					$("#lanelModal").modal("hide");
				}
				$(".user-basicInfo").val("");
				funSearchUserInfos();
			} else if (msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("账号已存在", false);
			} else {
				windowStart("添加用户信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无添加用户信息权限", false);
			} else {
				windowStart("添加用户信息失败", false);
			}
		}
	})
}

// 用户维护－－－添加联系方式
function funAddUserContactCheck() {
	//	var telReg = /^[0-9]{3,4}[-]{1}[0-9]{7-8}$/;
	//	var phoneReg = /^[0-9]{11}$/;
	var qqReg = /^[0-9]+$/;
	var mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	var telReg = /^([0-9]{3,4}-){1}[0-9]{7,8}$/;
	var phoneReg = /^((13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|147[0-9]{8}|173[0-9]{8}|176[0-9]{8}|177[0-9]{8}|1349[0-9]{7})$)/;
	if ($("#userphone").val().length > 0) {
		if (!telReg.test($("#userphone").val())) {
			windowStart("请填写正确的固话,如020-12312312", false);
			return false;
		}
	}
	if ($("#userphone2").val().length > 0) {
		if (!phoneReg.test($("#userphone2").val())) {
			windowStart("请填写正确的手机号码,如13100000000", false);
			return false;
		}
	}
	if ($("#qqId").val().length > 0) {
		if (!qqReg.test($("#qqId").val())) {
			windowStart("QQ号码只能为数字", false);
			return false;
		}
	}
	if ($("#userEmail").val().length > 0) {
		if (!mailReg.test($("#userEmail").val())) {
			windowStart("邮箱格式不正确", false);
			return false;
		}
	}
	return true;
}

function funAddUserContactPara() {
	//	var contact_arr = [];
	var itemStr = "";
	for (var i = 0; i < $(".user-contact").length; i++) {
		//		var obj = {};
		//		obj.id = -1;
		//		obj.userID = parseInt(add_userId);
		//		obj.contactType = parseInt($(".user-contact").eq(i).attr("theNum"));
		//		obj.contactValue = $(".user-contact").eq(i).val();
		//		
		//		contact_arr.push(obj);
		var valueitemStr = setJson(null, "id", -1);
		valueitemStr = setJson(valueitemStr, "userID", -1);
		valueitemStr = setJson(valueitemStr, "contactType", parseInt($(".user-contact").eq(i).attr("theNum")));
		valueitemStr = setJson(valueitemStr, "contactValue", $(".user-contact").eq(i).val());
		itemStr += valueitemStr + ",";
	}
	itemStr = itemStr.substring(0, itemStr.length - 1);
	var theAccount = "";
	if (is_edit_add_account) {
		theAccount = edit_userContact_account;
	} else {
		theAccount = add_userId;
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "account", theAccount);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "items", itemStr, true);
	console.log("添加用户联系方式传值=" + jsonData);
	return jsonData;
}

function funAddUserContact() {
	//	$("#dataRealContent1").html("");
	//	loadingStart("dataRealContent1");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=User_Contact_InfoAddCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddUserContactPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("添加用户联系方式返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#lanelModal2").modal("hide");
				windowStart("添加用户联系方式成功", true);
				funSearchUserInfos();
			} else {
				windowStart("添加用户联系方式失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//loadingStop();
			//windowStart("添加用户联系方式失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无添加用户联系方式权限", false);
			} else {
				windowStart("添加用户联系方式失败", false);
			}
		}
	})
}



//用户维护---查询
function funSearchUserInfosPara() {
	var theValue = -1;
	// if ($("#companySelect").val().length > 0) {
	// 	theValue = parseInt($("#companySelect").val());
	// }
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "word", $("#keyWord").val());
	jsonData = setJson(jsonData, "propertyClassifyId", -1);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询用户传值=" + jsonData);
	return jsonData;
}

function funSearchUserInfos() {
	$("#dataRealContent1").html("");
	loadingStart("dataRealContent1");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAccountSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funSearchUserInfosPara(),
		success: function(msg) {
			loadingStop();
			$("#dataRealContent1").html("");
			console.log("查询用户返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createUserTable(msg);
			} else {
				windowStart("查询用户信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			$("#dataRealContent1").html("");
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询用户信息权限", false);
			} else {
				windowStart("查询用户信息失败", false);
			}
		}
	})
}

function createUserTable(msg) {
	if (!msg.accountItmes || msg.accountItmes.length < 1) {
		$("#dataRealContent1").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无用户信息";
		str += "</div>";
		$("#dataRealContent1").html(str);
		return;
	}
	total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");
	var basisData = msg.accountItmes;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center td-width'>账号</th>";
	str += "<th class='text-center td-width'>中文名</th>";
	str += "<th class='text-center td-width'>角色</th>";
	str += "<th class='text-center td-width'>公司</th>";
	str += "<th class='text-center td-width'>部门</th>";
	str += "<th class='text-center td-width'>职位</th>";
	str += "<th class='text-center td-width'>联系信息</th>";
	str += "<th class='text-center td-width'>管理</th>";
	str += "</thead><tbody>";
	for (var i = 0; i < basisData.length; i++) {
		str += "<tr  >";
		str += "<td class='text-center td-width' title='" + basisData[i]["account"] + "'>" + basisData[i]["account"] + "</td>";
		str += "<td class='text-center td-width' title='" + basisData[i]["nameCn"] + "'>" + basisData[i]["nameCn"] + "</td>";
		str += "<td class='text-center td-width' title='" + basisData[i]["viewRole"] + "'>" + basisData[i]["viewRole"] + "</td>";
		str += "<td class='text-center td-width' title='" + basisData[i]["companyCn"] + "'>" + basisData[i]["companyCn"] + "</td>";
		if (basisData[i].OrganizationCn != undefined && basisData[i].OrganizationCn.length > 0) {
			str += "<td class='text-center td-width' title='" + basisData[i]["OrganizationCn"] + "'>" + basisData[i]["OrganizationCn"] + "</td>";
		} else {
			str += "<td class='text-center td-width' ></td>";
		}
		if (basisData[i].quartersCn != undefined && basisData[i].quartersCn.length > 0) {
			str += "<td class='text-center td-width' title='" + basisData[i]["quartersCn"] + "'>" + basisData[i]["quartersCn"] + "</td>";
		} else {
			str += "<td class='text-center td-width'></td>";
		}
		if (basisData[i].contactItmes != undefined && basisData[i].contactItmes.length > 0) {
			var contactData = basisData[i].contactItmes;
			var times = 0;
			for (var j = 0; j < contactData.length; j++) {
				if (contactData[j]["contactValue"] == "") {
					times++;
				}
			}
			if (times == contactData.length) {
				str += "<td class='text-center td-width'></td>";
			} else {
				str += "<td class='text-center td-width'><a href='javascript:void(0)'  data='" + JSON.stringify(contactData) + "' class='contact-class'>查看</a></td>";
			}

		} else {
			str += "<td class='text-center td-width'></td>";
		}
		//		var contact_info = parseInt(contactData[i]["contactType"]);
		//		var theValue = "";
		//		if(basisData[i].contactItmes != undefined && basisData[i].contactItmes.length > 0 )
		//		{
		//			var contactData = basisData[i].contactItmes;
		//			for(var j = 0 ; j < contactData.length ; j++ ){
		//				str += "<td class='text-center td-width'>"+contactData[j]["contactValue"]+"</td>";
		//			}
		//		}
		//		else
		//		{
		//			str += "<td class='text-center td-width'></td>";
		//			str += "<td class='text-center td-width'></td>";
		//			str += "<td class='text-center td-width'></td>";
		//			str += "<td class='text-center td-width'></td>";
		//			str += "<td class='text-center td-width'></td>";
		//			str += "<td class='text-center td-width'></td>";
		//			str += "<td class='text-center td-width'></td>";
		//		}
		str += "<td class='text-center td-width'>";
		str += "<span><a href='javascript:void(0)' basisData='" + JSON.stringify(basisData[i]) + "' class='editBasicUserInfo-class'><img src='../img/edit.png' width='18' height='18'></a></span>";
		//		str += "<span style='padding-left:6px'><a href='javascript:void(0)' basisData='"+JSON.stringify(basisData[i])+"' class='editContactUserInfo-class'>修改</a></span>";
		str += "<span  style='padding-left:6px'><a href='javascript:void(0)' contactData='" + JSON.stringify(basisData[i].contactItmes) + "'  account='" + basisData[i]["account"] + "' class='editContact-class'><img src='../img/editadd.png' width='18' height='18'></a></span>";

		str += "<span style='padding-left:6px'><a href='javascript:void(0)'  account='" + basisData[i]["account"] + "' class='deleteUser-class'><img src='../img/dele.png' width='18' height='18'></a></span>";
		str += "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#dataRealContent1").html(str);
	$(".deleteUser-class").click(function() {
		if (!confirm("是否确认删除?")) {
			return;
		}
		deleteUserInfos($(this).attr("account"));
	})
	$(".editBasicUserInfo-class").click(function() {
		var theData = eval("(" + $(this).attr("basisData") + ")");
		$("#edituserAccount").val(theData.account);
		organizationId = theData.OrganizationId;
		$("#edituserPassword").val(theData.password);
		$("#edituserPasswordSure").val(theData.password);
		$("#edituserName").val(theData.nameCn);
		$("#edituserType").val(theData.viewRoleId);
		$("#departmentModal1").val(theData.OrganizationCn);
		$("#positionModal1").val(theData.quartersId);
		$("#editUserModal").modal("show");
	})
	$(".editContact-class").click(function() {
		edit_userContact_account = $(this).attr("account");
		if ($(this).attr("contactData") == "undefined") {
			is_edit_add_account = true;
			//			if(!confirm("此用户尚未添加联系信息,现在是否添加?")){
			//				return;
			//			}
			//			edit_add_account = $(this).attr("account");
			$("#lanelModal2").modal("show");
			return;
		}
		var editData = eval("(" + $(this).attr("contactData") + ")");
		for (var i = 0; i < editData.length; i++) {
			switch (parseInt(editData[i]["contactType"])) {
				case 1:
					$("#userphone3").val(editData[i]["contactValue"]);
					break;
				case 2:
					$("#userphone4").val(editData[i]["contactValue"]);
					break;
				case 4:
					$("#weixin2").val(editData[i]["contactValue"]);
					break;
				case 5:
					$("#weibo2").val(editData[i]["contactValue"]);
					break;
				case 6:
					$("#gonggonghao2").val(editData[i]["contactValue"]);
					break;
				case 7:
					$("#qqId2").val(editData[i]["contactValue"]);
					break;
				case 8:
					$("#userEmail2").val(editData[i]["contactValue"]);
					break;
			}
		}
		$("#editUserModal2").modal("show");
	})
	$(".contact-class").click(function() {
		$("#contact").html("");
		var basisData = eval("(" + $(this).attr("data") + ")");
		var str = "";
		str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
		str += "<th class='text-center td-width'>固话</th>";
		str += "<th class='text-center td-width'>移动电话</th>";
		str += "<th class='text-center td-width'>微信</th>";
		str += "<th class='text-center td-width'>微博</th>";
		str += "<th class='text-center td-width'>公众号</th>";
		str += "<th class='text-center td-width'>QQ</th>";
		str += "<th class='text-center td-width'>邮箱</th>";
		str += "</thead><tbody>";
		str += "<tr >";
		if (basisData != undefined && basisData.length > 0) {
			var contactData = basisData;
			for (var j = 0; j < contactData.length; j++) {
				str += "<td class='text-center td-width'>" + contactData[j]["contactValue"] + "</td>";
			}
		} else {
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "<td class='text-center td-width'></td>";
			str += "</tr>";
		}
		str += "</tbody><table>";
		$("#contact").html(str);
		$("#contactModal").modal("show");
	})
}
//用户----删除
function deleteUserInfosPara(account) {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", -1);
	jsonData = setJson(jsonData, "personName", "");
	jsonData = setJson(jsonData, "PWD", "");
	jsonData = setJson(jsonData, "userPicture", "");
	jsonData = setJson(jsonData, "account", account);
	jsonData = setJson(jsonData, "viewRoleId", -1);
	jsonData = setJson(jsonData, "OrganizationId", -1);
	jsonData = setJson(jsonData, "quartersId", -1);
	jsonData = setJson(jsonData, "insertTime", "");
	jsonData = setJson(jsonData, "updateTime", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("删除用户传值=" + jsonData);
	return jsonData;
}

function deleteUserInfos(account) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAccountDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: deleteUserInfosPara(account),
		success: function(msg) {
			//			loadingStop();
			console.log("删除用户返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("删除用户信息成功", true);
				funSearchUserInfos();
			} else {
				windowStart("删除用户信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无删除用户信息权限", false);
			} else {
				windowStart("删除用户信息失败", false);
			}
		}
	})
}
//修改基本信息
function editUserBasicInfosPara() {
	var roleClassifyId = -1;
	if ($("#edituserType").val().length > 0) {
		roleClassifyId = $("#edituserType").val();
	}
	//	var propertyClassifyId = -1;
	//	if($("#editcompanyModal").val().length > 0) {
	//		propertyClassifyId = $("#editcompanyModal").val();
	//	}
	if (node_click_info != "") {
		var theNodeInfo = eval("(" + node_click_info + ")");
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", -1);
	jsonData = setJson(jsonData, "personName", $("#edituserName").val());
	jsonData = setJson(jsonData, "PWD", $("#edituserPassword").val());
	jsonData = setJson(jsonData, "userPicture", "");
	jsonData = setJson(jsonData, "account", $("#edituserAccount").val());
	jsonData = setJson(jsonData, "viewRoleId", parseInt(roleClassifyId));
	if (!$("#departmentModal1").val()) {
		jsonData = setJson(jsonData, "OrganizationId", -1);
	} else {
		if(node_click_info == ""){
			jsonData = setJson(jsonData, "OrganizationId", organizationId);
		}else{
			jsonData = setJson(jsonData, "OrganizationId", theNodeInfo.id);
		}
	}
	console.log($("#positionModal1").val());
	if ($("#positionModal1").val() == null) {
		jsonData = setJson(jsonData, "quartersId", -1);
	} else {
		jsonData = setJson(jsonData, "quartersId", parseInt($("#positionModal1").val()));
	}
	//		jsonData = setJson(jsonData,"roleClassifyId",parseInt(roleClassifyId));
	//		jsonData = setJson(jsonData,"propertyClassifyId",parseInt(propertyClassifyId));
	jsonData = setJson(jsonData, "insertTime", "");
	jsonData = setJson(jsonData, "updateTime", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("修改用户基本信息传值=" + jsonData);
	return jsonData;
}

function editUserBasicInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAccountUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: editUserBasicInfosPara(),
		success: function(msg) {
			console.log("修改用户基本返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editUserModal").modal("hide");
				$(".user-basicInfo-edit").val();
				windowStart("修改用户基本信息成功", true);
				funSearchUserInfos();
			} else {
				windowStart("修改用户基本信息失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无修改用户基本信息权限", false);
			} else {
				windowStart("修改用户基本信息失败", false);
			}
		}
	})
}

//修改联系方式
function funEditUserContactCheck() {
	//	var telReg = /^[0-9]{3,4}[-]{1}[0-9]{7-8}$/;
	//	var phoneReg = /^[0-9]{11}$/;
	var telReg = /^([0-9]{3,4}-){1}[0-9]{7,8}$/;
	var phoneReg = /^((13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|147[0-9]{8}|173[0-9]{8}|176[0-9]{8}|177[0-9]{8}|1349[0-9]{7})$)/;
	var qqReg = /^[0-9]+$/;
	var mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if ($("#userphone3").val().length > 0) {
		if (!telReg.test($("#userphone3").val())) {
			windowStart("请填写正确的固话,如020-12312312", false);
			return false;
		}
	}
	if ($("#userphone4").val().length > 0) {
		if (!phoneReg.test($("#userphone4").val())) {
			windowStart("请填写正确的手机号码,如13100000000", false);
			return false;
		}
	}
	if ($("#qqId2").val().length > 0) {
		if (!qqReg.test($("#qqId2").val())) {
			windowStart("QQ号码只能为数字", false);
			return false;
		}
	}
	if ($("#userEmail2").val().length > 0) {
		if (!mailReg.test($("#userEmail2").val())) {
			windowStart("邮箱格式不正确", false);
			return false;
		}
	}
	return true;
}

function funEditUserContactPara() {
	var contact_arr = [];
	for (var i = 0; i < $(".user-contact2").length; i++) {
		var obj = {};
		obj.contactType = parseInt($(".user-contact2").eq(i).attr("theNum"));
		obj.contactValue = $(".user-contact2").eq(i).val();
		obj.id = -1;
		obj.userID = -1;
		contact_arr.push(obj);
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "account", edit_userContact_account);
	jsonData = setJson(jsonData, "items", contact_arr);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("修改用户联系方式传值=" + jsonData);
	return jsonData;
}

function funEditUserContact() {
	//	$("#dataRealContent1").html("");
	//	loadingStart("dataRealContent1");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=User_Contact_InfoUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funEditUserContactPara(),
		success: function(msg) {
			//			loadingStop();
			console.log("修改用户联系方式返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editUserModal2").modal("hide");
				$(".user-contact2").val("");
				windowStart("修改用户联系方式成功", true);
				funSearchUserInfos();
			} else {
				windowStart("修改用户联系方式失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无修改用户联系方式权限", false);
			} else {
				windowStart("修改用户联系方式失败", false);
			}
		}
	})
}

function userBasicCheck() {
	if (!$("#userAccount").val()) {
		windowStart("请输入账号", false);
		return false;
	}
	if ($("#userAccount").val().length > 32) {
		windowStart("账户名称长度不能超过32位", false);
		return false;
	}
	// var re = /^[\ua-z\u]+$/gi; //只能输入英文字母
	 var re = /^[a-zA-Z\d]+$/;
	if (!re.test($("#userAccount").val())) {
		windowStart("账号只能输入英文和数字", false);
		return false;
	}
	if (!$("#userPassword").val()) {
		windowStart("请输入密码", false);
		return false;
	}
	if (!$("#userPasswordSure").val()) {
		windowStart("请确认密码", false);
		return false;
	}
	if ($("#userPassword").val() != $("#userPasswordSure").val()) {
		windowStart("密码不一致", false);
		return false;
	}
	if (!$("#userName").val()) {
		windowStart("请输入姓名", false);
		return false;
	}
	var check = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
	if (!check.test($("#userName").val())) {
		windowStart("姓名只能输入中、英文和数字", false);
		return false;
	}
	var firstReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
	if (!firstReg.test($("#userName").val())) {
		windowStart("姓名应以中、英文开头", false);
		return false;
	}
	if (parseInt($("#userType").val()) == -1) {
		windowStart("请选择角色类型", false);
		return false;
	}
	return true;
}

function edituserBasicCheck() {
	// if ($("#edituserAccount").val().trim() == localStorage.getItem("userAccountName")) {
	// 	windowStart("不可以修改当前登录人的信息", false);
	// 	return false;
	// }
	if (!$("#edituserAccount").val()) {
		windowStart("请输入账号", false);
		return false;
	}
	// var re = /^[\ua-z\u]+$/gi; //只能输入英文字母
	var re = /^[a-zA-Z\d]+$/;
	if (!re.test($("#edituserAccount").val())) {
		windowStart("账号只能输入英文和数字", false);
		return false;
	}
	if (!$("#edituserPassword").val()) {
		windowStart("请输入密码", false);
		return false;
	}
	if (!$("#edituserPasswordSure").val()) {
		windowStart("请确认密码", false);
		return false;
	}
	if ($("#edituserPassword").val() != $("#edituserPasswordSure").val()) {
		windowStart("密码不一致", false);
		return false;
	}
	if (!$("#edituserName").val()) {
		windowStart("请输入姓名", false);
		return false;
	}
	var check = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
	if (!check.test($("#edituserName").val())) {
		windowStart("姓名应只能为中英文和数字", false);
		return false;
	}
	if ($("#edituserType").val() == -1) {
		windowStart("请选择角色类型", false);
		return false;
	}

	return true;
}

//**************************************组织架构树****************************************
function searchOrganizationTreePara() {
	var jsonData = setJson(null, "nameCn", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询部门树传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsOrganizationTreeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchOrganizationTreePara(),
		success: function(msg) {
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询部门树返回值=" + JSON.stringify(msg));
				funGetTree();
			} else {
				windowStart("查询下拉选择失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询下拉选择权限", false);
			} else {
				windowStart("查询下拉选择失败", false);
			}
		}
	})
}

function createJsonData(childID, parentID, groupname, pName, enabled, iconOpen, iconClose) {
	var dataJson = setJson(null, "id", childID);
	dataJson = setJson(dataJson, "pId", parentID);
	//		dataJson = setJson(dataJson,"historyId",id);
	dataJson = setJson(dataJson, "name", groupname);
	dataJson = setJson(dataJson, "pName", pName);
	dataJson = setJson(dataJson, "enabled", enabled);
	// dataJson = setJson(dataJson,"checked",checked)
	if (!iconClose) {
		dataJson = setJson(dataJson, "icon", iconOpen);
	} else {
		dataJson = setJson(dataJson, "iconClose", iconOpen);
		dataJson = setJson(dataJson, "iconOpen", iconClose);
	}
	return dataJson;
}

function createAreaTree(msg, pId, pName) {
	if (pId == "") {
		treeStr += createJsonData(msg["id"], pId, msg["nameCn"], pName, false, "img/treeIcon/close_parent.png") + ",";
		return;
	} else {
		if (parseInt(msg.hasChild) == 1) {
			treeStr += createJsonData(msg["id"], pId, msg["nameCn"], pName, false, "img/treeIcon/close_parent.png") + ",";
			var theData = msg.children;
			for (var m = 0; m < theData.length; m++) {
				createAreaTree(theData[m], msg["id"], msg["nameCn"]);
			}
		} else {
			treeStr += createJsonData(msg["id"], pId, msg["nameCn"], pName, false, "img/treeIcon/close_parent.png") + ",";
			return;
		}
	}
}

function funBeforeClick() {
	return true;
}

function nodeClick() {
	var nodeInfo = getSelectNodeInfo("ztreeOtherGroup");
	node_click_info = JSON.stringify(nodeInfo);
	if (tips == 1) {
		$("#departmentModal").val(nodeInfo.name);
	} else if (tips == 2) {
		$("#departmentModal1").val(nodeInfo.name);
	}
}

function zTreeOnCheck() {}

function funGetTreeInfosPara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "nameCn", "");
	console.log("查询组织结构传值=" + jsonData);
	return jsonData;
}

function funGetTree() {
	node_click_info = "";
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsOrganizationTreeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: funGetTreeInfosPara(),
		success: function(msg) {
			loadingStop();
			console.log("查询组织结构返回值=" + JSON.stringify(msg));
			if (msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				var theData = msg.item;
				treeStr = "[";
				createAreaTree(theData, "", "");
				if (parseInt(theData.hasChild) == 1) {
					var realData = msg.item.children;
					for (var i = 0; i < realData.length; i++) {
						createAreaTree(realData[i], theData.id, theData.nameCn);
					}[]
				}
				treeStr = treeStr.substring(0, treeStr.length - 1) + "]";
				treeStr = eval("(" + treeStr + ")");
				var tree = new createTree("ztreeOtherGroup", treeStr, nodeClick, false);
				tree.showTree();
			} else {
				windowStart(msg.resp.responseCommand, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询组织结构信息权限", false);
			} else {
				windowStart("查询组织结构信息失败", false);
			}
		},
	})
}
//**************************************组织架构树end****************************************

$(document).ready(function() {
	funSearchSysInfos();
	searchSysInfos();
	funSearchUserInfos();
	$('#lanelModal').on('hidden.bs.modal', function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		funGetTree();
	})
	$('#lanelModal2').on('hidden.bs.modal', function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		$('#lanelModal2 input').val('');
		funGetTree();
	})
	$('#editUserModal').on('hidden.bs.modal', function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		funGetTree();
	})
	$('#editUserModal2').on('hidden.bs.modal', function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		funGetTree();
		$('#editUserModal2 input').val('');
	})

	$('#btnCreateClear').on('click', function(e) {
		e.stopPropagation();
		$('#departmentModal').val('');
	})

	$('#btnEditClear').on('click', function(e) {
		e.stopPropagation();
		$('#departmentModal1').val('');
	})

	$("#departmentModal").click(function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 1;
		$("#zuzhiModal").modal("show");
		$(".theCheckTree").animate({
			right: "0px"
		}, 300);
	})
	$("#departmentModal1").click(function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 2;
		$("#zuzhiModal").modal("show");
		$(".theCheckTree").animate({
			right: "0px"
		}, 300);
	})
	$("#btnCheckLastName").click(function() {
		$(".theCheckTree").animate({
			right: "0px"
		}, 300);
	})
	$(".left-toogle").click(function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
	})
	$("#btnAddUserInfo").click(function() {
		$("#userAccount").val("");
		$("#userPassword").val("");
		$("#userPasswordSure").val("");
		$("#userName").val("");
		$("#departmentModal").val("");
		//	funSearchSysInfos();
		var msg = userTypeInfos;
		var str1 = "<option value='-1'>请选择</option>";
		if (msg.viewRole != undefined && msg.viewRole.length > 0) {
			var realData = msg.viewRole;
			for (var i = 0; i < realData.length; i++) {
				str1 += "<option value='" + realData[i]["id"] + "'>" + realData[i]["name"] + "</option>";
			}
		}
			$("#userType").html(str1);
		msg = positionModalInfos;
		var str2 = "<option value='-1'>请选择</option>";
		if (msg.quarters != undefined && msg.quarters.length > 0) {
			var realData = msg.quarters;
			for (var i = 0; i < realData.length; i++) {
				str2 += "<option value='" + realData[i]["id"] + "'>" + realData[i]["name"] + "</option>";
			}
		}
		$("#positionModal").html(str2);
		$("#lanelModal").modal("show");
	})

	$("#btnNextInfoModal").click(function() {
		if (!userBasicCheck()) {
			return;
		}
		isNext = true;
		is_edit_add_account = false;
		funAddUserInfos();
	})
	$("#btnRealAddUser").click(function() {
		if (!userBasicCheck()) {
			return;
		}
		isNext = false;
		is_edit_add_account = false;
		funAddUserInfos();
	})
	$("#btnAddUserContact").click(function() {
		if (!funAddUserContactCheck()) {
			return;
		}
		funAddUserContact();
	})
	$("#btnSearData").click(function() {
		data_page_index = 0;
		curren_page = 1;
		$("#pageNumId").val("");
		funSearchUserInfos();
	})
	$("#companySelect").change(function() {
		funSearchUserInfos();
	})
	$("#btnRealEditBasicUser").click(function() {
		if (!edituserBasicCheck()) {
			return;
		}
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		searchSysInfos();
		editUserBasicInfos();
	})
	$("#btnEditUserContact2").click(function() {
		if (!funEditUserContactCheck()) {
			return;
		}
		funEditUserContact();
	})
	$(".li-table-change").mouseover(function() {
		var theLeft = parseInt($(this).attr("thenum")) * 120 + "px";
		$(".border-style").animate({
			"left": theLeft
		}, 100);
	})
	$(".li-table-change").click(function() {
		theNum = parseInt($(this).attr("thenum"));
		li_index = theNum;
		var theLeft = theNum * 120 + "px";

		$(".border-style").css({
			"left": theLeft
		});
		$(".data-real-content").each(function() {
			$(this).addClass("hide");
		})
		$(".data-real-content").eq(theNum).removeClass("hide");
		//		$(".content-for-animate").animate({"left":"-100%"},100);
		//		if(theNum == 0)
		//		{
		//			$(".content-1").eq(1).animate({"opacity":"0","filter":"alpha(opacity=0)","zIndex":"4"},100);
		//			$(".content-1").eq(0).animate({"opacity":"1","filter":"alpha(opacity=100)","zIndex":"5"},100);
		//		}
		//		else
		//		{
		//			$(".content-1").eq(0).animate({"opacity":"0","filter":"alpha(opacity=0)","zIndex":"4"},100);
		//			$(".content-1").eq(1).animate({"opacity":"1","filter":"alpha(opacity=100)","zIndex":"5"},100);
		//		}
	})
	$(".li-table-change").mouseout(function() {
		var theLeft = theNum * 120 + "px";
		$(".border-style").animate({
			"left": theLeft
		}, 100);
	})
	// funGetSysInfos();


	//分页操作
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
			funSearchUserInfos();
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
			funSearchUserInfos();
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
			funSearchUserInfos();
			$("#pageNumId").val('');
		})
		//分页操作
})