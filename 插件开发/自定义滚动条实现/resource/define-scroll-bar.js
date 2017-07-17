/**
 * 自定义滚动条插件
 * write by xfz 20160801
 */
;(function(win,doc,$){
	function ScrollBar(options){
		this._init(options);
	}
	$.extend(ScrollBar.prototype, {
		_init : function(options){
			this.options = {
				scrollDir : 'vertical',  //滚动方向
				contSelector : '',       //滚动内容区选择器
				barSelector : '',        //滚动条选择器
				sliderSelector : '',     //滚动滑块选择器
				wheelStep : 10           //滚轮步长
			};
			$.extend(true,this.options,options||{});
			this._initDomEvent();
			return this;
		},
		_initDomEvent : function(){
			var opts = this.options;
			//滚动内容区对象
			this.$cont = $(opts.contSelector);
			//滚动条滑块儿对象
			this.$slider = $(opts.sliderSelector);
			//滚动条对象
			this.$bar = opts.barSelector ? $(opts.barSelector) : this.$slider.parent();
			//文档对象
			this.$doc = $(doc);
			this._initSliderDragEvent()._bindContScroll()._bindMousewheel();
		},
		_initSliderDragEvent : function(){
			var me = this,
			    slider = me.$slider;
			if(slider[0]){
				var doc = me.$doc,
				    dragStartPagePos,
				    dragStartScrollPos,
				    dragContBarRate;
				//给事件添加命名空间
				slider.on('mousedown.scroll',function(e){
					e.preventDefault();
					dragStartPagePos = e.pageY;
					dragStartScrollPos = me.$cont[0].scrollTop;
					//滑块移动距离/滑块可移动距离 = 内容滚动高度/内容可滚动高度
					dragContBarRate = me.getMaxSrollPos()/me.getMaxSliderPos();

					doc.on('mousemove.scroll',mousemoveHandler)
					   .on('mouseup.scroll',function(){
  							doc.off('.scroll');//off会销毁掉命名空间下的所有事件
					   });

					//doc.on({
    					//mousemove:function(e){console.log('mousemove');},  
    					//mouseup:function(e){console.log('mouseup');doc.off('mousemove mouseup');
    					//},	
  					//});
  					
  					function mousemoveHandler(e){
  						e.preventDefault();
  						if(dragStartPagePos == null) return;
  						//滑块移动距离/滑块可移动距离 = 内容滚动高度/内容可滚动高度
  						me.scrollTo(dragStartScrollPos + (e.pageY - dragStartPagePos)*dragContBarRate);
  					}
				});
			}
			return me;
		},
		//监听内容滚动，同步滑块的位置变化
		_bindContScroll : function(){
			var me = this;
			this.$cont.on('scroll',function(){
				(me.$slider && me.$slider[0]) && me.$slider.css('top',me.getSliderPos()+'px');
			});
			return me;
		},
		_bindMousewheel : function(){
			var me = this;
			me.$cont.on('mousewheel DOMMouseScroll',function(e){
				e.preventDefault();
				var oEv = e.originalEvent,
				    wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0)/3;
				me.scrollTo(me.$cont[0].scrollTop + wheelRange*me.options.wheelStep);
			});
			return me;
		},
		getSliderPos : function(){
			var maxSliderPos = this.getMaxSliderPos();
			//滑块移动距离/滑块可移动距离 = 内容滚动高度/内容可滚动高度
			return Math.min(maxSliderPos,maxSliderPos*this.$cont[0].scrollTop/this.getMaxSrollPos());
		},
		//内容可滚动高度
		getMaxSrollPos : function(){
			return Math.max(this.$cont.height(),this.$cont[0].scrollHeight) - this.$cont.height();
		},
		//滑块可移动距离
		getMaxSliderPos : function(){
			return this.$bar.height() - this.$slider.height();
		},
		scrollTo : function(posVal){
			this.$cont.scrollTop(posVal);
		}
	});
	win.ScrollBar = ScrollBar;
})(window,document,jQuery);