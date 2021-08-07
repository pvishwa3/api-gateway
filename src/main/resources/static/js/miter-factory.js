app.factory('miterFactory', ['$http', function($http) {
	

	return {
		getAllTactics : function(){
			return $http.get("/siem-core/user/miter/");
		},
		saveTactics : function(data){
			return $http.post("/siem-core/user/miter/saveOrUpdate",data);
		},
		deleteTactics:function(id){
			return $http.delete("/siem-core/user/miter/delete/"+id);
		},
		addTechnique : function(data){
			return $http.post("/siem-core/user/miter/add-techniques",data);
		},
		deleteTechniques : function(id,data){
			return $http.delete("/siem-core/user/miter/delete-techniques/"+id+"?name="+data);
		},
		getAllTechniques : function(){
			return $http.get("/siem-core/user/miter/load-all-techniques");
		},
		deleteTechnique : function(id){
			return $http.delete("/siem-core/user/miter/delete-technique/"+id)
		}
		
	}
}]);