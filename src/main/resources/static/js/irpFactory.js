app.factory("irpFactory",['$http',function($http){
	
	var baseUrl = "/siem-core/user/irp";
	
	return {
		saveIrp : function(data){
			return $http.post(baseUrl+"/save",data);
		},
		getAllIRPS: function() {
			return $http.get(baseUrl+ "/");
		},
		deleteIRP : function(id) {
			return $http.delete(baseUrl+"/delete/"+id);
		},getIrpDetails : function(id){
			return $http.get(baseUrl+"/getIrpDetails/"+id)
		}
	}
	
}]);