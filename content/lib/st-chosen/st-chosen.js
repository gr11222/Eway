

var index = 0;
var idArr = [];
function stChosen(myStr,arr){
		if(arr.length <1){
			return;
		}
		
		if(idArr.length == 0){
			idArr.push(myStr);
		}
		else{
			for(var i = 0; i<idArr.length;i++){
				if(idArr[i] != myStr){
					
					idArr.push(myStr);
				}
				

			}
		}
		
		
		
		var inPut = document.getElementById(myStr);
		var parentContent = inPut.parentNode;
		var parentId = inPut.parentNode.id;
		var parentObj = document.getElementById(parentId);
		for(var i = 0;i<parentObj.childNodes.length;i++){
			if(parentObj.childNodes[i].theList !=undefined){
				parentObj.removeChild(parentObj.childNodes[i])
			}
			
		}
		//创建新的容器
		var newContent = document.createElement("div");
		newContent.id="chosenContent"+index;
		newContent.theList = "contentList";
		newContent.style.maxHeight = "150px";
		newContent.style.overflow = "auto";
		newContent.style.width = inPut.style.width;
		newContent.style.borderWidth="1px";
		newContent.style.borderStyle="solid";
		newContent.style.borderColor="#CCCCCC";
		newContent.style.backgroundColor="#FFFFFF";
		newContent.style.position="absolute";
		newContent.style.zIndex="20000000";
		inPut.index = index;
		var str ="";
		for(var i = 0; i< arr.length;i++){
			str +="<li style='height:25px;list-style:none;cursor:pointer;padding:3px 0px 2px 5px;color:#3C3C3C;'>"+arr[i]+"</li>";
		}

		newContent.innerHTML = str;
		parentContent.appendChild(newContent);
		newContent.style.display="none";
		var showFlag = false;
		
		inPut.onclick = function(e){
			
			for(var i = 0; i<idArr.length;i++){
				
				
				if(idArr[i] != this.id){
					
					var otherId = document.getElementById(idArr[i]).parentNode.id;
					var parentOBJ = document.getElementById(otherId);
				
					for(var j = 0 ;j < parentOBJ.childNodes.length;j++){
						if(parentOBJ.childNodes[j].theList !=undefined){
							parentOBJ.childNodes[j].style.display = "none";
						}
					}
					
				}
			}
		
           	var ev = e || window.event;
            if(ev.stopPropagation){
                ev.stopPropagation();
            }
            else if(window.event){
                window.event.cancelBubble = true;//兼容IE
            }
           document.onclick = function(){
	           newContent.style.display="none";
	        }

			var currentValue = this.value;
			if(currentValue == ""){
				newContent.style.display="block";
			}else{
				for(var i = 0;i< newContent.childNodes.length;i++)
				{
					if(newContent.childNodes[i].innerText.indexOf(currentValue) == 0){
						newContent.childNodes[i].style.display = "block";
					}else{
						newContent.childNodes[i].style.display = "none";
					}
					
				}
			if(showFlag){
				newContent.style.display="none";
			}else{
				newContent.style.display="block";
			}
			}
			
			for(var i = 0;i< newContent.childNodes.length;i++)
			{
				
				newContent.childNodes[i].onclick = function(){
					inPut.value = this.innerText;
					newContent.style.display="none";
				}
				newContent.childNodes[i].onmouseover = function(){
					
					this.style.backgroundColor = "#E6E6E6";
					this.style.color = "#2AABD2";
				}
				newContent.childNodes[i].onmouseout = function(){
					this.style.backgroundColor = "#FFFFFF";
					this.style.color = "#3C3C3C";
				}
			}
			
			inPut.onkeyup = function(){
				
				var theCtrlNum = 0;
				var theValue = this.value;
				if(theValue == ""){
					newContent.style.display="block";
					for(var i = 0;i< newContent.childNodes.length;i++)
					{
						newContent.childNodes[i].style.display = "block";
						
					}
				}else{
					for(var i = 0;i< newContent.childNodes.length;i++)
					{
						
						if(newContent.childNodes[i].innerText.indexOf(theValue) == 0)
						{
							newContent.style.display="block";
							newContent.childNodes[i].style.display = "block";
							
							
						}else{
							newContent.childNodes[i].style.display = "none";
							
						}
						if(newContent.childNodes[i].innerText.indexOf(theValue) == -1){
							theCtrlNum++;
						}else{
							showFlag = false;
						}
						
					}
					
				}
				if(theCtrlNum == newContent.childNodes.length){
					
					newContent.style.display="none";
					
					showFlag = true;
				}
			}
		}
		index+=1;
	}

