app.factory('UEBACoalescingFactory', ['$http',function($http) {
	var baseUrl = "/siem-core/user/ueba";
	return {
		getUEBACoalescingConfig : function(data){
			return $http.get(baseUrl+ "/");
		},
		save : function(data){
			return $http.post(baseUrl+ "/save",data);
		}
		
	}
}]);