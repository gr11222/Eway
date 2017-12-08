function createLoading(oDiv,text){
	
	this.loadingDiv = {};
	this.loadCycle = {};
	this.tipText = {};
	this.speed = 80;
	this.timer = null;
	this.cycle_color = "#EF7D3A"//"#000000";3E99D2
	this.textColors =  "#ffffff";//"#000000";
	this.textInner = "正 在 加 载  ...";
	if(!text){
		this.textInner = "正 在 加 载  ...";
	}else{
		var str = "";
		for(var  i =0;i<text.length;i++){
			
			if(i == text.length-1){
				str+=text[i]+" . . .";
			}else{
				str+=text[i]+" ";
			}
		}
		this.textInner = str;
	}
//	if( || text !=""){
//		
//	}
	/*根据参数获得div对象*/
	this.oDiv = document.getElementById(oDiv);

	//获得父亲div的id
	// this.boxId = this.oDiv.id;
	// 创建黑幕
	this.createLoadBox = function(){
		
		for(var i = 0; this.oDiv.childNodes.length>0&&i<this.oDiv.childNodes.length;i++){
			if(this.oDiv.childNodes[i].name =="loadWindow"){
				return;
			}
		}
		this.loadingDiv = document.createElement("div");
		this.loadingDiv.style.width=$("#"+oDiv).width()+"px";
		this.loadingDiv.style.height=$("#"+oDiv).height()+"px";
		this.loadingDiv.style.backgroundColor = "#000000";
		this.loadingDiv.style.position = 'relative';
		this.loadingDiv.style.zIndex =300;
		this.loadingDiv.name ="loadWindow";
		var theHeight = parseInt($("#"+oDiv).height());
		this.loadingDiv.style.top = "-"+theHeight+"px";
		this.loadingDiv.style.top ="0px";
		this.loadingDiv.style.opacity = 0.8;
		this.loadingDiv.style.filter = "alpha(opacity=80)";
		return this.loadingDiv;
	}
	//创建圆圈面板
	this.createLoadTip = function(){
		var heights = $("#"+oDiv).height();//this.oDiv.style.height.substring(0,$("#"+oDiv).height()+"px".indexOf("px"));
		var theHeight =parseInt(heights)/2+40;
		var width =  $("#"+oDiv).width();//this.oDiv.style.width.substring(0,this.oDiv.style.width.indexOf("px"));
		var theLeft = (parseInt(width) -100)/2;
		this.loadCycle = document.createElement("div");
		this.loadCycle.style.width="100px";
		this.loadCycle.style.height="100px";
		this.loadCycle.name = "cycleRound";
		this.loadCycle.style.borderRadius = "50px";
		this.loadCycle.style.position = 'relative';
		this.loadCycle.style.zIndex =310;
		this.loadCycle.style.top = "-"+theHeight+"px";
//		this.loadCycle.style.top = "-400px";
		this.loadCycle.style.left = theLeft+"px";
		this.loadCycle.innerHTML = this.createCircly();
		return this.loadCycle;
	}
	//创建提示为本
	this.createTextDiv = function(){
		var heights =$("#"+oDiv).height()// this.oDiv.style.height.substring(0,this.oDiv.style.height.indexOf("px"));
		var theHeight =parseInt(heights)/2+20;
		this.tipText = document.createElement("div");
		this.tipText.style.width=$("#"+oDiv).width();
		this.tipText.style.height="30px";
		this.tipText.style.textAlign = "center";
		this.tipText.style.position = 'relative';
		this.tipText.style.zIndex =310;
		this.tipText.style.top = "-"+theHeight+"px";
		this.tipText.style.fontSize = "16px";
		this.tipText.style.color = this.textColors;
		this.tipText.style.fontFamily = "微软雅黑";
		this.tipText.style.fontWeight = "bold";
		this.tipText.innerHTML = this.textInner;
		return this.tipText;
	}
	this.createCircly = function(){
		var str = "";
		str+='<div style="width:10px;height:10px;position:absolute;border-radius:10px;left:45px;top:0px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:6px;height:6px;position:absolute;border-radius:4px;left:70px;top:6px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:8px;height:8px;position:absolute;border-radius:8px;left:84px;top:20px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:10px;height:10px;position:absolute;border-radius:10px;left:90px;top:40px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:12px;height:12px;position:absolute;border-radius:12px;left:85px;top:62px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:14px;height:14px;position:absolute;border-radius:14px;left:68px;top:78px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:15px;height:15px;position:absolute;border-radius:10px;left:45px;top:85px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:16px;height:16px;position:absolute;border-radius:16px;left:22px;top:78px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:17px;height:17px;position:absolute;border-radius:17px;left:4px;top:60px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:18px;height:18px;position:absolute;border-radius:18px;left:0px;top:35px;background:'+this.cycle_color+'"></div>';
		str+='<div style="width:19px;height:19px;position:absolute;border-radius:19px;left:15px;top:8px;background:'+this.cycle_color+'"></div>';
		return str;
	}
	//开始加载方法
	this.showLoading = function(){
//		$("#"+oDiv).append(this.createLoadBox());
		this.oDiv.appendChild(this.createLoadBox());
		this.oDiv.appendChild(this.createLoadTip());
		this.oDiv.appendChild(this.createTextDiv());
		
		for(var i = 0 ;i< this.oDiv.childNodes.length;i++){
			if(this.oDiv.childNodes[i].name == "cycleRound"){
				
				var theDiv = this.oDiv.childNodes[i];
				var theSpeed = 10;
				this.timer = setInterval(function(){
					if(theSpeed == 360){
						theSpeed = 0;
					}
					theDiv.style.transform="rotate("+theSpeed+"deg)";
					theDiv.style.webkitTransform="rotate("+theSpeed+"deg)";
					theDiv.style.msTransform="rotate("+theSpeed+"deg)";
					theDiv.style.oTransform="rotate("+theSpeed+"deg)";
					theDiv.style.mozTransform="rotate("+theSpeed+"deg)";
					theSpeed+=10;
					
				},this.speed)
			}
		}

	}
	//停止加载方法
	this.removeLoading = function(){
		clearInterval(this.timer);
		this.oDiv.removeChild(this.tipText);
		this.oDiv.removeChild(this.loadCycle);
		this.oDiv.removeChild(this.loadingDiv);
	}
	
}