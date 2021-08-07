app.factory('fieldExtractorFactory', [ '$http', function($http) {
	var baseUrl = "/siem-core/user";

	return {
		getMessages : function(logDevice,logType,time,searchQuery) {
			return $http.get(baseUrl + "/elasticsearch/getMessagesBasedOnLogType?logType="+logType+"&logDevice="+logDevice+"&time="+time+"&searchQuery="+searchQuery);
		},
		getLogTypes : function(logType) {
			return $http.get("/siem-core/user/logTypes/devices?logDevice="+logType);
		},
		generateCustomPatterns: function(data){
			return $http.post(baseUrl + "/custom-patterns/generate-custom-pattern",data);
		},
		saveDetails : function(data){
			return $http.post(baseUrl + "/custom-patterns/save-custom-patterns",data);
		},
		loadPermissions:function(){
			return $http.get("/siem-core/user/loadPermissions")
		},
		getLogDevices : function(){
			return $http.get("/siem-core/user/deviceType/");
		},
		applyPattern : function(data){
			return $http.post(baseUrl + "/custom-patterns/apply-patterns",data);
		},
		getParser : function(){
			return $http.get(baseUrl + "/custom-patterns/");
		},
		getLogFields: function(logDevice){
			return $http.get("/siem-core/user/logField/devices?logDevice="+logDevice);
		},
		deleteParser : function(id){
			return $http.post(baseUrl + "/custom-patterns/delete/",id);
		}
		
	}
}]);