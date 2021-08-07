app.factory('collectionFactory', [ '$http', function($http) {
	var baseUrl = "/siem-core/user/collection";
	return {
		getDetails : function() {
			return $http.get("/siem-core/user/asset/get-asset-information");
		},
		getMessagesCount : function(startDate, endDate,hostname) {
			return $http.get(baseUrl + "/getMessagesCount?startDate="+startDate+"&endDate="+endDate+"&hostname="+hostname);
		},
		getSourceInformation : function(hostname){
			return $http.get(baseUrl + "/getSourceInformation?hostname="+hostname);
		},
		getMessagesCountOverTime : function(startDate, endDate) {
			return $http.get(baseUrl + "/getMessagesCountOverTime?startDate="+startDate+"&endDate="+endDate);
		},
		changeHostStatus: function(data){
			return $http.post(baseUrl+"/changeHostStatus",data);
		},
		getDetailsOfCollections : function() { 
			return $http.get(baseUrl+"/getDetailsofCollection")
		},
		loadPermissions:function(){
			return $http.get("/user/loadPermissions")
		},
	}
} ]);