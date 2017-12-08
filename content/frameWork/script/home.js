
var mouseover_Class= "";
var urlPath = "../../../../index.html";
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
    quit();
   	localStorage.setItem("userAccountName","");
    var IpAdress = window.location.href.split("/"); 
   	window.location.href = urlPath;
}

function quitPara() {
	var jsonStr = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));
	console.log("退出传值=" + jsonStr);
	return jsonStr;
}

function quit() {
	$.ajax({
		type: 'post',
		dataType: 'json',
		url: '/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsQuitCmd',
		contentType: "application/text;charset=utf-8",
		data: quitPara(),
		success: function(msg) {
			console.log("退出返回值" + JSON.stringify(msg));
			localStorage.setItem("userAccountName", "");
			localStorage.setItem("userAccountName", $("#username").val());
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {}
	});

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

function getNavbarPara(){
	var jsonStr = setJson(null, "userAccountName",localStorage.getItem("userAccountName"));
    	
    	console.log("获取菜单传值="+jsonStr);
    return jsonStr;
}
function getNavBar(){
	$.ajax
    ({
        type: 'post',
        dataType: 'json',
        url: '/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsMenuListSearchCmd',
        contentType: "application/text;charset=utf-8",
        data: getNavbarPara(),
        success: function(msg) {
        	console.log("获取菜单信息返回值"+JSON.stringify(msg));
     		
        	createNavBar(msg);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("获取菜单信息error");
     		
        }
    });
	
}

function getMesPara(){
	var jsonStr = setJson(null, "userAccountName",localStorage.getItem("userAccountName"));
    	
    	console.log("获取图片传值="+jsonStr);
    return jsonStr;
}
function getMes(){
	$.ajax
    ({
        type: 'post',
        dataType: 'json',
        url: '/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsLogoIndexConfigCmd',
        contentType: "application/text;charset=utf-8",
        data: getNavbarPara(),
        success: function(msg) {
        	console.log("获取图片信息返回值"+JSON.stringify(msg));
        	if(msg.logoPath){
        		$('#logo').attr('src',msg.logoPath);
        		$('#logo').attr('height','40');
        		// $('#logo').attr('height','40');
        		$('.sys-name').css('display','none');
        		if(msg.indexPath){
        			urlPath = msg.indexPath;
        		}
        	}else{
        		$('#logo').attr('src','../img/logo.png');
        		$('#logo').attr('width','40');
        		$('#logo').attr('height','40');
        		$('.sys-name').html('E维管家后台管理系统');
        	}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("获取图片信息error");
     		
        }
    });
	
}
getMes();
function createNavBar(msg){
	if(!msg.menus || msg.menus.length == 0)
	{
		return;
	}
	var str = "";
	var theData =  msg.menus;
	for( var i = 0 ; i < theData.length ; i++ )
	{
		str += "<li>";
		var theHref = "";
		if(theData[i].link != undefined && theData[i].link.length > 0 )
		{
			theHref =theData[i].link;
		}
		if( i == 0 )
		{
			str += "<a class='li-a-style li-active' thehref='"+theHref+"'>";
			str += "<span>";
			str += "<img src='../img/label_active.png' width='18' height='18' style='margin-top:-3px'/>";
			str += "</span>";
			str += "<span>";
			str += theData[i].menuName;
			str += "</span>";
			str += "</a>";
		}
		else
		{
			str += "<a class='li-a-style li-unactive' thehref='"+theHref+"'>";
			str += "<span>";
			str += "<img src='../img/label_active.png' width='18' height='18' style='margin-top:-3px'/>";
			str += "</span>";
			str += "<span>";
			str += theData[i].menuName;
			str += "</span>";
			str += "</a>";
		}
		
		if(theData[i].children!= undefined && theData[i].children.length > 0 )
		{
			str += "<div class='second-all-navbar-class' >";
			var secData =theData[i].children;
			for( var j =0 ; j < secData.length ; j++ )
			{
				
				str += "<div class='second-navbar-class' >";
				str += "<div class='line-style'>";
				str += "</div>";
				var theClass = "";
				var a_class = "";
				if(j == 0)
				{
					theClass = "secnavbar-style-2 circle-active";
					a_class = "secnavbar-style-3-a secnavbar-style-3-a-active";
				}
				else
				{
					theClass = "secnavbar-style-2 circle-style";
					a_class = "secnavbar-style-3-a secnavbar-style-3-a-unactive";
				}
				str += "<div class='sec-nav-content-2'>";
				str += "<div class='"+theClass+"'></div>";
				str += "<div class='secnavbar-style-3'><a class='"+a_class+"' style='cursor:pointer' thehref='"+secData[j]["link"]+"'>"+secData[j]["menuName"]+"</a></div>";
				str += "</div>";
				str += "</div>";
			}
			str += "</div>";
		}
		
		
		str += "</li>";
	}
	$("#navItems").html(str);
	$(".second-all-navbar-class").slideUp(0);
	if($(".li-a-style").eq(0).attr("thehref").length > 0 )
	{
		iframeContent.location.href = $(".li-a-style").eq(0).attr("href");
	}
	else
	{
		$(".second-all-navbar-class").eq(0).slideDown(0);
		iframeContent.location.href = $(".li-a-style").eq(0).next().children().eq(0).find(".secnavbar-style-3-a").attr("thehref");
	
	}
	
	
	$(".li-a-style").click(function(){
		if($(this).hasClass("li-active")){
			return;
		}
		$(".li-a-style").each(function(){
			$(this).removeClass("li-active");
			$(this).addClass("li-unactive");
			if($(this).parent().children(".second-all-navbar-class").is(":visible")){
				$(this).parent().children(".second-all-navbar-class").slideUp(200);
			}
		})
		$(this).removeClass("li-unactive");
		$(this).addClass("li-active");
		$(this).parent().children(".second-all-navbar-class").slideDown(200);

		if($(this).attr("thehref").length > 0 )
		{
			iframeContent.location.href = $(this).attr("href");
		}
		else
		{
			
			$(this).next().children().each(function(){
				$(this).find(".secnavbar-style-2").removeClass("circle-active");
				$(this).find(".secnavbar-style-2").addClass("circle-style");
				$(this).find(".secnavbar-style-3-a").removeClass("secnavbar-style-3-a-active");
				$(this).find(".secnavbar-style-3-a").addClass("secnavbar-style-3-a-unactive");
				 
			})
			$(this).next().children().eq(0).find(".secnavbar-style-2").removeClass("circle-style");
			$(this).next().children().eq(0).find(".secnavbar-style-2").addClass("circle-active");
			$(this).next().children().eq(0).find(".secnavbar-style-3-a").removeClass("secnavbar-style-3-a-unactive");
			$(this).next().children().eq(0).find(".secnavbar-style-3-a").addClass("secnavbar-style-3-a-active");
			iframeContent.location.href = $(this).next().children().eq(0).find(".secnavbar-style-3-a").attr("thehref");
		}
			 
	})
	$(".secnavbar-style-3-a").click(function(){
		$(this).parent().parent().parent().parent().children(".second-navbar-class").each(function(){
			$(this).find(".secnavbar-style-2").removeClass("circle-active");
			$(this).find(".secnavbar-style-2").addClass("circle-style");
			$(this).find(".secnavbar-style-3-a").removeClass("secnavbar-style-3-a-active");
			$(this).find(".secnavbar-style-3-a").addClass("secnavbar-style-3-a-unactive");
		})
		$(this).parent().parent().find(".secnavbar-style-2").removeClass("circle-style");
		$(this).parent().parent().find(".secnavbar-style-2").addClass("circle-active");
		$(this).removeClass("secnavbar-style-3-a-unactive");
		$(this).addClass("secnavbar-style-3-a-active");
		iframeContent.location.href = $(this).attr("thehref");	 
	})

}
function createSecondNavBar(){
	
}

function getValueFromChildren(str){
	$("#changeImg").html("");
	$("body").eq(0).css("overflow","hidden");
	$("#changeImg").removeClass("hide");
	$("#changeImg").html(str);
	//轮播操作
	
	var height=$(window).height();
   var width=height*0.625;
   $(".slider").css("margin-left",0.5*($(window).width()-width));
    $(".slider").YuxiSlider({
	width:width, //容器宽度
	height:height, //容器高度
	control:$(".control"), //绑定控制按钮
	during:9999999999, //间隔4秒自动滑动
	speed:800, //移动速度0.8秒
	mousewheel:true, //是否开启鼠标滚轮控制
	direkey:true //是否开启左右箭头方向控制
   });
	$(".close").click(function(){
		$("#changeImg").html("");
		$("#changeImg").addClass("hide");
		$("body").eq(0).css("overflow","scroll");
	})
	$(window).resize(function (){
   var height=$(window).height();
   var width=height*0.625;
   $(".slider").css("margin-left",0.5*($(window).width()-width));
    $(".slider").YuxiSlider({
	width:width, //容器宽度
	height:height, //容器高度
	control:$(".control"), //绑定控制按钮
	during:9999999999, //间隔4秒自动滑动
	speed:800, //移动速度0.8秒
	mousewheel:true, //是否开启鼠标滚轮控制
	direkey:true //是否开启左右箭头方向控制
   });
    }); 
}

$(document).ready(function(){
	if(localStorage.getItem("userAccountName")!= null &&localStorage.getItem("userAccountName")!= ""&&localStorage.getItem("userAccountName")!= undefined)
	{
		$("#userNameContent").attr("href","javascript:void(0)");
		$("#userNameContent").attr("title",localStorage.getItem("userAccountName"));
		$("#userRealName").text(localStorage.getItem("userAccountName"));
	}
	else
	{
		$("#userNameContent").attr("href","../../../index.html");
		$("#userNameContent").attr("title","请登陆");
		$("#userRealName").text("请登陆");
		window.open("../../../index.html","_self");
	
	}
		
	window.onresize = function(){
		$(".data-content-style").width($(".body-div-style").width() - 166);
	}
	$("#btnLogOut").click(function(){
		userLogout()
	})
	getNavBar();
//	realClick()
//	navClickFunction();
})
