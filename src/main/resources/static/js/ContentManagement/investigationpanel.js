app.controller("investigationPanelController", ['$scope', 'investigationPanelFactory','$rootScope','$timeout','$uibModal','conditionFactory','conditionCategoryFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder' ,'conditionTypeFactory','$ngConfirm',function ($scope, investigationPanelFactory,$rootScope, $timeout,$uibModal,conditionFactory,conditionCategoryFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,conditionTypeFactory,$ngConfirm,$routeParams) {

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

	self.panel = {id:0,panelName:"",panelLogType:"",status:"active",logFields:[],panelDescription:"",filterQuery:""};


	self.elasticsearchFields = [];

	self.alertMessagaes =[];

	$scope.canCreatePanel = false;
	$scope.canViewPanel = false;
	$scope.canUpdatePanel = false;
	$scope.canDeletePanel = false;




	self.loadPermissions = function(){

		loader("body");

		conditionFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("add investigation panel")!=-1){
				$scope.canCreatePanel = true;
			}

			if(response.data.indexOf("update investigation panel")!=-1){
				$scope.canUpdatePanel = true;
			}
			if(response.data.indexOf("delete investigation panel")!=-1){
				$scope.canDeletePanel = true;
			}
			if(response.data.indexOf("view investigation panel")!=-1){
				$scope.canViewPanel = true;
			}

			unloader("body");


		},function(error){
			unloader("body");
		});
	}

	self.operationType = "";

	self.saveCategory = function(value){
		loader("body");
		self.category.categoryType = "Event";
		self.category.operationType = "insert";
		self.category.categoryName = value;
		conditionCategoryFactory.saveConditionCategroy(self.category).then(function (response) {
			unloader("body");
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Condition was created successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
				self.loadConditionCategoryDetails();
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
				}

				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to create Category. Category Name should be unique.' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}




	self.conditionType=[];
	self.loadPermissions();
	self.elasticsearchFields = [];
	self.loadPanelDetails = function(){
		investigationPanelFactory.getInvestigationPanelDetails().then(function (response){
			self.panelDetails = response.data;
		},function(error){
			unloader("body");
		});
	}

	self.loadFields = function(){
		conditionFactory.getAllFieldsForIndex('compaylogofmlrzgmvgamzofwqsrh').then(function(response){
			self.logTypes = response.data.logTypes;
			self.logFields = response.data.elasticsearchFields;
		});
	}
	self.getGetFileds = function(index){
		getFieldsBasedOnLogType(self.lookupdetails[index].logType)
	}

	self.openCreatePanel = function(){
		$("#createPanel").modal();
		self.panel = {};
		self.elasticsearchFields = [];
		$timeout(function(){
			$("input.ui-select-search.input-xs.ng-pristine.ng-untouched.ng-valid.ng-empty").css("width","240px")
		},250);
	}



	self.init = function(){
		self.loadPanelDetails();
		self.loadFields();
		self.loadPermissions();
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


	function getFieldsBasedOnLogType(logType){
		conditionFactory.getFieldsBasedOnLogType(logType).then(function (response){
			self.elasticsearchFields = response.data.elasticsearchFields;
		},function(data){

		});
	}


	self.submitData = function(){
		var tempArray = [];
		var tempFields = self.elasticsearchFields.join(',');

		self.panel.logFields = tempFields;
		loader("body");
		investigationPanelFactory.savePanel(self.panel).then(function (response) {
			if(response.data.status){
				unloader("body");
				self.alertMessagaes.push({ type: 'success', msg: self.panel.panelName+' was created successfully' });
				self.loadPanelDetails();
				$("#createPanel").modal('hide');
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


	self.editPanel = function(id){
		for(var i = 0; i < self.panelDetails.length; i++){
			if(self.panelDetails[i].id === id) {
				self.panel = angular.copy(self.panelDetails[i]);
				var tempFields = self.panelDetails[i].logFields.split(",");
				self.elasticsearchFields = tempFields
				
				$("#createPanel").modal();
				break;
			}
		}
		self.buttonName="Update";
	}
	
	self.changeStatus = function(id,status){
		loader("body");
		
		self.panel.id = id;
		self.panel.status = status;
		
		investigationPanelFactory.changeStatus(self.panel).then(function (response){
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: self.panel.panelName+' was updated successfully' });
				self.loadPanelDetails();
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: self.panel.panelName+' was unable to update ' });
			}
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			unloader("body");
		},function(error){
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}



	self.deletePanel = function(id,name){


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
						investigationPanelFactory.deletePanel(id).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Pannel was deleted successfully' });
								//toastr.success("Condition was deleted successfully")
								self.loadPanelDetails();
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



