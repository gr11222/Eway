var node_click_info = "";
var total = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
var fatherId;
var addList = [];
var delList = [];
var checkedListInfo = [];
var uncheckedListInfo = [];
var tips; //1查询，2未选，3已选，4展示
var search_infos = "";

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

//*************************************查询部门树*************************************
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
		async:"false",
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsOrganizationTreeSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchOrganizationTreePara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询部门树返回值=" + JSON.stringify(msg));
				
			} else {
				windowStart("查询下拉选择失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
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
	if(!iconClose) {
		dataJson = setJson(dataJson, "icon", iconOpen);
	} else {

		dataJson = setJson(dataJson, "iconClose", iconOpen);
		dataJson = setJson(dataJson, "iconOpen", iconClose);
	}
	return dataJson;
}

function createAreaTree(msg, pId, pName) {

	if(pId == "") {
		treeStr += createJsonData(msg["id"], pId, msg["nameCn"], pName, false, "img/treeIcon/close_parent.png") + ",";
		return;
	} else {
		if(parseInt(msg.hasChild) == 1) {
			treeStr += createJsonData(msg["id"], pId, msg["nameCn"], pName, false, "img/treeIcon/close_parent.png") + ",";
			var theData = msg.children;
			for(var m = 0; m < theData.length; m++) {
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
	if(tips == 1) {
		$("#department").val(nodeInfo.name);
	} else if(tips == 2) {
		$("#department1").val(nodeInfo.name);
	} else if(tips == 3) {
		$("#department2").val(nodeInfo.name);
	} else if(tips == 4) {
		$("#department3").val(nodeInfo.name);
	}
}

function zTreeOnCheck() {

}

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
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {

				var theData = msg.item;
				treeStr = "[";
				createAreaTree(theData, "", "");
				if(parseInt(theData.hasChild) == 1) {
					var realData = msg.item.children;
					for(var i = 0; i < realData.length; i++) {
						createAreaTree(realData[i], theData.id, theData.nameCn);
					}
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
			if(xmlRequest == "401") {
				windowStart("当前用户无查询组织结构信息权限", false);
			} else {
				windowStart("查询组织结构信息失败", false);
			}
		},
	})
}

//*************************************主页面查询*************************************
function funHRSearch() {
	loadingStart("data-content");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPersonnelRelationSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: hrSearchPara(),
		success: function(msg) {
			console.log(JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {

				createHumanRelationsTableInfos(msg);
				loadingStop();
			} else {
				windowStart("查询失败", false);
			}
		},
		error: function() {
			loadingStop();
			console.log("查询失败");
		}
	});
}

function hrSearchPara() {
	if(node_click_info != "") {
		var theNodeInfo = eval("(" + node_click_info + ")");
	}

	var jsonData = setJson(null, "account", $("#account").val());
	jsonData = setJson(jsonData, "name", $("#name").val());
	jsonData = setJson(jsonData, "jobPosition", $("#position").val());
	if(node_click_info == "") {
		jsonData = setJson(jsonData, "departmentid", -1);
	} else {
		jsonData = setJson(jsonData, "departmentid", theNodeInfo.id);
	}

	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("人事关系查询传值=" + jsonData);
	return jsonData;
}

//************************************************************主页的查询内容************************************************************
function createHumanRelationsTableInfos(msg) {
	if(!msg.item || msg.item.length < 1) {
		$("#data-content").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无人事关系信息";
		str += "</div>";
		$("#data-content").html(str);
		return;
	}
	$("#data-content").html("");
	total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");
	var realData = msg.item;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='height:30px;'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>账号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>姓名</div></th>";
	str += "<th class='text-center'><div class='checkbox'>部门</div></th>";
	str += "<th class='text-center'><div class='checkbox'>职位</div></th>";
	str += "<th class='text-center' style='width:20%'><div class='checkbox'>直接下属</div></th>";
	str += "<th class='text-center'><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var data = JSON.stringify(realData[i]);
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center' style='width:10%' title='"+(i + 1)+"'>" + (i + 1) + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'title='"+realData[i]["account"]+"'>" + realData[i]["account"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'title='"+realData[i]["nameCn"]+"'>" + realData[i]["nameCn"] + "</td>";
		if(realData[i]["department"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'title='"+realData[i]["department"]+"'>" + realData[i]["department"] + "</td>";
		}
		if(realData[i]["jobPosition"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'title='"+realData[i]["jobPosition"]+"'>" + realData[i]["jobPosition"] + "</td>";
		}
		if(realData[i]["childrens"].length > 0) {
			var xiashu = "";
			var temp = realData[i]["childrens"];
			if(temp.length >= 4) {
				for(var j = 0; j < 3; j++) {
					if(j == 2) {
						xiashu = xiashu + temp[j];
					} else {
						xiashu = xiashu + temp[j] + ",";
					}
				}
				str += "<td class='text-center' style='width:30%;word-wrap: break-word;word-break: break-all;' title='"+xiashu + "...(共" + temp.length + "人)"+"'><a  href='javascript:void(0)' class='show'  fatherId='" + realData[i]["id"] + "'>" + xiashu + "...(共" + temp.length + "人)" + "</a></td>";
			} else {
				for(var j = 0; j < temp.length; j++) {
					if(j == temp.length - 1) {
						xiashu = xiashu + temp[j];
					} else {
						xiashu = xiashu + temp[j] + ",";
					}
				}
				str += "<td class='text-center' style='width:30%;word-wrap: break-word;word-break: break-all;' title='"+xiashu+"'><a  href='javascript:void(0)' class='show'  fatherId='" + realData[i]["id"] + "'>" + xiashu + "</a></td>";
			}
		} else {
			str += "<td class='text-center' style='width:30%;word-wrap: break-word;word-break: break-all;'></td>";
		}
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>";
		str += "<a  href='javascript:void(0)' class='set' nameCn='" + realData[i]["nameCn"] + "' account='" + realData[i]["account"] + "' department='" + realData[i]["department"] + "' jobPosition='" + realData[i]["jobPosition"] + "' fatherId='" + realData[i]["id"] + "'>配置</a>";
		str += "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#data-content").html(str);
	$(".show").click(function() {
		$("#account3").val("");
		$("#name3").val("");
		$("#position3").val("");
		$("#department3").val("");
		fatherId = $(this).attr("fatherId");
		$("#showCheckedList").html("");
		var str = "";
		str += '<div style="position:relative;width: 100%;top:40%;font-size: 30px;font-weight: bold;text-align:center;">';
		str += "请选择查询条件后,点击查询按钮进行查询！";
		str += "</div>";
		$("#showCheckedList").html(str);
		funHRCheckedShow();
		$("#showCheckedModal").modal("show");
	})
	$(".set").click(function() {
		$("#account1").val("");
		$("#name1").val("");
		$("#position1").val("");
		$("#department1").val("");
		$("#account2").val("");
		$("#name2").val("");
		$("#position2").val("");
		$("#department2").val("");
		fatherId = $(this).attr("fatherId");
		$("#username").text($(this).attr("nameCn"));
		$("#useraccount").text($(this).attr("account"));
		if($(this).attr("department") == "undefined") {
			$("#userdepartment").text("");
		} else {
			$("#userdepartment").text($(this).attr("department"));
		}
		if($(this).attr("jobPosition") == "undefined") {
			$("#userposition").text("");
		} else {
			$("#userposition").text($(this).attr("jobPosition"));
		}
		addList = [];
		delList = [];
		checkedListInfo = [];
		uncheckedListInfo = [];
		//		$("#uncheckedList").html("");
		//		var str = "";
		//		str += '<div style="position:relative;width: 100%;top:40%;font-size: 30px;font-weight: bold;text-align:center;">';
		//		str += "请选择查询条件后,点击查询按钮进行查询！";
		//		str += "</div>";
		//		$("#uncheckedList").html(str);
		//		$("#checkedList").html("");
		//		var str = "";
		//		str += '<div style="position:relative;width: 100%;top:40%;font-size: 30px;font-weight: bold;text-align:center;">';
		//		str += "请选择查询条件后,点击查询按钮进行查询！";
		//		str += "</div>";
		//		$("#checkedList").html(str);
		funHRUncheckedSearch();
		funHRCheckedSearch();
		$("#setModal").modal("show");
	})
}
//*************************************备选列表查询*************************************
function funHRUncheckedSearch() {
	//	loadingStart("data-content");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPersonnelRelationNoexistentCmd",
		contentType: "application/text,charset=utf-8",
		data: uncheckedSearchPara(),
		success: function(msg) {
			console.log(JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				//				loadingStop();
				createUncheckedList(msg);
			}
		},
		error: function() {
			loadingStop();
			console.log("查询失败");
		}
	});
}

function uncheckedSearchPara() {
	if(node_click_info != "") {
		var theNodeInfo = eval("(" + node_click_info + ")");
	}

	var jsonData = setJson(null, "account", $("#account1").val());
	jsonData = setJson(jsonData, "name", $("#name1").val());
	jsonData = setJson(jsonData, "jobPosition", $("#position1").val());
	if(node_click_info == "") {
		jsonData = setJson(jsonData, "departmentid", -1);
	} else {
		jsonData = setJson(jsonData, "departmentid", theNodeInfo.id);
	}
	jsonData = setJson(jsonData, "fatherId", parseInt(fatherId));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("已选列表查询传值=" + jsonData);
	return jsonData;
}

//********************************************备选列表**********************************************
function createUncheckedList(msg) {
	uncheckedListInfo = msg.item;
	uncheckedList(uncheckedListInfo);
}

function uncheckedList(uncheckedListInfo) {
	if(!uncheckedListInfo || uncheckedListInfo.length < 1) {
		$("#uncheckedList").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无备选列表信息";
		str += "</div>";
		$("#uncheckedList").html(str);
		return;
	}
	$("#uncheckedList").html("");
	var realData = uncheckedListInfo;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='height:30px;'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>账号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>姓名</div></th>";
	str += "<th class='text-center'><div class='checkbox'>直接下属人数</div></th>";
	str += "<th class='text-center'><div class='checkbox'>部门</div></th>";
	str += "<th class='text-center'><div class='checkbox'>职位</div></th>";
	str += "<th class='text-center'><div class='checkbox'>电话号码</div></th>";
	str += "<th class='text-center'><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var data = JSON.stringify(realData[i]);
		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["account"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["hasChildr"] + "</td>";
		if(realData[i]["department"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["department"] + "</td>";
		}
		if(realData[i]["jobPosition"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["jobPosition"] + "</td>";
		}
		if(realData[i]["telNumber"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["telNumber"] + "</td>";
		}
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>";
		console.log()
		str += "<a  href='javascript:void(0)' class='add' add='" + JSON.stringify(realData[i]) + "'>添加</a>";
		str += "</td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#uncheckedList").html(str);

	$(".add").click(function() {
		if(addList.length > 0) {
			var tip = 0;
			for(var i = 0; i < addList.length; i++) {
				if(eval("(" + $(this).attr("add") + ")").id == addList[i]["id"]) {
					tip++;
				}
			}
			if(tip == 0) {
				addList.push(eval("(" + $(this).attr("add") + ")"));
			}
		} else {
			addList.push(eval("(" + $(this).attr("add") + ")"));
		}

		if(checkedListInfo.length > 0) {
			var tip = 0;
			for(var i = 0; i < checkedListInfo.length; i++) {
				if(eval("(" + $(this).attr("add") + ")").id == checkedListInfo[i]["id"]) {
					tip++;
				}
			}
			if(tip == 0) {
				checkedListInfo.push(eval("(" + $(this).attr("add") + ")"));
			}
		} else {
			checkedListInfo.push(eval("(" + $(this).attr("add") + ")"));
		}

		if(uncheckedListInfo.length > 0) {
			for(var i = 0; i < uncheckedListInfo.length; i++) {
				if(eval("(" + $(this).attr("add") + ")").id == uncheckedListInfo[i]["id"]) {
					uncheckedListInfo.splice(i, 1);
					--i;
				}
			}
		}

		if(delList.length > 0) {
			for(var i = 0; i < delList.length; i++) {
				if(eval("(" + $(this).attr("add") + ")").id == delList[i]["id"]) {
					delList.splice(i, 1);
					i--;
				}
			}
		}
		checkedList(checkedListInfo);
		uncheckedList(uncheckedListInfo);
	})
}
//*************************************已选列表查询*************************************
function funHRCheckedSearch() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPersonnelRelationExistentCmd",
		contentType: "application/text,charset=utf-8",
		data: checkedSearchPara(),
		success: function(msg) {
			console.log(JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				createCheckedList(msg);
			}
		},
		error: function() {
			loadingStop();
			console.log("查询失败");
		}
	});
}

function checkedSearchPara() {
	if(node_click_info != "") {
		var theNodeInfo = eval("(" + node_click_info + ")");
	}

	var jsonData = setJson(null, "account", $("#account2").val());
	jsonData = setJson(jsonData, "name", $("#name2").val());
	jsonData = setJson(jsonData, "jobPosition", $("#position2").val());
	if(node_click_info == "") {
		jsonData = setJson(jsonData, "departmentid", -1);
	} else {
		jsonData = setJson(jsonData, "departmentid", theNodeInfo.id);
	}
	jsonData = setJson(jsonData, "fatherId", parseInt(fatherId));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("未选列表查询传值=" + jsonData);
	return jsonData;
}

//********************************************已选列表**********************************************
function createCheckedList(msg) {

	checkedListInfo = msg.item;
	checkedList(checkedListInfo);

}

function checkedList(checkedListInfo) {
	if(!checkedListInfo || checkedListInfo.length < 1) {
		$("#checkedList").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无已选列表信息";
		str += "</div>";
		$("#checkedList").html(str);
		return;
	}
	$("#checkedList").html("");
	var realData = checkedListInfo;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='height:30px;'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>账号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>姓名</div></th>";
	str += "<th class='text-center'><div class='checkbox'>直接下属人数</div></th>";
	str += "<th class='text-center'><div class='checkbox'>部门</div></th>";
	str += "<th class='text-center'><div class='checkbox'>职位</div></th>";
	str += "<th class='text-center'><div class='checkbox'>电话号码</div></th>";
	str += "<th class='text-center'><div class='checkbox'>操作</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var data = JSON.stringify(realData[i]);

		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["account"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["hasChildr"] + "</td>";
		if(realData[i]["department"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["department"] + "</td>";
		}
		if(realData[i]["jobPosition"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["jobPosition"] + "</td>";
		}
		if(realData[i]["telNumber"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["telNumber"] + "</td>";
		}
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>";
		str += "<a  href='javascript:void(0)' class='del' del='" + JSON.stringify(realData[i]) + "'>移除</a>";
		str += "</td>";
		str += "</tr>";

	}
	str += "</tbody><table>";
	$("#checkedList").html(str);
	$(".del").click(function() {
		if(delList.length > 0) {
			var tip = 0;
			for(var i = 0; i < delList.length; i++) {
				if(eval("(" + $(this).attr("del") + ")").id == delList[i]["id"]) {
					tip++;
				}
			}
			if(tip == 0) {
				delList.push(eval("(" + $(this).attr("del") + ")"));
			}
		} else {
			delList.push(eval("(" + $(this).attr("del") + ")"));
		}

		if(uncheckedListInfo.length > 0) {
			var tip = 0;
			for(var i = 0; i < uncheckedListInfo.length; i++) {
				if(eval("(" + $(this).attr("del") + ")").id == uncheckedListInfo[i]["id"]) {
					tip++;
				}
			}
			if(tip == 0) {
				uncheckedListInfo.push(eval("(" + $(this).attr("del") + ")"));
			}
		} else {
			uncheckedListInfo.push(eval("(" + $(this).attr("del") + ")"));
		}

		if(checkedListInfo.length > 0) {
			for(var i = 0; i < checkedListInfo.length; i++) {
				if(eval("(" + $(this).attr("del") + ")").id == checkedListInfo[i]["id"]) {
					checkedListInfo.splice(i, 1);
					--i;
				}
			}
		}

		if(addList.length > 0) {
			for(var i = 0; i < addList.length; i++) {
				if(eval("(" + $(this).attr("del") + ")").id == addList[i]["id"]) {
					addList.splice(i, 1);
					i--;
				}
			}
		}
		uncheckedList(uncheckedListInfo);
		checkedList(checkedListInfo);

	})

}
//*************************************配置下属*************************************
function funConfig() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPersonnelRelationConfigureCmd",
		contentType: "application/text,charset=utf-8",
		data: configPara(),
		success: function(msg) {
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				windowStart("配置下属成功", true);
				funHRSearch();
				$("#setModal").modal("hide");
				funHRSearch();
			} else {
				windowStart("配置下属失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无配置人员权限", false);
			} else {
				windowStart("配置人员失败", false);
			}
		}
	});
}

function configPara() {
	var jsonData = setJson(null, "fatherId", parseInt(fatherId));
	var userId = [];
	for(var i = 0; i < addList.length; i++) {
		userId.push(addList[i]["id"]);
	}
	jsonData = setJson(jsonData, "userId", userId);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("添加下属传值=" + jsonData);
	return jsonData;
}
//*************************************移除下属*************************************
function funDelete() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPersonnelRelationDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: deletePara(),
		success: function(msg) {
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				//				windowStart("移除下属成功", true);
			} else {
				//				windowStart("移除下属失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无配置人员权限", false);
			} else {
				windowStart("配置人员失败", false);
			}
		}
	});
}

function deletePara() {
	var jsonData = setJson(null, "fatherId", parseInt(fatherId));
	var userId = [];
	for(var i = 0; i < delList.length; i++) {
		userId.push(delList[i]["id"]);
	}
	jsonData = setJson(jsonData, "userId", userId);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("移除下属传值=" + jsonData);
	return jsonData;
}
//*************************************展示已选列表查询*************************************
function funHRCheckedShow() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPersonnelRelationExistentCmd",
		contentType: "application/text,charset=utf-8",
		data: checkedShowPara(),
		success: function(msg) {
			console.log(JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				showCheckedList(msg);
			}
		},
		error: function() {
			loadingStop();
			console.log("查询失败");
		}
	});
}

function checkedShowPara() {
	if(node_click_info != "") {
		var theNodeInfo = eval("(" + node_click_info + ")");
	}

	var jsonData = setJson(null, "account", $("#account3").val());
	jsonData = setJson(jsonData, "name", $("#name3").val());
	jsonData = setJson(jsonData, "jobPosition", $("#position3").val());
	if(node_click_info == "") {
		jsonData = setJson(jsonData, "departmentid", -1);
	} else {
		jsonData = setJson(jsonData, "departmentid", theNodeInfo.id);
	}
	jsonData = setJson(jsonData, "fatherId", parseInt(fatherId));
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("未选列表查询传值=" + jsonData);
	return jsonData;
}

//********************************************展示已选列表**********************************************
function showCheckedList(msg) {
	if(!msg.item || msg.item.length < 1) {
		$("#showCheckedList").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无已选列表信息";
		str += "</div>";
		$("#showCheckedList").html(str);
		return;
	}
	realData = msg.item;
	$("#showCheckedList").html("");
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed' style='height:30px;'><thead>";
	str += "<th class='text-center' ><div class='checkbox'>账号</div></th>";
	str += "<th class='text-center' ><div class='checkbox'>姓名</div></th>";
	str += "<th class='text-center'><div class='checkbox'>下属人数</div></th>";
	str += "<th class='text-center'><div class='checkbox'>部门</div></th>";
	str += "<th class='text-center'><div class='checkbox'>职位</div></th>";
	str += "<th class='text-center'><div class='checkbox'>电话号码</div></th>";
	str += "</thead><tbody>";
	for(var i = 0; i < realData.length; i++) {

		str += "<tr  style='cursor:default'>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["account"] + "</td>";
		str += "<td class='text-center' style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["hasChildr"] + "</td>";
		if(realData[i]["department"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["department"] + "</td>";
		}
		if(realData[i]["jobPosition"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["jobPosition"] + "</td>";
		}
		if(realData[i]["telNumber"] == undefined) {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'></td>";
		} else {
			str += "<td class='text-center' style='width:15%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["telNumber"] + "</td>";
		}
		str += "</tr>";

	}
	str += "</tbody><table>";
	$("#showCheckedList").html(str);

}

//人员关系图

function getInfosPara() {
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "nameCn", search_infos);
	console.log("查询人员关系图传值=" + jsonData);
	return jsonData;
}

function getInfos() {
	$('#chartContainer').html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsPersonnelRelationFlowsheetCmd",
		contentType: "application/text,charset=utf-8",
		data: getInfosPara(),
		success: function(msg) {

			console.log("查询返回值=" + JSON.stringify(msg));
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {

				$('#chartContainer').orgchart({
					'data': msg.item,
					'depth': 2,
					'nodeTitle': 'name',
					'nodeContent': 'title'
				});

			} else {
				windowStart(msg.resp.responseCommand, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询人员分布图权限", false);
			} else {
				windowStart("查询人员分布图失败", false);
			}
		}
	})
}

$(document).ready(function() {
	$(".input-style-time").datepicker("setValue");
	$(".input-style-time").val("");
	funGetTree();
	searchSysInfos();
	funHRSearch();
	$("#department").click(function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 1;
		searchSysInfos();
		$("#zuzhiModal").modal("show");
		$(".theCheckTree").animate({
			right: "0px"
		}, 300);
	})
	$("#department1").click(function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 2;
		searchSysInfos();
		$("#zuzhiModal").modal("show");
		$(".theCheckTree").animate({
			right: "0px"
		}, 300);
	})
	$("#department2").click(function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 3;
		searchSysInfos();
		$("#zuzhiModal").modal("show");
		$(".theCheckTree").animate({
			right: "0px"
		}, 300);
	})
	$("#department3").click(function() {
		$(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 4;
		searchSysInfos();
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
		//	$("#searchDataModal").modal("show");
		//查询路线
	$("#btnSearchHumanRelations").click(function() {
			data_page_index = 0;
			curren_page = 1;
			$("#pageNumId").val("");
			funHRSearch();
		})
		//未选列表查询
	$("#btnSearchUncheckedHuman").click(function() {
			funHRUncheckedSearch();

		})
		//已选列表查询
	$("#btnSearchCheckedHuman").click(function() {
			funHRCheckedSearch();
		})
		//展示下属列表查询
	$("#btnShowCheckedHuman").click(function() {
			funHRCheckedShow();
		})
		//配置下属
	$("#btnHROk").click(function() {
		funDelete();
		funConfig();

	})
	$("#btnCancel").click(function() {
		$("#setModal").modal("hide");
	})

	//人员关系图
	$("#btnLook").click(function() {
		$("#infoModal").modal("show");
		getInfos();
	})

	$(".btn-search-infos").click(function() {
		$(".btn-search-infos").each(function() {
			$(this).removeClass("btn-primary");
			$(this).addClass("btn-default");
		})

		$(this).removeClass("btn-default");
		$(this).addClass("btn-primary");
		if(parseInt($(this).attr("theEq")) == 0) {
			search_infos = "";
		} else {
			search_infos = localStorage.getItem("userAccountName");
		}
		getInfos();
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
			funHRSearch();
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
			funHRSearch();
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
			funHRSearch();
		})
		//分页操作

	$("#clear").click(function() {
    $("#department").val("");
    $(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 1;
		searchSysInfos();
		funGetTree();
	});
	
	$("#clear1").click(function() {
    $("#department1").val("");
    $(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 2;
		searchSysInfos();
		funGetTree();
	});
	$("#clear2").click(function() {
    $("#department2").val("");
    $(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 3;
		searchSysInfos();
		funGetTree();
	});
	$("#clear3").click(function() {
    $("#department3").val("");
    $(".theCheckTree").animate({
			right: "-220px"
		}, 300);
		tips = 4;
		searchSysInfos();
		funGetTree();
	});
})