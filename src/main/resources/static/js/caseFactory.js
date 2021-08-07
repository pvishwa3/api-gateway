app.factory('caseFactory', ['$http','$window', function($http,$window) {
	var baseUrl = "/case-management/user/case";
//	var baseUrl = "http://192.168.2.21:8444/api/ts";
	return {
		createCase : function(data){
			return $http.post(baseUrl+ "/getAllCases", data);
		},
		getAllCases : function(data) {
			return $http.post(baseUrl + "/getAllCasesWithFilters",data);
		},
		updateCase : function(data) {
			return $http.post(baseUrl+ "/case/update", data);
		},
		getAllTasks : function() {
			return $http.get(baseUrl + "/case-task/get");
		},
		getAllTaskLogs : function() {
			return $http.get(baseUrl + "/case-task-log/get");
		},
		searchCaseTasks : function(id){
			return $http.post(baseUrl + "/searchCaseTasks", id)
		},
		deleteCaseById : function(id){
			return $http.delete(baseUrl + "/deleteCaseByCaseId/"+id)
		},
		deleteTaskLog : function(data){
			return $http.delete(baseUrl+"/case-task-log/delete/"+data.id+"/"+data.userName)
		},
		deleteCaseMetrics : function(id) {
			return $http.delete(baseUrl + "/case-metrics/delete/"+id)
		},
		getCaseById : function(id){
			return $http.get(baseUrl+"/case/get/"+id);
		},
		createCaseMetric : function(data) {
			return $http.post(baseUrl+ "/case-metrics/create", data);
		},
		getAllMetrics : function() {
			return $http.get(baseUrl + "/case-metrics/get");
		},
		getAllUsers : function(){
			return $http.get(baseUrl + "/userdetails/get");
		},
		changeAssigne : function(owner,id){
			return $http.post(baseUrl+"/changeAssigne/"+owner+"/"+id);
		},
		createNewTask : function(data){
			return $http.post(baseUrl+"/case-task/create",data);
		},
		changeStateofTask : function(data){
			return $http.post(baseUrl+"/changeStateOfTask",data);
		},
		closeTask : function(id) {
			return $http.post(baseUrl+"/case-task/closeTask",id);
		},
		changeTheAssigneOfTask : function(data){
			return $http.post(baseUrl+"/case-task/assignToMe",data);
		},
		getMyTasks : function(){
			return $http.get(baseUrl+"/case-task/getMyTasks");
		},
		getCurrentLoginedUser : function(){
			return $http.get(baseUrl+"/getCurrentUser");
		},
		getWaitingTasks : function(){
			return $http.get(baseUrl+"/case-task/getWaitingTasks");
		},
		deleteTask : function(data){
            return $http.delete(baseUrl + "/case-task/delete/"+data.id+"/"+data.caseId+"/"+data.taskId+"/"+data.case_id+"/"+data.userName)
        },
        caseReopen  : function(id ,status) {
        	 return $http.patch(baseUrl + "/caseReopen/"+id+"/"+status);
        },
        closeCase : function(data) {
        	return $http.patch(baseUrl + "/closeCase/", data );
        },
        takeThisTask : function(status,id){
        	return $http.patch(baseUrl+"/takeThisTask/"+id+"/"+status)
        },
        editCaseById : function(key, value, id) {
          	 return $http.patch(baseUrl + "/editCaseById/"+key+"/"+value+"/"+id);
        },
        editTaskById : function(key, value, id) {
           	 return $http.patch(baseUrl + "/editTaskById/"+key+"/"+value+"/"+id);
        },
        Activity : function(){
          return $http.get(baseUrl+"/ActivityFlow");
        },
        taskLogUpload : function(data){
        	var config = {
              	   	transformRequest: angular.identity,
              	   	transformResponse: angular.identity,
          	   		headers : {
          	   			'Content-Type': undefined
          	   	    }
                 }
        	
          return $http.post(baseUrl+"/case-task-log/upload",data,config);
        },
        taskLogUpload1 : function(data){
        	var config = {
              	   	transformRequest: angular.identity,
              	   	transformResponse: angular.identity,
          	   		headers : {
          	   			'Content-Type': undefined
          	   	    }
                 }
        	 return $http.post(baseUrl+"/case-task-log/uploadComments",data,config);
        },
        mergeCase : function(data){
          return $http.post(baseUrl+"/case/merge",data);
        },
        updateTask : function(data){
        	return $http.post(baseUrl+"/case-task/update",data);
        },deleteCase : function(data){
        	return $http.delete(baseUrl+"/case/delete/"+data._id+"/"+data.caseId+"/"+data.userName);
        },download : function(data){
        	$window.open(baseUrl+"/case-task-log/download/"+data, '_blank');        	
        },submitFeedBackData: function(data){
        	return $http.post(baseUrl+"/case/feedbackForm",data);
        },filterData : function(data,date) {
        	return $http.post(baseUrl+"/case/getCaseActivity/"+date.startDate+"/"+date.endDate,data);
        },getAllTags : function(){
        	return $http.get(baseUrl+"/case/getAllTags");
        },stopWatching : function(obj){
        	return $http.post(baseUrl+"/case/updateWatchList/"+obj.caseESId+"/"+obj.userName);
        },getEventsByCaseId : function(id){
        	return $http.get(baseUrl+"/case/getCaseESLogs/"+id);
        },getGroupDetails : function(cmpny){
        	return $http.get("/secure/user/groups/company/"+cmpny);
        },getCasesByUserStatus : function(data){
        	return $http.get(baseUrl+"/case/getCasesByUserStatus/"+data.userName+"/"+data.status);
        },getActivityOfCase : function(id){
        	return $http.get(baseUrl+"/case/getCaseActivities/"+id);
        },getCaseTasksById: function(id){
        	return $http.get(baseUrl+"/case-task/getCaseTasksByCaseId/"+id);
        },getTaskLogsById : function(id){
        	return $http.get(baseUrl+"/case-task-log/getCaseTaskLogsByCaseId/"+id);
        },getCaseStats : function(date,filters){
        	return $http.post(baseUrl+"/case/getCasesStats/"+date.startDate+"/"+date.endDate,filters); 
        },createCaseFromTemplate : function(data){
        	return $http.post(baseUrl+"/case/createCaseFromTemplate",data);
        },
        getCasesByDocId : function(id){
//        	return {"casedetails":{"collaboratiors":null,"isResponded":null,"notes":null,"dueDate":null,"companyName":"technominds","description":"SOX  User Logon Activity Detected","respondEsclationTime":"Immediately","resolutionEsclationTime":"","title":"SOX User Logon Activity Detected","caseType":"Port Scanning Activity","reslovedDate":null,"caseId":1,"alertEvidences":[{"createdDate":"","alertName":"SOX  - User Logon Activity Detected","createdBy":"","alertId":"zvuXB3EBgAzfgyXvG0Jb","alertPriority":"low","alertCategory":"SOX Compliance"}],"rleatedCases":null,"id":"r_ujB3EBgAzfgyXvtGeW","isSLABreched":null,"assignedUser":"rajesh.chenna@technominds.io","createDate":"2020-03-23T13:45:01.023","caseGroupName":"0-7 Days","caseActivities":[{"activityDate":1584971101008,"activity":"tmcl00010@gmail.com Was Created Ticket"},{"activityDate":1584971101008,"activity":"Set status as Open, priority as Critical, type as Port Scanning Activity, assinged to rajesh.chenna@technominds.io"}],"timeTookToReslove":0,"timeTookToRespond":0,"respondedDate":null,"investigationEvidence":null,"resolutionDueDate":1584985501023,"resolutionEsclationNames":"viswa@technominds.net,rajesh.chenna@technominds.io,avinash.p@technominds.net","respondDueDate":1584972001023,"priority":"Critical","caseTags":null,"logEvidence":null,"createdBy":"tmcl00010@gmail.com","closedDate":null,"lastUpdate":"2020-03-23T13:45:01.023","files":null,"respondEsclationNames":"viswa@technominds.net,rajesh.chenna@technominds.io,avinash.p@technominds.net","status":"Open"}};
			return $http.get("/case-management/user/case/get-case?name="+id);
		},
		addNotesToCase : function(dataForm){
			return $http.post("/case-management/user/case/add-notes/",dataForm);
		},
		loadAlertsForCase: function(id){
			return $http.get("/siem-core/user/alerts/alert-history-case/"+id);
		},
		changeStatus: function(dataForm){
			return $http.post("/case-management/user/case/change-status",dataForm);
		},
		changePriority: function(dataForm){
			return $http.post("/case-management/user/case/change-priorty",dataForm);
		},
		getCasesByPriority : function(dataForm){
			return $http.post("/case-management/user/case/get-case-by-priority",dataForm);
		},
		getCasesByStatus : function(dataForm){
			return $http.post("/case-management/user/case/get-case-by-status",dataForm);
		},
		getCasesOverTime : function(dataForm){
			return $http.post("/case-management/user/case/get-case-overtime",dataForm);
		},
		attachInvestigationToCase : function(dataForm){
			return $http.post("/case-management/user/case/add-investigation",dataForm);
		},
		getCasesByInvestigation : function(dataForm){
			return $http.post("/case-management/user/case/get-cases-by-investigation",dataForm);
		},
		attachCases:function(data){
			return $http.post("/case-management/user/case/move-case-to-external",data);
		},
		getMyCases : function(){
			return $http.get("/case-management/user/case/getAllCases");
		},
		changeAssignee : function(data){
			return $http.post("/case-management/user/case/change-assignee",data);
		},
		getAllUsers : function(){
			return $http.get("/siem-core/user/getAllUsersWithinCompany");
		},
		getRulesBasedOnAlertId : function(id){
			return $http.get("/siem-core/user/alerts/alert-by-id?id="+id);
		}
		
		
		
	}
}]);
