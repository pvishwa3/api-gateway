app.factory('riskFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/users/risk";

	return {
		getRiskConfig : function(){
			return $http.get(baseUrl+"/");
		},
        getRiskFactors : function(){
			return $http.get(baseUrl+"/risk-factor");
		},
		save : function(dataForm){
			return $http.post(baseUrl+"/save",dataForm)
		},
		saveACLConfig:function(dataForm){
		    return $http.post("/siem-core/user/reference-set/save-acls",dataForm)
		},
		loadACLS:function(){
		     return $http.get("/siem-core/user/reference-set/get-acls")
		},
		deleteACL:function(id){
		    return $http.delete("/siem-core/user/reference-set/delete-acls/"+id)
		}










	}
}]);