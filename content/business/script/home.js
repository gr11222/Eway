var typeCode;
var edit_company_data = {};
var companyTypeModal_data;

var theNum = 0;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;

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

function IsTelephone(obj) // 正则判断
{
	var pattern = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/;
	if(pattern.test(obj)) {
		if(obj.indexOf("-") != -1) {
			var objArr = obj.split("-");
			if(objArr[0].length != 3 && objArr[0].length != 4) {
				//				var theBox =  new creatWindow("区号长度为3位或4位",false,WINDOWTIME);
				//		    		theBox.showWindow();
				windowStart("区号长度为3位或4位", false);
				return false;
			}
			if(objArr[1].length != 8) {
				//				var theBox =  new creatWindow("除区号外,号码长度为8位",false,WINDOWTIME);
				//	    		theBox.showWindow();
				windowStart("除区号外,号码长度为8位", false);
				return false;
			} else {
				return true;
			}
		} else {
			if(obj.length != 11) {
				//				var theBox =  new creatWindow("手机号码长度为11位",false,WINDOWTIME);
				//	    		theBox.showWindow();
				windowStart("手机号码长度为11位", false);
				return false;
			} else {
				return true;
			}
		}

	} else {

		if(obj.indexOf("-") != -1) {
			objArr = obj.split("-");
			if(objArr[0].length != 3 && objArr[0].length != 4) {
				//				var theBox =  new creatWindow("区号长度为3位或4位",false,WINDOWTIME);
				//		    		theBox.showWindow();
				windowStart("区号长度为3位或4位", false);
				return false;
			}
			if(objArr[1].length != 8) {
				//				var theBox =  new creatWindow("除区号外,号码长度为8位",false,WINDOWTIME);
				//	    		theBox.showWindow();
				windowStart("除区号外,号码长度为8位", false);
				return false;
			} else {
				return true;
			}
		} else {
			if(obj.length != 11) {
				windowStart("手机号码长度为11位", false);
				//	    		theBox.showWindow();
				return false;
			} else {
				windowStart("电话号码格式为\"区号-数字\"或\"数字\"", false);
				//	    		theBox.showWindow();
				return false;
			}
		}

	}
}

function funAddCompanyCheck() {
	if(!$("#madeNameModal").val()) {
		windowStart("请输入企业中文名称", false);
		return false;
	}
	//	var cnCheck = /^[\u4e00-\u9fa5]+$/;
	var cnCheck = /(?=.*\(.*\)|.*（.*）)^[\u4e00-\u9fa5()（）]*$|^[\u4e00-\u9fa5]*$/;
	var enCheck = /^[a-zA-Z]+$/;
	var check = /^[1-9]\d*$/;
	var noCnCheck = /^[^\u4e00-\u9fa5]{0,}$/;
	//	if(!cnCheck.test($("#madeNameModal").val())) {
	//		windowStart("企业中文名称只能输入中文", false);
	//		return false;
	//	}
	var firstReg = /^[a-zA-Z\u4e00-\u9fa50-9@&（）——]{1}/;
	if(!firstReg.test($("#madeNameModal").val())) {
		windowStart("企业中文名称应只能输入中、英文、数字和特殊字符", false);
		return false;
	}
	if(!$("#madeNameEnModal").val()) {
		windowStart("请输入企业英文名称", false);
		return false;
	}
	if(!noCnCheck.test($("#madeNameEnModal").val())) {
		windowStart("企业英文名称不能输入中文", false);
		return false;
	}
	var firstEnReg = /^[a-zA-Z]{1}/;
	if(!firstReg.test($("#madeNameEnModal").val())) {
		windowStart("企业英文名称应英文开头", false);
		return false;
	}
	if($("#conpanySizeModal").val() == "") {
		windowStart("请输入企业规模", false);
		return false;
	}
	if(!check.test($("#conpanySizeModal").val())) {
		windowStart("企业规模只能输入正整数", false);
		return false;
	}
	if(!$("#companyAddrModal").val()) {
		windowStart("请输入企业地址", false);
		return false;
	}
	var check = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
	if(!check.test($("#companyAddrModal").val())) {
		windowStart("企业地址只能输入中、英文和数字", false);
		return false;
	}
	if(!firstReg.test($("#companyAddrModal").val())) {
		windowStart("企业地址应以中、英文开头", false);
		return false;
	}
	if(!$("#companyPhoneModal").val()) {
		windowStart("请输入企业电话", false);
		return false;
	}
	var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
	var isMob = /^(([0-9]{3,4}-){1}[0-9]{7,8}$)|((13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$)/;
	//var isMob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
	var theValue = $('#companyPhoneModal').val().trim();
	if(!isMob.test(theValue)) {
		windowStart("请输入正确格式的电话号码,如区号-号码、有效的11位手机号码", false);
		return false;
	}
	if($("#factoryShengModal").val() == "省份") {
		windowStart("请选择所属省份", false);
		return false;
	}
	if($("#factoryCityModal").val() == "市") {
		windowStart("请选择所属城市", false);
		return false;
	}
	if($("#factoryAreaModal").val() == "区、县") {
		windowStart("请选择所属区县", false);
		return false;
	}
	//	if($("#companyPhoneModal").val().length > 0 )
	//	{
	//		
	//		var re = /^((\d{3,4})-)(\d{8})(-(\d{3,}))?$/;
	//			if(!re.test($('#companyPhoneModal').val())){
	//				if($('#companyPhoneModal').val().indexOf("-") != -1){
	//					var objArr = $('#companyPhoneModal').val().split("-");
	//					if(isNaN(objArr[0])){
	////					    var theBox =  new creatWindow("电话号码必须输入数字",false,WINDOWTIME);
	////			    		theBox.showWindow();
	//			    		windowStart("电话号码请输入11位数字,或者区号-号码，例如:13100110011;022-12312312",false);
	//						return false;
	//					}	
	//					if(isNaN(objArr[1])){
	////					    var theBox =  new creatWindow("电话号码必须输入数字",false,WINDOWTIME);
	////			    		theBox.showWindow();
	//			    		windowStart("电话号码请输入11位数字,或者区号-号码，例如:13100110011;022-12312312",false);
	//						return false;
	//					}	
	//					if(objArr[0].length != 3  && objArr[0].length != 4){
	////						var theBox =  new creatWindow("区号长度为3位或4位",false,WINDOWTIME);
	////				    		theBox.showWindow();
	//				    		windowStart("电话号码请输入11位数字,或者区号-号码，例如:13100110011;022-12312312",false);
	//			    			return false;
	//					}
	//					if(objArr[1].length != 8){
	////						var theBox =  new creatWindow("除区号外,号码长度为8位",false,WINDOWTIME);
	////			    		theBox.showWindow();
	//			    		windowStart("电话号码请输入11位数字,或者区号-号码，例如:13100110011;022-12312312",false);
	//		    			return false;	
	//					}
	//				}else{
	//					if(isNaN($('#companyPhoneModal').val())){
	////					    var theBox =  new creatWindow("电话号码必须输入数字",false,WINDOWTIME);
	////			    		theBox.showWindow();
	//			    		windowStart("电话号码请输入11位数字,或者区号-号码，例如:13100110011;022-12312312",false);
	//						return false;
	//					}	
	//					if($('#companyPhoneModal').val().length != 11){
	////						var theBox =  new creatWindow("电话号码长度为11位",false,WINDOWTIME);
	////			    		theBox.showWindow();
	//			    		windowStart("电话号码请输入11位数字,或者区号-号码，例如:13100110011;022-12312312",false);
	//		    			return false;	
	//					}
	//				}
	//				
	//			}	
	//	}
	return true;
}

//企业类型查询
function searchCompanyTypePara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "items", "", true);
	console.log("查询企业类型传值=" + jsonData);
	return jsonData;
}

function searchCompanyType() {
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyTypeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchCompanyTypePara(),
		success: function(msg) {
			loadingStop();
			//			windowRemove();
			console.log("查询企业类型返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				//				windowStart("企业信息删除成功",true);
				createCompantSelect(msg);
			} else {
				windowStart("企业类型查询失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询企业类型权限", false);
			} else {
				windowStart("企业类型查询失败", false);
			}

		}
	})
}

function createCompantSelect(msg) {
	$("#companyType").html("");
	var str = "";
	var theDate = msg.items;
	str += "<option value=''>请选择</option>";
	for(var i = 0; i < theDate.length; i++) {
		str += "<option value='" + theDate[i]["classifyId"] + "'>" + theDate[i]["nameCn"] + "</option>";
	}
	companyTypeModal_data = theDate;
	$("#companyType").html(str);
	$("#companyTypeModal").html(str);
}
//企业类型查询结束
/*********企业************/
function funAddCompanyPara() {
	var jsonData = setJson(null, "id", -1);
	jsonData = setJson(jsonData, "nameCn", $("#madeNameModal").val());
	jsonData = setJson(jsonData, "nameEn", $("#madeNameEnModal").val());
	jsonData = setJson(jsonData, "typeCode", parseInt($("#companyTypeModal").val()));
	jsonData = setJson(jsonData, "companySize", parseInt($("#conpanySizeModal").val()));
	jsonData = setJson(jsonData, "companyAddr", $("#companyAddrModal").val());
	jsonData = setJson(jsonData, "stationPhone", $("#companyPhoneModal").val());
	jsonData = setJson(jsonData, "updateTime", "");
	jsonData = setJson(jsonData, "insertTime", "");
	jsonData = setJson(jsonData, "code", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "province", $("#factoryShengModal").val());
	jsonData = setJson(jsonData, "city", $("#factoryCityModal").val());
	jsonData = setJson(jsonData, "district", $("#factoryAreaModal").val());
	console.log("添加企业信息传值=" + jsonData);
	return jsonData;
}

function funAddCompany() {
	//	$("#ptcontent").html("");
	//	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyAddCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddCompanyPara(),
		success: function(msg) {
			//			loadingStop();
			//			windowRemove();
			console.log("添加企业返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#addDataModal4").modal("hide");
				addCompanyInit();
				//				alert("企业信息添加成功");
				windowStart("企业信息添加成功", true);
				searchCompany();
			} else if(msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("企业中文名称已存在", false);
			} else {
				//				alert("企业信息添加失败");
				windowStart("企业信息添加失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			alert("企业信息添加失败");
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无添加企业信息权限", false);
			} else {
				//          	loadingStop();
				windowStart("企业信息添加失败", false);
			}

		}
	})
}

function addCompanyInit() {
	$("#companyTypeModal").val("");
	$("#madeNameModal").val("");
	$("#madeNameEnModal").val("");
	$("#madeTypeModal").val("");
	$("#madeInfosModal").val("");
	$("#conpanySizeModal").val("");
	$("#companyAddrModal").val("");
	$("#companyPhoneModal").val("");
	$("#factoryShengModal").val("省份");
	$("#factoryCityModal").val("市");
	$("#factoryAreaModal").val("区、县");
}

//企业--修改
function funEditCompanyCheck() {
	if(!$("#editmadeNameModal").val()) {
		windowStart("请输入企业中文名称", false);
		return false;
	}
	var cnCheck = /^[\u4e00-\u9fa5]+$/;
	var enCheck = /^[a-zA-Z]+$/;
	var check = /^[1-9]\d*$/;
	var firstReg = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
	var noCnCheck = /^[^\u4e00-\u9fa5]{0,}$/;
	if(!firstReg.test($("#editmadeNameModal").val())) {
		windowStart("企业中文名称应以中、英文开头", false);
		return false;
	}
	if(!$("#editmadeNameEnModal").val()) {
		windowStart("请输入企业英文名称", false);
		return false;
	}
	if(!enCheck.test($("#editmadeNameEnModal").val())) {
		windowStart("英文名称只能输入英文", false);
		return false;
	}
	if(!noCnCheck.test($("#editmadeNameEnModal").val())) {
		windowStart("企业英文名称不能输入中文", false);
		return false;
	}
	var firstEnReg = /^[a-zA-Z]{1}/;
	if(!firstReg.test($("#editmadeNameEnModal").val())) {
		windowStart("企业英文名称应以英文开头", false);
		return false;
	}
	if(!$("#editconpanySizeModal").val()) {
		windowStart("请输入企业规模", false);
		return false;
	}
	if(!check.test($("#editconpanySizeModal").val())) {
		windowStart("企业规模只能输入正整数", false);
		return false;
	}
	if(!$("#editcompanyAddrModal").val()) {
		windowStart("请输入企业地址", false);
		return false;
	}
	var check = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
	if(!check.test($("#editcompanyAddrModal").val())) {
		windowStart("企业地址只能输入中、英文和数字", false);
		return false;
	}
	if(!firstReg.test($("#editcompanyAddrModal").val())) {
		windowStart("企业地址应以中、英文开头", false);
		return false;
	}
	if(!$("#editcompanyPhoneModal").val()) {
		windowStart("请输入企业电话", false);
		return false;
	}
	if($("#editcompanyPhoneModal").val().length > 0) {
		var re = /^((\d{3,4})-)(\d{8})(-(\d{3,}))?$/;
		if(!re.test($('#editcompanyPhoneModal').val())) {
			if($('#editcompanyPhoneModal').val().indexOf("-") != -1) {
				var objArr = $('#editcompanyPhoneModal').val().split("-");
				if(isNaN(objArr[0])) {
					//					    var theBox =  new creatWindow("电话号码必须输入数字",false,WINDOWTIME);
					//			    		theBox.showWindow();
					windowStart("电话号码请输入11位数字,或者区号-号码，例如:13100110011;022-12312312", false);
					return false;
				}
				if(isNaN(objArr[1])) {
					//					    var theBox =  new creatWindow("电话号码必须输入数字",false,WINDOWTIME);
					//			    		theBox.showWindow();
					windowStart("电话号码请输入11位数字,或者区号-号码(区号为3-4位,号码为8位).例如:13100110011;022-12312312", false);
					return false;
				}
				if(objArr[0].length != 3 && objArr[0].length != 4) {
					//						var theBox =  new creatWindow("区号长度为3位或4位",false,WINDOWTIME);
					//				    		theBox.showWindow();
					windowStart("电话号码请输入11位数字,或者区号-号码(区号为3-4位,号码为8位).例如:13100110011;022-12312312", false);
					return false;
				}
				if(objArr[1].length != 8) {
					//						var theBox =  new creatWindow("除区号外,号码长度为8位",false,WINDOWTIME);
					//			    		theBox.showWindow();
					windowStart("电话号码请输入11位数字,或者区号-号码(区号为3-4位,号码为8位).例如:13100110011;022-12312312", false);
					return false;
				}
			} else {
				if(isNaN($('#editcompanyPhoneModal').val())) {
					//					    var theBox =  new creatWindow("电话号码必须输入数字",false,WINDOWTIME);
					//			    		theBox.showWindow();
					windowStart("电话号码请输入11位数字,或者区号-号码(区号为3-4位,号码为8位).例如:13100110011;022-12312312", false);
					return false;
				}
				if($('#editcompanyPhoneModal').val().length != 11) {
					//						var theBox =  new creatWindow("电话号码长度为11位",false,WINDOWTIME);
					//			    		theBox.showWindow();
					windowStart("电话号码请输入11位数字,或者区号-号码(区号为3-4位,号码为8位).例如:13100110011;022-12312312", false);
					return false;
				}
			}

		}
	}
	return true;
}

function funEditCompanyPara() {
	var jsonData = setJson(null, "id", parseInt(edit_company_data.id));
	jsonData = setJson(jsonData, "nameCn", $("#editmadeNameModal").val());
	jsonData = setJson(jsonData, "nameEn", $("#editmadeNameEnModal").val());
	jsonData = setJson(jsonData, "typeCode", typeCode);
	jsonData = setJson(jsonData, "companySize", parseInt($("#editconpanySizeModal").val()));
	jsonData = setJson(jsonData, "companyAddr", $("#editcompanyAddrModal").val());
	jsonData = setJson(jsonData, "stationPhone", $("#editcompanyPhoneModal").val());
	jsonData = setJson(jsonData, "updateTime", edit_company_data.updateTime);
	jsonData = setJson(jsonData, "insertTime", edit_company_data.insertTime);
	jsonData = setJson(jsonData, "province", $("#editShengFenModal").val());
	// jsonData = setJson(jsonData,"typeCode",typeCode);
	jsonData = setJson(jsonData, "city", $("#editCityModal").val());
	jsonData = setJson(jsonData, "district", $("#editQuXianModal").val());
	jsonData = setJson(jsonData, "code", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("修改企业信息传值=" + jsonData);
	return jsonData;

}

function funEditCompany() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funEditCompanyPara(),
		success: function(msg) {
			//			loadingStop();
			//			windowRemove();
			console.log("修改企业返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editDataModal4").modal("hide");
				//				addCompanyInit();
				//				alert("企业信息添加成功");
				windowStart("企业信息修改成功", true);
				searchCompany();
			} else if(msg.responseCommand.toUpperCase().indexOf("REPEAT") != -1) {
				windowStart("企业中文名称已存在", false);
			} else {
				//				alert("企业信息添加失败");
				windowStart("企业信息修改失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			alert("企业信息添加失败");
			//			windowStart("企业信息修改失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改企业信息权限", false);
			} else {

				windowStart("企业信息修改失败", false);
			}
			//			loadingStop();
			//			windowStart("查询点检信息失败",false);
		}
	})
}
//企业--删除

function funDeleteCompanyPara(theId) {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "id", theId);
	jsonData = setJson(jsonData, "nameCn", "");
	jsonData = setJson(jsonData, "nameEn", "");
	jsonData = setJson(jsonData, "classifyId", -1);
	jsonData = setJson(jsonData, "companySize", -1);
	jsonData = setJson(jsonData, "companyAddr", "");
	jsonData = setJson(jsonData, "stationPhone", "");
	jsonData = setJson(jsonData, "updateTime", "");
	jsonData = setJson(jsonData, "insertTime", "");
	jsonData = setJson(jsonData, "province", "");
	jsonData = setJson(jsonData, "city", "");
	jsonData = setJson(jsonData, "district", "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("删除企业信息传值=" + jsonData);
	return jsonData;
}

function funDeleteCompany(theId) {
	//	$("#ptcontent").html("");
	//	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanyDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteCompanyPara(theId),
		success: function(msg) {
			//			loadingStop();
			//			windowRemove();
			console.log("删除企业返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				//				$("#editDataModal4").modal("hide");
				//				addCompanyInit();
				//				alert("企业信息添加成功");
				windowStart("企业信息删除成功", true);
				searchCompany();
			} else {
				//				alert("企业信息添加失败");
				windowStart("企业信息删除失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//			alert("企业信息添加失败");
			//			windowStart("企业信息删除失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无删除企业信息权限", false);
			} else {

				windowStart("企业信息删除失败", false);
			}
			//			loadingStop();
			//			windowStart("查询点检信息失败",false);
		}
	})
}
//企业--查询
function searchCompanyPara() {
	var nameCn = "";
	var theId = -1;
	var classifyId_classifyId = -1;
	// var theStartTime = "";
	// var theEndTime = "";
	var start_time = "";
	var end_time = "";
	if($("#companyNameCn").val().length > 0) {
		nameCn = $("#companyNameCn").val();

	}
	if($("#companyID").val().length > 0) {
		theId = parseInt($("#companyID").val());

	}
	if($("#companyType").val().length > 0) {
		classifyId_classifyId = parseInt($("#companyType").val());

	}
	// if($("#startTime").val().length > 0) {
	// 	theStartTime = $("#startTime").val();

	// }
	// if($("#endTime").val().length > 0) {
	// 	theEndTime = $("#endTime").val();

	// }
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
	var jsonData = setJson(null, "id", theId);
	jsonData = setJson(jsonData, "nameCn", nameCn);
	jsonData = setJson(jsonData, "startTime", start_time);
	jsonData = setJson(jsonData, "endTime", end_time);
	jsonData = setJson(jsonData, "classifyId", classifyId_classifyId);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	// jsonData = setJson(jsonData, "items", "", true);
	console.log("查询企业信息传值=" + jsonData);
	return jsonData;
}

function searchCompany() {
	var timeReg = /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
	// if ($("#startTime").val().length == 0 && $("#endTime").val().length == 0) {
	// 	windowStart("时间范围有误,请填写时间范围", false);
	// 	return;
	// }
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
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsCompanySearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchCompanyPara(),
		success: function(msg) {
			loadingStop();
			//			windowRemove();
			console.log("查询企业返回值=" + JSON.stringify(msg));
			$(".box-header-style").removeClass("hide");
			$("#dataContent").html("");
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editDataModal4").modal("hide");
				total = msg.totalNumber;
				var totalPage = Math.ceil(parseInt(total) / data_number);
				total_page = totalPage;
				if (totalPage === 0) {
					totalPage = 1;
				}
				$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");
				createCompanyTable(msg);

			} else {
				//				
				windowStart("当前条件下无企业信息", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			//			windowStart("企业信息查询失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询企业信息权限", false);
			} else {

				windowStart("企业信息查询失败", false);
			}
		}
	})
}

function funCheckDate() {
	var numberReg = /^[0-9]+$/;
	console.log($("#companyID").val());
	if (!$("#companyID").val()=="") {
		if(!numberReg.test($("#companyID").val())) {
		windowStart("企业ID只能输入数字", false);
		return false;
	}
	}
	
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

function createCompanyTable(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:35%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无企业信息";
		str += "</div>";
		$("#dataContent").html(str);

		return;
	}
	//	var total = msg.totalNumber;
	//	var totalPage = Math.ceil(parseInt(total)/data_number);
	//	total_page = totalPage;
	//	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	//	
	var realData = msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center td-width'>中文名称</th>";
	str += "<th class='text-center td-width'>英文名称</th>";
	str += "<th class='text-center td-width'>企业类型</th>";
	str += "<th class='text-center td-width'>企业规模</th>";
	str += "<th class='text-center td-width'>企业地址</th>";
	str += "<th class='text-center td-width'>总台电话</th>";

	str += "<th class='text-center td-width'>省份</th>";
	str += "<th class='text-center td-width'>城市</th>";
	str += "<th class='text-center td-width'>区县</th>";
	str += "<th class='text-center td-width'>录入时间</th>";
	str += "<th class='text-center td-width'>上次修改时间</th>";
	str += "<th class='text-center td-width'>管理</th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		str += "<tr  >";
		str += "<td class='text-center td-width' title='"+realData[i]["nameCn"]+"'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["nameEn"]+"'>" + realData[i]["nameEn"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["classifyNameCn"]+"'>" + realData[i]["classifyNameCn"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["companySize"]+"'>" + realData[i]["companySize"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["companyAddr"]+"'>" + realData[i]["companyAddr"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["stationPhone"]+"'>" + realData[i]["stationPhone"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["province"]+"'>" + realData[i]["province"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["city"]+"'>" + realData[i]["city"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["district"]+"'>" + realData[i]["district"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["insertTime"]+"'>" + realData[i]["insertTime"] + "</td>";
		str += "<td class='text-center td-width' title='"+realData[i]["updateTime"]+"'>" + realData[i]["updateTime"] + "</td>";
		str += "<td class='text-center td-width'>";
		str += "<span><a href='javascript:void(0)' theData='" + JSON.stringify(realData[i]) + "' class='editCompanyInfo-class'><img src='../img/edit.png' width='18' height='18'></a></span>";
		str += "<span style='padding-left:10px'><a href='javascript:void(0)' theId='" + realData[i]["id"] + "' class='deleteCompanyInfo-class'><img src='../img/dele.png' width='18' height='18'></a></span>";
		str += "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$(".box-header-style").removeClass("hide");
	$("#dataContent").html(str);
	//修改
	$(".editCompanyInfo-class").click(function() {

			edit_company_data = eval("(" + $(this).attr("theData") + ")");
			$("#editmadeNameModal").val(edit_company_data.nameCn);
			$("#editmadeNameEnModal").val(edit_company_data.nameEn);
			$("#editcompanyAddrModal").val(edit_company_data.companyAddr);
			$("#editconpanySizeModal").val(edit_company_data.companySize);
			$("#editcompanyPhoneModal").val(edit_company_data.stationPhone);
			$("#editShengFenModal").val(edit_company_data.province);
			$("#editCityModal").val(edit_company_data.city);
			$("#editQuXianModal").val(edit_company_data.district);
			typeCode = edit_company_data.typeCode;
			$("#editDataModal4").modal("show");
		})
		//删除
	$(".deleteCompanyInfo-class").click(function() {
		if(!confirm("是否确认删除?")) {
			return;
		}
		funDeleteCompany(parseInt($(this).attr("theId")));
	})
}

$(document).ready(function() {
	_init_area();
	$(".date-style").datepicker("setValue");
	$(".date-style").val("");
	$("#btnAddFacData").click(function() {
		$("#companyTypeModal").html("");
		var str = "";
		var theDate = companyTypeModal_data;
		str += "<option value=''>请选择</option>";
		for(var i = 0; i < theDate.length; i++) {
			str += "<option value='" + theDate[i]["classifyId"] + "'>" + theDate[i]["nameCn"] + "</option>";
		}
		companyTypeModal_data = theDate;
		$("#companyTypeModal").html(str);
		$("#addDataModal").modal("show");
	})
	searchCompanyType();
	$("#btnAddCompany").click(function() {
			if(!$("#companyTypeModal").val()) {
				//			alert("请选择企业类型");
				windowStart("请选择企业类型", true);
				return;
			}
			$("#addDataModal").modal("hide");
			//		if(parseInt($("#companyTypeModal").val()) == 0)
			//		{
			//			$("#addDataModal2").modal("show");
			//			$("#factoryShengModal").val("省份");
			//			$("#factoryCityModal").val("市");
			//			$("#factoryAreaModal").val("区、县");
			//		}
			//		else if(parseInt($("#companyTypeModal").val()) == 1)
			//		{
			//			$("#addDataModal3").modal("show");
			//		}
			//		else
			//		{
			//			$("#addDataModal4").modal("show");
			//		}
			$("#madeNameModal").val("");
			$("#madeNameEnModal").val("");
			$("#conpanySizeModal").val("");
			$("#companyAddrModal").val("");
			$("#companyPhoneModal").val("");
			$("#factoryShengModal").val("省份");
			$("#factoryCityModal").val("市");
			$("#factoryAreaModal").val("区、县");
			$("#addDataModal4").modal("show");
		})
		// 企业
		//企业---添加
	$("#btnAddMadeInfo").click(function() {
			if(!funAddCompanyCheck()) {
				return;
			}
			funAddCompany();
		})
		//企业----修改
		//	$("#editDataModal4").modal("show");
	$("#btneditMadeInfo").click(function() {
			if(!funEditCompanyCheck()) {
				return;
			}
			funEditCompany();
		})
		//企业----删除
		//	$("#btnDeleteFacData").click(function(){
		//		if(!confirm("是否确认删除?"))
		//		{
		//			return;
		//		}
		//		funDeleteCompany();
		//	})
	$("#companyType").change(function() {
		if(!$(this).val()) {
			//			alert("请选择企业类型");
			$(".box-header-style").addClass("hide");
			$("#dataContent").html('<div style="position:relative;width: 100%;top:35%;font-size: 30px;font-weight: bold;text-align:center;">请切换企业类型进行查询！</div>');
			return;
		}
		searchCompany();
	})
	$("#btnSearCompanyInfo").click(function() {
		if(!$("#companyType").val()) {
			//			alert("请选择企业类型");
			windowStart("请选择企业类型", false);
			$(".box-header-style").addClass("hide");
			$("#dataContent").html("");
			return;
		}
		//		var date1 = $("#startTime").val().split("-");
		//		var date2 = $("#endTime").val().split("-");
		//		var startTime = new Date(date1[0],date1[1],date1[2]).getTime();
		//		var endTime = new Date(date2[0],date2[1],date2[2]).getTime();
		//		if(parseInt(startTime) > parseInt(endTime))
		//		{
		//			windowStart("时间范围有误，请重新选取时间范围，注意：时间范围中的开始时间不能大于结束时间v",false);
		//			return;
		//		}
		if(!funCheckDate()) {
			return;
		}
		searchCompany();
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
			searchCompany()

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
			searchCompany()

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
		searchCompany()
		$("#pageNumId").val("");

	})
})