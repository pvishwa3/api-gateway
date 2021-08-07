app.controller("conditionTypeController",['$scope','$rootScope','conditionTypeFactory','$timeout','$filter','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$ngConfirm',function($scope,$rootScope,conditionTypeFactory,$timeout,$filter,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$ngConfirm){
	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	
	$scope.templateUrl = "viewTypeConditions.html"
		
	self.getAllType = function(){
		conditionTypeFactory.getAllTypes().then(
				function(response){
					self.conditionType=response.data;
				},function(err){
					
				}
		);
	};
	
	self.getAllType();
	
	self.alertMessagaes=[];
	self.alertMessagaesModal=[];
	self.submitData = function(){
		if(self.type.typeName == '' || self.type.type == '' || self.type.typeName === undefined || self.type.type === undefined){
			self.alertMessagaesModal.push({ type: 'danger', msg: 'Please enter all the values' });
			$timeout(function () {
				self.alertMessagaesModal.splice(0, 1);
			}, 2000);
		}else{
			loader("body");
			conditionTypeFactory.saveConditionType(self.type).then(function(response){
				if(response.data.status){
					unloader("body");
					self.alertMessagaesModal.push({ type: 'success', msg: 'Condition was created successfully' });
					$timeout(function () {
						self.alertMessagaes.pop();
						$('#newType').modal('hide');
					}, 3000);
					
					self.getAllType();
				}else{
					unloader("body");
					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){
							self.alertMessagaesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.alertMessagaesModal.push({ type: 'danger', msg: response.data.data });
					}
					
					
					$timeout(function () {
						self.alertMessagaesModal.splice(0, 1);
					}, 2000);
				}
			},function(err){
				unloader("body");
			});
		}
	}
	
	self.deleteConditionCategory=function(id,name){
		 $ngConfirm({ 
			 	animation: 'top',
			    closeAnimation: 'bottom',
			    theme: 'material',
	            title: 'Confirm!',
	            content: 'Do you want to delete <b>'+name+'</b> Type ',
	            scope: $scope,
	            buttons: {
	                delete: {
	                    text: 'YES',
	                    btnClass: 'btn-danger',
	                    action: function(scope, button){
	                    	
	                    	conditionTypeFactory.deleteByID(id).then(function(response){
	                			if(response.data.status){
	                				self.getAllType();
	                				self.alertMessagaes.push({ type: 'success', msg: 'Type was deleted successfully' });
	                			}else{
	                				self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
	                			}
	                			$timeout(function () {
	        						self.alertMessagaes.splice(0, 1);
	        					}, 2000);
	                			
	                		},function(err){
	                			
	                		});
	                        return true; 
	                    }
	                },
	                close: function(scope, button){
	                }
	            }
	        });
	    }
	
	
	self.editConditionCategory = function(typeId){
		for(var i=0;i<self.conditionType.length;i++){
			if(self.conditionType[i].typeId == typeId){
				self.type =angular.copy(self.conditionType[i]);
			}
		}
		$scope.showHomeButton = true;
		$('#newType').modal();
	}
		
	self.cloneConditionCategory = function(typeId){
		for(var i=0;i<self.conditionType.length;i++){
			if(self.conditionType[i].typeId == typeId){
				self.type =angular.copy(self.conditionType[i]);
			}
		}
		$scope.showHomeButton = true;
		$('#newType').modal();
		delete self.type.typeId;
	}
	
	
	
	
//	self.goBack = function(){
//		$scope.templateUrl = "viewTypeConditions.html";
//		$scope.showCreateEventButton = false;
//		$scope.showHomeButton = true;
//		$scope.showUpdateEventButton = false; 
//	};
	
//	self.openCreateTypePage = function(){
//		self.condition.categoryId:"";self.condition.TypeName:"";
//		$scope.templateUrl = "createTypeConditions.html";
//		$scope.showCreateEventButton = true;
//		$scope.showHomeButton = false;
//		$scope.showUpdateEventButton = false;
//	};
//	
//	

	//File export option for datatables
	$scope.vm = {};
	$scope.vm.dtInstance = {};
	$scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions()
	.withDOM('f<"#buttonPosition"B>rt<"#lengthChanging"l>ip')
	.withOption('searching', true)
			.withOption('info', true)
			.withOption('paging', true)
			.withButtons([
				{
                extend: 'collection',
                text: 'Export',
                buttons: [{	
		            extend: 'pdf',
		            text: '<i class="icon-file-pdf"></i> PDF',
		            titleAttr: 'PDF',
		            exportOptions: {
		                columns: [0, 1]
		            },customize: function (doc) {
		        	    doc.content[1].table.widths = 
			        	    Array(doc.content[1].table.body[0].length + 1).join('*').split('');
			        	}
		        }, {
		        	extend :'csv',
		        	text :'<i class="icon-file-excel"></i> CSV',
		        	titleAttr :'CSV',
		        	exportOptions : {
		        		columns : [0, 1]
		        	}
		        }]
		}
				]);

//end of export
						
	
	
	
	
}]);
