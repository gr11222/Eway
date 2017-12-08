var treeStr = "";
var node_click_info = "";
var edit_id = -1;
var total = -1;
var data_page_index = 0;
var data_number = 15;
var curren_page = 1;
var total_page = 0;
var tip = 0;
var before = "";

//判断json是否相同
function isObj(object) {
	return object && typeof(object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
}

function isArray(object) {
	return object && typeof(object) == 'object' && object.constructor == Array;
}

function getLength(object) {
	var count = 0;
	for (var i in object) count++;
	return count;
}

function Compare(objA, objB) {
	if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
	if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
	return CompareObj(objA, objB, true); //默认为true
}

function CompareObj(objA, objB, flag) {
	for (var key in objA) {
		if (!flag) //跳出整个循环
			break;
		if (!objB.hasOwnProperty(key)) {
			flag = false;
			break;
		}
		if (!isArray(objA[key])) { //子级不是数组时,比较属性值
			if (objB[key] != objA[key]) {
				flag = false;
				break;
			}
		} else {
			if (!isArray(objB[key])) {
				flag = false;
				break;
			}
			var oA = objA[key],
				oB = objB[key];
			if (oA.length != oB.length) {
				flag = false;
				break;
			}
			for (var k in oA) {
				if (!flag) //这里跳出循环是为了不让递归继续
					break;
				flag = CompareObj(oA[k], oB[k], flag);
			}
		}
	}
	return flag;
}
//判断json是否相同

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
		if (!msg.nameCn) {
			return;
		} else if (parseInt(msg.hasChild) == 1) {
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
	var nodeInfo = getSelectNodeInfo("ztreeGroup");
	node_click_info = JSON.stringify(nodeInfo);
	if (tip == 0) {
		before = nodeInfo;
		tip++;
	}
	var result = Compare(before, nodeInfo);
	if (!result) {
		data_page_index = 0;
		curren_page = 1;
		tip = 0;
	}
	$("#btnCheckLastName").val(nodeInfo.name);
	$("#page-main-content").html("");

	if (nodeInfo.children == undefined || nodeInfo.children.length == 0) {
		var str = "";
		str = "<div style='position:relative;width:100%;top:30%;font-size:20px;text-align:center'>";
		str += "当前组织下无子组织信息";
		str += "</div>";
		$("#page-main-content").html(str);

	} else {
		var theData = nodeInfo.children;
		total = theData.length;
		var totalPage = Math.ceil(parseInt(total) / data_number);
		total_page = totalPage;
		$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");

		var str = "";
		str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
		str += "<th class='text-center' >序号</th>";
		str += "<th class='text-center'>下级组织名称</th>";
		str += "<th class='text-center'>管理</th>";
		str += "</thead><tbody>";
		var end = curren_page * data_number;
		if (curren_page * data_number > total) {
			end = total;
		} else {
			end = curren_page * data_number;
		}
		for (var i = data_page_index; i < end; i++) {

			str += "<tr >";
			str += "<td class='text-center' style='width:5%'>" + (i + 1) + "</td>";
			str += "<td class='text-center'  style='width:25%;word-wrap: break-word;word-break: break-all;' title='"+theData[i]["name"]+"'>" + theData[i]["name"] + "</td>";

			str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>";
			str += "<span><a class='edit-class' title='修改' theData='" + JSON.stringify(theData[i]) + "'  theId='" + theData[i]["id"] + "' href='javascript:void(0)'><img src='../img/edit.png' /></a><span>";
			str += "<span style='padding-left:10px'><a  title='删除' theId='" + theData[i]["id"] + "' class='delete-class' href='javascript:void(0)' hasChildren='" + theData[i]["children"] + "'><img src='../img/dele.png' /></a><span>";

			str += "</td>";

			str += "</tr>";
		}
		str += "</tbody><table>";
		$("#page-main-content").html(str);
		$(".edit-class").click(function() {
			edit_id = parseInt($(this).attr("theId"));
			var theData = eval("(" + $(this).attr("theData") + ")");
			$("#editzuzhiName").val(theData.name);
			$("#btneditCheckLastName").val(theData.pName);

			$("#editzuzhiModal").modal({
				show: true,
				//				backdrop:false
			});
			nodeClick();

		})

		//删除
		$(".delete-class").click(function() {
			if ($(this).attr("hasChildren") != "undefined") {
				windowStart("该组织还有下属部门，不可删除", false);
				return;
			}
			if (!confirm("是否确认删除?")) {
				return;
			}
			funDeleteJobInfo(parseInt($(this).attr("theId")));
			nodeClick();
		})
	}

}

function zTreeOnCheck() {

}

function 在TreeRemove() {
	var treeObj = $.fn.zTree.getZTreeObj("tree");
	var nodes = treeObj.getSelectedNodes();
	for (var i = 0, l = nodes.length; i < l; i++) {
		treeObj.removeNode(nodes[i]);
	}
}
//用户维护---获取物业公司和角色

function funGetTreeInfosPara() {

	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "nameCn", $("#inputNameCn").val());

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
				if (theData.nameCn) {
					treeStr = "[";
					createAreaTree(theData, "", "");
					if (parseInt(theData.hasChild) == 1) {
						var realData = msg.item.children;
						for (var i = 0; i < realData.length; i++) {

							createAreaTree(realData[i], theData.id, theData.nameCn);
						}

					}
					treeStr = treeStr.substring(0, treeStr.length - 1) + "]";
					treeStr = eval("(" + treeStr + ")");

					var tree = new createTree("ztreeGroup", treeStr, nodeClick, false);
					tree.showTree();
				} else {
					var str = "";
					str = "<div style='font-weight:bold;position:relative;width:300px;top:30%;font-size:20px;margin:0 auto;'>";
					str += "提示：<br / >";
					str += "当前条件下无组织信息";
					str += "</div>";
					$("#page-main-content").html(str);
				}
			} else {
				windowStart(msg.resp.responseCommand, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//

			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无查询组织结构信息权限", false);
			} else {
				windowStart("查询组织结构信息失败", false);
			}
		}
	})
}

function funAddInfosPara() {
	var theNodeInfo = eval("(" + node_click_info + ")");
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "treeId", -1);
	jsonData = setJson(jsonData, "treeName", $("#zuzhiName").val());
	jsonData = setJson(jsonData, "fatherId", theNodeInfo.id);

	console.log("添加组织结构传值=" + jsonData);
	return jsonData;
}

function funAddInfos() {
	var rge = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
	var rge2 = /^[0-9]/;
	if (!$("#zuzhiName").val()) {
		windowStart("请填写组织名称", false);
		return;
	}
	if (!rge.test($("#zuzhiName").val())) {
		windowStart("组织名称只能输入中文、英文、数字", false);
		return;
	}
	if (rge2.test($("#zuzhiName").val())) {
		windowStart("组织名称只能输入中文、英文开头", false);
		return;
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsOrganizationTreeAddCmd",
		contentType: "application/text,charset=utf-8",
		data: funAddInfosPara(),
		success: function(msg) {
			loadingStop();
			console.log("添加组织结构返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#zuzhiModal").modal("hide");
				$("#zuzhiName").val("");
				windowStart("组织信息添加成功", true);
				data_page_index = 0;
				curren_page = 1;
				funGetTree();
				var str = "";
				str = "<div style='font-weight:bold;position:relative;width:300px;top:30%;font-size:20px;margin:0 auto;'>";
				str += "提示：<br />";
				str += "请选择组织名称";
				str += "</div>";
				$("#page-main-content").html(str);
			} else {
				windowStart(msg.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无添加组织信息权限", false);
			} else {
				windowStart("组织信息添加失败", false);
			}
		}
	})
}

function funEditInfosPara() {

	var theNodeInfo = eval("(" + node_click_info + ")");

	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "treeId", edit_id);
	jsonData = setJson(jsonData, "treeName", $("#editzuzhiName").val());
	//		if(theNodeInfo.pId == null)
	//		{
	//			jsonData = setJson(jsonData,"fatherId",theNodeInfo.id);
	//		
	//		}
	//		else
	//		{
	//			jsonData = setJson(jsonData,"fatherId",theNodeInfo.pId);
	//			
	//		}
	jsonData = setJson(jsonData, "fatherId", theNodeInfo.id);
	console.log("修改组织结构传值=" + jsonData);
	return jsonData;
}

function funEditInfos() {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsOrganizationTreeUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funEditInfosPara(),
		success: function(msg) {
			loadingStop();
			console.log("修改组织结构返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				$("#editzuzhiModal").modal("hide");
				windowStart("组织信息修改成功", true);
				data_page_index = 0;
				curren_page = 1;
				funGetTree();
				var str = "";
				str = "<div style='font-weight:bold;position:relative;width:300px;top:30%;font-size:20px;margin:0 auto;'>";
				str += "提示：<br />";
				str += "请选择组织名称";
				str += "</div>";
				$("#page-main-content").html(str);
			} else {
				windowStart(msg.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无修改组织信息权限", false);
			} else {
				windowStart("组织信息修改失败", false);
			}
		}
	})
}

function funDeleteJobInfoPara(theId) {
	var theNodeInfo = eval("(" + node_click_info + ")");
	var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	jsonData = setJson(jsonData, "treeId", theId);
	jsonData = setJson(jsonData, "treeName", "");
	jsonData = setJson(jsonData, "fatherId", theNodeInfo.id);

	console.log("删除组织结构传值=" + jsonData);
	return jsonData;
}

function funDeleteJobInfo(theId) {

	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsOrganizationTreeDeleteCmd",
		contentType: "application/text,charset=utf-8",
		data: funDeleteJobInfoPara(theId),
		success: function(msg) {
			loadingStop();
			console.log("删除组织结构返回值=" + JSON.stringify(msg));
			if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {

				windowStart("删除组织信息成功", true);
				data_page_index = 0;
				curren_page = 1;
				funGetTree();
				var str = "";
				str = "<div style='font-weight:bold;position:relative;width:300px;top:30%;font-size:20px;margin:0 auto;'>";
				str += "提示：<br />";
				str += "请选择组织名称";
				str += "</div>";
				$("#page-main-content").html(str);
			} else if (msg.responseCommand.toUpperCase().indexOf("FAIL") != -1) {
				windowStart("该组织还有下属部门，不可删除", false);
			} else if (msg.responseCommand.toUpperCase().indexOf("OCCUPY") != -1) {
				windowStart("已被占用不能删除", false);
			} else {
				windowStart(msg.responseCommand, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if (xmlRequest == "401") {
				windowStart("当前用户无删除组织信息权限", false);
			} else {
				windowStart("删除组织信息失败", false);
			}
		}
	})
}

$(document).ready(function() {

	window.onresize = function() {
		$(".body-left-bottom").height($(".body-left").height() - $(".body-left-top").height());
		$(".body-right-bottom").height($(".body-right").height() - $(".body-right-top").height() - 10);
	}
	funGetTree();

	$("#btnAddInfos").click(function() {
		if (node_click_info == "") {
			windowStart("请选择组织", true);
			return;
		}

		$("#zuzhiModal").modal("show");
		$(".modal-backdrop").click(function() {
			$("#zuzhiName").val("");
		})
	})
	$("#btnCancleInfos").click(function() {

		$("#zuzhiModal").modal("hide");
		$("#zuzhiName").val("");
	})
	$("#btnCloseInfos").click(function() {

		$("#zuzhiModal").modal("hide");
		$("#zuzhiName").val("");
	})

	//	$("#btnCheckLastName").click(function(){
	//		$(".theCheckTree").animate({right:"0px"},300);
	//	})
	//	$(".left-toogle").click(function(){
	//		$(".theCheckTree").animate({right:"-220px"},300);
	//	})

	$("#btnRealAddUser").click(function() {
		funAddInfos();
		nodeClick();
	})

	$("#btneditRealUser").click(function() {
		if (!$("#editzuzhiName").val()) {
			windowStart("请填写组织名称", true);

			return;
		}
		var rge = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
		var rge2 = /^[0-9]/;
		if (rge2.test($("#editzuzhiName").val())) {
			windowStart("组织名称只能输入中文、英文开头", false);
			return;
		}
		if (!rge.test($("#editzuzhiName").val())) {
			windowStart("组织名称只能输入中文、英文、数字", false);
			return;
		}
		funEditInfos();
	})

	$("#btnSearchTreeInfos").click(function() {
		data_page_index = 0;
		curren_page = 1;
		funGetTree();
		var str = "";
		str = "<div style='font-weight:bold;position:relative;width:300px;top:30%;font-size:20px;margin:0 auto;'>";
				str += "提示：<br />";
				str += "请选择组织名称";
				str += "</div>";
		$("#page-main-content").html(str);
	})

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
			nodeClick();
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
			nodeClick();
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
			$("#pageNumId").val("");
			nodeClick();
		})
		//分页操作
})