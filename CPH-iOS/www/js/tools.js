
/**
 * 获取当前日期 格式2015-02-12
 * @returns {String}
 */
function getNowDate(){
	var date = new Date();
	var year = date.getFullYear();
	
	var month = date.getMonth()+1;
	if (month<10){
		month = "0"+month;
	}
	var day = date.getDate();
	if (day<10){
		day = "0"+day;
	}
	return year+"-"+month+"-"+day;
}
/**
 * 获取当前时间 格式2015-02-12 11:43:12
 * @returns {String}
 */
function getNowTime(showSeconds){
	var date = new Date();
	var year = date.getFullYear();
	
	var month = date.getMonth()+1;
	if (month<10){
		month = "0"+month;
	}
	var day = date.getDate();
	if (day<10){
		day = "0"+day;
	}
	var hour = date.getHours();
	if (hour<10){
		hour = "0"+hour;
	}
	var minute = date.getMinutes();
	if (minute<10){
		minute = "0"+minute;
	}
	var seconds = "";
	if(showSeconds){
		seconds = date.getSeconds();
		if (seconds<10){
			seconds = ":0"+seconds;
		}else{
			seconds = ":"+seconds;
		}
	}
	var time = year+"-"+month+"-"+day+" "+hour+":"+minute+seconds;
	return time;
}
/**
 * 获取唯一id
 * @returns
 */

function getUUID() {  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);  
        return v.toString(16);  
    });  
} 

/**
 * 全部替换
 * @param s1
 * @param s2
 * @returns
 */
String.prototype.replaceAll = function(s1,s2){ 
	return this.replace(new RegExp(s1,"gm"),s2); 
} 




/*
 * 相机相关js方法
 */
/**
 * 拍照
 */
var infoType='';
var func;
function paizhao(info_Type,docid,attachType,fun){
	if(docid!=null&&docid!=''){
		paizhao_docid = docid;
	}
	if(attachType!=null&&attachType!=''){
		paizhao_attachtype = attachType;
	}
	if(info_Type!=null){
		infoType = info_Type;
	}
	if(fun){
		func = fun;
    }
	var html = "<ul data-role='listview'>";
	html += "<li ><a onclick='paizhao_zx()'>手机拍照</a></li>";
	html += "<li><a onclick='paizhao_xc()'>从相册选择</a></li>";
	html += "</ul>";
	//alert (html);
	$('<div>').simpledialog2({
		mode: 'button',
		headerText: '选择照片来源',
		headerClose: true,
		buttonPrompt: html,
		buttons : {
			'返回': {
				click: function () {},
				icon: "back"
			}
		}
	});
}

function paizhao_zx(funSuccess){
	if(func!=null){
		funSuccess = func;
	}else if(funSuccess==null){
        alert("没有funSuccess");
		funSuccess = paizhao_Success;
//        alert(funSuccess);
	}
	$.mobile.sdCurrentDialog.close();
    capturePhoto(funSuccess,20,false,destinationType.FILE_URI);
}
function paizhao_xc(funSuccess){
	if(func!=null){
		funSuccess = func;
	}else if(funSuccess==null){
		funSuccess = paizhao_Success;
	}
	$.mobile.sdCurrentDialog.close();
	getPhoto(funSuccess,20,false,destinationType.FILE_URI,pictureSource.PHOTOLIBRARY);
}

function onPhotoDataFail(message){
	alert('拍照失败: ' + message);
}
 
// “Capture Editable Photo”按钮点击事件触发函数 
function capturePhoto(onPhotoSuccess,quality,allowEdit,destinationType) { 
     // 使用设备上的摄像头拍照，并获得Base64编码字符串格式的可编辑图像   destinationType.DATA_URL  destinationType.FILE_URI
     navigator.camera.getPicture(onPhotoSuccess, onPhotoDataFail, { quality: quality, allowEdit: allowEdit , destinationType: destinationType});
}

//“From Photo Library”/“From Photo Album”按钮点击事件触发函数
function getPhoto(onPhotoSuccess,quality,allowEdit,destinationType,source) { 
	//source:pictureSource.PHOTOLIBRARY
     navigator.camera.getPicture(onPhotoSuccess, onPhotoDataFail, { quality: quality,  destinationType: destinationType,sourceType: source }); 
} 
function picwin(r) {
	//navigator.notification.progressStop();
	$.mobile.loading( "hide" );
	openalert("<div style='text-align:center'>照片上传成功</div>");
}

function picfail(error) {
	/*
      FileTransferError.FILE_NOT_FOUND_ERR：1 文件未找到错误。
     •FileTransferError.INVALID_URL_ERR：2  无效的URL错误。
     •FileTransferError.CONNECTION_ERR：3  连接错误。
     FileTransferError.ABORT_ERR = 4;  程序异常
     */
       var errorcode=error.code;
       var errstr="";
       switch (errorcode)
       {
           case 1:
           {
              errstr="错误代码1：源文件路径异常，请重新选择或者拍照上传！";
               break;
           }
           case 2:
           {
               errstr="错误代码2:目标地址无效,请重试！";
               break;
           }
           case 3:
           {
               errstr="您手机或者后台服务器网络异常,请重新上传！";
               break;
           }
           default :
           {
               errstr="程序出错";
               break;
           }

       }
       //navigator.notification.progressStop();
       $.mobile.loading( "hide" );
       openalert("<div style='text-align:center'>上传失败,错误代码:"+errstr+"上传源文件:"+error.source+"目标地址:"+error.target+"请重新上传！</div>");
   }

//显示上传进度
function showUploadingProgress( progressEvt ){
	if( progressEvt.lengthComputable ){
		openloading("上传中 "+Math.round( ( progressEvt.loaded / progressEvt.total ) * 100)+"%");
		//navigator.notification.progressValue( Math.round( ( progressEvt.loaded / progressEvt.total ) * 100) );
    }
}
/**
 * 上传照片
 * @param lx
 * @param docid
 * @param appid
 * @param uploadimgsuccess
 * @param uploadimgfail
 * @param tsxx 提示信息
 * @param showprogrecess 是否显示进度条
 */
function uploadImg(imageData,lx,docid,appid,attachtype,uploadimgsuccess,uploadimgfail,tsxx,showprogrecess){
    alert("上传照片方法");
	var options = new FileUploadOptions();
  	alert("1");
    options.fileKey="file";
    options.fileName=imageData.substr(imageData.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    alert("2");
 	var ft = new FileTransfer(); 
    var url = uploadfileurl+"?lx="+lx+"&docid="+docid+"&appid="+appid+"&infoType="+infoType+"&attachtype="+attachtype;
    if(showprogrecess){
       	ft.onprogress = showUploadingProgress;
        //navigator.notification.progressStart("", "当前上传进度");
    }
    alert("3");
    if (uploadimgsuccess==null){
    	uploadimgsuccess = picwin;
    }
    alert("4");
    if (uploadimgfail==null){
    	uploadimgfail = picfail;
    }
    alert("5");
//    alert (imageData);
    ft.upload(imageData, url, uploadimgsuccess, uploadimgfail, options);
    alert("6");
}

//允许电脑浏览器上下滚动，否则超过1个页面就不能往下拉了
function pcwindowScroll(){
	if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)) {
	   var script = document.createElement("script");
	   script.src = "plugins/af.desktopBrowsers.js";
	   var tag = $("head").append(script);
	   //$.os.desktop=true;
	}
}

/**
 * jqm加载画面
 * @param text
 */
function openloading(text){
	$.mobile.loading( "show", {
        text: text,
        textVisible: true,
        theme: "b",
        textonly: false,
        html: ""
	});
}

/**
 * jqm模拟alert的插件方法
 * @param text
 * @param title
 */
function openalert(text,title){
	$('<div>').simpledialog2({
	    mode: 'blank',
	    headerText: title || "系统提示",
	    headerClose: true,
	    blankContent :  text+"<a rel='close' data-role='button' href='#'>关闭</a>"
	})
}

function hasClass(obj, cls) { 
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}  
  
function addClass(obj, cls) {  
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}  
  
function removeClass(obj, cls) {  
    if (hasClass(obj, cls)) {  
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
        obj.className = obj.className.replace(reg, ' ');  
    }  
}  

function toggleClass(obj,cls){  
    if(hasClass(obj,cls)){  
        removeClass(obj, cls);  
    }else{  
        addClass(obj, cls);  
    }  
}  