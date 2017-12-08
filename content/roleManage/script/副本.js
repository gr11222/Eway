$(function(){
	
	
//  var arrRule=[["1","中创巡检管理员"],["2","中创巡检专员"],["3","中创物业管理员"]];
//  
//  fillRule(arrRule,"#ruleId");
//  arrRule=[["1","物业管理员","物业管理员"],["2","设备操作员","设备操作员"],["3","点检专员","点检专员"],["4","维保专员","维保专员"],["7","点检与维保复合专员","点检与维保复合专员"],["8","点检管理员","点检管理员"],["9","维保管理员","维保管理员"],["10","物业/工厂管理员","物业/工厂管理员"],["11","平台管理员","平台管理员"],["12","销售员","销售员"]];
//  fillRule(arrRule,"#TplId");
//  fillRule(arrRule,"#ChoiceTpl"); 

	fillSelect();
	function getaddSmallCateJson(addCrtSmallBtn){
    	var appOrBackend = parseInt($("#bigCatList").attr("APPorBackend"));
    	var ruleTpl = parseInt($('#ChoiceTpl').find("option:selected").attr('value'));
    	var jsonData = setJson(null, "userId", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"ruleTplID",ruleTpl);
		jsonData = setJson(jsonData,"appOrBackend",appOrBackend);
		jsonData = setJson(jsonData,"userDefine",parseInt(addCrtSmallBtn));
		jsonData = setJson(jsonData,"roleId",-1);		
		return jsonData;
    }
    
    function addSmallCate(addCrtSmallBtn){
    	$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAppOrBackendSmallTypeSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: getaddSmallCateJson(addCrtSmallBtn),
			success: function(msg) {
			    if(msg.state != 0){
			    	windowStart("新建出错,请稍后重试",false);
			    }else{
			    	var arr = msg.type;
			    	var appOrBackend = $("#bigCatList").attr("APPorBackend");
			    	dealAddSmallCate(arr,appOrBackend);
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			    windowStart("新建出错,请稍后重试",false);
			}
		});
    }

   	$("body").delegate("button[name='addCrtSmallBtn']","click",function(){
   		var addCrtSmallBtn = parseInt($(this).parents(".tab-pane").attr("roleid"));
    	$(".addSmallCate").remove();
    	$(".sureADDSmall").remove();
    	addSmallCate(addCrtSmallBtn);
	
	}); 
	
	function dealAddSmallCate(arr,appOrBackend){
		var str = '<div class = "addSmallCate"><ul class = "clearfix">';
    	var strAfter = "</ul></div>";
    	str += fillSmallCat(arr) + strAfter;
    	
    	str += '<div class = "sureADDSmall"  align="center"><button align="center" style="padding:10px 40px;">确定</button></div>';
    	$(".tab-content").eq(appOrBackend).find(".active").append(str);
    	
    	
    	
    	//tab-pane
	}
   
   $("body").delegate(".sureADDSmall","click",function(){
    	var str = "";
    	$(this).parent().find("input[type=checkbox]:checked").each(function(){
    		str += sureAddStr($(this).val(),$(this).next().text());
    	
    	});
    	
    	$(this).parents(".tab-content").find(".active").find('button[name="addCrtSmallBtn"]').parent().before(str);
    	$(".addSmallCate").remove();
    	$(".sureADDSmall").remove();
    }); 
    
    
    $(".crtTop .nav-tabs").delegate(".glyphicon-remove","click",function(){
    	var str = "#";
    	str += $(this).parent().find("a").attr("roleid");
    	$(str).remove();
    	$(this).parents("li").remove();
    });
    
    $(".crtTop .tab-content").delegate(".glyphicon-remove","click",function(){
    	$(this).parent().remove();
    });
   
   
   function sureAddStr(key,value){
   	var strsmallCate = '<li name="userCate" roleId = "' + key + '" >' + value +'<span class="glyphicon glyphicon-remove" ></span>'
		    	+ '</li>';
    return strsmallCate;
   }
   

   
   function fillSmallCat(arr){
   	    var strsmallCate = "";
   		for(var item = 0; item < arr.length; item++){
	    	strsmallCate += '<li>' + '<input type="checkbox" value="'+ arr[item][0] +'"/><label>'
	    	+arr[item][1]+'</label></li>';
	    }
   		return strsmallCate;
   }

//----------------拼接json公共函数开始-------------------
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
//----------------拼接json公共函数结束-------------------	
	
//-----------------首页功能处理开始-----------------------------
	function fillRuleArr(arr,id){
		str = '<option value="'+arr[0]+ '">'+arr[1]+'</option>';
    		$(id).append(str);
	}
    /*
     * 填充角色名称、角色模板下拉框
     */   
    function fillRule(arr,id){
     	for(var i = 0; i < arr.length; i+=1){
    		fillRuleArr(arr[i],id);
    	}   	
    }
	function initSelect() {
		var jsonData = setJson(null, "userID", localStorage.getItem("userAccountName"));
		console.log("查询下拉选择传值=" + jsonData);
		return jsonData;
	}
	
	function fillSelect() {
	
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleInfoListSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: initSelect(),
			success: function(msg) {
				
			    if(msg.state != 0){
			    	return false;
			    }else{
			    	fillRule(msg.nameItem,"#ruleId");
			    	fillRule(msg.tempItem,"#TplId");
			    	fillRule(msg.tempItem,"#ChoiceTpl"); 
			    	
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			    windowStart("下拉选择出错",false);
			   
			}
		});
	}
//-----------------首页功能处理结束-----------------------------


//——————————————————————————————查找表格——————————————————————————————————————
//拼接查找json 
	function getSearchInfoJson(pageNum){
		var index = parseInt($(".page-content").attr("crtPage"));
		var ruleId = $('#ruleId').find("option:selected").attr('value');
		var ruleTpl = $('#TplId').find("option:selected").attr('value');
	    if(ruleTpl == ""){
	    	ruleTpl = -1;
	    }
		index = (index - 1)*pageNum;
		var jsonData = setJson(null, "userID", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"ruleID",ruleId);
		jsonData = setJson(jsonData,"ruleTplID",ruleTpl);
		jsonData = setJson(jsonData,"index",index);
		jsonData = setJson(jsonData,"page",pageNum);
		
		return jsonData;
	}
	
	$("#btnPageBefore").click(function(){
		prePage(20);
	});
	function prePage(pageNum){
		if ($(".page-content").attr("crtPage") <= 1){
			windowStart("当前页为第一页",false);
		}else{
			page -= 1;
			searchInfo(pageNum);
			$(".page-content").attr("crtPage", page);
			
		}
	}
	
	$("#btnPageNext").click(function(){
		if ($(".page-content").attr("totalPage") >= 1){
			windowStart("当前页为最后一页",false);
		}else{
			page += 1;
			searchInfo(20);
			$(".page-content").attr("crtPage", page);
		}		
	})
	$("#btnPageJump").click(function(){
		var page = parseInt($("#pageNumId").val());
		
		var totalPage = parseInt($(".page-content").attr("totalPage"));
		if(isNaN(page)){
			windowStart("请输入正整数",false);
		}else if(page <= 0){
			windowStart("请输入正整数",false);
		}else if(page > totalPage){
			windowStart("页数大于总页数",false);
		}else{
			searchInfo(20);
			$(".page-content").attr("crtPage", page);
		}
	});	
	
	
	function searchInfo(pageNum) {
		$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleTemplateSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: getSearchInfoJson(pageNum),
			success: function(msg) {
			    if(msg.state != 0){
			    	windowStart(msg,false);
			    }else{
			    	
			    	fillTbl(msg.query);
			    	$("#page-content").attr("totalPage",msg.totalRecord);
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				
			    windowStart("查询出错",false);
			}
		});
	}
	
//查询表格
//	var arr=[["1","中创巡检管理员","8","点检管理员","管理员"],["2","中创巡检专员","3","点检专员","专员"],["3","中创物业管理员","1","物业管理员","管理员"]];
//	fillTbl(arr);
	
	$("#checkBtn").click(function(){
		$("#searchRole").show();
		$(".page-content").removeClass("hidden");
		searchInfo(20);
	});
	/*
	 * 查询角色名称、角色模板显示的表格
	 */
    function searchRoleTbl(i,arr){
   	   str ='<tr>'
            +'<td>'+ i+'</td>'
	        +'<td name="ruleName" style="cursor:pointer; color:#3B95E3;" ruleNameId='+arr[0]+'>'+arr[1]+'</td>'
	        +'<td name="ruleTpl" style="cursor:pointer;  color:#3B95E3;"  ruleTplId='+arr[2]+'>'+ arr[3]+'</td>'
	        +'<td>'+ arr[4]+'</td>'
			+ '<td><img src="../img/edit.png" name="edit" class="imgHover" alt="编辑" title="编辑" />'
			+'　<img src="../img/dele.png" name="del"  class="imgHover"  alt="删除" title="删除" /></td>'
			+'</tr>';
        $("#searchRole").append(str);   
    }
    
    function fillTbl(arr){
    	$("#searchRole").find("tr:not(:first)").remove();
    	for(var i = 0; i < arr.length; i++){
    		searchRoleTbl(i,arr[i]);
    	}
    }
   
	
//--------------------------查询结束--------------------------------


//-----------------------------查询表格中的角色开始-------------------

    $("body").delegate("td[name='ruleName']","click",function(){
     	$("#ChkAppBigBtn").siblings().remove();
    	$("#ChkBackBigBtn").siblings().remove();
    	$(".chkTop ").find(".tab-content").html("");   	
    	
    	var jsonData = setJson(null, "userID", localStorage.getItem("userAccountName"));
        
        var ruleNameId = $(this).parent('tr').find("td").eq(1).text();;
    	jsonData = setJson(jsonData,"ruleNameId",ruleNameId);
    	var roleRemark = $(this).parent('tr').find("td").eq(3).text();
    	var roleTpl = $(this).parent('tr').find("td").eq(2).text();
    	
    	$("#tabSave").attr("ruleNameId",ruleNameId);
    	$("#tabSave").attr("roleRemark",roleRemark);
    	$("#tabSave").attr("roleTpl",roleTpl);
    	
    	checkRolefcn(jsonData);
 
    });
    
    function dealChkRole(msg){
    	
    	var arrApp = msg.app.tpl; 
    	fillTplLiCate(arrApp,'#ChkAppBigBtn', 0,2,"chk");
    	
        var arrBackend = msg.backend.tpl; 
    	fillTplLiCate(arrBackend,'#ChkBackBigBtn', 1,2,"chk");
    	
    	arrApp = msg.app.userDefine;
        fillUserBigList(arrApp,"#chkApp", 0,2,"#ChkAppBigBtn","chk");
        
    	arrApp = msg.backend.userDefine;
        fillUserBigList(arrApp,"#chkBackend", 1,2,"#ChkBackBigBtn","chk");
        
        $(".chkTop").find(".glyphicon-remove").hide();
        
    	
    }
    function checkRolefcn(jsonData){
    	$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleTemplateListSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: jsonData,
			success: function(msg) {
				
			    if(msg.state != 0){
			    	return false;
			    }else{
			    		
		    	$("#chkRoleName").val($("#tabSave").attr("ruleNameId"));
		    	$("#chkRoleRemark").val($("#tabSave").attr("roleRemark"));
		    	
		    	$("#chkRoleTpl").find("option:selected").text($("#tabSave").attr("roleTpl"));
		    	
		    	$('#chkRoleName').attr("disabled",true);
		    	$('#chkRoleRemark').attr("disabled",true);
		    	$('#chkRoleTpl').attr("disabled",true);
		   	
		    	$('#cheakRole').modal('show');
		    	var msg = {state: 1 ,msg:msg,app:{tpl:[[1,"大类别tplapp",5,"tplapp"]],userDefine:[[1,"大类别user",6,"userapp"],[2,"自定义",3,"userapp2"]]},
		    	          backend:{tpl:[[1,"大类别tplback",6,"tplback"]],userDefine:[[2,"userback",4,"userbacksmall"]]}};
		    	dealChkRole(msg); 
			    	
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			    windowStart("下拉选择出错",false);
			   
			}
		});
    }

//-----------------------------查询表格中的角色结束-------------------


//----------------查询模板开始------------------------
 //查询模板   
    $("body").delegate("td[name='ruleTpl']","click",function(){
     	$("#ChkTplAppBigBtn").siblings().remove();
    	$("#ChkTplBackBigBtn").siblings().remove();
    	$(".chkTop ").find(".tab-content").html("");
    	
    	var jsonData = setJson(null, "userID", localStorage.getItem("userAccountName"));
        var roleTpl = $(this).parent('tr').find("td").eq(2).text();
        var roleTplID = $(this).parent('tr').find("td").eq(2).attr("ruleTplId");
    	jsonData = setJson(jsonData,"ruleTplID",roleTplID);
    	
    	$("#tabSave").attr("roleTpl",roleTpl);
    	
    	checkTplfcn(jsonData);

    });
    

    function checkTplfcn(jsonData){
    	$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleTemplateListSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: jsonData,
			success: function(msg) {
				
			    if(msg.state != 0){
			    	return false;
			    }else{
			    		
			 	$("#chkTpl").find("option:selected").text($("#tabSave").attr("roleTpl"));

		    	$('#chkTpl').attr("disabled",true);
		   	
		    	$('#cheakTpl').modal('show');
		    	
		    	dealChkTpl(msg);
			    	
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			    windowStart("下拉选择出错",false);
			   
			}
		});
    }
    
    function dealChkTpl(msg){
     	var arrApp = msg.ruleTpl.app; 
    	fillTplLiCate(arrApp,'#ChkTplAppBigBtn', 0,2,"tpl");
    	
        var arrBackend = msg.ruleTpl.backend; 
    	fillTplLiCate(arrBackend,'#ChkTplBackBigBtn', 1,2,"tpl");   	
    }
 //--------------------查询模板结束-----------------------------------
  
//-----------------------编辑角色开始------------------------------------------------
    $("body").delegate("img[name='edit']","click",function(){
    	var ruleNameId = $(this).parents('tr').find('td').eq(1).attr('ruleNameId');
    	var ruleTplId = $(this).parents('tr').find('td').eq(2).attr('ruleTplId');
        
    });
//---------------------------编辑角色结束---------------------------------------------

//--------------删除角色处理开始-----------------------------------------------------
  
    $("body").delegate("img[name='del']","click",function(){
     	var ruleNameId = $(this).parents('tr').find('td').eq(1).attr('ruleNameId');
    	var ruleTplId = $(this).parents('tr').find('td').eq(2).attr('ruleTplId'); 
    	
    	
    	var jsonData = setJson(null, "userID", localStorage.getItem("userAccountName"));
        
       
    	jsonData = setJson(jsonData,"ruleID",ruleNameId);
    	
    	jsonData = setJson(jsonData,"ruleTplID",ruleTplId);
    	
    	$("#tabSave").attr("ruleNameId",ruleNameId);
    	
    	$("#tabSave").attr("roleTpl",ruleTplId);
    	
    	delFcn(jsonData);
    	
    });
    
    function delFcn(jsonData){
    	$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleByRoleTemplateDeleteCmd",
			contentType: "application/text,charset=utf-8",
			data: jsonData,
			success: function(msg) {
				
			    if(msg.state != 0){
			    	return false;
			    }else{
			    		
			 	    windowStart("删除成功",true);
			    	
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			    windowStart("下拉选择出错",false);
			   
			}
		});
    }
    
//--------------删除角色处理结束-----------------------------------------------------


//---------------------新建开始--------------------------------------------------
    function initInput(){
    	$("#newRoleName").val("");
  		$("#NewRoleRemark").val("");
  		//$("#app").html("");
  		//$("#backend").html("");
  		
  		$('#ChoiceTpl').find('option').eq(0).attr("selected","selected");
  		//$("div[name='smallCate']").html("");
  		$(".tab-pane").find("ul").html("");
  		//$(".nav-tabs").find("li:not(:last)").remove();
    }

    $("#createRoles").click(function(){
  		initInput();
  		$('#createRole').modal('show');	
	});

//------------------------------点击新增下拉框的选择--------------------------
	$("#ChoiceTpl").change(function(){
		tplShow();
		$("#CrtApp ul li:not(:last-child)").remove();
		$("#CrtBackend ul li:not(:last-child)").remove();
		$(".tab-content").html("");
		createRole();
	});
    

    function getCreateRoleJson(){
    	var ruleTpl = $('#ChoiceTpl').find("option:selected").attr('value');
    	var jsonData = setJson(null, "userID", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"ruleTplID",ruleTpl);
		return jsonData;
    }
    
    function createRole(){
    	$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleTemplateListSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: getCreateRoleJson(),
			success: function(msg) {
			    if(msg.state != 0){
			    	windowStart("新建出错,请稍后重试",false);
			    }else{
			    	dealCreateRole(msg);
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			    windowStart("模板选择失败",false);
			}
		});
    }
    
    var msg = {state: 1 ,msg:"msg",ruleTpl:{app:[[1,"功能大类名称",1,'小标示1名称']],backend:[[2,'功能大类名称',2,'小标示1名称']]}}
    function dealCreateRole(msg){
    	var arrApp = msg.ruleTpl.app; 
    	appOrBackend = 0;
    	fillTplLiCate(arrApp,'#CrtAppBigBtn', 0,2,"crt");
    	//addCrtBigBtn('#CrtApp');
    	addCrtSmallBtn('#CrtApp',0);
        var arrBackend = msg.ruleTpl.backend; 
    	fillTplLiCate(arrBackend,'#CrtBackBigBtn', 1,2,"crt");
        //addCrtBigBtn('#CrtBackend',appOrBackend);
    	addCrtSmallBtn('#CrtBackend',1);	
    }
//------------------------------点击新增下拉框的选择结束--------------------------    


    //appOrBackend 0 app端      1 backend端
    var arr=[[1,'bigtitle','content1','content2'],[1,'bigtitle','content1','content2']];
    function dealTpl(arr, id, appOrBackend){	
    }
    
    //app 0   backend   1
    function fillTplLiCate(arr,id, appOrBackend,startIndex,fcn){
    	var str = "";
    	var strsmallCate = ""; 
    	for(var item = 0; item<arr.length; item++){
            str += fillTplBigCate(arr[item],  appOrBackend,fcn);
            strsmallCate += fillTplSmallCate(arr[item], appOrBackend,startIndex,fcn);
    	}

    	$(id).before(str);
    	$(id).parents(".role_content").find('.tab-content').append(strsmallCate);
    	
    	$(id).parent().find('li').eq(0).addClass('active');
    	$(id).parents(".role_content").find('.tab-content').find('div').eq(0).addClass('active');
    	$("#CrtAppBigBtn").removeClass('hidden');
    	$("#CrtBackBigBtn").removeClass('hidden');
    	
    }
    
    function addCrtBigBtn(id,appOrBackend){
    	var str = '<li name="smallCate">'
    	        +'<button class="glyphicon glyphicon-plus" id="addCrtBig" style= "height:40px; width:40px "></button>'
				+'</li>';
		$(id).find('ul').eq(0).append(str);
    }
    
    function addCrtSmallBtn(id,appOrBackend){
    	var str = '<li class="vertical-align:middle;">'
				  +'<button class="glyphicon glyphicon-plus"  name="addCrtSmallBtn"'
				  +'style= "height:30px; width:40px " ></button>'
				  + '</li>';
	    $(id).find('.tab-pane').find('ul').append(str);
	    
    }
    
    function fillTplBigCate(arr,appOrBackend,fcn){
    	var str = '<li>'
	    	+'<a href='+'"#' + fcn + appOrBackend + arr[0]+'"' 
	    	+ ' roleId =' + '"'+ fcn+ appOrBackend + arr[0]+'"' + ' role="tab" data-toggle="tab">'+arr[1]+'</a></li>';
	    return str;	
    }
    function fillTplSmallCate(arr, appOrBackend,startIndex,fcn){
    	if(startIndex>=arr.length){
    		return false;
    	}
    	var strsmallCate = '<div class="tab-pane"  roleId = "'+arr[0] + '" id=' +'"'+ fcn + appOrBackend + arr[0]+'">'
	    	+ '<ul class="clearfix">';
	    var strEnd = '</ul></div>';
	    for(var item = startIndex; item < arr.length; item += 2){
	    	strsmallCate += '<li name="smallCate" roleId = "' + arr[item] + '">' + arr[item+1] + '</li>';
	    }
	    strsmallCate +=strEnd;
	    return strsmallCate;
    }
    
    function fillUserBigCate(arr,id,appOrBackend,fcn){
    	
    	var tmp = $(id).find("li a");
    	var hrefTmp = fcn + appOrBackend + arr[0];
    	var re =new RegExp("^\(\w+)(" + hrefTmp + ")$","gim");
    	//if($(this).attr("href") == hrefTmp)
    	var rtn = 0;
    	tmp.each(function(){
    		
    		if($(this).attr("roleId") == hrefTmp){
    			rtn = 1;
    			return false;
    		}
    	});
    	if(rtn == 1){
    		return false;
    	}
    	var str = '<li style="background-color:#3B95E3">'
	    	+'<a href='+'"#'+ fcn + appOrBackend + arr[0]+'"' 
	    	+ ' roleId =' + '"'+ fcn+ appOrBackend + arr[0]+'"' +
	    	' role="tab" data-toggle="tab">'+arr[1]+'</a>'+
	    	'<span class="glyphicon glyphicon-remove"></span>'+'</li>';
	    return str;	
    } 
    

    
    function fillUseSmallCate(arr, id, appOrBackend,startIndex,isDump,fcn){
    	if(startIndex>=arr.length){
    		return false;
    	}
    	
        var strsmallCate="";
        if(isDump != false){
            strsmallCate = '<div class="tab-pane "  roleId = "'+arr[0] + '" roleTl = "'+arr[1] + '" id=' +'"'+ fcn + appOrBackend + arr[0]+'">'
	    	+ '<ul class="clearfix">';
	        var strEnd = '</ul></div>';
		    for(var item = startIndex; item < arr.length; item += 2){
		    	
		    	strsmallCate += '<li name="userCate" roleId = "' + arr[item] + '" >' + arr[item+1] +'<span class="glyphicon glyphicon-remove" ></span>'
		    	+ '</li>';
		    }
		    strsmallCate +=strEnd;
		    return strsmallCate;
        }else{
        	for(var item = startIndex; item < arr.length; item += 2){
        		var tmp = $(id).find("li[name='userCate']");
        		var flag = 0;
                tmp.each(function(){
		    		if($(this).attr("roleId") == arr[item]){
		    			flag = 1;
		    		}
		    	});
		    	if(flag == 1){
		    		flag = 0;
		    		continue;
		    	}
		    	strsmallCate += '<li name="userCate" roleId = "' + arr[item] + '" >' + arr[item+1] +'<span class="glyphicon glyphicon-remove" ></span>'
		    	+ '</li>';
		    	
        	}
        	$(id).find("div[roleId='"+arr[0] + "']").find('ul').append(strsmallCate);
        	return "";
        }
    	
    }
    
    function fillUserBigList(arr,id, appOrBackend,startIndex,btnId,fcn){
    	var str = "";
    	var strsmallCate = ""; 
    	for(var item = 0; item<arr.length; item++){
            var str1 = fillUserBigCate(arr[item], id, appOrBackend,fcn);
            if(str1 != false){
            	str += str1;
            }
            strsmallCate += fillUseSmallCate(arr[item], id, appOrBackend,startIndex,str1,fcn);
    	}
        if(str != ""){
        	$(id).find(".nav").find(btnId).before(str);
        }
    	
    	$(id).find(".tab-content").eq(appOrBackend).append(strsmallCate);
	
    }
    
//------------------添加APP大类--------------------------    
    $("#addAppCrtBig").click(function(){	    
 	    $(this).parents('.crtTop').hide();
 	    $(".addBigCat").find('ul').eq(0).html("");
 	    $(".addBigCat").find(".tab-content").html("");
 	    $(".addBigCat").removeClass("hidden");
 	    $("#bigCatList").attr("APPorBackend","0");
 	   
 	    addBigCate();
 	    //var arr = [[5,"大类app",6,"小雷app",7,"顶顶顶顶"],[8,"系统2",9,"对对对"]];
 	    //fillBigList(arr,"#bigCatList", 0,2);
    });
//------------------添加BAckend大类--------------------------      
    $("#addBackendCrtBig").click(function(){
 	    $(this).parents('.crtTop').hide();
 	    $(".addBigCat").find('ul').eq(0).html("");
 	    $(".addBigCat").find(".tab-content").html("");
 	    $(".addBigCat").removeClass("hidden");
 	    $("#bigCatList").attr("APPorBackend","1");
 	   
 	   
 	     addBigCate();
 	    //var arr = [[5,"大类",6,"小雷",7,"顶顶顶顶"],[8,"系统2",9,"对对对"]];
 	    //fillBigList(arr,"#bigCatList", 1,2);
    }); 
    
    function getaddBigCateJson(){
    	var appOrBackend = parseInt($("#bigCatList").attr("APPorBackend"));
    	var ruleTpl =  parseInt($('#ChoiceTpl').find("option:selected").attr('value'));
    	var jsonData = setJson(null, "userID", localStorage.getItem("userAccountName"));
		jsonData = setJson(jsonData,"ruleTplID",ruleTpl);
		jsonData = setJson(jsonData,"appOrBackend",appOrBackend);
		jsonData = setJson(jsonData,"userDefine",-1);
		jsonData = setJson(jsonData,"roleId",-1);		
		return jsonData;
    }
    
    function addBigCate(){
    	$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsAppOrBackendBigTypeSearchCmd",
			contentType: "application/text,charset=utf-8",
			data: getaddBigCateJson(),
			success: function(msg) {
			    if(msg.state != 0){
			    	windowStart("新建出错,请稍后重试",false);
			    }else{
			    	var arr = msg.type;
			    	var appOrBackend = $("#bigCatList").attr("APPorBackend");
			    	fillBigList(arr,"#bigCatList", appOrBackend,2);
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			    windowStart(msg,false);
			}
		});
    }
    
    function getHadList(addCateBtn){
    	var list = addCateBtn.parents(".role_content").find(".tab-pane");
    	list.each(function(){
    		
    	});
    }
  
    function removeDump(arrHad, arrWillFill){
    	
    }
    function bigCatList(arr,appOrBackend){
    	var str = '<li>'
	    	+'<a href='+'"#crtBig'+ appOrBackend + arr[0]+'"   role="tab" data-toggle="tab" >'+arr[1]+'</a></li>';
	    return str;	
    }
    //$("#bigCatList")
    function fillBigList(arr,id, appOrBackend,startIndex){
    	var str = "";
    	var strsmallCate = ""; 
    	for(var item = 0; item<arr.length; item++){
            str += bigCatList(arr[item],  appOrBackend);
            strsmallCate += fillSmallList(arr[item], appOrBackend,startIndex);
    	}

    	$(id).find(".nav").append(str);
    	$(id).find(".tab-content").append(strsmallCate);
    	$(id).find('.nav li').eq(0).addClass('active');
    	$(id).find('.tab-content').find('div').eq(0).addClass('active');
	
    }
    
    function fillSmallList(arr, appOrBackend,startIndex){
    	if(startIndex>=arr.length){
    		return false;
    	}
    	var strsmallCate = '<div  class="tab-pane " roleId = "'+arr[0] + '" roleTl = "'+arr[1] + '" id=' +'"crtBig'+ appOrBackend + arr[0]+'">'
	    	+ '<ul class="clearfix">';
	    var strEnd = '</ul></div>';
	    for(var item = startIndex; item < arr.length; item+=2){
	    	strsmallCate += '<li>' + '<input type="checkbox" value="'+ arr[item] +'"/><span>'
	    	+arr[item+1]+'</span></li>';
	    }
	    strsmallCate +=strEnd;
	    return strsmallCate;
    }
    
    function fillAddBigCat(){
    	
    }

    function fillCheakRole(ruleNameId){
    	
    	
    }

 
    
    $("#cancelAdd").bind("click",function(){
    	$(".addBigCat").addClass("hidden");
    	$(".crtTop").show();
    	
    });
    //
    $("#sureAdd").bind("click",function(){
    	var arr=[];
    	
    	var flag = 0;
    	var divSelf = $(this).parents(".selectBigCate").find(".tab-pane");
    	divSelf.each(function(){
    		flag = 0;
    		var arrChid=[];
    		$(this).find("input[type=checkbox]:checked").each(function() {
    			
        		if ( flag == 0) {
        			
        			var parentsId = $(this).parents(".tab-pane").attr("roleId");
        			var parentsctn = $(this).parents(".tab-pane").attr("roleTl");
                	arrChid.push(parentsId);
                	arrChid.push(parentsctn);
                	
                	flag = 1;
        		}
        		var value= $(this).val();
                arrChid.push(value);
                var chdCtn = $(this).next().html();
                arrChid.push(chdCtn);
        		
			});
			if(arrChid.length > 0){
				arr.push(arrChid);
			}
    		
    	});
    	
    	$(".addBigCat").addClass("hidden");
    	var AppOrBackend =  parseInt($("#bigCatList").attr("APPorBackend"));
    	
    	var ftn = "";
        if(AppOrBackend == 0){
        	ftn = "#CrtAppBigBtn";
        	parentId = "#CrtApp";
        }else{
        	ftn = "#CrtBackBigBtn";
        	parentId = "#CrtBackend";
        }
        $(".crtTop").find(".tab-content").eq(AppOrBackend).find(".glyphicon-plus").parent("li").remove();
        
    	fillUserBigList(arr,".crtTop", AppOrBackend,2,ftn,"crt");
       
        addCrtSmallBtn(parentId,AppOrBackend);
    	$(".crtTop").show();	
    });
    
    

    function dealAppOrBackendCrt(appOrBackend){
    	var tmp = $(".crtTop").find(".tab-content").eq(appOrBackend).find(".glyphicon-remove").parents(".tab-pane");
    	var bigCate = [];
        bigCate = dealCrtArr(tmp, bigCate);
        
        return bigCate;
    }
    
    function dealCrtArr(tmp, bigCate){
    	
    	tmp.each(function(){
    	
    		var roleId = $(this).attr("roleId");
		    var tmpArr = [];
		    var obj = {};
		 	obj.typeName = "";

		 	obj.roleId = roleId;
		 		
			var tmp1 = $(this).find(".glyphicon-remove").parent("li");
			
			tmp1.each(function(){
				roleId = $(this).attr("roleId");

	            var obj = {};
		 		obj.typeName = "";
		 		
		 		obj.typeId = roleId;
		 		tmpArr.push(obj);
			})
			obj.smallItem = tmpArr;
			bigCate.push(obj);
		});
		return bigCate;
    }
    
    function fillAjaxCrt(){
    	var jsonData = setJson(null, "userID", localStorage.getItem("userAccountName"));
    	var ruleName = $("#newRoleName").val();
    	if (ruleName == ""){
    		return false;
    	}
    	jsonData = setJson(jsonData,"rulename",ruleName);
    	
    	var NewRoleRemark = $("#NewRoleRemark").val();
    	jsonData = setJson(jsonData,"remark",NewRoleRemark);
    	
    	var tpl = $('#ChoiceTpl').find("option:selected").attr('value');
    	jsonData = setJson(jsonData,"ruleTplID",tpl);
    	
    	var app = dealAppOrBackendCrt(0);
    	jsonData = setJson(jsonData,"appItem",app);

    	var backend = dealAppOrBackendCrt(1);
    	jsonData = setJson(jsonData,"backendItem",backend);

		return jsonData;
    }
    
    $("#saveCrt").click(function(){
    	$('#createRole').modal('hide');
    	var ruleName = $("#newRoleName").val();
    	if (ruleName == ""){
    		windowStart("角色名称不能为空",false);
    		return;
    	}
    	
    	var select = $('#ChoiceTpl').find("option:selected").attr('value');
     	if (select == ""){
    		windowStart("角色模板必须选择",false);
    		return;
    	}   	
    	SureCrtRole();
    	//fillAjaxCrt();
    	
    });
    
    function SureCrtRole(){
    	$.ajax({
			type: "post",
			dataType: 'json',
			url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsRoleByRoleTemplateAddCmd",
			contentType: "application/text,charset=utf-8",
			data: fillAjaxCrt(),
			success: function(msg) {
			    if(msg.state != 0){
			    	windowStart("新建角色出错,请稍后重试",false);
			    }else{
			    	windowStart("新建角色成功",true);
			    }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			    windowStart("新建角色出错,请稍后重试",false);
			}
		});
    }
    

    function tplShow(){
    	$(".tpl").removeClass("hidden");
    }
    
    function sureAdd(){
    	//$("input:checked");;
    }
});