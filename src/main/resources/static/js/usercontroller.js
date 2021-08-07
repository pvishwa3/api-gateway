app.controller("manageusercontoller", ['$scope', 'settingsFactory','$rootScope','$timeout','$location','$uibModal','$sce','$window', '$sessionStorage','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$sessionStorage','$ngConfirm','fileUpload','logDevicesFactory', function ($scope, settingsFactory,$rootScope, $timeout,$location,$uibModal,$sce,$window,$sessionStorage,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$sessionStorage,$ngConfirm,fileUpload,logDevicesFactory) {
	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    $scope.maskFields = [];

    $scope.documentFields = [];

$scope.canShowQueryCode = true;
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	$("#editOrg").hide();
	$("#deleteOrg").hide();
	$("#generateLicense").hide();
	$("#showOrgToken").hide();

	var self = this; 
	var data = this.data = {}; 

	self.defaults = {
			color: '#bd214c'
				, secondaryColor: '#dfdfdf'
					, jackColor: '#fff'
						, jackSecondaryColor: null
						, className: 'switchery'
							, disabled: false
							, disabledOpacity: 0.5
							, speed: '0.4s'
								, size: 'small'
	};

	$scope.userSettings = {password:'',newPassword:'',confirmPassword:'',userName:'',firstName:'',lastName:'',middleName:'',accessToken:'',company:'',planType:'',id:'',defaultCompany:'',indexes:''};

	$scope.group = {id:0,groupName:'',description:'',users:'',operationType:''};

	$scope.groupTemp = {groupUsers:[]};

	$scope.role = {id:0,roleName:'',roleType:'',roleActor:'',permission:'',oldRoleName:'',indexes:'',filterDetails:''};

    $scope.switchToAdvacned =  function(){
        $scope.canShowQueryCode = false;
    }

	$scope.userOperationType = "";

	self.rolesErrorMessage = [];

	self.orgMessages = [];

	self.tempUsers = new Array();
	self.groupUsers = [];
	self.tempGroups = [];

	self.tempCompanies = [];

	self.tempPermissions = [];

	$scope.plainUsersArray = [];

	self.deleteMessages = [];

	self.userGroups = [];

	
	self.alertMessagaes = [];

	self.logFileds = [];

	self.fields = {};
    self.fields.maskFields = [];
    self.fields.documentFields = [];
	self.loadLogFields = function(){
		logDevicesFactory.getAllLogFields().then(function (response) {
			var data = response.data;
			for(var i=0;i<data.length;i++){
				if(self.logFileds.indexOf(data[i].fieldName)==-1){
					self.logFileds.push(data[i].fieldName);
				}


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

	self.loadLogFields();


	

	$scope.organization = {id:0,companyid:'',organizationName:'',actionType:"create",status:true,password:'',newPassword:'',confirmPassword:'',userName:'',firstName:'',lastName:'',middleName:'',accessToken:'',company:'',planType:'',id:'',defaultCompany:'',indexes:''};
	self.indices = [];

	self.errorMessage = [];
	self.groupErrorMessage = [];
	$scope.closeAlert = function(index) {
		self.alertMessagaes.splice(index, 1);
	};

	self.canCreateUsers = false;
	self.canCreateGroups = false;
	self.canCreateRoles = false;
	self.canCreateOrgs= false;
	self.canUpdateOrgs = false;
	self.canDeleteOrgs = false;

	$scope.templateUrl = "users.html";

	$scope.init = function(){

		blockCurrentElement("body");

		self.loadPermissions();
		self.getUsersWithInCompany();

		unblockCurrentElement("body");
	}
    //$scope.init();



	self.loadPermissions = function(){

		settingsFactory.loadPermissions().then(function (response) {
			if(response.data.indexOf("add user")!=-1){
				self.canCreateUsers = true;
			}
			if(response.data.indexOf("add groups")!=-1){
				self.canCreateGroups = true;
			}
			if(response.data.indexOf("add roles")!=-1){
				self.canCreateRoles = true;
			}
			if(response.data.indexOf("add organization")!=-1){
				self.canCreateOrgs = true;
			}
			if(response.data.indexOf("update organization")!=-1){
				self.canUpdateOrgs = true;

			}
			if(response.data.indexOf("delete organization")!=-1){
				self.canDeleteOrgs = true;
			}


		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

	}

	self.getUsersWithInCompany = function(){

		settingsFactory.getUsersWithInCompany('').then(function (response) {
			self.allUsers = response.data;
			self.loadUsersAgGrid();
			for(var i=0;i<self.allUsers.length;i++){
				$scope.plainUsersArray.push(
						{
							"id":self.allUsers[i].userName,
							"text":self.allUsers[i].userName
						}

				);

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

	

	$scope.displayCreateGroupTemplate = function(){


		$scope.group = {id:0,groupName:'',description:''};

		$scope.groupTemp.groupUsers = [];

		$scope.newgroup.$setPristine();
		$("#create-groups-modal").modal();

		$timeout(function () {

			userSelect.val(null).trigger('change');
		}, 200);




	}



	$scope.navType = "users";



	$scope.openTab = function(linkType){

		$("#editOrg").hide();
		$("#deleteOrg").hide();
		$("#generateLicense").hide();
		$("#showOrgToken").hide();

		if(linkType==='users'){
			$scope.navType = "users";
			$('.listbox').bootstrapDualListbox();
			$scope.showUsersInOrganisation();
		}
		if(linkType==='groups'){
			$scope.navType = "groups";
			self.getGroups();
		}
		if(linkType==='roles'){
			$scope.navType = "roles";
			self.getRoles();
			self.getGroups();
			self.getIndicies();
		}
		if(linkType==='organisation'){
			$scope.navType = "organisation";
			self.getCurrentOrgs();
		}
	}

	//$scope.orgToken = "";



	self.getIndicies = function(){


		settingsFactory.getIndicies().then(function (response) {

			for(var i=0;i<response.data.length;i++){
				self.indices.push(response.data[i].text);
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

	self.agGridOptions = {};

	self.orgs = [];

	self.getCurrentOrgs = function(){


		settingsFactory.getCurrentOrgs().then(function (response) {

			$("#org-grid").empty();
			self.orgs = angular.copy(response.data);
			var colDefs = [

				{headerName: "Parent Company", field: "parent_company", width: 200},

				{headerName:'companyId',field:'companyId',filter: 'agTextColumnFilter',filterParams:{
					filterOptions:['contains'],suppressAndOrCondition:true }},
					{headerName:'Name',field:'companyName',filter: 'agTextColumnFilter',filterParams:{
						filterOptions:['contains'],suppressAndOrCondition:true }},
						{headerName:'Status',field:'status',filter: 'agTextColumnFilter',filterParams:{
							filterOptions:['contains'],suppressAndOrCondition:true }},

							{headerName:'License',field:'isLicenceActive',filter: 'agTextColumnFilter',filterParams:{
								filterOptions:['contains'],suppressAndOrCondition:true }},
								{headerName:'Expried In (Days)',field:'expried',filter: 'agTextColumnFilter',filterParams:{
									filterOptions:['contains'],suppressAndOrCondition:true }},

									{headerName:'Number of devices',field:'numberOfDevices',filter: 'agTextColumnFilter',filterParams:{
										filterOptions:['contains'],suppressAndOrCondition:true }},

										{headerName:'Data Limit',field:'dataVol',filter: 'agTextColumnFilter',filterParams:{
											filterOptions:['contains'],suppressAndOrCondition:true }},

										]

			self.agGridOptions =  {

					floatingFilter: true,

					columnDefs : colDefs,

					treeData: true,
					groupSelectsChildren: true,
					suppressRowClickSelection: true,
					animateRows: true,
					debug: false,

					getDataPath: function(data) {
						return data.companyPath;
					},
					rowData:response.data,
					rowSelection: 'multiple',

					paginationAutoPageSize:true,
					onSelectionChanged: onSelectionOrgChanged,
					pagination: true,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					},
					autoGroupColumnDef: {
						headerName: "Organisation Hierarchy",
						cellRendererParams: {
							suppressCount: true
						},
						cellRendererParams: {
							checkbox: true,
						}
					}
			}

			$("#org-grid").css("height",$(window).height()-350+"px");

			var gridDiv = document.querySelector('#org-grid');

			new agGrid.Grid(gridDiv, self.agGridOptions);

		}, function (error) {
			if(error.status== 403){
				self.deleteMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.deleteMessages = [];
				}, 2000);
			}
		});
	}

	$scope.selectOrgs = [];

	function onSelectionOrgChanged(){
		var selectedRows = self.agGridOptions.api.getSelectedRows();
		var selectedRowsString = '';
		$scope.selectOrgs = [];

		selectedRows.forEach( function(selectedRow, index) {
			$scope.selectOrgs.push(selectedRow)
		});

		if($scope.selectOrgs.length===1 && self.canUpdateOrgs){
			$("#editOrg").show();
			$("#deleteOrg").show();
			$("#generateLicense").show();
			$("#showOrgToken").show();
		}else if($scope.selectOrgs.length>1 && self.canDeleteOrgs){
			$("#editOrg").hide();
			$("#deleteOrg").show();
			$("#generateLicense").hide();
			$("#showOrgToken").hide();
		}else{
			$("#editOrg").hide();
			$("#deleteOrg").hide();
			$("#generateLicense").hide();
			$("#showOrgToken").hide();
		}


	}
	self.getCurrentOrgs();

	$scope.displayCreateOrganizationTemplate = function(){
		$scope.organization = {id:0,companyid:'',organizationName:'',actionType:"create",status:true};
		$("#create-organization-modal").modal();
		$scope.organizationForm.$setPristine(); 
		$scope.organizationForm.$setUntouched(); 
		
	}


	$scope.licenseDetails= {id:0,license:'',privateKey:''}

	$scope.isGenerateLiceButton = false;

	$scope.enableGenerateLicButton = function(){
		$scope.isGenerateLiceButton = false;
	}

	$scope.provisionOrg = function(data){
		$scope.licenseDetails.id = data.id;
		if(data.isLicenceActive === 'Valid'){
			$scope.isGenerateLiceButton = true;
			$scope.licenseDetails.license = data.license
			$scope.licenseDetails.privateKey = data.private_key
		}

		$("#generate_license_modal").modal();

	}
	self.tokenMessages = [];
	$scope.generateLicense = function(){
		settingsFactory.generateLicence($scope.licenseDetails).then(function (response) {

			self.tokenMessages.push({ type: 'success', msg: "License generation was successufull. Expried in "+response.data.expried+" Days " })
			self.getCurrentOrgs();
			$("#generate_license_modal").modal('hide')
			$timeout(function () {
				self.tokenMessages = [];
			}, 2000);

		}, function (error) {
			if(error.status== 403){
				self.tokenMessages.push({ type: 'danger', msg: "Unable to generate  License!!" })

				$timeout(function () {
					self.tokenMessages = [];
				}, 2000);
			}
			if(error.status== 500){
				self.tokenMessages.push({ type: 'danger', msg: "Invalid License Key Please Contact Admin" })

				$timeout(function () {
					self.tokenMessages = [];
				}, 2000);
			}
		});
	}



	///secure/organization


	self.getRoles = function(){
		self.permissions =[];
		settingsFactory.getRoles().then(function (response) {
			//permissionName
			for(var i=0;i<response.data.permissions.length;i++){
				self.permissions.push(
						{
							"id":response.data.permissions[i].permissionName.toLowerCase(),
							"text":response.data.permissions[i].permissionName.toLowerCase()

						}

				)
			}

			//self.permissions = response.data.permissions;
			self.roles = response.data.roles;
			self.loadRolesAgGrid();
		}, function (error) {
			if(error.status== 403){
				self.deleteMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.deleteMessages = [];
				}, 2000);
			}
		});
	}
	$scope.canUpdateRole = false;

	$scope.displayUpdateRole = function(roleName,companyName){
		$scope.group.operationType = "update";
		self.alertMessagaes = [];
		self.tempUsers = new Array();

		self.tempPermissions = [];	
		self.tempGroups = [];

		$scope.role.oldRoleName = roleName;

		data.query = {"bool":{"must":[]}};
		data["fields"] = {};
		for(var i=0;i<self.logFileds.length;i++){
			//$scope.schema.selects.push({column:uniqueArray[i]} );
			data.fields[self.logFileds[i]+".keyword"] = { type: 'term',title:self.logFileds[i],field:self.logFileds[i]+".keyword"};
		}


		for(var i = 0; i < self.roles.length; i++){
			if(self.roles[i].rolename === roleName) {
				$scope.role.id = self.roles[i].id;
				$scope.role.roleName = roleName;
				$scope.role.indexes = self.roles[i].indexes
				$scope.role.filterDetails = self.roles[i].query;
				self.fields.maskFields = self.roles[i].maskFields.split(",");
				self.fields.documentFields = self.roles[i].documentFields.split(",") ;
				if(!$scope.role.roleName === 'Administrator'){
					$scope.canUpdateRole = true;
				}
				var tempPermissions = [];
				settingsFactory.getRoleMappings(roleName,companyName).then(function (response) {
					$scope.role.roleType = response.data.roles.roleType;
					for(var i=0;i<response.data.roles.permission.split(",").length;i++){
						tempPermissions.push(
								{
									"id":response.data.roles.permission.split(",")[i],
									"text":response.data.roles.permission.split(",")[i]
								}
						);
					}
					self.tempPermissions = angular.copy(tempPermissions);
					if($scope.role.roleType==="users"){

						var tempRoles = [];

						for(var i=0;i<response.data.roles.roleActors.split(",").length;i++){

							tempRoles.push(
									{
										"id":response.data.roles.roleActors.split(",")[i],
										"text":response.data.roles.roleActors.split(",")[i],


									}

							);
						}
						self.tempUsers = angular.copy(tempRoles)
					}else{
						var tempGroups= [];
						for(var i=0;i<response.data.roles.roleActors.split(",").length;i++){

							tempGroups.push(
									{
										"id":response.data.roles.roleActors.split(",")[i],
										"text":response.data.roles.roleActors.split(",")[i],


									}

							);
						}
						self.tempGroups = angular.copy(tempGroups)
					}

					$("#update-role-modal").modal();
				}, function (error) {
					$scope.status = 'Unable to load customer data: ' + error.message;
				});


				break;
			}
		}

	}

	$scope.displayCreateRoleTemplate = function (){
		$scope.role = {roleName:'',roleType:'',roleActor:''};

		self.alertMessagaes = [];
		self.tempUsers = [];

		self.tempPermissions = [];
		$scope.userOperationType = "insert";
		self.alertMessagaes = [];
		data.query = {"bool":{"must":[]}};
		data["fields"] = {};
		for(var i=0;i<self.logFileds.length;i++){

			//$scope.schema.selects.push({column:uniqueArray[i]} );
			data.fields[self.logFileds[i]+".keyword"] = { type: 'term',title:self.logFileds[i],field:self.logFileds[i]+".keyword"};
		}
		$("#create-role-modal").modal();
		//var listBox =  $('.permissionsListBox').bootstrapDualListbox();
	}

	self.getGroups = function(){
		self.userGroups = [];

		settingsFactory.getGroups('').then(function (response) {
			self.groups = response.data;
			self.loadGroupsAgGrid();
			for(var i=0;i<response.data.length;i++){
				self.userGroups.push(
						{
							"id":response.data[i].groupName,
							"text":response.data[i].groupName
						}

				);
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

	$scope.grantedTo = function(){
		if($scope.role.roleType == 'users'){
			self.tempGroups = [];
		}else{
			self.tempUsers = [];
		}
	}





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

				settingsFactory.getUsersWithInCompany($sessionStorage.user.companyName).then(function (response) {
					self.allUsers = response.data;
					for(var i=0;i<self.allUsers.length;i++){
						$scope.plainUsersArray.push(
								{
									"id":self.allUsers[i].userName,
									"text":self.allUsers[i].userName
								}

						);
					}
				}, function (error) {
					$scope.status = 'Unable to load customer data: ' + error.message;
				});

			}else{
				self.alertMessagaes.push({ type: 'danger', msg:  response.data.error});
			}

		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});


	}

	$scope.createGroups = function(){
		self.alertMessagaes = [];

		if($scope.group.groupName==''||$scope.group.groupName==undefined||$scope.group.groupUsers==[]||$scope.group.groupUsers==undefined){

			self.groupErrorMessage.push({ type: 'danger', msg: 'Please fill all hilighted details' });
			$timeout(function () {
				self.groupErrorMessage = [];
			}, 2000);
			return false;
		}

		$scope.group.operationType = "insert";

		var tempArray = [];

		for(var i=0;i<$scope.groupTemp.groupUsers.length;i++){
			tempArray.push($scope.groupTemp.groupUsers[i].text);
		}
		blockCurrentElement("createGroups")

		$scope.group.users = tempArray.join(',')

		settingsFactory.saveGroups($scope.group).then(function (response) {

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "Group was successfully created." });
				$scope.userSettings = {password:'',newPassword:'',confirmPassword:'',userName:'',fullName:'',accessToken:'',company:'',planType:''};
				$scope.group = {id:0,groupName:'',description:''};
				$("#create-groups-modal").modal('hide')

				self.getGroups();
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				unblockCurrentElement("createGroups")
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.groupErrorMessage.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.groupErrorMessage.push({ type: 'danger', msg: response.data.error });
				}

				$timeout(function () {
					self.errorMessage = [];
				}, 2000);
				unblockCurrentElement("createGroups")
			}

		}, function (error) {
			unblockCurrentElement("createGroups")
			$scope.status = 'Unable to load customer data: ' + error.message;
		});


	}

	$scope.showUsersInOrganisation = function(companyName){

		settingsFactory.getUsersInOrganisation(companyName).then(function (response) {
			self.companyUsers = response.data;
			$("#show-company-users").modal();
		}, function (error) {
			if(error.status== 403){
				self.deleteMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.deleteMessages = [];
				}, 2000);
			}

		});


	}

	$scope.clientLogo;



	$scope.createOrganization = function(){
		self.alertMessagaes = [];
		if($scope.organization.organizationName == '' || $scope.organization.organizationName == undefined ){
			self.orgMessages.push({ type: 'danger', msg: "Please fill the highlighted fields" });				
			$timeout(function(){
				self.orgMessages = [];
			},2000);
		}else{

			var file = $scope.clientLogo;
			if(!$scope.clientLogo){
				self.orgMessages.push({ type: 'danger', msg: "Please select the logo file" });				
				$timeout(function(){
					self.orgMessages = [];
				},2000);
				return false;
			}






			var fd = new FormData();
			fd.append('file', file);
			fd.append('data', JSON.stringify($scope.organization));


			settingsFactory.createOrganization(fd).then(function (response) {

				if(response.data.status){
					self.alertMessagaes.push({ type: 'success', msg: "Organization  was successfully created." });
					$("#create-organization-modal").modal('hide')
					self.getCurrentOrgs();
					self.getUsersWithInCompany();

					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
				}else{

					if(response.data.error){
						for(var i=0;i<response.data.error.length;i++){
							self.orgMessages.push({ type: 'danger', msg: response.data.error[i].defaultMessage });
						}
					}



					self.orgMessages.push({ type: 'danger', msg: response.data.message });

					$timeout(function () {
						self.orgMessages = [];
					}, 2000);
				}

			}, function (error) {
				$scope.status = 'Unable to load customer data: ' + error.message;
			});
		}
	}

	$scope.currentToken = "";

	$scope.tokenMessages = [];

	$scope.generateToken = function(id){
		settingsFactory.generateToken(id).then(function (response) {
			$scope.organization.token = response.data.token;
			self.tokenMessages.push({ type: 'success', msg: "Token Generation was Successfull" });
			$timeout(function () {
				self.tokenMessages = [];
			}, 2000);

		}, function (error) {
			unblockCurrentElement("saveRules");
			self.tokenMessages.push({ type: 'danger', msg: "Unable to Generate Token!!! Please Contact System Admin" });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 3000);
		});
	}

	$scope.onSuccess = function(e) {
		self.tokenMessages = [];


		self.tokenMessages.push({ type: 'success', msg: e.text+" was Successfully Copied to Clipboard" });
		$timeout(function () {
			self.tokenMessages = [];
		}, 3000);

		e.clearSelection();
	};

	$scope.onError = function(e) {
		console.error('Action:', e.action);
		console.error('Trigger:', e.trigger);
	}


	$scope.showToken = function(data){

		$scope.orgToken  = data.orgToken;

		$("#view_token_dialog").modal();
	}
	$scope.createRoles = function(){
		self.alertMessagaes = [];
		//$scope.role = {id:0,roleName:'',roleType:'',roleActor:''};

		if($scope.role.roleName == "" || $scope.role.roleName == undefined || self.tempPermissions.length == 0 || $scope.role.roleType == "" || $scope.role.roleType == undefined || $scope.role.indexes == undefined || $scope.role.indexes == ""){
			self.alertMessagaes.push({ type: 'success', msg: "please fill all the details with * mark" });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			return false;
		}

		if($scope.role.roleType === 'users'){

			var tempRoles = [];
			for(var i=0;i<self.tempUsers.length;i++){
				tempRoles.push(self.tempUsers[i].id);
			}

			$scope.role.roleActor = tempRoles.join(',');
		}else{
			var tempRoles = [];

			for(var i=0;i<self.tempGroups.length;i++){
				tempRoles.push(self.tempGroups[i].id);
			}

			$scope.role.roleActor = tempRoles.join('');

		}

		self.tempArray = [];

		for(var i=0;i<self.tempPermissions.length;i++){
			self.tempArray.push(self.tempPermissions[i].id);
		}

		$scope.role.permission = self.tempArray.join(','); 

		$scope.output =	data.query[0];
		$scope.role['maskFields'] =  self.fields.maskFields.join(',');
		$scope.role['fieldLevel'] =  self.fields.documentFields.join(',')
		$scope.role.filterDetails = JSON.stringify($scope.output);
		blockCurrentElement("saveRules");

		settingsFactory.saveRoles($scope.role).then(function (response) {

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "Role was successfully created." });

				$scope.role = {id:0,roleName:'',roleType:'',roleActor:''};
				$("#create-role-modal").modal('hide');

				self.getRoles();
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);

				unblockCurrentElement("saveRules");
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.rolesErrorMessage.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.rolesErrorMessage.push({ type: 'danger', msg: response.data.error });
				}

				$timeout(function () {
					self.rolesErrorMessage = [];
				}, 2000);
				unblockCurrentElement("saveRules");
			}

		}, function (error) {
			unblockCurrentElement("saveRules");
			$scope.status = 'Unable to load customer data: ' + error.message;
		});


	}



	$scope.deleteRole = function(roleName){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+roleName+'</b>  ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						blockCurrentElement("body");

						settingsFactory.deleteRoles(roleName).then(function (response){
							if(!response.data.status){

								self.alertMessagaes.push({ type: 'danger', msg: response.data.error});

							}else{
								self.getRoles();

								self.alertMessagaes.push({ type: 'success', msg: "successfully deleted the role" });

							}
							$timeout(function () {
								self.alertMessagaes = [];
							}, 2000);

							unblockCurrentElement("body");

						}).catch(function(response) {
							unblockCurrentElement("body");
							self.alertMessagaes.push({ type: 'success', msg: "successfully deleted the role" });

						});
						return true; 
					}
				},
				close: function(scope, button){


				}
			}
		});


	}



	$scope.updateRoles = function(){
		self.alertMessagaes = [];
		//$scope.role = {id:0,roleName:'',roleType:'',roleActor:''};

		if($scope.role.roleType === 'users'){
			var tempRoles = [];
			for(var i=0;i<self.tempUsers.length;i++){
				tempRoles.push(self.tempUsers[i].id);
			}

			$scope.role.roleActor = tempRoles.join(',');
		}else{
			var tempRoles = [];

			for(var i=0;i<self.tempGroups.length;i++){
				tempRoles.push(self.tempGroups[i].id);
			}

			$scope.role.roleActor = tempRoles.join('');

		}

		self.tempArray = [];

		for(var i=0;i<self.tempPermissions.length;i++){
			self.tempArray.push(self.tempPermissions[i].id);
		}



		$scope.role.permission = self.tempArray.join(','); 
		$scope.output =	data.query[0];
		if($scope.output){
	    	$scope.role.filterDetails = JSON.stringify($scope.output);
		}else{
		    $scope.role.filterDetails =  "";
		}

		$scope.role['maskFields'] =  self.fields.maskFields.join(',');
        $scope.role['fieldLevel'] =  self.fields.documentFields.join(',')


		blockCurrentElement("updateRoles")
		settingsFactory.updateRoles($scope.role).then(function (response) {

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "Role was successfully created." });

				$scope.role = {id:0,roleName:'',roleType:'',roleActor:''};
				$("#update-role-modal").modal('hide');

				self.getRoles();
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				unblockCurrentElement("updateRoles")
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.rolesErrorMessage.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.rolesErrorMessage.push({ type: 'danger', msg: response.data.error });
				}

				$timeout(function () {
					self.rolesErrorMessage = [];
				}, 2000);
				unblockCurrentElement("updateRoles")
			}

		}, function (error) {
			unblockCurrentElement("updateRoles")
			$scope.status = 'Unable to load customer data: ' + error.message;
		});


	}

	//updateRoles
	$scope.showUsers = function(groupName){

		self.groupUsers = [];

		settingsFactory.getUsersFromGroup(groupName).then(function (response) {
			for(var i=0;i<response.data.length;i++){
				self.groupUsers.push(response.data[i].userName);
			}

			$("#show-memebers-modal").modal();



		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

	}

	$scope.updateGroups = function(){
		self.alertMessagaes = [];


		$scope.group.operationType = "update";
		var tempArray = [];

		if($scope.groupTemp.groupUsers.length==0){
			self.groupErrorMessage.push({ type: 'danger', msg: "Please Select Atleast one user" });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			return false;
		}


		for(var i=0;i<$scope.groupTemp.groupUsers.length;i++){
			tempArray.push($scope.groupTemp.groupUsers[i].text);
		}


		$scope.group.users = tempArray.join(',')

		blockCurrentElement("updateGroups");

		settingsFactory.saveGroups($scope.group).then(function (response) {

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "Group was successfully created." });
				$scope.userSettings = {password:'',newPassword:'',confirmPassword:'',userName:'',fullName:'',accessToken:'',company:'',planType:''};
				$scope.group = {id:0,groupName:'',description:''};
				$("#update-groups-modal").modal('hide');

				self.getGroups();
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);

				unblockCurrentElement("updateGroups");

			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.groupErrorMessage.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.groupErrorMessage.push({ type: 'danger', msg: response.data.error });
				}

				$timeout(function () {
					self.groupErrorMessage= [];
				}, 2000);
				unblockCurrentElement("updateGroups");
			}

		}, function (error) {
			unblockCurrentElement("updateGroups");
			$scope.status = 'Unable to load customer data: ' + error.message;
		});


	}

	$scope.closeDailog = function(){
		$scope.userSettings = {password:'',newPassword:'',confirmPassword:''};
	}




	$scope.createUsers = function(){

		if($scope.userSettings.userName == '' || $scope.userSettings.userName == undefined || $scope.userSettings.firstName == '' || $scope.userSettings.firstName == undefined || $scope.userSettings.lastName == '' || $scope.userSettings.lastName == undefined || $scope.userSettings.defaultCompany == '' || $scope.userSettings.defaultCompany == undefined || self.tempCompanies == '' || self.tempCompanies == undefined ){

			self.errorMessage.push({ type: 'danger', msg: 'Please fill all hilighted details' });
			$timeout(function () {
				self.errorMessage = [];
			}, 2000);

			return false;
		}

		$scope.userSettings.planType = self.userDetails.currentPlan;
		$scope.userSettings.accessToken = self.userDetails.token;
		var tempcompany= [];
		for(var i=0;i<self.tempCompanies.length;i++){
			tempcompany.push(self.tempCompanies[i].companyName);
		}

		if(tempcompany.length==0){
			self.errorMessage.push({ type: 'danger', msg: "Please Select Atleast One Company" });
			$timeout(function () {
				self.errorMessage = [];
			}, 2000);
			return false;
		}

		if(tempcompany.indexOf($scope.userSettings.defaultCompany) == -1){
			self.errorMessage.push({ type: 'danger', msg: "Default Company Name is not Company Drop Down." });
			$timeout(function () {
				self.errorMessage = [];
			}, 2000);
			return false;
		}





		$scope.userSettings.company = tempcompany.join(',');

		blockCurrentElement("CreateUsers");

		if($scope.userOperationType === "insert"){
			settingsFactory.createUsers($scope.userSettings).then(function (response) {
				self.allUsers = response.data.users;


				if(response.data.errors.length!=0){
					for(var i=0; i<response.data.errors.length;i++){
						self.errorMessage.push({ type: 'danger', msg: response.data.errors[i].errorMessage });
					}
					$timeout(function () {
						self.errorMessage = [];
					}, 2000);

				}else{
					$("#create-user-modal").modal('hide');

					self.alertMessagaes.push({ type: 'success', msg: "successfully created the user" });

					settingsFactory.getUsersWithInCompany($sessionStorage.user.companyName).then(function (response) {
						self.allUsers = response.data;
						for(var i=0;i<self.allUsers.length;i++){
							$scope.plainUsersArray.push(
									{
										"id":self.allUsers[i].userName,
										"text":self.allUsers[i].userName,
									}

							);
						}

						$timeout(function () {
							self.alertMessagaes = [];
						}, 2000);
					}, function (error) {
						$scope.status = 'Unable to load customer data: ' + error.message;
					});
				}
				unblockCurrentElement("CreateUsers");

			}, function (error) {
				unblockCurrentElement("CreateUsers");
				$scope.status = 'Unable to load customer data: ' + error.message;
			});
		}
		if($scope.userOperationType === "update"){
			settingsFactory.updateUser($scope.userSettings).then(function (response) {
				if(response.data.errors.length!=0){
					for(var i=0; i<response.data.errors.length;i++){
						self.errorMessage.push({ type: 'danger', msg: response.data.errors[i].errorMessage });
					}
					$timeout(function () {
						self.errorMessage = [];
					}, 2000);

				}else{

					$("#create-user-modal").modal('hide');
					self.alertMessagaes.push({ type: 'success', msg: "successfully updated the user" });

					settingsFactory.getUsersWithInCompany($sessionStorage.user.companyName).then(function (response) {
						self.allUsers = response.data;
						for(var i=0;i<self.allUsers.length;i++){
							$scope.plainUsersArray.push(
									{
										"id":self.allUsers[i].userName,
										"text":self.allUsers[i].userName,
									}

							);
						}

						$timeout(function () {
							self.alertMessagaes = [];
						}, 2000);

					}, function (error) {
						$scope.status = 'Unable to load customer data: ' + error.message;
					});

				}
				unblockCurrentElement("CreateUsers");
			}, function (error) {
				unblockCurrentElement("CreateUsers");
				$scope.status = 'Unable to load customer data: ' + error.message;
			});
		}


	}


	$scope.displayUpdateOrg = function(companyDetails){

		$scope.organization = {id:0,companyid:'',organizationName:'',actionType:"update",status:false};



		$scope.organization.id = companyDetails.id;
		$scope.organization.companyid = companyDetails.companyId;
		$scope.organization.organizationName = companyDetails.companyName;
		if(companyDetails.status === 'Active'){
			$scope.organization.status = true;
		}
		//$scope.organization.description = self.orgs[i].numberOfUsers;
//		$scope.organization = angular.copy(self.orgs[i]);
		$("#create-organization-modal").modal();


	}

	$scope.displayCreateUserTemplate = function(){
		$scope.userSettings = {password:'',newPassword:'',confirmPassword:'',userName:'',firstName:'',lastName:'',middleName:'',accessToken:'',company:'',planType:'',status:false};

		$scope.userOperationType = "insert";
		self.alertMessagaes = [];
		self.tempCompanies = [];
		$scope.manageusers.$setPristine();
		$scope.manageusers.$setUntouched();
		$("#create-user-modal").modal();
	}

	$scope.openPasswordDialog = function(){
		$("#change-password-modal").modal();
	}


	$scope.deleteUser = function(userName,userId){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+userName+'</b>  ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						blockCurrentElement("body");

						settingsFactory.deleteUser(userId).then(function (response){
							if(response.data.errors.length!=0){
								for(var i=0; i<response.data.errors.length;i++){
									self.alertMessagaes.push({ type: 'error', msg: response.data.errors[i].message });
								}
							}else{
								settingsFactory.getUsersWithInCompany($sessionStorage.user.companyName).then(function (response) {
									self.allUsers = response.data;
								}, function (error) {
									$scope.status = 'Unable to load customer data: ' + error.message;
								});

								self.alertMessagaes.push({ type: 'success', msg: "successfully deleted the user" });

							}
							$timeout(function () {
								self.alertMessagaes = [];
							}, 2000);

							unblockCurrentElement("body");

						}).catch(function(response) {
							console.error('Gists error', response.status, response.data);
						});
						return true; 
					}
				},
				close: function(scope, button){


				}
			}
		});


	}

	settingsFactory.getUserInformation().then(function (response) {
		self.userDetails = response.data;
	}, function (error) {
		$scope.status = 'Unable to load customer data: ' + error.message;
	});


	$scope.deleteGroup = function(groupName){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+groupName+'</b>  ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						blockCurrentElement("body");

						settingsFactory.deleteGroups(groupName).then(function (response){
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: "successfully deleted the group" });
								self.getGroups();

							}else{
								self.alertMessagaes.push({ type: 'error', msg: "Unable to delete group reason " + response.data.error });
							}

							unblockCurrentElement("body");
							$timeout(function () {
								self.alertMessagaes = [];
							}, 2000);

						}).catch(function(response) {
							console.error('Gists error', response.status, response.data);
						});
						return true; 
					}
				},
				close: function(scope, button){


				}
			}
		});


	}




	$scope.displayUpdateGroup = function(groupId){

		$scope.group.operationType = "update";
		self.alertMessagaes = [];
		$scope.groupTemp.groupUsers = [];
		var tempSelecte2 = [];

		for(var i = 0; i < self.groups.length; i++){
			if(self.groups[i].groupName === groupId) {
				blockCurrentElement("CreateUsers");
				$scope.group = angular.copy(self.groups[i]);

				settingsFactory.getUsersFromGroup(self.groups[i].groupName).then(function (response) {
					for(var i=0;i<response.data.length;i++){
						$scope.groupTemp.groupUsers.push({"id":response.data[i].userName,"text":response.data[i].userName});
					}
					$("#update-groups-modal").modal();
					unblockCurrentElement("CreateUsers");


				}, function (error) {
					unblockCurrentElement("CreateUsers");
					$scope.status = 'Unable to load customer data: ' + error.message;
				});


				break;
			}
		}
	}

	$scope.displayUpdateUser=function(userId){
		$scope.userOperationType = "update";

		self.tempCompanies = [];

		self.alertMessagaes = [];
		var tempOrgs = [];
		for(var i = 0; i < self.allUsers.length; i++){
			if(self.allUsers[i].id === userId) {
				blockCurrentElement("CreateUsers");
				var tempCom = [];
				settingsFactory.getOrgsBasedOnUser(self.allUsers[i].userName).then(function (response){
					for(var i=0;i<response.data.length;i++){
						if(response.data[i].defaultCompany==1){
							$scope.userSettings.defaultCompany = response.data[i].companyName
						}
						tempCom.push({"companyName":response.data[i].companyName});

					}
					self.tempCompanies = angular.copy(tempCom);
					$("#create-user-modal").modal();
					unblockCurrentElement("CreateUsers");
				});

				$scope.userSettings = angular.copy(self.allUsers[i]);
				if(self.allUsers[i].status.toLowerCase() === 'active'){
				    $scope.userSettings.status = true;
				} else{
				    $scope.userSettings.status = false;
				}

				break;
			}
		}


	}

	self.historyBack = function(){
		window.history.back();
	}
	
	self.columnUsersDefs = [
		{headerName: "Username",field: "userName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Full Name",field: "firstName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Status",field: "status",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
    ]

	
	self.loadUsersAgGrid = function(){
			$timeout(function(){
				self.eventGrid = {
						defaultColDef: {
							width: 100,
							sortable: true,
							resizable: true,
							filter: true,
							editable: false
						},
						autoGroupColumnDef: {
							width: 180
						},
						columnDefs: self.columnUsersDefs,
						rowGroupPanelShow: 'onlyWhenGrouping',
						animateRows: true,
						debug: false,
						suppressAggFuncInHeader: true,
						sideBar: {
							toolPanels: [{
								id: 'columns',
								labelDefault: 'Columns',
								labelKey: 'columns',
								iconKey: 'columns',
								toolPanel: 'agColumnsToolPanel',
								toolPanelParams: {
									suppressPivots: true,
									suppressPivotMode: true,
								}
							}],
						},
						rowData: self.allUsers,
						rowSelection: 'single',
						floatingFilter:true,
						rowGroupPanelShow: 'always',
						onSelectionChanged: self.onSelectionChanged,
						onFirstDataRendered(params) {
							params.api.sizeColumnsToFit();
						}
				}
		
				self.usersId = [];
				$("#allUsers-grid").empty();
				$("#usersEdit").hide();
				$("#usersDelete").hide();
				
				$("#allUsers-grid").css("height",$(window).height()-350+"px");
				if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
					self.eventGrid.api.deselectAll();
				}
				var eGridDiv =  document.querySelector('#allUsers-grid');
				new agGrid.Grid(eGridDiv, self.eventGrid );
			},250);
		}
	
	
		self.onSelectionChanged = function() {
			self.usersId = [];
			$("#usersEdit").hide();
			$("#usersDelete").hide();
			self.usersId = angular.copy(self.eventGrid.api.getSelectedRows());
			if(self.usersId.length > 0){
				$("#usersEdit").show();
				$("#usersDelete").show();
			}
		}
	

	
	
	self.columnGroupsDefs = [
		{headerName: "Group Name",field: "groupName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Users",field: "count",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
    ]
	
	self.loadGroupsAgGrid = function(){
			$timeout(function(){
				self.groupsGrid = {
						defaultColDef: {
							width: 100,
							sortable: true,
							resizable: true,
							filter: true,
							editable: false
						},
						autoGroupColumnDef: {
							width: 180
						},
						columnDefs: self.columnGroupsDefs,
						rowGroupPanelShow: 'onlyWhenGrouping',
						animateRows: true,
						debug: false,
						suppressAggFuncInHeader: true,
						sideBar: {
							toolPanels: [{
								id: 'columns',
								labelDefault: 'Columns',
								labelKey: 'columns',
								iconKey: 'columns',
								toolPanel: 'agColumnsToolPanel',
								toolPanelParams: {
									suppressPivots: true,
									suppressPivotMode: true,
								}
							}],
						},
						rowData: self.groups,
						rowSelection: 'single',
						floatingFilter:true,
						rowGroupPanelShow: 'always',
						onSelectionChanged: self.onSelectionChangedGroups,
						onFirstDataRendered(params) {
							params.api.sizeColumnsToFit();
						}
				}
		
				self.groupsId = [];
				$("#group-grid").empty();
				$("#groupsEdit").hide();
				$("#groupsDelete").hide();
				$("#showUsers").hide();
				$("#group-grid").css("height",$(window).height()-350+"px");
				if(self.groupsGrid.api != undefined && self.groupsGrid.api.getSelectedRows().length > 0){			
					self.groupsGrid.api.deselectAll();
				}
				var eGridDiv =  document.querySelector('#group-grid');
				new agGrid.Grid(eGridDiv, self.groupsGrid );
			},250);
		}
	
	self.onSelectionChangedGroups = function() {
		self.groupsId = [];
		$("#groupsEdit").hide();
		$("#groupsDelete").hide();
		$("#showUsers").hide();
		self.groupsId = angular.copy(self.groupsGrid.api.getSelectedRows());
		if(self.groupsId.length > 0){
			$("#groupsEdit").show();
			$("#groupsDelete").show();
			$("#showUsers").show();
		}
	}
	
	
	
	self.columnRolesDefs = [
		{headerName: "Role",field: "rolename",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
//		{headerName: "Users",field: "count",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
    ]
	
	self.loadRolesAgGrid = function(){
			$timeout(function(){
				self.rolesGrid = {
						defaultColDef: {
							width: 100,
							sortable: true,
							resizable: true,
							filter: true,
							editable: false
						},
						autoGroupColumnDef: {
							width: 180
						},
						columnDefs: self.columnRolesDefs,
						rowGroupPanelShow: 'onlyWhenGrouping',
						animateRows: true,
						debug: false,
						suppressAggFuncInHeader: true,
						sideBar: {
							toolPanels: [{
								id: 'columns',
								labelDefault: 'Columns',
								labelKey: 'columns',
								iconKey: 'columns',
								toolPanel: 'agColumnsToolPanel',
								toolPanelParams: {
									suppressPivots: true,
									suppressPivotMode: true,
								}
							}],
						},
						rowData: self.roles,
						rowSelection: 'single',
						floatingFilter:true,
						rowGroupPanelShow: 'always',
						onSelectionChanged: self.onSelectionChangedRoles,
						onFirstDataRendered(params) {
							params.api.sizeColumnsToFit();
						}
				}
		
				self.rolesId = [];
				$("#roles-grid").empty();
				$("#rolesEdit").hide();
				$("#rolesDelete").hide();
				$("#roles-grid").css("height",$(window).height()-350+"px");
				if(self.rolesGrid.api != undefined && self.rolesGrid.api.getSelectedRows().length > 0){			
					self.rolesGrid.api.deselectAll();
				}
				var eGridDiv =  document.querySelector('#roles-grid');
				new agGrid.Grid(eGridDiv, self.rolesGrid );
			},250);
		}
	
	self.onSelectionChangedRoles = function() {
		self.rolesId = [];
		$("#rolesEdit").hide();
		$("#rolesDelete").hide();
		self.rolesId = angular.copy(self.rolesGrid.api.getSelectedRows());
		if(self.rolesId.length > 0){
			$("#rolesEdit").show();
			$("#rolesDelete").show();
		}else{
			$("#rolesEdit").hide();
			$("#rolesDelete").hide();
		}
	}
	
		
		
		self.reloadGrisDetails = function(){
			
			$("#usersEdit").hide();
			$("#usersDelete").hide();
			$("#rolesEdit").hide();
			$("#rolesDelete").hide();		
			$("#groupsEdit").hide();
			$("#groupsDelete").hide();
			$("#showUsers").hide();
			$("#editOrg").hide();
			$("#generateLicense").hide();
			$("#showOrgToken").hide();
			self.rolesGrid.api.deselectAll();
			self.groupsGrid.api.deselectAll();
			self.eventGrid.api.deselectAll();
		}
		
		$("#usersEdit").hide();
		$("#usersDelete").hide();
		$("#rolesEdit").hide();
		$("#rolesDelete").hide();		
		$("#groupsEdit").hide();
		$("#groupsDelete").hide();
		$("#showUsers").hide();
		$("#editOrg").hide();
		$("#generateLicense").hide();
		$("#showOrgToken").hide();
		
		$(window).resize(function() {
		     setTimeout(function() {
		    	 
		    	 try{		    		 
		    		$("#org-grid").css("height",$(window).height()-350+"px");
		    		self.agGridOptions.api.sizeColumnsToFit();
		    	 }catch(err){}
		    	 try{
		    		self.eventGrid.api.sizeColumnsToFit();
		    		$("#allUsers-grid").css("height",$(window).height()-350+"px");
		    	 }catch(err){}
		    	 try{
		    		self.groupsGrid.api.sizeColumnsToFit();
		    		$("#group-grid").css("height",$(window).height()-350+"px");
		    	 }catch(err){}
		    	 try{
		    		self.rolesGrid.api.sizeColumnsToFit();
		    		$("#roles-grid").css("height",$(window).height()-350+"px");
		    	 }catch(err){}
		    }, 500);
		});
		
		
//		self.reloadGrisDetails();
		

}]);

app.directive('rolequeryBuilder', ['$compile','conditionFactory', function ($compile,conditionFactory) {
	return {
		restrict: 'E',
		scope: {
			group: '='

		},
		templateUrl: 'queryBuilderDirective.html',
		compile: function (element, attrs) {
			var content, directive;
			content = element.contents().remove();
			return function (scope, element, attrs) {
				if(!scope.group.rules){
					scope.group = {"rules":[]}
				}


				scope.operators = [
					{ name: 'AND' },
					{ name: 'OR' }
					];



				scope.conditions = [
					{ name: 'Equal TO', value:"=" },
					{ name: 'Not Equal to',value:"!="  },
					{ name: 'Greater than',value:">"  },
					{ name: 'Contains',value:"%%"  },
					{ name: 'Starts With',value:"_%"  },
					{ name: 'Ends With',value:"%_"  },
					{ name: 'In',value:"in"  },
					{ name: 'Not In',value:"not_in"  },
					{ name: 'Greater than equal to',value:">="  },
					{ name: 'less than',value:"<"  },
					{ name: 'less than equal to',value:"<="  }
					];





				scope.loadFields = function(){
					var tempArray = [];
					setTimeout(function(){ 
						if(!(scope.$parent.schema.selects === undefined)){
							for(var i=0;i<scope.$parent.schema.selects.length;i++){
								tempArray.push({name:scope.$parent.schema.selects[i].column})
							}
						}
						scope.fields =tempArray;
					}, 3000);

				}


				scope.addCondition = function (group) {

					group.rules.push({
						condition: ':',
						field: '',
						data: ''
					});
				};

				//scope.addCondition(scope.group);
				scope.loadFields();

				scope.removeCondition = function (index) {
					scope.group.rules.splice(index, 1);
				};

				scope.addGroup = function () {
					scope.group.rules.push({
						group: {
							operator: 'AND',
							rules: [{
								condition: ':',
								field: '',
								data: ''
							}]
						}
					});

				};
				scope.on
				scope.switchToBasic = function(){
					scope.$parent.isFiterAdvanced = false;
				};

				scope.removeGroup = function () {
					"group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
				};

				directive || (directive = $compile(content));

				element.append(directive(scope, function ($compile) {
					return $compile;
				}));
			}
		}
	}

}]);

function blockCurrentElement(container){
	$("#"+container).block({
		message: '<i class="icon-spinner9 spinner"></i>',
		overlayCSS: {
			backgroundColor: '#fff',
			opacity: 0.8,
			cursor: 'wait'
		},
		css: {
			border: 0,
			padding: 0,
			backgroundColor: 'none'
		}
	});
}

function unblockCurrentElement(container){
	$("#"+container).unblock();
}