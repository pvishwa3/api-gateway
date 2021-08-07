app.factory('conditionCategoryFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/user/condition-category";

	return {
		getConditionCategories : function(){
			return $http.get(baseUrl+"/");
		},
		saveConditionCategroy : function(dataForm){
			return $http.post(baseUrl+"/save",dataForm)
		},
		deleteConditionCategroy : function(id){
			return $http.delete(baseUrl+"/delete-condition-category/"+id)
		},
		loadPermissions:function(){
			return $http.get("/siem-core/user/loadPermissions")
		},
		getConditionSubCategories : function(){
			return $http.get("/siem-core/user/condition/get-event-subcategory")
		},
		saveConditionCategory: function(dataForm){
			return $http.post("/siem-core/user/condition/save-event-subcategory/",dataForm)
		},
		deleteConditionSubCategory : function(id){
			return $http.delete("/siem-core/user/condition/delete-event-subcategory/"+id)
		}
	}
}]);