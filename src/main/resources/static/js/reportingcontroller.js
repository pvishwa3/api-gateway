app.controller("reportingController", ['$scope','reportingService','$rootScope','$timeout','$routeParams','$http','widgetService','chartService','$ngConfirm','$routeParams','eventService', '$window','$filter', function ($scope, reportingService,$rootScope,$timeout,$routeParams,$http,widgetService,chartService,$ngConfirm,$routeParams,eventService, $window,$filter ) {
	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');



	self.reportingMessages= [];
	$scope.reportName = "";
	$scope.schedulerTables= true;
	$scope.schedulerForm= false;
	$scope.reportId = 0;
	$scope.buttonName = "Create";
	var data = self.data = []; 
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';

	$scope.tempwidgetIds = self.tempwidgetIds = '';
	self.openScheduledReportsModal = function(){
		$("#schedules_reports").modal("show");
		self.scheduleReports();
	}


	self.scheduleReports = function(){
		reportingService.getAllScheduledReports().then(function(response){
			self.allScheduledReports = response.data;
		},function(error){
			console.log(error);
		});
	}

	self.scheduleReports();

	$scope.showSchedulers = function(reportId,reportName){

		$scope.reportId = reportId;
		$scope.reportName = reportName;
		$scope.schedulerTables= true;
		$scope.schedulerForm= false;
		self.loadSchedulers(reportId);



		$("#scheduler-template-modal").modal();
	}

	$scope.addSchedulers = function(){



		$scope.schedulerTables= false;
		$scope.schedulerForm= true;
		$scope.schedule = {id:0,scheduleName:'',emailAddress:'',emailSubject:'',frequency:'',reportId:$scope.reportId,reportFormat:'',startDate:'',endDate:''}
		$scope.schedule.frequency = '0 8 9 9 1/8 ? *';

	}

	self.filterReports = function(search){
		$scope.filterDataWithComplianceAndCategory($scope.complianceType, $scope.categoryType,search);
	}







	$scope.complianceType = "";
	$scope.categoryType = "";
	$scope.complianceDisplayText = "Compliance Type";
	$scope.categoryDisplayText = "Category Type";

	$scope.filterData = function(complianceType){
		$scope.complianceType = complianceType;
		$scope.complianceDisplayText = complianceType;
		if($scope.categoryType == undefined){
			$scope.categoryType = "";
		}
		$scope.filterDataWithComplianceAndCategory($scope.complianceType, $scope.categoryType,self.searchReport);
	}

	$scope.filterCategory = function(complianceType){
		$scope.categoryType = complianceType;
		$scope.categoryDisplayText = complianceType;
		if($scope.complianceType == undefined ){
			$scope.complianceType = "";
		}
		$scope.filterDataWithComplianceAndCategory($scope.complianceType, $scope.categoryType,self.searchReport);
	}


	$scope.filterDataWithComplianceAndCategory = function(compliance,category,search){
		$scope.reportData = $filter('filter')($scope.orgReportData, { category: category ,title:search,complianceType:compliance});
	}


	$scope.editReport = function(reportId){

		// $scope.reports =
		// {id:0,reportingTitle:'',reportingDescription:'',complianceType:'',requriment:'',dateRange:'test',format:'',tempconditionId:[],tempwidgetIds:[],startTime:'',endTime:''};



		for(var i=0; i<$scope.reportData.length;i++){
			if($scope.reportData[i].id === reportId){
				$("#report-template-modal").modal();
				$scope.reports.id = reportId;
				$scope.reports.reportingTitle = $scope.reportData[i].title;
				$scope.reports.reportingDescription = $scope.reportData[i].description;
				$scope.reports.requriment = $scope.reportData[i].req;
				$scope.reports.complianceType = $scope.reportData[i].complianceType;
				$scope.reports.tempconditionId = $scope.reportData[i].coditionId;
				$scope.reports.tempwidgetIds = $scope.reportData[i].eventId;
				$scope.reports.dateRange= $scope.reportData[i].dateRange;
				$scope.reports.category = $scope.reportData[i].category;
				$scope.reports.companyLogo = $scope.reportData[i].companyLogo;
				self.data.query = [];
				if($scope.reportData[i].filterQuery){
					self.data.query.push(JSON.parse($scope.reportData[i].filterQuery));
					self.data.needsUpdate = true;
				}else{
					self.data.query = [{"bool":{"must":[]}}];
					self.data.needsUpdate = true;
				}
				$scope.showDelete = true;
				$scope.buttonName = "Update"
			}
		}

		// $scope.reports.tempconditionId
		// ($scope.reports.tempwidgetIds[i]
	}
	self.names = [];

	$scope.loadWidgetsForReport = function(){

		if($routeParams.reportId){
			$scope.reportId = $routeParams.reportId; 
			loader("body");
			reportingService.loadSingleReport($routeParams.reportId).then(function (response){
				$scope.reportTemplateData = response.data

				var widgets = response.data.widgets
				self.dateRangeArray =  self.calculateEpochForDateRange(response.data.dateRange).split("-");
				
				for(var i=0;i<widgets.length;i++){
					if(widgets[i].options.config.chart_type==='table'){
						$scope.dashboardContainsTable = true;
						break;
					}

				}

				for(var i=0;i<widgets.length;i++){
					loadWidgetsForReport(widgets[i],self.dateRangeArray[0],self.dateRangeArray[1],'',$scope.reportTemplateData.filterQuery);

				}
				$scope.themeName = $window.localStorage.getItem("dashboard-themeType")==='theme-dark-full' ? "ag-theme-balham-dark":"ag-theme-balham" ;
				self.names = [];
				$scope.reportTable = response.data.reportingTable;
				try{
					self.names = Object.keys($scope.reportTable);
					for(var i=0;i<self.names.length;i++){
						var tableTemplate = "";
						var tableHeading = [] ;
						tableTemplate=tableTemplate+'<div style="margin:7px 7px 0px 7px"><div class="dashboard-panel panel-body" ><h6 style="font-size:13px" class="text-center text-black">'+self.names[i]+'</h6><div id="myGrid'+i+'" style="height: 350px;" class="'+$scope.themeName+'"></div></div></div>';
						for(var j=0;j<$scope.reportTable[self.names[i]].length;j++){
							var tableHeaders =Object.keys($scope.reportTable[self.names[i]][j]);
							for(var k=0;k<tableHeaders.length;k++){
								if ( tableHeading.indexOf(tableHeaders[k]) == -1 ) tableHeading.push(tableHeaders[k]);
							}
						}					
						$("#tableDetails").append(tableTemplate);
						self.createGridStarForTable("myGrid"+i,tableHeading,$scope.reportTable[self.names[i]])
					}
				}catch(err){					
					console.log(err);
				}
				unloader("body");	
			},function(error){
				unloader("body");
			});
		}

	}

	self.createGridStarForTable = function(index,tableHeadings,rowData){
		var columnDefs = [];
		for(var i=0;i<tableHeadings.length;i++){
			columnDefs.push({headerName: tableHeadings[i], field: tableHeadings[i]});
		}
		var gridOptions = {
				defaultColDef: {
					width: 100,
					sortable: true,
					resizable: true,
					filter: true,
					editable: false
				},
				pagination: true,
				paginationPageSize: 20,
				columnDefs: columnDefs,
				rowData: rowData,
				onGridReady: function () {
					gridOptions.api.sizeColumnsToFit();
				}
		};
// document.addEventListener("DOMContentLoaded", function() {
		var eGridDiv = document.querySelector('#'+index);
		new agGrid.Grid(eGridDiv, gridOptions);
// });

	}






	function loadWidgetsForReport(widgetId,startDate,endDate,query,queryString){

		widgetService.loadSingleWidget(widgetId,startDate,endDate,queryString,query).then(function (response) {




			var id = widgetId;


			var parentresponse = response;






			var str = '<div class="dashboard-panel ag-grid-color" style="margin-top:5px;margin-bottom:5px;"><div  style="font-size:13px;font-weight: bold;margin: 7px 7px 2px 7px;"><b>'+response.data.title+'</b></div><div class="panel-body"><div  id = '+id+' style="height:300px"></div></div></div>'

			widgetService.loadSingleTheme('chalk').then(function (response) {	

				var svg = 	angular.element(str);
				$("#"+id+"-chart").append(svg)	

				var curWidget = JSON.parse(parentresponse.data.cfg);

				curWidget.config['themeOptions'] = response.data;
				curWidget.config['themeName'] = 'chalk';
				curWidget.config['drillDownWidgetId'] = parentresponse.data.drillDownWidgetId;
				curWidget.config['startDate'] = startDate;
				curWidget.config['endDate'] = endDate;


				var charType = curWidget.config.chart_type;

				if (charType == 'chinaMapBmap') {
					chartService.render($('#'+id), {
						config: curWidget.config,
						datasetId: $scope.customDs ? undefined : curWidget.datasetId,
								query: curWidget.query,
								datasetId: curWidget.dataSetId
					});
					$scope.loadingPre = false;
				} else {
					chartService.renderWithOutDataService($('#'+id), {
						config: curWidget.config,
						datasource: $scope.datasource ? $scope.datasource.id : null,
								query: curWidget.query,
								datasetId: $scope.customDs ? undefined : curWidget.datasetId,
										widgetId : parseInt(curWidget.dataSetId),
										data: parentresponse
					});
				}
				self.resizeHighCharts();	
				$(".table-responsive").css("height","300px");

			}, function (error) {

			});		
		}, function (error) {

		});

	}

	self.resizeHighCharts = function(){
		Highcharts.charts.forEach(function(chart) {
			if($(chart).length!=0){
				var height = $($(chart)[0].renderTo).parent().height()-20;
				var width = $($(chart)[0].renderTo).parent().width()-10;
				chart.reflow();
				chart.setSize(width,height);
			}
		});
	} 



	$scope.loadWidgetsForReport();



	$scope.reports = {id:0,reportingTitle:'',reportingDescription:'',complianceType:'',requriment:'',dateRange:'',tempconditionId:[],tempwidgetIds:[],category:''};

	self.generalAlerts = [];

	self.fieldAlerts = [];

	$scope.schedule = {id:0,scheduleName:'',emailAddress:'',emailSubject:'',frequency:'',reportId:0,startDate:'',endDate:'',reportFormat:''}


	$scope.goBackToTables = function(){
		$scope.schedulerTables= true;
		$scope.schedulerForm= false;
	}


	$scope.schedule.frequency = '0 8 9 9 1/8 ? *';
	$scope.cronOptions = {
			hideAdvancedTab: false
	};
	$scope.isCronDisabled = false;

	self.showReportingTemplate = function(){
		self.data.query = [{"bool":{"must":[]}}];
		self.data.needsUpdate = true;
		$scope.alertsForm.$setPristine();
		$scope.reports = {id:0,reportingTitle:'',reportingDescription:'',complianceType:'',requriment:'',dateRange:'',tempconditionId:[],tempwidgetIds:[],category:''};
		$("#report-template-modal").modal();
		$scope.buttonName = "Create";
		$scope.showDelete = false;
		$(".filter.form-control").text("")
	}


	self.complianeTypes = [];
	self.categoryType = [];
	self.loadReports = function(){
		reportingService.loadReports().then(function (response){
			$scope.reportData = response.data;
			$scope.orgReportData = response.data;
			$scope.categoryDisplayText = "Category";
			$scope.complianceDisplayText = "Compliance Type";
			$scope.complianceType = "";
			$scope.categoryType = "";
			self.searchReport = "";
			var compliaceTemp = [];
			compliaceTemp = $scope.reportData.map( e => {
				return e.complianceType;
			});
			var categoryTemp = [];
			categoryTemp = $scope.reportData.map( e => {				
				return e.category;
			});
			self.categoryTypes = [...new Set(categoryTemp)].map(e => {
				return {"categoryType":e};
			});;
			self.complianeTypes = [...new Set(compliaceTemp)].map(e => {
				return {"complianceType":e};
			});

		},function(error){

		});
	}
	self.loadSchedulers = function(schedulerId){

		reportingService.loadSchedulers(schedulerId).then(function (response){
			$scope.reportSchedulers = response.data;
		},function(error){

		});
	}

	$scope.generateReport = function(reportId){

		var url = "/configuration#!/load-report?reportId="+reportId


		window.open(url,'_blank');

	}

	self.loadConditions = function(){
		eventService.getCategories().then(function(response){
			self.allCustomEvents = response.data.custom;
			$scope.conditions = [];
			for(let i=0;i<self.allCustomEvents.length;i++){
				if(self.allCustomEvents[i].type == 'Rules' || self.allCustomEvents[i].type == 'Events'){
					$scope.conditions.push(self.allCustomEvents[i]);
				}
			}
			console.log($scope.conditions);
		});
	}

	self.loadWidgets = function(){
		reportingService.loadWidgets().then(function (response){
			$scope.widgets = response.data;
		},function(error){

		});
	}

	$scope.reportHistoryDetails = [];

	self.loadReportSchedules = function(){
		reportingService.loadReportSchedules().then(function (response){
			$scope.reportHistoryDetails = response.data;
			self.loadAgGrid();
		},function(error){

		});
	}


	$scope.init = function (){
		self.loadConditions();
		self.loadWidgets();
		self.loadReports();
		self.loadReportSchedules();
	}

	$scope.init();



// $('.startDate').datepicker({
// autoclose:true,
//
// format: 'mm/dd/yyyy',
//
// });
//
//
// $('.endDate').datepicker({
// autoclose:true,
//
// format: 'mm/dd/yyyy',
//
// });

	$scope.dashboardContainsTable = false;


	$scope.saveOrUpdateReport = function(){


		if($scope.reports.reportingTitle==''||$scope.reports.reportingTitle==undefined||$scope.reports.reportingDescription==''||$scope.reports.reportingDescription==undefined||$scope.reports.complianceType==''||$scope.reports.complianceType==undefined||$scope.reports.requriment==''||$scope.reports.requriment==undefined||$scope.reports.dateRange==''||$scope.reports.dateRange==undefined||$scope.reports.tempconditionId==''||$scope.reports.tempconditionId==undefined||$scope.reports.tempwidgetIds==''||$scope.reports.tempwidgetIds==undefined || $scope.reports.category==undefined || $scope.reports.category==""){

			self.fieldAlerts.push({ type: 'danger', msg: 'Please fill all hilighted details' });

			$timeout(function () {
				self.fieldAlerts = [];
			}, 2000);

			return false;
		}


		var tempConditionId = [];

		var tempWidgets = [];
		$scope.reports.filterQuery = JSON.stringify(data.query[0]);
		for(var i=0;i<$scope.reports.tempconditionId.length;i++){
			tempConditionId.push($scope.reports.tempconditionId[i].id)
		}

		for(var i=0;i<$scope.reports.tempwidgetIds.length;i++){
			tempWidgets.push($scope.reports.tempwidgetIds[i].id)
		}

		$scope.reports.conditionId = tempConditionId.join(',');
		$scope.reports.widgetIds = tempWidgets.join(',');;


		reportingService.saveOrUpdateReport($scope.reports).then(function (response){
			if(response.data.status){



				$("#report-template-modal").modal('hide');

				self.generalAlerts.push({ type: 'success', msg: 'Report Creation was Successfull.' });
				self.loadReports();
				$timeout(function () {
					self.generalAlerts = [];
				}, 2000);


			}else{
				if(!(Array.isArray(response.data.errors)) ){
					self.fieldAlerts.push({ type: 'danger', msg: response.data.errors });
				}else{
					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){

							self.fieldAlerts.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.fieldAlerts.push({ type: 'danger', msg: response.data.error });
					}
				}
				$timeout(function () {
					self.fieldAlerts  = []
				}, 2000);
			}
		},function(error){

		});
	}

	$scope.displaySchedulerForEdit = function(id){

		for(var i=0; i<$scope.reportSchedulers.length;i++){
			if($scope.reportSchedulers[i].id === id){
				$scope.schedule = angular.copy($scope.reportSchedulers[i]);
				$scope.schedulerTables= false;
				$scope.schedulerForm= true;


				break;
			}
		}

	}

	$scope.deleteReport = function(reportId,reportName){
		if(reportName!='' && reportId!=0){
			$ngConfirm({ 
				animation: 'top',
				closeAnimation: 'bottom',
				theme: 'material',
				title: 'Confirm!',
				content: 'Do you want to delete <b>'+reportName+'</b> ',
				scope: $scope,
				buttons: {
					delete: {
						text: 'YES',
						btnClass: 'btn-danger',
						action: function(scope, button){

							reportingService.deleteReport(reportId).then(function (response) {
								if(response.data.status){
									self.generalAlerts.push({ type: 'success', msg: 'Report was deleted successfully' });
									$("#report-template-modal").modal('hide');
									self.loadReports();

									$timeout(function () {
										self.generalAlerts = [];
									}, 2000);
								}
								if(!response.data.status){
									self.generalAlerts.push({ type: 'danger', msg: response.data.message });
									// toastr.success("Condition was deleted
									// successfully")

									$timeout(function () {
										self.generalAlerts = [];
									}, 2000);
								}

							}, function (error) {

								if(error.status== 403){
									self.generalAlerts.push({ type: 'danger', msg: error.data.data });
									$timeout(function () {
										self.generalAlerts = [];
									}, 2000);
								}

								$timeout(function () {
									self.generalAlerts.splice(0, 1);
								}, 2000);
							});
							return true; 
						}
					},
					close: function(scope, button){


					}
				}
			});
		}
	}

	$scope.deleteCondition = function(schedulerName,schedulerId){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+schedulerName+'</b> ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){

						reportingService.deleteSchedulers(schedulerId).then(function (response) {
							if(response.data.status){
								self.reportingMessages.push({ type: 'success', msg: 'Schedules was deleted successfully' });

								self.loadSchedulers($scope.reportId);
								self.scheduleReports();
								$timeout(function () {
									self.reportingMessages = [];
								}, 2000);
							}
							if(!response.data.status){
								self.reportingMessages.push({ type: 'danger', msg: response.data.message });
								// toastr.success("Condition was deleted
								// successfully")

								$timeout(function () {
									self.generalAlerts = [];
								}, 2000);
							}


						}, function (error) {

							if(error.status== 403){
								self.reportingMessages.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.generalAlerts = [];
								}, 2000);
							}

							$timeout(function () {
								self.reportingMessages.splice(0, 1);
							}, 2000);
						});
						return true; 
					}
				},
				close: function(scope, button){


				}
			}
		});


	}


	$scope.saveReportScheduler = function(){

// var startDate ;
// var endDate = moment(new Date());

// var label= $scope.schedule.reportFormat;




// if(label==="Last One Hour"){
// startDate = moment(new Date()).subtract(1, 'hours');
// }

// if(label==="Today"){
// startDate = moment(new Date()).subtract(1, 'hours');
// }

// if(label==="Yesterday"){
// startDate = moment(new Date()).subtract(1, 'days').startOf('day');
// endDate = moment(new Date()).subtract(1, 'days').endOf('day');
// }
// if(label==="Last 7 Days"){
// startDate = moment(new Date()).subtract(6, 'days');
// }
// if(label==="Last 30 Days"){
// startDate = moment(new Date()).subtract(30, 'days')
// }
// if(label==="This Month"){
// startDate = moment(new Date()).startOf('month')
// }
// if(label==="Last Month"){
// startDate = moment(new Date()).subtract(1, 'month').startOf('month');
// }

// if(label!=""){
// $scope.schedule.startDate = startDate.valueOf();
// $scope.schedule.endDate = endDate.valueOf();
// }




		reportingService.saveSchedulersReport($scope.schedule).then(function (response){
			if(response.data.status){



				$("#scheduler-template-modal").modal('hide');

				self.generalAlerts.push({ type: 'success', msg: 'Report was successfully scheduled' });

				$timeout(function () {
					self.generalAlerts = [];
				}, 2000);


			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.reportingMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.reportingMessages.push({ type: 'danger', msg: response.data.data });
				}

				$timeout(function () {
					self.reportingMessages =[];
				}, 2000);
			}
		},function(error){

		});
	}

	self.calculateEpochForDateRange = function(option){
		try{
			if(option==='last2Days'){
				return moment(new Date()).subtract(2, 'days').valueOf()+"-"+moment(new Date()).valueOf();
			}else if(option==='last7Days'){
				return moment(new Date()).subtract(7, 'days').valueOf()+"-"+moment(new Date()).valueOf();
			} else if(option==='last30Days'){
				return moment(new Date()).subtract(30, 'days')+"-"+moment(new Date()).valueOf();
			}else if(option==='yesterday'){
				return moment(new Date()).subtract(1, 'days').startOf('day')+"-"+moment(new Date()).subtract(1, 'days').endOf('day');
			}else if(option==='today'){
				return moment(new Date()).startOf('day')+"-"+moment(new Date()).endOf('day');
			}else if(option==='last15Minutes'){
				return moment(new Date()).subtract(15, 'minutes')+"-"+moment(new Date()).valueOf();
			}else if(option==='last30Minutes'){
				return  moment(new Date()).subtract(30, 'minutes')+"-"+moment(new Date()).valueOf();
			}else if(option==='last1Hour'){
				return moment(new Date()).subtract(1, 'hours')+"-"+moment(new Date()).valueOf();
			}else if(option==='last3Hours'){
				return moment(new Date()).subtract(3, 'hours')+"-"+moment(new Date()).valueOf();
			}else if(option==='last6Hours'){
				return moment(new Date()).subtract(6, 'hours')+"-"+moment(new Date()).valueOf();
			}else if(option==='last12Hours'){
				return moment(new Date()).subtract(12, 'hours')+"-"+moment(new Date()).valueOf();
			}else if(option==='last24Hours'){
				return moment(new Date()).subtract(24, 'hours')+"-"+moment(new Date()).valueOf();
			}
		}catch(err){
			console.log(err);
		}
	}


	self.widget = {operationType:"insert",option:"events",title:""}
	widgetService.preview(self.widget).then(function (response) {
		$scope.schema = {selects: []};
		data["fields"] = {};
		angular.forEach(response.data.data, function (key) {
			$scope.schema.selects.push({column: key});
			if(key==='event_tags'){
				data.fields[key+".keyword"] = { type: 'multi',title:key,field:key+".keyword",choices:self.tagDetails};
			}else{
				data.fields[key+".keyword"] = { type: 'term',title:key,field:key+".keyword"};
			}
		});
	}, function (error) {
		unloader("body");
		if(error.status== 403){
			self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			unloader("body");
		}
	});


	self.disableReport = function(id,reportId){
		$scope.reportId = reportId;
		reportingService.disableReport(id).then(function(response){
			if(response.data.status){
				self.reportingMessages.push({ type: 'success', msg: 'Succesfully disabled the report' });
			}else{
				self.reportingMessages.push({ type: 'danger', msg: 'unable to enable the report' });
			}
			$timeout(function(){
				self.reportingMessages = [];
			},3000);
			self.scheduleReports();
			self.loadSchedulers($scope.reportId);
		},function(error){

		});
	}

	self.enableReport = function(id,reportId){
		$scope.reportId = reportId;
		reportingService.enableReport(id).then(function(response){
			if(response.data.status){
				self.reportingMessages.push({ type: 'success', msg: 'Succesfully enabled the report' });
			}else{
				self.reportingMessages.push({ type: 'danger', msg: 'unable to enable the report, please try again' });
			}
			$timeout(function(){
				self.reportingMessages = [];
			},3000);
			self.scheduleReports();
			self.loadSchedulers($scope.reportId);
		},function(error){

		});
	}

	self.displayEdit = function(data){
		$("#schedules_reports").modal("hide");
		$("#scheduler-template-modal").modal('show');
		$scope.schedule = angular.copy(data);
		$scope.schedulerTables= false;
		$scope.schedulerForm= true;
	}

	self.categoryTypeConfig  = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'categoryType',
			searchField: ['categoryType'],
			valueField: 'categoryType',
			create: true
	}

	self.complienceTypeConfig  = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'complianceType',
			searchField: ['complianceType'],
			valueField: 'complianceType',
			create: true
	}

	
	self.columnDefs = [
		{headerName: "Report Name",field: "reportName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Last Run",field: "lastRun",comparator: dateComparator,valueGetter: function(params) {
	    	if(params.data != undefined){	    		
	    		return moment(params.data.lastRun).format('L LT');
	    	}
		},width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Next Run",field: "nextRun",comparator: dateComparator,valueGetter: function(params) {
	    	if(params.data != undefined){	    		
	    		return moment(params.data.nextRun).format('L LT');
	    	}
		},width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
    ]
	
		
			self.loadAgGrid = function(){
				$timeout(function(){
					self.eventGrid = {
							defaultColDef: {
								width: 100,
								sortable: true,
								resizable: true,
								filter: true,
								editable: false
							},
							autoGroupColumnDef: {
								width: 180
							},
							columnDefs: self.columnDefs,
							rowGroupPanelShow: 'onlyWhenGrouping',
							animateRows: true,
							debug: false,
							suppressAggFuncInHeader: true,
							sideBar: {
								toolPanels: [{
									id: 'columns',
									labelDefault: 'Columns',
									labelKey: 'columns',
									iconKey: 'columns',
									toolPanel: 'agColumnsToolPanel',
									toolPanelParams: {
										suppressPivots: true,
										suppressPivotMode: true,
									}
								}],
			
//								defaultToolPanel: 'columns'
							},
							rowData: $scope.reportHistoryDetails,
							rowSelection: 'single',
							floatingFilter:true,
							rowGroupPanelShow: 'always',
							onSelectionChanged: self.onSelectionChanged,
							onFirstDataRendered(params) {
								params.api.sizeColumnsToFit();
							}
					}
					self.tagsId = [];
					$("#reportHistoryContent").empty();
					$("#downloadButton").hide();
					$("#reportHistoryContent").css("height",$(window).height()-250+"px");
					if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
						self.eventGrid.api.deselectAll();
					}
					var eGridDiv =  document.querySelector('#reportHistoryContent');
					new agGrid.Grid(eGridDiv, self.eventGrid );
				},250);
			}
	
	
	self.onSelectionChanged = function() {
		self.tagsId = [];
		$("#downloadButton").hide();
		self.tagsId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.tagsId.length > 0){			
			$("#downloadButton").show();
		}
	}
	
	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{self.eventGrid.api.sizeColumnsToFit();
	    	 $("#reportHistoryContent").css("height",$(window).height()-250+"px");}catch(err){}
	    }, 500);
	});
	
	
	self.downloadReport = function(){
		var link = document.createElement('a');
		link.href = '/siem-core/user/report/export/'+self.tagsId[0].id;
		link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();    
		
// $window.open('/siem-core/user/report/export/'+self.tagsId[0].id, '_blank');
	}
	
}]);