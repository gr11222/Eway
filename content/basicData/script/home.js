
var data_page_index = 0;
var data_number = 9;
var curren_page = 1;
var total_page = 0;
var edit_label_info = {} ;
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
//新建标签
function funAddLabelInfoCheck(){
	var labelIdReg = /^[a-zA-Z0-9]+$/;
	if(!$("#labelId").val())
	{
		windowStart("请输入标签ID",false);
		return false;
	}
	if(!labelIdReg.test($("#labelId").val()))
	{
		windowStart("标签ID只能输入英文、正整数和零",false);
		return false;
	}
	if(!$("#labelName").val())
	{
		windowStart("请输入标签名称",false);
		return false;
	}
	
//	if(!$("#labelType").val())
//	{
//		windowStart("请输入标签类型",false);
//		return false;
//	}
	return true;
}
function funAddLabelInfo(){
	var fileName ="";
	if($("#fileInfo").val().length >0 )
	{
//		alert($("#fileInfo").val());
		fileName  = $("#fileInfo").val().substring($("#fileInfo").val().lastIndexOf("\\")+1,$("#fileInfo").val().length);
		fileName = EscapeString(fileName);
	}

	var theUrl ="";
	    theUrl += '/AssetWebServlet/AddTagInfo?';
	    theUrl += "tagId="+$("#labelId").val();
	    theUrl += "&tagName="+EscapeString($("#labelName").val());
	    theUrl += "&tagType="+EscapeString($("#labelType").val());
	    theUrl += "&tagModel="+EscapeString($("#labelXingHao").val());
	    theUrl += "&tagFactory="+EscapeString($("#labelFactory").val());
	    theUrl += "&tagProducer="+EscapeString($("#labelMadeBy").val());
	    theUrl += "&tagPosition="+EscapeString($("#labelLocation").val());
	    theUrl += "&fileName="+fileName;
	    theUrl += "&totalNumber=0";
	    console.log("添加的url="+theUrl);
	  
	$.ajaxFileUpload({
        url:theUrl,  //需要链接到服务器地址
        secureuri:false,
   		fileElementId:'fileInfo',          //文件选择框的id属性
        dataType: 'text',     					//服务器返回的格式，可以是json
        success: function (data, status)
        {
        	console.log("新建标签返回值------"+data);
        	if(data.toUpperCase().indexOf("OK") != -1){
        		$("#labelId").val("");
        		$("#labelName").val("");
        		$("#labelType").val("");
        		$("#labelXingHao").val("");
        		$("#labelFactory").val("");
        		$("#labelMadeBy").val("");
        		$("#labelLocation").val("");
        		$("#lanelModal").modal("hide");
        		
        		windowStart("标签添加成功",true);
        		funSearchLabelInfo();
        	}else if(data.toUpperCase().indexOf("EXIST") != -1){
//      		alert("");
        		windowStart("标签已经存在",false);
        	}else{
//      		alert("标签添加失败");
				windowStart("标签添加失败",false);
        	}

        },
        error: function (data, status, e)
        {
        	 windowStart("标签添加失败",false);
        }
                  
     });
}
//查询标签
function funSearchLabelInfoPara(){
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"startTime",$("#startTime").val()+" 00:00:00");
		jsonData = setJson(jsonData,"endTime",$("#endTime").val()+" 23:59:59");
		jsonData = setJson(jsonData,"keyWord",$("#searchTip").val());
		jsonData = setJson(jsonData,"index",data_page_index);
		jsonData = setJson(jsonData,"number",data_number);
		jsonData = setJson(jsonData,"totalNumber",0);
		console.log("查询传值="+jsonData);
		return jsonData;
}
function funSearchLabelInfo(){
	$("#labelDataContent").html("");
	loadingStart("labelDataContent");
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/SearchTagInfo",
		contentType:"application/text,charset=utf-8",
		data:funSearchLabelInfoPara(),
		success:function(msg){		
			loadingStop();
//			if($("body").find("#tipWindowBox").length > 0 )
//			{
//				windowRemove();
//			}
			console.log("查询标签返回值="+JSON.stringify(msg));	
			$("#labelDataContent").html("");
			$("#pageNumId").val("");
			createLabelInfos(msg);
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			loadingStop();

			windowStart("查询标签信息失败",false);

		}
	})
}
function createLabelInfos(msg)
{
	
	if(!msg.items || msg.items.length < 1)
	{
		var str = "";
		 str += '<div style="position:relative;width:300px;top:30%;margin:0px auto;font-size:20px;font-weight: bold;">';
		 str += "提示:<br/>无当前条件下的标签信息";
		 str += "</div>";
		 $("#labelDataContent").html(str);
		return;
	}
	
	var realData =  msg.items;
	var total = msg.totalNumber;
	var totalPage = Math.ceil(parseInt(total)/data_number);
	total_page = totalPage;
	$("#totalLabel").text("共计"+total+"条标签");
	$("#pageTotalInfo").html("第 "+curren_page+"页/共 "+totalPage+" 页");
	var str = "";
	var box_index = 0;
	for( var  i = 0 ; i < realData.length ; i++ )
	{
		var content_class="";
		var content_child_class="";
		if( box_index == 0)
		{
			content_class="box-0";
			content_child_class = "box-left";
			box_index = 1;
			
		}
		else if ( box_index == 1 )
		{
			content_class="box-1";
			content_child_class = "box-mid";
			box_index = 2;
		}
		else
		{
			content_class="box-2";
			content_child_class = "box-right";
			box_index = 0;
		}
		var singleData = JSON.stringify(realData[i]);
		str += "<div class='label-content-box "+content_class+"'>";
		str += "<div class='"+content_child_class+"'>";
		str += "<div class='box-header-1'>";
		str += "<div class='label-id-style'><div class='label-id-strle-left'>标签ID:</div><div class='label-id-strle-right' title='"+realData[i]["tagId"]+"'>"+realData[i]["tagId"]+"</div></div>";
		str += "<div class='label-btn-delete-style'>";
		str += "<a class='delete-label-btn' datas='"+singleData+"' href='javascript:void(0)'><img src='../img/dele.png' width='18' height='18' /></a>";
		str += "</div>";
		str += "<div class='label-btn-edit-style' >";
		str += "<a class='edit-label-btn' datas='"+singleData+"' href='javascript:void(0)'><img src='../img/edit.png' width='18' height='18' /></a>";
		str += "</div>";
		str += "<div class='label-btn-qrcode-style'>";
		str += "<a class='btn btn-primary btnCreateQrcode' datas='"+singleData+"'>生成二维码</a>";
		str += "</div>";
		str += "</div>";
		str += "<div class='box-content-1'>";
		//内容1
		str += "<div class='data-inner'>";
		str += "<div class='inner-content' title='标签名称:"+realData[i]["tagName"]+"'>";
		str += "<span >标签名称 : "+unescape(realData[i]["tagName"].replace(/\$/g,"\%"))+"</span>";
		str += "</div>";
		str += "<div class='inner-content'  title='标签类型:"+realData[i]["tagType"]+"'>";
		str += "<span >标签类型 : "+realData[i]["tagType"]+"</span>";
		str += "</div>";
		str += "</div>";
		//内容
		//内容2
		str += "<div class='data-inner'>";
		str += "<div class='inner-content' title='标签型号:"+realData[i]["tagModel"]+"'>";
		str += "<span >标签型号 : "+realData[i]["tagModel"]+"</span>";
		str += "</div>";
		str += "<div class='inner-content' title='所属工厂:"+realData[i]["tagFactory"]+"'>";
		str += "<span >所属工厂 : "+realData[i]["tagFactory"]+"</span>";
		str += "</div>";
		str += "</div>";
		//内容2
		//内容3
		str += "<div class='data-inner'>";
		str += "<div class='inner-content'  title='生产厂商:"+realData[i]["tagProducer"]+"'>";
		str += "<span >生产厂商 : "+realData[i]["tagProducer"]+"</span>";
		str += "</div>";
		str += "<div class='inner-content'  title='标签位置:"+realData[i]["tagPosition"]+"'>";
		str += "<span >标签位置 : "+realData[i]["tagPosition"]+"</span>";
		str += "</div>";
		str += "</div>";
		//内容3
		//内容4
		str += "<div class='data-inner' style='width:100%'>";
		
		if(realData[i]["tagFilePath"] != "")
		{
			var fileName = unescape(realData[i]["tagFilePath"].replace(/\$/g,"\%"));
			var showName = fileName.substring(fileName.lastIndexOf("/")+1,fileName.length);
			str += "<div class='inner-content' title='相关文档:"+showName+"'>";
			str += "<span >相关文档 : <a  download='"+showName+"' style='text-decoration:underline' href='/file/"+realData[i]["tagFilePath"]+"'>"+showName+"</a></span>";
		}
		else
		{
			str += "<div class='inner-content' >";
			str += "<span >相关文档 : "+realData[i]["tagFilePath"]+"</span>";
		}
		str += "</div>";
//		str += "<div class='inner-content'   title='创建用户:"+realData[i]["userName"]+"'>";
//		str += "<span >创建用户 : "+realData[i]["userName"]+"</span>";
//		str += "</div>";
		str += "</div>";
		//内容4
		//内容5
//		str += "<div class='data-inner'>";
//		str += "<div class='inner-content'   title='创建时间:"+realData[i]["createTime"]+"'>";
//		str += "<span >创建时间 : "+realData[i]["createTime"]+"</span>";
//		str += "</div>";
//		str += "<div class='inner-content'   title='所有信息:"+realData[i]["allInfo"]+"'>";
//		str += "<span >所有信息 : "+realData[i]["allInfo"]+"</span>";
//		str += "</div>";
//		str += "</div>";
		//内容5
		str += "</div>";
		str += "</div>";
		str += "</div>";
	}
	$("#labelDataContent").html(str);
	$(".delete-label-btn").click(function(){
		
		var theData = eval("("+$(this).attr("datas")+")");
		if(!confirm("是否删除标签：'"+theData.tagName+"' ?")){
			return;
		}
		funDeleteLabelInfo(theData);
	})
	$(".edit-label-btn").click(function(){
		var theData = eval("("+$(this).attr("datas")+")");
		edit_label_info = theData;
		$("#editlabelId").val(theData.tagId);
		$("#editlabelName").val(theData.tagName);
		$("#editlabelType").val(theData.tagType);
		$("#editlabelXingHao").val(theData.tagModel);
		$("#editlabelFactory").val(theData.tagFactory);
		$("#editlabelMadeBy").val(theData.tagProducer);
		$("#editlabelLocation").val(theData.tagPosition);
		$("#editfileInfo").val(theData.tagFilePath);
		
		$("#editlabelCreateTime").val(theData.createTime);
		$("#editlabelCreateUser").val(theData.userName);
		$("#editAllInfos").val(theData.allInfo);
		$("#editlanelModal").modal("show");
	})
	$(".btnCreateQrcode").click(function(){
		var theData = eval("("+$(this).attr("datas")+")");
		funCreateQrcode(theData);
	})
}
//修改标签
function funEditLabelInfoPara(){
	var jsonStr = setJson(null,"id",parseInt(edit_label_info.id));
	    jsonStr = setJson(jsonStr,"tagId",$("#editlabelId").val());
	    jsonStr = setJson(jsonStr,"tagName",$("#editlabelName").val());
	    jsonStr = setJson(jsonStr,"tagType",$("#editlabelType").val());
	    jsonStr = setJson(jsonStr,"tagModel",$("#editlabelXingHao").val());
	    jsonStr = setJson(jsonStr,"tagFactory",$("#editlabelFactory").val());
	    jsonStr = setJson(jsonStr,"tagProducer",$("#editlabelMadeBy").val());
	    jsonStr = setJson(jsonStr,"tagPosition",$("#editlabelLocation").val());
	    jsonStr = setJson(jsonStr,"tagFilePath",$("#editfileInfo").val());
	    jsonStr = setJson(jsonStr,"userName",$("#editlabelCreateUser").val());
	    jsonStr = setJson(jsonStr,"createTime",$("#editlabelCreateTime").val());
	    jsonStr = setJson(jsonStr,"allInfo",$("#editAllInfos").val());
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"items",jsonStr,true);
		jsonData = setJson(jsonData,"totalNumber",0);
		console.log(jsonData);
		return jsonData;
}
function funEditLabelInfo(){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/EditTagInfo",
		contentType:"application/text,charset=utf-8",
		data:funEditLabelInfoPara(),
		success:function(msg){		
			console.log("修改标签返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1)
			{
				$("#editlanelModal").modal("hide");
//				alert("标签信息已修改");
				windowStart("标签信息已修改",true);
				funSearchLabelInfo();
			}else{
//				alert("标签信息修改失败");
				windowStart("标签信息修改失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
//				alert("标签信息修改失败");
				windowStart("标签信息修改失败",false);
		}
	})
}
//删除标签
function funDeleteLabelInfoPara(theData){
	var jsonStr = setJson(null,"id",parseInt(theData.id));
	    jsonStr = setJson(jsonStr,"tagId",theData.tagId);
	    jsonStr = setJson(jsonStr,"tagName",theData.tagName);
	    jsonStr = setJson(jsonStr,"tagType",theData.tagType);
	    jsonStr = setJson(jsonStr,"tagModel",theData.tagModel);
	    jsonStr = setJson(jsonStr,"tagFactory",theData.tagFactory);
	    jsonStr = setJson(jsonStr,"tagProducer",theData.tagProducer);
	    jsonStr = setJson(jsonStr,"tagPosition",theData.tagPosition);
	    jsonStr = setJson(jsonStr,"tagFilePath",theData.tagFilePath);
	    jsonStr = setJson(jsonStr,"userName",theData.userName);
	    jsonStr = setJson(jsonStr,"createTime",theData.createTime);
	    jsonStr = setJson(jsonStr,"allInfo",theData.allInfo);
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
		jsonData = setJson(jsonData,"totalNumber",0);
		jsonData = setJson(jsonData,"items",jsonStr,true);
		console.log("删除传值="+jsonData);
		return jsonData;
}
function funDeleteLabelInfo(theData){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/DeleteTagInfo",
		contentType:"application/text,charset=utf-8",
		data:funDeleteLabelInfoPara(theData),
		success:function(msg){		
			console.log("删除标签返回值="+JSON.stringify(msg));	
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1)
			{
//				alert("标签信息已删除");
				windowStart("标签信息已删除",true);
				funSearchLabelInfo();
			}else{
//				alert("标签信息删除失败");
				windowStart("标签信息删除失败",false);
			}
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			windowStart("标签信息删除失败",false);
		}
	})
}

//二维码
function funCreateQrcodePara(theData){
	var url = "http://www.sensesoft.com.cn/file/htmlCloud/content/pointCheck/html/home.html?deviceId="+theData.tagId;
	var jsonData = setJson(null,"requestCommand","");
		jsonData = setJson(jsonData,"responseCommand","");
//		jsonData = setJson(jsonData,"text",url);
//		jsonData = setJson(jsonData,"tagId",theData.tagId);
		jsonData = setJson(jsonData,"text","deviceId="+theData.tagId);
		jsonData = setJson(jsonData,"tagId",theData.tagId);
		console.log("二维码传值="+jsonData);
		return jsonData;
}
function funCreateQrcode(theData){
	$.ajax({
		type:"post",
		dataType:'json',
		url:"/AssetWebServlet/QRCodeCreate",
		contentType:"application/text,charset=utf-8",
		data:funCreateQrcodePara(theData),
		success:function(msg){		
			console.log("生成二维码返回值="+JSON.stringify(msg));	
			$("#codeDeviceId").text(theData.tagId);
			$("#qrCodeImg").attr("src","/file/"+msg.responseCommand);
			$("#qrCodeModal").modal("show");
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			windowStart("二维码生成失败",false);
		}
	})
}

//批量打印
function printAllQrCode(){
	var newWindow=window.open("","_blank");//打印窗口要换成页面的url
	var htmlTitle = "<html><head><title>批量打印二维码</title></head><body>";
	 var htmlhead = "";
	var str = "";
    for(var  i = 0 ; i < $(".pl-qrcode-content").length; i++ )
    {
    	 htmlhead += "<div style='width:100%;height:195px'>";
    	 htmlhead += $(".pl-qrcode-content").eq(i).html();
   		 htmlhead += "</div>";
    }
    var htmlFoot = '</body></html>'
    str += htmlTitle + htmlhead + htmlFoot;
    
	newWindow.document.write(str);
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
}
$(document).ready(function(){
	
	window.onresize = function(){
		$(".data-content-style").width($(".body-div-style").width() - 166);
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
	$("#btnRealAddLabel").click(function(){
		if(!funAddLabelInfoCheck())
		{
			return;
		}
		funAddLabelInfo();
	})
	$("#btnSearchLabelInfos").click(function(){
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		data_page_index = 0;
	
		curren_page = 1;
		total_page = 0;
		funSearchLabelInfo();
	})
	//上一页
	$("#btnPageBefore").click(function(){
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		
		if(curren_page == 1)
		{
			windowStart("当前为首页",false);
			return;
		}
		data_page_index -= data_number;
		curren_page -= 1;
		funSearchLabelInfo();
	})
	//下一页
	$("#btnPageNext").click(function(){
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
			return;
		}
		
		if(total_page == curren_page)
		{
			windowStart("当前为尾页",false);
			return;
		}
		data_page_index += data_number;
		curren_page += 1;
		
		funSearchLabelInfo();
	})
	//跳转页
	$("#btnPageJump").click(function(){
		var startTime = $("#startTime").val().split("-");
		var endTime = $("#endTime").val().split("-");
		var startDate = new Date(startTime[0],startTime[1],startTime[2]).getTime();
		var endDate = new Date(endTime[0],endTime[1],endTime[2]).getTime();
		if(total_page == 0)
		{
			return;
		}
		if(parseInt(startDate) > parseInt(endDate))
		{
			
			windowStart("时间范围有误",false);
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
		funSearchLabelInfo();
	})
	$("#editbtnRealAddLabel").click(function(){
		funEditLabelInfo();
	})
	
	$("#btnPrintqrCode").click(function(){
		$("#printDiv").jqprint({
			debug: false,//在页面上有预览作用
			importCSS:true,
			printContainer:true,
			operaSupport:true
		});
	})
//	$("#printQrCodeModal").modal("show");
	$("#btnPrintAll").click(function(){
		printAllQrCode()
	})
})
