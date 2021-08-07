app.controller("alertdashboardController", ['$scope','dashboardFactory','$rootScope', function ($scope, dashboardFactory,$rootScope) {

	var self = this

	self.startDate = moment(new Date()).subtract(15, 'minutes');
	self.endDate = moment();
	self.tableResponse = {};
	self.showInfoTableForFailedLogin = false;
	self.showInfoTableForAccountLockout = false;
	self.topHostByVolumeData  = {};
	self.topHostByTypeData = {};
	self.countByHostData = {};
	self.countByTypeData = {};

	self.showHostDetails = function(){

	}



	self.showFailedLoginuserDetails = function(){
		self.showInfoTableForFailedLogin = true;
		self.showInfoTableForAccountLockout = false;
		self.showInfoTableForAlerts = false;
		self.tableName = "Top User Logon Failusers";
		dashboardFactory.getWindowsDetails(self.startDate.valueOf(),self.endDate.valueOf(),"4625").then(function (response){
			self.tableResponse = response.data.data;
			

			
		},function(error){

		});

		angular.element('#dashboard-container').addClass("dashboard-after-table");
	}

	self.showAccountLockedOutUserDetails = function(){
		self.showInfoTableForFailedLogin = false;
		self.showInfoTableForAccountLockout = true;
		self.showInfoTableForAlerts = false;
		self.tableName = "Account Locked Out Users";
		dashboardFactory.getAccountLockedOutUsersDetails(self.startDate.valueOf(),self.endDate.valueOf()).then(function (response){
			self.tableResponse = response.data.data;

		
		},function(error){

		});

		angular.element('#dashboard-container').addClass("dashboard-after-table");
	}

	self.showAlertDetails = function(){
		self.showInfoTableForFailedLogin = false;
		self.showInfoTableForAccountLockout = false;
		self.showInfoTableForAlerts = true;
		self.tableName = "Alert Details";
		dashboardFactory.getAlertDetails(self.startDate.valueOf(),self.endDate.valueOf()).then(function (response){
			self.tableResponse = response.data.data;
		},function(error){

		});
		angular.element('#dashboard-container').addClass("dashboard-after-table");
	}

	self.showTopCountByType = function(){
		self.showInfoTable = true;
		self.tableName = "Events Count By Type";
		var headersArray = ["LogType","Count"];
		self.tableResponse.headers = headersArray;
		var tableData = [];
		for(var i=0;i<self.countByTypeData.labels.length;i++){
			tableData.push({"hostname":self.countByTypeData.labels[i],"count":self.countByTypeData.datasets[0].data[i]})
		}
		self.tableResponse.rows = tableData;
		angular.element('#dashboard-container').addClass("dashboard-after-table");
	}

	self.closeTable = function(){
		self.showInfoTableForFailedLogin = false;
		self.showInfoTableForAccountLockout = false;
		self.showInfoTableForAlerts = false;
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

		renderTopUsersLogonFailuers(startDate.valueOf(),endDate.valueOf())
		renderLogonFailuresErrorCode(startDate.valueOf(),endDate.valueOf());
		
		renderaccountLockedOutUsers(startDate.valueOf(),endDate.valueOf());
		
		renderAlertsByCategory(startDate.valueOf(),endDate.valueOf());
		
		renderAlertsByPriority(startDate.valueOf(),endDate.valueOf());
		
	});
	renderTopUsersLogonFailuers(self.startDate.valueOf(),self.endDate.valueOf());
	
	renderLogonFailuresErrorCode(self.startDate.valueOf(),self.endDate.valueOf());
	
	renderaccountLockedOutUsers(self.startDate.valueOf(),self.endDate.valueOf());
	
	renderAlertsByCategory(self.startDate.valueOf(),self.endDate.valueOf());
	
	renderAlertsByPriority(self.startDate.valueOf(),self.endDate.valueOf());
	
	
	function renderAlertsByCategory(startDate,endDate){
		dashboardFactory.getAllAlertsByCategory(startDate,endDate).then(function (response){
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
			renderPieChart(data,"alertsByCategory");
		},function(error){

		});
	}
	
	function renderAlertsByPriority(startDate,endDate){
		dashboardFactory.getAllAlertsByPriority(startDate,endDate).then(function (response){
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
			renderPieChart(data,"alertsByPriority");
		},function(error){

		});
	}
	
	
	function renderaccountLockedOutUsers(startDate,endDate){
		dashboardFactory.getAccountLockedOutUsers(startDate,endDate).then(function (response){
			var data = {
					"chart": {
						"showBorder":'0',
						"bgColor": "#ffffff",
						"borderAlpha": "20",
						"showCanvasBorder": "0",
						"usePlotGradientColor": "0",
						"plotBorderAlpha": "10",
						"legendBorderAlpha": "0",
						"legendShadow": "0",
						"valueFontColor": "#ffffff",                
						"showXAxisLine": "0",
						"showSum": "0",
						"xAxisLineColor": "#999999",
						"divlineColor": "#999999",               
						"divLineIsDashed": "1",
						"showAlternateHGridColor": "0",
						"subcaptionFontBold": "0",
						"subcaptionFontSize": "14",
						"showHoverEffect":"1",
						"showValues":"0",
						 "showlegend": "1",
						 "palettecolors":"#0075c2"
					},
					"data": response.data.data,

			}
			renderBarChart(data,"accountLocedOutUsers");
		},function(error){

		});
	}
	
	function renderLogonFailuresErrorCode(startDate,endDate){
		dashboardFactory.getLogonFailuresErrorCode(startDate,endDate).then(function (response){
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
			renderPieChart(data,"logonFailuresErrorCode");
		},function(error){

		});


	}
	
	function renderTopUsersLogonFailuers(startDate,endDate){
		dashboardFactory.getTopUserLogonFailuers(startDate,endDate).then(function (response){
			var data = {
					"chart": {
						"showBorder":'0',
						"bgColor": "#ffffff",
						"borderAlpha": "20",
						"showCanvasBorder": "0",
						"usePlotGradientColor": "0",
						"plotBorderAlpha": "10",
						"legendBorderAlpha": "0",
						"legendShadow": "0",
						"valueFontColor": "#ffffff",                
						"showXAxisLine": "1",
						"showSum": "0",
						"xAxisLineColor": "#999999",
						"divlineColor": "#999999",               
						"divLineIsDashed": "1",
						"showAlternateHGridColor": "0",
						"subcaptionFontBold": "0",
						"subcaptionFontSize": "14",
						"showHoverEffect":"1",
						"showValues":"0",
						"palettecolors":"#0075c2"
					},
					"data": response.data.data,

			}
			renderBarChart(data,"topuserLoginFailuers");
		},function(error){

		});


	}

	function renderBarChart(data,container){
		FusionCharts.setCurrentRenderer('javascript');
		var myChart = new FusionCharts("FusionCharts/Column2D.swf", Math.random(), "100%", "100%", "0","1");
		myChart.setChartData(data, "json");
		myChart.render(container);
	}
	
	function renderPieChart(data,container){
		FusionCharts.setCurrentRenderer('javascript');
		var myChart = new FusionCharts("FusionCharts/Pie2D.swf", Math.random(), "100%", "100%", "0","1");
		myChart.setChartData(data, "json");
		myChart.render(container);
	}


}]);