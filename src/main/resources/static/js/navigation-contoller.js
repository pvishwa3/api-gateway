app.controller("navigationContoller", ['$scope','$rootScope','$timeout','$location','$uibModal','Auth','$sessionStorage','$window','settingsFactory','caseFactory','$location','$route','userSettingsFactory',function ($scope,$rootScope, $timeout,$location,$uibModal,Auth,$sessionStorage,$window,settingsFactory,caseFactory,$location,$route,userSettingsFactory) {

	$scope.themeOn = true;
	if(angular.equals($window.localStorage.getItem("themeType"),"white")){
		$scope.themePath = "../assets/css/demo_3/style_white.css";
		$scope.themeOn = false;
	}else{
		$scope.themePath = "../assets/css/demo_3/style.css";
		$scope.themeOn = true;
	}
	$rootScope.dashboardFilters = [];
	$scope.isDashboadPage= true;

	$scope.dashboardName = "";

	$scope.startDate = moment(new Date()).subtract(6, 'hours').valueOf();
	$scope.endDate = moment(new Date()).valueOf();

	$scope.theme = $window.localStorage.getItem("themeType") === 'white'?'Light':'Dark';
	var self = this;

	window.location.href = "/configuration#!/menusettings"

    $scope.userName = "";

	$scope.showCal = true;

	$scope.$on('themeChanged', function(theme) {
		$scope.isDashboadPage= true;
	});

    $scope.getCurrentUserDetails = function(){

        userSettingsFactory.getUserDetails().then(function (response) {
            if(response.status === 200){
                $scope.userName = response.data.userDisplayName
            }
        }, function (error) {
        	$scope.status = 'Unable to load customer data: ' + error.message;
        });

    }
    $scope.getCurrentUserDetails();

	$scope.openAlerts = function(){
		var dashboardDetails = JSON.parse($window.localStorage.getItem("user-dashboards"));
		for(var i=0;i<dashboardDetails.length;i++){
			if(dashboardDetails[i].text.toLowerCase() === 'alerts'){
				window.location.href = "/configuration#!/dashboard-new?id="+dashboardDetails[i].id;
			}
		}

	}

	$scope.openCases = function(){
		var dashboardDetails = JSON.parse($window.localStorage.getItem("user-dashboards"));
		for(var i=0;i<dashboardDetails.length;i++){
			if(dashboardDetails[i].text.toLowerCase() === 'cases'){
				window.location.href = "/configuration#!/dashboard-new?id="+dashboardDetails[i].id;
			}
		}

	}

	$scope.openCompanyList = function(){
		settingsFactory.getOrgsForCurrentLoginedUser().then(function (response) {
			$scope.companyDetails = response.data;
			$("#show-orgs").modal();
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	$scope.openDashboards = function(){

		$scope.isDashboadPage= true;

		for (var key in $scope.publicShares){
			if($scope.publicShares[key][0]){
//				$window.location.href = "/configuration#!/dashboard-new?id="+$scope.publicShares[key][0].id
			}
			//$scope.publicShares
		}
	}

	$scope.companyDetails = [];

	$scope.loadAllCompines = function(){
		settingsFactory.getCurrentOrgs().then(function (response) {
			$scope.companyDetails = angular.copy(response.data)
		}, function (error) {
			if(error.status== 403){
				self.deleteMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.deleteMessages = [];
				}, 2000);
			}
		});
	}

	$scope.loadAllCompines();

	$scope.openCompany = function(){
		$("#company-model").modal();
	}

	$scope.companyDetails = {companyName:""};
	
	$scope.swithToDiffCompany = function(companyName){
		
		settingsFactory.switchToDifferentCompany($scope.companyDetails.companyName).then(function (response) {
			if(response.data.status){
				$window.location.reload();
			}

		}, function (error) {
			if(error.status== 403){
				self.deleteMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.deleteMessages = [];
				}, 2000);
			}
		});

	}


	$scope.$on('changeThemeToNormal', function(theme) {
		$scope.isDashboadPage= false;
	});

	$scope.$on('$locationChangeStart', function( event ) {
		$("html").css("overflow","");
//		var presentUrl= $location.absUrl();
//		console.log(presentUrl);
//		$scope.isDashboards={active:""};
//		$scope.isDashboardsAlerts = {active:""};
//		$scope.isDashboardsCases = {active:""};
//		$scope.isInvestigations = "";
////		$scope.isReports = "";
//		$scope.isHistorical = "";
//		$scope.isSettings = "";

//		if(presentUrl.includes("dashboard-new")){
//		if(presentUrl.endsWith("18536")){
//		$scope.isDashboardsAlerts.active = "active";
//		}else if(presentUrl.endsWith("16066")){
//		$scope.isDashboardsCases.active = "active";
//		}else{
//		$scope.isDashboards.active = "active";
//		}
//		}else if(presentUrl.includes("investigations")){
//		$scope.isInvestigations = "active";
//		}else if(presentUrl.includes("search")){
//		$scope.isHistorical = "active";
//		}else if(presentUrl.includes("menusettings")){
//		$scope.isSettings = "active";
//		}
//		if(presentUrl.includes("dashboard-new") || angular.equals(presentUrl,"/alerts") || angular.equals(presentUrl,"/cases")){
//		if($window.localStorage.getItem("dashboard-themeType")==='theme-navy'){
//		$scope.themeOn  = false;
//		$scope.imgPath="assets/images/ozone_white.png"
//		$scope.themePath = "";
//		}else{
//		$scope.themeOn  = true;
//		$scope.imgPath="assets/images/ozone_dark.png";
//		$scope.themePath = "assets/css/themes/type-full/theme-dark-full.css";
////		$window.localStorage.setItem("dashboard-themeType",'theme-dark-full');				
//		}
//		}else{
////		if($window.localStorage.getItem("themeType")==='theme-dark-full'){
////		$scope.themeOn  = true;
////		$scope.imgPath="assets/images/ozone_dark.png";
////		$scope.themePath = "assets/css/themes/type-full/theme-dark-full.css";
////		}else{	
//		$scope.themeOn  = false;
//		$scope.imgPath="assets/images/ozone_white.png";
//		$scope.themePath = "";
////		$window.localStorage.setItem("themeType",'theme-navy')
////		}
//		}
	});

	//$rootScope.$broadcast('changeThemeToNormal');

	$scope.loadDashboard = function(dashboardName){
		var dashboardDetails = $sessionStorage.user.public.All;
		for(var i=0;i<dashboardDetails.length;i++){
			if(dashboardDetails[i].name.toLowerCase() === dashboardName.toLowerCase()){
				window.location.href = "/configuration#!/dashboard-new?id="+dashboardDetails[i].id;
			}
		}
	}

	$scope.navigateToDashboard = function(id,name){
		$scope.isDashboadPage= true;
		$scope.dashboardName = name;
		window.location.href = "/configuration#!/dashboard-new?id="+id;


	}

	$scope.logout = function(){
		Auth.logout();
		window.location.href = "/logout"
	}

	$scope.getUsersInProgressCases = function(){
		var data = {"userName":$sessionStorage.user.userName,status:"Inprogress"}
		caseFactory.getCasesByUserStatus(data).then(function(response){
			$scope.casesList = angular.copy(response.data);
			$scope.viewCaseByUserName = $sessionStorage.user.userName;
		},function(error){

		});
	}

	$scope.toggleOn = function(themeOn){
		if(themeOn){
			changeTheme('dark')
		}else{
			changeTheme('white')
		}
	}





	function changeTheme(type) {
		$window.localStorage.setItem("themeType", type);
		$window.location.reload();
	};





//	$scope.userHomePage = "/configuration#!/dashboard?id=6419";
	userSettingsFactory.getSavedSettings().then(function(response){
		if(!($scope.userHomePage.homePage == undefined)){
			$scope.userHomePage = $scope.userHomePage.homePage;
		}else{
			$scope.userHomePage = "/configuration#!/dashboard?id=6419";
		}
	});


	$scope.forward = function(){
		window.history.forward();		
	}

	$scope.backWard = function(){
		window.history.back();
	}

	$("#color-chooser-delete").click(function(){
		$("#constext-menu-div").hide();
	});

	$scope.showsubMenu =function(){
		$("body.nimbus-is-editor.sidebar-icon-only div#page-layouts1").css("height",$(window).height()-450+"px");
		$("body.nimbus-is-editor.sidebar-icon-only div#page-layouts1").css("overflow-y","scroll")
		$("body.nimbus-is-editor.sidebar-icon-only div#page-layouts1").css("overflow-x","hidden")
	}
	$(".navbar-toggler" ).on('click', function(){
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 400);
	});
	$("#page-layouts").hover(function() {
		$(this).parent().addClass('hover-open');
	});

}]);


app.filter('removeSpaces',function(){
	return function(str) {
		return str.replace(/[\s]/g, '');
	};
});

