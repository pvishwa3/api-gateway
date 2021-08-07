
var logFileds = [];

var eventScope ;

app.controller("eventController", ['$scope', 'eventService','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','tagService','conditionFactory','$templateRequest','$sce', '$compile','irpFactory','lookupFactory','logDevicesFactory', '$window','miterFactory','settingsFactory','$sessionStorage','referenceSetFactory', function ($scope, eventService , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,tagService,conditionFactory, $templateRequest, $sce, $compile,irpFactory,lookupFactory,logDevicesFactory, $window,miterFactory,settingsFactory,$sessionStorage,referenceSetFactory) {

	var self = this;

	self.event = {id:0,eventName:'',eventDescription:'',logDevice:'',logType:'',logFields:'',eventTags:'',severity:'',eventType:'Simple Event',eventMetaData:'',categoryId:0,fitlerQuery:'',eventAlert:'',eventAlertNotification:'',approvalStatus:'',customFields:'',eventLookupName:'',technique:'',tatic:'',riskScore:0,groupName:''};

	self.alertMessagaes = [];

	self.treeData = [];
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';

	self.rulesGroupList = [];

	$scope.eventContext = $scope;

	self.conditionMessage = [];
	self.standardData = [];
	$scope.logFields = [];

	self.tatics = [];
	self.techniques = [];

	$scope.eventFields = [];

	$scope.addLogField = function(){

		var logFieldData = {logField:'',isMandatory:true};

		$scope.eventFields.push(logFieldData)
	}

	$scope.deleteLogField = function(index){
		$scope.eventFields.splice(index, 1);
	}

	self.currentEnrichmentFields = [];
	self.allTactics = [];
	self.allTechniques = [];

	$scope.finalConditions = [];
	$scope.ruleGroups = [];
	
	$scope.referenceSetDetails = [];

	$scope.lookupContext = {id:0};

	$scope.currentLookupFields = [];

	$scope.getValuesFromRefData = function(){

		for(var i=0;i<$scope.referenceSetDetails.length;i++){
			if($scope.referenceSetDetails[i].id === parseInt($scope.lookupContext.id)){
				var tempData = $scope.referenceSetDetails[i].valueFields.split(",");
				var tempData1 = $scope.referenceSetDetails[i].keyFields.split(",");
				$scope.currentLookupFields = [];
				$scope.currentLookupFields = tempData;
				for(var j=0;j<tempData1.length;j++){
					$scope.currentLookupFields.push(tempData1[j]);
				}
				
			}
		}
	}

	$scope.dataLookupDetails = [{logField:'',lookupField:''}];
	
	self.loadRefrenceSetDetails = function(){
		referenceSetFactory.loadReferenceSets().then(function(response){

			if(response.data.length>0){
				$scope.referenceSetDetails = angular.copy(response.data);
			}

			

			//self.activeDirectoryDetails = angular.copy (response.data);
			//self.tagDetails.forEach(e => e.checked = false);
		});
	}

	self.loadRefrenceSetDetails();

	self.loadRuleGroups = function(){
		eventService.getRuleGroups().then(function(response){
			$scope.ruleGroups = response.data;

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Load Rules' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}
	self.loadRuleGroups();

	self.loadEventMappings = function(){
		eventService.getAllEventMappings().then(function(response){
			$scope.finalConditions = response.data;

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Load Events' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}

	self.loadEventMappings();


$scope.allMiterTactics = [];
	self.loadTactics = function(){
		miterFactory.getAllTactics().then(function(response){
			$scope.allMiterTactics = [];
			for(var i =0 ; i<=response.data.length;i++ ){
				$scope.allMiterTactics.push(response.data[i]);
				self.allTactics.push( response.data[i].tacticsId +" - "+ response.data[i].tacticsName);
			}
			

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Load Tactis please refresh' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}

	self.vendorDetails = [];
	self.deviceModels = [];

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

	$scope.addLookupCondition = function(data){
		$scope.dataLookupDetails.push({lookupField:'',logField:''})
	}

	$scope.deleteLookupCondition = function(data,index){
		if($scope.dataLookupDetails.length==1){
			alert("Atleat one lookup field shoudl be available");
			return false;
		}
		$scope.dataLookupDetails.splice(index,1)
	}

	self.loadVendorModelDetails = function(id){
		for(var i=0;i<self.vendorDetails.length;i++){
			if(self.vendorDetails[i].vendorId === id){
				logDevicesFactory.getLogModelsBasedOnDevice(self.vendorDetails[i].id).then(function(response){		
					self.deviceModels = response.data;
				},function(error){
				});
				break;
			}
		}


	}

	self.loadTechniques = function(){

		miterFactory.getAllTechniques().then(function(response){



			for(var i =0 ; i<=response.data.length;i++ ){
				self.allTechniques.push( response.data[i].techniqueId +" - "+ response.data[i].techniqueName);
			}

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Load Techniques , please refresh' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}

	self.loadTactics();

	self.loadTechniques();


	self.selectEnrichmentFields = function(data){
		self.currentEnrichmentFields = data.logField.split(",");
	}

	self.vendorDetails = [];

	self.loadVendors = function(){

	}



	$scope.referenceSetDetails = [];

	self.loadReferenceSets = function(){
		eventService.loadReferenceSets().then(function(response){
			$scope.referenceSetDetails = response.data;

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Load reference sets, Please refresh' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}

	self.loadReferenceSets();

	
	self.treeData = [];
	self.standardData = [];

	self.tags = [];
	self.logfieldModel = [];
	$scope.fields = [];
	$scope.finalConditions = [];
	var ruleData = '{"group": {"operator": "AND","rules": []}}';
	$scope.ruleFilter = JSON.parse(ruleData);

	self.alert = {id:0,emailId:'',subjectName:'',message:'',alertType:'',scheduleAt:'',ruleName:'',createIncident:'',defaultAssignee:'',irpTemplates:'',schedule:'',triggerCondition:'',triggerConditionOperator:'',triggerConditionValue:'',windowDuration:'',priority:'',category:'',description:'',irpTemplates:''};

	self.allCategories = [];

	$scope.oneAtATime = false;

	$scope.enrichmentDetails = [];

	$scope.addEnrichment = function(){

		$scope.enrichmentDetails.push({lookupName:'',lookupInputDetails:[],lookupOutputDetails:[]})

	}



	self.onSelectedOutputLookup = function(data){

		for(var i=0;i<$scope.logFields.length;i++){
			if(self.logfieldModel[i] === data.field){
				return false;
			}
		}

		self.logfieldModel.push(data.field);

	}

	self.loadDevices = function(){

		eventService.getLogDevices().then(function(response){
			$scope.devices = response.data;

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Load Log Devices Please refresh' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}

	self.loadTags = function(){
		tagService.getTags().then(function(response){
			self.tagDetails = response.data;
		});
	}

	$scope.canPromoteEvent = false;

	self.loadPermissions = function(){

		loader("body");

		conditionFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("promote events")!=-1){
				$scope.canPromoteEvent = true;
			}


			unloader("body");

			fieldExtractorFactory.getLogDevices().then(function(response) {
				$scope.logDevices = response.data;
				//$scope.fieldData.logType = $scope.logTypes[0];
				//self.getDataBasedOnLogType();

			}, function(err) {
				console.log(err);
			});


		},function(error){
			unloader("body");
		});
	}

	$scope.promoteEvent = function(){
		if(self.doValidation()){
			eventService.promoteEvent(self.event.id).then(function(response){
				if(response.status===200){

					self.alertMessagaes.push({ type: 'success', msg: "Event was succesfully promoted" });
					self.getAllEvents();

					$scope.openTreeStructure($scope.tabName);

					$timeout(function () {
						self.alertMessagaes.splice(0, 1);

					},3000);

					self.init();
				}else{

				}
			}, function (error) {
				unloader("body");
				if(error.status== 403){
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
				}else if(error.status== 500){
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.alertMessagaes.splice(0, 1);
					}, 2000);
				}else if(error.status== 400){
					if(error.data.errors){
						for(var i=0;i<error.data.errors.length;i++){

							self.alertMessagaes.push({ type: 'danger', msg: error.data.errors[i].defaultMessage });
						}
					}else{
						self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					}
					$timeout(function () {
						self.alertMessagaes = []
					}, 2000);
				}
			});
		}
	}

	self.loadPermissions();
	$scope.ruleFormSubmitted = false;
	$scope.createEvent = function(){
		$scope.ruleFormSubmitted = true;
		var tempArray = [];
		var tempArray2 = [];

		var originalEvents = [];

		for(var i=0;i<$scope.enrichmentData.length;i++){
			if($scope.enrichmentData[i].enrhimentname === '' || $scope.enrichmentData[i].lookupfield === '' || $scope.enrichmentData[i].logField === '' || $scope.enrichmentData[i].enrchimentFields.length == 0) {
				alert("Please Enter all mandatory fields in Data Enrichment Section");
				return false;
			}
		}
		if($scope.enrichmentData.length>0){
			self.event['lookupDetails'] = JSON.stringify($scope.enrichmentData);
		}


		for(var i=0;i<$scope.eventFields.length;i++){
			originalEvents.push($scope.eventFields[i].logField.fieldname);
		}

		if(originalEvents.length!= new Set(originalEvents).size){
			alert("Duplicate event log field found !!")
			return false;
		}

		for(var i=0; i<self.logfieldModel.length;i++){
			tempArray2.push(self.logfieldModel[i].fieldname)
		}

		self.event.logFields = JSON.stringify($scope.eventFields);

		self.event.eventTags = self.tags.join(',');
		self.event.fitlerQuery = $scope.output;
		self.event.eventLookupName = self.currentLookupFields.join(',');

		if($scope.inputFields.length!=0 && $scope.outFields.length!=0){
			var object = new Object();
			object['inputFields'] = $scope.inputFields;
			object['outFields'] = $scope.outFields;
		}



		if(self.tatics.length!=0 && self.techniques.length==0){

			self.alertMessagaes.push({
				type: 'danger',
				msg: "Techniques are Mandatory if Tatics was selected"
			});
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);

			return false;
		}



		if(self.tatics.length!=0){
			self.event.tatic = self.tatics.join(",");
		}

		if(self.tatics.length!=0 && self.techniques.length!=0){
			self.event.technique = self.techniques.join(",");
		}




		if(self.event.eventType === "Complex Event"){
			self.event.eventMetaData   = JSON.stringify($scope.ruleFilter);
		}else{
			self.event.eventMetaData   = JSON.stringify($scope.filter);
		}
		self.event.eventAlert =  JSON.stringify(self.alert);
		self.event.eventAlertNotification = JSON.stringify(self.alert);
		self.event.tatic = self.techniques.join(',');
		var tempArray = [];

		tempArray.push(self.email);
		tempArray.push(self.notable);
		tempArray.push(self.ticket);
		tempArray.push(self.updateLookTable);	

		self.event.eventAlertNotification = JSON.stringify(tempArray);

		self.event.groupName = self.rulesGroupList.join(",");
//		self.event.notification = JSON.stringify(tempArray);
		self.event.customFields = JSON.stringify($scope.customFields);

		if(self.doEventValidation()){
			loader("body");

			eventService.createEvent(self.event).then(function(response){
				if(response.status===201){

					self.alertMessagaes.push({ type: 'success', msg: "Event was succesfully created" });


					self.loadSimpleEvents();
					$timeout(function(){						
						self.getAllEvents();
						unloader("body");
					},300);

					$timeout(function () {
						self.alertMessagaes = [];
					},3000);
					$timeout(function(){						
						$scope.openTreeStructure($scope.tabName);
					},500)
					self.init();
				}else{
					$scope.openTreeStructure($scope.tabName);
				}
			}, function (error) {
				unloader("body");
				if(error.status== 403){
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
				}else if(error.status== 500){
					self.alertMessagaes.push({ type: 'danger', msg: 'Unable to create Event. '+error.data.data });
					$timeout(function () {
						self.alertMessagaes.splice(0, 1);
					}, 2000);
				}else if(error.status== 400){
					if(error.data.errors){
						for(var i=0;i<error.data.errors.length;i++){

							self.alertMessagaes.push({ type: 'danger', msg: error.data.errors[i].defaultMessage });
						}
					}else{
						self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					}
					$timeout(function () {
						self.alertMessagaes = []
					}, 2000);
				}
			});
		}

	}


	self.tag = {id:0,tagName:""}

	self.tagConfig = {

			optgroupField: 'class',
			labelField: 'tagName',
			searchField: ['tagName'],
			valueField: 'tagName',
			create: function(value,silent){
				self.tag.tagName = value;
				self.saveTags(self.tag);
				self.tagDetails.push({id:0,tagName:value})

				return true;	
			},
	};

	self.ruleGroup = {
			maxItems: null,
			optgroupField: 'class',
			labelField: 'groupName',
			searchField: ['groupName'],
			valueField: 'groupName',
			create: function(value,silent){
				self.createGroup(value);

				return true;	
			},	
	}

	self.createGroup = function(value){
		var object = {groupName:value};
		eventService.createGroup(object).then(function (response) {
			if(response.data.status===true){
				self.alertMessagaes.push({ type: 'success', msg: 'Group  was Created Successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);

				},3000);

				self.loadRuleGroups();
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


		});
	}

	self.categoryConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'categoryName',
			searchField: ['categoryName'],
			valueField: 'id',
			create: function(value,silent){
				self.saveConditionEventCategory(value);
//				self.tag.tagName = value;
//				self.saveTags(self.tag);
//				self.tagDetails.push({id:0,tagName:value})
				return true;	
			},
	}

	self.saveTags = function(){

		tagService.saveTags(self.tag).then(function (response) {
			if(response.status===201){
				self.alertMessagaes.push({ type: 'success', msg: 'Tags  was Created Successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);

				},3000);

				self.loadAllTags();
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


		});
	}



	self.loadLogFields = function(){

		eventService.getAllFields().then(function(response){
			$scope.logFields = [];
			for(var i=0;i<response.data.length;i++){
				$scope.logFields.push({"fieldname":response.data[i]});
			}
			

			$scope.logFields.push({"fieldname":'event_category'});
			$scope.logFields.push({"fieldname":'event_name'});

			logFileds = $scope.logFields;
//			$rootScope.$broadcast('updateLogFields', logFileds );
		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Load Log Fields , Please refresh' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});


	}

	self.loadLogTypes = function(){
		self.loadLogFields();
		eventService.getLogFields(self.event.logDevice).then(function(response){
			$scope.logTypes = response.data;
			$scope.logTypes.push({"fieldname":"event_category"})
			$scope.logTypes.push({"fieldname":"event_name"})
			$scope.logTypes.push({"fieldname":"rules"})

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Load Log Types' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});


	}

	self.loadTags();
//	self.loadLogTypes();


	self.loadSimpleEvents = function(){

		eventService.getAllSimpleEvents().then(function(response){
			//$scope.finalConditions = response.data;

			console.log($scope.finalConditions)
		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to Events please refresh' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});


	}

	self.lookupDetails = [];

	self.loadLookupTables = function(){

		lookupFactory.loadLookupGroups().then(function(response) {



			for(var i=0;i<response.data.length;i++){
				self.lookupDetails.push(response.data[i].typeName);

			}

		}, function(err) {
			console.log(err);
		});

	}

	self.saveConfigureGroup = function(){

	}

	self.loadLookupTables();


	self.currentLookupFields = [];
	$scope.currentLookUp = {};

	$scope.lookupTableName = "";



	self.onSelectedLookup = function(enrichmentData,data){

		enrichmentData['currentLookupFields'] = data.fields.split(",");
		enrichmentData['currentLookUp'] = data;
	}
	$scope.deleteInputLookupFields = function(data,index){

		data.splice(index,1);
	}


	$scope.inputFields = [];
	$scope.outFields = [];



	$scope.addInputFields = function(){
		$scope.inputFields.push({field:'',lookupField:''});

	}

	$scope.addOuptFields = function(enrichmentData){
		$scope.outFields.push({field:'',lookupField:''});
	}

	$scope.deleteOutputLookupFields = function(data,index){

		data.splice(index,1);
	}




	self.loadSimpleEvents();

	$scope.actionName = [];

	self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};

	self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};

	self.ticket = {name: 'ticket',expanded : false,enabled:false,title:'',description:'',priority:'',assinge:''};

	self.updateLookTable = {name:'lookupTable',expanded:false,lookupContext:0};

	$scope.changeAction = function(actionType){

		if($scope.actionName.indexOf(actionType)!=-1){
			for(var i=0;i<$scope.actionName.length;i++){
				if($scope.actionName[i]===actionType){
					$scope.actionName.splice(i,1);
					if(actionType === 'sendEmail'){
						self.email.expanded = false;
					}
					if(actionType === 'notable'){
						self.notable.expanded = false;
					}

					if(actionType === 'ticket'){
						self.ticket.expanded = false;
					}
					return false;	
				}
			}
		}

		if(actionType === 'sendEmail'){
			self.email = {name: 'email',expanded : true,enabled:true,to:'',subject:'',message:''};		
			$scope.actionName.push(actionType)
		}
		if(actionType === 'notable'){
			self.notable = {name: 'notable',expanded : true,enabled:true,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};
			$scope.actionName.push(actionType)
		}

		if(actionType === 'ticket'){
			self.ticket = {name: 'ticket',expanded : true,enabled:true,title:'',description:'',priority:'',assinge:''};
			$scope.actionName.push(actionType)
		}
		if(actionType === 'lookupTable'){
			self.updateLookTable = {name:'lookupTable',expanded:false,lookupContext:0};
			$scope.actionName.push(actionType)
		}

	}

	$scope.addAction = function(actionType){



		if(actionType === 'sendEmail'){
//			self.email.enabled = true;
//			self.email = {name: 'email',expanded : true,enabled:true,to:'',subject:'',message:''};		
			$scope.actionName.push(actionType)
		}
		if(actionType === 'notable'){
//			self.notable = {name: 'notable',expanded : true,enabled:true,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};
			$scope.actionName.push(actionType)
		}
		if(actionType === 'ticket'){
//			self.ticket = {name: 'ticket',expanded : true,enabled:true,title:'',description:'',priority:'',assinge:''};
			$scope.actionName.push(actionType)
		}
		if(actionType === 'lookupTable'){
			$scope.actionName.push(actionType)
		}


	}

	$scope.deleteAction = function(actionType){
		if(actionType === 'sendEmail'){
			self.email.enabled = false;
			self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};		
			$scope.actionName.splice($scope.actionName.indexOf(actionType),1);
		}
		if(actionType === 'notable'){
			self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};
			self.notable.enabled = false;
			$scope.actionName.splice($scope.actionName.indexOf(actionType),1);
		}

		if(actionType === 'ticket'){
			self.ticket = {name: 'ticket',expanded : false,enabled:false,title:'',description:'',priority:'',assinge:''};
			self.ticket.enabled = false;
			$scope.actionName.splice($scope.actionName.indexOf(actionType),1);
		}
	}
	$scope.$watch('ruleFilter', function (newValue) {
		$scope.json = JSON.stringify(newValue, null, 2);

	}, true);

	$scope.tabName = "events";

	$scope.eventTypes = "Custom";

	$scope.openEventTypes = function(eventTypes){
		$scope.eventTypes = eventTypes;

		$scope.standardEvents = [];
		$scope.customEvents = [];
		$scope.templateUrl = "viewEventsInfo.html";
		if(eventTypes=== 'Custom'){
			if($scope.tabName === "events"){
				$scope.categories = [];
				for(var i=0;i<self.allCustomEvents.length;i++){
					if(self.allCustomEvents[i].type==="Events" || self.allCustomEvents[i].type==="Simple Event" ){
						$scope.customEvents.push(self.allCustomEvents[i]);
					}
				}
				self.loadColumnDefs("events");
				self.loadEvents($scope.customEvents);
				angular.copy($scope.customEvents,self.treeData);
				$timeout(function(){
					self.viewEventDetails(self.eventGrid.api.getDisplayedRowAtIndex(0).data.id);
//					self.eventGrid.api.forEachNode(node=> node.rowIndex ? 0 : node.setSelected(true))
					self.disableEvents();
					unloader("body");
				},500);

			}

			if($scope.tabName === "rules"){
				$scope.categories = [];

				for(var i=0;i<self.allCustomEvents.length;i++){
					if(self.allCustomEvents[i].type==="Rules" || self.allCustomEvents[i].type==="Complex Event" ){
						$scope.customEvents.push(self.allCustomEvents[i]);
					}
				}
				angular.copy($scope.customEvents,self.treeData);
				self.loadColumnDefs("rules");
				self.loadEvents($scope.customEvents);
				$timeout(function(){
					if(self.eventGrid.api.getDisplayedRowAtIndex(0)){
						self.viewEventDetails(self.eventGrid.api.getDisplayedRowAtIndex(0).data.id);
//						self.eventGrid.api.forEachNode(node=> node.rowIndex ? 0 : node.setSelected(true))
						self.disableEvents();

					}
					unloader("body");

				},500);

			}

			if($scope.tabName === "alerts"){
				$scope.categories = [];
			}
		}

		if(eventTypes=== 'Standard'){
			if($scope.tabName === "events"){
				$scope.categories = [];
				for(var i=0;i<self.allStandardEvents.length;i++){
					if(self.allStandardEvents[i].type==="Events" || self.allStandardEvents[i].type==="Simple Event" ){
						$scope.standardEvents.push(self.allStandardEvents[i]);
					}
				}
				self.loadColumnDefs("events");
				angular.copy($scope.standardEvents,self.treeData);
				self.loadEvents($scope.standardEvents);
				$timeout(function(){
					self.viewEventDetails(self.eventGrid.api.getDisplayedRowAtIndex(0).data.id);
					self.eventGrid.api.forEachNode(node=> node.rowIndex ? 0 : node.setSelected(true))
					self.disableEvents();
					unloader("body");
				},500);
			}

			if($scope.tabName === "rules"){
				$scope.categories = [];

				for(var i=0;i<self.allStandardEvents.length;i++){
					if(self.allStandardEvents[i].type==="Rules" || self.allStandardEvents[i].type==="Complex Event" ){
						$scope.standardEvents.push(self.allStandardEvents[i]);
					}
				}
				angular.copy($scope.standardEvents,self.treeData);
				self.loadColumnDefs("rules");
				self.loadEvents($scope.standardEvents);
				$timeout(function(){
					self.viewEventDetails(self.eventGrid.api.getDisplayedRowAtIndex(0).data.id);
					self.eventGrid.api.forEachNode(node=> node.rowIndex ? 0 : node.setSelected(true))
					self.disableEvents();
					unloader("body");
				},500);
			}
			if($scope.tabName === "alerts"){
				$scope.categories = [];
			}
		}

	}


	self.back = function(){
		loader("body");
		$("#filterShow").hide();
		self.event = {id:0,eventName:'',eventDescription:'',logDevice:'',logType:'',logFields:'',eventTags:'',severity:'',eventType:'Simple Event',eventMetaData:'',categoryId:0,fitlerQuery:'',eventAlert:'',eventAlertNotification:'',approvalStatus:'',customFields:'',eventLookupName:''};
		self.getAllEvents();
	}

	$scope.openTreeStructure = function(tabName){
		$scope.tabName = tabName;
		$scope.openEventTypes($scope.eventTypes);

	}

	$scope.users = [];

	self.loadUsers = function(){
		settingsFactory.getUsersWithInCompany().then(function (response) {

			var users = response.data;

			for(var i=0;i<users.length;i++){
				if($scope.users.indexOf(users[i].userName)==-1){
					$scope.users.push(users[i].userName);
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

	self.loadUsers();

	self.getAllEvents = function(){

		eventService.getAllEvents().then(function(response){

			self.allCustomEvents = response.data.custom;

			self.allStandardEvents = response.data.standard;

			$scope.customEvents = [];

			$scope.standardEvents= [];

			$scope.finalConditions = [];

			for(var i=0;i<self.allCustomEvents.length;i++){
				if(self.allCustomEvents[i].type==="Events" || self.allCustomEvents[i].type==="Simple Event" ){
					$scope.customEvents.push(self.allCustomEvents[i]);
				}
				if(self.allCustomEvents[i].type==="Events"){
					//$scope.finalConditions.push(self.allCustomEvents[i]);
				}
			}

			for(var i=0;i<self.allStandardEvents.length;i++){
				if(self.allStandardEvents[i].type==="Events" || self.allStandardEvents[i].type==="Simple Event" ){
					$scope.standardEvents.push(self.allStandardEvents[i]);
				}
				if(self.allStandardEvents[i].type==="Events" ){
					//$scope.finalConditions.push(self.allCustomEvents[i]);
				}
			}



			angular.copy($scope.customEvents,self.treeData);
			angular.copy($scope.standardEvents,self.standardData);

			$scope.openTreeStructure($scope.tabName);

		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to create Event. '+error.data.data });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});

	}

	self.getAllEvents();



	self.loadDevices();


	var data = '{"group": {"operator": "AND","rules": []}}';
	$scope.filter = JSON.parse(data);

	$scope.enrichmentData = []; 

	$scope.addEnrichmentData = function(){

		var logFieldData = {logField:'',enrhimentname:'',lookupfield:'',enrchimentFields:[]};

		$scope.enrichmentData.push(logFieldData)

	}

	$scope.deleteEnrichment = function(index){
		$scope.enrichmentData.splice(index,1);
	}

	$scope.displayNewItem = function(){
		$scope.formSubmitted = false;
		$scope.eventFields = [];

		let data = '{"group": {"operator": "AND","rules": []}}';
		$scope.filter = JSON.parse(data);
		$scope.ruleFilter = JSON.parse(data);
		self.tags = [];
		self.event = {id:0,eventName:'',eventDescription:'',logDevice:'',logType:'',logFields:'',eventTags:'',severity:'',eventType:'Simple Event',eventMetaData:'',categoryId:0,fitlerQuery:'',eventAlert:'',eventAlertNotification:'',approvalStatus:'',customFields:'',riskScore:0};

		$scope.customFields = [];
		self.rulesGroupList = [];
		self.tatics = [];
		self.techniques = [];
		self.rulesGroupList = [];
		self.alert = {id:0,emailId:'',subjectName:'',message:'',alertType:'',scheduleAt:'',ruleName:'',createIncident:'',defaultAssignee:'',irpTemplates:'',schedule:'',triggerCondition:'',triggerConditionOperator:'',triggerConditionValue:'',windowDuration:'',priority:'',category:'',description:'',irpTemplates:''};


		self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};

		self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};

		self.ticket = {name: 'ticket',expanded : false,enabled:false,title:'',description:'',priority:'',assinge:''};

		$scope.actionName = [];

		self.logfieldModel = [];

		if($scope.tabName==="rules"){ 
			self.event.eventType = "Complex Event"
				$scope.templateUrl = "ruleInformation.html";
		}else{
			self.event.eventType = "Simple Event";
			$scope.templateUrl = "eventInformation.html";
		}
		$scope.formSubmitted = false;
//		$scope.ruleForm.$setPristine();
//		$scope.ruleForm.$setUntouched();
		$(".collapse").css("pointer-events","all");
		$scope.ruleFormSubmitted = false;
	}





	self.displayForEdit = function(id){
		if(id == undefined){
			id = self.event.id;
		}
		loader("body");

		self.rulesGroupList= [];

		self.event = {id:0,eventName:'',eventDescription:'',logDevice:'',logType:'',logFields:'',eventTags:'',severity:'',eventType:'Simple Event',eventMetaData:'',categoryId:0,fitlerQuery:'',eventAlert:'',eventAlertNotification:'',approvalStatus:'',eventLookupName:'',riskScore:0};
		eventService.loadSingleEvent(id).then(function(response){
			self.tatics = [];
			self.techniques = [];
			$scope.inputFields = [];
			$scope.outFields = [];
			self.event = angular.copy(response.data);
//			$timeout(function(){				
			self.loadLogTypes();
//			},250);

			if(response.data.lookupDetails){
				$scope.enrichmentData = angular.copy(JSON.parse(response.data.lookupDetails));

			}




			if(self.event.eventType === 'Simple Event' ){
				$scope.tabName = "events"
			}else if(self.event.eventType === 'Complex Event'){
				$scope.tabName = "rules"
			}
			if(self.event.eventType === 'Simple Event' && $scope.tabName==="events"){
				$scope.templateUrl = "eventInformation.html";
				$timeout(function(){
					self.logfieldModel = []

					var logFields = self.event.logFields.split(",");

					for(var i=0;i<logFields.length;i++){
						self.logfieldModel.push({fieldname:logFields[i]});
					}

					if(response.data.lookupDetails){
						var data1 = JSON.parse(response.data.lookupDetails);

					}
					$scope.filter = JSON.parse(self.event.eventMetaData);
					self.tags  = [];
					if(self.event.eventTags != null){
						self.tags = self.event.eventTags.split(",");
					}
//					self.tags = self.event.eventTags.split(",");
					self.event.categoryId =  self.event.categoryId.toString();
					unloader("body");
				},500);

			}else if(self.event.eventType === 'Complex Event' && $scope.tabName==="rules"){

				unloader("body");
				$scope.templateUrl = "ruleInformation.html";
				$timeout(function(){

					if(self.event.tatic){
						self.tatics = self.event.tatic.split(",");
						$scope.techniques = [];
						for(let z=0;z<self.tatics.length;z++){
							$scope.onSelectedTatics(self.tatics[z]);
						}
						$timeout(function(){
							if(self.event.techniques){
								self.techniques = self.event.techniques.split(",");
							}
						},1000);
					}
					
		

					self.rulesGroupList = response.data.groupName.split(",");
					$scope.customFields = [];
					if(self.event.customFields){
						$scope.customFields = JSON.parse(self.event.customFields);
					}

					$timeout(function(){
						$scope.ruleFilter = JSON.parse(self.event.eventMetaData);
						self.alert = JSON.parse(response.data.alert);
						let temp= JSON.parse(response.data.notification);
						if(temp.alertName != undefined && temp.alertName.trim() != ""){							
							self.alertConfig = angular.copy(JSON.parse(temp.eventAlertNotification));
						}else{
							self.alertConfig = angular.copy(temp);
						}
//						self.alertConfig = JSON.parse(response.data.notification);
						if(self.event.eventTag){
							self.tags = self.event.eventTags.split(",");
						}

						$scope.actionName = [];
						self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};
						self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};
						self.ticket = {name: 'ticket',expanded : false,enabled:false,title:'',description:'',priority:'',assinge:''};

						for(var i=0;i<self.alertConfig.length;i++){
							if(self.alertConfig[i].name == 'email' && self.alertConfig[i].enabled== true && self.alertConfig[i].expanded== true){
								self.email= angular.copy(self.alertConfig[i]);
								$scope.actionName.push("sendEmail")
							}else if(self.alertConfig[i].name == 'notable' && self.alertConfig[i].enabled== true && self.alertConfig[i].expanded== true){
								self.notable= angular.copy(self.alertConfig[i]);
								$scope.actionName.push("notable")
							}else if(self.alertConfig[i].name == 'ticket' && self.alertConfig[i].enabled== true && self.alertConfig[i].expanded== true){
								self.ticket= angular.copy(self.alertConfig[i]);
								$scope.actionName.push("ticket")
							}
						}
					},400);
				},500);
			}else{
				unloader("body");
				$scope.templateUrl = "alertInfo.html";
				self.alert = JSON.parse(response.data.alert);
				self.alertConfig = JSON.parse(response.data.notification);
				self.tags = self.event.eventTags.split(",");
				for(var i=0;i<self.alertConfig.length;i++){
					if(self.alertConfig[i].name == 'email' && self.alertConfig[i].enabled== true){
						$scope.addAction("sendEmail");
						self.email= angular.copy(self.alertConfig[i]);
					}else if(self.alertConfig[i].name == 'notable' && self.alertConfig[i].enabled== true){
						$scope.addAction("notable");
						self.notable= angular.copy(self.alertConfig[i]);
					}else if(self.alertConfig[i].name == 'ticket' && self.alertConfig[i].enabled== true){

						self.ticket= angular.copy(self.alertConfig[i]);

					}
				}

			}




//			unloader("body");


		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
//				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to create Category. Category Name should be unique.' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});


	}


	$scope.deleteCategory = function(){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete selected Category\'s',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						var ids = [];
						for(var i=0;i<self.selectedCategory.length;i++){
							ids.push(self.selectedCategory[i].id);
						}   
						loader("body");
						eventService.deleteCategory(ids).then(function (response) {
							if(response.status===200){
								loader("body");
								self.getAllCategories();
								self.alertModalMessagaes.push({ type: 'success', msg: "Category was deleted successfully" });
								$timeout(function () {
									self.alertModalMessagaes.splice(0, 1);
								}, 2000);
								$timeout(function(){					
									self.loadCategoryGrid();
									unloader("body");
								},750);

							}

							unloader("body");

						}, function (error) {


							$timeout(function(){									
								self.getAllEvents();
							},150);

							unloader("body");
							if(error.status== 403){
								self.alertModalMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertModalMessagaes = [];
								}, 2000);
							}

							$timeout(function () {
								self.alertModalMessagaes.splice(0, 1);
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

	$scope.customFields = [];

	self.nodeData = {id:0,parentId:0,categoryName:''};

	$scope.addCustomFields = function(){
		$scope.customFields.push({customField:"",customFieldValue:""})
	}

	$scope.deleteCustomFields = function(index){
		$scope.customFields.splice(index,1);
	}



	this.applyModelChanges = function() {
		return !self.ignoreChanges;
	};

	function htmlEntities(str) {
		return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	$scope.filter = JSON.parse(data);

	$scope.$watch('filter', function (newValue) {
		$scope.json = JSON.stringify(newValue, null, 2);
		if(newValue){
			$scope.output = computed(newValue.group);
		}


	}, true);

	function computed(group) {
		if (!group) return "";

		var operator = "";
		if(group.operator === "AND"){
			operator = "&&";
		}else{
			operator = "||";
		}

		for (var str = "(", i = 0; i < group.rules.length; i++) {
			i > 0 && (str += " " + operator + " ");
			if(group.rules[i].group){
				str += computed(group.rules[i].group);
			}else{
				if(group.rules[i].field){
					if( group.rules[i].field.indexOf(".") > -1){
						if(group.rules[i].condition === "%%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + " " + " like '%" + group.rules[i].data+"%'";

						}else if(group.rules[i].condition === "_%") {
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + " " + " like '" + group.rules[i].data+"%'";
						}else if(group.rules[i].condition === "%_"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + " " + " like '%" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + "  = "  + " '" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + "  != "  + " '" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"column_in("+group.rules[i].field.split(".")[1] + " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "not_in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"notin("+group.rules[i].field.split(".")[1] + " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "ip_range" && group.rules[i].fromIP && group.rules[i].toIP ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"iprange("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromIP+"','"+group.rules[i].toIP+"')";
						}
						else if(group.rules[i].condition === "time_range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"time_range("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"range("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "threat_matcher" && group.rules[i].numberOfSources){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"threat_matcher("+group.rules[i].field.split(".")[1] + " , '"  + group.rules[i].numberOfSources+"')";
						}
						//range


					}else{

						if(group.rules[i].condition === "%%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										//(event_id.equalsIgnoreCase('4625'))

										"("+group.rules[i].field +".contains('"+ group.rules[i].data+"'))";
						}
						else if(group.rules[i].condition === "<>"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"!("+group.rules[i].field +".contains('"+ group.rules[i].data+"'))";
						}
						else if(group.rules[i].condition === "_%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"("+group.rules[i].field +".startsWith('"+ group.rules[i].data+"'))";
						}
						else if(group.rules[i].condition === "%_"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"("+group.rules[i].field +".endsWith('"+ group.rules[i].data+"'))";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"("+group.rules[i].field +".equalsIgnoreCase('"+ group.rules[i].data+"'))";
						}else if(group.rules[i].condition === "in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"in_condition("+group.rules[i].field+ " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "not_in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"not_in_condition("+group.rules[i].field+ " , '"  + group.rules[i].data+"')";

						}
						else if(group.rules[i].condition === "in_context"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"in_context('"+group.rules[i].data+ "' , "  + group.rules[i].field+")";
						}
						else if(group.rules[i].condition === "not_in_context"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"not_in_context('"+group.rules[i].data+ "' , "  + group.rules[i].field+")";
						}

						else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"range("+group.rules[i].field+ " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}



					}
				}

			}
		}

		return str + ")";
	}


	//open model 





	self.openCategoryModal = function(){

		self.nodeData = {id:0,parentId:0,categoryName:''};

		$("#event-category-model").modal();

	}

	$scope.displayForEditCategory =  function(node){
		for(var i=0;i<self.treeData.length;i++){
			if(node.id === self.treeData[i].id){
				self.nodeData = {id:parseInt(node.id),parentId:node.parent,categoryName:self.treeData[i].categoryName}
				$("#event-category-model").modal();
				break;
			}


		}


	}

	self.openCreateEvent = function(){
		self.event = {id:0,eventName:'',eventDescription:'',logDevice:'',logType:'',logFields:'',eventTags:'',severity:'',eventType:'Simple Event',eventMetaData:'',categoryId:0,fitlerQuery:'',eventAlert:'',eventAlertNotification:'',approvalStatus:''};
		self.tags = [];
		var ruleData = '{"group": {"operator": "AND","rules": []}}';
		$scope.ruleFilter = JSON.parse(ruleData);
		$scope.displayNewItem();

	}

	self.saveConditionEventCategory = function(name,id){

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to create category <b>'+name+'</b> ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-success',
					action: function(scope, button){
						self.nodeData ={};
						self.nodeData = {categoryName:name}

						if($scope.tabName == "rules"){
							self.nodeData['parentId'] = 2;
						} else {
							self.nodeData['parentId'] = 1;
						}
						if(id != undefined || id != ""){
							self.nodeData.id = id;
						}


						eventService.saveCategory(self.nodeData).then(function(response){
							if(response.data.status){
								self.getAllCategories();
								self.alertMessagaes.push({ type: 'success', msg: "Category Creation was successful" });
								$timeout(function () {
									self.alertMessagaes.splice(0, 1);
								}, 2000);

							}else{

								if(response.data.errors){
									for(var i=0;i<response.data.errors.length;i++){

										self.conditionMessage.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
									}
								}else{
									self.conditionMessage.push({ type: 'danger', msg: response.data.msg });
								}
								$timeout(function () {
									self.conditionMessage.splice(0, 1);
								}, 2000);
							}
						}, function (error) {
							unloader("body");
							self.conditionMessage.push({ type: 'danger', msg: error.data.msg });
							$timeout(function () {
								self.alertMessagaes = [];
							}, 2000);
						});

					}
				},
				close: function(scope, button){
				}
			}
		});


	}





	self.doValidation = function(){
		if(self.event.eventName == undefined || self.event.eventName == ""  || self.event.eventDescription == "" || self.event.eventDescription == undefined || self.event.logDevice == "" 
			|| self.event.logDevice == undefined || self.event.severity == undefined || self.event.severity == "" || self.logfieldModel.length == 0 || self.tagDetails.length == 0){
			self.alertMessagaes.push({ type: 'danger', msg: "Please fill all the details in event information"});
			$timeout(function(){
				self.alertMessagaes = [];
			},2000);
			return false;
		}
		return true;
//		else if(self.alert.alertName == "" || self.alert.alertName == undefined || self.alert.priority == undefined || self.alert.priority == "" || self.alert.severity == "" || self.alert.severity == undefined || self.alert.triggerConditionOperator == "" || self.alert.triggerConditionOperator == undefined){
//		self.alertMessagaes.push({ type: 'danger', msg: "Please fill all the details in Alert information"});
//		return false;
//		}else if(self.alert.alertName == "" ){

//		}
	}

	self.notificationMessagaes = [];
	self.triggerMessagaes = [];
	self.eventMessagaes = [];
	self.filterMessagaes = [];
	self.alertFormMessagaes = [];
	self.alertMessagaesEventFields = [];
	$scope.formSubmitted = false;
	self.doEventValidation = function () {
		$scope.formSubmitted = true;
		var regex = new RegExp("^[A-Za-z0-9-_\\s-]+$"); 
		if (angular.equals(self.event.eventType, "Simple Event")) {
			if (self.event.logDevice == "" || self.event.logDevice == undefined || self.event.categoryId == undefined || self.event.categoryId == "" ) {
				self.alertMessagaes.push({
					type: 'danger',
					msg: "Please fill all the details in event information"
				});
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				return false;
			}else if($scope.eventFields.length == 0){
				self.alertMessagaes.push({
					type: 'danger',
					msg: "Please enter atleast one event field"
				});
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				return false;
			} else if($scope.eventFields.length > 0){
				for(let i=0;i<$scope.eventFields.length;i++){
					if($scope.eventFields[i].logField == "" || $scope.eventFields[i].logField == undefined){
						self.alertMessagaes.push({
							type: 'danger',
							msg: "Please enter all the event fields"
						});
						$timeout(function () {
							self.alertMessagaes = [];
						}, 2000);
						return false;
					} 
					
				}
			}
		}
		if (angular.equals(self.event.eventType, "Complex Event")) {
			if (self.event.eventName == "" || self.event.eventName == undefined || self.event.eventDescription == "" || self.event.eventDescription == undefined || self.event.severity == undefined || self.event.severity == "" || self.rulesGroupList.length == 0 || self.tags.length == 0 || self.event.reference == '' || self.event.reference == undefined || self.event.ruleType == '' || self.event.ruleType == undefined) {
				self.eventMessagaes.push({
					type: 'danger',
					msg: "Please fill all the details in notable event information"
				});
				$timeout(function () {
					self.eventMessagaes = [];
				}, 2000);
				return false;
			}
			
			if(angular.equals(self.event.reference,'Mitre')){
				if(self.techniques.length === 0){
					self.eventMessagaes.push({
						type: 'danger',
						msg: "Please Enter techniques for Mitre"
					});
					$timeout(function () {
						self.eventMessagaes = [];
					}, 2000);
					return false;
				}
			}
			
			
			if(!regex.test(self.event.eventName)){
				self.alertMessagaes.push({ type: 'danger', msg: "Title should not contain special characters." });
				return false;
			}
			 
			
				var temp = JSON.parse(self.event.eventMetaData);
				if (temp.group.rules.length == 0) {
					self.filterMessagaes.push({
						type: 'danger',
						msg: "Please enter atleast one filter"
					});
					$timeout(function () {
						self.filterMessagaes = [];
					}, 2000);
					return false;
				}
				for (var i = 0; i < temp.group.rules.length; i++) {
					for(var j=0;j<temp.group.rules[i].currentConditions.length;j++){
						if(temp.group.rules[i].currentConditions[j].conditionValue == "" || temp.group.rules[i].currentConditions[j].conditionValue == ""||temp.group.rules[i].currentConditions[j].conditionOperator == "" ||temp.group.rules[i].currentConditions[j].conditionOperator == undefined || temp.group.rules[i].currentConditions[j].conditionField.fieldname == undefined || temp.group.rules[i].currentConditions[j].conditionField.fieldname == ""){
							self.filterMessagaes.push({
								type: 'danger',
								msg: "Please fill all the filter details"
							});
							$timeout(function () {
								self.filterMessagaes = [];
							}, 2000);
							return false;
						}
					}
//					if (temp.group.rules[i].aggTempFiled == [] || temp.group.rules[i].aggergationType == "" || temp.group.rules[i].crruentEvent == {} || temp.group.rules[i].field == {} || temp.group.rules[i].operator == "" || temp.group.rules[i].timeType == "" || temp.group.rules[i].timeValue == "" || temp.group.rules[i].value == "" ||
//							temp.group.rules[i].aggTempFiled == undefined || temp.group.rules[i].aggergationType == undefined || temp.group.rules[i].crruentEvent == undefined || temp.group.rules[i].field == undefined || temp.group.rules[i].operator == undefined || temp.group.rules[i].timeType == undefined || temp.group.rules[i].timeValue == undefined || temp.group.rules[i].value == undefined) {
//						self.filterMessagaes.push({
//							type: 'danger',
//							msg: "Please fill all the filter details"
//						});
//						$timeout(function () {
//							self.filterMessagaes = [];
//						}, 2000);
//						return false;
//					}
				}
				
				

				if(self.event.ruleType === 'Rule'){
					if (self.alert.triggerCondition == "" || self.alert.triggerConditionOperator == "" || self.alert.triggerConditionValue == "" || self.alert.triggerCondition == undefined || self.alert.triggerConditionOperator == undefined || self.alert.triggerConditionValue == undefined ||
							self.event.eventAlertNotification == "") {
						self.triggerMessagaes.push({
							type: 'danger',
							msg: "Please fill all the details in  trigger condition "
						});
						$timeout(function () {
							self.triggerMessagaes = [];
						}, 2000);
						return false;
					}
					if($scope.actionName.indexOf('lookupTable') != -1){
						if(self.updateLookTable.lookupContext == "" || self.updateLookTable.lookupContext == undefined){
							self.triggerMessagaes.push({
								type: 'danger',
								msg: "Please fill all the details in  LookUp Table section"
							});
							$timeout(function () {
								self.triggerMessagaes = [];
							}, 2000);
							return false;
						}
					}
					if($scope.actionName.indexOf('ticket') != -1) {
						if (self.ticket.title == "" || self.ticket.title == undefined || self.ticket.description == "" || self.ticket.description == undefined || self.ticket.priority == "" || self.ticket.priority == undefined || self.ticket.assignee == "" || self.ticket.assignee == undefined) {
							self.triggerMessagaes.push({
								type: 'danger',
								msg: "You have selected the Ticket, so please fill all the details of ticket"
							});
							$timeout(function () {
								self.triggerMessagaes = [];
							}, 2000);
							return false;
						}
					}
					if ($scope.actionName.indexOf('notable') != -1) {
						if (self.notable.title == "" || self.notable.description == "" || self.notable.message == "" ||
								self.notable.title == undefined || self.notable.description == undefined || self.notable.message == undefined || self.notable.irpTemplate == undefined || self.notable.irpTemplate == "") {
							self.triggerMessagaes.push({
								type: 'danger',
								msg: "You have selected the Notable, so please fill all the details of Notable"
							});
							$timeout(function () {
								self.triggerMessagaes = [];
							}, 2000);
							return false;
						}
					} 
					if ($scope.actionName.indexOf('sendEmail') != -1) {
						if (self.email.to == "" || self.email.to == undefined || self.email.subject == "" || self.email.subject == undefined || self.email.message == "" || self.email.message == undefined) {
							self.triggerMessagaes.push({
								type: 'danger',
								msg: "You have selected the Email, so please fill all the details of Email"
							});
							$timeout(function () {
								self.triggerMessagaes = [];
							}, 2000);
							return false;
						}
					}
				}
			
		}
		return true;
	}

	$scope.deleteEvent = function(id,eventName){

		if(id == undefined){
			id = self.eventId[0].id;
			eventName = self.eventId[0].eventName
		}
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+eventName+'</b> Event.  ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						eventService.deleteEvent(parseInt(id)).then(function (response) {
							if(response.status===200){
								self.alertMessagaes.push({ type: 'success', msg: 'Event was deleted successfully' });
								//toastr.success("Condition was deleted successfully")
								self.getAllEvents();



								self.event = {id:0,eventName:'',eventDescription:'',logDevice:'',logType:'',logFields:'',eventTags:'',severity:'',eventType:'Simple Event',eventMetaData:'',categoryId:0,fitlerQuery:'',eventAlert:'',eventAlertNotification:'',approvalStatus:''};


								self.alert = {id:0,emailId:'',subjectName:'',message:'',alertType:'',scheduleAt:'',ruleName:'',createIncident:'',defaultAssignee:'',irpTemplates:'',schedule:'',triggerCondition:'',triggerConditionOperator:'',triggerConditionValue:'',windowDuration:'',priority:'',category:'',description:'',irpTemplates:''};

								self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};

								self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};

								var data = '{"group": {"operator": "AND","rules": []}}';
								$scope.filter = JSON.parse(data);


								self.logfieldModel = [];


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

	//checkbox for simple and complex events
	$scope.eventName = "Custom";
	$scope.tabName = 'events';
	$(document).ready(function(){
		loader("body");
		$timeout(function(){
			var eventTypeCheckBox = document.getElementById('eventsTypeId');
			new Switchery(eventTypeCheckBox,{ size: 'small' });
			eventTypeCheckBox.innerHTMl = eventTypeCheckBox.checked; 
			eventTypeCheckBox.onchange = function() {
				if(eventTypeCheckBox.checked){
					$scope.openEventTypes('Standard');
					$scope.eventName = "Standard";
				}else{
					$scope.openEventTypes('Custom');
					$scope.eventName = "Custom";
				}
				$timeout(function(){
					if(angular.equals($scope.tabName,"events")){						
						$scope.openTreeStructure('events');						
					}else if(angular.equals($scope.tabName,"rules")){
						$scope.openTreeStructure('rules');						
					}
				},100);
			};
			unloader("body");
		},3000);

	});

	self.irps = [];
	irpFactory.getAllIRPS().then(function(response){
		self.irps = angular.copy(response.data);
	},function(error){
		console.log(error);
	})

	self.irpConfig = {
		maxItems: 1,
		optgroupField: 'class',
		labelField: 'templateName',
		searchField: ['templateName'],
		valueField: 'id',
		create: false
	};


	self.columnDefs= [];
	self.loadColumnDefs = function(type){
		self.columnDefs= [];
		if(angular.equals(type.toLowerCase(),"events")){
			self.columnDefs = [
				{headerName: "OBELUS  ID", field: "obelusTypeId", width: 150,  checkboxSelection: true, sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
					filterOptions:['contains'],suppressAndOrCondition:true }},

					{headerName: "Category", field: "categoryName", width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
						filterOptions:['contains'],suppressAndOrCondition:true }},


						{headerName: "Log Device", field: "logDevice", width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
							filterOptions:['contains'],suppressAndOrCondition:true }},



							{headerName: "Created By", field: "createdBy",  hide: true, width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
								filterOptions:['contains'],suppressAndOrCondition:true,  hide: true, }},
								{headerName: "Updated By", field: "updatedBy",  hide: true, width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
									filterOptions:['contains'],suppressAndOrCondition:true,  hide: true }},
									{headerName: "Updated At", field: "updatedAt",comparator: dateComparator,  hide: true, width: 150, enableRowGroup: true,sortable:true,filter: 'agTextColumnFilter',filterParams:{ filterOptions:['contains'],suppressAndOrCondition:true,  hide: true, }, valueGetter: function(params) {
										if(params.data != undefined && params.data.updatedAt != null){
											return moment(params.data.updatedAt).format("L LT");
										}
									}}

									]
		}else{
			self.columnDefs = [
				{headerName: "Event Name", field: "eventName", width: 150, sort: 'asc', checkboxSelection: true, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
					filterOptions:['contains'],suppressAndOrCondition:true}},
					{headerName: "Group", field: "ruleGroup", width: 150, enableRowGroup: true,  hide: true,filter: 'agTextColumnFilter',filterParams:{
						filterOptions:['contains'],suppressAndOrCondition:true }},
						{headerName: "Rule Type", field: "ruleType", width: 150,  hide: true, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
							filterOptions:['contains'],suppressAndOrCondition:true }},
							{headerName: "Description", field: "eventDescription", width: 150,  hide: true, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
								filterOptions:['contains'],suppressAndOrCondition:true,  hide: true }},
								{headerName: "Tags", field: "tags",  hide: true,cellRenderer: 'deltaIndicator', width: 150, enableRowGroup: true,sortable:false,filter: 'agTextColumnFilter',filterParams:{ filterOptions:['contains'],suppressAndOrCondition:true,  hide: true, }},
								{headerName: "Status", field: "eventStatus", width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
									filterOptions:['contains'],suppressAndOrCondition:true }},
									{headerName: "Created By", field: "createdBy", width: 150,  hide: true, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
										filterOptions:['contains'],suppressAndOrCondition:true,  hide: true }},
										{headerName: "Severity", field: "severity", width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
											filterOptions:['contains'],suppressAndOrCondition:true }},
											{headerName: "Updated By", field: "updatedBy", width: 150,  hide: true, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
												filterOptions:['contains'],suppressAndOrCondition:true,  hide: true }},
												{headerName: "Updated At", field: "updatedAt",comparator: dateComparator, width: 150,  hide: true, enableRowGroup: true,sortable:true,filter: 'agTextColumnFilter',filterParams:{ filterOptions:['contains'],suppressAndOrCondition:true,  hide: true }, valueGetter: function(params) {
													if(params.data != undefined && params.data.updatedAt != null){
														return moment(params.data.updatedAt).format("L LT");
													}
												}}
												]
		}
	}




	function deltaIndicator(params) {
		var tags = params.value.split(",");
		var element = ""
			for(let i=0;i<tags.length;i++){
				element += '<label class="badge badge-primary">'+tags[i]+'</label>&nbsp;';
			}
		return element;
	}
	self.eventGrid = {};
	self.loadEvents = function(events){

		$scope.templateUrl = "viewEventsInfo.html";
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
					rowData: events,
					components:{
						deltaIndicator: deltaIndicator,
					},
					rowSelection: 'multiple',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onSelectionChanged,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}

			$("#eventsContent").empty();
			$("#filterShow").hide();
			$("#editId").hide();
			$("#deleteId").hide();
			$("#enableDisableButton").hide();
			$("#bulkDeleteButton").hide();
			self.eventId = [];

			if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
				self.eventGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#eventsContent');
			new agGrid.Grid(eGridDiv, self.eventGrid );

		},250);
	}

	$(window).resize(function() {
		setTimeout(function() {
			try{self.eventGrid.api.sizeColumnsToFit();}catch(err){}
			try{self.categoryGrid.api.sizeColumnsToFit();}catch(err){}

		}, 500);
	});
	self.eventId = [];
	$("#editId").hide();
	$("#deleteId").hide();
	$("#filterShow").hide();
	$("#enableDisableButton").hide();
	$("#bulkDeleteButton").hide();
	self.onSelectionChanged = function() {
		$("#editId").hide();
		$("#deleteId").hide();
		$("#filterShow").hide();
		$("#enableDisableButton").hide();
		$("#bulkDeleteButton").hide();
		self.eventId = [];
		self.eventId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.eventId.length > 0){
			self.viewEventDetails(self.eventId[0].id)
//			$("div.panel-group.accordion").attr("is-open",true);
			$("#editId").show();
			$("#deleteId").show();
			$("#filterShow").show();
			$("#enableDisableButton").show();
			$("#bulkDeleteButton").show();
			$timeout(function(){				
				self.disableForm();
			},2000);
		}
	}

	self.disableEvents = function(){
//		$("div.panel-group.accordion").attr("is-open",true);
		$("#editId").show();
		$("#deleteId").show();
		$("#filterShow").show();
		$("#enableDisableButton").hide();
		$("#bulkDeleteButton").hide();
		$timeout(function(){				
			self.disableForm();
		},2000);
	}

	$("#page-content").css("height",$("body").height()-55);
	$("#page-content").css("overflow-x","hide");
	$("#page-content").css("overflow-y","scroll");
	self.disableForm = function(){
		$(".collapse *").css("cursor","not-allowed");
		$(".collapse").css("pointer-events","none");
//		$('#disabledForm').find('input').attr('disabled', true);
//		$('#disabledForm').find('.form-control').attr("disabled",true);
//		$('#disabledForm').find('.ui-select').attr('ng-disabled', true);
//		$('#disabledForm').find('button').attr('ng-disabled', true);
//		$("selectize").attr("ng-disabled","disable");
////		$('div.panel-group.accordion[is-open="false"]').attr("is-open","true");
//		$('#disabledForm').find('button.btn.btn-dark').hide();
//		$('#disabledForm').find('button.btn.btn-danger').hide();
//		$('#disabledForm').find('.btn').attr('disabled', true);
//		$('#disabledForm').find('.btn').attr('disabled', true);
//		$("span.ui-select-match-item.btn.btn-default.btn-xs").css("opacity", "1");
//		$("span.close.ui-select-match-close").hide();
//	
	}

	self.viewEventDetails = function(id){
		if(id == undefined){
			id = self.eventId[0].id;
		}
		loader("body");

		self.tatics = [];
		self.techniques = [];

		self.event = {id:0,eventName:'',eventDescription:'',logDevice:'',logType:'',logFields:'',eventTags:'',severity:'',eventType:'Simple Event',eventMetaData:'',categoryId:0,fitlerQuery:'',eventAlert:'',eventAlertNotification:'',approvalStatus:'',customFields:'',eventLookupName:'',technique:'',tatic:'',riskScore:0,vendorId:'',vendorModel:''};

		eventService.loadSingleEvent(id).then(function(response){

			$scope.inputFields = [];
			$scope.outFields = [];
			self.event = angular.copy(response.data);
//			$timeout(function(){				
			self.loadLogTypes();
//			},250);

			if(self.event.eventLookupName){
				self.currentLookupFields = self.event.eventLookupName.split(",");

			}

			if(self.event.tatic){
				self.tatics = self.event.tatic.split(",");
			}

			if(self.event.techniques){
				self.techniques = self.event.techniques.split(",");
			}




			if(self.event.eventType === 'Simple Event' ){
				$scope.tabName = "events"
			}else if(self.event.eventType === 'Complex Event'){
				$scope.tabName = "rules"
			}
			if(self.event.eventType === 'Simple Event' && $scope.tabName==="events"){
//				$scope.templateUrl = "eventInformation.html";
				$timeout(function(){

					self.logfieldModel = []





					$scope.eventFields = [];

					$scope.eventFields = JSON.parse(self.event.logFields);




					//self.logfieldModel = self.event.logFields.split(",");

					if(response.data.lookupDetails){
						var data1 = JSON.parse(response.data.lookupDetails);

					}
					$scope.filter = JSON.parse(self.event.eventMetaData);
					self.tags  = [];
					if(self.event.eventTags){
						self.tags = self.event.eventTags.split(",");
					}

					self.event.categoryId =  self.event.categoryId.toString();
					unloader("body");
				},500);

			}else if(self.event.eventType === 'Complex Event' && $scope.tabName==="rules"){

				unloader("body");
//				$scope.templateUrl = "ruleInformation.html";
				$timeout(function(){

					if(response.data.categoryId){
						self.event.categoryId =  response.data.categoryId.toString();
					}

					$scope.customFields = [];
					if(self.event.customFields){
						$scope.customFields = JSON.parse(self.event.customFields);
					}
					
					if(response.data.groupName){
						self.rulesGroupList = response.data.groupName.split(",");
					}

					

					$timeout(function(){

						$scope.ruleFilter = JSON.parse(self.event.eventMetaData);
						self.alert = JSON.parse(response.data.alert);
						let temp= JSON.parse(response.data.notification);
						if(temp.alertName != undefined && temp.alertName.trim() != ""){							
							self.alertConfig = angular.copy(JSON.parse(temp.eventAlertNotification));
						}else{
							self.alertConfig = angular.copy(temp);
						}
						self.tags = self.event.eventTags.split(",");
						$scope.actionName = [];
						self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};
						self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};
						self.ticket = {name: 'ticket',expanded : false,enabled:false,title:'',description:'',priority:'',assinge:''};

						for(var i=0;i<self.alertConfig.length;i++){
							if(self.alertConfig[i].name == 'email' && self.alertConfig[i].enabled== true && self.alertConfig[i].expanded== true){
								self.email= angular.copy(self.alertConfig[i]);
								$scope.actionName.push("sendEmail")
							}else if(self.alertConfig[i].name == 'notable' && self.alertConfig[i].enabled== true && self.alertConfig[i].expanded== true){
								self.notable= angular.copy(self.alertConfig[i]);
								$scope.actionName.push("notable")
							}else if(self.alertConfig[i].name == 'ticket' && self.alertConfig[i].enabled== true && self.alertConfig[i].expanded== true){
								self.ticket= angular.copy(self.alertConfig[i]);
								$scope.actionName.push("ticket")
							}
						}
					},400);
				},500);
			}




//			unloader("body");


		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: error });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});


	}

	$scope.categories = [];

	self.getAllCategories = function(){
		eventService.getAllCategories().then(function(response){
			self.allCategories = response.data;
			$scope.categories = response.data;
		},function(error){

		});
	};
	self.getAllCategories();

	self.enableDisableEvents = function(){
		if(self.eventId.length == 0){
			return false
		}
		var temp = [];
		var ids = [];
		for(var i=0;i<self.eventId.length;i++){
			ids.push(self.eventId[i].id);
			if(temp.indexOf(self.eventId[i].eventStatus) == -1){
				temp.push(self.eventId[i].eventStatus);
			}
		}

		eventService.enableDisableEvents(ids,temp.length == 1 ? temp[0] : "Disable").then(function(response){
			if(response.data.status){				
				self.getAllEvents();
				self.alertMessagaes.push({ type: 'success', msg: "Sucessfully changes the status of the events"});
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: response.data.msg});
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		},function(error){
			self.alertMessagaes.push({ type: 'danger', msg: "Unable to change the status of the events"});
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);	
		});

	}

	self.deleteMultipleEvents = function(){
		var temp = [];
		for(var i=0;i<self.eventId.length;i++){
			temp.push(self.eventId[i].id);
		}
		eventService.deleteSelectedEvents(temp).then(function(response){
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: "Selected Events deleted successfully"});
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);				
				self.getAllEvents();
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: response.data.msg});
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);				
			}
		},function(error){
			self.alertMessagaes.push({ type: 'danger', msg: "Unable to delete the selected events"});
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);				
		});
	}


//	self.loadEvents();


	self.manageCategories = function(){
		$("#manageCategories").modal("show");
		self.categoryId = "";
		$timeout(function(){			
			$("#editNewCategory").hide();
			$("#showAllCategories").show();
		},500);

		self.loadCategoryGrid();
	}


	self.categoryColumnDefs =  [
		{headerName: "Category Name", field: "categoryName", width: 150,  checkboxSelection: true, sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
			filterOptions:['contains'],suppressAndOrCondition:true }},
			{headerName: "Created By", field: "createdBy", width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }},
				{headerName: "Updated At", field: "updatedAt", width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
					filterOptions:['contains'],suppressAndOrCondition:true }},
					{headerName: "Updated By", field: "updatedBy", width: 150, enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
						filterOptions:['contains'],suppressAndOrCondition:true }}
					]

	self.loadCategoryGrid = function(){
		$timeout(function(){

			self.categoryId = "";
			self.categoryGrid = {
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
					columnDefs: self.categoryColumnDefs,
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
					rowData: self.allCategories,
					rowSelection: 'multiple',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onSelectionOfCategory,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}

			self.selectedCategory= [];
			if(self.categoryGrid.api != undefined && self.categoryGrid.api.getSelectedRows().length > 0){			
				self.categoryGrid.api.deselectAll();
			}
			self.categoryId = "";
			$("#editNewCategory").hide();
			$("#showAllCategories").show();
			$("#categoryDetails").empty();

			var eGridDiv =  document.querySelector('#categoryDetails');
			new agGrid.Grid(eGridDiv, self.categoryGrid );
			self.categoryGrid.api.deselectAll();
		},500);
	}

	self.createCategory = function(){
		self.categoryId = "";
		self.categoryName = "";
		$("#editNewCategory").show();
		$("#showAllCategories").hide();
	}

	self.editCategory  = function(){
		self.categoryName = self.selectedCategory[0].categoryName;
		self.categoryId = self.selectedCategory[0].id;
		$("#editNewCategory").show();
		$("#showAllCategories").hide();
	}

	self.backToCategories  = function(){
		$("#editNewCategory").hide();
		$("#showAllCategories").show();
	}
	self.onSelectionOfCategory = function() {
		$("#editCategoryId").hide();
		$("#deleteCategoryId").hide();
		self.selectedCategory= [];
		self.selectedCategory = angular.copy(self.categoryGrid.api.getSelectedRows());
		if(self.selectedCategory.length == 1){
			$("#deleteCategoryId").show();				
			$("#editCategoryId").show();
		}
		if(self.selectedCategory.length > 1){
			$("#editCategoryId").hide();
			$("#deleteCategoryId").show();
		}

	}
	self.alertModalMessagaes = [];
	self.createNewCategory = function() {
		if(self.categoryName == "" || self.categoryName == undefined){
			self.alertModalMessagaes.push({ type: 'danger', msg: "Please enter the Category Name"});
			$timeout(function(){
				self.alertModalMessagaes = [];
			},3000);
		}

		self.nodeData ={};
		self.nodeData = {categoryName:self.categoryName};

		if($scope.tabName == "rules"){
			self.nodeData['parentId'] = 2;
		} else {
			self.nodeData['parentId'] = 1;
		}
		if(self.categoryId != undefined || self.categoryId != ""){
			self.nodeData.id = self.categoryId;
		}


		eventService.saveCategory(self.nodeData).then(function(response){
			if(response.data.status){
				self.getAllCategories();
				self.alertModalMessagaes.push({ type: 'success', msg: "Category Creation was successful" });
				$timeout(function () {
					self.alertModalMessagaes.splice(0, 1);
				}, 2000);
				$timeout(function(){					
					self.loadCategoryGrid();
				},750);

			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.alertModalMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertModalMessagaes.push({ type: 'danger', msg: response.data.msg });
				}
				$timeout(function () {
					self.alertModalMessagaes.splice(0, 1);
				}, 2000);
			}
		}, function (error) {
			unloader("body");
			self.alertModalMessagaes.push({ type: 'danger', msg: error.data.msg });
			$timeout(function () {
				self.alertModalMessagaes = [];
			}, 2000);
		});


	}

$scope.techniques = [];
	$scope.onSelectedTatics = function(item){
		for(let i=0;i<$scope.allMiterTactics.length;i++){
			try{				
				if($scope.allMiterTactics[i].tacticsId == item.split('-')[0].toString().trim()){
					var temp = $scope.allMiterTactics[i].techniqueName.split(',');
					for(let j=0;j<temp.length;j++){
						$scope.techniques.push(temp[j]);
						$scope.techniques = [...new Set($scope.techniques)];
					}
				}
			}catch(err){}
		}
	}
}]);


app.directive('queryBuilder', ['$compile','conditionFactory','$timeout', function ($compile,conditionFactory,$timeout) {
	return {
		restrict: 'E',
		scope: {
			group: '=',
			parent: '='

		},

		templateUrl: 'queryBuilderDirective.html',
		compile: function (element, attrs) {
			var content, directive;
			content = element.contents().remove();
			return function (scope, element, attrs) {

				scope.operators = [
					{ name: 'AND' },
					{ name: 'OR' }
					];


				scope.fields = [];
				scope.conditions = [
					{ name: 'Equals', value:"=" },
					{ name: 'Not Equals',value:"<>"  },
					{ name: 'Contains',value:"%%"  },
					{ name: 'Starts With',value:"_%"  },
					{ name: 'Ends With',value:"%_"  },
					{ name: 'In',value:"in"  },
					{ name: 'Not In',value:"not_in"  },
					{ name: 'IP Range',value:"ip_range"  },
					{ name: 'Time Range',value:"time_range"  },
					{ name: 'In Context',value:"in_context"  },
					{ name: 'Not Context',value:"not_in_context"  },
					{ name: 'Range',value:"range"  },
					{name:"Lookup",value:"lookup"}
					];



				scope.logtypes = [];
				$timeout(function(){
					scope.fields = scope.parent.logFields
					scope.group['logFileds'] = scope.parent.logFields
					scope.referenceSetDetails = scope.parent.referenceSetDetails
				},1000);


				scope.addCondition = function (index) {

					if(scope.logtypes.length==0){
						scope.fields = [];
						scope.fields.push("event_category")


						if (typeof scope.parent !== 'undefined'){

							for(var i=0; i<scope.parent.logFields.length;i++ ){
								if(scope.parent.logFields[i].fieldname){
									scope.fields.push(scope.parent.logFields[i].fieldname);
								}else{
									scope.fields.push(scope.parent.logFields[i]);
								}

							}
							scope.group['logFileds'] = scope.fields

						}else{


							scope.fields = scope.group.logFileds;
						}

					}


					scope.group.rules.push({
						condition: ':',
						field: '',
						data: ''
					});
				};




				scope.removeCondition = function (index) {
					scope.group.rules.splice(index, 1);
				};

				scope.addGroup = function () {

					var tempFileds = [];

					if(scope.group.logFileds){
						tempFileds = scope.group.logFileds;
					}

					scope.group.rules.push({
						group: {
							operator: 'AND',
							rules: [],
							logFileds: tempFileds
						}
					});


				};

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


app.directive('ruleBulider', ['$compile','$rootScope', function ($compile,$rootScope) {
	return {
		restrict: 'E',
		scope: {
			group: '=',
			fields: '=',
			events: '=',
			parentContext: "=",
			categories:"=",
			refset:"="


		},
		templateUrl: 'ruleEventBuilderDirective.html',
		compile: function (element, attrs) {
			var content, directive;
			content = element.contents().remove();
			return function (scope, element, attrs) {

				//$scope.categories

				scope.operators = [
					{ name: 'AND' },
					{ name: 'OR' }
					];
				
				scope.lookupFields = [];

				scope.getValuesFromRefData = function(data){
					scope.lookupFields = [];
					for(var i=0;i<scope.refset.length;i++){
						if(scope.refset[i].id === parseInt(data.refData)){
							var tempData = scope.refset[i].valueFields.split(",");
							data['exitsingFields']  = [];
							data['exitsingFields']  = tempData;
						}
					}
					
				}

				scope.currentConditions = scope.events;

				scope.currentEvents = [];



				scope.addJoin = function(rule,index){
					try{						
						rule.join.push({});
					}catch(err){
						rule.join = [];
						rule.join.push({});
					}
				}

				scope.removeJoin = function(rule,index){
					rule.join.splice(index, 1);
				}

				scope.viewConfig = function(data,index){

					for(var i=0;i<scope.currentConditions.length;i++){
						if(scope.currentConditions[i].eventName===data.eventName){
							//scope.$parent.currentConditions = scope.$parent.finalConditions[i];

							//ruleScope.addConditionFilter(scope.currentConditions[i]);

							if(index>=1){
								scope.group.rules[index].perivousEvent = scope.group.rules[index-1].crruentEvent;




							}

							scope.group.rules[index].crruentEvent = scope.currentConditions[i];

							///scope.currentEvents.push(scope.currentConditions[i]);

							//scope.$parent.$broadcast('addConditionFilter', scope.$parent.finalConditions[i]);

							$("#viewConfig").modal();
						}
					}

				}

				scope.eventIndex = 0;


				scope.changeCondition = function(data,index){
					for(var i=0;i<scope.currentConditions.length;i++){
						if(scope.currentConditions[i].eventName===data.eventName){
							//scope.$parent.currentConditions = scope.$parent.finalConditions[i];

							//ruleScope.addConditionFilter(scope.currentConditions[i]);
							var tempConditions = [];
							if(index>=1){
								for(var j=1;j<scope.group.rules.length;j++){
									tempConditions.push(scope.group.rules[j-1].crruentEvent);
								}

								scope.group.rules[index].perivousEvents = tempConditions;



								scope.group.rules[index].perivousEvents['fields'] = tempConditions[0].fields;

								scope.group.rules[index].join.push({});



							}

							scope.group.rules[index].crruentEvent = scope.currentConditions[i];

							var tempFields = JSON.parse(scope.currentConditions[i].fields);
							var actualFields = [];
							for(var i=0;i<tempFields.length;i++){
								actualFields.push(tempFields[i].logField.fieldname);
							}

							scope.group.rules[index].crruentEvent['fields'] = actualFields;

							///scope.currentEvents.push(scope.currentConditions[i]);

							//scope.$parent.$broadcast('addConditionFilter', scope.$parent.finalConditions[i]);


						}
					}
				}

				scope.changePervoiusCondition = function(rule,index){
					for(var i=0;i<scope.currentConditions.length;i++){
						if(scope.currentConditions[i].eventName===rule.join[index].perviousConditionEvent){
							scope.group.rules[scope.group.rules.length-1].perivousEvent = scope.currentConditions[i];
						}

					}
				}
				scope.logFields = [];
				scope.eventContext = scope;
				scope.showFilter = function(rule,index){
					if(rule.crruentEvent){
						scope.logFields = rule.crruentEvent.fields;

						if(rule.crruentEvent.actulaJson){
							scope.filter = JSON.parse(rule.crruentEvent.actulaJson);
						}else{
							var data = '{"group": {"operator": "AND","rules": []}}';
							scope.filter = JSON.parse(data);
						}
						$("#fitler_modal-"+index).modal();
					}

				}

				scope.close = function(rule,index){
					if(rule.crruentEvent){
						rule.crruentEvent['additinalFilter'] = scope.output;
						rule.crruentEvent['actulaJson'] = JSON.stringify(scope.filter);
						$("#fitler_modal-"+index).modal('hide');
					}

				}

				scope.addCorrelation = function(data){
					for(var i=0;i<scope.currentConditions.length;i++){
						if(scope.currentConditions[i].conditionName===data){
							//scope.$parent.currentConditions = scope.$parent.finalConditions[i];
							ruleScope.addCorrleationForEvents(scope.currentConditions[i],conditionIndex,scope.groupIndex);
						}
					}
				}

				scope.currnetEvent = {};

				//g1.c1.remote_ip = g1.c2.remote_ip

				scope.conditions = [
					{ name: 'Equals', value:"equals" },
					{ name: 'Not Equals',value:"not_equals"  },
					{ name: 'Contains',value:"contains"  },
					{ name: 'Starts With',value:"startsWith"  },
					{ name: 'Ends With',value:"endsWith"  },
					{ name: 'In',value:"in_condition"  },
					{ name: 'Not In',value:"not_in_condition"  },
					{ name: 'In Context',value:"in_context"  },
					{ name: 'Not Context',value:"not_in_context"  },
					{ name: 'IP Range',value:"ip_range"  },
					{ name: 'Any Match',value:"any_match"  },
					{ name: 'All Match',value:"all_match"  },
					{ name: 'Time Range',value:"time_range"  },
					{ name: 'Range',value:"range"  },
					{name:"Threat Matcher",value:"threat_matcher"}
					];



				scope.deleteCondition = function(data,index){
					if(data.length <= 1){
						alert("atleate one condition should be present");
						return false;
					}
					data.splice(index, 1);
				}

				scope.addCondition = function(data){

					data.push({conditionField:'',conditionOperator:'',conditionValue:''})
				}

				scope.addToEventToRule = function (data,index) {
					conditionIndex++;
					scope.group.rules.push({
						condition: '=',
						field: '',
						data: '',
						crruentEvent: '',
						perivousEvent: '',
						join : [],
						currentConditions :[{conditionField:'',conditionOperator:'',conditionValue:''}]
					});

					scope.eventIndex++;
					$("#ruleDetailsButton").removeAttr("disabled");
				};

				scope.removeCondition = function (index) {
					scope.eventIndex--;
					scope.group.rules.splice(index, 1);
				};
				scope.update = function(index){
					if(scope.group.rules[index].condition=== 'in'){
						setTimeout(function(){ 

							$('.tokenfield').tokenfield();

						},100);

					}

				}

				scope.$watch('filter', function (newValue) {
					scope.json = JSON.stringify(newValue, null, 2);
					scope.output = computed(newValue.group);

				}, true);

				function computed(group) {
					if (!group) return "";

					var operator = "";
					if(group.operator === "AND"){
						operator = "&&";
					}else{
						operator = "||";
					}

					for (var str = "(", i = 0; i < group.rules.length; i++) {
						i > 0 && (str += " " + operator + " ");
						if(group.rules[i].group){
							str += computed(group.rules[i].group);
						}else{
							if(group.rules[i].field){
								if( group.rules[i].field.indexOf(".") > -1){
									if(group.rules[i].condition === "%%"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													group.rules[i].field.split(".")[1] + " " + " like '%" + group.rules[i].data+"%'";

									}else if(group.rules[i].condition === "_%") {
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													group.rules[i].field.split(".")[1] + " " + " like '" + group.rules[i].data+"%'";
									}else if(group.rules[i].condition === "%_"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													group.rules[i].field.split(".")[1] + " " + " like '%" + group.rules[i].data+"'";
									}else if(group.rules[i].condition === "="){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													group.rules[i].field.split(".")[1] + "  = "  + " '" + group.rules[i].data+"'";
									}else if(group.rules[i].condition === "="){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													group.rules[i].field.split(".")[1] + "  != "  + " '" + group.rules[i].data+"'";
									}else if(group.rules[i].condition === "in"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"column_in("+group.rules[i].field.split(".")[1] + " , '"  + group.rules[i].data+"')";
									}
									else if(group.rules[i].condition === "not_in"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"notin("+group.rules[i].field.split(".")[1] + " , '"  + group.rules[i].data+"')";
									}
									else if(group.rules[i].condition === "ip_range" && group.rules[i].fromIP && group.rules[i].toIP ){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"iprange("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromIP+"','"+group.rules[i].toIP+"')";
									}
									else if(group.rules[i].condition === "time_range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"time_range("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
									}
									else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"range("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
									}
									else if(group.rules[i].condition === "lookup"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"threat_lookup("+group.rules[i].field.split(".")[1]+")";
									}
									//range


								}else{
									if(group.rules[i].condition === "%%"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													//(event_id.equalsIgnoreCase('4625'))

													"("+group.rules[i].field +".contains('"+ group.rules[i].data+"'))";
									}

									else if(group.rules[i].condition === "<>"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"!("+group.rules[i].field +".contains('"+ group.rules[i].data+"'))";
									}

									else if(group.rules[i].condition === "_%"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"("+group.rules[i].field +".startsWith('"+ group.rules[i].data+"'))";
									}
									else if(group.rules[i].condition === "%_"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"("+group.rules[i].field +".endsWith('"+ group.rules[i].data+"'))";
									}else if(group.rules[i].condition === "="){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"("+group.rules[i].field +".equalsIgnoreCase('"+ group.rules[i].data+"'))";
									}else if(group.rules[i].condition === "in"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"in_condition("+group.rules[i].field+ " , '"  + group.rules[i].data+"')";
									}
									else if(group.rules[i].condition === "not_in"){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"not_in_condition("+group.rules[i].field+ " , '"  + group.rules[i].data+"')";

									}

									else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
										str += group.rules[i].group ?
												computed(group.rules[i].group) :
													"range("+group.rules[i].field+ " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
									}

								}
							}

						}
					}

					return str + ")";
				}

				scope.addGroupCorrelation = function(){

					var tempConditions = [];

					for(var i=0;i<scope.group.rules.length;i++){
						if(!scope.group.rules[i].group){
							tempConditions.push(scope.group.rules[i]);
						}
					}

					scope.group.currentConditionsGroups = tempConditions;
				}

				scope.perviousConditionFields = [];

				scope.currentConditionFields = [];

				scope.getPerviousConditionFields = function(condition){

					for(var i=0;i<scope.currentConditions.length;i++){
						if(scope.currentConditions[i].eventName===condition){

							scope.perviousConditionFields = scope.currentConditions[i].fields;
						}
					}

				}

				scope.getCurrentConditionFields = function(condition){
					for(var i=0;i<scope.currentConditions.length;i++){
						if(scope.currentConditions[i].eventName===condition){


							scope.currentConditionFields = scope.currentConditions[i].fields;

						}
					}
				}


				scope.addEventGroup = function () {

					var tempConditions = [];

					for(var i=0;i<scope.group.rules.length;i++){
						if(!scope.group.rules[i].group){
							tempConditions.push(scope.group.rules[i]);
						}
					}

					scope.group.rules.push({
						group: {
							operator: 'AND',
							perviousConditionGroups:tempConditions,
							currentConditionsGroups:'',
							rules: [{
								condition: '=',
								field: '',
								data: '',
								crruentEvent: '',
								perivousEvent: '',
								join : []
							}]
						}
					});
					conditionIndex = 0;


				};

				var data = '{"group": {"operator": "AND","rules": []}}';
				scope.filter = JSON.parse(data);


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

app.directive('search', function () {
	return function ($scope, element) {
		element.bind("keyup", function (event) {
			var val = element.val();
			if(val.length > 2) {
				$scope.search(val);
			}
		});
	};
});

app.filter("unique", function() {
	return function(collection, keyname) {
		var output = [],
		keys = [];
		angular.forEach(collection, function(item) {
			var key = item[keyname];
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	};
});
