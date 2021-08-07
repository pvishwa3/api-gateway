app.controller("networkZonesController",['$scope','networkZonesFactory','$ngConfirm','$sessionStorage',function($scope,networkZonesFactory,$ngConfirm,$sessionStorage){
	var self = this;
	self.allNetworkZones = [];
	$scope.showHomeButton = true;
	$scope.templateUrl = "networkZones.html";
	self.network  = {company:'',location:[]};
	
	
	
	
	self.newNetwork = function(){
		self.network  = {company:'',location:[],details:[]};
		self.network.company =  $sessionStorage.user.companyName;
		$scope.templateUrl="newNetworkZone.html";
		$scope.showHomeButton = false;
	}
	
	self.saveNetworkDetails = function(){
		self.network.location= JSON.stringify(self.network.location);
		networkZonesFactory.saveNetworkZone(self.network).then(function(response){
			if(response.data.status){
				$scope.templateUrl = "networkZones.html";
				$scope.showHomeButton = true;
				self.getSavedNetworkDetails();
			}
		},function(error){
			
		});
	}
	
	self.addLocation = function(){
		self.network.location.push({name:'',details:[{domain:'',cidr:[]}]});
	}
	
	self.addDetails = function(parentIndex){
		self.network.location[parentIndex].details.push({domain:'',cidr:[]});
	}
	
	self.removeDetails = function(parentIndex,childIndex){
		self.network.location[parentIndex].details.splice(childIndex,1);
	}
	
	self.getSavedNetworkDetails = function(){
		networkZonesFactory.getSavedNetworkDetails($sessionStorage.user.companyName).then(function(response){
			for(var i=0;i<response.data.resultData.length;i++){
				self.allNetworkZones.push({id:'',company:'',location:[]});
				self.allNetworkZones[i].company= response.data.resultData[i].company;
				self.allNetworkZones[i].location = angular.copy(JSON.parse(response.data.resultData[i].location));
			}
		},function(error){
			
		})
	}
	
	self.getSavedNetworkDetails();
	
	self.editZone = function(data){
		self.network = angular.copy(data);
		$scope.templateUrl="newNetworkZone.html";
		$scope.showHomeButton = false;
	}
	
	self.deleteZone = function(id){
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete this',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						networkZonesFactory.deleteNetworkZones(id).then(function (response) {
							if(response.data.status){
								self.getSavedNetworkDetails();
							}
						},function(error){
						});
						return true; 
					}
				},
				close: function(scope, button){
				}
			}
		});
	}
	self.goBack = function(){
		$scope.templateUrl = "networkZones.html";
		$scope.showHomeButton = true;
	}
	self.onSelected = function(loc){
		self.network.details.push({location:loc,details:[{domain:'',cidr:[]}]});
	}
	
}]);