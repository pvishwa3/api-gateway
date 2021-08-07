
var isReset = true;
var selectedNode = null;
var traceedges = [];
var tracenodes = [];

var network;
var allNodes;
var highlightActive = false;

var nodesDataset  // these come from WorldCup2014.js
var edgesDataset 

var currentNodesArray = {};

var startpages = [];

var isReset = true;

var suspiciousPath = [];



app.controller("workBenchController", ['$scope', 'investigationPanelFactory', 'investigstionFactory','$rootScope','$timeout','$uibModal','conditionFactory','conditionCategoryFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder' ,'conditionTypeFactory','$ngConfirm','settingsFactory','caseFactory','$routeParams','fileUpload','alertsFactory','eventService','logDevicesFactory',function ($scope, investigationPanelFactory,investigstionFactory, $rootScope, $timeout,$uibModal,conditionFactory,conditionCategoryFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,conditionTypeFactory,$ngConfirm,settingsFactory,caseFactory,$routeParams, fileUpload,alertsFactory,eventService,logDevicesFactory) {

	$scope.splitPaneProperties = {};

	$scope.indicatorDetails = {indicator:'',value:'',event_details:[],threat_info:[],rule_details:[]};

	startpages = [];

	$scope.eventFilter = {lookAround:"15mins"};

	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	$scope.setFirstComponent = function (value) {
		if($scope.splitPaneProperties.firstComponentSize == 0){			
			$scope.splitPaneProperties.firstComponentSize = 350;
		}else{
			$scope.splitPaneProperties.firstComponentSize = value;			
		}
	};



	$scope.workbenchId = 0;

	$scope.oneAtATime = true;

	var self = this;

	$scope.eventDetails = [];

	$scope.isEventView = false;

	$scope.goBackToDetails = function(){

		$scope.isEventView = false;


	}

	$scope.singleEventDetails = {};

	$scope.showSingleEvent = function(data){
		$scope.singleEventDetails = data;
	}


	$scope.showEventInfoDetails = function(eventName,type){


		investigationPanelFactory.loadEventsOrRuleForInvestigations(eventName,type,self.workBench.id,$scope.eventFilter.lookAround,selectedNode.fieldName,selectedNode.name).then(function (response){

			$scope.singleEventDetails = {};

			$scope.eventDetails = response.data;

			$scope.isEventView = true;


		},function(error){
			unloader("body");
		});

	}

	self.filterEnrichedData = function(){

		investigationPanelFactory.loadBasicInfo(selectedNode.fieldName,selectedNode.group,self.workBench.id,selectedNode.name,$scope.eventFilter.lookAround).then(function (response){

			$scope.indicatorDetails.event_details = response.data.eventInfo
			$scope.indicatorDetails.rule_details = response.data.rulesInfo
			//scope.indicatorDetails.threat_info = response.data.eventInfo
			$scope.indicatorDetails.indicator= selectedNode.fieldName;
			$scope.indicatorDetails.value = selectedNode.value;

			//scope.currentThreatData = angular.copy(response.data);
			//scope.currentThreatData['type'] = selectedNode.group;

			$("#show_node_info").modal();


		},function(error){
			unloader("body");
		});

	}

	self.printPdfFlag = false;

	$("#btn_add_node").hide();

	$scope.isEnableEventsButton = true;
	$scope.isEnableRulesButton = true;

	$scope.isEnableObservablesButton =true;

	$scope.infoTable = true;
	$scope.eventsInfoTable = false

	$scope.nodePath = [];

	$scope.toggleEvents = function(){
		$scope.isEnableEventsButton = !$scope.isEnableEventsButton;
		var chart = $('#actvity').highcharts();
		var series = chart.series[1];
		if (!$scope.isEnableEventsButton) {
			series.hide();

		} else {
			series.show();

		}
	}

	$scope.toggleNotables = function(){
		$scope.isEnableRulesButton = !$scope.isEnableRulesButton;
		var chart = $('#actvity').highcharts();
		var series = chart.series[0];
		if (!$scope.isEnableRulesButton) {
			series.hide();

		} else {
			series.show();

		}
	}

	$scope.toggleObservables = function(){
		$scope.isEnableObservablesButton = !$scope.isEnableObservablesButton;
		var chart = $('#actvity').highcharts();
		var series = chart.series[2];
		if (!$scope.isEnableObservablesButton) {
			series.hide();

		} else {
			series.show();

		}
	}

	$scope.actualAnalyzedFields = [];

	self.analyzedFields = [];

	$scope.analyzedFieldsOptions = [];

	$scope.filterItems = {}

	self.getAnalyzedFields = function(){
		logDevicesFactory.getAnalyzedFields().then(function (response){


			self.analyzedFields = response.data;

			for(var i=0;i<response.data.length;i++){
				$scope.analyzedFieldsOptions.push({field:response.data[i],canDelete:true})
				$scope.fieldChecked.push(response.data[i]);
				$scope.filterItems[response.data[i]] = true;

			}




			unloader("body");
		},function(error){
			console.log(error);
			self.alertMessagaes.push({ type: 'warn', msg: 'Error saving Investigation.' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			unloader("body");
		});
	}



	$scope.markAsEndNode = function(){

		var dataNode = network.body.data.nodes[selectedNode];

		if(!dataNode){
			alert("Please Select Atlease one node");
			return false;
		}

		if(dataNode.group.indexOf("Observables")!=-1){

			dataNode['isEndNode'] = true;
			dataNode['group'] = 'endNode';

			network.body.data.nodes.update(allNodes[selectedNode]);

			//self.highlightRestOfNodes(dataNode.id);


		}else{
			alert("This node is not eligable to mark as end node");
			return false;
		}

	}
	self.comments = {nodeId:'',comment:''};
	$scope.markASuspiciousNode = function(){
		var dataNode = selectedNode;

		if(!dataNode){
			alert("Please Select Atlease one node");
			return false;
		}

		$("#add_comments").modal();

		self.comments.nodeId = dataNode.id;

		resetProperties();
		traceBack(dataNode.id,"#fc2003");

	}

	$scope.tempSuspiciousPath = {};

	$scope.tempSuspiciousId = {};

	self.addComments = function(){

		var dataNode = allNodes[self.comments.nodeId];

		if(!dataNode){
			alert("Please Select Atlease one node");
			return false;
		}

		dataNode['isSuspicious'] = true;

		var existingTitle = dataNode.title;
		dataNode.title = existingTitle + " </br> <Strong>" + self.comments.comment + "</Strong>";

		network.body.data.nodes.update(dataNode);

		traceBack(dataNode.id,"#fc2003",true);

		var tempNodes = [];

		var tempIds = [];

		for(var i=0;i<suspiciousPath.length;i++){
			for(var j=0;j<suspiciousPath[i].length;j++){
				tempNodes.push(suspiciousPath[i][j].label);
				tempIds.push(suspiciousPath[i][j].id);
			}

		}

		$scope.tempSuspiciousId[tempIds]= angular.copy(tempIds);


		$scope.tempSuspiciousPath[dataNode.label]= angular.copy(tempNodes);

		suspiciousPath = [];

		$("#add_comments").modal('hide');
	}

	self.deleteNode = function(data,checked){

		var idx = $scope.fieldChecked.indexOf(data.field);
		if (idx >= 0 && !checked) {
			$scope.fieldChecked.splice(idx, 1);
		}
		if (idx < 0 && checked) {
			$scope.fieldChecked.push(data.field);
		}

		if(checked){

			var tempNodes = allNodes;
			data.canDelete = true;

			Object.keys(tempNodes).forEach(function(key) {
				if(tempNodes[key].group === data.field){

					var connectedEdges =  network.getConnectedEdges(tempNodes[key].id);
					for(var i=0;i<connectedEdges.length;i++){

						var tempNode = allNodes[network.body.data.edges._data[connectedEdges[i]].to];

						tempNode['hidden'] = false;
						network.body.data.nodes.update(tempNode);

						//network.body.data.nodes.remove(network.body.data.edges._data[connectedEdges[i]].to)
						console.log(network.body.data.edges._data[connectedEdges[i]].to);
					}
					//network.body.data.nodes.remove(tempNodes[key].id);

				}



			});

		}else{
			var tempNodes = allNodes;

			data.canDelete = false;

			Object.keys(tempNodes).forEach(function(key) {
				if(tempNodes[key].group === data.field){

					var connectedEdges =  network.getConnectedEdges(tempNodes[key].id);
					for(var i=0;i<connectedEdges.length;i++){

						var tempNode = allNodes[network.body.data.edges._data[connectedEdges[i]].to];

						tempNode['hidden'] = true;
						network.body.data.nodes.update(tempNode);

						//network.body.data.nodes.remove(network.body.data.edges._data[connectedEdges[i]].to)
						console.log(network.body.data.edges._data[connectedEdges[i]].to);
					}
					//network.body.data.nodes.remove(tempNodes[key].id);

				}

			});


		}
		//$scope.indicators.push({field:tempNodes[key].title,type:tempNodes[key].nodeValue.split("||")[0],canDelete:true});






	}

	$scope.events = [];



	$scope.showAlertsInfoTable = function(){

		$scope.infoTable = true;
		$scope.eventsInfoTable = false;

		$scope.events = [];



		$scope.indicators = [];
		for(var j=0;j<$scope.actualAnalyzedFields.length;j++){

			$scope.indicators.push($scope.actualAnalyzedFields[j])

		}

	}


	$scope.showEventsInfoTable = function(){

		$scope.infoTable = false;
		$scope.eventsInfoTable = true;

		$scope.events = [];


		var connectedEdges =  network.getConnectedEdges(selectedNode);
		for(var i=0;i<connectedEdges.length;i++){

			var tempNode = allNodes[network.body.data.edges._data[connectedEdges[i]].to];
			if(tempNode.nodeValue!='Events'){
				$scope.events.push({eventName:tempNode.nodeValue.split("||")[0],eventCategory:tempNode.nodeValue.split("||")[1]});
			}




		}
		$scope.indicators = [];
		for(var j=0;j<$scope.actualAnalyzedFields.length;j++){

			$scope.indicators.push($scope.actualAnalyzedFields[j])

		}

	}





	self.addDeletedNode = function(data){
		var tempNodes = allNodes;
		data.canDelete = true;

		Object.keys(tempNodes).forEach(function(key) {
			if(tempNodes[key].label === data.field){

				var connectedEdges =  network.getConnectedEdges(tempNodes[key].id);
				for(var i=0;i<connectedEdges.length;i++){

					var tempNode = allNodes[network.body.data.edges._data[connectedEdges[i]].to];

					tempNode['hidden'] = false;
					network.body.data.nodes.update(tempNode);

					//network.body.data.nodes.remove(network.body.data.edges._data[connectedEdges[i]].to)
					console.log(network.body.data.edges._data[connectedEdges[i]].to);
				}
				//network.body.data.nodes.remove(tempNodes[key].id);

			}

		});
	}


	$scope.suspiciousNodes = [];
	$scope.pinNodes = [];
	$scope.endNodes = [];
	$scope.analyzedNodes = ["start"];
	$scope.networkData = [];
	self.investigationType = {internal:true,external:true};
	self.newNodeDetails = {"ioc":"", "label":"", "indicator":"","searchString":""};
	$scope.caseFiles;
	$scope.fileCases = {id:""};

	$rootScope.$broadcast('changeThemeToNormal');
	$scope.rule = {};
	$scope.showDetails = false;
	$scope.jsonEditor = {options: {mode: 'view'}};

	self.eventsModel = [];

	self.rulesModel = [];

	self.observablesModel = [];

	$scope.filter = {id:0,lookAround:'current',filterType:'currentEvents',eventName:'currentEvents',ruleName:'currentEvents',searchString:'*'};

	self.eventNames = [];
	//filter.lookAround

	self.elasticseachFields = [];

	self.lookupdetails = [];

	$scope.templateurl = "viewWorkBenchs.html";

	$scope.createButtonShow = true;

	self.alertMessagaes = [];

	self.casesList = [];

	self.back = function(){
		$scope.templateurl = "viewWorkBenchs.html";
		$scope.createButtonShow = true;
		self.workBench = {id:0,workBenchName:"",description:"",status:"",userNames:"",artifacts:"",createdDate:"",lastupdateDate:"",networkJson:"",suspicious:""};
		self.loadAgGrid();
		$(".custom-menu").finish().toggle(100);
		$(".tooltip-static-demo").finish().toggle(100);
	}

	$scope.startDate  = moment(new Date()).subtract(6, 'hours').valueOf();
	$scope.endDate  = moment(new Date()).valueOf();

	self.suspiciousNode = function() {
		if($scope.suspiciousNodes.indexOf($scope.selectedNode) === -1 ) {
			$scope.suspiciousNodes.push($scope.selectedNode);
		};
	}


	self.events = [];
	self.rules = [];

	self.getAllEvents = function(){
		eventService.getAllEvents().then(function (response){

			self.events.push({event_name:"All"})
			self.rules.push({event_name:"All"})

			for(var i=0;i<response.data.length;i++){
				if(response.data[i].type != "Complex Event"){
					self.events.push(response.data[i]);
				}else{
					self.rules.push(response.data[i]);
				}
			}



			unloader("body");
		},function(error){
			console.log(error);
			self.alertMessagaes.push({ type: 'warn', msg: 'Error saving Investigation.' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			unloader("body");
		});
	}

	self.filterData = function(){

		self.loadRulesActivity(self.workBench.id);

	}

	self.clearSuspiciousNode = function() {
		$scope.suspiciousNodes = [];
	}
	self.deleteSuspiciousNode = function(index) {
		$scope.suspiciousNodes.splice(index, 1);
	}
	self.pinNode = function() {
		if($scope.pinNodes.indexOf($scope.selectedNode) === -1 ) {
			$scope.pinNodes.push($scope.selectedNode);
		};
	}
	self.clearPinNode = function() {
		$scope.pinNodes = [];
	}
	self.deletePinNode = function(index) {
		$scope.pinNodes.splice(index, 1);
	}
	self.endNode = function() {
		if($scope.endNodes.indexOf($scope.selectedNode) === -1 ) {
			$scope.endNodes.push($scope.selectedNode);
		};
	}
	self.clearEndNode = function() {
		$scope.endNodes = [];
	}
	self.deleteEndNode = function(index) {
		$scope.endNodes.splice(index, 1);
	}

	self.clearPath = function() {
		$scope.analyzedNodes = ["start"];
	}
	self.savePath = function() {
		alert($scope.analyzedNodes + " saved.");
	}
	self.deletePathNode = function(index) {
		if(index != 0)
			$scope.analyzedNodes.splice(index, 1);
		else 
			alert("ozone can be deleted")
	}
	self.print = function(_callback){
		kendo.drawing.drawDOM($("#content-container,#investigation-context-export"), {multiPage: true}).then(function(group) {
			kendo.drawing.pdf.saveAs(group, "Report.pdf");
		});
//		_callback();    
//		$("#investigation-context-export").hide();
	}
	self.downloadPdf = function() {
		self.printPdfFlag = true;
		setTimeout(function () {
			self.print();
		}, 5000);
		setTimeout(function () {
			self.printPdfFlag = false;
		}, 10000);
//		$("#investigation-context-export").show();
//		self.print();
//		self.printPdfFlag = false;
//		self.printPdfFlag = false;
//		$("#investigation-context-export").hide();
//		self.print(function() {
//		self.printPdfFlag = false;
//		$("#investigation-context-export").hide();
//		}); 
	}

	$scope.openFileModal = function(){
		$("#upload_files_modal").modal();
	}

	$scope.uploadFile = function() {
		var file = $scope.caseFiles;

		console.log('file is ' );
		console.dir(file);
		var uploadUrl = "/case-management/user/case/uploadFile/"+$scope.fileCases.id;
		fileUpload.uploadFileToUrl(file, uploadUrl);
		$("#upload_files_modal").modal('hide');
	};


	$scope.filterData = function(){



		investigationPanelFactory.loadFilterData($scope.filter).then(function (response){
			console.log(response);
			self.alertMessagaes.push({ type: 'success', msg: 'Investigation saved succesfully.' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			unloader("body");
		},function(error){
			console.log(error);
			self.alertMessagaes.push({ type: 'warn', msg: 'Error saving Investigation.' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			unloader("body");
		});

	}



	$scope.addCommentToInvestigation = function(){

		var data = {id : self.workBench.id,comments:self.workBench.comments};

		$("#comment-model").modal();

	}

	self.commentAlerts = [];

	$scope.saveComments = function(){


	    var data = {id : self.workBench.id,comments:self.workBench.comments};

           investigationPanelFactory.saveComments(data).then(function (response){

               if(response.data.status){
                   self.alertMessagaesModal.push({ type: 'success', msg: "Successfully Added the comments"});
                   investigationPanelFactory.getAllWorksBenches().then(function (response){

                        self.workBenchDetails = response.data;
                        self.loadComments();


                    },function(error){

                    });
                   //self.showWorkBench($scope.workbenchId);
                   $timeout(function () {
                   		self.alertMessagaesModal = [];
                   }, 2000);

                   $("#comment-model").modal('hide');
               }else{
                     self.commentAlerts.push({ type: 'danger', msg: "Unable to add the comments .. Please contact system Administrator"});
               }


                },function(error){

                   //	$(".custom-menu").finish().toggle(100);
             });

	}

	 self.loadComments = function(){

	     $scope.currentComments = [];
        		for(var i = 0; i < self.workBenchDetails.length; i++){
        			if(self.workBenchDetails[i].id === self.workBench.id) {
        				$scope.currentComments = angular.copy(self.workBenchDetails[i].comments);

        				break;
        			}
        		}

	 }

	$scope.saveInvestigation = function() {

		var networkJson = {nodes:'',edges:''}

		var tempNodes = network.body.data.nodes._data;;

		var tempEdges = network.body.data.edges._data;

		var finalNodes = [];

		var finalEdges = [];

		Object.keys(tempNodes).forEach(function(key) {

			finalNodes.push(tempNodes[key]);
		});

		Object.keys(tempEdges).forEach(function(key) {

			finalEdges.push(tempEdges[key]);
		});

		networkJson.nodes = finalNodes;
		networkJson.edges = finalEdges;

		self.workBench.userNames = self.workBench.userNames.join(",")
		self.workBench.artifacts = self.workBench.artifacts.join(",")
		self.workBench.networkJson = JSON.stringify(networkJson);
		self.workBench['suspicious'] =JSON.stringify($scope.tempSuspiciousPath)


		investigationPanelFactory.saveWorkBench(self.workBench).then(function (response){
			console.log(response);
			self.alertMessagaes.push({ type: 'success', msg: 'Investigation saved succesfully.' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			unloader("body");

			for(var i = 0; i < self.workBenchDetails.length; i++){
				if(self.workBenchDetails[i].id === self.workBench.id) {
					self.workBench = angular.copy(self.workBenchDetails[i]);

					for(var i=0;i<self.workBench.artifacts.length;i++){
						self.artifacts.push({artifact:self.workBench.artifacts[i]});
					}

					var workBenchId = {investigationId:self.workBench.id}

					caseFactory.getCasesByInvestigation(workBenchId).then(function (response){

						for(var i=0;i<response.data.length;i++){
							self.existingCases.push(response.data[i].title)
						}


					},function(error){
						unloader("body");
					});

					self.loadRulesActivity(self.workBench.id);

					$scope.createButtonShow = false;
					break;
				}
			}
		},function(error){
			console.log(error);
			self.alertMessagaes.push({ type: 'warn', msg: 'Error saving Investigation.' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			unloader("body");
		});
	}
	self.addNodeModel = function() {
		console.log($scope.requiredIndicator);

		$("#add_node").modal()

	}
	self.addNode = function() {

		var dataNode = allNodes[selectedNode];


		var groupName = getObservableGroup(dataNode.group);





		var nodeId = self.newNodeDetails.indicator+"-"+Math.floor(Math.random() * 10000);

		network.body.data.nodes.add({
			shape: "shape",
			label: self.newNodeDetails.ioc,
			title: self.newNodeDetails.ioc,
			group: groupName,
			id : nodeId,
			investigationType:'external',
			color:'#611fd1',
			nodeValue: dataNode.label+"||"+self.newNodeDetails.ioc
		});
		network.body.data.edges.add({
			from: dataNode.id,
			to : nodeId,
			length: 150,
			id : nodeId+Math.floor(Math.random() * 20)
		});


	}
	self.loadCases = function(){

		caseFactory.getMyCases().then(function(response){
			self.cases = response.data;

		});

	}


	self.filter = {startDate:$scope.startDate,endDate:$scope.endDate,query:"",panel:""}

	$scope.showTab = false;

	self.explore = function(){

		$scope.analyzedFieldsOptions = [];
		$scope.fieldChecked = [];
		investigstionFactory.getInvestigationByName(self.workBench.id).then(function(response){

			loadNetworkChart(response.data, investigstionFactory,investigationPanelFactory, self,$scope,alertsFactory,self.workBench.id,'','graphView');

			var currentObservables = response.data.observables

			Object.keys(currentObservables).forEach(function (key) {
				$scope.analyzedFieldsOptions.push({field:key,count:currentObservables[key], canDelete:true})
				$scope.fieldChecked.push(key);
			})

			self.loadRulesActivity(self.workBench.id)

			for(var i=0;i<response.data.nodes.length;i++){
				if(response.data.nodes[i].nodeValue === "Observables" ){
					$scope.nodePath.push("Start - "+response.data.nodes[i].label)
				}

			}

		},function(error){
			unloader("body");
		});
	}

	self.resetInvestigation = function() {
		self.clearSuspiciousNode();
		self.clearPinNode();
		self.clearEndNode();
		self.clearPath();
		self.explore();
		$scope.selectedNode="ozone";
		$scope.reqGroup="ozone";
		$scope.requiredIndicator="ozone";
		$scope.nodeTitle = "Starting point of Investigation";
	}

	self.editWorkBench = function(id){

		for(var i = 0; i < self.workBenchDetails.length; i++){
			if(self.workBenchDetails[i].id === id) {
				self.workBench = angular.copy(self.workBenchDetails[i]);

				$("#createWorkModal").modal();

				$scope.createButtonShow = false;
				break;
			}
		}

	}

	self.loadTabContent = function(panelname){
		investigationPanelFactory.loadTabContent(self.filter).then(function (response){
			console.log(response);
		},function(error){
			unloader("body");
		});

	}

	$scope.dateLable = "last6Hours";

	$scope.labelName = "Last 6 hours";

	$scope.setRelativeTime = function(option,labelName){

		var startDate ;
		var endDate = moment(new Date());

		$scope.labelName = labelName;

		if(option==='last2Days'){
			startDate = moment(new Date()).subtract(2, 'days');
		}
		if(option==='last7Days'){
			startDate = moment(new Date()).subtract(7, 'days');
		}
		if(option==='last30Days'){
			startDate = moment(new Date()).subtract(30, 'days');
		}
		if(option==='last90Days'){
			startDate = moment(new Date()).subtract(90, 'days');
		}
		if(option==='last6months'){
			startDate = moment(new Date()).subtract(6, 'months');
		}
		if(option==='last1year'){
			startDate = moment(new Date()).subtract(1, 'years');
		}
		if(option==='last2years'){
			startDate = moment(new Date()).subtract(2, 'years');
		}
		if(option==='last5years'){
			startDate = moment(new Date()).subtract(2, 'years');
		}
		if(option==='yesterday'){
			startDate = moment(new Date()).subtract(1, 'days').startOf('day');
			endDate = moment(new Date()).subtract(1, 'days').endOf('day');
		}
		if(option==='dayBeforeYesterday'){
			startDate = moment(new Date()).subtract(2, 'days').startOf('day');
			endDate = moment(new Date()).subtract(2, 'days').endOf('day');
		}
		if(option==='thisLastWeek'){
			startDate = moment(new Date()).subtract(7, 'days').startOf('week');
			endDate = moment(new Date()).subtract(7, 'days').endOf('week');
		}
		if(option==='perviousWeek'){
			startDate = moment(new Date()).subtract(1, 'weeks').startOf('week');
			endDate = moment(new Date()).subtract(1, 'weeks').endOf('week');
		}
		if(option==='today'){
			startDate = moment(new Date()).startOf('day');
			endDate = moment(new Date()).endOf('day');
		}
		if(option==='todaySoFar'){
			startDate = moment(new Date()).startOf('day');
		}
		if(option==='thisWeek'){
			startDate = moment(new Date()).startOf('week');
			endDate = moment(new Date()).endOf('week');
		}
		if(option==='thisWeekSoFar'){
			startDate = moment(new Date()).startOf('week');

		}
		if(option==='thisMonth'){
			startDate = moment(new Date()).startOf('month');
			endDate = moment(new Date()).endOf('month');
		}
		if(option==='thisMonthSoFar'){
			startDate = moment(new Date()).startOf('month');

		}
		if(option==='thisYear'){
			startDate = moment(new Date()).startOf('year');
			endDate = moment(new Date()).endOf('year');
		}
		if(option==='thisYearSoFar'){
			startDate = moment(new Date()).startOf('year');
		}

		if(option==='last15Minutes'){
			startDate = moment(new Date()).subtract(15, 'minutes');;

		}

		if(option==='last30Minutes'){
			startDate = moment(new Date()).subtract(30, 'minutes');;

		}

		if(option==='last1Hour'){
			startDate = moment(new Date()).subtract(1, 'hours');;
		}


		if(option==='last3Hours'){
			startDate = moment(new Date()).subtract(3, 'hours');;
		}

		if(option==='last6Hours'){
			startDate = moment(new Date()).subtract(6, 'hours');
		}

		if(option==='last12Hours'){
			startDate = moment(new Date()).subtract(12, 'hours');;
		}

		if(option==='last24Hours'){
			startDate = moment(new Date()).subtract(24, 'hours');;
		}
		$scope.startDate = startDate.valueOf();
		$scope.endDate = endDate.valueOf();
		$scope.dateLable = option;

		$scope.apply();

		// $scope.applyWithOutCustomRagne();
	}


	$scope.apply = function(){
		self.filter.startDate  = $scope.startDate;
		self.filter.endDate = $scope.endDate;
		self.explore();
	}

//	$scope.vm = {};
//	$scope.vm.dtInstance = {};  
//	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withFixedHeader({

//	}).withOption('order', [1, 'asc'])
//	.withOption('lengthMenu', [25,50, 100, 150, 200]);

	self.workBench = {id:0,workBenchName:"",description:"",status:"",userNames:"",artifacts:"",createdDate:"",lastupdateDate:"",networkJson:"",suspicious:"",alertId:"",priority:""};


	self.userDetails = [];

	self.artifacts = [];

	self.alertArtificatMessagaes =[];

	self.artifcat = {id:0,artifact:"",description:"",tags:'',workBenchId:'',isChecked:false,comments:""};

	self.artficatsList = [];

	self.addToList = function(data){
		self.artficatsList.push(data);
	}

	self.artifacts = [];

	$scope.tags = [];

	self.saveArtifacts = function(){
		loader("body");

//		var tempArray = [];

//		for(var i=0;i<$scope.tags.length;i++){
//		tempArray.push($scope.tags[i].text);
//		}

//		self.artifcat.tags = tempArray.join(',');

		self.artifcat.tags = self.newNodeDetails.ioc;

		self.artifcat.workBenchId = self.workBench.id;

		self.artifcat.description = self.newNodeDetails.description;
		self.artifcat.artifact = self.newNodeDetails.ioc;

		investigationPanelFactory.saveArtifacts(self.artifcat).then(function (response){
			unloader("body");
			if(response.data.status){
				self.artifacts.push(self.artifcat);
				self.artifcat = {id:0,artifact:"",description:"",tags:'',workBenchId:'',isChecked:false};
				self.alertArtificatMessagaes.push({ type: 'success', msg: ' Artifact added' });

				$scope.tags = [];

				$timeout(function () {
					self.alertArtificatMessagaes = [];
				}, 2000);
			}else{

				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });

				}
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}


		},function(error){
			unloader("body");
		});
	}

	self.addArtificats  = function(artificat){
		$("#add_artificats").modal()
	}

	self.loadPanelDetails = function(){
		investigationPanelFactory.getInvestigationPanelDetails().then(function (response){

			self.panelDetails = [];

			for(var i=0;i<response.data.length;i++){
				self.panelDetails.push(response.data[i].panelName);
			}


		},function(error){
			unloader("body");
		});

	}

	self.loadAllUsersWithCompany = function(){
		settingsFactory.getUsersWithInCompany().then(function (response){
			self.userDetailsData  = response.data;
		},function(error){
			unloader("body");
		});
	}

	self.loadWorkbenchTabs = function(){
		investigationPanelFactory.getWorkBenchTabs().then(function (response){
			self.workBenchTabDetails = response.data;
		},function(error){
			unloader("body");
		});
	}

	self.loadWorkBench = function(){
		investigationPanelFactory.getAllWorksBenches().then(function (response){


			self.workBenchDetails = response.data;
			self.loadAgGrid();

			if(window.location.href.indexOf("investigations?id")!=-1){
				var id = parseInt($routeParams.id);

				self.showWorkBench(id);
				$scope.workbenchId = id

				self.loadRulesActivity();


			}else if(window.location.href.indexOf("investigations?name")!=-1){

				var name =$routeParams.name;

				for(var i=0;i<self.workBenchDetails.length;i++){
					if(self.workBenchDetails[i].workBenchName === name ){
						self.showWorkBench(self.workBenchDetails[i].id);
						break;
					}
				}


			}else{
				$scope.templateurl = "viewWorkBenchs.html";
			}

		},function(error){
			unloader("body");
		});
	}

	self.caseAlertMessage = [];

	$scope.alertInfo = {};

	$scope.chartData = [];

	self.loadRulesActivity = function(id){

		$scope.filter.id = id;

		var tempData = [];

		var tempRulesData = [];

		var tempObservables = [];

		for(var i=0;i<self.eventsModel.length;i++){
			tempData.push(self.eventsModel[i].event_name);
		}

		for(var i=0;i<self.rulesModel.length;i++){
			tempRulesData.push(self.rulesModel[i].event_name);
		}

		for(var i=0;i<self.observablesModel.length;i++){
			tempObservables.push(self.observablesModel[i]);
		}

		if(tempData.length===0){
			$scope.filter.eventName = "currentEvents"
		}else if(tempData.indexOf("All")!=-1){

			$scope.filter.eventName = "All"

		}else{
			$scope.filter.eventName = tempData.join(",")
		}


		if(tempObservables.length===0){
			$scope.filter.observables = "All"
		}else if(tempObservables.indexOf("All")!=-1){

			$scope.filter.observables = "All"

		}else{
			$scope.filter.observables = tempObservables.join(",")
		}


		if(tempRulesData.length === 0){

			$scope.filter.ruleName = "currentEvents"
		}else if(tempRulesData.indexOf("All")!=-1){

			$scope.filter.ruleName = "All"
		}else{

			$scope.filter.ruleName = tempRulesData.join(",")
		}



		investigationPanelFactory.loadActivity($scope.filter).then(function (response){

			$scope.chartData = response.data;

			//$scope.buildActivityChart(response.data,'bubble');

			$scope.alertInfo = response.data.alertInfo;
			//$scope.indicators = response.data.observables;

			var tempNodes = allNodes;


			Object.keys(tempNodes).forEach(function(key) {


				if(tempNodes[key] && tempNodes[key].type!='group'){
					$scope.indicators.push({field:tempNodes[key].name,type:tempNodes[key].group,canDelete:true});
					//$scope.actualAnalyzedFields.push({field:tempNodes[key].title,type:tempNodes[key].nodeValue.split("||")[0],canDelete:true});
				}




			});



		},function(error){
			unloader("body");
		});

	}

	$scope.displaynodeInfo = function(data){
		$scope.infoTable = true;
		$scope.eventsInfoTable = false
		$scope.alertInfo = data;

		$scope.indicators = [];

		Object.keys($scope.alertInfo).forEach(function(key) {
			if($scope.fieldChecked.indexOf(key)!=-1){
				$scope.indicators.push({field:$scope.alertInfo[key],type:key,canDelete:true});
			}

		});

	}

	$scope.updateNetworkPath = function(currentNode,perviousNode){
		for(var i=0;i<$scope.nodePath.lenght;i++){

		}
	}

	$scope.toggle = function(){
		$("#mainnav-container").animate({
			width: "toggle"
		});
	}

	$scope.buildActivityChart = function(data,chartType){

		var seriesData = [];
		var seriesEventData = [];

		var observablesData = [];

		for(var i=0;i<data.rules.length;i++){
			var tempData = data.rules[i];
			seriesData.push({
				name:tempData[1],
				x: parseInt(tempData[0]),
				y:parseInt(tempData[2]),
				z:parseInt(tempData[2])
			})
		}
		for(var i=0;i<data.events.length;i++){
			var tempData = data.events[i];
			seriesEventData.push({
				name:tempData[1],
				x: parseInt(tempData[0]),
				y:parseInt(tempData[2]),
				z:parseInt(tempData[2])
			})
		}

		for(var i=0;i<data.finalObserables.length;i++){
			var tempData = data.finalObserables[i];
			for(var j=0;j<tempData.length-2;j++){
				if(tempData[j] && tempData[j]!='MISSING' && tempData[tempData.length-1]!='0'){
					if(chartType!='bubble'){
						observablesData.push({
							name:tempData[j],
							color: get_random_color(),
							x: parseInt(tempData[tempData.length-2]),
							y:parseInt(tempData[tempData.length-1]),
							z:parseInt(tempData[tempData.length-1])
						})
					}else{
						observablesData.push({
							name:tempData[j],

							x: parseInt(tempData[tempData.length-2]),
							y:parseInt(tempData[tempData.length-1]),
							z:parseInt(tempData[tempData.length-1])
						})
					}

				}

			}

		}

		$scope.drillDownEvents = [];

		$('#actvity').highcharts({
			chart: {
				type: chartType,
				zoomType: 'x',
				backgroundColor: 'white',
			},
			global: {
				useUTC: false
			},

			tooltip: {
				formatter: function() {
					return  '<b>' + this.point.name +'</b><br/> Count : '+ this.point.y+"<br/> Time : "+moment.utc(new Date(this.point.category)).format();
				}
			},
			title: {
				text: ''

			},
			legend: {
				enabled: false
			},

			xAxis: {
				title: {
					text: 'Time'
				},
				type: 'datetime'


			},


			plotOptions: {

				column: {
					stacking: 'normal'
				},
				series: {
					cursor: 'pointer',
					events: {
						click: function (event) {
							var object = event.point.options;

							var tempObject = {
									event_name: object.name, 
									event_time: event.point.category,
									event_type: event.point.series.name,
									size: event.point.y
							}

							$("#label_value").text(object.name);
							$("#timestamp_value").text(tempObject.event_time);
							$("#label").text(tempObject.event_type+":");
							$("#Count").text(tempObject.size);


							investigationPanelFactory.loadDrillDown(tempObject).then(function (response){


								var htmlTable = [];



								if(response.data.length!=0){

									$("#events_info_table").empty();

									htmlTable.push("<table class = 'table table-striped  dataTable no-footer dtr-inline'>")
									htmlTable.push("<thead>");
									htmlTable.push("<tr>");

									Object.keys(response.data[0]).forEach(function (item) {
										htmlTable.push("<th>"+item+"</th>");
									});
									htmlTable.push("</tr>");
									htmlTable.push("</thead>");

									htmlTable.push("<tbody>");

									for(var i=0;i<response.data.length;i++){
										htmlTable.push("<tr>");				
										Object.keys(response.data[i]).forEach(function (item) {
											htmlTable.push("<td>"+response.data[i][item]+"</td>");
										});
										htmlTable.push("</tr>");		
									}


									htmlTable.push("</tbody>");


									$("#events_info_table").append(htmlTable.join(''));

									setTimeout(function(){
										$("#events_info_table").find("table").DataTable( {
											scrollY:        '50vh',
											scrollCollapse: true,
											paging:         false,
											dom: 'Bfrtip',
											buttons: [
												'copyHtml5',
												'excelHtml5',
												'csvHtml5'

												]
										} );
									}, 2000);
								}

								$scope.drillDownEvents = response.data;

							},function(error){
								unloader("body");
							});


						}
					}
				}
			},
			series: [{
				id: 'Rules',
				name : 'Rules',
				color: '#cb0001',
				data : seriesData
			},{
				id: 'Events',
				name : 'Events',
				color: '#007abf',
				data : seriesEventData
			},
			{
				id: 'Observables',
				name : 'Observables',

				data : observablesData
			}]

		});


		var chart = $('#actvity').highcharts();

		var series = chart.series[0];
		if (!$scope.isEnableRulesButton) {
			series.hide();

		} else {
			series.show();

		}

		var series2 = chart.series[1];
		if (!$scope.isEnableEventsButton) {
			series2.hide();

		} else {
			series2.show();

		}

		var series3 = chart.series[2];
		if (!$scope.isEnableObservablesButton) {
			series3.hide();

		} else {
			series3.show();

		}


	}

	function get_random_color() {
		return "#" + (Math.round(Math.random() * 0XFFFFFF)).toString(16);
	}

	$scope.changeChartType = function(chartType){
		$scope.buildActivityChart($scope.chartData,chartType)
	}


	self.openWorkBenchModal = function(){
		$("#createWorkModal").modal();
		$scope.investigationForm.$setPristine(); 
		$scope.investigationForm.$setUntouched(); 
	}

	self.addToCase = function(data){
		$("#addCasesModal").modal();
	}


	$scope.graphClass = "col-md-12";
	$scope.graphSideClass = "col-md-0";



	self.saveCases = function(){

		var tempArray = [];
		for(var i=0;i<self.casesList.length;i++){
			tempArray.push(self.casesList[i].id);
		}

		var casesFinalList = {
				id:tempArray.join(','),
				investigationId:self.workBench.id,
				investigationName:self.workBench.workBenchName
		}

		if(tempArray.length==0){
			self.caseAlertMessage.push({ type: 'danger', msg: 'Select Atleast One Case' });

			$timeout(function () {
				self.caseAlertMessage = [];
			}, 2000);
			return false;
		}

		caseFactory.attachInvestigationToCase(casesFinalList).then(function(response){
			if(response.data.status){
				unloader("body");
				self.alertMessagaes.push({ type: 'success', msg: 'Cases Was Updated' });

				$("#addCasesModal").modal('hide');
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else{
				unloader("body");
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });

				}
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}



		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}


		});


		$scope.uploadFile();

	}



	self.init = function() {
		//self.loadWorkbenchTabs();
		//self.loadPanelDetails();
		self.loadWorkBench();
		self.loadAllUsersWithCompany();
		self.loadCases();
		//self.getAllEvents();
		//self.getAnalyzedFields();


	}


	self.alertMessagaesModal = [];

	self.submitData = function(){
		var tempArray = [];

		self.workBench.artifacts = '';
		self.workBench.userNames = '';
		if(self.workBench.workBenchName == '' || self.workBench.workBenchName == undefined || self.workBench.status =='' || self.workBench.status == undefined || self.workBench.description==''||self.workBench.description == undefined){
			self.alertMessagaesModal.push({ type: 'danger', msg: ' Please fill the highlightef fields' });
			$timeout(function () {
				self.alertMessagaesModal = [];
			}, 2000);
			return false;
		}else if(self.workBench.status =='Closed'){

		}
		loader("#createWorkModal");
		investigationPanelFactory.saveWorkBench(self.workBench).then(function (response) {
			if(response.data.status){
				unloader("#createWorkModal");
				self.alertMessagaesModal.push({ type: 'success', msg: ' Workbench was created successfully' });
				self.loadWorkBench();
				$timeout(function () {
					$("#createWorkModal").modal('hide');
					self.alertMessagaesModal = [];
				}, 2000);
			}else{
				unloader("#createWorkModal");
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.alertMessagaesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaesModal.push({ type: 'danger', msg: response.data.data });

				}
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
			}



		}, function (error) {
			unloader("#createWorkModal");
			if(error.status== 403){
				self.alertMessagaesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
			}


		});
	}

	self.existingCases = [];

    $scope.changeStatus =  function(){

    var data = {id : self.workBench.id,status:self.workBench.status};

    investigationPanelFactory.changeStatus(data).then(function (response){

        if(response.data.status){
            self.alertMessagaesModal.push({ type: 'success', msg: "Successfully Changed the status"});
            $timeout(function () {
            		self.alertMessagaesModal = [];
            }, 2000);
        }


         },function(error){

            //	$(".custom-menu").finish().toggle(100);
      });

    }

    $scope.showGraphRelationships = function(){

        self.showWorkGraphBench($scope.workbenchId);
        //$scope.templateurl = "showworkbench.html";
    }

    self.showWorkGraphBench = function(id){
    		for(var i = 0; i < self.workBenchDetails.length; i++){
    			if(self.workBenchDetails[i].id === id) {
    				self.workBench = angular.copy(self.workBenchDetails[i]);
    				$scope.templateurl = "showworkbench.html";
    				$scope.workbenchId = id
    				if(self.workBenchDetails[i].networkJson){

    					setTimeout(function(){

    						var data = JSON.parse(self.workBenchDetails[i].networkJson);

    						$scope.tempSuspiciousPath = JSON.parse(self.workBenchDetails[i].suspicious);

    						var tempEdges = [];
    						for(var j=0;j<data.edges.length;j++){
    							if(data.edges[j]){
    								tempEdges.push(data.edges[j]);
    							}
    						}
    						var tempData = {nodes:data.nodes,edges:tempEdges}


    						self.loadRulesActivity(self.workBench.id)

    						loadNetworkChart(tempData, investigstionFactory,investigationPanelFactory, self,$scope,alertsFactory,self.workBench.id,'','hirec');
    						$timeout(function(){
    							var eventTypeCheckBox = document.getElementById('eventsTypeId');
    							new Switchery(eventTypeCheckBox,{ size: 'small' });
    							eventTypeCheckBox.innerHTMl = eventTypeCheckBox.checked;
    							eventTypeCheckBox.onchange = function() {
    								if(eventTypeCheckBox.checked){

    									Object.keys(allNodes).forEach(function(key) {
    										var dataNodes = allNodes[key];
    										dataNodes.label = '';
    										network.body.data.nodes.update(dataNodes[key]);
    									});
    								}else{

    									Object.keys(allNodes).forEach(function(key) {
    										var dataNodes = allNodes[key];
    										dataNodes.label = allNodes[key].label;
    										network.body.data.nodes.update(dataNodes[key]);
    									});
    								}

    							};
    							unloader("body");
    						},3000);

    					},

    					2000);


    				}else{
    					self.explore();
    					$timeout(function(){




    						var grpahView = document.getElementById('eventsTypeId');

    						new Switchery(grpahView,{ size: 'small' });

    						grpahView.onchange = function() {
    							if(grpahView.checked){
    								$(".custom-menu").finish().toggle(100);
    								$(".tooltip-static-demo").finish().toggle(100);
    								var object = new Object();

    								var exitingNodes = network.body.data.nodes._data;

    								var exitngEdges = network.body.data.edges._data;

    								var exitingTempNodes  = [];
    								var exitingTemEdges  = [];

    								Object.keys(exitingNodes).forEach(function(key) {
    									exitingTempNodes.push(exitingNodes[key]);
    								});

    								Object.keys(exitngEdges).forEach(function(key) {
    									exitingTemEdges.push(exitngEdges[key]);
    								});
    								object['nodes'] = exitingTempNodes;
    								object['edges'] = exitingTemEdges;

    								$("#upDown").show();
    								$("#leftToRight").show();

    								loadNetworkChart(object, investigstionFactory, investigationPanelFactory, self, $scope,alertsFactory,self.workBench.id,'UD','graphView')

    							}else{
    								$(".custom-menu").finish().toggle(100);
    								$(".tooltip-static-demo").finish().toggle(100);
    								var object = new Object();

    								var exitingNodes = network.body.data.nodes._data;

    								var exitngEdges = network.body.data.edges._data;

    								var exitingTempNodes  = [];
    								var exitingTemEdges  = [];

    								Object.keys(exitingNodes).forEach(function(key) {
    									exitingTempNodes.push(exitingNodes[key]);
    								});

    								Object.keys(exitngEdges).forEach(function(key) {
    									exitingTemEdges.push(exitngEdges[key]);
    								});
    								object['nodes'] = exitingTempNodes;
    								object['edges'] = exitingTemEdges;

    								$("#upDown").show();
    								$("#leftToRight").show();

    								loadNetworkChart(object, investigstionFactory, investigationPanelFactory, self, $scope,alertsFactory,self.workBench.id,'UD','hirec')


    								//$scope.isHirect = true;
    							}

    						};

    						unloader("body");
    					},3000);
    				}




    				$scope.createButtonShow = false;


    				break;
    			}
    		}
    		self.buttonName="Update";


    	}


    $scope.changeAssingee = function(){
     var data = {id : self.workBench.id,status:self.workBench.userNames};
     investigationPanelFactory.changeAssignee(data).then(function (response){

            if(response.data.status){
                self.alertMessagaesModal.push({ type: 'success', msg: "Successfully Assingnee the user"});
                $timeout(function () {
                		self.alertMessagaesModal = [];
                }, 2000);
            }


             },function(error){

                //	$(".custom-menu").finish().toggle(100);
          });

    }

    $scope.currentComments = [];

    $scope.deleteComment = function(id,index){

        investigationPanelFactory.deleteComment(id).then(function (response){

                   if(response.status === 200){

                       investigationPanelFactory.getAllWorksBenches().then(function (response){


                       			self.workBenchDetails = response.data;

                                self.loadComments();


                       		},function(error){
                       			unloader("body");
                       		});



                   }

                },function(error){
                	unloader("body");
                	$(".custom-menu").hide();
                //	$(".custom-menu").finish().toggle(100);
                });

    }

	self.showWorkBench = function(id){
	     $scope.currentComments = [];
		for(var i = 0; i < self.workBenchDetails.length; i++){
			if(self.workBenchDetails[i].id === id) {
				self.workBench = angular.copy(self.workBenchDetails[i]);
                $scope.currentComments = angular.copy(self.workBenchDetails[i].comments);
				$scope.workbenchId = id;
                self.loadKeyObservables(self.workBench.alertId);
				$scope.createButtonShow = false;


				break;
			}
		}



	}

    $scope.keyObservables = {};

	self.loadKeyObservables = function(alertId){
        $scope.keyObservables = {};
	    investigationPanelFactory.loadKeyObservables(alertId).then(function (response){
             $scope.keyObservables = angular.copy(response.data);
             $scope.templateurl = "showDetailedInvestigation.html";
             self.loadAgForThreadGrid();
        },function(error){
        	unloader("body");
        	$(".custom-menu").hide();
        //	$(".custom-menu").finish().toggle(100);
        });

	}



	self.addIndicatorModal = function(){

		var dataNode = allNodes[selectedNode];

		if(dataNode.nodeValue.indexOf("Observables")!=-1){


			$("#add_node").modal();
		}else{
			alert("Please select valid node");
		}

	}




    			self.loadAgForThreadGrid = function(){
    				$timeout(function(){

                       self.columnThreatDefs = [
                           		{headerName: "Priority",field: "threatLevel",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                           		{headerName: "Type",field: "type",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                           		{headerName: "Category",field: "category",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                           		{headerName: "Description",field: "indicator",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                           		{headerName: "Is Found Locally",field: "foundLocally",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}}


                               ]

    				    console.log("test");

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
    							columnDefs: self.columnThreatDefs,
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
    							rowData: $scope.keyObservables.threatData,
    							rowSelection: 'single',
    							floatingFilter:true,
    							rowGroupPanelShow: 'always',

    							onFirstDataRendered(params) {
    								params.api.sizeColumnsToFit();
    							}
    					}




    					$("#threatFeedData").empty();

    					$("#threatFeedData").css("height",$(window).height()-250+"px");

    					var eGridDiv =  document.querySelector('#threatFeedData');
    					new agGrid.Grid(eGridDiv, self.eventGrid );
    				},250);
    			}




	self.deleteWorkBenchTab = function(id,name){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+name+'</b> panel ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						investigationPanelFactory.deleteWorkBenchTab(id).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Work bench was deleted successfully' });
								// toastr.success("Condition was deleted
								// successfully")
								self.loadWorkbenchTabs();
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							if(!response.data.status){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.message });
								// toastr.success("Condition was deleted
								// successfully")

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							unloader("body");

						}, function (error) {
							unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
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

	self.historyBack = function(){
		window.history.back();
	}

	self.searchTerm = {search:''} ;

	$scope.nodesPerviousContext = {};

	$scope.showAlerts = function(){
		$(".custom-menu").hide();
		investigationPanelFactory.loadEventsFromObservables(selectedNode.fieldName,selectedNode.name,selectedNode.id,"rules").then(function (response){
			$(".custom-menu").hide();
			var items = $scope.indicators;
			var tempItems = [];
			for(var i=0;i<items.length;i++){
				tempItems.push(items[i].field);
			}
			var eventTypeCheckBox = document.getElementById('eventsTypeId');
			for(var i=0;i<response.data.nodes.length;i++){

				var tempData = response.data.nodes[i];
				var label = tempData.label

				//tempData['old_label'] = label;
				network.body.data.nodes.add(tempData);
				$scope.indicators.push({field:response.data.nodes[i].name,type:response.data.nodes[i].group})



			}
			for(var i=0;i<response.data.edges.length;i++){
				network.body.data.edges.add(response.data.edges[i]);

			}
			allNodes = nodesDataset.get({returnType:"Object"});

			network.fit();
			$(".custom-menu").hide();
		},function(error){
			unloader("body");
			$(".custom-menu").hide();
//			$(".custom-menu").finish().toggle(100);
		});

	}
	
	$scope.contextData = [];
	
	$scope.attributes = [];
	
	$scope.galaxy = [];
	
	$scope.tabName = "Attributes"
	
	$scope.showContext = function(){
		
		$scope.contextData = [];
	
	$scope.attributes = [];
		
		investigationPanelFactory.loadContext(selectedNode.name).then(function (response){

			$(".custom-menu").finish().toggle(100);
			
			for(var i=0;i<response.data.length;i++){
				for(var j=0;j<response.data[i].attributes.length;j++){
					$scope.attributes.push(response.data[i].attributes[j]);
				}
			}
			
			for(var i=0;i<response.data.length;i++){
				for(var j=0;j<response.data[i].galaxy.length;j++){
					$scope.galaxy.push(response.data[i].galaxy[j]);
				}
			}
			
			
			
			$("#context-model").modal();

		},function(error){
			unloader("body");
			$(".custom-menu").finish().toggle(100);
		});

	}
		
	

	$scope.showEvents = function(){
		
		investigationPanelFactory.loadEventsFromObservables(selectedNode.fieldName,selectedNode.name,selectedNode.id,"events").then(function (response){

			$(".custom-menu").finish().toggle(100);
			var items = $scope.indicators;
			var tempItems = [];
			for(var i=0;i<items.length;i++){
				tempItems.push(items[i].field);
			}
			var eventTypeCheckBox = document.getElementById('eventsTypeId');


			for(var i=0;i<response.data.nodes.length;i++){

				var tempData = response.data.nodes[i];
				var label = tempData.label
				if(eventTypeCheckBox.checked == true){
					tempData.label = "";
				}
				//tempData['old_label'] = label;
				network.body.data.nodes.add(tempData);
				$scope.indicators.push({field:response.data.nodes[i].name,type:response.data.nodes[i].group})

			}
			for(var i=0;i<response.data.edges.length;i++){
				network.body.data.edges.add(response.data.edges[i]);

			}
			allNodes = nodesDataset.get({returnType:"Object"});
			network.fit()

		},function(error){
			unloader("body");
			$(".custom-menu").finish().toggle(100);
		});

	}


	$scope.basicInfo = {};
	$scope.indicatorDetails = [];

	$scope.indicatorType = "";

	$scope.fieldChecked = [];

	$scope.dispalyBasicInfo = function(data){
		$scope.basicInfo = data.basicInfp;

		if(data.indicatorType === "hash"){
			$scope.indicatorDetails = data;
		}else{
			$scope.indicatorDetails = data.details;
		}



		$scope.indicatorType = data.indicatorType;

	}
	$scope.indicators = [];
	$scope.updateIndicatorsTable = function(id){

		$scope.indicators = [];
		var connectedEdges =  network.getConnectedEdges(id);
		for(var i=0;i<connectedEdges.length;i++){

			var tempNode = allNodes[network.body.data.edges._data[connectedEdges[i]].to];
			if(tempNode.nodeValue!="Observables"){
				$scope.indicators.push({field:tempNode.name,type:tempNode.nodeValue.split("||")[0],canDelete:true});
			}

		}

	}

	$scope.currentThreatData = {};

	$scope.currentLocalContextOfIndicator = {id:"teest"}


	$scope.showNodeInfo = function(data,type){

		$scope.currentThreatData = {};
		if(type==="threat"){
			$scope.currentThreatData = angular.copy(data);
			$scope.currentThreatData['type'] = type
			$("#show_node_info").modal();
		}else{

			var table = [];

			$("#node_info_body").empty();

			Object.keys(data).forEach(function(key) {
				table.push("<tr>")

				table.push("<td class='td-field-label'>"+key+"</td>")
				table.push("<td class='td-field-value'>"+data[key]+"</td>");

				table.push("</tr>")
			});

			$("#node_info_body").append(table.join(''))

			$("#show_node_info").modal();







		}


		//$scope.currentThreatData['type'] = type



	}

	$scope.eventInfo = {} ;

	$scope.search = function(){
		var dataNodes = allNodes;

		var tempNodes = [];

		if(self.searchTerm.search===""){

			Object.keys(dataNodes).forEach(function(key) {
				if($scope.nodesPerviousContext[key]){
					network.body.data.nodes.update($scope.nodesPerviousContext[key]);
				}

			});

			return false;
		}

		Object.keys(dataNodes).forEach(function(key) {
			if(dataNodes[key].label.toLowerCase().indexOf(self.searchTerm.search.toLowerCase())!=-1){
				$scope.nodesPerviousContext[key] = angular.copy(dataNodes[key]);
				dataNodes[key].color = {background:'red'};
				dataNodes[key].group = 'search';
				tempNodes.push(dataNodes[key]);
				network.body.data.nodes.update(dataNodes[key]);
			}

		});



	}


	self.columnDefs = [
		{headerName: "Name",field: "workBenchName",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Description",field: "description",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Status",field: "status",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		{headerName: "Created Date",field: "createdDate",comparator: dateComparator,width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		{headerName: "Last Updated Date",field: "lastupdateDate",comparator: dateComparator,width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Investigators",field: "userNames",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}}
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
//						defaultToolPanel: 'columns'
					},
					rowData: self.workBenchDetails,
					rowSelection: 'single',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onSelectionChanged,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					}
			}

			self.eventId = [];
			$("#investigationContent").empty();
			$("#investigationContent").css("height",$(window).height-150+"px");
			$("#viewInvestigation").hide();
			if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
				self.eventGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#investigationContent');
			new agGrid.Grid(eGridDiv, self.eventGrid );
		},250);
	}

	$scope.changeLayoutToGraphView = function(){
		var object = new Object();

		var exitingNodes = network.body.data.nodes._data;

		var exitngEdges = network.body.data.edges._data;

		var exitingTempNodes  = [];
		var exitingTemEdges  = [];
		var eventTypeCheckBox = document.getElementById('eventsTypeId');
		Object.keys(exitingNodes).forEach(function(key) {

			var tempData = exitingNodes[key];
			var label = tempData.label
			if(eventTypeCheckBox.checked == true){
				tempData.label = "";
			}
			//tempData['old_label'] = label;

			exitingTempNodes.push(tempData);
		});

		Object.keys(exitngEdges).forEach(function(key) {
			exitingTemEdges.push(exitngEdges[key]);
		});
		object['nodes'] = exitingTempNodes;
		object['edges'] = exitingTemEdges;



		loadNetworkChart(object, investigstionFactory, investigationPanelFactory, self, $scope,alertsFactory,self.workBench.id,'','graphView')

	}

	$scope.changeLayoutToUpDown = function(){


		var object = new Object();

		var exitingNodes = network.body.data.nodes._data;

		var exitngEdges = network.body.data.edges._data;

		var exitingTempNodes  = [];
		var exitingTemEdges  = [];

		var eventTypeCheckBox = document.getElementById('eventsTypeId');
		Object.keys(exitingNodes).forEach(function(key) {

			var tempData = exitingNodes[key];
			var label = tempData.label
			if(eventTypeCheckBox.checked == true){
				tempData.label = "";
			}
			
			//tempData['old_label'] = label;

			exitingTempNodes.push(tempData);
		});

		Object.keys(exitngEdges).forEach(function(key) {
			exitingTemEdges.push(exitngEdges[key]);
		});
		object['nodes'] = exitingTempNodes;
		object['edges'] = exitingTemEdges;



		loadNetworkChart(object, investigstionFactory, investigationPanelFactory, self, $scope,alertsFactory,self.workBench.id,'UD','hirec')
	}

	$scope.changeLayoutToLeftRight = function(){
		$(".custom-menu").finish().toggle(100);
		$(".tooltip-static-demo").finish().toggle(100);
		var object = new Object();

		var exitingNodes = network.body.data.nodes._data;

		var exitngEdges = network.body.data.edges._data;

		var exitingTempNodes  = [];
		var exitingTemEdges  = [];

		var eventTypeCheckBox = document.getElementById('eventsTypeId');
		Object.keys(exitingNodes).forEach(function(key) {

			var tempData = exitingNodes[key];
			var label = tempData.label
			if(eventTypeCheckBox.checked == true){
				tempData.label = "";
			}
			//tempData['old_label'] = label;

			exitingTempNodes.push(tempData);
		});

		Object.keys(exitngEdges).forEach(function(key) {
			exitingTemEdges.push(exitngEdges[key]);
		});
		object['nodes'] = exitingTempNodes;
		object['edges'] = exitingTemEdges;


		loadNetworkChart(object, investigstionFactory, investigationPanelFactory, self, $scope,alertsFactory,self.workBench.id,'LR','hirec')
	}


	self.onSelectionChanged = function() {
		self.eventId = [];
		$("#viewInvestigation").hide();
		self.eventId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.eventId.length > 0){			
			$("#viewInvestigation").show();
		}
	}


	$(window).resize(function() {
		setTimeout(function() {
			self.eventGrid.api.sizeColumnsToFit();
			$("#investigationContent").css("height",$(window).height()-250+"px");
		}, 500);
	});

}]);

function loadTimelineChart(newData, investigstionFactory, investigationPanelFactory, asdf, scope) {
	var self = asdf;
	var container = document.getElementById('timeline-graph');

	var data = newData;

	var options = {
			width: '100%',
			editable: false,
			margin: {
				item: 20
			},
			horizontalScroll: true,
			verticalScroll: true
	}

	var timeline = new vis.Timeline(container, data, options);
	scope.timelinedata={};
	timeline.on("doubleClick", function (params) {
		console.log(params.item);
		console.log(data._data[params.item]);
		scope.timelinedata=data._data[params.item];
	});
};




function loadNetworkChart(newData, investigstionFactory, investigationPanelFactory, asdf, scope,alertsFactory,workbenchId,layout,viewType) {
	var self = asdf;
	var container = document.getElementById('workflow-graph');

	var data = newData;
	scope.networkData = newData;
	scope.nodeTracker = newData.nodeTracker;

	var LENGTH_MAIN = 350,
	LENGTH_SERVER = 150,
	LENGTH_SUB = 50,
	WIDTH_SCALE = 2






	for(var i=0;i<data.nodes.length;i++){
		if(data.nodes[i].startNode){
			startpages.push(data.nodes[i].id);

		}
	}

	var exitingTempNodes= [];

	var exitingTemEdges= [];

	Object.keys(data.nodes).forEach(function(key) {
		var node = data.nodes[key];
		if(node.group && node.group.indexOf("Alert")==-1 && node.group.indexOf("Events")==-1){
			var label = node.label;
			if(label!=""){
				node['old_label'] = label;
			}
			//node.label = '';
		
		}

		exitingTempNodes.push(node);
	});

	Object.keys(data.edges).forEach(function(key) {
		var edge = data.edges[key];
		//edge['length'] = LENGTH_MAIN;
		//edge['width'] = WIDTH_SCALE * 6;
		exitingTemEdges.push(data.edges[key]);
	});

	nodesDataset = new vis.DataSet(exitingTempNodes); // these come from WorldCup2014.js
	edgesDataset = new vis.DataSet(exitingTemEdges); // these come from WorldCup2014.js



	var options = {
			nodes: {
				shape: 'dot',
				size: 10	,
				shadow: true,
				color:{
					background:'#ffff',
					border:'#ffff'
				},
				font: {
					size: 15,
					color:localStorage.getItem("themeType") === 'white'? '#000':'#fff'
				},

				title:'test'
			},
			autoResize: true,
			height: '1100',
			width: '100%',
			interaction: {
				navigationButtons: true,
				keyboard: true,
				hover:true
			},
			physics:{
				barnesHut:{gravitationalConstant:-30000},
				stabilization: {iterations:2500}
			},




			edges: {
				shadow: true,
//				width: 2,
				smooth: {
					"forceDirection": "horizontal",
					"roundness": 0.95
				},
				arrows: {
					to:     {enabled: true, scaleFactor:1, type:'arrow'},
					middle: {enabled: false, scaleFactor:1, type:'arrow'},
					from:   {enabled: false, scaleFactor:1, type:'arrow'}
				},

				color: {
					inherit: "from",
					highlight:"#1499D7",
					hover:"#1499D7",
					color:"#1499D7"
				}

			},

			groups: {
				"user-Observables": {

					shape: 'image',
					image: 'assets/images/user1.png'
				},
				"ozone":{
					shape: 'circularImage',
					image:'assets/images/ozone-logo.png'
				},
				"User": {
					size: 15,
					color: {
						border: '#FF625B',
						background : '#232436',
					},
					borderWidth : 1,
					shape: 'circularImage',
					image:'assets/images/user.png'
				},
				"host": {

					shape: 'image',
					image:'assets/images/host_name.jpg'
				},

				"url": {

					shape: 'image',
					image:'assets/images/url.png'
				},


				"Hash" : {

					color: {
						border: '#FF625B',
						background : '#232436',
					},
					size: 15,
					borderWidth : 1,
					shape: 'circularImage',
					image:'assets/images/hash.png'
				},
				"File": {

					color: {
						border: '#FF625B',
						background : '#232436',
					},
					size: 15,
					borderWidth : 1,
					shape: 'circularImage',
					image:'assets/images/process.png'
				},
				"IP": {


					size: 15,
					color: {
						border: '#FF625B',
						background : '#232436',
					},
					borderWidth : 1,
					shape: 'circularImage',
					image:'assets/images/ip (1).png'
				},

				"Domain": {


					size: 15,
					color: {
						border: '#FF625B',
						background : '#232436',
					},
					borderWidth : 1,
					shape: 'circularImage',
					image:'assets/images/domain.png'
				},
				"hash-Observables": {


					shape: 'dot',
					color: '#e34073'
				},
				"url-Observables": {


					shape: 'dot',
					color: '#e35640'
				},
				"process-Observables": {


					shape: 'image',
					image:'assets/images/command1.png'
				},

				"endNode": {


					shape: 'dot',
					color: 'pink'
				},


				"search": {


					shape: 'dot',
					color: 'red'
				},
				"ip": {

					shape: 'image',
					image:'assets/images/ip.jpg'
				},
				"domain": {

					shape: 'circularImage',
					image:'assets/images/domain.png'
				},

				"Events": {

					shape: 'circularImage',
					image:'assets/images/event_icons.png'
				},
				"Events-Next": {

					shape: 'dot',
					color: '#20c74c'
				},

				"Rules-Next": {

					shape: 'dot',
					color: '#20c74c'
				},


				"Messages": {

					shape: 'circularImage',
					image:'assets/images/Messages-2-icon.png'
				},
				"Message": {

					shape: 'circularImage',
					image:'assets/images/Messages-2-icon.png'
				},
				"Events-next": {

					shape: 'dot',
					color: '#194a88'
				},
				"host-Observables": {

					shape: 'dot',
					color: 'cyan'
				},
				"rule-event": {

					shape: 'circularImage',
					image:'assets/images/letter_ee.jpg'
				},
				"Internal" : {
					shape: 'circularImage',
					image:'assets/images/internal_icon.png'
				},
				"External" : {
					shape: 'circularImage',
					image:'assets/images/external.png'
				},

				"Current" : {
					shape: 'dot',
					color: 'red'
				},

				"Dummy" : {
					shape: 'dot',
					color: 'red',
					size: 0
				},

				"high-Alert"  : {
					borderWidth : 2,
					color: {
						border: '#FF625B',
						background : '#232436',
					},

					size: 25,
					shape: 'circularImage',
					image: "assets/images/security-alert-1646716 (1).png"

				},


				"Mitre-Alert"  : {
					borderWidth : 3,
					color: {
						border: '#6b3074',
						background : '#232436',
					},

					size: 25,
					shape: 'circularImage',
					image: "assets/images/security-alert-1646716 (1).png"

				},
				"critical-Alert"  : {
					borderWidth : 2,
					color: {
						border: '#FF625B',
						background : '#232436',
					},

					size: 25,
					shape: 'circularImage',
					image: "assets/images/security-alert-1646716 (1).png"

				},
				"medium-Alert"  : {
					borderWidth : 2,
					color: {
						border: '#ffaf00',
						background : '#232436',
					},

					size: 25,
					shape: 'circularImage',
					image: "assets/images/security-alert-1646716 (1).png"

				},
				"low-Alert"  : {
					borderWidth : 2,
					color: {
						border: '#2196f3',
						background : '#232436',
					},

					size: 25,
					shape: 'circularImage',
					image: "assets/images/security-alert-1646716 (1).png"

				},
				"Event"  : {
					borderWidth : 2,
					color: {
						border: '#2196f3',
						background : '#232436',
					},

					size: 10,
					shape: 'circularImage',
					image: "assets/images/cross-sign (1).png"

				},



				dotsWithLabel: {
					label: "I'm a dot!",
					shape: 'dot',
					color: 'cyan'
				},
				mints: {color:'rgb(0,255,140)'},
				icons: {
					shape: 'icon',
					icon: {
						face: 'FontAwesome',
						code: '\uf0c0',
						size: 50,
						color: 'orange'
					}
				},
				source: {
					color:{border:'white'}
				}
			}

	};

	if(viewType != 'graphView'){

		options['layout'] = {
				hierarchical: {
					direction: layout,
					sortMethod: "directed",
					levelSeparation: 150
				}
		},
		options['physics'] =  {
				hierarchicalRepulsion: {
					nodeDistance: 140
				}
		}
		//options['layout'] = 
	}


	network = new vis.Network(container, data, options);

	network.moveTo({scale: 0.5}) 

	allNodes = nodesDataset.get({returnType:"Object"});

	network.on("oncontext", function (params) {

		params.event.preventDefault();
		$(".tooltip-static-demo").finish().toggle(100);
		if(params.nodes.length > 0) {
			selectedNode = network.body.data.nodes._data[params.nodes[0]];
			$(".custom-menu").finish().toggle(100);
			$(".custom-menu").css({
				top: params.event.pageY + "px",
				left: params.event.pageX + "px"
			});
			$('canvas').click(function(e){
				$(".custom-menu").hide();
			});
			$('body').click(function(e){
				$(".custom-menu").hide();
			});
		}

	});



	network.on("click", function (params) {
		if(params.nodes.length > 0) {

			//indicator,group,id,value

			selectedNode = network.body.data.nodes._data[params.nodes[0]];
			//selectedNode['color']='red';
			//network.body.data.nodes.update(selectedNode);

			//$('.context-menu-one').contextMenu();




			alertsFactory.getSingleEventInfo(selectedNode.parent).then(function (response){

				if(Object.keys(response.data).length>0){
					var tempData = angular.copy(response.data);
					delete tempData['Event Data'];
					delete tempData['rule_data']

					scope.alertInfo = angular.copy(tempData);

					var tempEvents = response.data['Event Data'];
					var singleRow = tempEvents[0];

					scope.eventInfo = singleRow;

					$("#investigationsInfo").modal();
				}


				//scope.currentThreatData = angular.copy(response.data);
				//scope.currentThreatData['type'] = selectedNode.group;

				//$("#show_node_info").modal();


			},function(error){
				unloader("body");
			});



		}
	});




	network.on("hoverNode", function(params){ // Highlight traceback on hover


		$(".tooltip-static-demo").finish().toggle(100);

		$(".tooltip-static-demo").css({
			top: params.event.pageY + "px",
			left: params.event.pageX + "px"
		});

		$('.tooltip-static-demo').find("div.tooltip-inner").html(network.body.data.nodes._data[params.node].title)

		//traceBack(params.node,'#fc2003',false);
	});
	

	network.on("blurNode", function(params){ // Highlight traceback on hover
    		$(".tooltip-static-demo").hide();
    	});
    	network.on("blurNode", function(params){ // Highlight traceback on hover

    		//selectedNode = network.body.data.nodes._data[params.nodes[0]];
    		if($(".tooltip-static-demo").attr()){

    		}
    		$(".tooltip-static-demo").finish().toggle(100);


    	});

	network.on("doubleClick", function (params) {

		if(params.nodes.length > 0) {

			var reqIndicator = "";
			var reqIoc = "";
			var reqGroup = "";
			var nodeVal = "";
			var investgationType = "";

			selectedNode = network.body.data.nodes._data[params.nodes[0]];

			investigationPanelFactory.loadEventsFromObservables(selectedNode.fieldName,selectedNode.name,selectedNode.id).then(function (response){

				var items = scope.indicators;
				var tempItems = [];
				for(var i=0;i<items.length;i++){
					tempItems.push(items[i].field);
				}

				for(var i=0;i<response.data.nodes.length;i++){


					network.body.data.nodes.add(response.data.nodes[i]);
					scope.indicators.push({field:response.data.nodes[i].name,type:response.data.nodes[i].group})

				}
				for(var i=0;i<response.data.edges.length;i++){
					if(network.body.data.nodes._data[response.data.edges[i].to] && network.body.data.nodes._data[response.data.edges[i].from] ){
						network.body.data.edges.add(response.data.edges[i]);
					}


				}
				allNodes = nodesDataset.get({returnType:"Object"});

			},function(error){
				unloader("body");
			});

		}

	});


}

//Get all the nodes tracing back to the start node.
function getTraceBackNodes(node) {
	var finished = false;
	var path = [];

	while (! finished) { //Add parents of nodes until we reach the start
		path.push(node);

		if (startpages.indexOf(node) !== -1) { //Check if we've reached the end
			finished = true;
		}
		if(network.body.data.nodes._data[node]){
			node = network.body.data.nodes._data[node].parent;
		}
		//Keep exploring with the node above.
	}
	return path;
}

function getEdgeConnecting(a, b) {
	var edge = network.body.data.edges.get({filter:function(edge) {
		return edge.from === a && edge.to === b;
	}})[0];
	if (edge instanceof Object) {
		return edge.id;
	}
}

//Get all the edges tracing back to the start node.
function getTraceBackEdges(tbnodes) {
	tbnodes.reverse();
	var path = [];
	for (var i=0; i<tbnodes.length-1; i++) { //Don't iterate through the last node
		path.push( getEdgeConnecting(tbnodes[i], tbnodes[i+1]) );
	}
	return path;
}

//Reset the color of all nodes, and width of all edges.
function resetProperties(data) {

	var tempNode = network.body.data.nodes.get(data);

	if(tempNode && tempNode.isSuspicious){
		return false;
	}

	if (!isReset) {

		//Reset node color
		var modnodes = tracenodes.map(function(i){return network.body.data.nodes.get(i);});
		//colorNodes(modnodes, 0);
		//Reset edge width and color
		var modedges = traceedges.map(function(i){
			var e=network.body.data.edges.get(i);
			e.color={color:"#1499D7"};
			e['arrows']={
					to:     {enabled: false, scaleFactor:1, type:'circle'}
			};
			return e;
		});
		edgesWidth(modedges, 1);
		tracenodes = [];
		traceedges = [];
	}
}

function colorNodes(ns,color) {
	var colorFunc = color ? getYellowColor : getColor;

	for (var i=0; i<ns.length; i++) {
		ns[i].color='red';


		// Prevent snapping
		//delete ns[i].x;
		//delete ns[i].y;
		//network.body.data.nodes.update(ns[i]);
	}

	isReset = false;
}
function getYellowColor(level) {
	return lightenHex("#FFC107",5*level); // Gets 5% lighter for each level
}

function rgbToHex(rgb) {
	var hexvals = rgb.map(function(x){return Math.round(x).toString(16);});
	// Add leading 0s to make a valid 6 digit hex
	hexvals = hexvals.map(function(x){
		return x.length == 1 ? "0"+x : x;
	});
	return "#"+hexvals.join("");
}
//Lighten a given hex color by %
function lightenHex(hex,percent) {
	var rgb = hexToRGB(hex); // Convert to RGB
	if (percent>100) percent=100; //Limit to 100%
	var newRgb = rgb.map(function(x){
		return x+percent/100.0*(255-x); // This works because math.
	});
	return rgbToHex(newRgb); //and back to hex
}
function hexToRGB(hex) {
	if (hex[0] == "#"){hex = hex.slice(1,hex.length);} // Remove leading #
	strips=[hex.slice(0,2),hex.slice(2,4),hex.slice(4,6)]; // Cut up into 2-digit strips
	return strips.map(function(x){return parseInt(x,16);}); // To RGB
}



//Highlight the path from a given node back to the central node.
function traceBack(node,edgeColor,needToAddSuspicious) {


	selectedNode = node;

	tracenodes = getTraceBackNodes(node);
	traceedges = getTraceBackEdges(tracenodes);
	//Color nodes yellow
	var modnodes = tracenodes.map(function(i){return  network.body.data.nodes.get(i);});
	colorNodes(modnodes, 1);

	if(needToAddSuspicious){
		suspiciousPath.push(modnodes);
	}

	//Widen edges
	var modedges = traceedges.map(function(i){
		var e= network.body.data.edges.get(i);

		e['arrows']={
				to:     {enabled: true, scaleFactor:1, type:'arrow'}
		},
		e.color = {color:edgeColor,highlight:edgeColor,hover:edgeColor};

		return e;
	});
	edgesWidth(modedges, 5);

}

function edgesWidth(es,width) {
	for (var i=0; i<es.length; i++) {
		es[i].width = width;
		network.body.data.edges.update(es[i]);
	}

	isReset = false;
}

function highlightPaht(selectedItems) {
	var nodeId;
	var degrees = 2;
	// we get all data from the dataset once to avoid updating multiple times.
	var allNodes = nodesDataset.get({returnType:"Object"});
	if (selectedItems.nodes.length == 0) {
		// restore on unselect
		for (nodeId in allNodes) {
			if (allNodes.hasOwnProperty(nodeId)) {
				allNodes[nodeId].color = undefined;
				if (allNodes[nodeId].oldLabel !== undefined) {
					allNodes[nodeId].label = allNodes[nodeId].oldLabel;
					allNodes[nodeId].oldLabel = undefined;
				}
				allNodes[nodeId]['levelOfSeperation'] = undefined;
				allNodes[nodeId]['inConnectionList'] = undefined;
			}
		}
	}
	else {
		var allEdges = edgesDataset.get();

		// we clear the level of seperation in all nodes.
		clearLevelOfSeperation(allNodes);

		// we will now start to collect all the connected nodes we want to highlight.
		var connectedNodes = selectedItems.nodes;

		// we can store them into levels of seperation and we could then later use this to define a color per level
		// any data can be added to a node, this is just stored in the nodeObject.
		storeLevelOfSeperation(connectedNodes,0, allNodes);
		for (var i = 1; i < degrees + 1; i++) {
			appendConnectedNodes(connectedNodes, allEdges);
			storeLevelOfSeperation(connectedNodes, i, allNodes);
		}
		for (nodeId in allNodes) {
			if (allNodes.hasOwnProperty(nodeId)) {
				if (allNodes[nodeId]['inConnectionList'] == true) {
					if (allNodes[nodeId]['levelOfSeperation'] !== undefined) {
						if (allNodes[nodeId]['levelOfSeperation'] >= 2) {
							allNodes[nodeId].color = 'rgba(150,150,150,0.75)';
						}
						else {
							allNodes[nodeId].color = undefined;
						}
					}
					else {
						allNodes[nodeId].color = undefined;
					}
					if (allNodes[nodeId].oldLabel !== undefined) {
						allNodes[nodeId].label = allNodes[nodeId].oldLabel;
						allNodes[nodeId].oldLabel = undefined;
					}
				}
				else {
					allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
					if (allNodes[nodeId].oldLabel === undefined) {
						allNodes[nodeId].oldLabel = allNodes[nodeId].label;
						allNodes[nodeId].label = "";
					}
				}
			}
		}
	}
	var updateArray = [];
	for (nodeId in allNodes) {
		if (allNodes.hasOwnProperty(nodeId)) {
			updateArray.push(allNodes[nodeId]);
		}
	}
	nodesDataset.update(updateArray);
}



/**
 * update the allNodes object with the level of seperation.
 * Arrays are passed by reference, we do not need to return them because we are working in the same object.
 */
function storeLevelOfSeperation(connectedNodes, level, allNodes) {
	for (var i = 0; i < connectedNodes.length; i++) {
		var nodeId = connectedNodes[i];
		if (allNodes[nodeId]['levelOfSeperation'] === undefined) {
			allNodes[nodeId]['levelOfSeperation'] = level;
		}
		allNodes[nodeId]['inConnectionList'] = true;
	}
}

function clearLevelOfSeperation(allNodes) {
	for (var nodeId in allNodes) {
		if (allNodes.hasOwnProperty(nodeId)) {
			allNodes[nodeId]['levelOfSeperation'] = undefined;
			allNodes[nodeId]['inConnectionList'] = undefined;
		}
	}
}

/**
 * Add the connected nodes to the list of nodes we already have
 *
 *
 */
function appendConnectedNodes(sourceNodes, allEdges) {
	var tempSourceNodes = [];
	// first we make a copy of the nodes so we do not extend the array we loop over.
	for (var i = 0; i < sourceNodes.length; i++) {
		tempSourceNodes.push(sourceNodes[i])
	}

	for (var i = 0; i < tempSourceNodes.length; i++) {
		var nodeId = tempSourceNodes[i];
		if (sourceNodes.indexOf(nodeId) == -1) {
			sourceNodes.push(nodeId);
		}
		addUnique(getConnectedNodes(nodeId, allEdges),sourceNodes);
	}
	tempSourceNodes = null;
}

/**
 * Join two arrays without duplicates
 * @param fromArray
 * @param toArray
 */
function addUnique(fromArray, toArray) {
	for (var i = 0; i < fromArray.length; i++) {
		if (toArray.indexOf(fromArray[i]) == -1) {
			toArray.push(fromArray[i]);
		}
	}
}

/**
 * Get a list of nodes that are connected to the supplied nodeId with edges.
 * @param nodeId
 * @returns {Array}
 */
function getConnectedNodes(nodeId, allEdges) {
	var edgesArray = allEdges;
	var connectedNodes = [];

	for (var i = 0; i < edgesArray.length; i++) {
		var edge = edgesArray[i];
		if (edge.to == nodeId) {
			connectedNodes.push(edge.from);
		}
		else if (edge.from == nodeId) {
			connectedNodes.push(edge.to)
		}
	}
	return connectedNodes;
}


function expandNode(page) {
	var label = nodes.get(page).label;
	var pagename = encodeURIComponent(unwrap(label));
	getSubPages(pagename,
			function(data) {expandNodeCallback(page,data);});
}





function neighbourhoodHighlight(params) {
	// if something is selected:

	allNodes = network.body.data.edges._data;
	if (params.nodes.length > 0) {
		highlightActive = true;
		var i,j;
		var selectedNode = params.nodes[0];
		var degrees = 2;

		// mark all nodes as hard to read.



		var connectedNodes = network.getConnectedEdges(selectedNode);

		for(var i=0;i<connectedNodes.length;i++){
			if(allNodes[connectedNodes[i]]){

				allNodes[connectedNodes[i]].color = {
						//color:'#848484',
						highlight:'#848484',
						hover: '#d3d2cd',
						inherit: false,
						opacity:1.0
				}
			}

		}

		// transform the object into an array
		//traceBack(selectedNode);
	}
}


