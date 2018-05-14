/**
 * 刘彬俊 appframework 常用工具方法类  全局变量
 * 2015-5-15
 */

var allPanelToViewid = {}; //主要定义panel和viewid的对应关系，通过daohang.html进行动态加载变更


/**
 * ajax通用调用方法
 * 注意:url不能带任何参数,否则请求时cookie会失效.所有的参数都必须放在parm里,如parm['action']='save';
 */
function getAjax(type,url,parm,successfun,errorfun,dataType,async){
	// alert (document.cookie);
	if(!dataType || dataType==""){
		dataType = "json";
	}
	if(!async || async==""){
		async = "true";//默认为非同步
	}
	parm["phone_model"]=device_model;
	parm["phone_sdk"]=device_version;
	parm["phone_platform"]=device_platform;
	$.ajax({
		/*
		headers: {'Cookie' : document.cookie },
		xhrFields: {
            withCredentials: true
		},
		crossDomain: true,
		*/
        type : type, 
        timeout : 30*1000, //超时时间设置，单位毫秒
        //contentType: "application/json", 
        url : url+";jsessionid="+localStorage.getItem("jsessionid"), 
       	data: parm,
        dataType : dataType,
        async : async,
        //jsonp: "callback",
        success : function(json){
        	//alert (JSON.stringify(json));
        	//如果服务器重启,先执行单点登录,成功后将继续执行用户的请求
        	if(json.success=='true' && "jsessionid" in json){
		   		localStorage.setItem("jsessionid",json.jsessionid);
				getAjax(type,url,parm,
					function succ(json){
						successfun.apply(this,[json]);
					},
					function error(e){
						openalert("<div style='text-align:center'>数据获取失败(17)</div>");
					}
				);
        	}else{
            	successfun.apply(this,[json]);
        	}
        } ,
        error : function(XMLHttpRequest, textStatus, errorThrown){
        	//alert(url);
        	//alert(XMLHttpRequest.status);
        	//alert(XMLHttpRequest.readyState);
        	//alert(textStatus);
        	if(textStatus=='timeout'){//超时,status还有success,error等值的情况
        		$.mobile.loading( "hide" );
        		$("#tipinfo").html("服务器连接超时(01)");
				window.plugins.toast.showLongCenter('服务器连接超时(01)', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        	}else if (textStatus=="error"){
        		$.mobile.loading( "hide" );
        		openalert("<div style='text-align:center'>服务器连接出错(01)</div>");
            }else{
            	if (errorfun!=null){
            		errorfun.apply(this,[XMLHttpRequest, XMLHttpRequest.status, textStatus]);
            	}
            }
        	
        } 
    }); 	
	
}

/**
 * json方式访问服务器，同时也为了访问一次后，在后面某些地方可以直接通过服务器地址访问资源，比如图片列表，目前主要就用于登录用一次
 * @param type
 * @param url
 * @param parm
 * @param successfun
 * @param errorfun
 */
function getAjaxJsonp(type,url,parm,successfun,errorfun,async){
	parm["phone_model"]=device_model;
	parm["phone_sdk"]=device_version;
	parm["phone_platform"]=device_platform;
	if(!async || async==""){
		async = "true";//默认为非同步
	}
	//alert(url);
	$.ajax({
        type : type, //jquey是不支持post方式跨域的
        //contentType: "application/json", 
        timeout : 30*1000, //超时时间设置，单位毫秒
        url : url, 
       	data: parm,
       	async: async,
        dataType : "jsonp",
        jsonp: "callback",
        success : function(json){
        	//alert (JSON.stringify(json));
        	successfun.apply(this,[json]);
        } ,
        error : function(XMLHttpRequest, textStatus, errorThrown){ 
    		//alert(XMLHttpRequest.status);
        	//alert(XMLHttpRequest.readyState);
        	//alert(textStatus);
        	if(textStatus=='timeout'){//超时,status还有success,error等值的情况
        		$.mobile.loading( "hide" );
        		$("#tipinfo").html("服务器连接超时(02)");
				window.plugins.toast.showLongCenter('服务器连接超时(02)', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        	}else if (textStatus=="error"){
        		$.mobile.loading( "hide" );
        		openalert("<div style='text-align:center'>服务器连接出错(02)</div>");
            }else{
            	if (errorfun!=null){
            		errorfun.apply(this,[XMLHttpRequest, XMLHttpRequest.status, textStatus]);
            	}
            }
        	
        } 
    }); 	
  
}

/*
function saveAppdoc(type,url,parm,successfun,errorfun){
	if (url==null || url==""){
		url = saveDocUrl;
	}
	$.ajax({
        type : type, //jquey是不支持post方式跨域的
        contentType: "application/json", 
        url : url, 
       	data: parm,
        dataType : "jsonp",
        jsonp: "callback",
        success : function(json){
        	if (successfun!=null){
        		//自定义回调成功方法
        		successfun.apply(this,[json]);
        	}else{
        		$.ui.popup("<div style='text-align:center'>文档保存成功</div>");
        	}
        	
        } ,
        error : function(e){ 
        	if (errorfun!=null){
        		errorfun.apply(this,[e]);
        	}else{
        		$.ui.popup("<div style='text-align:center'>文档保存错误</div>");
        	}
        } 
    }); 	
}
*/
 /*-----------------视图标签页设置选中---------------------*/
function tabTopNav(e){	
	var li=document.getElementById('top_tab_ul').getElementsByTagName('li');	
	for (var i = 0; i <li.length; i++) {
		li[i].className = "";
	}				
	document.getElementById(e).className = "select";	
}


/*通过html5的本地会话存储方式进行页面间参数传递，key值定义为parm，数据为json格式*/
function setParm(json){
	sessionStorage.setItem("parm",JSON.stringify(json));//换成字符串存储
}
function setCustomerParm(key,json){
	sessionStorage.setItem(key,JSON.stringify(json));
}


/*通过html5的本地会话存储，获取传递参数，key定义为parm，并转换成json对象，提供通过json的key获取值*/
function getParmObj(){
	var jsonobj=eval('('+ sessionStorage.getItem("parm")+')');
	return  jsonobj;
}
function getParm(name){
	var jsonobj=eval('('+ sessionStorage.getItem("parm")+')');
	var value = jsonobj[name];
	//removeParm();
	return jsonobj[name];
	
}
function getCustomerParm(key){
	var jsonobj=eval('('+ sessionStorage.getItem(key)+')');
	return jsonobj;
}

function getCustomerParmValue(key,name){
	var jsonobj=eval('('+ sessionStorage.getItem(key)+')');
	var value = jsonobj[name];
	//removeCustomerParm(key);
	return jsonobj[name];
	
}


/*清空html5本地会话参数*/
function removeParm(){
	sessionStorage.removeItem("parm");
}
function removeCustomerParm(key){
	sessionStorage.removeItem(key);
}

/*获取url参数*/
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/*判断是否已经登录*/
function islogin(){
	if (localStorage.getItem("username")!=null && localStorage.getItem("username")!=""){
		return true;
	}else{
		return false;
	}
	
}

/*清空表单数据通用方法*/
function cleanForm(objs){
	var tagname;
	$.each(objs, function(index, obj){
		
		if ( $(obj).attr('clean')=="1"){
			tagname = $(obj)[0].tagName.toLowerCase();
			
			if (tagname=="label" || tagname=="form" || tagname=="td" || tagname=="ul" ||  tagname=="table"){
				$(obj).html("");
			}else if (tagname=="input"){
				if ($(obj).attr('type') == "radio" || $(obj).attr('type') == "checkbox"){
					obj.checked = false;
				}else{
					$(obj).val("");
				}
			}else if (tagname=="textarea"){
				$(obj).val("");
			}else if (tagname=="select"){
				$(obj).html("");
				$(obj).prev().html("&nbsp;");
			}
			
		}
		
	});
}


/*设置点击view的时候当前view的id*/
function setcurviewid(viewid){
	setCustomerParm("curviewid",{viewid:viewid});
	
}
/*设置点击menu的时候当前menu的id*/
function setcurmenuid(menuid){
	setCustomerParm("curmenuid",{menuid:menuid});
	
}
function setcurappid(appid){
	setCustomerParm("curappid",{appid:appid});
}
function setcurviewpage(viewpage){
	setCustomerParm("curviewpage",{viewpage:viewpage});
}
function getcurviewid(){
	var viewid = getCustomerParmValue("curviewid","viewid");
	return viewid;
}
function getcurmenuid(){
	var menuid = getCustomerParmValue("curmenuid","menuid");
	return menuid;
}
function getcurappid(){
	var appid = getCustomerParmValue("curappid","appid");
	return appid;
}
function getcurviewpage(){
	var viewpage = getCustomerParmValue("curviewpage","viewpage");
	return viewpage;
}

/**
 * 通用的显示图片列表
 */
function imglist(){
	$.mobile.changePage("view_imglist.html");	
}

/**
 * 通用的显示图片列表_离线
 */
function imglist_lx(docid){
	var parmjson = getParmObj();
	parmjson['docid'] = docid;
	setParm(parmjson);
	$.mobile.changePage("view_imglist_lx.html");	
}

/**
 * 打开某个图片的panel
 * @param fileid
 */
function openimg(fileid){
	var parmjson = getParmObj();
	parmjson['fileid'] = fileid;
	setParm(parmjson);
	$.ui.loadContent("#picture",false,false,"slide");
}

/**
 * 根据viewid打开视图
 * @param viewid
 * @param appid
 * @param panel
 */

function openview(viewid,appid,page){
	if(page==null||page==""||page=="null"){
		page = "view.html";
	}
	setcurviewid(viewid);
	setcurappid(appid);
	setcurviewpage(page);
	viewtype = "1";
	
	$.mobile.changePage(page, {  
	   // transition: "none" 
	});
}

/**
 * 从视图打开某个文档
 * @param appid
 * @param docid
 * @param panelid
 */
function openAppDoc(appid,docid,viewhtmlid){
	var parmjson = {appid:appid , docid:docid };
	setParm(parmjson);
	if (viewhtmlid!=""){
		curviewhtmlid = viewhtmlid;
	}
	
	$.mobile.changePage(apptopanel[appid]);	
}
/**
 * 以待办任务方式打开文档，可以处理流转
 * @param appid
 * @param docid
 * @param panelid
 */
function openFlowNoteDoc(appid,docid,noteid,viewhtmlid){
	//alert ("在"+panelid+"中打开文档appid="+appid+"  docid="+docid);
	var parmjson = {appid:appid , docid:docid ,noteid: noteid,flownote:'true'};
	setParm(parmjson);
	curviewhtmlid = viewhtmlid;
	$.mobile.changePage(apptopanel[appid]);	
}

/**
 * 设置当前打开的文档是否为待办任务处理状态
 * @param v  true false
 */
function setDocIsFlow(v){
	var parmjson = getParmObj();
	parmjson['flownote'] = v;
	setParm(parmjson);
}


/**
 * 新建文档
 * @param appid
 * @param panelid
 */
function newDoc(appid,viewhtmlid){
	//alert ("在"+panelid+"中新建文档appid="+appid);
	var parmjson = {appid:appid,docid:"" };
	setParm(parmjson);
	curviewhtmlid = viewhtmlid;
	$.mobile.changePage(apptopanel[appid]);
}


/**
 * 框架保存
 * @param docinfo 
 * @param fun 回调函数
 */
function saveAppDoc(docinfo,fun){
	openloading("正在保存...");
	getAjax("post",saveDocurl,{appdoc : JSON.stringify(docinfo)},
		function succ(json) {
			if (json.success=="true"){
				if (json.data.docid != null){
					docinfo['docid'] = json.data.docid;
				}
				if (json.data.pribean.noteid != null){
					docinfo.pribean['noteid'] = json.data.pribean.noteid;
				}
				
				if (fun!=null){
					fun.apply(this,[json])
				}else{
					openalert("<div style='text-align:center'>"+json.msg+"</div>");
					
				}
			}else{
				openalert("<div style='text-align:center'>"+json.msg+"</div>");
			}
			$.mobile.loading( "hide" );
			
		}, function error(e) {
			$.mobile.loading( "hide" );
			openalert("<div style='text-align:center'>文档保存错误</div>");
	});
	
}

var jump2PersonPage = false;//标识是否跳转到选人页面

/**
 * 处理服务器返回流程数据
 * @param json
 * @param processinfo
 */
function doflowservice(json,processinfo){
	if (json.flowkind=="flowsuccess"){ //流转成功
		
		var flowinfo = "文档已经发送给以下用户: ";
		var data = json.data.split("##");
		if (data.length>0){
			flowinfo = flowinfo + json.data.split("##")[0];
		}
		if (data.length>1 && $.trim(data[1])!=""){
			flowinfo = flowinfo + "<br>用户进行了委托:" ;
			flowinfo = flowinfo + json.data.split("##")[1];
		}
		$('<div>').simpledialog2({
		    mode: 'button',
		    headerText: '系统提示',
		    headerClose: false,
		    buttonPrompt: "<div style='text-align:center'>"+flowinfo+"</div>",
		    buttons : {
		      '关闭': {
		        click: function () {
		        	if(jump2PersonPage){history.back();jump2PersonPage=false;}
		        	$("#info_goback").click();		        	
		        }
		      }
		    }
		  });	
		
	}else if (json.flowkind=="selectnextflow"){ //选择流向
		var canChooseFlowOperations = json.canChooseFlowOperations;
		var html = '<fieldset data-role="controlgroup" ><div class="ui-controlgroup-controls" >';
		for (i=0;i<canChooseFlowOperations.length;i++){
			//html += '<li><input type="radio" id="selectnextflow_radio_'+i+'" name="selectnextflow_radio" value="'+canChooseFlowOperations[i].operationname+'" >'
			//+'<label for="selectnextflow_radio_'+i+'" style="float: none;width:100% " >'+canChooseFlowOperations[i].operationname+'</label></li>';
			html += '<input type="radio" id="selectnextflow_radio_'+i+'" name="selectnextflow_radio" value="'+canChooseFlowOperations[i].operationname+'" >'
			+'<label for="selectnextflow_radio_'+i+'" >'+canChooseFlowOperations[i].operationname+'</label>';
		}
		html += "</div></fieldset>";
		$('<div>').simpledialog2({
		    mode: 'button',
		    headerText: '选择流向',
		    headerClose: true,
		    buttonPrompt: html,
		    buttons : {
		      '确定': {
		        click: function () { 
		        	var selectnextflow = $('input[name="selectnextflow_radio"]:checked').val();
	   	         	if (selectnextflow==null || selectnextflow==""){
	   	         		openalert("<div style='text-align:center'>请选择流向</div>");
	   	         	}else{
	   	         		processinfo['choosedFlowOperation'] = selectnextflow;
	   	         		doSelectNextFlow(processinfo);
	   	         	}
		        }
		      },
		      '取消': {
		        click: function () {},
		        icon: "back",
		      }
		    }
		  });			
	}else if (json.flowkind=="selectpersons"){//选择人员
		var parmjson = getParmObj();
		parmjson['canChoosePersons'] = json.canChoosePersons;//参数传递给选择人员界面
		
		processinfo['choosedFlowOperation'] = json.choosedFlowOperation;
		processinfo['subtemplateid'] = json.subtemplateid;
		processinfo['choosedSubFlowOperation'] = json.choosedSubFlowOperation;
		processinfo['choosedFlowStatus'] = json.choosedFlowStatus;
		processinfo['choosedFlowType'] = json.choosedFlowType;
		processinfo['opflag'] = json.opflag;
		
		parmjson['processinfo'] = processinfo;
		setParm(parmjson);
		jump2PersonPage = true;
		$.mobile.changePage("html/flow_selectpersons.html");
	}else if (json.flowkind=="selectpersonsbytree"){//选择部门
		var parmjson = getParmObj();
		parmjson['canChooseOrganizations'] = json.canChooseOrganizations;//参数传递给选择部门界面
		processinfo['rolename'] = json.rolename;
		
		processinfo['choosedFlowOperation'] = json.choosedFlowOperation;
		processinfo['subtemplateid'] = json.subtemplateid;
		processinfo['choosedSubFlowOperation'] = json.choosedSubFlowOperation;
		processinfo['choosedFlowStatus'] = json.choosedFlowStatus;
		processinfo['choosedFlowType'] = json.choosedFlowType;
		processinfo['opflag'] = json.opflag;
		
		parmjson['processinfo'] = processinfo;
		setParm(parmjson);
		jump2PersonPage = true;
		$.mobile.changePage("html/flow_selectorgs.html");
	}else if (json.flowkind=="selectorgpersons"){//选择部门下人员
		var parmjson = getParmObj();
		parmjson['canChoosePersons'] = json.canChoosePersons;//参数传递给选择人员界面
		
		processinfo['choosedFlowOperation'] = json.choosedFlowOperation;
		processinfo['subtemplateid'] = json.subtemplateid;
		processinfo['choosedSubFlowOperation'] = json.choosedSubFlowOperation;
		processinfo['choosedFlowStatus'] = json.choosedFlowStatus;
		processinfo['choosedFlowType'] = json.choosedFlowType;
		processinfo['opflag'] = json.opflag;
		
		parmjson['processinfo'] = processinfo;
		setParm(parmjson);
		jump2PersonPage = true;
		$.mobile.changePage("html/flow_selectpersons.html");
	}else if (json.flowkind=="docfinished"){//文档办结
		
		$('<div>').simpledialog2({
		    mode: 'button',
		    headerText: '系统提示',
		    headerClose: false,
		    buttonPrompt: "<div style='text-align:center'>文档处理结束</div>",
		    buttons : {
		      '关闭': {
		        click: function () {
		        	if(jump2PersonPage){history.back();jump2PersonPage=false;}
		        	$("#info_goback").click();
		        }
		      }
		    }
		  });	
		
	}else if (json.flowkind=="notefinished"){//广播台内处理结束
		$('<div>').simpledialog2({
		    mode: 'button',
		    headerText: '系统提示',
		    headerClose: false,
		    buttonPrompt: "<div style='text-align:center'>任务处理完毕</div>",
		    buttons : {
		      '关闭': {
		        click: function () {
		        	if(jump2PersonPage){history.back();jump2PersonPage=false;}
		        	$("#info_goback").click();
		        }
		      }
		    }
		  });	
	}
}

/**
 * 流转
 * @param docinfo
 * @param valueinfo 表单保存的数据json格式
 * @param fun 回调函数
 
function doprocessflow(docinfo,valueinfo,fun){
	
	openloading("正在流转...");
	var processinfo = {};
	processinfo['docid'] = docinfo['docid'];
	processinfo['appid'] = docinfo['appid'];
	processinfo['noteid'] = docinfo.pribean['noteid'];
	processinfo['subject'] = docinfo.pribean['subject'];
	processinfo['value(subject)'] = docinfo.pribean['subject'];
	processinfo['templateid'] = docinfo.pribean['templateid'];
	processinfo['optype'] = "flow";
	
	for(var key in valueinfo){
		processinfo[key] = valueinfo[key];
	}
	
	getAjax("post",processFlowurl,processinfo,
		function succ(json) {
			$.mobile.loading( "hide" );
			if (json.success=="true"){
				if (fun!=null){
					fun.apply(this,[json])
				}else{
					doflowservice(json,processinfo);
				}
			}else{
				openalert("<div style='text-align:center'>"+json.msg+"</div>");
			}
		}, function error(e) {
			$.mobile.loading( "hide" );
			openalert("<div style='text-align:center'>文档流转错误...</div>");
	});
	
}*/
/**
 * 选择流向
 * @param selectnextflow
 */
function doSelectNextFlow(processinfo){
	getAjax("post",selectNextFlowurl,processinfo,
			function succ(json) {
				doflowservice(json,processinfo);
			},function error(e) {
				$.mobile.loading( "hide" );
				openalert("<div style='text-align:center'>文档流转错误...</div>");
	});
}

/**
 * 选择完人后流转
 * @param choosedPersons
 */
function doSelectPersons(choosedPersons){
	var processinfo = getParmObj().processinfo;
	processinfo['choosedPersons'] = choosedPersons;
	getAjax("post",selectFlowPersonsurl,processinfo,
		function succ(json) {
			doflowservice(json,processinfo);
		},function error(e) {
			$.mobile.loading( "hide" );
			openalert("<div style='text-align:center'>文档流转错误...</div>");
		}
	);
}

/**
 * 流程选择部门
 * @param choosedOrgs
 */
function doSelectOrgs(choosedOrgs){
	
	var processinfo = getParmObj().processinfo;
	processinfo['choosedOrganizations'] = choosedOrgs;
	
	getAjax("post",selectOrgFlowPersonsurl,processinfo,
		function succ(json) {
			doflowservice(json,processinfo);
		},function error(e) {
			$.mobile.loading( "hide" );
			openalert("<div style='text-align:center'>文档流转错误...</div>");
		}
	);
}

/**
 * 签字意见
 */
function dosignature(){
	var signature_textarea = "";
	if (docinfo.signature != null && docinfo.signature!=""){
		var sn = docinfo.signature;
		signature_textarea = sn.substring(0,sn.indexOf(localStorage.getItem("username")));
	}
	$('<div>').simpledialog2({
	    mode: 'button',
	    headerText: '您的意见',
	    headerClose: true,
	    buttonPrompt: "<textarea id='signature_textarea' rows='3'>"+signature_textarea+"</textarea>",
	    buttons : {
	      '确定': {
	        click: function () { 
	        	var signature = {noteid:getParmObj().noteid , signature:$("#signature_textarea").val()+"\r\n"+localStorage.getItem("username")+"  "+getNowTime()+"\r\n\r\n"};
	         	docinfo['signature'] = $("#signature_textarea").val()+"\r\n"+localStorage.getItem("username")+"  "+getNowTime()+"\r\n\r\n";
	         	savesignature(signature);
	        }
	      },
	      '取消': {
	        click: function () {},
	        icon: "back",
	      }
	    }
	  });		
}
/**
 * 保存流转意见
 * @param noteid
 * @param signature
 */
function savesignature(signature){
	//alert (signature);
	getAjax("post",signatureurl,signature,
			function succ(json) {
				$.ui.hideMask();
				if (json.success=="true"){
					
				}else{
					
				}
			}, function error(e) {
				$.mobile.loading( "hide" );
				openalert("<div style='text-align:center'>意见保存错误</div>");
			});
}

/**
 * 显示意见域
 * @param tabbleid
 * @param signaturelist
 */
function displaysignature(tableid,signaturelist){
	var html = "";
	for(var key in signaturelist){
		html += "<tr><td class='leftw'>"+key+"：</td>";
		html += "<td class='rightw'>"+signaturelist[key].replaceAll("\n", "<br/>") +"</td></tr>"
		
	}
	$("#"+tableid).html(html);
}

/**
 * 跳转到待办任务
 */
function gotoview_dbrw(){
	$("#view_caozuo").html("");
	$("#top_tab_div").css('display','none');
	$("#top_tab_ul").html("");
	$("#header_view_h").html("待办任务"); 
	
	openview("FC7C5F5E031C4DBF80FD8571CCF1A0E9","0AEAAB719A114AD491A6EB33A66BB251","view_dbrw");
	
}


/**
 * 视图搜索
 * @param searchhead
 * @param searchfield
 * @param searchdatatype
 * @param panel
 * @param id
 * @param funDown
 */
function viewsearch(searchhead,searchfield,searchdatatype,page,viewhtmlid){
	
	curviewhtmlid = viewhtmlid;
	var heads= searchhead.split(";");
	var fields= searchfield.split(";");
	var types= searchdatatype.split(";");
	
	var parmjson = getParmObj();
	parmjson['heads'] = heads;
	parmjson['fields'] = fields;
	parmjson['types'] = types;
	
	setParm(parmjson);
	
	if (page!=null && page!=""){
		$.mobile.changePage(page);
	}else{
		$.mobile.changePage("sys_sousuo.html");
	}
	
}

//序列化一个form，成jsonString的格式
function serializeFormToJsonString(aform) {
	var params = {};
	if (typeof(aform) == "string") {
		aform = document.getElementById(aform);
	}
	var els = aform.elements;
	 //遍历所有表元素
    for(var i = 0; i < els.length; i++) {
    	var el = els[i];
    	if (el.name && !el.disabled && (el.checked || /select|textarea/i.test(el.nodeName) || /date|text|hidden|password/i.test(el.type))) {
    		params[el.name] = el.value.replace(/\+/g,'%2B').replace(/&/g,'%26');
    	}
    }
    return params;
}