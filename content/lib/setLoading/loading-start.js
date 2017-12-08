

function loadingStart(boxId,height,bgcolor){
	var bg_color = "";
	if(bgcolor != undefined && bgcolor!= "")
	{
		bg_color = "background:"+bgcolor;
	}
	var theHeight ="height:" +height+";";
	var str = "";
	str += '<div class="loading-items" style="'+theHeight+bg_color+'" id="loadingStart">';
	str += '<div id="loading-items-center">';
	str += '<div id="loading-items-center-absolute">';
	str += '<div class="square" id="square_one"></div>';	
	str += '<div class="square" id="square_two"></div>';	
	str += '<div class="square" id="square_three"></div>';
	str += '<div class="square" id="square_four"></div>';	
	str += '<div class="square" id="square_five"></div>';	
	str += '<div class="square" id="square_six"></div>';
	str += '<div class="square" id="square_seven"></div>';	
	str += '<div class="square" id="square_eight"></div>';	
	str += '<div class="square" id="square_big"></div>';
	str += '</div>';
	str += '</div>';
	str += '</div>';
	$("#"+boxId).append(str);
}

function loadingRemove(){
	$("#loadingStart").remove();
}
