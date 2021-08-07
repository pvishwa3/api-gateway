app.factory('activeDirectoryService', ['$http', function($http) {
	var baseUrl = "/siem-core/user/activedirectory";

	return {
		loadActiveDirectoryDetails : function(){
			return $http.get(baseUrl+"/");
		},
		
		testADConnection : function(dataForm){
			return $http.post(baseUrl+"/test-connection",dataForm)
		},
		saveActiveDirectoryDetails : function(dataForm){
			return $http.post(baseUrl+"/save",dataForm)
		},
		deleteActiveDirectoryDetails : function(id){
			return $http.delete(baseUrl+"/delete/"+id)
		},
		loadAttributes:function(data){
			return $http.post(baseUrl+"/get-attributes",data)
		}
		
		
		
		
		
		

		
	}
}]);