app.controller("coreIntelligenceController",['$scope', '$rootScope', 'coreIntelligenceFactory', '$timeout','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', function($scope, $rootScope, coreIntelligenceFactory, $timeout,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {
	var self = this;
	$rootScope.$broadcast('changeThemeToNormal');
	self.alertMessages =[];	
	$scope.templateUrl = "intelligence.html";
	self.newIntelligence = {'id':0, 'coreIntelligenceType':''};
	self.allIntelligences = [];
	
	self.closeSideBar = function(){
		self.sideBarClass="panel panel-flat col-md-12"; 	
	}
	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withFixedHeader({
		
    }).withOption('order', [1, 'asc'])
    .withOption('lengthMenu', [25,50, 100, 150, 200]);
	
	
	self.getAllIntelligences = function() {
		coreIntelligenceFactory.getAllIntelligences().then(function(response){
			console.log(response.data);
			self.allIntelligences = response.data.result;
		},function(errror){
			console.log(response.error);
		});
	}
	
	self.openNewIntelligenceForm = function() {
		$scope.iocs.$setPristine();
		$("#createIntelligence").modal();
	}
	
	self.saveIntelligence = function() {
		
		if(self.newIntelligence.coreIntelligenceType=='' || self.newIntelligence.coreIntelligenceType == undefined){
			
			self.alertMessages.push({ type: 'danger', msg: 'Please fill all hilighted details' });
			$timeout(function () {
				self.alertMessages = [];
			}, 2000);
		}
		
		else{
			loader("body");
			coreIntelligenceFactory.saveIntelligence(self.newIntelligence).then(function(response){
				console.log(response.data);
				self.getAllIntelligences();
				unloader("body");
			},function(errror){
				console.log(response.error);
				unloader("body");
			});
		}
	}
	
	self.deleteIntelligence = function(id) {
		loader("body");
		coreIntelligenceFactory.deleteIntelligence(id).then(function(response){
			console.log(response.data);
			self.getAllIntelligences();
			unloader("body");
		},function(errror){
			console.log(response.error);
			unloader("body");
		});
	}

	
}]);
