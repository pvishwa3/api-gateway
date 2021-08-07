app.factory("securityOverviewFactory",['$http',function($http){
	var baseUrl ="/securityOverview"
	return {
		casesByPriority : function(time){
			return $http.get(baseUrl+"/casesByPriority/"+time.startDate+"/"+time.endDate);
		},casesByStatus : function(time){
			return $http.get(baseUrl+"/casesByStatus/"+time.startDate+"/"+time.endDate);
		},casesByUser : function(time){
			return $http.get(baseUrl+"/casesByUser/"+time.startDate+"/"+time.endDate);
		},alertsByPriority : function(time){
			return $http.get(baseUrl+"/alertsByPriority/"+time.startDate+"/"+time.endDate);			
		},alertsByDomain : function(time){			
			return $http.get(baseUrl+"/alertsByDomain/"+time.startDate+"/"+time.endDate);			
		},alertsByHost : function(time){
			return $http.get(baseUrl+"/alertsByHost/"+time.startDate+"/"+time.endDate);						
		},eventsPerSecond : function(time){
			return $http.get(baseUrl+"/eventsPerSecond/"+time.startDate+"/"+time.endDate);									
		},getGB: function(time){
			return $http.get(baseUrl+"/getGB/"+time.startDate+"/"+time.endDate);									
		},hostCount:function(time){
			return $http.get(baseUrl+"/hostCount/"+time.startDate+"/"+time.endDate);
		},getEvents : function(time){
			return $http.get(baseUrl+"/getEvents/"+time.startDate+"/"+time.endDate);
		},getAlerts : function(time){
			return $http.get(baseUrl+"/getAlerts/"+time.startDate+"/"+time.endDate);
		}
	}
}]);