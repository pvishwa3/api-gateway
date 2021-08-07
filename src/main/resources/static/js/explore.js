app.controller("explorerController",['$scope', '$rootScope', 'exploreFactory', 'logDevicesFactory', '$timeout', 'DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','widgetService','$filter','$http','$location',function($scope, $rootScope, exploreFactory, logDevicesFactory, $timeout,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,widgetService,$filter,$http,$location) {


var self = this;
var data = this.data = {};
$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
self.query  = {subType: "must",type: "group",rules:[]};
$scope.startDateInput = {momentDate:''};
$scope.endDateInput = {momentDate:''};
$scope.infoTableType = "Info";
$scope.huntingData = {"fieldType":''}
$scope.selectionModel={name:''}
var  gridOptions = {
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
			rowBuffer: 0,
			//columnDefs: columnDefs,
			rowModelType: 'serverSide',
			rowGroupPanelShow: 'always',
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
				defaultToolPanel: 'columns'
			},
			// restrict to 2 server side calls concurrently
			maxConcurrentDatasourceRequests: 2,
			cacheBlockSize: 100,
			maxBlocksInCache: 2,
			purgeClosedRowNodes: false,
			suppressRowClickSelection: false,
			floatingFilter:true,
			rowSelection: 'multiple',

			getRowNodeId: function(data) { return data.index_id },
			onFirstDataRendered(params) {
				params.api.sizeColumnsToFit();
			}
	}
	$scope.logFields = [];
	
	$scope.templateUrl = "";

    $scope.logFieldsFilter = [];
    $scope.timeLineData = [];

    $scope.viewType = "";

    $scope.threatActorData = [];

    $scope.showStaticTime = function(typeOfView){
       // $scope.viewType = typeOfView;
        $scope.viewType = typeOfView;

        if($scope.viewType === 'Threat Actor'){
                    $scope.threatActorData = [];
                    var startDate= moment($scope.startDateInput.momentDate).format("L LT");
                    var endDate = moment($scope.endDateInput.momentDate).format("L LT");

                    var data = {
                    			fieldType:$scope.huntingData.fieldType,
                    			fieldValue:$scope.selectionModel.name,
                    			startDate:moment(startDate).valueOf(),
                    			endDate:moment(endDate).valueOf(),
                    			viewType:'Alerts',
                    			malwareSearchTye:$scope.huntingData.malwareSearchTye

                    	};

                   exploreFactory.timeLineData(data).then(function(response){
                      // $scope.timeLineData = angular.copy(response.data);

                       for(var i=0;i<response.data.length;i++){
                            if(response.data[i]['mitre_attacker_group.keyword']!='NA'){
                                 $scope.threatActorData.push(response.data[i]);
                             }
                       }

                   },function(error){

                   })
        }
        if($scope.viewType === 'Techniques'){
                    $scope.threatActorData = [];
                    var startDate= moment($scope.startDateInput.momentDate).format("L LT");
                    var endDate = moment($scope.endDateInput.momentDate).format("L LT");

                                      var data = {
                                      			fieldType:$scope.huntingData.fieldType,
                                      			fieldValue:$scope.selectionModel.name,
                                      			startDate:moment(startDate).valueOf(),
                                      			endDate:moment(endDate).valueOf(),
                                      			viewType:'Alerts',
                                      			malwareSearchTye:$scope.huntingData.malwareSearchTye
                                      	};

                                     exploreFactory.timeLineData(data).then(function(response){
                                        // $scope.timeLineData = angular.copy(response.data);

                                         for(var i=0;i<response.data.length;i++){
                                              if(response.data[i]['techniques.keyword']!='NA'){
                                                   $scope.threatActorData.push(response.data[i]);
                                               }
                                         }

                                     },function(error){

                                     })
        }
    }

    $scope.showTimeLine = function(typeOfView){
        $scope.viewType = typeOfView;
        var startDate= moment($scope.startDateInput.momentDate).format("L LT");
        var endDate = moment($scope.endDateInput.momentDate).format("L LT");

        var data = {
        			fieldType:$scope.huntingData.fieldType,
        			fieldValue:$scope.selectionModel.name,
        			startDate:moment(startDate).valueOf(),
        			endDate:moment(endDate).valueOf(),
        			viewType:typeOfView,
        			malwareSearchTye:$scope.huntingData.malwareSearchTye
        	};

       exploreFactory.timeLineData(data).then(function(response){
           $scope.timeLineData = angular.copy(response.data);
       },function(error){

       })

    }



    $scope.searchIndicators = function(){


	  if($scope.infoTableType==='Info'){
			if($scope.huntingData.fieldType === 'User'){
				$scope.templateUrl = "/templates/explore/usercontext.html";
			}
			if($scope.huntingData.fieldType === 'IP'){
				$scope.templateUrl = "/templates/explore/ipcontext.html";
			}
			if($scope.huntingData.fieldType === 'Device'){
            	$scope.templateUrl = "/templates/explore/devicecontext.html";
            }
			if($scope.huntingData.fieldType === 'Malware' && $scope.huntingData.malwareSearchTye === 'malwareCategory'){
				$scope.templateUrl = "/templates/explore/malware.html";
			}
			if($scope.huntingData.fieldType === 'Malware' && $scope.huntingData.malwareSearchTye === 'malwareValue'){
				$scope.templateUrl = "/templates/explore/malware.html";
			}
			if($scope.huntingData.fieldType === 'Threat_IOC_IP'){
                $scope.templateUrl = "/templates/explore/threatipcontext.html";
            }
            if($scope.huntingData.fieldType === 'Threat_IOC_Domain' || $scope.huntingData.fieldType === 'Threat_IOC_Url' ){
              $scope.templateUrl = "/templates/explore/threatdomaincontext.html";
             }
			self.loadInfoTable();
	  }

      // self.intializeGrid();

	}
	
	$scope.malwareCategories = [];

	$scope.getMalwareCategoies = function(){

		if($scope.huntingData.malwareSearchTye === 'malwareCategory'){
			exploreFactory.getMalwareCategoies().then(function(response){
				$scope.malwareCategories = [];
    			$scope.malwareCategories = angular.copy(response.data);

    		},function(error){

    		})
		}

	}
    $scope.infoData = {}

	self.loadInfoTable = function(){
		
		var startDate= moment($scope.startDateInput.momentDate).format("L LT");
        var endDate = moment($scope.endDateInput.momentDate).format("L LT");


		self.columnDefs = [];

		if($scope.huntingData.fieldType  === 'Malware' && $scope.huntingData.malwareSearchTye  === 'malwareCategory'){
			self.columnDefs.push({headerName: "Timestamp",field: "@timestamp",sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}});
			self.columnDefs.push({headerName: "Host Name",field: "log_source_device_name",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}});
			self.columnDefs.push({headerName: "MD5 Hash",field: "md5_hash",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "Parent Command Line",field: "parent_command_line",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "User Name",field: "user_name",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "Image",field: "image",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "Command Line",field: "command_line",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "Integrity Line",field: "integrity_level",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
		}
		if($scope.huntingData.fieldType  === 'Malware' && $scope.huntingData.malwareSearchTye  === 'malwareValue'){
			self.columnDefs.push({headerName: "Timestamp",field: "@timestamp",sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}});
			self.columnDefs.push({headerName: "Host Name",field: "log_source_device_name",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}});
			self.columnDefs.push({headerName: "MD5 Hash",field: "md5_hash",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "Parent Command Line",field: "parent_command_line",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "User Name",field: "user_name",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "Image",field: "image",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "Command Line",field: "command_line",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
			self.columnDefs.push({headerName: "Integrity Line",field: "integrity_level",enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}})
		}

		var data = {
			fieldType:$scope.huntingData.fieldType,
			fieldValue:$scope.selectionModel.name,
			startDate:moment(startDate).valueOf(),
			endDate:moment(endDate).valueOf(),
			malwareSearchTye:$scope.huntingData.malwareSearchTye
		};

		var options = {
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
			
			rowSelection: 'single',
			floatingFilter:true,
			rowGroupPanelShow: 'always',
			onSelectionChanged: self.onSelectionChanged,
			onFirstDataRendered(params) {
				params.api.sizeColumnsToFit();
			}
		}

		exploreFactory.loadInfoTable(data).then(function(response){
			
			$scope.infoData = response.data;
			
			if($scope.huntingData.fieldType  === 'Malware'){
				options.rowData = response.data.malwareDetails
			}
			$("#infoTable").empty();

			var eGridDiv =  document.querySelector('#infoTable');
			new agGrid.Grid(eGridDiv, options );
			var allColumnIds = [];
			
			options.columnApi.getAllColumns().forEach(function(column) {
				allColumnIds.push(column.colId);
			});
			
			options.columnApi.autoSizeColumns(allColumnIds, false);


		},function(error){

		})
		
	};
    $scope.graphFields = [];


    $scope.addFieldToGraph = function(data){
      $scope.graphFields.push(data);
    }

    $scope.removeFieldFromGraph = function(index){
         $scope.graphFields.splice(index,1);
    }


    $scope.runGraph = function(){

    }


    self.getAllLogFields = function(){
    		logDevicesFactory.getAllLogFields().then(function(response){
    			$scope.logFields = angular.copy(response.data);

    			data.query = {"bool":{"must":[]}};
                		data["fields"] = {};


    			for(var i=0;i<$scope.logFields.length;i++){
    			    $scope.logFieldsFilter.push({fieldName:$scope.logFields[i].fieldName+".keyword"});
    			    data.fields[$scope.logFields[i].fieldName+".keyword"] = { type: 'term',title:$scope.logFields[i].fieldName,field:$scope.logFields[i].fieldName+".keyword"};
    			}



    		},function(error){

    		})
    }

	$scope.typeBasedFields = [];

  self.getTypeBasedFields = function(){
    		exploreFactory.getTypeBasedFields().then(function(response){
				$scope.typeBasedFields = [];
    			$scope.typeBasedFields = angular.copy(response.data);

    		},function(error){

    		})
    }

	self.getTypeBasedFields();



    self.temp = {};

    $scope.submitQuery = function(){

    	if(self.temp != {}){
    		if(self.temp.queryId == undefined){
    			try{
    				if(self.temp.subType == undefined || self.temp.subType == "" || self.temp.field == "" || self.temp.field == undefined){
    					unloader("body");
    					self.filterMessagaes.push({type:"danger",msg:"Please enter all the filter details"});
    					$timeout(function(){
    						self.filterMessagaes = [];
    					},2000);
    					return false;
    				}
    				self.query.rules.push(self.temp);
    			}catch(err){
    				self.query  = {subType: "must",type: "group",rules:[]};
    				self.query.rules.push(self.temp);
    			}
    		}else{
    			self.query.rules[self.temp.queryId] = self.temp;
    		}


    		$scope.output = JSON.stringify(parseFilterGroup(self.data.fields,$filter,self.query));

    		self.temp = {};
    	}
    }

    self.operator = [
    	{fieldName:'is',fieldValue:'equals'},
    	{fieldName:'is not',fieldValue:'notEquals'},
    	{fieldName:'is one of',fieldValue:'in'},
    	{fieldName:'is not one of',fieldValue:'notin'},
    	{fieldName:'exists',fieldValue:'exists'},
    	{fieldName:'does not exists',fieldValue:'notExists'},
    	];

    self.operatorConfig = {
    		maxItems : 1,
    		optgroupField : 'class',
    		labelField : 'fieldName',
    		searchField : ['fieldName'],
    		valueField : 'fieldValue',
    		create : false
    }

    self.fieldConfig = {
    		maxItems : 1,
    		optgroupField : 'class',
    		sortField: [{field: 'fieldName',direction: 'asc'}],
    		labelField : 'fieldName',
    		searchField : ['fieldName'],
    		valueField : 'fieldName',
    		create : false
    }

    self.getAllLogFields();

    $scope.showEventTable = function(type){

        self.intializeGrid();

    }



      $scope.showGraphRelation = function(){

          var startDate= moment($scope.startDateInput.momentDate).format("L LT");
          var endDate = moment($scope.endDateInput.momentDate).format("L LT");


            var data = {
                   			fieldType:$scope.huntingData.fieldType,
                   			fieldValue:$scope.selectionModel.name,
                   			startDate:moment(startDate).valueOf(),
                   			endDate:moment(endDate).valueOf(),
                   			viewType:'',
                   			indicatoryField:'user_name',
                   			vertices : $scope.graphFields.join(',')
                   };

            exploreFactory.exploreData(data).then(function(response){
                 var options = {
                                  			nodes: {
                                  				shape: 'dot',
                                  				size: 10	,
                                  				shadow: true,
                                  				color:{
                                  					background:'#ffff',
                                  					border:'#ffff'
                                  				},
                                  				scaling: {
                                                           min: 10,
                                                           max: 30
                                                         },
                                  				font: {
                                  					size: 15,
                                  					color:localStorage.getItem("themeType") === 'white'? '#000':'#fff'
                                  				},

                                  				title:'test'
                                  			},
                                  			autoResize: true,
                                  			height: '1100',
                                  			width: '100%',
                                  			interaction: {
                                  				navigationButtons: true,
                                  				keyboard: true,
                                  				hover:true
                                  			},
                                  			"physics": {
                     "barnesHut": {
                      "gravitationalConstant": -44000,
                       "centralGravity": 0.6,
                       "springLength": 12

                     },
                     "maxVelocity": 57,
                     "minVelocity": 0.75,
                     "solver": "barnesHut"
                   },



                                  			edges: {
                                  				shadow: true,
                                  //				width: 2,
                                  				"smooth": {
                       "type": "diagonalCross",
                       "forceDirection": "none",
                       "roundness":0
                     },

                                  				color: {
                                  					inherit: "from",
                                  					highlight:"#1499D7",
                                  					hover:"#1499D7",
                                  					color:"#1499D7"
                                  				}

                                  			},

                                  			groups: {
                                  				"user-Observables": {

                                  					shape: 'image',
                                  					image: 'assets/images/user1.png'
                                  				},
                                  				"ozone":{
                                  					shape: 'circularImage',
                                  					image:'assets/images/ozone-logo.png'
                                  				},
                                  				"User": {
                                  					size: 15,
                                  					color: {
                                  						border: '#FF625B',
                                  						background : '#232436',
                                  					},
                                  					borderWidth : 1,
                                  					shape: 'circularImage',
                                  					image:'assets/images/user.png'
                                  				},
                                  				"host": {

                                  					shape: 'image',
                                  					image:'assets/images/host_name.jpg'
                                  				},

                                  				"Url": {

                                  					shape: 'image',
                                  					image:'assets/images/url.png'
                                  				},


                                  				"Hash" : {

                                  					color: {
                                  						border: '#FF625B',
                                  						background : '#232436',
                                  					},
                                  					size: 15,
                                  					borderWidth : 1,
                                  					shape: 'circularImage',
                                  					image:'assets/images/hash.png'
                                  				},
                                  				"File": {

                                  					color: {
                                  						border: '#FF625B',
                                  						background : '#232436',
                                  					},
                                  					size: 15,
                                  					borderWidth : 1,
                                  					shape: 'circularImage',
                                  					image:'assets/images/process.png'
                                  				},
                                  				"IP": {


                                  					size: 15,
                                  					color: {
                                  						border: '#FF625B',
                                  						background : '#232436',
                                  					},
                                  					font:{
                                  						size:10,
                                  					},
                                  					borderWidth : 1,
                                  					shape: 'circularImage',
                                  					image:'assets/images/ip (1).png'
                                  				},

                                  				"Domain": {


                                  					size: 15,
                                  					color: {
                                  						border: '#FF625B',
                                  						background : '#232436',
                                  					},
                                  					font:{
                                  						size:10,
                                  					},
                                  					borderWidth : 1,
                                  					shape: 'circularImage',
                                  					image:'assets/images/domain.png'
                                  				},
                                  				"hash-Observables": {


                                  					shape: 'dot',
                                  					color: '#e34073'
                                  				},
                                  				"url-Observables": {


                                  					shape: 'dot',
                                  					color: '#e35640'
                                  				},
                                  				"process-Observables": {


                                  					shape: 'image',
                                  					image:'assets/images/command1.png'
                                  				},

                                  				"endNode": {


                                  					shape: 'dot',
                                  					color: 'pink'
                                  				},


                                  				"search": {


                                  					shape: 'dot',
                                  					color: 'red'
                                  				},
                                  				"ip": {

                                  					shape: 'image',
                                  					image:'assets/images/ip.jpg'
                                  				},
                                  				"domain": {

                                  					shape: 'circularImage',
                                  					image:'assets/images/domain.png'
                                  				},

                                  				"Events": {

                                  					shape: 'circularImage',
                                  					image:'assets/images/event_icons.png'
                                  				},
                                  				"Events-Next": {

                                  					shape: 'dot',
                                  					color: '#20c74c'
                                  				},

                                  				"Rules-Next": {

                                  					shape: 'dot',
                                  					color: '#20c74c'
                                  				},


                                  				"Messages": {

                                  					shape: 'circularImage',
                                  					image:'assets/images/Messages-2-icon.png'
                                  				},
                                  				"Message": {

                                  					shape: 'circularImage',
                                  					image:'assets/images/Messages-2-icon.png'
                                  				},
                                  				"Events-next": {

                                  					shape: 'dot',
                                  					color: '#194a88'
                                  				},
                                  				"host-Observables": {

                                  					shape: 'dot',
                                  					color: 'cyan'
                                  				},
                                  				"rule-event": {

                                  					shape: 'circularImage',
                                  					image:'assets/images/letter_ee.jpg'
                                  				},
                                  				"Internal" : {
                                  					shape: 'circularImage',
                                  					image:'assets/images/internal_icon.png'
                                  				},
                                  				"External" : {
                                  					shape: 'circularImage',
                                  					image:'assets/images/external.png'
                                  				},

                                  				"Current" : {
                                  					shape: 'dot',
                                  					color: 'red'
                                  				},

                                  				"Dummy" : {
                                  					shape: 'dot',
                                  					color: 'red',
                                  					size: 0
                                  				},

                                  				"high-Alert"  : {
                                  					borderWidth : 2,
                                  					color: {
                                  						border: '#FF625B',
                                  						background : '#232436',
                                  					},

                                  					size: 25,
                                  					shape: 'circularImage',
                                  					image: "assets/images/security-alert-1646716 (1).png"

                                  				},


                                  				"Mitre-Alert"  : {
                                  					borderWidth : 3,
                                  					color: {
                                  						border: '#6b3074',
                                  						background : '#232436',
                                  					},

                                  					size: 25,
                                  					shape: 'circularImage',
                                  					image: "assets/images/security-alert-1646716 (1).png"

                                  				},
                                  				"critical-Alert"  : {
                                  					borderWidth : 2,
                                  					color: {
                                  						border: '#FF625B',
                                  						background : '#232436',
                                  					},

                                  					size: 25,
                                  					shape: 'circularImage',
                                  					image: "assets/images/security-alert-1646716 (1).png"

                                  				},
                                  				"medium-Alert"  : {
                                  					borderWidth : 2,
                                  					color: {
                                  						border: '#ffaf00',
                                  						background : '#232436',
                                  					},

                                  					size: 25,
                                  					shape: 'circularImage',
                                  					image: "assets/images/security-alert-1646716 (1).png"

                                  				},
                                  				"low-Alert"  : {
                                  					borderWidth : 2,
                                  					color: {
                                  						border: '#2196f3',
                                  						background : '#232436',
                                  					},

                                  					size: 25,
                                  					shape: 'circularImage',
                                  					image: "assets/images/security-alert-1646716 (1).png"

                                  				},
                                  				"Event"  : {
                                  					borderWidth : 2,
                                  					color: {
                                  						border: '#2196f3',
                                  						background : '#232436',
                                  					},

                                  					size: 10,
                                  					shape: 'circularImage',
                                  					image: "assets/images/cross-sign (1).png"

                                  				},



                                  				dotsWithLabel: {
                                  					label: "I'm a dot!",
                                  					shape: 'dot',
                                  					color: 'cyan'
                                  				},
                                  				mints: {color:'rgb(0,255,140)'},
                                  				icons: {
                                  					shape: 'icon',
                                  					icon: {
                                  						face: 'FontAwesome',
                                  						code: '\uf0c0',
                                  						size: 50,
                                  						color: 'orange'
                                  					}
                                  				},
                                  				source: {
                                  					color:{border:'white'}
                                  				}
                                  			}

                                  	};

                                    var	nodesDataset = new vis.DataSet(response.data.nodes); // these come from WorldCup2014.js
                                    var  edgesDataset = new vis.DataSet(response.data.edges);

                                    var container = document.getElementById('networkGraph');
                                    var network = new vis.Network(networkGraph, response.data, options);

                                     network.moveTo({scale: 0.5})

                                     network.on("doubleClick", function (params) {
                                     		if(params.nodes.length > 0) {
                                     			var selectedNode = network.body.data.nodes._data[params.nodes[0]];

                                     			 var data = {
                                                                   			fieldType:selectedNode.title,
                                                                   			fieldValue:selectedNode.name,
                                                                            isExpand:'true',
                                                                   			viewType:'',
                                                                   			indicatoryField:'user_name',
                                                                   			vertices : $scope.graphFields.join(',')
                                                                   };

                                     			  exploreFactory.exploreData(data).then(function(response){
                                                       for(var i=0;i<response.data.nodes.length;i++){

                                                            if(!network.body.data.nodes._data[response.data.nodes[i].id]){
                                                                  network.body.data.nodes.add(response.data.nodes[i]);
                                                            }




                                                       	}
                                                       	for(var i=0;i<response.data.edges.length;i++){
                                                       		if(network.body.data.nodes._data[response.data.edges[i].to] && network.body.data.nodes._data[response.data.edges[i].from] ){
                                                       			network.body.data.edges.add(response.data.edges[i]);
                                                       		}


                                                       	}
                                     			  });
                                     		}
                                     	});
                  },function(error){

              })

        }

    self.intialLoad = function(){
        var type = $location.search().type;
        var value = $location.search().value;
        if(type!= undefined && value!= undefined){

            var d = new Date();
             d.setDate(d.getDate()-30);

            $scope.startDateInput.momentDate =  moment(new Date()).subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss");;
            $scope.endDateInput.momentDate = moment().format("YYYY-MM-DD HH:mm:ss");;
            $scope.huntingData.fieldType = type;
            $scope.selectionModel.name = value;
            var data = {search:value}
            $scope.autoComplete(data);
            $scope.searchIndicators();
        }
    }


    self.intializeGrid = function(){
		var columnDefs = [];

		


		for(var i=0;i<$scope.typeBasedFields.length;i++){

		columnDefs.push({headerName:$scope.typeBasedFields[i],enableRowGroup: true, field: $scope.typeBasedFields[i], width: 150,filter: 'agTextColumnFilter',filterParams:{
		filterOptions:['contains'],suppressAndOrCondition:true }});
	

		}
		gridOptions['columnDefs']= [];
		gridOptions['columnDefs'] = columnDefs;



		$("#contextTable").empty();

		var gridDiv = document.querySelector('#contextTable');
		new agGrid.Grid(gridDiv, gridOptions);



		gridOptions.api.setEnterpriseDatasource(new EnterpriseDatasource());

	}

	$scope.selectionModel = {name:''};

	function EnterpriseDatasource() {}

	EnterpriseDatasource.prototype.getRows = function (params) {
    		let jsonRequest = JSON.stringify(params.request, null, 2);
    		console.log(jsonRequest);

    		params.request['companyName'] = $scope.currentCompany;
			params.request['fieldType'] = $scope.huntingData.fieldType;
			params.request['fieldValue'] = $scope.selectionModel.name;
    		self.loadEventData(params.request,params);

    };

   //$scope.huntingData = {fieldType:''}

   self.callsPending = 0;

   	var i = 0;
   	$scope.myData = [];

 
	$scope.searchResults = [];

   	$scope.autoComplete = function($select) {
	
	
	
      return $http.post('/siem-core/user/explore/auto-completed', {
        
		
			
          fieldType: $scope.huntingData.fieldType,
 		  fieldValue: $select.search
          
        }
      ).then(function(response){
			$scope.searchResults = [];
        	$scope.searchResults = angular.copy(response.data);
      });
      }

    $scope.contextTable =  function(){



    }

    self.loadEventData = function(json,params){
    		$scope.alertNames = []

    		self.callsPending++;

            var startDate= moment($scope.startDateInput.momentDate).format("L LT");
            var endDate = moment($scope.endDateInput.momentDate).format("L LT");



    		json['endDate'] = moment(endDate).valueOf().toString();
    		json['startDate'] = moment(startDate).valueOf().toString();
    		json['query'] = JSON.stringify($scope.output);;
    		json['queryString'] = $scope.indicator;
    		json['companyName'] = 'All';

    		json['type'] = $scope.infoTableType;


    		var tempArray = [];
    		if($scope.myData.length!=0 && json.startRow!=0){
    			var lastRow  = $scope.myData[$scope.myData.length-1];

    			if(params.request.rowGroupCols[params.request.groupKeys.length]){
    				var field = params.request.rowGroupCols[params.request.groupKeys.length].field

    				for (var k in lastRow) {
    					if(k === field ){
    						tempArray.push({field:k,value:lastRow[k]})
    					}
    				}

    				for (var k in params.parentNode.data) {
    					tempArray.push({field:k,value:params.parentNode.data[k]})
    				}
    			}


    		}
    		if(tempArray.length!=0){
    			json['nextRows'] = tempArray;
    		}



    		exploreFactory.exploreData(json).then(function (response) {


    			try{
    				var temp = response.data.data;

    				
					var allColumnIds = [];
					gridOptions.columnApi.getAllColumns().forEach(function(column) {
   						 allColumnIds.push(column.colId);
 					 });

  					gridOptions.columnApi.autoSizeColumns(allColumnIds, true);
    				params.successCallback(response.data.data, response.data.lastRow);
					

    				$scope.myData = response.data.data;
    				$scope.singleEvnentInfo = {};
    				

    			}catch(err){
    				console.log(err);
    			}



    		}, function (error) {
    			$scope.fitlerMessages.push({type:"danger",msg:"Something went wrong please try again.."});
    			$timeout(function(){
    				$scope.alertMessagaes= [];

    				self.callsPending--;
    			},2500);
    		});




    	};
           self.intialLoad();

    	var count = 0;
        function parseFilterGroup(fieldMap, $filter, group) {
        	var obj = {};
        	if (group.type === 'group') {
        		obj.bool = {};
        		obj.bool[group.subType] = group.rules.map(parseFilterGroup.bind(group, fieldMap, $filter)).filter(function(item) {
        			return !!item;
        		});
        		return obj;
        	}

        	var fieldKey = group.field;
        	if (!fieldKey) return;

        	var fieldData = fieldMap[fieldKey];
        	var fieldName
        	if(fieldData != undefined){
        		fieldName = fieldData.field;
        	} else {
        		fieldData = { field: fieldKey, title:fieldKey.replace(".keyword",""), type: "term" }
        		fieldName = fieldData.field;
        	}

        	switch (fieldData.type) {
        	case 'term':
        		if (!group.subType) return;

        		switch (group.subType) {
        		case 'equals':
        			if (group.value === undefined) return;
        			obj.term = {};
        			obj.term[fieldName] = group.value;
        			break;
        		case 'notEquals':
        			if (group.value === undefined) return;
        			obj.bool = { must_not: { term: {}}};
        			obj.bool.must_not.term[fieldName] = group.value;
        			break;

        		case 'in':
        			if (group.value === undefined) return;
        			obj.bool = { must: { terms: {}}};
        			obj.bool.must.terms[fieldName] = group.value.split(",");
        			break;
        		case 'notin':
        			if (group.value === undefined) return;
        			obj.bool = { must_not: { terms: {}}};
        			obj.bool.must_not.terms[fieldName] = group.value.split(",");
        			break;
        		case 'exists':
        			obj.exists = { field: fieldName };
        			break;
        		case 'notExists':
        			obj.bool = { must_not: { exists: { field: fieldName }}};
        			break;
        		default:
        			throw new Error('unexpected subtype ' + group.subType);
        		}
        		break;
        	case 'contains':
        		if (!group.subType) return;

        		switch (group.subType) {
        		case 'equals':
        			if (group.value === undefined) return;
        			obj.term = {};
        			obj.term[fieldName] = group.value;
        			break;
        		case 'notEquals':
        			if (group.value === undefined) return;
        			obj.bool = { must_not: { term: {}}};
        			obj.bool.must_not.term[fieldName] = group.value;
        			break;
        		case 'contains':
        			if (group.value === undefined) return;
        			obj.match_phrase = {};
        			obj.match_phrase[fieldName + '.analyzed'] = group.value;
        			break;
        		case 'notContains':
        			if (group.value === undefined) return;
        			obj.bool = { must_not: { match_phrase: {}}};
        			obj.bool.must_not.match_phrase[fieldName + '.analyzed'] = group.value;
        			break;
        		case 'exists':
        			obj.exists = { field: fieldName };
        			break;
        		case 'notExists':
        			obj.bool = { must_not: { exists: { field: fieldName }}};
        			break;
        		default:
        			throw new Error('unexpected subtype ' + group.subType);
        		}
        		break;

        	case 'boolean':
        		if (group.value === undefined) return;
        		obj.term = {};
        		obj.term[fieldName] = group.value;
        		break;

        	case 'number':
        		if (!group.subType) return;

        		switch (group.subType) {
        		case 'equals':
        			if (group.value === undefined) return;
        			obj.term = {};
        			obj.term[fieldName] = group.value;
        			break;
        		case 'notEquals':
        			if (group.value === undefined) return;
        			obj.bool = { must_not: { term: {}}};
        			obj.bool.must_not.term[fieldName] = group.value;
        			break;
        		case 'lt':
        		case 'lte':
        		case 'gt':
        		case 'gte':
        			if (group.value === undefined) return;
        			obj.range = {};
        			obj.range[fieldName] = {};
        			obj.range[fieldName][group.subType] = group.value;
        			break;
        		case 'exists':
        			obj.exists = { field: fieldName };
        			break;
        		case 'notExists':
        			obj.bool = { must_not: { exists: { field: fieldName }}};
        			break;
        		default:
        			throw new Error('unexpected subtype ' + group.subType);
        		}
        		break;

        	case 'date':
        		if (!group.subType) return;

        		switch (group.subType) {
        		case 'equals':
        			if (!angular.isDate(group.date)) return;
        			obj.term = {};
        			obj.term[fieldName] = formatDate($filter, group.date);
        			break;
        		case 'notEquals':
        			if (!angular.isDate(group.date)) return;
        			obj.bool = { must_not: { term: {}}};
        			obj.bool.must_not.term[fieldName] = formatDate($filter, group.date);
        			break;
        		case 'lt':
        		case 'lte':
        		case 'gt':
        		case 'gte':
        			if (!angular.isDate(group.date)) return;
        			obj.range = {};
        			obj.range[fieldName] = {};
        			obj.range[fieldName][group.subType] = formatDate($filter, group.date);
        			break;
        		case 'last':
        			if (!angular.isNumber(group.value)) return;
        			obj.range = {};
        			obj.range[fieldName] = {};
        			obj.range[fieldName].gte = 'now-' + group.value + 'd';
        			obj.range[fieldName].lte = 'now';
        			break;
        		case 'next':
        			if (!angular.isNumber(group.value)) return;
        			obj.range = {};
        			obj.range[fieldName] = {};
        			obj.range[fieldName].gte = 'now';
        			obj.range[fieldName].lte = 'now+' + group.value + 'd';
        			break;
        		case 'exists':
        			obj.exists = { field: fieldName };
        			break;
        		case 'notExists':
        			obj.bool = { must_not: { exists: { field: fieldName }}};
        			break;
        		default:
        			throw new Error('unexpected subtype ' + group.subType);
        		}
        		break;

        	case 'multi':
        		if (group.values === undefined) return;
        		obj.terms = {};
        		obj.terms[fieldName] = [];


        		Object.keys(group.values).forEach(function(key) {
        			if(group.values[key]){
        				obj.terms[fieldName].push(key);
        			}

        		});


        		break;

        	case 'select':
        		if (group.value === undefined) return;
        		obj.term = {};
        		obj.term[fieldName] = group.value.id;
        		break;

        	case 'match':
        		if (!group.subType) return;

        		switch (group.subType) {
        		case 'matchAny':
        			if (group.value === undefined) return;
        			obj.match = {};
        			obj.match[fieldName] = group.value;
        			break;
        		case 'matchAll':
        			if (group.value === undefined) return;
        			obj.match = {};
        			obj.match[fieldName] = {};
        			obj.match[fieldName].query = group.value;
        			obj.match[fieldName].operator = 'and';
        			break;
        		case 'matchPhrase':
        			if (group.value === undefined) return;
        			obj.match_phrase = {};
        			obj.match_phrase[fieldName] = group.value;
        			break;
        		case 'exists':
        			obj.exists = { field: fieldName };
        			break;
        		case 'notExists':
        			obj.bool = { must_not: { exists: { field: fieldName }}};
        			break;
        		default:
        			throw new Error('unexpected subtype ' + group.subType);
        		}
        		break;

        	default:
        		throw new Error('unexpected type ' + fieldData.type);
        	}

        	if (fieldData.parent) {
        		obj = {
        				has_parent: {
        					parent_type: fieldData.parent,
        					query: obj
        				}
        		}
        	}

        	if (fieldData.nested) {
        		obj = {
        				nested: {
        					path: fieldData.nested,
        					query: obj
        				}
        		};
        	}

        	count += 1;
        	return obj;
        }




}]);

app.directive('expBuilder', ['$compile','conditionFactory', function ($compile,conditionFactory) {
	return {
		restrict: 'E',
		scope: {
			group: '='

		},
		templateUrl: 'queryBuilderDirective.html',
		compile: function (element, attrs) {
			var content, directive;
			content = element.contents().remove();
			return function (scope, element, attrs) {
				if(!scope.group.rules){
					scope.group = {"rules":[]}
				}


				scope.operators = [
					{ name: 'AND' },
					{ name: 'OR' }
					];



				scope.conditions = [
					{ name: 'Equal TO', value:"=" },
					{ name: 'Not Equal to',value:"!="  },
					{ name: 'Greater than',value:">"  },
					{ name: 'Contains',value:"%%"  },
					{ name: 'Starts With',value:"_%"  },
					{ name: 'Ends With',value:"%_"  },
					{ name: 'In',value:"in"  },
					{ name: 'Not In',value:"not_in"  },
					{ name: 'Greater than equal to',value:">="  },
					{ name: 'less than',value:"<"  },
					{ name: 'less than equal to',value:"<="  }
					];





				scope.loadFields = function(){
					var tempArray = [];
					setTimeout(function(){
						if(!(scope.$parent.schema.selects === undefined)){
							for(var i=0;i<scope.$parent.schema.selects.length;i++){
								tempArray.push({name:scope.$parent.schema.selects[i].column})
							}
						}
						scope.fields =tempArray;
					}, 3000);

				}


				scope.addCondition = function (group) {

					group.rules.push({
						condition: ':',
						field: '',
						data: ''
					});
				};

				//scope.addCondition(scope.group);
				scope.loadFields();

				scope.removeCondition = function (index) {
					scope.group.rules.splice(index, 1);
				};

				scope.addGroup = function () {
					scope.group.rules.push({
						group: {
							operator: 'AND',
							rules: [{
								condition: ':',
								field: '',
								data: ''
							}]
						}
					});

				};
				scope.on
				scope.switchToBasic = function(){
					scope.$parent.isFiterAdvanced = false;
				};

				scope.removeGroup = function () {
					"group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
				};

				directive || (directive = $compile(content));

				element.append(directive(scope, function ($compile) {
					return $compile;
				}));
			}
		}
	}



}]);