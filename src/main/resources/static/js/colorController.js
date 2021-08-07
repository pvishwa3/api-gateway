app.controller("colorController", ['$scope','colorFactory','$rootScope', function ($scope, colorFactory,$rootScope) {

	var self = this;
	$scope.timeframe = "1d";
	$scope.logstatstimeframe = "30d";
	$scope.alerttimeframe = "4h";
	$scope.useralerttimeframe = "4h";
	$scope.alertDetailsTitle = "";
	$scope.itemsByPage = 10;
	$scope.showModal = false;
	$scope.showHostModal = false;
	$scope.theme = "nightTheme";
	$scope.sourceNamesPerCompTest = ["abc","xyz"];
	
	$scope.fieldType = "Company";
	$scope.fieldName = "";
	$scope.fieldColor = "#428bca";
	$scope.colorModel = {id:'',fieldType:'',fieldName:'',fieldColor:''};
	self.alertMessagaes =[];
	$scope.sortType     = 'fieldName';
	$scope.sortReverse  = false;
	$scope.allColorDetails = [];

	$scope.logStatsColors = ['#ff7f0e', '#2ca02c','#1f77b4', "#FFBD33","#DBFF33","#75FF33","#33FF57","#33FFBD","#1D8348","#5B2C6F","#F1C40F","#2980B9",'#f7eb02',"#FF5733"];

	$scope.loadDefaultTheme("body","html");
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
	
	$scope.getAllColorDetails = function() {
		colorFactory.getAllColorDetails().then(function(response){
			$scope.allColorDetails = response.data;
		});
	}
    
	$scope.saveOrUpdateColorDetails = function(){
		if(!$scope.colorModel.id){
			console.log("calling submitData():::");
			$scope.saveColorDetails();
		}else{
			console.log("calling updateData():::");
			$scope.updateColorDetails();
		}
		
	}
	
    $scope.saveColorDetails = function(){
    	console.log("Saving color details");
    	$scope.colorModel.fieldType = $scope.fieldType;
    	$scope.colorModel.fieldName = $scope.fieldName;
    	$scope.colorModel.fieldColor = $scope.fieldColor;
    	colorFactory.saveColor($scope.colorModel).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Color Details created successfully' });
				/*$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);*/
			}else{
				self.alertMessagaes.push({ type: 'success', msg: 'Unable to assign color for field'});
				/*$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);*/
				
			}	
			$scope.getAllColorDetails();
		}, function (error) {
			console.log("at error::: ");
			$scope.status = 'Unable to load customer data: ' + error.message;
			self.alertMessagaes.push({ type: 'success', msg: 'Unable to assign color for field' });
		});
    } 
    
    $scope.updateColorDetails = function(){
    	console.log("Saving color details");
    	$scope.colorModel.fieldType = $scope.fieldType;
    	$scope.colorModel.fieldName = $scope.fieldName;
    	$scope.colorModel.fieldColor = $scope.fieldColor;
    	colorFactory.saveColor($scope.colorModel).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Color Details created successfully' });
				/*$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);*/
			}else{
				self.alertMessagaes.push({ type: 'success', msg: 'Unable to assign color for field'});
				/*$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);*/
				
			}	
			$scope.getAllColorDetails();
		}, function (error) {
			console.log("at error::: ");
			$scope.status = 'Unable to load customer data: ' + error.message;
			self.alertMessagaes.push({ type: 'success', msg: 'Unable to assign color for field' });
		});
    }
    
    $scope.editColor = function(colorId){
    	$scope.colorModel=[];
		for(var i = 0; i < $scope.allColorDetails.length; i++){
			if($scope.allColorDetails[i].id === colorId) {
				$scope.colorModel = angular.copy($scope.allColorDetails[i]);
				$scope.fieldType = $scope.colorModel.fieldType;
				$scope.fieldName = $scope.colorModel.fieldName;
				$scope.fieldColor = $scope.colorModel.fieldColor;
				break;
			}
		}
	};

	$scope.deleteColor = function(colorId){
		swal({
			  title: 'Are you sure?',
			  text: "You won't be able to revert this!",
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, delete it!'
			}).then(function () {
				colorFactory.deleteColor(colorId).then(function (response) {
					if(response.data.status){
						self.alertMessagaes.push({ type: 'success', msg: 'Color Details deleted successfully' });
						swal(
							    'Deleted!',
							    'Color Details has been deleted.',
								'success'
								)
						$timeout(function () {
							self.alertMessagaes.splice(0, 1);
						}, 2000);
					}
				}, function (error) {
					$scope.status = 'Unable to load customer data: ' + error.message;
				});
			})
		}
}]);