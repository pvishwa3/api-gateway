app.controller("smtpConfig", ['$scope', 'settingsFactory','$rootScope','$timeout','$location','$uibModal','$sce','$window', '$sessionStorage','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$sessionStorage','$ngConfirm','fileUpload','logDevicesFactory', function ($scope, settingsFactory,$rootScope, $timeout,$location,$uibModal,$sce,$window,$sessionStorage,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$sessionStorage,$ngConfirm,fileUpload,logDevicesFactory) {
	var self = this;

	self.smtpConfig = {id:0,fromEmailAddress:'',emailPrefix:'',protocol:'',hostName:'',port:'',timeOut:'',username:'',password:''};
	self.alertMessagaes = [];
	
	self.loadEmailConfig = function(){
		settingsFactory.loadEmailConfig().then(function (response) {

			if(response.data){
				self.smtpConfig = angular.copy(response.data);
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

	self.loadEmailConfig();

	self.testEmailConfig = function(){
		settingsFactory.testEmailConfig(self.smtpConfig).then(function (response) {

			self.alertMessagaes.push({ type: 'success', msg: "Connection Was Succesfull." });

			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);

		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
			if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}
	
	
	self.enableOrDisable = function(){
		settingsFactory.enableOrDisable().then(function (response) {

			self.alertMessagaes.push({ type: 'success', msg: "Successfully updated the config" });

			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);

		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
			if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}
	
	self.saveConfig = function(){
		settingsFactory.saveConfig(self.smtpConfig).then(function (response) {

			self.alertMessagaes.push({ type: 'success', msg: "Successfully updated the config" });

			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);

		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
			if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}


}]);

