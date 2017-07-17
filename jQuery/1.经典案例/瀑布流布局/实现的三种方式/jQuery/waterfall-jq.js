$(function(){
    waterfall();
    var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};
    //拖动滚动条动态加载数据
    $(window).on('scroll',function(){
        if(checkScrollSlide()){
            var html = '';
            $.each(dataInt.data,function(key,val){
                html += '<div class="box"><div class="pic"><img src="../../images/'+ val.src +'"></div></div>';
            });
            console.log(html);
            $('.main').append($(html));
            //为新生成的box定位
            waterfall();
        }
    });
});

function waterfall(){
    var boxs = $('.main .box'),
        boxW = boxs.eq(0).outerWidth(),//202
        //计算一行内显示的列数（页面宽/box宽）
        clos = Math.floor($(window).width()/boxW);
    //给容器设定宽度，这样就不随屏幕大小变化而变化了
    $('.main').css({'width':boxW*clos+'px','margin':'0 auto'});

    //存房每一列高度的数组
    var hArr = [];
    boxs.each(function(index, el) {
        var h = boxs.eq(index).outerHeight();
        if(index<clos){//第一行
            hArr.push(h);
        }else{//第二行至...
            //获取最小高度的box
            var minH = Math.min.apply(null,hArr);
            //上一行最小高度的box的left是m，就将这一行中的box设置为m，它就在下面了
            //获取最小高度的box在数组中的索引
            //该函数返回 minH 在 hArr中的索引
            var minHIndex = $.inArray(minH,hArr);
            //设置图片的位置
            $(el).css({'position':'absolute','top':minH+'px','left':boxW*minHIndex});
            //之后第二行的图片都重叠了，如果将高度最小的图片的高度加上第二行第一个要移动到它下面的图片的高度
            //其它图片重新寻找最小高度的图片了，解决的重叠现象
            hArr[minHIndex] = hArr[minHIndex] + $(el).outerHeight();
        }
    });
}

//检查是否可以向下滑动加载图片
function checkScrollSlide(){
    var lastBox = $('.main .box').last(),
        //最后一张图片距顶部的距离 + 最后一张图片的高度/2
        lastBoxH = lastBox.offset().top + Math.floor(lastBox.outerHeight()/2),
        //滚动条滚动的距离 + 当前显示的视口高度
        scrollTop = $(window).scrollTop() + $(window).height();
    return scrollTop>lastBoxH;
}