
var editObj = {};
var editFoodType = -1;
var editFoodId = -1;

var theFilePath = "";
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



//---------------菜品类型查询------------------------------

function searchSysInfosPara() {
	var obj = {};
//	obj.requestCommand = localStorage.getItem("userAccountName");
	obj.responseCommand = "";
	obj.requestCommand = localStorage.getItem("userAccountName");
	obj.failReason = "";
	var jsonData = setJson(null, "resp", obj);
	jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
	console.log("查询下拉选择传值=" + jsonData);
	return jsonData;
}

function searchSysInfos() {
	
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishInfoTypesCmd",
		contentType: "application/text,charset=utf-8",
		data: searchSysInfosPara(),
		success: function(msg) {
			if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1) {
				console.log("查询下拉选择返回值=" + JSON.stringify(msg));
				createSysInfoSelect(msg);
				searchFondInfos();
			} else {
				windowStart(msg.resp.failReason, false);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询菜品类型、口味、菜系权限", false);
			} else {
				windowStart("查询菜品类型、口味、菜系失败", false);
			}
		}
	})
}

function createSysInfoSelect(msg) {
	//公司
	$("#foodType").html("");
	$("#foodTypeModal").html("");
	$("#foodFromModal").html("");
	$("#foodTestModal").html("");
	$("#editfoodFromModal").html("");
	$("#editfoodTestModal").html("");
	$("#editfoodTypeModal").html("");
	if(msg.dishCuisineItems != undefined && msg.dishCuisineItems.length > 0) {
		var theData = msg.dishCuisineItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["id"] + "'>" + theData[i]["name"] + "</option>";
		}
		$("#foodFromModal").html(str);
		$("#editfoodFromModal").html(str);
		

	}
	if(msg.dishTasteItems != undefined && msg.dishTasteItems.length > 0) {
		var theData = msg.dishTasteItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["id"] + "'>" + theData[i]["name"] + "</option>";
		}
		$("#foodTestModal").html(str);
		$("#editfoodTestModal").html(str);

	}
	if(msg.dishTypeItems != undefined && msg.dishTypeItems.length > 0) {
		var theData = msg.dishTypeItems;
		var str = "<option value=''>请选择</option>";
		for(var i = 0; i < theData.length; i++) {
			str += "<option value='" + theData[i]["id"] + "'>" + theData[i]["name"] + "</option>";
		}
		$("#foodType").html(str);
		$("#foodTypeModal").html(str);
		$("#editfoodTypeModal").html(str);
	}
}

/******菜品信息查询********/

function searchFondInfosPara() {
	var dishTypeId = -1;
	
	if($("#foodType").val().length > 0 )
	{
		dishTypeId = parseInt($("#foodType").val());
	}
	var diPrice = -1,highPrice = -1;
	if($("#diPrice").val().length > 0 )
	{
		 diPrice = parseInt($("#diPrice").val());
	}
	if($("#highPrice").val().length > 0 )
	{
		 highPrice = parseInt($("#highPrice").val());
	}
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "dishTypeId", dishTypeId);
	jsonData = setJson(jsonData, "dishNameCn", $("#foodName").val());
	jsonData = setJson(jsonData, "priceMin",diPrice);
	jsonData = setJson(jsonData, "priceMax",highPrice);
	jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
	console.log("查询下拉选择传值=" + jsonData);
	return jsonData;
}

function searchFondInfos() {
	
	
	if($("#diPrice").val().length > 0 )
	{
		var numReg = /^[0-9]+$/;
		if(!$("#highPrice").val()){
			windowStart("结束价格不能为空", false);
			return;
		}
		if(!numReg.test($("#diPrice").val())){
			windowStart("价格只能输入正整数和0", false);
			return;
		}
		
		if(parseFloat($("#diPrice").val()) <=  0  || parseFloat($("#diPrice").val()) <= 0 ){
			windowStart("价格必须大于0", false);
			return;
		}
	}
	if($("#highPrice").val().length > 0 )
	{
		var numReg = /^[0-9]+$/;
		if(!$("#diPrice").val()){
			windowStart("开始价格不能为空", false);
			return;
		}
	
		if(!numReg.test($("#highPrice").val())){
			windowStart("价格只能输入正整数", false);
			return;
		}
		if(parseInt($("#highPrice").val()) == 0)
		{
			windowStart("价格只能输入正整数", false);
			return;
		}
		if(parseInt($("#diPrice").val()) <=  0  || parseInt($("#diPrice").val()) <= 0 ){
			windowStart("价格必须大于0", false);
			return;
		}
	}
	if(($("#diPrice").val().length > 0 ) && ($("#highPrice").val().length > 0)){
		if(parseInt($("#diPrice").val()) >= parseInt($("#highPrice").val()) )
		{
			windowStart("请正确填写价格区间", false);
			return;
		}
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishInfoManageSearchCmd",
		contentType: "application/text,charset=utf-8",
		data: searchFondInfosPara(),
		success: function(msg) {
			
				console.log("查询菜品返回值=" + JSON.stringify(msg));
				if(msg.resp.responseCommand.toUpperCase().indexOf("OK") != -1)
				{	
					createFondInfosTable(msg);
					// windowStart("菜品信息查询结束", true);
				}else{
					windowStart(msg.resp.failReason, true);
				}
				
			
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
//			var msg = {
//				"items":[
//					{
//						"dishTypeId":1,
//						"dishTypeName":"aaa",
//						"dishItem":[
//							{
//								"dishInfoId":1,
//								"nameCn":"宫保鸡丁",
//								"dishCuisineId":12,
//								"dishCuisineName":"东北菜",
//								"dishTasteId":1,
//								"dishTasteName":"甜、咸",
//								"price":32,
//								"dishInfoPic":"../img/1.jpg"
//							},
//							{
//								"dishInfoId":1,
//								"nameCn":"宫保鸡丁",
//								"dishCuisineId":12,
//								"dishCuisineName":"东北菜",
//								"dishTasteId":1,
//								"dishTasteName":"甜、咸",
//								"price":32,
//								"dishInfoPic":"../img/1.jpg"
//							},
//							{
//								"dishInfoId":1,
//								"nameCn":"宫保鸡丁",
//								"dishCuisineId":12,
//								"dishCuisineName":"东北菜",
//								"dishTasteId":1,
//								"dishTasteName":"甜、咸",
//								"price":32,
//								"dishInfoPic":"../img/1.jpg"
//							},
//							{
//								"dishInfoId":1,
//								"nameCn":"宫保鸡丁",
//								"dishCuisineId":12,
//								"dishCuisineName":"东北菜",
//								"dishTasteId":1,
//								"dishTasteName":"甜、咸",
//								"price":32,
//								"dishInfoPic":"../img/1.jpg"
//							},
//							{
//								"dishInfoId":1,
//								"nameCn":"宫保鸡丁",
//								"dishCuisineId":12,
//								"dishCuisineName":"东北菜",
//								"dishTasteId":1,
//								"dishTasteName":"甜、咸",
//								"price":32,
//								"dishInfoPic":"../img/1.jpg"
//							}
//						]
//					},
//					{
//						"dishTypeId":1,
//						"dishTypeName":"aaa",
//						"dishItem":[
//							{
//								"dishInfoId":1,
//								"nameCn":"宫保鸡丁",
//								"dishCuisineId":12,
//								"dishCuisineName":"东北菜",
//								"dishTasteId":1,
//								"dishTasteName":"甜、咸",
//								"price":32,
//								"dishInfoPic":"../img/1.jpg"
//							},
//							{
//								"dishInfoId":1,
//								"nameCn":"宫保鸡丁",
//								"dishCuisineId":12,
//								"dishCuisineName":"东北菜",
//								"dishTasteId":1,
//								"dishTasteName":"甜、咸",
//								"price":32,
//								"dishInfoPic":"../img/1.jpg"
//							}
//						]
//					}
//				]
//			};
//			createFondInfosTable(msg);
//			return;
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无查询下拉选择权限", false);
			} else {
				windowStart("查询菜品信息失败", false);
			}
		}
	})
}

function createFondInfosTable(msg){
	$("#dataContent").html("");
	var str = "";
	var theData = msg.items;
	if(!msg.items || msg.items.length == 0 )
	{
		var str = "";
		str +='<div style="position:relative;width: 300px;margin:0 auto;top:40%;font-size: 20px;font-weight: bold;">';
		str +='提示：<br />'
		str += "当前条件下无菜品信息</div>";
		$("#dataContent").html(str);	
		return;
	}
	var arrLength = [];
	for(var j = 0 ; j< theData.length;j++){
		if(!theData[j]["dishItem"] ||theData[j]["dishItem"].length == 0 )
		{
			arrLength.push(false);
		}
		else{
			arrLength.push(true);
		}
	}
	var isEmpty = false; 
	for(var k = 0;k<arrLength.length;k++){
		console.log(isEmpty);
		isEmpty = isEmpty || arrLength[k];
	}
	console.log(isEmpty);
	if(!isEmpty){
		var str = "";
		str +='<div style="position:relative;width: 300px;margin:0 auto;top:40%;font-size: 20px;font-weight: bold;">';
		str +='提示：<br />'
		str += "当前条件下无菜品信息</div>";
		$("#dataContent").html(str);	
		return;
	}
	for(var i = 0 ; i< theData.length;i++)
	{

		if(!theData[i]["dishItem"] ||theData[i]["dishItem"].length == 0 )
		{
			continue;
		}
		for(var j =0; j < theData[i]["dishItem"].length;j++ )
		{
			str += "<div class='food-info-div'>";
			str += "<div style='position:absolute;right:10px;top:5px'><a href='javascript:void(0)' theType='"+ theData[i]["dishTypeId"]+"' theData='"+JSON.stringify(theData[i]["dishItem"][j])+"' class='editInfo-class' title='编辑'><span class='glyphicon glyphicon-edit'></span></a></div>";
			str += "<div style='width:100%;height:100%;background:#FFFFFF'>";
			str += "<div  class='img-content'>";
			str += "<img src='../../../dishPicture/"+theData[i]["dishItem"][j]["dishInfoPic"]+"' width='180' height='200'>";
			str += "</div>";
			str += "<div  class='jieshao-content'>";
			str += "<span style='padding-left:30px'>"+theData[i]["dishItem"][j]["nameCn"]+"</span>";
			str += "</div>";
			str += "<div  class='jieshao-content'>";
			str += "<span style='padding-left:30px'>"+theData[i]["dishItem"][j]["dishCuisineName"]+"</span><span style='padding-left:15px'>口味:"+theData[i]["dishItem"][j]["dishTasteName"]+"</span>";
			str += "</div>";
			//
			str += "<div  class='price-content'>";
			str += "<span  style='padding-left:30px'>"+theData[i]["dishItem"][j]["price"]+" 元/份</span>";
			str += "</div>";
			str += "</div>";
			str += "</div>";
		}
		
		//
		
	}
	$("#dataContent").html(str);	
	
	$(".editInfo-class").click(function(){
		editObj = eval("("+$(this).attr("theData")+")");
		editFoodType = parseInt($(this).attr("theType"));
		editFoodId = editObj.dishInfoId;
		$("#editfoodNameModal").val(editObj.nameCn);
		$("#editfoodNameEnModal").val("");
		$("#editfoodFromModal").val(editObj.dishCuisineId);
		$("#editfoodTestModal").val(editObj.dishTasteId);
		$("#editpriceModal").val(editObj.price);
		$("#editfoodTypeModal").val(editFoodType);
		$("#editDataModal").modal("show");
	})
	
}
/**菜品添加**/

function addFoodInfosPara() {
	var theName = "";
	theName = $("#"+theFilePath).val().substring($("#"+theFilePath).val().lastIndexOf("\\")+1,$("#"+theFilePath).val().length);
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "dishInfoNameCn", $("#foodNameModal").val());
	jsonData = setJson(jsonData, "dishInfoNameEn", "");
	jsonData = setJson(jsonData, "dishCuisineId",parseInt($("#foodFromModal").val()));
	jsonData = setJson(jsonData, "dishTasteId",parseInt($("#foodTestModal").val()));
	jsonData = setJson(jsonData, "price", parseInt($("#priceModal").val()));
	jsonData = setJson(jsonData, "dishTypeId",parseInt($("#foodTypeModal").val()));
	jsonData = setJson(jsonData, "imagePath",theName);
//	jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
	console.log("添加传值=" + jsonData);
	return jsonData;
}

function addFoodInfos() {
	
	var numReg = /^[0-9]+$/;
	if(!numReg.test($("#priceModal").val()))
	{
		windowStart("菜品价格只能输入数字", false);
		return;
	}
	if(parseInt($("#priceModal").val()) <= 0 )
	{
		windowStart("菜品价格应大于0", false);
		return;
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishInfoManageAddCmd",
		contentType: "application/text,charset=utf-8",
		data: addFoodInfosPara(),
		success: function(msg) {
				console.log("查询菜品返回值=" + JSON.stringify(msg));
				if(msg.responseCommand.toUpperCase().indexOf("OK") != -1)
				{
					$("#AddDataModal").modal("hide");
					$("#foodNameModal").val("");
					$("#foodNameEnModal").val("");
					$("#foodFromModal").val("");
					$("#foodTestModal").val("");
					$("#priceModal").val("");
					$("#foodTypeModal").val("");
					importFile();
					
				}else{
					windowStart(msg.failReason, false);
				}
				

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无添加菜品信息权限", false);
			} else {
				windowStart("添加菜品信息失败", false);
			}
		}
	})
}


//修改菜品信息
function editFoodInfosPara() {
	var theName = "";
	theName = $("#"+theFilePath).val().substring($("#"+theFilePath).val().lastIndexOf("\\")+1,$("#"+theFilePath).val().length);
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "dishInfoId",editFoodId);
	jsonData = setJson(jsonData, "nameCn", $("#editfoodNameModal").val());
	
	jsonData = setJson(jsonData, "dishCuisineId",parseInt($("#editfoodFromModal").val()));
	jsonData = setJson(jsonData, "dishTasteId",parseInt($("#editfoodTestModal").val()));
	jsonData = setJson(jsonData, "price", parseInt($("#editpriceModal").val()));
	jsonData = setJson(jsonData, "dishTypeId",parseInt($("#editfoodTypeModal").val()));
	jsonData = setJson(jsonData, "dishInfoPic",theName);
	jsonData = setJson(jsonData,"userAccountName",localStorage.getItem("userAccountName"));
	console.log("修改传值=" + jsonData);
	return jsonData;
}

function editFoodInfos() {
	var numReg = /^[0-9]+$/;
	if(!numReg.test($("#editpriceModal").val()))
	{
		windowStart("菜品价格只能输入数字", false);
		return;
	}
	if(parseInt($("#editpriceModal").val()) <= 0 )
	{
		windowStart("菜品价格应大于0", false);
		return;
	}
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishInfoManageUpdateCmd",
		contentType: "application/text,charset=utf-8",
		data: editFoodInfosPara(),
		success: function(msg) {

				console.log("修改菜品返回值=" + JSON.stringify(msg));
				if(msg.responseCommand.toUpperCase().indexOf("OK") != -1)
				{
					$("#editDataModal").modal("hide");
					$("#editfoodNameModal").val("");
					$("#editfoodNameEnModal").val("");
					$("#editfoodFromModal").val("");
					$("#editfoodTestModal").val("");
					$("#editpriceModal").val("");
					$("#editfoodTypeModal").val("");
					importFile();
				}else{
					windowStart(msg.failReason, false);
				}
				

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var xmlRequest = XMLHttpRequest.status;
			if(xmlRequest == "401") {
				windowStart("当前用户无修改菜品信息权限", false);
			} else {
				windowStart("修改菜品信息失败", false);
			}
		}
	})
}



//上传

function importFile(){
	
    $.ajaxFileUpload(
        {
            url:'/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsDishInfoPictureUpdateCmd',  //需要链接到服务器地址
            secureuri:false,
            fileElementId:theFilePath,          //文件选择框的id属性
            dataType: 'text',                  //服务器返回的格式，可以是json
            success: function (data, status)
            {
            	// console.log($(data).text().toUpperCase().indexOf("ok"));
               if ($(data).text().toUpperCase().indexOf("ok") === -1) {
               		console.log('ss')
               		if(theFilePath == "foodImg")
               		{
               			windowStart("添加菜品信息成功",true);
						searchFondInfos();
               		}
               		else
               		{
               			windowStart("修改菜品信息成功",true);
						searchFondInfos();
               		}
                	
               }else{
               		
					if(theFilePath == "foodImg")
               		{
               			windowStart("添加菜品信息失败",true);
						searchFondInfos();
               		}
               		else
               		{
               			windowStart("修改菜品信息失败",false);
						
               		}
               }
            },
            error: function (data, status, e)
            {
		       	if(theFilePath == "foodImg")
           		{
           			windowStart("添加菜品信息失败",true);
					searchFondInfos();
           		}
           		else
           		{
           			windowStart("修改菜品信息失败",false);
					
           		}	
            }
        }               
    );
}
$(document).ready(function() {
	$('#AddDataModal').on("hidden.bs.modal", function() {
		$("#foodNameModal").val('');
		$('#foodTypeModal').val('');
		$('#foodFromModal').val('');
		$('#foodTestModal').val('');
		$('#priceModal').val('');
		$('#foodImg').val('');
	});
	searchSysInfos();
//	searchFondInfos();
	$("#btnAddFood").click(function(){
		$("#AddDataModal").modal("show");
	})
	
	
	$("#btnSearchData").click(function(){
		searchFondInfos();
	})
	
	$("#btnAddBtn").click(function(){
		theFilePath = "foodImg";
		addFoodInfos();
	})
	$("#btneditBtn").click(function(){
		theFilePath = "editfoodImg";
		editFoodInfos();
	})
	
})