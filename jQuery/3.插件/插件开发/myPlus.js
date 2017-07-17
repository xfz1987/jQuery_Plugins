//全局对象插件: 扩展全局对象
jQuery.extend({
	min : function(a,b){return a<b?a:b;},//取两个数的中的最小值
	max : function(a,b){return a>b?a:b;}//取两个数的中的最大值
});

/*
 * 创建一个对象函数插件
 * * 使用jQuery.fn.extend()方法来完成
 * 当前插件需要完成的功能:
 * * 检查选框是否被选中
 */
jQuery.fn.extend({
  check: function() {
    return this.each(function(){ this.checked = true; });
  },
  uncheck: function() {
    return this.each(function(){ this.checked = false; });
  }
});