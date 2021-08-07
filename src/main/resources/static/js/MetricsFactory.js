app.factory('merticsFactory', ['$http', function($http) {

	var baseUrl = "/user/metrics";
	return {
		getEventsPerSecond: function(startDate,endDate){
			return $http.get(baseUrl+ "/GetEventsPerSecond?startDate="+startDate+"&endDate="+endDate);
		},
		getLogTrend: function(startDate,endDate){
			return $http.get(baseUrl+ "/GetLogsOverTime?startDate="+startDate+"&endDate="+endDate);
		},
		loadLogVolume: function(startDate,endDate){
			return $http.get(baseUrl+ "/GetLogVolume?startDate="+startDate+"&endDate="+endDate);
		},
		
		loadLogVolumeOverTime: function(startDate,endDate){
			return $http.get(baseUrl+ "/GetLogVolumeOverTime?startDate="+startDate+"&endDate="+endDate);
		},
		loadTopSendingDevices: function(startDate,endDate){
			return $http.get(baseUrl+ "/GetTopSendingDevices?startDate="+startDate+"&endDate="+endDate);
		},
		loadTopEvents: function(startDate,endDate){
			return $http.get(baseUrl+ "/GetTopEvents?startDate="+startDate+"&endDate="+endDate);
		},
		loadTopEventsByCategory: function(startDate,endDate){
			return $http.get(baseUrl+ "/GetTopEventsByCategory?startDate="+startDate+"&endDate="+endDate);
		}
		
		
	}
}]);