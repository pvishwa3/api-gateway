app.factory('caseTemplateFactory', ['$http', function ($http) {
	var baseUrl = "http://cms.obelus.us:8444/api/ts/case-template";

  return {	  
	getAllTemplates : function() {
		return $http.get(baseUrl + "/get");
	},
    createCaseTemplate: function (data) {
      return $http.post(baseUrl + "/create", data);
    },
    deleteTemplate: function (id) {
        return $http.delete(baseUrl + "/delete/" + id)
    },
    updateCaseTemplate : function(data){
    	return $http.post(baseUrl+"/update",data);
    }
  }
}]);
