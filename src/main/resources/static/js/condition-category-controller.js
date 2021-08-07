app.controller("conditionCategoryController", ['$scope', 'conditionCategoryFactory','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', function ($scope, conditionCategoryFactory,$rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	self.condition =  {categoryId:"",categoryName:"",operationType:""};
	self.alertMessagaes =[];

	self.conditionCategories = [];

	$scope.canCreateConditionCategory = false;
	$scope.canUpdateConditionCategory = false;
	$scope.canDeleteconditionCategory = false;

	$scope.showHomeButton = true;
	$scope.showCreateEventButton = false;
	$scope.showUpdateEventButton = false;

	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withOption('order', [1, 'asc'])
	.withOption('lengthMenu', [25,50, 100, 150, 200]);

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

	$scope.templateUrl = "viewCategoryConditions.html";
	self.loadConditionCategory = function(){
		conditionCategoryFactory.getConditionCategories().then(function (response){
			self.conditionCategories = response.data;
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.init = function(){
		self.loadConditionCategory();

		self.loadPermissions();
	}

	self.intiSubCategory = function(){
		self.loadConditionSubCategory();

		self.loadPermissions();
	}

	self.openEventSubCategoryTemplate = function(){

		$("#condition-subcategory").modal()
	}

	self.conditionSubCategory = {id:0,name:""}

	self.saveConditionSubCategory = function(){

		conditionCategoryFactory.saveConditionCategory(self.conditionSubCategory).then(function (response) {
			if(response.data.status){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Subcategor  was Created Successfully' });
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					$("#condition-subcategory").modal('hide');
				},3000);

				self.loadConditionSubCategory();
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.conditionMessagesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.conditionMessagesModal.push({ type: 'danger', msg: response.data.data });
				}
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
				}, 2000);
			}


		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				$("#condition-subcategory").modal('hide');
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				$("#condition-subcategory").modal('hide');
			}

		});
	}
	self.editSubConditionCategory = function(id){
		for(var i = 0; i < self.conditionSubCategoryDetails.length; i++){
			if(self.conditionSubCategoryDetails[i].id === id) {
				self.conditionSubCategory = angular.copy(self.conditionSubCategoryDetails[i]);
				break;
			}
		}

		$("#condition-subcategory").modal();
		
	}
	


	self.loadConditionSubCategory = function(){
		conditionCategoryFactory.getConditionSubCategories().then(function (response){
			self.conditionSubCategoryDetails = response.data;
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}


	self.openCreateCategoryPage = function(){
		self.condition =  {categoryId:"",categoryName:"",operationType:"insert"};
		self.buttonName="Save";


		$("#createCategory").modal();

		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;

	}

	self.goBack = function(){
		$scope.templateUrl = "viewCategoryConditions.html";
		toastr.clear();
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;
	}




	/* Controller code */

	/**
	 * The elasticBuilderData object will be modified in place so that you can use
	 * your own $watch, and/or your own saving mechanism
	 */
	$scope.elasticBuilderData = {};
	$scope.elasticBuilderData.query = [];

	/**
	 * This object is the lookup for what fields
	 * are available in your database, as well as definitions of what kind
	 * of data they are
	 */
	$scope.elasticBuilderData.fields = {};



	self.conditionMessagesModal = [];
	self.submitData = function(){
		if(self.condition.categoryName == '' || self.condition.categoryName  == undefined || self.condition.categoryType == '' || self.condition.categoryType  == undefined){

			self.conditionMessagesModal.push({ type: 'danger', msg: 'Please fill the highlighted fields' });
			$timeout(function(){
				self.conditionMessagesModal = [];
			},2000);

		}else{

			conditionCategoryFactory.saveConditionCategroy(self.condition).then(function (response) {
				if(response.data.status){
					self.conditionMessagesModal.push({ type: 'success', msg: 'Category was Created Successfully' });
					$timeout(function () {
						self.conditionMessagesModal.splice(0, 1);
						$("#createCategory").modal('hide');
					},3000);

					self.loadConditionCategory();
				}else{
					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){

							self.conditionMessagesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.conditionMessagesModal.push({ type: 'danger', msg: response.data.data });
					}
					$timeout(function () {
						self.conditionMessagesModal.splice(0, 1);
					}, 2000);
				}


			}, function (error) {
				if(error.status== 403){
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
					$("#createCategory").modal('hide');
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
					$("#createCategory").modal('hide');
				}

			});
		}
	}

	var alertId_edit;
	self.editConditionCategory = function(categoryId){


		for(var i = 0; i < self.conditionCategories.length; i++){
			if(self.conditionCategories[i].categoryId === categoryId) {
				self.condition = angular.copy(self.conditionCategories[i]);
				self.condition.operationType = 'update'
					break;
			}
		}



		$("#createCategory").modal();

		self.buttonName="Save";
	}
	self.cloneCategoryDetails = function(categoryId){
		for(var i = 0; i < self.conditionCategories.length; i++){
			if(self.conditionCategories[i].categoryId === categoryId) {
				self.condition = angular.copy(self.conditionCategories[i]);
				self.condition.operationType = 'Save'
					break;
			}
		}
		$("#createCategory").modal();
		console.log(self.condition);
		delete self.condition.categoryId;
		console.log(self.condition);
		self.buttonName="Save";
	}

	self.deleteConditionSubCategory = function(categoryId,category){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to Delete <b>'+category+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-primary',
					action: function(scope, button){
						
						conditionCategoryFactory.deleteConditionSubCategory(categoryId).then(function (response) {
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
								
								self.loadConditionSubCategory();

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
	
	self.deleteConditionCategory = function(categoryId,category){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to Delete <b>'+category+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-primary',
					action: function(scope, button){
						conditionCategoryFactory.deleteConditionCategroy(categoryId).then(function (response) {
							if(response.data.status){
								

								self.alertMessagaes.push({ type: 'success', msg: 'Sub category was deleted successfully' });
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
	
	self.goBack = function(){
		window.history.back();
	}

}]);
