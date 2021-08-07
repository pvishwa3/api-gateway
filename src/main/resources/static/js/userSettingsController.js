app.controller("adminSettingsController",['$scope','$sessionStorage','$timeout','userSettingsFactory',function($scope,$sessionStorage,$timeout,userSettingsFactory){
	
	var self = this;

	
	self.alertMessages = [];
	
	self.dashboards = angular.copy($sessionStorage.user.dashboarDetails);
	self.settings = {};
	self.saveSettings = function(){
		console.log(self.settings);
		userSettingsFactory.saveSettings(self.settings).then(function(response){
			if(response.data.status){
				self.alertMessages.push({"type":"success","msg":"Settings saved successfully"});
				$timeout(function(){
					self.alertMessages = [];
				},3000);
			}else{
				self.alertMessages.push({"type":"danger","msg":"Unable to save the settings"+response.data.error});
				$timeout(function(){
					self.alertMessages = [];
				},3000);
			}
		},function(error){
			self.alertMessages.push({"type":"danger","msg":"Unable to save the settings reason : "+error});
			$timeout(function(){
				self.alertMessages = [];
			},3000);
		});
	}
	
	self.getSavedSettings = function(){
		userSettingsFactory.getSavedSettings().then(function(response){
			self.settings = angular.copy(response.data.resultData);
		});
	}
	self.getSavedSettings();
	
	self.historyBack = function(){
		window.history.back();
	}
	
	
}]);