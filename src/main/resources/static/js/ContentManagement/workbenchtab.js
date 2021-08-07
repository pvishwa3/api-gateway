app.controller("workBenchTabController", ['$scope', 'investigationPanelFactory','$rootScope','$timeout','$uibModal','conditionFactory','conditionCategoryFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder' ,'conditionTypeFactory','$ngConfirm','caseFactory',function ($scope, investigationPanelFactory,$rootScope, $timeout,$uibModal,conditionFactory,conditionCategoryFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,conditionTypeFactory,$ngConfirm,caseFactory) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	$scope.rule = {};

	self.elasticseachFields = [];

	self.lookupdetails = [];


	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withFixedHeader({

	}).withOption('order', [1, 'asc'])
	.withOption('lengthMenu', [25,50, 100, 150, 200]);

	self.workBenchTab = {id:0,tabName:"",panels:""};


	self.panels = [];

	self.alertMessagaes =[];

	$scope.canCreateWorkbenchTab = false;
	$scope.canViewWorkbenchTab = false;
	$scope.canUpdateWorkbenchTab = false;
	$scope.canDeleteWorkbenchtab = false;




	self.loadPermissions = function(){

		loader("body");

		conditionFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("add work bench tab")!=-1){
				$scope.canCreateWorkbenchTab = true;
			}

			if(response.data.indexOf("update work bench tab")!=-1){
				$scope.canViewWorkbenchTab = true;
			}
			if(response.data.indexOf("view work bench tab")!=-1){
				$scope.canUpdateWorkbenchTab = true;
			}
			if(response.data.indexOf("delete work bench tab")!=-1){
				$scope.canDeleteWorkbenchtab = true;
			}

			unloader("body");


		},function(error){
			unloader("body");
		});
	}

	self.operationType = "";

	self.loadPanelDetails = function(){
		investigationPanelFactory.getInvestigationPanelDetails().then(function (response){
			
			self.panelDetails = [];
			
			for(var i=0;i<response.data.length;i++){
				self.panelDetails.push(response.data[i].panelName);
			}
			
			 
		},function(error){
			unloader("body");
		});
	}
	
	self.loadWorkbenchTabs = function(){
		investigationPanelFactory.getWorkBenchTabs().then(function (response){
			self.workBenchTabDetails = response.data;
		},function(error){
			unloader("body");
		});
	}

	

	self.openCreateWorkbenchTab = function(){
		self.workBenchTab = {id:0,tabName:"",panels:""};
		self.panels = [];
		$timeout(function(){
			$("input.ui-select-search.input-xs.ng-pristine.ng-untouched.ng-valid.ng-empty").css("width","245px")			
		},250);
		$("#createWorkBenchTab").modal();
	}



	self.init = function(){
		self.loadPermissions();
		self.loadPanelDetails();
		self.loadWorkbenchTabs();
		self.loadAllCases();
	}







	self.cloneConditionDetails = function(id){
		for(var i = 0; i < self.conditionDetails.length; i++){
			if(self.conditionDetails[i].id === id) {
				self.condition = angular.copy(self.conditionDetails[i]);
				$scope.showCreateEventButton = false;
				$scope.showUpdateEventButton = true;
				$scope.showHomeButton = false;

				//    self.elasticseachFields = self.condition.lookupTablesFields.split(",");
				self.lookupdetails = [];
				self.reportingFields = [];
				self.condition.filterQuery = self.conditionDetails[i].filterQuery;
				if(!self.conditionDetails[i].displayFilter){
					self.condition.displayFilter = self.conditionDetails[i].filterQuery;
				}else{
					self.condition.displayFilter = self.conditionDetails[i].displayFilter;
				}


				angular.forEach(self.condition.fields, function(value, key) {
					self.lookupdetails.push({elasticseachFields:value.elasticseachFields,displayName:value.displayName,logType:value.logType});
				});

				angular.forEach(self.condition.reportingFields, function(value, key) {
					console.log(key + ': ' + value);

					self.reportingFields.push({elasticseachFields:value.elasticseachFields,displayName:value.displayName,logType:value.logType});
				});
				if(self.conditionDetails[i].conditionActualQuery!='NA'){
					$scope.filter = JSON.parse(self.conditionDetails[i].conditionActualQuery);
				}
				self.condition.id = '';
				var temp = self.condition.conditionName;
				if(temp.startsWith('Clone_')){
					self.condition.conditionName = angular.copy("Clone "+(parseInt(temp.split(" ")[1])+1)+" "+temp.replace('Clone '+parseInt(temp.split(" ")[1])+' ',''));
				}else{
					self.condition.conditionName = angular.copy("Clone 1 "+temp);
				}


				$scope.templateUrl = "createCategory.html";
				self.condition.operationType =  "insert";
				self.loadConditionCategoryDetails();

				break;
			}
		}
		self.buttonName="Save";
	}

	self.clone = function(){
		self.reportingFields = angular.copy(self.lookupdetails);
	}



	self.openConditionForm = function(){
		$("#createCondition").modal();
		self.category = {categoryName:''};
		self.conditionMessages = [];
	}

	self.openConditionType = function(){
		$("#conditionType").modal();
	}
	self.allCases = [];
	
	self.loadAllCases = function(){
		caseFactory.getAllCases().then(function(response){
			if(response.data.status){			
				self.allCases =angular.copy(response.data.resultData);
				
			}
		},function(error){
			
		});
	}
	
	
	


	

	self.submitData = function(){
		var tempArray = [];
		var tempFields = self.panels.join(',');

		self.workBenchTab.panels = tempFields;
		loader("body");
		investigationPanelFactory.saveWorkBenchTabs(self.workBenchTab).then(function (response) {
			if(response.data.status){
				unloader("body");
				self.alertMessagaes.push({ type: 'success', msg: ' Workbench was created successfully' });
				self.loadWorkbenchTabs();
				$("#createWorkBenchTab").modal('hide');
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else{
				unloader("body");
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });

				}
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}



		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}


		});
	}


	self.editWorkBenchTab = function(id){
		for(var i = 0; i < self.workBenchTabDetails.length; i++){
			if(self.workBenchTabDetails[i].id === id) {
				self.workBenchTab = angular.copy(self.workBenchTabDetails[i]);
				var tempFields = self.workBenchTabDetails[i].panels;
				self.panels = tempFields
				
				$("#createWorkBenchTab").modal();
				break;
			}
		}
		self.buttonName="Update";
	}
	
	



	self.deleteWorkBenchTab = function(id,name){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+name+'</b> panel ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						investigationPanelFactory.deleteWorkBenchTab(id).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Work bench was deleted successfully' });
								//toastr.success("Condition was deleted successfully")
								self.loadWorkbenchTabs();
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							if(!response.data.status){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.message });
								//toastr.success("Condition was deleted successfully")

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							unloader("body");

						}, function (error) {
							unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}

							$timeout(function () {
								self.alertMessagaes.splice(0, 1);
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








}]);



