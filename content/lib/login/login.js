

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

function userLoginPara() {
	//	var account = base64.encode($("#username").val());
	//	var password = base64.encode($("#password").val());
	var account = BASE64.encoder($("#username").val());
	var password = BASE64.encoder($("#password").val());
	var jsonData = setJson(null, "requestCommand", "");
	jsonData = setJson(jsonData, "responseCommand", "");
	jsonData = setJson(jsonData, "account", account);
	jsonData = setJson(jsonData, "password", password);
	console.log("登陆传值=" + jsonData);
	return jsonData;
}

function userLogin() {
	$.ajax({
		type: "post",
		dataType: 'json',
		url: "/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsLoginCmd",
		contentType: "application/text,charset=utf-8",
		data: userLoginPara(),
		success: function(msg) {
			console.log("查询用户返回值=" + JSON.stringify(msg));
			if(msg.responseCommand.toUpperCase().indexOf("OK") != -1) {
				// if(typeof(Storage) !== "undefined") {
				// 	if(localStorage.getItem("userAccountName")==""){
				// 	quit();
						
				// 	}else{
				// 	localStorage.setItem("userAccountName", "");
					localStorage.setItem("userAccountName", $("#username").val());
						
				// 	}
					
				// }
				getUser();
			} else {
				// $(".text-location").css("display", "block");
				$(".text-location").html("用户或密码错误,请核对用户名和密码!");
				
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			// $(".text-location").css("display", "block");
			$(".text-location").html("用户或密码错误,请核对用户名和密码!");
		}
	})
}

function getUserPara() {
	var jsonStr = setJson(null, "userAccountName", localStorage.getItem("userAccountName"));

	console.log("登录传值=" + jsonStr);
	return jsonStr;
}

function getUser() {
	$.ajax({
		type: 'post',
		dataType: 'json',
		url: '/DevOpsNoSpring/servlet/DevOpsService?cmd=DevOpsLogoIndexConfigCmd',
		contentType: "application/text;charset=utf-8",
		data: getUserPara(),
		success: function(msg) {
			console.log("登录返回值" + JSON.stringify(msg));
			// alert(msg.toFlag);
			if(msg.toFlag == 0) {
				window.location.href = "basic/content/frameWork/html/home.html";
			} else {
				window.location.href = "../basic/content/frameWork/html/home.html";
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {}
	});

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
$(document).ready(function() {
	$("#btnLogin").click(function() {
		if(!$("#username").val()) {
			// alert("请输入用户名");
			$(".text-location").html("请输入用户名!");
			return;
		}
		if(!$("#password").val()) {
			// alert("请输入密码");
			$(".text-location").html("请输入密码!");
			return;
		}
		userLogin();
	})

	document.onkeyup = function(e) {
		var e = e || event;
		if(e.keyCode == 13) {
			if(!$("#username").val()) {
			$(".text-location").html("请输入用户名!");
				// alert("请输入用户名");
				return;
			}
			if(!$("#password").val()) {
				$(".text-location").html("请输入密码!");
				// alert("请输入密码");
				return;
			}
			userLogin();
		}
	}
})