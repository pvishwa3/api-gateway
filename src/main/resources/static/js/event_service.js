app.factory('eventService', ['$http',function($http) {
	var baseUrl = "/siem-core/user/events";
	return {
		getCategories:function(){
			return $http.get(baseUrl+ "/categories");
		},
		getChildCategories:function(id,parent,status,eventType){
			return $http.get(baseUrl+ "/categories/"+id+"?parent="+parent+"&status="+status+"&cateegoryType="+eventType);
		},
		saveCategory : function(data){
			return $http.post(baseUrl+ "/categories/create", data);
		},

		getLogDevices : function(){
			return $http.get("/siem-core/user/deviceType/");
		},
		getAllSimpleEvents: function(){
			return $http.get(baseUrl+ "/simple-events");
		},
		loadSingleEvent: function(id){
			return $http.get(baseUrl+ "/"+id);
		},
		getLogTypes : function(logDevice){
			return $http.get("/siem-core/user/logTypes/devices?logDevice="+logDevice);
		},
		getLogFields: function(logDevice){
			return $http.get("/siem-core/user/logField/devices-mapping-fields?logDevice="+logDevice);
		},
		
		createEvent : function(data){
			return $http.post(baseUrl+"/create",data);
		},

		deleteTags : function(id){
			return $http.delete(baseUrl+ "/"+id);
		},
		promoteEvent : function(id){
			return $http.post(baseUrl+ "/"+id+"/promote");
		},
		deleteCategory : function(id){
			return $http.post(baseUrl+ "/deletecategories",id);
		},
		deleteEvent : function(id){
			return $http.delete(baseUrl+ "/"+id);
		},
		getAllEvents : function(){
			return $http.get(baseUrl+ "/events");
		},
		getAllCategories : function(){
			return $http.get(baseUrl+"/getCategories")
		},
		enableDisableEvents : function(data,status){
			return $http.post(baseUrl+"/enableDisableEvent/"+status,data);
		},
		deleteSelectedEvents : function(ids){
			return $http.post(baseUrl+"/deleteMultiple",ids);
		},
		getComplexEvents : function(){
			return $http.get(baseUrl+ "/getComplexEvents");
		},
		loadReferenceSets : function(){
			return $http.get("/siem-core/user/reference-set/");
		},saveAlerts:function(data){
			return $http.post(baseUrl+ "/saveAlerts",data);
		},deleteAlertForRule : function(id){
			return $http.delete(baseUrl+"/deleteAlert/"+id);

		},
		getEventMappings:function(id){
			return $http.get("/siem-core/user/events/event_mappings/"+id);
		},
		saveEventMappings:function(data){
			return $http.post("/siem-core/user/events/event_mappings/"+data.logParserId+"/save",data);
		},
		deleteEvents : function(id,data){
			return $http.post("/siem-core/user/events/event_mappings/"+id+"/delete",data);
		},
		getAlerts : function(){
			return $http.get(baseUrl+"/getAlerts");
		},
		showEventTemplates:function(id){
			return $http.get("/siem-core/user/events/event_templates/"+id);
		},
		saveEventTemplates:function(data){
			return $http.post("/siem-core/user/events/event_templates/save",data);
		},
		deleteEventTemplates:function(data){
			return $http.post("/siem-core/user/events/event_templates/delete",data);
		},
		getAllEventMappings : function(){
			return $http.get("/siem-core/user/events/event_mappings/");
		},
		getRuleGroups : function(){
			return $http.get("/siem-core/user/events/groups/");
		},
		createGroup : function(data){
			return $http.post("/siem-core/user/events/groups/save",data);
		},
		deleteGroup: function(id){
			return $http.delete("/siem-core/user/events/groups/"+id);
		},
		getAllFields : function(){
			return $http.get("/siem-core/user/logField/getAllFields/")
		}
	}
}]);