app.factory('sourceManagementFactory', ['$http',function($http) {
	var baseUrl = "/user/sourceManagement";
	return {
		saveLogTypes : function(data) {
			return $http.post(baseUrl + "/saveLogTypes", data);
		},
		getAllSavedSources : function(){
			return $http.get(baseUrl + "/getAllSources");
		},
		delteLogType : function(id){
			return $http.get(baseUrl + "/delteLogType/"+id);
		}
	}
}]);