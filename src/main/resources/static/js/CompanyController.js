app.controller("companyController", ['$scope', 'companyFactory','$rootScope','$timeout','$uibModal','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$ngConfirm','toastr', function ($scope, companyFactory,$rootScope, $timeout,$uibModal,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder, $ngConfirm,toastr) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	self.organization =  {id:0,organizationName:"",operationType:""};
	self.alertMessagaes =[];

	self.conditionCategories = [];

	$scope.canCreateConditionCategory = false;
	$scope.canUpdateConditionCategory = false;
	$scope.canDeleteconditionCategory = false;

	self.loadPermissions = function(){
		conditionCategoryFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("add category")!=-1){
				$scope.canCreateConditionCategory = true;
			}

			if(response.data.indexOf("update category")!=-1){
				$scope.canUpdateConditionCategory = true;
			}
			if(response.data.indexOf("delete category")!=-1){
				$scope.canDeleteconditionCategory = true;
			}


		},function(error){

		});
	}

	$scope.templateUrl = "viewOrganizations.html";


	self.loadCompanyDetails = function(){
		companyFactory.getCompanyDetails().then(function (response){
			self.companyDetails = response.data;
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.loadCompanyDetails();

	//self.loadPermissions();

	self.openCreateCompany = function(){
		self.organization =  {id:0,organizationName:"",operationType:""};
		$("#createOrganization").modal();
	}

	self.submitData = function(){
		conditionCategoryFactory.saveConditionCategroy(self.condition).then(function (response) {

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Condition was created successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);

				self.loadConditionCategory();
				$scope.templateUrl = "viewCategoryConditions.html";
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
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});


	}

	
	self.editConditionCategory = function(categoryId){


		for(var i = 0; i < self.conditionCategories.length; i++){
			if(self.conditionCategories[i].categoryId === categoryId) {
				self.condition = angular.copy(self.conditionCategories[i]);
				self.condition.operationType = 'update'
					$scope.templateUrl = "createCategoryConditions.html"
						break;
			}
		}
		
	}

	self.deleteConditionCategory = function(categoryId){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+categoryId+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						conditionCategoryFactory.deleteConditionCategroy(categoryId).then(function (response) {
							if(response.data.status){
								for(var i = 0; i < self.conditionCategories.length; i++){
									if(self.conditionCategories[i].categoryId === categoryId) {
										self.conditionCategories.splice(0, i);
									}
								}

								self.alertMessagaes.push({ type: 'success', msg: 'Condition Category was deleted successfully' });
								$timeout(function () {
									self.alertMessagaes.splice(0, 1);
								}, 2000);
								self.loadConditionCategory();

							}else{

								self.alertMessagaes.push({ type: 'danger', msg: 'unable to delete the  Category' });
								$timeout(function () {
									self.alertMessagaes.splice(0, 1);
								}, 2000);
							}
						}, function (error) {
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});


	}


	$scope.vm = {};
	$scope.vm.dtInstance = {};
	$scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions()
	.withDOM('frt<"#lengthChanging"l>ip');

	self.showExportOptions = function(showButtons){
		if(showButtons === false){
			$scope.vm.dtOptions 
			.withDOM('Bfrt<"#lengthChanging"l>ip')
			.withOption('searching', true)
			.withOption('info', true)
			.withOption('paging', true)
			.withButtons([{
				extend: 'pdf',
				text: '<i class="icon-file-pdf"></i> PDF',
				titleAttr: 'PDF',
				exportOptions: {
					columns: [0, 1]
				}
			}, {
				extend :'csv',
				text :'<i class="icon-file-excel"></i> CSV',
				titleAttr :'CSV',
				exportOptions : {
					columns : [0, 1 ]
				}
			}
			]);
			self.showButtons = true;
		}else if(showButtons === true){
			$scope.vm.dtOptions.withDOM('frt<"#lengthChanging"l>ip');
			self.showButtons = false;
		}
	}
}]);
