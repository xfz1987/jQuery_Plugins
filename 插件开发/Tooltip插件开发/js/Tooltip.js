(function(){
    // /*
    // * 私有方法
    // * 说明:获取浏览器前缀
    // * 实现:判断某个元素的css样式中是否存在transition属性
    // * 参数:dom元素
    // * 返回值:boolean，有则返回浏览器样式前缀，否则返回false
    // * */
    // var _prefix = (function(temp){
    //     var aPrefix = ['webkit','Moz','o','ms'],
    //         props = '';
    //     for(var i in aPrefix){
    //         props = aPrefix[i] + 'Transition';
    //         if(temp.style[props] !== undefined){
    //             return '-' + aPrefix[i].toLowerCase() + '-';
    //         }
    //     }
    //     return false;
    // })(document.createElement(Tooltip));

    var _isIE = navigator.userAgent.indexOf("MSIE") > -1;

    var Tooltip = (function(){
        function Tooltip(element,options){
            //jQuery的extend方法的作用：将用户自定义的插件参数与插件的默认参数加以合并
            this.settings = $.extend(true, $.fn.Tooltip.default, options||{});
            this.element = element;
            this.init();
        }
        Tooltip.prototype = {
            //初始化
            init : function(){
                var me = this;
                me.linkid = me.settings.linkid;
                me.link = $('#'+me.linkid);
                me.className = me.settings.className;
                me.html = me.settings.html;
                me.width = me.settings.width;
                me.height = me.settings.height;
                me._initEvent();
            },
            _createTipBox:function(){
                var me = this;
                var toolTipBox = $('<div class="'+me.className+'">'+ me.html +'</div>');
                me.link.append(toolTipBox);
                me.width = me.width?me.width+'px':'auto';
                me.height = me.height? me.height+"px":"auto";
                if(me.width!=='auto' && _isIE){
                    me.width = toolTipBox.outerWidth()+'px';
                }
                var left = me.link[0].offsetLeft;
                var top = me.link[0].offsetTop + 22;

                //left，不让ToolTip提示框超出浏览器
                var clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
                if(left + toolTipBox.outerWidth() > clientWidth){
                    var demoLeft = me.element[0].offsetLeft;
                    left = clientWidth - toolTipBox.outerWidth() - demoLeft;
                    if (left < 0) left = 0;
                }

                toolTipBox.css({
                    'width':me.width,
                    'height':me.height,
                    'position':'absolute',
                    'display':'block',
                    'left':left+'px',
                    'top':top+'px'
                });
            },
            _initEvent:function(){
                var me = this;
                $(me.link).on('mouseenter',function(){
                    var box = $(this).find('.'+me.className);
                    if(!box.hasClass(me.className)){
                        me._createTipBox();
                    }
                    box.css('display','block');
                });

                $(me.link).on('mouseleave',function(){
                    $(this).find('.'+me.className).fadeOut('500');
                });

                $(window).resize(function(){
                    var clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
                    var left = me.link[0].offsetLeft;
                    me.link.find('.'+me.className).each(function(index, el){
                        if(left + $(el).outerWidth() > clientWidth){
                            var demoLeft = me.element[0].offsetLeft;
                            left = clientWidth - $(el).outerWidth() - demoLeft;
                            if (left < 0) left = 0;
                            $(el).css('left',left+'px');
                        }
                    });
                });

            }
        };
        return Tooltip;
    })();
    $.fn.Tooltip = function(options){
        //链式调用
        return this.each(function(){
            //单例模式
            var me = $(this);
            var instance = new Tooltip(me,options);
            if($.type(options) === "string") return instance[options]();
        });
    };
    /**
     * 插件默认参数
     * [default description]
     * @type {Object}
     */
    $.fn.Tooltip.default ={
        linkid:'',//超链接id
        className:'',//定义tooltipbox的className
        html:'',//内容
        width:'',
        height:''
    };
})(jQuery);