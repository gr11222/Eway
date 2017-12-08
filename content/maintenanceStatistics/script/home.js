var total = -1;
var data_page_index = 0;
var data_number = 10;
var curren_page = 1;
var total_page = 0;

var barChartCount = [];
var barChartNameCn = [];
var pieChartCount = [];
var pieChartNameCn = [];
var tableContent = [];
var userAccount;
var sign; //0表示降序，1表示升序
var user;

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

//********************************获得用户********************************
function searchUserInfosPara() {
	var jsonData = setJson(null, "resp", {});
	jsonData = setJson(jsonData, "account", "", true);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("查询用户传值=" + jsonData);
	return jsonData;
}

function searchUserInfos() {
	$("#userName").html("");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDataPagingUserQueryCriteriaCmd",
		contentType: "application/text,charset=utf-8",
		data: searchUserInfosPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询用户返回值=" + JSON.stringify(msg));
				createUserInfoSelect(msg);
				funMSChartSearch();
			} else {
				windowStart("查询用户失败", false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询用户权限", false);
			} else {
				windowStart("查询用户失败", false);
			}
		}
	})
}

function createUserInfoSelect(msg) {
	//用户
	if(msg.account != undefined && msg.account.length > 0) {
		userAccount = msg.account;
		var str = "<option value='-1'>请选择</option>";
		for(var i = 0; i < userAccount.length; i++) {
			str += "<option value='" + userAccount[i]["account"] + "'>" + userAccount[i]["nameCn"] + "</option>";
		}
		$("#userName").html(str);
	}
}
//********************************查询********************************
function funMSSearch() {
	$("#dataContent").html("");
	loadingStart("dataContent");
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairStatisticsPagingSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: maintenanceStatisticsSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				loadingStop();
				//$("#pageNumId").val("");
				console.log(JSON.stringify(msg));
				createDataStatisticsTableInfos(msg);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询权限", false);
			} else {
				windowStart("查询失败", false);
			}
			console.log("fail");
		}
	});
}

function maintenanceStatisticsSearchPara() {
	var account = [];
	if($("#userName").val() == "-1") {
		for(var i = 0; i < userAccount.length; i++) {
			var arr = {};
			arr.account = userAccount[i]["account"];
			arr.nameCn = userAccount[i]["nameCn"];
			account.push(arr);
		}
	} else {
		var arr = {};
		arr.account = $("#userName").val();
		arr.nameCn = $("#userName option:selected").text();
		account.push(arr);
	}

	var jsonData = setJson(null, "sign", parseInt($("#orderBy").val()));
	jsonData = setJson(jsonData, "account", account);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("维保分页统计查询传值=" + jsonData);
	return jsonData;

}

//********************************柱状图查询********************************
function funMSChartSearch() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairStatisticsPagingSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: maintenanceStatisticsChartSearchPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				var data = msg.item;
				if(data != undefined) {				
					for(var m = 0; m < data.length; m++) {
						barChartCount[m] = parseInt(data[m]["count"]);
						barChartNameCn[m] = data[m]["nameCn"];
					}
				}
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询权限", false);
			} else {
				windowStart("查询失败", false);
			}
			console.log("fail");
		}
	});
}

function maintenanceStatisticsChartSearchPara() {
	var account = [];
	if($("#userName").val() == "-1") {
		for(var i = 0; i < userAccount.length; i++) {
			var arr = {};
			arr.account = userAccount[i]["account"];
			arr.nameCn = userAccount[i]["nameCn"];
			account.push(arr);
		}
	} else {
		var arr = {};
		arr.account = $("#userName").val();
		arr.nameCn = $("#userName option:selected").text();
		account.push(arr);
	}

	var jsonData = setJson(null, "sign", 0);
	jsonData = setJson(jsonData, "account", account);
	jsonData = setJson(jsonData, "index", data_page_index);
	jsonData = setJson(jsonData, "number", data_number);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("柱状图查询传值=" + jsonData);
	return jsonData;

}

//********************************饼图查询********************************
function funMSPieChartSearch(account, nameCn) {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRepairPieChartSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: maintenanceStatisticsPieChartSearchPara(account, nameCn),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log(JSON.stringify(msg));
				loadingStop();
				if(!msg.item || msg.item.length < 1) {
					windowStart("该人员无详细信息", false);
					return;
				}

				funCreatePieChart(msg);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询权限", false);
			} else {
				windowStart("查询失败", false);
			}
			console.log("fail");
		}
	});
}

function maintenanceStatisticsPieChartSearchPara(account, nameCn) {
	var jsonData = setJson(null, "account", account);
	jsonData = setJson(jsonData, "nameCn", nameCn);
	jsonData = setJson(jsonData, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("饼图查询传值=" + jsonData);
	return jsonData;

}
//*******************************创建表格***********************************
function createDataStatisticsTableInfos(msg) {
	if(!msg.item || msg.item.length < 1) {
		$("#dataContent").html("");
		var str = "";
		str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		str += "提示:<br/>当前条件下无标签信息";
		str += "</div>";
		$("#dataContent").html(str);
		return;
	}
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total) / data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 " + curren_page + "页/共 " + totalPage + " 页");

	var realData = msg.item;
	assetDataLength = realData.length;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<tr>";
	//str += "<th class='text-center'><input type='checkbox' id='allCheckBox'>  全选</th>";
	//str += "<th class='' ><div class='CheckBox'><label for='allCheckBox' style='font-weight:bold'><input type='checkbox' id='allCheckBox'>全选</label></div></th>";
	str += "<th class='text-center' ><div class='checkbox'>序号</div></th>";
	str += "<th class='text-center'>用户名</th>";
	str += "<th class='text-center'>维保总数</th>";
	str += "<th class='text-center'>图形</th>";
	str += "</tr></thead><tbody>";
	for(var i = 0; i < realData.length; i++) {
		var theData = JSON.stringify(realData[i]);
		str += "<tr class='the-qrcode-class' theData='" + JSON.stringify(realData[i]) + "'>";
		str += "<td class='text-center' style='width:25%;'>" + (i + 1) + "</td>";
		str += "<td class='text-center' style='width: 25%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["nameCn"] + "</td>";
		str += "<td class='text-center' style='width: 25%;word-wrap: break-word;word-break: break-all;'>" + realData[i]["count"] + "</td>";
		str += "<td class='text-center' style='width: 25%;word-wrap: break-word;word-break: break-all;'><a href='javascript:void(0)' class='lookPieChart' data='" + theData + "'>查看</a></td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#dataContent").html(str);
	$(".lookPieChart").click(function() {
		//  	var data=$(this).attr("data");
		//  	console.log(data);
		//  	var  account=eval("("+data+")").account;
		//  	var nameCn=eval("("+data+")").nameCn;
		//  	loadingStart("listPart");
		//  	funRSPieChartSearch(account,nameCn);
		var data = $(this).attr("data");
		user = $(this).attr("user");
		console.log(data);
		var account = eval("(" + data + ")").account;
		var nameCn = eval("(" + data + ")").nameCn;
		loadingStart("listPart");
		funMSPieChartSearch(account, nameCn);
	})

}

//******************************柱状图***************************************
function funCreateBarChart() {
	$("#barChartModal").modal("show");
	var realData = [];
	for(var n = 0; n < barChartCount.length; n++) {
		var data = [];
		data[0] = barChartNameCn[n];
		data[1] = barChartCount[n];
		realData[n] = data;
	}
	if(barChartCount != 0) {
		$('#barChart').highcharts({
			chart: {
				type: 'column'
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true
					},
					enableMouseTracking: false
				}
			},
			title: {
				text: '维保总数排名最高的前十位人员'
			},
			//      subtitle: {
			//          text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
			//      },
			xAxis: {
				type: 'category',
				labels: {
					rotation: 0,
					style: {
						fontSize: '13px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: '维 保 统 计'
				}
			},
			legend: {
				enabled: false
			},
			//      tooltip: {
			//          pointFormat: '维保统计数量'
			//      },
			series: [{
				name: '维保统计数量',
				data: realData,
				//[
				//              [barChartNameCn[0], barChartCount[0]],
				//              [barChartNameCn[1], barChartCount[1]],
				//              [barChartNameCn[2], barChartCount[2]],
				//              [barChartNameCn[3], barChartCount[3]],
				//              [barChartNameCn[4], barChartCount[4]],
				//              [barChartNameCn[5], barChartCount[5]],
				//              [barChartNameCn[6], barChartCount[6]],
				//              [barChartNameCn[7], barChartCount[7]],
				//              [barChartNameCn[8], barChartCount[8]],
				//              [barChartNameCn[9], barChartCount[9]],
				//              for(var m=0;m<barChartNameCn.length;m++){
				//              	 [barChartNameCn[m], barChartCount[m]],
				//           }

				//				],
				dataLabels: {
					enabled: true,
					rotation: -90,
					color: '#FFFFFF',
					align: 'right',
					format: '{point.y:.1f}', // one decimal
					y: 10, // 10 pixels down from the top
					style: {
						fontSize: '13px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			}]
		});
	} else {
		var str = "";
		str += '<div style="position:relative;width:200px;top:30%;margin:0px auto;font-size:25px;font-weight: bold;">';
		str += "无维保人员信息";
		str += "</div>";
		$("#barChart").html(str);
	}

}

//******************************饼图***************************************
function funCreatePieChart(msg) {
	$("#pieChartModal").modal("show");
	var data = msg.item;
	for(var m = 0; m < data.length; m++) {
		pieChartCount[m] = parseInt(data[m]["count"]);
		pieChartNameCn[m] = data[m]["typeName"];
	}
	var Dataone = [];
	for(var n = 0; n < pieChartCount.length; n++) {
		var dataone = [];
		dataone[0] = pieChartNameCn[n];
		dataone[1] = pieChartCount[n];
		Dataone[n] = dataone;
	}
	var DataTwo = [];
	var datatwo1 = [];
	var datatwo2 = [];
	datatwo1[0] = user;
	datatwo1[1] = msg.userCount;
	DataTwo[0] = datatwo1;
	datatwo2[0] = "其余";
	datatwo2[1] = msg.counts - msg.userCount;
	DataTwo[1] = datatwo2;
	$('#pieChartOne').highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			width: 460,
			height: 400,
		},
		credits: {
			enabled: false
		},
		title: {
			text: '个人类型占比'
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false,
					//					format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					//					style: {
					//						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					//					}
				},
				showInLegend: true
			}
		},
		series: [{
			type: 'pie',
			name: '所占比例',
			data: Dataone,
		}]
	});
	//*******************************************   
	$('#pieChartTwo').highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			width: 460,
			height: 400,
		},
		credits: {
			enabled: false
		},
		title: {
			text: '所占比例'
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false,
					//					format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					//					style: {
					//						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					//					}
				},
				showInLegend: true
			}
		},
		series: [{
			type: 'pie',
			name: '所占比例',
			data: DataTwo,
		}]
	});
}

$(document).ready(function() {
	$(".input-style-time").datepicker("setValue");
	$(".input-style-time").val("");
	searchUserInfos();
	$("#btnMaintenanceStatistics").click(function() {
		data_page_index = 0;
		curren_page=1;
		$("#pageTotalInfo").html("");
		funMSSearch();
	})

	$("#btnBarChart").click(function() {
			funCreateBarChart();
		})
		//****************分页操作****************
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
			funMSSearch();
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
			funMSSearch();
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
		funMSSearch();
	})

})