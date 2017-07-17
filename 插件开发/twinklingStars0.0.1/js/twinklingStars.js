var twinklingStars = {
	twinkle:function($elems){
		$elems.each(function(){
			twinklingStars.createStars($(this),$(this).attr("data-twinkling")); //生成星星
		});
		twinklingStars.bind();  //事件绑定
	},
	createStars:function($elem,score){  //生成星星
		//如果elem中没有元素,则首先生成星星,默认灰色星星,(为了防止鼠标事件bug,事件目标最好有固定的子元素)但是一定要在twinkle函数中初始化时先生成一次
		if(!$(".stars",$elem).length){ 
			for(var i=0; i<5; i++){
				var star = $("<div class='stars grayStar'></div>");
				$elem.append(star);
			}
		}
		if($elem.attr("data-editable")){
			$elem.css("cursor","pointer");
		}
		var score = isNaN(score)?0:score;  //防错
		score = score<=5?0:score;  //如果小于5就没有星星
		score = Math.ceil(Number(score)/10)/2;  //星星数量,data-twinkling以满分100分计算
		var yellowStarCount = 0;
		var hlafStarCount = 0;
		if(Math.ceil(score) === score ){  //整数
			yellowStarCount = score;
			halfStarCount = 0;
		}else{  //非整数
			yellowStarCount = Math.floor(score);
			halfStarCount = 1;
		}
		$(".stars",$elem).each(function(index){  //index是从0开始算的,所以starCount必须减1
			if(index<=yellowStarCount-1){ //黄色星星
				$(this).removeClass("grayStar").removeClass("halfStar").addClass("yellowStar");
			}else if(index===yellowStarCount+halfStarCount-1){  //如果存在半色星星
				$(this).removeClass("grayStar").removeClass("yellowStar").addClass("halfStar");
			}else{  //剩余的就是灰色星星了
				$(this).removeClass("halfStar").removeClass("yellowStar").addClass("grayStar");
			}
		});
	},
	bind:function(){  //事件绑定,委托在html上
		$("html").on("mouseenter mousemove click mouseleave",".twinklingStars",function(evt){
			if($(this).attr("data-editable")){  //可编辑
				switch(evt.type){
					case "mouseenter":
						$(this).data("mouseleave",false);
						break;
					case "mousemove":
						if(!$(this).data("clicked")){  //当前未被点击
							//  获取新值并存入元素中
							var newScore = (evt.pageX - $(this).offset().left)/$(this).width()*100;
							if(parseInt(newScore)!==parseInt($(this).attr("data-twinkling"))){
								//重新生成星星
								twinklingStars.createStars($(this),newScore);
								$(this).data("data-twinkling",parseInt(newScore));  //缓存新值
							}
						}
						break;
					case "click":
							$(this).data("clicked",true); //缓存元素是否被点击
							$(this).attr("data-twinkling",$(this).data("data-twinkling"));//将临时的值设为新值
							$(this).removeData("data-twinkling");//清除
						break;
					case "mouseleave":
						if(!$(this).data("clicked")){  //如果没有被点击,则还原初始星星
							twinklingStars.createStars($(this),$(this).attr("data-twinkling"));
						}
						$(this).data("clicked",false); //更新被点击信息
						$(this).data("mouseleave",true);  //更新鼠标离开信息
						break;
				}
			}
		})
	}
};

