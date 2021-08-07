app.factory("lookupFactory",['$http',function($http){
	var baseUrl = "/siem-core/user/lookup";
	return {
		loadLookupDetails : function(){
			return $http.get("/siem-core/user/lookup/");
		},
		saveDetails : function(formData){
			return $http.post("/siem-core/user/lookup/save",formData);
		},
		
		deleteLookupData : function(formData){
			return $http.post("/siem-core/user/lookup/delete-contents",formData);
		},
		addDataToLookup : function(formData){
			return $http.post("/siem-core/user/lookup/add-data-lookup",formData);
		},
		schedule : function(data){
			return $http.post(baseUrl+"/scheduleFeed",data);
		},
		deleteById : function(id){
			return $http.delete(baseUrl+"/deleteSchedule/"+id);			
		},
		loadLookupGroups : function(){
			return $http.get("/siem-core/user/lookup/domain-type-group/");
		},
		saveDomainGroup: function(dataForm){
			return $http.post("/siem-core/user/lookup/domain-type-group/save",dataForm);
		},
		deleteLookupGroupDetails:function(id){
			return $http.delete("/siem-core/user/lookup/domain-type-group/"+id);			
		},
		loadLookupContent:function(){
			return $http.get("/siem-core/user/lookup/context-details?domainType=USER");
		},
		deleteLookupConfig:function(id){
			return $http.delete("/siem-core/user/lookup/delete/"+id);
		}
	}
}]);