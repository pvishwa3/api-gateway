app.factory("assetFactory",['$http',function($http){

	var baseUrl = "/siem-core/user/asset";
	return {
		getAllAssets : function(companyName){
			return $http.post(baseUrl+"/getAllAssets1",companyName);
		},saveAsset : function(data){
			return $http.post(baseUrl+"/saveAsset",data);
		},deleteAsset : function(data){
			return $http.post(baseUrl+"/deleteAsset",data);
		},updateAssest : function(data){
			return $http.post(baseUrl+"/updateAsset",data);
		},getAssets : function(){
			return $http.get(baseUrl+"/getAssets");
		},
		saveAssetGroups: function(data){
		    return $http.post(baseUrl+"/groups/save",data);
		},
		getAssetGroups: function(){
            return $http.get(baseUrl+"/groups/");
        }
	}
}]);