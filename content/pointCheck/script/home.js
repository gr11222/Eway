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

function EscapeString(str) {
	return escape(str).replace(/\%/g, "\$");
}

function UnEscapeString(str) {
	return unescape(str.replace(/\u/g, "\$"));
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

function getDeviceTypePara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "assetTypes", "", true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	//		jsonData = setJson(jsonData,"assetItems","",true);
	console.log("查询设备类型传值=" + jsonData);
	return jsonData;
}

function getDeviceType() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=PtCheckTypeByTemplateCmd",
		contentType: "application/text,charset=utf-8",
		data: getDeviceTypePara(),
		success: function(msg) {

			console.log("查询设备类型返回值=" + JSON.stringify(msg));
			createDeviceType(msg);
			getManList();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询设备类型权限", false);
			} else {
				windowStart("查询点设备类型失败", false);
			}

		}
	})
}
//查找巡检人
function getManList() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=ptCheckUserQueryByTempleteCmd",
		contentType: "application/text,charset=utf-8",
		data: getManListPara(),
		success: function(msg) {
			createManList(msg);
			console.log("查询巡检人返回值=" + JSON.stringify(msg));
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询巡检人权限", false);
			} else {
				windowStart("查询巡检人失败", false);
			}

		}
	})
}

function getManListPara() {
	var jsonData = setJson(null, "item", "", true);
	jsonData = setJson(jsonData, "tpdId", -1);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	return jsonData;
}

function createManList(msg) {
	var str = "<option value=''>请选择</option>";
	if(msg.item != undefined && msg.item.length > 0) {
		var theData = msg.item;
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["account"] + "'>" + theData[i]["nameCn"] + "</option>";
		}
	}
	$("#checkUser").html(str);
}

function createDeviceType(msg) {
	if(!msg.assetTypes || msg.assetTypes.length == 0) {
		return;
	}
	var str = "";
	var theData = msg.assetTypes;
	for(var i = 0; i < theData.length; i++) {
		if(theData[i]["type"] == "电表") {
			str += "<option isAuto='" + msg.requestCommand + "'  theDevice='" + JSON.stringify(theData[i]["assetItems"]) + "' value='" + theData[i]["type"] + "'>" + theData[i]["type"] + "</option>";
		} else {
			str += "<option isAuto='" + msg.requestCommand + "'  theDevice='" + JSON.stringify(theData[i]["assetItems"]) + "' value='" + theData[i]["type"] + "'>" + theData[i]["type"] + "</option>";
		}
	}
	$("#thePointDeviceType").html(str);
	var childData = eval("(" + $("#thePointDeviceType option:selected").attr("theDevice") + ")");
	if(childData != undefined && childData.length > 0) {
		if($("#thePointDeviceType option:selected").val() == "电表") {
			$("#theDeviceSelect").html('<option value="">全部</option>');
			$(".page-content").addClass("hide");
			$(".page-content-2").removeClass("hide");
			if(parseInt($("#thePointDeviceType option:selected").attr("isAuto")) == 1) {
				$("#isInsert").prop("checked", true);
			} else {
				$("#isInsert").prop("checked", false);
			}
		} else {
			var str = "";
			str += "<option value=''>全部</option>";
			for(var i = 0; i < childData.length; i++) {
				str += "<option value='" + childData[i] + "'>" + childData[i] + "</option>";
			}
			$("#theDeviceSelect").html(str);
			$(".page-content").removeClass("hide");
			$(".page-content-2").addClass("hide");
		}
	}
	elChange();
	$("#thePointDeviceType").change(elChange);
}
function elChange() {
		if($("#thePointDeviceType").val() != "火灾报警控制器") {
			$("#btnShowChartsDianJian").addClass("hide");
		} else {
			$("#btnShowChartsDianJian").removeClass("hide");
		}
		if($("#thePointDeviceType").val() == "电表") {
			$(".page-content").addClass("hide");
			$(".page-content-2").removeClass("hide");
			if(parseInt($("#thePointDeviceType option:selected").attr("isAuto")) == 1) {
				$("#isInsert").prop("checked", true);
			} else {
				$("#isInsert").prop("checked", false);
			}
		} else {
			$(".page-content").removeClass("hide");
			$(".page-content-2").addClass("hide");
			//			if($("#thePointDeviceType").val() == "火灾报警控制器" ){
			//				$("#btnShowChartsDianJian").addClass("hide");
			//			}
		}
		var childData = eval("(" + $("#thePointDeviceType option:selected").attr("theDevice") + ")");
		if(childData != undefined && childData.length > 0) {
			if($("#thePointDeviceType option:selected").val() == "电表") {
				$("#theDeviceSelect").html('<option value="">全部</option>');
			} else {
				var str = "";
				str += "<option value=''>全部</option>";
				for(var i = 0; i < childData.length; i++) {
					str += "<option value='" + childData[i] + "'>" + childData[i] + "</option>";
				}
				$("#theDeviceSelect").html(str);
			}
		}else{
			var str = "";
				str += "<option value=''>全部</option>";
				$("#theDeviceSelect").html(str);
		}
	}

//点检
function funPtSearchPara() {
	var theObj = {};
	theObj.assetsType = $("#thePointDeviceType").val();
	theObj.assetsItem = $("#theDeviceSelect").val();
	theObj.startTime = $("#startTime").val() + " 00:00:00";
	theObj.endTime = $("#endTime").val() + " 23:59:59";
	theObj.deviceId = "";
	theObj.checkUser = $("#checkUser").val();
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "queryTerms", theObj);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询点检传值=" + jsonData);
	return jsonData;
}

function funPtSearch() {
	$("#ptcontent").html("");
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=PtCheckSearchByTemplateCmd",
		contentType: "application/text,charset=utf-8",
		data: funPtSearchPara(),
		success: function(msg) {
			loadingStop();
			//			windowRemove();
			console.log("查询点检返回值=" + JSON.stringify(msg));
			$("#ptcontent").html("");
			$("#pageNumId").val("");
			//			if($("#thePointDeviceType").val() == "电表"){
			//				if(parseInt(msg.requestCommand)  == 1)
			//				{
			//	
			//					$("#isInsert").prop("checked",true);
			//				}
			//				else
			//				{
			//					$("#isInsert").prop("checked",false);
			//				}
			//			}        
			createPtTableInfos(msg);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询点检信息权限", false);
			} else {
				windowStart("查询点检信息失败", false);
			}
			//			windowStart("查询点检信息失败",false);
		}
	})
}

function createPtTableInfos(msg) {
	if(!msg.items || msg.items.length < 1) {
		$("#ptcontent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无点检记录统计信息";
		str += "</div>";
		$("#ptcontent").html(str);

		return;
	}
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + " 页/共 " + totalPage + " 页");

	var realData = msg.items;
	var titleData = msg.temitems;
	var str = "";

	if($("#thePointDeviceType").val() == "直燃机组") {
		//		str+="<div class=‘tital-div’ style=‘text-align: center;’>天津市第二儿童医院直燃机组运行记录表</div>";
		//		str+="<div class=‘message-div’>	";
		//      str+="<span >设备地点：十一号楼（ 二 ）号直燃机</span><span >20_____年_____月_____日</span>";
		//		str+="<span >星期_____</span><span>室外温度_____℃</span></div>";			
		str += "<div class=‘table-div’>";
		str += "<table  id='table' style='width:100%' class='table table-bordered table-striped table-hover table-condensed'>";
		str += "<tr ><th class='text-center ' style='width:13%'></th><th colspan='13' class='text-center' title='温度℃'>温度℃</th><th colspan='4' class='text-center' title='压力Kpa'>压力Kpa</th></tr>";
		str += "<tr ><th class='text-center'></th><th colspan='2' style='5%' class='text-center' title='冷温水温度'>冷温水温度</th><th colspan='2' style='5%' class='text-center' title='冷却水温度'>冷却水温度</th><th colspan='2' style='5%' class='text-center' title='冷剂温度'>冷剂温度</th><th class='text-center' style='width:10%' title='吸收器溶液'>吸收器溶液</th><th colspan='2' class='text-center' title='低温热交温度'>低温热交温度</th><th colspan='3' class='text-center' title='高温再生器温度'>高温再生器温度</th><th class='text-center' title='排烟'>排烟</th><th class='text-center' title='天然气'>天然气</th><th class='text-center' title='高温再生器'>高温再生器</th><th class='text-center' title='抽气箱'>抽气箱</th><th class='text-center' title='真空'>真空</th></tr>";
		str += "<tr ><th class='text-center' title='时间'>时间</th><th width='4%' class='text-center' title='入口'>入口</th><th width='4%' class='text-center' title='出口'>出口</th><th width='4%' class='text-center' title='入口'>入口</th><th width='4%' class='text-center' title='出口'>出口</th><th width='4%' class='text-center' title='蒸发'>蒸发</th><th width='4%' class='text-center' title='冷凝'>冷凝</th><th width='6%' class='text-center' title='出口温度'>出口温度</th><th width='5%' class='text-center' title='入口(浓)'>入口(浓)</th><th width='5%' class='text-center' title='出口(稀)'>出口(稀)</th><th width='4%' class='text-center' title='露点'>露点</th><th width='4%' class='text-center' title='入口'>入口</th><th width='4%' class='text-center' title='出口'>出口</th><th width='4%' class='text-center' title='温度'>温度</th><th width='4%' class='text-center' title='压力'>压力</th><th width='6%' class='text-center' title='压力'>压力</th><th width='5%' class='text-center' title='内压'>内压</th><th width='5%' class='text-center' title='压力表'>压力表</th></tr>";
		for(var i = 0; i < realData.length; i++) {
			if(realData[i]["items"] != undefined && realData[i]["items"].length != 0) {
				var tdData = realData[i]["items"];
				str += "<tr >";
				for(var j = 0; j < tdData.length; j++) {
					if(parseInt(tdData[j]["defaultValue"]) == -1) {
						str += "<td class='text-center' title='未检测'>未检测</td>";
					} else {
						str += "<td class='text-center' title='"+tdData[j]["defaultValue"]+"'>" + tdData[j]["defaultValue"] + "</td>";
					}

				}
				str += "</tr>";
			}

		}
		//      str+="<tr ><td class='text-center' style=‘height:100px;line-height:100px;’>备注</td><td colspan='17'></td></tr>";
		str += "</table></div>";
		//      str+="<div class='footer-div'>";
		//      str+="<span style='margin-left: 20px;'>运行班组：</span>";
		//      str+="<span style='margin-left: 80px;'>交班人：</span>";
		//      str+="<span style='margin-left: 80px;'>接班人：</span>";
		//      str+="<span style='margin-left: 80px;'>班长：</span>";
		//      str+="<span style='margin-left: 80px;'>审核人：</span>";
		//		str+="<span style='margin-left: 80px;'>制表：中发飞元第二儿童医院项目部</span>";
		//		str+="</div>";		
	} else {
		str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";

		for(var i = 0; i < titleData.length; i++) {
			str += "<th class='text-center' title='"+titleData[i]["nameCn"]+"'>" + titleData[i]["nameCn"] + "</th>";
		}

		str += "</thead><tbody>";
		for(var i = 0; i < realData.length; i++) {
			if(realData[i]["items"] != undefined && realData[i]["items"].length != 0) {
				var tdData = realData[i]["items"];
				str += "<tr class='ctrl-td' theName='" + titleData[1]["nameCn"] + "' >";
				for(var j = 0; j < tdData.length - 1; j++) {
					if(parseInt(tdData[j]["defaultValue"]) == -1) {
						str += "<td class='text-center' theValue='null' title='"+未检测+"'>未检测</td>";
					} else {

						var c = 0;
						for(var m = 0; m < tdData[j]["defaultValue"].length; m++) {
							if(tdData[j]["defaultValue"].charAt(m) == "!") {
								c++;
							}
						}
						if(c != 0) {
							var word = [];
							word = tdData[j]["defaultValue"].split("!");
							str += "<td class='text-center' theValue='" + tdData[j]["defaultValue"] + "' style='color:" + word[1] + "' title='"+word[0]+"'>" + word[0] + "</td>";
						} else {
							str += "<td class='text-center' theValue='" + tdData[j]["defaultValue"] + "' title='"+tdData[j]["defaultValue"]+"'>" + tdData[j]["defaultValue"] + "</td>";
						}
					}

				}
				if(parseInt(tdData[j]["defaultValue"]) == -1) {
					str += "<td class='text-center' theValue='null' title = '未检测'>未检测</td>";
				} else {
					if(realData[i]["picPaths"] == undefined) {
						str += "<td class='text-center' title='无相册'><a style='cursor:pointer' class='lookpic' >无相册</a></td>";
					} else {
						//str += "<td class='text-center' ><a style='cursor:pointer' class='lookpic' paths='" + JSON.stringify(realData[i]["picPaths"]) + "'><img src='../img/" + realData[i]["picPaths"].length + ".png'></a></td>";
						var picStr = "";
						for(var m = 0; m < realData[i]["picPaths"].length; m++) {
							picStr += realData[i]["picPaths"][m] + ","
						}
						picStr = picStr.substring(0, picStr.length - 1);
						str += "<td class='text-center' ><a style='cursor:pointer' class='lookpic' paths='" + picStr + "'><img src='../img/" + realData[i]["picPaths"].length + ".png'></a></td>";

					}
				}
				str += "</tr>";
			}

		}
		str += "</tbody><table>";
	}

	$("#ptcontent").html(str);

	$(".lookpic").click(function() {
		//		var theData = eval("(" + $(this).attr("paths") + ")");
		var theData = $(this).attr("paths").split(",");

		var str = "<div class='demo' >";
		//style='width: 100%;height: 20px;'
		str += "<div >";
		str += "<button type='button' class='close' data-dismiss='modal' aria-label='Close' style='margin-right: 20px;font-size: 50px;color: #FFFFFF;'><span aria-hidden='true' style='color:#FFFFFF'>&times;</span></button>";
		str += "</div>";
		str += "<a class='control prev'></a><a class='control next abs'></a>";
		str += "<div class='slider'>";
		str += "<ul>";
		//		str += "<li><img src='../../../CheckImage/SenseLIFT/0010300200111114000003001/20160816173246/search1.jpg' /></li>";

		for(var i = 0; i < theData.length; i++) {

			var path = decodeUnicode(theData[i]);
			str += "<li><img src='../../../.." + path + "' /></li>";

		}
		str += "</ul>";
		str += "</div>";
		str += "</div>";
		console.log(str);
		window.parent.getValueFromChildren(str);

	})

	if($("#thePointDeviceType").val() == "火灾报警控制器") {
		$("#btnShowChartsDianJian").removeClass("hide");
	} else {
		$("#btnShowChartsDianJian").addClass("hide");
	}
}

function decodeUnicode(path) {
	path = path.replace(/\\/g, "%");
	return unescape(path);
}

function createLineChart(theData, tagName) {
	console.log(JSON.stringify(theData));
	//	return;
	$("#lanelModal").modal("show");

	var data_arr = [];
	var axis_arr = [];
	var real_data_arr = [];
	for(var i = 0; i < theData.length; i++) {
		axis_arr.push(theData[i]["checkTime"]);
		data_arr.push(parseFloat(theData[i]["checkValue"]));

	}
	for(var i = 0; i < axis_arr.length; i++) {
		var dataArr = [];
		var axis_arr_split = axis_arr[i].split(" ");
		var date_arr = axis_arr_split[0].split("-");
		var time_arr = axis_arr_split[1].split(":");
		//		alert(Date.UTC(parseInt(date_arr[0]), parseInt(date_arr[1]), parseInt(date_arr[2]),parseInt(time_arr[0]),parseInt(time_arr[1]),0));
		//		var theDate = Date.UTC(parseInt(date_arr[0]), parseInt(date_arr[1]), parseInt(date_arr[2]),parseInt(time_arr[0]),parseInt(time_arr[1]),0);
		dataArr.push(Date.UTC(parseInt(date_arr[0]), parseInt(date_arr[1]) - 1, parseInt(date_arr[2]), parseInt(time_arr[0]), parseInt(time_arr[1]), 0));
		dataArr.push(data_arr[i]);
		real_data_arr.push(dataArr);
	}
	$("#chartContent").highcharts({
		chart: {
			type: 'spline',
			zoomType: "x"
		},
		credits: {
			enabled: false
		},
		title: {
			text: "标签：" + tagName,
			style: {
				fontWeight: "bold",
				fontSize: 16
			}
		},

		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {

				day: "%Y-%m-%e",
				month: "%Y-%m",
				year: "%Y",
			},
		},

		yAxis: {
			//          title: {
			//              text: 'Temperature (°C)'
			//          }
		},
		tooltip: {
			formatter: function() {
				var theTime = new Date(this.x);
				var year = theTime.getFullYear();
				var month = theTime.getMonth() + 1;
				var day = theTime.getDate();
				var hour = theTime.getHours();
				var min = theTime.getMinutes();
				if(month < 10) {
					month = "0" + month;
				}
				if(day < 10) {
					day = "0" + day;
				}
				if(hour < 10) {
					hour = "0" + hour;
				}
				if(min < 10) {
					min = "0" + min;
				}
				var str = year + "-" + month + "-" + day + " " + hour + ":" + min;
				return ' <b>' + str + '</b><br/><b>' + this.y + '</b>';
			}
		},
		plotOptions: {
			line: {
				dataLabels: {
					enabled: true
				},
				enableMouseTracking: false
			}
		},
		//      series:[{
		//          name: tagName,
		//          data: real_data_arr
		//      }]
		series: [{
			name: tagName,
			data: real_data_arr
		}]
	})
}

function funExportPtInfo() {
	loadingStart("ptcontent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=PtCheckExportByTemplateCmd",
		contentType: "application/text,charset=utf-8",
		data: funPtSearchPara(),
		success: function(msg) {
			//			loadingStop();
			//			console.log("导出点检返回值=" + JSON.stringify(msg));
			//
			//			window.location.href = "../../../../../" + msg.requestCommand;
			loadingStop();
			console.log("导出点检返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				if(msg.requestCommand == "") {
					windowStart("当前没有数据不能导出", false);
					return;
				} else {
					window.location.href = "../../../../../" + msg.requestCommand;
				}

			} else if(msg.responseCommand.toUpperCase().indexOf("FAIL") != -1) {
				window.location.href = "../../pointCheck/html/home.html";
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			//			windowStart("导出点检统计信息失败",false);
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无导出点检统计信息权限", false);
			} else {
				windowStart("导出点检统计信息失败", false);
			}
		}
	})
}

function printReport() {
	var newWindow = window.open("", "_blank"); //打印窗口要换成页面的url
	var htmlTitle = "<html><head><title>点检记录统计</title></head><body>"
	var htmlhead = $("#ptcontent").html();
	var htmlFoot = '</body></html>'
	newWindow.document.write(htmlTitle + htmlhead + htmlFoot);
	newWindow.document.close();
	newWindow.print();
	newWindow.close();
}

//点检
function funAutoAddDataPara() {
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "sing", is_start_auto + "");
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("启用自动补齐数据传值=" + jsonData);
	return jsonData;
}
//自动补齐
function funAutoAddData() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=PtCheckSignUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: funAutoAddDataPara(),
		success: function(msg) {
			console.log("自动补齐功能返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				if(is_start_auto == 0) {

					windowStart("自动补齐数据功能已关闭", true);

				} else {
					windowStart("自动补齐数据功能已启动", true);
				}
				$("#thePointDeviceType option").each(function() {
					if($(this).text() == "电表") {
						$(this).attr("isauto", is_start_auto);
					}
				})
			} else {
				if(is_start_auto == 0) {
					windowStart("自动补齐数据功能关闭失败", false);
				} else {
					windowStart("自动补齐数据功能启动失败", false);
				}

			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无启用自动补齐数据的权限", false);
			} else {
				windowStart("启用自动补齐数据功能失败", false);
			}
		}
	})
}

function funShowLineInfos() {
	if($(".ctrl-td").length == 0) {
		return;
	}
	$("#chartContent").html("");
	$("#lanelModal").modal("show");
	var theName = $(".ctrl-td").eq(0).attr("theName");
	var data_arr = [];
	var axis_arr = [];
	var real_data_arr = [];
	var theLength = 0;
	if($(".ctrl-td").length > 15) {
		theLength = 15
	} else {
		theLength = $(".ctrl-td").length;
	}
	for(var i = 0; i < theLength; i++) {
		axis_arr.push($(".ctrl-td").eq(i).children("td").eq(0).text());
		if($(".ctrl-td").eq(i).children("td").eq(1).attr("theValue") == "undefined" || $(".ctrl-td").eq(i).children("td").eq(1).attr("theValue") == "" || $(".ctrl-td").eq(i).children("td").eq(1).attr("theValue") == null) {
			data_arr.push(null);
		} else {
			data_arr.push(parseFloat($(".ctrl-td").eq(i).children("td").eq(1).attr("theValue")));
		}

	}
	//	for( var  i = 0 ; i < axis_arr.length ; i++ )
	//	{
	//		var dataArr = [];
	////		var axis_arr_split = axis_arr[i].split(" ");
	////		var date_arr = axis_arr_split[0].split("-");
	////		var time_arr = axis_arr_split[1].split(":");
	////		alert(Date.UTC(parseInt(date_arr[0]), parseInt(date_arr[1]), parseInt(date_arr[2]),parseInt(time_arr[0]),parseInt(time_arr[1]),0));
	////		var theDate = Date.UTC(parseInt(date_arr[0]), parseInt(date_arr[1]), parseInt(date_arr[2]),parseInt(time_arr[0]),parseInt(time_arr[1]),0);
	////		dataArr.push(Date.UTC(parseInt(date_arr[0]), parseInt(date_arr[1])-1, parseInt(date_arr[2]),parseInt(time_arr[0]),parseInt(time_arr[1]),0));
	//		dataArr.push(axis_arr[i]);
	//		dataArr.push(data_arr[i]);
	//		real_data_arr.push(dataArr);
	//	}
	$("#chartContent").highcharts({
		chart: {
			type: 'spline',
			zoomType: "x"
		},
		credits: {
			enabled: false
		},
		title: {
			text: "统计分析报告-火灾报警控制器",
			style: {
				fontWeight: "bold",
				fontSize: 16
			}
		},

		xAxis: {
			categories: axis_arr
		},

		yAxis: {
			title: {
				text: 'Value'
			}
		},
		tooltip: {

		},

		series: [{
			name: theName,
			data: data_arr
		}]
	})
}
$(document).ready(function() {
		//时间判断
function fundateCheck() {
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
	if($("#startTime").val().length == 0 && $("#endTime").val().length == 0) {
			windowStart("时间范围有误,请填写时间范围", false);
			return;
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
	$(".input-style").datepicker("setValue");
	getDeviceType();

	//点检
	$("#btnSearchDianJian").click(function() {
		if(!fundateCheck()) {
				return;
			}
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
		var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();

		// if(parseInt(startDate) > parseInt(endDate)) {

		// 	windowStart("时间范围有误", false);
		// 	return;
		// }
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		$("#pageTotalInfo").val("");
		funPtSearch();
	})
	$("#btnExportDianJian").click(function() {
			funExportPtInfo();
		})
		//点检打印
	$("#btnPrintDianJian").click(function() {
			printReport();
		})
		//点检分页操作
		//上一页
	$("#btnPageBefore").click(function() {
		if(!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
			if(total_page == 0) {
				return;
			}
			// if(parseInt(startDate) > parseInt(endDate)) {

			// 	windowStart("时间范围有误", false);
			// 	return;
			// }

			if(curren_page == 1) {
				windowStart("当前为首页", false);
				return;
			}
			data_page_index -= data_number;
			curren_page -= 1;
			funPtSearch();
		})
		//下一页
	$("#btnPageNext").click(function() {
		if(!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
			if(total_page == 0) {
				return;
			}
			// if(parseInt(startDate) > parseInt(endDate)) {

			// 	windowStart("时间范围有误", false);
			// 	return;
			// }

			if(total_page == curren_page) {
				windowStart("当前为尾页", false);
				return;
			}
			data_page_index += data_number;
			curren_page += 1;
			funPtSearch();
		})
		//跳转页
	$("#btnPageJump").click(function() {
		if(!fundateCheck()) {
				return;
			}
			var startTime = $("#startTime").val().split("-");
			var endTime = $("#endTime").val().split("-");
			var startDate = new Date(startTime[0], startTime[1], startTime[2]).getTime();
			var endDate = new Date(endTime[0], endTime[1], endTime[2]).getTime();
			if(total_page == 0) {
				return;
			}
			// if(parseInt(startDate) > parseInt(endDate)) {

			// 	windowStart("时间范围有误", false);
			// 	return;
			// }
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
			funPtSearch();
		})
		//点检分页操作

	//是否自动补齐
	$("#isInsert").change(function() {
		if($(this).prop("checked")) {
			is_start_auto = 1;
		} else {
			is_start_auto = 0;
		}
		funAutoAddData();
	})
	$("#btnShowChartsDianJian").click(function() {
		funShowLineInfos();
	})
})