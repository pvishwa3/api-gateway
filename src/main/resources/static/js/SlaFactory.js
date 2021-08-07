app.factory('slaService', ['$http',function($http) {
	var baseUrl = "/siem-core/user/sla";
	return {
		getSLAPolicies:function(){
			return $http.get(baseUrl+ "/");
		},
		saveSLA : function(data){
			return $http.post(baseUrl+ "/save", data);
		},
		deleteSLA : function(id){
			return $http.delete(baseUrl+ "/delete/"+id);
		},
		deleteMultipleSLAS : function(data){
			return $http.post(baseUrl+ "/deleteMultiple",data);
		}
		
	}
}]);