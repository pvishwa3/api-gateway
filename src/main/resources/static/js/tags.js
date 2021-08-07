app.controller("tagController", ['$scope', 'tagService','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', function ($scope, tagService , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	self.condition =  {categoryId:"",categoryName:"",operationType:""};
	self.alertMessagaes =[];

	self.conditionCategories = [];

	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';

	$scope.templateUrl = "viewTagDetails.html";
	self.loadAllTags = function(){
		tagService.getTags().then(function(response){
			self.tagDetails = response.data;
			self.loadAgGrid();
//			self.tagDetails.forEach(e => e.checked = false);
		});
	}

	self.init = function(){
		self.loadAllTags();
	}

	

	self.openCreateTag = function(){
		self.tag = {id:0,tagName:""}
		$("#createNewTag").modal()
		$scope.tagsForm.$setPristine();
		$scope.tagsForm.$setUntouched();
	}

	self.tag = {id:0,tagName:""}

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
						tagService.deleteTags(id).then(function (response) {
							if(response.status===200){
								self.alertMessagaes.push({ type: 'success', msg: 'Tag was deleted successfully' });
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
//									$("#tagFields").prop('checked',false);
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
//			$("#tagFields").prop('checked',false);
		}else if(status == false){
			self.selectedTags.splice(self.selectedTags.indexOf(id),1);
		}
		
		if(self.selectedTags.length == self.tagDetails.length){
//			$("#tagFields").prop('checked',true);
			self.selectAll = true;
		}else{
//			$("#tagFields").prop('checked',false);
			self.selectAll = false;
		}
	}
	
	self.selectAllFunction = function(status){
		self.selectedTags = [];
		if(status == true){
			self.selectedTags = self.tagDetails.map(tag => tag.id);
//			self.tagDetails.forEach(tag => tag.checked = true);
		}else if(status == false){
//			self.tagDetails.forEach(tag => tag.checked = false);
		}
		console.log(self.selectedTags);
	}
	
	
	self.columnDefs = [
		{headerName: "Tag",field: "tagName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
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
							rowData: self.tagDetails,
							rowSelection: 'single',
							floatingFilter:true,
							rowGroupPanelShow: 'always',
							onSelectionChanged: self.onSelectionChanged,
							onFirstDataRendered(params) {
								params.api.sizeColumnsToFit();
							}
					}
			
					self.tagsId = [];
					$("#tagsContent").empty();
					$("#viewButton").hide();
					$("#deleteButton").hide();
					 $("#tagsContent").css("height",$(window).height()-250+"px");
					if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
						self.eventGrid.api.deselectAll();
					}
					var eGridDiv =  document.querySelector('#tagsContent');
					new agGrid.Grid(eGridDiv, self.eventGrid );
				},250);
			}
	
	
	self.onSelectionChanged = function() {
		self.tagsId = [];
		$("#viewButton").hide();
		$("#deleteButton").hide();
		self.tagsId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.tagsId.length > 0){			
			$("#viewButton").show();
			$("#deleteButton").show();
		}
	}
	
	
	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{
	    		 self.eventGrid.api.sizeColumnsToFit();
	    		 $("#tagsContent").css("height",$(window).height()-250+"px");
	    	 }catch(err){}
	    }, 500);
	});
	
}]);
