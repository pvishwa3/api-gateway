app.factory('notificationFactory', ['$http', function ($http) {
    
	var baseUrl="http://cms.obelus.us:8666/api/user/rules";	
//	var baseUrl="http://localhost:8666/api/user/rules";	
	
  return {	  
	saveRule : function(data){
		return $http.post(baseUrl+"/saveRule",data);
	},
	getRules : function(){
		return $http.get(baseUrl+"/getRule");
	}
  }
}]);