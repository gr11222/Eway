$(function() {

	var total = -1;
	var data_page_index = 0;
	var data_number = 15;
	var curren_page = 1;
	var total_page = 0;
	var searchValue = '';
	//查询全部模板名称
	var BasicOptionStr = '';
	//判断是修改还是新增；true是新增
	var isAdd = true;

	var theRoleId;

	var nameOfRole = [];

	var nameOpt;

	function setAllBasicJson(id) {
		var jsonData = setJson(null, "roleId", id);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		console.log('基础传参：' + jsonData);
		return jsonData;
	}

	function setAllBasicAjax(datas) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBasicRoleItemSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: datas,
			success: function(msg) {
				var data = msg.item;
				console.log('全部基础返回：' + JSON.stringify(data));
				for (var i = 0; i < data.length; i++) {
					BasicOptionStr += "<option value='" + data[i].roleId + "'>" + data[i].roleCn + "</option>"
				}
				console.log(BasicOptionStr)
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("页面加载失败，请稍后重试", false);
			}
		});
	};
	setAllBasicAjax(setAllBasicJson(-1));
	setSearchAjax(setSearchJson($('#search_input').val(), curren_page - 1));

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

	$('#myModal').on("hidden.bs.modal", function() {
		$("#roleName_input").val('');
		$('#roleTemplate_select').val('');
		$('#powerList').html('');
	});
	//新增
	$('#btnRIAdd').on('click', function() {
		isAdd = true;
		$('#myModal').modal('show');
		$('#roleTemplate_select').html(BasicOptionStr);
		setBasicAjax(setBasicJson($('#roleTemplate_select').val()), $('#powerList'));
		// console.log(BasicOptionStr)
	});

	// 查询
	$('#btnSearchRouteInfos').on('click', function() {
		searchValue = $('#search_input').val();
		setSearchAjax(setSearchJson(searchValue, curren_page - 1));
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

			setSearchAjax(setSearchJson(searchValue, curren_page - 1));

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

			setSearchAjax(setSearchJson(searchValue, curren_page - 1));

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

			setSearchAjax(setSearchJson(searchValue, curren_page - 1));
		})
		//分页操作

	// 查询  初始化
	function setSearchJson(name, page) {
		var jsonData = setJson(null, "viewRoleCn", name);
		jsonData = setJson(jsonData, "index", page * data_number);
		jsonData = setJson(jsonData, "number", data_number);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		console.log('查询传参：' + jsonData);
		return jsonData;
	}

	function setSearchAjax(datas) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsViewRoleSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: datas,
			success: function(msg) {
				total_page = msg.totalNumber;
				console.log('查询返回：' + JSON.stringify(msg));
				if (msg.item) {
					createTable(msg);
					total = msg.totalNumber;
					total_page = Math.ceil(parseInt(total) / data_number);
					$("#pageNumId").val("");
					$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + total_page + " 页");
				} else {
					var text = "<div style='position: relative;width: 300px;margin:0 auto;margin-top: 10%;font-size: 20px;font-weight: bold;'>提示：<br />该条件下无角色信息</div>"
					$("#dataContent").html(text);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("查询错误，请稍后重试", false);
			}
		});
	};



	// 角色名称修改
	function setReviseJson(roleId, name, id) {
		var jsonData = setJson(null, "viewRoleId", roleId);
		jsonData = setJson(jsonData, "viewRoleCn", name);
		jsonData = setJson(jsonData, "basicRoleId", id);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		console.log('修改传参：' + jsonData);
		return jsonData;
	}

	function setReviseAjax(datas) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsViewRoleUpdateCmd",
			contentType: "application/text,charset=utf-8",
			data: datas,
			success: function(msg) {
				console.log('修改返回：' + JSON.stringify(msg));
				if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
					windowStart("修改角色信息成功", true);
					setSearchAjax(setSearchJson(searchValue, curren_page - 1));
				} else {
					windowStart("修改角色信息失败", false);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("错误，请稍后重试", false);
			}
		});
	};

	//角色删除
	function setDelJson(id) {
		var jsonData = setJson(null, "viewRoleId", id);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		console.log('删除传参：' + jsonData);
		return jsonData;
	}

	function setDelAjax(datas) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsViewRoleDeleteCmd",
			contentType: "application/text,charset=utf-8",
			data: datas,
			success: function(msg) {
				console.log('删除返回：' + JSON.stringify(msg));
				if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
					setSearchAjax(setSearchJson(searchValue, curren_page - 1));
					windowStart("删除角色信息成功", true);
				} else {
					windowStart("删除角色信息失败", false);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("错误，请稍后重试", false);
			}
		});
	};


	//角色添加
	function setAddJson(name, id) {
		var jsonData = setJson(null, "viewRoleId", -1);
		var jsonData = setJson(jsonData, "viewRoleCn", name);
		var jsonData = setJson(jsonData, "basicRoleId", id);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		console.log('添加传参：' + jsonData);
		return jsonData;
	}

	function setAddAjax(datas) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsViewRoleAddCmd",
			contentType: "application/text,charset=utf-8",
			data: datas,
			success: function(msg) {
				console.log(msg);
				if (msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
					setSearchAjax(setSearchJson(searchValue, curren_page - 1));
					windowStart("添加角色信息成功", true);
				} else {
					windowStart("添加角色信息失败", false);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("错误，请稍后重试", false);
			}
		});
	};
	//基础角色模板列表
	function setBasicJson(id) {
		var jsonData = setJson(null, "roleId", id);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		console.log('基础传参：' + jsonData);
		return jsonData;
	}

	function setBasicAjax(datas, ele) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBasicRoleCmdSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: datas,
			success: function(msg) {
				var data = msg.cmdItem;
				console.log('基础返回：' + JSON.stringify(data));
				var str = '<div style="font-weight:bold">&nbsp;权限列表: </div>';
				var listLength = 3; // 每行显示条数
				var dataLength = Math.ceil(data.length / listLength);
				for (var i = 0; i < dataLength; i++) {
					str += "<ul class='clearfix'>";
					for (var j = 0; j < listLength; j++) {
						console.log(i * listLength + j)
						if (data[i * listLength + j]) {
							str += "<li class='fl' style='width:" + (100 / listLength + "%") + ";padding-right:" + (100 / listLength * 0.2 + "%") + "'>" + data[i * listLength + j] + "</li>"
						}
					}
					str += "</ul>";
				}
				ele.html(str);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("加载基础模板错误，请稍后重试", false);
			}
		});
	};



	//建立表格
	function createTable(msg) {
		if (!msg.item || msg.item.length < 1) {
			$("#dataContent").html("");
			var str = "";
			str += '<div style="position:relative;width:100%;top:30%;margin:0px auto;font-size:25px;font-weight: bold;text-align:center">';
			str += "提示:<br/>当前条件下无角色信息！";
			str += "</div>";
			$("#dataContent").html(str);
			return;
		}

		var theData = msg.item;
		var str = "";
		str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
		str += "<th class='text-center'>角色名称</th>";
		str += "<th class='text-center'>使用模板</th>";
		str += "<th class='text-center'>操作</th>";
		str += "</thead><tbody>";
		nameOfRole = [];
		for (var i = 0; i < theData.length; i++) {
			str += "<tr>";
			nameOfRole.push(theData[i]["viewRoleCn"]);
			str += "<td class='text-center' style='width:38%;word-wrap: break-word;word-break: break-all;' title='"+theData[i]["viewRoleCn"]+"'>" + theData[i]["viewRoleCn"] + "</td>";
			str += "<td class='text-center' style='width:54%;word-wrap: break-word;word-break: break-all;' title='"+theData[i]["basicRoleCn"]+"'><a class='basicRoleCn' theId='" + theData[i]["basicRoleId"] + "'>" + theData[i]["basicRoleCn"] + "</a></td>";
			str += "<td class='text-center' style='width:8%;word-wrap: break-word;word-break: break-all;'>";
			str += "<span><a href='javascript:void(0)' class='edit-infos' viewRoleId='" + theData[i]["viewRoleId"] + "' theName='" + theData[i]["viewRoleCn"] + "'  theId='" + theData[i]["basicRoleId"] + "'><img src='../img/edit.png'></a></span>";
			str += "<span style='padding-left:5px'><a theId='" + theData[i]["viewRoleId"] + "' class='delete-infos' href='javascript:void(0)'>";
			str += "<img src='../img/dele.png'>";
			str += "</a></span></td>";
			str += "</td></tr>";
		}
		str += "</tbody><table>";

		$("#dataContent").html(str);
		//使用模板点击
		$('.basicRoleCn').on('click', function(e) {
				var edit_id = parseInt($(this).attr("theId"));
				$('#powerModal').modal('show');
				setBasicAjax(setBasicJson(edit_id), $('#modalList'));
			})
			//删除点击
		$(".delete-infos").click(function() {
				if (!confirm("是否确认删除")) {
					return;
				}
				setDelAjax(setDelJson(parseInt($(this).attr("theId"))));

			})
			//修改点击
		$(".edit-infos").click(function() {
			var edit_id = parseInt($(this).attr("theId"));
			isAdd = false;
			$('#myModal').modal('show');
			// setBasicAjax(setBasicJson(edit_id),$('myModal'));
			$('#roleName_input').val($(this).attr("theName"));
			$('#roleTemplate_select').html(BasicOptionStr);
			$('#roleTemplate_select').val(edit_id);
			setBasicAjax(setBasicJson(edit_id), $('#powerList'));
			theRoleId = $(this).attr("viewRoleId");
			nameOpt = $('#roleName_input').val();
			console.log(nameOpt)
		})
	}
	$("#roleTemplate_select").on('change', function() {
		var edit_id = parseInt($(this).val());
		setBasicAjax(setBasicJson(edit_id), $('#powerList'));
	})

	$('#addInfoSure').on('click', function() {
		if (isAdd) {
			var pattern = /^[\u4e00-\u9fa5a-zA-Z]+$/;
			if ($('#roleName_input').val().length === 0) {
				windowStart("请输入角色名称", false);
				return;
			}
			if (!(pattern.test($('#roleName_input').val()))) {
				windowStart("角色名称只能输入中文或英文", false);
				return;
			}
			for (var i = 0; i < nameOfRole.length; i++) {
				if ($('#roleName_input').val() == nameOfRole[i]) {
					windowStart("该角色名称已存在", false);
					return;
				}
			}
			//if(txtVal.length==0) return true;       
			// var bol= pattern.test(txtVal.value);  
			setAddAjax(setAddJson($('#roleName_input').val(), parseInt($('#roleTemplate_select').val())));
			$('#myModal').modal('hide');
			console.log('新增')
		} else {
			var pattern = /^[\u4e00-\u9fa5a-zA-Z]+$/;
			if ($('#roleName_input').val().length === 0) {
				windowStart("请输入角色名称", false);
				return;
			}
			if (!(pattern.test($('#roleName_input').val()))) {
				windowStart("角色名称只能输入中文或英文", false);
				return;
			}
			console.log(nameOpt);
			console.log($('#roleName_input').val());
			console.log(!($('#roleName_input').val() === nameOpt))
			console.log(nameOfRole);
			if (!($('#roleName_input').val() === nameOpt)) {
				for (var i = 0; i < nameOfRole.length; i++) {
					if ($('#roleName_input').val() == nameOfRole[i]) {
						windowStart("该角色名称已存在", false);
						return;
					}

				}
			}
			setReviseAjax(setReviseJson(theRoleId, $('#roleName_input').val(), parseInt($('#roleTemplate_select').val())));
			$('#myModal').modal('hide');
			console.log('修改')
		}
	})
})