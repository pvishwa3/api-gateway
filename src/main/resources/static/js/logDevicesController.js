app.controller("logDevicesController",['$scope','logDevicesFactory','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$timeout','conditionFactory','deviceService',function($scope,logDevicesFactory,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$timeout,conditionFactory,deviceService){

	var self= this;

	$scope.searchType = '';

	self.alertMessagaes = [];
	self.alertMessagaesModal = [];

	self.deviceTypes = [];

	$scope.showVendorForm= false;

	$scope.showManageDevicesPage = true;

	self.configureAttributes = function(){
		window.location.href = "/configuration#!/menusettings?page=confiureAttributes"
	}

	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	
	self.allDevices = [];

	$scope.collectorType = "";

	$scope.getCollectorType = function(data){

		var isCloudFound = false;	
		for(var i=0;i<self.nonCloudCollectors.length;i++){

			if(parseInt(data) === self.nonCloudCollectors[i].id ){
				$scope.collectorType = self.nonCloudCollectors[i].collectorType;
				isCloudFound = true;
				break;
			}
		}
		

		
	}

	$scope.cloudConfig = [];

	$scope.loadConfiguration = function(data){
		for(var i=0;i<self.couldSupportedDevices.length;i++){

			if(data === self.couldSupportedDevices[i].cloudName ){
				//$scope.collectorType = "cloud";
				$scope.cloudConfig = [];
				$scope.cloudConfig =  JSON.parse(self.couldSupportedDevices[i].metaData).fields;

			}
		}
	}
	

	
	self.couldSupportedDevices = [];

	self.loadCloudSupportedDevices = function(){
		logDevicesFactory.loadCloudSupportedDevices().then(function(response){		
			self.couldSupportedDevices = angular.copy(response.data);
		},function(error){

		});
	}

	self.loadCloudSupportedDevices();

	self.loadAllDevices = function(){

		logDevicesFactory.getAllDevices().then(function(response){		
			self.allDevices = angular.copy(response.data);
		},function(error){

		});


	}
	
	$scope.tabName = "Vendors";
	
	$scope.showDeviceModelForm = false;
	
	$scope.currentVendorDetails = {id:0,vendor:''};
	
	self.deviceModels = [];
	
	self.vendorModelDetails = {id:0,modelName:'',modelVersion:'',vendorId:0};
	
	self.saveDeivceModels = function(){
		self.vendorModelDetails.vendorId = $scope.currentVendorDetails.id;
		logDevicesFactory.saveDeivceModelVersion(self.vendorModelDetails).then(function(response){		
			if(response.data.status){
				self.vendorAlertMessages.push({type:"success",msg:'Model Creation was Successfull'});
				self.loadVendorModelDetails();
				$scope.showDeviceModelForm = false;
			}else if(response.data.error){
				for(var i=0;i<response.data.error.length;i++){
						self.vendorAlertMessages.push({ type: 'danger', msg: response.data.error[i].defaultMessage });
					}
				//self.vendorAlertMessages.push({type:"danger",msg:response.data.data});
			}
			$timeout(function(){
				self.vendorAlertMessages = [];
			},3000);
		},function(error){
		});
	}
	
	self.deleteVendorModelDetails = function(id){
		
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete model. Once Deleted, OBELUS will not recevice logs ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){

						logDevicesFactory.deleteVendorModelDetails(id).then(function(response){		
							if(response.status === 2000){
								self.vendorAlertMessages.push({type:"success",msg:'Device Model was delete Successfull'});
								self.loadVendorModelDetails();
								$scope.showDeviceModelForm = false;
							}else{
								self.vendorAlertMessages.push({type:"danger",msg:response.data.data});
							}
							$timeout(function(){
								self.vendorAlertMessages = [];
							},3000);
						},function(error){
						});

					}
				},
				close: function(scope, button){
				}
			}
		});
		
		
	}
	
	
	$scope.openDevicesmodel = function(data){
		$scope.tabName = "Device Model";
		$scope.currentVendorDetails.id = data.id;
		$scope.currentVendorDetails.vendor = data.vendorName;
		self.vendorModelDetails.vendorId = data.id
		self.loadVendorModelDetails();
	}
	
	self.loadVendorModelDetails = function(){
		logDevicesFactory.getLogModelsBasedOnDevice($scope.currentVendorDetails.id).then(function(response){		
			self.deviceModels = response.data;
		},function(error){
		});
		
	}
	
	$scope.openDeviceModelForm = function(){
		self.vendorModelDetails = {id:0,modelName:'',modelVersion:'',vendorId:0};
		$scope.showDeviceModelForm = true;
	}

	self.loadAllDevices();

	$scope.editMode = false;
	self.aws = {name:"",description:"",s3Region:"",bucketName:"",pathExpression:"",accessId:"",accessKey:"",logDevice:"could",logType:"",token:"",url:"",collectorId:0,logTypeId:0}

	$scope.showManageLogTypes = false;

	$scope.showHomeButton = true;

	self.enableEditMode = function(){

		$scope.editMode = true;
	}

	self.disableEditMode = function(){

		$scope.editMode = false;
	}

	$("#onboardDevices").hide();

	$("#deleteLogButton").hide();

	$("#editButton").hide();
	$("#deleteButton").hide();
	$("#editLogButton").hide();
	$("#deleteLogButton").hide();
	$("#showLogTypesButton").hide();

	self.canDelete = false;
	self.canUpdate = false;
	self.canCreate = false;
	self.canCreateDomainTypeAttribute = false;
	self.canUpdateDomainTypeAttribute = false;
	self.canDeleteDomainTypeAttribute = false;

	self.newLogType = {deviceTypeId:0,logDeviceName:'',logType:'',canEdit:true,vendorName:'',deviceModel:'',deviceVersion:'',vendorId:0};

	$scope.templateUrl = "devices.html";

	self.deviceDetails =  {id:0,deviceName:"",deviceIp:"",deviceMacAddress:"",deviceStatus:"",deviceType:"",username:"",password:"",domain:"",staleInMins:0,collectorId:'',logTypeId:0,canEdit:true,syslogFormat:''};

	self.showLogTypes = function(id,name){

		$scope.showManageDevicesPage = false;
		$scope.showManageLogTypes = true;


		self.newLogType.deviceTypeId = id;
		self.newLogType.logDeviceName = name;
		logDevicesFactory.getAllLogTypesByDeviceId(id).then(function(response){		


			self.logTypesList = angular.copy(response.data);
			$scope.templateUrl = "logTypes.html";
			self.loadAgGridForLogTypes();
			self.selectedLogTypes = []; 
			$("#logTypes").prop('checked',false);
			$("#editLogButton").hide();
			$("#deleteLogButton").hide();
			$("#onboardDevices").hide();
			$("#deleteLogButton").hide();

			$("#showLogSources").hide()


		},function(error){

		});


	}

	$scope.aws_cloud = false;

	$scope.currentLogTypeId = 0;
	$scope.onBoardDevice = function(){
		self.deviceDetails =  {id:0,deviceName:"",deviceIp:"",deviceMacAddress:"",deviceStatus:"",deviceType:"",username:"",password:"",domain:"",staleInMins:0,collectorId:0,logTypeId:0,canEdit:true};

		$("#onBoardDeviceModel").modal();
		
	}

	$scope.generateAWSKey = function(){

		if($scope.aws_cloud && self.deviceDetails.canEdit){
			self.deviceDetails.deviceKey = self.aws.name.replace(/ /g,"_");
		}else if(self.deviceDetails.canEdit){
			self.deviceDetails.deviceKey = self.deviceDetails.deviceName.replace(/ /g,"_");
		}



	}
	
self.licenceMessage = "";
	
	self.loadLicenceUsage = function(){
		deviceService.loadLicenceUsage().then(function(response){
			self.licenceMessage = response.data;
			
		});
	}
	
	self.loadLicenceUsage();


	self.loadPermissions = function(){

		loader("body");

		conditionFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("add device")!=-1){
				self.canCreate = true;
			}
			if(response.data.indexOf("update device")!=-1){
				self.canUpdate = true;
			}
			if(response.data.indexOf("delete device")!=-1){
				self.canDelete = true;
			}
			if(response.data.indexOf("delete devicedelete device")!=-1){
				self.canDelete = true;
			}
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

	self.cloudCollectors = [];

	self.nonCloudCollectors = [];

	self.loadCollectors = function(){
		deviceService.loadCollectors().then(function(response){
			self.collectorAllDetails = response.data;
			for(var i=0;i<self.collectorAllDetails.length;i++){
				if(self.collectorAllDetails[i].type === 'cloud'){
					self.cloudCollectors.push(self.collectorAllDetails[i]);
				}else{
					self.nonCloudCollectors.push(self.collectorAllDetails[i]);
				}
			}
		});
	}

	self.loadCollectors();


self.alertErrorMessagaesModal = [];

	self.saveDeviceType = function(){
		if(self.newlogDevice.displayName == undefined || self.newlogDevice.displayName == '' || self.newlogDevice.deviceName == undefined || self.newlogDevice.deviceName == '' || self.newlogDevice.description == '' || self.newlogDevice.description == undefined){
			self.alertMessagaesModal.push({type:"danger",msg:"Please fill highlighted fields"});
			$timeout(function(){
				self.alertMessagaesModal = [];
			},2000);
			return false;
		}

	
	
		logDevicesFactory.saveDeviceType(self.newlogDevice).then(function(response){
			if(response.data.status){	
				$("#newDeviceType").modal('hide');
				self.alertMessagaes.push({type:"success",msg:"Successfully saved Device Type"});
				$timeout(function(){
					self.alertMessagaes = [];
				},3000);
				$("#newDeviceType").modal('hide');
				self.getDeviceTypes();
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.alertErrorMessagaesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertErrorMessagaesModal.push({type:"danger",msg:response.data.message});
				}
				$timeout(function(){
					self.alertErrorMessagaesModal = [];
				},3000);
			}
		},function(error){

			if(error.status === 403){
				self.alertErrorMessagaesModal.push({type:"danger",msg:error.data.data});
			}else{
				self.alertErrorMessagaesModal.push({type:"danger",msg:"Unable to save the Device type : "+error});
			}


			$timeout(function(){
				self.alertErrorMessagaesModal = [];
			},3000);
		});
	}




	self.logSources = [];
	self.deviceAlertMessages = [];
	$scope.enableOrDisableDevice = function(id){
		var data = {"id":id}
		deviceService.enableOrDisableDevice(data).then(function (response) {

			self.deviceAlertMessages.push({ type: 'success', msg: 'Successfully updated the device status' });
			$timeout(function () {
				self.deviceAlertMessages = [];
			}, 2000);
			$scope.showSources($scope.currentLogType);

		}, function (error) {
			if(error.status== 403){
				self.deviceAlertMessages.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.deviceAlertMessages = [];
				}, 2000);

			}else{
				self.deviceAlertMessages.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.deviceAlertMessages = [];
				}, 2000);
				$("#createNewTag").modal('hide');
			}

		});
	}

	self.backToDevices = function(){
		$scope.showManageDevicesPage = true;
		$scope.showManageLogTypes = false;
		$scope.templateUrl = "devices.html";
		$("#editLogButton").hide();
		$("#onboardDevices").hide();
		$("#deleteLogButton").hide();
		$("#showLogTypesButton").hide();
		$("#deleteLogButton").hide();
		self.loadAgGrid();

	}



	$scope.currentLogType = "";

	$scope.showSources = function(logType){
		$scope.currentLogType = logType;
		$scope.currentLogTypeId = logType;
		logDevicesFactory.getSources(logType).then(function (response) {

			self.logSources = response.data;
			$("#logSourcesModal").modal();
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

	$scope.saveS3Configuration = function(){
		//self.deviceDetails =  {id:0,deviceName:"",deviceIp:"",deviceMacAddress:"",deviceStatus:"",deviceType:"",username:"",password:"",domain:"",staleInMins:0,collectorId:0,deviceConfig:''};
		self.deviceDetails.deviceName =self.aws.name;
		self.deviceDetails.deviceConfig = JSON.stringify(self.aws);
		self.deviceDetails.collectorId = self.aws.collectorId;
		self.deviceDetails.cloudToken = self.aws.token;
		self.deviceDetails.logTypeId = $scope.currentLogTypeId;


		deviceService.saveDevices(self.deviceDetails).then(function (response) {

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "successfully onboarded the log type" });
				$("#onBoardDeviceModel").modal('hide');
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				self.showLogTypes(self.newLogType.deviceTypeId,self.newLogType.logDeviceName);

			}else{
				self.deviceErrors.push({ type: 'danger', msg: "unable to onboard log type please contact admin" });
				$timeout(function () {
					self.deviceErrors = [];
				}, 2000);
			}


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


	$scope.generateSubScriptionLink = function(){

		deviceService.generateSubScriptionLink().then(function (response) {

			self.aws.token = response.data.token;
			self.aws.url = response.data.url;


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

	self.deviceErrors = [];

	$scope.showVendors = function(){
		$("#vendorDetails").modal();
	}

	$scope.backToVendors= function(){
		$scope.showVendorForm = false;
		$scope.tabName = "Vendors";
	}
	
	$scope.editVendorModelDetails = function(data){
		self.vendorModelDetails = angular.copy(data);
		$scope.showDeviceModelForm = true;
	}
	
	
	
	$scope.backToDevicesModels = function(){
		$scope.showDeviceModelForm = false;
		$scope.tabName = "Device Model";
	}

	$scope.openVendorForm = function(){
		self.vendorFrom = {id:0,vendorName:'',deviceModel:'',deviceVersion:''}
		$scope.showVendorForm = true;
		
	}


	self.saveDevice = function(){


		//self.deviceDetails.logDeviceName= self.newLogType.logDeviceName;
		//self.deviceDetails.deviceId = self.newLogType.deviceTypeId
		//elf.deviceDetails.logType= self.newLogType.logType;

		self.deviceDetails['deviceCloudConfiguration'] = JSON.stringify($scope.cloudConfig);

		
		deviceService.saveDevices(self.deviceDetails).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "successfully onboarded the log type" });
				$("#onBoardDeviceModel").modal('hide');
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				self.getDeviceTypes();
				$("#onBoardDeviceModel").modal('hide');


			}else{
				self.deviceErrors.push({ type: 'danger', msg: "unable to onboard log type please contact admin" });
				$timeout(function () {
					self.deviceErrors = [];
				}, 2000);
			}







		}, function (error) {
			if(error.status== 403){
				self.deviceErrors.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.deviceErrors = [];
				}, 2000);

			}else{
				self.deviceErrors.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.deviceErrors = [];
				}, 2000);

			}

		});
	}

	$scope.deleteDevice = function(deviceName){
		var data = {"deviceName":deviceName}

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete device. Once Delete OBELUS will not recevice logs ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){

						deviceService.deleteDevice(data).then(function (response) {

							self.deviceAlertMessages.push({ type: 'success', msg: 'Successfully delete the device' });
							$timeout(function () {
								self.deviceAlertMessages = [];
							}, 2000);
							self.getDeviceTypes();

							$("#onBoardDeviceModel").modal('hide');

						}, function (error) {
							if(error.status== 403){
								self.deviceAlertMessages.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.deviceAlertMessages = [];
								}, 2000);

							}else{
								self.deviceAlertMessages.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.deviceAlertMessages = [];
								}, 2000);
								$("#createNewTag").modal('hide');
							}

						});

					}
				},
				close: function(scope, button){
				}
			}
		});


	}

	$(document).on('click', 'a.logType', function() {
		var logType = $(this).attr("data-log-type");

		for(var i=0;i<self.logTypesList.length;i++){
			if(self.logTypesList[i].displayName === logType){
				self.editLogType(self.logTypesList[i].id);
				break;
			}
		}
	});

	$(document).on('click', 'a.logSource', function() {
		var logType = $(this).attr("data-log-type");

		self.deviceDetails =  {id:0,deviceName:"",deviceIp:"",deviceMacAddress:"",deviceStatus:"",deviceType:"",username:"",password:"",domain:"",staleInMins:0,collectorId:0,logTypeId:0,canEdit:true};


		for(var i=0;i<self.allDevices.length;i++){
			if(self.allDevices[i].deviceName === logType){
				//self.editLogType(self.logTypesList[i].id);
				$scope.editLogSoruce(logType);
				break;
			}
		}
	});

	$(document).on('click', 'a.deviceType', function() {
		var logType = $(this).attr("data-log-type");

		for(var i=0;i<self.deviceTypes.length;i++){
			if(self.deviceTypes[i].deviceTypedisplayName === logType){
				self.editDeviceType(self.deviceTypes[i])
				break;
			}
		}
	});






	self.columnDefs = [
		{headerName: "Device Type",field: "deviceTypedisplayName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true},
			cellRenderer: function(params) {
				if(params.value){
					return "<a href='javascript:void('0')' data-log-type = '"+params.value+"' class = 'deviceType'>"+ params.value+"</a>"
				}else{
					return "<a href='javascript:void('0')'  data-log-type = '"+params.node.key+"' class = 'deviceType'>"+ params.node.key+"</a>"


				}

			},
			rowGroup: true, hide: true},
			{headerName: "Device Vendor",field: "vendorName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Device Model",field: "deviceModel",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Device Version",field: "deviceVersion",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Log Type",field: "logTypedisplayName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true},rowGroup: true, hide: true,
				cellRenderer: function(params) {
					if(params.value){
						return "<a href='javascript:void('0')' data-log-type = '"+params.value+"' class = 'logType'>"+ params.value+"</a>"
					}else{
						return "<a href='javascript:void('0')'  data-log-type = '"+params.node.key+"' class = 'logType'>"+ params.node.key+"</a>"


					}

				}
			},
			{headerName: "Log Source",field: "logSourceName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true},

				cellRenderer: function(params) {
					if(params.value){
						return "<a href='javascript:void('0')' data-log-type = '"+params.value+"' class = 'logSource'>"+ params.value+"</a>"
					}

				}

			},


			{headerName: "Log Source IP",field: "logSourceIP",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},

			{headerName: "First Seen",field: "firstSeen",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Last Seen",field: "lastSeen",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Number of Events",field: "numberOfMessage",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Status",field: "status",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
				
			]



	self.logTypeColumnDefs = [
		{headerName: "Log Type",field: "logType",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Description",field: "description",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Display Name",field: "displayName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Status",field: "logOnBoardStatus",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true},
			cellRenderer: function(params) {
				if(params.value === 'OnBoarded'){
					return '<i style = "color:#19d895" class = "ion-checkmark-circled" title = "OnBoarded" ></i>'
				}else{
					return '<i style = "color:#ffaf00" class = "ion-alert-circled" title = "Awaiting"></i>'
				}

			}
		},
		{headerName: "First Seen",field: "firstSeen",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Last Seen",field: "lastSeen",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Number of Events",field: "numberOfMessage",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Number of Devices",field: "numberOfDevices",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}}




		]

	self.logTypeeventGrid = {};

	self.loadAgGridForLogTypes = function(){


		$timeout(function(){


			self.logTypeeventGrid = {
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
					columnDefs: self.logTypeColumnDefs,
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

//						defaultToolPanel: 'columns'
					},
					rowData: self.logTypesList,
					rowSelection: 'single',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onSelectionChangeLogType,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					},
					onGridReady: function (params) {
				        window.onresize = () => {
				        	setTimeout(function(){
					           params.api.sizeColumnsToFit();
					           $("#logTypes").css("height",$(window).height()-350+"px");
				        	},500);
				        }
					}
			}
			$("#logTypes").empty();
			self.widgetId = [];

			$("#logTypes").css("height",$(window).height()-300+"px");
			if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
				self.eventGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#logTypes');
			new agGrid.Grid(eGridDiv, self.logTypeeventGrid );
		},250);
	}

	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{
	    		 self.eventGrid.api.sizeColumnsToFit();
				$("#logTypes").css("height",$(window).height()-300+"px");
	    	 }catch(err){}
	    }, 500);
	});
	self.loadAgGrid = function(){


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
						width: 180,
						cellRendererParams: {
							suppressCount: true,
							checkbox: true,
						},
					},
					columnDefs: self.columnDefs,
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

//						defaultToolPanel: 'columns'
					},
					rowData: self.deviceTypesList,
					rowSelection: 'single',
					floatingFilter:true,
					rowGroupPanelShow: 'always',

					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}
			$("#logDeviceTypes").empty();
			self.widgetId = [];

			$("#logDeviceTypes").css("height",$(window).height()-250+"px");
			if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
				self.eventGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#logDeviceTypes');
			new agGrid.Grid(eGridDiv, self.eventGrid );
		},250);
	}


	self.deviceTypeId = [];

	$scope.showEditLogSources = false;

	$scope.editLogSoruce = function(logType){
		for(var i=0;i<self.allDevices.length;i++){
			if(self.allDevices[i].deviceName === logType){
				self.deviceDetails  = angular.copy(self.allDevices[i]);
				self.deviceDetails.collectorId = self.allDevices[i].collectorId.toString();
				self.deviceDetails.logTypeId = self.allDevices[i].logTypeId.toString();
				self.deviceDetails.collectorSource = self.allDevices[i].collectorSource;
				
				$scope.cloudConfig = JSON.parse(self.allDevices[i].deviceCloudConfiguration);
				for(var i=0;i<self.nonCloudCollectors.length;i++){

			if(parseInt(self.deviceDetails.collectorId) === self.nonCloudCollectors[i].id ){
				$scope.collectorType = self.nonCloudCollectors[i].collectorType;
				isCloudFound = true;
				break;
			}
		}
				$("#onBoardDeviceModel").modal();
				$scope.$apply();
				break;
			}
		}
	}

	self.onSelectionChanged = function() {
		self.deviceTypeId = [];
		$("#editButton").hide();
		$("#deleteButton").hide();
		$("#showLogTypesButton").hide();
		self.deviceTypeId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.deviceTypeId.length > 0){			
			$("#editButton").show();
			$("#deleteButton").show();
			$("#showLogTypesButton").show();
		}else{
			$("#editButton").hide();
			$("#deleteButton").hide();
			$("#showLogTypesButton").hide();
		}
	}

	self.logTypeId = [];
	self.onSelectionChangeLogType = function() {
		self.logTypeId = [];
		$("#editLogButton").hide();
		$("#onboardDevices").hide();
		$("#deleteLogButton").hide();
		$("#showLogTypesButton").hide();
		$("#deleteLogButton").hide();
		$("#showLogSources").hide()
		self.logTypeId = angular.copy(self.logTypeeventGrid.api.getSelectedRows());
		if(self.logTypeId.length > 0){			
			$("#editLogButton").show();
			$("#onboardDevices").show();
			$("#deleteLogButton").show();
			$("#showLogTypesButton").show();
			$("#deleteLogButton").show();
			$("#showLogSources").show()
		}
	}

	self.vendorDetails = [];

	self.deviceModels = [];

	self.vendorNameOptions = {

			optgroupField: 'class',
			labelField: 'vendorName',
			searchField: 'vendorName',
			valueField: 'vendorName',
			maxItems:1,
			create: function(value,silent){
				self.saveVendorNames(value);
				return true;	
			}
	}

	self.deviceNameOptions = {

			optgroupField: 'class',
			labelField: 'deviceModel',
			searchField: 'deviceModel',
			valueField: 'deviceModel',
			maxItems:1,
			create: function(value,silent){
				self.saveDeviceModel(value);
				return true;	
			},
			load : function(value){
				console.log()
			}
	}

	self.loadVendorDetails = function(){
		logDevicesFactory.loadVendorDetails().then(function(response){
			self.vendorDetails = angular.copy(response.data);

		},function(error){
			if(error.status === 403){
				self.alertMessagaes.push({type:"danger",msg:error.data.data});
			}
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
		});
	}
	self.loadVendorDetails();

	self.vendorFrom = {id:0,vendorName:'',deviceModel:''}

	self.saveDeviceModel = function(value){
		self.vendorFrom.vendorName = self.newLogType.vendorName;
		self.vendorFrom.deviceModel = value;

		logDevicesFactory.saveDeviceModel(self.vendorFrom).then(function(response){

			if(response.data.status){
				self.loadVendorDetails();
			}

		},function(error){
			if(error.status === 403){
				self.alertMessagaes.push({type:"danger",msg:error.data.data});
			}
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
		});
	}
	self.vendorAlertMessages = [];

	$scope.editVendorForms = function(data){
		self.vendorFrom = angular.copy(data);
		$scope.showVendorForm = true;
	}

	self.saveVendorNames = function(){



		logDevicesFactory.saveVendorNames(self.vendorFrom).then(function(response){

			if(response.data.status){
				self.vendorAlertMessages.push({type:"success",msg:'Vendor Creation was Successfull'});
				self.loadVendorDetails();
			}else if(response.data.error){
				
				
					for(var i=0;i<response.data.error.length;i++){
						self.vendorAlertMessages.push({ type: 'danger', msg: response.data.error[i].defaultMessage });
					}
				
				
				//self.vendorAlertMessages.push({type:"danger",msg:response.data.data});
			}
			$timeout(function(){
				self.vendorAlertMessages = [];
			},3000);

		},function(error){
			if(error.status === 403){
				self.alertMessagaes.push({type:"danger",msg:error.data.data});
			}
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
		});
	}


	self.getDeviceTypes = function(){
		logDevicesFactory.getDevices().then(function(response){
			self.deviceTypesList = angular.copy(response.data);
			var tempArray = [];
			for(var i=0;i<self.deviceTypesList.length;i++){
				self.deviceTypesList[i].checked = false;
				if(tempArray.indexOf(self.deviceTypesList[i].deviceTypedisplayName)==-1){
					tempArray.push(self.deviceTypesList[i].deviceTypedisplayName);
					self.deviceTypes.push(self.deviceTypesList[i]);
				}
			}
			self.selectedEvents = [];

			self.loadAgGrid();

			$("#deviceTypes").prop('checked',false);


		},function(error){
			if(error.status === 403){
				self.alertMessagaes.push({type:"danger",msg:error.data.data});
			}
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
		});
	}

	self.selected = {};
	self.newlogDevice = {};

	self.editDeviceType = function(deviceTypesList){



		self.newlogDevice.id = deviceTypesList.deviceTypeId;
		self.newlogDevice.displayName = deviceTypesList.deviceTypedisplayName;

		self.newlogDevice.deviceName =  deviceTypesList.deviceType;
		self.newlogDevice.description =  deviceTypesList.description;
		$("#newDeviceType").modal('show');
		$scope.$apply();
		//self.newlogDevice = angular.copy(self.deviceTypesList[i]);



	}

	self.editLogType = function(id){
		for(var i=0;i<self.logTypesList.length;i++){
			if(id == self.logTypesList[i].id){
				self.newLogType = self.logTypesList[i];
				self.newLogType.deviceTypeId = self.logTypesList[i].deviceTypeId.toString();
				self.newLogType.vendorId = self.logTypesList[i].vendorId.toString();
				$("#newLogType").modal();
				$scope.$apply()
				break;


			}
		}

	}

	self.cloneLogType = function(id){
		for(var i=0;i<self.logTypesList.length;i++){
			if(id == self.logTypesList[i].id){
				self.newLogType = angular.copy(self.logTypesList[i]);
				self.newLogType.deviceTypeId =self.newLogType.deviceTypeId+""; 
			}
		}
		self.newLogType.analyzed = (self.newLogType.analyzed == undefined)? false:true;
		delete self.newLogType.id;
		delete self.newLogType.logTypeId;
		$("#newLogType").modal('show');
	}

	self.cloneDeviceType = function(id){
		for(var i=0;i<self.deviceTypesList.length;i++){
			if(id == self.deviceTypesList[i].id){				
				self.newlogDevice = angular.copy(self.deviceTypesList[i]);
			}
		}
		delete self.newlogDevice.id; 
		delete self.newlogDevice.deviceId;
		$("#newDeviceType").modal('show');
	}

	self.deleteVendor = function(id){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete Vendor ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						logDevicesFactory.deleteVendor(id).then(function(response){
							if(response.status === 200){
								self.allToggle = false;
								//$("#deviceTypes").prop('checked',false);

								self.vendorAlertMessages.push({type:"success",msg:'Vendor Deleteion was Successfull'});
								self.loadVendorDetails();
								$timeout(function(){
									self.vendorAlertMessages = [];
								},3000);

							}else{

								self.vendorAlertMessages.push({type:"danger",msg:"Unable to delete the device types reason : "+response.data.message});
								$timeout(function(){
									self.vendorAlertMessages = [];
								},3000);
							}


						},function(error){
							self.allToggle = false;


							$timeout(function(){
								self.alertMessagaes = [];
							},3000);
						});
						self.allToggle = false;
						$("#deviceTypes").prop('checked',false);
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});
	}

	self.deleteDeviceType = function(id){

		self.selectedEvents = [];

		self.selectedEvents.push(id);


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete? Once Deletion Operation was succesfully OBELUS will not recevice to OBELUS for this device type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						logDevicesFactory.deleteDevice(self.selectedEvents).then(function(response){
							if(response.data.status){
								self.allToggle = false;
								//$("#deviceTypes").prop('checked',false);
								
								self.alertMessagaes.push({type:"success",msg:"Successfully deleted the device type."});
								$timeout(function(){
									self.alertMessagaes = [];
								},3000);
								self.selectedEvents = [];
								$("#newDeviceType").modal('hide');
							}else{
								$("#editButton").hide();
								$("#deleteButton").hide();
								self.alertErrorMessagaesModal.push({type:"danger",msg:"Unable to delete the device types reason : "+response.data.message});
								$timeout(function(){
									self.alertErrorMessagaesModal = [];
								},3000);
							}
							self.getDeviceTypes();

						},function(error){
							self.allToggle = false;
							$("#deviceTypes").prop('checked',false);
							self.selectedEvents = [];
							self.getDeviceTypes();
							$("#editButton").hide();
							$("#deleteButton").hide();
							if(error.status === 403){
								self.alertErrorMessagaesModal.push({type:"danger",msg:error.data.data});
							}else{
								self.alertErrorMessagaesModal.push({type:"danger",msg:"Unable to delete the device types reason : "+response.data.message});
							}


							$timeout(function(){
								self.alertErrorMessagaesModal = [];
							},3000);
						});
						self.allToggle = false;
						$("#deviceTypes").prop('checked',false);
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});
	}

	self.createDeviceType = function(){
		$("#newDeviceType").modal('show');
		self.newlogDevice = {};
		$scope.deviceTypeform.$setPristine()
		$scope.deviceTypeform.$setUntouched()
	}


	self.getAllLogTypes = function(){
		logDevicesFactory.getAllLogTypes().then(function(response){			
			self.logTypesList = angular.copy(response.data);
			self.selectedLogTypes = []; 
			$("#logTypes").prop('checked',false);

		},function(error){

		});
	}


	self.deleteLogTypesById = function(id){

		self.selectedLogType = [];
		self.selectedLogType.push(id)

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						logDevicesFactory.deleteLogTypesByIds(self.selectedLogType).then(function(response){
							if(response.data.status){
								self.alertMessagaes.push({type:"success",msg:"successfully deleted the log type"});
								$timeout(function(){
									self.alertMessagaes = [];
								},3000);
								$("#newLogType").modal('hide');
								self.getDeviceTypes();
								self.toggleLogtypes = false;

							}else{
								self.alertMessagaes.push({type:"danger",msg:"Unable to delete the log type reason : "+response.data.message});
								$timeout(function(){
									self.alertMessagaes = [];
								},3000);
							}
						},function(error){
							self.alertMessagaes.push({type:"danger",msg:"Unable to delete the log type reason : "+response.data.error});
							$timeout(function(){
								self.alertMessagaes = [];
							},3000);
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});
	}


	$scope.aws_cloud = false;
	
	self.logTypesErrorMessage = [];


	self.newLogType = {analyzed:true}

	self.saveLogTypes = function(){
		if(self.newLogType.deviceTypeId == undefined || self.newLogType.deviceTypeId == '' || self.newLogType.description == '' || self.newLogType.description == undefined || self.newLogType.logType == '' || self.newLogType.logType == undefined){
			self.alertMessagaesModal.push({type:"danger",msg:"Please fill highlighted fields"});
			$timeout(function(){
				self.alertMessagaesModal = [];
			},2000);
			return false;
		}


		var file = $scope.deviceLogo;
		var fd = new FormData();
		fd.append('file', file);
		fd.append('data', JSON.stringify(self.newLogType));


		
		self.newLogType.deviceTypeId = Number(self.newLogType.deviceTypeId)
		if(self.newLogType.analyzed == undefined){
			self.newLogType.analyzed = false;
		}
		self.newLogType.analyzed = self.newLogType.analyzed.toString();
		logDevicesFactory.saveLogTypes(self.newLogType).then(function(response){
			if(response.data.status){
				self.alertMessagaes.push({type:"success",msg:"successfully added the log type"});
				$("#newLogType").modal('hide');
				$timeout(function(){
					self.alertMessagaes = [];
				},3000);
				self.getDeviceTypes();
				
			}else{
				if(response.data.error){
					for(var i=0;i<response.data.error.length;i++){
						self.logTypesErrorMessage.push({ type: 'danger', msg: response.data.error[i].defaultMessage });
					}
				}else{
					self.logTypesErrorMessage.push({type:"danger",msg:"unable to save the log type reason: "+response.data.message});
				}
				$timeout(function(){
					self.logTypesErrorMessage = [];
				},3000);
			}
		},function(error){
			self.logTypesErrorMessage.push({type:"danger",msg:"unable to save the log type reason: "+error});
			$timeout(function(){
				self.logTypesErrorMessage = [];
			},3000);
		});
	}

	self.createLogType = function(){

		self.newLogType = {id:0,analyzed:false,description:"",logType: "",deviceId:'',displayName:'',deviceTypeId:0,canEdit:false,vendorId:0}

		$("#newLogType").modal('show');
		$scope.logTypeForm.$setPristine()
		$scope.logTypeForm.$setUntouched()


	}

	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0).notSortable()
		];
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [1, 'asc']);



	self.selectedEvents = [];
	self.toggleAll = function(flag){
		self.selectedEvents = [];
		for(var i=0;i<self.deviceTypesList.length;i++){
			self.deviceTypesList[i].checked = flag;
			if(flag == true){
				self.selectedEvents.push(self.deviceTypesList[i].id)
			}
		}
	}


	self.changeValue = function(id){
		if(self.selectedEvents.indexOf(id) == -1){
			self.selectedEvents.push(id);
		}else{
			self.selectedEvents.splice(self.selectedEvents.indexOf(id),1);
		}
		if(self.selectedEvents.length == self.deviceTypesList.length){
			$scope.selectAll = true;
			$("#selectAllId").prop('checked',true);
		}else{
			$scope.selectAll = false;
			$("#selectAllId").prop('checked',false);
		}
	}


	self.selectedLogTypes = [];
	self.toggleLogTypesAll = function(flag){
		self.selectedLogTypes = [];
		for(var i=0;i<self.logTypesList.length;i++){
			self.logTypesList[i].checked = flag;
			if(flag == true){
				self.selectedLogTypes.push(self.logTypesList[i].id)
			}
		}
	}

	self.changeLogTypesValue = function(id){
		if(self.selectedLogTypes.indexOf(id) == -1){
			self.selectedLogTypes.push(id);
		}else{
			self.selectedLogTypes.splice(self.selectedLogTypes.indexOf(id),1);
		}
		if(self.logTypesList.length == self.selectedLogTypes.length){
			$scope.selectAll = true;
			$("#logTypes").prop('checked',true);
		}else{
			$scope.selectAll = false;
			$("#logTypes").prop('checked',false);
		}
	}

	//------------------Log Fields------------
	self.selectedLogFields = [];

	self.saveLogFields = function(){
		if(self.newField.deviceTypeId == undefined || self.newField.deviceTypeId == '' || self.newField.description == '' || self.newField.description == undefined || self.newField.fieldName == '' || self.newField.fieldName== undefined || self.newField.displayName== undefined || self.newField.displayName== ""){
			self.alertMessagaesModal.push({type:"danger",msg:"Please fill highlighted fields"});
			$timeout(function(){
				self.alertMessagaesModal = [];
			},2000);
			return false;
		}
		$("#newLogFields").modal('hide');
		logDevicesFactory.saveLogFields(self.newField).then(function(response){
			if(response.data.status){
				self.alertMessagaes.push({type:"success",msg:"successfully saved the log field"});
				$timeout(function(){
					self.alertMessagaes= [];
				},3000);
			}else{
				try{


					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){
							self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.alertMessagaes.push({type:"danger",msg:"Unable to save the log field reason : "+response.data.message});
					}
				}catch(err){
					console.log(err);
				}
				$timeout(function(){
					self.alertMessagaes= [];
				},3000);
			}
			self.getAllLogFields();
		},function(error){
			self.alertMessagaes.push({type:"danger",msg:"Unable to save the log field reason : "+error});
			$timeout(function(){
				self.alertMessagaes= [];
			},3000);
		})
	}

	self.getAllLogFields = function(){
		logDevicesFactory.getAllLogFields().then(function(response){
			self.logFieldsList = angular.copy(response.data)
			for(var i=0;i<self.logFieldsList.length;i++){
				self.logFieldsList[i].checked = false;
			}
			self.selectedLogFields = [];

			$("#logFields").prop('checked',false);
		},function(error){

		})
	}


	self.deleteLogFields = function(){

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						logDevicesFactory.deleteLogFields(self.selectedLogFields).then(function(response){
							if(response.data.status){
								self.alertMessagaes.push({type:"success",msg:"successfully deleted the log type"});
								$timeout(function(){
									self.alertMessagaes = [];
								},3000);
								self.getAllLogFields();
								self.selectedLogFields = [];
								self.toggleLogFields = false;
								$("#logFields").prop('checked',false);									
							}else{
								self.alertMessagaes.push({type:"danger",msg:"Unable to delete the log type reason : "+response.data.message});
								$timeout(function(){
									self.alertMessagaes = [];
								},3000);
							}
							self.getAllLogFields();
						},function(error){
							self.alertMessagaes.push({type:"danger",msg:"Unable to delete the log type reason : "+response.data.error});
							$timeout(function(){
								self.alertMessagaes = [];
							},3000);
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});
	}

	self.editLogField = function(id){
		for(var i=0;i<self.logFieldsList.length;i++){
			if(self.logFieldsList[i].id == id){
				self.newField = angular.copy(self.logFieldsList[i]);
				self.newField.deviceTypeId = self.logFieldsList[i].deviceTypeId+"";
				if(self.logFieldsList[i].analyzed === "true"){
					self.newField.analyzed = true;
				}else{
					self.newField.analyzed = false;
				}
				break;
			}
		}
		$("#newLogFields").modal('show');
	}

	self.cloneLogField = function(id){
		self.selectedLogFields= [];
		for(var i=0;i<self.logFieldsList.length;i++){
			if(self.logFieldsList[i].id == id){
				self.newField = angular.copy(self.logFieldsList[i]);
				self.newField.deviceTypeId = self.logFieldsList[i].deviceTypeId+"";
				break;
			}
		}
		self.newField.analyzed = (self.newField.analyzed == undefined)? false:true;
		$("#newLogFields").modal('show');
		delete self.newField.logFieldId;
		delete self.newField.id;
	}

	self.createLogFields = function(){
		self.newField = {};
		$("#newLogFields").modal('show');
		self.newField['analyzed'] = false;
		$scope.fieldTypeForm.$setPristine()
		$scope.fieldTypeForm.$setUntouched()
	}


	self.selectedLogFields = [];
	self.toggleLogFieldsAll = function(flag){
		self.selectedLogFields= [];
		for(var i=0;i<self.logFieldsList.length;i++){
			self.logFieldsList[i].checked = flag;
			if(flag == true){
				self.selectedLogFields.push(self.logFieldsList[i].id)
			}
		}
	}

	self.changeLogFieldsValue = function(id){
		if(self.selectedLogFields.indexOf(id) == -1){
			self.selectedLogFields.push(id);
		}else{
			self.selectedLogFields.splice(self.selectedLogFields.indexOf(id),1);
		}

		if(self.logFieldsList.length == self.selectedLogFields.length){
			$scope.selectAll = true;
			$("#logFields").prop('checked',true);
		}else{
			$scope.selectAll = false;
			$("#logFields").prop('checked',false);
		}
	}

	self.refreshLogDevices = function(){
		logDevicesFactory.refreshLogDevices().then(function(response){
			self.init();
		},function(error){

		})
	}

	self.init = function(){
		self.loadPermissions();
		self.getDeviceTypes();
		self.getAllLogTypes();
		self.getAllLogFields();


	}
	self.init();

}]);