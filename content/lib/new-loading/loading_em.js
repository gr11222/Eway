var THEID = "";
function loadingStart(loadingDivId){
	THEID = loadingDivId;
	var str = "";
	var width = $("#"+loadingDivId).width()+"px";
	var height = $("#"+loadingDivId).height()+"px";
	var theTop = ($("#"+loadingDivId).height() - 210)/2 +"px";
	str += "<div class='startLoadingId' style='width:"+width+";height:"+height+";position:absolute;text-align:center;top:"+$("#"+loadingDivId).scrollTop()+"px;left:0px;background:rgba(255,255,255,1)'>";
	str += "<div style='position:relative;width:280px;height:210px;margin:0px auto;top:"+theTop+"'>";
	str += "<img src='../../lib/new-loading/loading4.gif' width='280' height='210' />";
	str += "</div>";
	str += "</div>";
	$("#"+loadingDivId).append(str);
}
function loadingStop(){
	$(".startLoadingId").remove();
}
// window.onload = function(){
// 	$("#startLoadingId").width($("#"));
// }
