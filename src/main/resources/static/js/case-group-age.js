app.controller("caseGroupConfiguration", ['$scope', 'caseGroupService','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', function ($scope, caseGroupService , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	self.caseGroupConfig =  {id:0,groupName:"",fromDay:0,toDay:0};
	self.alertMessagaes =[];

	self.conditionCategories = [];

	

	$scope.templateUrl = "viewTagDetails.html";
	self.loadAllCasesGroups = function(){
		caseGroupService.getAllCaseGroups().then(function(response){
			self.caseGroupDetails = response.data;
			self.loadAgGrid();
		});
	}

	self.init = function(){
		self.loadAllCasesGroups();
	}

	

	self.openCaseAgeGroup = function(){
		self.caseGroupConfig =  {id:0,groupName:"",fromDay:0,toDay:0};
		$("#createCaseGroupConfigModal").modal()
		$scope.conditionCategory.$setPristine(); 
		$scope.conditionCategory.$setUntouched(); 
	}



	self.saveTags = function(){
//if(self.caseGroupConfig.groupName == "" || self.caseGroupConfig.groupName == undefined || self.caseGroupConfig.fromDay == null || self.caseGroupConfig.fromDay == undefined || self.caseGroupConfig.toDay == null || self.caseGroupConfig.toDay == undefined ){
//	self.conditionMessagesModal.push({ type: 'danger', msg: 'Please fill all the details' });
//	$timeout(function () {
//		self.conditionMessagesModal.splice(0, 1);
//		$("#createCaseGroupConfigModal").modal('hide');
//	},3000);
//}
		tagService.saveTags(self.caseGroupConfig).then(function (response) {
			if(response.data.status){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Data  was Saved Successfully' });
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					$("#createCaseGroupConfigModal").modal('hide');
				},3000);

				self.loadAllCasesGroups();
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
				$("#createCaseGroupConfigModal").modal('hide');
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				$("#createCaseGroupConfigModal").modal('hide');
			}

		});
	}
	self.editTag = function(id){
		for(var i = 0; i < self.caseGroupDetails.length; i++){
			if(self.caseGroupDetails[i].id === id) {
				self.caseGroupConfig = angular.copy(self.caseGroupDetails[i]);
				break;
			}
		}

		$("#createCaseGroupConfigModal").modal();
		
	}
	




	self.openCreateCategoryPage = function(){
		self.condition =  {categoryId:"",categoryName:"",operationType:"insert"};
		self.buttonName="Save";


		$("#createCategory").modal();


	}

	





	self.conditionMessagesModal = [];
	self.submitData = function(){
		
if(self.caseGroupConfig.groupName == '' || self.caseGroupConfig.groupName == undefined || self.caseGroupConfig.fromDay == undefined || self.caseGroupConfig.toDay == undefined){
	self.conditionMessagesModal.push({ type: 'danger', msg: 'Please fill all the details' });
	$timeout(function(){
		self.conditionMessagesModal = [];
	},2000);
	return false;
}
		caseGroupService.saveCaseGroups(self.caseGroupConfig).then(function (response) {
				if(response.status===201){
					self.conditionMessagesModal.push({ type: 'success', msg: 'Case Age Group was Created Successfully' });
					$timeout(function () {
						self.conditionMessagesModal.splice(0, 1);
						$("#createCaseGroupConfigModal").modal('hide');
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
					$("#createCaseGroupConfigModal").modal('hide');
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
					$("#createCaseGroupConfigModal").modal('hide');
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
	
	
	self.deleteTags = function(id,name){
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
						caseGroupService.deleteCasesGroups(id).then(function (response) {
							if(response.status===200){
								self.alertMessagaes.push({ type: 'success', msg: 'Case Group was deleted successfully' });
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
	
	self.deleteMultipleCaseGroups = function(){
		
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
						caseGroupService.deleteMultipleCaseGroups(self.selectedTags).then(function(response){
							if(response.data.status){
								self.selectedTags = [];
								self.init();
								
								self.alertMessagaes.push({ type: 'success', msg: "Successfully deleted the selected Case Groups "});
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
		
		if(self.selectedTags.length == self.caseGroupDetails.length){
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
			self.selectedTags = self.caseGroupDetails.map(tag => tag.id);
			self.caseGroupDetails.forEach(tag => tag.checked = true);
		}else if(status == false){
			self.caseGroupDetails.forEach(tag => tag.checked = false);
		}
		console.log(self.selectedTags);
	}
	
	
	self.columnDefs = [
		{headerName: "Group Name",field: "groupName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "From",field: "fromDay",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "To",field: "toDay",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
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
			
//								defaultToolPanel: 'columns'
							},
							rowData: self.caseGroupDetails,
							rowSelection: 'single',
							floatingFilter:true,
							rowGroupPanelShow: 'always',
							onSelectionChanged: self.onSelectionChanged,
							onFirstDataRendered(params) {
								params.api.sizeColumnsToFit();
							}
					}
			
					self.caseAgeId = [];
					$("#caseAgeGroupContent").empty();
					$("#viewButton").hide();
					$("#deleteButton").hide();
					$("#caseAgeGroupContent").css("height",$(window).height()-250+"px");
					if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
						self.eventGrid.api.deselectAll();
					}
					var eGridDiv =  document.querySelector('#caseAgeGroupContent');
					new agGrid.Grid(eGridDiv, self.eventGrid );
				},250);
			}
	
	
	self.onSelectionChanged = function() {
		self.caseAgeId = [];
		$("#viewButton").hide();
		$("#deleteButton").hide();
		self.caseAgeId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.caseAgeId.length > 0){			
			$("#viewButton").show();
			$("#deleteButton").show();
		}
	}
	
	
	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{
	    		 self.eventGrid.api.sizeColumnsToFit();
	    		 $("#caseAgeGroupContent").css("height",$(window).height()-250+"px");
	    	 }catch(err){}
	    }, 500);
	});
	
	
}]);
