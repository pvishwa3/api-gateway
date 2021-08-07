app.controller("spaceController", ['$scope', 'sapcesFactory', '$rootScope', '$timeout', '$uibModal', '$filter', '$http', '$window', '$ngConfirm', '$sessionStorage', '$location','fileUpload','$routeParams','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','Auth', function ($scope, sapcesFactory, $rootScope, $timeout, $uibModal, $filter, $http, $window, $ngConfirm, $sessionStorage, $location,fileUpload,$routeParams,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,Auth) {

	var self = this;

	self.alertMessagaes = [];
	self.spaceMessages = [];
	$scope.canCreateGlobalSpace = false;
	$scope.canEditGlobalSpace = false;
	$scope.canDeleteGlobalSpace = false;
	$scope.canCreatePrivateSpace = false;
	$scope.canEditPrivateSpace = false;
	$scope.canDeletePrivateSpace = false;
	$scope.canPromoteSpace = false;
	
	$scope.showHomeButton = true;
	
	$scope.action = "insert";

	$scope.spaceDetails = {id:0,spaceName:'',spaceIdentifier:'',description:'',spaceType:''}

	$scope.shareDetails = {entityId:0,shareType:'',param1:'',param2:'',subCompanyshareType:'', permissions:'',dashboards:''};

	self.groupModel = [];
	self.usersModel = [];
	self.dashboardsModal = [];
	
	
//	$scope.vm = {};
//	$scope.vm.dtInstance = {};  
//	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withColVis().withDisplayLength(25).withOption('order', [1, 'asc'])
//	.withOption('lengthMenu', [25,50, 100, 150, 200]);
//	$scope.vm.dtColumns  = [DTColumnBuilder.newColumn('id').withTitle('Name'),
//						        DTColumnBuilder.newColumn('firstName').withTitle('Description'),
//						        DTColumnBuilder.newColumn('lastName').withTitle('Created')];
	
	
	self.loadPermissions = function(){

		loader("body");

		sapcesFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("create global space")!=-1){
				$scope.canCreateGlobalSpace = true;
			}


			if(response.data.indexOf("update global space")!=-1){
				$scope.canEditGlobalSpace = true;
			}
			if(response.data.indexOf("delete global space")!=-1){
				$scope.canDeleteGlobalSpace = true;
			}
			if(response.data.indexOf("create private space")!=-1){
				$scope.canCreatePrivateSpace = true;
			}

			if(response.data.indexOf("update private space")!=-1){
				$scope.canEditPrivateSpace = true;
			}
			if(response.data.indexOf("delete private space")!=-1){
				$scope.canDeletePrivateSpace = true;
			}
			
			if(response.data.indexOf("promote space")!=-1){
				$scope.canPromoteSpace = true;
			}
			
			



			unloader("body");


		},function(error){
			unloader("body");
		});
	}

	$scope.promoteSpace = function(id){
		
	}


	self.getPublicSpaces = function(){
		sapcesFactory.getGlobalSpaces().then(function (response){
			self.publicSpacesDetails = response.data;

		},function(error){
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.sharePrivateSpace = function(id){

		$scope.shareDetails.entityId = id;

		self.usersModel = [];
		self.groupModel = [];
		sapcesFactory.getShareDetails(id).then(function (response) {
		
			//$scope.shareDetails = {entityId:0,shareType:'',param1:'',param2:'',subCompanyshareType:'', permissions:''};
			$scope.shareDetails.shareType = response.data[0].shareType;
			$scope.shareDetails.subCompanyshareType = response.data[0].subCompanyshareType;
			$scope.shareDetails.permissions = response.data[0].permissions;
			
			if(response.data[0].shareType==='user'){
				for(var i=0;i<self.userDetails.length;i++){
					
					var tempArray = response.data[0].param1.split(",")
					
					if(tempArray.indexOf(self.userDetails[i].id.toString())!=-1){
						self.usersModel.push({id:self.userDetails[i].id,userName:self.userDetails[i].userName})
					}
					
				}
			}
			if(response.data[0].shareType==='group'){
				for(var i=0;i<self.groups.length;i++){
					
					var tempArray = response.data[0].param1.split(",")
					
					if(tempArray.indexOf(self.groups[i].id.toString()!=-1)){
						self.groupModel.push({id:self.groups[i].id,name:self.groups[i].name})
					}
					
				}
			}
			
		});

		$("#shares-modal").modal();
		$timeout(function(){			
			$("input.ui-select-search.input-xs.ng-pristine.ng-untouched.ng-valid.ng-empty").css("width","318px")
		},250);		
		
	}

	self.isCompany = false;

	
	self.getSharedSpaces = function(){
		sapcesFactory.getSharedSpaces().then(function (response){
			self.sharedSpaceDetails = response.data;

		},function(error){
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	$scope.shareSpace = function(){

		var tempArray = [];

		for(var i=0;i<self.groupModel.length;i++){
			tempArray.push(self.groupModel[i].id);
		}

		for(var i=0;i<self.usersModel.length;i++){
			tempArray.push(self.usersModel[i].id);
		}

		if($scope.shareDetails.shareType == 'public'){
			$scope.shareDetails.param1 = 'public' ;
		}else{
			$scope.shareDetails.param1 = tempArray.join(',');
		}

		sapcesFactory.shareSpace($scope.shareDetails).then(function (response) {
			if(response.data.status){

				self.alertMessagaes.push({ type: 'success', msg: 'Space was updated successfully' });

				$("#shares-modal").modal('hide');
				self.getSharedSpaces();
				self.getPublicSpaces();
				self.getPrivateSpaces();
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.spaceMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					if(response.data.error.indexOf("constraint")!=-1){
						self.spaceMessages.push({ type: 'danger', msg: $scope.spaceDetails.spaceName +" should be unique" });
					}

				}
				$timeout(function () {
					self.spaceMessages = [];
				}, 2000);
			}


			unloader("body");
		}, function (error) {
			unloader("body");

			if(error.status== 403){
				self.spaceMessages.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.spaceMessages = [];
				}, 2000);
			}


		});
	}

	self.loadAllDashboards = function(){
		self.dashboards =[];
		sapcesFactory.loadAllDashboards().then(function (response){
			var tempResponse = angular.copy(response.data);
			for(var i=0;i<tempResponse.length;i++){
				var obj = {name:tempResponse[i].name,id:tempResponse[i].id};
				self.dashboards.push(obj);
			}
		
		},function(error){
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
		
	}

	$scope.loadDataBasedonShareType = function(){
		self.groupModel = [];
		self.usersModel = [];
		if($scope.shareDetails.shareType === 'company'){
			self.isCompany = true;
		}else{

			$scope.shareDetails.subCompanyshareType = ''
				self.isCompany = false;
		}
	}

	$scope.loadDataBasedonComapnyName = function(){
		self.groupModel = [];
		self.usersModel = [];
		if($scope.shareDetails.shareType === 'company'){


			self.loadUsersBasedOnCompanyName($scope.shareDetails.param2);
		}else{

			self.loadUsers();
		}
	}

	self.loadUsersBasedOnCompanyName = function(companyname){
		sapcesFactory.loadUsersBasedOnCompanyName(companyname).then(function (response){
			self.userDetails = response.data.userDetails;
			self.groups = response.data.groupDetails;


		},function(error){
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.loadUsers = function(){
		sapcesFactory.loadUsers().then(function (response){
			self.userDetails = response.data.userDetails;
			self.groups = response.data.groupDetails;
			self.companies = response.data.companyDetails;

		},function(error){
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.getPrivateSpaces = function(){
		sapcesFactory.getPrivateSpaces().then(function (response){
			self.privateSpacesDetails = response.data;

		},function(error){
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.dispalyEditForPublicSpaces = function(id){
		
		$scope.action = "update";
		self.dashboardsModal  = [];
		for(var i=0;i<self.publicSpacesDetails.length;i++){
			if(self.publicSpacesDetails[i].id===id){
				console.log(self.publicSpacesDetails[i]);
				$scope.spaceDetails = angular.copy(self.publicSpacesDetails[i]);
				self.dashboardsModal = self.publicSpacesDetails[i].dashboards;
				console.log(self.dashboardsModal);
				$("#spaces-modal").modal();
				$timeout(function(){			
					$("input.ui-select-search.input-xs.ng-pristine.ng-untouched.ng-valid.ng-empty").css("width","318px")
				},250);
				break;
			}
		}
	}

	self.dispalyEditForPrivateSpaces = function(id){
		$scope.action = "update";
		for(var i=0;i<self.privateSpacesDetails.length;i++){
			if(self.privateSpacesDetails[i].id===id){
				$scope.spaceDetails = angular.copy(self.privateSpacesDetails[i]);
				self.dashboardsModal = self.privateSpacesDetails[i].dashboards;
				$("#spaces-modal").modal();
				$timeout(function(){			
					$("input.ui-select-search.input-xs.ng-pristine.ng-untouched.ng-valid.ng-empty").css("width","318px")
				},250);
				break;
			}
		}
	}
	
	



	$scope.saveOrUpdateSpaces = function(){
		
		var tempArray = [];
		for(var i=0 ; i<self.dashboardsModal.length;i++){
			tempArray.push(self.dashboardsModal[i].id);
		}
//		$scope.spaceDetails.spaceType = 'public';
		$scope.spaceDetails.dashboards = tempArray.join(',')
		console.log($scope.spaceDetails.dashboards);
		sapcesFactory.saveOrUpdateSpaces($scope.spaceDetails).then(function (response) {
			if(response.data.status){

				self.alertMessagaes.push({ type: 'success', msg: 'Space was updated successfully' });


				self.getPublicSpaces();

				self.getPrivateSpaces();
				
				self.getSharedSpaces();

				Auth.login('', '')
				.then(function() {			
					$scope.publicShares = $sessionStorage.user.public;
					$scope.privateShares = $sessionStorage.user.private;
					$scope.shared = $sessionStorage.user.shared;
				});
				
				$("#spaces-modal").modal('hide');



				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.spaceMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					if(response.data.error.indexOf("constraint")!=-1){
						self.spaceMessages.push({ type: 'danger', msg: $scope.spaceDetails.spaceName +" should be unique" });
					}


				}
				$timeout(function () {
					self.spaceMessages = [];
				}, 2000);
			}


			unloader("body");
		}, function (error) {
			unloader("body");

			if(error.status== 403){
				self.spaceMessages.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.spaceMessages = [];
				}, 2000);
			}


		});
	}


	$scope.covnetToSpaceIndentifier = function(){
		$scope.spaceDetails.spaceIdentifier = $scope.spaceDetails.spaceName.replace(/\s+/g, '-');   
	}

	self.openSpaceModal = function(){
		$scope.action = "insert";
		$scope.spaceDetails = {id:0,spaceName:'',spaceIdentifier:'',description:'',spaceType:''}
		self.dashboardsModal = [];
		$("#spaces-modal").modal();
		$timeout(function(){			
			$("input.ui-select-search.input-xs.ng-pristine.ng-untouched.ng-valid.ng-empty").css("width","318px")
		},250);
	}

	self.deletePublicSpace = function(spaceId,spaceName,spaceType){

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+spaceName+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						sapcesFactory.deletePublicSpaces(spaceId).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Space was deleted successfully' });
								//toastr.success("Condition was deleted successfully")

								self.getPublicSpaces();


								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							if(!response.data.status){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.message });
								//toastr.success("Condition was deleted successfully")

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							unloader("body");

						}, function (error) {
							unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
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
	
	self.promoteSpace = function(spaceId,spaceName){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to promote private space to public <b>'+spaceName+'</b>  ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						
						var data = {id:parseInt(spaceId)}
						
						sapcesFactory.promoteSpace(data).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Space was promoted to public ' });
								//toastr.success("Condition was deleted successfully")

								self.init();


								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							if(!response.data.status){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.message });
								//toastr.success("Condition was deleted successfully")

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							unloader("body");

						}, function (error) {
							unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
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

	self.deletePrivateSpace = function(spaceId,spaceName,spaceType){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+spaceName+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						sapcesFactory.deletePrivateSpaces(spaceId).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Space was deleted successfully' });
								//toastr.success("Condition was deleted successfully")

								self.getPrivateSpaces();


								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							if(!response.data.status){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.message });
								//toastr.success("Condition was deleted successfully")

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							unloader("body");

						}, function (error) {
							unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
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

	self.init = function(){
		self.loadPermissions();
		self.getPublicSpaces();
		self.getPrivateSpaces();
		self.getSharedSpaces();
		self.loadUsers();
		self.loadAllDashboards();
	}

	
	self.goBack = function(){
		window.history.back();
	}
	
	$scope.publicDtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true)
	.withDOM("<'row'<'col-sm-4'l><'col-sm-3 width-200 pull-right'B><'col-sm-5 pull-right'f>>" +"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-5'i><'col-sm-7'p>>")
	.withPaginationType('full_numbers')
	.withDisplayLength(25)
	.withOption('scrollY', $( window ).height()-350)
	.withOption('scrollCollapse', true)	
	.withButtons([
		{
			extend: "colvis",
			columns: ':not([data-visible="true"])',
			titleAttr: 'Column Visibility'
		},{
            extend: 'collection',
            text: 'Export',
            buttons: [
            	 {
            		 extend:"csv",
            		 exportOptions: {
                         columns: [ 0, 1, 2, 3, 4, 5]
                     }
            	 }
            ]
        }
	]);
	
}]); 