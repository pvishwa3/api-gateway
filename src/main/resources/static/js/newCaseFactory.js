app.factory('newCaseFactory', ['$http', function($http) {
	var baseUrl = "http://localhost:8080/api/ts/case";

	return {
		createCase : function(data){
			return $http.post(baseUrl+ "/create", data);
		},
		getAllCases : function() {
			return $http.get(baseUrl + "/get");
		},
		searchCaseTasks : function(id){
			return $http.post(baseUrl + "/searchCaseTasks", id)
		},
		deleteCaseById : function(id){
			return $http.delete(baseUrl + "/deleteCaseByCaseId/"+id)
		},
		getAllUsers : function(){
			return $http.get(baseUrl + "/getAllUsers");
		},
		changeAssigne : function(owner,id){
			return $http.post(baseUrl+"/changeAssigne/"+owner+"/"+id);
		},
		createNewTask : function(data){
			return $http.post(baseUrl+"/createnewTask",data);
		},
		changeStateofTask : function(data){
			return $http.post(baseUrl+"/changeStateOfTask",data);
		},
		changeTheAssigneOfTask : function(data){
			return $http.post(baseUrl+"/changeAssigneOfTask",data);
		},
		getMyTasks : function(){
			return $http.post(baseUrl+"/getMyTasks");
		},
		getCurrentLoginedUser : function(){
			return $http.get(baseUrl+"/getCurrentUser");
		},
		getWaitingTasks : function(){
			return $http.post(baseUrl+"/getWaitingTasks");
		},
		deleteTask : function(id){
            return $http.patch(baseUrl + "/updateCaseTaskByTaskId", id)
        },
        getCaseStats : function(data) {
            return $http.post(baseUrl + "/getCaseStats", data)
        },
        caseReopen : function(id ,status) {
        	 return $http.patch(baseUrl + "/caseReopen/"+id+"/"+status);
        },
        closeCase : function(data) {
        	return $http.patch(baseUrl + "/closeCase/", data );
        },
        editCaseById : function(key, value, id) {
       	 return $http.patch(baseUrl + "/editCaseById/"+key+"/"+value+"/"+id);
       },
       editTaskById : function(key, value, id) {
         	 return $http.patch(baseUrl + "/editTaskById/"+key+"/"+value+"/"+id);
         },
         caseCustomFieldCreatoin : function(data) {
        	 return $http.post("/api/ts/case-custom-fields/create", data);
         }
	}
}]);