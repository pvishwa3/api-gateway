app.controller("referencesetController", ['$scope', 'referenceSetFactory','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','eventService','fileUpload', function ($scope, referenceSetFactory , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,eventService,fileUpload) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	self.referenceSetFrom =  {id:"",referenceSetName:"",referenceSetType:"",baseDn:"",userObjectClass:"",userObjectFilter:0,userNameAttribute:"",userNameRDNAttribute:"",userFirstNameAttribute:"",userLastNameAttribute:"",usreDisplayNameAttributes:"",userEmailAttribute:"",userUniqueIdAttribute:"",groupMembersAttribute:"",userMemberShipAttribute:"",syncInterval:0,eventName:"",logField:"",keyFields:'',valueFields:''};
	$scope.eventName = {eventName:''}

	$scope.canShowUploadData = false;

	$scope.canBackButton = false;

	$("#deleteContents").hide();
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	self.alertMessagaes =[];

	self.conditionCategories = [];

	$scope.keyModel = [];

	$scope.valueModel = [] ;

	$scope.keyOptions = [];

	$scope.valueOptions = [];

	$scope.keyConfig = {
			create: true,
			onChange: function(value){
				$scope.keyModel = [];
				$scope.keyModel.push(value);
			}
	}

	$scope.riskFactors = [];

	$scope.getRiskFactors = function(){
        referenceSetFactory.getRiskFactors().then(function(response){
           $scope.riskFactors  = angular.copyOf(response.data);
        });
	}



	$scope.evenetValueConfig = {
			labelField: 'text',
			searchField: ['text'],
			onChange: function(value){
				$scope.keyModel = [];
				$scope.keyModel.push(value);

			}

	}

	$scope.evenetKeyConfig = {
			labelField: 'text',
			searchField: ['text'],
			onChange: function(value){
				$scope.valueModel = [];
				$scope.valueModel.push(value);

			}
	}






	self.referenceSetDetails  = [];

	$scope.templateUrl = "viewReferenceDetails.html";

	self.eventDetails = [];
	self.logFields = [];
	self.logField = [];

	$scope.changeCondition = function(data){

		self.logField = [];

		for(var i=0;i<self.eventDetails.length;i++){
			if(self.eventDetails[i].eventName === data.eventName){

				self.referenceSetFrom.eventName = data.eventName;

				var tempFields = JSON.parse(self.eventDetails[i].fields);

				self.logFields = [];
				//[{"logField":{"fieldname":"event_version"},"isMandatory":true},{"logField":{"fieldname":"type"},"isMandatory":true},{"logField":{"fieldname":"principal_id"},"isMandatory":true},{"logField":{"fieldname":"arn"},"isMandatory":true},{"logField":{"fieldname":"account_id"},"isMandatory":true},{"logField":{"fieldname":"access_key_id"},"isMandatory":true},{"logField":{"fieldname":"session_context_attributes_mfa"},"isMandatory":true},{"logField":{"fieldname":"session_context_attributes_creation_date"},"isMandatory":true},{"logField":{"fieldname":"session_context_type"},"isMandatory":true},{"logField":{"fieldname":"session_context_principal_id"},"isMandatory":true},{"logField":{"fieldname":"session_context_arn"},"isMandatory":true},{"logField":{"fieldname":"session_context_account_id"},"isMandatory":true},{"logField":{"fieldname":"session_context_username"},"isMandatory":true},{"logField":{"fieldname":"event_time"},"isMandatory":true},{"logField":{"fieldname":"event_source"},"isMandatory":true},{"logField":{"fieldname":"event_name"},"isMandatory":true},{"logField":{"fieldname":"region"},"isMandatory":true},{"logField":{"fieldname":"remote_host"},"isMandatory":true},{"logField":{"fieldname":"user_agent"},"isMandatory":true},{"logField":{"fieldname":"request_param_maxresults"},"isMandatory":true},{"logField":{"fieldname":"response_elements_snapshots"},"isMandatory":true},{"logField":{"fieldname":"request_parameters_owner_set"},"isMandatory":true},{"logField":{"fieldname":"request_parameters_shared_user_set"},"isMandatory":true},{"logField":{"fieldname":"request_parameter_filter_set"},"isMandatory":true},{"logField":{"fieldname":"response_element"},"isMandatory":true},{"logField":{"fieldname":"request_id"},"isMandatory":true},{"logField":{"fieldname":"event_id"},"isMandatory":true},{"logField":{"fieldname":"reciepient_account_id"},"isMandatory":true}]
				for(var j=0;j<tempFields.length;j++){
					self.logFields.push({"name":tempFields[j].logField.fieldname});
				}


			}
		}

	}

	$scope.logFields = [];



	$scope.loadAllFields = function(){
		//getAllLogTypes

		eventService.getAllFields().then(function(response){

			for(var i=0;i<response.data.length;i++){
				$scope.keyOptions.push({text:response.data[i],value:response.data[i]});
				$scope.valueOptions.push({text:response.data[i],value:response.data[i]});
			}

			//$scope.keyOptions = response.data;
			//$scope.valueOptions = response.data;;
		});
	}

	$scope.loadAllFields();

	$scope.loadSimpleEvents = function(){

		self.eventDetails = [];

		eventService.getAllFields().then(function(response){

			var tempEvents = response.data.custom;

			for(var i=0;i<tempEvents.length;i++){
				if(tempEvents[i].type === 'Events'){
					self.eventDetails.push(tempEvents[i]);
				}
			}


		});
	}

	self.loadReferenceSets = function(){
		referenceSetFactory.loadReferenceSets().then(function(response){

			if(response.data.length>0){
				self.referenceSetDetails = angular.copy(response.data);
			}

			self.loadAgGrid();

			//self.activeDirectoryDetails = angular.copy (response.data);
			//self.tagDetails.forEach(e => e.checked = false);
		});
	}

	

	self.init = function(){
		self.loadReferenceSets();
		$scope.loadSimpleEvents();
		$scope.getRiskFactors();
	}

	self.conditionMessagesModal = [];

	self.openCreateReferenceSetDetails = function(){
		$scope.templateUrl = "createReferenceDetails.html";
		self.referenceSetFrom =  {id:"",referenceSetName:"",referenceSetType:"",baseDn:"",userObjectClass:"",userObjectFilter:0,userNameAttribute:"",userNameRDNAttribute:"",userFirstNameAttribute:"",userLastNameAttribute:"",usreDisplayNameAttributes:"",userEmailAttribute:"",userUniqueIdAttribute:"",groupMembersAttribute:"",userMemberShipAttribute:"",syncInterval:0,eventName:"",logField:"",keyFields:'',valueFields:''};
		$scope.canBackButton = true;
		$scope.canShowUploadData = false;
		self.logField = [];
	}

	self.openUploadModal = function(){
		$("#uploadFileData").modal();
	}

	$scope.previewDetails = [];

	self.cacheData = {name:''};
	$scope.addDataToCache = function(){

		referenceSetFactory.addDataCache(self.referenceSetFrom.id,self.cacheData.name).then(function (response) {
			if(response.status === 200){

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

			}else{
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}

		});
	}

	$scope.cols = [];

	self.doPerview = function(){

		var tempFields = [];

		for(var i=0;i<self.logField.length;i++){
			tempFields.push(self.logField[i].name);
		}

		self.referenceSetFrom.logField = tempFields.join(',');



		referenceSetFactory.doPerview(self.referenceSetFrom).then(function (response) {
			if(response.status === 200){
				$scope.cols = [];
				if( response.data.length!=0){
					$scope.cols  =  Object.keys(response.data[0]) 
				}

				$scope.previewDetails = response.data;
				//console.log(response.data);

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

			}else{
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}

		});
	}


	self.saveReferenceDetails = function(){

		var tempArray = [];

		for(var i=0;i<self.logField.length;i++){
			tempArray.push(self.logField[i].name);
		}

		if(self.referenceSetFrom.referenceSetType ==='events' && self.logField.length===0){
			self.conditionMessagesModal.push({ type: 'danger', msg: "Please Select Atleast one Log Fields" });
			$timeout(function () {
				self.conditionMessagesModal.splice(0, 1);

			},2000);
			return false;
		}

		if(self.referenceSetFrom.referenceSetName === "" || self.referenceSetFrom.referenceSetType === ""){
			self.conditionMessagesModal.push({ type: 'danger', msg: "Please Enter All Mandatory Fields" });
			$timeout(function () {
				self.conditionMessagesModal.splice(0, 1);

			},2000);
			return false;
		}

		self.referenceSetFrom.logField  = tempArray.join(",");

		var tempKeys = [];
		var tempValues = [];


		for(var i=0;i<$scope.keyOptions.length;i++){
			tempKeys.push($scope.keyOptions[i].text);
		}
		for(var i=0;i<$scope.valueOptions.length;i++){
			tempValues.push($scope.valueOptions[i].text);
		}

		if(self.referenceSetFrom.referenceSetType != "Active Directory"){
			self.referenceSetFrom.keyFields = $scope.keyModel.join(',');
			self.referenceSetFrom.valueFields = $scope.valueModel.join(',');
		}

		//self.referenceSetFrom.keyFields = $scope.keyModel.join(',');
		//self.referenceSetFrom.valueFields = $scope.valueModel.join(',');

		if(self.referenceSetFrom.keyFields===''){
			alert("keys should be mandatory");
			return false;
		}
		
		referenceSetFactory.saveReferenceDetails(self.referenceSetFrom).then(function (response) {
			if(response.status === 201){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Reference Set was Created Successfully' });
				$scope.templateUrl = "viewReferenceDetails.html";

				self.init();

				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);

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
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}else{
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}

		});
	}

	$scope.contentsDetails = [];

	self.selectedContents = [];

	self.selectById = function(status,id){
		if(status == true){
			self.selectedContents.push(id);
			$("#tagFields").prop('checked',false);
		}else if(status == false){
			self.selectedContents.splice(self.selectedContents.indexOf(id),1);
		}

		if(self.selectedContents.length == $scope.length){
			$("#tagFields").prop('checked',true);
			self.selectAll = true;
		}else{
			$("#tagFields").prop('checked',false);
			self.selectAll = false;
		}
	}

	self.resync = function(){
		referenceSetFactory.resync(self.referenceSetFrom.id).then(function (response) {

			if(response.status === 200){
				self.conditionMessagesModal.push({ type: 'success', msg: 'successfully resync the contents' });
				self.viewContents(self.referenceSetFrom.id);
				self.selectedContents = [];
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);
			}

		}, function (error) {
			if(error.status== 403){
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}else{
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}

		});
	}

	self.deleteContents = function(){

		var tempEvents = [];

		for(var i=0;i<self.selectedContents.length;i++){
			tempEvents.push(self.selectedContents[i].key);
		}

		referenceSetFactory.deleteContents(self.referenceSetFrom.id,tempEvents).then(function (response) {

			if(response.status === 200){
				self.conditionMessagesModal.push({ type: 'success', msg: 'successfully delete the contents' });
				self.viewContents(self.referenceSetFrom.id);
				self.selectedContents = [];

				$("#deleteContents").hide();

				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);
			}

		}, function (error) {
			if(error.status== 403){
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}else{
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}

		});

	}



	$scope.uploadFile = function(){

		let data = new FormData();
		data.append("file", self.uploadedFile.name);


		referenceSetFactory.uploadFile(self.referenceSetFrom.id,data).then(function (response) {

			if(response.status === 200){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Successfully uploaded the file' });
				$("#uploadFileData").modal('hide');
			}
			self.viewContents(self.referenceSetFrom.id);
			$timeout(function () {
				self.conditionMessagesModal = [];
			}, 2000);


		}, function (error) {
			if(error.status== 403){
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}else{
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}

		});





	}

	self.goBack = function(){
		$scope.templateUrl = "viewReferenceDetails.html";
		self.loadAgGrid();
		$scope.canBackButton = false;
		$scope.canShowUploadData = false;

	}

	self.viewContents = function(id){

		for(var i=0;i<self.referenceSetDetails.length;i++){
			if(self.referenceSetDetails[i].id === id){
				self.referenceSetFrom = angular.copy(self.referenceSetDetails[i]);

				if(self.referenceSetFrom.referenceSetType === 'Manual'){
					$scope.canShowUploadData  = true;

				}else{
					$scope.canShowUploadData  = false;
				}

			}
		}

		self.referenceSetFrom.id = id;

		$scope.canBackButton = true;



		referenceSetFactory.viewContents(id).then(function (response) {
			$scope.contentsDetails = response.data;
			$scope.templateUrl = "viewContenetReferenceDetails.html";

			self.loadViewAgGrid(response.data);
			$("#viewButton").hide();
			$("#deleteButton").hide();

		}, function (error) {
			if(error.status== 403){
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}else{
				self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.conditionMessagesModal = [];
				}, 2000);

			}

		});

	}


	self.loadViewAgGrid = function(data){
		if(data.length>0){
			var colsDef = [];
			const keys = Object.keys(data[0]);
			colsDef.push({headerName: "Key",resizable:true,colId:'',field: "key",checkboxSelection: true,width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},)
			for (const key of keys) {
				if(key!="key"){
					colsDef.push({headerName: key,field: key,resizable:true,width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},)
				}
			}

			$timeout(function(){
				self.refGrid = {
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
						columnDefs: colsDef,
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

//							defaultToolPanel: 'columns'
						},
						rowData: data,
						rowSelection: 'multiple',
						floatingFilter:true,
						rowGroupPanelShow: 'always',
						onSelectionChanged: self.onSelectionContentChanged,
						onFirstDataRendered(params) {
							params.api.sizeColumnsToFit();
						}
				}

				self.referenceSetId = [];
				$("#ContenetReferenceDetails").empty();
				$("#viewButton").hide();
				$("#deleteButton").hide();
				$("#ContenetReferenceDetails").css("height",$(window).height()-250+"px");
				if(self.refGrid.api != undefined && self.refGrid.api.getSelectedRows().length > 0){			
					self.eventGrid.api.deselectAll();
				}
				var eGridDiv =  document.querySelector('#ContenetReferenceDetails');
				new agGrid.Grid(eGridDiv, self.refGrid );
				self.refGrid.api.sizeColumnsToFit();
			},250);

		}
	}

	$scope.editEvents = function(){

	}

	self.onSelectionContentChanged = function(){
		self.selectedContents = [];
        $("#editRefersent").hide();
		$("#deleteContents").hide();
		self.selectedContents = angular.copy(self.refGrid.api.getSelectedRows());
		if(self.selectedContents.length>0){
			$("#editRefersent").show();
			$("#deleteContents").show();
		}

	}

	self.editRefrenceDetails = function(data){

		self.referenceSetFrom =  angular.copy(data);
		$scope.templateUrl = "createReferenceDetails.html";
		$scope.canBackButton = true;
		if(data.eventName){
			self.logField = [];

			var tempFields = data.logField.split(",");
			for(var i=0;i<tempFields.length;i++){
				self.logField.push({name:tempFields[i]});
			}


			$scope.eventName.eventName = data.eventName;
		}



	}






	self.deleteReferenceSetDetails = function(id,name){
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
						referenceSetFactory.deleteReferenceDetails(id).then(function (response) {
							if(response.status===200){
								self.conditionMessagesModal.push({ type: 'success', msg: 'Tag was deleted successfully' });
								//toastr.success("Condition was deleted successfully")

								self.init();


								$timeout(function () {
									self.conditionMessagesModal = [];
								}, 2000);
							}



						}, function (error) {
							//unloader("body");
							if(error.status== 403){
								self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}else{
								self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}

							$timeout(function () {
								self.conditionMessagesModal.splice(0, 1);
							}, 5000);
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});
	}



	self.columnDefs = [
		{headerName: "Name",field: "referenceSetName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Type",field: "referenceSetType",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
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
					rowData: self.referenceSetDetails,
					rowSelection: 'single',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onSelectionChanged,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}

			self.referenceSetId = [];
			$("#viewReferenceContent").empty();
			$("#viewButton").hide();
			$("#deleteButton").hide();
			$("#viewReferenceContent").css("height",$(window).height()-250+"px");
			if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
				self.eventGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#viewReferenceContent');
			new agGrid.Grid(eGridDiv, self.eventGrid );
			self.eventGrid.api.sizeColumnsToFit();
		},250);
	}


	self.onSelectionChanged = function() {
		self.referenceSetId = [];
		$("#viewButton").hide();
		$("#deleteButton").hide();
		self.referenceSetId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.referenceSetId.length > 0){			
			$("#viewButton").show();
			$("#deleteButton").show();
		}
	}


	$(window).resize(function() {
		setTimeout(function() {
			try{self.eventGrid.api.sizeColumnsToFit();
			$("#viewReferenceContent").css("height",$(window).height()-250+"px");
			}catch(err){}
		}, 500);
	});



}]);
