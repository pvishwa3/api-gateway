app.controller("myTasksController", [
    '$scope',
    'caseFactory',
    '$rootScope',
    '$timeout',
    '$uibModal',
    '$filter',
    'textAngularManager',
    function ($scope, caseFactory, $rootScope, $timeout, $uibModal, $filter,
        textAngularManager) {
    	$scope.templateUrl ="myTasks.html";
        var self = this;

        self.tasksStatus = ['open', 'inprogress', 'close'];
        self.allUsers = ['User1', 'User2', 'User3', 'User4', 'User5'];
        $scope.myTasksClass = "col-md-12";
        self.allMyTasks=[];
        
//        self.getmyTasks = function(){
//        	caseFactory.getMyTasks().then(function(response){
//        		console.log(response);
//            	self.allMyTasks.push(response.data.resultData);
//            	console.log(self.allMyTasks);
//            },function(error){
//            	
//            });
//        }
//        self.getmyTasks();
        
       
        self.getWaitingTasks = function(){
        	caseFactory.getWaitingTasks().then(function(response){
        		console.log(response.data.resultData);
        		self.allMyTasks = angular.copy(response.data.resultData);
        	},function(error){
        		
        	});
        };

        self.getWaitingTasks();
        
        self.taskDescription = function (id) {
        	$scope.myTasksClass = "col-md-8";
            self.selectedTask = angular.copy($filter('filter')(
                self.allMyTasks, {
                    taskId: id
                })[0]);
            console.log(self.selectedTask);
        }

        self.closeSideMenu = function () {
            $scope.editMode = false;
            self.myTasksClass = "col-md-12";
        }

        self.closeTask = function (id) {
            caseFactory.closeTask(id).then(function (response) {
                self.allMyTasks = response.data.resultData;
            }, function (err) {

            });
        }

//        self.getMyTasks = function () {
//            caseFactory.getMyTasks().then(function (response) {
//                self.allMyTasks = response.data.resultData;
//            }, function (err) {
//
//            });
//        }
//        self.getMyTasks();

        self.comment = function (taskId, caseId) {
            alert(taskId);
            alert(caseId);
        }

        self.editMode = function () {
            $scope.editMode = true;
            self.newTask = angular.copy(self.selectedTask);
        }

        self.closeEditMode = function () {
            self.editMode = false;
        }

        self.updateTask = function () {
            alert("update task")
            console.log(self.newTask);
        }
    }
]);
