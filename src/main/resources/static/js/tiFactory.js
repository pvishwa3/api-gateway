app.factory("tiFactory",['$http',function($http){
	
	var baseUrl = "http://cms.obelus.us:8666/api/user/fieldMapping";
	
//	var baseUrl = "http://localhost:8666/api/user/fieldMapping";
	
	return {
		save : function(data){
			return $http.post(baseUrl+"/save",data);
		},
		getAllFieldsForIndex : function(data){
			return $http.get("/siem-core/user/elasticsearch/getallfiledsforindex/");
		},
		get: function() {
			return $http.get(baseUrl+"/get");
		}
	}
	
}]);