app.factory('ilmService', ['$http', function($http) {
	var baseUrl = "/siem-core/user/ilm";

	return {
		getIlmDetails : function(){
			return $http.get(baseUrl+"/");
		},

		saveIlm : function(dataForm){
			return $http.post(baseUrl+"/save",dataForm)
		},
		getDataStats : function(){
		    return $http.get(baseUrl+"/get-data-stats");
		},
		registerRepo: function(data){
		    return $http.post(baseUrl+"/register-repo",data)
		},
		verifyRepo: function(data){
          return $http.post(baseUrl+"/verify-sanpshot",data)
       },
       getRepoDetails: function(){
            return $http.get(baseUrl+"/get-repo-config")
       },
       getSnapshotDetails: function(){
            return $http.get(baseUrl+"/get-snapshot-details")
       },
       restoreSnapshot: function(data){
         return $http.post(baseUrl+"/restore-snapshot-request",data)
       },
       getSnapshotHistoryDetails:function(){
        return $http.get(baseUrl+"/restore-snapshot-history")
       },
       saveRawStoreate:function(data){
          return $http.post(baseUrl+"/save-raw-storage",data)
       },
       getRawStoreDetails:function(){
        return $http.get(baseUrl+"/get-raw-storage")
       },
       getRawsStorageSize: function(){
        return $http.get(baseUrl+"/get-raw-data-stats")
       },
       getAllRawsStorageSize: function(){
          return $http.get(baseUrl+"/get-raw-storage-size-details")
       },
       requestRestoreSnapshot : function(data){
             return $http.post(baseUrl+"/restore-raw",data)
       }


	}
}]);