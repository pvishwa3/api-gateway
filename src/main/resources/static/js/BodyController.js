app.controller("bodyController", ['$scope','$rootScope','$timeout','$location','$uibModal','$http','$window','Auth','$sessionStorage', function ($scope,$rootScope, $timeout,$location,$uibModal,$http,$window,Auth,$sessionStorage) {

	
	
	$scope.themeType = "light";
	
	$scope.loadDefaultTheme = function(bodyCss,htmlCss){
		$scope.bodyCss = bodyCss
		$scope.htmlCss = htmlCss
	}
	
	$scope.loadDefaultTheme("body","html")
	
}]);