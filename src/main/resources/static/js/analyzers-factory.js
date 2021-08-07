app.factory('analyzersFactory', ['$http', function($http) {
//	var baseUrl = "http://localhost:8555/api/analyzers/analysis";
	var baseUrl = "http://cms.obelus.us:8555/api/analyzers/analysis";
	return {
		saveAnalyzer: function(data){
			return $http.post(baseUrl+ "/saveAnalyzer", data);
		},
		getAllAnalyzers: function() {
			return $http.get(baseUrl+ "/getAllAnalyzers");
		},
		getEnabledAnalyzers: function() {
			return $http.get(baseUrl+ "/getEnabledAnalyzers");
		},
		deleteAnlayzersById: function(id) {
			return $http.delete(baseUrl+ "/deleteAnalyzersById/"+id);
		}
	}
}]);