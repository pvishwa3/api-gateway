app.factory('colorFactory', ['$http', function($http) {
	var baseUrl = "/user/colors";

	return {
		getAllColorDetails : function(){
			return $http.get(baseUrl+"/");
		},
		getAllColorsPerName : function(){
			return $http.get(baseUrl+"/byname");
		},
		saveColor : function(data){
			return $http.post(baseUrl+"/save/",data);
		},
		updateColor : function(data){
			return $http.post(baseUrl+"/update/",data);
		},
		deleteColor : function(alertId){
			return $http.delete(baseUrl+"/delete/"+alertId);
		}
	}
}]);