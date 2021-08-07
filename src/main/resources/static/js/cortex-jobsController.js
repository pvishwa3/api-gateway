app.controller("cortexJobsController",['$scope', '$rootScope', 'cortexJobsFactory', 'coreIntelligenceFactory', '$timeout','caseFactory','caseTemplateFactory','$sessionStorage','$location','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', function($scope, $rootScope, cortexJobsFactory, coreIntelligenceFactory, $timeout,caseFactory,caseTemplateFactory,$sessionStorage,$location,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {
	var self = this;
	
	$rootScope.$broadcast('changeThemeToNormal');
	self.alertMessages =[];	
	$scope.ruleAlertMessagaes = [];
	self.allJobs=[];
	self.allJobsByAnalysisId = [];
	$scope.templateUrl = "analysis.html";
	self.job = {"dataType":"", "analyzer":[], "tlp":"RED", "data":"", "analysisName":"", "analysisDescription":"", "analysisSource":"Manual"};
	self.tlp = ["WHITE", "GREEN", "RED", "AMBER"];
	self.analysisSources = ["Manual", "TI", "Alerts"];
	self.datatype = [];
	self.analyzerDefinitionIds = [];
	self.dataTypesList = [];
	self.analyzerIds = [];
	self.AnalyzerDatatypeMap = {};
	self.allJobsByIds = [];
	self.sideBarClass="panel panel-flat col-md-12"; 
	self.enabledAnalyzers = [];
	self.allIntelligences = [];
	self.scoreForm = {"indicator":"", "analysisData":""};
	self.openConditionForm = function(){	
		$scope.analysis.$setPristine();
		$("#createJob").modal();
		self.job = {"dataType":"", "analyzer":[], "tlp":"", "data":"", "analysisName":"", "analysisDescription":"", "analysisSource":""};
	}
	self.openScoreForm = function() {
		$("#scoreForm").modal();
		self.scoreForm = {"indicator":"", "analysisData":""};
	}
	self.scoreCard = {'status':false, 'isMailicious':false, 'score':'0', 'confidence':''};
	self.getScore = function() {
		loader("body");
		cortexJobsFactory.getScore(self.score).then(function(response){
			console.log(response.data);
			self.scoreCard.status = true;
			self.scoreCard.confidence = response.data.confidence;
			self.scoreCard.isMalicious = response.data.isMalicious;
			self.scoreCard.score = response.data.score;
			unloader("body")
		});
		unloader("body")
	}
	
	$scope.vm = {};
    $scope.vm.dtInstance = {};
    $scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withFixedHeader({
        
   }).withOption('order', [1, 'asc'])
   .withOption('lengthMenu', [25,50, 100, 150, 200]);
	
	self.getEnabledAnalyzers = function() {
		cortexJobsFactory.getEnabledAnalyzers().then(function(response){
			console.log(response.data);
			self.enabledAnalyzers = response.data.result;
		});
		console.log("self.enabledAnalyzers: " + self.enabledAnalyzers);
	}
	
	self.getAllIntelligences = function() {
		coreIntelligenceFactory.getAllIntelligences().then(function(response){
			console.log(response.data);
			self.allIntelligences = response.data.result;
		},function(error){
			unblock("body");
			console.log(error);
		});
	}
	
	self.backToJobs = function(){
		$scope.templateUrl = "jobs.html";
	}
	self.backToAnalysis = function(){
		$scope.showWatchEventButton = false;
		$scope.showHomeButton = true;
		self.sideBarClass="panel panel-flat col-md-12"; 	
		$scope.templateUrl = "analysis.html";
	}
	
	self.saveJob = function(){
		console.log($scope.jobs);
		if(self.job.analysisName==''||self.job.analysisName==undefined||self.job.analysisDescription==''||self.job.analysisDescription==undefined||self.job.analysisSource==''||self.job.analysisSource==undefined||self.job.tlp==''||self.job.tlp==undefined||self.job.dataType==''||self.job.dataType==undefined||self.job.data==''||self.job.data==undefined){
			
			self.alertMessages.push({ type: 'danger', msg: 'Please fill all hilighted details' });
			$timeout(function () {
				self.alertMessages = [];
			}, 2000);
			
		}else{
			$("#createJob").modal('hide');
			console.log(self.job);
			self.startAnalysis();
		}
	}
	self.addValueToKey = function(key, value) {
	    self.AnalyzerDatatypeMap[key] = self.AnalyzerDatatypeMap[key] || [];
	    self.AnalyzerDatatypeMap[key].push(value);
	}
	self.getOrgAnalyzers = function(){
		cortexJobsFactory.getOrgAnalyzers().then(function(response){
			console.log(response.data);
			self.dataTypesList = response.data.dataTypeSet;
			self.rawOrgAnalyzerDetails = JSON.parse(response.data.rawOrgAnalyzerDetails);
			for(var i=0; i < self.rawOrgAnalyzerDetails.length; i++){
				for(var j=0; j<self.rawOrgAnalyzerDetails[i].dataTypeList.length; j++){
					self.addValueToKey(self.rawOrgAnalyzerDetails[i].dataTypeList[j], self.rawOrgAnalyzerDetails[i].analyzerDefinitionId);
				}
			}
		});
	}
	self.OnChangeDataType = function(){
		self.Analyzers = self.AnalyzerDatatypeMap[self.job.dataType];
	}
	self.startAnalysis = function(){
		self.job.dataType = self.job.dataType.intelligenceType;
		loader("body");
		cortexJobsFactory.startAnalysis(self.job).then(function(response){
			console.log(response.data);
			unloader("body");
		});
	}
	self.getCurrentUser = function(){
		cortexJobsFactory.getCurrentUser().then(function(response){
			console.log(response.data);
		});
	}
	self.getStatus = function(){
		cortexJobsFactory.getStatus().then(function(response){
			console.log(response.data);
		});
	}
	self.getAllJobs = function(){
		cortexJobsFactory.getAllJobs().then(function(response){
			console.log(response.data);
			self.allJobs = response.data.result;
		});
	}
	self.getAllJobs();
	self.getAllAnalysis = function(){
		loader("body")
		cortexJobsFactory.getAllAnalysis().then(function(response){
			if(response.data.status){
				self.allAnalysis = response.data.result;
					unloader("body")
					if($location.absUrl().includes("?")) {
						loader("body");
				    	self.getAnalysisJobsById($location.absUrl().split('?')[1]);
				    }
			}
		});
		unloader("body")
	}
	self.getAllAnalysis();
	self.getJobsByQuery = function(){
		cortexJobsFactory.getJobsByQuery().then(function(response){
			console.log("jobsByQuery: " + response.data.allJobs);
		});
	}
//	self.getJobsByQuery();
	self.getJobReportById = function(id){
//		self.sideBarClass="panel panel-flat col-md-8";
		loader("body");
		cortexJobsFactory.getJobReportById(id).then(function(response){
			console.log(response.data);
			self.jobReportData = response.data;
			self.jobReportBasicInfo = JSON.parse(self.jobReportData.result.resultData.BasicInformation);
			console.log(self.jobReportBasicInfo);
			self.jobReportExtSrc = self.jobReportData.result.resultData.ExternalSources;
			self.jobReportPassiveDns = JSON.parse(self.jobReportData.result.resultData.PassiveDNS);
			self.jobReportInhouse = self.jobReportData.result.resultData.InhouseSearch;
			self.jobReportFeed = self.jobReportData.result.resultData.FeedSearch;
			self.jobReportWhois = self.jobReportData.result.resultData.WhoIsDetails;
			self.jobReportPrevRes = self.jobReportData.result.resultData.PreviousResults;
			self.jobReportOther = self.jobReportData.result.resultData.OtherAnalyzers;
			self.jobScore = self.jobReportData.result.resultData.score;
			self.prepareOthersData();
			$scope.templateUrl = "jobReport.html";
			unloader("body");
		});
		unloader("body");
	}
	
	$scope.jsonEditor = {options: {mode: 'view'}};
	self.deleteJobById = function(id){
		loader("body");
		cortexJobsFactory.deleteJobById(id).then(function(response){
			console.log(response.data);
			unloader("body");
		});
		unloader("body");
	}
	self.jobAnalyzerPush=function(data){
		var index = self.job.analyzer.indexOf(data.analyzerName);
		if( index == -1){
			self.job.analyzer.push(data.analyzerName);
		}else{			
			self.job.analyzer.splice(index,1);
		}
		console.log(self.job.analyzer);
	}
	self.getAnalysisJobsById = function(id){
		$scope.templateUrl = "jobs.html";
		loader("body");
		$scope.showHomeButton= false;
		$scope.showWatchEventButton = true;
		for(var i=0; i<self.allAnalysis.length; i++){
			if(self.allAnalysis[i].id == id){
				console.log(id + " | " + Object.keys(self.allAnalysis[i]));
				self.allJobsByAnalysisId = (self.allAnalysis[i].analysisJobDetails).toString().split(',');
				break;
			}
		}
		self.getJobsByIds();
	}
	
	self.deleteAnalysisJobsById = function(id){
		loader("body");
		cortexJobsFactory.deleteAnalysisById(id).then(function(response){
			console.log(response.data);
			unloader("body");
		},function(error){			
			unloader("body");
		});
	}
	
	self.getJobsByIds = function(){
//		self.getAllJobs();
		self.allJobsByIds = [];
		for(var i=0; i<self.allJobsByAnalysisId.length; i++){
			for(var j=0; j<self.allJobs.length; j++){
				if(parseInt(self.allJobsByAnalysisId[i])==self.allJobs[j].id){
					self.allJobsByIds.push(self.allJobs[j]);
				} 
			}
		}
		unloader("body");
	}
	
	self.closeSideBar = function(){
		self.sideBarClass="panel panel-flat col-md-12"; 	
	}
	
	self.prepareOthersData = function() {
		try {
			self.ipstackReport = JSON.parse(self.jobReportOther.ipstack.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.ipapiReport = JSON.parse(self.jobReportOther.ipapi.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.ipdataReport = JSON.parse(self.jobReportOther.ipdata.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.cybercrimeReport = self.jobReportOther.cybercrime;
		} catch(err) {
			console.log(err);
		}
		try {
			self.cymonReport = JSON.parse(self.jobReportOther.cymon.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.mywotReport = JSON.parse(self.jobReportOther.mywot.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.greynoiseReport = JSON.parse(self.jobReportOther.greynoise.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.hashddReport = JSON.parse(self.jobReportOther.hashdd.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.onphyeReport = JSON.parse(self.jobReportOther.onphye.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.otxReport = JSON.parse(self.jobReportOther.otx.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.passivetotalReport = self.jobReportOther.passivetotal;
		} catch(err) {
			console.log(err);
		}
		try {
			self.phishtankReport = JSON.parse(self.jobReportOther.phishtank.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.robtexReport = JSON.parse(self.jobReportOther.robtex.rawData);
		} catch(err) {
			console.log(err);
		}
		try {
			self.shodanReport = JSON.parse(self.jobReportOther.shodan.rawData);
		} catch(err) {
			console.log(err);
		}
	}
	
	caseFactory.getAllCases().then(function(response){
		self.allCases = angular.copy(response.data.resultData);
	},function(error){
		
	});
	
	
	caseTemplateFactory.getAllTemplates().then(function(response){
		self.allTemplate = angular.copy(response.data.resultData);
	},function(error){
		
	});
	
	self.caseTypeConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'title',
			searchField: ['title'],
			valueField: '_id',
			closeAfterSelect:true,
			create:false,
	};
	
	self.templateTypeConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'name',
			searchField: ['name'],
			valueField: '_id',
			closeAfterSelect:true,
			create:false,
	};
	
	
	self.createCase = function(){
		$("#createCase").modal('hide');
		if($scope.newCase == 'new'){
			
			caseFactory.createCaseFromTemplate({"id":self.selectedTemplateId,"owner":$sessionStorage.user.userName,"source":"analyzers","analysisIds":[self.analysisId]}).then(function(response){
				unblock("body");
				if(response.data.status){					
					self.alertMessagaes.push({"type":"success","msg":"case Created successfully"});
					$timeout(function(){
						
						self.alertMessagaes = [];
					},3000);
				}else {
					unblock("body");
					self.alertMessagaes.push({"type":"danger","msg":"unable to create case"+response.data.reason});
					$timeout(function(){
						self.alertMessagaes = [];
					},3000);
				}
			},function(error){
				unblock("body");
				self.alertMessagaes.push({"type":"danger","msg":"unable to create case"+response.data.reason});
				$timeout(function(){
					self.alertMessagaes = [];
				},3000);
			});
		}else if($scope.newCase == 'existing'){
			var data ={};
			for(var i=0;i<self.allCases.length;i++){
				if(self.allCases[i]._id == self.selectedCaseId){
					data = angular.copy(self.allCases[i]);
				}
			}
			if(data.hasOwnProperty('analysisIds')){
				data.analysisIds.push(self.analysisId); 
			}else{
				data['analysisIds'] = [];
				data.analysisIds.push(self.analysisId);				
			}
			caseFactory.updateCase(data).then(function(response){
				if(response.data.status){
					self.alertMessagaes.push({"type":"success","msg":"case Created successfully"});
					$timeout(function(){
						self.alertMessagaes = [];
					},3000);
				}else {
					self.alertMessagaes.push({"type":"danger","msg":"unable to create case"+response.data.reason});
					$timeout(function(){
						self.alertMessagaes = [];
					},3000);
					
				}
				unblock("body");
			},function(error){
				self.alertMessagaes.push({"type":"danger","msg":"unable to create case"+response.data.reason});
				$timeout(function(){
					self.alertMessagaes = [];
				},3000);
				unblock("body");
			});
			
			
//			cortexJobsFactory.updateAnalysisIds(self.selectedCaseId).then(function(response){
//				console.log(response.data);
//			},function(error){
//				
//			});
		}
		
//		http://ec2-18-233-201-204.compute-1.amazonaws.com:8444/api/ts/case/createCaseFromTemplate
//		{
//		    "id":"vHf4fGcBuFiMtHumv0u0",
//		    "owner":"assignee_name",
//		    "source":"Alerts"
//		}
		
	}
	
	
}]);