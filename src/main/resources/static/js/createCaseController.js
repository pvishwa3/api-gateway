app.controller("createCaseController", ['$scope', 'caseFactory', 'caseTemplateFactory', '$rootScope', '$timeout', '$uibModal', '$filter', function ($scope, caseFactory, caseTemplateFactory, $rootScope, $timeout, $uibModal, $filter) {

	$rootScope.$broadcast('changeThemeToNormal');
	$scope.templateUrl = "case-allcases.html";
	var self = this;
	
	self.getAllTemplateDetails = function() {
		  caseTemplateFactory.getAllTemplates().then(function (response) {
			  	self.allTemplates = response.data.resultData;
				console.log("self.alltemplates: " + response.data);
			});
	  }

	  self.getAllTemplateDetails();
	  
	self.newCase = {
		title:'',
		severity:'',
		tags:'',
		description:'',
		tasks:[]
	}
	self.createCase = function(){
		console.log(self.newCase);
		caseFactory.createCase(self.newCase).then(function (response) {
			console.log("self.newCase: " + response.data);
		});
	}

	self.addTask = function(name){
		if(self.newCase.tasks.indexOf(name) <= -1){
//			var taskObject={title:name,status:"waiting"}
			self.newCase.tasks.push(name);
		}
	}

	self.removeTaskName = function(data){
		console.log(data);
		self.newCase.tasks.splice(self.newCase.tasks.indexOf(data),1);
	}

	self.changeCaseDetails = function(data) {
  	  data = JSON.parse(data);
  	  
  	  console.log(data);
  	  for (var key in data) {
  		  if(self.newCase.hasOwnProperty(key) && data.hasOwnProperty(key)) {
  			  self.newCase[key] = data[key];
  		  }
  		  self.newCase.title = data.titlePrefix;
	  }
  	  console.log(self.newCase);
   }

	/*	self.responseData ='';
			self.alertMessages =[];
			self.newCase = {"status":"","title":"", "severity":"", "tags": [], "tlp":"", "description":"", "startDate":"", "tasks": []  };
			self.severity = ["High", "Medium", "Low"];
			self.tlp = ["White", "Green", "Amber", "Red"];
			self.newTask = [];
			self.allCases = [];
			self.caseTasks = [];
			self.isTaskDetails = false ;
			self.isTaskDetailsClick = false;
			self.caseAlertMessagaes = [];
			self.closeCaseDetails ={"resolutionStatus":undefined, "summary": undefined, "impactStatus": undefined}; 
			
			self.openAllCases = function(){
				$scope.templateUrl = "case-allcases.html";
				self.editNav='caseDetails';
			}
			
			self.openNewCase = function(){
				self.newCase = {"title":"", "severity":"", "tags": [], "tlp":"", "description":"", "startDate":"", "tasks": []  };
				$scope.templateUrl = "case-newcase.html";
			}
			
			self.addTask = function(taskname){
				
				if(taskname !== ""){
					var obj={};
					obj.title = taskname;
					obj.flag = false;
					obj.status = "Waiting";
					var sample = angular.copy($filter('filter')(self.newCase.tasks, {title: taskname})[0]);
					if(sample === undefined){					
						self.newCase.tasks.push(obj); 
					}
				}else{
						self.caseAlertMessagaes.push({ type: "warning", msg: "Already have a case with that name" });
						$timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
					}
				} 	
			
			self.removeTask = function(taskname){
				var a = self.newCase.task.indexOf(taskname);
				self.newCase.task.splice(a,1);
			}
			
			self.createCase = function(){
				self.newCase.status="Open";
				self.newCase.startDate=moment(self.newCase.startDate).valueOf();
				console.log(self.newCase);
				self.newCase.startDate = moment(self.newCase.startDate).valueOf();
				if ( self.newCase.title == ''|| self.newCase.severity =='' || self.newCase.tags =='' || self.newCase.tlp == '' || 
					self.newCase.startDate == '' || self.newCase.description == '')	{
					self.caseAlertMessagaes.push({ type: 'danger', msg: 'All fields are manditory' });
			    	   $timeout(function () {
			    		   self.caseAlertMessagaes.pop();
					}, 2000);
				}else{
				caseFactory.createCase(self.newCase).then(function(response) {
					self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					$timeout(function(){
						self.caseAlertMessagaes.push({ type: 'success', msg: 'Successfully added' });
						self.caseAlertMessagaes.pop();
					},2000);
					self.getAllCases();
					
					},function(err){
						self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again"});
					})
					self.newCase = {"title":"", "severity":"", "tags": [], "tlp":"", "description":"", "startDate":"", "tasks": []  };	
				}
				}
			
			self.getAllCases = function() {
				caseFactory.getAllCases().then(function(response){
					self.allCases=angular.copy(JSON.parse(response.data.responseData));
					for(var i=0; i<self.allCases.length; i++){
						self.allCases[i].startDate = moment(self.allCases[i].startDate).format("DD-MM-YYYY HH:mm A");
					}
				});
			}
			self.getAllCases ();
			self.searchCaseTasks =function(id){
				caseFactory.searchCaseTasks(id).then(function(response){
					self.caseTasks = JSON.parse(response.data.responseData);
					for(var i=0; i<self.caseTasks.length; i++){
						self.caseTasks[i].startDate = moment(self.caseTasks[i].startDate).format("DD-MM-YYYY HH:mm A");
					}
				})
				
			}
			
			self.openCaseById = function(id) {
				self.taskDetailsArray=[];	
				self.searchCaseTasks(id);
				self.newCase = {"title":"", "severity":"", "tags": [], "tlp":"", "description":"", "startDate":"", "tasks": []  };
				$scope.templateUrl = "case-opencase.html";
				self.editNav='caseDetails';
				self.newCase = [];
				self.newCase = angular.copy($filter('filter')(self.allCases, {id: id})[0]);
//				self.newCase.startDate = moment(self.newCase.startDate).format("DD-MM-YYYY HH:mm A");
			}
			
			self.taskDetailsArray = [];
			self.openTaskByCaseId = function(id) {
				self.newTask = [];
				self.newTask = angular.copy($filter('filter')(self.caseTasks, {id: id})[0]);
				self.taskDetailsArray.push(self.newTask);
				$('.nav-tabs li.active').removeClass('active');
				$timeout(function(){					
					$("#"+self.newTask.id).addClass("active");
					self.changeTasks(self.newTask);
					self.editNav="taskDetails";
				},100);
				
				
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
				$('.nav-tabs li.active').removeClass('active');
				self.editNav='tasks';
				$('#tasks').addClass("active");
				
			}
			
			
			self.deleteCaseById = function(id){
				caseFactory.deleteCaseById(id).then(function(response){
					self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					self.getAllCases();
					$timeout(function(){
						self.caseAlertMessagaes.pop();
					},2000);
				},function(err){
					self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again." });
				});
				
				
//				self.isCaseDetails=true;
//				self.isAllTask=false;
//				self.isTaskDetailsClick=false
			}
			
			
			self.users="";
			self.getAllUsers = function(){
				caseFactory.getAllUsers().then(function(response){
					self.users=angular.copy(JSON.parse(response.data.responseData));
				},function(err){
					
				});
			}
			
			 self.changeAssigne = function(id){
				 caseFactory.changeAssigne(self.newCase.owner,id).then(function(response){
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
			 
			 self.modelMessages=[];
			 self.createNewTask= function(){
				 self.newTask.status="Waiting";
				 self.newTask.idOfCase=self.newCase.id;
				 var sample= angular.copy($filter('filter')(self.caseTasks, {title: self.newTask.taskName})[0]);
				 if(sample === undefined){
					 caseFactory.createNewTask(self.newTask).then(function(response){
						 $("#createTask").modal('hide');
						 self.searchCaseTasks(self.newCase.id);
					 },function(err){
						 
					 });
					 
				 }else{
					 self.modelMessages.push({ type:"danger", msg: "already have a task with this" });
						$timeout(function(){
							self.modelMessages.pop();
					},2000);
				 }
			 }
			 
			 
			 self.changeStateOfTask = function(status,id,parentId){
				 var obj={};
					obj.status = status;
					obj.id = id;
				 caseFactory.changeStateofTask(obj).then(function(response){
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
						$timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
					 self.searchCaseTasks(parentId);
				 },function(error){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 });
			 };
			 
			 
			 self.changeTheAssigneOfTask = function(id){
				 var obj={};
				 obj.id=id;
				 obj.owner=self.newTask.owner;
				 caseFactory.changeTheAssigneOfTask(obj).then(function(response){
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
				 caseFactory.getMyTasks().then(function(response){
					 self.mytasks=JSON.parse(response.data.userTasks);
				 	 $scope.templateUrl="myTasks.html";
				 },function(err){
					 
				 });
			 }
			 
			 self.getloginedUserDetails = function(){
				 caseFactory.getCurrentLoginedUser().then(function(response){
					 },function(err){
						 
					 });
			 }
			 
			 self.getWaitingTasks = function(){
				 caseFactory.getWaitingTasks().then(function(response){
					 self.allWaitingTasks = JSON.parse(response.data.responseData);
					 $scope.templateUrl = "waitingTasks.html";
				 },function(error){
					 console.log(error);
				 });
			 }	
			 
			 self.deleteTaskById = function(id) {
				 caseFactory.deleteTask(id).then(function(response) {
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
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
				  caseFactory.getCaseStats(self.caseResolutionStats).then(function(response) {
					  self.caseResolved = JSON.parse(response.data.dataMap);
				  },function(err){
				  })
			  
				  self.TagStats = "{\"query\":{},\"stats\":[{\"_agg\":\"field\",\"_field\":\"tags\",\"_select\":[{\"_agg\":\"count\"}],\"_order\":[\"-count\"],\"_size\":5},{\"_agg\":\"count\"}]}";
				  caseFactory.getCaseStats(self.TagStats).then(function(response) {
					  self.topTags = JSON.parse(response.data.dataMap);
				  },function(err){
				  })
			  
				  self.caseStats = "{\"query\":{},\"stats\":[{\"_agg\":\"field\",\"_field\":\"status\",\"_select\":[{\"_agg\":\"count\"}]},{\"_agg\":\"count\"}]}";
				  caseFactory.getCaseStats(self.caseStats).then(function(response) {
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
			 
			 self.changeCaseStatus = function(id, status) {
				 caseFactory.caseReopen (id, status).then(function(response){
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					 self.getAllCases();
					 $timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 })
			 }
			 
			 self.closeCase = function(){
				 self.closeCaseDetails['id'] = $scope.closecaseid;
				 console.log(self.closeCaseDetails);
				 caseFactory.closeCase(self.closeCaseDetails).then(function(response){
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
			 
			 self.takeThisTask = function(status,id){
				 caseFactory.takeThisTask(status,id).then(function(response){
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					 $timeout(function(){
						self.caseAlertMessagaes.pop();
					},2000);
					 var res=JSON.parse(response.data.responseData);
					 self.openCaseById(res._parent);
					 
					 $timeout(function(){						 
						 self.openTaskByCaseId(res.id);
					 },800)
				 },function(error){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 });
			 }
			 
			self.showTheTaskDetails = function(parentId,id){
				self.openCaseById(parentId);
				$timeout(function(){					
					self.openTaskByCaseId(id);
				},800);
			}
			
			 self.updateCaseById = function(key, value, id ) {

					console.log("value"   +   value);
				 caseFactory.editCaseById(key, value, id).then(function(response) { 
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
				 
				 caseFactory.editTaskById(key, value, id).then(function(response) { 
					 self.caseAlertMessagaes.push({ type: response.data.status, msg: response.data.message });
					 $timeout(function(){
							self.caseAlertMessagaes.pop();
						},2000);
				 },function(err){
					 self.caseAlertMessagaes.push({ type: "danger", msg: "something went wrong please try again" });
				 })
				 self.editMode = false;
			 }
			
			self.getTheActivity = function(){
				caseFactory.Activity().then(function(response){
					self.activtyList = angular.copy(JSON.parse(response.data.responseData));
					for(var i=0;i<self.activtyList.length;i++){
						self.activtyList[i].base.createdAt = moment(self.activtyList[i].base.createdAt).format("DD-MM-YYYY HH:mm A");
					}
					console.log(self.activtyList)
				},function(error){
					
				});
			}
			
			self.getTheActivity();
			*/

}]);


app.filter("removeValue", function () {
	return function (items) {
		var object = new Object();
		angular.forEach(items, function (value, key) {
			if (key != 'count') {
				object[key] = items[key];
			}
		});
		return object;
	}
});

app.directive('datepicker', function () {
	$('input[name="startDate"]').daterangepicker({
		"singleDatePicker": true,
		"timePicker": true,
		"startDate": moment().startOf('min'),
		"applyButtonClasses": "btn-dark",
		locale: {
			format: 'M/DD/YYYY hh:mm A'
		}
	}, function (start, end) {
		return moment(start).valueOf();
	});
	return {};
});
