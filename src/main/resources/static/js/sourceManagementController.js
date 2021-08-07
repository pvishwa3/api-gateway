app.controller("sourceManagement", ['$scope','$timeout','sourceManagementFactory','$filter','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', '$rootScope', function ($scope,$timeout,sourceManagementFactory,$filter,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$rootScope) {
	var ctrl=this;
	$scope.templateUrl="logTypeDetails.html";
	$rootScope.$broadcast('changeThemeToNormal');
		
	ctrl.getAllSavedLogs = function(){
		sourceManagementFactory.getAllSavedSources().then(function(response){
			ctrl.savedSource=response.data;
		},function(err){
			
		});
	}
	
	ctrl.getAllSavedLogs();
	ctrl.alertMessagaes=[];
	ctrl.saveLogTypes = function(){
		sourceManagementFactory.saveLogTypes(ctrl.data).then(function(response){
			ctrl.getAllSavedLogs();
			console.log(response);
			if(response.data.status === true){
				ctrl.alertMessagaes.push({ type: 'success', msg: 'LogType was created successfully' });
				$timeout(function(){
					ctrl.alertMessagaes.pop();
				},3000);
			}
		},function(error){
			ctrl.alertMessagaes.push({ type: 'danger', msg: response.data.msg});
			$timeout(function(){
				ctrl.alertMessagaes.pop();
			},3000);
		});
	};

	ctrl.displayUpdate = function(id){
		ctrl.data=angular.copy($filter('filter')(ctrl.savedSource, {id: id })[0]);
		$scope.templateUrl='newLogType.html';
	};
	
	ctrl.deleteCondition =function(id){
		sourceManagementFactory.delteLogType(id).then(function(response){
			ctrl.alertMessagaes.push({ type: 'success', msg: 'LogType was deleted successfully' });
			$timeout(function(){
				ctrl.alertMessagaes.pop();
			},3000);
			
			sourceManagementFactory.getAllSavedSources().then(function(response){
				ctrl.savedSource=response.data;
			},function(err){});
		},function(error){
			ctrl.alertMessagaes.push({ type: 'danger', msg: response.data.msg});
			$timeout(function(){
				ctrl.alertMessagaes.pop();
			},3000);
		});
	}
	
	ctrl.logTypesView = function(){		
		$scope.templateUrl='logTypeDetails.html'
	}
	
	ctrl.showLogTypeView = function(){		
		$scope.templateUrl='newLogType.html';
		ctrl.data={};
	}
	

	//File export option for datatables
	$scope.vm = {};
	$scope.vm.dtInstance = {};
	$scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions()
		.withDOM('Bfrt<"#lengthChanging"l>ip')
	    .withOption('searching', true)
	    .withOption('info', true)
	    .withOption('paging', true)
	    .withButtons([{
	            extend: 'copy',
	            text: '<i class="icon-copy2"></i> Copy',
	            titleAttr: 'Copy',
	            exportOptions: {
	                columns: [0, 1]
	            }
	        },
	        {
	            extend: 'print',
	            text: '<i class="icon-printer" aria-hidden="true"></i> Print',
	            titleAttr: 'Print',
	            exportOptions: {
	                columns: [0, 1]
	            }
	        },
	        {
	            extend: 'excel',
	            text: '<i class="icon-file-excel"></i> Excel',
	            titleAttr: 'Excel',
	            exportOptions: {
	                columns: [0, 1]
	            }
	        }, {
	            extend: 'pdf',
	            text: '<i class="icon-file-pdf"></i> PDF',
	            titleAttr: 'PDF',
	            exportOptions: {
	                columns: [0, 1]
	            }
	        }, {
	        	extend :'csv',
	        	text :'<i class="icon-file-excel"></i> CSV',
	        	titleAttr :'CSV',
	        	exportOptions : {
	        		columns : [0,1]
	        	}
	        }, {
	            text: '<i class="icon-file-text"></i> JSON',
	            footer:false,
	            action: function ( e, dt, button, config ) {
	                    var data = dt.buttons.exportData();
	                    $.fn.dataTable.fileSave(
	                        new Blob( [ JSON.stringify( data, null, "\t" ) ] ),
	                        'logsources.json'
	                    );
	                }
	        }
	    ]);
//end of export
	

	
}]);