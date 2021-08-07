app.controller("activeDirectoryController", ['$scope', 'activeDirectoryService','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', function ($scope, activeDirectoryService , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	self.activeDirectoryDetails =  {id:"",connectionName:"",hostName:"",password:"",sslEnabled:"",port:0,userName:""};
	self.alertMessagaes =[];

	self.conditionCategories = [];

	

	
	self.loadActiveDirectoryDetails = function(){
		activeDirectoryService.loadActiveDirectoryDetails().then(function(response){
			
			self.activeDirectoryDetails =  {id:"",connectionName:"",hostName:"",password:"",sslEnabled:"",port:0,userName:""};
			
			if(response.data.length>0){
				self.activeDirectoryDetails = angular.copy(response.data[0]);
			}
			//self.activeDirectoryDetails = angular.copy (response.data);
			//self.tagDetails.forEach(e => e.checked = false);
		});
	}

	self.init = function(){
		self.loadActiveDirectoryDetails();
	}

	self.conditionMessagesModal = [];
	
	self.testADConnection = function(){
		activeDirectoryService.testADConnection(self.activeDirectoryDetails).then(function (response) {
			if(response.data.status){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Active Directory   was Created Successfully' });
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					
				},2000);

				
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
				$("#createNewTag").modal('hide');
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				$("#createNewTag").modal('hide');
			}

		});
	}
	
	

	self.saveActiveDirectoryDetails = function(){

		activeDirectoryService.saveActiveDirectoryDetails(self.activeDirectoryDetails).then(function (response) {
			if(response.status === 201){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Active Directory   was Created Successfully' });
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					
				},2000);

				self.loadAllTags();
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
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);
				
			}else{
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);
				
			}

		});
	}
	

	





	
	
	
	self.deleteActiveDirectory = function(id,name){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+name+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						//loader("body");
						activeDirectoryService.deleteActiveDirectoryDetails(id).then(function (response) {
							if(response.status===200){
								self.alertMessagaes.push({ type: 'success', msg: 'Tag was deleted successfully' });
								//toastr.success("Condition was deleted successfully")

								self.init();


								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							
							

						}, function (error) {
							//unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}else{
								self.alertMessagaes.push({ type: 'danger', msg: error.data.error });
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

	
	
	self.goBack = function(){
		window.history.back();
	}

	
	
}]);
