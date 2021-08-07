
app.controller("miterController", ['$scope', 'miterFactory', '$rootScope', '$timeout', '$uibModal', '$filter',  '$ngConfirm', '$sessionStorage','DTColumnBuilder','DTOptionsBuilder','DTColumnDefBuilder', function ($scope, miterFactory, $rootScope, $timeout, $uibModal, $filter,  $ngConfirm, $sessionStorage,DTColumnBuilder,DTOptionsBuilder,DTColumnDefBuilder) {


	var self = this;

	$scope.templateUrl = "viewTactics.html";
	
	self.miter = {id:0,tacticsName:'',tacticsId:'',techniqueName:'',platforms:'',externalRef:'',groups:''};
	self.externalReference = [];
	self.groups = [];
	self.techniqueName = [];
	self.platforms = [];
	
	self.addNewExternalSource = function(){
		self.externalReference.push({source_name:'',url:''});
	}
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	
	self.isTechniquesPage = false;
	self.allSavedTechniques = [];
	self.technique = {id:0,techniqueName:'',description:'',paltform:'',techniqueId:'',taticId:0};
	self.allExistgroups = [];
	self.tacticsMessages = [];
	self.alertMessagaes = [];
	self.loadTactics = function(){
		miterFactory.getAllTactics().then(function(response){
			let tempTechniques = [];
			var tempGroups = [];
			var temp = response.data;
			self.originalMiterDetails = angular.copy(temp);
			self.miterDetails =  [];
			for(let i=0;i<temp.length;i++){
				let techniques = temp[i].techniqueName.split(",");
				for(let j=0;j<techniques.length;j++){
					tempTechniques.push(techniques[j]);
						let groups = temp[i].groups.split(",");
						for(let l=0;l<groups.length;l++){	
							tempGroups.push(groups[l])
							try{
								self.miterDetails.push({
										tacticsName:temp[i].tacticsName,
										techniqueName:techniques[j],
										tacticsId:temp[i].tacticsId,
										id:temp[i].id,
										group:groups[l]
									})
							}catch(err){}
								
						}
				}
			}
			tempTechniques = [...new Set(tempTechniques)];
			tempGroups = [...new Set(tempGroups)];
			self.allSavedTechniques = tempTechniques.map(function(x) { return { item: x }; });
			self.allExistgroups = tempGroups.map(function(x) { return { item: x }; });
			console.log(self.allSavedTechniques);
			self.loadAgGridTactics();
		});
	}
	
	self.loadTechniques = function(){
		miterFactory.getAllTechniques().then(function(response){

			self.techniques = response.data;
			self.loadTechniquesAgGrid();
		});
	}
	
	self.goBack = function(){
		$scope.templateUrl = "viewTactics.html";
		self.isTechniquesPage = false;
		self.loadAgGridTactics();		
	}
	
	self.showTechniques = function(id){
		
		self.miter = {id:0,tacticsName:'',tacticsId:'',techniquesDetails:[]};
		
		for(var i=0;i<self.miterDetails.length;i++){
			
			if(id === self.miterDetails[i].tacticsId){
				self.miter = angular.copy(self.miterDetails[i]);
				self.technique.id = id;
				self.isTechniquesPage = true;
				$scope.templateUrl = "viewTechniques.html";
				self.loadTechniques2AgGrid();
				self.desectAll()
				break;
			}
			
		}
	}
	
	self.displayEditForTechnique = function(id){
		for(var i=0;i<self.miter.techniquesDetails.length;i++){
			if(self.miter.techniquesDetails[i].id===id){
				self.technique = angular.copy(self.miter.techniquesDetails[i]);
				self.technique.taticId = self.miter.id
				
				$("#techniques-modal").modal();
				break;
			}
		}
	}
	
	self.displayEditForTechniqueForALL = function(id){
		for(var i=0;i<self.techniques.length;i++){
			if(self.techniques[i].id===id){
				self.technique = angular.copy(self.techniques[i]);
				//self.technique.taticId = self.tacticId;
				$("#techniques-modal").modal();
				break;
			}
		}
	}
	
	self.displayEdit = function(id){
		for(var i=0;i<self.originalMiterDetails.length;i++){
			if(self.originalMiterDetails[i].id===id){
				self.miter = {id:0,tacticsName:'',tacticsId:'',techniqueName:'',platforms:'',externalRef:'',groups:''};
				self.externalReference = [];
				self.groups = [];
				self.techniqueName = [];
				self.platforms = [];
				self.miter = angular.copy(self.originalMiterDetails[i]);
				try { 
					self.externalReference = JSON.parse(self.miter.externalRef);
					self.groups = self.miter.groups.split(",")
					self.techniqueName = self.miter.techniqueName.split(",")
					self.platforms = self.miter.platforms.split(",") 
				}catch(err){}
				
				delete self.miter.groups;
				delete self.miter.techniqueName;
				delete self.miter.platforms;
				delete self.miter.externalRef;
				$("#tactics-modal").modal();
				break;
			}
		}
	}
	self.addTechniques = function(id){
		self.technique = {}
		for(var i=0;i<self.miterDetails.length;i++){
			if(self.miterDetails[i].id===id){
				self.miter = angular.copy(self.miterDetails[i]);
				self.technique.taticId = id;
				
				$("#techniques-modal").modal();

				$scope.techniquesForm.$setPristine(); 
				$scope.techniquesForm.$setUntouched(); 
				break;
			}
		}
	}
	
	self.addSingleTechnique = function(){
		if(self.technique.techniqueId == "" || self.technique.techniqueId == undefined ||  self.technique.techniqueName == "" || self.technique.techniqueName == undefined || self.technique.description == "" || self.technique.description == undefined || self.technique.paltform == "" || self.technique.paltform == undefined){
			self.tacticsMessages.push({ type: 'danger', msg: 'Please fill all the details in technique' });
			$timeout(function () {
				self.tacticsMessages = [];
			}, 2000);
		 return false;   
		}
		
		miterFactory.addTechnique(self.technique).then(function(response){

			if(response.data.status){

				self.tacticsMessages.push({ type: 'success', msg: 'Technique was updated successfully' });

				self.init();
				
				$("#techniques-modal").modal('hide');
				


				$timeout(function () {
					self.tacticsMessages = [];
				}, 2000);
			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.tacticsMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{	
					if(response.data.error.indexOf("ConstraintViolationException")!=-1){
						self.tacticsMessages.push({ type: 'danger', msg:  " Tactics  should be unique" });
					}else{
						self.tacticsMessages.push({ type: 'danger', msg:  response.data.error });
					}


				}
				$timeout(function () {
					self.tacticsMessages = [];
				}, 2000);
			}

		});
		
	}
	
	self.deleteTechniques = function(name){
		
		miterFactory.deleteTechniques(self.miter.id,name).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Tactics was deleted successfully' });
				//toastr.success("Condition was deleted successfully")

				self.init();


				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
			if(!response.data.status){
				self.alertMessagaes.push({ type: 'danger', msg: response.data.error});
				//toastr.success("Condition was deleted successfully")

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
			//unloader("body");

		}, function (error) {
			//unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.error });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}

			$timeout(function () {
				self.alertMessagaes.splice(0, 1);
			}, 2000);
		});
	}
	
	self.deleteTactics = function(id,name){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+name+'</b> Type, the whole tactic is going to be deleted',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						//loader("body");
						miterFactory.deleteTactics(id).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Tactics was deleted successfully' });
								//toastr.success("Condition was deleted successfully")

								self.init();


								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							if(!response.data.status){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.error });
								//toastr.success("Condition was deleted successfully")

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							//unloader("body");

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
	
	self.openTacticsModel = function(){
		self.miter = {id:0,tacticsName:'',tacticsId:'',techniqueName:'',platforms:'',externalRef:'',groups:''};
		self.externalReference = [];
		self.groups = [];
		self.techniqueName = [];
		self.platforms = [];
		$("#tactics-modal").modal();
		$scope.tacticsForm.$setPristine(); 
		$scope.tacticsForm.$setUntouched(); 
	}

	
	$scope.saveTactics = function(){
		if(self.techniqueName.length == 0){
			self.tacticsMessages.push({ type: 'danger', msg:  " Please enter Technique names" });
			$timeout(function () {
				self.tacticsMessages = [];
			}, 2000);
			return false;
		}
		if(self.platforms.length == 0){
			self.tacticsMessages.push({ type: 'danger', msg:  " Please enter platforms" });
			$timeout(function () {
				self.tacticsMessages = [];
			}, 2000);
			return false;
		}
		if(self.groups.length == 0){
			self.tacticsMessages.push({ type: 'danger', msg:  " Please enter Groups" });
			$timeout(function () {
				self.tacticsMessages = [];
			}, 2000);
			return false;
		}
		
		if(self.externalReference.length == 0){
			self.tacticsMessages.push({ type: 'danger', msg:  " Please enter external References" });
			$timeout(function () {
				self.tacticsMessages = [];
			}, 2000);
			return false;
		}
		for(let i=0;i<self.externalReference.length;i++){
			if(self.externalReference[i].source_name == undefined || self.externalReference[i].source_name == "" || self.externalReference[i].url == undefined || self.externalReference[i].url == ""){
				self.tacticsMessages.push({ type: 'danger', msg:  " Please enter all the details of external sources" });
				$timeout(function () {
					self.tacticsMessages = [];
				}, 2000);
				return false;
			}
		}
		self.miter.externalRef = JSON.stringify(self.externalReference);
		self.miter.techniqueName = self.techniqueName.toString();
		self.miter.groups = self.groups.toString();
		self.miter.platforms = self.platforms.toString();
		miterFactory.saveTactics(self.miter).then(function(response){

			if(response.data.status){

				self.tacticsMessages.push({ type: 'success', msg: 'Tactics was updated successfully' });

				self.init();
				
				$("#tactics-modal").modal('hide');
				


				$timeout(function () {
					self.tacticsMessages = [];
				}, 2000);
			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.tacticsMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					if(response.data.error.indexOf("ConstraintViolationException")!=-1){
						self.tacticsMessages.push({ type: 'danger', msg:  " Tactics  should be unique" });
					}


				}
				$timeout(function () {
					self.tacticsMessages = [];
				}, 2000);
			}

		});
	}
	
	
	self.init = function(){
		self.loadTactics();
		self.loadTechniques();
	}
	
	
	self.historyBack = function(){
		window.history.back();
	}
	
	
	self.deleteTechnique = function(id){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete this ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){

						
						miterFactory.deleteTechnique(id).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Technique was deleted successfully' });
								self.init();
								$scope.templateUrl = "viewTactics.html";
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							if(!response.data.status){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.error});
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
						}, function (error) {
							if(error.status== 403){
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
	self.allTechniques = [];
	self.techniqueConfig = {
			optgroupField: 'class',
			labelField: 'item',
			searchField: ['item'],
			valueField: 'item',
			create:true
	}
	
	self.groupsConfig = {
			optgroupField: 'class',
			labelField: 'item',
			searchField: ['item'],
			valueField: 'item',
			create:true
	}
	
	self.platformConfig = {
			optgroupField: 'class',
			labelField: 'platform',
			searchField: ['platform'],
			valueField: 'platform',
			create:false
	}
	
	self.platForm = [{"platform":"Windows"},{"platform":"Linux"},{"platform":"Mac"}]
	
	self.columnDefsTactics = [
	    {headerName: "Tactics",field: "tacticsName",width: 150,enableRowGroup: true,hide:true,rowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
	    {headerName: "Techniques",field: "techniqueName",width: 150,rowGroup: true,hide:true,enableRowGroup:true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
	    {headerName: "Tactics Id",field: "tacticsId",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
	    {headerName: "Group",field: "group",width: 150,rowGroup: true,hide:true,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
    ]	
	
			self.loadAgGridTactics = function(){
				$timeout(function(){
					self.tacticsGrid = {
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
							columnDefs: self.columnDefsTactics,
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
							rowData: self.miterDetails,
							rowSelection: 'single',
							floatingFilter:true,
							rowGroupPanelShow: 'always',
							onSelectionChanged: self.onSelectionChangedTactics,
							onFirstDataRendered(params) {
								params.api.sizeColumnsToFit();
							}
					}
			
					self.tacticsId = [];
					$("#tacticsContent").empty();
					$("#editTacticButton").hide();
					$("#deleteTacticButton").hide();
					$("#addTacticButton").hide();
					$("#showTechniques").hide();					
					$("#tacticsContent").css("height",$(window).height()-300+"px");
					if(self.tacticsGrid.api != undefined && self.tacticsGrid.api.getSelectedRows().length > 0){			
						self.tacticsGrid.api.deselectAll();
					}
					var eGridDiv =  document.querySelector('#tacticsContent');
					new agGrid.Grid(eGridDiv, self.tacticsGrid );
				},250);
			}
	
	
	self.onSelectionChangedTactics = function() {
		self.tacticsId = [];
		$("#editTacticButton").hide();
		$("#deleteTacticButton").hide();
		$("#addTacticButton").hide();
		$("#showTechniques").hide();
		self.tacticsId = angular.copy(self.tacticsGrid.api.getSelectedRows());
		if(self.tacticsId.length > 0){			
			$("#editTacticButton").show();
			$("#deleteTacticButton").show();
			$("#addTacticButton").show();
			$("#showTechniques").show();
		}
	}

	
	self.columnDefsTechniques = [
		{headerName: "Id",field: "techniqueId",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Technique",field: "techniqueName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Description",field: "description",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Paltform",field: "paltform",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Tactic",field: "tactic",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
	]

self.loadTechniquesAgGrid = function(){
	$timeout(function(){
		self.techniquesGrid = {
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
				columnDefs: self.columnDefsTechniques,
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

//					defaultToolPanel: 'columns'
				},
				rowData: self.techniques,
				rowSelection: 'single',
				floatingFilter:true,
				rowGroupPanelShow: 'always',
				onSelectionChanged: self.onSelectionChangedTechnique,
				onFirstDataRendered(params) {
					params.api.sizeColumnsToFit();
				}
		}

		self.techniqueId = [];
		$("#techniqueContent").empty();
		$("#editTechniqueButton").hide();
		$("#deleteTechniqueButton").hide();
		$("#techniqueContent").css("height",$(window).height()-300+"px");
		if(self.techniquesGrid.api != undefined && self.techniquesGrid.api.getSelectedRows().length > 0){			
			self.techniquesGrid.api.deselectAll();
		}
		var eGridDiv =  document.querySelector('#techniqueContent');
		new agGrid.Grid(eGridDiv, self.techniquesGrid );
	},250);
}

self.onSelectionChangedTechnique = function() {
	self.techniqueId = [];
	$("#editTechniqueButton").hide();
	$("#deleteTechniqueButton").hide();
	self.techniqueId = angular.copy(self.techniquesGrid.api.getSelectedRows());
	if(self.techniqueId.length > 0){			
		$("#editTechniqueButton").show();
		$("#deleteTechniqueButton").show();
	}
}

self.columnDefsTechniques2 = [
	{headerName: "Id",field: "techniqueId",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
	{headerName: "Technique",field: "techniqueName",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
	{headerName: "Description",field: "description",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
	{headerName: "Paltform",field: "paltform",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
]

self.loadTechniques2AgGrid = function(){
	$timeout(function(){
		self.techniquesGrid2 = {
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
				columnDefs: self.columnDefsTechniques2,
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

//					defaultToolPanel: 'columns'
				},
				rowData: self.miter.techniquesDetails,
				rowSelection: 'single',
				floatingFilter:true,
				rowGroupPanelShow: 'always',
				onSelectionChanged: self.onSelectionChangedTechnique2,
				onFirstDataRendered(params) {
					params.api.sizeColumnsToFit();
				}
		}

		self.technique2Id = [];
		$("#technique2Content").empty();
		$("#editTechnique2Button").hide();
		$("#deleteTechnique2Button").hide();
		$("#technique2Content").css("height",$(window).height-200+"px");

		if(self.techniquesGrid2.api != undefined && self.techniquesGrid2.api.getSelectedRows().length > 0){			
			self.techniquesGrid2.api.deselectAll();
		}
		var eGridDiv =  document.querySelector('#technique2Content');
		new agGrid.Grid(eGridDiv, self.techniquesGrid2 );
		},250);
	}

	$("#editTechnique2Button").hide();
	$("#deleteTechnique2Button").hide();

	self.onSelectionChangedTechnique2 = function() {
		self.technique2Id = [];
		$("#editTechnique2Button").hide();
		$("#deleteTechnique2Button").hide();
		self.technique2Id = angular.copy(self.techniquesGrid2.api.getSelectedRows());
		if(self.technique2Id.length > 0){			
			$("#editTechnique2Button").show();
			$("#deleteTechnique2Button").show();
		}
	}

	self.desectAll = function(){
		try{
			if(self.techniquesGrid2.api != undefined && self.techniquesGrid2.api.getSelectedRows().length > 0){			
				self.techniquesGrid2.api.deselectAll();
				self.technique2Id = [];
			}
		}catch(err){}
		
		try{
			if(self.techniquesGrid.api != undefined && self.techniquesGrid.api.getSelectedRows().length > 0){			
				self.techniquesGrid.api.deselectAll();
				self.techniqueId = [];
			}
		}catch(err){}
		
		try{
			if(self.tacticsGrid.api != undefined && self.tacticsGrid.api.getSelectedRows().length > 0){			
				self.tacticsGrid.api.deselectAll();
				self.tacticsId = [];
			}
		}catch(err){}
		
		$("#editTechnique2Button").hide();
		$("#deleteTechnique2Button").hide();
		$("#editTechniqueButton").hide();
		$("#deleteTechniqueButton").hide();
		$("#editTacticButton").hide();
		$("#deleteTacticButton").hide();
		$("#addTacticButton").hide();
		$("#showTechniques").hide();
		
	}
	

	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{self.tacticsGrid.api.sizeColumnsToFit();
	    	 $("#tacticsContent").css("height",$(window).height()-300+"px");}catch(err){}
	    	 try{self.techniquesGrid.api.sizeColumnsToFit();
	    	 $("#techniqueContent").css("height",$(window).height()-300+"px");}catch(err){}
	    	 try{self.techniquesGrid2.api.sizeColumnsToFit();
	    	 $("#technique2Content").css("height",$(window).height()-250+"px");}catch(err){}
	    }, 500);
	});

}]); 