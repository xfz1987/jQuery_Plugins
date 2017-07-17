//图片预加载(jQuery) created by xfz 2017/5/11
(function($){
	var PreLoad = function(imgs, opts){
		this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
		this.opts = $.extend({}, PreLoad.DEFAULTS, opts);
		this.opts.order ? this._ordered() : this._unordered();
	};
	PreLoad.DEFAULTS = {
		order: false,//默认使用无序的预加载
		each: null, //每张图片加载完毕后执行
		all: null   //所有图片加载完毕后执行
	};
	PreLoad.prototype = {
		//无序预加载
		_unordered: function(){
			var imgs = this.imgs,
			    opts = this.opts,
			    count = 0,
			    len = imgs.length;
			
			$.each(imgs, function(index, item){
				if(typeof item !== 'string') return;
				
				var imgObj = new Image();
				
				$(imgObj).on('load error',function(){
					opts.each && opts.each(count);
					if(++count >= len){
						opts.all && opts.all();
					}
				});
				imgObj.src = item;
			});
		},
		//有序预加载
		_ordered: function(){
			var opts = this.opts,
			    imgs = this.imgs,
			    len = imgs.length,
			    count = 0;

			load();

			function load(){
				var imgObj = new Image();
				$(imgObj).on('load error',function(){
					opts.each && opts.each(count);
					if(count >= len){
						opts.all && opts.all();
					}else{
						load();
					}
					count++;
				});
				imgObj.src = imgs[count];
			}
		}
	};
	//$.fn.extend -> $('#img').preload();
	//$.extend -> $.preload();
	$.extend({
		preload: function(imgs, opts){
			new PreLoad(imgs, opts);
		}
	});
})(jQuery);