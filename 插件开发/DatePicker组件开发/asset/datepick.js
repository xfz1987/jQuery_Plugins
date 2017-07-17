//pc日期插件: create by xfz 2017/5/
(function(){
	var Datepicker = function(input){
		this.input = input;
		this.isOpen = false;      //日期是否展开
		this.wrap = undefined;  //日期插件外壳
		this.monthData = undefined;
		this._init();
	}
	
	Datepicker.prototype = {
		//初始化
		_init: function(){
			this.render();
			this.eventInit();
		},
		//获取input的值
		getInputValue: function(){
			var val = this.input.value;
			if(val){
				var arr = val.split('-');
				return {nyear: arr[0], nmonth: arr[1], ndate: arr[2]};
			}
			return undefined;
		},
		//渲染
		render: function(direct){
			var year,month,date,nyear,nmonth,ndate,dateObj = this.getInputValue();
			if(dateObj){
				year = dateObj.nyear;
				month = dateObj.nmonth;
				date = dateObj.ndate;
				nyear = dateObj.nyear;
				nmonth = dateObj.nmonth;
				ndate = dateObj.ndate;
			}

			if(this.monthData){
				year = this.monthData.year;
				month = this.monthData.month;
			}

			if(direct === 'prev'){
				if(--month<=0){
					month = 12;
					year--;
				}	
			} 
			if(direct === 'next') month++;

			if(!this.wrap){
				this.wrap = document.createElement('div');
				this.wrap.className = 'ui-datepicker-wrapper';
				document.body.appendChild(this.wrap);
			}
			this.wrap.innerHTML = this.renderUI(year, month, nyear, nmonth, ndate);
		},
		renderUI: function(year, month, nyear, nmonth, ndate){
			this.monthData = this.getMonthData(year, month);

			var arr = [],_html = '<div class="ui-datepicker-header">'
					+   			'<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>'
					+   			'<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'
					+   			'<span class="ui-datepicke-curr-month">'+ this.monthData.year + ' 年 ' + this.monthData.month +' 月</span>'
					+	   		'</div>'
					+	   		'<div class="ui-datepicker-body">'
					+      			'<table>'
					+       			'<thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>'
					+          			'<tbody>';
            
	  		for(var i=0,len=this.monthData.days.length;i<len;i++){
	  			var date = this.monthData.days[i];
	  			if(i%7 === 0) _html += '<tr>';
	  			if(year&&month){
	  				_html += '<td data-date="'+date.date+'" class="'+((year==nyear&&date.month==nmonth&&date.showDate==ndate&&date.canClick)?'active':'')+' '+(date.canClick||'no-trig')+'">' + date.showDate + '</td>';
	  			}else{
	  				_html += '<td data-date="'+date.date+'" class="'+((date.month==this.monthData.month&&date.showDate==this.monthData.tdate&&date.canClick)?'active':'')+' '+(date.canClick||'no-trig')+'">' + date.showDate + '</td>';
	  			}
	  			if(i%7 === 6) _html += '</tr>';
	  		}
			_html += '</tbody></table></div>';
			return _html;	
		},
		//获取某年某月内所有日期
		getMonthData: function(year, month){
	 		//如果没有传入年或月，则默认为现在
	 		if(!year || !month){
	 			var today = new Date(),_tdate = today.getDate();
	 	    	year = today.getFullYear();
	 	    	month = today.getMonth() + 1;
	 		}
	 		
	 		var firstDay = new Date(year, month-1, 1),//当月第一天
	 		    firstDayWeekDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay(), //当月第一天是星期几（星期日:0）
	 		    year = firstDay.getFullYear(),
	 		    month = firstDay.getMonth() + 1,
	 		    preMonthDayCount = firstDayWeekDay - 1,//第一行需要显示多少个上月的日期
				lastDay = new Date(year, month, 0),//当月最后一天
	 			lastDate = lastDay.getDate(),
	 			lastDayOfLastMonth = new Date(year, month-1, 0),//上月的最后一天
	 			lastDateOfLastMonth = lastDayOfLastMonth.getDate(),
	 			ret = [];//当月所有日期数据

	 		//获取当月所有日期:【六周的日期（6*7）2月:4周, 其他月:5或6周】
	 		for(var i=0;i<42;i++){
	 			var date = i - preMonthDayCount + 1,
	 				showDate = date,
	 				thisMonth = month,
	 				canClick = true;
	 			if(date <= 0){
	 				//prev month
	 				thisMonth = month - 1;
	 				showDate = lastDateOfLastMonth + date;
	 				canClick = false;
	 			}else if(date > lastDate){
	 				//next month
	 				thisMonth = month + 1;
	 				showDate -= lastDate;
	 				canClick = false;
	 			}
	 			//上一年12月份
	 			if(thisMonth === 0) this.thisMonth = 12;
	 			//下一年1月份
	 			if(thisMonth === 13) this.thisMonth = 1;
	 			ret.push({
	 				month: thisMonth,
	 				date: date,
	 				showDate: showDate,
	 				canClick: canClick
	 			});
	 		}

	 		return {year: year, month: month, days: ret, tdate: _tdate};
		},
		//事件初始化
		eventInit: function(){
			var _this = this;
			this.input.addEventListener('click',function(){
				if(_this.isOpen){
					_this.wrap.classList.remove('show');
					_this.isOpen = false;
				}else{
					_this.wrap.style.left = _this.input.offsetLeft + 'px';
					_this.wrap.style.top = _this.input.offsetTop + _this.input.offsetHeight + 2 + 'px';
					_this.wrap.classList.add('show');
					_this.isOpen = true;
				}
			},false);

			this.wrap.addEventListener('click',function(e){
				var e = window.event || e,target = e.target || e.srcElement;
				if(target.classList.contains('ui-datepicker-btn')) target.classList.contains('ui-datepicker-prev-btn') ? _this.render('prev') : _this.render('next');
				if(target.tagName.toLowerCase() === 'td' && !target.classList.contains('no-trig')){
					// var date = new Date(_this.monthData.year, _this.monthData.month-1,  _this.target.dataset.date);//新API，属性以data-xxx形式，可以使用dataset.xxx
					var date = new Date(_this.monthData.year, _this.monthData.month-1, target.getAttribute('data-date'));
			 		_this.input.value = _this.formate(date);
			 		_this.wrap.classList.remove('show');
			 		_this.timeSelect(target);
			 		_this.isOpen = false;
				}
			},false);
		},
		formate: function(date){
			return date.getFullYear() + '-' + this.padding(date.getMonth()+1) + '-' + this.padding(date.getDate());
		},
		padding: function(number){
			return number >=10 ? number : '0'+number;
		},
		timeSelect: function(td){
			var tds = td.parentNode.parentNode.getElementsByTagName('td');
			for(var i=0,len=tds.length;i<len;i++){
				var _td = tds[i];
				if(_td.classList.contains('active')){
					_td.classList.remove('active');
					break;	
				} 
			}
			td.classList.add('active');
		}
	}

	Datepicker.init = function(inputs){
		//判断是多个input，还是一个input:主要针对是通过id获取或class节点对象获取的节点集合
		////为每个节点绑定一个新的日期对象
		if(Object.prototype.toString.call(inputs) === '[object NodeList]'){
			var _this = this;
			inputs.forEach(function(item){new _this(item);});
		}else{
			new this(inputs);
		}		
	};

	//全局注册，将对象暴露出去
	window['datepicker'] = Datepicker;
})();
