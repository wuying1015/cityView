/*
 * 地区城市选择插件
 * author:zhanggz
 */
(function($){
	$.fn.cityView = function(options){
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options == 'string') {
			var fn = this[0][options];
			if($.isFunction(fn)){
				return fn.apply(this, otherArgs);
			}else{
				throw ("cityView - No such method: " + options);
			}
		}
		var dd = this;
		if($(this).length==0){
			var id = this.selector.replace("#","");
			dd = $("<div id='"+id+"' />");
			$(document.body).append(dd);
			dd = $(dd);
		}else{
			$(this).empty();
		}
		return dd.each(function() {
			var opts = {};
			var dom = this;  // 保存组件对象
			var flArray = ["热门","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
			var dzArray = [{"F_ID":"0","F_MC":"热门"},{"F_ID":"1","F_MC":"亚洲"},{"F_ID":"2","F_MC":"欧洲"},{"F_ID":"3","F_MC":"非洲"},{"F_ID":"4","F_MC":"北美"},{"F_ID":"5","F_MC":"拉美"},{"F_ID":"6","F_MC":"大洋洲"}];
			var defaults = {
					atzClick	:null,				//A-Zclcik
					dzClick		:null,				//大洲click
					cityClick	:null,				//文件点击事件
					inputCall	:null,				//输入回调
					zdyTL		:null,				//自定义TOP left
			};
			opts = $.extend(defaults,options);
			this.init = function(){
				//创建展示框架
				dom.creatView();
				//绑定国内外事件
				dom.bindGNW();
				//绑定A-Z的点击事件
				dom.bindATZClick();
				//绑定大洲的点击事件
				dom.bindDZClick();
				
			};
			//创建展示框架
			this.creatView = function(){
				var str = "";
				str += "<div id='cityview' class='cityview'>";
				str += "	<div id='closediv' class='closediv'>";
				str += "	</div>";
				str += "	<div class='gnw'>";
				str += "		<div id='gn' class='gnwA'>";
				str += "			<span>国内</span>";
				str += "		</div>";
				str += "		<div id='gw' class='gnwA'>";
				str += "			<span>国外</span>";
				str += "		</div>";
				str += "	</div>";
				str += "	<div class='gnwdiv gndiv'>";
				str += "		<div class='fldiv'>";
				str += dom._getATZ();//创建A-Z
				str += "		</div>";
				str += "		<div class='flcity'>";
				str += dom._getATZcity();//创建A-Z对应的城市列表
				str += "		</div>";
				str += "	</div>";
				str += "	<div class='gnwdiv gwdiv'>";
				str += "		<div class='fldiv'>";
				str += dom._getDZ();//创建大洲
				str += "		</div>";
				str += "		<div class='flcity'>";
				str += dom._getDZcity();//创建大洲对应的城市列表
				str += "		</div>";
				str += "	</div>";
				str += "	<div class='flbottom'>";
				str += "		<span>更多城市可直接输入搜索</span>";
				str += "	</div>";
				str += "</div>";
				$(dom).append($(str));
				//竖向展示列表
				var str = "";
				str += "<div id='clist' class='clist'>";
				str += "</div>";
				$(dom).append($(str));
			};
			//创建A-Z
			this._getATZ = function(){
				var str = "";
				for(var i=0;i<flArray.length;i++){
					var s = flArray[i];
					str += "<span class='fldivA' dataid='"+s+"'>"+s+"</span>";
				}
				return str;
			};
			//创建大洲
			this._getDZ = function(){
				var str = "";
				for(var i=0;i<dzArray.length;i++){
					var s = dzArray[i]['F_ID'];
					var mc = dzArray[i]['F_MC'];
					str += "<span class='fldivB' dataid='"+s+"'>"+mc+"</span>";
				}
				return str;
			};
			//创建A-Z对应的城市列表
			this._getATZcity = function(){
				var str = "";
				for(var i=0;i<flArray.length;i++){
					var s = flArray[i];
					str += "<div class='flcityA' dataid='"+s+"'></div>";
				}
				return str;
			};
			//创建大洲对应的城市列表
			this._getDZcity = function(){
				var str = "";
				for(var i=0;i<dzArray.length;i++){
					var s = dzArray[i]['F_ID'];
					str += "<div class='flcityA' dataid='"+s+"'></div>";
				}
				return str;
			};
			//绑定A-Z的点击事件
			this.bindATZClick = function(){
				var divs = $(dom).find(".gndiv").find(".fldivA");
				var cdivs = $(dom).find(".flcity");
				$.each(divs,function(a,b){
					$(b).bind("click",function(){
						var dataid = $(b).attr("dataid");
						$(dom).find(".gndiv").find(".fldivAhover").removeClass("fldivAhover");
						$(b).addClass("fldivAhover");
						var cdoms = cdivs.find("[dataid='"+dataid+"']");
						cdoms.css("display","block").siblings().css("display","none");
						setCityData(cdoms,dataid);//设置城市数据
					});
				});
				//设置城市数据
				function setCityData(cdoms,dataid){
					if(cdoms.attr("isload")=="1"){
						return;
					}
					var obj = {"id":dataid,"GNW":"0"};//国内0
					var senddata = [];//城市数组['北京','上海']
					if($.isFunction(opts.atzClick)){
						opts.atzClick.call(this,obj,function(senddata,rows){
							if(cdoms.attr("isload")=="1"){
								return;
							}
							var str = "<div class='citylist'>";
							$.each(senddata,function(a,b){
								str += "<div class='citylistA' key='"+dataid+"' title='"+b+"' rdata='"+JSON.stringify(rows[a])+"'>";
								str += "	<span>"+b+"</span>";
								str += "</div>";
							});
							str += "</div>";
							cdoms.append($(str));
							cdoms.attr("isload","1");
							bindCitySelect(cdoms,dataid);//绑定城市选择事件
						});
					}
				}
				//绑定城市选择事件
				function bindCitySelect(cdoms,dataid){
					var divs = cdoms.find(".citylistA");
					$.each(divs,function(a,b){
						$(b).bind("click",function(){
							var name = $(b).attr("title");
							var rdata = JSON.parse($(b).attr("rdata"));
							var obj = {"name":name,"rdata":rdata};
							if($.isFunction(opts.cityClick)){
								opts.cityClick.call(this,obj);
							}
							$(dom).find("#cityview").css("display","none");
						});
					});
				}
			};
			//绑定大洲的点击事件
			this.bindDZClick = function(){
				var divs = $(dom).find(".gwdiv").find(".fldivB");
				var cdivs = $(dom).find(".flcity");
				$.each(divs,function(a,b){
					$(b).bind("click",function(){
						var dataid = $(b).attr("dataid");
						$(dom).find(".gwdiv").find(".fldivAhover").removeClass("fldivAhover");
						$(b).addClass("fldivAhover");
						var cdoms = cdivs.find("[dataid='"+dataid+"']");
						cdoms.css("display","block").siblings().css("display","none");
						setCityData(cdoms,dataid);//设置城市数据
					});
				});
				//设置城市数据
				function setCityData(cdoms,dataid){
					if(cdoms.attr("isload")=="1"){
						return;
					}
					var obj = {"id":dataid,"GNW":"1"};//国内0
					var senddata = [];//城市数组['北京','上海']
					if($.isFunction(opts.dzClick)){
						opts.dzClick.call(this,obj,function(senddata,rows){
							if(cdoms.attr("isload")=="1"){
								return;
							}
							var str = "<div class='citylist'>";
							$.each(senddata,function(a,b){
								str += "<div class='citylistA' key='"+dataid+"' title='"+b+"' rdata='"+JSON.stringify(rows[a])+"'>";
								str += "	<span>"+b+"</span>";
								str += "</div>";
							});
							str += "</div>";
							cdoms.append($(str));
							cdoms.attr("isload","1");
							bindCitySelect(cdoms,dataid);//绑定城市选择事件
						});
					}
				}
				//绑定城市选择事件
				function bindCitySelect(cdoms,dataid){
					var divs = cdoms.find(".citylistA");
					$.each(divs,function(a,b){
						$(b).bind("click",function(){
							var name = $(b).attr("title");
							var rdata = JSON.parse($(b).attr("rdata"));
							var obj = {"name":name,"rdata":rdata};
							if($.isFunction(opts.cityClick)){
								opts.cityClick.call(this,obj);
							}
							$(dom).find("#cityview").css("display","none");
						});
					});
				}
			};
			//设置选中A-Z
			this.setATZselect = function(para){
				var atz = para.ATZ;
				$(dom).find(".gndiv").find(".fldiv").find("[dataid='"+atz+"']").trigger("click");
			};
			//设置选中大洲
			this.setDZselect = function(para){
				var dz = para.DZ;
				$(dom).find(".gwdiv").find(".fldiv").find("[dataid='"+dz+"']").trigger("click");
			};
			//绑定国内外事件
			this.bindGNW = function(){
				$("#gn").bind("click",function(){
					$(dom).find(".gnwAhover").removeClass("gnwAhover");
					$(".gndiv").css("display","block");
					$(this).addClass("gnwAhover");
					$(".gwdiv").css("display","none");
				});
				$("#gw").bind("click",function(){
					dom.setDZselect({"DZ":dzArray[0]['F_ID']});
					$(dom).find(".gnwAhover").removeClass("gnwAhover");
					$(".gwdiv").css("display","block");
					$(this).addClass("gnwAhover");
					$(".gndiv").css("display","none");
				});
				$("#gn").trigger("click");
				$("#closediv").bind("click",function(){
					$(dom).find("#cityview").css("display","none");
				});
			};
			//初始化显示
			this.initView = function(iddom){
				$(dom).find("#clist").css("display","none");
				$(dom).find("#clist").empty();
				$(dom).find("#cityview").css("display","block");
				if( $(dom).find(".gnwAhover").attr("id")=="gn"){
					$("#gn").trigger("click");
					dom.setATZselect({"ATZ":flArray[0],"iddom":iddom});
				}
			};
			//为input绑定帮助事件
			this.bindInput = function(para){
				var id = para.id;
				var iszdytl = para.iszdytl||false;
				$("#"+id).unbind("focus").bind("focus",function(){
					dom.initView($("#"+id));
					if(iszdytl==false){
						var tl = $(this).offset();
						var left = tl.left-4;
						var top = tl.top+$(this).outerHeight(true);
						$(dom).css({"left":left+"px","top":top+"px"});
					}else{
						var obj = {"iddom":$("#"+id)};
						var tl = "";
						if($.isFunction(opts.zdyTL)){
							tl = opts.zdyTL.call(this,obj);
						}
						$(dom).css({"left":tl.left+"px","top":tl.top+"px"});
					}
				});
				$(document).unbind("click").bind("click",function(e){
				   var target  = $(e.target);
				   if($(dom).find(target).length==0&&$(target).attr("id")!=id){
					   $(dom).find("#cityview").css("display","none");
					   $(dom).find("#clist").css("display","none");
					   $(dom).find("#clist").empty();
				   }
				});
				var timel = null;
				$("#"+id).unbind("keyup").bind("keyup",function(e){
					if(e.keyCode == 13||e.keyCode == 38||e.keyCode == 40){
						return;
					} 
					var val = $("#"+id).val();
					if(val==""){
						$(dom).find("#clist").empty();
						$(dom).find("#clist").css("display","none");
						$(dom).find("#cityview").css("display","none");
						return;
					}
					$(dom).find("#clist").css("display","block");
					$(dom).find("#cityview").css("display","none");
					if(timel!=null){
						clearTimeout(timel);
					}
					timel = setTimeout(function(){
						setCityData();
						timel = null;
					},300);
				});
				function setCityData(){
					var val = $("#"+id).val();
					var obj = {"name":val};
					var citys = [];
					if($.isFunction(opts.inputCall)){
						opts.inputCall.call(this,obj,function(citys,rows){
							$(dom).find("#clist").empty();
							if(citys.length==0){
								$(dom).find("#clist").css("display","none");
							}
							var str = "<div class='clistA'>";
							$.each(citys,function(a,b){
								str += "<div class='clistB' title='"+b+"' rdata='"+JSON.stringify(rows[a])+"'>";
								str += "	<span>"+b+"</span>";
								str += "</div>";
							});
							str += "</div>";
							$(dom).find("#clist").append($(str));
							bindCitySelect($(dom).find("#clist"),$("#"+id));
							//默认选中第一个并且支持向上向下选择
							bindUpDown($(dom).find("#clist"),citys);
							$(dom).find("#clist").animate({scrollTop:1},0);
							$(dom).find("#clist").animate({scrollTop:0},0);
						});
					}
				}
				//绑定城市选择事件
				function bindCitySelect(cdoms,iddom){
					var divs = cdoms.find(".clistB");
					$.each(divs,function(a,b){
						$(b).bind("click",function(){
							var name = $(b).attr("title");
							var rdata = JSON.parse($(b).attr("rdata"));
							var obj = {"name":name,"rdata":rdata,"iddom":iddom};
							if($.isFunction(opts.cityClick)){
								opts.cityClick.call(this,obj);
							}
							$(dom).find("#clist").css("display","none");
							$(dom).find("#clist").empty();
						});
					});
				}
				//默认选中第一个并且支持向上向下选择
				function bindUpDown(cdoms,citys){
					if(citys.length==0){
						return;
					}
					cdoms.find(".clistBhover").removeClass("clistBhover");
					cdoms.find(".clistB").eq(0).addClass("clistBhover");
					if(cdoms.css("display")=="none"){
						return;
					} 
					$(document).unbind("keyup").bind("keyup",function(e){
						if(e.keyCode == 13){//回车
							doSelectValue(cdoms,citys);
							return;
						}
						if(e.keyCode == 38){//上
							selectUp(cdoms,citys);
						}
						if(e.keyCode == 40){//下
							selectDown(cdoms,citys);
						}
					});
					cdoms.find(".clistB").hover(function(){
						cdoms.find(".clistBhover").removeClass("clistBhover");
						$(this).addClass("clistBhover");
					}); 
				}
				function doSelectValue(cdoms,citys){
					cdoms.find(".clistBhover").trigger("click");
				}
				function selectUp(cdoms,citys){
					var ccdoms = cdoms.find(".clistBhover");
					if(ccdoms.prev().length>0){
						cdoms.find(".clistBhover").removeClass("clistBhover");
						ccdoms.prev().addClass("clistBhover");
						setWz(cdoms,citys);//设置位置
					}
				}
				function selectDown(cdoms,citys){
					var ccdoms = cdoms.find(".clistBhover");
					if(ccdoms.next().length>0){
						cdoms.find(".clistBhover").removeClass("clistBhover");
						ccdoms.next().addClass("clistBhover");
						setWz(cdoms,citys);//设置位置
					}
				}
				function setWz(cdoms,citys){
					var height = cdoms.outerHeight(true); 
					var listheight = cdoms.find(".clistA").outerHeight(true);
					var _height = cdoms.find(".clistBhover").position().top;//选中的节点距离顶部的距离
					var _hheight = cdoms.find(".clistBhover").outerHeight(true);
					if(_height-Math.abs(cdoms.find(".clistA").position().top)>=0&&(_height+_hheight<=height||_height-Math.abs(cdoms.find(".clistA").position().top)+_hheight<=height)){
						return;
					}
					if(_height+_hheight>height){ 
						var jl = _height+_hheight-height;//滚动的距离
						cdoms.animate({scrollTop:jl},10);
					}else if(Math.abs(cdoms.find(".clistA").position().top)-Math.abs(_height)>0){
						cdoms.animate({scrollTop:0},10);
					}
				}
			};
			this.init();
		});
	};
})(jQuery);