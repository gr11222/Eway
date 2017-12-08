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
var  isFinish = 0;
var theEditStatus = 0;
var editData= {};
var isShenHe = -1;
var repair_length = 0;
var is_boHui = -1;
var  edit_id = -1;
function EscapeString(str) {
    return escape(str).replace(/\%/g,"\$");
}

function setJson(jsonStr, name, value, array)
{
    if(!jsonStr)jsonStr="{}";
    var jsonObj = JSON.parse(jsonStr);
    if (array) {
        jsonObj[name] = eval("["+value+"]");
    }
    else {
        jsonObj[name] = value;
    }
    return JSON.stringify(jsonObj) 
}
//查询信息
function funGetBuildInfoPara(){

	var obj = {};
	obj.requestCommand = "" ;
	obj.responseCommand = "" ;
	var start_time = "";
	var end_time = "";
	var searchObj = {};
	if(!$("#startTime").val()){
		start_time = "";
	}else{
		start_time = $("#startTime").val() + " 00:00:00";
	}
	if(!$("#endTime").val()){
		end_time = "";
	}else{
		end_time = $("#endTime").val() + " 23:59:59";
	}
	searchObj.nameCn = $("#buildNameSearch").val();
	searchObj.startTime = start_time;
	searchObj.endTime =end_time;
	var jsonData = setJson(null,"nameCn",$("#buildNameSearch").val());
		jsonData = setJson(jsonData,"startTime",start_time);
		jsonData = setJson(jsonData,"endTime",end_time);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"index",data_page_index);
		jsonData = setJson(jsonData,"number",data_number);
		console.log("查询异常信息传值="+jsonData);
		return jsonData;
}
function funGetBuildInfo(){
	var timeReg =  /^(([0-9]{4})-([0-9]{2})-([0-9]{2})){1}/;
//	if($("#startTime").val().length == 0 || $("#endTime").val().length == 0 )
//	{
//		windowStart("时间范围有误,请填写时间范围",false);
//	    return;
//	}
	if($("#startTime").val().length > 0 )
	{
		if(!timeReg.test($("#startTime").val()))
		{
			 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
			 return;
		}
	}
	if($("#endTime").val().length > 0 )
		
	{
		if(!timeReg.test($("#endTime").val()))
		{
			 windowStart("日期格式不正确,正确的日期格式为yyyy-mm-dd",false);
			 return;
		}
	}
	if($("#startTime").val().length == 0 )
	{
		if($("#endTime").val().length> 0 )
		{
			windowStart("请输入开始时间",false);
			 return;
		}
	}
	if($("#endTime").val().length == 0 )
	{
		if($("#startTime").val().length> 0 )
		{
			windowStart("请输入结束时间",false);
			 return;
		}
	}
	if($("#startTime").val().length > 0 && $("#endTime").val().length > 0 )
	{
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(parseInt(startTime[0]),parseInt(startTime[1])-1,parseInt(startTime[2]));
		var endDate = new Date(parseInt(endTime[0]),parseInt(endTime[1])-1,parseInt(endTime[2]));
		console.log(startDate);
		if(parseInt(startDate.getTime()) > parseInt(endDate.getTime()))
		{
			windowStart("开始时间不能大于结束时间",false);
		    return;
		}
	}
	$("#ptcontent").html("");
	repair_length = 0;
	loadingStart("ptcontent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBuildingSearchCmd",
		contentType:"application/text,charset=utf-8",
		data:funGetBuildInfoPara(),
		success:function(msg){		
			loadingStop();
//			windowRemove();
			console.log("查询异常信息返回值="+JSON.stringify(msg));	
			$("#ptcontent").html("");
			$("#pageNumId").val("");

			createRepairTableInfos(msg);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无查询异常信息权限",false);
            }else{
            	windowStart("查询建筑信息失败",false);
            }
//			windowStart("查询点检信息失败",false);
		}
	})
}
function createRepairTableInfos(msg)
{
	if(!msg.item || msg.item.length < 1)
	{
		$("#ptcontent").html("");
		var str = "";
		 str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		 str += "提示:<br/>当前条件下无建筑信息";
		 str += "</div>";
		 $("#ptcontent").html(str);
		
		return;
	}
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total)/data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	
	var realData =  msg.item;
	
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center' >序号</th>";
	// str += "<th class='text-center' >建筑编号</th>";
	str += "<th class='text-center'>中文名称</th>";
	str += "<th class='text-center'>英文名称</th>";
	str += "<th class='text-center'>省份</th>";
	str += "<th class='text-center'>城市</th>";
	str += "<th class='text-center'>区县</th>";
	str += "<th class='text-center'>具体地址</th>";
	str += "<th class='text-center'>备注</th>";
	str += "<th class='text-center'>管理</th>";
	str += "</thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
		str+= "<tr >";
		str += "<td class='text-center' style='width:5%' title='"+(i+1)+"'>"+(i+1)+"</td>";
		// str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>"+realData[i]["id"]+"</td>";
		str += "<td class='text-center'  style='width:15%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["nameCn"]+"'>"+realData[i]["nameCn"]+"</td>";
		str += "<td class='text-center'  style='width:15%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["nameEn"]+"'>"+realData[i]["nameEn"]+"</td>";
		str += "<td class='text-center'  style='width:6%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["province"]+"'>"+realData[i]["province"]+"</td>";
		str += "<td class='text-center'  style='width:6%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["city"]+"'>"+realData[i]["city"]+"</td>";
		str += "<td class='text-center'  style='width:6%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["district"]+"'>"+realData[i]["district"]+"</td>";
		str += "<td class='text-center'  style='width:12%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["addres"]+"'>"+realData[i]["addres"]+"</td>";
		str += "<td class='text-center'  style='width:15%;word-wrap: break-word;word-break: break-all;' title='"+realData[i]["note"]+"'>"+realData[i]["note"]+"</td>";
		str += "<td class='text-center'  style='width:10%;word-wrap: break-word;word-break: break-all;'>";
		str += "<span><a theData='"+JSON.stringify(realData[i])+"' class='edit-class' href='javascript:void(0)'><img src='../img/edit.png' /></a><span>";
		str += "<span style='padding-left:10px'><a theId='"+realData[i]["id"]+"' class='delete-class' href='javascript:void(0)'><img src='../img/dele.png' /></a><span>";
		
		str+="</td>";
		
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#ptcontent").html(str);
	//../../alarmInfo/html/home.html
	$(".edit-class").click(function(){
		var theData = eval("("+$(this).attr("theData")+")");
		edit_id = parseInt(theData.id);
		$("#editbuildNameCnModal").val(theData.nameCn);
		$("#editbuildNameEnModal").val(theData.nameEn);
		$("#editproModal").val(theData.province);
		$("#editcityModal").val(theData.city);
		$("#editcountryModal").val(theData.district);
		$("#editaddrModal").val(theData.addres);
		$("#editnoteModal").val(theData.note);
		$("#editDataModal").modal("show");
	})
	
	//删除
	$(".delete-class").click(function(){
		if(!confirm("是否确认删除")){
			return;
		}
		funDeleteBuildIngInfo(parseInt($(this).attr("theId")));
	})
}


//添加信息
function funAddBuildIngInfoCheck(){
//	var cnCheck = /^[\u4e00-\u9fa5]+$/;
	var cnCheck = /^[a-zA-Z\u4e00-\u9fa5]+$/;
	var enReg = /^([a-zA-Z]+)([a-zA-Z ]{0,})$/;
	if(!$("#buildNameCnModal").val())
	{
		windowStart("请输入中文名称",false);
		return false;
	}
	if($("#buildNameCnModal").val().length > 15)
	{
		windowStart("中文名称不可以超过15个汉字",false);
		return false;
	}
	if(!cnCheck.test($("#buildNameCnModal").val()))
	{
		windowStart("中文名称只能输入汉字或者字母",false);
		return false;
	}
	if(!$("#buildNameEnModal").val())
	{
		windowStart("请输入英文名称",false);
		return false;
	}
	if($("#buildNameEnModal").val().length > 100)
	{
		windowStart("建筑英文名称不可以超过100个字符",false);
		return false;
	}
	if(!enReg.test($("#buildNameEnModal").val()))
	{
		windowStart("建筑英文名称只能以英文开头,如字母之间需要间隔,请用空格间隔",false);
		return false;
	}
	if($("#factoryShengModal").val() == "省份")
	{
		windowStart("请选取省份",false);
		return false;
	}
	if($("#factoryCityModal").val() == "市")
	{
		windowStart("请选取市",false);
		return false;
	}
	if($("#factoryAreaModal").val() == "区、县")
	{
		windowStart("请选取区、县",false);
		return false;
	}
	
	if($("#addrModal").val().length > 0 )
	{
		if($("#addrModal").val().length > 200)
		{
			windowStart("具体地址不可以超过200个字符",false);
			return false;
		}
	}
	
	if($("#noteModal").val().length > 0 )
	{
		if($("#noteModal").val().length > 200)
		{
			windowStart("备注不可以超过200个字符",false);
			return false;
		}
	}
	return true;
}
function funAddBuildIngInfoPara(){
	var obj = {};
	obj.requestCommand = "" ;
	obj.responseCommand = "" ;
	var dataArr = [];
	var dataObj = {};
	dataObj.id = -1;
	dataObj.nameCn = $("#buildNameCnModal").val();
	dataObj.nameEn =  $("#buildNameEnModal").val();
	dataObj.addres =  $("#addrModal").val();
	dataObj.insertTime = "";
	dataObj.updateTime = "";
	dataObj.country = "中国";
	dataObj.province =  $("#factoryShengModal").val();
	dataObj.city = $("#factoryCityModal").val();
	dataObj.district =  $("#factoryAreaModal").val();
	dataObj.note =  $("#noteModal").val();
	dataObj.companyid =  -1;
	dataObj.company =  "";
	dataObj.code = "";
	dataArr.push(dataObj);
	var jsonData = setJson(null,"resp",obj);
		jsonData = setJson(jsonData,"queryItem",{});
		jsonData = setJson(jsonData,"item",dataArr);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
//		jsonData = setJson(jsonData,"index",data_page_index);
//		jsonData = setJson(jsonData,"number",data_number);
		console.log("添加建筑信息传值="+jsonData);
		return jsonData;
}
function funAddBuildIngInfo(){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBuildingAddCmd",
		contentType:"application/text,charset=utf-8",
		data:funAddBuildIngInfoPara(),
		success:function(msg){		
			console.log("添加建筑信息信息返回值="+JSON.stringify(msg));	
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1)
			{
				$("#addDataModal").modal("hide");
				windowStart("添加建筑信息成功",true);
				funGetBuildInfo();
			}
			else if(msg.resp.responseCommand.toUpperCase().indexOf("REPEAT") != -1)
			{
				windowStart("建筑信息已存在",false);
				
			}
			else 
			{
				windowStart("添加建筑信息失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无添加建筑信息信息权限",false);
            }else{
            	windowStart("添加建筑信息失败",false);
            }
		}
	})
}





//修改
function funEditBuildIngInfoPara(){
	var obj = {};
	obj.requestCommand = "" ;
	obj.responseCommand = "" ;
	var dataArr = [];
	var dataObj = {};
	
	dataObj.id = edit_id;
	dataObj.nameCn = $("#editbuildNameCnModal").val();
	dataObj.nameEn =  $("#editbuildNameEnModal").val();
	dataObj.addres =  $("#editaddrModal").val();
	dataObj.insertTime = "";
	dataObj.updateTime = "";
	dataObj.country = "中国";
	dataObj.province =  $("#editproModal").val();
	dataObj.city = $("#editcityModal").val();
	dataObj.district =  $("#editcountryModal").val();
	dataObj.note =  $("#editnoteModal").val();
    dataObj.companyid =  -1;
	dataObj.company =  "";
	dataObj.code = "";
	dataArr.push(dataObj);
	var jsonData = setJson(null,"resp",obj);
		jsonData = setJson(jsonData,"queryItem",{});
		jsonData = setJson(jsonData,"item",dataArr);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
//		jsonData = setJson(jsonData,"index",data_page_index);
//		jsonData = setJson(jsonData,"number",data_number);
	
		console.log("修改建筑信息传值="+jsonData);
		return jsonData;
}
function funEditBuildIngInfo(){
	if($("#editaddrModal").val().length > 0 )
	{
		if($("#editaddrModal").val().length > 200)
		{
			windowStart("具体地址不可以超过200个字符",false);
			return ;
		}
	}
	if($("#editnoteModal").val().length > 0 )
	{
		if($("#editnoteModal").val().length > 200)
		{
			windowStart("备注不可以超过200个字符",false);
			return ;
		}
	}
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBuildingUpdateCmd",
		contentType:"application/text,charset=utf-8",
		data:funEditBuildIngInfoPara(),
		success:function(msg){		
			console.log("修改建筑信息信息返回值="+JSON.stringify(msg));	
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1)
			{
				$("#editDataModal").modal("hide");
				windowStart("修改建筑信息成功",true);
				funGetBuildInfo();
			}
			else 
			{
				windowStart("修改建筑信息失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无修改建筑信息信息权限",false);
            }else{
            	windowStart("修改建筑信息失败",false);
            }
		}
	})
}

//删除
function funDeleteBuildIngInfoPara(theId){
	var obj = {};
	obj.requestCommand = "" ;
	obj.responseCommand = "" ;
	var dataArr = [];
	var dataObj = {};
	dataObj.id = theId;
	dataObj.nameCn = "";
	dataObj.nameEn =  "";
	dataObj.addres =  "";
	dataObj.insertTime = "";
	dataObj.updateTime = "";
	dataObj.country = "";
	dataObj.province =  "";
	dataObj.city = "";
	dataObj.companyid =  -1;
	dataObj.company =  "";
	dataObj.district =  "";
	dataObj.note =  "";
	dataObj.code = "";
	dataArr.push(dataObj);
	var jsonData = setJson(null,"resp",obj);
		jsonData = setJson(jsonData,"queryItem",{});
		jsonData = setJson(jsonData,"item",dataArr);
		jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
//		jsonData = setJson(jsonData,"index",data_page_index);
//		jsonData = setJson(jsonData,"number",data_number);
		console.log("删除建筑信息传值="+jsonData);
		return jsonData;
}
function funDeleteBuildIngInfo(theId){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsBuildingDeleteCmd",
		contentType:"application/text,charset=utf-8",
		data:funDeleteBuildIngInfoPara(theId),
		success:function(msg){		
			console.log("删除建筑信息信息返回值="+JSON.stringify(msg));	
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1)
			{
				
				windowStart("删除建筑信息成功",true);
				funGetBuildInfo();
			}
			else 
			{
				windowStart("删除建筑信息失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			
			var xmlRequest = XMLHttpRequest.status;
            if(xmlRequest=="401"){
                 windowStart("当前用户无删除建筑信息信息权限",false);
            }else{
            	windowStart("删除建筑信息失败",false);
            }
		}
	})
}



$(document).ready(function(){
	$(".date-picker").datepicker("setValue");
	$(".date-picker").val("");
	_init_area();
	
	//添加
	$("#btnAddInfos").click(function(){
		$("#factoryShengModal").val("省份");
		$("#factoryCityModal").val("市");
		$("#factoryAreaModal").val("区、县");
		$("#buildNameCnModal").val("");
		$("#buildNameEnModal").val("");
		$("#addrModal").val("");
		$("#noteModal").val("");
		$("#addDataModal").modal("show");
	})
	$("#btnAddMadeInfo").click(function(){
		if(!funAddBuildIngInfoCheck())
		{
			return;
		}
		funAddBuildIngInfo();
	})
	
	//添加结束
	//查询
	$("#btnSearchRepair").click(function(){
		
//		data_page_index = 0;
//		curren_page = 1;
//		total_page = 0;
		funGetBuildInfo();
	})
	
	
	
	//上一页
	$("#btnPageBefore").click(function(){
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
	$("#btnPageNext").click(function(){
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
	$("#btnPageJump").click(function(){
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
	$("#btnEditMadeInfo").click(function(){
		funEditBuildIngInfo();
	})
	//修改结束
	
	funGetBuildInfo();
})
