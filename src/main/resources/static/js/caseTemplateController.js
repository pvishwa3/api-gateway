app.controller("caseTemplateController", ['$scope', 'caseTemplateFactory', '$rootScope', '$timeout', '$uibModal', '$filter', '$ngConfirm','$sessionStorage',function ($scope, caseTemplateFactory, $rootScope, $timeout, $uibModal, $filter,$ngConfirm,$sessionStorage) {

    var self = this;

    self.allTasks = [];
    self.customFields = [];
    self.allMetrics = [];
    self.users = ["user1", "user2", "user3", "user4"];

    self.newCaseTemplate = {
        "description": "",
        "name": "",
        "severity": 0,
        "tlp": 0,
        "tags": [],
        "titlePrefix": "",
        "tasks": [],
		"currentUser":$sessionStorage.user.userName   
    };
    self.alertMessagaes = [];

    self.addTasks = function () {
        self.taks.push(self.newTask);
    }


    self.clearForm = function(){
    	self.newCaseTemplate = {
    	        "description": "",
    	        "name": "",
    	        "severity": 0,
    	        "tlp": 0,
    	        "tags": [],
    	        "titlePrefix": "",
    	        "tasks": [],
    	        "currentUser":$sessionStorage.user.userName
    	    };
    }
    self.addNewTask = function () {
        if (self.newCaseTemplate.tasks.indexOf(self.newTask.title) <= -1) {
            self.newCaseTemplate.tasks.push(self.newTask);
        }
    }



    self.createTemplate = function () {
        if (self.doValidations()) {
        	if($scope.updateCase){
        		self.newCaseTemplate.currentUser = $sessionStorage.user.userName;
        		caseTemplateFactory.updateCaseTemplate(self.newCaseTemplate).then(function(response){
        			if(response.data.status){
        			
        			$scope.updateCase = false;
        			$timeout(function () {
                        self.getAllTemplateDetails();
                        	
                    }, 1000);
                    self.newCaseTemplate = {
                        "description": "",
                        "name": "",
                        "severity": 0,
                        "tlp": 0,
                        "tags": [],
                        "titlePrefix": "",
                        "tasks": [],
                        "currentUser":$sessionStorage.user.userName
                    };
                    $scope.taskname='';
                    self.alertMessagaes.push({
                        type: "success",
                        msg: "Case Template updated successfully"
                    });
        			}
        		},function(error){
        		    self.alertMessagaes.push({
                        type: "danger",
                        msg: "something went wrong please try again later"
                    });
        		    
        		});
        		$timeout(function(){
        			self.alertMessagaes = [];
        		},3000)
        	}else{
        	    caseTemplateFactory.createCaseTemplate(self.newCaseTemplate).then(function (response) {
        	    	$scope.caseTemplate.$setPristine();
                    if (response.data.status) {
                        $timeout(function () {
                            self.getAllTemplateDetails();
                        }, 1000);
                        self.newCaseTemplate = {
                            "description": "",
                            "name": "",
                            "severity": 0,
                            "tlp": 0,
                            "tags": [],
                            "titlePrefix": "",
                            "tasks": [],
                            "currentUser":$sessionStorage.user.userName	
                        };
                        $scope.taskname='';
                        self.alertMessagaes.push({
                            type: "success",
                            msg: "template created succesfully"
                        });
                    }
                   

                }, function (err) {
                    self.alertMessagaes.push({
                        type: "danger",
                        msg: "something went wrong please try again"
                    });
//                    
                });
                $timeout(function () {
                    self.alertMessagaes.pop();
                }, 3000);
        	}
        }
    }

    $scope.updateCase = false;
    self.displayTemplateDetails = function (template) {
    	$scope.updateCase = true;
        self.newCaseTemplate = angular.copy(template);
    }

    self.getAllTemplateDetails = function () {
        caseTemplateFactory.getAllTemplates().then(function (response) {
            self.allTemplates = response.data.resultData;
//            
        });
    }

    self.getAllTemplateDetails();

    self.addTask = function (taskname) {
    	
        if (self.newCaseTemplate.tasks.indexOf(taskname) <= -1 && taskname.length > 0) {
            self.newCaseTemplate.tasks.push(taskname);
        }
    }

    self.removeTaskName = function (taskname) {
        self.newCaseTemplate.tasks.splice(self.newCaseTemplate.tasks.indexOf(taskname), 1);
    }

    self.deleteTemplate = function (id,templateName) {
    	$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+templateName+'</b> template',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						
				        caseTemplateFactory.deleteTemplate(id).then(function (response) {
				            if (response.data.status) {
				                $timeout(function () {
				                    self.getAllTemplateDetails();
				                }, 1500)
				                self.alertMessagaes.push({
				                    type: "success",
				                    msg: "template deleted succesfully"
				                });
				            };
				        }, function (error) {
				            self.alertMessagaes.push({
				                type: 'danger',
				                msg: "something went wrong please try again.."
				            });
				        });
				        
				        $timeout(function(){
				        	self.alertMessagaes.pop();
				        },3000);

					}
				},
				close: function(scope, button){
				}
			}
		});



    }
    self.newCaseTemplate = {
        "description": "",
        "name": "",
        "severity": 0,
        "tlp": 0,
        "tags": [],
        "titlePrefix": "",
        "tasks": [],
        "currentUser":$sessionStorage.user.userName
    };
    var specialCharector = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
    self.doValidations = function () {
        if (self.newCaseTemplate.description == "" || self.newCaseTemplate.name == "" || self.newCaseTemplate.severity == "" || self.newCaseTemplate.tlp == "" || self.newCaseTemplate.titlePrefix == "" || self.newCaseTemplate.tags.length == 0) {
        	
            self.alertMessagaes.push({
                type: "danger",
                msg: "Please fill the highlighted fields"
            });
            $timeout(function() {
                self.alertMessagaes.pop();
            }, 3000);
            return false;
        
        }else if(specialCharector.test(self.newCaseTemplate.titlePrefix) || specialCharector.test(self.newCaseTemplate.name)){
	    	 if(!self.showSideBar){
	    		self.alertMessagaes.push({
	                "type":"danger",
	                "msg": "Special charectors are not allowed"
	            });
	    		 $timeout(function(){
   	    		 self.alertMessagaesModal = [];
   	    		 self.alertMessagaes = [];
   	    	 },3000);
	    	 }else{
	    		 self.alertMessagaesModal.push({
	                "type":"danger",
	                "msg": "Special charectors are not allowed"
	            }); 
	    		 $timeout(function(){
   	    		 self.alertMessagaesModal = [];
   	    		 self.alertMessagaes = [];
   	    	 },3000);
	    	 }
	    	
	    	 
            return false;
        }else{
        	return true;
        }
    }
    
    self.reset = function(){
    	self.newCaseTemplate = {
    	        "description": "",
    	        "name": "",
    	        "severity": 0,
    	        "tlp": 0,
    	        "tags": [],
    	        "titlePrefix": "",
    	        "tasks": [],
    	        "currentUser":$sessionStorage.user.userName
    	    };
    }
}]);
