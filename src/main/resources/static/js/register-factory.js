logApp.factory('registerFactory', ['$http', function($http) {
	var baseUrl = "/user";

	return {
		register : function(data){
			return $http.post(baseUrl+"/register",data);
		}
		
	}
}]);