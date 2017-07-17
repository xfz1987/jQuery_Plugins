//图片预加载(javascript) created by xfz 2017/5/11
(function(){
	var PreLoad = function(imgs, opts){
		if(this instanceof PreLoad){
			this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
			this.opts = opts;
			this.opts.order ? this._ordered() : this._unordered();
		}else{
 			return new PreLoad(imgs, opts);
		}
	};
	PreLoad.prototype = {
		//无序预加载
		_unordered: function(){
			var imgs = this.imgs,
		    opts = this.opts,
		    count = 0,
		    len = imgs.length;

			function loadFun(){
				opts.each && opts.each(count);
				if(++count >= len){
					opts.all && opts.all();
				}
			}
			for(var i=0,len=imgs.length;i<len;i++){
				var src = imgs[i];
				if(typeof src !== 'string') return;
				var imgObj = new Image();
				imgObj.onload = loadFun;
				imgObj.onerror = loadFun;
				imgObj.src = src;
			}
		},
		//无序预加载
		_ordered: function(){
			var opts = this.opts,
			    imgs = this.imgs,
			    len = imgs.length,
			    count = 0;

			load();

			function loadImg(){
				opts.each && opts.each(count);
				if(count >= len){
					opts.all && opts.all();
				}else{
					load();
				}
				count++;
			}

			function load(){
				var imgObj = new Image();
				imgObj.onload = loadImg;
				imgObj.onerror = loadImg;
				imgObj.src = imgs[count];
			}
		}
	};

	window['preload'] = PreLoad;
})();