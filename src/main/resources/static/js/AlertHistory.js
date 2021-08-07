app.controller("alertHistory", ['$scope', 'alertsFactory','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$sessionStorage','fileUpload','corrleationFactory','$routeParams','tagService','colorConfigurationFactory','$compile','investigationPanelFactory',function ($scope, alertsFactory,$rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$sessionStorage,fileUpload,corrleationFactory,$routeParams,tagService,colorConfigurationFactory,$compile,investigationPanelFactory) {

	var self = this;
	
	self.workBench = {id:0,workBenchName:"",description:"",status:"",userNames:"",artifacts:"",createdDate:"",lastupdateDate:"",alertId:""};

	$rootScope.$broadcast('changeThemeToNormal');

	var data = this.data = {};

	var dashboardDetails = $sessionStorage.user.dashboarDetails;
	for(var i=0;i<dashboardDetails.length;i++){
		if(dashboardDetails[i].name === 'Alerts'){
			window.location.href = "/configuration#!/dashboard-new?id="+dashboardDetails[i].id;
		}
	}

}]);