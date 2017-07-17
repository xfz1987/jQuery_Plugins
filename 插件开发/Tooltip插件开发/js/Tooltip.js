(function(){
    // /*
    // * ˽�з���
    // * ˵��:��ȡ�����ǰ׺
    // * ʵ��:�ж�ĳ��Ԫ�ص�css��ʽ���Ƿ����transition����
    // * ����:domԪ��
    // * ����ֵ:boolean�����򷵻��������ʽǰ׺�����򷵻�false
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
            //jQuery��extend���������ã����û��Զ���Ĳ������������Ĭ�ϲ������Ժϲ�
            this.settings = $.extend(true, $.fn.Tooltip.default, options||{});
            this.element = element;
            this.init();
        }
        Tooltip.prototype = {
            //��ʼ��
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

                //left������ToolTip��ʾ�򳬳������
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
        //��ʽ����
        return this.each(function(){
            //����ģʽ
            var me = $(this);
            var instance = new Tooltip(me,options);
            if($.type(options) === "string") return instance[options]();
        });
    };
    /**
     * ���Ĭ�ϲ���
     * [default description]
     * @type {Object}
     */
    $.fn.Tooltip.default ={
        linkid:'',//������id
        className:'',//����tooltipbox��className
        html:'',//����
        width:'',
        height:''
    };
})(jQuery);