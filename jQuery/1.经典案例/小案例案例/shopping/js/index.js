/*网站换肤
$(function(){
	$("#skin>li").click(function(){
		$("#"+this.id).addClass("selected").siblings().removeClass("selected");
		$("#cssfile").attr("href","css/skin/" + this.id + ".css");//设置不同皮肤
	});
});
*/
//例用cookie.js实现换肤
$(function(){
	$("#skin li").click(function(){
		switchSkin(this.id);
	});
	var cookie_skin = $.cookie("MyCssSkin");
	if (cookie_skin){
		switchSkin(cookie_skin);
	}
});

function switchSkin(skinName){
	$("#"+skinName).addClass("selected") .siblings().removeClass("selected");
	$("#cssfile").attr("href","css/skin/"+ skinName +".css"); //设置不同皮肤
	$.cookie("MyCssSkin",skinName,{path:'/',expires:10});
}

//导航效果（兼容IE6）,去掉css中hove样式类
$(function(){
	$("#navigation>ul>li:has('ul')").hover(
		function(){
			$(this).children("ul").stop(true,true).slideDown(500);
		},
		function(){
		    $(this).children("ul").stop(true,true).slideUp("fast");
	});
});

/*最新动态*/
//新闻滚动，
$(function(){
	var $this = $(".scrollNews"); 
	var scrollTimer;
	$this.hover(
		function(){
			clearInterval(scrollTimer);
			scrollTimer = null;
		},
		function(){
			scrollTimer = setInterval(function(){
				scrollNews($this);
			},3000);
		}
	).trigger("mouseleave");
});
function scrollNews(obj){
   var $self = obj.find("ul:first"); 
   var lineHeight = $self.find("li:first").height(); //获取行高
   $self.animate({ "marginTop" : -lineHeight +"px" }, 600 , function(){
         $self.css({marginTop:0}).find("li:first").appendTo($self); //appendTo能直接移动元素
   })
}
/*最新动态展开和关闭*/
$(function(){
	$(".module_up_down").toggle(
		function(){
			var $self = $(this);
			$self.prev().slideToggle(600,function(){
				$("img",$self).attr("src","images/up.gif");
			});
		},
		function(){
			var $self = $(this);
			$self.prev().slideToggle(600,function(){
				$("img",$self).attr("src","images/down.gif");
			});
		}
	);
});
//超链接文字提示*/
$(function(){
    var x = 10;  
	var y = 20;
	$("a.tooltip").mouseover(function(e){
       	this.myTitle = this.title;
		this.title = "";	
	    var tooltip = "<div id='tooltip'>"+ this.myTitle +"</div>"; //创建 div 元素
		$("body").append(tooltip);	//把它追加到文档中
		$("#tooltip")
			.css({
				"top": (e.pageY+y) + "px",
				"left": (e.pageX+x)  + "px"
			}).show("fast");	  //设置x坐标和y坐标，并且显示
    }).mouseout(function(){		
		this.title = this.myTitle;
		$("#tooltip").remove();   //移除 
    }).mousemove(function(e){
		$("#tooltip")
			.css({
				"top": (e.pageY+y) + "px",
				"left": (e.pageX+x)  + "px"
			});
	});
})

/*产品分类*/
//产品树展开和关闭
$(function(){
	$(".m-treeview>li>span").click(function(){ // 注意用的是 子选择器 (  >  )
		var $ul = $(this).siblings("ul");
			if($ul.is(":visible")){
				$(this).parent().attr("class","m-collapsed");
					$ul.hide();
				}else{
					$(this).parent().attr("class","m-expanded");
					$ul.show();
				}
			return false;
	});
});

/*首页广告效果*/
$(function(){
	var len = $(".num>li").length;
	var index = 0;
	var adTimer;
	$(".num>li").mouseover(function(){
		index = $(".num>li").index(this);
		showImg(index);
	}).eq(0).mouseover();
	//滑入 停止动画；滑出开始动画
	$(".ad").hover(
		function(){
			clearInterval(adTimer);
			adTimer = null;
		},
		function(){
			adTimer = setInterval(function(){
				showImg(index);
				index++;
				if(index == len){index = 0;}
			},3000);
		}
	).trigger("mouseleave");
});
//通过控制top ，来显示不同的幻灯片
function showImg(index){
	var adHeight = $(".content_right .ad").height();
	$(".slider").stop(true,false).animate({top:-adHeight*index},1000);
	$(".num>li").removeClass("on").eq(index).addClass("on");
} 

/*新款上市相关特效*/
//滑过图片在图片中央出现放大镜图标
$(function(){
	$(".content_right .prolist ul>li").each(function(index,dom){
		var position = $(dom).position();
		var li_left = position.left;
		var li_top = position.top;
		var img_width = $(dom).find("img").width();
		var img_height = $(dom).find("img").height();
        var spanHtml = '<span style="position:absolute;top:'+li_top+'px;left:'+li_left+'px;'
			+ 'width:'+img_width+'px;height:'+img_height+'px;cursor:pointer;" class="imageMask"></span>';
		$(spanHtml).hover(
			function(){
				$(this).addClass("imageOver");//这里this指代的是新创建的spanHtml
			},
			function(){
				$(this).removeClass("imageOver");
			}
		).appendTo($(dom).find("a"));
	});
});
//新款上市模块横向滚动
$(function(){
	var page = 1;
    var i = 4; //每版放4个图片
	var num = $(".prolist_content>ul>li").length;
	var page_count = Math.ceil(num/i) ;   //只要不是整数，就往大的方向取最小的整数
	var none_unit_width = $(".prolist").width(); //获取框架内容的宽度,不带单位
	var $parent = $(".prolist_content"); 
    //向右 按钮
    $(".goRight").click(function(){ 
		if(!$parent.is(":animated") ){
			if( page == page_count ){ //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
				$parent.animate({left:0}, 800); //通过改变left值，跳转到第一个版面
				page = 1;
			}else{
				$parent.animate({left:"-="+none_unit_width}, 800);  //通过改变left值，达到每次换一个版面
				page++;
			}
		}
	});
    //往左 按钮
	$(".goLeft").click(function(){
		if(!$parent.is(":animated") ){
			if(page == 1){  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。
				$parent.animate({left:'-='+none_unit_width*(page_count-1)}, 800); //通过改变left值，跳转到最后一个版面
				page = page_count;
			}else{
				$parent.animate({left:'+='+none_unit_width}, 800);  //通过改变left值，达到每次换一个版面
				page--;
			}
		}
    });
});

