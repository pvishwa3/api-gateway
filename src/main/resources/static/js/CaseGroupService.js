app.factory('caseGroupService', ['$http',function($http) {
	var baseUrl = "/siem-core/user/cases";
	return {
		getAllCaseGroups:function(){
			return $http.get(baseUrl+ "/");
		},
		saveCaseGroups : function(data){
			return $http.post(baseUrl+ "/save", data);
		},
		deleteCasesGroups : function(id){
			return $http.delete(baseUrl+ "/delete/"+id);
		},
		deleteMultipleCaseGroups : function(data){
			return $http.post(baseUrl+ "/deleteMultipleByID",data);
		}
		
	}
}]);