app.controller("homeController", [ '$scope', 'userSettingsFactory','$window',function($scope, userSettingsFactory,$window) {
var self = this;
	userSettingsFactory.getSavedSettings().then(function(response) {
		try{			
			self.response= angular.copy(response.data.resultData.homePage);
		}catch(err){
			if(response.data.resultData == undefined || response.data.resultData.homePage == undefined || response.data.resultData == null){
				self.homePage = "templates/Dashboard_new.html";
				$window.localStorage.setItem("dashboardId","9047");
			}
		}
		if(self.response.indexOf("?") != -1){
			self.homePage = self.response.split("?")[0];
			$window.localStorage.setItem("dashboardId",self.response.split("?")[1]);
//			self.homePageDashboardId = ;
		}else{
			self.homePage = self.response;
		}
	});

}]);