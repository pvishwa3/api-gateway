app.factory('jiraConnectionService', ['$http', function($http) {
	var baseUrl = "/siem-core/user/integrations/";

	return {
		loadJiraConnections : function(){
			return $http.get(baseUrl+"jira/");
		},
		
		testConnection : function(dataForm){
		    if(dataForm.connectionType=== 'Jira'){
		        return $http.post(baseUrl+"jira/test-jira-connection",dataForm)
		    }else{
		        return $http.post(baseUrl+"jira/test-service-connection",dataForm)
		    }

		},
		saveJiraConnection : function(dataForm){
			return $http.post(baseUrl+"jira/save",dataForm)
		},
		deleteConnection :function(id){
			return $http.delete(baseUrl+"jira/delete/"+id)
		},
		saveActiveDirectoryDetails : function(dataForm){
			return $http.post(baseUrl+"/save",dataForm)
		},
		deleteActiveDirectoryDetails : function(id){
			return $http.delete(baseUrl+"/delete/"+id)
		},
		loadAttributes:function(data){
			return $http.post(baseUrl+"/get-attributes",data)
		},
		testMispConnection: function(data){
			return $http.post(baseUrl+"misp/load-misp-attributes",data)
		},
		saveMispConfiguration : function(data){
		return $http.post(baseUrl+"misp/save",data)
		},
		loadMisp : function(){
		    return $http.get(baseUrl+"misp")
		}
		
		
		
		
		
		

		
	}
}]);