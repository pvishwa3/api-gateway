app.controller("deviceController", ['$scope', 'deviceService','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','logDevicesFactory','$sce','settingsFactory', function ($scope, deviceService , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,logDevicesFactory,$sce,settingsFactory) {

	var self = this;

	$scope.isDeviceTested = true;

	$scope.isEidtable = true;

	$scope.isHompage = true;

	$scope.isCollectorHompage = true;

	self.goBack = function(){
		$scope.isHompage = false;
		$scope.templateUrl = "viewDevices.html";
	}

	$scope.showSources= true;

	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	$scope.singleCloudConnector = "";

	$scope.viewType = function(type,logType){

		$scope.showSources= false;
		if(type != "Amazon S3"){
			self.aws.logType = logType;
		}
		$scope.singleCloudConnector  = type;
	}

	self.aws = {name:"",description:"",s3Region:"",bucketName:"",pathExpression:"",accessId:"",accessKey:"",logDevice:"could",logType:"",token:"",url:"",logTypeId:0}

	self.saveDevice = function(){
		deviceService.saveDevices(self.deviceDetails).then(function (response) {
			
			
			
			
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Connection Successfull' });
				$scope.isDeviceTested = false;
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);

				},2000);
				self.loadAllDevices();
				$scope.templateUrl = "viewDevices.html";


			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
				}
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
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
	

	$scope.saveS3Configuration = function(){
		//self.deviceDetails =  {id:0,deviceName:"",deviceIp:"",deviceMacAddress:"",deviceStatus:"",deviceType:"",username:"",password:"",domain:"",staleInMins:0,collectorId:0,deviceConfig:''};
		self.deviceDetails.deviceName =self.aws.name;
		self.deviceDetails.deviceConfig = JSON.stringify(self.aws);
		self.deviceDetails.collectorId = self.currentCollectorId;
		self.deviceDetails.cloudToken = self.aws.token;
		
		deviceService.saveDevices(self.deviceDetails).then(function (response) {

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
	
	$scope.enableOrDisable = function(id){
		
		var data = {"id":id};
		
		deviceService.enableOrDisable(data).then(function (response) {

			if(response.status ===200){
				self.alertMessagaes.push({ type: 'success', msg: 'Collector was updated successfully' });
				
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);

				},2000);
				self.loadCollectors();



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

	$scope.cloudConnectors = [
		{
			name : "Amazon S3",
			category : "Cloud Platform",
			subcategory: "Amazon S3",
			imgPath:$sce.trustAsHtml('<svg width="64" height="64" viewBox="0 0 256 310" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M20.624 53.686L0 64v181.02l20.624 10.254.124-.149V53.828l-.124-.142" fill="#8C3123"/><path d="M131 229L20.624 255.274V53.686L131 79.387V229" fill="#E05243"/><path d="M81.178 187.866l46.818 5.96.294-.678.263-76.77-.557-.6-46.818 5.874v66.214" fill="#8C3123"/><path d="M127.996 229.295l107.371 26.035.169-.269-.003-201.195-.17-.18-107.367 25.996v149.613" fill="#8C3123"/><path d="M174.827 187.866l-46.831 5.96v-78.048l46.831 5.874v66.214" fill="#E05243"/><path d="M174.827 89.631l-46.831 8.535-46.818-8.535 46.759-12.256 46.89 12.256" fill="#5E1F18"/><path d="M174.827 219.801l-46.831-8.591-46.818 8.591 46.761 13.053 46.888-13.053" fill="#F2B0A9"/><path d="M81.178 89.631l46.818-11.586.379-.117V.313L127.996 0 81.178 23.413v66.218" fill="#8C3123"/><path d="M174.827 89.631l-46.831-11.586V0l46.831 23.413v66.218" fill="#E05243"/><path d="M127.996 309.428l-46.823-23.405v-66.217l46.823 11.582.689.783-.187 75.906-.502 1.351" fill="#8C3123"/><path d="M127.996 309.428l46.827-23.405v-66.217l-46.827 11.582v78.04M235.367 53.686L256 64v181.02l-20.633 10.31V53.686" fill="#E05243"/></svg>')

		},{
			name : "Amazon Lambda",
			category : "Cloud Platform",
			subcategory: "Amazon S3",
			logType:"aws_lambda",
			device:"cloud",
			imgPath:$sce.trustAsHtml('<svg height="60" viewBox="-3.02291033 -.22032094 420.92291033 433.54032094" width="60S" xmlns="http://www.w3.org/2000/svg"><path d="m208.45 227.89c-1.59 2.26-2.93 4.12-4.22 6q-30.86 45.42-61.7 90.83-28.69 42.24-57.44 84.43a3.88 3.88 0 0 1 -2.73 1.59q-40.59-.35-81.16-.88c-.3 0-.61-.09-1.2-.18a14.44 14.44 0 0 1 .76-1.65q28.31-43.89 56.62-87.76 25.11-38.88 50.25-77.74 27.86-43.18 55.69-86.42c2.74-4.25 5.59-8.42 8.19-12.75a5.26 5.26 0 0 0 .56-3.83c-5-15.94-10.1-31.84-15.19-47.74-2.18-6.81-4.46-13.58-6.5-20.43-.66-2.2-1.75-2.87-4-2.86-17 .07-33.9.05-50.85.05-3.22 0-3.23 0-3.23-3.18 0-20.84 0-41.68-.06-62.52 0-2.32.76-2.84 2.94-2.84q51.19.09 102.4 0a3.29 3.29 0 0 1 3.6 2.43q27 67.91 54 135.77 31.5 79.14 63 158.3c6.52 16.38 13.09 32.75 19.54 49.17.77 2 1.57 2.38 3.59 1.76 17.89-5.53 35.82-10.91 53.7-16.45 2.25-.7 3.07-.23 3.77 2 6.1 19.17 12.32 38.3 18.5 57.45.21.66.37 1.33.62 2.25-1.28.47-2.48 1-3.71 1.34q-61 19.33-121.93 38.68c-1.94.61-2.52-.05-3.17-1.68q-18.61-47.16-37.31-94.28-18.29-46.14-36.6-92.28c-1.83-4.62-3.63-9.26-5.46-13.88-.29-.79-.69-1.48-1.27-2.7z" fill="#fa7e14"/></svg>')
		},{
			name : "Amazon Cloudtrail",
			category : "Cloud Platform",
			subcategory: "Amazon Cloudtrail",
			logType:"cloudtrail",
			device:"cloud",
			imgPath:$sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">  <image id="image0" width="64" height="64" x="0" y="0" href="data:image/png;base64,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"/></svg>')
		},{
			name : "Amazon Cloudwatch Logs",
			category : "Cloud Platform",
			subcategory: "Amazon Cloudwatch",
			logType:"aws_cloudwatch",
			device:"cloud",
			imgPath:$sce.trustAsHtml('<svg width="64" height="64" viewBox="0 0 256 290" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M256 199.305l-127.957-18.797L0 199.329l128.01 47.439L256 199.305" fill="#B7CA9D"/><path d="M25.621 197.113l21.63 6.761 1.971-2.238V50.284l-1.971-2.585-21.63 8.274v141.14" fill="#4B612C"/><path d="M123.832 190.423l-76.581 13.451V47.703l76.581 17.222v125.498" fill="#759C3E"/><path d="M89.686 216.889l-29.848-9.201V14.928L89.686.004l2.612 2.845v210.858l-2.612 3.182" fill="#4B612C"/><path d="M191.967 192.894L89.686 216.889V0l102.281 39.866v153.028" fill="#759C3E"/><path d="M127.965 244.714L0 199.329v26.324l127.965 63.983v-44.922" fill="#4B612C"/><path d="M256 225.622l-128.035 64.014v-44.922L256 199.305v26.317" fill="#759C3E"/><path d="M220.039 155.692h-31.026l-88.445 6.026L128 166.775l92.039-11.083" fill="#B7CA9D"/><path d="M100.568 219.906l27.42 8.226.789-.849-.023-61.849-.789-.758-27.397-2.958v58.188" fill="#4B612C"/><path d="M220.039 155.692l-92.074 8.98.023 63.46 92.051-27.711v-44.729" fill="#759C3E"/></svg>')
		},{
			name : "Amazon ELB",
			category : "Cloud Platform",
			subcategory: "Amazon ELB",
			logType:"aws_elb",
			device:"cloud",
			imgPath:$sce.trustAsHtml('<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 301 301" enable-background="new 0 0 301 301" xml:space="preserve">  <image id="image0" width="301" height="301" x="0" y="0"    xlink:href="data:image/png;base64,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" /></svg>')
		},
		{
			name : "Google Cloud Platform",
			category : "Cloud Platform",
			subcategory: "Amazon SNS",

			device:"cloud",
			imgPath:$sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#CFD8DC" d="M30,13H18l-7,11l7,11h12l7-11L30,13z M24,29c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S26.8,29,24,29z"/><path fill="#2196F3" d="M34.8,7.2C34.3,6.5,33.5,6,32.6,6H15.4c-0.9,0-1.7,0.5-2.2,1.2l-5.8,9.5L12,24l6.3-10h20.6L34.8,7.2z M16,11c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S16.6,11,16,11z M32,11c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S32.6,11,32,11z"/><path fill="#FFC107" d="M18.3,34L7.4,16.8l-3.6,5.9c-0.5,0.8-0.5,1.9,0,2.7l9.4,15.4c0.5,0.8,1.3,1.2,2.2,1.2h9.1l5.1-8H18.3z M8,25c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S8.6,25,8,25z M16,39c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S16.6,39,16,39z"/><path fill="#1976D2" d="M7.4 16.8L12 24 14.4 20.3 8.5 15z"/><path fill="#F9A825" d="M24.6 42L29.7 34 24.9 34 22.6 42z"/><path fill="#DD2C00" d="M44.2,22.7L38.9,14h-9.2L36,24L24.6,42h8c0.9,0,1.7-0.5,2.2-1.2l9.5-15.4C44.8,24.5,44.8,23.5,44.2,22.7z M32,39c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S32.6,39,32,39z M40,25c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S40.6,25,40,25z"/><path fill="#BF360C" d="M38.9 14L29.7 14 32.2 17.9 40.1 16z"/></svg>')

		},
		{
			name : "G Suite Apps Audit",
			category : "Cloud Platform",
			subcategory: "Amazon SNS",
			logType:"aws_elb",
			device:"cloud",
			imgPath:$sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64px" height="64px"><radialGradient id="95yY7w43Oj6n2vH63j6HJa" cx="31.998" cy="34.5" r="30.776" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4e9c3"/><stop offset=".219" stop-color="#f8eecd"/><stop offset=".644" stop-color="#fdf4dc"/><stop offset="1" stop-color="#fff6e1"/></radialGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJa)" d="M63.97,30.06C63.68,32.92,61.11,35,58.24,35H53c-1.22,0-2.18,1.08-1.97,2.34	c0.16,0.98,1.08,1.66,2.08,1.66h3.39c2.63,0,4.75,2.28,4.48,4.96C60.74,46.3,58.64,48,56.29,48H51c-1.22,0-2.18,1.08-1.97,2.34	c0.16,0.98,1.08,1.66,2.08,1.66h3.39c1.24,0,2.37,0.5,3.18,1.32C58.5,54.13,59,55.26,59,56.5c0,2.49-2.01,4.5-4.5,4.5h-44	c-1.52,0-2.9-0.62-3.89-1.61C5.62,58.4,5,57.02,5,55.5c0-3.04,2.46-5.5,5.5-5.5H14c1.22,0,2.18-1.08,1.97-2.34	C15.81,46.68,14.89,46,13.89,46H5.5c-2.63,0-4.75-2.28-4.48-4.96C1.26,38.7,3.36,37,5.71,37H13c1.71,0,3.09-1.43,3-3.16	C15.91,32.22,14.45,31,12.83,31H4.5c-2.63,0-4.75-2.28-4.48-4.96C0.26,23.7,2.37,22,4.71,22h9.79c1.24,0,2.37-0.5,3.18-1.32	C18.5,19.87,19,18.74,19,17.5c0-2.49-2.01-4.5-4.5-4.5h-6c-1.52,0-2.9-0.62-3.89-1.61S3,9.02,3,7.5C3,4.46,5.46,2,8.5,2h48	c3.21,0,5.8,2.79,5.47,6.06C61.68,10.92,60.11,13,57.24,13H55.5c-3.04,0-5.5,2.46-5.5,5.5c0,1.52,0.62,2.9,1.61,3.89	C52.6,23.38,53.98,24,55.5,24h3C61.71,24,64.3,26.79,63.97,30.06z"/><linearGradient id="95yY7w43Oj6n2vH63j6HJb" x1="29.401" x2="29.401" y1="4.064" y2="106.734" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff5840"/><stop offset=".007" stop-color="#ff5840"/><stop offset=".989" stop-color="#fa528c"/><stop offset="1" stop-color="#fa528c"/></linearGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJb)" d="M47.46,15.5l-1.37,1.48c-1.34,1.44-3.5,1.67-5.15,0.6c-2.71-1.75-6.43-3.13-11-2.37	c-4.94,0.83-9.17,3.85-11.64,7.97l-8.03-6.08C14.99,9.82,23.2,5,32.5,5c5,0,9.94,1.56,14.27,4.46	C48.81,10.83,49.13,13.71,47.46,15.5z"/><linearGradient id="95yY7w43Oj6n2vH63j6HJc" x1="12.148" x2="12.148" y1=".872" y2="47.812" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#feaa53"/><stop offset=".612" stop-color="#ffcd49"/><stop offset="1" stop-color="#ffde44"/></linearGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJc)" d="M16.01,30.91c-0.09,2.47,0.37,4.83,1.27,6.96l-8.21,6.05c-1.35-2.51-2.3-5.28-2.75-8.22	c-1.06-6.88,0.54-13.38,3.95-18.6l8.03,6.08C16.93,25.47,16.1,28.11,16.01,30.91z"/><linearGradient id="95yY7w43Oj6n2vH63j6HJd" x1="29.76" x2="29.76" y1="32.149" y2="-6.939" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#42d778"/><stop offset=".428" stop-color="#3dca76"/><stop offset="1" stop-color="#34b171"/></linearGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJd)" d="M50.45,51.28c-4.55,4.07-10.61,6.57-17.36,6.71C22.91,58.2,13.66,52.53,9.07,43.92l8.21-6.05	C19.78,43.81,25.67,48,32.5,48c3.94,0,7.52-1.28,10.33-3.44L50.45,51.28z"/><linearGradient id="95yY7w43Oj6n2vH63j6HJe" x1="46" x2="46" y1="3.638" y2="35.593" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#155cde"/><stop offset=".278" stop-color="#1f7fe5"/><stop offset=".569" stop-color="#279ceb"/><stop offset=".82" stop-color="#2cafef"/><stop offset="1" stop-color="#2eb5f0"/></linearGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJe)" d="M59,31.97c0.01,7.73-3.26,14.58-8.55,19.31l-7.62-6.72c2.1-1.61,3.77-3.71,4.84-6.15	c0.29-0.66-0.2-1.41-0.92-1.41H37c-2.21,0-4-1.79-4-4v-2c0-2.21,1.79-4,4-4h17C56.75,27,59,29.22,59,31.97z"/></svg>')

		},
		{
			name : "Office 365 Audit",
			category : "Cloud Platform",
			subcategory: "Amazon SNS",

			imgPath:$sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#e64a19" d="M7 12L29 4 41 7 41 41 29 44 7 36 29 39 29 10 15 13 15 33 7 36z"/></svg>')

		}

		];

	$rootScope.$broadcast('changeThemeToNormal');

	self.deviceDetails =  {id:0,deviceName:"",deviceIp:"",deviceMacAddress:"",deviceStatus:"",deviceType:"",username:"",password:"",domain:"",staleInMins:0,collectorId:0,logTypeId:0};

	self.collectorDetails = {id:0,collectorName:"",macAddress:"",hostName:"",collectorIp:"",collectorType:"",collectorKey:"",canEdit:true,companyName:"",collectorInstallationType:''}

	self.alertMessagaes =[];

	self.conditionCategories = [];

	self.loadCollectors = function(){
		deviceService.loadCollectors().then(function(response){
			self.collectorAllDetails = response.data;
			$scope.templateUrl = "viewCollectors.html";
		});
	}


	self.loadAllDevices = function(){
		deviceService.getAllDevices().then(function(response){
			self.deviceAllDetails = response.data;
			$scope.templateUrl = "viewDevices.html";
		});
	}
	self.loadAllDeviceTypes = function(){
		logDevicesFactory.getDevices().then(function(response){
			self.logDeviceTypes = response.data;

		});
	}

	self.currentCollectorId = 0;
	
	self.addSource = function(data){
		if(data.type === "cloud"){
			$scope.showSources= true;
			self.currentCollectorId = data.id;
			self.aws = {name:"",description:"",s3Region:"",bucketName:"",pathExpression:"",accessId:"",accessKey:"",logDevice:"could",logType:""}
			
			$("#sourceModel").modal();
		}
	}

	self.openCreateCollector = function(){
		self.collectorDetails = {id:0,collectorName:"",macAddress:"",hostName:"",collectorIp:"",collectorType:"",collectorKey:"",canEdit:true,companyName:"",collectorInstallationType:''}
		
		$("#deviceCollector").modal();
	}

	$scope.selectCollectorType = function(type){
		self.collectorDetails.collectorType = type
	}
	
	
	$scope.generateKey = function(){
		if(self.collectorDetails.canEdit){
			self.collectorDetails.collectorKey = self.collectorDetails.collectorName.replace(/ /g,"_");
		}
		
	}
	self.companyDetails = [];
	
	self.loadAllCompines = function(){
		settingsFactory.getCurrentOrgs().then(function (response) {
			self.companyDetails = angular.copy(response.data)
		}, function (error) {
					if(error.status== 403){
						self.deleteMessages.push({ type: 'danger', msg: error.data.data });

						$timeout(function () {
							self.deleteMessages = [];
						}, 2000);
					}
		});
	}
	
	
	
	self.loadAllCompines();
	self.init = function(){
		self.loadAllDeviceTypes();
		self.loadAllDevices();
		self.loadCollectors();
		self.loadAllCompines();
	}

	self.editDevice = function(data){

		$scope.isEidtable = true;
		$scope.isHompage = false;

		self.deviceDetails = angular.copy(data);
		self.deviceDetails.collectorId = data.collectorId.toString();
		$scope.templateUrl = "createDevice.html";
	}

	self.editCollector = function(data){
		$scope.isCollectorHompage = false;
		self.collectorDetails = angular.copy(data);
		$("#deviceCollector").modal();
	}


	self.openCreateDevice = function(){

		$scope.isEidtable = false;

		self.deviceDetails =  {id:0,deviceName:"",deviceIp:"",deviceMacAddress:"",deviceStatus:"",deviceType:"",username:"",password:"",domain:"",staleInMins:0};



		//$scope.templateUrl = "createDevice.html";

	}
	
	self.collectorErrorMessages = [];

	self.saveCollector = function(){
		deviceService.saveCollector(self.collectorDetails).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Collector was added Successfull' });
				$scope.isDeviceTested = false;
				
				$("#deviceCollector").modal('hide');
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);

				},2000);
				self.loadCollectors();



			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.collectorErrorMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.collectorErrorMessages.push({ type: 'danger', msg: response.data.data });
				}
				$timeout(function () {
					self.collectorErrorMessages = [];
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

	self.saveDevice = function(){
		deviceService.saveDevices(self.deviceDetails).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Connection Successfull' });
				$scope.isDeviceTested = false;
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);

				},2000);
				self.loadAllDevices();
				$scope.templateUrl = "viewDevices.html";


			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
				}
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
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

	self.testDevice = function(){
		deviceService.testDevices(self.deviceDetails).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Connection Successfull' });
				$scope.isDeviceTested = false;
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);

				},2000);

			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
				}
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
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

	self.saveTags = function(){

		tagService.saveTags(self.tag).then(function (response) {
			if(response.data.status){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Subcategor  was Created Successfully' });
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					$("#createNewTag").modal('hide');
				},2000);

				self.loadAllTags();
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
	self.editTag = function(id){
		for(var i = 0; i < self.tagDetails.length; i++){
			if(self.tagDetails[i].id === id) {
				self.tag = angular.copy(self.tagDetails[i]);
				break;
			}
		}

		$("#createNewTag").modal();

	}





	self.openCreateCategoryPage = function(){
		self.condition =  {categoryId:"",categoryName:"",operationType:"insert"};
		self.buttonName="Save";


		$("#createCategory").modal();


	}







	self.conditionMessagesModal = [];
	self.submitData = function(){


		tagService.saveTags(self.tag).then(function (response) {
			if(response.status===201){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Tag was Created Successfully' });
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					$("#createNewTag").modal('hide');
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

	var alertId_edit;
	self.editConditionCategory = function(categoryId){


		for(var i = 0; i < self.conditionCategories.length; i++){
			if(self.conditionCategories[i].categoryId === categoryId) {
				self.condition = angular.copy(self.conditionCategories[i]);
				self.condition.operationType = 'update'
					break;
			}
		}



		$("#createCategory").modal();

		self.buttonName="Save";
	}


	self.deleteCollector = function(id,name){
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
						deviceService.deleteCollector(id).then(function (response) {
							if(response.status===200){
								self.alertMessagaes.push({ type: 'success', msg: 'Collector was deleted successfully' });
								//toastr.success("Condition was deleted successfully")

								self.loadCollectors();


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





	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0).notSortable()
		];
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [1, 'asc']).withDisplayLength(25)
	.withOption('scrollY', $( window ).height()-350)
	.withOption('scrollCollapse', true);

	self.selectedTags  = [];

	self.deleteMultipleTags = function(){

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete selected tags',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						tagService.deleteMultipleTags(self.selectedTags).then(function(response){
							if(response.data.status){
								self.selectedTags = [];
								self.loadAllTags();

								self.alertMessagaes.push({ type: 'success', msg: "Successfully deleted the selected tags "});
								$timeout(function () {
									$("#tagFields").prop('checked',false);
									self.alertMessagaes = [];
								}, 2000);
							}else{
								self.alertMessagaes.push({ type: 'danger', msg: reponse.data.msg });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}

						},function(error){
							self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
							$timeout(function () {
								self.alertMessagaes = [];
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

	self.selectById = function(status,id){
		if(status == true){
			self.selectedTags.push(id);
			$("#tagFields").prop('checked',false);
		}else if(status == false){
			self.selectedTags.splice(self.selectedTags.indexOf(id),1);
		}

		if(self.selectedTags.length == self.tagDetails.length){
			$("#tagFields").prop('checked',true);
			self.selectAll = true;
		}else{
			$("#tagFields").prop('checked',false);
			self.selectAll = false;
		}
	}

	self.selectAllFunction = function(status){
		self.selectedTags = [];
		if(status == true){
			self.selectedTags = self.tagDetails.map(tag => tag.id);
			self.tagDetails.forEach(tag => tag.checked = true);
		}else if(status == false){
			self.tagDetails.forEach(tag => tag.checked = false);
		}
		console.log(self.selectedTags);
	}

}]);
