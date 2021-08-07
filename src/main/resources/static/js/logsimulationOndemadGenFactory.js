app.factory('logsimulationOndemadGenFactory', ['$http', function($http) {
//	var baseUrl = "http://localhost:8111/api/logsimulation";
	var baseUrl = "http://cms.obelus.us:8111/api/logsimulation";
	return {
		ondemandGeneration : function(data) {
			console.log(data);
			return $http.post(baseUrl+"/ondemandLogSimulation",data);
		}
	}
}]);