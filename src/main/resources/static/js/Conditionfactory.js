app.factory('conditionFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/user/condition";

	return {
		getAllConditions : function(){
			return $http.get(baseUrl+"/");
		},
		saveCondition : function(dataForm){
			return $http.post(baseUrl+"/savecondition",dataForm)
		},
		deleteCondition : function(id){
			return $http.delete(baseUrl+"/deletecondition/"+id)
		},
		getAllFieldsForIndex : function(data){
			return $http.get("/siem-core/user/elasticsearch/getallfiledsforindex/");
		},
		getallindexes : function(){
			return $http.get("/siem-core/user/elasticsearch/getallindexes");
		},
		getConditionsWithCategory : function(){
			return $http.get("/siem-core/user/condition/get-category-with-condition");
		},
		getRulesWithCategory : function(){
			return $http.get("/siem-core/user/correlation/rules/categories");	
		},
		getFieldsBasedOnLogType : function(logType){
			return $http.get("/siem-core/user/elasticsearch/GetFieldsBasedOnLogType?logType="+logType);
		},
		loadPermissions:function(){
			return $http.get("/siem-core/user/loadPermissions")
		},
		
		getSingleCondition : function(eventId,startDate,endDate,query){
			return $http.get("/siem-core/user/condition/get-evnet-details?id="+eventId+"&startDate="+startDate+"&endDate="+endDate+"&query="+query);
		},
		loadEventsData : function(eventId,startDate,endDate,query){
			return $http.get("/siem-core/user/condition/get-event-information?id="+eventId+"&startDate="+startDate+"&endDate="+endDate+"&query="+query);
		},
		getEventsBasedOnId : function(conditionId,startDate,endDate,eventId){
			return $http.get("/siem-core/user/condition/get-single-event-information?conditionId="+conditionId+"&startDate="+startDate+"&endDate="+endDate+"&eventId="+eventId);
		},
		loadSingleTheme :  function(id){
			return $http.get("/siem-core/widget/loadSingleTheme/"+id);
		},deleteMultipleEvents : function(data){
			return $http.post("/siem-core/user/condition/deleteMultipleByID",data); 
		}
	}
}]);