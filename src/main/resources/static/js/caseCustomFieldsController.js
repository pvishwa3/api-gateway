app.controller("caseCustomFieldsController", [ '$scope', 'caseFactory', '$rootScope','$timeout', '$uibModal','$filter',function($scope, caseFactory, $rootScope, $timeout, $uibModal,$filter) {

	$rootScope.$broadcast('changeThemeToNormal');

  var  self=this;

  self.allCustomFields=[];

  self.addNewCustomField = function(){
    $('#newCaseCustomFields').modal('hide')
    alert("ajax call");
    self.allCustomFields.push(self.newCustomFields);
  }

  self.deleteCaseCustomField= function(id){
    alert("Delete");
  }




  
}]);  