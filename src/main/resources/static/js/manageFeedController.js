app.controller("manageFeedController",['$scope','$timeout','$sessionStorage','$ngConfirm','manageFeedFactory',function($scope,$timeout,$sessionStorage,$ngConfirm,manageFeedFactory){

	var self = this;
	$scope.templateUrl = "savedFeed.html";
	self.newFeed={"owner":"","name":"","provider":"","url":"","header":"","confidenceScore":50,"delimiter":",","feedSchedulerStatus":"true","feedScheduler":"0 0/7 * 1/1 * ? *","cvsValue":''};
	self.alertMessagaes =[];

	$scope.flag = true;
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';

	self.configureFeed = function(){
		$scope.templateUrl ="configureFeed.html";
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;
		self.newFeed={"owner":"","feedName":"","indicatorType":"","feedType":"URL","urlFeedModel":{"url":""},"apiFeedModel":{"url":"","method":"","authenticationType":"","userName":"","password":"","apiKey":""},"fileFeedModel":{"file":"","fileType":""},"taxiiFeedModel":{"discoveryUrl":"","userName":"","password":""},"feedTrustScore":50,"sourceName":"","banner":"","delimiter":"none","startsAtPosition":1,"extractFieldPostion":0,"feedSchedulerStatus":"true","feedScheduler":"0 0/7 * 1/1 * ? *","tags":[],"tlp":"","columnNames":[]};
		
	}

	self.editFeed = function(){
		$scope.templateUrl ="configureFeed.html";
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
	}

	self.cronOptions = {
			formInputClass: 'form-control cron-gen-input', // Form input class override
			formSelectClass: 'form-control cron-gen-select', // Select class override
			formRadioClass: 'cron-gen-radio', // Radio class override
			formCheckboxClass: 'cron-gen-checkbox', // Radio class override
			hideSeconds: true // Whether to show/hide the seconds time picker
	}

	//wizards js
	$scope.wizards = ["info","details","schedule","labels"];
	$scope.wizardType = $scope.wizards[0] ;
	$scope.nextWizard = $scope.wizards[1];
	$scope.currentStep = 0;
	$scope.navigateToAotherWizard = function(wizardName){
		if(self.doValidations($scope.wizards[$scope.currentStep])){
			$scope.wizardType = $scope.wizards[$scope.currentStep+1];
			$scope.currentStep++;
			$scope.flag = true;
		}else{
			$scope.flag = false;
		}
	}

	$scope.navigateToPerviousWizard = function(wizardName){
		$scope.wizardType = $scope.wizards[$scope.currentStep-1];
		$scope.currentStep--;
	}

	self.allUsers  = [];

	self.getAllUsers = function(){
		manageFeedFactory.getAllUsersInCompany($sessionStorage.user.companyName).then(function(response){
			self.allUsers = angular.copy(response.data);
		},function(error){

		});
	}

	self.allScheduledDetails = [];
	self.getScheduledFeeds = function(){
		manageFeedFactory.getScheduledFeeds().then(function(response){
			self.allScheduledDetails = angular.copy(response.data);
			self.loadAgGrid();
		},function(error){
			self.loadAgGrid();
		});
	}

	self.saveFeedDetails = function(){

		
		manageFeedFactory.schedule(self.newFeed).then(function(response){
			self.getScheduledFeeds();
			$scope.templateUrl = "savedFeed.html";
			self.alertMessagaes.push({ type: 'success', msg: 'Successfully saved' });
			$timeout(function () {
				self.alertMessagaes =[];
			}, 2000);
			$scope.showHomeButton = true;
			$scope.wizardType = $scope.wizards[0] ;
			$scope.nextWizard = $scope.wizards[1];
			$scope.currentStep = 0;
		},function(error){

			self.alertMessagaes.push({ type: 'danger', msg: 'Somethign went wrong please try again' });
			$timeout(function () {
				self.alertMessagaes =[];
			}, 2000);

		});	

	}

	self.deleteFeedById = function(id){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete Feed',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						manageFeedFactory.deleteById(id).then(function(response){
							if(response.data.status == "success"){
								self.getScheduledFeeds();
								self.alertMessagaes.push({ type: 'success', msg: 'Successfully deleted' });
								$timeout(function () {
									self.alertMessagaes =[];
								}, 2000);
							}
						},function(error){
							self.alertMessagaes.push({ type: 'danger', msg: 'Somethign went wrong please try again' });
							$timeout(function () {
								self.alertMessagaes =[];
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

	self.edit = function(data){
		console.log(data);
		self.newFeed= angular.copy(data);
		//self.newFeed.feedSchedulerStatus = self.newFeed.feedSchedulerStatus.toString();
		console.log(self.newFeed);
		
		
		$scope.templateUrl ="configureFeed.html";
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
	}

	self.back = function(){
		$scope.templateUrl = "savedFeed.html";
		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		self.loadAgGrid();
	}

	self.doValidations =  function(wizardName){

		var flag =  true;

		if(wizardName == 'info'){

			if(self.newFeed.name=='' || self.newFeed.name  == undefined || self.newFeed.provider=='' || self.newFeed.provider  == undefined){

				self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the highlited fields' });
				$timeout(function () {
					self.alertMessagaes =[];
				}, 2000);

				flag = false; 
			}
		}

		else if(wizardName == 'details'){
			if(self.newFeed.url == '' || self.newFeed.url  == undefined){
				self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the highlited fields' });
				$timeout(function () {
					self.alertMessagaes =[];
				}, 2000);
				flag = false; 
			}
		}


		else if(wizardName == 'schedule'){

			if(self.newFeed.confidenceScore=='' || self.newFeed.confidenceScore  == undefined || self.newFeed.delimiter=='' || self.newFeed.delimiter  == undefined ||self.newFeed.cvsValue == '' || self.newFeed.cvsValue  == undefined){

				

				self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the highlited fields' });
				$timeout(function () {
					self.alertMessagaes =[];
				}, 2000);
				flag = false; 
			}
		}


		return flag;
	}

	self.getAllUsers();
	self.getScheduledFeeds();

	self.generateText = function(){		
		console.log(self.uploadedFile);
	}

	$(document).ready(function(){
//		new Switchery(document.getElementById('scheduler-status'), { size: 'small' });
	});

	self.historyBack = function(){
		window.history.back();
	}

	
	self.columnDefs = [
		{headerName: "Feed Name",field: "name",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Provider",field: "provider",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Urls",field: "url",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
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
							rowData: self.allScheduledDetails,
							rowSelection: 'single',
							floatingFilter:true,
							rowGroupPanelShow: 'always',
							onSelectionChanged: self.onSelectionChanged,
							onFirstDataRendered(params) {
								params.api.sizeColumnsToFit();
							}
					}

					self.tagsId = [];
					$("#manageFeedContent").empty();
					$("#editButton").hide();
					$("#deleteButton").hide();
					$("#manageFeedContent").css("height",$(window).height()-250+"px");
					if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){
						self.eventGrid.api.deselectAll();
					}
					var eGridDiv =  document.querySelector('#manageFeedContent');
					new agGrid.Grid(eGridDiv, self.eventGrid );
				},250);
			}

	$scope.changeStatus = function(){


	}

	
	self.onSelectionChanged = function() {
		self.tagsId = [];
		$("#editButton").hide();
		$("#deleteButton").hide();
		self.tagsId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.tagsId.length > 0){			
			$("#editButton").show();
			$("#deleteButton").show();
		}
	}

	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{self.eventGrid.api.sizeColumnsToFit();
	    	 $("#manageFeedContent").css("height",$(window).height()-250+"px");}catch(err){}
	    }, 500);
	});
	
	
}]);