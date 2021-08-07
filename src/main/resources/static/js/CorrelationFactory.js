	app.factory('corrleationFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/user/correlation";

	return {
		getCorrelationDetailsById : function(id){
			return $http.get(baseUrl+"/getCorrelationdetailsById/"+id);
		},
		getAllCorrelationDetails : function(){
			return $http.get(baseUrl+"/getCorrelationdetails");
		},
		getAllIndexes : function(){
			return $http.get("/user/elasticsearch/getallindexes");
		},
		saveCorrleation : function(dataForm){
			return $http.post(baseUrl+"/savedetails",dataForm);
		},
		updateCorrleation : function(dataForm){
			return $http.post(baseUrl+"/updatedetails/",dataForm);
		},
		deleteRules : function(id){
			return $http.delete(baseUrl+"/deletedetails/"+id)
		},
		checkForValidIndex : function(indexName){
			return $http.get(baseUrl+"/validateindex?indexName="+indexName);
		},
		getAllFieldsForIndex : function(data){
			return $http.get("/siem-core/user/elasticsearch/getallfiledsforindex/"+data);
		},
		getLoggedIndex : function(){
			console.log("Getting loggedin index");
			return $http.get("/siem-core/user/elasticsearch/getLoggedIndex");
		},
		getAllLogTypes : function(indexName){
			return $http.get("/siem-core/user/elasticsearch/getAllLogTypes/"+indexName);
		},
		runQuery : function(data){
			return $http.post("/siem-core/user/correlation/runQuery",data);
		},
		getRecentIncidents: function(){
			return $http.get("/siem-core/user/correlation/recent-incidents");
		},
		getRuleCategories: function(){
			return $http.get("/siem-core/user/correlation/rule-categories");
		},
		disableOrEnableLogs : function(data){
			return $http.post("/siem-core/user/correlation/disable-or-enable-rule",data);
		},
		saveRuleCategory : function(data){
			return $http.post("/siem-core/user/correlation/rule-categories/save",data);
		},
		getRuleNameBasedOnName : function(ruleName){
			return $http.get("/siem-core/user/correlation/get-ruledetails-by-name?ruleName="+ruleName);

		},
		getAllTopics : function(){
			return $http.get("/siem-core/widget/loadAllTopics/");
		},
		loadPermissions:function(){
			return $http.get("/siem-core/user/loadPermissions")
		},
	}
}]);