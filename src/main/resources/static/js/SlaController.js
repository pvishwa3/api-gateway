app.controller("slaContoller", ['$scope', 'slaService','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','eventService','settingsFactory','$sessionStorage', function ($scope, slaService , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,eventService,settingsFactory,$sessionStorage) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	self.condition =  {categoryId:"",categoryName:"",operationType:""};
	self.alertMessagaes =[];

	
	$scope.showHomeButton = true;
	
	self.conditionCategories = [];

	self.slaDetails = [];
	
	self.slaData = {id:0,slaName:'',slaDescription:'',slaTargets:'',slaConditions:'',slaViolations:[]}
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	self.categories = [];
	
	self.responseEsclation = {responeTime:'',emails:[]};
	self.reslovedEsclation = {responeTime:'',emails:[]};
	
	self.allUsers = [];
	self.users = [];

	self.slaTargets = [
		{label:'Critical',respondWithIn:0,respondWithInUnits:'Hrs',resolveWithIn:0,resolveWithInUnits:'Hrs'},
		{label:'High',respondWithIn:0,respondWithInUnits:'Hrs',resolveWithIn:0,resolveWithInUnits:'Hrs'},
		{label:'Medium',respondWithIn:0,respondWithInUnits:'Hrs',resolveWithIn:0,resolveWithInUnits:'Hrs'},
		{label:'Low',respondWithIn:0,respondWithInUnits:'Hrs',resolveWithIn:0,resolveWithInUnits:'Hrs'}
	];
	
	self.allCategories = [];
	
	self.tempCategories = ['Port Scanning Activity','Malware Infection','Distributed Denial Of Service','Distributed Denial Of Service Diversion','Unauthorized Access','Insider Breach','Unauthorized Privilege Escalation','Destructive Attack','Advanced Persistent Threat Or Multistage Attack','False Alarms','Other'];
	
	self.goBackSLA = function(){
		$scope.showHomeButton = true;
		$scope.templateUrl = "viewSlaPolicies.html";
		self.loadAgGrid();
	}
	
	self.getAllUsers = function(){
		settingsFactory.getUsersWithInCompany("").then(function (response) {
			self.allUsers = response.data;
			

			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}
	
	self.getAllCategories = function(){
		for(var i=0;i<self.tempCategories.length;i++){
			self.allCategories.push({categoryName:self.tempCategories[i]})
		}
	};
	
	self.categoryConfig = {
			
			optgroupField: 'class',
			labelField: 'categoryName',
			searchField: ['categoryName'],
			valueField: 'categoryName'
			
	}
	
	self.userConfig = {
			dropdownDirection :'up',
			optgroupField: 'class',
			labelField: 'userName',
			searchField: ['userName'],
			valueField: 'userName'
	}
	
	
	$scope.templateUrl = "viewSlaPolicies.html";
	self.loadAllSlas = function(){
		slaService.getSLAPolicies().then(function(response){
			self.slaDetails = response.data;
			self.loadAgGrid();
//			self.slaDetails.forEach(e => e.checked = false);
		});
	}

	self.init = function(){
		self.loadAllSlas();
		self.getAllCategories();
		self.getAllUsers();
		
		
	}
	self.editSLA = function(data){
		$scope.showHomeButton = false;
		self.slaData = angular.copy(data);
		self.slaTargets = angular.copy(JSON.parse(data.slaTargets));
		
		self.categories = data.slaConditions.split(",");
		
		var tempObject =  angular.copy(JSON.parse(data.slaViolations));
		
		if(tempObject.response){
			self.responseEsclation = angular.copy(tempObject.response);
		}
		if(tempObject.reslove){
			self.reslovedEsclation = angular.copy(tempObject.reslove);
		}
		$scope.templateUrl = "createSLA.html";
		$("#viewButton").hide();
		$("#deleteButton").hide();
	}

	

	self.openNewSlaPolicy = function(){
		self.categories = [];
		self.slaData = {id:0,slaName:'',slaDescription:'',slaTargets:[],slaConditions:'',slaViolations:[]};
		self.slaTargets = [
			{label:'Critical',respondWithIn:0,respondWithInUnits:'Hrs',resolveWithIn:0,resolveWithInUnits:'Hrs'},
			{label:'High',respondWithIn:0,respondWithInUnits:'Hrs',resolveWithIn:0,resolveWithInUnits:'Hrs'},
			{label:'Medium',respondWithIn:0,respondWithInUnits:'Hrs',resolveWithIn:0,resolveWithInUnits:'Hrs'},
			{label:'Low',respondWithIn:0,respondWithInUnits:'Hrs',resolveWithIn:0,resolveWithInUnits:'Hrs'}
		];
		
		self.responseEsclation = {responeTime:'',emails:[]};
		self.reslovedEsclation = {responeTime:'',emails:[]};
		$scope.templateUrl = "createSLA.html";
		$("#viewButton").hide();
		$("#deleteButton").hide();
		$scope.showHomeButton = false;
	}

	self.tag = {id:0,tagName:""}

	$scope.saveSla = function(){
		
		
		
		
		for(var i=0;i<self.slaTargets.length;i++){
			if(self.slaTargets[i].respondWithIn == 0 || self.slaTargets[i].resolveWithIn==0){
				
				self.conditionMessagesModal.push({ type: 'danger', msg: "Respond Within or Resolve Within can't be Zero" });
				
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					
				},2000);
				return false;
			}
			
		}
		
		
		if(self.reslovedEsclation.emails.length == 0  || self.reslovedEsclation.emails.length == undefined || self.responseEsclation.emails.length == 0 ||self.responseEsclation.emails == undefined){

			self.conditionMessagesModal.push({ type: 'danger', msg: "Please select the sla violation emails" });
			
			$timeout(function () {
				self.conditionMessagesModal.splice(0, 1);
				
			},2000);
			return false;
		}
		
		self.slaData.slaTargets = JSON.stringify(self.slaTargets);
		self.slaData.slaConditions = self.categories.join(',');
		
		var object = new Object();
		object['response'] = self.responseEsclation;
		object['reslove'] = self.reslovedEsclation;
		self.slaData.slaViolations = JSON.stringify(object);
		

		slaService.saveSLA(self.slaData).then(function (response) {
			if(response.status===201){
				self.conditionMessagesModal.push({ type: 'success', msg: 'SLA was Created Successfully' });
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					
				},2000);

				self.init();
				$scope.templateUrl = "viewSlaPolicies.html";
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
	
	
	self.deleteSLA = function(id,name){
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
						slaService.deleteSLA(id).then(function (response) {
							if(response.status===200){
								self.conditionMessagesModal.push({ type: 'success', msg: 'SLA was deleted successfully' });
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
									self.conditionMessagesModal = [];
								}, 2000);
							}else{
								self.conditionMessagesModal.push({ type: 'danger', msg: error.data.error });
								$timeout(function () {
									self.conditionMessagesModal = [];
								}, 2000);
							}

							$timeout(function () {
								self.conditionMessagesModal.splice(0, 1);
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
		self.loadAgGrid();		
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
			content: 'Do you want to delete selected SLA',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						slaService.deleteMultipleSLAS(self.selectedTags).then(function(response){
							if(response.status===200){
								self.selectedTags = [];
								self.init();
								
								self.conditionMessagesModal.push({ type: 'success', msg: "Successfully deleted the selected SLA "});
								$timeout(function () {
									$("#tagFields").prop('checked',false);
									self.conditionMessagesModal = [];
								}, 2000);
							}else{
								self.conditionMessagesModal.push({ type: 'danger', msg: reponse.data.msg });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							
						},function(error){
							self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
							$timeout(function () {
								self.conditionMessagesModal = [];
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
			self.selectedTags = self.slaDetails.map(tag => tag.id);
			self.slaDetails.forEach(tag => tag.checked = true);
		}else if(status == false){
			self.slaDetails.forEach(tag => tag.checked = false);
		}
		console.log(self.selectedTags);
	}
	
	
	self.columnDefs = [
		{headerName: "Policy",field: "slaName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Description",field: "slaDescription",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
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
							rowData: self.slaDetails,
							rowSelection: 'single',
							floatingFilter:true,
							rowGroupPanelShow: 'always',
							onSelectionChanged: self.onSelectionChanged,
							onFirstDataRendered(params) {
								params.api.sizeColumnsToFit();
							}
					}
			
					self.tagsId = [];
					$("#slaContent").empty();
					$("#viewButton").hide();
					$("#deleteButton").hide();
					$("#slaContent").css("height",$(window).height()-250+"px");
					if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
						self.eventGrid.api.deselectAll();
					}
					var eGridDiv =  document.querySelector('#slaContent');
					new agGrid.Grid(eGridDiv, self.eventGrid );
					self.eventGrid.api.sizeColumnsToFit();
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
	    	 try{self.eventGrid.api.sizeColumnsToFit();
	    	 $("#slaContent").css("height",$(window).height()-250+"px");}catch(err){}
	    }, 500);
	});
	
	
}]);
