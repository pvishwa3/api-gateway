app.controller("colorConfigurationController",['$scope','colorConfigurationFactory','$timeout',function($scope,colorConfigurationFactory,$timeout){
	
	var self = this;
	
	self.colorConf = {id:'',color:{}};
	self.alertMessagaes = [];
	self.saveStatus = function(){ 
		if(typeof self.colorConf.color == "string"){
			self.colorConf.color = JSON.parse(self.colorConf.color);
		}
		if(self.colorConf.color.status == undefined|| self.colorConf.color.priority == undefined ){
			self.alertMessagaes.push({type:"danger",msg:"Please enter the details"});
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
			return false;
		}else if(self.colorConf.color.status.open == '' || self.colorConf.color.status.inprogress == '' || self.colorConf.color.status.resolved == '' || self.colorConf.color.status.resolved == '' ||self.colorConf.color.status.open == undefined || self.colorConf.color.status.inprogress == undefined || self.colorConf.color.status.resolved == undefined || self.colorConf.color.status.resolved ==undefined || 
				self.colorConf.color.priority.critical == '' || self.colorConf.color.priority.medium == '' || self.colorConf.color.priority.high == '' || self.colorConf.color.priority.low == '' || self.colorConf.color.priority.critical == undefined || self.colorConf.color.priority.medium == undefined || self.colorConf.color.priority.high == undefined || self.colorConf.color.priority.low == undefined ){
			self.alertMessagaes.push({type:"danger",msg:"Please enter all the details"});
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
			return false;
		}
		self.colorConf.color = JSON.stringify(self.colorConf.color);
		colorConfigurationFactory.saveColor(self.colorConf ).then(function(response){
			if(response.data.status){
				self.alertMessagaes.push({type:"success",msg:"Successfully saved the color details"});
				$timeout(function(){
					self.alertMessagaes = [];
				},3000);
			}else { 
				self.alertMessagaes.push({type:"danger",msg:"Unable to save the color details"});
				$timeout(function(){
					self.alertMessagaes = [];
				},3000);
			}
			
		},function(error){
			self.alertMessagaes.push({type:"danger",msg:"Unable to save the color details  reason:"+error});
			$timeout(function(){
				self.alertMessagaes = [];
			},3000);
		});
	}
	
	
	self.getColorByUser = function(){
		colorConfigurationFactory.getColorByUser().then(function(response){
			self.colorConf = {id:response.data.id ,color:JSON.parse(response.data.color)};
		},function(error){
			console.log(error);
		});
	}
	
	self.getColorByUser();
	
}]);