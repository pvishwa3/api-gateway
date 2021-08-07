app.controller("dataSetController", ['$scope', 'dataSetFactory','$rootScope','$timeout','$location','$uibModal','$sce','$window', '$sessionStorage',function ($scope, dataSetFactory,$rootScope, $timeout,$location,$uibModal,$sce,$window,$sessionStorage) {
	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');


	$scope.dataSet = {id:'',dataSetName:'',fields:[],topic:'',dataSetQuery:''};
	$scope.userOperationType = "";


	$scope.alertMessagaes = [];


	$scope.closeAlert = function(index) {
		self.alertMessagaes.splice(index, 1);
	};

	$scope.templateUrl = "viewDataSets.html";

	$scope.goBack = function(){
		$scope.templateUrl = "viewDataSets.html";
	}


	self.getAllDataSets = function(){
		dataSetFactory.getAllDataSets().then(function (response) {
			$scope.dataSets = response.data;
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}



	$scope.createNewDataSet = function(){
		$scope.dataSet = {id:'',dataSetName:'',fields:[],topic:''};
		$scope.templateUrl = "createDataSets.html";
	}

	self.getTopics = function(){
		dataSetFactory.getTopics().then(function (response) {
			if(response.data.length!=0){
				$scope.topics = response.data[0].kafka_topics.topics;
			}

		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	self.getElasticsearchFields = function(){
		dataSetFactory.getAllFieldsForIndex().then(function(response){

			$scope.elasticsearchFields = response.data.elasticsearchFields;


		});



	}

	$scope.init = function(){
		self.getAllDataSets();
		self.getTopics();
		self.getElasticsearchFields();
	}	



	$scope.init();

	$scope.saveChanges = function(){
		$scope.alertMessagaes = [];

		$scope.dataSet.fields = $scope.dataSet.fields.join(',');

		dataSetFactory.saveDetails($scope.dataSet).then(function (response) {

			if(response.data.status){
				$scope.alertMessagaes.push({ type: 'success', msg: "Successfully Created the DataSet" });
				$scope.dataSet = {id:'',dataSetName:'',fields:[],topic:''};
				$scope.init();
				$scope.templateUrl = "viewDataSets.html";
			}else{

				for(var i = 0; i <response.data.data.length;i++ ){
					$scope.alertMessagaes.push({ type: 'danger', msg:  response.data.data[i].defaultMessage});
				}


				$scope.dataSet = {id:'',dataSetName:'',fields:[],topic:''};
			}

			$timeout(function () {
				$scope.alertMessagaes = [];
			}, 2000);

		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
			$scope.dataSet = {id:'',dataSetName:'',fields:[],topic:''};

		});


	}



	$scope.edit = function(id){
		for(var i = 0; i < $scope.dataSets.length; i++){
			if($scope.dataSets[i].id === id) {
				$scope.dataSet.id = $scope.dataSets[i].id;
				$scope.dataSet.dataSetName = $scope.dataSets[i].title;
				//$scope.dataSet.topic = $scope.dataSets[i].topic;
				//$scope.dataSet.fields = $scope.dataSets[i].fields.split(",");
				$scope.dataSet.dataSetQuery = $scope.dataSets[i].dataSetQuery;
				
				$scope.templateUrl = "createDataSets.html";
				break;
			}
		}
	}










	$scope.deleteDataSet=function(id){
		dataSetFactory.deleteDataSet(id).then(function (response){
			if(response.data){
				$scope.alertMessagaes.push({ type: 'success', msg: "Successfully Deleted the DataSet." });
			}else{
				$scope.alertMessagaes.push({ type: 'error', msg: "Unable to Delete DataSet." });
			}
			$timeout(function () {
				$scope.alertMessagaes = [];
			}, 2000);
			self.getAllDataSets();

		});
	}




}]);