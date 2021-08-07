app.controller("alertsController", ['$scope','eventService','irpFactory','$timeout','$ngConfirm',function ($scope,eventService,irpFactory,$timeout,$ngConfirm) {
	var self = this;
	
	$scope.customEvents = [];
	self.allCustomEvents = [];
	self.allStandardEvents = [];
	self.alertMessagaes = [];
	$scope.alertModel = {alertName:'',priority:'',rule:'',eventAlertNotification:'',alertType:''};
	$scope.rules = [];
	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	self.getAlerts = function(){
		loader("body");
		eventService.getAlerts().then(function(response){
			
			var temp = angular.copy(response.data);
			for(let j=0;j<temp.length;j++){
				if(temp[j].eventAlertNotification != undefined){
					let tempNotification = JSON.parse(temp[j].eventAlertNotification);
					temp[j]['notificationType'] = [];
					for(let i=0;i<tempNotification.length;i++){
						if(tempNotification[i].name=='ticket' && tempNotification[i].enabled == true){
								temp[j]['notificationType'].push("Ticket")
						}
						if(tempNotification[i].name=='email'  && tempNotification[i].enabled == true){
							temp[j]['notificationType'].push("Email")
						}
						if(tempNotification[i].name=='notable'  && tempNotification[i].enabled == true){
							temp[j]['notificationType'].push("Notable")
						}
					}
				}
			}
			$scope.alertDetails = angular.copy(temp);
			
			self.loadAgGrid();
			unloader("body");
		},function(err){
			unloader("body");
		});
	};

	self.getAlerts();
	
	self.getRules = function(){
		eventService.getAllEvents().then(function(response){
			self.allCustomEvents = response.data.custom;
			$scope.customEvents = [];
			$scope.alertDetails = [];
			for(var i=0;i<self.allCustomEvents.length;i++){
				if(self.allCustomEvents[i].type==="Rules" || self.allCustomEvents[i].type==="Complex Event" ){
					$scope.customEvents.push(self.allCustomEvents[i]);
				}
			}
			self.loadAgGrid();
		},function(err){
		});
	};
	
	self.getRules();
	
	self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};

	self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};

	self.ticket = {name: 'ticket',expanded : false,enabled:false,title:'',description:'',priority:'',assinge:''};
	
	self.savealerts = function(){
		
		var tempArray = [];
		if(self.email.enabled === false){
			self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};
		}else{
			self.email.expanded  = true;
		}
		if(self.notable.enabled === false){
			self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};
		}else{
			self.notable.expanded  = true;
		}
		
		if(self.ticket.enabled === false){
			self.ticket = {name: 'ticket',expanded : false,enabled:false,title:'',description:'',priority:'',assinge:''};
		}else{
			self.ticket.expanded  = true;
		}
		
		if(self.doValidation()){
			loader("body");
			tempArray.push(self.email);
			tempArray.push(self.notable);
			tempArray.push(self.ticket);
			$scope.alertModel.eventAlertNotification = angular.copy(JSON.stringify(tempArray));
			var temp = {};
			temp['id'] = $scope.alertModel.rule;
			temp['alertData'] = JSON.stringify($scope.alertModel);
			eventService.saveAlerts(temp).then(function(response){
				unloader("body");
				$("#createNewAlert").modal('hide');
				if(response.data.status){
					self.alertMessagaes.push({
						type: 'success',
						msg: "successfully updated alert information"
					});
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
				}else{
					self.alertMessagaes.push({
						type: 'danger',
						msg: response.data.msg
					});
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
				}
				self.getAlerts();
				
			},function(error){
				console.log(error);
			});
		}
	};
	
	self.alertMessagaes1 = []
	self.doValidation = function(){
		if(self.ticket.enabled === true) {
			if (self.ticket.title == "" || self.ticket.title == undefined || self.ticket.description == "" || self.ticket.description == undefined || self.ticket.priority == "" || self.ticket.priority == undefined || self.ticket.assignee == "" || self.ticket.assignee == undefined) {
				self.alertMessagaes1.push({
					type: 'danger',
					msg: "Please fill all the details ticket notification"
				});
				$timeout(function () {
					self.alertMessagaes1 = [];
				}, 2000);
				return false;
			}
		}
		if (self.notable.enabled === true) {
			if (self.notable.title == "" || self.notable.description == "" || self.notable.message == "" || self.notable.drillDownName == "" || self.notable.drillDownDownSearch == "" ||
					self.notable.title == undefined || self.notable.description == undefined || self.notable.message == undefined || self.notable.drillDownName == undefined || self.notable.drillDownDownSearch == undefined || self.notable.irpTemplate == undefined || self.notable.irpTemplate == "") {
				self.alertMessagaes1.push({
					type: 'danger',
					msg: "Please fill all the details in  notable event notification"
				});
				$timeout(function () {
					self.alertMessagaes1 = [];
				}, 2000);
				return false;
			}
		}
		if (self.email.enabled === true) {
			if (self.email.to == "" || self.email.to == undefined || self.email.subject == "" || self.email.subject == undefined || self.email.message == "" || self.email.message == undefined) {
				self.alertMessagaes1.push({
					type: 'danger',
					msg: "Please fill all the details in  email notification"
				});
				$timeout(function () {
					self.alertMessagaes1= [];
				}, 2000);
				return false;
			}
		}
		if($scope.alertModel.priority == undefined || $scope.alertModel.priority == "" || $scope.alertModel.rule == undefined ||$scope.alertModel.rule == "" || $scope.alertModel.alertType == undefined ||$scope.alertModel.alertType == "" ){
			self.alertMessagaes1.push({
				type: 'danger',
				msg: "Please select all the fields"
			});
			$timeout(function () {
				self.alertMessagaes1= [];
			}, 2000);
			return false;
		}
		return true;
	}
	
	
	self.irps = [];
	irpFactory.getAllIRPS().then(function(response){
		self.irps = angular.copy(response.data);
	},function(error){
		console.log(error);
	})

	self.irpConfig = {
		maxItems: 1,
		optgroupField: 'class',
		labelField: 'templateName',
		searchField: ['templateName'],
		valueField: 'id',
		create: false
	};

	
	self.ruleConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'eventName',
			searchField: ['eventName'],
			valueField: 'id',
			create: false
		};

	
	
	self.columnDefs = [
		{headerName: "Alert Name",field: "alertName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Priority",field: "priority",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Alert Type",field: "alertType",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Notification Type",field: "notificationType",cellRenderer: 'showBadge', width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Count",field: "count",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}}
	]
	
	
	function showBadge(notification) {
//		var tags = params.value.split(",");
		var element = ""
		for(let i=0;i<notification.value.length;i++){
			element += '<label class="badge badge-primary">'+notification.value[i]+'</label>&nbsp;';
		}
		return element;
	}
		
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
							rowData: $scope.alertDetails,
							components:{
								showBadge: showBadge,
							},
							rowSelection: 'single',
							floatingFilter:true,
							rowGroupPanelShow: 'always',
							onSelectionChanged: self.onSelectionChanged,
							onFirstDataRendered(params) {
								params.api.sizeColumnsToFit();
							}
					}
			
					self.alertsId = [];
					$("#alertsContent").empty();
					$("#viewButton").hide();
					$("#deleteButton").hide();
					 $("#alertsContent").css("height",$(window).height()-250+"px");
					if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
						self.eventGrid.api.deselectAll();
					}
					var eGridDiv =  document.querySelector('#alertsContent');
					new agGrid.Grid(eGridDiv, self.eventGrid );
				},250);
			}
	
	
	self.onSelectionChanged = function() {
		self.alertsId = [];
		$("#viewButton").hide();
		$("#deleteButton").hide();
		self.alertsId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.alertsId.length > 0){			
			$("#viewButton").show();
			$("#deleteButton").show();
		}else{
			$("#viewButton").hide();
			$("#deleteButton").hide();
		}
	}
	
	
	$(window).resize(function() {
	     setTimeout(function() {
	    	 try{
	    		 self.eventGrid.api.sizeColumnsToFit();
	    		 $("#alertsContent").css("height",$(window).height()-250+"px");
	    	 }catch(err){}
	    }, 500);
	});
	
	$scope.openAlert = function(){
		$scope.alertModel = {alertName:'',priority:'',rule:'',eventAlertNotification:'',alertType:''};
		self.email = {name: 'email',expanded : false,enabled:false,to:'',subject:'',message:''};

		self.notable = {name: 'notable',expanded : false,enabled:false,title:'',description:'',message:'',drillDownName:'',drillDownDownSearch:''};

		self.ticket = {name: 'ticket',expanded : false,enabled:false,title:'',description:'',priority:'',assinge:''};
		$("#createNewAlert").modal();
		$scope.edit = false;
	};
	
	$scope.edit = false;
	self.editAlert = function(data){
		$scope.alertModel.alertName = data.alertName;
		$scope.alertModel.priority = data.priority;
		$scope.alertModel.rule = data.rule;
		$scope.alertModel.alertType = data.alertType;
		$("#createNewAlert").modal();
		
		if(data.eventAlertNotification != undefined){
			let temp = JSON.parse(data.eventAlertNotification);
			for(let i=0;i<temp.length;i++){
				if(temp[i].name=='ticket'){
					self.ticket = angular.copy(temp[i]);
				}
				if(temp[i].name=='email'){
					self.email = angular.copy(temp[i]);
				}
				if(temp[i].name=='notable'){
					self.notable = angular.copy(temp[i]);
				}
			}
		}
		$scope.edit = true;
		for(let i=0;i<$scope.customEvents.length;i++){
			if($scope.customEvents[i].id == data.rule){
				$scope.ruleName = $scope.customEvents[i].eventName; 
			}
		}
		
		
	}
	
	self.deleteAlert = function(data){
		if(data.rule !=undefined && data.rule!=0 ){
			
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
							loader("body");
							eventService.deleteAlertForRule(data.rule).then(function(response){
								unloader("body");
								if(response.data.satus){
									self.alertMessagaes.push({
										type: 'success',
										msg: "Alert Deleted successfully"
									});
									$timeout(function () {
										self.alertMessagaes= [];
									}, 2000);
								}
								self.getAlerts();
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
	}
	
	
	
}]);