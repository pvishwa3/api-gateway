
app.controller("caseHistoryController",['$scope', 'caseFactory','$rootScope','$timeout','$uibModal','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$ngConfirm','$location','$routeParams','Fullscreen','$route','$interval','$window','tagService','$sessionStorage','fileUpload','$http','alertsFactory','irpFactory','eventService','jiraConnectionService',function ($scope, caseFactory,$rootScope, $timeout,$uibModal,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$ngConfirm,$location,$routeParams,Fullscreen,$route,$interval,$window,tagService,sessionStorage,fileUpload,$http,alertsFactory,irpFactory,eventService,jiraConnectionService) {

	var self = this;

	self.caseDetails = {};

	$scope.currentTab = "evidence";
	self.caseOptions = [];
	self.users = [];
	$scope.casemessage = {message:""};

	$scope.assignee = "";

	$scope.priority = "";

	$scope.openPriorityModel = function(){
		$("#PriorityModel").modal();
	}

	$scope.options = {
			tooltip:false,
			height: 150,
				toolbar: [
				['style', ['bold', 'italic', 'underline', 'clear']],
				['fontsize', ['fontsize']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['height', ['height']]
				]
	};

	$scope.alertMessages = [];

	$scope.caseFiles;

	self.releatedCases = {id:"",caseId:'',caseName:''}

	$scope.canShowDrillDown = false;

	$scope.isReslovedWithInTime = true;
	$scope.isResponsedWithInTime = true;
	$scope.respondWith = 0;
	$scope.resloveWithIn = 0;
	
	self.existingJiraConnections = [];
	
	self.checkForExistingConnections = function(){
		jiraConnectionService.loadJiraConnections().then(function (response) {

			self.existingJiraConnections = angular.copy(response.data);

		}, function (error) {
			alert("unable to save perf !!")
		});
	}

	self.checkForExistingConnections();

	self.changeStatus = function(data){

		var caseData = {id:self.caseDetails.id,status:data}

		caseFactory.changeStatus(caseData).then(function (response) {


			if(response.data.status){
				$scope.alertMessages.push({ type: 'success', msg: "Successfully Changed the status" });
				self.loadIntitalCases();
			}else{
				$scope.alertMessages.push({ type: 'danger', msg: "Unable to change the status" });
			}


			$timeout(function () {

				$scope.alertMessages = [];
			}, 2000);



		}, function (error) {
			alert("unable to save perf !!")
		});

	}
	self.changePriority = function(data){

		var caseData = {id:self.caseDetails.id,priority:$scope.priority}

		caseFactory.changePriority(caseData).then(function (response) {


			if(response.data.status){
				$scope.alertMessages.push({ type: 'success', msg: "Successfully Changed the status" });
				self.loadIntitalCases();
			}else{
				$scope.alertMessages.push({ type: 'danger', msg: "Unable to change the status" });
			}

			$("#PriorityModel").modal('hide');


			$timeout(function () {

				$scope.alertMessages = [];
			}, 2000);



		}, function (error) {
			alert("unable to save perf !!")
		});

	}



	$scope.quickView = function(data){


		if(data.investigationMap){



			var data = JSON.parse(data.investigationMap);

			//$scope.tempSuspiciousPath = JSON.parse(self.workBenchDetails[i].suspicious);

			var tempEdges = [];
			for(var j=0;j<data.edges.length;j++){
				if(data.edges[j]){
					tempEdges.push(data.edges[j]);
				}
			}
			var tempData = {nodes:data.nodes,edges:tempEdges}



			loadReadonlyNetworkChart(tempData);






		}else{
			$("#workflow-graph").html("<h4 style= 'padding: 24% 39%'>No Investigations Found</h4>")
		}

		$("#QuickViewModel").modal();

	}

	self.attachCasesModal = function(){
		$("#attach-cases-modal").modal();
	}

	$scope.ruleDetailedHistory = [];

	self.getAlertInfo = function(data){



		caseFactory.getRulesBasedOnAlertId(data.alertId).then(function (response) {
			$scope.ruleDetailedHistory = response.data.ruleDetails;
			$scope.investigationDetails = response.data.investigationDetails
		}, function (error) {
			alert("unable to save perf !!")
		});

	}

	$scope.toggleFullScreen = function(id) {
		Fullscreen.enable(document.getElementById("irpGraph"));

	}


	self.irpDetails ={steps:""};
	self.showIRP = function(steps,alertName){
		self.irpDetails.steps = "";
		if(alertName != "" || alertName != undefined){
			for(var i=0;i<self.allIrpDetails.length;i++){
				if(self.allIrpDetails[i].templateName === alertName){
					var graph = new Graph(document.getElementById('irpGraph'));

					//graph.zoom = 0.5;

					graph.resizeContainer = true;
					graph.setCellsMovable(false);
					graph.setCellsSelectable(false);
					graph.setCellsDeletable(false);
					graph.setConnectable(false)
					graph.setCellsEditable(false);
					graph.setAllowDanglingEdges(false);
					graph.setAllowLoops(false);
					graph.setCellsDeletable(false);
					graph.setCellsCloneable(false);
					graph.setCellsDisconnectable(false);
					graph.setDropEnabled(false);
					graph.setSplitEnabled(false);
					graph.setCellsBendable(false);
					var xmlDoc = mxUtils.parseXml(self.allIrpDetails[i].irpXml);
					var codec = new mxCodec(xmlDoc);
					codec.decode(xmlDoc.documentElement, graph.getModel());
					break;
				}
			}
		}else{
			$scope.alertMessages.push({ type: 'danger', msg: "No IRP is configured" });
			$timeout(function(){
				$scope.alertMessages = [];
			},2000);
		}
	}

	self.allIrpDetails = [];

	self.loadIRPS = function(){
		irpFactory.getAllIRPS().then(function(response){
			self.allIrpDetails = angular.copy(response.data);
		},function(error){
			console.log(error)
		});
	}



	$('.tableDrillDown .open').on('click', function() {

		var attr = $('.tableDrillDown').attr('data-id');
		if(attr==='open'){

			$('.tableDrillDown').attr('data-id','close');
			$("#table-body").css({"height": "calc(100vh - 40px - 65px)"});


			$("#case-container").css({"opacity": "0.5","pointer-events": "none"});
		}else{

			$("#case-container").removeAttr("style");
			$("#case-container").removeAttr("style");
			$('.tableDrillDown').attr('data-id','open');
		}

		$('.tableDrillDown .content').slideToggle();

	});
	
	$scope.showSingleEventDetails = function(data){
		$scope.singleEventDetails = data;
	}

	$scope.assigneeError = [];


	$scope.singleEventDetails = {};
	
	$scope.singleEvnentInfo = {};
	
	$scope.showEventDetails = function(data){
		
		$scope.singleEvnentInfo = data;
		$scope.singleEventDetails = data.event_data[0];

		$("#showEventDetails").modal();

	}

	self.changeAssignee = function(){

		var caseData = {id:self.caseDetails.id,userName:$scope.assignee}

		caseFactory.changeAssignee(caseData).then(function (response) {


			if(response.data.status){
				$scope.alertMessages.push({ type: 'success', msg: "Successfully Changed the status" });
				self.loadIntitalCases();
				$("#assing-owner").modal('hide');

				$timeout(function () {

					$scope.alertMessages = [];
				}, 2000);

			}else{
				$scope.assigneeError.push({ type: 'danger', msg: "Unable to change owner" });
				$timeout(function () {

					$scope.assigneeError = [];
				}, 2000);
			}





		}, function (error) {
			alert("unable to save perf !!")
		});
	}
	$scope.ruleSingleInfo = {};
	$scope.getSingleRuleInfo = function(data){

		$scope.ruleSingleInfo = {};

		alertsFactory.getAlertsByDocId(data.id).then(function (response){
			$scope.ruleSingleInfo = response.data;
		});

	}

	self.changeTab = function(tabName){
		if(tabName === "evidence"){
			$scope.canShowDrillDown = false;
		}
		$scope.currentTab = tabName;
	}

	self.loadIntitalCases = function(){
		if(window.location.href.indexOf("name")!=-1){
			var caseId = $routeParams.name;
			self.caseOptions = [];


			irpFactory.getAllIRPS().then(function(response){
				self.allIrpDetails = angular.copy(response.data);
//				self.loadCase(caseId);
				self.getComplexEvents(caseId);
				$(".note-editor.note-frame").css("width","85%");
				$(".note-editor.note-frame.panel.panel-default").css("width","85%");
				$(".note-btn.btn.btn-default.btn-sm.dropdown-toggle").removeClass("dropdown-toggle");
				$( document ).ready(function() {
					$("div.note-toolbar.panel-heading").hover(function(){
//						$timeout(function(){							
							$(".ui-helper-hidden-accessible").remove();
//						},500);
					});
				});

			},function(error){
				console.log(error)
			});



		}

	}


	self.getComplexEvents = function(caseId){
		eventService.getComplexEvents().then(function(response){
			self.alertDetails  = response.data;
			self.loadCase(caseId);
		},function(error){

		});
	} 



	self.loadCase = function(caseId){
		caseFactory.getCasesByDocId(caseId).then(function (response) {
			self.caseDetails = response.data.casedetails;
//			self.alertDetails  = JSON.parse(response.data.irpDetails);


			$scope.isReslovedWithInTime = response.data.isReslovedWithInTime;

			$scope.isResponsedWithInTime = response.data.isResponsedWithInTime;
			$scope.respondWith = response.data.respondWith;
			$scope.resloveWithIn = response.data.resloveWithIn;

			$scope.assignee = self.caseDetails.assignedUser
			$scope.priority = self.caseDetails.priority;

			for(let i=0;i<self.alertDetails .length;i++){
				self.alertDetails[i].notification = JSON.parse(self.alertDetails[i].notification); 
			}



			for(let i=0;i<self.caseDetails.alertEvidences.length;i++){
				for(let j=0;j<self.alertDetails.length;j++){
					for(let m=0;m<self.alertDetails[j].notification.length;m++){
						if(self.alertDetails[j].notification[m].name =="notable"){
							if(self.alertDetails[j].notification[m].irpTemplate != undefined){
								if(angular.equals(self.alertDetails[j].notification[m].title,self.caseDetails.alertEvidences[i].alertName)){
									for(let k=0;k<self.allIrpDetails.length;k++){
										var irpId = Number(self.alertDetails[j].notification[m].irpTemplate);
										if(self.allIrpDetails[k].id == irpId){
											self.caseDetails.alertEvidences[i]['irpName'] = self.allIrpDetails[k].templateName;
											self.caseDetails.alertEvidences[i]['steps'] = self.allIrpDetails[k].steps;
											break;
										}
									}
								}
							}
						}
					}
				}
			}

			if(self.caseDetails.alertEvidences.length!=0){
				self.getAlertInfo(self.caseDetails.alertEvidences[0]);

				if(self.caseDetails.alertEvidences[0].steps,self.caseDetails.alertEvidences[0].irpName){
					self.showIRP(self.caseDetails.alertEvidences[0].steps,self.caseDetails.alertEvidences[0].irpName);
				}


			}

			console.log(self.caseDetails.alertEvidences);


			self.age =  moment(moment.utc(self.caseDetails.createDate).toDate()).local().format('YYYY-MM-DD HH:mm:ss');
			self.lastUpdate =  moment(moment.utc(self.caseDetails.lastUpdate).toDate()).local().format('YYYY-MM-DD HH:mm:ss');
			if(self.caseDetails.status === 'Open'){

				self.caseOptions.push("In Progress");
				self.caseOptions.push("Closed");
				self.caseOptions.push("Resolved");

			}
			if(self.caseDetails.status === 'In Progress'){
				self.caseOptions.push("Closed");
				self.caseOptions.push("Resolved");
			}

			if(self.caseDetails.status === 'Closed' || self.caseDetails.status === 'Resolved'){
				self.caseOptions.push("Open");

			}


		}, function (error) {
			alert("unable to save perf !!")
		});
	}

	self.addFileModel = function(){
		$("#add-file").modal();
	}

	$scope.uploadFile = function() {

		var file = $scope.caseFiles;
		if(!$scope.caseFiles){
			alert("Please Select atleast one file");
			return false;
		}
		console.log('file is ' );
		console.dir(file);
		var uploadUrl = "/case-management/user/case/uploadFile/"+self.caseDetails.id;

		var fd = new FormData();
		fd.append('file', file);

		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).
		then(function (response) {	
			self.loadIntitalCases();
			$("#add-file").modal('hide');
		}, function (error) {

		});

	};

	$scope.notesErroMessage = [];

	self.addNotes = function(){
		var caseData = {id:self.caseDetails.id,note:$scope.casemessage.message}

		if($scope.casemessage.message===""){
			$scope.notesErroMessage.push({ type: 'danger', msg: "Please Enter Message" });

			$timeout(function () {

				$scope.notesErroMessage = [];
			}, 2000);
			return false;
		}

		caseFactory.addNotesToCase(caseData).then(function (response) {


			if(response.data.status){

				self.loadIntitalCases();

				$scope.notesErroMessage.push({ type: 'success', msg: "Successfully added the notes" });

				$timeout(function () {

					$scope.notesErroMessage = [];
				}, 2000);

				$scope.casemessage.message = "";
			}



		}, function (error) {
			$scope.notesErroMessage.push({ type: 'danger', msg: "Unable to add the notes" });
			$timeout(function () {

				$scope.notesErroMessage = [];
			}, 2000);
		});

	}

	self.loadUsers = function(){
		caseFactory.getAllUsers().then(function (response) {
			self.users = response.data;
		}, function (error) {
			alert("unable to save perf !!")
		});

	}

	self.loadExistingCases = function(){
		caseFactory.getMyCases().then(function (response) {
			self.existingCases = response.data;
		}, function (error) {
			alert("unable to save perf !!")
		});

	}

	$scope.attachCasesErrorMessage = [];

	$scope.attachCases = function(){
		self.releatedCases.id = self.caseDetails.id;

		var data = {caseId:self.caseDetails.id,externalId:self.releatedCases.caseId}
		
		caseFactory.attachCases(data).then(function (response) {


			if(response.data.status){

				self.loadIntitalCases();
				$("#attach-cases-modal").modal('hide');
				$scope.alertMessages.push({ type: 'success', msg: "Successfully attached cases" });

				$timeout(function () {

					$scope.alertMessages = [];
				}, 2000);

			}else{
				$scope.attachCasesErrorMessage.push({ type: 'danger', msg: response.data.error });
				$timeout(function () {

					$scope.attachCasesErrorMessage = [];
				}, 2000);
			}



		}, function (error) {
			$scope.attachCasesErrorMessage.push({ type: 'danger', msg: response.data.error });
			$timeout(function () {

				$scope.attachCasesErrorMessage = [];
			}, 2000);
		});



	}


	self.loadUsers();
	self.loadExistingCases();
	self.assignOwnershipModal = function(){
		$("#assing-owner").modal();
	}

	self.loadIntitalCases();


	self.eventCategories = [];
	eventService.getCategories().then(function(response){
		self.eventCategories = angular.copy(response.data.custom);
	},function(error){

	});
}]);

function loadReadonlyNetworkChart(data){
	var container = document.getElementById('read-only-workflow-graph');


	//scope.networkData = newData;
	//scope.nodeTracker = newData.nodeTracker;

	var nodesDataset = new vis.DataSet(data.nodes); // these come from WorldCup2014.js
	var edgesDataset = new vis.DataSet(data.edges); // these come from WorldCup2014.js

	for(var i=0;i<data.nodes.length;i++){
		if(data.nodes[i].group === "ozone"){



			startpages.push(data.nodes[i].id);
		}
	}




	var options = {
			nodes: {
				shape: 'dot',
				size: 25,
				shadow: true,
				color:{
					background:'#ffff',
					border:'#ffff'
				},
				font: {
					size: 15,
					color: 'black'
				}

			},

			layout: {

				improvedLayout:true,
				hierarchical: {
					enabled:false,
					levelSeparation: 300,
					nodeSpacing: 600,
					treeSpacing: 100,
					blockShifting: true,
					edgeMinimization: true,
					parentCentralization: true,
					direction: 'LR',        // UD, DU, LR, RL
					sortMethod: 'directed'   // hubsize, directed
				}
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
			"physics": {
				"barnesHut": {
					"gravitationalConstant": -7000,
					"centralGravity": 1.55,
					"springLength": 60,
					"springConstant": 0.045,
					"damping": 0.16,
					"avoidOverlap": 0.15
				},
				"minVelocity": 0.75
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
				"user": {

					shape: 'image',
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


				"hash" : {
					shape: 'image',
					image:'assets/images/hash.png'
				},
				"process": {

					shape: 'image',
					image:'assets/images/command1.png'
				},
				"ip-Observables": {


					shape: 'image',
					image:'assets/images/ip.jpg'
				},

				"domain-Observables": {


					shape: 'dot',
					color: '#51e095'
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
			},



			interaction: {
				keyboard: true,
				hover: true,
				navigationButtons: true,	
				hideEdgesOnDrag: true,
				multiselect: true
			}
	};




	new vis.Network(container, data, options);
}




