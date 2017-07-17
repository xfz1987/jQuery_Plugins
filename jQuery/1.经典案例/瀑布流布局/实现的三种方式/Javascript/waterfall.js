window.onload = function(){
    waterfall('main','box');
    var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};
    //拖动滚动条动态加载数据
    window.onscroll = function(){
        if(checkScrollSlide()){
            var doc = document,
                parent = doc.querySelector('.main');
            for(var i=0,data=dataInt.data,len=data.length;i<len;i++){
                var box=doc.createElement('div');
                box.className='box';
                parent.appendChild(box);
                var pic=doc.createElement('div');
                pic.className='pic';
                box.appendChild(pic);
                var img=doc.createElement('img');
                img.src='../../images/'+data[i].src;
                pic.appendChild(img);
            }
            //为新生成的box定位
            waterfall('main','box');
        }
    };
};

function waterfall(parent,box){
    var doc = document,
        oParent = doc.querySelector('.main'),
        boxs = oParent.querySelectorAll('.box'),
        boxW = boxs[0].offsetWidth,//202
        //计算一行内显示的列数（页面宽/box宽）
        clos = Math.floor((doc.documentElement.clientWidth||doc.body.clientWidth)/boxW);
    //给容器设定宽度，这样就不随屏幕大小变化而变化了
    oParent.style.cssText = 'width:'+boxW*clos + 'px;margin:0 auto';

    //存房每一列高度的数组
    var hArr = [];
    for(var i=0,len=boxs.length;i<len;i++){
        if(i<clos){//第一行
            hArr.push(boxs[i].offsetHeight);
        }else{//第二行至...
            //获取最小高度的box
            var minH = Math.min.apply(null,hArr);
            //上一行最小高度的box的left是m，就将这一行中的box设置为m，它就在下面了
            //获取最小高度的box在数组中的索引
            var index = getMinHeightIndex(hArr,minH);
            boxs[i].style.position = 'absolute';
            boxs[i].style.top = minH + 'px';
            //方式一
            boxs[i].style.left = boxW*index+'px';
            //方式二
            //boxs[i].style.left = boxs[index].style.left + 'px';

            //之后第二行的图片都重叠了，如果将高度最小的图片的高度加上第二行第一个要移动到它下面的图片的高度
            //其它图片重新寻找最小高度的图片了，解决的重叠现象
            hArr[index] = hArr[index] + boxs[i].offsetHeight;
        }
    }
}

function getMinHeightIndex(arr,val){
    for(var i=0,len=arr.length;i<len;i++){
        if(arr[i] === val){
            return i;
        }
    }
}

//检查是否可以向下滑动加载图片
function checkScrollSlide(){
    var doc = document,
        oParent = doc.querySelector('.main'),
        boxs = oParent.querySelectorAll('.box'),
        //最后一张图片距顶部的距离 + 最后一张图片的高度/2
        lastBoxH = boxs[boxs.length-1].offsetTop + Math.floor(boxs[boxs.length-1].offsetHeight/2),
        //滚动条滚动的距离 + 当前显示的视口高度
        scrollTop = (doc.documentElement.scrollTop || doc.body.scrollTop) + (doc.documentElement.clientHeight || doc.body.clientHeight);
        return scrollTop>lastBoxH;
}


