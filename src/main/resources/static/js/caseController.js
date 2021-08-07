
app.controller("casenewController",['$scope', 'widgetService','$rootScope','$timeout','$uibModal','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$ngConfirm','$location','$routeParams','Fullscreen','$route','$interval','$window','tagService','$sessionStorage','colorConfigurationFactory',function ($scope, widgetService,$rootScope, $timeout,$uibModal,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$ngConfirm,$location,$routeParams,Fullscreen,$route,$interval,$window,tagService,sessionStorage,colorConfigurationFactory) {

	var self = this;

	$scope.editMode = false;
	var data = this.data = {};
	
	
	var dashboardDetails = sessionStorage.user.dashboarDetails;
	for(var i=0;i<dashboardDetails.length;i++){
		if(dashboardDetails[i].name === 'Cases'){
			window.location.href = "/configuration#!/dashboard-new?id="+dashboardDetails[i].id;
		}
	}

	
}]);


