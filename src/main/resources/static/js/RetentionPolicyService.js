app.factory('retentionPolicyService', ['$http', function($http) {
	
	var baseUrl = "/siem-core/user/ilm";

	return {
		loadPolicies : function(){
			return $http.get(baseUrl+"/");
		},
		saveDetails : function(data){
			return $http.post(baseUrl+"/save",data);
		}
		

	}
}]);