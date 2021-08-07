app.controller("threatinteligenceController", ['$scope','$rootScope','$timeout','$uibModal','threatinteligencefactory','$sessionStorage','$window','$routeParams',function ($scope,$rootScope, $timeout,$uibModal,threatinteligencefactory,$sessionStorage,$window,$routeParams) {

	var self = this;

	self.timeFrame= {"startDate":moment(new Date()).subtract(29, 'days'),"endDate": moment(new Date())};
	
	self.getAllFeedStats = function(timeFrame) {
		threatinteligencefactory.getFeedStaticsByIndicator(timeFrame).then(function (response){
			loadPieChart("Threats By IOC",response.data.data,'chart1');
		},function(error){
			
		});
	}
	
	self.getallfeedstaticsbyhistorgram = function(timeFrame) {
		threatinteligencefactory.getFeedStaticsByHistorgram(timeFrame).then(function(response){
			loadBarChart("Threats By Histogram",response.data,'chart2')
		},function(error){
			
		});
	}
	
	self.getallfeedstaticsbysource = function(timeFrame) {
		threatinteligencefactory.getallfeedstaticsbysource(timeFrame).then(function(response){
			loadPieChart("noIndicator",response.data.data,'chart3')
		},function(error){
			
		});
	}
	self.getFeedStaticsByIP = function(timeFrame) {
		threatinteligencefactory.getFeedStaticsByIP(timeFrame).then(function(response){
			loadPieChart("indicatorSource",response.data.data,'chart4')
		},function(error){
			
		});
	}
	
	
	self.getAllFeeds = function(user,timeFrame) {
		threatinteligencefactory.getAllFeeds(user,timeFrame).then(function(response){
			self.uniqueIndicatorsCount = response.data.uniqueIndicatorsCount;
			self.allIndicatorsCount = response.data.allIndicatorsCount;
		},function(error){
			
		});
	}
	
	self.filterData = function(timeFrame){
		self.getAllFeedStats(self.timeFrame);
		self.getallfeedstaticsbyhistorgram(self.timeFrame);
		self.getallfeedstaticsbysource(self.timeFrame);
		self.getFeedStaticsByIP(self.timeFrame);

		self.getAllFeeds($sessionStorage.user.userName,timeFrame);
	}
	
	
	 $('#timeFrame').html("Last 30 Days");
	$('button#buttonDate').daterangepicker({
        timePicker: true,
        format: 'MM/DD/YYYY',
        showDropdowns: true,
        showWeekNumbers: true,
        opens: 'right',
        drops: 'down',
        startDate: moment(new Date()).subtract(29, 'days'),
        endDate: moment(new Date()),        
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
        var startDate = moment(new Date());
        var endDate = moment(new Date());

        if (label === "Last 15 Min") {
            startDate = moment(new Date()).subtract(15, 'minutes');
        }
        if (label === "Last 30 Min") {
            startDate = moment(new Date()).subtract(30, 'minutes');
        }
        if (label === "Last 1 Hour") {
            startDate = moment(new Date()).subtract(1, 'hours');
        }
        if (label === "Last 4 Hour") {
            startDate = moment(new Date()).subtract(4, 'hours');
        }
        if (label === "Last 12 Hour") {
            startDate = moment(new Date()).subtract(12, 'hours');
        }
        if (label === "Today") {
            startDate = moment(new Date()).startOf('day');
        }
        if (label === "Yesterday") {
            startDate = moment(new Date()).subtract(1, 'days').startOf('day');
            endDate = moment(new Date()).subtract(1, 'days').endOf('day');
        }
        if (label === "Last 7 Days") {
            startDate = moment(new Date()).subtract(6, 'days');
        }
        if (label === "Last 30 Days") {
            startDate = moment(new Date()).subtract(30, 'days')
        }
        if (label === "This Month") {
            startDate = moment(new Date()).startOf('month')
        }
        if (label === "Last Month") {
            startDate = moment(new Date()).subtract(1, 'month').startOf('month');
        }
        if (label === "Custom") {
            startDate = moment(start);
            endDate = moment(end);
            $('#timeFrame').html(start.format('YYYY/MM/DD HH:mm:ss') + ' - ' + moment(endDate).format('YYYY/MM/DD HH:mm:ss'));
        } else {
            $('#timeFrame').html(label);
        }
        
        self.timeFrame= {"startDate":startDate.valueOf(),"endDate":endDate.valueOf()}
        self.filterData(self.timeFrame);
    });

	
	
	// dashboard functions
	
	function loadPieChart(name,chartdata,id){
		
		Highcharts.chart(id, {
			colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
	             '#FF9655', '#FFF263', '#6AF9C4'],
		    chart: {
		        type: 'pie',
		    },
		    title: {
		        text: ''
		    },
		    plotOptions: {
		        pie: {
		            showInLegend: true
		        }
		    },
		    series: [{
		        colorByPoint: true,
		        data: chartdata,
		        point:{
	                  events:{
	                      click: function (event) {
	                    	  self.loadElasticSearchWithQuery(this.name,name,this.series.name);
	                      }
	                  }
	              }  
		    }]
		});
	}
	
	function loadBarChart(name,chartdata,id){

		Highcharts.chart(id, {
			
		    chart: {
		        type: 'column'
		    },
		    title: {
		        text: ''
		    },
		    subtitle: {
		        text: ''
		    },
		    xAxis: {
		        categories: chartdata.xAxisData,
		        crosshair: true
		    },
		    yAxis: {
		        min: 0,
		        title: {
		            text: 'IOC Count',
		            align: 'high'
		        },
		        labels: {
		            overflow: 'justify'
		        }
		    },
		    plotOptions: {
	            series: {
	                cursor: 'pointer',
	                point: {
	                    events: {
	                        click: function (event) {
	                        	self.loadElasticSearchWithQuery(this.series.name,this.name);
	                        }
	                    }
	                }
	            }
	        },
		    series: chartdata.series
		});
	
	}
	
	
	function loadGeoMap(name,chartdata,id) {

		var myChart = echarts.init(document.getElementById(id));
		option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: function (params) {
			            var value = (params.value + '').split('.');
			            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
			                    + '.' + value[1];
			            return params.seriesName + '<br/>' + params.name + ' : ' + value;
			        }
			    },
			    toolbox: {
			        show: true,
			        orient: 'vertical',
			        left: 'right',
			        top: 'center'
			    },
			    visualMap: {
			        min: 0,
			        max: 3000,
			        text:['High','Low'],
			        realtime: false,
			        calculable: true,
			        inRange: {
			            color: ['lightskyblue','yellow', 'orangered']
			        }
			    },
			    series: [
			        {
			            name: 'Threats By Geo',
			            type: 'map',
			            mapType: 'world',
			            roam: true,
			            itemStyle:{
			                emphasis:{label:{show:true}}
			            },
			            data:chartdata
			        }
			    ]
			};
        myChart.setOption(option);
        myChart.on('click', function (params) {
        	self.loadElasticSearchWithQuery(this.series.name);
        });
	}
	
	self.loadElasticSearchWithQuery = function(indicator,name,source){
		if(angular.equals(name,'noIndicator')){			
			$window.open('/configuration#!/search?query=source.keyword:'+indicator+" AND  lastAppearance:["+self.timeFrame.startDate+" TO "+self.timeFrame.endDate+"]&timeframe=_g=(time:(from:now-30d,mode:quick,to:now))","_blank");
		}else if(angular.equals(name,"indicatorSource")){
			$window.open('/configuration#!/search?query=indicator.keyword:'+indicator+" AND source.keyword:IP AND lastAppearance:["+self.timeFrame.startDate+" TO "+self.timeFrame.endDate+"]&timeframe=_g=(time:(from:now-30d,mode:quick,to:now))","_blank");
		}else{			
			$window.open('/configuration#!/search?query=indicator.keyword:'+indicator+" AND lastAppearance:["+self.timeFrame.startDate+" TO "+self.timeFrame.endDate+"]&timeframe=_g=(time:(from:now-30d,mode:quick,to:now))","_blank");
		}
	}
}]);
