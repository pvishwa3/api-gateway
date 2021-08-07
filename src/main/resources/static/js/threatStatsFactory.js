app.factory('threatStatsFactory', ['$http',function($http) {
//	var baseUrl = "http://192.168.2.21:8666/api/ti/dashboard";
	var baseUrl = "http://cms.obelus.us:8666/api/ti/dashboard";
return {
	getIndicatorsGlobally : function(timeFrame){
		return $http.get(baseUrl+"/get-indicators-globally/"+timeFrame.startDate+"/"+timeFrame.endDate)
	} ,
	getThreatStatsByFeed : function(timeFrame){
		return $http.get(baseUrl+"/get-threat-stats-by-feed/"+timeFrame.startDate+"/"+timeFrame.endDate)
	},
	getThreatStatsByType : function(timeFrame){
		return $http.get(baseUrl+"/get-threat-stats-by-type/"+timeFrame.startDate+"/"+timeFrame.endDate)
	},
	getThreatStatsByCountry : function(timeFrame){
		return $http.get(baseUrl+"/get-threat-stats-by-country/"+timeFrame.startDate+"/"+timeFrame.endDate)
	},
	getThreatStatsByScore : function(timeFrame){
		return $http.get(baseUrl+"/get-threat-stats-by-score/"+timeFrame.startDate+"/"+timeFrame.endDate)
	},
	getTopTenIps : function(timeFrame){
		return $http.get(baseUrl+"/get-top-ten-ips/"+timeFrame.startDate+"/"+timeFrame.endDate)
	},
	getTopTenCountrys : function(timeFrame){
		return $http.get(baseUrl+"/get-top-ten-countrys/"+timeFrame.startDate+"/"+timeFrame.endDate)
	},
	getThreatStatsHistogram : function(timeFrame){
		return $http.get(baseUrl+"/get-threat-stats-histogram/"+timeFrame.startDate+"/"+timeFrame.endDate)
	},
	getThreatStatsGeo : function(timeFrame){
		return $http.get(baseUrl+"/get-threat-stats-geo/"+timeFrame.startDate+"/"+timeFrame.endDate);
	},
	getData : function(timeRange){
	    return $http.get("/siem-core/user/threat-intel/get-data?dateParameter="+timeRange);
	},
	connectToSession:function(){
	    return $http.get("/siem-core/user/threat-intel/subscribe");
	},
	getThreatContext:function(ipAddress){
    	    return $http.get("/siem-core/user/threat-intel/threat-context?ip="+ipAddress);
    	}
}
}]);
