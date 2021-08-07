app.controller("filedExtractorController", ['$scope', 'fieldExtractorFactory','$rootScope','$timeout','$uibModal','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','fileUpload','$http','$ngConfirm','lookupFactory','$ngConfirm','eventService', function ($scope, fieldExtractorFactory,$rootScope, $timeout,$uibModal,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,fileUpload,$http,$ngConfirm,lookupFactory,$ngConfirm,eventService) {


	var self = this;
	$rootScope.$broadcast('changeThemeToNormal');
	$scope.startIndexArr = [];

	$scope.fieldData = {logType:'',logDevice:'',timeFilter:'',searchQuery:''};
	self.canGenerateCustomPatterns = false; 

//	$scope.vm = {};
//	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [2, 'asc'])
//	.withOption('scrollY', 200);
	
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';

	self.logparser = {id:0,parserName:'',parserDesc:'',logDevice:'',logType:'',parserType:'',mappingFields : '',logMessage:'',condition:'',delimterType:'',quoteChar:'',escpaeChar:'',lookDetails:''}

	$scope.eventsTab = ""

		$scope.templateUrl = "templateUrl";

	$scope.showHomeButton = true;

	$scope.showEventsButton = false;

	$scope.showEditButton = false;

	$scope.importLogs = false;

	self.canSaveCustomPatterns = false;
	
	$scope.showViewDetails = false;

	$scope.templateUrl = "viewParsers.html";

	$scope.customRegex = "";

	$scope.showBackButton = false;

	$scope.lookupTableName = "";

	self.eventMappings = [];

	$("#editEvent").hide();
	$("#deleteEvent").hide();

	$("#editEventTemplate").hide();
	$("#deleteEventTemplate").hide();

	//$scope.eventFields = [];

	//self.

	$scope.eventFields = {name:[]};

	$scope.eventTemplateFiltersname = {name:[]};




	self.eventForm = {id:0,eventId:'',logParserId:0,eventName:'',eventDescription:'',severity:'',obelusId:'',eventFields:''};

	self.eventEventTemplateForm = {id:0,templateName:'',eventName:'',evnetFields:'',eventDescription:'',obelusId:'',severity:'',logParserId:0}

	$scope.select2Fields = [];

	$scope.showCreateTemplateForm = function(){
		self.eventEventTemplateForm = {id:0,templateName:'',eventName:'',evnetFields:'',eventDescription:'',obelusId:'',severity:'',logParserId:0}
		$("#create-events-template").modal();
	}

	$scope.openEventsTab = function(tabName){
		$scope.eventsTab = tabName;
		if($scope.eventsTab === 'Events'){
			$scope.showEvents(self.eventForm.logParserId);
		}else{

			$("#editEvent").hide();
			$("#deleteEvent").hide();
			$scope.showEventTemplates(self.eventForm.logParserId);
		}
	}




	$scope.showCreateEventForm = function(id){
		self.eventForm = {id:0,eventId:'',logParserId:id,eventName:'',eventDescription:'',severity:'',obelusId:'',eventFields:''};
		self.getFieldsBasedOnLogDevice();



		$("#create-events").modal();
	}

	$scope.showEventTemplates = function(id){
		eventService.showEventTemplates(id).then(function (response) {
			self.eventMappings = response.data;

			self.eventForm.logParserId = id;
			$scope.showEventsButton = false;
			$scope.showEditButton = false;
			self.loadAgGridForEventsTemplate(response.data);
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	$scope.showEvents = function(id){
		
		eventService.getEventMappings(id).then(function (response) {
			self.eventMappings = response.data;
			$scope.eventsTab = "Events";
			$scope.templateUrl = "showEvents.html";
			self.eventForm.logParserId = id;
			$scope.showEventsButton = false;
			$scope.showEditButton = false;
			$scope.showViewDetails = false;
			
			//$scope.showEventsButton = true;
			self.loadAgGridForEventsMappings(self.eventMappings);
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});


	}
	$scope.obelusIds = [];

	self.getObelusTypes = function(){
		eventService.getAllEvents().then(function (response) {
			for(i=0;i<response.data.custom.length;i++){
				if(response.data.custom[i].type == 'Events'){
					$scope.obelusIds.push(response.data.custom[i]);
				}
			}

		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	self.getObelusTypes();

	$scope.saveEvents = function(){

		var tempFields = [];
		for(var i=0;i<$scope.eventFields.name.length;i++){
			tempFields.push($scope.eventFields.name[i].name);
		}

		self.eventForm.eventFields = tempFields.join(",");

		var tempObleusId = self.eventForm.obelusId.obelusTypeId;

		self.eventForm.obelusId = tempObleusId;
		eventService.saveEventMappings(self.eventForm).then(function (response) {
			if(response.data.status){
				$scope.alertMessagaesFileUpload = [];
				$scope.alertMessagaesFileUpload.push({type:'success',msg: "Event Creation was successful"});
				$("#create-events").modal('hide');
				$scope.showEvents(self.eventForm.logParserId)
				$timeout(function(){
					$scope.alertMessagaesFileUpload = [];
				},3000);
			}


		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	$scope.saveEventTemplates = function(){

		var tempFields = [];
		for(var i=0;i<$scope.eventFields.name.length;i++){
			tempFields.push($scope.eventFields.name[i].name);
		}


		self.eventEventTemplateForm.evnetFields = tempFields.join(",");


		var tempObleusId = self.eventEventTemplateForm.obelusId.obelusTypeId;

		var eventName =  self.eventEventTemplateForm.eventName.name;

		var desc = self.eventEventTemplateForm.eventDescription.name;

		self.eventEventTemplateForm.eventDescription = desc;

		self.eventEventTemplateForm.eventName = eventName;
		self.eventEventTemplateForm.obelusId = tempObleusId;
		self.eventEventTemplateForm.logParserId = self.eventForm.logParserId;

		eventService.saveEventTemplates(self.eventEventTemplateForm).then(function (response) {
			if(response.data.status){
				$scope.alertMessagaesFileUpload = [];
				$scope.alertMessagaesFileUpload.push({type:'success',msg: "Event Creation was successful"});
				$("#create-events-template").modal('hide');
				$scope.showEventTemplates(self.eventForm.logParserId)
				$timeout(function(){
					$scope.alertMessagaesFileUpload = [];
				},3000);
			}


		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}




	self.loadAgGridForEventsTemplate = function(data){

		$("#editEventTemplate").hide();
		$("#deleteEventTemplate").hide();

		var cols = [
			{headerName: "Template Name",field: "templateName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Event Mapping Field",field: "eventName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Description Mapping",field: "eventDescription",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
			{headerName: "severity",field: "severity",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
			{headerName: "obelusId",field: "obelusId",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}}

			]

		$timeout(function(){


			self.eventsTemplatesOptions = {
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
					columnDefs: cols,
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
					rowData: data,
					rowSelection: 'multiple',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onEventTemplateSelectChange,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}

			$("#event-templates").empty();

			$("#event-templates").css("height",$(window).height()-250+"px");

			var eGridDiv =  document.querySelector('#event-templates');
			new agGrid.Grid(eGridDiv, self.eventsTemplatesOptions );
		},1000);

	}

	self.deleteEventRecords = [];

	$scope.showEditTemplateForm = function(){
		self.eventEventTemplateForm = {id:0,templateName:'',eventName:'',evnetFields:'',eventDescription:'',obelusId:'',severity:'',logParserId:0}
		self.eventEventTemplateForm = angular.copy(self.deleteEventRecords[0]);



		for(var i=0;i<self.eventEventTemplateForm.evnetFields.split(",").length;i++){
			$scope.eventFields.name.push({name:self.eventEventTemplateForm.evnetFields.split(",")[i]});
		}

		var tempobelusId = self.eventEventTemplateForm.obelusId;
		var eventname = self.eventEventTemplateForm.eventName;
		var eventDescription = self.eventEventTemplateForm.eventDescription;

		self.eventEventTemplateForm.obelusId = {obelusTypeId:tempobelusId}
		self.eventEventTemplateForm.eventName = {name:eventname}
		self.eventEventTemplateForm.eventDescription = {name:eventDescription}
		$("#create-events-template").modal();
	}





	self.onEventTemplateSelectChange = function(){
		$("#editEventTemplate").hide();
		$("#deleteEventTemplate").hide();

		self.deleteEventRecords = (angular.copy(self.eventsTemplatesOptions.api.getSelectedRows()));
		if(self.eventsTemplatesOptions.api.getSelectedRows().length>1){
			$("#editEventTemplate").hide();
			$("#deleteEventTemplate").show();
		}if(self.eventsTemplatesOptions.api.getSelectedRows().length==1){
			$("#editEventTemplate").show();
			$("#deleteEventTemplate").show();
		}
	}

	self.loadAgGridForEventsMappings = function(data){
		var cols = [
			{headerName: "Event Name",field: "eventName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "Description",field: "eventDescription",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			{headerName: "eventId",field: "eventId",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
			{headerName: "severity",field: "severity",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
			{headerName: "obelusId",field: "obelusId",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}}

			]

		$timeout(function(){


			self.EventsMappingAgGrid = {
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
					columnDefs: cols,
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
					rowData: data,
					rowSelection: 'multiple',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onEventSelectChange,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}

			$("#events").empty();

			$("#events").css("height",$(window).height()-250+"px");

			var eGridDiv =  document.querySelector('#events');
			new agGrid.Grid(eGridDiv, self.EventsMappingAgGrid );
		},1000);

	}


	$scope.goBack = function(){
		$scope.templateUrl = "viewParsers.html";
		self.loadAgGrid();
		$scope.importLogs = false;
		$scope.showHomeButton = true;
		$scope.showBackButton = false;
		$scope.showEditButton = false;
		$scope.eventsTab = "";
		$scope.showEventsButton = false;
	}

	//parserType

	$scope.creatNewParser = function(){
		$scope.templateUrl = "newPraser.html";
		$("#viewButton").hide();
		$("#deleteButton").hide();
		$scope.importLogs = true;
		$scope.showHomeButton = false;
		$scope.showBackButton = true;
		self.logparser = {id:0,parserName:'',parserDesc:'',logDevice:'',logType:'',parserType:'',mappingFields : '',logMessage:'',condition:'',delimterType:'',quoteChar:'',escpaeChar:''}
		$scope.logMessages = [];
		$scope.unMappedLogFields = [];
		$scope.actualValue =angular.copy("");

		$("#logMessage").find("em").remove();
		$("#logMessage").text('');
		$scope.allEvents = [];
		$scope.matchedEvents = [];
		$scope.nonMathcedMessages = [];
		$scope.patterns = [];
		$scope.startIndexArr = [];
		$scope.actualValue = "";
		$scope.fieldData.logDevice = "";
		$scope.fieldData.logType = "";
		$scope.regexField = "";
		$scope.patterns = [];
		$scope.allEvents = [];
		$scope.matchedEvents = [];
		$scope.nonMathcedMessages = [];
		$scope.startIndexArr= [];
		var data = '{"group": {"operator": "AND","rules": []}}';
		$scope.filter = JSON.parse(data);
	}

	var data = '{"group": {"operator": "AND","rules": []}}';
	$scope.filter = JSON.parse(data);

	$scope.eventContext = $scope;

	$scope.logFiles ;

	$scope.openImportLogsModal = function(){
		$("#import-logs").modal();
		$('input[type="file"]').val("");
	}


	$scope.uploadFile = function() {

		var file = $scope.logFiles;

		console.log('file is ' );
		console.dir(file);
		var fd = new FormData();
		fd.append('file', file);

		$http.post("/siem-core/user/custom-patterns/upload", fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).then(function (response) {

			if(self.logparser.parserType === 'json'){
			    if(response.data.length>0){
			        var tempData = JSON.parse(response.data[0]);
			        $scope.messageFields = Object.keys(tempData);
			    }
			}else{
			    $scope.logMessages = response.data;
			}
			$("#import-logs").modal('hide')
		}, function (error) {
			$scope.status = 'Unable to load file data: ' + error.message;
			$scope.alertMessagaesFileUpload = [];
			$scope.alertMessagaesFileUpload.push({type:'danger',msg: error.data.data});
			$timeout(function(){
				$scope.alertMessagaesFileUpload = [];
			},4000);
		});

	};



	self.loadPermissions = function(){

		fieldExtractorFactory.loadPermissions().then(function (response) {
			if(response.data.indexOf("manage field extraction rules")!=-1){
				self.canGenerateCustomPatterns = true;
				self.canSaveCustomPatterns = true;

				fieldExtractorFactory.getLogDevices().then(function(response) {
					$scope.logDevices = response.data;
					//$scope.fieldData.logType = $scope.logTypes[0];
					//self.getDataBasedOnLogType();

				}, function(err) {
					console.log(err);
				});

			}else{
				alert("No Permission To View Page");
				$scope.showHomeButton = false;
			}



		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

	}
	$scope.patternDetails = [];

	$scope.viewDetails = function(id){

		$scope.patternDetails = [];
		$scope.showHomeButton = false;
		$scope.showEditButton = true;
		$scope.showBackButton = true;
		$scope.showEventsButton = true;

		for(var i=0;i<self.parserDetails.length;i++){
			if(self.parserDetails[i].id === id){
				$scope.templateUrl = "viewParserInformation.html";
				$("#viewButton").hide();
				$("#deleteButton").hide();
				$scope.fieldData.logDevice = self.parserDetails[i].logDevice;
				self.getDataBasedOnLogDevice();
				self.logparser.id = self.parserDetails[i].id;
				self.logparser.parserName = self.parserDetails[i].ruleName;
				self.logparser.parserDesc = self.parserDetails[i].parserDesc;
				$scope.fieldData.logType = self.parserDetails[i].logType;
				self.logparser.parserType = self.parserDetails[i].logParserType;

				self.getDataBasedOnLogType();

				$scope.editCondition = self.parserDetails[i].condition;
				$scope.unMappedLogFields =  angular.copy(JSON.parse(self.parserDetails[i].mappingFields));
				for(var j=0;j<$scope.unMappedLogFields.length;j++){
					if($scope.unMappedLogFields[j].parser){
						$scope.patternDetails.push({field:$scope.unMappedLogFields[j].field,pattern:$scope.unMappedLogFields[j].parser})
						//$scope.regexField = $scope.unMappedLogFields[i].field;

					}
				}

				break;
			}
		}
	}

	$scope.addNewMapping = function(){
		$scope.unMappedLogFields.push({field:'',pattern:'','type':'mapping_field',mappedField:''});
	}

	$scope.deleteParser = function(id){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete parser',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						for(var i=0;i<self.parserDetails.length;i++){
							if(self.parserDetails[i].id === id){
								self.logparser.logDevice = self.parserDetails[i].logDevice;
								self.getDataBasedOnLogDevice();

								self.logparser.id = self.parserDetails[i].id;
								self.logparser.parserName = self.parserDetails[i].ruleName;

								self.logparser.logType = self.parserDetails[i].logType;
								self.logparser.parserType = self.parserDetails[i].logParserType;
								$scope.startIndexArr = JSON.parse(self.parserDetails[i].regexDetails);
								$scope.patterns = JSON.parse(self.parserDetails[i].patterns);


								fieldExtractorFactory.deleteParser(self.logparser).then(function(response) {
									if(response.status === 200){
										alert("deleted");
										self.loadParserDetails();
										self.goBack();
									}

								},function(error){

									if(error.status === 403){
										alert(error.data.data);

									}else{
										alert(error.data.data);

									}


									$timeout(function(){
										self.alertMessagaes = [];
									},3000);
								});
								self.allToggle = false;
								$("#deviceTypes").prop('checked',false);
								return true; 
							}
						}
					}

				},
				close: function(scope, button){

				}
			}
		});
	}








	$scope.editForDisplay = function(id){

		for(var i=0;i<self.parserDetails.length;i++){
			if(self.parserDetails[i].id === id){

				$scope.fieldData.logDevice = self.parserDetails[i].logDevice;
				self.getDataBasedOnLogDevice();

				self.logparser.id = self.parserDetails[i].id;
				self.logparser.parserName = self.parserDetails[i].ruleName;

				$scope.fieldData.logType = self.parserDetails[i].logType;
				self.logparser.parserType = self.parserDetails[i].logParserType;
				var regexDetails = JSON.parse(self.parserDetails[i].regexDetails);
				var patternDetails = JSON.parse(self.parserDetails[i].patterns);
				for(var k=0;k<regexDetails.length;k++){
					$scope.startIndexArr.push(regexDetails[k]);
				}
				for(var l=0;l<patternDetails.length;l++){
					$scope.patterns.push(patternDetails[l]);
				}
				//$scope.startIndexArr = angular.copy(JSON.parse(self.parserDetails[i].regexDetails));
				//$scope.patternJson = angular.copy(JSON.parse(self.parserDetails[i].regexDetails));
				//$scope.patterns = angular.copy(JSON.parse(self.parserDetails[i].patterns));



				$scope.unMappedLogFields =  JSON.parse(self.parserDetails[i].mappingFields);
				for(var j=0;j<$scope.unMappedLogFields.length;j++){
					if($scope.unMappedLogFields[j].parser){
						$scope.patternDetails.push({field:$scope.unMappedLogFields[j].field,pattern:$scope.unMappedLogFields[j].parser})
						$scope.regexField = angular.copy($scope.unMappedLogFields[j].field);
						$scope.selectedMessage = angular.copy(JSON.parse(self.parserDetails[i].logMessage))
						$scope.actualValue = ($scope.selectedMessage[$scope.regexField]);
					}
				}
				if(self.parserDetails[i].actualCondition){

					$scope.filter = JSON.parse(self.parserDetails[i].actualCondition);
				}

				$scope.importLogs = true;

				//$scope.lookupFieldsDetails = [];
				$scope.templateUrl = "newPraser.html";	

				break;
			}
		}
	}


	self.getDataBasedOnLogDevice = function(){

		$scope.logType = [];

		fieldExtractorFactory.getLogTypes($scope.fieldData.logDevice).then(function(response) {
			$scope.logType = angular.copy(response.data);
			self.getFieldsBasedOnLogDevice();


		}, function(err) {
			console.log(err);
		});
	}



	self.getFieldsBasedOnLogDevice = function(){

		$scope.logFields = [];

		fieldExtractorFactory.getLogFields($scope.fieldData.logDevice).then(function(response) {

			$scope.logFields = Array.from(new Set(response.data))
			for(var i=0;i<$scope.logFields.length;i++){
				$scope.select2Fields.push({name:$scope.logFields[i]});
			}

			$scope.messageFields = $scope.logFields;
		}, function(err) {
			console.log(err);
		});
	}




	$scope.patterns = [];

	var objRegExp = /^[a-zA-Z0-9_]+$/;
//	rangy.init();
	var restrictedFieldNames = ['and','or','not','logtype','hosttype','formatid','hostname'];  
	var fieldId =0;
	$scope.wizards = ["typeOfFile","parserType","selectMessages","selectFileds","save"];

	$scope.tabName = "";

	$scope.wizardType = $scope.wizards[0] ;
	$scope.nextWizard = $scope.wizards[1];
	$scope.currentStep = 0;
	var delimitRegexp = /([^\d+\w+\s+\t\n])/;  
	self.selectedRow = 0;

	$scope.saveDetails = function(){
		$scope.data = {'logType':$scope.fieldData.logType,'pattern':$scope.pattern};
		fieldExtractorFactory.saveDetails($scope.data).then(function(response) {
			alert("saved");
		}, function(err) {
			console.log(err);
		});
	}

	$scope.openTab = function(tabName){
		$scope.tabName = tabName;
	}

	self.parserDetails = [];

	self.loadParserDetails = function(){
		fieldExtractorFactory.getParser().then(function(response) {
			self.parserDetails = response.data;
			self.loadAgGrid();
		}, function(err) {
			console.log(err);
		});
	}

	self.lookupDetails = [];

	self.loadLookupTables = function(){

		lookupFactory.loadLookupDetails().then(function(response) {
			self.lookupDetails = response.data;
		}, function(err) {
			console.log(err);
		});

	}

	$scope.currentLookupFields = [];
	$scope.currentLookUp = {};

	self.onSelectedLookup = function(data){
		$scope.currentLookupFields = data.fields.split(",");
		$scope.currentLookUp = data;
	}
	$scope.deleteLookupFields = function(index){

		$scope.lookupFieldsDetails.splice(index,1);
	}


	$scope.lookupFieldsDetails = [];



	$scope.addLooupFields = function(){
		$scope.lookupFieldsDetails.push({field:'',lookupField:''});

	}

	$scope.init = function(){

		self.loadPermissions();
		self.loadParserDetails();
		self.loadLookupTables();


	}



	$scope.currentMessageKeys = [];

	$scope.selectMessage = function(message){

		if(self.logparser.parserType === 'json'){
			$scope.selectedMessage = JSON.parse(message);


		}else{
			$scope.selectedMessage = message;	
		}



	}

	$scope.navigateToAotherWizard = function(wizardName){
		if(self.selectedRow==0){
			alert("Please Select Atleast one message");
			return false;
		}
		$scope.wizardType = $scope.wizards[$scope.currentStep+1];
		if($scope.wizardType==='selectFileds'){
			$scope.deleteAllSelections();
		}
		if($scope.wizardType==='save'){
			var tempvalues = [];
			for(var i=0;i<$scope.startIndexArr.length;i++){
				tempvalues.push($scope.startIndexArr[i].fieldname);
			}
			$scope.fields = tempvalues.join(',');
			$scope.sampleEvent = document.getElementById('logMessage').innerHTML;
		}
		$scope.selectedMessage = $scope.logMessages[self.selectedRow];

		$scope.currentStep++;

	}

	$scope.uploadFiles = function(){


		$("#Upload-modal").modal();

	}

	function highlight() {
		highlighter.highlightSelection('highlight');
		var selTxt = rangy.getSelection();

		rangy.getSelection().removeAllRanges();
	}

	$scope.showSelectedText = function() {

		var range = getFirstRange();

		$scope.actualValue  = $("#logMessage").text().trim()

		$scope.selectedText =  $scope.getSelectionText();
		if(range && range.toString().trim().length > 0){
			var startIndex = getCharacterOffsetWithin(range,document.getElementById('logMessage'));
			var selTxt = range.toString();

			var startPos = startIndex+"_"+selTxt;
			if($scope.startIndexArr.indexOf(startPos) < 0){
				var parentEMNode = jQuery(rangy.getSelection().anchorNode).parent('em');
				if(jQuery(parentEMNode).hasClass("selectedInnerLog")){
					alert('This Selection is not allowed as it is inside another inner selection');	//No I18N
					return;
				}
				fieldId++;
				changePrevSelectionClass();

				var el = document.createElement("em");
				el.className = "currentLog";
				if(jQuery(parentEMNode).hasClass("selectedLog")){
					jQuery(el).addClass("selectedInnerLog");
				}

				el.id = "em"+fieldId;
				range.surroundContents(el);
				var suffixValues = getPrefixName(selTxt,startIndex);
				var prefixValues = [];
				var suffixTempValues = [];

				prefixValues.push({"dataType":"NA","prefix":"Ignore","value" : "Ignore"});
				suffixTempValues.push({"dataType":"NA","suffix":"Ignore","value" : "Ignore"});

				for(var i=0;i<suffixValues.prefix.length;i++){
					if(suffixValues.prefix[i]){
						if(suffixValues.prefix[i].indexOf("SPACE")!=-1){
							prefixValues.push({"dataType":"Static","prefix":suffixValues.prefix[i],"value" : " "});
						}else{
							prefixValues.push({"dataType":"Static","prefix":suffixValues.prefix[i],"value" : suffixValues.prefix[i]});
						}
					}

				}
				for(var i=0;i<suffixValues.suffix.length;i++){
					if(suffixValues.suffix[i]){
						if(suffixValues.suffix[i].indexOf("SPACE")!=-1){
							suffixTempValues.push({"dataType":"Static","suffix":suffixValues.suffix[i],"value" : " "});
						}else{
							suffixTempValues.push({"dataType":"Static","suffix":suffixValues.suffix[i],"value" : suffixValues.suffix[i]});
						}

					}

				}
				//prefixValues.push({"dataType":"dynamic","prefix":suffixValues.prefix[suffixValues.prefix.length-1]});

				//suffixTempValues.push({"dataType":"dynamic","suffix":suffixValues.suffix[suffixValues.suffix.length-1]});

				$scope.startIndexArr.push({"fieldId":fieldId,"selTxt":selTxt,"startIndex":startIndex,"prefixValues": prefixValues,"suffixValues":suffixTempValues});
			}

		}
	};



	$scope.deleteAllSelections = function(){

		for(var i=0;i<$scope.startIndexArr.length;i++){

			var id = $scope.startIndexArr[i].fieldId

			var innerHtmlData = jQuery('#em'+id).html();
			var innerElm = jQuery('#em'+id).find("em");
			jQuery('#em'+id).replaceWith(innerHtmlData);
			for(var i = 0;i < innerElm.length;i++){
				jQuery("#"+innerElm[i].id).removeClass("selectedInnerLog").addClass("selectedLog");
			}
		}

		$scope.startIndexArr = [];



	}

	$scope.deleteCurrentSelection = function(index){
		var id = $scope.startIndexArr[index].fieldId
		if(index > -1){
			$scope.startIndexArr.splice(index, 1);
		}




		var innerHtmlData = jQuery('#em'+id).html();
		var innerElm = jQuery('#em'+id).find("em");
		jQuery('#em'+id).replaceWith(innerHtmlData);
		for(var i = 0;i < innerElm.length;i++){
			jQuery("#"+innerElm[i].id).removeClass("selectedInnerLog").addClass("selectedLog");
		}


	}

	function getPrefixName(selTxt,startIndex){

		var origprefixStr = (startIndex > 0)?$scope.actualValue.substring(0, startIndex):"";
		var prefixLen = origprefixStr.length;
		var spacePos = origprefixStr.lastIndexOf(" ");
		var tabPos = origprefixStr.lastIndexOf("\t");
		var newLinePos = origprefixStr.lastIndexOf("\n");
		var spacePos = Math.max(spacePos,tabPos,newLinePos);

		var prefixStr = "";
		var prefixStr2;
		if(origprefixStr.length > 0){
			if(spacePos > -1){
				var startPos = (spacePos == origprefixStr.length-1)?spacePos:spacePos+1;

				var	prefixStr = origprefixStr.substring(startPos,origprefixStr.length);
				if(prefixStr == ' ' || prefixStr == '\t' || prefixStr == '\n'){
					prefixStr = (prefixStr == " ")?"#SPACE#":(prefixStr == "\t")?"\\t":(prefixStr == "\n")?"\\n":prefixStr;  //No I18N
					var neworigprefixStr = origprefixStr.substring(0,startPos);

					//prefixStr2 = getRegexBasedDelimitterStr(neworigprefixStr,true)+prefixStr;
					prefixStr2 = getRegexBasedDelimitterStr(neworigprefixStr,true);

				}
			} else {
				prefixStr = getRegexBasedDelimitterStr(origprefixStr,true);

			}
		}

		var origsuffixStr = (startIndex+selTxt.length < $scope.actualValue.length)?$scope.actualValue.substring(startIndex+selTxt.length,$scope.actualValue.length):"";
		var suffixLen = origsuffixStr.length;
		spacePos = (spacePos = origsuffixStr.indexOf(" ")) < 0? suffixLen:spacePos;
		var tabPos = (tabPos = (origsuffixStr.indexOf("\t"))) < 0?suffixLen:tabPos;
		var newLinePos = (newLinePos = (origsuffixStr.indexOf("\n"))) < 0?suffixLen:newLinePos;
		spacePos = Math.min(spacePos,tabPos,newLinePos);
		var suffixStr = "";
		var suffixStr2;
		if(suffixLen > -1) {
			if(spacePos < origsuffixStr.length){
				var endPos = (spacePos == 0)?spacePos+1:spacePos;
				suffixStr = origsuffixStr.substring(0,endPos);
				if(suffixStr == ' ' || suffixStr == '\t' || suffixStr == '\n') {
					//suffixStr = '#SPACE#';	//No I18N
					suffixStr = (suffixStr == " ")?"#SPACE#":(suffixStr == "\t")?"\\t":(suffixStr == "\n")?"\\n":suffixStr; //No I18N
					var neworigsuffixStr = origsuffixStr.substring(endPos);
					//suffixStr2 = suffixStr+getRegexBasedDelimitterStr(neworigsuffixStr,false);
					suffixStr2 = getRegexBasedDelimitterStr(neworigsuffixStr,false);
				}
			} else {
				suffixStr = getRegexBasedDelimitterStr(origsuffixStr,false);
			}
		}
		var prefixValues = [prefixStr,prefixStr2];

		var suffixValues = [suffixStr,suffixStr2];

		var obj = new Object();
		obj.prefix = prefixValues;
		obj.suffix = suffixValues;

		return obj;
	}


	function getFirstRange() {
		var sel = rangy.getSelection();
		return sel.rangeCount ? sel.getRangeAt(0) : null;
	}

	function getCharacterOffsetWithin(range, node) {
		var nodeRange = rangy.createRange();
		nodeRange.selectNodeContents(node);
		nodeRange.setEnd(range.startContainer, range.startOffset);

		var charCount = 0, textNodes = nodeRange.getNodes([3]);
		for (var i = 0, len = textNodes.length; i < len; ++i) {
			if (textNodes[i] == range.startContainer) {
				charCount += range.startOffset;
			} else {
				charCount += textNodes[i].length;
			}
		}
		return charCount;
	}

	$scope.getSelectionText = function() {
		var text = "";
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			text = document.selection.createRange().text;
		}
		return text;
	};
	$scope.navigateToPerviousWizard = function(wizardName){
		$scope.wizardType = $scope.wizards[$scope.currentStep-1];
		$scope.currentStep--;
	}

	$scope.init();


	$scope.unMappedLogFields = [];


	$("tr").click(function(){
		$(this).addClass('selected').siblings().removeClass('selected');   
	});

	$scope.messageFields = [];

	$scope.changePraserType = function(){
		if($scope.fieldData.logType === ""){
			alert("select logtype");
			self.logparser.parserType  = "";
			return false;
		}
		if(self.logparser.parserType === "regex"){
			$scope.regexField = "message";
		}



		$scope.messageFields = [];
		$scope.selectedMessage = {};
		$scope.unMappedLogFields = [];
	}

	self.highlight = function(index,message){



		$scope.messageFields = [];
		$scope.selectedMessage = {};
		$scope.unMappedLogFields = [];

		$scope.actualValue = angular.copy("");
		$("#logMessage").find("em").remove();
		$("#logMessage").text('');
		$scope.allEvents = [];
		$scope.matchedEvents = [];
		$scope.nonMathcedMessages = [];
		$scope.patterns = [];
		$scope.startIndexArr = [];

		if(self.logparser.parserType===''){
			alert("Select Parser Type");
			return false;
		}

		if(self.logparser.parserType === 'json'){

			self.selectedRow = index;

			try { 
				$scope.selectedMessage = JSON.parse(message); 
				$scope.messageFields = Object.keys($scope.selectedMessage);

				$("#logMessage").text($scope.selectedMessage[$scope.regexField]);

				$scope.startIndexArr = [];


			} catch(e) { 
				alert("invalid json");
				return false;

			}


		}else if(self.logparser.parserType === 'delimter'){

			if(self.logparser.delimterType === ""){
				alert("select delimter");
				return false;
			}
			var sperator = "";

			if(self.logparser.delimterType === "Comma"){
				sperator = ",";
			}

			if(self.logparser.delimterType === "Tab"){
				sperator = "\t";
			}
			if(self.logparser.delimterType === "Space"){
				sperator = " ";
			}
			if(self.logparser.delimterType === "Pipe"){
				sperator = "|";
			}
			if(self.logparser.delimterType === "Other"){
				sperator = self.logparser.other;
			}
			var escpaeChar = '""';
			var quouteChar = '""';
			if(self.logparser.escpaeChar!=""){
				escpaeChar = self.logparser.escpaeChar;
			}


			if(self.logparser.quoteChar!=""){
				quouteChar = self.logparser.quoteCharChar;
			}


			Papa.parse(message, {
				delimiter: sperator,
				quoteChar: quouteChar,
				escapeChar: escpaeChar,
				complete: function(results) {
					var data = results.data[0];
					for(var i=0;i<data.length;i++){
						$scope.unMappedLogFields.push({field:'',pattern:'','type':'mapping_field',value : data[i]});
					}
				}
			});

			self.selectedRow = index;


		}else{
			self.selectedRow = index;
			$scope.selectedMessage = message; 
			$scope.actualValue = message;
		}




	}



	$scope.regexField= "";



	$scope.showValuesForKeys = function(value){

		$scope.actualValue = angular.copy("");

		$("#logMessage").find("em").remove();
		$("#logMessage").text('');
		$scope.allEvents = [];
		$scope.matchedEvents = [];
		$scope.nonMathcedMessages = [];
		$scope.patterns = [];
		$scope.startIndexArr = [];

		$("#logMessage").text($scope.selectedMessage[value])

		$scope.regexField = value;

	}

	$scope.deleteKeys = function(index){

		$scope.unMappedLogFields.splice(index,1)

	}

	$scope.hasDuplicate = function(data) {
		for (var i = 0; i < data.length; i++) {
			for (var x = i + 1; x < data.length; x++) {
				if (data[i].fieldname == data[x].fieldname) {
					return true;
				}
			}
		}
		return false;
	};

	$scope.patternJson = [];

	$scope.createPatterns = function(){
		$scope.patternJson =  [];
		var tempValues = [];
		for(var i=0;i<$scope.startIndexArr.length;i++){
			tempValues.push($scope.startIndexArr[i].fieldId);
		}
		for(var i=0;i<$scope.startIndexArr.length;i++){
			if(!$scope.startIndexArr[i].fieldname &&  $scope.startIndexArr[i].fieldname===""){
				alert($scope.startIndexArr[i].fieldId + "is not empty");
				return false;
			}
			if(!objRegExp.test($scope.startIndexArr[i].fieldname)){
				alert( " FieldName is not an alphanumeric for the selection " + " " + $scope.startIndexArr[i].fieldId);
				return false;
			}
			if(restrictedFieldNames.indexOf($scope.startIndexArr[i].fieldname.toLowerCase()) > -1){
				alert('Boolean Operator keywords (AND, OR, NOT) are not allowed as a FieldName.');   
				return false;
			}

			if($scope.hasDuplicate($scope.startIndexArr)){
				alert('Duplicate Field Names Found');   
				return false;
			}

			var fields = [];
			loader($("body"));
			var jsonObject = new Object();
			jsonObject.LOG = $("#logMessage").text().trim();
			for(var i=0;i<$scope.startIndexArr.length;i++){
				if($scope.startIndexArr[i].prefix.split("_")[0]==="NA" && $scope.startIndexArr[i].suffix.split("_")[0]==="NA"){
					fields.push({
						"FNAME":$scope.startIndexArr[i].fieldname,
						"EXTRACTION":$scope.startIndexArr[i].selTxt,
						"START":$scope.startIndexArr[i].startIndex.toString(),
						"MUST":false
					})
				}
				if($scope.startIndexArr[i].prefix.split("_")[0]!="NA" && $scope.startIndexArr[i].suffix.split("_")[0]==="NA"){
					fields.push({
						"FNAME":$scope.startIndexArr[i].fieldname,
						"EXTRACTION":$scope.startIndexArr[i].selTxt,
						"START":$scope.startIndexArr[i].startIndex.toString(),
						"PREFIX":$scope.startIndexArr[i].prefix.split("_")[1],   
						"PREFIX_OPTION":$scope.startIndexArr[i].prefix.split("_")[0],
						"MUST":false
					})
				}
				if($scope.startIndexArr[i].prefix.split("_")[0]==="NA" && $scope.startIndexArr[i].suffix.split("_")[0]!="NA"){
					fields.push({
						"FNAME":$scope.startIndexArr[i].fieldname,
						"EXTRACTION":$scope.startIndexArr[i].selTxt,
						"START":$scope.startIndexArr[i].startIndex.toString(),
						"SUFFIX_OPTION":$scope.startIndexArr[i].suffix.split("_")[0],
						"SUFFIX":$scope.startIndexArr[i].suffix.split("_")[1],
						"MUST":false
					})
				}
				if($scope.startIndexArr[i].prefix.split("_")[0]!="NA" && $scope.startIndexArr[i].suffix.split("_")[0]!="NA"){
					fields.push({
						"FNAME":$scope.startIndexArr[i].fieldname,
						"EXTRACTION":$scope.startIndexArr[i].selTxt,
						"START":$scope.startIndexArr[i].startIndex.toString(),
						"PREFIX":$scope.startIndexArr[i].prefix.split("_")[1],   
						"PREFIX_OPTION":$scope.startIndexArr[i].prefix.split("_")[0],
						"SUFFIX_OPTION":$scope.startIndexArr[i].suffix.split("_")[0],
						"SUFFIX":$scope.startIndexArr[i].suffix.split("_")[1],
						"MUST":false
					})
				}

			}
			jsonObject.FIELDS = fields;
			jsonObject.logType = $scope.fieldData.logType;
			jsonObject.logDevice = $scope.fieldData.logDevice;

			angular.copy($scope.startIndexArr, $scope.patternJson);



			var input = encodeURIComponent(JSON.stringify(jsonObject));

			var finalJson = new Object();
			finalJson.logMessage = input;


			fieldExtractorFactory.generateCustomPatterns(finalJson).then(function(response) {
				//$scope.allEvents = response.data.sucessMessages;
				//$scope.matchedEvents = response.data.sucessMessages;
				//$scope.nonMathcedMessages = response.data.failedMessage;
				//if(response.data.failedMessage.length>0){
				//	$scope.allEvents.push(response.data.failedMessage);
				//}


				angular.copy(response.data.patterns, $scope.patterns);


				$scope.tabName = "allEvents";
				unloader($("body"));
			}, function(err) {
				console.log(err);
				unloader($("body"));
			});



		}
	}


	$scope.saveParsers = function(){


		var tempArray = [];

		if(self.logparser.parserType === "json"){
			for(var i=0;i<$scope.unMappedLogFields.length;i++){

				if($scope.unMappedLogFields[i].field && $scope.unMappedLogFields[i].mappedField){
					if($scope.unMappedLogFields[i].field!='' && $scope.unMappedLogFields[i].mappedField!=''){
						tempArray.push($scope.unMappedLogFields[i]);
					}
				}
			}
		}else{
			for(var i=0;i<$scope.unMappedLogFields.length;i++){

				if($scope.unMappedLogFields[i].field){
					if($scope.unMappedLogFields[i].field!=''){
						tempArray.push($scope.unMappedLogFields[i]);
					}
				}
			}
		}



		self.logparser.logDevice =  $scope.fieldData.logDevice;
		self.logparser.logType =  $scope.fieldData.logType;

		if(tempArray.length==0 &&  !$scope.finalPattern){

			alert("Atleast one mapping or Regex Should be provided.");
			return false;
		}

		var isFound = false;
		if($scope.actualValue!= ""){
			for(var i=0;i<tempArray.length;i++){
				if(tempArray[i].field===$scope.regexField && tempArray[i].mappedField!=''){

					tempArray[i]['parser'] = $scope.finalPattern;
					isFound = true;
				}
			}
		}
		if(!isFound){

			tempArray.push({field:$scope.regexField,mapping_field:$scope.regexField,parser:$scope.finalPattern})

		}

		if($scope.finalPattern && $scope.patternJson.length==0){
			alert("Please apply patterns before saving");
			return false;
		}



		if($scope.currentLookUp){
			var object = new Object();
			object[$scope.currentLookUp.name] = $scope.lookupFieldsDetails;
			self.logparser.lookDetails = JSON.stringify(object);
		}


		self.logparser.mappingFields = JSON.stringify(tempArray);
		self.logparser.logMessage = JSON.stringify($scope.selectedMessage);
		self.logparser.regexDetails = JSON.stringify($scope.patternJson);
		self.logparser.actualCondition = JSON.stringify($scope.filter);
		self.logparser.patterns = JSON.stringify($scope.patterns);
		self.logparser.condition = $scope.output;



		fieldExtractorFactory.saveDetails(self.logparser).then(function(response) {
			alert("saveed");
			self.loadParserDetails();
			self.goBack();

		}, function(err) {
			if(err.status === 403){
				alert(err.data.data);
			}
		});



	}

	$scope.timeFilter = "";
	$scope.searchQuery = "NA";

	$scope.filterMessage = function (){

		if($scope.fieldData.logDevice === "" && $scope.fieldData.logType === ""){

			alert("Please Select log device and log type");
			return false;

		}

		$scope.logFields = [];
		$scope.logMessages = []

		fieldExtractorFactory.getMessages($scope.fieldData.logDevice,$scope.fieldData.logType,$scope.fieldData.timeFilter,$scope.fieldData.searchQuery).then(function(response) {
			$scope.logMessages = response.data.messages;
			$scope.logFields = response.data.logFields;

			unloader($("body"));
		}, function(err) {
			unloader($("body"));
			console.log(err);
		});


	}


	$scope.$watch('filter', function (newValue) {
		$scope.json = JSON.stringify(newValue, null, 2);
		$scope.output = computed(newValue.group);
		console.log($scope.output);

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
						if(group.rules[i].condition === "equalsIgnoreCase"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + " " + " equalsIgnoreCase ('" + group.rules[i].data+"')";

						}else if(group.rules[i].condition === "!equalsIgnoreCase") {
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"!"+group.rules[i].field + " " + " equalsIgnoreCase ('" + group.rules[i].data+"')";
						}else if(group.rules[i].condition === "contains"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + " " + " contains  ('" + group.rules[i].data+"')";
						}else if(group.rules[i].condition === "startsWith"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + "  startsWith "  + " ('" + group.rules[i].data+"')";
						}else if(group.rules[i].condition === "endsWith"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + "  startsWith "  + " ('" + group.rules[i].data+"')";
						}else if(group.rules[i].condition === "=="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + " == ('"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "!="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + " != ('"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "ip_range" && group.rules[i].fromIP && group.rules[i].toIP ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"iprange("+group.rules[i].field + " , '"+group.rules[i].fromIP+"','"+group.rules[i].toIP+"')";
						}
						else if(group.rules[i].condition === "time_range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"time_range("+group.rules[i].field + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"range("+group.rules[i].field + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "threat_matcher" && group.rules[i].numberOfSources){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"threat_matcher("+group.rules[i].field + " , '"  + group.rules[i].numberOfSources+"')";
						}
						//range


					}else{
						if(group.rules[i].condition === "equalsIgnoreCase"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field +  ".equalsIgnoreCase('" + group.rules[i].data+"')";

						}else if(group.rules[i].condition === "!equalsIgnoreCase") {
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"!"+group.rules[i].field + ".equalsIgnoreCase('" + group.rules[i].data+"')";
						}else if(group.rules[i].condition === "contains"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field +".contains('" + group.rules[i].data+"')";
						}else if(group.rules[i].condition === "startsWith"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + ".startsWith"  + "('" + group.rules[i].data+"')";
						}else if(group.rules[i].condition === "endsWith"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + ".endsWith"  + "('" + group.rules[i].data+"')";
						}else if(group.rules[i].condition === "=="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + " == ('"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "!="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field + " != ('"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "ip_range" && group.rules[i].fromIP && group.rules[i].toIP ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"iprange("+group.rules[i].field + " , '"+group.rules[i].fromIP+"','"+group.rules[i].toIP+"')";
						}
						else if(group.rules[i].condition === "time_range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"time_range("+group.rules[i].field + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"range("+group.rules[i].field + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "threat_matcher" && group.rules[i].numberOfSources){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"threat_matcher("+group.rules[i].field + " , '"  + group.rules[i].numberOfSources+"')";
						}
						//range


					}
				}

			}
		}

		return str + ")";
	}


	$scope.applyPattern = function(pattern){
		$scope.allEvents = [];
		$scope.matchedEvents = [];
		$scope.nonMathcedMessages = [];

		$scope.finalPattern = pattern;

		var tempMessages = [];

		for(var i=0; i<10;i++){
			if($scope.logMessages[i]){
				tempMessages.push($scope.logMessages[i]);
			}

		}

		var jsonObject = new Object();
		jsonObject.logType = $scope.fieldData.logType;
		jsonObject.logDevice = $scope.fieldData.logDevice;
		jsonObject.fieldName = $scope.regexField;
		jsonObject.pattern = pattern;
		jsonObject.messages = tempMessages;
		fieldExtractorFactory.applyPattern(jsonObject).then(function(response) {
			$scope.allEvents = response.data.sucessMessages;
			$scope.matchedEvents = response.data.sucessMessages;
			$scope.nonMathcedMessages = response.data.failedMessage;
			if(response.data.failedMessage.length>0){
				$scope.allEvents.push(response.data.failedMessage);
			}





			$scope.tabName = "allEvents";
			unloader($("body"));
		}, function(err) {
			console.log(err);
			unloader($("body"));
		});

	}

	function fixSpecialChars(matchingStr,isPrefix){
		matchingStr = matchingStr.trim();
		var trueStr = matchingStr;
		var toBeMatched = [' ','\t','\n'];   //No I18N
		var nextIndex = -1;
		var matchingStrLen = matchingStr.length;
		var spaceRegexP = /\s+([^\s+]+)\s+/;
		for(var i=0;i<toBeMatched.length;i++ ){
			nextIndex = matchingStr.indexOf(toBeMatched[i]);
			if(nextIndex > -1 && nextIndex != matchingStrLen-1 && matchingStr.substring(0,nextIndex+1).trim() == toBeMatched[i]){
				var match = spaceRegexP.exec(matchingStr);
			}
			if(nextIndex != -1){
				trueStr = matchingStr.substring(0,nextIndex+1);
			}
		}
		return trueStr;
	}

	$scope.logFields = [];
	self.getDataBasedOnLogType = function(){
		if($scope.fieldData.logType!=''){
			loader($("body"));
			if(!($scope.fieldData.logType === undefined)){
				fieldExtractorFactory.getMessages($scope.fieldData.logDevice,$scope.fieldData.logType,$scope.timeFilter,$scope.searchQuery).then(function(response) {
					$scope.logMessages = response.data.messages;
					$scope.logFields = response.data.logFields
					$scope.actualValue =angular.copy("");
					$("#logMessage").find("em").remove();
					$("#logMessage").text('');
					$scope.allEvents = [];
					$scope.matchedEvents = [];
					$scope.nonMathcedMessages = [];
					$scope.patterns = [];
					$scope.startIndexArr = [];

					$scope.regexField = "";
					unloader($("body"));
				}, function(err) {
					unloader($("body"));
					console.log(err);
				});
			}else{
				unloader($("body"));
			}
		}
	}

	function getRegexBasedDelimitterStr(origStr, isPrefix){
		var matchingStr = origStr;
		if(isPrefix){ matchingStr = origStr.split('').reverse().join('');}
		var matchingStrLen = matchingStr.length;
		var tobeMatched = [' ','\t','\n'];  //No I18N
		var nextIndex = -1;
		for(var i = 0;i < tobeMatched.length;i++){
			//Warning : Super complex logic ahead - For prefix suffix tuning
			var matchingStrCopy = matchingStr;
			var breakNow = false;
			var needsToLoop = false;
			do{
				nextIndex = matchingStrCopy.indexOf(tobeMatched[i]);
				if(nextIndex > -1 && nextIndex != matchingStrCopy.length-1){
					if(tobeMatched[i].indexOf(matchingStrCopy.substring(0,nextIndex+1)) < 0){

						breakNow = true;
						matchingStr = matchingStrCopy.trim();
						nextIndex = matchingStr.length;
						needsToLoop = false;
						break;
					}else{
						matchingStrCopy = matchingStrCopy.substring(0,nextIndex+1).trim();

						needsToLoop = true;
						nextIndex = -1;
					}
				}else{

					needsToLoop = false;
				}
			}while(needsToLoop);
			if(breakNow){
				break;
			}
		}

		//complex logic ends here
		if(nextIndex < 0){
			var match = delimitRegexp.exec(matchingStr);
			//ramprakash-1459 has changed the next if clause
			if(match == null){
				if(matchingStr.trim().length > 0){
					resultStr = matchingStr;
					if(isPrefix){
						resultStr = resultStr.split('').reverse().join('');
					}
					return resultStr;
				}
				else{
					return null;
				}
			}
			if(match.length > 0){
				var specialChar = match[1];
				nextIndex = matchingStr.indexOf(specialChar);
			}
		}
		var resultStr = ""; //No I18N
		//fine tuning prefix/suffix : ramprakash-1459
		if(nextIndex > -1){
			resultStr = matchingStr.substring(0,nextIndex+1);
		}

		resultStr = resultStr.trim();

		if(resultStr.length == 1){
			//if only one special character is returned
			resultStr = fixSpecialChars(matchingStr,isPrefix);
		}

		if(resultStr.indexOf(' ') != -1){
			//exploding resultStr with space and giving the nearest word
			resultStr = resultStr.substring(0,resultStr.indexOf(' '));
		}
		if(isPrefix){
			//reverse in case of prefix String
			resultStr = resultStr.split('').reverse().join('');
		}
		return getReplacedStr(resultStr);
	}

	function getReplacedStr(str){
		if(str.indexOf("\n") > -1){
			str = str.replace("\n","\\n");
		}else if(str.indexOf("\t") > -1){
			str = str.replace("\t","\\t");
		}
		return str;
	}




	self.columnDefs = [
		{headerName: "Name",field: "ruleName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Log Device",field: "logDevice",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Log Type",field: "logType",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		{headerName: "Created By",field: "createdBy",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		{headerName: "Updated By",field: "updatedBy",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		{headerName: "Last Updated",field: "updatedDate",width: 150, valueGetter: function(params) {
			if(params.data != undefined){	    		
				return moment(params.data.updatedDate).format('LLLL');
			}
		},hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		]


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
					rowData: self.parserDetails,
					rowSelection: 'single',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onSelectionChanged,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}

			self.parserId = [];
			$("#extractContent").empty();
			$("#viewButton").hide();
			$("#deleteButton").hide();
			$("#extractContent").css("height",$(window).height()-250+"px");
			if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
				self.eventGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#extractContent');
			new agGrid.Grid(eGridDiv, self.eventGrid );
		},250);
	}

	self.deleteEventRecords = [];

	self.onEventSelectChange = function(){
		$("#editEvent").hide();
		$("#deleteEvent").hide();
		$("#viewButton").hide();
		$("#deleteButton").hide();

		self.deleteEventRecords = (angular.copy(self.EventsMappingAgGrid.api.getSelectedRows()));
		if(self.EventsMappingAgGrid.api.getSelectedRows().length>1){
			$("#editEvent").hide();
			$("#deleteEvent").show();
		}if(self.EventsMappingAgGrid.api.getSelectedRows().length==1){
			$("#editEvent").show();
			$("#deleteEvent").show();
		}
	}

	$scope.editEeventDetails = function(){
		self.eventForm = angular.copy(self.deleteEventRecords[0]);

		$scope.eventFields.name = [];

		for(var i=0;i<self.eventForm.eventFields.split(',').length;i++){
			$scope.eventFields.name.push({name:self.eventForm.eventFields.split(',')[i]});
		}
		for(var i=0;i<$scope.obelusIds.length;i++){
			if($scope.obelusIds[i].obelusTypeId === self.eventForm.obelusId){
				self.eventForm.obelusId = $scope.obelusIds[i];
			}
		}

		$("#create-events").modal();
	}


	$scope.deleteEventTemplates = function(){

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete event template',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						var tempId = [];
						for(var i=0;i<self.deleteEventRecords.length;i++){
							tempId.push(self.deleteEventRecords[i].id)
						}

						eventService.deleteEventTemplates(tempId).then(function (response) {
							if(response.status==200){
								$scope.alertMessagaesFileUpload = [];
								$scope.alertMessagaesFileUpload.push({type:'success',msg: "Event was successfully Deleted."});

								$scope.showEventTemplates(self.eventForm.logParserId)
								$timeout(function(){
									$scope.alertMessagaesFileUpload = [];
								},3000);
							}


						}, function (error) {
							$scope.status = 'Unable to load customer data: ' + error.message;
						});

					}

				},
				close: function(scope, button){

				}
			}
		});
	}

	$scope.deleteEvent = function(){

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete parser',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						var tempId = [];
						for(var i=0;i<self.deleteEventRecords.length;i++){
							tempId.push(self.deleteEventRecords[i].id)
						}

						eventService.deleteEvents(self.eventForm.logParserId,tempId).then(function (response) {
							if(response.status==200){
								$scope.alertMessagaesFileUpload = [];
								$scope.alertMessagaesFileUpload.push({type:'success',msg: "Event was successfully Deleted."});

								$scope.showEvents(self.eventForm.logParserId)
								$timeout(function(){
									$scope.alertMessagaesFileUpload = [];
								},3000);
							}


						}, function (error) {
							$scope.status = 'Unable to load customer data: ' + error.message;
						});

					}

				},
				close: function(scope, button){

				}
			}
		});
	}

	self.onSelectionChanged = function() {
		self.parserId = [];
		$("#viewButton").hide();
		$("#deleteButton").hide();
		self.parserId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.parserId.length > 0){			
			$("#viewButton").show();
			$("#deleteButton").show();
		}
	}


	$(window).resize(function() {
		setTimeout(function() {
			try{
				self.eventGrid.api.sizeColumnsToFit();
				$("#extractContent").css("height",$(window).height()-250+"px");
			}catch(err){}
		}, 500);
	});

}]);

app.directive('parserQueryBuilder', ['$compile','conditionFactory', function ($compile,conditionFactory) {
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
					{ name: 'Equals', value:"equalsIgnoreCase" },
					{ name: 'Not Equals',value:"!equalsIgnoreCase"  },
					{ name: 'Contains',value:"contains"  },
					{ name: 'Starts With',value:"startsWith"  },
					{ name: 'Ends With',value:"endsWith"  },
					{ name: '==',value:"=="  },
					{ name: '!=',value:"!="  }

					];



				scope.logtypes = [];



				scope.addCondition = function (index) {

					if(scope.logtypes.length==0){


						if (typeof scope.parent !== 'undefined'){

							scope.fields = [];
							scope.group['logFileds'] = [];
							for(var i=0;i<scope.parent.messageFields.length;i++){
								scope.group.logFileds.push(scope.parent.messageFields[i].replace(/\./g,"_"));
								scope.fields.push(scope.parent.messageFields[i].replace(/\./g,"_"));
							}

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

JSON.flatten = function (data) {
	var result = {};

	function recurse(cur, prop) {
		if (Object(cur) !== cur) {
			result[prop] = cur;
		} else if (Array.isArray(cur)) {
			for (var i = 0, l = cur.length; i < l; i++)
				recurse(cur[i], prop + "[" + i + "]");
			if (l == 0) result[prop] = [];
		} else {
			var isEmpty = true;
			for (var p in cur) {
				isEmpty = false;
				recurse(cur[p], prop ? prop + "." + p : p);
			}
			if (isEmpty && prop) result[prop] = {};
		}
	}
	recurse(data, "");
	return result;
};
JSON.unflatten = function (data) {
	"use strict";
	if (Object(data) !== data || Array.isArray(data)) return data;
	var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
	resultholder = {};
	for (var p in data) {
		var cur = resultholder,
		prop = "",
		m;
		while (m = regex.exec(p)) {
			cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
			prop = m[2] || m[1];
		}
		cur[prop] = data[p];
	}
	return resultholder[""] || resultholder;
};

//loader = function(document){
//$(document).block({
//message: '<i class="icon-spinner10 spinner"></i>',
//overlayCSS: {
//backgroundColor: '#1B2024',
//opacity: 0.85,
//cursor: 'wait'
//},
//css: {
//border: 0,
//padding: 0,
//backgroundColor: 'none',
//color: '#fff'
//}
//});
//}

//unloader = function(document){
//$(document).unblock();
//}

changePrevSelectionClass = function(){
	//Changing all existing currentLog class to selectedLog class so that the new selection only have currentLog class..
	//As the inner selection have both the classes -- selectedInnerLog & (currentLog or selectedLog), no need to set the selectedClass again
	var prevCurrentLogId = jQuery('.currentLog').attr('id');
	jQuery('#'+prevCurrentLogId).removeClass('currentLog');
	if(jQuery('#'+prevCurrentLogId).attr('class') == ""){
		jQuery('#'+prevCurrentLogId).addClass('selectedLog');
	}
}