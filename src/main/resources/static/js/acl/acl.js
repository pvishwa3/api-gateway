app.controller("aclController", ['$scope', 'riskFactory','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','referenceSetFactory', function ($scope, riskFactory , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,referenceSetFactory) {

	var self = this;

    $scope.canShow = false;

	$rootScope.$broadcast('changeThemeToNormal');
    $scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';

	$scope.riskLevels = []

    $scope.templateUrl = "templates/acl/view-acl.html"
    self.conditionMessagesModal = [];
    $scope.openACL = function(){
         $scope.templateUrl = "templates/acl/create-acl.html";
         $scope.canShow = true;
    }

    $scope.goBack = function(){
        self.loadACLS();
        $scope.templateUrl = "templates/acl/view-acl.html"
        $scope.canShow = true;
    }

    $scope.saveALCSConfig = function(){
        if(self.validateACL()){
            $scope.acl.config = JSON.stringify($scope.aclDetails);
                       riskFactory.saveACLConfig($scope.acl).then(function(response){

                         if(response.status === 201 ){
                           self.conditionMessagesModal.push({ type: 'success', msg: 'Successfully saved the configuration' });
                             $timeout(function () {
                                   self.conditionMessagesModal.splice(0, 1);
                             },2000);

                           }


                       }, function (error) {
                            if(error.data.error){
                               for(var i=0;i<error.data.error.length;i++){
                                  self.conditionMessagesModal.push({ type: 'danger', msg: error.data.error[i].defaultMessage });
                                }
                            }else{
                                  self.conditionMessagesModal.push({ type: 'danger', msg: error.data });
                            }
                                 $timeout(function () {
                                        self.conditionMessagesModal.splice(0, 1);
                                }, 2000);

                      });

        }

    }


    self.referenceSetDetails = [];

   $scope.aclDetails = [];

   $scope.deleteACL = function(id,name){
        $ngConfirm({
        			animation: 'top',
        			closeAnimation: 'bottom',
        			theme: 'material',
        			title: 'Confirm!',
        			content: 'Do you want to delete <b>'+name+'</b> Policy ',
        			scope: $scope,
        			buttons: {
        				delete: {
        					text: 'YES',
        					btnClass: 'btn-danger',
        					action: function(scope, button){
        						//loader("body");
        						riskFactory.deleteACL(id).then(function (response) {
        							if(response.status===200){
        								self.conditionMessagesModal.push({ type: 'success', msg: 'ACL was deleted successfully' });
                                          self.loadACLS();

        								$timeout(function () {
        									self.conditionMessagesModal = [];
        								}, 2000);
        							}



        						}, function (error) {
        							//unloader("body");
        							if(error.status== 403){
        								self.conditionMessagesModal.push({ type: 'danger', msg: error.data.data });
        								$timeout(function () {
        									self.conditionMessagesModal = [];
        								}, 2000);
        							}else{
        								self.conditionMessagesModal.push({ type: 'danger', msg:  error.data.data  });
        								$timeout(function () {
        									self.conditionMessagesModal = [];
        								}, 2000);
        							}

        							$timeout(function () {
        								self.conditionMessagesModal = [];
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

    self.loadACLS = function(){
        riskFactory.loadACLS().then(function(response){
                $scope.aclDetails = angular.copy(response.data);

         });
    }


   $scope.openACLEdit = function(data){
     $scope.acl  = angular.copy(data);
     $scope.aclDetails = JSON.parse(data.config);
     $scope.templateUrl = "templates/acl/create-acl.html";
     $scope.canShow = true;
   }

   self.loadACLS();



	self.loadReferenceSets = function(){
    		referenceSetFactory.loadReferenceSets().then(function(response){

    			if(response.data.length>0){
    				self.referenceSetDetails = angular.copy(response.data);
    			}
    		});
    }

      $scope.riskFactors = [];

        $scope.getRiskFactors = function(){
             riskFactory.getRiskFactors().then(function(response){
                   $scope.riskFactors = angular.copy(response.data);
          }, function (error) {
           console.log(error.data)
            });
       }

       $scope.getRiskFactors();

    $scope.aclDetails = [];

    $scope.addData = function(){
        $scope.aclDetails.push({aclSourceType:'',aclSourceValue:'',aclDestinationType:'',aclDestinationValue:''});
    }

    $scope.removeData = function(index){
        $scope.aclDetails.splice(index,1)
    }

    self.validateACL = function(){
        var tempData = [];

       for(var i=0;i<$scope.aclDetails.length;i++){
           tempData.push($scope.aclDetails[i].aclSourceValue+"-"+$scope.aclDetails[i].aclDestinationValue);
       }

       if(new Set(tempData).size !== $scope.aclDetails.length ){
              self.conditionMessagesModal.push({ type: 'danger', msg: "Duplicate Values found in ACL Table " });
               $timeout(function () {
                 self.conditionMessagesModal.splice(0, 1);
               }, 2000);
               return false;
       }


       return true;


    }

    $scope.acl = {id:0,aclType:'',policyName:''}
    $scope.getValuesBasedOnType = function(data){
        var tempData = [];
        data['sourceCurrentRiskFactors'] = [];
        if(data.aclSourceType === 'group'){
         for(var i=0;i<self.referenceSetDetails.length;i++){
                   for(var j=0;j<$scope.riskFactors.length;j++){
                        if($scope.acl.aclType.split("to")[0].trim()===$scope.riskFactors[j].riskFactor){
                             if(self.referenceSetDetails[i].riskType === $scope.riskFactors[j].id){
                                tempData.push(self.referenceSetDetails[i]);
                              }

                        }
                   }
            }
         data['sourceCurrentRiskFactors'] = tempData;
        }
    }

    $scope.deleteAclRow = function(index){
        $scope.aclDetails.splice(index,1)
    }

      $scope.getValuesBasedOnDestinationType = function(data){
            var tempData = [];
            data['destinationCurrentRiskFactors'] = [];
            if(data.aclDestinationType === 'group'){
             for(var i=0;i<self.referenceSetDetails.length;i++){
                       for(var j=0;j<$scope.riskFactors.length;j++){
                            if($scope.acl.aclType.split("to")[1].trim()===$scope.riskFactors[j].riskFactor){
                                 if(self.referenceSetDetails[i].riskType === $scope.riskFactors[j].id){
                                    tempData.push(self.referenceSetDetails[i]);
                                  }

                            }
                       }
                }
             data['destinationCurrentRiskFactors'] = tempData;
            }
        }
    self.loadReferenceSets();

	$scope.deleteRiskLevel = function(index){
	    $scope.riskLevels.splice(index, 1);
	}

    $scope.addRiskAssignment = function(){
        $scope.assignmentDetails.push({riskFactor:'',type:'',value:'',score:0})
    }

    $scope.deleteAssignmentDetails = function(index){
         $scope.assignmentDetails.splice(index, 1);

    }


}]);
