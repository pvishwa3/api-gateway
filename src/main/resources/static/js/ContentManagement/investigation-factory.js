app.factory('investigationPanelFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/user/investigation";

	return {
		getInvestigationPanelDetails : function(){
			return $http.get(baseUrl+"/investigation-panel/");
		},
		savePanel : function(dataForm){
			return $http.post(baseUrl+"/investigation-panel/create",dataForm)
		},
		deletePanel : function(id){
			return $http.delete(baseUrl+"/investigation-panel/delete/"+id)
		},
		loadPermissions:function(){
			return $http.get("/siem-core/user/loadPermissions")
		},
		changeStatus : function(status){
			return $http.post(baseUrl+"/investigation-panel/changestatus",status)
		},
		getWorkBenchTabs: function(){
			return $http.get(baseUrl+"/workbench-tab/");
		},
		saveWorkBenchTabs : function(dataForm){
			return $http.post(baseUrl+"/workbench-tab/save",dataForm)
		},
		deleteWorkBenchTab : function(id){
			return $http.delete(baseUrl+"/workbench-tab/delete/"+id)
		},
		getAllWorksBenches : function(){
			return $http.get(baseUrl+"/workbench/");
		},
		saveWorkBench : function(dataform){
			return $http.post(baseUrl+"/workbench/save",dataform)
		},
		saveArtifacts : function(dataform){
			return $http.post(baseUrl+"/workbench/saveArtificats",dataform)
		},
		saveArtifactsForCases : function(dataform){
			return $http.post(baseUrl+"/workbench/saveArtificatsFromCases",dataform)
		},
		loadTabContent: function(dataform){
			return $http.post(baseUrl+"/workbench/loadTabs",dataform)
		},
		getEventsBased : function(groupName){
			return $http.get(baseUrl+"/workbench/load-events?groupName="+groupName);
		},
		getIndicators : function(eventName){
			return $http.get(baseUrl+"/workbench/load-observables?id="+eventName);
		},
		getRulesFromAlert : function(ruleName){
			return $http.get(baseUrl+"/workbench/load-rules-from-alert?alertId="+ruleName);
		},
		loadEventsFromRules : function(ruleId){
			return $http.get(baseUrl+"/workbench/load-rules?ruleId="+ruleId);
		},
		loadEventsFromObservables: function(query,alertId,id,type){

		

			
			var data = {

					"term":query,
					"value":alertId,
					"id":id,
					"type":type
			}
		
			return $http.post(baseUrl+"/workbench/load-events-from-obserables",data);
		},
		loadActivity : function(data){
			return $http.post(baseUrl+"/workbench/investigation-activity/",data);
		},
		loadExternalEvents : function(indicator,value,group,id){

			var data = {
					"term":indicator,
					"value":value,
					"group":group,
					"id":id
			}

			return $http.post(baseUrl+"/workbench/load-external-analysis",data);
		},
		loadBasicInfo : function(indicator,group,id,value,lookAround){

			var data = {
					"term":indicator,
					"group":group,
					"id":id,
					"value":value,
					"lookAround":lookAround
			}

			return $http.post(baseUrl+"/workbench/load-external-analysis-basic-info",data);
		},

		loadEventsOrRuleForInvestigations:function(eventName,type,id,lookAround,term,value){
			
		//eventName,type,self.workBench.id,$scope.eventFilter.lookAround
			var data = {
					"eventName":eventName,
					"type":type,
					"id":id,
					"lookAround":lookAround,
					"term":term,
					"value":value,
			}

			return $http.post(baseUrl+"/workbench/load-events-for-investigation",data);
		},


		loadDrillDown : function(data){
			return $http.post(baseUrl+"/workbench/investigation-drilldown/",data);
		},
		loadContext : function(data){
			return $http.get("/siem-core/user/integrations/misp/get-context?id="+data);
		},
		loadKeyObservables : function(alertId){
		///workbench/load-events-from-obserables
		    return $http.get("/siem-core/user/investigation/workbench/load-key-observables?alertId="+alertId);
		},
		changeStatus:function(data){
	       return $http.post("/siem-core/user/investigation/investigation-panel/changestatus",data);
		},
		changeAssignee:function(data){
        	return $http.post("/siem-core/user/investigation/investigation-panel/changeAssignee",data);
        },
        saveComments:function(data){
            return $http.post("/siem-core/user/investigation/investigation-panel/addComments",data);
        },
        deleteComment : function(id){
            return $http.delete("/siem-core/user/investigation/investigation-panel/deleteComments/"+id);
        }


	}
}]);