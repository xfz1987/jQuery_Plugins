(function(){
    /*
    * 私有方法
    * 说明:获取浏览器前缀
    * 实现:判断某个元素的css样式中是否存在transition属性
    * 参数:dom元素
    * 返回值:boolean，有则返回浏览器样式前缀，否则返回false
    * */
    var _prefix = (function(temp){
        var aPrefix = ['webkit','Moz','o','ms'],
            props = '';
        for(var i in aPrefix){
            props = aPrefix[i] + 'Transition';
            if(temp.style[props] !== undefined){
                return '-' + aPrefix[i].toLowerCase() + '-';
            }
        }
        return false;
    })(document.createElement(PageSwitch));

    var PageSwitch = (function(){
        function PageSwitch(element,options){
            //jQuery的extend方法的作用：将用户自定义的插件参数与插件的默认参数加以合并
            this.settings = $.extend(true, $.fn.PageSwitch.default, options||{});
            this.element = element;
            this.init();
        }
        PageSwitch.prototype = {
            //初始化
            init : function(){
                var me = this;//PageSwitch对象
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections);
                me.section = me.sections.find(me.selectors.section);

                me.direction = me.settings.direction == 'vertical' ? true : false;
                me.pc = me.pagesCount();
                //检查配置参数index的值
                me.index = (me.settings.index>=0 && me.settings.index < me.pc) ? me.settings.index : 0;
                me.loop = me.settings.loop;
                me.canScroll = true;

                //如果是横屏
                if(!me.direction) me._initLayout();
                //是否进行分页处理
                if(me.settings.pagination) me._initPaging();
                //绑定事件
                me._initEvent();
            },
            /*获取滑动页面数量*/
            pagesCount : function(){
                return this.section.length;
            },
            /*获取滑动的宽度(横屏滚动)或高度(竖屏滑动)*/
            switchLength : function(){
                return this.direction ? this.element.height() : this.element.width();
            },
            /*向前滑动即上一页面*/
            prev : function(){
                var me = this;
                // alert(me.index);
                me.index = (me.index === 0 && me.loop) ? (me.pc - 1) : (me.index - 1);
                me._scrollPage();
            },
            /*向后滑动即下一页面*/
            next : function(){
                var me = this;
                me.index = (me.index === me.pc-1 && me.loop) ? 0 : (me.index + 1);
                me._scrollPage();
            },
            /*主要针对横屏情况进行页面布局*/
            _initLayout : function(){
                var me = this;
                var width = (me.pc * 100) + '%';
                var cellWidth = (100/me.pc).toFixed(2) + '%';
                me.sections.width(width);
                me.section.width(cellWidth).css('float','left');
            },
            /*实现分页的dom结构及css样式*/
            _initPaging : function(){
                var me = this,
                    pageClass = me.selectors.page.substring(1);
                me.activeClass = me.selectors.active.substring(1);
                var pageHtml = '<ul class="'+ pageClass +'">';
                for(var i= 0,len=me.pc;i<len;i++){
                    pageHtml += '<li></li>';
                }
                pageHtml += '</ul>';
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find('li');
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if(me.direction){
                    pages.addClass('vertical');
                }else{
                    pages.addClass('horizontal');
                }
            },
            /*初始化插件事件*/
            _initEvent : function(){
                var me = this;
                //点击事件
                me.element.on('click',me.selectors.page + ' li',function(){
                    me.index = $(this).index();
                    me._scrollPage();
                });

                /**
                 * 鼠标滚轮事件
                 * IE(含IE6)及其他: 支持mouseWheel
                 *   通过wheeldalta属性来判断:向下滚动，值为-120
                 * 火狐: DOMMouseScroll
                 *   通过detail属性来判断:向下滚懂，值为3,数值是相反的
                 * @return {[type]}      [description]
                 */
                me.element.on('mousewheel DOMMouseScroll',function(e){
                    if(me.canScroll){
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                        // if(delta > 0 && ((me.index && !me.settings.loop) || me.settings.loop)){//鼠标向上滑动
                        if(delta > 0 && (me.index && !me.settings.loop || me.settings.loop)){//鼠标向上滑动
                            me.prev();
                        }else if(delta < 0 && (me.index < (me.pc - 1) && !me.settings.loop || me.settings.loop)){
                            me.next();
                        }
                    }
                });

                //键盘事件
                if(me.settings.keyboard){
                    $(window).on('keydown',function(e){
                        switch(e.keyCode){
                            case 37 : me.prev();break;
                            case 38 : me.prev();break;
                            case 39 : me.next();break;
                            case 40 : me.next();break;
                        }
                    });
                }

                //当窗口改变大小时时间
                $(window).resize(function(){
                    var currentLength = me.switchLength(),
                        offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.sections.eq(me.index).offset().left;
                    if(Math.abs(offset) > currentLength/2 && me.index < me.pc -1){
                        me.index++;
                    }
                    if(me.index){
                        me._scrollPage();
                    }
                });

                //绑定transitionend事件
                me.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend',function(){
                    me.canScroll = true;

                    if(me.settings.callback && $.type(me.settings.callback) == 'function'){
                        me.settings.callback();
                    }
                });
            },

            /*滑动动画*/
            _scrollPage : function(){
                var me = this,
                    dest = me.section.eq(me.index).position();
                if(!dest) return;

                me.canScroll = false;

                if(_prefix){//浏览器支持transtion属性
                    me.sections.css(_prefix+'transition','all ' + me.settings.duration + 'ms ' + me.settings.easing);
                    var translate = me.direction ? 'translateY(-'+ dest.top +'px)' : 'translateX(-'+ dest.left +'px)';
                    me.sections.css(_prefix+'transform',translate);
                }else{
                    var animateCss = me.direction ? {top:-dest.top} : {left:-dest.left};
                    me.sections.animate(animateCss,me.settings.duration,function(){
                        me.canScroll = true;

                        if(me.settings.callback && $.type(me.settings.callback == 'function')){
                            me.settings.callback();
                        }
                    });
                }
                if(me.settings.pagination){
                    me.pageItem.eq(me.index).addClass(me.activeClass).siblings('li').removeClass(me.activeClass);
                }
             }
        };
        return PageSwitch;
    })();

    $.fn.PageSwitch = function(options){
        //链式调用
        return this.each(function(){
            //单例模式
            var me = $(this),
                instance = me.data('PageSwitch');
            if(!instance){
                instance = new PageSwitch(me,options);
                me.data('PageSwitch',instance);
            }
            if($.type(options) === "string") return instance[options]();
            // $('div').PageSwitch('init');
        });
    };
    /**
     * 插件默认参数
     * [default description]
     * @type {Object}
     */
    $.fn.PageSwitch.default ={
        selectors : {
            sections : ".sections",
            section : ".section",
            page : ".pages",
            active : ".active"
        },
        index : 0,//0表示默认从第一页开始展示
        easing : "ease",//动画效果
        duration : 500,//动画执行时间
        loop : true,//是否可以循环切换
        pagination : true,//是否进行分页
        keyboard : true,//是否触发键盘事件
        direction : "vertical",//竖屏:vertical、横屏:horizontal
        callback : ""//回调函数
    };
})(jQuery);