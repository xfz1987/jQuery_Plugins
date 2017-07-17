;(function($){
    var Star = function(poster){
        //保存单星星区域
        this.poster = poster;
        this.item = poster.find('>');
        this.msg = poster.parent().find('.msg');
        this.total = this.item.length;
        this.initEvent();
        this.clicked = false;
        this._count = parseInt(poster.attr('data-count'));//保存上一次的记录
    };
    Star.prototype = {
        initEvent:function(){
            var me = this;
            me.item.click(function(){
                me.clicked = true;
                var count = $(this).index() + 1;
                me.changeStar(count);
            });
            me.item.hover(
                function(){
                    var count = $(this).index() + 1;
                    me.changeStar(count);
                },
                function(){
                    if(me.clicked){
                        me.clicked = false;
                        me._count = me.poster.attr('data-count');
                    }else{
                        me.poster.attr('data-count',me._count);
                        me.msg.text(+me._count ? me._count+'分' : '');
                    }
                }
            );
        },
        changeStar:function(count){
            var me = this;
            me.poster.attr('data-count',count);
            me.msg.text(count + '分');
        }

    };
    Star.init = function(posters){
        var me = this;
        posters.each(function(){
            if($(this).attr('data-edit') === 'true') new me($(this));//this为循环中的每一个对象
        });
    };
    //全局注册，否则外面访问不到
    window['Star'] = Star;
})(jQuery);