/*
 * 数据格式为固定：例如：
 * 	 treeData = [   
    {"id":1,"pId":0,"name":"test1","pic":"aa"},   
    {"id":11, "pId":1,"name":"test11","pic":"bb"},   
    {"id":111,"pId":11, "name":"test111","pic":"cc"},   
    {"id":12, "pId":1, "name":"test12","pic":"dd"},  
    {"id":2,"pId":0, "name":"节点二","pic":"gg"},   
    {"id":33, "pId":2, "name":"子节点","pic":"hh"}
	];   
 * 使用方法：
 * 	 1.var tree = new createTree("myTree",zTreeNodes,nodeClick,true);
	 2.tree.showTree();
 * 注：
 *   1、nodeClick 为点击树的时间函数名称
 *   2、前端使用复选框的时候，返回被选中的节点的数据函数（改函数返回节点信息）是：
 * 	即只需要在前端用一个变量接收就可以。例如：
 * function zTreeOnCheck(){  -----------------(此函数名称是固定的)
 * var nodes = getCheckNodeInfo(“包含树的id”);
 * 	 nodes是 返回的树节点数据；
 * }
 * 	3.前端点击事件，通过函数返回节点信息，点击事件的函数名称为nodeClick
 * 返回节点信息的函数为 getSelectNodeInfo("包含树的容器id");
 * 例如：
 * function nodeClick(){
		var a = getSelectNodeInfo("boxid");
		a是返回点击该节点的所有信息
	}
 * 
 *   4.默认选中第一个节点
 * 前端需要调用：defaultSelectFirstNode（“包含树容器的ID”，“第一个节点的id”）；
 * 
 */
/*
 * 注意使用时候要引入:
 * 1、zree/css/zTreeStyle/zTreeStyle.css
 * 2、引入1.4版本以上的jquery
 * 3、jquery.ztree.core-3.5.min.js
 * 4、jquery.ztree.excheck-3.5.min.js  --------使用复选框时候引入
 */
var check_data;
var box_id ="";

//遍历JSON数据生成树节点数据treeData

function treeDataBulid(JSONObj){
	
	this. createJsonData = function(parentID,childID){
		var dataJson = setJson(null,"id",childID);
			dataJson = setJson(dataJson,"pId",parentID);
			dataJson = setJson(dataJson,"name",childID);
			return dataJson;
	}

	var zTreeNodes = "[";
	for(var i in JSONObj){
		var childData = [];
		zTreeNodes +=createJsonData(JSONObj[i]["groupName"],JSONObj[i]["groupName"])+",";
		if(JSONObj[i]["children"].length<1){
			continue;
		}
		for(var j in JSONObj[i]["children"]){
			childData.push(JSONObj[i]["children"][j]);
			zTreeNodes +=createJsonData(JSONObj[i]["groupName"],childData[j])+",";
		}
	}
	zTreeNodes = zTreeNodes.substring(0,zTreeNodes.length-1)+"]";
	zTreeNodes = eval("("+zTreeNodes+")");
	return zTreeNodes;
}

/*
 boxID:承载树的ID
 treeData:建立树的JSON数据
 nodeClick：点击的回调函数
 ischeck：是否有复选框; true：有，false：无

 * */
function createTree(boxID,treeData,nodeClick,ischeck)
{
	box_id = boxID;
	var isCheckInner = false;
	if(ischeck != undefined)
	{
		isCheckInner = ischeck;
	}
	
	//设置树的显示
	this.setting={
		view: {
			showLine:true,//不显示树的连接线
			autoCancelSelected: false,//点击节点时，按下 Ctrl 或 Cmd 键是否允许取消选择操作。
			selectedMulti: false,//是否允许同时选中多个节点
			dblClickExpand: true,
		},
	//定义数据格式
		data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
				}
		},	
		//设置是否显示复选框
		check:{
				enable : isCheckInner ,
		},
		//设置回调函数
		callback: {
			beforeClick:funBeforeClick,//点击前的函数 如果返回false 禁止点击节点 如果返回true 可以点击节点
			onCheck: zTreeOnCheck,//zTreeOnCheck,
			onClick:nodeClick,
		},
		
	};
	this.checkValue = function(){
		return zTreeOnCheck;
	};
	
	this.showTree = function(){
		 $.fn.zTree.init($("#"+boxID), this.setting, treeData);
	};
	this.defaultSelectFirstNode =function (boxID,treeNodeId){
	    var treeObj = $.fn.zTree.getZTreeObj(boxID);
	   selected_node = treeObj.getNodeByParam("id", treeNodeId);
	   treeObj.selectNode(selected_node,false);
	};
	this.disabelNode = function(){
		
		var treeObj = $.fn.zTree.getZTreeObj(boxID);
		var nodes = treeObj.getNodes();
		for(var i = 0; i < nodes.length;i++)
		{
			for(var j =0;j<nodes[i].children.length;j++)
			{
			
					treeObj.setChkDisabled(nodes[i].children[j], true);
			}
			
		}
	}
	//禁用某级节点， 分为1-3级；当num =0时候 禁用二级和三级节点；当num= 1 的时候 禁用一级和三级节点； 当 num= 2 的时候，禁用一级和二级节点
	this.disabelNode = function(num){
		
		var treeObj = $.fn.zTree.getZTreeObj(box_id);
		var nodes = treeObj.getNodes();
		switch(num)
		{
			case 0 :
				for(var i = 0;i<nodes.length;i++)
				{
					
					for(var j =0;nodes[i].children!= undefined && j<nodes[i].children.length;j++)
					{
						treeObj.setChkDisabled(nodes[i].children[j],true);
						for(var m = 0;nodes[i].children[j].children!= undefined && m < nodes[i].children[j].children.length;m++)
						{
							treeObj.setChkDisabled(nodes[i].children[j].children[m],true);
						}
					}
				}
				break;
			case 1 :
				for(var i = 0;i<nodes.length;i++)
				{
//					treeObj.setChkDisabled(nodes[i],true);
					for(var j =0;nodes[i].children!= undefined && j<nodes[i].children.length;j++)
					{
						for(var m = 0;nodes[i].children[j].children!= undefined && m <nodes[i].children[j].children.length;m++)
						{
							treeObj.setChkDisabled(nodes[i].children[j].children[m],true);
						}
					}
					
				}
				break;
			 case 2:
			 for(var i = 0;i<nodes.length;i++)
				{
//					treeObj.setChkDisabled(nodes[i],true);
					for(var j =0;nodes[i].children!= undefined && j<nodes[i].children.length;j++)
					{
//						treeObj.setChkDisabled(nodes[i].children[j],true);
					}
				}
				break;
		}
	}
}
//获得点击节点的信息
function getSelectNodeInfo(boxId){
		var treeObj = $.fn.zTree.getZTreeObj(boxId);
		var nodes = treeObj.getSelectedNodes();  //获得所点击的节点的信息
		var nodeInfo = nodes[0];//节点所有信息的JSON串
		return nodeInfo;
}
//获得选中节点的信息（复选框）
function getCheckNodeInfo(boxId){
	var treeObj = $.fn.zTree.getZTreeObj(box_id);
	var nodes = treeObj.getCheckedNodes(true);
	return nodes;
}
function getCheckNodeInfoLevel(boxId,num){
	var treeObj = $.fn.zTree.getZTreeObj(box_id);
	var nodes = new Array();
	switch(num)
	{
		case 0 :
			nodes = treeObj.getCheckedNodes(true);
			break;
		case 1 :
			var nodesAll = treeObj.getCheckedNodes(true);
			for(var i = 0;i<nodesAll.length;i++)
			{
				if(nodesAll[i].level==0){
					continue;
				}
				nodes.push(nodesAll[i]);			
			}
			break;
		case 2:
		 	var nodesAll = treeObj.getCheckedNodes(true);
		 	for(var i = 0;i<nodesAll.length;i++)
			{
				if(nodesAll[i].level==0||nodesAll[i].level==1){
					continue;
				}
				nodes.push(nodesAll[i]);
			}
			break;
	}
	return nodes;
}

function getParentNode(boxid){
	var treeObj = $.fn.zTree.getZTreeObj(boxid);
	var sNodes = treeObj.getCheckedNodes();
	var node = new Array();
	if (sNodes.length > 0) {
		for(var i = 0 ;i<sNodes.length;i++){
			node.push(sNodes[i].getParentNode());
		}
		
	}
	return node;
}

function getParentNodeLevel(boxid,num){
	var treeObj = $.fn.zTree.getZTreeObj(boxid);
	var sNodes = getCheckNodeInfoLevel(boxid,num);
	var node = new Array();
	if (sNodes.length > 0) {
		for(var i = 0 ;i<sNodes.length;i++){
			node.push(sNodes[i].getParentNode());
		}
		
	}
	return node;
}



