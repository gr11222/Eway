/*
提示模态窗使用方法
1.创建对象：var a = new tipWindow();
2.调用方法：a.windowShow("窗口标题","提示信息");
 */
/*提示模态窗*/

function tipWindow(){
		var windowObj = {};
		this.windowTexts = "提示";
		this.createwindow = function(windowText,text){
			
			if(!windowText){
				this.windowTexts = "提示";
			}else{
				this.windowTexts = windowText;
			}
			var str = "";
			var theWindow = document.createElement("div");
			theWindow.id="myLib_tipWindowIds";
			theWindow.style.height = "162px";
			theWindow.style.width="352px";
			theWindow.style.backgroundColor ="#FFFFFF";
			theWindow.style.zIndex = 100000;
			theWindow.style.borderRadius = "5px";
			//theWindow.style.border = "1px solid #CCCCCC";
			theWindow.style.fontFamily="Microsoft YaHei";
			theWindow.style.position ="absolute";
			theWindow.style.top="200px";
			theWindow.style.left=parseInt(window.document.body.offsetWidth)/2-176+"px";
			theWindow.style.webkitBoxShadow="0px 0px 10px";
			theWindow.style.mozBoxShadow="0px 0px 10px";
			theWindow.style.boxShadow="0px 0px 10px  ";
			//头部
			str +="<div style='width:100%;height:30px;border-bottom:1px solid #CCCCCC;text-align:center;line-height:30px'>";
			str +=this.windowTexts;
			str +="</div>";
			//身体
			str +="<div style='height:60px;width:100%;border-bottom:1px solid #CCCCCC;text-align:center;word-warp:break-word;word-break:break-all;padding-top:30px;'>";
			// str +="<div style='width:320px;height:70px;background:red;margin-top:15px;margin-left:15px;'>";
			str +=text;
			// str +="</div>";
			str +="</div>";
			//底部
			str +="<div style='height:40px;width:100%;text-align:right'>";
			str +="<button type='button' id='myLib_btnHidden' style='height:30px;width:80px;margin-right:10px;margin-top:5px;background:#264EC2;color:#FFFFFF;border:1px solid #FFFFFF;border-radius:5px;'>确定</button>";
			str +="</div>";
			theWindow.innerHTML = str;
			windowObj = theWindow;
			return windowObj;
		}
		this.windowShow = function(windowText,text){
			for(var i = 0;i<window.document.body.childNodes.length;i++){
				if(window.document.body.childNodes[i].id == "myLib_tipWindowIds"){
					return;
				}
			}
			window.document.body.appendChild(this.createwindow(windowText,text));
		
			var obtn = document.getElementById('myLib_btnHidden');
			obtn.onclick = function(){
				window.document.body.removeChild(windowObj);
			}
			//提示窗口随浏览器的宽度改变而位置改变
			var theId = document.getElementById('myLib_tipWindowIds');
			window.onresize = function(){
				theId.style.left=parseInt(window.document.body.offsetWidth)/2-176+"px";
			}
		}
	}
/*
带函数的模态窗使用方法
1.创建对象：var a = new tipWindow();
2.调用方法：a.windowShow("提示信息","函数名称",参数);
如果参数为一个的话，可以是一个字符串，如果是多个的话必须是数组;
参数也可以不传递
 */
/*提示模态窗*/
function deleteTip(){
		var windowOBJs={};
		this.windowObj = {};
		this.windowTexts = "提示";
		this.createwindow = function(windowText,text){
			
		
			var str = "";
			this.windowObj = document.createElement("div");
			this.windowObj.id="myLib_deleteWindowIds";
			this.windowObj.style.height = "162px";
			this.windowObj.style.width="352px";
			this.windowObj.style.backgroundColor ="#FFFFFF";
			this.windowObj.style.zIndex = 100000;
			this.windowObj.style.borderRadius = "5px";
			//theWindow.style.border = "1px solid #CCCCCC";
			this.windowObj.style.fontFamily="Microsoft YaHei";
			this.windowObj.style.position ="absolute";
			this.windowObj.style.top="200px";
			this.windowObj.style.left=parseInt(window.document.body.offsetWidth)/2-176+"px";
			this.windowObj.style.webkitBoxShadow="0px 0px 10px";
			this.windowObj.style.mozBoxShadow="0px 0px 10px";
			this.windowObj.style.boxShadow="0px 0px 10px  ";
			//头部
			str +="<div style='width:100%;height:30px;border-bottom:1px solid #CCCCCC;text-align:center;line-height:30px'>";
			str +=this.windowTexts;
			str +="</div>";
			//身体
			str +="<div style='height:60px;width:100%;border-bottom:1px solid #CCCCCC;text-align:center;word-warp:break-word;word-break:break-all;padding-top:30px;'>";
			
			str +=windowText;
			
			str +="</div>";
			//底部
			str +="<div style='height:40px;width:100%;text-align:right'>";
			str +="<button type='button' id='myLib_btnDelete' style='height:30px;width:80px;margin-right:10px;margin-top:5px;background:#264EC2;color:#FFFFFF;border:1px solid #FFFFFF;border-radius:5px;'>确定</button>";
			str +="<button type='button' id='myLib_btnDelCancle' style='height:30px;width:80px;margin-right:10px;margin-top:5px;background:#264EC2;color:#FFFFFF;border:1px solid #FFFFFF;border-radius:5px;'>取消</button>"
			str +="</div>";
			this.windowObj.innerHTML = str;
			windowOBJs =  this.windowObj;
			return this.windowObj;
		}
		this.windowDelete = function(text,fun,arr){
			for(var i = 0;i<window.document.body.childNodes.length;i++){
				if(window.document.body.childNodes[i].id == "myLib_deleteWindowIds"){
					return;
				}
			}
			window.document.body.appendChild(this.createwindow(text,fun));
		
			var obtnSure = document.getElementById('myLib_btnDelete');
			obtnSure.onclick = function(){
				
				window.document.body.removeChild(windowOBJs);
				if (!arr) {
					eval("("+fun+")")();
				}else{
					eval("("+fun+")")(arr);
				}
				
			}
			var obtnCancle = document.getElementById('myLib_btnDelCancle');
			obtnCancle.onclick = function(){
				window.document.body.removeChild(windowOBJs);
			}
			//提示窗口随浏览器的宽度改变而位置改变
			var theId = document.getElementById('myLib_deleteWindowIds');
			window.onresize = function(){
				theId.style.left=parseInt(window.document.body.offsetWidth)/2-176+"px";
			}
		}
	}

/*
	confirm提示窗
	1.创建对象
	var conFirmWindow = new theConFirmWindow();
	2.调用窗口显示的方法
	conFirmWindow.windowShows("标题","函数名称",参数);

	//当参数为一个的时候可以是一个变量
	参数是多个的时候必须是一个数组
	参数也可以不传递
	注意：接收的时候函数应该多一个参数，参数是弹窗中填写的原因
 */
function theConFirmWindow(){
		var windowOBJs={};
		this.windowObj = {};

		this.createwindow = function(windowText,text){
			
		
			var str = "";
			this.windowObj = document.createElement("div");
			this.windowObj.id="myLib_confirmWindowIds";
			this.windowObj.style.height = "162px";
			this.windowObj.style.width="352px";
			this.windowObj.style.backgroundColor ="#FFFFFF";
			this.windowObj.style.zIndex = 100000;
			this.windowObj.style.borderRadius = "5px";
			this.windowObj.style.fontFamily="Microsoft YaHei";
			this.windowObj.style.position ="absolute";
			this.windowObj.style.top="200px";
			this.windowObj.style.left=parseInt(window.document.body.offsetWidth)/2-176+"px";
			this.windowObj.style.webkitBoxShadow="0px 0px 10px";
			this.windowObj.style.mozBoxShadow="0px 0px 10px";
			this.windowObj.style.boxShadow="0px 0px 10px  ";
			//头部
			str +="<div style='width:100%;height:30px;border-bottom:1px solid #CCCCCC;text-align:center;line-height:30px'>";
			str +=windowText;
			str +="</div>";
			//身体
			str +="<div style='height:90px;width:100%;border-bottom:1px solid #CCCCCC;text-align:center;padding-top:3px'>";
			
			str +="<textarea type='textarea' name='myLib_confirmContent' id='myLib_confirmContent' style='width:330px;height:80px'></textarea>";
			
			str +="</div>";
			//底部
			str +="<div style='height:40px;width:100%;text-align:right'>";
			str +="<button type='button' id='myLib_btnConfirm' style='height:30px;width:80px;margin-right:10px;margin-top:5px;background:#264EC2;color:#FFFFFF;border:1px solid #FFFFFF;border-radius:5px;'>确定</button>";
			str +="<button type='button' id='myLib_btnConfirmCancle' style='height:30px;width:80px;margin-right:10px;margin-top:5px;background:#264EC2;color:#FFFFFF;border:1px solid #FFFFFF;border-radius:5px;'>取消</button>"
			str +="</div>";
			this.windowObj.innerHTML = str;
			windowOBJs =  this.windowObj;
			return this.windowObj;
		}
		this.windowShows = function(text,fun,arr){
			for(var i = 0;i<window.document.body.childNodes.length;i++){
				if(window.document.body.childNodes[i].id == "myLib_confirmWindowIds"){
					return;
				}
			}
			window.document.body.appendChild(this.createwindow(text,fun));
		
			var obtnSure = document.getElementById('myLib_btnConfirm');
			obtnSure.onclick = function(){
				
				
				var myLib_inputValue = document.getElementById('myLib_confirmContent').value;
			
				if (!arr) {
					eval("("+fun+")")(myLib_inputValue);
				}else{
					eval("("+fun+")")(arr,myLib_inputValue);
				}
				window.document.body.removeChild(windowOBJs);
				
			}
			var obtnCancle = document.getElementById('myLib_btnConfirmCancle');
			obtnCancle.onclick = function(){
				window.document.body.removeChild(windowOBJs);
			}
			//提示窗口随浏览器的宽度改变而位置改变
			var theId = document.getElementById('myLib_confirmWindowIds');
			window.onresize = function(){
				theId.style.left=parseInt(window.document.body.offsetWidth)/2-176+"px";
			}
		}
	}