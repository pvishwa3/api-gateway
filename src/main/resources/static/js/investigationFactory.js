app.factory('investigstionFactory', ['$http','$window', function($http,$window) {
	//var baseUrl = "http://cms.obelus.us:8555/api/";
	var baseUrl = "/siem-core/user/investigation";

	return {
		getNetworkAnalysisMessages : function(data){			
			return $http.post(baseUrl+"analyzers/analysis/networkAnalyzeMessages/"+data.id+"/"+data.userName);
		},
		analyzeIOCByIndicator : function(data) {
			return $http.post(baseUrl+"analyzers/analysis/analyzeIOCByIndicator", data);
		},
		anlayzeArtifacts : function(data) {
			return $http.post(baseUrl+"analyzers/analysis/networkAnalyzeArtifacts", data);
		},
		saveInvestigation: function(data) {
			return $http.post(baseUrl+"analyzers/analysis/saveInvestigation", data);
		},
		getInvestigationByName : function(id) {
			return $http.get(baseUrl+"/workbench/"+id);
		}
	}
	
	
}]);
