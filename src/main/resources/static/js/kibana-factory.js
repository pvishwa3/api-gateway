app.factory('kibanaFactory', ['$http', function($http) {
	var baseUrl = "/user";

	return {
		getToken : function(){
			return $http.get(baseUrl+"/get-token");
		}
		
	}
}]);