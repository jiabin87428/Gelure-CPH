function gotPullDownData(event, data, id, funDown) {
	if (funDown==null){
		var parm = {appid:getcurappid(),viewid:getcurviewid(),currentPage:1};
		if (viewtype=="2"){
			for(var key in search){  
				parm['value('+key+')'] = search[key];
			}
		}
		
		getAjax("post",viewurl,parm,
				function succ(json){
					$.mobile.loading( "hide" );
			    	if (json.success=="false"){
			    		openalert("<div style='text-align:center'>数据获取失败(01)</div>");
			    	}else if (json.success=="true"){
			    		var data = json.data;
			    		var html = "";
						for(var i in data){  
							
							html += "<li>";
							html += "<a class='ui-btn ui-btn-icon-right ui-icon-carat-r' href='javascript:openAppDoc(\""+data[i].APPID+"\",\""+data[i].DOCID+"\",\""+id+"\")'>";
							
							html += "<table width='100%'><tr><td colspan='2'>"+data[i].TITLE+"</td><tr>";
							html += "<tr class='xiaozi' width='70%'><td align='left'>"+data[i].SENDERNAME+"</td>";
							html += "<td align='right'>"+data[i].CREATEDATE+"</td></tr></table></a>";
							
							html += "</a>";
							
							html += "</li>";
						}
						//设置页面一些控制值
				    	$("#currpage_"+id).val(json.currPage);
				    	$("#totalpage_"+id).val(json.totalPages);
				    	$("#list_"+id).html(html).listview("refresh");	
						//$("#list_"+id).prepend(html).listview("refresh");
						data.iscrollview.refresh();
						
			    		
			    	}
			    	
				},
				function error(e){
					//$.mobile.loading( "hide" );
				}
			);
	}else{
		funDown.apply(this,[id,data]);
	}

}

function gotPullUpData(event, data, id, funUp) {
	if (funUp==null){
		if ($("#currpage_"+id).val()==$("#totalpage_"+id).val()){//代表最后一页，不加载
			$("#list_"+id).listview("refresh");
			openalert("<div style='text-align:center'>已经是最后一页</div>");
		}else{
			
			var parm = {appid:getcurappid(),viewid:getcurviewid(),currentPage:parseInt($("#currpage_"+id).val())+1};
			if (viewtype=="2"){
				for(var key in search){  
					parm['value('+key+')'] = search[key];
				}
			}
			getAjax("post",viewurl,parm,
					function succ(json){
						//$.mobile.loading( "hide" );
				    	if (json.success=="false"){
				    		openalert("<div style='text-align:center'>数据获取失败(02)</div>");
				    	}else if (json.success=="true"){
				    		var data = json.data;
				    		var html = "";
								for(var i in data){  
									
									html += "<li>";
									html += "<a class='ui-btn ui-btn-icon-right ui-icon-carat-r' href='javascript:openAppDoc(\""+data[i].APPID+"\",\""+data[i].DOCID+"\",\""+id+"\")'>";
									
									html += "<table width='100%'><tr><td colspan='2'>"+data[i].TITLE+"</td><tr>";
									html += "<tr class='xiaozi' width='70%'><td align='left'>"+data[i].SENDERNAME+"</td>";
									html += "<td align='right'>"+data[i].CREATEDATE+"</td></tr></table></a>";
									
									html += "</a>";
									
									html += "</li>";
								}
								//alert (json.currPage);
								$("#currpage_"+id).val(json.currPage);
					    		$("#totalpage_"+id).val(json.totalPages);
					    		$("#list_"+id).append(html).listview("refresh");
								iscrollview.refresh(null, null, $.proxy(function afterRefreshCallback() {
									this.scrollToElement("#list_"+id+" > li:last-child", 400);
								}, iscrollview));
								
								
				    	}
				    	
					},
					function error(e){
						//$.mobile.loading( "hide" );
					}
				);
		}
	}else{
		funUp.apply(this,[id,data]);	// <-- Simulate network congestion, remove setTimeout from production!
	}

}

function loaded(id, funHtml, funUp, funDown) {
	//alert(id+">>"+$("#zt_"+id).val());
	if ($("#zt_"+id).val()=="0"){
		if (viewtype=="2"){
			for(var key in search){  
				parm['value('+key+')'] = search[key];
			}
		}
		
		getAjax("post",viewurl,{appid:getcurappid(),viewid:getcurviewid(),currentPage:$("#currpage_"+id).val()},
			function succ(json){
				if (json.success=="false"){
		    		//$.mobile.loading( "hide" );
		    		openalert("<div style='text-align:center'>数据获取失败(03)</div>");
		    	}else if (json.success=="true"){
		    		
		    		var data = json.data;
		    		if (funHtml==null){//加载默认html视图样式
		    			var el, li, i;
						el = document.getElementById('list_'+id);
						
						for(var i in data){  
							var html = "";
							//html += "<li>";
							//html += "<a href='javascript:openAppDoc(\'"+data[i].appid+"\',\'"+data[i].docid+"\',\'"+id+"\')'>";
							html += "<a class='ui-btn ui-btn-icon-right ui-icon-carat-r' href='javascript:openAppDoc(\""+data[i].APPID+"\",\""+data[i].DOCID+"\",\""+id+"\")'>";
							
							html += "<table width='100%'><tr><td colspan='2'>"+data[i].TITLE+"</td><tr>";
							html += "<tr class='xiaozi' width='70%'><td align='left'>"+data[i].SENDERNAME+"</td>";
							html += "<td align='right'>"+data[i].CREATEDATE+"</td></tr></table></a>";
							
							html += "</a>";
							
							//html += "</li>";
							li = document.createElement('li');
							li.innerHTML = html;
							el.appendChild(li, el.childNodes[0]);
						}
						
						//添加新建按钮
						var czhtml = "";
						
						if (json.viewinfo.shownewbtn=="true"){
							czhtml += '<li><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="newDoc(\''+getParmObj().appid+'\',\''+id+'\')">新建</a></li>';
						}
						//添加搜索按钮
						if (json.viewinfo.searchhead != null && json.viewinfo.searchhead!=""){
							czhtml += '<li><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="viewsearch(\''+json.viewinfo.searchhead+'\',\''+json.viewinfo.searchfield+'\',\''+json.viewinfo.searchdatatype+'\',\'\',\''+id+'\')">搜索</a></li>';
						}
						
						$("#caozuo_"+id).html(czhtml);
					}else{
						//调用自定义方法
						
		    			funHtml.apply(this,[id,json]);
		    		}
		    		//设置页面一些控制值
		    		
		    		$("#zt_"+id).val("1");//是否已经初始化过页面
		    		$("#currpage_"+id).val(json.currPage);
		    		$("#totalpage_"+id).val(json.totalPages);
		    	}
			},
			function error(e){
				
			}
		);
		//初始化上下拉效果
		$("#scroll_" + id).bind({
			iscroll_onpulldown : function(event, data) {
				setTimeout(function fakeRetrieveDataTimeout() {
					gotPullDownData(event, data, id, funDown);
				}, 1500);
			},
			iscroll_onpullup : function(event, data) {
				setTimeout(function fakeRetrieveDataTimeout() {
					gotPullUpData(event, data, id, funUp);
				}, 1500);
			}
		});
	}
}
//设置是否已打开图片预览界面ifShowPic=true/false
function setShowPic(ifShowPic){
	showPic = ifShowPic;
}