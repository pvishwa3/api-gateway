app.controller("feedController",['$scope', '$rootScope', 'feedControllerFactory', 'coreIntelligenceFactory', '$timeout', 'DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder',function($scope, $rootScope, feedControllerFactory, coreIntelligenceFactory, $timeout,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {
	var self = this;
	
	$rootScope.$broadcast('changeThemeToNormal');
	self.alertMessages =[];	
	$scope.templateUrl = "feeds.html";
	self.newFeed = {'id':0, 'feedTrustScore':0, 'feedName':'', 'feedCoreIntelligence':'', 'feedSourceType': '', 'feedUrl': '', 'delimiter': '', 'begingsWithBlank': '', 'fields':'', 'startsAt':0, 'extractFieldPostion':0, 'banner': '', 'sourceName': '', 'feedSchedulerStatus': false, 'feedScheduler': '', 'feedMetaFields':{}};
	self.statuses = [true, false];
	self.allFeeds = [];
	self.allIntelligences = [];
	self.sourceTypes = ['URL', 'API'];
	self.allSchedules = [];
	
	self.closeSideBar = function(){
		self.sideBarClass="panel panel-flat col-md-12"; 	
	}
	
	self.openNewFeedForm = function() {
		$scope.feed.$setPristine();
		$("#createFeed").modal();
	}
	
	self.scheduleFeed = function() {
		
		if(self.newFeed.feedName=='' || self.newFeed.feedName == undefined||self.newFeed.feedCoreIntelligence =='' || self.newFeed.feedCoreIntelligence == undefined||self.newFeed.feedUrl =='' || self.newFeed.feedUrl == undefined||self.newFeed.sourceName =='' || self.newFeed.sourceName == undefined||self.newFeed.feedSourceType =='' || self.newFeed.feedSourceType == undefined||self.newFeed.delimiter =='' || self.newFeed.delimiter == undefined||self.newFeed.fields =='' || self.newFeed.fields == undefined||self.newFeed.banner =='' || self.newFeed.banner == undefined||self.newFeed.exactFieldPosition =='' || self.newFeed.exactFieldPosition == undefined||self.newFeed.feedSchedulerStatus =='' || self.newFeed.feedSchedulerStatus== undefined||self.newFeed.begingsWithBlank =='' || self.newFeed.begingsWithBlank == undefined||self.newFeed.feedScheduler =='' || self.newFeed.feedScheduler == undefined){
			
			self.alertMessages.push({ type: 'danger', msg: 'Please fill all hilighted details' });
			$timeout(function () {
				self.alertMessages = [];
			}, 2000);
		}
		
		else{
			loader("body");
			feedControllerFactory.scheduleFeed(self.newFeed).then(function(response){
				console.log(response.data);
				unloader("body");
			},function(errror){
				console.log(response.error);
				unloader("body");
			});
			unloader("body");
		}
		
	}
	
	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withFixedHeader({
		
    }).withOption('order', [1, 'asc'])
    .withOption('lengthMenu', [25,50, 100, 150, 200]);
	
	self.getSchedules = function() {
		loader("body");
		feedControllerFactory.getSchedules().then(function(response){
			console.log(response.data);
			self.allFeeds = response.data;
			unloader("body");
		},function(errror){
			console.log(response.error);
			unloader("body");
		});
		unloader("body");
	}
	
	self.editFeed = function(id) {
		for(var i=0; i<self.allFeeds.length; i++) {
			if(self.allFeeds[i].id == id) {
				self.newFeed = self.allFeeds[i];
				self.openNewFeedForm();
				break;
			}
		}
		console.log("self.newFeed: " + self.newFeed);
	}
	
	self.getAllIntelligences = function() {
		coreIntelligenceFactory.getAllIntelligences().then(function(response){
			console.log(response.data);
			self.allIntelligences = response.data.result;
		},function(errror){
			console.log(response.error);
		});
	}
}]);