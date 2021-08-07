app.controller("threatinteligenceFeedController", ['$scope','$rootScope','$timeout','$uibModal','threatinteligenceFeedfactory','$sessionStorage',function ($scope,$rootScope, $timeout,$uibModal,threatinteligenceFeedfactory,$sessionStorage) {
	var self = this;
	self.alertMessagaes =[];
	$scope.templateUrl = "savedFeed.html";
	threatinteligenceFeedfactory.getAllFeeds($sessionStorage.user.userName).then(function (response){
		self.feedDataStats = response.data.feedMasterDetails;
		self.totalIndicators = response.data.totalFeedCount;
		self.totalFeed = response.data.feedMasterDetails.length
	},function(error){

	});
	
	self.formData = {id:'',feedStatus:''}; 
	
	self.submitData = function(id,feedStatus, feedName){
		self.formData.id = id;
		self.formData.feedStatus = feedStatus;
		self.formData.feedName = feedName;
		
		
		threatinteligenceFeedfactory.saveFeeds(self.formData,$sessionStorage.user.userName).then(function (response){
			self.feedDataStats = response.data.feedMasterDetails;
			self.alertMessagaes.push({ type: 'alert-success', msg: 'Feed List Modified' });
	 	    $timeout(function () {
				self.alertMessagaes.splice(0, 1);
			}, 2000);
		},function(error){
			self.alertMessagaes.push({ type: 'alert-danger', msg: 'Error modifying Feed List' });
	    	   $timeout(function () {
				self.alertMessagaes.splice(0, 1);
			}, 2000);
		});
	} 
	
	self.syncnow = function(){
		alert("Sync was successfully");
	}
}]);