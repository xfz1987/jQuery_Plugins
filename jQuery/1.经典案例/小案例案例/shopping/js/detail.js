/*使用jqzoom*/
$(function(){
	$(".jqzoom").jqueryzoom({
					xzoom: 300, //放大图的宽度(默认是 200)
					yzoom: 300, //放大图的高度(默认是 200)
					offset: 10, //离原图的距离(默认是 10)
					position: "right", //放大图的定位(默认是 "right")
					preload:1   
	});
});

/*观看清晰图片*/
//已经由插件jquery.thickbox.js来实现
/*1.引入thickbox.css
  <a href="images/pro_img/blue_one_big.jpg" id="thickImg" title="介绍文字" class="thickbox">
		<img alt="点击看大图" src="images/look.gif" />
  </a>

  注意：id值、class的值为固定写法、title：自由添加内容
*/
//2.引入jquery.thickbox.js

/*点击左侧产品小图片切换大图*/
$(function(){
	$(".pro_detail_left>ul>li>img").each(function(){
		$(this).click(function(){
			var imgSrc = $(this).attr("src");
			var i = imgSrc.lastIndexOf(".");
			var hz = imgSrc.substring(i);//后缀名
			imgSrc = imgSrc.substring(0,i);
			var imgSrc_small = imgSrc + "_small" + hz;
			var imgSrc_big = imgSrc + "_big"+ hz;
			$("#bigImg").attr({"src":imgSrc_small,"jqimg":imgSrc_big});
			$("#thickImg").attr("href",imgSrc_big);
		});
	});
});

/*Tab 选项卡 标签*/
$(function(){
	var $div_li = $("div.tab_menu ul li");
	$div_li.click(function(){
		$(this).addClass("selected")            //当前<li>元素高亮
			   .siblings().removeClass("selected");  //去掉其他同辈<li>元素的高亮
        var index =  $div_li.index(this);  // 获取当前点击的<li>元素 在 全部li元素中的索引。
		$("div.tab_box > div")   	//选取子节点。不选取子节点的话，会引起错误。如果里面还有div 
					.eq(index).show()   //显示 <li>元素对应的<div>元素
					.siblings().hide(); //隐藏其他几个同辈的<div>元素
		}).hover(
			function(){
				$(this).addClass("hover");
			},
			function(){
				$(this).removeClass("hover");
			}
		)
});

/*衣服颜色切换*/
$(function(){
	$(".color_change>ul>li>img").click(function(){           
		  var imgSrc = $(this).attr("src");
		  var i = imgSrc.lastIndexOf(".");
		  var unit = imgSrc.substring(i);
		  imgSrc = imgSrc.substring(0,i);
		  var imgSrc_small = imgSrc + "_one_small"+ unit;
		  var imgSrc_big = imgSrc + "_one_big"+ unit;
		  $("#bigImg").attr({"src": imgSrc_small ,"jqimg": imgSrc_big });
		  $("#thickImg").attr("href", imgSrc_big);
		  var alt = $(this).attr("alt");
		  $(".color_change strong").text(alt);
		  var url = imgSrc+".html";
		  $(".pro_detail_left ul.imgList").empty().load(url);
	});
});

/*衣服尺寸选择*/
$(function(){
	$(".pro_size li>span").click(function(){
		$(this).parents("ul").siblings("strong").text($(this).text());
	})
});

/*数量和价格联动*/
$(function(){
    var $span = $("div.pro_price>span");
	var price = $span.text();	
	$("#num_sort").change(function(){
	    var num = $(this).val();
		$span.text(num * price);
	});
})

/*商品评分效果*/
$(function(){
	//通过修改样式来显示不同的星级
    $("ul.rating li a").click(function(){
	     var title = $(this).attr("title");
	     alert("您给此商品的评分是："+title);
		 var cl = $(this).parent().attr("class");
		 $(this).parent().parent().removeClass().addClass("rating "+cl+"star");
		 $(this).blur();//去掉超链接的虚线框
		 return false;
	})
});

/*最终购买输出*/
$(function(){
    var $product = $(".pro_detail_right");
	$("#cart a").click(function(){
        var pro_name = $product.find("h4:first").text();
		var pro_size = $product.find(".pro_size strong").text();
		var pro_color =  $(".color_change strong").text();
		var pro_num = $product.find("#num_sort").val();
	    var pro_price = $product.find(".pro_price span").text();
		var dialog = " 感谢您的购买。\n您购买的\n"+
		        "产品是："+pro_name+"；\n"+
				"尺寸是："+pro_size+"；\n"+
				"颜色是："+pro_color+"；\n"+
				"数量是："+pro_num+"；\n"+
				"总价是："+pro_price +"元。";
		if( confirm(dialog) ){
			alert("您已经下单!");
		}
		return false;//避免页面跳转
	})
})