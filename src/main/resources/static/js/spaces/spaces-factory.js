app.factory('sapcesFactory', ['$http','$window', function($http,$window) {
	
	
	return {
		getGlobalSpaces : function(data){
			return $http.get("/siem-core/user/space/public-spaces");
		},
		getPrivateSpaces : function(data){
			return $http.get("/siem-core/user/space/private-spaces");
		},
		loadPermissions:function(){
			return $http.get("/siem-core/user/loadPermissions")
		},
		saveOrUpdateSpaces: function(data){
			return $http.post("/siem-core/user/space/SaveOrUpdate",data);
		},
		deletePrivateSpaces : function(id){
			return $http.delete("/siem-core/user/space/delete-private-spaces/"+id)
		},
		deletePublicSpaces : function(id){
			return $http.delete("/siem-core/user/space/delete-public-spaces/"+id)
		},
		loadUsers : function(id){
			return $http.get("/siem-core/user/space/load-users")
		},
		loadUsersBasedOnCompanyName : function(companyName){
			return $http.get("/siem-core/user/space/load-users-basedoncompanyname?companyName="+companyName)
		},
		shareSpace:function(data){
			return $http.post("/siem-core/user/space/share-sapce",data);
		},
		getShareDetails:function(id){
			return $http.get("/siem-core/user/space/share-sapce-details/"+id);
		},
		getSharedSpaces:function(){
			return $http.get("/siem-core/user/space/share-sapce-details");
		},
		
		loadAllDashboards : function(){
			return $http.get("/siem-core/widget/load_all_dahsboards");
		},
		promoteSpace : function(data){
			return $http.post("/siem-core/user/space/promote-space",data)
		}
		
		
		
		
	}
	
	
}]);