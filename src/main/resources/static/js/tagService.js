app.factory('tagService', ['$http',function($http) {
	var baseUrl = "/siem-core/user/tags";
	return {
		getTags:function(){
			return $http.get(baseUrl+ "/");
		},
		saveTags : function(data){
			return $http.post(baseUrl+ "/create", data);
		},
		deleteTags : function(id){
			return $http.delete(baseUrl+ "/"+id);
		},
		deleteMultipleTags : function(data){
			return $http.post(baseUrl+ "/deleteMultipleTagsById",data);
		}
		
	}
}]);