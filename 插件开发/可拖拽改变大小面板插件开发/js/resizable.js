(function() {

    //面板，ctrl控制元素，type:r\b\rb
    var m_panel, m_ctrl, m_type,m_title;
    /**
     * 鼠标是否按在控制元素，开始拖动，
     * 鼠标相对ctrl的left，top
     * 鼠标的新位置
     */
    var moving = 0,
        m_start_x = 0,
        m_start_y = 0,
        m_to_x = 0,
        m_to_y = 0,
        min_width = 0,
        min_height = 0,
        disX = 0,
        disY = 0,
        canMove = false;

    var Resizeable = (function() {
        function Resizeable(element) {
            this.element = element;
            this.init();
        }
        Resizeable.prototype = {
            init: function() {
                var me = this;
                m_panel = me.element;
                min_width = m_panel.outerWidth();
                min_height = m_panel.outerHeight();
                m_title = m_panel.find('.title');
                m_title.css('cursor','move');
                //创建控制元素
                me._createCtrls();
                me._drag();
                //绑定事件
                me._initEvent();

            },
            _createCtrls: function() {
                var me = this;
                var html = '<div class="ui-resize-ctrl" data-derict="r" style="position:absolute;right:0;bottom:0;width:10px;height:100%;cursor:e-resize;"></div><div class="ui-resize-ctrl" data-derict="b" style="position:absolute;right:0;bottom:0;width:100%;height:10px;cursor:n-resize;"></div><div class="ui-resize-ctrl" data-derict="rb" style="position:absolute;right:0;bottom:0;width:10px;height:10px;cursor:nw-resize;s"></div>';
                m_panel.append(html);

                m_panel.on('mousedown', '.ui-resize-ctrl', function(e) {
                    m_ctrl = $(this);
                    //计算鼠标在页面位置以及鼠标在当前控制元素的位置
                    m_start_x = e.pageX - m_ctrl[0].offsetLeft;
                    m_start_y = e.pageY - m_ctrl[0].offsetTop;
                    m_type = m_ctrl.attr('data-derict');
                    moving = setInterval(me.on_move, 10);
                });
            },
            on_move: function() {
                if (!moving) return;
                var to_x = m_to_x - m_start_x;
                to_x = Math.max(to_x,300);
                var to_y = m_to_y - m_start_y;
                to_y = Math.max(to_y,200);
                switch(m_type){
                    case 'r':
                        m_ctrl[0].style.left = to_x + 'px';
                        m_panel[0].style.width = to_x + 10 + 'px';
                        break;
                    case 'b':
                        m_ctrl[0].style.top = to_y + 'px';
                        m_panel[0].style.height = to_y + 10 + 'px';
                        break;
                    case 'rb':
                        m_ctrl[0].style.left = to_x + 'px';
                        m_ctrl[0].style.top = to_y + 'px';
                        m_panel[0].style.width = to_x + 10 +'px';
                        m_panel[0].style.height = to_y + 10 +'px';
                        break;
                }
            },
            _initEvent: function() {
                var me = this;
                //鼠标移动时
                document.onmousemove = function(e) {
                    m_to_x = e.pageX;
                    m_to_y = e.pageY;
                    me.fn_move(e);
                };
                //鼠标松开时
                document.onmouseup = function() {
                    clearInterval(moving);
                    moving = 0;
                    $('.ui-resize-ctrl').each(function(index, el) {
                        $(el).css({'left':'','top':''});
                    });
                    canMove = false;
                    //document.onmousemove=null;
                    //document.onmouseup=null;
                };
            },
            // 拖曳
            _drag:function(){
                m_title.on('mousedown',function(e){
                    // 光标按下时光标和面板之间的距离
                    disX=e.clientX - m_panel[0].offsetLeft;
                    disY=e.clientY - m_panel[0].offsetTop;
                    canMove = true;
                });

            },
            fn_move: function(e) {
                if(canMove){
                                    //移动时，面框的位置
                var l = e.clientX - disX,
                    t = e.clientY - disY,
                    winW = document.documentElement.clientWidth || document.body.clientWidth,
                    winH = document.documentElement.clientHeight || document.body.clientHeight,
                    maxW = winW - m_panel[0].offsetWidth - 10,
                    maxH = winH - m_panel[0].offsetHeight;
                if (l < 0) {
                    l = 0;
                } else if (l > maxW) {
                    l = maxW;
                }
                if (t < 0) {
                    t = 10;
                } else if (t > maxH) {
                    t = maxH;
                }
                m_panel[0].style.left = l + 'px';
                m_panel[0].style.top = t + 'px';
                }

            }
        };
        return Resizeable;
    })();

    $.fn.Resizeable = function() {
        return this.each(function() {
            var me = $(this),
                instance = me.data('Resizeable');
            if (!instance) {
                instance = new Resizeable(me);
                me.data('Resizeable', instance);
            }
            return instance;
        });
    };
})(jQuery);