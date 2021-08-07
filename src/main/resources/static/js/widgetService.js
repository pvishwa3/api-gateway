app.factory('widgetService', ['$http', function($http) {
	var baseUrl = "/siem-core/widget";

	return {
		preview : function(data){
			return $http.post(baseUrl+"/perview",data);
		},
		saveDetails : function(data){
			return $http.post(baseUrl+"/save",data);
		},
		
		saveColors : function(data){
			return $http.post(baseUrl+"/update-options",data);
		},
		
		loadWidgets : function(){
			return $http.get(baseUrl+"/loadWidgets");
		},

		
		getAllConditions : function(){
			return $http.get("/siem-core/user/condition/");
		},
		
		loadSingleWidget : function(id,startDate,endDate,query,queryString,currentCompany){
			var data = {'startDate':startDate,'endDate':endDate,'query':query,'queryString':queryString,companyName:currentCompany};
			return $http.post(baseUrl+"/loadSingleWidget/"+id,data);
		},
		
		loadSingleWidgetForReport : function(id,startDate,endDate,query,queryString,currentCompany){
			var data = {'startDate':startDate,'endDate':endDate,'query':query,'queryString':queryString,companyName:currentCompany};
			return $http.post("http://localhost:8999/widget/loadSingleWidgetForReport/"+id,data);
		},
		
		loadAllThemes : function(){
			return $http.get(baseUrl+"/loadAllThemes/");
		},
		loadSingleTheme :  function(id){
			return $http.get(baseUrl+"/loadSingleTheme/"+id);
		},
		loadMappingFields : function(){
			return $http.get("/siem-core/user/elasticsearch/getallfiledsforindex/");
			
		},
		loadDrillDownForWidget : function(id,startDate,endDate,drillDownQuery){
			return $http.get(baseUrl+"/loadSingleWidget/"+id+"/drilldown?startDate="+startDate+"&endDate="+endDate+"&queryString="+drillDownQuery);
		},
		saveDashboard : function(data){
			return $http.post(baseUrl+"/save_dashboard",data);
		},
		loadAllDashboards : function(){
			return $http.get(baseUrl+"/load_all_dahsboards");
		},
		deleteDashboard: function(id){
			return $http.delete(baseUrl+"/delete_dashboard/"+id);
		},
		loadSingleDashboard: function(id){
			return $http.get(baseUrl+"/load-single-dashboard/"+id);

		},
		loadSingleDashboardForReport: function(id){
			return $http.get("http://localhost:8999/widget/load-single-dashboard-report/"+id);

		},
		
		deleteWidget: function(id){
			return $http.delete(baseUrl+"/delete_widget/"+id);
		},
		getAllTopics : function(){
			return $http.get("/siem-core/widget/loadAllTopics/");
		},
		loadPermissions:function(){
			return $http.get("/siem-core/user/loadPermissions")
		},
		
		loadRules : function(){
			return $http.get("/siem-core/user/correlation/getCorrelationdetails")
			
		},

		saveDashboardPerf : function(data){
			return $http.post("/siem-core/widget/save-dashboards-perf",data)
		},
		getExistingDashboardTabs : function(){
			return $http.get("/siem-core/widget/get-existing-dashboards")
		},
		deleteDashboardUserPref : function(dashboardName){
			return $http.delete("/siem-core/widget/delete-dashboards-perf?dashboardName="+dashboardName)
		},
		updateOptions : function(data){
			return $http.post(baseUrl+"/updateOptions",data);
		},
		loadEventsData: function(data){
			return $http.post("/siem-core/widget/load-events",data);
		},
		loadRulesData:function(data){
			return $http.post("/siem-core/widget/load-notables",data);
		},
		loadDashboardCategories:function(){
			return $http.get("/siem-core/widget/dashboard/getAllCategories")
		},
		saveCategory:function(data){
			return $http.post("/siem-core/widget/dashboard/saveCategory",data);
		},
		getChildCategories:function(id,parent){
			return $http.get("/siem-core/widget/dashboard/categories/"+id+"?parent="+parent);
		},
		deleteCategory : function(id){
			return $http.delete("/siem-core/widget/dashboard/categories/"+id);
		},
		getCurrentCompanies:function(){
			return $http.get("/siem-core/secure/organization/")
		},
		getAccessList : function(){
			return $http.get("/siem-core/user/getAccessList/")
		},
		shareDashboard : function(data){
			return $http.post("/siem-core/widget/dashboard/share",data)
		},
		updateRoles:function(data){
			return $http.post("/siem-core/widget/dashboard/share/update",data)
		},
		deleteRoles:function(id){
			return $http.delete("/siem-core/widget/dashboard/share/"+id)
		},
		saveReprts:function(data){
			return $http.post("/siem-core/user/report/save-report-scheduler",data)
		},
		deleteReports:function(id){
			return $http.delete("/siem-core/user/report/delete-single-scheduler/"+id)
		},
		downloadAsExcel:function(id,data){
			return $http.post("/siem-core/widget/download-dashboard-excel/"+id,data,{ responseType: "blob" })
		},
		saveDashboardTime:function(data){
			return $http.post(baseUrl+"/save_timerange",data)
		},
		saveActiveDashboard:function(data){
			return $http.post(baseUrl+"/change_activedashboard",data)
		},
		getTimeSeriesData:function(data){
		    return $http.post("/siem-core/user/historical/time-series",data)
		},
		getHistoricalData:function(data){
            return $http.post("/siem-core/user/historical/",data)
         },
        saveSearches:function(data){
             return $http.post("/siem-core/user/historical/save_search",data)
        },
        getSavedSearches:function(){
             return $http.get("/siem-core/user/historical/get-save-searches")
        }

	}
}]);