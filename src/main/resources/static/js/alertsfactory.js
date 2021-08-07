app.factory('alertsFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/user/alerts";

	return {
		getAllAlerts : function(){
			return $http.get(baseUrl+"/");
		},
		getAlertsByCategory: function(){
			return $http.get(baseUrl+"/categories");
		},
		saveAlerts : function(dataForm){
			return $http.post(baseUrl+"/savealerts",dataForm)
		},
		deleteAlerts : function(id){
			return $http.delete(baseUrl+"/delete_alerts/"+id)
		},
		checkForValidIndex : function(indexName){
			return $http.get(baseUrl+"/validateindex?indexName="+indexName);
		},
		getCorrelationDetails : function(){
			return $http.get("/siem-core/user/correlation/getCorrelationdetails");
		},
		getUserDetails : function(){
			return $http.get("/siem-core/user/getAllUsersWithinCompany");
		},
		getCaseTemplates : function(){
			return $http.get("/siem-core/user/alerts/case_templates");
		},
		getAlertsHistory : function(dataForm){
			return $http.post("/siem-core/user/alerts/alert-history",dataForm);
		},
		getTriggeredRulesStats :function(ruleName,startDate,endDate,filterQUery){
			return $http.get("/siem-core/user/alerts/alert-detailed-history?ruleName="+ruleName+"&startDate="+startDate+"&endDate="+endDate+"&query="+filterQUery);
		},
		getTriggeredTableDetails : function(ruleName,startDate,endDate,filterQUery){
			return $http.get("/siem-core/user/alerts/alert-detailed-history-table?ruleName="+ruleName+"&startDate="+startDate+"&endDate="+endDate+"&query="+filterQUery);
		},
		getSingleRuleTableDetails : function(id){
			return $http.get("/siem-core/user/alerts/getSingleRuleInformation?id="+id);
		},
		getAlertsByDocId : function(id){
			return $http.get("/siem-core/user/alerts/alert-history/"+id);
		},
		createCase : function(dataForm){
			return $http.post("/case-management/user/case/create-case",dataForm);
		},
		updateAlertsWithCases : function(dataForm){
			return $http.post("/siem-core/user/alerts/alert-history/update-cases",dataForm);
		},
		
		addAlertsToExistingCase : function(dataForm){
			return $http.post("/case-management/user/case/add-alert-evidence/",dataForm);
		},
		getCasesByDocId : function(id){
			return $http.get("/case-management/user/case/get-case/"+id);
		},
		getAlertHistoyDetails : function(params){
			return $http.post("/case-management/user/case/get-case/",params);
		},
		addNotesToCase : function(dataForm){
			return $http.post("/case-management/user/case/add-notes/",dataForm);
		},
		getAllCases : function(){
			return $http.get("/case-management/user/case/getAllCases/");
		},
		getAllLogFields : function(){
			return $http.get("/siem-core/user/alerts/log-fields/");
		},
		getRulesBasedOnAlerts : function(data){
			return $http.post("/siem-core/user/alerts/alert-history/agg-rules",data);
		},
		getDetailedRulesBasedOnAlerts : function(data){
			return $http.post("/siem-core/user/alerts/alert-history/rules",data);
		},
		//(eventName,ruleName,eventTime)
		getEventsBasedOnRule : function(eventName,ruleName,eventTime){
			return $http.get("/siem-core/user/alerts/alert-history/events?eventTime="+eventTime+"&ruleName="+ruleName+"&eventName="+eventName);
		},
		getSingleEventInfo : function(id){
			return $http.get("/siem-core/user/alerts/alert-history/single-event?id="+id);
		},
		addWorkbenchIdToAlerts:function(data){
			return $http.post("/siem-core/user/alerts/add-to-investigation",data);
		},
		updateAlertsWithInvestigation:function(data){
			return $http.post("/siem-core/user/alerts/alert-history/update-investigations",data);
		},
		changeAlertAssignee : function(data){
			return $http.post("/siem-core/user/alerts/alert-history/update-assinge",data);
		},
		
		changeAlertStatus : function(data){
			return $http.post("/siem-core/user/alerts/alert-history/update-status",data);
		},
		addComment:function(data){
			return $http.post("/siem-core/user/alerts/alert-history/update-comment",data);
		}
		
		
		
		

		
	}
}]);