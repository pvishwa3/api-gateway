app.controller("logFieldsController",['$scope','logDevicesFactory','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$timeout','conditionFactory',function($scope,logDevicesFactory,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$timeout,conditionFactory){
	
	var self= this;
	
	self.alertMessagaes = [];
	self.alertMessagaesModal = [];
	
	self.canDelete = false;
	self.canUpdate = false;
	self.canCreate = false;
	self.canCreateDomainTypeAttribute = false;
	self.canUpdateDomainTypeAttribute = false;
	self.canDeleteDomainTypeAttribute = false;
	
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
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
		loader("body");
		logDevicesFactory.saveLogFields(self.newField).then(function(response){
			if(response.data.status){
				
				self.alertMessagaes.push({type:"success",msg:"successfully saved the log field"});
				self.getAllLogFields();
				$timeout(function(){
					self.alertMessagaes= [];
				},3000);
			}else{
				try{
					unloader("body");
				
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
				self.getAllLogFields();
			}
			
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
			self.loadLogFieldsAgGrid();
			self.selectedLogFields = [];
			
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
//								self.getAllLogFields();
								self.selectedLogFields = [];
								self.toggleLogFields = false;
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
	
//	self.refreshLogDevices = function(){
//		logDevicesFactory.refreshLogDevices().then(function(response){
//			self.init();
//		},function(error){
//			
//		})
//	}
	self.deviceTypesList = [];
	self.getDeviceTypes = function(){
		logDevicesFactory.getDevices().then(function(response){
			self.deviceTypesList = angular.copy(response.data);
		},function(error){
			if(error.status === 403){
				self.alertMessagaes.push({type:"danger",msg:error.data.data});
			}
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
		});
	}
	
	self.init = function(){
		self.loadPermissions();
		self.getDeviceTypes();
		self.getAllLogFields();
	}


	self.loadLogFieldsAgGrid = function(){
		$timeout(function(){
			self.columnDefsLogFields = [
				{headerName: "Id",field: "logFieldId",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
				{headerName: "Field Name",field: "fieldName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
				{headerName: "Description",field: "description",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
				{headerName: "Display Name",field: "displayName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
				{headerName: "Data Type",field: "dataType",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
				{headerName: "Device Type",field: "deviceTypeId",
					valueGetter: function(params) {
					for(var i=0;i<self.deviceTypesList.length;i++){
						if(params.data != undefined){
							if(params.data.deviceTypeId == self.deviceTypesList[i].deviceTypeId){
								return self.deviceTypesList[i].deviceTypedisplayName;
							}
						}
					}
				},valueSetter:function(params){
					console.log("value setter");
					console.log(params);
				},
				width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
				{headerName: "Analyzed",field: "analyzed",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
			]
			
			self.logFieldsGrid = {
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
					columnDefs: self.columnDefsLogFields,
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
					rowData: self.logFieldsList,
					rowSelection: 'multiple',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onSelectionChangedLogFields,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}
	
			self.selectedLogFields = [];
			$("#logFieldsContent").empty();
			$("#viewLogFieldButton").hide();
			$("#deleteLogFieldButton").hide();
			$("#logFieldsContent").css("height",$(window).height()-250+"px");
			unloader("body");
			if(self.logFieldsGrid.api != undefined && self.logFieldsGrid.api.getSelectedRows().length > 0){			
				self.logFieldsGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#logFieldsContent');
			new agGrid.Grid(eGridDiv, self.logFieldsGrid );
		},250);

	}

		self.onSelectionChangedLogFields = function() {
			self.selectedLogFields = [];
			$("#viewLogFieldButton").hide();
			$("#deleteLogFieldButton").hide();
			self.logFieldsGrid.api.getSelectedRows().reduce(function(map, tag) {
				self.selectedLogFields.push(tag.id);
			}, {});
			
			if(self.selectedLogFields.length > 0){	
				if( self.selectedLogFields.length == 1 && self.canUpdate){	
					$("#viewLogFieldButton").show();
				}
				if(self.canDelete){
					$("#deleteLogFieldButton").show();
				}
			}
		}	
		$("#viewLogFieldButton").hide();
		$("#deleteLogFieldButton").hide();
	self.init();
	
	
	self.deselectAll = function(){
		try{self.logFieldsGrid.api.deselectAll();}catch(err){}
		$("#viewLogFieldButton").hide();
		$("#deleteLogFieldButton").hide();
	}
	
	
	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{
	    		self.logFieldsGrid.api.sizeColumnsToFit();
	    	 	$("#logFieldsContent").css("height",$(window).height()-250+"px");
	    	 }catch(err){}
	    }, 500);
	});
	
}]);