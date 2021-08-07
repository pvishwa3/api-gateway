app.controller("collectionController",['$scope','collectionFactory','$timeout','$http','$rootScope','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder' ,function($scope, collectionFactory, $http, $timeout,$rootScope,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {

	var ctrl = this;
	$scope.currentTab = "collection";
	$rootScope.$broadcast('changeThemeToNormal');
	$scope.timeRange = "Today";

	$scope.source = "";

	ctrl.alertMessages = [];

	ctrl.canEnableOrDisableCollectors = false;

	ctrl.loadPermission = function(){
		collectionFactory.loadPermissions().then(function (response) {
			if(response.data.indexOf("enable/disable collectors")!=-1){
				ctrl.canEnableOrDisableCollectors = true;
			}
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}


	$scope.update = function(){
		var startDate ;
		var endDate;
		if($scope.timeRange === "oneHour"){
			startDate = moment(new Date()).subtract(1, 'hours');
			endDate = moment(new Date());
		}
		if($scope.timeRange === "Today"){
			startDate = moment(new Date()).startOf('day');
			endDate = moment(new Date());
		}
		if($scope.timeRange === "15min"){
			startDate = moment(new Date()).subtract(15, 'minutes');
			endDate = moment(new Date());
		}
		if($scope.timeRange === "60mins"){
			startDate = moment(new Date()).subtract(1, 'minutes');
			endDate = moment(new Date());
		}
		if($scope.timeRange === "3hours"){
			startDate = moment(new Date()).subtract(3, 'hours');
			endDate = moment(new Date());
		}
		if($scope.timeRange === "6hours"){
			startDate = moment(new Date()).subtract(6, 'hours');
			endDate = moment(new Date());
		}
		if($scope.timeRange === "12hours"){
			startDate = moment(new Date()).subtract(12, 'hours');
			endDate = moment(new Date());
		}
		if($scope.timeRange === "24hours"){
			startDate = moment(new Date()).subtract(24, 'hours');
			endDate = moment(new Date());
		}
		$scope.displayTotalMessageDetails(startDate.valueOf(),endDate.valueOf(),$scope.source);
		//$scope.updateSourceInformation(startDate.valueOf(),endDate.valueOf());

	}


	$scope.openActiveTab = function(tabName){

		$scope.currentTab = tabName;
		if(tabName==="status"){
			var startDate = moment(new Date()).startOf('day');
			var endDate = moment(new Date());
			$scope.displayTotalMessageDetails(startDate.valueOf(),endDate.valueOf(),$scope.source)
		}else{
			collectionFactory.getDetails().then(function(response){
				$scope.collections = response.data;
				$scope.loadAgGrid();
//				$scope.getCollectionsStats();
			}, function (error) {
				if(error.status== 403){
					ctrl.alertMessages.push({ type: 'danger', msg: error.data.data });

					$timeout(function () {
						ctrl.alertMessages = [];
					}, 2000);
				}
			});
		}
	}



	$scope.getCollectionDetails = function(){
		collectionFactory.getDetails().then(function(response){
			$scope.collections = response.data;
			$scope.loadAgGrid();

		}, function (error) {
			if(error.status== 403){
				ctrl.alertMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					ctrl.alertMessages = [];
				}, 2000);
			}
			$scope.loadAgGrid();
		});
		
	}

	$scope.showSources = function(hostname){
		$scope.hostname = hostname;
		$('#source-modal').modal('show'); 
		collectionFactory.getSourceInformation(hostname).then(function(response){
			$scope.sourceDetails = response.data;
			for(var i=0;i<$scope.sourceDetails.length;i++){
				$scope.sourceDetails[i].firstseen=moment($scope.sourceDetails[i].firstseen).format("DD-MM-YYYY hh:mm A");
				$scope.sourceDetails[i].lastseen=moment($scope.sourceDetails[i].lastseen).format("DD-MM-YYYY hh:mm A");
			}
		}, function (error) {
			if(error.status== 403){
				ctrl.alertMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					ctrl.alertMessages = [];
				}, 2000);
			}
		});
	}

	$scope.updateSourceInformation = function(startDate,endDate){

		collectionFactory.getMessagesCount(startDate,endDate,$scope.source).then(function(response){
			var data = {
					"chart": {
						"showBorder":'0',
						"bgColor": "#DDDDDD",
						"borderAlpha": "20",
						"showCanvasBorder": "0",
						"usePlotGradientColor": "0",
						"plotBorderAlpha": "10",
						"legendBorderAlpha": "0",
						"legendShadow": "0",
						"valueFontColor": "#ffffff",                
						"showXAxisLine": "1",
						"showSum": "0",
						"fill":"red",
					
						"divLineIsDashed": "1",
						"showAlternateHGridColor": "0",
						"subcaptionFontBold": "0",
						"subcaptionFontSize": "14",
						"showHoverEffect":"1",
						"showValues":"1",
						"palettecolors":"#0075c2"
					},
					"data": response.data
			}
			renderBarChart(data,"totalMessageContainer")
		}, function (error) {
			if(error.status== 403){
				ctrl.alertMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					ctrl.alertMessages = [];
				}, 2000);
			}
		});
	}
	$scope.refresh = function(){

	}
	$scope.displayTotalMessageDetails = function(startDate,endDate,source){
		collectionFactory.getMessagesCount(startDate,endDate,source).then(function(response){
			for(var i=0;i<response.data.length;i++){
				response.data[i].label=moment(response.data[i].label).format("hh:mm");
			}

			var data = {
					"chart": {
						"showBorder":'0',
						"bgColor": "#DDDDDD",
						"borderAlpha": "20",
						"showCanvasBorder": "0",
						"usePlotGradientColor": "0",
						"plotBorderAlpha": "10",
						"legendBorderAlpha": "0",
						"legendShadow": "0",
						"valueFontColor": "#ffffff",                
						"showXAxisLine": "1",
						"showSum": "0",
						"xAxisLineColor": "#999999",
						"divlineColor": "#999999",               
						"divLineIsDashed": "1",
						"showAlternateHGridColor": "0",
						"subcaptionFontBold": "0",
						"subcaptionFontSize": "14",
						"showHoverEffect":"1",
						"showValues":"1",
						"palettecolors":"#0075c2"
					},
					"data": response.data
			}
			renderBarChart(data,"totalMessageContainer")
		}, function (error) {
			if(error.status== 403){
				ctrl.alertMessages.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					ctrl.alertMessages = [];
				}, 2000);
			}
		});



	}

	function renderBarChart(data,container){
		FusionCharts.setCurrentRenderer('javascript');
		var myChart = new FusionCharts("FusionCharts/Column2D.swf", Math.random(), "100%", "200", "0","1");
		myChart.setChartData(data, "json");
		myChart.render(container);
	}


	

	ctrl.alertMessagaes=[];
	$scope.changeStatus = function(){
		
		collectionFactory.changeHostStatus($scope.selectedData).then(function(response){
			ctrl.alertMessagaes.push({ type: 'success', msg: response.data.msg});
		
			$scope.getCollectionDetails();
			setTimeout(function() {
				$(".alert").hide();
				ctrl.alertMessagaes = [];
			}, 2000);
//			$scope.getCollectionsStats();
		}, function (error) {
			if(error.status== 403){
				ctrl.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function() {
					ctrl.alertMessagaes = [];
				}, 2000);
			}
		});


	}
	$scope.closeAlert=function(id){
		ctrl.alertMessagaes.splice(id, 1);
	}

	$scope.columnDefs = [
		{headerName: "Source Host",field: "source_host",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "MAC Address",field: "macAddress",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "IP Address",field: "ipAddress",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "First Seen",field: "first_seen",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Last Seen",field: "last_seen",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Count",field: "count",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Status",field:"status",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
    ]
	
	$scope.loadAgGrid = function(){
			try {
			$scope.eventGrid = {
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
					columnDefs: $scope.columnDefs,
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
					rowData: $scope.collections,
					rowSelection: 'single',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: $scope.onSelectionChanged,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}
	
			$scope.tagsId = [];
			$("#collectionContent").empty();
			$("#enableButton").hide();
			$("#disableButton").hide();
			$("#collectionContent").css("height",$(window).height()-250+"px");
			if($scope.eventGrid.api != undefined && $scope.eventGrid.api.getSelectedRows().length > 0){			
				$scope.eventGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#collectionContent');
			new agGrid.Grid(eGridDiv, $scope.eventGrid );
		}catch(err){console.log(err)};
	}


	$scope.selectedData = {};
	$("#enableButton").hide();
	$("#disableButton").hide();
	$scope.onSelectionChanged = function() {
		$scope.tagsId = [];
		$scope.selectedData = {};
		$("#enableButton").hide();
		$("#disableButton").hide();
		$scope.tagsId = angular.copy($scope.eventGrid.api.getSelectedRows());
		if($scope.tagsId.length > 0){
			if($scope.tagsId[0].status == "Enable"){
				$("#disableButton").show();
			}else{
				$("#enableButton").show();
			}
			$scope.selectedData = {sourceHostName:$scope.tagsId[0].source_host,status:$scope.tagsId[0].status};
		}
	}
	
	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{$scope.eventGrid.api.sizeColumnsToFit();
	    	 $("#collectionContent").css("height",$(window).height()-250+"px");
	    	 }catch(err){}
	    }, 500);
	});
	
	
}]);