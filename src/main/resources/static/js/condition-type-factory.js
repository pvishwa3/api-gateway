app.factory('conditionTypeFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/user/condition-type";

	return {
		getAllTypes : function(){
			return $http.get(baseUrl+"/");
		},
		saveConditionType : function(dataForm){
			return $http.post(baseUrl+"/save",dataForm)
		},
		deleteByID : function(id){
			return $http.delete(baseUrl+"/delete-condition-Type/"+id)
		}
		
	}
}]);