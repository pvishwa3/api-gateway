app.factory('grokdebuggerFactory', [ '$http', function($http) {
	var baseUrl = "/user";

	return {
		getAllIndices : function() {
			return $http.get(baseUrl + "/elasticsearch/getallindices");
		},
		compileGrok : function(dataForm) {
			return $http.post(baseUrl + "/compileGrok", dataForm);
		},
		getAllMsgs : function(dataForm) {
			return $http.get(baseUrl + "/elasticsearch/getMsgs/"+dataForm);
		}

	}
}]);