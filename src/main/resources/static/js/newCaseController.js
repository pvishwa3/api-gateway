app.controller("newCaseController", [ '$scope', 'newCaseFactory', '$rootScope','$timeout', '$uibModal','$filter',function($scope, newCaseFactory, $rootScope, $timeout, $uibModal,$filter) {

			$rootScope.$broadcast('changeThemeToNormal');
			$scope.templateUrl = "create-case.html";
		
			var self = this;
			self.responseData ='';
			self.alertMessages =[];
			self.newCase = {"source":"Manual", "title":"", "severity":"", "tags": [], "tlp":"", "description":"", "tasks": []  };
			self.newCaseTemplate = {};
			self.severity = ["High", "Medium", "Low"];
			self.tlp = ["White", "Green", "Amber", "Red"];
			self.newTask = [];
			self.allCases = [];
			self.caseTasks = [];
			self.isTaskDetails = false ;
			self.isTaskDetailsClick = false;
			self.caseAlertMessagaes = [];
			self.closeCaseDetails ={"resolutionStatus":"", "summary": "", "impactStatus": undefined};
			self.allTemplates = [{"id":1, "name":"Empty Template", "title":"1", "severity":"1", "tags": ["1"], "tlp":"1", "description":"1", "startDate":"", "tasks": [] },{"id":2, "name":"template1", "title":"2", "severity":"2", "tags": ["2"], "tlp":"2", "description":"2", "startDate":"", "tasks": []  }];
			self.allCaseSources = ["Manual", "Alerts", "TI"];
			
			self.newCaseCustomField = {"name":"","reference":"","description":"","type":"","options":[]};		
			self.newCaseCustomFieldOptions = ["String", "Boolean", "Number"];
			
			self.titleConfig = {
			           maxItems: 1,
			           optgroupField: 'class',
			             labelField: 'title',
			             searchField: ['title'],
			             valueField: 'title',
			             create: function(value,silent){
			                 self.updateCaseById(value);
			                  return true;
			             }

			         };
			
			self.saveNewCaseCustomFields = function() {
				console.log(self.newCaseCustomField);
				newCaseFactory.caseCustomFieldCreatoin(self.newCaseCustomField).then(function(response) {
					self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					$timeout(function(){
						self.caseAlertMessagaes.pop();
					},2000);
					
					},function(err){
						self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again"});
					})
			}
			
			self.openAllCases = function(){
				$scope.templateUrl = "case-allcases.html";
			}
			self.openNewCase = function(){
				self.newCase = {"title":"", "severity":"", "tags": [], "tlp":"", "description":"", "startDate":"", "tasks": []  };
				$scope.templateUrl = "create-case.html";
			}
			
			self.addTask = function(taskname){
				if(taskname == '' || taskname == undefined) {
					self.caseAlertMessagaes.push({ type: "danger", msg: "TaskName should not be null or empty"});
					$timeout(function(){
						self.caseAlertMessagaes.pop();
					},2000);
					return;
				}

				if(self.newCase.tasks.indexOf(taskname) === -1) {
					self.newCase.tasks.push(taskname);
				}
				
			}
			
			self.removeTask = function(taskname){
				var a = self.newCase.task.indexOf(taskname);
				self.newCase.task.splice(a,1);
			}
			
			self.createCase = function(){
				console.log("newCase: " + self.newCase.severity);
				newCaseFactory.createCase(self.newCase).then(function(response) {
					self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					$timeout(function(){
						self.caseAlertMessagaes.pop();
					},2000);
					self.getAllCases();
					
					},function(err){
						self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again"});
					})
//					self.newCase = {"title":"", "severity":"", "tags": [], "tlp":"", "description":"", "startDate":"", "tasks": []  };	
			}
			
			self.changeCaseDetails = function(data) {
		    	  data = JSON.parse(data);
		    	  for (var key in data) {
		    		  if(self.newCase.hasOwnProperty(key) && data.hasOwnProperty(key)) {
		    			  self.newCase[key] = data[key];
		    		  }
	    		  }
		    	  console.log(self.newCase);
		    }
			
			self.getAllCases = function() {
				newCaseFactory.getAllCases().then(function(response){
					self.allCases=angular.copy(JSON.parse(response.data.responseData));
					for(var i=0; i<self.allCases.length; i++){
						self.allCases[i].startDate = moment(self.allCases[i].startDate).format("DD-MM-YYYY HH:mm A");
					}
				});
			}
				
			self.searchCaseTasks =function(id){
				newCaseFactory.searchCaseTasks(id).then(function(response){
					self.caseTasks = JSON.parse(response.data.responseData);	
				})
				
			}
			
			self.openCaseById = function(id) {
				$scope.templateUrl = "case-opencase.html";
				self.newCase = [];
				self.searchCaseTasks(id);
				self.newCase = angular.copy($filter('filter')(self.allCases, {id: id})[0]);
				self.newCase.startDate = moment(self.newTask.startDate).format("DD-MM-YYYY HH:mm A");
			}
			
			self.taskDetailsArray = [];
			self.openTaskByCaseId = function(id) {
				self.isTaskDetailsClick = true;
				self.newTask = [];
				self.newTask = angular.copy($filter('filter')(self.caseTasks, {id: id})[0]);
				self.newTask.startDate=moment(self.newTask.startDate).format("DD-MM-YYYY HH:mm A");
				self.taskDetailsArray.push(self.newTask);
			}
			
			self.changeTasks= function(task) {
				self.newTask =task;
			}
			self.removeTask = function(task) {
				angular.forEach(self.taskDetailsArray, function(tasks, index){
				    if(tasks.id == task.id ){
				    	self.taskDetailsArray.splice(index,1);
				    }
				});
			}
			
			
			self.deleteCaseById = function(id){
				newCaseFactory.deleteCaseById(id).then(function(response){
					self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					self.getAllCases();
					$timeout(function(){
						self.caseAlertMessagaes.pop();
					},2000);
				},function(err){
					self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again." });
				});
				
				
				
			}
			self.users="";
			self.getAllUsers = function(){
				newCaseFactory.getAllUsers().then(function(response){
					self.users=angular.copy(JSON.parse(response.data.responseData));
				},function(err){
					
				});
			}
			
			 self.changeAssigne = function(id){
				 newCaseFactory.changeAssigne(self.newCase.owner,id).then(function(response){
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
						self.getAllCases();
						$timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again." });	 
				 });
			}
			 self.newTask={taskName:'',status:'',idOfCase:''};
			 self.createNewTask= function(){
				 $("#createTask").modal('hide');
				
				 self.newTask.status="Waiting";
				 self.newTask.idOfCase=self.newCase.id;
				 newCaseFactory.createNewTask(self.newTask).then(function(response){
					 self.searchCaseTasks(self.newCase.id);
				 },function(err){
					 
				 });
			 }
			 
			 
			 self.changeStateOfTask = function(status,id){
				 var obj={};
					obj.status = status;
					obj.id = id;
				 newCaseFactory.changeStateofTask(obj).then(function(response){
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
						$timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
					 self.searchCaseTasks(self.newCase.id);
				 },function(error){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 });
			 };
			 
			 
			 self.changeTheAssigneOfTask = function(id){
				 var obj={};
				 obj.id=id;
				 obj.owner=self.newTask.owner;
				 newCaseFactory.changeTheAssigneOfTask(obj).then(function(response){
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
						self.getAllCases();
						$timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
						self.searchCaseTasks(self.newCase.id)
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 });
				 
			 }
			 
			 self.removeTaskName = function(taskname){
				 $scope.taskname = '';
				 self.newCase.tasks.splice(self.newCase.tasks.indexOf(taskname),1);
			 }
			
			 
			 self.getMyTasks = function(){
				 newCaseFactory.getMyTasks().then(function(response){
					 self.mytasks=JSON.parse(response.data.userTasks);
				 	 $scope.templateUrl="myTasks.html";
				 	 console.log(self.mytasks);
				 },function(err){
					 
				 });
			 }
			 
			 self.getloginedUserDetails = function(){
				 newCaseFactory.getCurrentLoginedUser().then(function(response){
						console.log(response); 
					 },function(err){
						 
					 });
			 }
			 
			 self.getWaitingTasks = function(){
				 newCaseFactory.getWaitingTasks().then(function(response){
					 self.allWaitingTasks = JSON.parse(response.data.responseData);
					 $scope.templateUrl = "waitingTasks.html";
				 },function(error){
					 console.log(error);
				 });
			 }	
			 
			 self.deleteTaskById = function(id) {
				 newCaseFactory.deleteTask(id).then(function(response) {
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
						self.getAllCases();
						$timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
						self.searchCaseTasks(self.newCase.id)
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 })
			 }
			 
			 
			 self.showStats = function(){
				 
		
				  self.caseResolutionStats = "{\"query\":{},\"stats\":[{\"_agg\":\"field\",\"_field\":\"resolutionStatus\",\"_select\":[{\"_agg\":\"count\"}]},{\"_agg\":\"count\"}]}";
				  newCaseFactory.getCaseStats(self.caseResolutionStats).then(function(response) {
					  self.caseResolved = JSON.parse(response.data.dataMap);
				  },function(err){
				  })
			  
				  self.TagStats = "{\"query\":{},\"stats\":[{\"_agg\":\"field\",\"_field\":\"tags\",\"_select\":[{\"_agg\":\"count\"}],\"_order\":[\"-count\"],\"_size\":5},{\"_agg\":\"count\"}]}";
				  newCaseFactory.getCaseStats(self.TagStats).then(function(response) {
					  self.topTags = JSON.parse(response.data.dataMap);
				  },function(err){
				  })
			  
				  self.caseStats = "{\"query\":{},\"stats\":[{\"_agg\":\"field\",\"_field\":\"status\",\"_select\":[{\"_agg\":\"count\"}]},{\"_agg\":\"count\"}]}";
				  newCaseFactory.getCaseStats(self.caseStats).then(function(response) {
					  self.casesStats = JSON.parse(response.data.dataMap);
				  },function(err){
				  })
				  
			  $('#statsModal').modal('show');
		}
			 
			 
			 self.openclosemodal= function(id,status){				 
				 $scope.closecaseid=id;
				 $("#closeCase").modal('show');
				 $scope.closecasestatus=status;

			 }
			 
			 self.closeCase = function(){
				 self.closeCaseDetails['id'] = $scope.closecaseid;
				 console.log(self.closeCaseDetails);
				 newCaseFactory.closeCase(self.closeCaseDetails).then(function(response){
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					 $timeout(function(){ 
						 	self.getAllCases();
							self.caseAlertMessagaes.pop();
						},2000);
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 })
				 $("#closeCase").modal('hide');
				 self.closeCaseDetails ={"resolutionStatus":undefined, "summary": undefined, "impactStatus": undefined}; 	
			 }
			 
			 
			 
			 self.changeCaseStatus = function(id, status) {
				 
				 newCaseFactory.caseReopen(id, status).then(function(response){
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					 self.getAllCases();
					 $timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 })
			 }  
			 
			 self.updateCaseById = function(key, value, id ) {
				 
				 newCaseFactory.editCaseById(key, value, id).then(function(response) { 
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					 $timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 })
				 self.editMode = false;
			 }
			 
			 
			self.updateTaskById = function(key, value, id ) {
				 
				 newCaseFactory.editTaskById(key, value, id).then(function(response) { 
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					 $timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 })
				 self.editMode = false;
			 }
			   
			self.edit = function() {
		        self.editMode = true;        
		      }	
		      self.cancel= function(){
		    	  self.editMode = false;
		      }
		      self.save= function(){
		    	  self.editMode = false;
		      }
		      
			 
}]);


app.filter("removeValue",function(){
	return function(items){
		var object = new Object();
	    angular.forEach(items, function(value, key){
	    	if(key != 'count'){
	    		object[key] = items[key];
	    	}
	    });
	return object;
	}
});