app.controller("waitingTasksController", ['$scope', 'caseFactory', '$rootScope', '$timeout', '$uibModal', '$filter', 'textAngularManager', '$filter', function ($scope, caseFactory, $rootScope, $timeout, $uibModal, $filter, textAngularManager, $filter) {

  $rootScope.$broadcast('changeThemeToNormal');

  var self = this;

  self.allUsers=["User1","User2","User3","User4","user5"];
  self.tasksStatus=['open','inprogress','close'];

  
  self.allWaitingTasks = [{
    "caseId": 2,
    "createBy": "user1",
    "createdAt": 1539779939955,
    "status": "open",
    "taskId": "12",
    "title": "tasktitle",
    "severity":1
  }, {
    "caseId": 2,
    "createBy": "user1",
    "createdAt": 1539779935555,
    "status": "open",
    "taskId": "13",
    "title": "task2title",
    "severity":2,
    "logSeq": ["logseq1", "logseq2"]
  }];
  
  
  self.getWaitingTasks = function() {
		caseFactory.getWaitingTasks().then(function (response) {
			self.allWaitingTasks = response.data.resultData;
			console.log("self.allWaitingTasks: " + self.allWaitingTasks);
		});
	}

	self.getWaitingTasks();


  // self.allWaitingTasks = [{
  //   "title": "task1",
  //   "assignee": "user1",
  //   "severity": 2,
  //   "id":20,
  //   "createdAt":1539779939999
  // }, {
  //   "title": "task2",
  //   "assignee": "user3",
  //   "severity": 1,
  //   "id":21,
  //   "createdAt":1539779930636
  // }];

  self.waitingClass = "col-md-12";

  self.taskDescription = function (id) {
    self.selectedTask = angular.copy($filter('filter')(self.allWaitingTasks, {id: id})[0]);
    self.waitingClass = "col-md-8";
  }

  self.closeSideMenu = function(){
    self.waitingClass = "col-md-12";
  }

  self.assignThisTask = function(taskid){
	  caseFactory.changeTheAssigneOfTask(taskid).then(function (response) {
			console.log("self.alltemplates: " + response.data);
		});
  }

  self.assignThisTaskTo= function(name,taskId){
    alert("assign this task to "+name);
    console.log(name+"\t"+taskId);
  }

}]);