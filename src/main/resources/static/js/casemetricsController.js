app.controller("casemetricsController", [ '$scope', 'caseFactory', '$rootScope','$timeout', '$uibModal','$filter','textAngularManager',function($scope, caseFactory, $rootScope, $timeout, $uibModal,$filter,textAngularManager) {

	$rootScope.$broadcast('changeThemeToNormal');
  
  var self=this;
  
  
  self.allMetrics=[];

  self.submitMetric = function(){
    self.allMetrics.push(self.newmetrics);
    alert("ajax call")
    self.newmetrics={name:'',title:'',description:''}
  }


}]);