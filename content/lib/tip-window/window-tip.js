//var timer = null;
function creatWindow(text,isHade,timeout){
	if($("body").find("div#windowId")){
		$("#windowId").remove();
	}
	var str = "";
	str += "<div id='windowId' style='width:230px;height:120px;background:#FFFFFF;position:fixed;bottom:-120px;right:10px;box-shadow: 0px 0px 5px #000000;z-index:10000000'>";
	str +="<div style='width:230px;height:20px;text-align:right;padding-right:10px;padding-top:1px;background:#2D3B55;'><a href='javascript:void(0)' id='btnCloseAlarm' style='color:#FFFFFF'>X</a></div>";
	str +="<div style='width:230px;height:100px;line-height:100px;font-size:18px;text-align:center'>";
	str += text;
	str +="</div></div>";	
	
	this.showWindow =  function(){
//		clearTimeout(timer);
		$(".all-div").append(str);
		$("#windowId").animate({"bottom":"1px"},300);
		if(isHade){
//			timer = 
			setTimeout(function(){
				$("#windowId").animate({"bottom":"-124px"},300,function(){
					$("#windowId").remove();
				});
			},timeout);
		}
		$("#btnCloseAlarm").click(function(){
			$("#windowId").animate({"bottom":"-124px"},300,function(){
				$("#windowId").remove();
			});
		})
	}
//	this.hideWindow =function(){
//		$("#windowId").remove();
//	}
}
function creatSureWindow(text,funcName){
	if($("body").find("div#sureWindow")){
		$("#sureWindow").remove();
	}
	var screenWidth =document.body.clientWidth;
	var left = (screenWidth-360)/2+"px";
//	left = left/screenWidth*100+"%";
	var str = "";
	
	str +="<div id='sureWindow' style='position:absolute;top:190px;left:"+left+";width:360px;height:150px;background:#FFFFFF;z-index:10000000;box-shadow: 0px 0px 5px #000000;display:none'>";
	str +="<div style='width:360px;height:25px;background:#666666;cursor:move' id='midWindowTop'><div  style='margin-left:330px;padding-top:3px;cursor:pointer;color:#FFFFFF' id='btnMidClose'>X</div></div>";
	str +="<div style='width:360px;height:85px;line-height:60px;text-align:center;font-size:20px;'>";
	str += text;
	str +="</div>"
	str +="<div style='width:100%;text-align:center'><button type='button' id='btnSure' class='btn btn-success'>确定</button>";
	str +="<button type='button' id='btnHidden' style='margin-left:10px'  class='btn btn-success'>取消</button></div>";
	str +="</div>";
	$(".all-div").append(str);
	
	this.showWindow =  function(){
		$("#sureWindow").css("display","block");
		
	}
	$("#btnSure").click(function(){
		$("#sureWindow").remove();
		eval("("+funcName+")");
		return true;
	})

	$("#btnHidden").click(function(){
		$("#sureWindow").remove();
		
	})
	$("#btnMidClose").click(function(){
		$("#sureWindow").remove();
	})
	 $('#midWindowTop').mousedown(  
            function (event) {  
                var isMove = true;  
                var abs_x = event.pageX - $('#sureWindow').offset().left;  
                var abs_y = event.pageY - $('#sureWindow').offset().top;  
                $(document).mousemove(function (event) {  
                            if (isMove) {  
                                var obj = $('#sureWindow');  
                                obj.css({'left':event.pageX - abs_x, 'top':event.pageY - abs_y});  
                            }  
                        }  
                ).mouseup(  
                        function () {  
                            isMove = false;  
                        }  
                );  
            }  
    );  
  
}