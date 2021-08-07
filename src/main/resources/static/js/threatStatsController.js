app.controller("threatStatsController", ['$scope','threatStatsFactory','$window',function ($scope,threatStatsFactory,$window) {

	var self = this;
	self.timeFrame= {"startDate":moment(new Date()).subtract(29, 'days'),"endDate": moment(new Date())};
//	self.timeFrame ={"startDate":moment(new Date()).startOf('day').valueOf(),"endDate": moment(new Date()).endOf('day').valueOf() }
	
	self.getIndicatorsGlobally = function(){
		threatStatsFactory.getIndicatorsGlobally(self.timeFrame).then(function(response){
			self.globalIndicators = angular.copy(response.data);
		},function(Error){
			
		})
	} 
	self.getThreatStatsByFeed = function(){
threatStatsFactory.getThreatStatsByFeed(self.timeFrame).then(function(response){
	loadPieChart('feed_source.keyword',response.data,'chart2')
		},function(Error){
			
		})
	}
	self.getThreatStatsByType = function(){
threatStatsFactory.getThreatStatsByType(self.timeFrame).then(function(response){
	loadPieChart('matched_by',response.data,'chart3')
		},function(Error){
			
		})
	}
	
	self.getThreatStatsGeo = function(){
		threatStatsFactory.getThreatStatsGeo(self.timeFrame).then(function(response){
			console.log(response.data);
			loadGeoMap('matched_by','chart50', response.data)
				},function(Error){
					
				})
	}
	self.getThreatStatsGeo();
	self.getThreatStatsByCountry = function(){
threatStatsFactory.getThreatStatsByCountry(self.timeFrame).then(function(response){
	loadPieChart('countryName',response.data,'chart4')
		},function(Error){
			
		})
	}
	self.getThreatStatsByScore = function(){
threatStatsFactory.getThreatStatsByScore(self.timeFrame).then(function(response){
	loadPieChart('threat_score',response.data,'chart5')
		},function(Error){
			
		})
	}
	self.getTopTenIps = function(){
		threatStatsFactory.getTopTenIps(self.timeFrame).then(function(response){
			self.topTenIps = response.data;
		},function(Error){
			
		})
	}
	
	self.getTopTenCountrys = function(){
threatStatsFactory.getTopTenCountrys(self.timeFrame).then(function(response){
	self.topTenCountrys = response.data;
		},function(Error){
			
		})
	}
	
	self.getThreatStatsHistogram = function(){
threatStatsFactory.getThreatStatsHistogram(self.timeFrame).then(function(response){
	loadBarChart('matched_by',response.data,'chart8');
		},function(Error){
			
		})
	}
	
	self.loadAllDashboards = function(){
		self.getIndicatorsGlobally();
		self.getThreatStatsByFeed();
		self.getThreatStatsByType();
		self.getThreatStatsByCountry();
		self.getThreatStatsByScore();
		self.getTopTenIps();
		self.getTopTenCountrys();
		self.getThreatStatsHistogram();
	}
	self.loadAllDashboards();
	
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
	        self.loadAllDashboards();
	    });


		function loadPieChart(typeName,chartdata,id){
			
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
		                    	  self.loadElasticSearchWithQuery(this.name,typeName);
		                      }
		                  }
		              }  
			    }]
			});
		}

		function loadBarChart(typeName,chartdata,id){

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
		                        	self.loadElasticSearchWithQuery(this.series.name,typeName);
		                        }
		                    }
		                }
		            }
		        },
			    series: chartdata.series
			});
			
			
		}
		
		function loadGeoMap(query,id,chartData){
			    Highcharts.mapChart(id, {
			        chart: {
			            borderWidth: 1,
			            map: 'custom/world'
			        },

			        title: {
			            text: ''
			        },

			        subtitle: {
			            text: ''
			        },

			        legend: {
			            enabled: true
			        },

			        mapNavigation: {
			            enabled: true,
			            buttonOptions: {
			                verticalAlign: 'bottom'
			            }
			        },
			        plotOptions: {
			            series: {
			                cursor: 'pointer',
			                point: {
			                    events: {
			                        click: function (event) {
			                        	$window.open("/configuration#!/search?query=countryCode.keyword: "+this.code+" AND threat_detection_date:["+self.timeFrame.startDate+" TO "+self.timeFrame.endDate+"]&timeframe=_g=(time:(from:now-30d,mode:quick,to:now))","_blank");
			                        },
			                    },
			                },
			            },
			        },
			        series: [{
			            name: 'Countries',
			            color: '#E0E0E0',
			            enableMouseTracking: false
			        }, {
			            type: 'mapbubble',
			            name: 'IP',
			            joinBy: ['iso-a2', 'code'],
			            data: chartData,
			            minSize: 4,
			            maxSize: '12%',
			        }]
			    });
			
		}
		self.loadElasticSearchWithQuery = function(name,queryValue){
			$window.open('/configuration#!/search?query='+queryValue+':'+name+" AND threat_detection_date:["+self.timeFrame.startDate+" TO "+self.timeFrame.endDate+"]&timeframe=_g=(time:(from:now-30d,mode:quick,to:now))","_blank");
		}
}]);





