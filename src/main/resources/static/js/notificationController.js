app.controller("notificationController",['$scope','caseTemplateFactory','notificationFactory','$timeout',function($scope,caseTemplateFactory,notificationFactory,$timeout){
	var self = this;
	self.notification = {};
	caseTemplateFactory.getAllTemplates().then(function(response){
		if(response.data.status){			
			self.allCases =angular.copy(response.data.resultData);
		}
	},function(error){
		
	});
	
	$scope.templateUrl='savedNotification.html';
	self.myFunction = function(){		
	}
	
	self.nextPage = function(){
		$scope.templateUrl = 'newnotification.html';
		
	}
	self.edit = function(data){
		self.notification = angular.copy(data);	
		$scope.templateUrl = 'newnotification.html';
	}
	
				
//	self.savedNotifications =[];
	self.getSavedNotifications = function(){
		notificationFactory.getRules().then(function(response){
			self.notification = angular.copy(response.data.result);
			self.savedNotificationsflag= response.data.status;
			self.notification.tiunits = self.notification.tiLookUpThreshold.substring(self.notification.tiLookUpThreshold.length-1 ,self.notification.tiLookUpThreshold.length);
			self.notification.tinumber = Number(self.notification.tiLookUpThreshold.substring(0,self.notification.tiLookUpThreshold.length-1));
		},function(error){
			
		});
	}
	self.getSavedNotifications();
//	$scope.saveRule.$setPristine();
	
	self.saveRule = function(){
		loader("body");
		console.log(self.notification);
		self.notification.tiLookUpThreshold = self.notification.tinumber + self.notification.tiunits;
//		delete self.notification.tinumber;
//		delete self.notification.tiunits;
		console.log(self.notification);
		if(self.doValidations()){
			notificationFactory.saveRule(self.notification).then(function(response){
				if(response.data.status){
					self.alertMessagaes.push({"type":"success","msg":"Notification created successfully"});
					$timeout(function(){
						self.alertMessagaes = [];
					},3000);
				}
				unloader("body");
			},function(error){
				unloader("body")
			});
		}
	};
	
	self.caseTypeConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'name',
			searchField: ['name'],
			valueField: '_id',
			closeAfterSelect:true,
			create:false,
	};
	
	
	self.doValidations = function(){
		var flag =true;
		if(self.notification.threatScore == '' || self.notification.threatScore == undefined || self.notification.sourceCount == '' || self.notification.sourceCount == undefined){
			flag= false;
		}   
		
//		if(self.notification.caseCreation == true){
//			if(self.notification.caseTemplate == '' || self.notification.caseTemplate == undefined){
//				flag = false
//			}
//		} 
		
		if(self.notification.notification == true){
			if(self.notification.emailAddress == '' || self.notification.emailAddress == undefined || self.notification.subject == '' || self.notification.subject == undefined || self.notification.message == '' || self.notification.message == undefined){
				flag = false
			}
		}
		self.alertMessagaes=[];
		if(flag === false){
			self.alertMessagaes.push({"type":"danger","msg":"please enter the values"});
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
		}
		
		return flag;
	}
	
	self.historyBack = function(){
		window.history.back();
	}
}]);