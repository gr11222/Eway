
function loadingStart(boxId,height){
	var theHeight ="height:" +height+";";
	var str = "";
	str += "<div id='loadingStart' style='position:absolute;width:100%;"+theHeight+"background:rgba(255,255,255,0);top:0px;left:0px'>";
	str += "<div style='position:relative;width:100%;top:40%;text-align:center'>";
	str += "<img src='../../lib/setLoading/loading2.gif'/>";
	str += "</div>";
	str += "</div>";
	$("#"+boxId).append(str);
}
function loadingRemove(){
	$("#loadingStart").remove();
}