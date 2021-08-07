app.factory("logDevicesFactory",function($http){
	
	return {
		saveDeviceType : function(data){
			return $http.post("/siem-core/user/deviceType/saveLogDeviceType",data)
		},
		getDevices : function(){
			return $http.get("/siem-core/user/deviceType/")
		},
		deleteDevice : function(ids){
			return $http.post("/siem-core/user/deviceType/deleteDevice",ids);
		},
		deleteLogTypesByIds : function(ids){
			return $http.post("/siem-core/user/logTypes/deletelogtype",ids)
		},
		saveLogTypes : function(data){
			
		
			return $http.post("/siem-core/user/logTypes/saveLogType",data)
			
		},
		getSources : function(logType){
			return $http.get("/siem-core/user/logTypes/configured-sources/"+logType)
		},
		
		getAllLogTypesByDeviceId : function(id){
			return $http.get("/siem-core/user/logTypes/getAllLogTypes/"+id)
		},
		getAllLogFields : function(){
			return $http.get("/siem-core/user/logField/getAllLogFields")
		},
		deleteLogFields : function(ids){
			return $http.post("/siem-core/user/logField/deleteLogFields",ids)
		},
		saveLogFields:function(data){
			return $http.post("/siem-core/user/logField/saveLogField",data)
		},
		refreshLogDevices : function(){
			return $http.get("/siem-core/user/deviceType/refreshAllDevices");
		},
		getAnalyzedFields : function(){
			return $http.get("/siem-core/user/logField/AnalyzedFields");
		},
		loadConfigurations: function(){
			return $http.get("/siem-core/user/logField/domain-configuration");
		},
		saveConfiguration:function(formData){
			return $http.post("/siem-core/user/logField/domain-configuration/save",formData)
		},
		deleteConfiguration:function(id){
			return $http.delete("/siem-core/user/logField/domain-configuration/delete/"+id)
		},
		saveVendorNames:function(data){
			return $http.post("/siem-core/user/logTypes/vendors/save",data)
		},
		loadVendorDetails:function(){
			return $http.get("/siem-core/user/logTypes/vendors/")
		},
		saveDeviceModel:function(data){
			return $http.post("/siem-core/user/logTypes/vendors/save-device-model",data)
		},
		deleteVendor:function(id){
			return $http.delete("/siem-core/user/logTypes/vendors/delete/"+id)
		},
		getAllDevices:function(){
			return $http.get("/siem-core/user/device-manager/")
		},
		getLogModelsBasedOnDevice:function(id){
			return $http.get("/siem-core/user/logTypes/vendors/"+id+"/models")
		},
		
		saveDeivceModelVersion:function(data){
			return $http.post("/siem-core/user/logTypes/vendors/models/save",data)
		},
		deleteVendorModelDetails:function(id){
			return $http.delete("/siem-core/user/logTypes/vendors/models/"+id)
		},
		getAllLogTypes : function(){
			return $http.get("/siem-core/user/logTypes/getAllLogTypes")
		},
		loadCloudSupportedDevices : function(){
			return $http.get("/siem-core/user/device-manager/cloid-metadata")
		}
		
		
		
	}
});