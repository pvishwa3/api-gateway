app.factory("deviceService",function($http){
	
	return {
		getAllDevices : function(){
			return $http.get("/siem-core/user/device-manager/");
		},
		testDevices : function(data){
			return $http.post("/siem-core/user/device-manager/test-device",data)
		},
		saveDevices : function(data){
			return $http.post("/siem-core/user/device-manager/save-device",data)
		},
		loadCollectors:function(){
			return $http.get("/siem-core/user/device-manager/collectors/");
		},
		saveCollector:function(data){
			return $http.post("/siem-core/user/device-manager/collectors/create-collector",data);
		},
		deleteCollector:function(id){
			return $http.delete("/siem-core/user/device-manager/collectors-delete/"+id);
		},
		generateSubScriptionLink:function(){
			return $http.get("/siem-core/user/device-manager/collectors/generate-cloud-token");
		},
		enableOrDisableDevice : function(deviceName){
			return $http.post("/siem-core/user/device-manager/enable-disable-deivces",deviceName);
		},
		deleteDevice : function(deviceName){
			return $http.post("/siem-core/user/device-manager/delete-devices",deviceName);
		},
		enableOrDisable : function(data){
			return $http.post("/siem-core/user/device-manager/collectors/disable-collectors",data);
		},
		loadLicenceUsage: function(){
			return $http.get("/siem-core/user/device-manager/collectors/get-licence-usage");
		}
		
		
	}
});