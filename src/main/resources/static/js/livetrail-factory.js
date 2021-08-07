app.factory('liveTrailFactory', ['$http', function($http) {
	var baseUrl = "/user";

	return {
		connetToKafka : function(data){
			return $http.post(baseUrl+"/connetkafka",data)
		},
		disconnectFromkafka : function(){
			return $http.get(baseUrl+"/stopKafka")
		},
		checkForConnection : function(){
			return $http.get(baseUrl+"/checkKafkaConnection")
		}
		
		
	}
}]);