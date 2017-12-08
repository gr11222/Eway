$(function() {
	var total = -1;
	var data_page_index = 0;
	var data_number = 2;
	var curren_page = 1;
	var total_page = 0;
	var sortId = -1;

	// var totalInfo = 0;
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

	//资产资料类型
	function setFileSortJson() {
		var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
		return jsonData;
	}

	function fileSortAjax() {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsKnowLibraryTypeSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: setFileSortJson(),
			success: function(msg) {
				if(!(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1)){
					windowStart(msg.resp.failReason,false);
					return;
				}
				var options = '';
				var str = '';
				for (var i = 0; i < msg.item.length; i++) {
					options += "<option value=" + msg.item[i].id + ">" + msg.item[i].nameCn + "</option>"
				}
				str += '<div class="uploadContent clearfix"><select class="selectSort fl"><option name="selectSort" disabled="" selected="" style="display: none">请选择使用分类</option>' + options +
					'</select><input type="file" class="fl" style="margin-left: 30px"><button class="btn btn-primary browse-btn addMore fr">添加</button><button class="btn browse-btn btn-danger  delThis fr" style="margin-left:0px">删除</button></div>';
				insertEle($('#myForm'), str);
				$('#myForm').find('div:last').addClass('div_last').siblings().removeClass('div_last');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("请稍后重试", false);
			}
		});
	}
	fileSortAjax();

	//append 元素
	function insertEle(ele, str, cb) {
		ele.append(str);
		if (cb) {
			cb();
		}
	}

	$('#myForm').on('click', '.addMore', function(e) {
		e.preventDefault();
		$('.addMore').css('display','none');
		fileSortAjax();
		// $(this).parent().next().addClass('div_last').siblings().removeClass('div_last');
		// console.log($(this).parent().next());
	})
	$('#myForm').on('click', '.delThis', function(e) {
		e.preventDefault();
		if($(this).parent().parent().find('div').length===1){
			windowStart("不能删除唯一附件",false);
			return;
		}
		if($(this).parent().hasClass('div_last')){
			$(this).parent().prev().addClass('div_last').siblings().removeClass('div_last');
			$(this).parent().prev().find('.addMore').css('display','block');	
		}
		// console.log($(this).parent().parent().find('div:last').prev().find('.addMore').attr('class'))
		$(this).parent().remove();
		// fileSortAjax();
	})

	function setSortJson() {
		var jsonData = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
		return jsonData;
	}
	// 资产类型options
	(function() {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDeviceClassifyByFileCmd",
			contentType: "application/text,charset=utf-8",
			data: setSortJson(),
			success: function(msg) {
				console.log('资产类型返回值：' + JSON.stringify(msg));
				if (msg.item) {
					var options = '';
					for (var i = 0; i < msg.item.length; i++) {
						options += "<option value=" + msg.item[i].id + ">" + msg.item[i].nameCn + "</option>"
					}
					insertEle($('#select-company'), options);
				}

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("请稍后重试", false);
			}
		});
	})();

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
			// var sortId = parseInt($('#select-company').val());
			//  		if(isNaN(sortId)){
			//  			sortId=-1;
			//  		}
			setSearchAjax(setSearchJson(sortId, curren_page - 1));

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
			// var sortId = parseInt($('#select-company').val());
			//  		if(isNaN(sortId)){
			//  			sortId=-1;
			//  		}
			setSearchAjax(setSearchJson(sortId, curren_page - 1));

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
			// var sortId = parseInt($('#select-company').val());
			//  		if(isNaN(sortId)){
			//  			sortId=-1;
			//  		}
			setSearchAjax(setSearchJson(sortId, curren_page - 1));
		})
		//分页操作
		//创建 页面content模块
	function createNoteBook(obj,num) {
		$('div.main-content').html('');
		var str = '';
		str += "<div class='content" + obj.devicetypeId + "' data-selectSortId='" + obj.devicetypeId + "'>" +
			"<div class='clearfix'><div class='search-items-left'><span class='key-word-style'>资产类型</span><span id='selectItems'>" + obj.devicetypeCn +
			"</span></div><div class='search-items-right addFile'><a class='btn btn-primary addFileClass'><span style='padding-left: 5px;'>上传附件</span></a></div></div>"
		if (obj.fileItem) {
			for (var i = 0; i < obj.fileItem.length; i++) {
				str += "<div class='notebook clearfix'><span class='key-word-style fl' style='height:100%;width:5%'>";
				str += obj.fileItem[i].filetypeCn;
				str += "</span><div class='clearfix fl' style='width:95%'>";
				for (var j = 0; j < obj.fileItem[i].fileInfo.length; j++) {
					str += "<div class='fl notebook-right'><a class='notebook-link' target='_blank' href='../../../../" + obj.fileItem[i].fileInfo[j].filePath +
						"'>"
					str += obj.fileItem[i].fileInfo[j].fileCn +
						"</a><div class='notebook-link-btn'><a class='download-link btn btn-success' href='../../../../" + obj.fileItem[i].fileInfo[j].filePath +
						// +"' download='"+
						// +obj.fileItem[i].fileInfo[j].fileCn+
						"' download='" + obj.fileItem[i].fileInfo[j].fileCn +
						"'>下载</a><a class='download-link btn btn-danger deleteBtn' data-relationId='" + obj.fileItem[i].fileInfo[j].relationId +
						"'>删除</a></div></div>"
				}
				str += "</div></div>";
			}
		}
		str += "</div>";
		return str;
	}

	function decodeUnicode(path) {
		if (path === undefined) {
			return;
		}
		path = path.replace(/\\/g, "%");
		return unescape(path);
	}

	function re(pValue) {
		if (pValue === undefined) {
			return;
		}
		return unescape(pValue.replace(/&#x/g, '%u').replace(/\\u/g, '%u').replace(/;/g, ''));
	}

	var selectSortId = '';

	//查询界面初始化
	setSearchAjax(setSearchJson(-1, 0));

	//-----------------------------------------------------删除
	function deleteJson(id) {
		var jsonData = setJson(null, "relationId", id);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		return jsonData;
	}

	function deleteAjax(data) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsKnowLibraryInfoDeleteCmd",
			contentType: "application/text,charset=utf-8",
			data: data,
			success: function(msg) {
				// console.log(JSON.stringify(msg));
				if(!(msg.responseCommand.toUpperCase().indexOf("OK") != -1)){
					windowStart(msg.resp.failReason,false);
					return;
				}
				// msg.totalNumber
				// if(msg.totalNumber!=totalInfo){
				// 	if(parseInt(num)%2===0){
				// 		console.log('444')
				// 		curren_page--;
				// 	}	
				// }
				windowStart("删除文件成功", true);
				setSearchAjax(setSearchJson(sortId, curren_page - 1));
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("请稍后重试", false);
			}
		});
	}
	$('div.main-content').on('click', '.deleteBtn', function() {
		if (!confirm("是否确认删除")) {
			return;
		}
		// var theIdNum = $(this).parent().parent().parent().parent().parent().attr('theIdNum');
		deleteAjax(deleteJson($(this).attr('data-relationId')));
	})

	//----------------------查询
	$('#btnSearchRouteInfos').on('click', function() {
		sortId = parseInt($('#select-company').val());
		if (isNaN(sortId)) {
			sortId = -1;
		}
		setSearchAjax(setSearchJson(sortId, 0));
	})

	function setSearchJson(id, page) {
		var jsonData = setJson(null, "devicetypeId", id);
		jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData, "index", page * data_number);
		jsonData = setJson(jsonData, "number", data_number);
		console.log('查询传参：' + jsonData);
		return jsonData;
	}

	function setSearchAjax(datas) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsKnowLibraryInfoSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: datas,
			success: function(msg) {
				// console.log('查询返回：'+JSON.stringify(msg.item));
				if(!(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1)){
					windowStart(msg.resp.failReason,false);
					return;
				}
				if (msg.item) {
					total_page = msg.totalNumber;
					var str = '';
					total = msg.totalNumber;
					// totalInfo = total;
					total_page = Math.ceil(parseInt(total) / data_number);
					$("#pageNumId").val("");
					$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + total_page + " 页");
					for (var i = 0; i < msg.item.length; i++) {
						str += createNoteBook(msg.item[i],i);
					}
					insertEle($('div.main-content'), str);
					$('.key-word-style').css('height', parseInt($('.notebook').css('height')) - 40 + 'px')
						// windowStart("查询成功",true);
				} else {
					// windowStart("暂无信息", false);
					if(curren_page>1){
						curren_page--;
						setSearchAjax(setSearchJson(sortId, curren_page - 1));
					}else{
						var str = '<div style="position: relative;width: 100%;top:30%;font-size: 22px;text-align: center;">暂无文件，请上传后查看</div>'
						$('div.main-content').html(str);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				windowStart("查询错误，请稍后重试", false);
			}
		});
	};

	//上传modal
	$('div.main-content').on('click', '.addFileClass', function() {
		selectSortId = $(this).parent().parent().parent().attr('data-selectSortId');
		var $modal = $('#myModal');
		$modal.modal('show');
		$('#myForm').html('');
		fileSortAjax();
		var $btn = '<button id="sub" style="display:none"></button>'
		$('#myForm').append($btn);
	})

	$('#addFileSure').on('click', function() {
			var file = $('input[type="file"]');
			var select = $('.selectSort');
			var fileSize = 0;
			var sureArr = [];
			for (var i = 0; i < file.length; i++) {
				if (select.eq(i).val() === null) {
					windowStart("请选择文件类型", false);
					sureArr[i] = false;
				} else if (!(file[i].files[0])) {
					windowStart("请选择文件", false);
					sureArr[i] = false;
				} else {
					fileSize = file[i].files[0].size / 1024 / 1024;
					if (fileSize > 15) {
						windowStart("文件大小不能超过15M", false);
						sureArr[i] = false;
					} else {
						sureArr[i] = true;
					}
				}
			}
			var sure = true;
			for (var j = 0; j < sureArr.length; j++) {
				sure = sure && sureArr[j];
			}
			if (sure) {
				for (var i = 0; i < file.length; i++) {
					file.eq(i).attr('name', +selectSortId + ',' + file.eq(i).siblings('select').val());
				}
				$('#sub').click();
				var $modal = $('#myModal');
				$modal.modal('hide');
				$('.main-content').html('<div style="text-align: center;font-size: 50px;font-weight: bold;margin-top: 100px;">正在上传，请等待</div><div id = "box" style="width: 300px;height: 210px;margin: 0 auto;position: relative;left:0px;"></div><script src="../../lib/jquery-1.9.1.min.js" type="text/javascript" charset="utf-8"></script><script src="../../lib/new-loading/loading_em.js" type="text/javascript" charset="utf-8"></script><script>loadingStart("box");</script>')
			}
		})
		// function dealDownLoad(msg){
		// 	var filename = msg.item.fileName;
		// 	var downLoadUrl = msg.item.filePath;
		// 	downLoadUrl = dealPath(downLoadUrl);
		// 	$('span[name="fileName"]').text(filename);
		// 	$('a[name="downLoad"]').attr("href", downLoadUrl);	
		// }

	// function dealPath(downLoadUrl){
	// 	var index = downLoadUrl.indexOf("DevOpsNoSpring") + 14;
	// 	downLoadUrl = "../../.." + downLoadUrl.substr(index);
	// 	alert(downLoadUrl);
	// 	return downLoadUrl;
	// }
});