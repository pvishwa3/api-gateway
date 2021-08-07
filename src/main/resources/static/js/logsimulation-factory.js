app.factory('logsimulationFactory', ['$http', function($http) {
//	192.168.2.20
	//var baseUrl = "http://localhost:8111/api/logsimulation";
	var baseUrl = "http://ec2-34-205-159-10.compute-1.amazonaws.com:8111/api/logsimulation";
	return {
		getSavedSchedulers : function(){
			return $http.get(baseUrl + "/getSavedSchedulers");
		},
		saveSimulation : function(data){
			return $http.post(baseUrl + "/saveSimulation", data);
		},
		ondemandSimulation : function(data){
			return $http.post(baseUrl + "/ondemandSimulation/viswa@technominds.net", data);
		},
		saveNewField : function(data){
			return $http.post(baseUrl + "/saveField/viswa@technominds.net", data);
		},
		saveUserLSSettings : function(data) {
			return $http.post(baseUrl + "/saveUserLSSettings", data);
		},
		scheduleSimulation : function(data) {
			return $http.post(baseUrl + "/scheduleSimulation/viswa@technominds.net", data);
		},
		saveNewEventDetails : function(data) {
			return $http.post(baseUrl + "/saveNewEvent/viswa@technominds.net", data);
		},
		saveNewEventType : function(data) {
			return $http.post(baseUrl + "/saveNewEventType/viswa@technominds.net", data);
		},
		getSavedEventTypes : function() {
			return $http.get(baseUrl + "/getSavedEventTypes");
		},
		deleteEventTypeById : function(id) {
			return $http.delete(baseUrl+"/deleteEventTypeById/"+id)
		},
		saveNewLogType : function(data) {
			return $http.post(baseUrl + "/saveNewLogType/viswa@technominds.net", data);
		},
		getSavedLogTypes : function() {
			return $http.get(baseUrl + "/getSavedLogTypes");
		},
		deleteLogTypeById : function(id) {
			return $http.delete(baseUrl+"/deleteLogTypeById/"+id);
		},
		getSavedEventDetails : function() {
			return $http.get(baseUrl + "/getSavedEventDetails");
		},
		deleteEventById : function(id) {
			return $http.delete(baseUrl+"/deleteEventById/"+id);
		},
		getEventNames : function() {
			return $http.get(baseUrl + "/getEventNames");
		},
		getScheduledSimulations : function() {
			return $http.get(baseUrl + "/getScheduledSimulations");
		},
		getAllSavedFields : function() {
			return $http.get(baseUrl + "/getAllSavedFields");
		},
		deleteFieldById : function(id) {
			return $http.delete(baseUrl+"/deleteFieldById/"+id);
		}, 
		getAllSavedAttacks : function() {
			return $http.get(baseUrl + "/getSavedAttackDetails");
		},
		saveNewAttack : function(data) {
			return $http.post(baseUrl + "/saveNewAttack/viswa@technominds.net", data);
		},
		deleteAttackById : function(id) {
			return $http.delete(baseUrl+"/deleteAttackById/"+id);
		},
		deleteSimulationById : function(id) {
			return $http.delete(baseUrl+"/deleteSimulationById/"+id);
		},deleteAllSimulationById : function(id) {
			return $http.post(baseUrl+"/deleteAllSimulationById/",id);
		},
		  enableDisableSimualtion : function(status,listIds){
			return $http.post(baseUrl+"/enableDisbleSimulation/"+status+"",listIds);
		},
		getStatsById: function(id){
			return $http.get(baseUrl + "/getScheduledStats/"+id);
		},
		onDemandSimulationForSelection : function(id) {
            return $http.post(baseUrl+"/onDemandSimulationForSelection",id);
        }
	}
}]);