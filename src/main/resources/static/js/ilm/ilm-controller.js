app.controller("ilmController", ['$scope', 'ilmService','$rootScope','$timeout','$uibModal','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder', function ($scope, ilmService , $rootScope, $timeout,$uibModal,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	$scope.ilmDetails =  {id:"",connectionName:"",hostName:"",password:"",sslEnabled:"",port:0,userName:""};
	self.alertMessagaes =[];
    $scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
    $scope.repoFileName = "templates/ilm/viewrepo.html"

    $scope.isBack = false;

    $scope.rawMessagesStorage = {"location":0,"retentionPeriod":0,'retentionPeriodUnit':'',storageOption:'',enableOrDisable:false}

    $scope.getRawStoreDetails = function(){
             ilmService.getRawStoreDetails().then(function (response) {
                if(response.data){
                    $scope.rawMessagesStorage.location = response.data.location.toString();
                    $scope.rawMessagesStorage.retentionPeriod = response.data.retentionPeriod;
                    $scope.rawMessagesStorage.retentionPeriodUnit = response.data.retentionPeriodUnit;
                    $scope.rawMessagesStorage.storageOption = response.data.storageOption;
                    if(response.data.enableOrDisable === 'active'){
                         $scope.rawMessagesStorage.enableOrDisable = true;
                    }else{
                        $scope.rawMessagesStorage.enableOrDisable = false;
                    }
                }
             }, function (error) {

           });
    }

    $scope.rawStorageSizes = [];

    $scope.getRawsStorageSize = function(){
     $scope.rawStorageSizes = [];
         ilmService.getRawsStorageSize().then(function (response) {

               // $scope.rawStorageSizes = angular.copy(response.data);

             self.storageColumnDefs = [
                        		{headerName: "Date",field: "bucketName",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                        		{headerName: "Log Device",field: "logDevice",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                        		{headerName: "Log Type",field: "logType",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                                {headerName: "Device Name",field: "deviceKey",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},

                        		{headerName: "Size",field: "storageSize",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                        		{headerName: "Storage",field: "stroageType",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                                {headerName: "Location",field: "location",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                                 {headerName: "Collector",field: "collectorName",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},

                            ]

                            self.rawStorageSizeGrid = {
                            							defaultColDef: {
                            								width: 100,
                            								sortable: true,
                            								resizable: true,
                            								filter: true,
                            								editable: false
                            							},
                            							autoGroupColumnDef: {
                            								width: 180
                            							},
                            							columnDefs: self.storageColumnDefs,
                            							rowGroupPanelShow: 'onlyWhenGrouping',
                            							animateRows: true,
                            							debug: false,
                            							suppressAggFuncInHeader: true,
                            							sideBar: {
                            								toolPanels: [{
                            									id: 'columns',
                            									labelDefault: 'Columns',
                            									labelKey: 'columns',
                            									iconKey: 'columns',
                            									toolPanel: 'agColumnsToolPanel',
                            									toolPanelParams: {
                            										suppressPivots: true,
                            										suppressPivotMode: true,
                            									}
                            								}],

                            //								defaultToolPanel: 'columns'
                            							},
                            							rowData: response.data,
                            							rowSelection: 'multiple',
                            							floatingFilter:true,
                            							rowGroupPanelShow: 'always',

                            							onFirstDataRendered(params) {
                            								params.api.sizeColumnsToFit();
                            							}
                            					}


                            					$("#rawStorageSizeGrid").empty();

                            					 $("#rawStorageSizeGrid").css("height",$(window).height()-250+"px");

                            					var eGridDiv =  document.querySelector('#rawStorageSizeGrid');
                            					new agGrid.Grid(eGridDiv, self.rawStorageSizeGrid );

           }, function (error) {

         });
    }

    $scope.getAllRawsStorageSize = function(){
     $scope.rawStorageSizes = [];
     ilmService.getRawsStorageSize().then(function (response) {


self.columnDefs = [
                        		{headerName: "Date",field: "bucketName",width: 150,sort: 'asc',enableRowGroup: true,checkboxSelection: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                        		{headerName: "Log Device",field: "logDevice",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                        		{headerName: "Log Type",field: "logType",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                                {headerName: "Device Name",field: "deviceKey",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},

                        		{headerName: "Size",field: "storageSize",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                        		{headerName: "Storage",field: "stroageType",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
                                {headerName: "Location",field: "location",width: 150,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},

                            ]


                self.eventGrid = {
                							defaultColDef: {
                								width: 100,
                								sortable: true,
                								resizable: true,
                								filter: true,
                								editable: false
                							},
                							autoGroupColumnDef: {
                								width: 180
                							},
                							columnDefs: self.columnDefs,
                							rowGroupPanelShow: 'onlyWhenGrouping',
                							animateRows: true,
                							debug: false,
                							suppressAggFuncInHeader: true,
                							sideBar: {
                								toolPanels: [{
                									id: 'columns',
                									labelDefault: 'Columns',
                									labelKey: 'columns',
                									iconKey: 'columns',
                									toolPanel: 'agColumnsToolPanel',
                									toolPanelParams: {
                										suppressPivots: true,
                										suppressPivotMode: true,
                									}
                								}],

                //								defaultToolPanel: 'columns'
                							},
                							rowData: response.data,
                							rowSelection: 'multiple',
                							floatingFilter:true,
                							rowGroupPanelShow: 'always',
                							onSelectionChanged: self.onSelectionChanged,
                							onFirstDataRendered(params) {
                								params.api.sizeColumnsToFit();
                							}
                					}

                					self.tagsId = [];
                					$("#rawStorage").empty();

                					 $("#rawStorage").css("height",$(window).height()-250+"px");
                					if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){
                						self.eventGrid.api.deselectAll();
                					}
                					var eGridDiv =  document.querySelector('#rawStorage');
                					new agGrid.Grid(eGridDiv, self.eventGrid );

       }, function (error) {

      });
    }

    self.onSelectionChanged = function() {
    		self.tagsId = [];
    		self.tagsId = angular.copy(self.eventGrid.api.getSelectedRows());
    }

    $scope.requestRestoreSnapshot = function(){

        ilmService.requestRestoreSnapshot(self.tagsId).then(function (response) {

        }, function (error) {

       });

    }

    $scope.saveRawStoreate = function(){

            var tempData = parseInt($scope.rawMessagesStorage.location);

             $scope.rawMessagesStorage.location = tempData;

            ilmService.saveRawStoreate($scope.rawMessagesStorage).then(function (response) {
                   if(response.data.status){
                          self.conditionMessagesModal.push({ type: 'success', msg: 'Successfully saved the configuration' });
                          	$timeout(function () {
                          		self.conditionMessagesModal.splice(0, 1);
                               },2000);

                          }else{
                              if(response.data.errors){
                          	    for(var i=0;i<response.data.errors.length;i++){
                          			self.conditionMessagesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
                          		}
                          	}else{
                          			self.conditionMessagesModal.push({ type: 'danger', msg: response.data.data });
                          	}
                          	$timeout(function () {
                          	    self.conditionMessagesModal.splice(0, 1);
                          		}, 2000);
                          	}
            }, function (error) {

            });
    }

    $scope.openRegisterRepo = function(){
         $scope.repoFileName = "templates/ilm/createrepo.html"
         $scope.isBack = true;
    }
     $scope.backToRepos = function(){
             $scope.repoFileName = "templates/ilm/viewrepo.html"
             $scope.isBack = false;
     }

     self.repo = {name:'',type:'',config:'',actualConfig:{}}


	self.ilmData = [
	    {
	        indexType:"raw",
	        unitType:"days",
	        warmStorage:0
	    },
	    {
        	        indexType:"events",
        	        unitType:"days",
        	        warmStorage:0
        },
        {
          indexType:"alerts",
          unitType:"days",
          warmStorage:0
        },

	];

    self.save = function(){

    ilmService.saveIlm(self.ilmData).then(function (response) {

        if(response.data.status){
        	 self.conditionMessagesModal.push({ type: 'success', msg: 'Successfully created the ILM Details' });
        	$timeout(function () {
        		self.conditionMessagesModal.splice(0, 1);
             },2000);

        }else{
            if(response.data.errors){
        	    for(var i=0;i<response.data.errors.length;i++){
        			self.conditionMessagesModal.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
        		}
        	}else{
        			self.conditionMessagesModal.push({ type: 'danger', msg: response.data.data });
        	}
        	$timeout(function () {
        	    self.conditionMessagesModal.splice(0, 1);
        		}, 2000);
        	}

        }, function (error) {

 		});


    }

    $scope.dataStats = {};

    self.getDataStats = function(){

         ilmService.getDataStats().then(function (response) {
            $scope.dataStats = angular.copy(response.data);
         }, function (error) {

         });

    }



    $scope.config = {};

    self.repoMessages = [];
    self.conditionMessagesModal = [];

    self.repoRegisterDetails = [];

    $scope.getRepoDetails = function(){
         self.repoRegisterDetails = [];
        ilmService.getRepoDetails().then(function (response) {
            if(response.data.length==0){
               self.conditionMessagesModal.push({ type: 'danger', msg: 'No repository was configured!! Please click on Register Repo Button to configure repository.' });
            }else{
               self.repoRegisterDetails = angular.copy(response.data);
            }
            $timeout(function () {
                  self.conditionMessagesModal.splice(0, 1);
               }, 5000);

         }, function (error) {

        });
    }
    $scope.snapshotDetails = [];
    $scope.getSnapshotDetails = function(){
         $scope.snapshotDetails = [];
        ilmService.getSnapshotDetails().then(function (response) {
                $scope.snapshotDetails = angular.copy(response.data);
       }, function (error) {

       });
    }

    $scope.verifyRepo = function(){
        //var config = JSON.stringify(self.repo.actualConfig);
          /// self.repo.config = config;
          ilmService.verifyRepo(self.repo).then(function (response) {




                    if(response.data.data.indexOf("Elasticsearch exception")!=-1){
                       self.conditionMessagesModal.push({ type: 'danger', msg: "Repo Config Error : "+response.data.data });
                                                                  	$timeout(function () {
                                                                  	 self.conditionMessagesModal.splice(0, 1);

                                                                  	},8000);
                     }
           }, function (error) {

           });
    }

    $scope.sanpshotRequest = {snapshotIds:[],retnetionPeirod:0};

    $scope.requestType = "";
    $scope.openRawConfiguration = function(){
         $scope.requestType = "raw";
        if(self.tagsId.length === 0){
                 self.conditionMessagesModal.push({ type: 'danger', msg: "Please Select atleast one raw data" });
                                         $timeout(function () {
                                             self.conditionMessagesModal.splice(0, 1);
                                       },8000);
                                       return false;
        }
         $("#openSnaphotReopConfig").modal();
    }

    $scope.openSnapshotConfiguration = function(){
         $scope.sanpshotRequest = {snapshotIds:[],retnetionPeirod:0};
        var tempArray = [];
         for(var i=0;i<$scope.snapshotDetails.length;i++){
                     if($scope.snapshotDetails[i].select){
                         tempArray.push($scope.snapshotDetails[i].name);
                     }
                 }

                 if(tempArray.length===0){
                      self.conditionMessagesModal.push({ type: 'danger', msg: "Please Select Atleast one repo" });
                         $timeout(function () {
                             self.conditionMessagesModal.splice(0, 1);
                       },8000);
                       return false;
                 }

        $("#openSnaphotReopConfig").modal();
    }

    $scope.sanpshotHistoryDetails = [];
    $scope.getSnapshotHistoryDetails = function(){
          $scope.sanpshotHistoryDetails = [];
       ilmService.getSnapshotHistoryDetails().then(function (response) {
            $scope.sanpshotHistoryDetails = angular.copy(response.data);
         }, function (error) {
       });
    }


    $scope.restoreSnapshot = function(){
        var tempArray = [];

        if($scope.requestType === "raw"){
         ilmService.requestRestoreSnapshot(self.tagsId).then(function (response) {
                               if(response.status === 200){
                                  self.repoMessages.push({ type: 'success', msg: "Restoration Process Started !!! " });


                                  $timeout(function () {
                                      self.repoMessages.splice(0, 1);
                                       $("#openSnaphotReopConfig").modal('hide');
                                   },3000);
                               }else if(response.status === 500){
                                 self.repoMessages.push({ type: 'danger', msg:response.data  });
                                              $timeout(function () {
                                                  self.repoMessages.splice(0, 1);
                                               },8000);
                               }
                            }, function (error) {
                                if(error.status === 500){
                                             self.repoMessages.push({ type: 'danger', msg:error.data.data  });
                                                          $timeout(function () {
                                                              self.repoMessages.splice(0, 1);
                                                           },8000);
                               }
                           });


        }else{

            for(var i=0;i<$scope.snapshotDetails.length;i++){
                        if($scope.snapshotDetails[i].select){
                            tempArray.push($scope.snapshotDetails[i].name);
                        }
                    }

                    if(tempArray.length===0){
                         self.conditionMessagesModal.push({ type: 'danger', msg: "Please Select Atleast one repo" });
                            $timeout(function () {
                                self.conditionMessagesModal.splice(0, 1);
                          },8000);
                          return false;
                    }

                   $scope.sanpshotRequest.snapshotIds = tempArray;
                   ilmService.restoreSnapshot($scope.sanpshotRequest).then(function (response) {
                       if(response.status === 200){
                          self.repoMessages.push({ type: 'success', msg: "Restoration Process Started !!! " });


                          $timeout(function () {
                              self.repoMessages.splice(0, 1);
                               $("#openSnaphotReopConfig").modal('hide');
                           },3000);
                       }else if(response.status === 500){
                         self.repoMessages.push({ type: 'danger', msg:response.data  });
                                      $timeout(function () {
                                          self.repoMessages.splice(0, 1);
                                       },8000);
                       }
                    }, function (error) {
                        if(error.status === 500){
                                     self.repoMessages.push({ type: 'danger', msg:error.data.data  });
                                                  $timeout(function () {
                                                      self.repoMessages.splice(0, 1);
                                                   },8000);
                       }
                   });

        }



    }

    $scope.registerRepo = function(){
      var config = JSON.stringify($scope.config);
       self.repo.config = config;
      ilmService.registerRepo(self.repo).then(function (response) {
                if(response.data.status){
                   	self.repoMessages.push({ type: 'success', msg: 'Repo was Registered successfully. Please click on verify button to verify configuration' });
                   	$timeout(function () {
                   	 self.repoMessages.splice(0, 1);

                   	},2000);
                 }else{
                    if(response.data.data.length>1){
                            for(var i=0;i<response.data.data.length;i++){
                                self.repoMessages.push({ type: 'danger', msg: response.data.data[i].defaultMessage });
                            }
                    }else  {
                         self.repoMessages.push({ type: 'danger', msg: response.data.data[i] });
                    }

                                       	$timeout(function () {
                                       	 self.repoMessages.splice(0, 1);

                                       	},2000);
                 }
       }, function (error) {

       });
    }
	self.init = function(){
		self.loadILMDetails();
		self.getDataStats();
		$scope.getRepoDetails();
		$scope.getSnapshotDetails();
	    $scope.getRawStoreDetails();
	    $scope.getRawsStorageSize();

	}

    $scope.openRepoRegistry = function(){
        $("#repoRegistry").modal();
    }




	self.loadILMDetails = function(){
	   ilmService.getIlmDetails().then(function (response) {
            if(response.data && response.data.policyObject){

                self.ilmData = angular.copy(JSON.parse(response.data.policyObject));
            }
	  }, function (error) {

      });
	}




}]);
