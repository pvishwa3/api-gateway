app.controller("analyzersController",['$scope', '$rootScope', 'analyzersFactory', 'coreIntelligenceFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', '$timeout', function($scope, $rootScope, analyzersFactory, coreIntelligenceFactory, DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$timeout) {
	var self = this;
	
	$rootScope.$broadcast('changeThemeToNormal');
	self.alertMessages =[];	
	$scope.templateUrl = "analyzers.html";
	self.newAnalyzer = {'id':0, 'analyzerTrustScore':0, 'analyzerName':'', 'analyzerCoreIntelligence':'', 'analyzerStatus':false};
	self.statuses = [true, false];
	self.allAnalyzers = [];
	self.allIntelligences = [];
	
	self.closeSideBar = function(){
		self.sideBarClass="panel panel-flat col-md-12"; 	
	}
	
	self.getAllAnalyzers = function() {
		analyzersFactory.getAllAnalyzers().then(function(response){
			console.log(response.data);
			self.allAnalyzers = response.data.result;
		},function(errror){
			console.log(response.error);
		});
	}
	
	self.backToAnalyzers = function() {
		
	}
	
	self.openNewAnalyzerForm = function() {
		$scope.analyzer.$setPristine();
		self.newAnalyzer = {'id':0, 'analyzerTrustScore':0, 'analyzerName':'', 'analyzerCoreIntelligence':'', 'analyzerStatus':false};
		$("#createAnalyzer").modal();
		
	}
	
	self.saveAnalyzer = function() {
		if(self.newAnalyzer.analyzerName=='' || self.newAnalyzer.analyzerName == undefined||self.newAnalyzer.analyzerCoreIntelligence=='' || self.newAnalyzer.analyzerCoreIntelligence == undefined||self.newAnalyzer.analyzerTrustScore=='' || self.newAnalyzer.analyzerTrustScore == undefined||self.newAnalyzer.analyzerStatus=='' || self.newAnalyzer.analyzerStatus == undefined){
			self.alertMessages.push({ type: 'danger', msg: 'Please fill all hilighted details' });
			$timeout(function () {
				self.alertMessages = [];
			}, 2000);
		}else{
			block();
			analyzersFactory.saveAnalyzer(self.newAnalyzer).then(function(response){
				console.log(response.data);
				unBlock();
			},function(errror){
				console.log(response.error);
				unBlock();
			});
		}
	}
	
	self.editAnalyzer = function(id) {
		self.openNewAnalyzerForm();
		for(var i=0; i<self.allAnalyzers.length; i++) {
			if(self.allAnalyzers[i].id == id) {
				self.newAnalyzer = self.allAnalyzers[i];
				break;
			}
		}
		console.log("self.newAnalyzer: " + self.newAnalyzer.analyzerStatus);
	}
	
	self.getAllIntelligences = function() {
		coreIntelligenceFactory.getAllIntelligences().then(function(response){
			console.log(response.data);
			self.allIntelligences = response.data.result;
		},function(errror){
			console.log(response.error);
		});
	}
	
	$scope.vm = {};
    $scope.vm.dtInstance = {};
    $scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withFixedHeader({
        
   }).withOption('order', [1, 'asc'])
   .withOption('lengthMenu', [25,50, 100, 150, 200]);
	
}]);
