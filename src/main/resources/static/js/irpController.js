app.controller("irpController",['$scope','$timeout','$sessionStorage','irpFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$ngConfirm','$uibModal','fileUpload',function($scope,$timeout,$sessionStorage,irpFactory,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$ngConfirm,$uibModal,fileUpload){

	var self = this;

	self.myEditor = {} ;

	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	self.loadMxGraph = function(data){
		(function()
				{

			Editor.useLocalStorage = true

			var editorUiInit = EditorUi.prototype.init;

			EditorUi.prototype.init = function()
			{
				editorUiInit.apply(this, arguments);
				this.actions.get('export').setEnabled(false);

				this.actions.get('open').setEnabled(false);
				this.actions.get('import').setEnabled(false);
				this.actions.get('save').setEnabled(false);
				this.actions.get('saveAs').setEnabled(false);
				this.actions.get('export').setEnabled(false);
				this.actions.get('new').setEnabled(false);


				// Updates action states which require a backend

			};

			// Adds required resources (disables loading of fallback properties, this can only
			// be used if we know that all keys are defined in the language specific file)
			mxResources.loadDefaultBundle = false;
			var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
			mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

			// Fixes possible asynchronous requests
			mxUtils.getAll([bundle,   'js/mxGraph/default.xml'], function(xhr)
					{
				// Adds bundle text to resources
				mxResources.parse(xhr[0].getText());

				// Configures the default graph theme
				var themes = new Object();
				themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement(); 

				// Main
				self.myEditor = 	new EditorUi(new Editor(urlParams['chrome'] == '0', themes),document.getElementById("editor-ui-container"));

				if(data){
					let doc = mxUtils.parseXml(data);

					self.myEditor.editor.setGraphXml(doc.documentElement);
				}

					}, function()
					{
						document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
					});
				})();
	}

	//self.loadMxGraph();
	

	self.irp ={id:0,templateName:"",description: "",irpXml:""};
//	self.steps = {"Preparation":[{"action":""}],"Identification":[{"action":""}],"Containment":[{"action":""}],"Investigation":[{"action":""}],"Eradication":[{"action":""}],"Recovery":[{"action":""}],"FollowUp":[{"action":""}]};
	self.steps = [{"key":"preparation","value":[{"action":""}]},{"key":"Identification","value":[{"action":""}]},{"key":"Containment","value":[{"action":""}]},{"key":"Investigation","value":[{"action":""}]},{"key":"Eradication","value":[{"action":""}]},{"key":"Recovery","value":[{"action":""}]},{"key":"FollowUp","value":[{"action":""}]}];
	self.alertMessagaes =[];
	$scope.showHomeButton = true;
	$scope.showCreateEventButton = false;
	$scope.showUpdateEventButton = false;
	self.showAttachment = false;

	$scope.templateUrl = "all-irps.html";

	self.allIRPs  = [];

	self.getirpdetails = function() {
		irpFactory.getAllIRPS().then(function(response){
			self.allIRPs = angular.copy(response.data);
			self.loadAgGrid();
		},function(error){

		});
	}

	self.addNewNote = function(index){
		self.steps[index].value.push({"action":""});
	}

	self.deleteNote = function(parentIndex,childIndex){
		if(self.steps[parentIndex].value.length > 1){			
			self.steps[parentIndex].value.splice(childIndex,1);
		}else{
			self.alertMessagaes.push({type:"danger",msg:"Each step should have atleast one note"});
			$timeout(function(){
				self.alertMessagaes = [];
			},2000);
		}
	}

	self.clone = function(data){
		
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
		self.showAttachment = true;

		$scope.templateUrl = "irp-new.html";
		self.irp = angular.copy(data);
		self.irp.templateName = "Clone_"+data.templateName;
		self.irp.id = 0;
		self.loadMxGraph(data.irpXml);
		$("#viewButton").hide();
		$("#deleteButton").hide();
		$("#cloneButton").hide();
	}


	self.getirpdetails();

	self.openNewIRP = function(){
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;
		self.showAttachment = false;
		$scope.templateUrl = "irp-new.html";
		self.irp ={templateName:"",description: "",id:0,irpXml:''};
//		self.steps = [{"Preparation":[{"action":""}],"Identification":[{"action":""}],"Containment":[{"action":""}],"Investigation":[{"action":""}],"Eradication":[{"action":""}],"Recovery":[{"action":""}],"FollowUp":[{"action":""}]};
		self.steps = [{"key":"preparation","value":[{"action":""}]},{"key":"Identification","value":[{"action":""}]},{"key":"Containment","value":[{"action":""}]},{"key":"Investigation","value":[{"action":""}]},{"key":"Eradication","value":[{"action":""}]},{"key":"Recovery","value":[{"action":""}]},{"key":"FollowUp","value":[{"action":""}]}];

		loader("body");
		setTimeout(function(){
			unloader("body");
		},4000);
		setTimeout(function(){

			self.loadMxGraph();
		}, 3000);



	}

	self.goback = function() {
		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		$scope.templateUrl = "all-irps.html";
		self.getirpdetails();
	}

	self.deleteAccordian = function(index){
		try{			
			self.steps.splice(index,1);
		}catch(err){
			console.log(err);
		}
	}
	self.addNewAccordian = function(){
		self.steps.push({key:"Step "+Math.floor(Math.random()* 100)+1,"value":[{"action":""}]})
	}

	self.checkName = function(data,key,index){
		if(data == undefined || data == ""){
			return "Please enter the step name";
		}else{
			for(let i=0;i<self.steps.length;i++){
				if(self.steps[i].key == data){
					return "Step name should be unique";	
				}
			}
		}

	}

	$scope.sample = function(data){
		console.log(data);
	}
	self.saveiprDetails = function(){

		self.irp.irpXml = mxUtils.getXml(self.myEditor.editor.getGraphXml());
		var regex = new RegExp("^[A-Za-z0-9-_\\s-]+$");

		if(self.irp.templateName == "" || self.irp.templateName == undefined){
			self.alertMessagaes.push({type:"danger",msg:"Please enter the IRP name"});
			$timeout(function(){
				self.alertMessagaes = [];
			},2000);
			return false;
		}else if(self.irp.description == "" ||self.irp.description == undefined ){
			self.alertMessagaes.push({type:"danger",msg:"Please enter the IRP Description"});
			$timeout(function(){
				self.alertMessagaes = [];
			},2000);
			return false;
		}else if(!regex.test(self.irp.templateName)){
			self.alertMessagaes.push({type:"danger",msg:"Special charactors are not allowed in IRP name"});
			$timeout(function(){
				self.alertMessagaes = [];
			},4000);
			return false;
		}



		try{

			irpFactory.saveIrp(self.irp).then(function(response){
				if(response.data.status){
					self.goback();
//					self.getirpdetails();
					self.alertMessagaes.push({type:"success",msg:"Sucessfully saved the IRP"});
					$timeout(function(){
						self.alertMessagaes= [];
					},2000)
				}else{
					self.alertMessagaes.push({type:"danger",msg:"Unable to save the IRP reason: "+ response.data.msg});
					$timeout(function(){
						self.alertMessagaes= [];
					},2000)
				}

			},function(error){
				console.log(error)
			});

		}catch(err){
			console.log(err)
		}
	}



	self.edit = function(data){
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
		self.showAttachment = true;

		$scope.templateUrl = "irp-new.html";
		self.irp = angular.copy(data);
		self.loadMxGraph(data.irpXml);
	}

	self.delete = function(id,templateName){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+templateName+'</b> IRP ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						irpFactory.deleteIRP(id).then(function(response){
							if(response.data.status){
								self.alertMessagaes.push({type:"success",msg:"Sucessfully deleted the IRP"});
								self.goback();
								self.getirpdetails();
								$timeout(function(){
									self.alertMessagaes= [];
								},2000)
							}else{
								self.alertMessagaes.push({type:"danger",msg:"Unable to delete the IRP reason: "+response.data.msg});
								$timeout(function(){
									self.alertMessagaes= [];
								},2000)
							}

							unloader("body");
						},function(error){
							console.log(error)
							self.alertMessagaes.push({type:"danger",msg:"Unable to delete the IRP reason: "+response.data.msg});
							$timeout(function(){
								self.alertMessagaes= [];
							},2000)
							unloader("body");
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});

	}
	
	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [1, 'asc'])
	.withPaginationType('full_numbers')
	.withDisplayLength(25)
	.withOption('scrollY', $( window ).height()-350);
//	.withOption('scrollCollapse', false);	 
	
	self.historyBack = function(){
		window.history.back();
	}

	self.options = {
			height: 200,
			focus: true,
			airMode: false,
			toolbar: [
				['edit',['undo','redo']],
				['headline', ['style']],
				['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
				['fontface', ['fontname']],
				['textsize', ['fontsize']],
				['fontclr', ['color']],
				['table', ['table']],
				['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
				['height', ['height']],
				['insert', ['link','hr']],
				['view', ['fullscreen', 'codeview']]
				]
	};
	
	
	self.columnDefs = [
		{headerName: "IRP Name",field: "templateName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "IRP Description",field: "description",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Created By",field: "createdBy",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Created At",field: "createdAt",valueGetter: function(params) {
	    	if(params.data != undefined){	
	    		if(params.data.createdAt != undefined){	    			
	    			return moment(params.data.createdAt).format('LLLL');
	    		}
	    	}
		},width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Updated At",field: "updatedAt",valueGetter: function(params) {
	    	if(params.data != undefined){
	    		if(params.data.updatedAt != undefined){
	    			return moment(params.data.updatedAt).format('LLLL');
	    		}
	    	}
		},width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Updated By",field: "updatedBy",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
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
							rowData: self.allIRPs,
							rowSelection: 'single',
							floatingFilter:true,
							rowGroupPanelShow: 'always',
							onSelectionChanged: self.onSelectionChanged,
							onFirstDataRendered(params) {
								params.api.sizeColumnsToFit();
							}
					}
			
					self.tagsId = [];
					$("#irpContent").empty();
					$("#viewButton").hide();
					$("#deleteButton").hide();
					$("#cloneButton").hide();
					 $("#irpContent").css("height",$(window).height()-250+"px");
					if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
						self.eventGrid.api.deselectAll();
					}
					var eGridDiv =  document.querySelector('#irpContent');
					new agGrid.Grid(eGridDiv, self.eventGrid );
				},250);
			}
	
	self.onSelectionChanged = function() {
		self.irpsId = [];
		$("#viewButton").hide();
		$("#deleteButton").hide();
		$("#cloneButton").hide();
		self.irpsId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.irpsId.length > 0){			
			$("#viewButton").show();
			$("#deleteButton").show();
			$("#cloneButton").show();
		}
	}
	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{self.eventGrid.api.sizeColumnsToFit();
	    	 $("#irpContent").css("height",$(window).height()-250+"px");}catch(err){}
	    }, 500);
	});
	

}]);
