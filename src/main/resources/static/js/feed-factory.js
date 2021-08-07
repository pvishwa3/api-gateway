app.factory('feedControllerFactory', ['$http', function($http) {
	var baseUrl = "/user/integrations/misp/misp/feeds";
	//var baseUrl = "http://cms.obelus.us:8555/api/analyzers/feed";
	return {
		scheduleFeed: function(data){
			return $http.post(baseUrl+ "/scheduleFeed", data);
		},
		getSchedules: function() {
			return $http.get(baseUrl+ "/getSchedules");
		}, 
		deleteSchedules: function(id) {
			return $http.delete(baseUrl+ "/deleteSchedule/" + id);
		}
	}
}]);