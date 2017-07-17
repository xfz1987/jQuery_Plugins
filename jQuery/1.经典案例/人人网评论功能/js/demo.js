$(function(){
    var timer;

    //关闭分享
    $('.box .close').on('click',function(){
        $(this).parent('.box').remove();
    });

    //点赞功能
    $('.box .praise').on('click',function(){
        var praiseBox = $(this).parent().next('.praises-total');
        var oldTotal = parseInt(praiseBox.attr('total'));
        var newTotal;
        if($(this).html() === '赞'){
            newTotal = oldTotal + 1;
            praiseBox.html(newTotal ===1 ? '我觉得很赞' : '我和' + oldTotal + '个人觉得很赞');
            $(this).html('取消赞');
        }else{
             newTotal = oldTotal - 1;
             praiseBox.html(newTotal ===0 ? '' : newTotal + '个人觉得很赞');
             $(this).html('赞');
        }
        praiseBox.attr('total',newTotal).css('display',newTotal===0?'none':'block');
    });

    //评论功能
    $('.text-box .comment').bind({
        'focus':function(){
            $(this).parent().addClass('text-box-on');
            if($(this).val()==='评论…'){
                $(this).val('').next().addClass('btn-off');
            }
        },
        'blur':function(){
            var me = $(this);
            if($(this).val()===''){
                timer = setTimeout(function(){
                    me.val('评论…').parent().removeClass('text-box-on');
                },400);
            }
        },
        'keyup':function(){
            var $words = $(this),
                parent = $words.parent(),
                len = $words.val().length,
                t = parent.find('.word').text(),
                maxLen = t.substring(t.indexOf('/')+1);
            if(len === 0){
                parent.find('.btn').addClass('btn-off');
            }else if(len>maxLen){
                parent.find('.btn').addClass('btn-off').end().find('.word .length').html(len);
            }else{
                parent.find('.btn').removeClass('btn-off').end().find('.word .length').html(len);
            }
        }
    });

    //两个元素绑定同一事件:通过消除定时器来来清除mouseover的隐藏效果
    $('.btn,.btn-off').bind('click',function(){
        clearTimeout(timer);
        timer = null;
    });

    //发表评论
    $('.btn').on('click', function() {
       replyBox($(this).parent().parent().parent());
    });

    function replyBox(box){
        var input = box.find('.comment').val(),
            list = box.find('.comment-list'),
            html = '<div class="comment-box clearfix" user="self">'
                      + '<img class="myhead" src="images/my.jpg" alt=""/>'
                      + '<div class="comment-content">'
                      +      '<p class="comment-text"><span class="user">我：</span>' + input + '</p>'
                      +      '<p class="comment-time">'
                      +         formateDate(new Date())
                      +         '<a href="javascript:;" class="comment-praise" total="0" my="0" style="">赞</a>'
                      +         '<a href="javascript:;" class="comment-operate">删除</a>'
                      +     '</p>'
                      + '</div>'
                 + '</div>';
        list.append($(html));
        box.find('.comment').val('评论…').parent().removeClass('text-box-on');
    }

    //赞回复功能
    $('.comment-list').on('click','.comment-praise',function(){
        var me = $(this),
            oldTotal = parseInt(me.attr('total')),
            my = parseInt(me.attr('my')),
            newTotal;
            if(!my){
                newTotal = oldTotal+1;
                $(this).attr({'total':newTotal,'my':1}).html(newTotal+' 取消赞');
            }else{
                newTotal = oldTotal-1;
                $(this).attr({'total':newTotal,'my':0}).html(newTotal?newTotal+' 赞':'赞');
            }
            $(this).css('display',newTotal?'inline-block':'');
    });

    //格式化日期
    function formateDate(date){
        var year = date.getFullYear(),
            month = date.getMonth()+1,
            day = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes();
        month = month > 9 ? month : '0'+month;
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
    }

    //回复功能
    $('.comment-list').on('click','.comment-operate',function() {
        var op = $(this).html(),
            comBox = $(this).parent().parent().parent(),//评论容器
            box = comBox.parent().parent().parent(),//分享容器
            input = box.find('.comment').val(),
            user = comBox.find('.user').html().replace(':','');
            console.log(op);
        if(op === '回复'){
           box.find('.comment').val('回复'+user).focus().keyup();
        }else{
            console.log(222);
            comBox.remove();
        }
    });

});
