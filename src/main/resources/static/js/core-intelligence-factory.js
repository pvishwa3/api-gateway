app.factory('coreIntelligenceFactory', ['$http', function($http) {
//	var baseUrl = "http://localhost:8555/api/analyzers/intelligence";
	var baseUrl = "http://cms.obelus.us:8555/api/analyzers/intelligence";
	return {
		saveIntelligence: function(data){
			return $http.post(baseUrl+ "/saveIntelligence", data);
		},
		deleteIntelligence: function(id){
			return $http.delete(baseUrl+ "/deleteIntelligence/" + id);
		},
		getAllIntelligences: function() {
			return $http.get(baseUrl+ "/getAllIntelligences");
		}
	}
}]);