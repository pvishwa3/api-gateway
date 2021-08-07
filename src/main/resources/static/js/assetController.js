app.controller("assetController",['$scope','assetFactory','$sessionStorage','$ngConfirm','$timeout','fileUpload', '$window','conditionFactory', function($scope,assetFactory,$sessionStorage,$ngConfirm,$timeout,fileUpload, $window,conditionFactory){
	
	var self = this;
	$scope.templateUrl = "asset.html";
	
	$scope.showHomeButton = true;
	$scope.showCreateEventButton = false;
	$scope.showUpdateEventButton = false;
	
	$scope.operationType = "insert";
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	$scope.caseFiles;
	
	$scope.themeType = $window.localStorage.getItem("themeType");
	
	
	self.canDelete = false;
	self.canUpdate = false;
	self.canCreate = false;
	
	$("#addAsset").hide();
	$("#uploadAssest").hide();
	
	
	self.loadPermissions = function(){

		loader("body");

		conditionFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("add assest")!=-1){
				self.canCreate = true;
				$("#addAsset").show();
				$("#uploadAssest").show();
				
			}
			if(response.data.indexOf("update assest")!=-1){
				self.canUpdate = true;
			}
			if(response.data.indexOf("delete assest")!=-1){
				self.canDelete = true;
			}
			

			unloader("body");

		


		},function(error){
			unloader("body");
		});
	}


	self.assertGroups  = [];

	self.getAssetGroups = function(){

	    assetFactory.getAssetGroups().then(function(response){
    			self.assertGroups  = angular.copy(response.data);
    	 },function(error){
    	});
	}

	self.getAssetGroups();

    self.assertGroup = {groupName:'',id:0};

	self.saveAssetGroups = function(data){
	 assetFactory.saveAssetGroups(data).then(function(response){
        	if(response.status === 201){
        	    self.alertModalMessages.push({type:"success",msg:"Asset Group Creation Was Successful"});
        	}else{
        	    self.alertModalMessages.push({type:"danger",msg:"Unable to create Asset group"});
        	}
        	$timeout(function(){
            	self.alertModalMessages =[];
            },3000);
       },function(error){
                self.alertModalMessages.push({type:"danger",msg:"Unable to create Asset group"});
                $timeout(function(){
                     self.alertModalMessages =[];
                },3000);
      });
	}


    self.temp = {field:''}


	self.assestGroupConfig = {

    			optgroupField: 'class',
    			labelField: 'groupName',
    			searchField: ['groupName'],
    			valueField: 'groupName',
    			create: function(value,silent){
    				self.assertGroup.groupName = value;
    				self.saveAssetGroups(self.assertGroup);
                    self.assertGroups.push({id:0,groupName:value})
    				return true;
    			},
    	};




	self.allAssets = [];
	self.alertMessages = [];
	self.newasset ={ipAddress:'',hostname:'',macAddress:'',assertId:'',id:0};
	self.getAllAssets = function(){		
		assetFactory.getAllAssets($sessionStorage.user.companyName).then(function(response){
			self.allAssets  = angular.copy(response.data.resultData);
		},function(error){
		});
	}


	
	$scope.uploadAssetsFile = function(){
		var file = $scope.caseFiles;

		console.log('file is ' );
		console.dir(file);
		var uploadUrl = "/siem-core/user/asset/uploadAsset/";
		fileUpload.uploadFileToUrl(file, uploadUrl).then(function(response){
			self.alertMessages.push({type:"success",msg:"Saved successfuly"});
			$("#upload_csv_files").modal("hide");
			$scope.showHomeButton = true;
			$scope.showCreateEventButton = false;
			$scope.showUpdateEventButton = false;		
			$timeout(function(){
				self.alertMessages =[];
			},3000);
			self.loadIndicatorsData($scope.request,$scope.params);
		},function(error){
			$("#upload_csv_files").modal("hide");
			self.alertMessages.push({type:"danger",msg: error.data.data});
			$timeout(function(){
				self.alertMessages =[];
			},3000);
		});
	}
	self.alertModalMessages = [];
	self.saveAsset = function(){
		if(self.newasset.ipAddress=='' || self.newasset.hostname == '' || self.newasset.macAddress == '' || self.newasset.assertId == '' ||
		self.newasset.ipAddress==undefined|| self.newasset.hostname == undefined|| self.newasset.macAddress == undefined){
			self.alertModalMessages.push({type:"danger",msg:"Please fill the highlighted fields"});
			$timeout(function(){
				self.alertModalMessages = [];
			},3000)
			
			
		}else if(!(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(self.newasset.ipAddress))){
			self.alertModalMessages.push({type:"danger",msg:"Please enter a valid source IP"});
			$timeout(function(){
				self.alertModalMessages = [];
			},3000)

		}
		else if(!(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(self.newasset.macAddress))){
			self.alertModalMessages.push({type:"danger",msg:"Please enter a valid MAC address"});
			$timeout(function(){
				self.alertModalMessages = [];
			},3000)
		}else if(self.temp.field===""){
		self.alertModalMessages.push({type:"danger",msg:"Please Select Group"});
        			$timeout(function(){
        				self.alertModalMessages = [];
        },3000)
         return false;
		}

		else if($scope.operationType === 'insert'){

		self.newasset['groupName'] = self.temp.field.join(',');


			assetFactory.saveAsset(self.newasset).then(function(response){
				if(response.status === 201){
					self.alertMessages.push({type:"success",msg:"Saved successfuly"});
					$("#create_new_assets").modal("hide");
					$scope.showHomeButton = true;
					$scope.showCreateEventButton = false;
					$scope.showUpdateEventButton = false;		
					$timeout(function(){
						self.alertMessages =[];
					},3000);
				}else{
					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){
							self.alertModalMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.alertModalMessages.push({ type: 'danger', msg: response.data.data });
					}
					$timeout(function () {
						self.alertModalMessages = [];
					}, 3000);
				}
				self.loadIndicatorsData($scope.request,$scope.params);
			},function(error){
				if(error.status === 403){
					self.alertModalMessages.push({type:"danger",msg:error.data.data});
				}
				$timeout(function(){
					self.alertModalMessages =[];
				},3000);
			});
		}else{
		    self.newasset['groupName'] = self.temp.field.join(',');
			assetFactory.updateAssest(self.newasset).then(function(response){
				if(response.data.status){
					self.alertMessages.push({type:"success",msg:"Saved successfuly"});
					$("#create_new_assets").modal("hide");
					$scope.showHomeButton = true;
					$scope.showCreateEventButton = false;
					$scope.showUpdateEventButton = false;		
					self.loadIndicatorsData($scope.request,$scope.params);
					$timeout(function(){
						self.alertMessages =[];
					},3000);
					
					$("#deleteAsset").hide();
					$("#editAsset").hide();
				}else{
					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){
							self.alertModalMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.alertModalMessages.push({ type: 'danger', msg: response.data.data });
					}
					$timeout(function () {
						self.alertModalMessages = [];
					}, 3000);
				}
			},function(error){
				if(error.status === 403){
					self.alertModalMessages.push({type:"danger",msg:error.data.data});
				}
				$timeout(function(){
					self.alertModalMessages =[];
				},3000);
			});
		}
		
	}
	
	self.newAsset = function(){
		$scope.operationType = "insert";
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;			
		$("#create_new_assets").modal("show");
		self.newasset = {company:$sessionStorage.user.companyName};
	}
	
	self.editAsset = function(data){
		$scope.operationType = "update";
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;			
		$("#create_new_assets").modal("show");
		self.newasset = angular.copy(data);
		self.newasset.hostname = data.hostName
		console.log(self.newasset);
	}
	
	self.uploadAsset = function(){
		$("#upload_csv_files").modal();
	}
	
	self.deleteAsset = function(id,mac){
		
		var tempIds = [];
		
		for(var i=0;i<self.selectedAssets.length;i++){
			tempIds.push(self.selectedAssets[i].id)
		}
		
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
						assetFactory.deleteAsset (tempIds).then(function (response) {
							if(response.data.status){
								$("#create_new_assets").modal("hide");
								self.refreshAll();
								self.alertMessages.push({type:"success",msg:" Deleted successfully"});
								$timeout(function(){
									self.alertMessages =[];
								},3000);
							}
						},function(error){
							if(error.status === 403){
								self.alertMessages.push({type:"danger",msg:error.data.data});
							}
							$timeout(function(){
								self.alertMessages =[];
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
	
	
	self.historyBack = function(){
		window.history.back();
	}
	
	
	//ag-grid
	
	
	

	

	
$("#deleteAsset").hide();
$("#editAsset").hide();
	self.selectedAssets = [];
	self.onSelectionChanged = function() {
		var selectedRows = self.assertGridOptions.api.getSelectedRows();
		self.selectedAssets = [];
		$("#deleteAsset").hide();
		$("#editAsset").hide();
		selectedRows.forEach( function(selectedRow, index) {
			self.selectedAssets.push(selectedRow);
		});
		if(self.selectedAssets.length ===1){
			if(self.canUpdate){
				$("#editAsset").show();
			}
			if(self.canDelete){
				$("#deleteAsset").show();
			}
			
			
		}else if(self.selectedAssets.length>1){
			if(self.canUpdate){
				$("#editAsset").hide();
			}
			if(self.canDelete){
				$("#deleteAsset").show();
			}
			
			
		}else{
			
			$("#deleteAsset").hide();
			$("#editAsset").hide();
		}
		
	}

	
	
	self.intializeGrid = function(){

		self.loadPermissions();
		self.loadIndicatorsData();
		
	}
	self.assertGridOptions = {};
	
	self.loadIndicatorsData = function(){
		
		assetFactory.getAssets().then(function(response){
			
			
			self.assertGridOptions = {
					defaultColDef: {
						width: 100,
						sortable: false,
						resizable: true,
						filter: true,
						editable: false
					},
					autoGroupColumnDef: {
						width: 180
					},
					
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
					
					
					suppressRowClickSelection: false,
					floatingFilter:true,
				    rowSelection: 'multiple',
					onSelectionChanged: self.onSelectionChanged,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}
			
			var columnDefs = [];
			columnDefs.push({headerName:"IP Address", field: "ipAddress", width: 200,enableRowGroup: false,headerCheckboxSelectionFilteredOnly: true,checkboxSelection: true,filter: 'agTextColumnFilter',filterParams:{
				filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Host Name", field: "hostName", width: 200,headerCheckboxSelection: false,  filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Mac Address", field: "macAddress",width: 200,enableRowGroup: false,filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});

			self.assertGridOptions['columnDefs'] = columnDefs;
			self.assertGridOptions['rowData'] = response.data;
		
		
		$("#asset-grid").empty();
		var gridDiv = document.querySelector('#asset-grid');
		new agGrid.Grid(gridDiv, self.assertGridOptions);
		$("#asset-grid").css("height",$(window).height()-300+"px");
			
		},function(error){
			if(error.status === 403){
				self.alertMessages.push({type:"danger",msg:error.data.data});
			}
			$timeout(function(){
				self.alertMessages =[];
			},3000);
		});
	}
	
	function isForceRefreshSelected() {
	    return document.querySelector('#myGrid');
	}

	self.refreshAll = function() {
		
		
		$("#deleteAsset").hide();
		$("#editAsset").hide();
		
		self.loadIndicatorsData();
	}
	
	$("#myGrid").empty();
	 

	self.intializeGrid();
	$(window).resize(function() {
	     setTimeout(function() {
	    	 
	    	 try{self.assertGridOptions.api.sizeColumnsToFit();
	    	 $("#asset-grid").css("height",$(window).height()-300+"px");
	    	 }catch(err){}
	    }, 500);
	});
}])