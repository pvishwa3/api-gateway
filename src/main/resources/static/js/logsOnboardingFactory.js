app.factory('logsOnboardingFactory', ['$http', function($http) {
	var baseUrl="siem-core/user/logonboarding"
	return {
		filebeatCreation : function(data){
			return $http.post(baseUrl+"/filebeatCreation",data);
		},
		s3bucketDetails : function(data){
			return $http.post(baseUrl+"/s3BucketDetails", data)
		},
		awscloudTrail : function(data){
			return $http.post(baseUrl+"/awsCloudTrail", data)
		},
		downloadWinlogbeatYml : function(data){
			return $http.post(baseUrl+"/winlogbeatYml",data);
		},
		saveS3Details : function(data){
			return $http.post(baseUrl+"/saveS3Details",data);
		},
		getAllS3Details : function(){
			return $http.get(baseUrl+"/getAllS3Details");
		},deleteS3ById:function(id){
			return $http.delete(baseUrl+"/deleteS3DetailsById/"+id);
		}
	}
}]);