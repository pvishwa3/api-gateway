app.controller("whiteListController", ['$scope', 'whiteListFactory','$rootScope','$timeout','$uibModal','$location','$ngConfirm','fileUpload','DTOptionsBuilder', 'DTColumnBuilder','$http', '$window', function ($scope, whiteListFactory,$rootScope, $timeout,$uibModal,$location,$ngConfirm,fileUpload,DTOptionsBuilder, DTColumnBuilder,$http,$window) {

	$rootScope.$broadcast('changeThemeToNormal');
	var self = this;
	self.whiteListData = {id:'',indicator:'',value:'',createdUser:'',reason:'',status:false,feedTrustScore:'',indicatorStatus:''};

	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	$scope.canShowWhiteList = true;

	self.alertMessagaes =[];
	
	$("#whiteListButton").hide();

//	'theme-dark-full'
	$scope.indicatorValue = "";
	self.indicatorChange = function(){
		$scope.indicatorValue = self.whiteListData.indicatorType;
	}
	self.showUploadForm = function(){
		$("#uploadModal").modal();
	}

	self.indicatorBack = function(){
		$scope.indicatorTemplateURL = "indcatorDetails.html";
	}

	self.createWhiteList = function(){
		self.whiteListData = {id:'',indicator:'',value:'',createdUser:'',reason:'',status:false,feedTrustScore:'',indicatorStatus:''};
		$("#createWhiteList").modal('show');
		$scope.whitelist.$setPristine()
	}


	self.dtOptions = DTOptionsBuilder.newOptions()
	.withOption('ajax', {
		url: '/feed-management/api/feedAggregator/feed/indicators',
		type: 'POST'
	})
	.withDataProp('data')
	.withOption('order', [[1, 'asc']])
	.withOption('serverSide', true)
	.withOption('processing', true)
	
	.withPaginationType('full_numbers');
	self.dtColumns = [
		DTColumnBuilder.newColumn('input').withTitle('<input type = "checkbox"  id = "checkall"/>').notSortable(),
		DTColumnBuilder.newColumn('feedName').withTitle('Feed Name'),
		DTColumnBuilder.newColumn('firstAppearance').withTitle('First Seen'),
		DTColumnBuilder.newColumn('indicator').withTitle('Type'),
		DTColumnBuilder.newColumn('lastAppearance').withTitle('Last Seen'),
		DTColumnBuilder.newColumn('source').withTitle('Feed Source'),
		DTColumnBuilder.newColumn('value').withTitle('Indicator'),
		DTColumnBuilder.newColumn('indicatorStatus').withTitle('Status'),

		];

	self.dtInstance = {};

	$scope.reloadData = function() {
		self.dtInstance._renderer.rerender(); 
	}

	
	self.ToggleTheSelected = function(){
		whiteListFactory.updateBlocklist(self.selectedIndicators).then(function (response) {
			if(response.data.status){
				self.refreshAll();
				self.alertMessagaes.push({ type: 'success', msg: 'Data saved successfully' });
				$timeout( function(){
					self.alertMessagaes =[];
				}, 2000 );

				self.refreshAll();

			}else{
				var errors = response.data.validationErrors;
				for(var i=0;i<errors.length;i++){
					self.alertMessagaes.push({ type: 'danger', msg: errors[i].defaultMessage });
				}
				$timeout( function(){
					self.alertMessagaes =[];
				}, 5000 );
				unloader("body");
			}
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
			unloader("body");
		});
	}




	$scope.uploadFile = function(){


		var file = $scope.myFile;
		var uploadUrl = "/user/whitelist/upload-indicator";
		fileUpload.uploadFileToUrl(file, uploadUrl).then(function (response) {
			if(response.data.status=="success"){
				self.refreshAll();
				if(response.data.skipedRows){
					for(var i=0;i<response.data.skipedRows.length;i++){
						self.alertMessagaes.push({ type: 'danger', msg: response.data.skipedRows[i] });
					}
				}
				$("#uploadModal").modal('hide');
				$("div.modal-backdrop").remove();
				self.alertMessagaes.push({ type: 'success', msg: "Successfully uploaded data" });
				location.reload();

			}else{
				var errors = response.data.validationErrors;
				for(var i=0;i<errors.length;i++){
					self.alertMessagaes.push({ type: 'danger', msg: errors[i].defaultMessage });
				}
				$timeout( function(){
					self.alertMessagaes =[];
				}, 5000 );
			}


		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});;
	}


	$scope.getBlockListDetails = function(){
		whiteListFactory.getBlockListDetails().then(function (response){
			$scope.rowBlockCollection = response.data;

		},function(error){

		});
	}
//	$scope.getBlockListDetails();
//	$scope.getAllWhiteListDetails();

	self.alertModalMessagaes = [];
	self.submitData = function(){

		if(self.whiteListData.indicator=='' || self.whiteListData.indicator  == undefined||self.whiteListData.value=='' || self.whiteListData.value  == undefined||self.whiteListData.reason=='' || self.whiteListData.reason  == undefined || self.whiteListData.feedTrustScore=='' || self.whiteListData.feedTrustScore == undefined ){

			self.alertModalMessagaes.push({ type: 'danger', msg: 'Please fill the highlited fields' });
			$timeout(function () {
				self.alertModalMessagaes =[];
			}, 2000);

			return false;
		}
		loader("body");


		whiteListFactory.saveBlocklist(self.whiteListData).then(function (response) {
			if(response.data.status){
				self.refreshAll();
				unloader("body");
				self.alertMessagaes.push({ type: 'success', msg: 'Data saved successfully' });
				$timeout( function(){
					self.alertMessagaes =[];
				}, 2000 );
				$("#createWhiteList").modal('hide');
				$timeout(function () {
//					$scope.getBlockListDetails();
					
				}, 5000);

			}else{
				unloader("body");
				var errors = response.data.validationErrors;
				for(var i=0;i<errors.length;i++){
					self.alertMessagaes.push({ type: 'danger', msg: errors[i].defaultMessage });
				}
				$timeout( function(){
					self.alertMessagaes =[];
				}, 5000 );
			}
		}, function (error) {
			self.alertMessagaes.push({ type: 'danger', msg: error.message});
			unloader("body");
		});




	}

	self.updateBlocklist = function(){
		loader("body");
		whiteListFactory.updateBlocklist(self.whiteListData).then(function (response) {
			if(response.data.status){
				self.refreshAll();
				self.alertMessagaes.push({ type: 'success', msg: 'Data saved successfully' });
				$timeout( function(){
					self.alertMessagaes =[];
				}, 2000 );
				$scope.reloadData();
				$("#whiteListButton").hide();

			}else{
				var errors = response.data.validationErrors;
				for(var i=0;i<errors.length;i++){
					self.alertMessagaes.push({ type: 'danger', msg: errors[i].defaultMessage });
				}
				$timeout( function(){
					self.alertMessagaes =[];
				}, 5000 );
				unloader("body");
			}
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
			unloader("body");
		});
	}

	self.updateWhitelist= function(){
		loader("body");
		whiteListFactory.updateWhitelist(self.whiteListData).then(function (response) {
			if(response.data.status){
				self.refreshAll();
				self.alertMessagaes.push({ type: 'success', msg: 'Data saved successfully' });
				$timeout(function () {
					self.alertMessagaes =[];
				}, 2000);
				$("#createWhiteList").modal('hide');
				$timeout(function () {
					$scope.getAllWhiteListDetails();
					unloader("body");
				}, 5000);
			}else{
				var errors = response.data.validationErrors;
				for(var i=0;i<errors.length;i++){
					self.alertMessagaes.push({ type: 'danger', msg: errors[i].defaultMessage });
				}
				$timeout( function(){
					self.alertMessagaes =[];
				}, 5000 );
				unloader("body");
			}


		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
			unloader("body");
		});
	}


	self.displayWhitelistUpdate = function(data){
		console.log(data);
		$("#createWhiteList").modal('show');
		self.selectedList='whitelist';
		self.whiteListData = angular.copy(data);
	}

	self.displayBlockUpdate = function(data){
		console.log(data); 	
		$("#createWhiteList").modal('show');
		self.selectedList= 'blocklist';
		self.whiteListData = angular.copy(data);
	}

	self.deleteWhiteList = function(id){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete WhiteList',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						whiteListFactory.deleteWhiteList(id).then(function(response){
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Whitelist was deleted successfully' });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
//								$scope.getAllWhiteListDetails();
								self.refreshAll();
							}
							unloader("body");
						},function(error){
							unloader("body");
						})
						return true;
					}
				},
				close: function(scope, button){
				}
			}
		});

	}
	self.deleteBlockList = function(id){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete BlockList',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						loader("body");
						whiteListFactory.deleteBlockList(id).then(function(response){
							if(response.data.status){
								self.refreshAll();
								self.alertMessagaes.push({ type: 'success', msg: 'Blocklist was deleted successfully' });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
//								$scope.getBlockListDetails();
							}
							unloader("body");
						},function(error){
							unloader("body");
						})
						return true;
					}
				},
				close: function(scope, button){
				}
			}
		});

	}

	self.fileUpload = function(){
		console.log(self.uploadedFile.name);
		let data = new FormData();
		data.append("file", self.uploadedFile.name);
		if(self.fileType == 'whitelist'){
			whiteListFactory.uploadThisFileWhite(data).then(function(response){
				var status = JSON.parse(response.data);
				if(status.status === "success"){
					self.refreshAll();
					$("#addList").modal('hide');
					self.alertMessagaes.push({ type: 'success', msg: 'Blocklist was deleted successfully' });
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);

				}


			},function(Error){

			});
		}else if(self.fileType == 'blocklist'){
			whiteListFactory.uploadThisFileBlock(data).then(function(response){

				var status = JSON.parse(response.data);
				if(status.status === "success"){
					self.refreshAll();
					$("#addList").modal('hide');
					self.alertMessagaes.push({ type: 'success', msg: 'Blocklist was deleted successfully' });
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);

				}

			},function(Error){

			});
		}

	}

	self.historyBack = function(){
		window.history.back();
	}
	
	
	
	//ag-grid table 
	
	function EnterpriseDatasource() {}

	$scope.params;
	$scope.request;
	EnterpriseDatasource.prototype.getRows = function (params) {
		let jsonRequest = JSON.stringify(params.request, null, 2);
		$scope.params = params;
		$scope.request = params.request;
		self.loadIndicatorsData(params.request,params);

	};

	

	

	self.selectedIndicators = [];
	$scope.alertMessages = [];
	self.onSelectionChanged = function() {
		var selectedRows = gridOptions.api.getSelectedRows();
		self.selectedIndicators = [];
		$("#whiteListButton").hide();
		var status = [];
		selectedRows.forEach( function(selectedRow, index) {
			status.push(selectedRow.indicatorStatus);
		});
		if(!(status.every( (val, i, status) => val === status[0] ))){
			self.alertMessagaes.push({ type: "danger", msg: "please select all the types as same i.e., either whitelist or blocklist"});
			$scope.alertMessages.push({ type: "danger", msg: "please select all the types as same i.e., either whitelist or blocklist"});
			gridOptions.api.deselectAll();
			$timeout(function(){
				self.alertMessagaes = [];
				$scope.alertMessages = [];
			},500000);
		}else{
			selectedRows.forEach( function(selectedRow, index) {
				self.selectedIndicators.push({
					id:selectedRow.id,status:selectedRow.indicatorStatus,value:selectedRow.value
				});
			});
			if(self.selectedIndicators.length > 0){
				$("#whiteListButton").show();
			}
		}
	}

	var  gridOptions = {
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
			rowBuffer: 0,
			rowModelType: 'serverSide',
			rowGroupPanelShow: 'always',
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
//				defaultToolPanel: 'columns'
			},
			maxConcurrentDatasourceRequests: 2,
			cacheBlockSize: 500,
			maxBlocksInCache: 2,
			purgeClosedRowNodes: false,
			suppressRowClickSelection: false,
			floatingFilter:true,
		    rowSelection: 'multiple',
			onSelectionChanged: self.onSelectionChanged,
			onFirstDataRendered(params) {
				params.api.sizeColumnsToFit();
			}
	}
	
	self.intializeGrid = function(){

		var columnDefs = [];
		
			columnDefs.push({headerName:"Feed Name", field: "feedName", width: 200, enableRowGroup: true, headerCheckboxSelection: false,  headerCheckboxSelectionFilteredOnly: true,checkboxSelection: true,filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Type", field: "indicator", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"First Seen", field: "firstAppearance",width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Last Seen", field: "lastAppearance",width: 200,enableRowGroup: true, filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Feed Source", field: "source", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Indicator", field: "value", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});
			columnDefs.push({headerName:"Status", field: "indicatorStatus", width: 200,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams:{
		        filterOptions:['contains'],suppressAndOrCondition:true }});

		gridOptions['columnDefs'] = columnDefs;

		var gridDiv = document.querySelector('#myGrid');
		new agGrid.Grid(gridDiv, gridOptions);

		gridOptions.api.setEnterpriseDatasource(new EnterpriseDatasource());
	}
	
	self.loadIndicatorsData = function(request,params){

		$http.post("/feed-management/api/feedAggregator/feed/indicators",request).then(function(response){
			params.successCallback(response.data.data,response.data.lastRow);
			unloader("body");
		},function(error){
			console.log(error)
			unloader("body");
		});
	}
	
	function isForceRefreshSelected() {
	    return document.querySelector('#myGrid');
	}

	self.refreshAll = function() {
		loader("body");
		gridOptions.api.deselectAll();
		$("#whiteListButton").hide();
		self.loadIndicatorsData($scope.request,$scope.params);
	}
	
	$("#myGrid").empty();
	$("#myGrid").css("height",$(window).height()-250+"px");
	self.intializeGrid();


	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{gridOptions.api.sizeColumnsToFit();
	    	 $("#myGrid").css("height",$(window).height()-250+"px");
	    	 }catch(err){}
	    }, 500);
	});
	
}]);
