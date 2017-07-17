window.onload = function(){
    var doc = document,
        box = doc.querySelector('.box');
        right = doc.querySelector('#right'),
        up = doc.querySelector('#up'),
        left = doc.querySelector('#left'),
        down = doc.querySelector('#down'),
        leftUp = doc.querySelector('#left-up'),
        rightUp = doc.querySelector('#right-up'),
        leftDown = doc.querySelector('#left-down'),
        rightDown = doc.querySelector('#right-down'),
        mark = doc.querySelector('.mark'),
        img1 = doc.querySelector('.img1'),
        img2 = doc.querySelector('.img2'),
        img3 = doc.querySelector('.img3');

    var isKeyDown = false,//鼠标是否按下
        contact = '',
        isDragg = false,//被按下的触点
        disX, // 光标按下时光标和面板之间的距离
        disY,
        widthBefore,//选取框初始宽度，注意要减去border
        heightBefore,//选取框初始高度，注意要减去border
        addWidth,//鼠标移动后选取框增加的宽度
        addHeight,//鼠标移动后选取框增加的高度
        key = 'clipImg';


    //禁止图片被选中
    doc.onselectstart = new Function('event.returnValue=false;');

    //利用插件进行拖动
    //$(".mark").draggable({containment:'parent',drag:setChoice});

    //初始化预览
    preview();

    right.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'right';
    };

    up.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'up';
    };

    left.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'left';
    };

    down.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'down';
    };

    leftUp.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'leftUp';
    };

    rightUp.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'rightUp';
    };

    leftDown.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'leftDown';
    };

    rightDown.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'rightDown';
    };

    leftUp.onmousedown = function(e){
        e.stopPropagation();
        isKeyDown = true;
        contact = 'leftUp';
    };

    mark.onmousedown = function(e){
        //e.stopPropagation();
        isDragg = true;
        isKeyDown = false;
        //记录光标按下时光标和面板之间的距离
        disX=e.clientX - getPostion(mark).left;
        disY=e.clientY - getPostion(mark).top;
    };

    window.onmouseup = function(){
        isKeyDown = false;
        isDragg = false;
    };

    //鼠标移动事件
    window.onmousemove = function(e){
        if(isDragg){
            dragg(e);
        }

        if(!isKeyDown) return;
        switch(contact){
            case 'right': rightMove(e); break;
            case 'up': upMove(e);break;
            case 'left': leftMove(e);break;
            case 'down': downMove(e);break;
            case 'leftUp': leftMove(e);upMove(e);break;
            case 'rightUp': rightMove(e);upMove(e);break;
            case 'leftDown': leftMove(e);downMove(e);break;
            case 'rightDown': rightMove(e);downMove(e);break;
        }
        setChoice();
        preview();
    };

    function dragg(e){
        var boxLeft = getPostion(box).left,
            boxTop = getPostion(box).top,
            l = e.clientX - boxLeft - disX,//移动时，面框的位置
            t = e.clientY - boxTop - disY,
            maxW = box.offsetWidth - mark.offsetWidth,
            maxH = box.offsetHeight - mark.offsetHeight;
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
        mark.style.left = l + 'px';
        mark.style.top = t + 'px';

        setChoice();
    }

    function rightMove(e){
        var x = e.clientX;
        if(x > getPostion(box).left + box.offsetWidth){
            x = getPostion(box).left + box.offsetWidth;
        }
        widthBefore = mark.offsetWidth-2;
        addWidth = x - getPostion(mark).left - widthBefore;
        mark.style.width = widthBefore + addWidth + 'px';//选取框移动后的宽度
    }
    function upMove(e){
        var y = e.clientY;
        if(y < getPostion(box).top){
            y = getPostion(box).top;
        }
        heightBefore = mark.offsetHeight-2;
        addHeight = getPostion(mark).top - y;
        mark.style.height = heightBefore + addHeight + 'px';
        mark.style.top = mark.offsetTop - addHeight + 'px';
    }
    function leftMove(e){
        var x = e.clientX;
        if(x < getPostion(box).left){
            x = getPostion(box).left;
        }
        widthBefore = mark.offsetWidth-2,
        addWidth = getPostion(mark).left - x;
        mark.style.width =  widthBefore + addWidth + 'px';
        mark.style.left = mark.offsetLeft - addWidth + 'px';
    }
    function downMove(e){
        var y = e.clientY;
        if(y > getPostion(box).top + box.offsetHeight){
            y = getPostion(box).top + box.offsetHeight;
        }
        heightBefore = mark.offsetHeight-2,
        addHeight = y - getPostion(mark).top - heightBefore;
        mark.style.height = heightBefore + addHeight + 'px';
    }

    //获取元素相对于屏幕左边和上边的距离，利用offsetLeft
    function getPostion(node){
        var left = node.offsetLeft;
        var top = node.offsetTop;
        var parent = node.offsetParent;
        while(parent !== null){
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {'left':left,'top':top};
    }

    //设置选取区域高亮可见
    function setChoice(){
        var top = mark.offsetTop,
            right = mark.offsetLeft + mark.offsetWidth-2,
            bottom = mark.offsetTop + mark.offsetHeight-2,
            left = mark.offsetLeft;
        img2.style.clip = 'rect('+top+'px,'+right+'px,'+bottom+'px,'+left+'px)';

        //预览设置
        preview();
    }

    //预览
    function preview(){
        var top = mark.offsetTop,
            right = mark.offsetLeft + mark.offsetWidth-2,
            bottom = mark.offsetTop + mark.offsetHeight-2,
            left = mark.offsetLeft;
        img3.style.clip = 'rect('+top+'px,'+right+'px,'+bottom+'px,'+left+'px)';
        img3.style.top = -top + 'px';
        img3.style.left = -left + 'px';
    }

    //保存(用火狐打开)
    doc.querySelector('.btn-save').onclick = function(){
        var imgCanvas = doc.createElement('canvas'),
        ctx = imgCanvas.getContext('2d');
        imgCanvas.width = mark.offsetWidth -2;
        imgCanvas.height = mark.offsetHeight -2;

        //规定要使用的图像，(可选)开始剪切的 x 坐标位置,(可选)开始剪切的 y 坐标位置,(可选)被剪切图像的宽度。
        //(可选)被剪切图像的高度,在画布上放置图像的 x 坐标位置,在画布)上放置图像的 y 坐标位置,
        //(可选伸展或缩小图像)要使用的图像的宽度，(可选伸展或缩小图像要使用的图像的高度
        ctx.drawImage(img1,mark.offsetLeft,mark.offsetTop,imgCanvas.width,imgCanvas.height,0,0,imgCanvas.width,imgCanvas.height);
        //用data url的形式取出
        var imgAsDataURL = imgCanvas.toDataURL();
        try{
            localStorage.setItem(key,imgAsDataURL);
            window.location.reload();
        }catch(e){
            console.log('save failed:' + e);
        }
    };

    //获取保存后的图片
    (function(){
        var val = localStorage.getItem(key);
        if(val){
            var imgObj = document.createElement('img');
            imgObj.src = val;
            document.body.appendChild(imgObj);
        }
    })();
};



