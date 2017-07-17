var clipMap = function(selector,imgSelector){
    var box = $(selector),//父容器
        img1 = $(imgSelector),//第一层也就是图片本身
        mark,//第三层
        preview,
        isKeyDown = false,//鼠标是否按下
        isDragg = false,//被按下的触点
        contact = '',//被按下的触点
        widthBefore,//选取框初始宽度，注意要减去border
        heightBefore,//选取框初始高度，注意要减去border
        addWidth,//鼠标移动后选取框增加的宽度
        addHeight,//鼠标移动后选取框增加的高度
        disX, // 光标按下时光标和面板之间的距离
        disY;
    return {
        init : function(){
            this._setClipArea();
            //初始化预览
            this._preview();
            //禁止图片被选中
            document.onselectstart = new Function('event.returnValue=false;');

            this._initEvent();
            return this;
        },
        _setClipArea(){
            //给box定位
            box.css('position','relative');
            //设置第一层的样式
            img1.css('opacity','.5');
            //创建第二层并设置样式
            var boxW = box.width(),
                boxH = box.height(),
                imgSrc = img1.attr('src');
            img2 = $('<img class="img2" src="'+imgSrc+'">');
            img2.css({'position':'absolute','top':'0','left':'0','clip':'rect(0,200px,200px,0)'});
            img2.appendTo(box);
            //创建并设置第三层
            var markHtml = '<div class="mark" style="position:absolute;top:0;left:0;border:1px solid #fff;width:200px;height:200px;cursor:move;">'
                        +       '<div id="left-up" class="min" style="position:absolute;width:8px;height:8px;background:#fff;left:-4px;top:-4px;cursor:nw-resize;"></div>'
                        +       '<div id="up" class="min" style="position:absolute;width:8px;height:8px;background:#fff;left:50%;margin-left:-4px;top:-4px;cursor:n-resize;"></div>'
                        +       '<div id="right-up" class="min" style="position:absolute;width:8px;height:8px;background:#fff;right:-4px;top:-4px;cursor:ne-resize;"></div>'
                        +       '<div id="left" class="min" style="position:absolute;width:8px;height:8px;background:#fff;left:-4px;top:50%;margin-top:-4px;cursor:w-resize;"></div>'
                        +       '<div id="left-down" class="min" style="position:absolute;width:8px;height:8px;background:#fff;bottom:-4px;left:-4px;cursor:sw-resize;"></div>'
                        +       '<div id="down" class="min" style="position:absolute;width:8px;height:8px;background:#fff;bottom:-4px;left:50%;margin-left:-4px;cursor:s-resize;"></div>'
                        +       '<div id="right-down" class="min" style="position:absolute;width:8px;height:8px;background:#fff;bottom:-4px;right:-4px;cursor:se-resize;"></div>'
                        +       '<div id="right" class="min" style="position:absolute;width:8px;height:8px;background:#fff;top:50%;margin-top:-4px;right:-4px;cursor:e-resize;"></div>'
                        + '</div>';
            mark = $(markHtml);
            mark.appendTo(box);
            //创建并设置预览区
            var previewHtml = '<div class="preview" style="position:absolute;width:460px;height:360px;top:100px;left:670px;"><img class="img3" style="position:absolute;" src="'+imgSrc+'"></div>';
            preview = $(previewHtml);
            box.after(preview);
        },
        _rightMove:function(e){
            var x = e.clientX;
            if(x > this._getPostion(box).left + box.innerWidth()){
                x = this._getPostion(box).left + box.innerWidth();
            }
            widthBefore = mark.innerWidth();
            addWidth = x - this._getPostion(mark).left - widthBefore;
            mark.css('width',widthBefore + addWidth + 'px');//选取框移动后的宽度
        },
        _upMove:function(e){
            var y = e.clientY;
            if(y < this._getPostion(box).top){
                y = this._getPostion(box).top;
            }
            heightBefore = mark.innerHeight();
            addHeight = this._getPostion(mark).top - y;
            mark.css({'height':heightBefore + addHeight + 'px','top':mark[0].offsetTop - addHeight + 'px'});
        },
        _leftMove:function(e){
            var x = e.clientX;
            if(x < this._getPostion(box).left){
                x = this._getPostion(box).left;
            }
            widthBefore = mark.innerWidth(),
            addWidth = this._getPostion(mark).left - x;
            mark.css({'width':widthBefore + addWidth + 'px','left':mark[0].offsetLeft - addWidth + 'px'});
        },
        _downMove:function(e){
            var y = e.clientY;
            if(y > this._getPostion(box).top + box.innerHeight()){
                y = this._getPostion(box).top + box.innerHeight();
            }
            heightBefore = mark.innerHeight(),
            addHeight = y - this._getPostion(mark).top - heightBefore;
            mark.css({'height':heightBefore + addHeight + 'px'});
        },


        //获取元素相对于屏幕左边和上边的距离，利用offsetLeft
        _getPostion:function($obj){
            var left = $obj[0].offsetLeft;
            var top = $obj[0].offsetTop;
            var parent = $obj[0].offsetParent;
            while(parent !== null){
                left += parent.offsetLeft;
                top += parent.offsetTop;
                parent = parent.offsetParent;
            }
            return {'left':left,'top':top};
        },

        //设置选取区域高亮可见
        _setChoice:function(){
            var top = mark[0].offsetTop,
                bottom = top + mark.innerHeight(),
                left = mark[0].offsetLeft,
                right = left + mark.innerWidth();
            $('.img2').css('clip','rect('+top+'px,'+right+'px,'+bottom+'px,'+left+'px)');

            //预览设置
            this._preview();
        },

        //预览
        _preview:function(){
            var top = mark[0].offsetTop,
                bottom = top + mark.innerHeight(),
                left = mark[0].offsetLeft,
                right = left + mark.innerWidth();
            $('.img3').css('clip','rect('+top+'px,'+right+'px,'+bottom+'px,'+left+'px)');
            $('.img3').css({'top':-top + 'px','left':-left + 'px'});
        },
        _dragg:function(e){
            var boxLeft = this._getPostion(box).left,
                boxTop = this._getPostion(box).top,
                l = e.clientX - boxLeft - disX,//移动时，面框的位置
                t = e.clientY - boxTop - disY,
                maxW = box.innerWidth() - mark.outerWidth(),
                maxH = box.innerHeight() - mark.outerHeight();
            if(l < 0){
                l = 0;
            }else if (l > maxW) {
                l = maxW;
            }
            if (t < 0) {
                t = 0;
            } else if (t > maxH) {
                t = maxH;
            }
            mark.css({'left':l + 'px','top':t + 'px'});

            this._setChoice();
        },
        _initEvent:function(){
            var me = this;
            //拉动事件
            $('.box').on('mousedown','.min',function(e){
                e.stopPropagation();
                isKeyDown = true;
                contact = $(this).attr('id');
            });

            $(window).on('mouseup',function(){
                isKeyDown = false;
                isDragg = false;
            });

            //拖拽
            box.on('mousedown',mark,function(e){
                isDragg = true;
                isKeyDown = false;
                disX=e.clientX - me._getPostion(mark).left;
                disY=e.clientY - me._getPostion(mark).top;
            }),


            //鼠标移动事件
            $(window).on('mousemove',function(e){
                if(isDragg){
                    me._dragg(e);
                }

                if(!isKeyDown) return;
                switch(contact){
                    case 'right': me._rightMove(e); break;
                    case 'up': me._upMove(e);break;
                    case 'left': me._leftMove(e);break;
                    case 'down': me._downMove(e);break;
                    case 'left-up': me._leftMove(e);me._upMove(e);break;
                    case 'right-up': me._rightMove(e);me._upMove(e);break;
                    case 'left-down': me._leftMove(e);me._downMove(e);break;
                    case 'right-down': me._rightMove(e);me._downMove(e);break;
                }
                me._setChoice();
                me._preview();
            });
        },
        saveImg:function(callback){
            var imgCanvas = $('<canvas></canvas>')[0],
                ctx = imgCanvas.getContext('2d');
                imgCanvas.width = mark.innerHeight();
                imgCanvas.height = mark.innerWidth();
        //规定要使用的图像，(可选)开始剪切的 x 坐标位置,(可选)开始剪切的 y 坐标位置,(可选)被剪切图像的宽度。
        //(可选)被剪切图像的高度,在画布上放置图像的 x 坐标位置,在画布)上放置图像的 y 坐标位置,
        //(可选伸展或缩小图像)要使用的图像的宽度，(可选伸展或缩小图像要使用的图像的高度
            ctx.drawImage(img1[0],mark[0].offsetLeft,mark[0].offsetTop,imgCanvas.width,imgCanvas.height,0,0,imgCanvas.width,imgCanvas.height);
            //用data url的形式取出
            var imgAsDataURL = imgCanvas.toDataURL();
            callback(imgAsDataURL);
        }
    };
};
