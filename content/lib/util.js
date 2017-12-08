function StringBuffer()
{
	this.__strings__ = [];
};    
StringBuffer.prototype.append = function(str)
{
	this.__strings__.push(str);
};
StringBuffer.prototype.toString = function()
{
	return this.__strings__.join('');
};
StringBuffer.prototype.clearBuffer = function()
{
	return this.__strings__ = [];
};

function request(paras)
{ 
	var url = location.href; 
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
	var paraObj = {} 
	for (i=0; j=paraString[i]; i++)
	{ 
		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
	} 
	var returnValue = paraObj[paras.toLowerCase()]; 
	if(typeof(returnValue)=="undefined")
	{ 
		return ""; 
	}
	else
	{ 
		return returnValue; 
	} 
} 
 
function addZero(i)
{
	if(i<10)
		return "0" + i;
}
 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //?
        "h+": this.getHours(), //�小时 
        "m+": this.getMinutes(), //?
        "s+": this.getSeconds(), //�?
        "q+": Math.floor((this.getMonth() + 3) / 3), //�季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function AlertWindow(titleTip,content) {
    var modal = "<div class='modal hide' id='modalAlert' style='width: 380px;height:170px; margin-top:-100px; left:770px'><div class='modal-header' style='padding-top: 0px;height: 20px;'>\
				<h6 style='color: #000; padding-top:10px' class='wintip'>"+titleTip+"</h6></div>\
            <div class='modal-bodys' style='font-size: 18px;text-align:center;color:#000;padding-top:30px;height:40px'><p>";
    modal += content;
    modal += "</p></div>\
			<div class='modal-footer' style='height: 20px; margin-top:20px'>\
			    <a class='btn btn-primary' data-dismiss='modal'>确定</a>\
			</div>\
		</div>";
		
		if ($('#modalAlert').length > 0) {
			$('.wintip').html("<h6 style='color: #000;'>"+titleTip+"</h6>");
		    $('.modal-bodys').html("<p>" + content + "</p>");
		}
		else {
		    $('body').append(modal); 
		}
		
		$('#modalAlert').modal({
		    backdrop: false,
            keyboard: true
        });
}


function ConfirmWindow(confirmMessage,certainFunc) {
    var modal = "<div class='modal hide' id='modalConfirm' style='width: 320px;height:170px; margin-top:-100px; left:800px'><div class='modal-header' style='padding-top: 0px;height: 20px;'>\
				<h4 style='color: #000; padding-top:5px; font-weight:bold; font-family:Microsoft YaHei;'  class='wintip'>提醒</h4></div>\
            <div class='modal-bodys' id='madalBody' style='font-size: 18px;text-align:center;color:#000;padding-top:30px;height:40px'><p>";
    modal += confirmMessage;
    modal += "</p></div>\
			<div class='modal-footer' style='height: 20px; margin-top:20px'>\
			    <a class='btn btn-primary' data-dismiss='modal' id='okBtn'>确定</a>\
			    <a class='btn btn-primary' data-dismiss='modal' id='cancleBtn'>取消</a>\
			</div>\
		</div>";
		if ($('#modalConfirm').length > 0) {
		    $('#madalBody').html("<p>" + confirmMessage + "</p>");

		}
		else {

		    $('body').append(modal);

		}
		 $('#okBtn').click(function(){
	    		certainFunc();
	    		$('#okBtn').unbind();
	    	});
		 $('#cancleBtn').click(function(){
	    		$('#okBtn').unbind();
	    });

    $('#modalConfirm').modal({
		    backdrop: false,
            keyboard: true
        });
	
}


