app.factory('alertDashboardFactory', ['$http', function($http) {
	var baseUrl = "/user/alertdata";
	var elasticSearchUrl = "/user/elasticsearch";
	var logStatsUrl = "/logstats";
	var symantecLogUrl = "/user/symantec";

	return {
		getAlertCountByComp : function(timeframe){
			return $http.get(baseUrl+"/bycompandtime/"+timeframe);
		},
		getUserAccountAlertCountByComp : function(timeframe){
			return $http.get(baseUrl+"/useraccount/"+timeframe);
		},
		getSecurityGroupAlertCountByComp : function(timeframe){
			return $http.get(baseUrl+"/securitygroup/"+timeframe);
		},
		getScheduleTaskAlertCountByComp : function(timeframe){
			return $http.get(baseUrl+"/scheduletask/"+timeframe);
		},
		getComputerAccountAlertCountByComp : function(timeframe){
			return $http.get(baseUrl+"/computeraccount/"+timeframe);
		},
		getDataByCompPerAlertName : function(compName,alertName,timeFrame){
			return $http.get(baseUrl+"/bycompandalertname/"+compName+"/"+alertName+"/"+timeFrame);
		},
		getDataByComp : function(compName){
			return $http.get(baseUrl+"/bycomp/"+compName);
		},
		getTriggeredAlertDetailsById : function(id){
			return $http.get(baseUrl+"/"+id)
		},
		getTriggeredAlertDetailsByComp : function(compName){
			return $http.get(baseUrl+"/"+compName)
		},
		getTriggeredAlertDetailsByName : function(alertName){
			return $http.get(baseUrl+"/"+alertName)
		},
		getLogSizePerIndexAndTime : function(timeframe){
			return $http.get(logStatsUrl+"/datafeedsize/"+timeframe);
		},
		getSourceCountPerComp : function(timeframe){
			return $http.get(logStatsUrl+"/sourcecountpercomp/"+timeframe);
		},
		getLogCountPerIndexAndTime : function(timeframe){
			return $http.get(logStatsUrl+"/datafeedcount/"+timeframe);
		},
		getUserLoginOutlierData : function(timeframe){
			return $http.get(elasticSearchUrl+"/getuserloginoutlier/"+timeframe);
		},
		getalerttitles : function(){
			return $http.get("/user/alerts/getalerttitles");
		},
		getSymantecAgentStatusPerTime : function(timeframe){
			return $http.get(symantecLogUrl+"/agentstatus/"+timeframe);
		},
		getSymantecNetworkMonitorPerTime : function(timeframe){
			return $http.get(symantecLogUrl+"/networkmonitor/"+timeframe);
		},
		getFailedLoginedOffHours : function(startTime,endTime){
			return $http.get("/user/dashboard/failed-login-count?startTime="+startTime+"&endTime="+endTime);
		}
		

		
	}
}]);