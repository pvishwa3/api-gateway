app.factory('referenceSetFactory', ['$http', function($http) {
	var baseUrl = "/siem-core/user/reference-set";

	return {
		loadReferenceSets : function(){
			return $http.get(baseUrl+"/");
		},
		saveReferenceDetails : function(dataForm){
			return $http.post(baseUrl+"/save",dataForm)
		},
		deleteReferenceDetails : function(id){
			return $http.delete(baseUrl+"/delete/"+id)
		},
		doPerview:function(dataForm){
			return $http.post(baseUrl+"/doPerview",dataForm)
		},
		deleteContents : function(id,formData){
			return $http.post(baseUrl+"/delete-contents/"+id,formData)
		},
		viewContents:function(id){
			return $http.get(baseUrl+"/view-contents/"+id);
		},
		resync:function(id){
			return $http.post(baseUrl+"/resync-cache/"+id);
		},

		getRiskFactors:function(){
		    return $http.get("/siem-core/users/risk/risk-factor");
		},

		uploadFile:function(id,dataForm){
			
			var config = {
              	   	transformRequest: angular.identity,
              	   	transformResponse: angular.identity,
          	   		headers : {
          	   			'Content-Type': undefined
          	   	    }
                 }
			
			return $http.post(baseUrl+"/upload/"+id,dataForm,config)
		}
		
		
		
		
		
		

		
	}
}]);