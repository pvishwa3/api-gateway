app.controller("settings", ['$scope', 'settingsFactory','$rootScope','$timeout','$location','$uibModal','$sce','$window', '$sessionStorage',function ($scope, settingsFactory,$rootScope, $timeout,$location,$uibModal,$sce,$window,$sessionStorage) {
	var self = this;
	
	
	var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

	$scope.userSettings = {password:'',newPassword:'',confirmPassword:'',userName:'',firstName:'',lastName:'',middleName:'',accessToken:'',company:'',planType:'',id:''};
	$scope.userOperationType = "";

	$scope.s3Settings = {id:'',s3BucketName:'',s3AccessKey:'',s3AccessPassword:'',status:''};
	
	self.alertMessagaes = [];

	$scope.UserName = $sessionStorage.user.userName;
	$scope.closeAlert = function(index) {
		self.alertMessagaes.splice(index, 1);
	};
	
	$scope.templateUrl = "general-settings.html"
	
	$scope.refreshFields = function(){
		
		settingsFactory.refreshFields().then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "All fileds are refreshed" });
			}
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
		
		
	}
		
		
	$scope.openNavigation = function(url){
		if(url==="users.html"){
			settingsFactory.getUsersWithInCompany($sessionStorage.user.companyName).then(function (response) {
				self.allUsers = response.data;
			}, function (error) {
				$scope.status = 'Unable to load customer data: ' + error.message;
			});
		}
		$scope.templateUrl = url;
	}
		

	settingsFactory.getUserInformation().then(function (response) {
		self.userDetails = response.data;
	}, function (error) {
		$scope.status = 'Unable to load customer data: ' + error.message;
	});


	$scope.changePasswordAfterLogin = function(){
		self.alertMessagaes = [];
		if($scope.userSettings.newPassword!=$scope.userSettings.confirmPassword){
			self.alertMessagaes.push({ type: 'danger', msg: "New Password and Confirm Password must match." });
			return false;
		}
		if(!strongRegex.test($scope.userSettings.newPassword)){
			self.alertMessagaes.push({ type: 'danger', msg: "This password does not meet all the requirements. Please enter another password." });
			return false;
		}

		settingsFactory.changePasswordAfterLogin($scope.userSettings).then(function (response) {

			if(response.data.status){
				window.location.href = "/configuration#!/kibana"
			}else{
				self.alertMessagaes.push({ type: 'danger', msg:  response.data.error});
			}

		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	$scope.saveChanges = function(){
		self.alertMessagaes = [];
		if($scope.userSettings.newPassword!=$scope.userSettings.confirmPassword){
			self.alertMessagaes.push({ type: 'danger', msg: "New Password and Confirm Password must match." });
			return false;
		}
		if(!strongRegex.test($scope.userSettings.newPassword)){
			self.alertMessagaes.push({ type: 'danger', msg: "This password does not meet all the requirements. Please enter another password." });
			return false;
		}

		settingsFactory.changePassword($scope.userSettings).then(function (response) {

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "Successfully changed the password" });
				$scope.userSettings = {password:'',newPassword:'',confirmPassword:'',userName:'',fullName:'',accessToken:'',company:'',planType:''};
				$("#change-password-modal").hide();
				$("div.modal-backdrop").remove();
			}else{
				self.alertMessagaes.push({ type: 'danger', msg:  response.data.error});
			}

		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});


	}

	$scope.closeDailog = function(){


		$scope.userSettings = {password:'',newPassword:'',confirmPassword:''};

	}

	$scope.currentTab = "home";
	$scope.active = "active"

		$scope.openActiveTab = function(tab){
		if(tab==="users"){
			settingsFactory.getUsersWithInCompany($sessionStorage.user.companyName).then(function (response) {
				self.allUsers = response.data;
			}, function (error) {
				$scope.status = 'Unable to load customer data: ' + error.message;
			});

		}
		if(tab==="billing"){
			settingsFactory.getUsageDetails().then(function (response) {

				$scope.options = {
						chart: {
							type: 'pieChart',
							height: 500,
							x: function(d){return d.key;},
							y: function(d){return d.y;},
							showLabels: true,
							duration: 500,
							labelThreshold: 0.01,
							labelSunbeamLayout: true,
							legend: {
								margin: {
									top: 5,
									right: 35,
									bottom: 5,
									left: 0
								}
							}
						}
				};


				$scope.linChartOptions = {
						chart: {
							type: 'lineChart',
							height: 450,
							margin : {
								top: 20,
								right: 20,
								bottom: 40,
								left: 55
							},
							x: function(d){ return d.x; },
							y: function(d){ return d.y; },
							useInteractiveGuideline: true,
							dispatch: {
								stateChange: function(e){ console.log("stateChange"); },
								changeState: function(e){ console.log("changeState"); },
								tooltipShow: function(e){ console.log("tooltipShow"); },
								tooltipHide: function(e){ console.log("tooltipHide"); }
							},
							xAxis: {
								axisLabel: 'Date',
								tickFormat: function (d) {

									return d3.time.format("%d-%m")(new Date(d));

								},
							},
							yAxis: {
								axisLabel: 'Data in Kb',
								tickFormat: function(d){
									return d3.format('.02f')(d);
								},
								axisLabelDistance: -10
							},

						},
						title: {
							enable: true,
							text: 'Last Seven Days Uasage'
						}

				};


				$scope.data = response.data.indexStaticsType;
				$scope.lineChartData =  [{
					values: response.data.dailyUsage, //values - represents the array of {x,y} data points
					key: 'Time Frame', //key  - the name of the series.
					color: '#ff7f0e', //color - optional: choose your own line color.
					strokeWidth: 2,

				}];




			}, function (error) {
				$scope.status = 'Unable to load customer data: ' + error.message;
			});
		}

		$scope.currentTab = tab;
	}

	$scope.createUsers = function(){
		$scope.userSettings.planType = self.userDetails.planName;
		$scope.userSettings.accessToken = self.userDetails.accessToken;
		$scope.userSettings.company = self.userDetails.companyName;

		if($scope.userOperationType === "insert"){
			settingsFactory.createUsers($scope.userSettings).then(function (response) {
				self.allUsers = response.data;
			}, function (error) {
				$scope.status = 'Unable to load customer data: ' + error.message;
			});
		}
		if($scope.userOperationType === "update"){
			settingsFactory.updateUser($scope.userSettings).then(function (response) {
				if(response.data.errors.length!=0){
					for(var i=0; i<response.data.errors.length;i++){
						self.alertMessagaes.push({ type: 'error', msg: response.data.errors[i].message });
					}

				}else{
					self.alertMessagaes.push({ type: 'success', msg: response.data.message });

				}
				location.reload();


			}, function (error) {
				$scope.status = 'Unable to load customer data: ' + error.message;
			});
		}


	}

	$scope.displayCreateUserTemplate = function(){
		$scope.userSettings = {password:'',newPassword:'',confirmPassword:'',userName:'',firstName:'',lastName:'',middleName:'',accessToken:'',company:'',planType:''};
		$scope.userOperationType = "insert";
		$("#create-user-modal").modal();
	}

	$scope.openPasswordDialog = function(){
		$("#change-password-modal").modal();
	}


	$scope.deleteUser=function(username){
		settingsFactory.deleteUser(username).then(function (response){
			
			if(response.data.errors.length!=0){
				for(var i=0; i<response.data.errors.length;i++){
					self.alertMessagaes.push({ type: 'error', msg: response.data.errors[i].message });
				}

			}else{
				self.alertMessagaes.push({ type: 'success', msg: response.data.message });

			}
			
		});
	}
	
	$scope.upgradeAccount = function(){
		window.location.href = "/configuration#!/upgrade";
	}
	

	$scope.displayUpdateUser=function(userId){
		$scope.userOperationType = "update";
		$("#create-user-modal").modal();
		for(var i = 0; i < self.allUsers.length; i++){
			if(self.allUsers[i].id === userId) {
				$scope.userSettings = angular.copy(self.allUsers[i]);
				break;
			}
		}


	}


	$scope.saveChanges=function(){

		settingsFactory.updateUser($scope.userSettings).then(function(response){
		},function(err){

		});
	}
}]);