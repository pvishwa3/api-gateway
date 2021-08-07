app.controller("UEBACoalescingController", ['$scope', 'UEBACoalescingFactory','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','eventService','fileUpload','activeDirectoryService', function ($scope, UEBACoalescingFactory , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,eventService,fileUpload,activeDirectoryService) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');

	$scope.alertErrors = [];


	$scope.searchFilters = {baseDN:'',searchFilter:''}
	
	$scope.attributes = [];

	
	$scope.displayAttributes = {};
	
	$scope.searchAttributes = function(){
		activeDirectoryService.loadAttributes($scope.searchFilters).then(function (response) {
			
			var data = response.data;
			
			for(var i=0;i<data.length;i++){
				$scope.attributes.push({name:data[i],isChecked:false});
			}
			
			//$scope.attributes = response.data;

		}, function (error) {
			if(error.status== 403){
				$scope.alertErrors.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					$scope.alertErrors = [];
				}, 2000);

			}else{
				$scope.alertErrors.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					$scope.alertErrors = [];
				}, 2000);

			}

		});
	}
	


	$scope.coalescingDetails = {id:0,userCoalsecongAttributes:'',displayAttributes:'',baseDN:'',searchFilter:''}


	$scope.loadDetails = function(){
		UEBACoalescingFactory.getUEBACoalescingConfig().then(function (response) {
			//$scope.coalescingDetails = response.data;
			$scope.searchFilters.baseDN = response.data.baseDN
			$scope.searchFilters.searchFilter = response.data.searchFilter
			
			$scope.attributes = JSON.parse(response.data.userCoalsecongAttributes)
			$scope.displayAttributes = JSON.parse(response.data.displayAttributes)
		}, function (error) {
			if(error.status== 403){
				$scope.alertErrors.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					$scope.alertErrors = [];
				}, 2000);

			}else{
				$scope.alertErrors.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					$scope.alertErrors = [];
				}, 2000);

			}

		});
	}
	
	$scope.loadDetails();

	$scope.saveDetails = function(){
		
		var tempData = [];
		
		
		
		$scope.coalescingDetails.userCoalsecongAttributes = JSON.stringify($scope.attributes) 
		$scope.coalescingDetails.displayAttributes = JSON.stringify($scope.displayAttributes) 
		$scope.coalescingDetails.baseDN = $scope.searchFilters.baseDN
		$scope.coalescingDetails.searchFilter = $scope.searchFilters.searchFilter
		
		UEBACoalescingFactory.save($scope.coalescingDetails).then(function (response) {
			if(response.data.status){
				$scope.alertErrors.push({ type: 'success', msg: 'Successfully saved the configurations' });
			}

		}, function (error) {
			if(error.status== 403){
				$scope.alertErrors.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					$scope.alertErrors = [];
				}, 2000);

			}else{
				$scope.alertErrors.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					$scope.alertErrors = [];
				}, 2000);

			}

		});
	}
	
	



}]);
