app.factory('threatinteligencefactory', ['$http', function($http) {
	var baseUrl="http://cms.obelus.us:8777/api/feedAggregator/dashboard";
	return {
		getFeedStaticsByIndicator : function(timeFrame){
			return $http.get(baseUrl+"/getFeedStaticsByIndicator/"+timeFrame.startDate+"/"+timeFrame.endDate);
		},
		getFeedStaticsByHistorgram : function(timeFrame){
			return $http.get(baseUrl+"/getFeedStaticsByHistorgram/"+timeFrame.startDate+"/"+timeFrame.endDate);
		},
		getallfeedstaticsbysource : function(timeFrame){
			return $http.get(baseUrl+"/getFeedStaticsBySource/" + timeFrame.startDate+"/"+timeFrame.endDate);
		},
		getFeedStaticsByIP : function(timeFrame) {
			return $http.get(baseUrl+"/getFeedStaticsByIP/"+timeFrame.startDate+"/"+timeFrame.endDate);
		},
		getAllFeeds : function(username,timeFrame){
			return $http.get(baseUrl+"/getAllFeedStats");
		}
	}
}]);