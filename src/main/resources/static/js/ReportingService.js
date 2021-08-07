app.factory('reportingService', ['$http', function($http) {
	
	var baseUrl = "/siem-core/user/report";

	return {
		loadConditions : function(){
			return $http.get("/siem-core/user/condition/");
		},
		loadWidgets : function(){
			return $http.get("/siem-core/widget/loadWidgets");
		},
		saveOrUpdateReport : function(data){
			return $http.post("/siem-core/user/report/save-report",data);
		},
		loadReports : function(){
			return $http.get(baseUrl+"/");
		},
		loadSingleReport : function(id){
			return $http.get(baseUrl+"/loadsingle-report/"+id);
		},
		saveSchedulersReport : function(data){
			return $http.post(baseUrl+"/save-report-scheduler",data);
		},
		loadSchedulers : function(id){
			return $http.get(baseUrl+"/loadsingle-scheduler/"+id);
		},
		deleteSchedulers : function(id){
			return $http.delete(baseUrl+"/delete-single-scheduler/"+id);
		},
		deleteReport : function(id){
			return $http.delete(baseUrl+"/delete-report/"+id);
		},
		exportPdf : function(startDate,endDate,id){
			return $http.get(baseUrl+"/export/"+startDate+"/"+endDate+"/"+id);
		},
		getAllScheduledReports : function(){
			return $http.get(baseUrl+"/getAllScheduledReports");
		},
		disableReport : function(id){
			return $http.get(baseUrl+"/unschedule/"+id);
		},
		enableReport : function(id){
			return $http.get(baseUrl+"/schedule/"+id);
		},
		loadReportSchedules:function(){
			return $http.get(baseUrl+"/getAllScheduledReports");
		}

	}
}]);