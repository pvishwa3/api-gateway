app.factory('dashboardFactory', ['$http', function($http) {
	var baseUrl = "/user/alertdata";
	var elasticSearchUrl = "/user/elasticsearch";
	var logStatsUrl = "/logstats";
	var symantecLogUrl = "/user/symantec";

	return {
		
		getSourceCountPerComp : function(startTimeframe, endTimeframe){
			return $http.get("/user/dashboard/host-count?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},
		
		getHostDetails : function(startTimeframe, endTimeframe){
			return $http.get("/user/dashboard/host-count-details?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},
		getLogVolumeByHost : function(startTimeframe, endTimeframe, host){
			return $http.get("/user/dashboard/log-volume-by-host?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},
		getLogVolumeByType : function(startTimeframe, endTimeframe, host){
			return $http.get("/user/dashboard/log-volume-by-type?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},
		
		getLogCountPerIndexAndTime : function(startTimeframe, endTimeframe, host){
			return $http.get("/user/dashboard/log-count-by-host?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},
		getLogCountByType : function(startTimeframe, endTimeframe, type){
			return $http.get("/user/dashboard/log-count-by-type?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},
		getTopTenHost : function(startTimeframe, endTimeframe, type){
			return $http.get("/user/dashboard/top-ten-host?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},
		getTopUserLogonFailuers : function(startTime,endTime){
			return $http.get("/user/dashboard/windows/top-user-logon-failures?startTime="+startTime+"&endTime="+endTime);
		},
		getWindowsDetails : function(startTime,endTime,eventId){
			return $http.get("/user/dashboard/windows/window-sec-details?startTime="+startTime+"&endTime="+endTime+"&eventId="+eventId);
		},
		
		getLogonFailuresErrorCode : function(startTime,endTime){
			return $http.get("/user/dashboard/windows/logon-failures-error-codes?startTime="+startTime+"&endTime="+endTime);
		},
		getAccountLockedOutUsers : function(startTime,endTime){
			return $http.get("/user/dashboard/windows/account-locked-out-users?startTime="+startTime+"&endTime="+endTime);
		},
		getAccountLockedOutUsersDetails : function(startTime,endTime){
			return $http.get("/user/dashboard/windows/account-locked-out-users-details?startTime="+startTime+"&endTime="+endTime);
		},
		
		
		getAllAlertsByCategory : function(startTime,endTime){
			return $http.get("/user/dashboard/alerts-by-group?startTime="+startTime+"&endTime="+endTime);
		},
		getAllAlertsByPriority : function(startTime,endTime){
			return $http.get("/user/dashboard/alerts-by-priority?startTime="+startTime+"&endTime="+endTime);
		},
		getAlertDetails : function(startTime,endTime){
			return $http.get("/user/dashboard/alert-details?startTime="+startTime+"&endTime="+endTime);
		},
		
		
		
		
		/*, 
		//Start Hazle API
		getSourceCountPerComp : function(startTimeframe, endTimeframe){
			return $http.get(logStatsUrl+"/sourcecountpercomp?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},
		getLogVolumeByHost : function(startTimeframe, endTimeframe, host){
			return $http.get(logStatsUrl+"/logvolumebyhost?startTime="+startTimeframe+"&endTime="+endTimeframe+"&host="+host);
		},
		getLogVolumeByType : function(startTimeframe, endTimeframe, host){
			return $http.get(logStatsUrl+"/logvolumebytype?startTime="+startTimeframe+"&endTime="+endTimeframe+"&type="+host);
		},
		getLogCountByHost : function(startTimeframe, endTimeframe, host){
			return $http.get(logStatsUrl+"/logcountbyhost?startTime="+startTimeframe+"&endTime="+endTimeframe+"&host="+host);
		},
		getLogCountByType : function(startTimeframe, endTimeframe, type){
			return $http.get(logStatsUrl+"/logvolumebyhost?startTime="+startTimeframe+"&endTime="+endTimeframe+"&host="+host);
		},
		getAllAlertsByCategory : function(startTimeframe, endTimeframe){
			return $http.get("/user/correlation/recent-incidents-by-category?startTime="+startTimeframe+"&endTime="+endTimeframe);
		},getAlertsByType : function(startTimeframe, endTimeframe, type){
			return $http.get("/user/correlation/recent-incidents-by-type?startTime="+startTimeframe+"&endTime="+endTimeframe+"&type="+type);
		},
		getAlertsByPriority : function(startTimeframe, endTimeframe, priority){
			return $http.get("/user/correlation/recent-incidents-by-priority?startTime="+startTimeframe+"&endTime="+endTimeframe+"&priority="+priority);
		},/*,
		getFailedLoginByGeoLocation : function(startTimeframe, endTimeframe){
			return $http.get(elasticSearchUrl+"/failedloginbylocation?startTime="+startTimeframe+"&endTime="+endTimeframe);
		}*/
		//End Hazle API
	}
}]);