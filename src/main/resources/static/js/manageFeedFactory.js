app.factory("manageFeedFactory",['$http',function($http){
	var baseUrl = "/siem-core/user/integrations/misp";
	return {
		getAllUsersInCompany : function(companyName){
			return $http.get("/siem-core/user/getAllUsersWithinCompany?company="+ companyName);
		},
		getScheduledFeeds : function(){
			return $http.get(baseUrl+"/feeds");
		},
		schedule : function(data){
			return $http.post(baseUrl+"/scheduleFeed",data);
		},
		deleteById : function(id){
			return $http.delete(baseUrl+"/deleteSchedule/"+id);			
		}
	}
}]);