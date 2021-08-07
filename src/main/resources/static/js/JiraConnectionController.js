app.controller("jiraConnectionController", ['$scope', 'jiraConnectionService','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', function ($scope, jiraConnectionService , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	
	self.alertMessagaesModal = [];
	
	
	self.alertModal = [];
	
	self.jiraConnections = [];
	
	self.loadJiraConnections = function(){
		self.jiraConnections = [];
		jiraConnectionService.loadJiraConnections().then(function(response){
			
			self.jiraConnections = angular.copy (response.data);
			//self.activeDirectoryDetails = angular.copy (response.data);
			//self.tagDetails.forEach(e => e.checked = false);
		});
	}
	
	$scope.edit = function(id){
		
		for(var i=0;i<self.jiraConnections.length;i++){
			if(id === self.jiraConnections[i].id ){
			
				$scope.jiraConnection = angular.copy(self.jiraConnections[i]);
				
				$("#newJiraConnection").modal();
					
			}
		}
		
	}
	
	$scope.deleteConnection = function(id,name){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+name+'</b> Connection ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						//loader("body");
						jiraConnectionService.deleteConnection(id).then(function (response) {
							if(response.status===200){
								self.alertModal.push({ type: 'success', msg: 'Jira Connection was deleted successfully' });
								//toastr.success("Condition was deleted successfully")

								self.loadJiraConnections();


								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}



						}, function (error) {
							//unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}else{
								self.alertMessagaes.push({ type: 'danger', msg: error.data.error });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}

							$timeout(function () {
								self.alertMessagaes.splice(0, 1);
							}, 2000);
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});
	}
	
	self.loadJiraConnections();
	
	self.createNewConnections = function(){
		$scope.jiraConnection = {id:0,connectionName:'',jiraUrl:'',jiraUserName:'',jiraPassword:'',projectKey:'',defaultAssignee:'',issueType:'',mappingFields:''}
	
		$("#newJiraConnection").modal();
	}
	
	$scope.jiraConnection = {id:0,connectionName:'',jiraUrl:'',jiraUserName:'',jiraPassword:'',projectKey:'',defaultAssignee:'',issueType:'',mappingFields:''}

	$scope.scoreConfig = [{attribute:'',ipScore:0,domainScore:0,hashScore:0,urlScore:0}]

    $scope.mispAttributes = [];

	$scope.testConnection = function(){
		jiraConnectionService.testConnection($scope.jiraConnection).then(function(response){
			
			if(response.data.status){
				self.alertMessagaesModal.push({ type: 'success', msg: 'Jira Connection was sucessfull.' });


			}
			
			
			if(!response.data.status){
				if(response.data.error){
					for(var i=0;i<response.data.error.length;i++){

						self.alertMessagaesModal.push({ type: 'danger', msg: response.data.error[i].defaultMessage });
					}
				}else{
					self.alertMessagaesModal.push({ type: 'danger', msg: response.data.data });
				}
				
			}
			$timeout(function () {
					self.alertMessagaesModal.splice(0, 1);
				}, 2000);
			
			
		}, function (error) {
			if(error.status== 403){
				self.alertMessagaesModal.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
				$("#createNewTag").modal('toggle');
			}else{
				self.alertMessagaesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
				
			}

		});
	}
	
	$scope.saveJiraConnection = function(){
		jiraConnectionService.saveJiraConnection($scope.jiraConnection).then(function(response){
			
			if(response.data.status){
				self.alertModal.push({ type: 'success', msg: 'Jira Connection was sucessfull.' });
				self.loadJiraConnections();
				
				$("#newJiraConnection").modal('toggle');
				$timeout(function () {
					self.alertModal.splice(0, 1);
			}, 2000);
			}
			
			
			if(!response.data.status){
				if(response.data.error){
					for(var i=0;i<response.data.error.length;i++){

						self.alertMessagaesModal.push({ type: 'danger', msg: response.data.error[i].defaultMessage });
					}
				}else{
					self.alertMessagaesModal.push({ type: 'danger', msg: response.data.data });
				}
				
			}
			$timeout(function () {
					self.alertMessagaesModal.splice(0, 1);
			}, 2000);
			
			
		}, function (error) {
			if(error.status== 403){
				self.alertMessagaesModal.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
				$("#createNewTag").modal('toggle');
			}else{
				self.alertMessagaesModal.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaesModal = [];
				}, 2000);
				
			}

		});
	}
	
	
	//MISP
	
	self.alertMessagaes = [];
	
	
	$scope.misp = {id :0, mispUrl:'',mispToken:'',mispStatus:'active',threatScoreConfig:'',threadShold:0,synConfig:0,intialLookupDays:0,lookBack:0}

	$scope.showMispScoreConfiguration = false;

    $scope.ipTotalScore = 0;
    $scope.domainTotalScore = 0;
    $scope.hashTotalScore = 0;
    $scope.urlTotalScore = 0;

    $scope.calculateTotalScore = function(){
         $scope.ipTotalScore = 0;
         $scope.domainTotalScore = 0;
         $scope.hashTotalScore = 0;
         $scope.urlTotalScore = 0;
        for(var i=0;i< $scope.scoreConfig.length;i++){
            $scope.ipTotalScore+= $scope.scoreConfig[i].ipScore;
            $scope.domainTotalScore+= $scope.scoreConfig[i].domainScore;
            $scope.hashTotalScore+= $scope.scoreConfig[i].hashScore;
            $scope.urlTotalScore+= $scope.scoreConfig[i].urlScore;
        }
    }

    $scope.addScoreConfig = function(){
        $scope.scoreConfig.push({attribute:'',ipScore:0,domainScore:0,hashScore:0,urlScore:0});
        $scope.calculateTotalScore();
    }

    $scope.deleteScoreConfig = function(index){
        $scope.scoreConfig.splice(index,1);
        $scope.calculateTotalScore();
    }

	$scope.testMispConnection = function(){
		jiraConnectionService.testMispConnection($scope.misp).then(function(response){
			
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'MISP Connection was successful.' });
				
				$scope.showMispScoreConfiguration =true;
				$scope.mispAttributes = angular.copy(response.data.data);
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
			}, 2000);
			}
			
			
			if(!response.data.status){
				if(response.data.error){
					for(var i=0;i<response.data.error.length;i++){

						self.alertMessagaes.push({ type: 'danger', msg: response.data.error[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
				}
				
			}
			$timeout(function () {
					self.alertMessagaes.splice(0, 1);
			}, 2000);
			
			
		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				
			}

		});
	}

	 $scope.loadMisp = function(){

            $scope.misp = {id :0, mispUrl:'',mispToken:'',mispStatus:'active',threatScoreConfig:'',threadShold:0,synConfig:0,intialLookupDays:0,lookBack:0}

            jiraConnectionService.loadMisp().then(function(response){
                $scope.misp = angular.copy(response.data);

                $scope.scoreConfig = JSON.parse($scope.misp.threatScoreConfig);
                 $scope.testMispConnection();
                 $scope.calculateTotalScore();

            });

        }

	$scope.saveMispConfiguration = function(){

    var tempArray = [];

     for(var i=0;i< $scope.scoreConfig.length;i++){
        tempArray.push($scope.scoreConfig[i].attribute);
     }

   if(tempArray.length != new Set(tempArray).size){

        self.alertMessagaes.push({ type: 'danger', msg: "Found Some Duplicated Attributes Please remove and try it again !" });
        $timeout(function () {
          self.alertMessagaes = [];
        }, 2000);
        return false;
   }





    if($scope.ipTotalScore==100 && $scope.ipTotalScore ==100 && $scope.hashTotalScore==100 && $scope.urlTotalScore==100 ){

    $scope.misp.threatScoreConfig = JSON.stringify($scope.scoreConfig);

    jiraConnectionService.saveMispConfiguration($scope.misp).then(function(response){

    			if(response.data.status){
    				self.alertMessagaes.push({ type: 'success', msg: 'Jira Connection was sucessfull.' });

    				$scope.showMispScoreConfiguration =true;
    				$scope.mispAttributes = angular.copy(response.data.data);
    				$timeout(function () {
    					self.alertMessagaes.splice(0, 1);
    			}, 2000);
    			}


    			if(!response.data.status){
    				if(response.data.error){
    					for(var i=0;i<response.data.error.length;i++){

    						self.alertMessagaes.push({ type: 'danger', msg: response.data.error[i].defaultMessage });
    					}
    				}else{
    					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
    				}

    			}
    			$timeout(function () {
    					self.alertMessagaes.splice(0, 1);
    			}, 2000);


    		}, function (error) {
    			if(error.status== 403){
    				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

    				$timeout(function () {
    					self.alertMessagaes = [];
    				}, 2000);

    			}else{
    				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
    				$timeout(function () {
    					self.alertMessagaes = [];
    				}, 2000);

    			}

    		});



    }else{
        self.alertMessagaes.push({ type: 'danger', msg: "Score Configuration Can't Greater than 100 or lessthan 100" });

        $timeout(function () {
          self.alertMessagaes = [];
        }, 2000);
    }


	}
	
	self.goBack = function(){
		window.history.back();
	}

	
	
}]);
