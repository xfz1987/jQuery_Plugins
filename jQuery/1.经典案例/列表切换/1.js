$(function(){
  $(".list-1").bind("click",function(){
    $(".list-1").css("backgroundPosition","0px -26px");
    $(".list-2").css("backgroundPosition","-31px -26px");
    $(".changList").children().removeClass("list-2-v").addClass("list-1-o");
  });
  $(".list-2").bind("click",function(){
    $(".list-1").css("backgroundPosition","0px 0px");
    $(".list-2").css("backgroundPosition","-31px 0px");
    $(".changList").children().removeClass("list-1-o").addClass("list-2-v");
  });
});