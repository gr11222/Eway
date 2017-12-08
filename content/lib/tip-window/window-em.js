
var timer = null;
function windowStart(theText,isHide){

//	clearInterval(timer);
//	timer = null;
	$("#tipWindowBox").remove();
	var str = "";
	str += "<div id='tipWindowBox' style='z-index:100000;width:220px;height:140px;position:fixed;right:10px;bottom:-160px;background:#FFFFFF;border-top-left-radius:5px;border-top-right-radius:5px;border:1px solid #CCCCCC'>";
	str += "<div style='width:100%;height:30px;background:#3399DB;position:relative;border-top-left-radius:5px;border-top-right-radius:5px;'>";
	str += "<div style='position:absolute;left:10px;width:100px;height:30px;line-height:30px;font-size:14px;font-weight:bold;color:#FFFFFF'>系统提示</div>";
	str += "<div id='boxClose' style='position:absolute;right:10px;height:30px;line-height:30px;font-size:14px;font-weight:bold;cursor:pointer;color:#FFFFFF'>x</div>";
	str += "</div>";
	str +="<div style='width:100%;height:114px;padding:10px;font-size:16px;'>"+theText+"</div>";
	
	str += "</div>";
	
	str += "</div>";
	$("body").append(str);
	
	$("#tipWindowBox").animate({bottom:"0px"},300);
	
	if(isHide){
//		clearInterval(timer);
//		timer = null;
//		timer = setInterval(function(){
//			$("#tipWindowBox").animate({bottom:"-160px"},300,function(){
//				windowRemove();
//			});
//		},3000);
		setTimeout(function(){
			$("#tipWindowBox").animate({bottom:"-160px"},300,function(){
				windowRemove();
			});
		},3000);
	}
	$("#boxClose").click(function(){
	
		$("#tipWindowBox").animate({bottom:"-160px"},300,function(){
			windowRemove();
		});
	})
}

function windowRemove(){
	$("#tipWindowBox").remove();
}
