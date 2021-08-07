
app.factory('whiteListFactory', ['$http', function($http) {
	
		var whitelistUrl = "/feed-management/api/feedAggregator/whitelist";
		var blocklistUrl = "/feed-management/api/feedAggregator/blocklist";
		
		//var whitelistUrl = "http://localhost:8777/api/feedAggregator/whitelist";
		//var blocklistUrl = "http://localhost:8777/api/feedAggregator/blocklist";
		
		
	return {
		//whitelist
		getWhiteListDetails : function(){
			return $http.get("/feed-management/api/feedAggregator/feed/indicators");
		},
		saveWhitelist: function(data){
			return $http.post(whitelistUrl+"/create",data);
		},
		updateWhitelist : function(data){
			return $http.post(whitelistUrl+"/update",data);
		},
		deleteWhiteList : function(id){
			return $http.delete(whitelistUrl+"/delete/"+id);
		},
		uploadThisFileWhite : function(data){
			var config = {
              	   	transformRequest: angular.identity,
              	   	transformResponse: angular.identity,
          	   		headers : {
          	   			'Content-Type': undefined
          	   	    }
                 }
        	
          return $http.post("/feed-management/api/feedAggregator/whitelist/upload",data,config);
			
		},
		// block list
		getBlockListDetails : function(){
			return $http.get(blocklistUrl+"/get");
		},
		saveBlocklist: function(data){
			return $http.post("/feed-management/api/feedAggregator/blocklist/create",data);
		},
		updateBlocklist : function(data){
			return $http.post("/feed-management/api/feedAggregator/blocklist/update",data);
		},
		deleteBlockList : function(id){
			return $http.delete(blocklistUrl+"/delete/"+id);
		},uploadThisFileBlock : function(data){
			var config = {
              	   	transformRequest: angular.identity,
              	   	transformResponse: angular.identity,
          	   		headers : {
          	   			'Content-Type': undefined
          	   	    }
                 }
          return $http.post("/feed-management/api/feedAggregator/blocklist/upload",data,config);			
		}
		
		
		
		
	}
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
       return  $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
    }
}]);


app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


