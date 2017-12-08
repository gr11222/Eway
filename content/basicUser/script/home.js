
var edit_userId = -1;
var data_page_index = 0;
var data_number = 17;
var curren_page = 1;
var total_page = 0;
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


function userLogout() {
    if(!window.confirm('确认退出？')){
    	return false;
    } 
    var IpAdress = window.location.href.split("/"); 
   	window.location.href = IpAdress[0]+IpAdress[1]+"//"+IpAdress[2]+"/logOut";
}

function realClick(){
	$(".nav-click").bind("click",function(){
		$(".nav-click").each(function(){
			
			$(this).removeClass("li-active");
			$(this).addClass("li-unactive");
			$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+".png");
			$(this).css({"background":"rgba(59,149,227,1)","color":"rgba(255,255,255,1)"});
//			$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+".png");
			
		})
		$(this).removeClass("li-unactive");
		$(this).addClass("li-active");
		$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+"_active.png");
		$(this).css({"background":"rgba(255,255,255,1)","color":"rgba(31,126,208,1)"});
		window.location.replace($(this).attr("linkHref"));
	})
}
function navClickFunction(){
	
	$(".nav-click").mouseover(function(){
		if($(this).hasClass("li-unactive"))
		{
			
			$(this).css({"background":"rgba(255,255,255,1)","color":"rgba(31,126,208,1)"});
			$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+"_active.png");
		
		}
	})
	$(".nav-click").mouseout(function(){
		if($(this).hasClass("li-unactive"))
		{
			
			$(this).css({"background":"rgba(59,149,227,1)","color":"rgba(255,255,255,1)"});
			$(this).find("img").attr("src","../img/"+$(this).attr("imgname")+".png");
			
		}
	})
}

function searchUserInfoPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"index",data_page_index);
		jsonData = setJson(jsonData,"number",data_number);
		jsonData = setJson(jsonData,"items","",true);
		jsonData = setJson(jsonData,"totalNumber",0);
		console.log("查询用户传值="+jsonData);
		return jsonData;
}
function searchUserInfo(){
	$("#userDataContent").html("");
	loadingStart("userDataContent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/SearchUser",
		contentType:"application/text,charset=utf-8",
		data:searchUserInfoPara(),
		success:function(msg){		
			loadingStop();
//			if($("body").find("#tipWindowBox").length > 0 )
//			{
//				windowRemove();
//			}
//			
			console.log("查询用户信息返回值="+JSON.stringify(msg));	
			$("#userDataContent").html("");
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1)
			{
				createUserTable(msg);
			}
			else
			{
				windowStart("查询用户信息失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();
			windowStart("查询用户信息失败",false);
		}
	})
}

function createUserTable(msg)
{
	
	if(!msg.items || msg.items.length < 1)
	{
		var str = "";
		 str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		 str += "提示:<br/>系统中无用户信息";
		 str += "</div>";
		 $("#userDataContent").html(str);
		return;
	}
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total)/data_number);
	total_page = totalPage;
	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	var realData =  msg.items;
	var str = "";
	str += "<table class='table table-bordered table-striped table-hover table-condensed'><thead>";
	str += "<th class='text-center '>账号</th>";
	str += "<th class='text-center'>姓名</th>";
	str += "<th class='text-center '>角色类型</th>";
	str += "<th class='text-center'>用户管理</th>";
	str += "</thead><tbody>";
	for( var i = 0 ; i < realData.length ; i++ )
	{
		str += "<tr>";
		str += "<td class='text-center '>"+realData[i]["accountName"]+"</td>";
		str += "<td class='text-center'>"+realData[i]["userName"]+"</td>";
		var userType = "";
		if(parseInt(realData[i]["type"]) == 2)
		{
			userType = "普通用户";
		}
		else
		{
			userType = "管理员";
		}
		str += "<td class='text-center'>"+userType+"</td>";
		str += "<td class='text-center '><span><a datas='"+JSON.stringify(realData[i])+"' href='javascript:void(0)' class='edit-userinfos'><img src='../img/edit.png'></a></span><span style='padding-left:5px'><a datas='"+JSON.stringify(realData[i])+"' href='javascript:void(0)' class='delete-userinfos'><img src='../img/dele.png'></a></span></td>";
		str += "</tr>";
	}
	str += "</tbody><table>";
	$("#userDataContent").html(str);
	$(".edit-userinfos").click(function(){
		
		var theData = eval("("+$(this).attr("datas")+")");
		edit_userId = parseInt(theData.id);
		$("#userAccountEdit").val(theData.accountName);
		$("#userPasswordEdit").val(theData.password);
		$("#userPasswordSureEdit").val(theData.password);
		$("#userNameEdit").val(theData.userName);
		$("#userTypeEdit").val(theData.type);
		$("#userEditModal").modal("show");
	})
	$(".delete-userinfos").click(function(){
		var theData = eval("("+$(this).attr("datas")+")");
		if(!confirm("是否删除账户：'"+theData.accountName+"' ?"))
		{
			return;
		}
		delUserInfo(eval("("+$(this).attr("datas")+")"));
	})
}

//增加用户
function addUserInfoPara(){
	var jsonStr = setJson(null,"id",-1);
		jsonStr = setJson(jsonStr,"accountName",$("#userAccount").val());
		jsonStr = setJson(jsonStr,"userName",$("#userName").val());
		jsonStr = setJson(jsonStr,"password",$("#userPassword").val());
		jsonStr = setJson(jsonStr,"weixinNo","");
		jsonStr = setJson(jsonStr,"type",$("#userType").val());
		jsonStr = setJson(jsonStr,"father","");
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"items",jsonStr,true);
		jsonData = setJson(jsonData,"totalNumber",0);
		console.log("查询用户传值="+jsonData);
		return jsonData;
}
function addUserInfo(){
	
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/AddUser",
		contentType:"application/text,charset=utf-8",
		data:addUserInfoPara(),
		success:function(msg){		
			
			console.log("添加用户信息返回值="+JSON.stringify(msg));
			
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1){
				windowStart("添加用户信息成功",true);
				$("#lanelModal").modal("hide");
				$("#userAccount").val("");
				$("#userPassword").val("");
				$("#userPasswordSure").val("");
				$("#userName").val("");
				$("#userType").val("1");
				searchUserInfo();
			}else if(msg.responseCommand.toUpperCase().indexOf("ERROR") != -1){
				windowStart("添加用户信息失败",false);
			}else{
				windowStart("用户已存在",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			
			windowStart("添加用户信息失败",false);
		}
	})
}
//删除用户
function delUserInfoPara(theData){
	var jsonStr = setJson(null,"id",theData.id);
		jsonStr = setJson(jsonStr,"accountName",theData.accountName);
		jsonStr = setJson(jsonStr,"userName",theData.userName);
		jsonStr = setJson(jsonStr,"password",theData.password);
		jsonStr = setJson(jsonStr,"weixinNo","");
		jsonStr = setJson(jsonStr,"type",theData.type);
		jsonStr = setJson(jsonStr,"father","");
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"items",jsonStr,true);
		jsonData = setJson(jsonData,"totalNumber",0);
		console.log("删除用户传值="+jsonData);
		return jsonData;
}
function delUserInfo(theData){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/DeleteUser",
		contentType:"application/text,charset=utf-8",
		data:delUserInfoPara(theData),
		success:function(msg){		
			
			console.log("删除用户信息返回值="+JSON.stringify(msg));
			windowStart("删除用户信息成功",true);
			searchUserInfo();
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			
			windowStart("删除用户信息失败",false);
		}
	})
}

//修改用户信息
//增加用户
function editUserInfoPara(){
	var jsonStr = setJson(null,"id",edit_userId);
		jsonStr = setJson(jsonStr,"accountName",$("#userAccountEdit").val());
		jsonStr = setJson(jsonStr,"userName",$("#userNameEdit").val());
		jsonStr = setJson(jsonStr,"password",$("#userPasswordEdit").val());
		jsonStr = setJson(jsonStr,"weixinNo","");
		jsonStr = setJson(jsonStr,"type",$("#userTypeEdit").val());
		jsonStr = setJson(jsonStr,"father","");
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"items",jsonStr,true);
		jsonData = setJson(jsonData,"totalNumber",0);
		console.log("修改用户传值="+jsonData);
		return jsonData;
}
function editUserInfo(){
	
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/EditUser",
		contentType:"application/text,charset=utf-8",
		data:editUserInfoPara(),
		success:function(msg){		
			
			console.log("修改用户信息返回值="+JSON.stringify(msg));
			
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1){
				windowStart("修改用户信息成功",true);
				$("#userEditModal").modal("hide");
				
				searchUserInfo();
			}else{
				windowStart("修改用户信息失败",false);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			
			windowStart("修改用户信息失败",false);
		}
	})
}

function userAddCheck(){
	var accountTest = /^[a-zA-Z]+$/;
	if( !$("#userAccount").val())
	{
		windowStart("请输入账号",false);
		return false;
	}
	if(!accountTest.test($("#userAccount").val()))
	{
		windowStart("账号只能输入英文",false);
		return false;
	}
	if( $("#userAccount").val().length >32)
	{
		windowStart("账号长度不能超过32个字符",false);
		return false;
	}
	if( !$("#userPassword").val())
	{
		windowStart("请输入密码",false);
		return false;
	}
	if( !$("#userPasswordSure").val())
	{
		windowStart("请确认密码",false);
		return false;
	}
	if($("#userPassword").val() != $("#userPasswordSure").val())
	{
		windowStart("密码不一致",false);
		return false;
	}
	if( !$("#userName").val())
	{
		windowStart("请输入姓名",false);
		return false;
	}
	return true;
}
function userEditCheck(){
	
	if( !$("#userPasswordEdit").val())
	{
		windowStart("请输入密码",false);
		return false;
	}
	if( !$("#userPasswordSureEdit").val())
	{
		windowStart("请确认密码",false);
		return false;
	}
	if($("#userPasswordEdit").val() != $("#userPasswordSureEdit").val())
	{
		windowStart("密码不一致",false);
		return false;
	}
	if( !$("#userNameEdit").val())
	{
		windowStart("请输入姓名",false);
		return false;
	}
	return true;
}
$(document).ready(function(){
//	windowStart("查询用户信息失败",false);
	window.onresize = function(){
		$(".data-content-style").width($(".body-div-style").width() - 166);
					console.log($(".data-content-style").width());
	}
	$("#btnLogOut").click(function(){
		userLogout()
	})
	realClick()
	navClickFunction();
	$("#startTime").datepicker("setValue");
	$("#endTime").datepicker("setValue");
	$("#btnAddNewLabel").click(function(){
		$("#lanelModal").modal("show");
	})
	$("#btnRealAddUser").click(function(){
		if(!userAddCheck())
		{
			return;
		}
		addUserInfo();
	})
	$("#btnSearchUserInfos").click(function(){
		data_page_index = 0;
		curren_page = 1;
		total_page = 0;
		searchUserInfo();
	})
	$("#btnRealEditUser").click(function(){
		if(!userEditCheck())
		{
			return;
		}
		editUserInfo();
	})
	//上一页
	$("#btnPageBefore").click(function(){
//		var startTime = $("#startTime").val().split("-");
//		var endTime = $("#endTime").val().split("-");
//		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
//		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
//		if(parseInt(startDate) > parseInt(endDate))
//		{
//			
//			windowStart("时间范围有误",false);
//			return;
//		}
		
		if(curren_page == 1)
		{
			windowStart("当前为首页",false);
			return;
		}
		data_page_index -= 17;
		curren_page -= 1;
		searchUserInfo();
	})
	//下一页
	$("#btnPageNext").click(function(){
//		var startTime = $("#startTime").val().split("-");
//		var endTime = $("#endTime").val().split("-");
//		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
//		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
//		if(parseInt(startDate) > parseInt(endDate))
//		{
//			
//			windowStart("时间范围有误",false);
//			return;
//		}
		
		if(total_page == curren_page)
		{
			windowStart("当前为尾页",false);
			return;
		}
		data_page_index += 17;
		curren_page += 1;
		searchUserInfo();
	})
	//跳转页
	$("#btnPageJump").click(function(){
//		var startTime = $("#startTime").val().split("-");
//		var endTime = $("#endTime").val().split("-");
//		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
//		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
//		if(parseInt(startDate) > parseInt(endDate))
//		{
//			
//			windowStart("时间范围有误",false);
//			return;
//		}
		if(!$("#pageNumId").val())
		{
			windowStart("请输入跳转页码",false);
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
		data_page_index = (parseInt($("#pageNumId").val()) - 1)*17;
		curren_page = parseInt($("#pageNumId").val());
		searchUserInfo();
	})
})
