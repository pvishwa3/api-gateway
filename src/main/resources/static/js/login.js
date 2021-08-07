var app = angular.module("loginApp",[]);
app.controller("loginController", ['$scope','$rootScope','$timeout','$location','$uibModal','$http','$window','Auth','$sessionStorage', function ($scope,$rootScope, $timeout,$location,$uibModal,$http,$window,Auth,$sessionStorage) {

	$scope.loginData = {username:'',password:''};

	$scope.isFaileMessage = false;
	
	$scope.submitData = function(){
		Auth.login($scope.loginData.username, $scope.loginData.password)
        .then(function() {
        	console.log($sessionStorage.user.status);
        	if($sessionStorage.user.status==="true"){
        		$window.localStorage.setItem("token",$sessionStorage.user.token)
    			if($sessionStorage.user.requiredPasswordChange==="true"){
    				window.location.href = "/change_password.html"
    			}else{
    				window.location.href = "/configuration#!/kibana"
    			}
        	}else{
        		$scope.isFaileMessage = true;
        	}
        	
        }, function() {
            $scope.isFaileMessage = true;
        });
	}

}]);
