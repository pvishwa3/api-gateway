app.controller("retentionPolicyController", ['$scope','retentionPolicyService','$rootScope','$timeout','$routeParams','$http', function ($scope, retentionPolicyService,$rootScope,$timeout,$routeParams,$http) {
	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');


	$scope.storageDetails = [];

	self.init = function(){
		self.loadExistingData();
	}

	self.saveDetails = function(){
		retentionPolicyService.saveDetails($scope.storageDetails).then(function(response){

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "Successfully Applied the Configuration"});
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: "Unable to apply the Configuration"});
			}
		},function(error){
			self.alertMessagaes.push({ type: 'danger', msg: response.data.msg});
			$timeout(function(){
				ctrl.alertMessagaes.pop();
			},3000);
		});
	}

	self.loadExistingData = function(){
		retentionPolicyService.loadPolicies().then(function(response){

			if(response.data.length!=0){
				var data = JSON.parse(response.data.policyObject);
				$scope.storageDetails = data;
			}else{
				$scope.storageDetails.push({storageName:"Raw/Messages",hotStorage:0,warmStorage:0,coldStorage:0,renention:0})
				$scope.storageDetails.push({storageName:"Events/Alerts/Rules/Cases",hotStorage:0,warmStorage:0,coldStorage:0,renention:0})
			}
		},function(error){
			ctrl.alertMessagaes.push({ type: 'danger', msg: response.data.msg});
			$timeout(function(){
				ctrl.alertMessagaes.pop();
			},3000);
		});
	}




}]);