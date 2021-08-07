app.factory('colorConfigurationFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/user/colorconfiguration"; 
	return {
		saveColor : function(data){
			return $http.post(baseUrl+"/save",data);
		},getColorByUser : function(){
			return $http.get(baseUrl+"/");
		}
	}
}]);