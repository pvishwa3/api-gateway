app.factory('exploreFactory', ['$http', function($http) {
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
		},
		exploreData:function(data){
			return $http.post('/siem-core/user/explore/explore', data);
		},
		getTypeBasedFields:function(data){
			return $http.get('/siem-core/user/explore/getTypeBasedFields');
		},
		loadInfoTable: function(data){
			return $http.post('/siem-core/user/explore/get-info',data);
		},
		getMalwareCategoies:function(){
			return $http.get('/siem-core/user/integrations/misp/load-malwarecategories');
		},
		timeLineData: function(data){
		    return $http.post('/siem-core/user/explore/get-time-line',data);
		},
		exploreData: function(data){
		    return $http.post('/siem-core/user/explore/get-graph',data);
		}
	}
}]);