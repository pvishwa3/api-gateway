app.controller("upgradeController", ['$scope', 'planFactory','$rootScope','$timeout','$location','$uibModal','$sce','$window', '$sessionStorage',function ($scope, planFactory,$rootScope, $timeout,$location,$uibModal,$sce,$window,$sessionStorage) {


	var self = this;
	self.planDetails =[];

	$scope.currentPlan = $sessionStorage.user.currentPlan

	$scope.displayPlanDetails = function(){
		planFactory.getPlanDetails().then(function (response) {
			self.planDetails = response.data;
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	$scope.displayPlanDetails();


	$scope.upgradeAccount = function(planId){

		planFactory.upgradeAccount(planId).then(function (response) {
			if(response.data.status){
				self.planDetails = response.data.planDetails;
				$sessionStorage.user.currentPlan = response.data.currentPlan;
				displaySuccessAlert("Success","Successfully upgraded account");
				location.reload();
			}else{
				displayErrorAlert("Error","Unable to upgrade account please contact admin");
			}


		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	function displaySuccessAlert(message,content){
		$.Notification.notify('success','top right',message, content)
	}
	function displayErrorAlert(message,content){
		$.Notification.notify('error','top right',message, content)
	}

}]);