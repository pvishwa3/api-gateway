app.factory('cortexJobsFactory', ['$http', function($http) {
//	var baseUrl = "/api/cortex";
	var baseUrl = "http://cms.obelus.us:8555/api/analyzers/analysis";
//	var baseUrl = "http://192.168.2.17:8555/api/analyzers/analysis";
	return {
		startAnalysis : function(data){
			return $http.post(baseUrl + "/startAnalysis", data);
		},
		getAllJobs : function(){
			return $http.get(baseUrl + "/getAllJobs");
		},
		getAllAnalysis : function(){
			return $http.get(baseUrl + "/getAllAnalysis");
		},
		getJobsByQuery : function(){
			return $http.post(baseUrl + "/getJobsByQuery");
		},
		getJobReportById : function(id){
			return $http.post(baseUrl + "/getJobReportById", id);
		},
		deleteJobById : function(id){
			return $http.post(baseUrl + "/deleteJobById", id);
		},
		deleteAnalysisById : function(id){
			return $http.post(baseUrl + "/deleteAnalysisById", id);
		},
		getEnabledAnalyzers: function() {
			return $http.get(baseUrl + "/getEnabledAnalyzers");
		},
		getScore: function(data) {
			return $http.post(baseUrl + "/getScore", data);
		},updateAnalysisIds : function(id){
			return $http.post(baseUrl+"/updateAnalysisIds/"+id)
		},getAnalysisIds : function(data){
			return $http.post(baseUrl+"/getAnalysisByIds",data)
		}
	}
}]);