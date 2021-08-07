app.controller("logstatsdashboardController", ['$scope','dashboardFactory','$rootScope', function ($scope, dashboardFactory,$rootScope) {


	var self = this
	$rootScope.$broadcast('changeThemeToNormal');
	self.startDate = moment(new Date()).subtract(15, 'minutes');
	self.endDate = moment();
	self.tableResponse = {};
	self.showInfoTable = false;
	self.topHostByVolumeData  = {};
	self.topHostByTypeData = {};
	self.countByHostData = {};
	self.countByTypeData = {};
	self.showHostDetails = function(){

		dashboardFactory.getHostDetails(self.startDate.valueOf(),self.endDate.valueOf()).then(function (response){
			self.tableResponse = response.data.details;
			
			var headersArray = ["Hostname",""];
			self.tableResponse.headers = headersArray;
			
			var tableData = [];
			for(var i=0;i<self.topHostByVolumeData.length;i++){
				tableData.push({"hostname":self.topHostByVolumeData[i].label,"count":""})
			}
			self.tableResponse.rows = tableData;
			
			self.showInfoTable = true;
			self.tableName = "Host Details";
			angular.element('#dashboard-container').addClass("dashboard-after-table");

		},function(error){

		});

	}

	self.showTopHostByVolume = function(){
		self.showInfoTable = true;
		self.tableName = "Top Host By Volume";
		var headersArray = ["Hostname","Count"];
		self.tableResponse.headers = headersArray;
		var tableData = [];
		for(var i=0;i<self.topHostByVolumeData.length;i++){
			tableData.push({"hostname":self.topHostByVolumeData[i].label,"count":self.topHostByVolumeData[i].value})
		}
		self.tableResponse.rows = tableData;
		angular.element('#dashboard-container').addClass("dashboard-after-table");
	}
	
	self.showTopHostByType = function(){
		self.showInfoTable = true;
		self.tableName = "Volume By Type";
		var headersArray = ["LogType","Count"];
		self.tableResponse.headers = headersArray;
		var tableData = [];
		for(var i=0;i<self.topHostByTypeData.length;i++){
			tableData.push({"hostname":self.topHostByTypeData[i].label,"count":self.topHostByTypeData[i].value})
		}
		self.tableResponse.rows = tableData;
		angular.element('#dashboard-container').addClass("dashboard-after-table");
	}
	
	self.showTopCountByHost = function(){
		self.showInfoTable = true;
		self.tableName = "Events Count By Host";
		var headersArray = ["Hostname","Count"];
		self.tableResponse.headers = headersArray;
		var tableData = [];
		for(var i=0;i<self.countByHostData.length;i++){
			tableData.push({"hostname":self.countByHostData[i].label,"count":self.countByHostData[i].value})
		}
		self.tableResponse.rows = tableData;
		angular.element('#dashboard-container').addClass("dashboard-after-table");
	}
	
	self.showTopCountByType = function(){
		self.showInfoTable = true;
		self.tableName = "Events Count By Type";
		var headersArray = ["LogType","Count"];
		self.tableResponse.headers = headersArray;
		var tableData = [];
		for(var i=0;i<self.countByTypeData.length;i++){
			tableData.push({"hostname":self.countByTypeData[i].label,"count":self.countByTypeData[i].value})
		}
		self.tableResponse.rows = tableData;
		angular.element('#dashboard-container').addClass("dashboard-after-table");
	}

	self.closeTable = function(){
		self.showInfoTable = false;
		angular.element('#dashboard-container').removeClass("dashboard-after-table");
	}


	self.startDate = moment(new Date()).subtract(15, 'minutes');
	self.endDate = moment();
	$('.daterange-predefined span').html(self.startDate.format('YYYY/MM/DD HH:mm:ss') + ' - ' + self.endDate);

	$('.daterange-predefined').daterangepicker({
		timePicker: true,
		format: 'MM/DD/YYYY',

		showDropdowns: true,
		showWeekNumbers: true,
		opens: 'left',
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


		var startDate ;
		var endDate = new Date();

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
			self.startDate = start;
			self.endDate = end;
			startDate = start;
			endDate = end

		}

		$('.daterange-predefined span').html(startDate.format('YYYY/MM/DD HH:mm:ss') + ' - ' + moment(endDate).format('YYYY/MM/DD HH:mm:ss'));

		self.startDate = startDate;
		self.endDate = endDate;

		renderHostCount(startDate.valueOf(),endDate.valueOf());
		renderTopHostByVolume(startDate.valueOf(),endDate.valueOf());
		renderTopVolumebyType(startDate.valueOf(),endDate.valueOf());

		renderCountByHost(startDate.valueOf(),endDate.valueOf());

		renderCountByType(startDate.valueOf(),endDate.valueOf());

		renderTopTenHostOverTime(startDate.valueOf(),endDate.valueOf())
	});







	renderHostCount(self.startDate.valueOf(),self.endDate.valueOf());

	renderTopHostByVolume(self.startDate.valueOf(),self.endDate.valueOf());

	renderTopVolumebyType(self.startDate.valueOf(),self.endDate.valueOf());

	renderCountByHost(self.startDate.valueOf(),self.endDate.valueOf());

	renderCountByType(self.startDate.valueOf(),self.endDate.valueOf());

	renderTopTenHostOverTime(self.startDate.valueOf(),self.endDate.valueOf());

	function renderTopHostByVolume(startDate,endDate){

		dashboardFactory.getLogVolumeByHost(startDate,endDate).then(function (response){
			$("#topHostByVolume").empty();
			self.topHostByVolumeData = response.data.data;

			var data = {
					"chart": {
	                    "paletteColors": "#008ee4,#6baa01,#f8bd19,#e44a00,#33bdda",
	                    "bgAlpha": "0",
	                    "borderAlpha": "20",
	                    "use3DLighting": "0",
	                    "showShadow": "0",
	                    "enableSmartLabels": "0",
	                    "startingAngle": "20",
	                    "showLabels": "0",
	                    "showLegend": "1",
	                    "legendShadow": "0",
	                    "legendBorderAlpha": "0",
	                    "enableMultiSlicing": "0",
	                    "slicingDistance": "15",
	                    "showPercentValues": "1",
	                    "showPercentInTooltip": "0",
	                    "decimals": "1"
	            },
					"data": response.data.data,

			}
			renderPieChart(data,"topHostByVolume");

		},function(error){

		});
	}

	function renderTopTenHostOverTime(startDate,endDate){
		
		dashboardFactory.getTopTenHost(startDate,endDate).then(function (response){
			$("#topTenHostOverTheTime").empty();
			var data = {
					type: 'line',
					data:response.data.data ,
					options: {
						responsive: true,
						title: {
							display: false,
							text: 'Chart.js Line Chart'
						},
						tooltips: {
							mode: 'index',
							intersect: false,
						},
						hover: {
							mode: 'nearest',
							intersect: true
						},
						scales: {
							xAxes: [{
								display: true,
								scaleLabel: {
									display: true,
									labelString: 'Month'
								}
							}],
							yAxes: [{
								display: true,
								scaleLabel: {
									display: true,
									labelString: 'Value'
								}
							}]
						}
					}
			};
			renderLineChart(data,"topTenHostOverTheTime");

		},function(error){

		});
	}

	function renderTopVolumebyType(startDate,endDate){

		dashboardFactory.getLogVolumeByType(startDate,endDate).then(function (response){
			$("#topVolumeByType").empty();
			self.topHostByTypeData = response.data.data;
			
			var data = {
					"chart": {
	                    "paletteColors": "#008ee4,#6baa01,#f8bd19,#e44a00,#33bdda",
	                    "bgAlpha": "0",
	                    "borderAlpha": "20",
	                    "use3DLighting": "0",
	                    "showShadow": "0",
	                    "enableSmartLabels": "0",
	                    "startingAngle": "20",
	                    "showLabels": "0",
	                    "showLegend": "1",
	                    "legendShadow": "0",
	                    "legendBorderAlpha": "0",
	                    "enableMultiSlicing": "0",
	                    "slicingDistance": "15",
	                    "showPercentValues": "1",
	                    "showPercentInTooltip": "0",
	                    "decimals": "1"
	            },
					"data": response.data.data,

			}
			renderPieChart(data,"topVolumeByType");

		},function(error){

		});
	}

	function renderCountByHost(startDate,endDate){
		dashboardFactory.getLogCountPerIndexAndTime(startDate,endDate).then(function (response){
			$("#topCountByHost").empty();
			self.countByHostData = response.data.data;
			
			var data = {
					"chart": {
	                    "paletteColors": "#008ee4,#6baa01,#f8bd19,#e44a00,#33bdda",
	                    "bgAlpha": "0",
	                    "borderAlpha": "20",
	                    "use3DLighting": "0",
	                    "showShadow": "0",
	                    "enableSmartLabels": "0",
	                    "startingAngle": "20",
	                    "showLabels": "0",
	                    "showLegend": "1",
	                    "legendShadow": "0",
	                    "legendBorderAlpha": "0",
	                    "enableMultiSlicing": "0",
	                    "slicingDistance": "15",
	                    "showPercentValues": "1",
	                    "showPercentInTooltip": "0",
	                    "decimals": "1"
	            },
					"data": response.data.data,

			}
			renderPieChart(data,"topCountByHost");

		},function(error){

		});

	}

	function renderCountByType(startDate,endDate){
		dashboardFactory.getLogCountByType(startDate,endDate).then(function (response){
			
			self.countByTypeData = response.data.data;
			$("#topCountByType").empty();
			var data = {
					"chart": {
	                    "paletteColors": "#008ee4,#6baa01,#f8bd19,#e44a00,#33bdda",
	                    "bgAlpha": "0",
	                    "borderAlpha": "20",
	                    "use3DLighting": "0",
	                    "showShadow": "0",
	                    "enableSmartLabels": "0",
	                    "startingAngle": "20",
	                    "showLabels": "0",
	                    "showLegend": "1",
	                    "legendShadow": "0",
	                    "legendBorderAlpha": "0",
	                    "enableMultiSlicing": "0",
	                    "slicingDistance": "15",
	                    "showPercentValues": "1",
	                    "showPercentInTooltip": "0",
	                    "decimals": "1"
	            },
					"data": response.data.data,

			}
			renderPieChart(data,"topCountByType");

		},function(error){

		});

	}

	function renderHostCount(startDate,endDate) {

		$("#hostCountPerSec").empty();

		dashboardFactory.getSourceCountPerComp(startDate,endDate).then(function (response){

			var q = new JustGage({
				id: "hostCountPerSec",
				value:response.data.count,
				min: 0,
				max: 10,
				pointer: true,
				donut: true,
				gaugeWidthScale: 0.4,
				counter: true,
				hideInnerShadow: true,
				label: "hosts",
				levelColors : ['#027dc3'],
				levelColorsGradient: false
			});
		},function(error){

		});





	}

	function renderPieChart(data,container){
		FusionCharts.setCurrentRenderer('javascript');
		var myChart = new FusionCharts("FusionCharts/Pie2D.swf", Math.random(), "100%", "100%", "0","1");
		myChart.setChartData(data, "json");
		myChart.render(container);
	}
	
	
	function renderLineChart(data,container){
		var ctx = document.getElementById(container).getContext('2d');
		ctx.height = 500;
		ctx.width = 500;
		window.myPie = new Chart(ctx, data);
	}
	
	
}]);


