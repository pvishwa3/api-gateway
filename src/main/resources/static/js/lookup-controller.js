app.controller("lookupController",['$scope','$timeout','$sessionStorage','$ngConfirm','lookupFactory','eventService','logDevicesFactory','$window','conditionFactory',function($scope,$timeout,$sessionStorage,$ngConfirm,lookupFactory,eventService,logDevicesFactory, $window,conditionFactory){

	var self = this;
	$scope.templateUrl = "viewLookupDetails.html";
	//self.newFeed= {"owner":"","feedName":"","indicatorType":"","feedType":"URL","urlFeedModel":{"url":""},"apiFeedModel":{"url":"","method":"","authenticationType":"","userName":"","password":"","apiKey":""},"fileFeedModel":{"file":"","fileType":""},"taxiiFeedModel":{"discoveryUrl":"","userName":"","password":""},"feedTrustScore":50,"sourceName":"","banner":"","delimiter":"none","startsAtPosition":1,"extractFieldPostion":0,"feedSchedulerStatus":"true","feedScheduler":"0 0/7 * 1/1 * ? *","tags":[],"tlp":"","columnNames":[]};

	self.lookupDetails = {id:0,lookupName:"",lookupDescription:"",lookupFields:"",lookupPrivacy:"",bindingData:"",unBindingData:""}


	self.domainTypeGroup = {id:0,typeName:'',inputFields:'',outputFields:''};

	self.inputFieldsModal = [];
	self.outputFieldsModal = [];

	self.alertMessagaes =[];

	$scope.flag = true;
	$scope.theme = $window.localStorage.getItem("themeType");

	$scope.lookupTableName = {eventName:''};

	$scope.unBindlookupTableName = {eventName:''};

	$scope.showHomeButton = true;
	$scope.showCreateEventButton = false;
	$scope.showUpdateEventButton = false;
	$scope.showAddFieldButton = false;
	$scope.canShowContextButton = true;
	$scope.canShowContextGroupsButton = true;
	$scope.canShowContextGroupsBackButton = false;
	$scope.canShowContextGroupsCreateButton = false;


	self.canDelete = false;
	self.canUpdate = false;
	self.canCreate = false;
	self.canCreateDomainTypeAttribute = false;
	self.canUpdateDomainTypeAttribute = false;
	self.canDeleteDomainTypeAttribute = false;

	 //String ADD_LOOKUP = "Create Lookup";
	    
	  //  String VIEW_LOOKUP = "View Lookup";
	    
	  //  String UPDATE_LOOKUP = "Update Lookup";
	    
	  //  String DELETE_LOOKUP = "Delete Lookup";
	    

	self.loadPermissions = function(){

		loader("body");

		conditionFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("create lookup")!=-1){
				self.canCreate = true;
			}
			if(response.data.indexOf("update lookup")!=-1){
				self.canUpdate = true;
			}
			if(response.data.indexOf("delete lookup")!=-1){
				self.canDelete = true;
			}
			


			unloader("body");




		},function(error){
			unloader("body");
		});
	}


	self.lookupFieldsError = [];

	self.lookupError = [];

	self.fields = [];
	self.lookupFields = [];

	self.addField = function(){
		self.fields.push({field:''})
	}

	self.configureLookup = function(){

		$scope.templateUrl = "lookupConfiguration.html";

	}

	self.configureContextGroups = function(){
		$scope.templateUrl = "lookupConfigureContextGroups.html";
		$scope.canShowContextGroupsButton = false;
		$scope.canShowContextGroupsBackButton = true;
		$scope.canShowContextGroupsCreateButton = true;
		$scope.canShowContextButton = false;
	}

	self.goBack = function(){
		$scope.canShowContextGroupsButton = true;
		$scope.canShowContextGroupsBackButton = false;
		$scope.canShowContextGroupsCreateButton = false;
		$scope.canShowContextButton = true;
		$scope.templateUrl = "viewLookupDetails.html";

	}


	self.createGroup = function(){
		self.domainTypeGroup = {id:0,typeName:'',inputFields:'',outputFields:''};
		self.inputFieldsModal = [];
		self.outputFieldsModal = [];
		$("#configureDomainGroup").modal();
	}

	self.showLookupContent = function(){
		$scope.templateUrl = "viewLookupContents.html";
		lookupFactory.loadLookupContent().then(function(response) {

			$scope.templateUrl = "viewLookupContents.html";
			var columnDefs = [];
			for(var i=0;i<response.data.cols.length;i++){
				columnDefs.push({ field: response.data.cols[i], width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
					filterOptions:['contains'],suppressAndOrCondition:true }});
			}


			var  lookupGrid = {
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

					columnDefs: columnDefs,

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

						defaultToolPanel: 'columns'
					},
					rowData: response.data.data,

					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}

			$("#lookupContent").empty();

			var eGridDiv =  document.querySelector('#lookupContent');


			new agGrid.Grid(eGridDiv, lookupGrid);



		}, function(err) {
			console.log(err);
		});


	}

	self.lookupAttributeDetails = [];



	self.loadLookupTables = function(){

		logDevicesFactory.loadConfigurations().then(function(response) {
			for(var i=0;i<response.data.length;i++){
				var attributes = response.data[i].domainAttributes.split(",");
				for(var j=0;j<attributes.length;j++){
					if(self.lookupAttributeDetails.indexOf(attributes[j])==-1){
						self.lookupAttributeDetails.push(attributes[j]);
					}
				}

				var logFields = response.data[i].logFields.split(",");

				for(var j=0;j<logFields.length;j++){
					if(self.lookupAttributeDetails.indexOf(logFields[j])==-1){
						self.lookupAttributeDetails.push(logFields[j]);
					}
				}

				if(self.lookupAttributeDetails.indexOf(response.data[i].propetyName)==-1){
					self.lookupAttributeDetails.push(response.data[i].propetyName);
				}

			}

		}, function(err) {
			console.log(err);
		});

	}

	self.editLookupGroupDetails = function(data){

		self.domainTypeGroup.id = data.id;
		self.domainTypeGroup.typeName = data.typeName;
		self.inputFieldsModal = data.inputFields.split(",");
		self.outputFieldsModal = data.outputFields.split(",");
		$("#configureDomainGroup").modal();


	}

	self.saveDomainGroup = function(){

		//self.domainTypeGroup = {id:0,typeName:'',inputFields:'',outputFields:''};

		self.domainTypeGroup.inputFields = self.inputFieldsModal.join(',');
		self.domainTypeGroup.outputFields = self.outputFieldsModal.join(',');

		lookupFactory.saveDomainGroup(self.domainTypeGroup).then(function (response) {
			if(response.status === 201){

				self.alertMessagaes.push({ type: 'success', msg: 'Group was Saved Successfully' });

				$("#configureDomainGroup").modal('hide');
				self.init();
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.lookupError.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					if(response.data.error.indexOf("constraint")!=-1 || response.data.error.indexOf("This combition was")!=-1 ){
						self.lookupError.push({ type: 'danger', msg: self.domainTypeGroup.typeName +" should be unique" });
					}

				}
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}


			unloader("body");
		}, function (error) {
			unloader("body");

			if(error.status== 403){
				self.lookupError.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}

			if(error.status== 500){
				self.lookupError.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}


		});

	}


	function validateBindiginData(){
		var tempLookupSourceFields = [];
		var tempLookupDestinationFields = [];

		var isValidated = true;

		var tempBindingEvents = [];

		for(var i=0;i<$scope.bindings.length;i++){
			if($scope.bindings[i].lookupTableName){
				tempBindingEvents.push($scope.bindings[i].lookupTableName.eventName)
			}

		}

		var isDuplicateSourceEvents = checkIfDuplicateExists(tempBindingEvents);

		if(isDuplicateSourceEvents){
			alert("Duplicate events found!");
			return false;
		}

		for(var i=0;i<$scope.bindings.length;i++){

			var group = $scope.bindings[i];

			if(group.lookupFields.length == 0){
				alert("All Fields are manadatory in Binding Section!");
				isValidated = false;
				return false;
			}

			for(var j=0;j<group.lookupFields.length;j++){
				if(group.lookupFields[j].sourceField === '' || group.lookupFields[j].destinationField === ''){
					alert("All Fields are manadatory in Binding Section!");
					isValidated = false;
					return false;
				}
			}

			for(var j=0;j<group.lookupFields.length;j++){
				if(group.lookupFields[j].sourceField === group.lookupFields[j].destinationField){
					alert("source and destination fields can't be same");
					isValidated = false;
					return false;
				}
			}

			for(var j=0;j<group.lookupFields.length;j++){
				tempLookupSourceFields.push(group.lookupFields[j].sourceField);
				tempLookupDestinationFields.push(group.lookupFields[j].destinationField);
			}
			for(var j=0;j<tempLookupSourceFields.length;j++){
				if(tempLookupDestinationFields.indexOf(tempLookupSourceFields[j])!=-1){
					alert("source and destination fields can't be same");
					isValidated = false;
					return false;

				}
			}

			var isDuplicateSourceFields = checkIfDuplicateExists(tempLookupSourceFields);

			var isDuplicateDestinationFields = checkIfDuplicateExists(tempLookupDestinationFields);


			if(isDuplicateDestinationFields){
				alert("Found Duplicate Values in Destination Field");
				isValidated = false;
				return false;
			}

		}

		return isValidated;



	}

	function validateUnBindingData(){

		var tempLookupSourceFields = [];
		var tempLookupDestinationFields = [];

		var tempBindingEvents = [];

		for(var i=0;i<$scope.bindings.length;i++){
			if($scope.bindings[i].unBindlookupTableName){
				tempBindingEvents.push($scope.bindings[i].unBindlookupTableName.eventName)
			}

		}

		var isDuplicateSourceEvents = checkIfDuplicateExists(tempBindingEvents);

		if(isDuplicateSourceEvents){
			alert("Duplicate events found!");
			return false;
		}

		if(tempBindingEvents.length===0){
			return true;
		}

		for(var i=0;i<$scope.bindings.length;i++){
			var group = $scope.bindings[i];
			if(group.unBindlookupFields.length == 0){
				alert("All Fields are manadatory in Binding Section!");
				return false;
			}

			for(var j=0;j<group.unBindlookupFields.length;j++){
				if(group.unBindlookupFields[j].sourceField === '' || group.unBindlookupFields[j].destinationField === ''){
					alert("All Fields are manadatory in Binding Section!");
					return false;
				}
			}

			for(var j=0;j<group.unBindlookupFields.length;j++){
				if(group.unBindlookupFields[j].sourceField === group.unBindlookupFields[j].destinationField){
					alert("source and destination fields can't be same");
					return false;
				}
			}

			for(var j=0;j<group.unBindlookupFields.length;j++){
				tempLookupSourceFields.push(group.unBindlookupFields[j].sourceField);
				tempLookupDestinationFields.push(group.unBindlookupFields[j].destinationField);
			}
			for(var j=0;j<tempLookupSourceFields.length;j++){
				if(tempLookupDestinationFields.indexOf(tempLookupSourceFields[j])!=-1){
					alert("source and destination fields can't be same");
					return false;

				}
			}



			var isDuplicateSourceFields = checkIfDuplicateExists(tempLookupSourceFields);

			var isDuplicateDestinationFields = checkIfDuplicateExists(tempLookupDestinationFields);

			if(isDuplicateSourceFields){
				alert("Found Duplicate Values in Source Field");
				return false;
			}

		}

		return true;



	}

	$scope.saveDetails = function(){
		var object = new Object();

		//self.lookupFields.push({sourceField:'',destinationField:''})



		var validBininding =  validateBindiginData();

		var validUnBininding =  validateUnBindingData();



















		if(validBininding && validBininding){
			self.lookupDetails.bindingData = JSON.stringify($scope.bindings);



			lookupFactory.saveDetails(self.lookupDetails).then(function (response) {
				if(response.status === 201){

					self.alertMessagaes.push({ type: 'success', msg: 'Lookup was Saved Successfully' });

					$("#create-lookup").modal('hide');
					self.init();
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
				}else{

					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){
							self.lookupError.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						if(response.data.error.indexOf("constraint")!=-1){
							self.lookupError.push({ type: 'danger', msg: $scope.spaceDetails.spaceName +" should be unique" });
						}

					}
					$timeout(function () {
						self.lookupError = [];
					}, 2000);
				}


				unloader("body");
			}, function (error) {
				unloader("body");

				if(error.status== 403){
					self.lookupError.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.lookupError = [];
					}, 2000);
				}

				if(error.status== 500){
					self.lookupError.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.lookupError = [];
					}, 2000);
				}


			});

		}







	}

	$scope.events = [];
	$scope.filterEvents = [];

	$scope.currentLogFields = [];
	$scope.unBindlookupFields = [];

	self.onSelectedEvent = function(group,eventData){
		//$scope.lookupTableName.eventName = eventData.eventName;
		if(eventData.eventName === "ALL"){
			var tempFields = [];
			for(var i=0;i<$scope.events.length;i++){
				if( $scope.events[i].fields){
					var logFields = $scope.events[i].fields.split(",");
					for(var j=0;j<logFields.length;j++){
						if(tempFields.indexOf(logFields[j])==-1){
							if(self.lookupAttributeDetails.indexOf(logFields[j])!=-1){
								tempFields.push(logFields[j]);
							}

						}

					}
				}

			}

			group['currentLogFields'] = tempFields;


		}else{
			group['currentLogFields'] = eventData.fields.split(",");
		}


		group.bindingLogDevice = eventData.logDevice;

	}



	self.onSelectedBindingLogDeviece = function(group,eventData){
		var filterEvents = group.events;

		group.events = [];

		for(var i=0;i<$scope.events.length;i++){
			if($scope.events[i].device === eventData){
				group.events.push($scope.events[i]);
			}

		}

	}

	self.onSelectedUnBindingLogDeviece = function(group,eventData){
		var filterEvents = group.events;

		group.unbindingEvents = [];

		for(var i=0;i<$scope.events.length;i++){
			if($scope.events[i].device === eventData){
				group.unbindingEvents.push($scope.events[i]);
			}

		}

	}

	self.onSelectUnBindEvent = function(group,eventData){
		//$scope.unBindlookupTableName = eventData.eventName;
		group['unBindCurrnetLogFields'] = eventData.fields.split(",");

		group.unBindingLogDevice = eventData.logDevice;
	}


	self.lookupFields = [];
	self.unBindlookupFields = [];

	$scope.addLooupFields = function(group){
		if(group.currentLogFields.length==0){
			alert("Please Select Atleast one event");
			return false;
		}



		group.lookupFields.push({sourceField:'',destinationField:''})
	}

	$scope.addUnBindLooupFields = function(group){
		if(group.unBindCurrnetLogFields.length==0){
			alert("Please Select Atleast one event");
			return false;
		}

		group.unBindlookupFields.push({sourceField:'',destinationField:''})
	}

	$scope.deleteLookupFields = function(group,index){

		group.splice(index,1)
	}

	$scope.logDevice = [];

	self.loadAllEvents = function(){
		$scope.events = [{eventName:"ALL",field:[]}];
		$scope.logDevice = [];
		eventService.getAllEvents().then(function(response){
			var eventData = response.data.custom
			for(var i=0;i<eventData.length;i++){
				if(eventData[i].type === "Events"){
					$scope.events.push(eventData[i]);
					$scope.filterEvents.push(eventData[i]);
					if($scope.logDevice.indexOf(eventData[i].device)==-1){
						$scope.logDevice.push(eventData[i].device);
					}
				}
			}


		}, function (error) {

			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to load the data' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});

	}


	
	self.init = function(){
		self.loadPermissions();
		self.loadLookupDetails();
		self.loadAllEvents();
		self.loadLookupGroups();
		self.loadLookupTables();
	}

	self.loadLookupGroups = function(){

		lookupFactory.loadLookupGroups().then(function(response){
			$scope.lookupGroupsDetails = response.data;

		}, function (error) {

			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to load the data' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});

	}

	var  lookupDetailsGrid = {
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



			rowGroupPanelShow: 'onlyWhenGrouping',
			animateRows: true,
			debug: false,
			floatingFilter:true,
			rowSelection: 'single',
			suppressAggFuncInHeader: true,
			suppressDragLeaveHidesColumns: true,
			suppressMakeColumnVisibleAfterUnGroup: true,
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

				defaultToolPanel: 'columns'
			},
			onSelectionChanged: onSelectionChanged,


			onFirstDataRendered(params) {
				params.api.sizeColumnsToFit();
			}
	}

	self.loadLookupDetails = function(){
		lookupFactory.loadLookupDetails().then(function(response){
			$scope.lookupDetails = response.data;


			var colDefs = [

				{headerName: "ID", field: "id", width: 150, sort: 'desc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
					filterOptions:['contains'],suppressAndOrCondition:true }},
					{headerName: "Name", field: "lookupName", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
						filterOptions:['contains'],suppressAndOrCondition:true }},
						{headerName: "Created By", field: "createdBy", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
							filterOptions:['contains'],suppressAndOrCondition:true }},
							{headerName: "Created Date", field: "createdDate", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
								filterOptions:['contains'],suppressAndOrCondition:true }},
								{headerName: "Updated By", field: "updatedBy", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
									filterOptions:['contains'],suppressAndOrCondition:true }},
									{headerName: "Update Date", field: "updatedDate", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
										filterOptions:['contains'],suppressAndOrCondition:true }},
										{headerName: "Binding Relations", field: "bindingRelations", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
											filterOptions:['contains'],suppressAndOrCondition:true }},
											{headerName: "Un Binding Relations", field: "ubBindingRelations", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
												filterOptions:['contains'],suppressAndOrCondition:true }},
												{headerName: "Binding Events", field: "bindingEvents", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
													filterOptions:['contains'],suppressAndOrCondition:true }},
													{headerName: "Un BindingEvents", field: "ubBindingEvents", width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
														filterOptions:['contains'],suppressAndOrCondition:true }},


														];

			lookupDetailsGrid['columnDefs'] = colDefs;
			lookupDetailsGrid['rowData'] = response.data;



			$("#lookupDetails").empty();

			var eGridDiv =  document.querySelector('#lookupDetails');


			new agGrid.Grid(eGridDiv, lookupDetailsGrid);


		}, function (error) {

			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to load the data' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}

	function onSelectionChanged() {
		var selectedRows = lookupDetailsGrid.api.getSelectedRows();
		var selectedRowsString = '';
		$scope.alertNames = [];
		selectedRows.forEach( function(selectedRow, index) {
			for(var i=0;i<$scope.lookupDetails.length;i++){
				if(selectedRow.id === $scope.lookupDetails[i].id ){
					self.edit($scope.lookupDetails[i]);
					break;
				}

			}
		});

	}

	$scope.bindings = [];

	$scope.addBindings = function(){

		var bindingData = {eventName:'',lookupFields:[],unBindlookupFields:[],events:$scope.events,unbindingEvents:$scope.events};

		$scope.bindings.push(bindingData)
	}

	$scope.deleteBinding = function(index){
		$scope.bindings.splice(index,1);
	}



	self.init();

	self.deleteLookupGroupDetails = function(id){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete Grouos',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						lookupFactory.deleteLookupGroupDetails(id).then(function(response){
							if(response.status === 200){

								self.alertMessagaes.push({ type: 'success', msg: 'Delete Group was delete success' });

								$("#configureDomainGroup").modal('hide');
								self.init();
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
						},function(error){
							self.alertMessagaes.push({ type: 'danger', msg: 'Something went wrong please try again' });
							$timeout(function () {
								self.alertMessagaes =[];
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


	self.deleteLookupConfig = function(id){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete lookup configuration',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						lookupFactory.deleteLookupConfig(id).then(function(response){
							if(response.status === 200){

								self.alertMessagaes.push({ type: 'success', msg: 'Successfully deleted the configuration' });
								$timeout(function () {
									self.alertMessagaes =[];
								}, 2000);
								self.init();
							}
						},function(error){
							self.alertMessagaes.push({ type: 'danger', msg: 'Something went wrong please try again' });
							$timeout(function () {
								self.alertMessagaes =[];
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

	self.edit = function(data){

		$scope.templateUrl = "lookupConfiguration.html";

		self.lookupDetails = angular.copy(data);

		if(data.bindingData){
			$scope.bindings = JSON.parse(data.bindingData);


		}







	}

	$scope.currentLookupFields = [];

	self.addDataLookup = function(){
		$scope.currentLookupFields = [];
		$("#add-data-to-lookup").modal();
	}



	self.back = function(){
		$scope.templateUrl = "viewLookupDetails.html";
		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		$scope.showAddFieldButton = false;
	}



	$scope.crurrenLookup = {};

	self.viewContents = function(data){

		$scope.currentLookupFields = [];

		$scope.crurrenLookup = angular.copy(data);

		$scope.showHomeButton = false;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		$scope.showAddFieldButton = true;

		for(var i=0;i<data.fields.split(",").length;i++){
			$scope.currentLookupFields.push({fieldName:data.fields.split(",")[i],fieldValue:''});
		}

		$scope.templateUrl = "viewContents.html";

		$scope.loadLookupContents();






	}





	$scope.lookupIds = [];



	$scope.deleteLookupData = function(){
		var row = {ids:$scope.lookupIds.join(','),lookup_name:$scope.crurrenLookup.name};

		if($scope.lookupIds.length==0){
			alert("Please Select Atleast one row to delete");
			return false;
		}

		lookupFactory.deleteLookupData(row).then(function (response) {
			if(response.status){

				self.alertMessagaes.push({ type: 'success', msg: 'Lookup Data was deleted Successfully' });



				$scope.loadLookupContents();
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.lookupFieldsError.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					if(response.data.error.indexOf("constraint")!=-1){
						self.lookupFieldsError.push({ type: 'danger', msg: $scope.spaceDetails.spaceName +" should be unique" });
					}

				}
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}


			unloader("body");
		}, function (error) {
			unloader("body");

			if(error.status== 403){
				self.lookupFieldsError.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}

			if(error.status== 500){
				self.lookupFieldsError.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}


		});


	}


	$scope.saveDataToLookup = function(){
		var formData = {id:$scope.crurrenLookup.id,lookupData:$scope.currentLookupFields};

		lookupFactory.addDataToLookup(formData).then(function (response) {
			if(response.status){

				self.alertMessagaes.push({ type: 'success', msg: 'Lookup was Saved Successfully' });

				$("#add-data-to-lookup").modal('hide');

				$scope.loadLookupContents();
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.lookupFieldsError.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					if(response.data.error.indexOf("constraint")!=-1){
						self.lookupFieldsError.push({ type: 'danger', msg: $scope.spaceDetails.spaceName +" should be unique" });
					}

				}
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}


			unloader("body");
		}, function (error) {
			unloader("body");

			if(error.status== 403){
				self.lookupFieldsError.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}

			if(error.status== 500){
				self.lookupFieldsError.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.lookupError = [];
				}, 2000);
			}


		});
	}


	function checkIfDuplicateExists(w){
		return new Set(w).size !== w.length 
	}











}]);