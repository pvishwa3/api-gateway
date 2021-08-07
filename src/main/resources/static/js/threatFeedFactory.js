app.factory('threatinteligenceFeedfactory', ['$http', function($http) {
	var baseUrl="http://cms.obelus.us:8777/user/feed";
	return {
		getAllFeeds : function(data){
			return $http.get(baseUrl+"/getfeedsfordashboard/"+data);
		},
		saveFeeds : function(data,username){
			return $http.post(baseUrl+"/management/savefeeds/"+username,data);
		},
		deleteAlert : function(alertId){
			return $http.delete(baseUrl+"/delete/"+alertId);
		}
	}
}]);