app.controller("kibanaController", ['$scope', 'kibanaFactory','$rootScope','$timeout','$location','$uibModal','$sce','$window','$routeParams','$sessionStorage', function ($scope, kibanaFactory,$rootScope, $timeout,$location,$uibModal,$sce,$window,$routeParams,$sessionStorage) {

$timeout(function(){
	

	if(window.location.href.indexOf("dashboard?id")!=-1){
		console.log($routeParams.id)

		//$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$window.localStorage.getItem('token')+"&displayType=singleDashboard&dashboardId="+$routeParams.id, title:""};

		$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/app/kibana#/dashboard/"+$routeParams.id+"?token="+$window.localStorage.getItem('token')+"&companyName="+$window.localStorage.getItem('companyName'), title:""};

	}else if(window.location.href.indexOf("viewdashboards")!=-1){
		//$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$window.localStorage.getItem('token')+"&displayType=dashboard", title:""};

		$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/app/kibana#/dashboards?_g=()&token="+$window.localStorage.getItem('token'), title:""};
	}
	else if(window.location.href.indexOf("viewvisualizations")!=-1){
		//$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$window.localStorage.getItem('token')+"&displayType=visualize", title:""};

		
		 //url = `${APP_ROOT}/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(columns:!(_source),index:'0f39f190-2057-11e9-824c-c720f2726dd8',interval:auto,query:(language:lucene,query:'"+searchQuery+"'),sort:!('@timestamp',desc))`
		$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/app/kibana#/visualize?_g=()&token="+$window.localStorage.getItem('token'), title:""};
	}
	else if(window.location.href.indexOf("management")!=-1){
		$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$window.localStorage.getItem('token')+"&displayType=management", title:""};

	}
	else if(window.location.href.indexOf("searchId")!=-1){
		$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$sessionStorage.user.userName+"&displayType=searchId&searchId="+$routeParams.searchId, title:""};

	}
	else{
		//$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$window.localStorage.getItem('token')+"&displayType=search", title:""};
		if($routeParams.query && $routeParams.startDate &&  $routeParams.endDate){
			
			var startDate =  moment(new Date(Number($routeParams.startDate))).format('YYYY-MM-DD[T]HH:mm:ss');
			var endDate =    moment(new Date(Number($routeParams.endDate))).format('YYYY-MM-DD[T]HH:mm:ss');
			
			$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$sessionStorage.user.userName+"&companyName="+$sessionStorage.user.companyName+"&displayType=search&startDate="+startDate+"&endDate="+endDate+"&filterQuery="+$routeParams.query, title:""};
		}else if($routeParams.query){
			$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$sessionStorage.user.userName+"&companyName="+$sessionStorage.user.companyName+"&displayType=search&filterQuery="+$routeParams.query, title:""};
		}else{
			$scope.kibanaUrl = {src:"https://demo.obelus.us:5601/login?token="+$sessionStorage.user.userName+"&companyName="+$sessionStorage.user.companyName+"&displayType=search", title:""};

		}

	}
$("body").addClass("nimbus-is-editor sidebar-icon-only");
},$sessionStorage.user == undefined?3000:0);

	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}


	//$scope.token = "https://demo.obelus.us:5601/searchguard/login?token="+$window.localStorage.getItem('token');



}]);
