app.controller("tiController", ['$scope', 'tiFactory','$rootScope','$timeout','$uibModal','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder' ,'$ngConfirm',function ($scope, tiFactory,$rootScope, $timeout,$uibModal,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$ngConfirm) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');

	$scope.fields = [];

	self.fieldMapping = [{"field":"","type":"", "status": false}];

	self.alertMessagaes =[];
	
	self.getAllFields = function() {
		tiFactory.getAllFieldsForIndex().then(function(response){
			var tempArray = [];
			for(var i=0;i<response.data.elasticsearchFields.length;i++){
				tempArray.push({name:response.data.elasticsearchFields[i]})
			}
			$scope.fields = angular.copy(tempArray);
//			$scope.fields = [{name:'field1'},{name:'field1'}]
		});
	}
	
	self.getMapping = function() {
		tiFactory.get().then(function(response){
			console.log(response.data.result);
//			self.fieldMapping = angular.copy(JSON.parse(JSON.parse(response.data.result).fieldMappingJson));
			self.fieldMapping = angular.copy(response.data.result);	
			console.log(self.fieldMapping);
		});
	}
	
	self.getAllFields();
	
	self.getMapping();
	
	$scope.fieldConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'name',
			searchField: ['name'],
			valueField: 'name',
			create : false,
	}
	

	self.submitData = function(){
		
		console.log(self.fieldMapping.fieldMappingJson);
		
//		for(var i=0; i<self.fieldMapping.fieldMappingJson.length;i++){
//			for(var j=0; j<self.fieldMapping.fieldMappingJson.length; j++){
//				if(i!=j){
//					console.log(i+"|||"+j);
//					console.log(self.fieldMapping.fieldMappingJson[i].field+"|||"+self.fieldMapping.fieldMappingJson[j].field);
//					if(self.fieldMapping.fieldMappingJson[i].field == self.fieldMapping.fieldMappingJson[j].field) {
//						console.log("fassak");
//						self.alertMessagaes.push({ type: 'danger', msg: 'multiple time field is selected' });
//						$timeout(function () {
//							self.alertMessagaes = [];
//						}, 2000);
//					}
//				}
//			}
//		}
		
//		for(var i=0; i<self.fieldMapping.fieldMappingJson.length;i++){
//			
//			if(self.fieldMapping.fieldMappingJson[i].field == self.fieldMapping.fieldMappingJson[i+1].field) {
//				
//			}
//				
//		}
		
		loader("body");
		tiFactory.save({"fieldMappingJson":self.fieldMapping}).then(function(response) {
			
			self.alertMessagaes.push({ type: 'success', msg: 'Mapping was Successfully created ' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			
			unloader("body");
		}, function (error) {
			unloader("body");
			self.alertMessagaes.push({ type: 'danger', msg: 'something went wrong Please try again' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			
		});
	}

	self.addField = function(){
		
		self.fieldMapping.push({"field":'',"type":'',"status":false});
	}

	self.deleteRow  = function(index){
		
		if(index>0){
			self.fieldMapping.splice(index, 1);
		}
	}
	
	self.reset =function(){
		
		self.fieldMapping = [{"field":"","type":"", "status": false}];
	}
	self.historyBack = function(){
		window.history.back();
	}

}]);

