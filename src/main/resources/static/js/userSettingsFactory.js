app.factory('userSettingsFactory', ['$http',function($http) {
	var baseUrl = "/siem-core/user/settings";
	return {
		saveSettings : function(data){
			return $http.post(baseUrl+ "/saveSettings", data);
		},
		getSavedSettings : function(){
			return $http.get(baseUrl+ "/getSavedSettings");
		},
		getUserDetails : function(){
		    return $http.get("/siem-core/user/get-logined-user-details");
		}

	}
}]);