app.factory('dataSetFactory', ['$http', function($http) {
	var baseUrl = "/dataset";

	return {
		getAllDataSets : function(){
			return $http.get(baseUrl+"/");
		},
		getTopics : function(){
			return $http.get(baseUrl+"/getTopcis");
		},
		saveDetails : function(dataForm){
			return $http.post(baseUrl+"/save",dataForm)
		},
		deleteDataSet : function(id){
			return $http.delete(baseUrl+"/delete-dataset/"+id)
		},
		getAllFieldsForIndex : function(data){
			return $http.get("/user/elasticsearch/getallfiledsforindex/");
		}
	
	}
}]);