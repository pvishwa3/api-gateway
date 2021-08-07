app.controller("manualAssetController",['$scope','$sessionStorage','assetFactory','$timeout','networkZonesFactory',function($scope,$sessionStorage,assetFactory,$timeout,networkZonesFactory){
	var self = this;
	self.newasset = {assetName:'',assetTag:'',deviceType:'',groupName:'',ip:'',mac:'',location:'',domain:'',status:''};
	$scope.showHomeButton = true;
	$scope.templateUrl = "asset.html";
	self.alertMessages = [];
	self.newAsset = function(){
		self.getSavedNetworkDetails();
		self.newasset = {assetName:'',assetTag:'',deviceType:'',groupName:'',ip:'',mac:'',location:'',domain:'',status:''};
		$scope.templateUrl = "newAsset.html";
		$scope.showHomeButton = false;
	}
	
	self.saveAssets = function(){
		self.newasset['company'] = $sessionStorage.user.companyName;
		assetFactory.saveAsset(self.newasset).then(function(response){
			if(response.data.status){
				self.alertMessages.push({type:"success",msg:"Asset saved successfully"});
			}else{
				self.alertMessages.push({type:"danger",msg:"Unable to save the asset"});
			}
			self.getAllSavedAssets();
			$scope.templateUrl = "asset.html";
			$scope.showHomeButton = true;
			$timeout(function(){
				self.alertMessages = [];
			},3000);
		},function(error){
			self.alertMessages.push({type:"danger",msg:"Unable to save the asset"+error})
			$timeout(function(){
				self.alertMessages = [];
			},3000);
		});
	}
	
	self.goBack = function(){
		$scope.templateUrl = "asset.html";
	}
	self.getAllSavedAssets = function(){
		assetFactory.getAllSavedAssets($sessionStorage.user.companyName).then(function(response){
			self.allSavedAssets = angular.copy(response.data.resultData)
		},function(error){
			
		})
	}
	self.getAllSavedAssets();
	
	self.deleteAsset = function(id){
		assetFactory.deleteAsset(id).then(function(response){
			if(response.data.status){
				self.alertMessages.push({type:"success",msg:"Asset deleted sucessfully"});
				$timeout(function(){
					self.alertMessages = [];
				},3000);
			}
			self.getAllSavedAssets();
		},function(Error){
			
		})
	}
	
	self.getSavedNetworkDetails = function(){
		networkZonesFactory.getSavedNetworkDetails($sessionStorage.user.companyName).then(function(response){
			for(var i=0;i<response.data.resultData.length ;i++){				
				self.allNetworkZonesDetails =angular.copy(JSON.parse(response.data.resultData[i].location));
			}
			console.log(self.allNetworkZonesDetails);
		},function(error){
			
		})
	}
	
	self.allAssetTag = [];
	self.assetTagConfig= {
		maxItems: 1,
		optgroupField: 'class',
		labelField: '',
		searchField: [''],
		valueField: '',
		create:true
	}
	self.allassetDeviceType=[]
	self.assetDeviceTypeConfig= {
			maxItems: 1,
			optgroupField: 'class',
			labelField: '',
			searchField: [''],
			valueField: '',
			create:true
		}
	
	self.assetDeviceType = {
		maxItems: 1,
		optgroupField: 'class',
		labelField: '',
		searchField: [''],
		valueField: '',
		create:true
	}
	self.assetcidr= {
			maxItems: 1,
			optgroupField: 'class',
			labelField: '',
			searchField: [''],
			valueField: '',
			create:true
		}
		
	self.assetDomainType = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'domain',
			searchField: ['domain'],
			valueField: 'domain',
			create:true,
			onChange:function(value){
			
			for(var i=0;i<self.allNetworkZonesDomainDetails.length;i++){
				if(self.allNetworkZonesDomainDetails[i].domain == value){					
					self.allNetworkZonesCidrDetails = angular.copy(self.allNetworkZonesDomainDetails[i].cidr);
				}
//					for(var j=0;j<self.allNetworkZonesDetails[i].details.length;j++){						
//					}
				}
			}
	
			}
	
	self.allNetworkZonesCidrDetails=[];
	self.allNetworkZonesDomainDetails = [];
	self.assetLocationConfig = {
		maxItems: 1,
		optgroupField: 'class',
		labelField: 'name',
		searchField: ['name'],
		valueField: 'name',
		create:false,
		onChange:function(value){
			for(var i=0;i<self.allNetworkZonesDetails.length;i++){
				if(self.allNetworkZonesDetails[i].name == value){				
//					for(var j=0;j<self.allNetworkZonesDetails[i].details.length;j++){						
						self.allNetworkZonesDomainDetails = angular.copy(self.allNetworkZonesDetails[i].details);
//					}
				}
			}
			console.log(self.allNetworkZonesDomainDetails);
		}
	}
	
	self.getAllAssets = function(){
		assetFactory.getAllAssets($sessionStorage.user.companyName).then(function(response){

		},function(Error){
			
		});
	}
	self.getAllAssets();

}]);