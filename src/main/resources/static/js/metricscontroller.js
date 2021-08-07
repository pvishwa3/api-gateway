app.controller("metricsContoller", ['$scope', 'merticsFactory','$rootScope','$timeout','$uibModal','conditionCategoryFactory','conditionCategoryFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder' ,'conditionTypeFactory','$ngConfirm','widgetService',function ($scope, merticsFactory,$rootScope, $timeout,$uibModal,conditionCategoryFactory,conditionCategoryFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,conditionTypeFactory,$ngConfirm,widgetService) {


	var self = this;
	$scope.startTime = moment(new Date()).startOf('day');

	$scope.endTime = moment(new Date());
	
	
	$('.metric-daterange-ranges span').html('Today');

	if(sessionStorage.getItem("themeType")==='theme-dark-full'){
		themeName = "chalk"
	}else{
		themeName = "infographic"
	}

	$scope.themOptions  = {};

	self.loadTheme = function(){
		widgetService.loadSingleTheme(themeName).then(function (response) {		

			$scope.themOptions = response.data

		}, function (error) {

		});

	}



	var widgetDateRagne =  $('.widget-daterange-ranges').daterangepicker({
		timePicker: true,
		format: 'MM/DD/YYYY',


		showWeekNumbers: true,
		opens: 'right',
		drops: 'down',

		ranges: {
			'Last 15 Min': [moment(new Date()).subtract(15, 'minutes'), moment(new Date())],
			'Last 30 Min': [moment(new Date()).subtract(30, 'minutes'), moment(new Date())],
			'Last 1 Hour': [moment(new Date()).subtract(1, 'hours'), moment(new Date())],
			'Last 4 Hour': [moment(new Date()).subtract(4, 'hours'), moment(new Date())],
			'Last 12 Hour': [moment(new Date()).subtract(12, 'hours'), moment(new Date())],
			'Today': [moment(new Date()).startOf('day'), moment(new Date()).endOf('day')],
			'Yesterday': [moment(new Date()).subtract(1, 'days').startOf('day'), moment(new Date()).subtract(1, 'days').endOf('day')],
			'Last 7 Days': [moment(new Date()).subtract(6, 'days'), moment(new Date())],
			'Last 30 Days': [moment(new Date()).subtract(29, 'days'), moment(new Date())],
			'This Month': [moment(new Date()).startOf('month'), moment(new Date()).endOf('month')],
			'Last Month': [moment(new Date()).subtract(1, 'month').startOf('month'), moment(new Date()).subtract(1, 'month').endOf('month')]
		},
		buttonClasses: ['btn', 'btn-sm'],
		applyClass: 'btn-success',
		cancelClass: 'btn-default',
		separator: ' to ',
		locale: {
			applyLabel: 'Submit',
			cancelLabel: 'Cancel',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			firstDay: 1
		}
	}, function (start, end, label) {

		var object = $(this);
		var timePcikerId = object[0].element[0].id

		var startDate ;
		var endDate = moment(new Date());

		if(label==="Last 15 Min"){
			startDate = moment(new Date()).subtract(15, 'minutes');


		}
		if(label==="Last 30 Min"){
			startDate = moment(new Date()).subtract(30, 'minutes');

		}
		if(label==="Last 1 Hour"){
			startDate = moment(new Date()).subtract(1, 'hours');
		}
		if(label==="Last 4 Hour"){
			startDate = moment(new Date()).subtract(4, 'hours');
		}
		if(label==="Last 12 Hour"){
			startDate = moment(new Date()).subtract(12, 'hours');
		}
		if(label==="Today"){
			startDate = moment(new Date()).startOf('day');
		}
		if(label==="Yesterday"){
			startDate = moment(new Date()).subtract(1, 'days').startOf('day');
			endDate = moment(new Date()).subtract(1, 'days').endOf('day');
		}
		if(label==="Last 7 Days"){
			startDate = moment(new Date()).subtract(6, 'days');
		}
		if(label==="Last 30 Days"){
			startDate = moment(new Date()).subtract(30, 'days')
		}
		if(label==="This Month"){
			startDate = moment(new Date()).startOf('month')
		}
		if(label==="Last Month"){
			startDate = moment(new Date()).subtract(1, 'month').startOf('month');
		}


		if(label==="Custom"){

			$('#'+timePcikerId+' span').html(start.format('YYYY/MM/DD HH:mm:ss') + ' - ' + moment(end).format('YYYY/MM/DD HH:mm:ss'));
			$scope.startTime = start;
			$scope.endTime = end;

		}else{
			$('#'+timePcikerId+' span').html(label);
			$scope.startTime = startDate;
			$scope.endTime = endDate;
		}
		if(timePcikerId==='timerange_events_per_second'){
			self.loadEventsPerSecond($scope.startTime,$scope.endTime);
		}
		if(timePcikerId==='timerange_log_trend_per_second'){
			self.loadLogsOverTime($scope.startTime,$scope.endTime);
		}
		if(timePcikerId==='timerange_logvolume_per_second'){
			self.loadLogVolume($scope.startTime,$scope.endTime);
		}
		if(timePcikerId==='timerange_log_volume_per_second'){
			self.loadLogsVolumeOverTime($scope.startTime,$scope.endTime);
		}
		if(timePcikerId==='timerange_top_sending_devices_per_second'){
			self.loadTopSendingDevices($scope.startTime,$scope.endTime);
		}
		if(timePcikerId==='timerange_events_by_category'){
			self.loadTopEventsByCategory($scope.startTime,$scope.endTime);
		}
		if(timePcikerId==='timerange_top_events_per_second'){
			self.loadTopEvents($scope.startTime,$scope.endTime);
		}

		
		
		
		
		
		
		
		

	});


	var dateRange = 	$('.metric-daterange-ranges').daterangepicker({
		timePicker: true,
		format: 'MM/DD/YYYY',


		showWeekNumbers: true,
		opens: 'right',
		drops: 'down',

		ranges: {
			'Last 15 Min': [moment(new Date()).subtract(15, 'minutes'), moment(new Date())],
			'Last 30 Min': [moment(new Date()).subtract(30, 'minutes'), moment(new Date())],
			'Last 1 Hour': [moment(new Date()).subtract(1, 'hours'), moment(new Date())],
			'Last 4 Hour': [moment(new Date()).subtract(4, 'hours'), moment(new Date())],
			'Last 12 Hour': [moment(new Date()).subtract(12, 'hours'), moment(new Date())],
			'Today': [moment(new Date()).startOf('day'), moment(new Date()).endOf('day')],
			'Yesterday': [moment(new Date()).subtract(1, 'days').startOf('day'), moment(new Date()).subtract(1, 'days').endOf('day')],
			'Last 7 Days': [moment(new Date()).subtract(6, 'days'), moment(new Date())],
			'Last 30 Days': [moment(new Date()).subtract(29, 'days'), moment(new Date())],
			'This Month': [moment(new Date()).startOf('month'), moment(new Date()).endOf('month')],
			'Last Month': [moment(new Date()).subtract(1, 'month').startOf('month'), moment(new Date()).subtract(1, 'month').endOf('month')]
		},
		buttonClasses: ['btn', 'btn-sm'],
		applyClass: 'btn-success',
		cancelClass: 'btn-default',
		separator: ' to ',
		locale: {
			applyLabel: 'Submit',
			cancelLabel: 'Cancel',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			firstDay: 1
		}
	}, function (start, end, label) {

		var object = $(this);
		var timePcikerId = object[0].element[0].id

		var startDate ;
		var endDate = moment(new Date());

		if(label==="Last 15 Min"){
			startDate = moment(new Date()).subtract(15, 'minutes');


		}
		if(label==="Last 30 Min"){
			startDate = moment(new Date()).subtract(30, 'minutes');

		}
		if(label==="Last 1 Hour"){
			startDate = moment(new Date()).subtract(1, 'hours');
		}
		if(label==="Last 4 Hour"){
			startDate = moment(new Date()).subtract(4, 'hours');
		}
		if(label==="Last 12 Hour"){
			startDate = moment(new Date()).subtract(12, 'hours');
		}
		if(label==="Today"){
			startDate = moment(new Date()).startOf('day');
		}
		if(label==="Yesterday"){
			startDate = moment(new Date()).subtract(1, 'days').startOf('day');
			endDate = moment(new Date()).subtract(1, 'days').endOf('day');
		}
		if(label==="Last 7 Days"){
			startDate = moment(new Date()).subtract(6, 'days');
		}
		if(label==="Last 30 Days"){
			startDate = moment(new Date()).subtract(30, 'days')
		}
		if(label==="This Month"){
			startDate = moment(new Date()).startOf('month')
		}
		if(label==="Last Month"){
			startDate = moment(new Date()).subtract(1, 'month').startOf('month');
		}


		if(label==="Custom"){

			$('.metric-daterange-ranges span').html(start.format('YYYY/MM/DD HH:mm:ss') + ' - ' + moment(end).format('YYYY/MM/DD HH:mm:ss'));
			$scope.startTime = start;
			$scope.endTime = end;

		}else{
			$('.metric-daterange-ranges span').html(label);
			$scope.startTime = startDate;
			$scope.endTime = endDate;
		}


		self.loadEventsPerSecond($scope.startTime,$scope.endTime);
		self.loadLogsOverTime($scope.startTime,$scope.endTime);
		self.loadLogVolume($scope.startTime,$scope.endTime);
		self.loadLogsVolumeOverTime($scope.startTime,$scope.endTime);
		self.loadTopSendingDevices($scope.startTime,$scope.endTime);
		self.loadTopEvents($scope.startTime,$scope.endTime);
		self.loadTopEventsByCategory($scope.startTime,$scope.endTime);

	});


	self.loadEventsPerSecond = function(startDate,endDate){
		merticsFactory.getEventsPerSecond(startDate,endDate).then(function (response){
			var option = {
					tooltip : {
						formatter: "{a} <br/>{b} : {c}"
					},

					series: [
						{
							name: 'Events Per Second',
							type: 'gauge',

							data: [{value: response.data.eventsPerSecond}],
							axisLine: {           
								lineStyle: {      
									width: 3
								}
							},
							detail: {
								formatter: '{value}',
								textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									color: 'auto',
									fontWeight: 'bolder',
									fontSize: 20
								}
							},
							splitNumber: 10, 
							center: ['55%', '55%'],
							axisLine: {            // 坐标轴线
								lineStyle: {       // 属性lineStyle控制线条样式
									color: [
										[0.2, '#228b22'],
										[0.8, '#48b'],
										[1, '#ff4500']
										],
										width: 8
								}
							},
							title : {


								fontSize: 14,
								color:'white'
							},
							axisTick: {            // 坐标轴小标记
								splitNumber: 10,   // 每份split细分多少段
								length: 12,        // 属性length控制线长
								lineStyle: {       // 属性lineStyle控制线条样式
									color: 'auto'
								}
							},
							axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
								textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									color: 'auto'
								}
							},
							splitLine: {           // 分隔线
								show: true,        // 默认显示，属性show控制显示与否
								length: 20,         // 属性length控制线长
								lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
									color: 'auto'
								}
							},
							pointer: {
								width: 5
							},
							detail: {
								formatter: '{value}',
								textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									color: 'auto',
									fontWeight: 'bolder',
									fontSize: 20
								}
							},
						}
						]
			};
			var chart = document.getElementById('events_per_second_container');
			var myChart = echarts.init(chart);

			echarts.registerTheme(themeName, $scope.themOptions)
			var	myChart = echarts.init(chart, themeName);
			myChart.setOption(option);


		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}
	
	self.loadLogVolume = function(startDate,endDate){
		merticsFactory.loadLogVolume(startDate,endDate).then(function (response){
			var option = {
					tooltip : {
						formatter: "{a} <br/>{b} : {c}"
					},

					series: [
						{
							name: response.data.label,
							type: 'gauge',

							data: [{value: response.data.value,name:response.data.label}],
							axisLine: {           
								lineStyle: {      
									width: 3
								}
							},
							detail: {
								formatter: '{value}',
								textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									color: 'auto',
									fontWeight: 'bolder',
									fontSize: 20
								}
							},
							splitNumber: 10, 
							center: ['55%', '55%'],
							axisLine: {            // 坐标轴线
								lineStyle: {       // 属性lineStyle控制线条样式
									color: [
										[0.2, '#228b22'],
										[0.8, '#48b'],
										[1, '#ff4500']
										],
										width: 8
								}
							},
							title : {


								fontSize: 14,
								color:'white'
							},
							axisTick: {            // 坐标轴小标记
								splitNumber: 10,   // 每份split细分多少段
								length: 12,        // 属性length控制线长
								lineStyle: {       // 属性lineStyle控制线条样式
									color: 'auto'
								}
							},
							axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
								textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									color: 'auto'
								}
							},
							splitLine: {           // 分隔线
								show: true,        // 默认显示，属性show控制显示与否
								length: 20,         // 属性length控制线长
								lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
									color: 'auto'
								}
							},
							pointer: {
								width: 5
							},
							detail: {
								formatter: '{value}',
								textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									color: 'auto',
									fontWeight: 'bolder',
									fontSize: 20
								}
							},
						}
						]
			};
			var chart = document.getElementById('log_volume_container');
			var myChart = echarts.init(chart);

			echarts.registerTheme(themeName, $scope.themOptions)
			var	myChart = echarts.init(chart, themeName);
			myChart.setOption(option);


		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.loadLogsOverTime = function(startDate,endDate){
		merticsFactory.getLogTrend(startDate,endDate).then(function (response){

			var option = option = {
				    xAxis: {
				        type: 'category',
				        data: response.data.data.catgeories
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: [{
				        data: response.data.data.values,
				        type: 'line'
				    }]
				};
			var chart = document.getElementById('log_trend_container');
			echarts.registerTheme(themeName, $scope.themOptions)
			var myChart = echarts.init(chart,themeName);
			myChart.setOption(option);
			//log_trend_container
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});

	}
	
	self.loadLogsVolumeOverTime = function(startDate,endDate){
		merticsFactory.loadLogVolumeOverTime(startDate,endDate).then(function (response){

			var option = option = {
				    xAxis: {
				        type: 'category',
				        data: response.data.categories
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: [{
				        data: response.data.values,
				        type: 'line'
				    }]
				};
			var chart = document.getElementById('log_over_time_trend_container');
			echarts.registerTheme(themeName, $scope.themOptions)
			var myChart = echarts.init(chart,themeName);
			myChart.setOption(option);
			//log_trend_container
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});

	}
	self.loadTopSendingDevices = function(startDate,endDate){
		merticsFactory.loadTopSendingDevices(startDate,endDate).then(function (response){

			var option = option = {
				    xAxis: {
				        type: 'category',
				        data: response.data.catgeories
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: [{
				        data: response.data.values,
				        type: 'bar'
				    }]
				};
			var chart = document.getElementById('top_seding_devices_container');
			echarts.registerTheme(themeName, $scope.themOptions)
			var myChart = echarts.init(chart,themeName);
			myChart.setOption(option);
			//log_trend_container
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});

	}
	
	self.loadTopEvents = function(startDate,endDate){
		merticsFactory.loadTopEvents(startDate,endDate).then(function (response){

			var seriesData = [];
			for(var i=0;i<response.data.catgeories.length;i++){
				 seriesData.push({
			            name: response.data.catgeories[i],
			            value: response.data.values[i]
			        });
			}
			
			var option  = {
		            legend: {
		            	type:'scroll',
		                orient: 'horizontal',
		                left: 'right',
		                data: response.data.catgeories,
		                bottom:'0'
		            },
		            grid: { 
		            		top: '20%'
		                 },
		            tooltip: {
		                trigger: 'item',
		                formatter: "{a} <br/>{b} : {c} ({d}%)"
		            },
		            toolbox: false,
				    series: [{
				    	itemStyle: {
		                    normal: {
		                        label: {
		                            show: false,
		                            //position:'inside',
		                            formatter: '{b}: {d}%'
		                        }
		                    },
		                    emphasis: {
		                        shadowBlur: 10,
		                        shadowOffsetX: 0,
		                        shadowColor: 'rgba(0, 0, 0, 0.5)'
		                    },
		                    labelLine: {show: false}
		                },
				        data: seriesData,
				        type: 'pie',
				        radius : '55%',
			            center: ['40%', '50%']
			           
				    }]
				};
			
			
			
			var chart = document.getElementById('top_events_devices_container');
			echarts.registerTheme(themeName, $scope.themOptions)
			var myChart = echarts.init(chart,themeName);
			myChart.setOption(option);
			//log_trend_container
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});

	}
	
	self.loadTopEventsByCategory = function(startDate,endDate){
		merticsFactory.loadTopEventsByCategory(startDate,endDate).then(function (response){

			var option = option = {
				    xAxis: {
				        type: 'category',
				        data: response.data.catgeories
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: [{
				        data: response.data.values,
				        type: 'bar'
				    }]
				};
			var chart = document.getElementById('top_events_by_category_container');
			echarts.registerTheme(themeName, $scope.themOptions)
			var myChart = echarts.init(chart,themeName);
			myChart.setOption(option);
			//log_trend_container
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});

	}

	self.init = function(){
		self.loadTheme();
		self.loadEventsPerSecond($scope.startTime,$scope.endTime);
		self.loadLogsOverTime($scope.startTime,$scope.endTime);
		self.loadLogVolume($scope.startTime,$scope.endTime);
		self.loadLogsVolumeOverTime($scope.startTime,$scope.endTime);
		self.loadTopSendingDevices($scope.startTime,$scope.endTime);
		self.loadTopEvents($scope.startTime,$scope.endTime);
		self.loadTopEventsByCategory($scope.startTime,$scope.endTime);
	}


}]);