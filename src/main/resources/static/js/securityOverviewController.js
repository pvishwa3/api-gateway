app.controller("securityOverviewController", [ '$scope','securityOverviewFactory','Fullscreen',function($scope,securityOverviewFactory,Fullscreen) {
	var self = this;
	
	
	self.eventsPerSecond = function(){
		self.eventsPerSecondCount = 1000;
//		securityOverviewFactory.eventsPerSecond(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});											
	}
	self.getGB = function(){
		self.countGBCount=5;
//		securityOverviewFactory.getGB(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});					
	}	
	self.gethostCount = function(){
		self.hostCount = 10;
//		securityOverviewFactory.hostCount(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});
	}
	self.getEvents = function(){
		self.eventCount = 200
//		securityOverviewFactory.getEvents(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});
	}
	self.getAlerts = function(){
		self.alertsCount = 150;
//		securityOverviewFactory.getAlerts(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});
	}
	
	self.casesByPriority = function() {
		var priorityData =  [{name: 'High',y: 61}, {name: 'Medium',y: 50}, {name: 'Low',y: 30}, {name: 'Critical',y: 41}]
		loadPieChart("chart1",priorityData)
//		securityOverviewFactory.casesByPriority(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});
		
	}

	self.casesByStatus = function() {
		var statusData =  [{name: 'Open',y: 61}, {name: 'Inprogress',y: 50}, {name: 'Closed',y: 30}]	   
		loadPieChart("chart2",statusData);
//		securityOverviewFactory.casesByPriority(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});
	}

	self.casesByUser = function() {
		var casesUser =[{y: 50, name: 'user1'},{y: 35, name: 'user2'},{y: 30, name: 'user3'},{y: 20, name: 'user4'}];
		var xAxisData = ['user1', 'user2', 'user3', 'user4'];
		loadLineChart("chart3",casesUser,xAxisData);
//		securityOverviewFactory.casesByPriority(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});		
	}
	
	self.alertsByPriority = function() {
		var priorityData =  [{name: 'High',y: 21}, {name: 'Medium',y: 30}, {name: 'Low',y: 15}, {name: 'Critical',y: 27}]
		loadPieChart("chart4",priorityData);
//		securityOverviewFactory.casesByPriority(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});
	}
	
	self.alertsByDomain = function() {
		var alertDomain =[{y: 50, name: 'Threat'},{y: 35, name: 'Audit'},{y: 30, name: 'Identity'},{y: 20, name: 'Endpoint'},{y: 40, name: 'Access'}];
		var xAxisData = ['Threat', 'Audit', 'Identity', 'Endpoint', 'Access'];
		loadLineChart("chart5",alertDomain,xAxisData);
//		securityOverviewFactory.casesByPriority(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});
	}
	
	self.alertsByHost = function() {
		var alertHost =[{y: 50, name: 'host1'},{y: 35, name: 'host2'},{y: 30, name: 'host3'},{y: 20, name: 'host4'},{y: 40, name: 'host5'}];
		var xAxisData = ['host1','host2','host3','host4','host5'];
		loadLineChart("chart6",alertHost,xAxisData);
//		securityOverviewFactory.casesByPriority(self.timeFrame).then(function(response){
//			
//		},function(error){
//			
//		});
	}
	
	self.init = function(){
		self.alertsByDomain();
		self.alertsByHost();
		self.alertsByPriority();
		self.casesByUser();
		self.casesByStatus();
		self.casesByPriority();
		self.eventsPerSecond();
		self.getGB();
		self.gethostCount();
		self.getEvents();
		self.getAlerts();
	}
	
	
	
	
	function loadPieChart(id,seriesData){
		Highcharts.chart(id, {
			exporting: { enabled: false },
		    chart: {
		        type: 'pie',
				 backgroundColor: '#171819'
		    },
			legend: {
        itemStyle: {
            color: '#ffffff',
         
        }
    },
		    xAxis: {
		    	type: 'category',
				labels: {
					style: {
						color: '#ffffff'
					}
				}
		    },
		    title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },
	        yAxis: {
				 gridLineColor: '#333',
	            title: {
	                text: 'Count'
	            }
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: false
	                },
	                showInLegend: true
	            }
	        },
		    series: [{
		    	legendType: 'point',
		        showInLegend: true,
		        colorByPoint: true,
		        data: seriesData
		    }]
		});
	}
	
	function loadLineChart(id,seriesData,xAxisData){
		Highcharts.chart(id, {
			exporting: { enabled: false },
		    chart: {
		        type: 'column',
				 backgroundColor: '#171819'
		    },
			legend: {
        itemStyle: {
            color: '#ffffff',
         
        }
    },
			
		    title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },
	        xAxis: {
	            categories: xAxisData,
	            title: {
	                text: null
	            },
				labels: {
					style: {
						color: '#ffffff'
					}
				}
	        },
	         yAxis: {
				 gridLineColor: '#333',
	            title: {
	                text: ''
	            }
	        },
		    series:[{
		    	legendType: 'point',
		    	colorByPoint: true,
		    	data :seriesData
		    }]
		});
	}
	
	
	$('li a[id^="switch_"]').click(function() {
	    var chart = $(this).attr('id').replace("switch_", "");
	    if ($('#' + chart).highcharts().series[0].type == 'pie') {
	        $("#"+$(this).attr('id')).html("Switch to Pie Chart")	        
	        $('#' + chart).highcharts().series[0].update({
	            type: "column"
	        });
//	        $("#"+chart).highcharts().legend.group.hide();
//	    	$("#"+chart).highcharts().legend.box.hide();
//	    	$("#"+chart).highcharts().legend.group.display = false;
	    } else if ($('#' + chart).highcharts().series[0].type == 'column') {
	    	$("#"+$(this).attr('id')).html("Switch to Bar Chart")
	        $('#' + chart).highcharts().series[0].update({
	            type: "pie"
	        });
	    	$("#"+chart).highcharts().legend.group.show();
//	    	$("#"+chart).highcharts().legend.box.show();C
	    	$("#"+chart).highcharts().legend.group.display = true;
	    }	
	    $("#"+chart).highcharts().redraw()
	});

	$('li a[id^="downloadPNG_"]').click(function() {
	    var chart = $('#' + $(this).attr('id').replace("downloadPNG_", "")).highcharts();
	    chart.exportChartLocal({
	        type: 'image/png'
	    });
	});

	$('li a[id^="viewDataTable_"]').click(function() {
	    var chart = $('#' + $(this).attr('id').replace("viewDataTable_", "")).highcharts();
	        chartDiv = $(chart.renderTo);

	    if (chartDiv.is(":visible")) {
	        chartDiv.hide();
	        if (!chart.dataTableDiv) {
	            chart.update({
	                exporting: {
	                    showTable: true
	                }
	            });
	        } else {
	            $(chart.dataTableDiv).show();
	        }
	    } else {
	        chartDiv.show();
	        $(chart.dataTableDiv).hide();
	    }
	});

	self.timeFrame = {"startDate":moment(new Date()).startOf('day'),"endDate": moment(new Date()).endOf('day')};
	$("a#buttonDate").html("Today")
	$('a#buttonDate').daterangepicker({
        timePicker: true,
        format: 'MM/DD/YYYY',
        showDropdowns: true,
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
            $('#buttonDate').html(start.format('YYYY/MM/DD HH:mm:ss') + ' - ' + moment(endDate).format('YYYY/MM/DD HH:mm:ss'));
        } else {
            $('#buttonDate').html(label);
        }
        
        self.timeFrame= {"startDate":startDate.valueOf(),"endDate":endDate.valueOf()}
        self.init();
    });

	self.fullscreen = function(id) {
  	  document.addEventListener("keydown", e => { if(e.key == "F11") e.preventDefault(); });
  	  Fullscreen.enable(document.getElementById(id));
    }
	
	self.init();
}]);