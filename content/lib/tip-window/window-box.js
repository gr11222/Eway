/*

使用方法：
	1.var theBox =  new windowTip("提示信息",flag);
	
	注：flag两个值，分别是true和false；
	当时true的时候，4秒后窗体消失，
	当为false的时候，窗体不消失
	2.theBox.showBox();//这个为显示窗口的方法
 */
function windowTip(tipText,flag){
	var bodyChild = window.document.body.childNodes;
	for(var i = 0; i< bodyChild.length;i++){
		if(bodyChild[i].id == "windowTipId"){
			window.document.body.removeChild(bodyChild[i]);
		}
	}
	this.width = "250px";
	this.height = "120px";
	
	this.topBgColor = "#224ABF";
	this.box = {};
	this.createWindow  =  function(){
		this.box = document.createElement("div");
		this.box.id = "windowTipId";
		this.box.style.width = this.width;
		this.box.style.height = this.height;
		this.box.style.border ="1px solid #cccccc";
		this.box.style.backgroundColor = "#FFFFFF";
		this.box.style.color='#000000';
		this.box.style.position = 'fixed';
		this.box.style.bottom = '-120px';
		this.box.style.right = '10px';
		this.box.style.zIndex = "9999999999";
		this.box.style.fontFamily ='微软雅黑';
		this.box.style.fontSize ='12px';
		
		var str = '<div style="height:30px;background:'+this.topBgColor+';width:250px">';
		str+='<div style="width:220px;padding-top:5px;padding-left:5px;font-size:15px;float:left;color:#FFFFFF">提示</div>';
		str +='<div style="width:20px;height:20px;background:#FFFFFF;float:left;text-align:center;margin-top:5px;cursor:pointer" id="btnCloseWindow">X</div>';
		if(tipText.length <= 17){
			if(flag){
				str +='</div><div style="background:#FFFFFF;height:90px;width:250px;word-wrap:break-wrap;word-break:break-all;text-align:center;line-height:90px;font-size:14px">'+tipText+'</div>';
			}else{
				str +='</div><div style="background:#FFFFFF;color:red;height:90px;width:250px;word-wrap:break-wrap;word-break:break-all;text-align:center;line-height:90px;font-size:14px">'+tipText+'</div>';
			}
			
		}else{
			if(flag){
				str +='</div><div style="background:#FFFFFF;height:90px;width:250px;word-wrap:break-wrap;word-break:break-all;text-align:center;padding-top:30px;font-size:14px">'+tipText+'</div>';
			}else{
				str +='</div><div style="background:#FFFFFF;color:red;height:90px;width:250px;word-wrap:break-wrap;word-break:break-all;text-align:center;padding-top:30px;font-size:14px">'+tipText+'</div>';
			}
			
		}
		
		
		this.box.innerHTML = str;

		return this.box;
	}
	 this.hiddenBox = function(){
		window.document.body.removeChild(this.box);
	}
	this.btnClose = function(){
		var theBox = this.box;
		var obtn = document.getElementById("btnCloseWindow");
		obtn.onclick = function(){
			var box = document.getElementById("windowTipId");
			var speed = 10;
			var timer = null;
			timer =  setInterval(function(){
				if(speed == 120){
					clearInterval(timer);
					window.document.body.removeChild(theBox);
				}
				speed+=10;
				box.style.bottom = "-"+speed+"px";
				
			},30)
			
		}
	}
	this.showBox = function(){
		
		window.document.body.appendChild(this.createWindow());
		this.btnClose();
		var theBox = this.box;
		var box = document.getElementById("windowTipId");
		var startSpeed = -120;
		var startTimer = null;
		 startTimer = setInterval(function(){

			if(startSpeed == 0){
				var theTime = null;
				clearInterval(startTimer);
				if(flag){
						theTimer = setInterval(function(){
							clearInterval(theTimer);
							var box = document.getElementById("windowTipId");
							var speed = 10;
							var timer = null;
							timer =  setInterval(function(){
								if(speed == 120){
									clearInterval(timer);
									window.document.body.removeChild(theBox);
								}
								speed+=10;
								box.style.bottom = "-"+speed+"px";
								
							},30)
						},4000);
					}else{
						
						clearInterval(theTimer);
				
					}
			}else{
				startSpeed+=10;
				box.style.bottom = startSpeed+"px";
			}
		},30);
		
	}
	

}