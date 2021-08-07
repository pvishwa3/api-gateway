app.controller("domainTypeAttributeController", ['$scope', 'logDevicesFactory','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','conditionFactory', function ($scope, logDevicesFactory , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,conditionFactory) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	self.typeMapping =  {id:0,domainType:"",domainAttributes:"",propetyName:"",logFields:"",includeInContext:""};
	self.alertMessagaes =[];

	self.conditionCategories = [];

	self.logFields = [];
	
	self.confugrationDetails = [];
	self.logFieldsModel = [];
	
	self.logFieldsModelForProperty = [];

	self.canCreateDomainTypeAttribute = false;
	self.canUpdateDomainTypeAttribute = false;
	self.canDeleteDomainTypeAttribute = false;
	
	self.loadPermissions = function(){

		loader("body");

		conditionFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("add domain type attribute")!=-1){
				self.canCreateDomainTypeAttribute = true;
			}
			if(response.data.indexOf("update domain type attribute")!=-1){
				self.canUpdateDomainTypeAttribute = true;
			}
			if(response.data.indexOf("delete domain type attribute")!=-1){
				self.canDeleteDomainTypeAttribute = true;
			}


			unloader("body");

		


		},function(error){
			unloader("body");
		});
	}
	
	self.loadPermissions();
	
	
	$scope.templateUrl = "configurationDetails.html";
	self.loadLogFields = function(){
		self.logFields = [];
		logDevicesFactory.getAllLogFields().then(function(response){
			for(var i=0;i<response.data.length;i++){
				if(self.logFields.indexOf(response.data[i].fieldName)==-1){
					self.logFields.push(response.data[i].fieldName)
				}
				
				
			}
			
		});
	}
	
	self.loadConfigurations = function(){
		logDevicesFactory.loadConfigurations().then(function(response){
			self.confugrationDetails = response.data;
			
		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				$("#createNewTag").modal('hide');
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				$("#createNewTag").modal('hide');
			}

		});
	}
	
	

	self.init = function(){
		self.loadConfigurations();
		self.loadLogFields();
	}

	self.init();
	

	self.assosicateAttributesWithType = function(){
		self.typeMapping =  {id:0,domainType:"",domainAttributes:"",propetyName:"",logFields:""};
		self.logFieldsModel = [];
		self.logFieldsModelForProperty = [];
		$("#createConfiguration").modal()
	}

	

	
	self.edit = function(id){
		for(var i = 0; i < self.confugrationDetails.length; i++){
			if(self.confugrationDetails[i].id === id) {
				self.typeMapping = angular.copy(self.confugrationDetails[i]);
				
				self.logFieldsModel = self.typeMapping.domainAttributes.split(",");
				if(self.typeMapping.logFields){
					self.logFieldsModelForProperty = self.typeMapping.logFields.split(",");
				}
				
				break;
			}
		}

		$("#createConfiguration").modal()
		
	}

	self.conditionMessagesModal = [];
	self.submitData = function(){
		
		if(self.typeMapping.domainType===""){
			self.conditionMessagesModal.push({ type: 'danger', msg: "Domain Type is mandatory" });
			$timeout(function () {
				self.conditionMessagesModal.splice(0, 1);
				
			},500);
			return false;
		}
		if(self.logFieldsModel.length == 0){
			self.conditionMessagesModal.push({ type: 'danger', msg: "Attributes is mandatory" });
			$timeout(function () {
				self.conditionMessagesModal.splice(0, 1);
				
			},500);
			return false;
		}
		if(self.logFieldsModelForProperty.length == 0){
			self.conditionMessagesModal.push({ type: 'danger', msg: "Property is mandatory" });
			$timeout(function () {
				self.conditionMessagesModal.splice(0, 1);
				
			},500);
			return false;
		}
		if(self.typeMapping.propetyName === ""){
			self.conditionMessagesModal.push({ type: 'danger', msg: "Property is mandatory" });
			$timeout(function () {
				self.conditionMessagesModal.splice(0, 1);
				
			},500);
			return false;
		}
		
		
		
		
		self.typeMapping.domainAttributes = self.logFieldsModel.join(',');
		self.typeMapping.logFields = self.logFieldsModelForProperty.join(',')
		

		logDevicesFactory.saveConfiguration(self.typeMapping).then(function (response) {
				if(response.status===201){
					self.conditionMessagesModal.push({ type: 'success', msg: 'Configuration was Created Successfully' });
					$timeout(function () {
						self.conditionMessagesModal.splice(0, 1);
						$("#createConfiguration").modal('hide');
					},3000);

					self.init();
				}else{
					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){

							self.conditionMessagesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.conditionMessagesModal.push({ type: 'danger', msg: response.data.data });
					}
					$timeout(function () {
						self.conditionMessagesModal.splice(0, 1);
					}, 2000);
				}


			}, function (error) {
				if(error.status== 403){
					self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });

					$timeout(function () {
						self.conditionMessagesModal = [];
					}, 2000);
					$("#createNewTag").modal('hide');
				}else{
					self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.conditionMessagesModal = [];
					}, 2000);
					$("#createNewTag").modal('hide');
				}

			});
		
	}

	
	
	
	self.delete = function(id,name){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+name+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						//loader("body");
						logDevicesFactory.deleteConfiguration(id).then(function (response) {
							if(response.status===200){
								self.alertMessagaes.push({ type: 'success', msg: 'Mapping was deleted successfully' });
								//toastr.success("Condition was deleted successfully")

								self.init();


								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							
							

						}, function (error) {
							//unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}else{
								self.alertMessagaes.push({ type: 'danger', msg: error.data.error });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}

							$timeout(function () {
								self.alertMessagaes.splice(0, 1);
							}, 2000);
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});
	}

	
	
	self.goBack = function(){
		window.history.back();
	}

	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0).notSortable()
		];
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [1, 'asc']);
	
	self.selectedTags  = [];
	
	
	
	
	
}]);
