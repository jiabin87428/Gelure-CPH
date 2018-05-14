/**全局变量**/
/*--------------------全局变量-----------------------------*/
//var domain = "192.168.1.106/ab3";
var domainip = "";
var domain = "";
//var servername = "aqscbzh3";//项目名称
var servername = "";//项目名称

if (localStorage.getItem("domain")!="" && localStorage.getItem("domain")!=null){
	domain = localStorage.getItem("domain");
	setDomain(domain);
}

var version = "-1";
var appname = "aqbzh3client.apk";
var qydz_default = "http://112.124.14.5/gehs";
var isnewversion = false;
var isOffLine = "0";//默认无离线模式
var Phonegap_NeedCertCode = "false";//默认不需要验证码
var curevent ;

var serverhtml;		//服务器上页面目录
var versionurl;		//获取服务器版本 
var newappurl;		//获取服务器版本 
var dengluurl;		//登录地址
var menuurl;		//菜单地址
var jpushurl;       //极光推送ID地址

var mainurl;		//主页
var openurl;		//ajax打开连接的url
var viewurl;		//视图
var uploadfileurl;	//文件上传
var smallpicurl;	//小图片下载地址自己后面加参数filetype=small720&fileid
var downloadfileurl;//附件下载地址
var saveDocurl;		//非流程表保存地址
var openAppDocurl;	//打开或新建框架表单（包含流程）
var openFlowDocurl;	//待办任务打开
var processFlowurl;	//流转
var selectNextFlowurl;		//选择流向
var selectFlowPersonsurl;	//选择流转人员
var selectPersonsurl;	//选择流转人员
var selectOrgFlowPersonsurl;//选择流转部门

var signatureurl;	//流转意见保存

var dwjcurl;		//点位检查
var dwjcurl1;		//点位检查
var yhzgurl;		//隐患整改
var dataurl;		//首页信息
var lxdwjcurl;		//离线点位检查

var certcodeurl;	//验证码

var canGoback = true;

var page_info_type = "";
var page_info_func1 = null;
var page_info_func2 = null;
var page_info_func3 = null;
var page_info_func1_args = [];
var page_info_func2_args = [];
var page_info_func3_args = [];
//设备的高和宽
var winHeight;
var winWidth;
if(!winHeight){
	if (window.innerWidth){
		winWidth = window.innerWidth;
	}else if ((document.body) && (document.body.clientWidth)){
		winWidth = document.body.clientWidth;
	}
	if (window.innerHeight){
		winHeight = window.innerHeight;
	}else if ((document.body) && (document.body.clientHeight)){
		winHeight = document.body.clientHeight;
	}

    localStorage.setItem("winWidth",winWidth);
    localStorage.setItem("winHeight",winHeight);
    
	// 通过深入 Document 内部对 body 进行检测，获取窗口大小
	if (document.documentElement && document.documentElement.clientHeight  && document.documentElement.clientWidth){
		winHeight = document.documentElement.clientHeight;
		winWidth = document.documentElement.clientWidth;
	}
}
//设备信息{"platform":"Android","model":"MI 4W","uuid":"77f33147825de6af","manufacturer":"Xiaomi","version":"4.4.4"}
var device_platform;
var device_version;
var device_productname;
var device_model;
var device_uuid;
var device_manufacturer;
var device_sdk;

/*--------------------全局变量结束---------------------------*/

var docinfo;//表单文档信息，每次打开表单后进行加载，保存时也从这个变量里进行整理提交
var viewtype = "";//打开视图还是搜索视图 的判断符号 1为正常打开视图 2为搜索打开的视图 区分视图打开内容
var searchtext = {};//视图搜索条件 配合viewtype使用 
//var searchFunDown;
var curviewhtmlid;//用于文档打开时记录视图的html的id，以便某些操作返回时需要刷新视图list
var currefviewfun;//用于非通用视图时，进行下拉刷新整个视图数据的方法
/*-----------------用于appid和panel对应的关系----------------------*/
var apptopanel = {
		"E45FFBBEC8C94B3CA3D453389AFD83C6" : "form_yhzg.html",
		"3BF93BBEF4BE418C86BD5C58DC2FAF01" : "form_dwjc.html",
		"BA6A2DAB0CC4406B9935DFA24D72B120" : "form_xwgl.html",
		"96AC0FBC81D84BB8B8A612AF799A4221" : "form_sgkb.html",
		"B17A96A96C5C4BFAA153DF102F441611" : "form_gggl.html"
}

function setDomain(domain){
	var str;
	if(domain.indexOf("http://")==-1){//不包含http://,则拼上http://
		str = domain;
		domain = "http://"+domain;
	}else{
		str = domain.replace("http://","");
	}
	//判断去掉http://后的字符串
	
	//if(str.substring(str.length-1,str.length)=="/"){//如果最后一位是/,则拼上项目名称
	//	domain += servername;
	//}else if(str.indexOf("/")==-1){//不包含/,说明链接中缺少项目名称, 则拼上默认项目名称
	//	domain += "/"+servername;
	//}
	//servername = domain.replace("http://","").split("/")[1];
	localStorage.setItem("domain",domain);
	
	serverhtml =  domain+"/jquerymobile" //服务器上页面目录
	versionurl = domain+"/servlet/versionForPhonegap";//获取服务器版本 
	newappurl = domain+"/"+appname;//更新客户端的地址
    jpushurl = domain+"/android/getregistrationid.ado?"//极光推送ID上传地址

    dengluurl = domain+"/phonegap/dologin.so";//登录地址
    menuurl = domain+"/phonegap/getMenu.so";//菜单地址
    
    mainurl = domain+"/mobile/portal.so";
    openurl = domain+"/phonegap/openur.so";
    viewurl = domain+"/phonegap/getView.so";//视图
    uploadfileurl = domain+"/servlet/uploadFileForPhonegap";//文件上传
    smallpicurl = domain+"/docattach.so?action=loadSmallImgAttach";//小图片下载地址自己后面加参数filetype=small720&fileid
    downloadfileurl = domain+"/getfile?fileid=";//附件下载地址
    saveDocurl = domain+"/phonegap/saveAppDoc.so";//非流程表保存地址
    openAppDocurl = domain+"/phonegap/openAppDoc.so";//打开或新建框架表单（包含流程）
    openFlowDocurl = domain+"/phonegap/openFlowNote.so";//待办任务打开
    processFlowurl = domain+"/phonegap/processFlowDoc.so";//流转
    selectNextFlowurl = domain+"/phonegap/selectNextFlow.so";//选择流向
    selectFlowPersonsurl = domain+"/phonegap/selectFlowPersons.so";//选择流转人员
    selectPersonsurl = domain+"/pages/selectpersions.jsp";
    selectOrgFlowPersonsurl = domain+"/phonegap/selectOrgFlowPersons.so";//选择流转部门
    
    signatureurl = domain+"/phonegap/saveSignature.so";//流转意见保存
    
    dwjcurl = domain+"/phonegap/dwjc.so";//点位检查
    dwjcurl1 = domain+"/android/dwjcForAndroid.so";//点位检查
    yhzgurl = domain+"/phonegap/yhzg.so";//隐患整改
    dataurl = domain+"/phonegap/data.so";//首页信息
    lxdwjcurl = domain+"/phonegap/lxdwjc.so";//离线点位检查
    
    certcodeurl = domain+"/CheckImage";        //验证码
}
