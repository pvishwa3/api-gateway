
app.controller("dashboardNewController", ['$scope', 'widgetService','$rootScope','$timeout','$uibModal','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$ngConfirm','$location','$routeParams','Fullscreen','$route','$interval','$window','tagService','colorConfigurationFactory','$filter','alertsFactory','chartService','$compile','investigationPanelFactory','logDevicesFactory','$sessionStorage','settingsFactory',function ($scope, widgetService,$rootScope, $timeout,$uibModal,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$ngConfirm,$location,$routeParams,Fullscreen,$route,$interval,$window,tagService,colorConfigurationFactory,$filter,alertsFactory,chartService,$compile,investigationPanelFactory,logDevicesFactory,$sessionStorage,settingsFactory) {
	var self = this;
	$scope.editMode = false;
	var data = this.data = {};
	$scope.from = 0;
	$scope.treeData = [];

	$scope.isGroupEnabled = false;
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';

	$scope.enableConnect = function(){
		setTimeout(function(){ 
			if(!$scope.isGroupEnabled){
				$("div.chart").each(function(){
					var chartId = $(this)[0].id;
					var id = $(this).attr('_echarts_instance_');
					if(window.echarts.getInstanceById(id)){
						window.echarts.getInstanceById(id).group = "groupcharts";
						window.echarts.getInstanceById(id).setOption({
							toolbox : {
								show:false
							}
						});
					}
				});
				echarts.connect('groupcharts');
				$scope.isGroupEnabled = true;
			}else{

				
				$("div.chart").each(function(){
					var chartId = $(this)[0].id;
					var id = $(this).attr('_echarts_instance_');
					if(window.echarts.getInstanceById(id)){
						window.echarts.getInstanceById(id).group = "groupcharts";
						window.echarts.getInstanceById(id).setOption({
							toolbox : {
								show:true
							}
						});
					}
				});
				
				echarts.disconnect('groupcharts');
				$scope.isGroupEnabled = false;
			}

		}, 400);
	}

	self.allCategories = [];

	self.finalDashboard = [];

	$scope.downloadAsExcel = function(){

		widgetService.downloadAsExcel($scope.model.id,$scope.options).then(function (response) {
			//var blob = new Blob([response.data], {type: "application/vnd.ms-excel"});
			saveAs(response.data, $scope.model.title+".xlsx");
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	self.getAllUsers = function(){
		settingsFactory.getUsersWithInCompany($sessionStorage.user.companyName).then(function (response) {
			self.allUsers = response.data;


			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}


	$timeout(function(){		
		self.getAllUsers();
	},$sessionStorage.user == undefined?3000:0);

	self.loadAllCategories = function(){
		widgetService.loadDashboardCategories().then(function (response) {

			self.categories = response.data;

			for(var i=0;i<self.categories.length;i++){

				if(self.categories[i].parent==='#'){
					self.categories[i]['state'] = {"opened":true}
				}
				if(self.categories[i].type != 'Dashboard'){
					self.allCategories.push(self.categories[i]	);
				}else{
					self.finalDashboard.push(self.categories[i]);
				}
			}

//			$window.localStorage.setItem("user-dashboards",JSON.stringify(self.categories));

			setTimeout(function(){ 

				angular.copy(self.categories,$scope.treeData);

				$scope.treeConfig = {


						types : {
						default : {
							icon : '/assets/images/folder.png',
						},
						'Dashboard' : {
							icon : 'fa fa-dashboard',
						},
						'Private' : {
							icon : 'fa fa-user'
						},
						"Public": {
							icon : 'fa fa-group'
						},
						"Shared":{
							icon:'fa fa-share-alt'
						}


						},
						version : 1,
						plugins : ['types',"search","sort"]
				};

			}, 3000);









		}, function (error) {

		});
	}

	self.loadAllCategories();




//	$scope.themeName = localStorage.getItem("dashboard-themeType");

	$scope.currentCompany = "All";

	$scope.filterCompany = function(companyName){
		$scope.currentCompany = companyName;
		$scope.apply();

	}

	$scope.reports = {id:0,scheduleName:'',emailAddress:'',frequency:'',dashboardId:'',timeRange:'',hourOfDay:'',frequencyType:'',dashboardId:0}


	$scope.search = function (val){
		var to = false;
		if(to) {
			clearTimeout(to);
		}
		to = setTimeout(function () {
			if($scope.treeInstance) {
				$scope.treeInstance.jstree(true).search(val);
			}
		}, 250);
	};

	self.reportAlerts = [];

	$scope.deleteReport = function(id){
		widgetService.deleteReports(id).then(function (response) {

			if(response.status){
				self.reportAlerts.push({ type: 'success', msg: "Successfully Deleted the Report." });
				$scope.reports = {id:0,scheduleName:'',emailAddress:'',frequency:'',dashboardId:'',timeRange:'',hourOfDay:'',frequencyType:'',dashboardId:0}
				$scope.isRepotsEditable = false;


			}else{
				self.reportAlerts.push({ type: 'danager', msg: "Unable to Schedule Report " });
			}
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);


		}, function (error) {

			if(error.status== 403){
				self.reportAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.reportAlerts = [];
				}, 2000);
			}
			if(error.status== 500){
				self.reportAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.reportAlerts = [];
				}, 2000);
			}


		});
	}

	$scope.saveReports = function(){
		if($scope.reports.scheduleName===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Enter Title " });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		if($scope.reports.frequency===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select  Frequency" });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		if($scope.reports.hourOfDay===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select Hour of Day" });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		if($scope.reports.emailAddress===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Email Address " });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		if($scope.reports.hourOfDay===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select Hour of Day" });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}
		if($scope.reports.timeRange===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select Export Time Range " });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}
		if($scope.reports.frequency!= 'daily'  && $scope.reports.frequencyType===''){
			self.reportAlerts.push({ type: 'danger', msg: "Please Select Ferquency Type" });
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);
			return false;
		}

		$scope.reports.dashboardId = $scope.dashboard.id

		widgetService.saveReprts($scope.reports).then(function (response) {

			if(response.status){
				self.reportAlerts.push({ type: 'success', msg: "Successfully Scheduled the Report." });

				$scope.reports.id = response.data.id;
				$scope.isRepotsEditable = true;


			}else{
				self.reportAlerts.push({ type: 'danager', msg: "Unable to Schedule Report " });
			}
			$timeout(function () {
				self.reportAlerts = [];
			}, 2000);


		}, function (error) {

			if(error.status== 403){
				self.reportAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.reportAlerts = [];
				}, 2000);
			}
			if(error.status== 500){
				self.reportAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.reportAlerts = [];
				}, 2000);
			}


		});
	}

	self.deviceTypesList =[];

	self.currentCompanies = [];

	self.getDeviceTypes = function(){
		logDevicesFactory.getDevices().then(function(response){
			self.deviceTypesList = angular.copy(response.data);
		},function(error){

		});
	}

	self.getCurrentCompanies = function(){
		widgetService.getCurrentCompanies().then(function(response){
			self.currentCompanies = angular.copy(response.data);

		},function(error){

		});
	}

	$scope.filterCategory = function(data){

		$scope.categoryDisplayText = data;
		if(self.query.rules){


			for(var i=0;i<self.query.rules.length;i++){
				if(self.query.rules[i].field=== 'log_device.keyword'){
					self.query.rules.splice(i,1);
				}
			}
		}
		if(data!='All'){
			self.temp = {field:'log_device.keyword',subType: "equals",value: data}
			$scope.submitQuery();
		}else{
			$scope.output = JSON.stringify(parseFilterGroup(self.data.fields,$filter,self.query));
			$scope.options = { 
					startDate: $scope.startDate, 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:$scope.dateLable,
					filter : $scope.output,
					queryString : $scope.output,
					color:self.colors,
					companyName:$scope.currentCompany
			}
			$scope.toggleLive('start');
			$scope.apply();

			self.temp = {};
		}


	}

	$scope.accessList = [];

	$scope.existingAccess = [];

	$scope.accessModel = {name:''};

	$scope.accessData = {id:0,name:'',type:'',access:''}
	self.accessAlerts = [];

	$scope.addToList = function(){

		if($scope.accessModel.name.name=== ''){
			self.accessAlerts.push({ type: 'danger', msg: 'Please Select Role Or User to share ' });
			$timeout(function () {
				self.accessAlerts = [];
			}, 2000);

			return false;
		}
		if($scope.accessData.access === ''){
			self.accessAlerts.push({ type: 'danger', msg: 'Please Select Access ' });
			$timeout(function () {
				self.accessAlerts = [];
			}, 2000);
			return false;
		}

		$scope.accessData.name = $scope.accessModel.name.name
		$scope.accessData.type = $scope.accessModel.name.type;
		$scope.accessData.id = 	$scope.dashboard.id;


		widgetService.shareDashboard($scope.accessData).then(function (response) {

			if(response.status === 201){
				self.accessAlerts.push({ type: 'success', msg: "Successfully share the dashboard" });
				widgetService.loadSingleDashboard($scope.dashboard.id).then(function (response) {
					$scope.model['existingRoles'] = response.data.existingRoles;
				}, function (error) {

				});
			}
			$timeout(function () {
				self.accessAlerts = [];
			}, 2000);


		}, function (error) {

			if(error.status== 403){
				self.accessAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.accessAlerts = [];
				}, 2000);
			}
			if(error.status== 500){
				self.accessAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.accessAlerts = [];
				}, 2000);
			}


		});
	}

	self.getAccessList = function(){
		widgetService.getAccessList().then(function (response) {

			$scope.accessList = response.data;



		}, function (error) {

			if(error.status== 403){
				self.alertMessagaesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
			}


		});
	}


	self.logTypeFieldsWithDataType = [];

	self.getLogFieldsWithDataTypes = function(){
		logDevicesFactory.getAllLogFields().then(function(response){
			self.logTypeFieldsWithDataType = angular.copy(response.data);
		},function(error){

		});

	}



	self.getDeviceTypes();
	self.getLogFieldsWithDataTypes();
	self.getCurrentCompanies();

	self.getAccessList();

	$scope.categoryDisplayText = "";


	self.workBench = {id:0,workBenchName:"",description:"",status:"",userNames:"",artifacts:"",createdDate:"",lastupdateDate:"",networkJson:"",suspicious:"",priority:''};

	$scope.kpiWidgets = [];
	self.widgets= [];
	self.categories = [];
	$scope.headerTitle = "Events";

	self.caseDetails = {id:"",title:"",description:"",status:"",priority:"",dueDate:"",assingee:"",alertIds:'',caseType:''}

	$scope.liveMode = false;

	$scope.infoTableType = "events";

	$scope.ExistingCasesError = false;

	self.allCasesDetails = [];

	self.alertMessagaesModal = [];

	$rootScope.viewLoaded = true;

	$scope.refreshDashboard = function(){

		$scope.apply();
	}



	self.loadAllCategories = function(){
		widgetService.loadDashboardCategories().then(function (response) {

			self.categories = response.data;

			for(var i=0;i<self.categories.length;i++){

				if(self.categories[i].parent==='#'){
					self.categories[i]['state'] = {"opened":true}
				}


			}

			angular.copy(self.categories,$scope.treeData);

		}, function (error) {

		});
	}





	$scope.showDashboardTree = function(){
		$("#dashboard-modal").modal();
		self.loadAllCategories();
	}


	$scope.clearFilters = function(){
		self.query  = {subType: "must",type: "group",rules:[]};
		$scope.output = JSON.stringify(parseFilterGroup(self.data.fields,$filter,self.query));
		$scope.endDate = moment(new Date()).valueOf();
		$scope.options = {
				startDate: $scope.startDate, 
				endDate: $scope.endDate,
				renderAllWidgets:true,
				dateLabel:$scope.dateLable,
				filter : $scope.output,
				queryString : $scope.output,
				color:self.colors,
				companyName:$scope.currentCompany,

		}
		$scope.toggleLive('start');
		$scope.apply();
	}

	$scope.slickConfig = {
			enabled: true,
			autoplay: false,
			infinite:true,
			draggable: true,
			autoplaySpeed: 1000,
			variableWidth: true,
			arrows: true,
			initialSlide: 1,
			centerMode: true,
			centerPadding: '40px',
			adaptiveHeight: true,
			prevArrow:'<button class = "btn btn-dark pull-right"><i class = "fa fa-angle-left"></i> </button>',
			nextArrow:'<button class = "btn btn-dark pull-right"><i class = "fa fa-angle-right"></i> </button>',
			slidesToShow: 4,
			slidesToScroll: 4,
			method: {},
			responsive: [
				{breakpoint: 330, settings: {slidesToShow: 2, slidesToScroll: 2,initialSlide: 1,centerMode: true,variableWidth: true}},
				{breakpoint: 495, settings: {slidesToShow: 3, slidesToScroll: 2,initialSlide: 1}},
				{breakpoint: 600, settings: {slidesToShow: 3, slidesToScroll: 2,initialSlide: 1}},
				{breakpoint: 660, settings: {slidesToShow: 3, slidesToScroll: 2,initialSlide: 1}},
				{breakpoint: 825, settings: {slidesToShow: 4, slidesToScroll: 2,initialSlide: 1,centerMode: true,variableWidth: true}},
				{breakpoint: 990, settings: {slidesToShow: 4, slidesToScroll: 2,initialSlide: 1,centerMode: true,variableWidth: true}},
				// 3
				{breakpoint: 1024, settings: {slidesToShow: 4, slidesToScroll: 4,initialSlide: 1,centerMode: false,variableWidth: true}},
				{breakpoint: 1155, settings: {slidesToShow: 4, slidesToScroll: 3,initialSlide: 1,centerMode: false,variableWidth: true}},
				{breakpoint: 1207, settings: {slidesToShow: 4, slidesToScroll: 3,initialSlide: 1,centerMode: false,variableWidth: true}},
				{breakpoint: 1320, settings: {slidesToShow: 4, slidesToScroll: 3,initialSlide: 1,centerMode: true,variableWidth: true}},
				{breakpoint: 1485, settings: {slidesToShow: 4, slidesToScroll: 3,initialSlide: 1,centerMode: false,variableWidth: true}},
				{breakpoint: 1650, settings: {slidesToShow: 4, slidesToScroll: 3,initialSlide: 1,centerMode: true,variableWidth: true}},
				{breakpoint: 1815, settings: {slidesToShow: 6, slidesToScroll: 3,initialSlide: 1,centerMode: true,variableWidth: true}},
				// 4
				{breakpoint: 1980, settings: {slidesToShow: 6, slidesToScroll: 4,initialSlide: 1,centerMode: true,variableWidth: true}},
				{breakpoint: 2145, settings: {slidesToShow: 6, slidesToScroll: 4,initialSlide	: 1,centerMode: true,variableWidth: true}}
				],
				event: {
					beforeChange: function (event, slick, currentSlide, nextSlide) {
					},
					afterChange: function (event, slick, currentSlide, nextSlide) {
					}
				}
	};

	self.submitData = function(){
		var tempArray = [];

		if($scope.alertNames.length==0){

			return false;

		}



		self.workBench.artifacts = '';
		self.workBench.userNames = '';
		self.workBench.alertId = $scope.alertNames[0].alertId;


		self.workBench.keyIndicator = $scope.keyIndicators[self.workBench.keyIndicatorValue];
		if(self.workBench.workBenchName == '' || self.workBench.workBenchName == undefined || self.workBench.status =='' || self.workBench.status == undefined || self.workBench.description==''||self.workBench.description == undefined){
			self.alertMessagaesModal.push({ type: 'danger', msg: ' Please fill the highlightef fields' });
			$timeout(function () {
				self.alertMessagaesModal = [];
			}, 2000);
			return false;
		}else if(self.workBench.status =='Closed'){
			if(self.workBench.comments == ''  || self.workBench.comments == undefined ){
				self.alertMessagaesModal.push({type:"danger",msg:"plase enter the comments"})
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
				return false;
			} 
		}

		//self.workBench.
		loader("#createWorkModal");
		investigationPanelFactory.saveWorkBench(self.workBench).then(function (response) {
			if(response.data.status){
				self.alertMessagaesModal.push({ type: 'success', msg: ' Workbench was created successfully Updating Alert Information' });
				self.updateAlertsWithInvestigation(response.data.id,"createWorkModal")

				$timeout(function(){						
					unloader("#createWorkModal");
					unloader("body");
					for(var i=0;i<$scope.alertNames.length;i++){					
						$scope.getEventInfo($scope.alertNames[i].alertId);					
					}
				},2000);

			}else{
				unloader("#createWorkModal");
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.alertMessagaesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaesModal.push({ type: 'danger', msg: response.data.data });

				}
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
			}



		}, function (error) {
			unloader("#createWorkModal");
			if(error.status== 403){
				self.alertMessagaesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
			}


		});
	}

	$scope.indicators = [];

	$scope.keyIndicators = {};

	self.addAlertToInvestigation = function(){
		$scope.indicators = [];
		$scope.keyIndicators = {};
		self.workBench = {id:0,workBenchName:"",description:"",status:"",userNames:"",artifacts:"",createdDate:"",lastupdateDate:"",networkJson:"",suspicious:"",keyIndicator:"",keyIndicatorValue:""};

		var tempData = $scope.singleEvnentInfo['Event Data'];

		for(var i=0;i<tempData.length;i++){
			Object.keys(tempData[i]).forEach(function(key) {


				for(var j=0;j<self.logTypeFieldsWithDataType.length;j++){
					if(self.logTypeFieldsWithDataType[j].displayName === key && (self.logTypeFieldsWithDataType[j].dataType === 'Hash' || self.logTypeFieldsWithDataType[j].dataType === 'User' || self.logTypeFieldsWithDataType[j].dataType === 'IP' || self.logTypeFieldsWithDataType[j].dataType === 'Domain' ||  self.logTypeFieldsWithDataType[j].dataType === 'Process' || self.logTypeFieldsWithDataType[j].dataType === 'File') ){
						if($scope.indicators.indexOf(tempData[i][key])==-1){
							$scope.indicators.push(tempData[i][key]);
							$scope.keyIndicators[tempData[i][key]]=self.logTypeFieldsWithDataType[j].fieldName;
						}

					}

				}

			});
		}







		$("#createWorkModal").modal();
		$scope.investigationForm.$setPristine();
		$scope.investigationForm.$setUntouched();
	}

	self.addToExistingCase = function(){
		if(self.caseDetails.id == '' || self.caseDetails.id == undefined){
			$scope.ExistingCasesError = true;
		}else{
			$scope.ExistingCasesError = false;
			for(var i=0;i<self.allCasesDetails.length;i++ ){
				if(self.allCasesDetails[i].id===self.caseDetails.id){

					self.caseDetails.title = self.allCasesDetails[i].name;
					self.caseDetails.alertIds = JSON.stringify($scope.alertNames);
					alertsFactory.addAlertsToExistingCase(self.caseDetails).then(function(response){
						if(response.data.status){


							$scope.options = [];
							self.updateCasesWithAlerts(self.caseDetails.id,"create_template_chooser");
							self.caseErrorMessages.push({ type: 'success', msg: "Case Creation was successfull." });
							$("#create_case_template").modal('hide');
							//self.loadAlertHistory($scope.startDate,$scope.endDate);
						}else{
							self.caseErrorMessages.push({ type: 'danger', msg: response.data.error });

							$timeout(function () {

								self.caseErrorMessages = [];
							}, 2000);
						}

					});

					//self.loadAlertHistory();
				}
			}
		}
	}

	self.caseErrorMessages =[];
	$scope.alertNames = [];
	self.alertMessagaes = []

	self.addToCase = function(){
		self.caseErrorMessages = [];
		self.alertMessagaes = [];
		$scope.ExistingCasesError = false;

		$scope.docIds = [];


		//$scope.docIds.push($scope.alertHistory[i].id);







		if($scope.alertNames.length==0){
			self.alertMessagaes.push({ type: 'danger', msg: "Please select atleast one alert" });

			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			return false;
		}
		self.caseDetails = {};	
		$("#create_template_chooser").modal();
	}


//	$('#due-date').datepicker({
//	format: {

//	toDisplay: function (date, format, language) {
//	var d = new Date(date);
//	d.setDate(d.getDate());
//	self.caseDetails.dueDate = moment(d).endOf('day').valueOf();
//	$scope.displayDate = moment(d).endOf('day').format('MM/DD/YYYY HH:mm:ss')
//	return $scope.displayDate;
//	},
//	toValue: function (date, format, language) {
//	var d = new Date(date);
//	d.setDate(d.getDate());
//	self.caseDetails.dueDate = moment(d).endOf('day').valueOf();
//	return self.caseDetails.dueDate;
//	}
//	},
//	todayBtn: "linked",
//	autoclose: true,
//	todayHighlight: true
//	});


	self.loadAllCases = function(){
		alertsFactory.getAllCases().then(function(response){
			self.allCasesDetails = response.data;
		});
	}

	self.loadAllCases();

	$scope.createNewCase = function(){
		$("#create_template_chooser").modal('hide');
		self.caseDetails = {id:"",title:"",description:"",status:"",priority:"",dueDate:"",assingee:"",alertIds:'',caseType:''}
		$("#create_case_template").modal();
		$scope.caseForm.$setPristine();
		$scope.caseForm.$setUntouched();
	}


	self.createCase = function(){
		if ($scope.caseForm.$valid) {

			loader("#create_case_template");

			self.caseDetails.alertIds = JSON.stringify($scope.alertNames);

			alertsFactory.createCase(self.caseDetails).then(function(response){
				if(response.data.status){
					$("#create_case_template").modal('hide');
//					$scope.apply();

					self.updateCasesWithAlerts(response.data.id,"create_case_template");
					self.caseErrorMessages.push({ type: 'success', msg: "Case Creation was successfull." });
					
//					$rootScope.viewLoaded = true;
//					$("#myGrid").empty();
//					self.intializeGrid();


					$timeout(function(){							
						
						for(var i=0;i<$scope.alertNames.length;i++){
							var rowNode = gridOptions.api.getRowNode($scope.alertNames[i].alertId);
							rowNode.setDataValue('case_name', self.caseDetails.title);
						}
						$scope.singleEvnentInfo['case_name'] = self.caseDetails.title;
//						$scope.getEventInfo($scope.alertNames[0].alertId);
					},2000);
					//self.loadAlertHistory($scope.startDate,$scope.endDate);
				}else{
					unloader("#create_case_template");
					unloader("body");
					self.caseErrorMessages.push({ type: 'danger', msg: response.data.error });

					$timeout(function () {

						self.caseErrorMessages = [];
					}, 2000);
				}

			},function(error){
				self.caseErrorMessages.push({ type: 'danger', msg: "Unable to create the case"});
				unloader("create_case_template");
				unloader("body");
			});
		}

	}

	self.updateAlertsWithInvestigation = function(id,templatName){

		var data = {investigationId:id,investigationName:self.workBench.workBenchName,alertId:$scope.singleEvnentInfo.id}

		alertsFactory.updateAlertsWithInvestigation(data).then(function(response){

			if(response.data.status){

				$("#"+templatName).modal('hide');

				self.alertMessagaes.push({ type: 'success', msg: "Succesfully created the investigation" });

				$timeout(function () {

					self.alertMessagaes = [];

				}, 2000);



			}else{
				self.alertMessagaes.push({ type: 'danger', msg: "unable to create the investigation" });

				$timeout(function () {

					self.alertMessagaes = [];
				}, 2000);
			}



		});
	}

	self.updateCasesWithAlerts = function(id,templatName){

		var tempAlertIds = [];
		for(var i=0;i<$scope.alertNames.length;i++){
			tempAlertIds.push($scope.alertNames[i].alertId);
		}



		var data = {caseName:self.caseDetails.title,caseId:id,alertId:tempAlertIds.join(',')}

		alertsFactory.updateAlertsWithCases(data).then(function(response){

			if(response.data.status){

				$("#"+templatName).modal('hide');

				self.alertMessagaes.push({ type: 'success', msg: "Succesfully created the case" });

				$timeout(function () {

					self.alertMessagaes = [];

				}, 2000);



			}else{
				self.alertMessagaes.push({ type: 'danger', msg: "unable to create the case" });

				$timeout(function () {

					self.alertMessagaes = [];
				}, 2000);
			}



		});
	}



	$scope.Timer = null;




	$scope.toggleLive = function(liveMode){

		if(angular.equals(liveMode,'start')){
			$scope.liveMode = true;
			$scope.Timer = $interval(function() {
				$scope.pollWidgets();
			}, 5000);
		}else if(angular.equals(liveMode,'stop')){
			$scope.liveMode = false;
			if (angular.isDefined($scope.Timer)) {
				$interval.cancel($scope.Timer);
			}
		}
	}

	$rootScope.$on('$locationChangeSuccess', function (event, current) {
		$scope.toggleLive('start');
		//scope.model.loading = true;
	});

	$scope.toggleLive('stop');


	$scope.pollWidgets = function(){

		var temp = false

		if(temp){



			var startDate = moment(new Date()).subtract(10, 'seconds').valueOf();
			var endDate = moment(new Date()).valueOf();


			for(var i=0;i<$scope.kpiWidgets.length;i++){

				widgetService.loadSingleWidget($scope.kpiWidgets[i].id,startDate,endDate,$scope.options.filter,$scope.options.queryString,$scope.currentCompany).then(function (response) {

					if(response.data.data != undefined && response.data.data.length!=0){

						var curWidget = JSON.parse(response.data.cfg);

						var data1 = {
								config: curWidget.config,
								data: response
						}

						var chartData =chartService.getSeriesData(data1,$scope);
						if(chartData.kpiValue!="0"){
							$("#kpi-"+response.data.widgetId).empty();

							var containerDom = $("#kpi-"+response.data.widgetId);





							var render = new CBoardKpiRender(containerDom, chartData);
							var html = render.html(false);
							if ($scope) {
								containerDom.append($compile(html)($scope));
							} else {
								containerDom.html(html);
							}
						}


					}else{
						$("#kpi-"+response.data.widgetId).append("<h3 class=\"font-weight-semibold\" style=\"margin-left:25%;font-size:13px;margin-top: 10%;\">No Data Found</h3>")
					}





				}, function (error) {

				});

			}

			for(var i=0;i<self.widgets.length;i++){





				widgetService.loadSingleWidget(self.widgets[i].id,startDate,endDate,$scope.options.filter,$scope.options.queryString,$scope.currentCompany).then(function (response) {


					var curWidget = JSON.parse(response.data.cfg);

					var data1 = {
							config: curWidget.config,
							data: response
					}

					var chartData =chartService.getSeriesData(data1,$scope);

					if(response.data.data.length!=0){



						$("div.chart").each(function(){
							var chartId = $(this)[0].id;


							if(chartId===response.data.widgetId.toString()){
								var id = $(this).attr('_echarts_instance_');




								if(window.echarts.getInstanceById(id)){



									if(curWidget.config.chart_type === 'line'){
										var series = chartData.series;

										var xaxis = chartData.xAxis.data;

										var existingData = window.echarts.getInstanceById(id).getOption();


										for(var i=0;i<series.length;i++){
											existingData.series[i].data.shift();
											for(var k =0;k<series[i].data.length;k++){
												existingData.series[i].data.push(series[i].data[k]);
											}
										}
										existingData.xAxis[0].data.shift();

										for(var i=0;i<xaxis.length;i++){
											existingData.xAxis[0].data.push(xaxis[i]);
										}
										window.echarts.getInstanceById(id).setOption(existingData);
									}else{
										window.echarts.getInstanceById(id).setOption(chartData);
									}




								}

							}

						});
					}





				}, function (error) {

				});


			}
		}
	}


	$("#color-chooser-delete").click(function(){
		$("#constext-menu-div").hide();
	});

	var isExpanded = $("#menuInfoTabs").attr("is-expanded");

	if(isExpanded==="false"){
		$("#logViewDiv").hide();
		$("html").css("overflow","hidden");
	}

	$("#showLogView").click(function(){
		$('#menuInfoWrapper').css({"height":"0px"});
		$("html").css("overflow","hidden");
		if($("#menuInfoTabs").attr("is-expanded")==="false"){

			$("#menuInfo").css({"bottom":"0"});
			$("#menuInfoTabs").attr("is-expanded","true")

		}else{

			$("#menuInfoTabs").attr("is-expanded","false")
			$("#menuInfo").css({"bottom":"3%"})
		}

		$("#logViewDiv").slideToggle("slow");
		$("html").css("overflow","hidden");
		$timeout(function(){
			$("#dashboardsWidgets").css("height",$( window ).height()-$('#menuInfo').height()-95);
//			$("#dashboardsWidgets").css("overflow-x","hidden");
			$("#dashboardsWidgets").css("overflow-y","scroll");
			$("html").css("overflow-y","hidden");
		},1500);

	});



	$scope.singleEvnentInfo = {};
	$scope.getEventInfo = function( indexId) {
		alertsFactory.getSingleEventInfo(indexId).then(function(response){
			$scope.singleEvnentInfo = response.data;
			unloader("#colorId");
		});

	};

	$scope.eventDetails = [];

	$scope.showEventDetails = function(){
		$("#showEventDetails").modal();
//		if($scope.singleEvnentInfo.event_data == undefined){
//			$scope.singleEvnentInfo['event_data'] = []
//		}
			$scope.singleEvnentInfo['event_data'] = angular.copy($scope.singleEvnentInfo['Event Data']);
	//		$scope.singleEventDetails = $scope.singleEvnentInfo[0];
			$scope.showSingleEventDetails($scope.singleEvnentInfo.event_data[0])
	}


$scope.contributingEvents = function() {
	$scope.singleEvnentInfo['event_data'] = angular.copy($scope.singleEvnentInfo['Event Data']);
}
	function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options

		return '<div ng-click="grid.appScope.getEventInfo(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell  ></div>'

	}



//	let the grid know which columns and what data to use

	function EnterpriseDatasource() {}

	EnterpriseDatasource.prototype.getRows = function (params) {
		let jsonRequest = JSON.stringify(params.request, null, 2);
		console.log(jsonRequest);

		params.request['companyName'] = $scope.currentCompany;

		self.loadEventData(params.request,params);

	};

	let updateSecondaryColumns = function (request, result) {
		let valueCols = request.valueCols;
		if (request.pivotMode && request.pivotCols.length > 0) {
			let secondaryColDefs = createSecondaryColumns(result.secondaryColumnFields, valueCols);
			gridOptions.columnApi.setSecondaryColumns(secondaryColDefs);
		} else {
			gridOptions.columnApi.setSecondaryColumns([]);
		}
	};

	let createSecondaryColumns = function (fields, valueCols) {
		let secondaryCols = [];

		function addColDef(colId, parts, res) {
			if (parts.length === 0) return [];

			let first = parts.shift();
			let existing = res.find(r => r.groupId === first);

			if (existing) {
				existing['children'] = addColDef(colId, parts, existing.children);
			} else {
				let colDef = {};
				let isGroup = parts.length > 0;
				if(isGroup) {
					colDef['groupId'] = first;
					colDef['headerName'] = first;
				} else {
					let valueCol = valueCols.find(r => r.field === first);

					colDef['colId'] = colId;
					colDef['headerName'] =  valueCol.displayName;
					colDef['field'] = colId;
					colDef['type'] = 'measure';
				}

				let children = addColDef(colId, parts, []);
				children.length > 0 ? colDef['children'] = children : null;

				res.push(colDef);
			}

			return res;
		}

		fields.sort();
		fields.forEach(field => addColDef(field, field.split('_'), secondaryCols));
		return secondaryCols;
	};

	function numberCellFormatter(params) {
		let formattedNumber = Math.floor(Math.abs(params.value)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
		return params.value < 0 ? '(' + formattedNumber + ')' : formattedNumber;
	}



	var  gridOptions = {
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
			rowBuffer: 0,
			//columnDefs: columnDefs,
			rowModelType: 'serverSide',
			rowGroupPanelShow: 'always',
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
				defaultToolPanel: 'columns'
			},
			// restrict to 2 server side calls concurrently
			maxConcurrentDatasourceRequests: 2,
			cacheBlockSize: 100,
			maxBlocksInCache: 2,
			purgeClosedRowNodes: false,
			suppressRowClickSelection: false,
			floatingFilter:true,
			rowSelection: 'multiple',
			onSelectionChanged: onSelectionChanged,
			getRowNodeId: function(data) { return data.index_id },
			onFirstDataRendered(params) {
				params.api.sizeColumnsToFit();
			}
	}



	function onSelectionChanged() {
		var selectedRows = gridOptions.api.getSelectedRows();
		var selectedRowsString = '';
		$scope.alertNames = [];
		selectedRows.forEach( function(selectedRow, index) {
			if (index!==0) {
				selectedRowsString += ', ';
			}

			$scope.alertNames.push({

				alertName : selectedRow.name,
				alertId: selectedRow.index_id,
				createdDate:'',
				createdBy:'',
				alertPriority:selectedRow.priority,
				alertCategory:selectedRow.rule_category

			});
		});
		if($scope.alertNames.length!=0){
			loader("#colorId");
			$scope.getEventInfo($scope.alertNames[$scope.alertNames.length-1].alertId);
			
		}
	}



//	lookup the container we want the Grid to use

	self.intializeGrid = function(){



		var columnDefs = [];

		if($scope.infoTableType === 'alerts'){
			columnDefs.push({headerName:"@timestamp", field: "@timestamp", width: 200,headerCheckboxSelection: true,  headerCheckboxSelectionFilteredOnly: true,checkboxSelection: true});
			columnDefs.push({headerName:"Alert Name", field: "name", hide:true, width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',rowGroup: true,filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Priority", field: "priority",width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Category", field: "rule_category",width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Case", field: "case_name", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Event Name",hide:true,field: "event_name", width: 200,enableRowGroup: false,rowGroup: true,filter: 'agTextColumnFilter',filterParams:{ filterOptions:['contains'],suppressAndOrCondition:true }});
			
			
			columnDefs.push({headerName:"Assignee",hide:true,field: "assignee", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{ filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Status",hide:true,field: "alert_status", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{ filterOptions:['contains'],suppressAndOrCondition:true }});
			$scope.headerTitle = "Alerts";

		}else if($scope.infoTableType === 'rules'){
			columnDefs.push({headerName:"@timestamp", field: "@timestamp", width: 200,});
			columnDefs.push({headerName:"Rule Name", field: "rule_name",hide:true, rowGroup: true,width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Rule Category", field: "rule_category", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});

			columnDefs.push({headerName:"Event Name",field: "event_name",rowGroup: true,hide:true,
				width: 200,enableRowGroup: false,filter: 'agTextColumnFilter',filterParams:{ filterOptions:['contains'],suppressAndOrCondition:true }});


			columnDefs.push({headerName:"Priority", field: "priority", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			$scope.headerTitle = "Rules";
		}else if($scope.infoTableType === 'events'){
			columnDefs.push({headerName:"@timestamp", field: "@timestamp", width: 200,});
			columnDefs.push({headerName:"event_name", field: "event_name",width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"event_category", field: "event_category",width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"log_type", field: "log_type",width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"log_device", field: "log_device",width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			$scope.headerTitle = "Events";
		}else if($scope.infoTableType === 'case'){

			columnDefs.push({headerName:"Title", field: "title", width: 200,enableRowGroup: true});
			columnDefs.push({headerName:"Description", field: "description", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Created Date", field: "createDate", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Last Update", field: "lastUpdate", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Status", field: "status", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Priority", field: "priority",width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Assigned User", field: "assignedUser", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			$scope.headerTitle = "Cases";
		}else{
			return false;
		}


		for(var i=0;i<$scope.logFields.length;i++){



			if($scope.logFields[i].fieldName=== 'event_time' ||  $scope.logFields[i].fieldName === 'event_name' ||  $scope.logFields[i].fieldName === 'event_category' || $scope.logFields[i].fieldName === 'log_device' || $scope.logFields[i].fieldName === 'log_type'){
				//columnDefs.push({headerName:$scope.logFields[i].fieldName, field: $scope.logFields[i].fieldName, width: 150,hide:false});
			}else{
				var flag = false
				for(var j=0;j<columnDefs.length;j++){
					if(columnDefs[j].field == $scope.logFields[i].fieldName){
						flag = true;
					}
				}
				if(!flag){
					columnDefs.push({headerName:$scope.logFields[i].fieldName.replace(".keyword",""),enableRowGroup: true, field: $scope.logFields[i].fieldName.replace(".keyword",""), width: 150,hide:true,filter: 'agTextColumnFilter',filterParams:{
						filterOptions:['contains'],suppressAndOrCondition:true }});
				}

			}


		}
		gridOptions['columnDefs']= [];
		gridOptions['columnDefs'] = columnDefs;



		$("#myGrid").empty();

		var gridDiv = document.querySelector('#myGrid');
		new agGrid.Grid(gridDiv, gridOptions);



		gridOptions.api.setEnterpriseDatasource(new EnterpriseDatasource());
		unloader("#create_case_template");
		unloader("body");
	}

	function currencyFormatter(params){
		console.log(params);
		return params[0].event_name
	}


	function getSelectedRows() {
		const selectedNodes = gridOptions.api.getSelectedNodes()  
		const selectedData = selectedNodes.map( function(node) { return node.data })
		const selectedDataStringPresentation = selectedData.map( function(node) { return node.make + ' ' + node.model }).join(', ')
		alert('Selected nodes: ' + selectedDataStringPresentation);
	}

	self.addCol = function(colName) {

		self.eventsCols.splice(self.eventsCols.length-1,0,{ field: colName, width:200 })

	};

	self.removeCol = function(index) {
		self.eventsCols.splice(index, 1);
	};

	$scope.singleEventDetails = {};


	function getRowId(row) {
		return row.id;
	}

	self.toggleFilterRow = function() {
		self.gridOptions.enableFiltering = !vm.gridOptions.enableFiltering;
		gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
	};

	self.callsPending = 0;

	var i = 0;
	$scope.myData = [];
	self.loadEventData = function(json,params){
		$scope.alertNames = []

		self.callsPending++;

		json['endDate'] = $scope.options.endDate.toString();
		json['startDate'] = $scope.options.startDate.toString();
		json['query'] = $scope.options.filter;
		json['queryString'] = $scope.options.queryString;

		json['type'] = $scope.infoTableType;


		var tempArray = [];
		if($scope.myData.length!=0 && json.startRow!=0){
			var lastRow  = $scope.myData[$scope.myData.length-1];

			if(params.request.rowGroupCols[params.request.groupKeys.length]){
				var field = params.request.rowGroupCols[params.request.groupKeys.length].field

				for (var k in lastRow) {
					if(k === field ){
						tempArray.push({field:k,value:lastRow[k]})
					}
				}

				for (var k in params.parentNode.data) {
					tempArray.push({field:k,value:params.parentNode.data[k]})
				}
			}


		}
		if(tempArray.length!=0){
			json['nextRows'] = tempArray;
		}



		widgetService.loadEventsData(json).then(function (response) {


			try{
				var temp = response.data.data;
				
				if($scope.infoTableType === 'rules'){
					
				}else if($scope.infoTableType === 'alerts'){
					
				}


				params.successCallback(response.data.data, response.data.lastRow);
				$scope.myData = response.data.data;
				$scope.singleEvnentInfo = {};
				if($scope.myData.length!=0){
					$scope.getEventInfo($scope.myData[0].index_id);
				}

			}catch(err){
				console.log(err);
			}



		}, function (error) {
			$scope.fitlerMessages.push({type:"danger",msg:"Something went wrong please try again.."});
			$timeout(function(){
				$scope.alertMessagaes= [];

				self.callsPending--;
			},2500);
		});




	};
	$scope.ruleData =[];

	self.loadRuleData = function(){


		self.callsPending++;

		$scope.options['endDate'] = $scope.options.endDate.toString();
		$scope.options['startDate'] = $scope.options.startDate.toString();
		$scope.options['queryString'] = $scope.searchQueryString;
		$scope.options['renderAllWidgets'] = $scope.options.renderAllWidgets.toString();

		$scope.options['from'] = $scope.from.toString();
		$scope.options['config'] = "";
		$scope.options['companyName'] = $scope.currentCompany
		widgetService.loadRulesData($scope.options).then(function (response) {

			var data = response.data;

			self.callsPending--;

			data.forEach(function(row){
				row.id = i;
				i++;
				row.registered = new Date(row.registered)
				$scope.myData.push(row);
			});

			$scope.gridApi.infiniteScroll.saveScrollPercentage();
			$scope.gridApi.infiniteScroll.dataLoaded(false,true);


		}, function (error) {
			$scope.fitlerMessages.push({type:"danger",msg:"Something went wrong please try again.."});
			$timeout(function(){
				$scope.alertMessagaes= [];

				self.callsPending--;
			},2500);
		});




	};

	$scope.gridStackOptions = {
			cellHeight: 100,
			verticalMargin: 5,
			handle: '.panel-heading',

	};

	$scope.widgets = [
		{ x:0, y:0, width:0, height:0 }, 
		{ x:0, y:0, width:1, height:1 },
		{ x:0, y:0, width:1, height:1 }

		];



	$scope.onResizeStop = function (event, ui) {
		var $element = ui.element[0];
		var widgetId = ui.element[0].id.split("-")[1];

		var currentHeight = $element.offsetHeight

		$("div.chart").each(function(){
			var chartId = $(this)[0].id;
			$($element).find("div.chart").height(currentHeight-50);

			if(widgetId===chartId){
				var id = $(this).attr('_echarts_instance_');
				if(window.echarts.getInstanceById(id)){
					window.echarts.getInstanceById(id).resize();
				}

			}

		});
	};

	$scope.serialize = function(){

		var widgetId = 0;

		var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
			el = $(el);
			var divs = el.find("div");
			var widgetId = 0;
			for(i=0;i<divs.length;i++){
				if(divs[i].id.indexOf("widget-id")!=-1){
					widgetId = divs[i].id;
				}
			}
			var node = el.data('_gridstack_node');
			return {
				id: widgetId,
				x: node.x,
				y: node.y,
				width: node.width,
				height: node.height,
				elementHeight:el.height(),
				elementWdith:el.width()
			};
		});







	}

	$scope.showSingleEventDetails = function(data){
		$scope.singleEventDetails = data;
	}

	$('.grid-stack').on('gsresizestop', function(event, elem) {
		var newHeight = $(elem).attr('data-gs-height');
		console.log(newHeight);
	});

	$scope.existingDashboards = [];

	$scope.showFilter = false;

//	$scope.liveMode = true;

	self.fitlerMessages = [];


//	$scope.spaces = ["All","Public","Private","Shared"];
	$timeout(function(){
//		$scope.publicShares = $sessionStorage.user.public;
//		$scope.privateShares = $sessionStorage.user.private;
//		$scope.shared = $sessionStorage.user.shared;
	},$sessionStorage.user == undefined?3000:0);




	$scope.dashboardTabs = [];

	$scope.dashboard = {};




	$scope.enableLiveMode = function(){
		if($scope.liveMode){
			$scope.liveMode = false;
			if(interVal){
				$interval.cancel(interVal);

			}
		}else{
			$scope.liveMode = true;
			interVal = $interval(function() {
				$scope.apply();
			}, 30000);
		}
	}
	var interVal ;

	$scope.openFliter = function(){
		if($scope.showFilter){
			$scope.showFilter = false;


		}else{



			$scope.showFilter = true;
		}
	}

	self.tagDetails = [];
	self.loadAllTags = function(){
		tagService.getTags().then(function(response){
			for(var i=0;i<response.data.length;i++){
				self.tagDetails.push({id:response.data[i].tagName,label:response.data[i].tagName});
			}

		});
	}
	self.loadAllTags();






	$scope.editDashboard = function(){
		$("#dashboard-settings-modal").modal();
		$("input.ui-select-search").css("width","864px")
	}

	$scope.toggleEditMode = function(){
		if($scope.editMode){

			self.saveDashboard();

			$scope.editMode = false;

		}else{



			$scope.editMode = true;
		}
	}

	self.dashboards = {id:0,title:"",widgets:[]}

	$scope.existingWidgets = [];

	self.widgets = [];
	self.alertMessagaes = [];
	self.modalMessagaes = [];
	$scope.addWidget = function(widget){

		var flag = true;
		for(let j=0;j<self.widgets.length;j++){
			if(self.widgets[j].id == widget.id){
				flag = false;
				break;
			}
		}

		if(flag){
			try{			
				widget['col'] = 0;
				widget['row'] = 120;
				widget['sizeX'] = 8; 
				widget['sizeY'] = 6;

				if(typeof  widget.options == 'string'){	
					widget.options = JSON.parse(widget.options);
				}



				self.widgets.push(widget);


				self.modalMessagaes.push({type:"success",msg:"Widget added successfully"});	
				$timeout(function(){
					self.modalMessagaes = [];
				},2000);
			}catch(err){
				self.widgets.push(widget);
				self.modalMessagaes.push({type:"success",msg:"Widget added successfully"});
				$timeout(function(){
					self.modalMessagaes = [];
				},2000);
			}
		}else{
			self.modalMessagaes.push({type:"danger",msg:"Widget is already present"});
			$timeout(function(){
				self.modalMessagaes = [];
			},2000);

		}
	}


	$scope.openAddWidgetDialog = function(){
		$("#add_widget_dialog").modal();
	}

	$scope.saveAndApplyFilter = function(){
		self.saveDashboard();

		$scope.apply();

	}

	self.saveDashboard = function(){

		$scope.model.id = $scope.dashboard.id;

		if($scope.model.title == "" || $scope.model.title == undefined || $scope.model.categoryId == undefined||$scope.model.categoryId == ""  ){
			self.alertMessagaes.push({type:"danger",msg:"Please enter the dashboard details"});
			return false;			
		}


		$scope.model['widgets'] = self.widgets;
		$scope.model['kpiwidgets'] = $scope.kpiWidgets;
		$scope.model['dashboardQuery'] = JSON.stringify(self.query);
		if($scope.model.reports){
			$scope.model['isReport'] = 'yes';
		}else{
			$scope.model['isReport'] = 'no';
		}


		widgetService.saveDashboard($scope.model).then(function (response) {						
			if(response.data.status){			
				self.alertMessagaes.push({type:"success",msg:"Dashbaord Updated Successfully"});
			}
			if(!response.data.status){
				self.alertMessagaes.push({type:"danger",msg:"Something went wrong please try again.."});						
			}
			$timeout(function(){
				self.alertMessagaes= [];
			},2500);
		}, function (error) {
			$scope.fitlerMessages.push({type:"danger",msg:"Something went wrong please try again.."});
			$timeout(function(){
				$scope.alertMessagaes= [];
			},2500);
		});
	}


	$scope.remove = function(index){

		self.widgets.splice(index,1);
	}
//
//	$scope.startDate = moment(new Date()).subtract(24, 'hours').valueOf();
//	$scope.endDate = moment(new Date()).valueOf();
//
//	$scope.labelName = "Last 24 hours"
//	$scope.dateLable = "last24Hours";
	self.dashboards.id;


	$scope.setRelativeTimeForDashboards = function(option,labelName){

		var startDate =moment(new Date());
		var endDate = moment(new Date());


		if(option==='last2Days'){
			startDate = moment(new Date()).subtract(2, 'days');
			$scope.labelName = "Last 2 Days";
		}
		else if(option==='last7Days'){
			startDate = moment(new Date()).subtract(7, 'days');
			$scope.labelName = "Last 7 Days";
		}
		else if(option==='last30Days'){
			startDate = moment(new Date()).subtract(30, 'days');
			$scope.labelName = "Last 30 Days";
		}
		else if(option==='last90Days'){
			startDate = moment(new Date()).subtract(90, 'days');
			$scope.labelName = "Last 90 Days";
		}
		else if(option==='last6months'){
			startDate = moment(new Date()).subtract(6, 'months');
			$scope.labelName = "Last 6 Months";
		}
		else if(option==='last1year'){
			startDate = moment(new Date()).subtract(1, 'years');
			$scope.labelName = "Last 1 Year";
		}
		else if(option==='last2years'){
			startDate = moment(new Date()).subtract(2, 'years');
			$scope.labelName = "Last 2 Year";
		}
		else if(option==='last5years'){
			startDate = moment(new Date()).subtract(2, 'years');
			$scope.labelName = "Last 5 Year";
		}
		else if(option==='yesterday'){
			startDate = moment(new Date()).subtract(1, 'days').startOf('day');
			endDate = moment(new Date()).subtract(1, 'days').endOf('day');
			$scope.labelName = "Yesterday";
		}
		else if(option==='dayBeforeYesterday'){
			startDate = moment(new Date()).subtract(2, 'days').startOf('day');
			endDate = moment(new Date()).subtract(2, 'days').endOf('day');
			$scope.labelName = "Day Before Yesterday";
		}
		else if(option==='thisLastWeek'){
			startDate = moment(new Date()).subtract(7, 'days').startOf('week');
			endDate = moment(new Date()).subtract(7, 'days').endOf('week');
			$scope.labelName = "Last Week";
		}
		else if(option==='perviousWeek'){
			startDate = moment(new Date()).subtract(1, 'weeks').startOf('week');
			endDate = moment(new Date()).subtract(1, 'weeks').endOf('week');
			$scope.labelName = "Previous Week";
		}
		else if(option==='today'){
			startDate = moment(new Date()).startOf('day');
			endDate = moment(new Date()).endOf('day');
			$scope.labelName = "Today";
		}
		else if(option==='todaySoFar'){
			startDate = moment(new Date()).startOf('day');
			$scope.labelName = "Today So Far";
		}
		else if(option==='thisWeek'){
			startDate = moment(new Date()).startOf('week');
			endDate = moment(new Date()).endOf('week');
			$scope.labelName = "This Week";
		}
		else if(option==='thisWeekSoFar'){
			startDate = moment(new Date()).startOf('week');
			$scope.labelName = "This Week So Far";
		}
		else if(option==='thisMonth'){
			startDate = moment(new Date()).startOf('month');
			endDate = moment(new Date()).endOf('month');
			$scope.labelName = "This Month";
		}
		else if(option==='thisMonthSoFar'){
			startDate = moment(new Date()).startOf('month');
			$scope.labelName = "This Month So Far";
		}
		else if(option==='thisYear'){
			startDate = moment(new Date()).startOf('year');
			endDate = moment(new Date()).endOf('year');
			$scope.labelName = "This Year";
		}
		else if(option==='thisYearSoFar'){
			startDate = moment(new Date()).startOf('year');
			$scope.labelName = "This Year So Far";
		}

		else if(option==='last15Minutes'){
			startDate = moment(new Date()).subtract(15, 'minutes');;
			$scope.labelName = "Last 15 Minutes";
		}

		else if(option==='last30Minutes'){
			startDate = moment(new Date()).subtract(30, 'minutes');;
			$scope.labelName = "Last 30 Minutes";
		}

		else if(option==='last1Hour'){
			startDate = moment(new Date()).subtract(1, 'hours');;
			$scope.labelName = "Last 1 Hour";
		}


		else if(option==='last3Hours'){
			startDate = moment(new Date()).subtract(3, 'hours');
			$scope.labelName = "Last 3 Hours";
		}

		else if(option==='last6Hours'){
			startDate = moment(new Date()).subtract(6, 'hours');
			$scope.labelName = "Last 6 Hours";
		}

		else if(option==='last12Hours'){
			startDate = moment(new Date()).subtract(12, 'hours');;
			$scope.labelName = "Last 12 Hours";
		}

		else if(option==='last24Hours'){
			startDate = moment(new Date()).subtract(24, 'hours');;
			$scope.labelName = "Last 24 Hours";
		}else if(option != undefined && option.includes("-")){
			var date = option.split("-")
			startDate = moment(date[0]);
			endDate = moment(date[1]);
			$scope.labelName= option;
		}
		$scope.startDate = startDate.valueOf();
		$scope.endDate = endDate.valueOf();
		$scope.dashboard.dateLable = option; 
		$scope.dateLable = option;
		//$scope.apply();
	}

	$scope.setRelativeTime = function(option,labelName){
		loader("body");
		var startDate =moment(new Date());
		var endDate = moment(new Date());

		$scope.labelName = labelName;
		$scope.displayStartDate = '';
		$scope.displayEndDate = '';
//		$('#to-date').datepicker('setDate', null);
//		$('#from-date').datepicker('setDate', null);
		if(option==='last2Days'){
			startDate = moment(new Date()).subtract(2, 'days');
		}
		if(option==='last7Days'){
			startDate = moment(new Date()).subtract(7, 'days');
		}
		if(option==='last30Days'){
			startDate = moment(new Date()).subtract(30, 'days');
		}
		if(option==='last90Days'){
			startDate = moment(new Date()).subtract(90, 'days');
		}
		if(option==='last6months'){
			startDate = moment(new Date()).subtract(6, 'months');
		}
		if(option==='last1year'){
			startDate = moment(new Date()).subtract(1, 'years');
		}
		if(option==='last2years'){
			startDate = moment(new Date()).subtract(2, 'years');
		}
		if(option==='last5years'){
			startDate = moment(new Date()).subtract(2, 'years');
		}
		if(option==='yesterday'){
			startDate = moment(new Date()).subtract(1, 'days').startOf('day');
			endDate = moment(new Date()).subtract(1, 'days').endOf('day');
		}
		if(option==='dayBeforeYesterday'){
			startDate = moment(new Date()).subtract(2, 'days').startOf('day');
			endDate = moment(new Date()).subtract(2, 'days').endOf('day');
		}
		if(option==='thisLastWeek'){
			startDate = moment(new Date()).subtract(7, 'days').startOf('week');
			endDate = moment(new Date()).subtract(7, 'days').endOf('week');
		}
		if(option==='perviousWeek'){
			startDate = moment(new Date()).subtract(1, 'weeks').startOf('week');
			endDate = moment(new Date()).subtract(1, 'weeks').endOf('week');
		}
		if(option==='today'){
			startDate = moment(new Date()).startOf('day');
			endDate = moment(new Date()).endOf('day');
		}
		if(option==='todaySoFar'){
			startDate = moment(new Date()).startOf('day');
		}
		if(option==='thisWeek'){
			startDate = moment(new Date()).startOf('week');
			endDate = moment(new Date()).endOf('week');
		}
		if(option==='thisWeekSoFar'){
			startDate = moment(new Date()).startOf('week');

		}
		if(option==='thisMonth'){
			startDate = moment(new Date()).startOf('month');
			endDate = moment(new Date()).endOf('month');
		}
		if(option==='thisMonthSoFar'){
			startDate = moment(new Date()).startOf('month');

		}
		if(option==='thisYear'){
			startDate = moment(new Date()).startOf('year');
			endDate = moment(new Date()).endOf('year');
		}
		if(option==='thisYearSoFar'){
			startDate = moment(new Date()).startOf('year');
		}

		if(option==='last15Minutes'){
			startDate = moment(new Date()).subtract(15, 'minutes');;

		}

		if(option==='last30Minutes'){
			startDate = moment(new Date()).subtract(30, 'minutes');;

		}

		if(option==='last1Hour'){
			startDate = moment(new Date()).subtract(1, 'hours');;
		}


		if(option==='last3Hours'){
			startDate = moment(new Date()).subtract(3, 'hours');;
		}

		if(option==='last6Hours'){
			startDate = moment(new Date()).subtract(6, 'hours');
		}

		if(option==='last12Hours'){
			startDate = moment(new Date()).subtract(12, 'hours');;
		}

		if(option==='last24Hours'){
			startDate = moment(new Date()).subtract(24, 'hours');;
		}
		self.timeRange = {};
		$scope.startDate = startDate.valueOf();
		$scope.endDate = endDate.valueOf();
		$scope.dashboard.dateLable = option; 
		$scope.dateLable = option;
		//$scope.closePopup1();

		for(var i=0;i<$scope.dashboardTabs.length;i++){
			$scope.dashboardTabs[i]['startDate'] = $scope.startDate;
			$scope.dashboardTabs[i]['endDate'] = $scope.endDate;
			$scope.dashboardTabs[i]['labelName'] = $scope.labelName;
			$scope.dashboardTabs[i]['dateLable'] = $scope.dateLable
		}
		$scope.saveDashboardTime($scope.dateLable);
		$scope.toggleLive('start');
		$scope.apply();
		$scope.status.isopen = !$scope.status.isopen;
		$("#simple-dropdown").toggleClass("displayBlock");
	}

	$scope.setRelativeTimeCount = function(){
		var startDate =moment(new Date());
		var endDate = moment(new Date());
		var option = self.timeRange.temp+" "+ self.timeRange.value+" "+self.timeRange.format;
		if(self.timeRange.temp == 'last'){		
			startDate = moment(new Date()).subtract(self.timeRange.value,self.timeRange.format);
		}else {
			endDate = moment(new Date()).add(self.timeRange.value,self.timeRange.format);
		}
		$scope.startDate = startDate.valueOf();
		$scope.endDate = endDate.valueOf();
		$scope.dashboard.dateLable = option; 
		$scope.dateLable = option;
		$scope.labelName = option;
		$scope.closePopup1();
		$scope.toggleLive('start');
		$scope.apply();

	}

	$scope.saveDashboardTime = function(timeRange){

		var data ={"timeRange":timeRange};
		widgetService.saveDashboardTime(data).then(function(response){
		},function(error){		
		})
	}

	$scope.saveActiveDashboard = function(timeRange){
		var data ={"dashboardName":timeRange};
		widgetService.saveActiveDashboard(data).then(function(response){
		},function(error){		
		})
	}

	$scope.removeKpi= function(index){
		$scope.kpiWidgets.splice(index,1)
	}


	$scope.apply = function(){
loader("body");
		$scope.kpiWidgets= [];
		self.widgets= [];
		$("#dashboardsWidgets").css("height",$( window ).height()-100);
		widgetService.loadSingleDashboard($scope.dashboard.id).then(function (response) {
			unloader("body");
			$scope.name = response.data.name;
			$scope.adfModel = response.data.config;

			for(var i=0;i<response.data.config.widgets.legnth;i++){
				response.data.config.widgets[i]['x'] = 0;
				response.data.config.widgets[i]['y'] = 0;
				response.data.config.widgets[i]['width'] = 1;
				response.data.config.widgets[i]['height'] = 1;

			}
			loader("body");

			var tempWidgets = response.data.config.widgets;

			if($scope.dashboard.text == "Alerts"){
				$scope.name = "Alerts";
				$scope.infoTableType = "alerts";
				$scope.headerTitle = "Alerts";
			}else if($scope.dashboard.text== "Cases"){
				$scope.name = "Cases";
				$scope.infoTableType = "case";
				$scope.headerTitle = "Cases";
			}else{
				$scope.name = "Events";
				$scope.infoTableType = "events";
				$scope.headerTitle = "Events";
			}
			

			var tempKpiWidgets = response.data.config.kpiwidgets;

			if(tempKpiWidgets != undefined && tempKpiWidgets.length > 0){
				self.widgets = tempWidgets.concat(tempKpiWidgets);
			}else{				
				self.widgets = angular.copy(tempWidgets);
			}
			
//			self.widgets = tempWidgets.concat(tempKpiWidgets);


			$scope.dashboard['startDate']  = $scope.startDate;
			$scope.dashboard['endDate'] = $scope.endDate;
			$scope.dashboard['labelName'] = $scope.labelName;
			$scope.dashboard['dateLabel'] = $scope.dateLable;
			$scope.options = { 
					startDate: $scope.startDate, 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:$scope.dateLable,
					filter : $scope.output,
					queryString : $scope.searchQueryString,
					color:self.colors,
					companyName:$scope.currentCompany
			}

			//$rootScope.viewLoaded = false;


			$("#myGrid").empty();

			self.intializeGrid();

			$rootScope.viewLoaded = true;


			$timeout(function(){
				if($("#menuInfoTabs").attr("is-expanded")==="false"){
					$("#dashboardsWidgets").css("height",$( window ).height()-100);
					$("#dashboardsWidgets").css("overflow-x","hidden");
					$("#dashboardsWidgets").css("overflow-y","scroll");
					$("html").css("overflow-y","hidden");
				}else{
					$("#dashboardsWidgets").css("height",$( window ).height()-$('#logViewDiv').height()-120);
					$("#dashboardsWidgets").css("overflow-x","hidden");
					$("#dashboardsWidgets").css("overflow-y","scroll");
					$("html").css("overflow-y","hidden");

				}

			},5000);

			unloader("body");



		}, function (error) {

		});
	}



	$scope.cancelEditMode = function(){
		$scope.editMode = false;
		$scope.loadDashboard($scope.dashboard);		
//		$route.reload();
	}


	$scope.searchBasedonQueryString = function(){
		$scope.apply();
	}


	$scope.confirmDialogue  = function(dashboard){
		$("#menuInfoWrapper").css({"height":"0px"})
		$("#menuInfoTabs").attr("is-expanded","false")
		$("#menuInfo").css({"bottom":"3%"})
		$("#logViewDiv").hide();
		self.closeFilter();
		if($routeParams.id != undefined || $routeParams.id != null){
			$location.search('id', dashboard.id) 
		}
		if($scope.editMode == true){
			$ngConfirm({ 
				animation: 'top',
				closeAnimation: 'bottom',
				theme: 'material',
				title: 'Confirm!',
				content: 'Do you want to save the changes you have made in '+$scope.dashboard.name+' Dashboard?',
				scope: $scope,
				buttons: {
					save: {
						text: 'YES',
						btnClass: 'btn-primary',
						action: function(scope, button){
							$scope.toggleEditMode();
							$scope.editMode = false;
							$scope.categoryDisplayText = '';
							$scope.saveActiveDashboard(dashboard.name)
							$scope.loadDashboard(dashboard);
							$scope.editMode = false;
						}

					},dontsave:{
						text: 'NO',
						btnClass: 'btn-secondary',
						action: function(scope, button){
							$scope.editMode = false;
							$scope.categoryDisplayText = '';
							$scope.saveActiveDashboard(dashboard.name)
							$scope.loadDashboard(dashboard);
							$scope.editMode = false;
						}
					},
				}
			});
		}else{
//			$scope.toggleEditMode();

			$scope.editMode = false;
			$scope.categoryDisplayText = '';
			$scope.saveActiveDashboard(dashboard.name)
			$scope.loadDashboard(dashboard);
			$scope.editMode = false;
		}

	}

	$scope.showLegends = true;

	$scope.enableDisableLegends = function(flag){
		try{
			Highcharts.charts.forEach(function(chart) {
				if(flag){
					chart.legendShow();
					if(chart.legend.itemStyle.width == undefined || chart.legend.itemStyle.width == 0){
						chart.legend.align = 'right';
						chart.legend.verticalAlign = 'middle';
						chart.legend.layout = 'vertical'
							chart.legend.itemStyle.width = '150px';
						chart.legend.itemStyle.textOverflow = 'ellipsis';
						chart.legend.itemStyle.overflow = 'hidden';
						chart.legend.render();
						chart.reflow();
					}
					$timeout(function(){
						chart.legend.display = true;
						chart.isDirtyBox = true;
						chart.redraw(); 
					},300);
				}else{
					chart.legendHide();
					chart.reflow();
				}
			});


		}catch(err){
			console.log(err);
		}
	}

	$scope.logFields = [];

	$scope.logFieldsOptions = [];

	$scope.toggleColumn =  function(fieldName) {

		for(var i=0;i<$scope.logFields.length;i++){
			if($scope.logFields[i].fieldName===fieldName){
				$scope.logFields[i].checked = !$scope.logFields[i].checked;
				if($scope.logFields[i].checked){
					self.addCol($scope.logFields[i].fieldName);
				}else{

					for(var j=0;j<self.eventsCols.length;j++){
						if(self.eventsCols[j].name===fieldName){
							self.removeCol(j);
						}
					}


				}

			}
		}


	};

	$scope.refreshTable = function(){

		$("#myGrid").empty();
		self.intializeGrid();

	}
	$scope.canEditDashboards = false;


	$scope.updateRoles = function(index){

		for(var i=0;i<$scope.model.existingRoles.length;i++){
			if(index === i){

				var data = {id:$scope.model.existingRoles[i].id,dashboardId:$scope.dashboard.id,access:$scope.model.existingRoles[i].access};
				widgetService.updateRoles(data).then(function (response) {
					if(response.status === 200){
						widgetService.loadSingleDashboard($scope.dashboard.id).then(function (response) {
							$scope.model['existingRoles'] = response.data.existingRoles;
						}, function (error) {

							if(error.status== 403){
								self.accessAlerts.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.accessAlerts = [];
								}, 2000);
							}
							if(error.status== 500){
								self.accessAlerts.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.accessAlerts = [];
								}, 2000);
							}

						});
					}
					//$scope.model['existingRoles'] = response.data.existingRoles;
				}, function (error) {

				});
			}
		}
	}
	$scope.deleteRoles = function(id){
		widgetService.deleteRoles(id).then(function (response) {
			if(response.status === 200){
				$scope.model['existingRoles'] = [];


			}
			//$scope.model['existingRoles'] = response.data.existingRoles;
		}, function (error) {
			if(error.status== 403){
				self.accessAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.accessAlerts = [];
				}, 2000);
			}
			if(error.status== 500){
				self.accessAlerts.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.accessAlerts = [];
				}, 2000);
			}

		});
	}
	$scope.isRepotsEditable = false;

	$scope.enableReport = function(){
		$scope.isRepotsEditable = false;
	}

	$scope.loadDashboard = function(dashboard){
		loader("body");
		$scope.displayStartDate = "";
		$scope.displayEndDate = "";


		$scope.switchedWidgetDetails = [];

//		$scope.dashboard = dashboard;
//		$scope.existingDashboards.push(dashboard.name);




		$scope.kpiWidgets= [];
		self.widgets= [];
		//data['updateFromDashboard'] = false;
		$("#dashboardsWidgets").css("height",$( window ).height()-100);
		widgetService.loadSingleDashboard(dashboard.id).then(function (response) {
			unloader("body");
			$scope.name = response.data.name;
//			$scope.existingDashboards.push($scope.name);
			$scope.dashboard = {"id":response.data.id,"text":response.data.name};
			$scope.addDashboard($scope.dashboard);
			$scope.model = response.data.config;
			$scope.model["id"] = $scope.dashboard.id;
			$scope.model["tableDataHeaders"] = [];
			$scope.model["tableData"] = [];
			$scope.model['createdBy'] = response.data.createdBy;

			$scope.model['isAdmin'] = response.data.isAdmin;
			$scope.model['isOwner'] = response.data.isOwner;
			$scope.model['isEditor'] = response.data.access;
			$scope.model['existingRoles'] = response.data.existingRoles;
			$scope.model['categoryId'] = response.data.category.toString();
			$scope.model['description'] = response.data.description

			if(response.data.report === 'no'){
				$scope.model['reports'] = false;
			}else{
				$scope.model['reports'] = true;
			}


			$scope.reports = {id:0,scheduleName:'',emailAddress:'',frequency:'',dashboardId:'',timeRange:'',hourOfDay:'',frequencyType:'',dashboardId:0}

			if(response.data.reportingDetials){

				$scope.reports = angular.copy(response.data.reportingDetials);
				if($scope.reports.id !=0 ){
					$scope.isRepotsEditable = true;

				}

			}




			if($scope.model.isAdmin || $scope.model.isOwner || $scope.model.isEditor === 'editor'){
				$scope.canEditDashboards = true;
			}

			loader("body");

			if($scope.dashboard.text == "Alerts"){
				$scope.name = "Alerts";
				$scope.infoTableType = "alerts";
			}else if($scope.dashboard.text== "Cases"){
				$scope.name = "Cases";
				$scope.infoTableType = "case";
			}else{
				$scope.name = "Events";
				$scope.infoTableType = "events";
				$scope.headerTitle = "Events";
			}
			if($scope.name === "Alerts"){
				$scope.infoTableType = "alerts";
				$scope.headerTitle = "Alerts";

				if($("#menuInfoTabs").attr("is-expanded")==="false"){
					$("#menuInfo").css({"bottom":"0"});
					$("#menuInfoTabs").attr("is-expanded","true");
					$("#logViewDiv").slideToggle("slow");
				}



			}
			else if($scope.name === "Cases"){
				$scope.infoTableType = "case";
				$scope.headerTitle = "Cases";
				if($("#menuInfoTabs").attr("is-expanded")==="false"){
					$("#menuInfo").css({"bottom":"0"});
					$("#menuInfoTabs").attr("is-expanded","true");
					$("#logViewDiv").slideToggle("slow");
				}
			}
			//$scope.model['dateLabel'] = 

			data.query =  [];
			data["fields"] = {};
			if($routeParams.filterQuery){
				var routerQuery = $routeParams.filterQuery;
				var obje = {"bool":{"must":[{"term":{}}]}}
				obje.bool.must[0].term[routerQuery.split(":")[0]] = routerQuery.split(":")[1];
				self.query = obje;
			}else{
				if(dashboard.filterQuery){
					var obje = {"bool":{"must":[{"term":{}}]}};
					obje.bool.must[0].term[dashboard.filterQuery.split("=")[0]] = dashboard.filterQuery.split("=")[1];
					data.query.push(obje);
				}else if(response.data.dashboardQuery){
					var flag = true;
					for(var i=0;i<$rootScope.dashboardFilters.length;i++){
						if($rootScope.dashboardFilters[i].id == $scope.dashboard.id){
							flag = false;
							self.query = angular.copy($rootScope.dashboardFilters[i].query);
						}
					}
					if(flag){
						self.query = JSON.parse(response.data.dashboardQuery);
					}
					//data['updateFromDashboard'] = true;
				}
			}
			$scope.logFieldsFilter = [];
			$scope.logFields = [];
			for(var i=0;i<response.data.config.filterFields.length;i++){

				if(response.data.config.filterFields[i]==='events_tags' || response.data.config.filterFields[i]==='rules_tags'){
					data.fields[response.data.config.filterFields[i]+".keyword"] = { type: 'multi',title:response.data.config.filterFields[i],field:response.data.config.filterFields[i],choices:self.tagDetails+".keyword"};
				}else{
					data.fields[response.data.config.filterFields[i]+".keyword"] = { type: 'term',title:response.data.config.filterFields[i],field:response.data.config.filterFields[i]+".keyword"};

				}

				$scope.logFields.push({fieldName:response.data.config.filterFields[i]+".keyword"})
				$scope.logFieldsFilter.push({fieldName:response.data.config.filterFields[i]+".keyword"});

			}
			data.fields['log_device.keyword'] = { type: 'term',title:'log_device',field:"log_device.keyword"};
			data['updateFromDashboard'] = true;

			if(self.query && self.query.rules){


				for(var i=0;i<self.query.rules.length;i++){
					if(self.query.rules[i].field=== 'log_device.keyword'){
						$scope.categoryDisplayText = self.query.rules[i].value;
					}
				}
			}

	
			$scope.setRelativeTimeForDashboards($scope.dateLable,$scope.dateLable);

//			var queryToShow = {
//			size: 0,
//			filter: { and : data.query }
//			};
			if($routeParams.filterQuery){
				$scope.output = JSON.stringify(self.query);
			}else if(self.query){
				$scope.output =	JSON.stringify(parseFilterGroup(self.data.fields,$filter,self.query));
			}



			//$scope.startDate = dashboard.startDate;
			//$scope.endDate  = dashboard.endDate;
//			$scope.labelName = $scope.labelName;
//			$scope.dateLable = dashboard.dataLable;

			$scope.options = { 
					startDate:$scope.startDate , 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:'teest',
					filter : $scope.output,
					color:self.colors,
					companyName:$scope.currentCompany
			}



			$scope.editMode = false;

			var tempWidgets = response.data.config.widgets;

			var tempKpiWidgets = response.data.config.kpiwidgets;
			try{
				if(tempKpiWidgets != undefined && tempKpiWidgets.length > 0){
					self.widgets = tempWidgets.concat(tempKpiWidgets);
				}else{				
					self.widgets = angular.copy(tempWidgets);
				}
			}catch(err){
				self.widgets = angular.copy(tempWidgets);
			}




			
//			setTimeout(function(){
//				for(let x=0;x<self.widgets.length;x++){
//					loader("#widget-"+self.widgets[x].id);
//				}
				//$scope.slickConfig.method.slickGoTo(0);
//			}, 3000);




//			$scope.startDate= moment(new Date()).subtract(24, 'hours').valueOf()
//			$scope.endDate=  moment(new Date()).valueOf(),



			$("#myGrid").empty();
			self.intializeGrid();

			//self.loadEventData();

			$scope.showLegends = true;
			if($scope.name == "Alerts" || $scope.name =="Cases"){
				$timeout(function(){
					$("#dashboardsWidgets").css("height",$( window ).height()-$('#logViewDiv').height()-140);
					$("#dashboardsWidgets").css("overflow-x","hidden");
					$("#dashboardsWidgets").css("overflow-y","scroll");
					$("html").css("overflow-y","hidden");
//					unloader("body");
				},3000);
			}else{
				$timeout(function(){
					console.log($(window).height());
					$("#dashboardsWidgets").css("height",$( window ).height()-100);
					$("#dashboardsWidgets").css("overflow-x","hidden");
					$("#dashboardsWidgets").css("overflow-y","scroll");
					$("html").css("overflow-y","hidden");
//					unloader("body");
				},3000);
			}
			

			$scope.dashboardTabs.forEach( e => $("#"+e.id).removeClass("active"));
			$timeout(function(){			
				$("#"+response.data.id).addClass("active");
			},1000);

//			unloader("body");

		}, function (error) {
			unloader("body");
		});
	}

	$scope.openAdvancedFilter = function(){
		$("#showAdvancedFilter").modal();
	}

	$scope.loadFirstDashboad = function(){
		self.loadTabs()
		loader("body");
			$timeout(function(){
				if(window.location.href.indexOf("id")!=-1){
					var temp = {}
					$scope.dateLable = $scope.dateLable == undefined ? "last24Hours" : $scope.dateLable;
					temp["id"] = $routeParams.id;
					temp['startDate'] = $scope.startDate;
					temp['endDate'] = $scope.endDate;
					temp['labelName'] = $scope.labelName;
					temp['dateLable'] = $scope.dateLable; 
					$scope.loadDashboard(temp)
				}else if($scope.dashboardTabs.length!=0){
						if($scope.dashboardTabs.length != 0){
							if($scope.activeDashboard != undefined){
								$scope.dashboardTabs.forEach(dashboard => {
									if(angular.equals(dashboard.name,$scope.activeDashboard)){
										$scope.loadDashboard(dashboard)
									}
								});
							}else{								
								$scope.loadDashboard($scope.dashboardTabs[0])
							}
						}else if($scope.dashboardTabs.length == 0){
//							window.location.href = "/configuration#!/dashboard-new";
						}
//						unloader("body");
				}else{
						unloader("body");					
				}
			},2500);
	}

self.closeTab = function(index,dashboardName){
	for(var i=0;i<$scope.dashboardTabs.length;i++){
		if($scope.dashboardTabs[i].name===dashboardName){
			
			self.removeDashboards(dashboardName,index,i);
			break;
		}
	}

}


this.getNodeInfo = function(e,item){
	$timeout(function() {

		if(item.node.type!="default"){

			for(var i=0;i<self.finalDashboard.length;i++){
				if(parseInt(item.node.id) === parseInt(self.finalDashboard[i].id)){
					$scope.addDashboadToTab(self.finalDashboard[i]);
					break;
				}
			}

		}

	});
}

self.removeDashboards = function(dashboardName,index,i){
	widgetService.deleteDashboardUserPref(dashboardName).then(function (response) {
		$scope.dashboardTabs.splice(index,1);
//		$scope.existingDashboards.splice(i,1);
		var id;
		if(index == 0){
			$scope.loadDashboard($scope.dashboardTabs[index+1]);
			id = $scope.dashboardTabs[index+1].id;
		}else{
			$scope.loadDashboard($scope.dashboardTabs[index-1]);
			id = $scope.dashboardTabs[index-1].id;
		}
		
		$timeout(function(){				
			$("#"+id).addClass("active");
		},500);
		
		self.loadTabs();


	}, function (error) {
//		alert("unable to save perf !!")
	});
}

$scope.addDashboadToTab = function(dashboard){

	for(let i=0;i<$scope.dashboardTabs.length;i++){
		if(angular.equals($scope.dashboardTabs[i].name,dashboard.text)){
			alert("This dashboard was already added.");
			return false;
		}
	}
			if(dashboard.text == null){
					return false;
			}
			if(dashboard.text == undefined){
				return false;
			}
			
			var temp = angular.copy(dashboard)
			temp['id'] = parseInt(dashboard.id);
			temp['name'] = dashboard.text;
			temp['startDate'] = $scope.startDate == undefined ? moment(new Date()).subtract(24, 'hours').valueOf() : $scope.startDate;
			temp['endDate'] = $scope.endDate == undefined ? moment(new Date()).valueOf() : $scope.endDate;
			temp['labelName'] = $scope.labelName == undefined ? "Last 24 Hours" : $scope.labelName;
			temp['dateLable'] = $scope.dateLable == undefined ? "last24Hours" : $scope.dateLable;
			$scope.dateLable = $scope.dateLable == undefined ? "last24Hours" : $scope.dateLable;
			$scope.dashboardTabs.push(temp);
			$scope.existingDashboards.push(dashboard.text);
			self.saveDashboardPerf(dashboard.text,dashboard,dashboard.id,JSON.stringify(self.query),$scope.dateLable);
			$scope.loadDashboard(temp);
			$timeout(function(){
				self.triggerRefresh++;
			},500);

}

$scope.addDashboard = function(dashboard){
	for(let i=0;i<$scope.dashboardTabs.length;i++){
		if(angular.equals($scope.dashboardTabs[i].name,dashboard.text)){
			return false;
		}
	}
	if(dashboard.text == null){
			return false;
	}
	if(dashboard.text == undefined){
		return false;
	}

		var temp = angular.copy(dashboard)
		temp['id'] = parseInt(dashboard.id);
		temp['name'] = dashboard.text;
		temp['startDate'] = moment(new Date()).subtract(24, 'hours').valueOf();
		temp['endDate'] = moment(new Date()).valueOf();
		temp['labelName'] = "Last 24 hours";
		temp['dateLable'] = "last24Hours";
		$scope.dashboardTabs.push(temp);
		$scope.existingDashboards.push(dashboard.text);
		self.saveDashboardPerf(dashboard.text,dashboard,dashboard.id,JSON.stringify(self.query),$scope.dateLable);
}

self.dashboardPerf = {dashboard:''}

self.saveDashboardPerf = function(dashboardName,dashboard,id,query,timeRange){
	
	if(dashboardName == null ||dashboardName == undefined ){
		return false;
	}
	self.dashboardPerf.dashboard = dashboardName;
	self.dashboardPerf.dashboardId = id;
	self.dashboardPerf.filterQuery = query;
	self.dashboardPerf.timeRange = timeRange;

	widgetService.saveDashboardPerf(self.dashboardPerf).then(function (response) {
		var temp = angular.copy(dashboard)
		temp['startDate'] = moment(new Date()).subtract(24, 'hours').valueOf();
		temp['endDate'] = moment(new Date()).valueOf();
		temp['labelName'] = "Last 24 hours";
		temp['dateLable'] = "last24Hours";
//		self.loadTabs();
	}, function (error) {
//		alert("unable to save perf !!")
	});

}

self.triggerRefresh = 0;
self.loadTabs = function(){
	//$scope.currentDashboards;

	$scope.dashboardTabs = [];

	$scope.existingDashboards = [];
//	if(window.location.href.indexOf("id")==-1){	

		widgetService.getExistingDashboardTabs().then(function (response) {
			var dashboardDetails = response.data.dashboards;
			$scope.dateLable = (response.data.timeRange == undefined)?"last24Hours":response.data.timeRange;
			$scope.setRelativeTimeForDashboards(response.data.timeRange);
			$scope.activeDashboard = response.data.activeDashboard;
			$timeout(function(){
				for(var i=0;i<dashboardDetails.length;i++){
					if(dashboardDetails[i].dashboardName ==null || dashboardDetails[i].dashboardName ==undefined){
						continue;
					}
					var temp = {};
					temp['id'] = dashboardDetails[i].dashboardId;
					temp['name'] = dashboardDetails[i].dashboardName;
					temp['startDate'] = $scope.startDate;
					temp['endDate'] = $scope.endDate;
					temp['labelName'] = $scope.labelName;
					temp['dateLable'] = $scope.dateLable;
					$scope.dashboardTabs.push(temp);
					$scope.existingDashboards.push(dashboardDetails[i].dashboardName);
				}
			},250);
			$timeout(function(){
				self.triggerRefresh++;
			}, 1500);

		}, function (error) {
//			alert("unable to save perf !!")
		});

//	}
}
$scope.status = {
		isopen: false
};

$scope.applyTimeBasedFilter = function(){



		if(!$scope.startDateInput.momentDate && !$scope.endDateInput.momentDate){
			alert("Please Start Date and End Date");
			return false;
		} 
var startDate= moment($scope.startDateInput.momentDate).format("L LT"); 
var endDate = moment($scope.endDateInput.momentDate).format("L LT");
		$scope.options = { 
				startDate: moment(startDate).valueOf(), 
				endDate: moment(endDate).valueOf(),
				renderAllWidgets:false,
				dateLabel:$scope.dateLable,
				filter : $scope.output,
				queryString : $scope.searchQueryString,
				singleWidget:id,
				color:self.colors,
				companyName:$scope.currentCompany
		}

		$scope.labelName = startDate+"-"+endDate;
		$scope.dateLable = startDate+"-"+endDate;
		$scope.startDate = moment(startDate).valueOf();
		$scope.endDate = moment(endDate).valueOf();
		$scope.apply();
		$scope.saveDashboardTime($scope.dateLable);
		$scope.status.isopen = !$scope.status.isopen;
		$("#simple-dropdown").toggleClass("displayBlock");
}



$scope.startDateInput = {momentDate:moment()};
$scope.endDateInput = {momentDate:moment()};

self.callDatePicker =  function(){

	setTimeout(function(){ 
//		$('#from-date').datetimepicker({
//		format: 'dd/MM/yyyy hh:mm:ss',

//		});
		/*$('#from-date').datetimepicker({
				format: {

					toDisplay: function (date, format, language) {
						var d = new Date(date);

						//d.setDate(d.getDate());
						$scope.displayStartDate =  moment.utc(d).startOf('day').format('MM/DD/YYYY HH:mm:ss');
						$scope.startDate = moment.utc(d).startOf('day').valueOf();
						return $scope.displayStartDate;
					},
					toValue: function (date, format, language) {
						var d = new Date(date);

						//d.setDate(d.getDate());

						$scope.displayStartDate =  moment.utc(d).startOf('day').format('MM/DD/YYYY HH:mm:ss');
						$scope.startDate = moment.utc(d).startOf('day').valueOf();
						return $scope.startDate;
					}
				},
				todayBtn: "linked",
				autoclose: true,
				todayHighlight: true
			});

			$('#to-date').datetimepicker({
				format: {

					toDisplay: function (date, format, language) {
						var d = new Date(date);

						$scope.endDate = moment.utc(d).endOf('day').valueOf();
						$scope.displayEndDate = moment.utc(d).endOf('day').format('MM/DD/YYYY HH:mm:ss')
						return $scope.displayEndDate;
					},
					toValue: function (date, format, language) {
						var d = new Date(date);

						$scope.endDate = moment.utc(d).endOf('day').format('MM/DD/YYYY HH:mm:ss')
						return $scope.endDate;
					}
				},
				todayBtn: "linked",
				autoclose: true,
				todayHighlight: true
			});*/

	}, 3000);


}

self.callDatePicker();

$scope.deleteFilter = function(){

	data.query = [];

	data.query .push({"bool":{"must":[]}});

	data['updateFromDashboard'] = true;

	self.saveDashboard();

	$scope.apply();

}

$timeout(function(){
	$scope.loadFirstDashboad();
},$sessionStorage.user == undefined?3300:0)



var self = this;

$scope.options ;

$scope.model = {id:0,title:"",permission:""}


widgetService.loadAllThemes().then(function (response) {

	var themes = response.data.themes;

	var widgets = response.data.widgets;

	var roles =  response.data.roles;
	var rolesArray = [];
	for(let i=0;i<roles.length;i++){
		if(rolesArray.indexOf(roles[i].rolename)==-1){
			rolesArray.push(roles[i].rolename);
		}
		
	}

	$scope.model['themes'] = themes;
	$scope.existingWidgets = widgets;
	$scope.model['roles'] = roles;
	$scope.model['rolesArray'] = angular.copy(rolesArray);


}, function (error) {

});




/*if(window.location.href.indexOf("id")!=-1){


		self.dashboards.id = parseInt($routeParams.id);

		var filterQUery = $routeParams.filterQUery; 
		var startDate = $routeParams.startDate; 
		var endDate = $routeParams.endDate; 


		if(typeof filterQUery != 'undefined'){

			$scope.model.id = parseInt($routeParams.id)

			var querykey = filterQUery.split(":")[0];
			var queryValue = filterQUery.split(":")[1];



			if(typeof startDate != 'undefined' && typeof startDate != 'undefined'){
				$scope.startDate = parseInt(startDate);
				$scope.endDate = parseInt(endDate);
				$scope.labelName = 		moment($scope.startDate).format('MM/DD/YYYY HH:mm:ss') + ' - ' + moment($scope.endDate).format('MM/DD/YYYY HH:mm:ss');

				$scope.displayStartDate = moment($scope.startDate).format('MM/DD/YYYY HH:mm:ss');
				$scope.displayEndDate = moment($scope.endDate).format('MM/DD/YYYY HH:mm:ss');

				$scope.dateLable = "last24Hours"
			}

			$scope.showFilter = true;





			$scope.filterData = '{"group":{"operator":"AND","rules":[{"condition":"=","field":{"name":"'+querykey+'","$$hashKey":"object:296572"},"data":"'+queryValue+'"}]}}';

			$scope.dashboardfilter = JSON.parse($scope.filterData);

			setTimeout(function(){
				$scope.apply();		

			}, 3000);




		}else{
			widgetService.loadSingleDashboard($routeParams.id).then(function (response) {
				$scope.name = response.data.name;
				$scope.model = response.data.config;
				$scope.model["id"] = parseInt($routeParams.id);
				$scope.model["tableDataHeaders"] = [];
				$scope.model["tableData"] = [];
				data["fields"] = {};
				for(var i=0;i<response.data.config.filterFields.length;i++){

					if(response.data.config.filterFields[i]==='events_tags' || response.data.config.filterFields[i]==='rules_tags'){
						data.fields[response.data.config.filterFields[i]] = { type: 'multi',title:response.data.config.filterFields[i],field:response.data.config.filterFields[i],choices:self.tagDetails};
					}else{
						data.fields[response.data.config.filterFields[i]] = { type: 'term',title:response.data.config.filterFields[i],field:response.data.config.filterFields[i]};

					}



				}

				for(var i=0;i<response.data.config.widgets.legnth;i++){
					response.data.config.widgets[i]['col'] = 1;
					response.data.config.widgets[i]['row'] = 1;
					response.data.config.widgets[i]['sizeY'] = 1;
					response.data.config.widgets[i]['sizeX'] = 2;
				}

				self.widgets = response.data.config.widgets;



				$scope.options = { 
						startDate:moment(new Date()).subtract(24, 'hours').valueOf(), 
						endDate: moment(new Date()).valueOf(),
						renderAllWidgets:true,
						dateLabel:'teest'
				}






			}, function (error) {

			});
		}
	}else{
		widgetService.loadSingleDashboard($window.localStorage.getItem("dashboardId")).then(function (response) {
			$scope.name = response.data.name;
			$scope.model = response.data.config;
			$scope.model["id"] = parseInt($routeParams.id);
			$scope.model["tableDataHeaders"] = [];
			$scope.model["tableData"] = [];



			for(var i=0;i<response.data.config.widgets.legnth;i++){
				response.data.config.widgets[i]['col'] = 1;
				response.data.config.widgets[i]['row'] = 1;
				response.data.config.widgets[i]['sizeY'] = 1;
				response.data.config.widgets[i]['sizeX'] = 2;
			}

			self.widgets = response.data.config.widgets;

			$scope.options = { 
					startDate:moment(new Date()).subtract(24, 'hours').valueOf(), 
					endDate: moment(new Date()).valueOf(),
					renderAllWidgets:true,
					dateLabel:'teest'
			}






		}, function (error) {

		});
	}*/







$scope.addFilter = function(){

	var queryToShow = {
			size: 0,
			filter: { and : data.query }
	};

	$scope.output =	JSON.stringify(data.query[0]);		
	var opt = { 
			startDate: $scope.startDate, 
			endDate: $scope.endDate,
			renderAllWidgets:true,
			dateLabel:$scope.dateLable,
			query : $scope.output,
			color:self.colors
	}
	$scope.apply();
}

$scope.reloadWidget= function(id,widgetOptions){
	$scope.options = { 
			startDate: $scope.startDate, 
			endDate: $scope.endDate,
			renderAllWidgets:false,
			dateLabel:$scope.dateLable,
			filter : $scope.output,
			singleWidget:id,
			queryString : $scope.searchQueryString,
			color:self.colors,
			companyName:$scope.currentCompany
	}
	for(var i=0;i<self.widgets.length;i++){
		if(self.widgets[i].id == id){
			self.widgets[i] = angular.copy(self.widgets[i]);
			break;
		}
	}
}

$scope.showEventsTable = function(tableType){

	$scope.infoTableType = tableType;
	$("#myGrid").empty();
	self.intializeGrid();
}

$scope.currentWidgetId ;

$scope.toggleFullScreen = function(id) {
	$scope.currentWidgetId = id.toString();

	Fullscreen.enable(document.getElementById(id));
	var width = window.innerWidth;
	var height = window.innerHeight;
	$(".dataTables_scrollBody").css("height","");
	$("div.chart").each(function(){
		var chartId = $(this)[0].id;


		if($scope.currentWidgetId===chartId){
			var id = $(this).attr('_echarts_instance_');
			if(window.echarts.getInstanceById(id)){
				$timeout(function(){
					window.echarts.getInstanceById(id).resize();
				},250);
			}

		}

	});


}

document.addEventListener('webkitfullscreenchange', exitHandler, false);
document.addEventListener('mozfullscreenchange', exitHandler, false);
document.addEventListener('fullscreenchange', exitHandler, false);
document.addEventListener('MSFullscreenChange', exitHandler, false);

function exitHandler() {
	if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
		$(".dataTables_scrollBody").css("height","200px");
		Highcharts.charts.forEach(function(chart) {
			if($(chart).length!=0){
				if(parseInt($(chart.container).parent().attr("id")) === $scope.fullscreenId){
					chart.reflow();
					chart.setSize($scope.fullscreenWidth,$scope.fullscreenHeight);
				}
			}
		});
	}
}

$scope.clearFilter = function(){

//	model['filter']= "";
	var opt = { 
			startDate: $scope.startDate, 
			endDate: $scope.endDate,
			renderAllWidgets:true,
			dateLabel:$scope.dateLable,
			filter : ""

	}
	$scope.output = "";
	$scope.apply();

	data.query = {};
}

$scope.$on('chage-chart-color', function(event, args) {

	var data = {"widgetId":args.widgetId,"confg":args.cfg}

	widgetService.saveColors(data).then(function (response) {
		if(response.data.status){
			$("#constext-menu-div").hide();
		}
	});
});

$scope.$on('apply-time-filter', function(event, args) {

	$scope.startDate = args.startDate;
	$scope.endDate = args.endDate;
	$scope.toggleLive('start');
	$scope.apply();

});

$scope.$on('apply-fliter', function(event, args) {

	for(var i=0;i<args.length;i++){
		if( i == 0 ) {
			if(args[0].type == "alert"){
				$scope.showEventsTable("alerts");
			}else{
				$scope.showEventsTable(args[0].type)
			}
		}
		var field = args[i].field.split(".")[args[i].field.split(".").length-1];
		var data = {subType:'equals',field:field+".keyword",value:args[i].value}

		if(self.query.rules){
			self.query.rules.push(data);
		}else{
			self.query  = {subType: "must",type: "group",rules:[]};
			self.query.rules.push(data);
		}
		$scope.addGlobalFilter(self.query);


	}

	$scope.output = JSON.stringify(parseFilterGroup(self.data.fields,$filter,self.query));
	$scope.options = { 
			startDate: $scope.startDate, 
			endDate: $scope.endDate,
			renderAllWidgets:true,
			dateLabel:$scope.dateLable,
			filter : $scope.output,
			queryString : $scope.output,
			color:self.colors,
			companyName:$scope.currentCompany
	}

	//self.loadEventData();
//	$scope.closePopup();
	$scope.toggleLive('start');
	$scope.apply();

	//$scope.submitQuery();

});

self.alertMessages = [];

$scope.changeAlertAssignee = function(data1){
	
	var data = {id:data1.id,assignee:data1.assignee};
	
	alertsFactory.changeAlertAssignee(data).then(function(response){
		if(response.data.status){
			self.alertMessages.push({ type: 'success', msg: "Alert was successfully  Assigned." });
			$timeout(function () {

				self.alertMessages = [];
			}, 2000);
			//self.loadAlertHistory($scope.startDate,$scope.endDate);
		}else{
			self.alertMessages.push({ type: 'danger', msg: response.data.error });

			$timeout(function () {

				self.alertMessages = [];
			}, 2000);
		}

	});
}

$scope.tabName = "history";

$scope.summernoteOptions = {
		tooltip:false,
		height: 150,
		width:'90%',
			toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']]
			]
};

$scope.notesErroMessage = [];

$scope.addNotes = function(data1){
	var data = {id:data1.id,comment:data1.comment};
	
	alertsFactory.addComment(data).then(function(response){
		if(response.data.status){
			$scope.notesErroMessage.push({ type: 'success', msg: "Alert was successfully  Assigned." });
			$scope.singleEvnentInfo['comments'] = response.data.data.comments;
			$scope.singleEvnentInfo['comment'] = "";
			$timeout(function () {

				$scope.notesErroMessage = [];
			}, 2000);
			//self.loadAlertHistory($scope.startDate,$scope.endDate);
		}else{
			$scope.notesErroMessage.push({ type: 'danger', msg: response.data.error });

			$timeout(function () {

				$scope.notesErroMessage = [];
			}, 2000);
		}

	});
}

$scope.changeAlertStatus = function(data1){
	
	var data = {id:data1.id,alert_status:data1.alert_status};
	
	alertsFactory.changeAlertStatus(data).then(function(response){
		if(response.data.status){
			self.alertMessages.push({ type: 'success', msg: "Alert was successfully  Assigned." });
			$timeout(function () {

				self.alertMessages = [];
			}, 2000);
			//self.loadAlertHistory($scope.startDate,$scope.endDate);
		}else{
			self.alertMessages.push({ type: 'danger', msg: response.data.error });

			$timeout(function () {

				self.alertMessages = [];
			}, 2000);
		}

	});
}

$scope.addGlobalFilter = function(filter){
	let flag = true;
	for(let  i=0;i<$rootScope.dashboardFilters.length;i++){
		if(angular.equals($rootScope.dashboardFilters[i].id,$scope.dashboard.id)){
			flag = false;
			$rootScope.dashboardFilters[i] = angular.copy({"id":$scope.dashboard.id,"query":filter});
		}
	}
	if(flag === true){
		$rootScope.dashboardFilters.push({"id":$scope.dashboard.id,"query":filter});
	}
}
$scope.$on('apply-filter-out', function(event, args) {
	args['subType'] = "notEquals"
		$rootScope.$broadcast('dashboard-apply-filter-out', args);

	unloader("body");
	$scope.showFilter = true;
	data.needsUpdate = true;


	$scope.toggleLive('start');

	$scope.addFilter();





});

$scope.$on('apply-filter-in', function(event, args) {



	args['subType'] = "equals"
		$rootScope.$broadcast('dashboard-apply-filter-out', args);

	loader("body");
	$scope.showFilter = true;
	data.needsUpdate = true;

	$scope.toggleLive('start');

	$scope.addFilter();







});



if(!($scope.model.filterFields === undefined)){

	for(var i=0;i<$scope.model.filterFields.length;i++){
		data.fields[$scope.model.filterFields[i]] = { type: 'term' };

	}

}



self.newDashboard = function(){

	$scope.publicDashboardCount = 0; 

	$scope.privateDashboardCount = 0; 
	$scope.sharedDashboardCount = 0; 




	Object.keys($scope.publicShares).forEach(function(key) {
		$scope.publicDashboardCount+= $scope.publicShares[key].length;
	});

	Object.keys($scope.privateShares).forEach(function(key) {
		$scope.privateDashboardCount+= $scope.privateShares[key].length;
	});

	Object.keys($scope.shared).forEach(function(key) {
		$scope.sharedDashboardCount+= $scope.shared[key].length;
	});

	$scope.allDashboardsCount = $scope.publicDashboardCount+$scope.privateDashboardCount+$scope.sharedDashboardCount;
	$("#newDashboard_dialog").modal();
}

$scope.currentDashboards = [];




$scope.showDashoardList = function(spaceType){

//	$scope.currentDashboards = [];

//	if(spaceType === "all"){
//	Object.keys($scope.publicShares).forEach(function(key) {
//	for(var i=0;i<$scope.publicShares[key].length;i++){
//	$scope.currentDashboards.push($scope.publicShares[key][i])
//	}
//	});

//	Object.keys($scope.privateShares).forEach(function(key) {
//	for(var i=0;i<$scope.privateShares[key].length;i++){
//	$scope.currentDashboards.push($scope.privateShares[key][i])
//	}
//	});

//	Object.keys($scope.shared).forEach(function(key) {
//	for(var i=0;i<$scope.shared[key].length;i++){
//	$scope.currentDashboards.push($scope.shared[key][i])
//	}
//	});
//	}

//	if(spaceType === "public"){
//	Object.keys($scope.publicShares).forEach(function(key) {
//	for(var i=0;i<$scope.publicShares[key].length;i++){
//	$scope.currentDashboards.push($scope.publicShares[key][i])
//	}
//	});
//	}

//	if(spaceType === "private"){
//	Object.keys($scope.privateShares).forEach(function(key) {
//	for(var i=0;i<$scope.privateShares[key].length;i++){
//	$scope.currentDashboards.push($scope.privateShares[key][i])
//	}
//	});
//	}

//	if(spaceType === "shared"){
//	Object.keys($scope.shared).forEach(function(key) {
//	for(var i=0;i<$scope.shared[key].length;i++){
//	$scope.currentDashboards.push($scope.shared[key][i])
//	}
//	});
//	}


}

$timeout(function(){
	$scope.showDashoardList("all");
},$sessionStorage.user == undefined?3100:0);

function htmlEntities(str) {
	return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function computed(group) {
	if (!group) return "";
	for (var str = "(", i = 0; i < group.rules.length; i++) {
		i > 0 && (str += " " + group.operator + " ");
		if(group.rules[i].field.name){
			if( group.rules[i].field.name.indexOf(".") > -1){

				//event_data['TargetUserName'] = 'administrator')
				str += group.rules[i].group ?
						computed(group.rules[i].group) :
							group.rules[i].field.name.split(".")[0]+"['"+group.rules[i].field.name.split(".")[1]+"']" + " " + htmlEntities(group.rules[i].condition) + " '" + group.rules[i].data+"'";
			}else{

				if(group.rules[i].condition === "%%"){
					str += group.rules[i].group ?
							computed(group.rules[i].group) :
								"t."+group.rules[i].field.name +  " like '%" + group.rules[i].data+"%'";
				}
				else if(group.rules[i].condition === "_%"){
					str += group.rules[i].group ?
							computed(group.rules[i].group) :
								"t."+group.rules[i].field.name +  " like '" + group.rules[i].data+"%'";
				}
				else if(group.rules[i].condition === "%_"){
					str += group.rules[i].group ?
							computed(group.rules[i].group) :
								"t."+group.rules[i].field.name +  " like '%" + group.rules[i].data+"'";
				}else if(group.rules[i].condition === "in"){

					var inData = [];
					var tempData = group.rules[i].data.split(",");
					for(var j=0;j<tempData.length;j++){
						inData.push("'"+tempData[j]+"'");
					}
					str += group.rules[i].group ?
							computed(group.rules[i].group) :
								"t."+group.rules[i].field.name+ " in ("+inData.join(',')+")";
				}
				else if(group.rules[i].condition === "not_in"){
					var inData = [];
					var tempData = group.rules[i].data.split(",");
					for(var j=0;j<tempData.length;j++){
						inData.push("'"+tempData[j]+"'");
					}
					str += group.rules[i].group ?
							computed(group.rules[i].group) :
								"t."+group.rules[i].field.name+ " not in ("+inData.join(',')+")";

				}else{
					str += group.rules[i].group ?
							computed(group.rules[i].group) :
								"t."+group.rules[i].field.name + htmlEntities(group.rules[i].condition) + " '" + group.rules[i].data+"'";
				}



			}
		}


	}

	return str + ")";
}




$scope.downloadPNG = function(id,title){
	$(".ag-side-bar.ag-unselectable").css("display","none")
	kendo.drawing.drawDOM($("#widget-"+id))
	.then(function(group) {
		return kendo.drawing.exportImage(group);
	}).done(function(data) {
		kendo.saveAs({
			dataURI: data,
			fileName: title+".png"
		});
	});
	$(".ag-side-bar.ag-unselectable").css("display","");
}

$scope.downloadExcel = function(id,chartType){
	if(chartType == 'table'){

		widgetService.loadSingleWidget(id,$scope.startDate,$scope.endDate,"","").then(function (response) {
			var fileData = ""
				for(let i=0;i<response.data.columnList.length;i++){
					if(i == response.data.columnList.length-1){
						fileData += response.data.columnList[i].name+"\n";
					}else{								
						fileData += response.data.columnList[i].name+",";
					}
				}

			for(let i=0;i<response.data.data.length;i++){
				for(let j=0;j<response.data.columnList.length;j++){
					if(j == response.data.columnList.length-1){
						fileData += response.data.data[i][j]+"\n";
					}else{								
						fileData += response.data.data[i][j]+",";
					}
				}
			}


			var pom = document.createElement('a');
			var csvContent= fileData; //here we load our csv data 
			var blob = new Blob([csvContent],{type: 'text/csv;charset=utf-8;'});
			var url = URL.createObjectURL(blob);
			pom.href = url;
			pom.setAttribute('download',response.data.title+'.csv');
			pom.click();
		}, function (error) {

		});

	}else{			
		$('#'+id).highcharts().downloadCSV();
	}
}

$scope.viewDataTable = function(id){
	var height = $("#"+id).height();
	var chart = $("#"+id).highcharts(),
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

	if($("#"+id).next().hasClass("highcharts-data-table")){
		$("#"+id).next().css("margin-left","10px")
		$("#"+id).next().css("margin-right","10px")
		$("#"+id).next().css("margin-bottom","20px")
		$("#"+id).next().css("height",height-27);
		$("#"+id).next().css("overflow-y","scroll");
	};
}
$scope.switchedWidgetDetails = [];
$scope.switchChart = function(id,chart,widgetOptions){

	$scope.switchedWidgetDetails.push({"widget_id":id,"widget_type":chart});

	if(chart == 'bar' || chart == 'column' || chart == 'line' || chart == 'area' || chart == 'stackbar' || chart == 'columnstackbar' || chart == 'stackline'){
		widgetOptions.config.chart_type = 'line';
		if(chart == 'area'){
			widgetOptions.config.values[0].series_type = 'arealine';
		}else{
			widgetOptions.config.values[0].series_type = chart;
		}
	}else if(chart == 'doughnut' || chart == 'pie'){
		widgetOptions.config.chart_type = 'pie';
		if(chart == 'doughnut'){
			widgetOptions.config.chart_type = 'pie';	
		}else{
			widgetOptions.config.values[0].series_type = chart;
		}
	}

	$scope.options = { 
			startDate: $scope.startDate, 
			endDate: $scope.endDate,
			renderAllWidgets:false,
			dateLabel:$scope.dateLable,
			filter : $scope.output,
			singleWidget:id,
			queryString : $scope.searchQueryString,
			color:self.colors,
			companyName:$scope.currentCompany
	}
	for(var i=0;i<self.widgets.length;i++){
		if(self.widgets[i].id == id){
			self.widgets[i].options  = angular.copy(widgetOptions);
			self.widgets[i] = angular.copy(self.widgets[i]);
		}
	}

}

$scope.exportToPdf = function(title){

	kendo.drawing.drawDOM($("#page-print")).then(function(group) {
		kendo.drawing.pdf.saveAs(group, title+".pdf");
	});
}

$scope.loadSingleWidget = function(id){
	$scope.options = { 
			startDate: $scope.startDate, 
			endDate: $scope.endDate,
			renderAllWidgets:false,
			dateLabel:$scope.dateLable,
			filter : $scope.output,
			singleWidget:id,
			color:self.colors,
			queryString : $scope.searchQueryString,
			companyName:$scope.currentCompany
	}
	widgetService.loadSingleWidget(id,$scope.startDate,$scope.endDate,"","").then(function (response) {						
		for(var i=0;i<self.widgets.length;i++){
			if(self.widgets[i].id == id){
				response.data['col'] =self.widgets[i].col;
				response.data['row'] =self.widgets[i].row;
				response.data['sizeX'] =self.widgets[i].sizeX; 
				response.data['sizeY'] = self.widgets[i].sizeY;
				response.data['id'] = self.widgets[i].id;
				response.data['options'] = widgetOptions;
				self.widgets[i] = response.data;
				break;
			}
		}
	}, function (error) {

	});

}

$scope.$on('$locationChangeStart', function( event ) {
	$("#constext-menu-div").hide();
	self.closeFilter();
//	$(".popover").hide();
});

window.onbeforeunload = function() {
	$("#constext-menu-div").hide();
}


colorConfigurationFactory.getColorByUser().then(function(response){
	self.colors = response.data.color;
},function(err){

});


self.temp = {};
self.filterMessagaes = [] ;
$scope.submitQuery = function(){
	loader("body");
	if(self.temp != {}){
		if(self.temp.queryId == undefined){
			try{
				if(self.temp.subType == undefined || self.temp.subType == "" || self.temp.field == "" || self.temp.field == undefined){
					unloader("body");
					self.filterMessagaes.push({type:"danger",msg:"Please enter all the filter details"});
					$timeout(function(){
						self.filterMessagaes = [];
					},2000);
					return false;
				}
				self.query.rules.push(self.temp);
			}catch(err){
				self.query  = {subType: "must",type: "group",rules:[]};
				self.query.rules.push(self.temp);
			}
		}else{
			self.query.rules[self.temp.queryId] = self.temp;
		}
		self.closeFilter();
		$scope.addGlobalFilter(self.query);
		$scope.output = JSON.stringify(parseFilterGroup(self.data.fields,$filter,self.query));
		$scope.options = { 
				startDate: $scope.startDate, 
				endDate: $scope.endDate,
				renderAllWidgets:true,
				dateLabel:$scope.dateLable,
				filter : $scope.output,
				queryString : $scope.output,
				color:self.colors,
				companyName:$scope.currentCompany
		}
		$scope.toggleLive('start');
		$scope.apply();
		self.temp = {};
	}
}


self.removeQuery = function(id){
	self.query.rules.splice(id,1);
	$scope.addGlobalFilter(self.query);
	$scope.output = JSON.stringify(parseFilterGroup(self.data.fields,$filter,self.query));
	$scope.categoryDisplayText = "All";
	$scope.options = { 
			startDate: $scope.startDate, 
			endDate: $scope.endDate,
			renderAllWidgets:true,
			dateLabel:$scope.dateLable,
			filter : $scope.output,
			queryString : $scope.output,
			color:self.colors,
			companyName:$scope.currentCompany
	}
	$scope.toggleLive('start');
	$scope.apply();

	self.temp = {};
}

self.editQuery = function(data,id){
	self.temp = angular.copy(data);
	self.temp.queryId = id;
}

$scope.setDirectiveFn = function(directiveFn) {
	$scope.directiveFn = directiveFn;
};


self.fieldConfig = {
		maxItems : 1,
		optgroupField : 'class',
		sortField: [{field: 'fieldName',direction: 'asc'}],
		labelField : 'fieldName',
		searchField : ['fieldName'],
		valueField : 'fieldName',
		create : false
}

self.operator = [
	{fieldName:'is',fieldValue:'equals'},
	{fieldName:'is not',fieldValue:'notEquals'},
	{fieldName:'is one of',fieldValue:'in'},
	{fieldName:'is not one of',fieldValue:'notin'},
	{fieldName:'exists',fieldValue:'exists'},
	{fieldName:'does not exists',fieldValue:'notExists'},
	];

self.operatorConfig = {
		maxItems : 1,
		optgroupField : 'class',
		labelField : 'fieldName',
		searchField : ['fieldName'],
		valueField : 'fieldValue',
		create : false
}

$(document).ready(function() {
	var dragging = false;
	$('#logSlider').mousedown(function(e){

		e.preventDefault();

		dragging = true;
		var main = $('#logSliderContent');
		var dragbar = $("#logSlider");
		var ghostbar = $('<div>',
				{id:'ghostbar',
			css: {
				height: dragbar.outerHeight(),
				width: dragbar.outerWidth(),
				top: main.offset().top,
				bottom: main.offset().bottom
			}	
				}).appendTo('body');
		$(document).mousemove(function(e){
			ghostbar.css("top",e.pageY);
		});
	});

	$(document).mouseup(function(e){
		if (dragging) 
		{
			$('#menuInfoWrapper').css("height",$( window ).height()-e.pageY+5);
			$('#logViewDiv').css("height",$( window ).height()-e.pageY+5);
			$('#logTabHeight').css("height",$( window ).height()-e.pageY-30);
			$("div#myGrid").css("height",$( window ).height()-e.pageY-35);
			$('#ghostbar').remove();
			$timeout(function(){		
				$("#dashboardsWidgets").css("height",$( window ).height()-$('#menuInfoWrapper').height()-100);
				$("#dashboardsWidgets").css("overflow-x","hidden");
				$("#dashboardsWidgets").css("overflow-y","scroll");
				$("html").css("overflow-y","hidden");
			},500);
			$(document).unbind('mousemove');
			dragging = false;
		}
	});
});


$scope.setWidthAuto= function(){
	$timeout(function(){
		$("#setWithAuto input.form-control.ui-select-search").css("width","-webkit-fill-available");
	},250);
}	

$("#simple-dropdown-anchor").on('click',function(e){
	$("#simple-dropdown").toggleClass("displayBlock");
});

self.showFilter = function(){
	$("#filter-dropdown").toggleClass("displayBlock");
}
self.closeFilter = function(){
	$("#filter-dropdown").removeClass("displayBlock");
}
	$(".navbar-toggler" ).on('click', function(){
	  setTimeout(function(){
		  window.dispatchEvent(new Event('resize'));
		  self.triggerRefresh++;
	  }, 400);
	});
}]);


app.directive('popover', function($compile,$timeout){
	return {
		restrict : 'A',
//		scope: {
//		setFn: '&'
//		},
//		scope: { data: '=popover'},
		link : function(scope, elem){
			var content = $("#FilterOverlay").html();
//			var content = $("#timeControlOverlay").html();
			var compileContent = $compile(content)(scope);
			var options = {
					content: compileContent,
					placement: 'bottom',
					container: 'body',
					trigger: 'manual'

			};

			$(elem).popover(options);
			$("#FilterOverlay").css("width","500px");
//			scope.setFn({theDirFn: scope.closePopup});
			$(elem).bind('click', function() {
				$(elem).popover('toggle');
			});
			scope.closePopup = function(){
				$(elem).popover('hide');
				$(".popover.fade.bs-popover-bottom.show").css("display","");
			};
		}
	}
});

app.directive('popover1', function($compile,$timeout){
	return {
		restrict : 'A',
//		scope: {
//		setFn: '&'
//		},
//		scope: { data: '=popover'},
		link : function(scope, elem){
//			var content = $("#FilterOverlay").html();
			var content = $("#timeControlOverlay").html();
			var compileContent = $compile(content)(scope);
			var options = {
					content: compileContent,
					placement: 'right',
					html: true,
					container: 'body',
					trigger: 'manual'

			};

			$(elem).popover(options);
//			scope.setFn({theDirFn: scope.closePopup});
			$(elem).bind('click', function() {
				$(elem).popover('toggle');
			});
			scope.closePopup1 = function(){
				$(elem).popover('hide');
			};
		}
	}
});

app.directive('dashboardqueryBuilder', ['$compile','conditionFactory', function ($compile,conditionFactory) {
	return {
		restrict: 'E',
		scope: {
			group: '='

		},
		templateUrl: 'queryBuilderDirective.html',

		compile: function (element, attrs) {
			var content, directive;
			content = element.contents().remove();
			return function (scope, element, attrs) {
				if(!scope.group.rules){
					scope.group = {"rules":[]}
				}


				scope.operators = [
					{ name: 'AND' },
					{ name: 'OR' }
					];



				scope.conditions = [
					{ name: 'Equal TO', value:"==" },
					{ name: 'Not Equal to',value:"!="  },
					{ name: 'Greater than',value:">"  },
					{ name: 'Contains',value:"%%"  },
					{ name: 'Starts With',value:"_%"  },
					{ name: 'Ends With',value:"%_"  },
					{ name: 'In',value:"in"  },
					{ name: 'Not In',value:"not_in"  },
					{ name: 'Greater than equal to',value:">="  },
					{ name: 'less than',value:"<"  },
					{ name: 'less than equal to',value:"<="  }
					];





				scope.loadFields = function(){
					var tempArray = [];
					setTimeout(function(){ 
						if(!(scope.$parent.model.filterFields === undefined)){
							for(var i=0;i<scope.$parent.model.filterFields.length;i++){
								tempArray.push({name:scope.$parent.model.filterFields[i]})
							}
						}
						scope.fields =tempArray;
					}, 3000);

				}


				scope.addCondition = function (group) {

					group.rules.push({
						condition: ':',
						field: '',
						data: ''
					});
				};

				//scope.addCondition(scope.group);
				scope.loadFields();

				scope.removeCondition = function (index) {
					scope.group.rules.splice(index, 1);
				};

				scope.addGroup = function () {
					scope.group.rules.push({
						group: {
							operator: 'AND',
							rules: [{
								condition: ':',
								field: '',
								data: ''
							}]
						}
					});

				};

				scope.switchToBasic = function(){
					scope.$parent.isFiterAdvanced = false;
				};

				scope.removeGroup = function () {
					"group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
				};

				directive || (directive = $compile(content));

				element.append(directive(scope, function ($compile) {
					return $compile;
				}));
			}
		}
	}
}]);


app.directive('gridsterDynamicHeight', gridsterDynamicHeight);

gridsterDynamicHeight.$inject = [];
function gridsterDynamicHeight(){

	var directive = {
			scope: {
				item: "=" //gridster item
			},
			link: link,
			restrict: 'A'
	};
	return directive;

	function link(scope, element, attrs) {

		scope.$watch(function() {

			return element[0].scrollHeight;
		},
		function(newVal, oldVal) { 

			var rowHeightOption = 75; // Change this value with your own rowHeight option
			var height = rowHeightOption * scope.item.sizeY;
			if(newVal > height){

				var div = Math.floor(newVal / rowHeightOption);
				div++;
				scope.item.sizeY = div; 
			}
		});
	}


}




var count = 0;
function parseFilterGroup(fieldMap, $filter, group) {
	var obj = {};
	if (group.type === 'group') {
		obj.bool = {};
		obj.bool[group.subType] = group.rules.map(parseFilterGroup.bind(group, fieldMap, $filter)).filter(function(item) {
			return !!item;
		});
		return obj;
	}

	var fieldKey = group.field;
	if (!fieldKey) return;

	var fieldData = fieldMap[fieldKey];
	var fieldName
	if(fieldData != undefined){
		fieldName = fieldData.field;
	} else {
		fieldData = { field: fieldKey, title:fieldKey.replace(".keyword",""), type: "term" }
		fieldName = fieldData.field;
	}

	switch (fieldData.type) {
	case 'term':
		if (!group.subType) return;

		switch (group.subType) {
		case 'equals':
			if (group.value === undefined) return;
			obj.term = {};
			obj.term[fieldName] = group.value;
			break;
		case 'notEquals':
			if (group.value === undefined) return;
			obj.bool = { must_not: { term: {}}};
			obj.bool.must_not.term[fieldName] = group.value;
			break;

		case 'in':
			if (group.value === undefined) return;
			obj.bool = { must: { terms: {}}};
			obj.bool.must.terms[fieldName] = group.value.split(",");
			break;
		case 'notin':
			if (group.value === undefined) return;
			obj.bool = { must_not: { terms: {}}};
			obj.bool.must_not.terms[fieldName] = group.value.split(",");
			break;
		case 'exists':
			obj.exists = { field: fieldName };
			break;
		case 'notExists':
			obj.bool = { must_not: { exists: { field: fieldName }}};
			break;
		default:
			throw new Error('unexpected subtype ' + group.subType);
		}
		break;
	case 'contains':
		if (!group.subType) return;

		switch (group.subType) {
		case 'equals':
			if (group.value === undefined) return;
			obj.term = {};
			obj.term[fieldName] = group.value;
			break;
		case 'notEquals':
			if (group.value === undefined) return;
			obj.bool = { must_not: { term: {}}};
			obj.bool.must_not.term[fieldName] = group.value;
			break;
		case 'contains':
			if (group.value === undefined) return;
			obj.match_phrase = {};
			obj.match_phrase[fieldName + '.analyzed'] = group.value;
			break;
		case 'notContains':
			if (group.value === undefined) return;
			obj.bool = { must_not: { match_phrase: {}}};
			obj.bool.must_not.match_phrase[fieldName + '.analyzed'] = group.value;
			break;
		case 'exists':
			obj.exists = { field: fieldName };
			break;
		case 'notExists':
			obj.bool = { must_not: { exists: { field: fieldName }}};
			break;
		default:
			throw new Error('unexpected subtype ' + group.subType);
		}
		break;

	case 'boolean':
		if (group.value === undefined) return;
		obj.term = {};
		obj.term[fieldName] = group.value;
		break;

	case 'number':
		if (!group.subType) return;

		switch (group.subType) {
		case 'equals':
			if (group.value === undefined) return;
			obj.term = {};
			obj.term[fieldName] = group.value;
			break;
		case 'notEquals':
			if (group.value === undefined) return;
			obj.bool = { must_not: { term: {}}};
			obj.bool.must_not.term[fieldName] = group.value;
			break;
		case 'lt':
		case 'lte':
		case 'gt':
		case 'gte':
			if (group.value === undefined) return;
			obj.range = {};
			obj.range[fieldName] = {};
			obj.range[fieldName][group.subType] = group.value;
			break;
		case 'exists':
			obj.exists = { field: fieldName };
			break;
		case 'notExists':
			obj.bool = { must_not: { exists: { field: fieldName }}};
			break;
		default:
			throw new Error('unexpected subtype ' + group.subType);
		}
		break;

	case 'date':
		if (!group.subType) return;

		switch (group.subType) {
		case 'equals':
			if (!angular.isDate(group.date)) return;
			obj.term = {};
			obj.term[fieldName] = formatDate($filter, group.date);
			break;
		case 'notEquals':
			if (!angular.isDate(group.date)) return;
			obj.bool = { must_not: { term: {}}};
			obj.bool.must_not.term[fieldName] = formatDate($filter, group.date);
			break;
		case 'lt':
		case 'lte':
		case 'gt':
		case 'gte':
			if (!angular.isDate(group.date)) return;
			obj.range = {};
			obj.range[fieldName] = {};
			obj.range[fieldName][group.subType] = formatDate($filter, group.date);
			break;
		case 'last':
			if (!angular.isNumber(group.value)) return;
			obj.range = {};
			obj.range[fieldName] = {};
			obj.range[fieldName].gte = 'now-' + group.value + 'd';
			obj.range[fieldName].lte = 'now';
			break;
		case 'next':
			if (!angular.isNumber(group.value)) return;
			obj.range = {};
			obj.range[fieldName] = {};
			obj.range[fieldName].gte = 'now';
			obj.range[fieldName].lte = 'now+' + group.value + 'd';
			break;
		case 'exists':
			obj.exists = { field: fieldName };
			break;
		case 'notExists':
			obj.bool = { must_not: { exists: { field: fieldName }}};
			break;
		default:
			throw new Error('unexpected subtype ' + group.subType);
		}
		break;

	case 'multi':
		if (group.values === undefined) return;
		obj.terms = {};
		obj.terms[fieldName] = [];


		Object.keys(group.values).forEach(function(key) {
			if(group.values[key]){
				obj.terms[fieldName].push(key);
			}

		});


		break;

	case 'select':
		if (group.value === undefined) return;
		obj.term = {};
		obj.term[fieldName] = group.value.id;
		break;

	case 'match':
		if (!group.subType) return;

		switch (group.subType) {
		case 'matchAny':
			if (group.value === undefined) return;
			obj.match = {};
			obj.match[fieldName] = group.value;
			break;
		case 'matchAll':
			if (group.value === undefined) return;
			obj.match = {};
			obj.match[fieldName] = {};
			obj.match[fieldName].query = group.value;
			obj.match[fieldName].operator = 'and';
			break;
		case 'matchPhrase':
			if (group.value === undefined) return;
			obj.match_phrase = {};
			obj.match_phrase[fieldName] = group.value;
			break;
		case 'exists':
			obj.exists = { field: fieldName };
			break;
		case 'notExists':
			obj.bool = { must_not: { exists: { field: fieldName }}};
			break;
		default:
			throw new Error('unexpected subtype ' + group.subType);
		}
		break;

	default:
		throw new Error('unexpected type ' + fieldData.type);
	}

	if (fieldData.parent) {
		obj = {
				has_parent: {
					parent_type: fieldData.parent,
					query: obj
				}
		}
	}

	if (fieldData.nested) {
		obj = {
				nested: {
					path: fieldData.nested,
					query: obj
				}
		};
	}

	count += 1;
	return obj;
}


$(window).on('resize', function(){
	setTimeout(function(){ 
		$("div.chart").each(function(){
			var chartId = $(this)[0].id;
			var id = $(this).attr('_echarts_instance_');
			if(window.echarts.getInstanceById(id)){
				window.echarts.getInstanceById(id).resize();
			}



		});
	}, 400);
});

app.directive('search', function () {
	return function ($scope, element) {
		element.bind("keyup", function (event) {
			var val = element.val();
			if(val.length > 2) {
				$scope.search(val);
			}
		});
	};
});

$(window).on('resize', function(){
	setTimeout(function(){
		$("#dashboardsWidgets").css("height",$( window ).height()-$('#menuInfo').height()-95);
		$("#dashboardsWidgets").css("overflow-x","hidden");
		$("#dashboardsWidgets").css("overflow-y","scroll");
	},410);
});

