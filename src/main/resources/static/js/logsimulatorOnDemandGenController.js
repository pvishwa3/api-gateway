app.controller("logsimulationOndemandGen",['$scope', '$rootScope','logsimulationFactory','logsimulationOndemadGenFactory','corrleationFactory', '$timeout','$ngConfirm','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$filter','$location', function($scope, $rootScope, logsimulationFactory,logsimulationOndemadGenFactory,corrleationFactory, $timeout,$ngConfirm,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$filter,$location) {
	var self = this;
	$rootScope.$broadcast('changeThemeToNormal');
	$scope.templateUrl = "logsimulation-schedulers.html";
	self.newMetaFieldDetails = [ {  "key":"",  "value":"" } ];
	self.newMultiLineDetails = { "multiLineFlag":"FALSE", "multiLinePattern":{"negate":"TRUE", "match":"AFTER", "pattern":""} };
	self.newSettingsDetails = { "logstashHost":"", "portNumber":""};
	self.newScheduleDetails = { "schedulerFlag":"FALSE", "cronExpression": "0 0/1 * 1/1 * ? *" };
	self.newEventDetails = {"eventName":"", "eventType":"", "logType":"", "messageType":"", "osType":"", "formatType":"PLAIN", "template":"", "eventId":0};
	self.simulationTypes = ["EVENT", "ATTACK","RULE"];
	self.formatTypes = ["PLAIN", "JSON"];
	self.statuses = ["ENABLE", "DISABLE"];
	self.newField = {"fieldName":"", "fieldValue":""};
	self.multiLineNegates = ["TRUE", "FALSE"];
	self.osTypes = ["WINDOWS", "LINUX"];
	self.countries = ["AFGHANISTAN","ALGERIA","ANDORRA","ANGOLA","ARGENTINA","ARUBA","AUSTRAILIA","AUSTRIA","BANGLADESH","BELGIUM","BELIZE","BERMUDA","BHUTAN","BRAZIL","BULGARIA","CAMBODIA","CAMEROON","CANADA","CAPE VERDE","CHILE","CHINA","COLOMBIA","CONGO","CUBA","DENMARK","EGYPT","EQUATORIAL GUINEA","ESTONIA","ETHIOPIA","FINLAND","FRANCE","GEORGIA","GERMANY","GHANA","GREECE","GREENLAND","HONDURAS","HONG KONG","HUNGARY","ICELAND","INDIA","INDONESIA","IRAN","IRAQ","IRELAND","ISRAEL","ITALY","JAPAN","JORDAN","KAZAKHSTAN","KENYA","KOREA","KUWAIT","LATVIA","LITHUANIA","MADAGASCAR","MALAYSIA","MALDIVES","MAURITIUS","MEXICO","MONGOLIA","MYANMAR","NAMIBIA","NEPAL","NETHERLANDS","NEW ZEALAND","NIGERIA","NORWAY","PAKISTAN ","PANAMA","PARAGUAY","PERU","PHILIPPINES","POLAND","PORTUGAL","ROMANIA","RUSSIAN FEDERATION","SAUDI ARABIA","SERBIA","SINGAPORE","SLOVENIA","SOUTH AFRICA","SPAIN","SRI LANKA","SUDAN","SWEDEN","SWITZERLAND","TAIWAN","THAILAND","TURKEY","UGANDA","UNITED ARAB EMIRATES","UNITED KINGDOM","UNITED STATES","VENEZUELA","VIRGIN ISLANDS","YEMEN","ZAMBIA","ZIMBABWE"]
	self.multiLineMatchers = ["BEFORE", "AFTER"];
	//self.newsim = { "id":0, "eventDetailsList":[], "ruleName":"","randomEvents": false, "simulationName":"", "simulationDescription":"", "simulationType":"EVENT", "eventDetailsId":0, "attackDetailsId":0, "count":1, "correctness":100, "status":"ENABLE", "scheduleDetails":{ "schedulerFlag":"FALSE", "cronExpression": "0 0/1 * 1/1 * ? *" }, "metaFields":[{"key": "log_device", "value": "default"},{"key": "log_type", "value": "default"},{"key": "index_name", "value": "technominds"},{"key": "company", "value": "tmcl"}], "multiLineDetails":{ "multiLineFlag":"FALSE", "multiLinePattern":{"negate":"TRUE", "match":"AFTER", "pattern":""} }, "simulationIP":{"type":"RANDOM IP","cidrValue":"","countryValue":"","range":{"fromIp":"","toIp":""}}, "simulationDate":{ "type":"REAL TIME","range": { "startDate" :"","endDate":""}, "relative": {"timeState":"", "timeFrame":0, "timeMetric":"", "eventCount":1}}};
	
	self.newsim= {"count":1,"eventsSize":false,"size":0,"capacity":"KB","correctness":100,"templateType":"PLAIN","template":"","metaFields":[{"key": "log_device", "value": "default"},{"key": "log_type", "value": "default"},{"key": "index_name", "value": "technominds"},{"key": "company", "value": "tmcl"}],
			     "simulationDate":{ "type":"REAL TIME","range": { "startDate" :"","endDate":""}, "relative": {"timeState":"", "timeFrame":0, "timeMetric":""}},"simulationIP":{"type":"RANDOM IP","cidrValue":"","countryValue":"","range":{"fromIp":"","toIp":""}}};
	
	
	
   
	self.alertMessages =[];
	self.allEventDetails = [];
	self.eventNames = [];
	self.allSchedules = [{ "id":0, "simulationName":"","eventsSize":false, "simulationDescription":"", "simulationType":"EVENT", "eventDetailsId":0, "attackDetailsId":0, "count":1,"size":0,"capacity":"KB", "status":"ENABLE", "scheduleDetails":{ "schedulerFlag":"FALSE", "cronExpression": "0 0/1 * 1/1 * ? *" }, "metaFields":[ {  "key":"",  "value":"" } ], "multiLineDetails":{ "multiLineFlag":"FALSE", "multiLinePattern":{"negate":"TRUE", "match":"AFTER", "pattern":""} }, "simulationIP":{"type":"RANDOM IP","cidrValue":"","countryValue":"","range":{"fromIp":"","toIp":""}}, "simulationDate":{ "type":"REAL TIME","range": { "startDate" :"","endDate":""}, "relative": {"timeState":"", "timeFrame":0, "timeMetric":""}}}];
	self.allSavedFields = [];
	self.allSavedAttacks = [];
	
	 self.stats={"jobName":"","cronExpression":"","prevTriggTime":"","nextTriggTime":""};
	self.allRulenames=[];
	
	
	self.openMetaDataModal = function(){
		$("#metadataModal").modal();
	}
	self.openRandomTimeStampForm=function(){
		$("#randomTimeModal").modal();
	}
	
	self.openRandomIpForm=function(){
		$("#randomIpModal").modal();
	}
	
	
	 self.ondemandGen = function(){
		 if(self.newsim.templateType =="JSON") {
			 self.newsim.template = JSON.stringify($scope.objGenNew.data);
		 }
		 //self.newsim.eventDetailsId = parseInt(self.newsim.eventDetailsId);
         console.log(self.newsim);
         console.log(self.newsim.template);
         if( self.newsim.template== undefined || self.newsim.template == ''){
 			self.alertMessages.push({ type: 'alert-danger', msg: 'All fields are manditory' });
 	    	   $timeout(function () {
 				self.alertMessages.splice(0, 1);
 			}, 2000);
         }
         else{
         logsimulationOndemadGenFactory.ondemandGeneration(self.newsim).then(function(response){
        	
         	console.log(response.data.status);
            console.log(response.data);
self.alertMessages.push({ type: 'alert-success', msg: ' Simulation Queued Successfully' });
     	   $timeout(function () {
 			self.alertMessages.splice(0, 1);
 		}, 2000);
         })
	 }
 }

	 
	 self.getRuleNames = function(){
		 corrleationFactory.getAllCorrelationDetails().then(function (response){
				self.allRulenames = response.data.tableData;
				console.log(response.data);
			},function(error){
				
			});
		
	 }
	 
	 
	self.getSchedulerStats = function(id) {
		for(var i=0; i<self.allSchedules.length; i++) {
			if(self.allSchedules[i].id == id) {
				self.simulationStats = angular.copy(self.allSchedules[i]);
				break;
			}
		}
		
		console.log(self.simulationStats);
		logsimulationFactory.getStatsById(id).then(function(response){
			console.log(response.data);
			self.stats = {"nextTriggTime":response.data.next, "prevTriggTime":response.data.previous};
			toastr.success("Scheduled Stats");
		},function(err){
			toastr.error("Unable to display Scheduled Stats");
		});
		
	 }
	self.cronOptions = {
			  formInputClass: 'form-control cron-gen-input', // Form input class override
		      formSelectClass: 'form-control cron-gen-select', // Select class override
		      formRadioClass: 'cron-gen-radio', // Radio class override
		      formCheckboxClass: 'cron-gen-checkbox', // Radio class override
		      hideSeconds: true // Whether to show/hide the seconds time picker
	}
	//self.newsim.eventDetailsList = [];
	self.saveEventDetails = function(){
		self.newsim.eventDetailsList = [];
		$('#stats').modal('hide');
		console.log(self.data1);
		angular.forEach(self.data1,function(value,key){	
			if(value == true){				
				self.newsim.eventDetailsList.push(key);
			}
		});
		console.log(self.newsim.eventDetailsList);
	}

	$scope.objGenNew = {data: self.newsim.template, options: {mode: 'tree'}};
	$scope.changeOptions = function () {
        $scope.objGenNew.options.mode = $scope.objGenNew.options.mode == 'tree' ? 'code' : 'tree';
    };
    $scope.changeData = function () {
        $scope.objGenNew.data = "";
    };
    
	// modal calls 
	self.openNewSimulation = function(){
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;
		$scope.presentPage = "simulation";
		//self.newsim ={};
		//self.newsim = { "id":0, "eventDetailsList":[], "randomEvents": false, "simulationName":"", "simulationDescription":"", "simulationType":"EVENT", "eventDetailsId":0, "attackDetailsId":0, "count":1, "correctness":100, "status":"ENABLE", "scheduleDetails":{ "schedulerFlag":"FALSE", "cronExpression": "0 0/1 * 1/1 * ? *" }, "metaFields":[{"key": "log_device", "value": "default"},{"key": "log_type", "value": "default"},{"key": "index_name", "value": "technominds"},{"key": "company", "value": "tmcl"}], "multiLineDetails":{ "multiLineFlag":"FALSE", "multiLinePattern":{"negate":"TRUE", "match":"AFTER", "pattern":""} }, "simulationIP":{"type":"RANDOM IP","cidrValue":"","countryValue":"","range":{"fromIp":"","toIp":""}}, "simulationDate":{ "type":"REAL TIME","range": { "startDate" :"","endDate":""}, "relative": {"timeState":"", "timeFrame":0, "timeMetric":"", "eventCount":1}}};
		$scope.templateUrl = "logsimulation-newsimulation.html";
	}
	
	self.openSchedulers = function(){
		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		$scope.presentPage = "simulation";		
		$scope.templateUrl = "logsimulation-schedulers.html";
	}
	
	self.openOndemandGeneration = function(){
		$scope.showHomeButton = true;
		$scope.presentPage = "generation";		
		$scope.templateUrl = "logsimulation-ondemandGeneration.html";
	}
	
	self.openNewEventDetails = function(){		
			$scope.showHomeButton = false;
			$scope.showCreateEventButton = true;
			$scope.showUpdateEventButton = false;
			$scope.presentPage = "events"
			$scope.templateUrl_eventDetails = "logsimulation-neweventdetails.html";		
			self.newEventDetails = {"eventName":"", "eventType":"", "logType":"", "messageType":"", "osType":"", "formatType":"PLAIN", "template":"", "eventId":0};
	}
	
	self.openSavedEventDetails = function(){
		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		$scope.presentPage = "events";
		$scope.templateUrl_eventDetails = "logsimulation-savedeventdetails.html";
	}
	$scope.templateUrl_eventDetails = "logsimulation-savedeventdetails.html";
	
	self.openSavedFieldDetails = function() {
		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		$scope.presentPage = "fields";
		$scope.templateUrl = "logsimulation-savedfielddetails.html";
	}
	
	self.openSavedEventTypes = function() {
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;
		$scope.presentPage = "events";
		$scope.templateUrl = "logsimulation-savedeventtypes.html";
	}
	
	self.openSavedAttackDetails = function() {
		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		$scope.presentPage = "attacks";
		$scope.templateUrl = "logsimulation-savedattackdetails.html";
	}
	
	self.openNewAttackDetails = function() {
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;
		$scope.presentPage = "attacks"
		$scope.templateUrl = "logsimulation-newattackdetails.html";
	}

	self.openNewFieldModal = function(){
		$("#newFieldModal").modal();
	}
	self.openSettingsModal = function(){
		$("#settingsModal").modal();
	}
	
	self.openCronBuilder = function() {
		$("#cronModal").modal();
	}
	self.openMultiLineModal = function() {
		$("#multilineModal").modal();
	}
	self.openNewEventTypeForm = function() {
		$("#newEventTypeModal").modal();
	}
	self.openNewLogTypeForm = function() {
		$("#newLogTypeModal").modal();
	} 
	
	
	
	// 
	self.addMetaFieldRow = function(){
		self.newsim.metaFields.push({"key":"", "value":""});
	}
	self.defaultCronExpression = function() {
		self.newsim.scheduleDetails.cronExpression = "0 0/1 * 1/1 * ? *";
	}
	self.deleteMetaFieldRow = function(index){
		if(index!=0) {
            self.newsim.metaFields.splice(index,1);
        }
		
	}
	
	// Event Type Functions
	self.saveNewEventType = function(eventTypeName) {
		self.newEventType.eventTypeName = eventTypeName;
		if (self.newEventType.eventTypeName == '')	{
			  self.alertMessages.push({ type: 'alert-danger', msg: 'All fields are manditory' });
	    	   $timeout(function () {
				self.alertMessages.splice(0, 1);
			}, 2000);
		}
		else {
			logsimulationFactory.saveNewEventType(self.newEventType).then(function(response) {
				console.log(response.data);
				self.getSavedEventTypes();
				  self.alertMessages.push({ type: 'alert-success', msg: 'Successfully event saved' });
		    	   $timeout(function () {
					self.alertMessages.splice(0, 1);
				}, 2000);
				self.newEventType = {"eventTypeName":""};
			},function(err){
				  self.alertMessages.push({ type: 'alert-warning', msg: 'Unable to save event' });
		    	   $timeout(function () {
					self.alertMessages.splice(0, 1);
				}, 2000);
			})
		}		
	}
	self.getSavedEventTypes = function() {
		logsimulationFactory.getSavedEventTypes().then(function(response){
			console.log(response.data);
			console.table(response.data);
			self.eventTypes = response.data;
		})
	}
//	self.getSavedEventTypes();
	self.editEventTypeById = function(eventTypeId) {
		console.log(eventTypeId);
		self.openNewEventTypeForm();
		for(var i=0; i<self.eventTypes.length; i++) {
			if(self.eventTypes[i].eventTypeId == eventTypeId) {
				self.newEventType.eventTypeId = self.eventTypes[i].eventTypeId;
				self.newEventType.eventTypeName = self.eventTypes[i].eventTypeName;
				console.log("self.newEventType.eventTypeName: " +self.newEventType.eventTypeName);
				break;
			}
		}
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
	}
	
	self.deleteEventTypeById = function(id) {

		 $ngConfirm({ 
			 	animation: 'top',
			    closeAnimation: 'bottom',
			    theme: 'material',
	            title: 'Confirm!',
	            content: 'Do you want to delete Event Type ',
	            scope: $scope,
	            buttons: {
	                delete: {
	                    text: 'YES',
	                    btnClass: 'btn-danger',
	                    action: function(scope, button){
	              
	                    	logsimulationFactory.deleteEventTypeById(id).then(function(response){
									console.log(response.data);
									self.getSavedEventTypes();
									toastr.success("EventType was deleted successfully");
								},function(err){
									toastr.error("Unable to delete Event Type")
								});
								return true;
	                    }
	                },
	                close:function(scope, button){
	             }
		     }
	    }); 
	}
	
	// Log Type Functions
	self.openSavedLogTypes = function() {
		$scope.templateUrl = "logsimulation-savedlogtypes.html";
	}
	self.saveNewLogType = function(logName) {
		self.newLogType.logTypeName = logName;
		if (self.newLogType.logTypeName == '') {
			self.alertMessages.push({ type: 'alert-danger', msg: 'All fields are mandatory' });
	    	   $timeout(function () {
				self.alertMessages.splice(0, 1);
			}, 2000);
		}
		else {
			logsimulationFactory.saveNewLogType(self.newLogType).then(function(response) {
				console.log(response.data);
				self.getSavedLogTypes();
				self.alertMessages.push({ type: 'alert-success', msg: 'Successfully logtype saved' });
		    	   $timeout(function () {
					self.alertMessages.splice(0, 1);
				}, 2000);
				self.newLogType = {"logTypeName":""};
			},function(err){
				self.alertMessages.push({ type: 'alert-danger', msg: 'Unable to save logtype' });
		    	   $timeout(function () {
					self.alertMessages.splice(0, 1);
				}, 2000);
			})
		}	
	}
	self.getSavedLogTypes = function() {
		logsimulationFactory.getSavedLogTypes().then(function(response){
			console.log(response.data);
			self.logTypes = response.data;
		});
	};
	
//	self.getSavedLogTypes();
	self.editLogTypeById = function(logTypeId) {
		console.log(logTypeId);
		self.openNewLogTypeForm();
		for(var i=0; i<self.logTypes.length; i++) {
			if(self.logTypes[i].logTypeId == logTypeId) {
				self.newLogType.logTypeId = self.logTypes[i].logTypeId;
				self.newLogType.logTypeName = self.logTypes[i].logTypeName;
				console.log("self.newLogType.logTypeName: " +self.newLogType.logTypeName);
				break;
			}
		}
	}
	self.deleteLogTypeById = function(id) {
		
		 $ngConfirm({ 
			 	animation: 'top',
			    closeAnimation: 'bottom',
			    theme: 'material',
	            title: 'Confirm!',
	            content: 'Do you want to delete Log Type ',
	            scope: $scope,
	            buttons: {
	                delete: {
	                    text: 'YES',
	                    btnClass: 'btn-danger',
	                    action: function(scope, button){
	                    	
							logsimulationFactory.deleteLogTypeById(id).then(function(response){
								console.log(response.data);
								self.getSavedLogTypes();
								toastr.success("Log Type was deleted successfully");
							},function(err){
								toastr.error('Unable to delete Log Type' );
							});
							return true;
	                    }
	                },
	                close: function(scope, button){
	                }
	            }
		 });
	}
	
	// Event Details - functions
  self.subMenu=[];
	/*self.getSavedEventDetails = function() {
		logsimulationFactory.getSavedEventDetails().then(function(response){
			console.log(response.data);
			self.allEventDetails= response.data;
			for(var i=0; i<self.eventTypes.length;i++){
				for(var j=0;j<self.allEventDetails.length;j++){
					
					if(self.eventTypes[i].eventTypeId == self.allEventDetails[j].eventType){
						self.sample={eventName:self.eventTypes[i].eventTypeName,eventSubType:self.allEventDetails[j].eventName,id:self.eventTypes[i].eventTypeId};
						self.subMenu.push(self.sample);
						self.sample={eventName:'',eventSubType:'',id:''};
						break;
					}
				}
			}
			console.log(self.subMenu);
		})
	}*/
  self.getSavedEventDetails = function() {
	    self.subMenu.subjects = [];
		logsimulationFactory.getSavedEventDetails().then(function(response){
			console.log(response.data);
			self.allEventDetails= response.data;
			for(var i=0; i<self.eventTypes.length;i++){
				
				self.sample = [];
				for(var j=0;j<self.allEventDetails.length;j++){
					
					if(self.eventTypes[i].eventTypeId == self.allEventDetails[j].eventType){
						//self.sample={eventName:self.eventTypes[j].eventTypeName,eventSubType:self.allEventDetails[i].eventName,id:self.eventTypes[j].eventTypeId};
						self.sample.push({eventSubType:self.allEventDetails[j].eventName,eventId:self.allEventDetails[j].eventId});
                //self.subMenu.subjects.push(self.sample);
						//self.subMenu.push(self.sample);

						//self.sample={eventName:'',eventSubType:'',id:''};
						//break;
					}
				}
			//	self.subMenu.eventName = self.eventTypes[i].eventTypeName;

				self.subMenu.push({Id:self.eventTypes[i].eventTypeId,eventName:self.eventTypes[i].eventTypeName,subjects:self.sample});
			}
			console.log(self.subMenu);
		})
	}
//  self.getSavedEventDetails();
  self.editEventById = function(eventId){
		console.log(eventId);
		self.openNewEventDetails();

		$scope.showHomeButton = false
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
// self.newEventDetails = angular.copy($filter('filter')(self.allEventDetails, {eventId: eventId })[0]);
		for(var i=0; i<self.allEventDetails.length; i++) {
			if(self.allEventDetails[i].eventId == eventId) {
				self.newEventDetails = angular.copy(self.allEventDetails[i]);
				
				self.options = self.newEventDetails.template;
				self.data = JSON.parse(self.newEventDetails.template);
				$scope.obj.data = JSON.parse(self.newEventDetails.template);
				//console.log("self.newEventDetails: " + self.newEventDetails.eventType + " | " + self.newEventDetails.logType);
				break;
			}
		}
	}
	
	self.deleteEventById = function(id) {
		
		$ngConfirm({ 
		 	animation: 'top',
		    closeAnimation: 'bottom',
		    theme: 'material',
            title: 'Confirm!',
            content: 'Do you want to delete Event ',
            scope: $scope,
            buttons: {
                delete: {
                    text: 'YES',
                    btnClass: 'btn-danger',
                    action: function(scope, button){
						logsimulationFactory.deleteEventById(id).then(function(response){
							console.log(response.data);
							self.getSavedEventDetails();
							self.alertMessages.push({ type: 'alert-success', msg: 'Event Deleted successfully' });
					    	   $timeout(function () {
								self.alertMessages.splice(0, 1);
							}, 2000);
						},function(err){
							self.alertMessages.push({ type: 'alert-danger', msg: 'Unable to Delete Event' });
					    	   $timeout(function () {
								self.alertMessages.splice(0, 1);
							}, 2000);
						});
						return true;
                    }
                },
                close: function(scope, button){
                }
            }
		});
	}
	
	// event names - functions
	self.getEventNames = function() {
		logsimulationFactory.getEventNames().then(function(response){
			console.log(response.data);
			self.eventNames = response.data;
		})
	}
	
	// scheduled events - functions
	
	self.getScheduledSimulations = function() {
		logsimulationFactory.getScheduledSimulations().then(function(response){
			console.log(response.data);
				self.allSchedules = angular.copy(response.data);
				console.log(self.allSchedules);
				
		})
	}
	self.getScheduledSimulations();
	

	
	
    self.ondemandSimulation = function(){
    
        if(self.newsim.simulationName == undefined || self.newsim.simulationName == '' || self.newsim.simulationDescription == undefined || self.newsim.simulationDescription== ''
            || self.newsim.simulationType == undefined || self.newsim.simulationType == '' || self.newsim.status == undefined || self.newsim.status == '' || self.newsim.count== undefined || self.newsim.count == ''){
    	   self.alertMessages.push({ type: 'alert-danger', msg: 'Please fill the highlited fields' });
    	   $(".selectize-control.single .selectize-input").addClass('border-danger');
    	   $timeout(function () {
			self.alertMessages.splice(0, 1);
		}, 2000);
        }
        else{
            self.newsim.eventDetailsId = parseInt(self.newsim.eventDetailsId);
            console.log(self.newsim);
           
            logsimulationFactory.ondemandSimulation(self.newsim).then(function(response){
            	console.log(response.data.status);
            	
 
                console.log(response.data);
 self.alertMessages.push({ type: 'alert-success', msg: ' Simulation Queued Successfully' });
        	   $timeout(function () {
    			self.alertMessages.splice(0, 1);
    		}, 2000);
            })
            
        }
    }
     
    self.ondemandScheduleSimulation = function(id) {
    	
//    	alert(id + " | make toaster msg => Queued Simulation");
    	for(var i=0; i<self.allSchedules.length; i++) {
			if(self.allSchedules[i].id == id) {
				self.newsim = angular.copy(self.allSchedules[i]);
				console.log("self.newsim: " + self.newsim);
				break;
			}
		}
    	logsimulationFactory.ondemandSimulation(self.newsim).then(function(response){
            console.log(response.data);
            self.alertMessages.push({ type: 'alert-success', msg: ' Simulation Queued Successfully' });
//        	self.alertMessages.push({ type: 'error', msg: 'All fields are manditory' });
    	   $timeout(function () {
			self.alertMessages.splice(0, 1);
		}, 2000);
           
        })
    }
    
	self.scheduleSimulation = function(){
		console.log(self.newsim);
		if(self.newsim.simulationName == undefined || self.newsim.simulationName == '' || self.newsim.simulationDescription == undefined || self.newsim.simulationDescription== ''
            || self.newsim.simulationType == undefined || self.newsim.simulationType == '' || self.newsim.status == undefined || self.newsim.status == '' || self.newsim.count== undefined || self.newsim.count == ''){
			self.alertMessages.push({ type: 'alert-danger', msg: 'All fields are manditory' });
	    	   $timeout(function () {
				self.alertMessages.splice(0, 1);
			}, 2000);
		} else {
			block();
			logsimulationFactory.scheduleSimulation(self.newsim).then(function(response){
				console.log(response.data);
				self.getScheduledSimulations();
				unBlock();
				self.alertMessages.push({ type: 'alert-success', msg: 'Simulation Scheduled Successfully' });
		    	   $timeout(function () {
					self.alertMessages.splice(0, 1);
				}, 2000);
			})
		}
		
	}
	
	self.changeScheduledSimulation = function(id, status) {
		for(var i=0; i<self.allSchedules.length; i++) {
			if(self.allSchedules[i].id == id) {
				self.newsim = angular.copy(self.allSchedules[i]);
				self.newsim.status = status;
				console.log("self.newsim: " + self.newsim);
				break;
			}
		}
		logsimulationFactory.scheduleSimulation(self.newsim).then(function(response){
			console.log(response.data);
			self.getScheduledSimulations();
		})
	}
	
	self.saveNewEventDetails = function(){
		
		console.log(self.newEventDetails);
		if(self.newEventDetails.formatType == "JSON") {
			self.newEventDetails.template = JSON.stringify($scope.obj.data);
		}
		if (self.newEventDetails.eventName == '' || self.newEventDetails.eventType == '' || self.newEventDetails.logType == '' ||  self.newEventDetails.osType == '' || self.newEventDetails.formatType == '' || self.newEventDetails.template == ''
			||self.newEventDetails.eventName == undefined || self.newEventDetails.eventType == undefined || self.newEventDetails.logType == undefined ||  self.newEventDetails.osType == undefined || self.newEventDetails.formatType == undefined || self.newEventDetails.template == undefined)	{
			
        	self.alertMessages.push({ type: 'alert-danger', msg: 'Please fill the highlited fields' });
        	$(".selectize-input.items.has-options.not-full").addClass('border-danger');
     	   $timeout(function () {
 			self.alertMessages.splice(0, 1);
 		}, 2000);
		}
		else {
			block();
			logsimulationFactory.saveNewEventDetails(self.newEventDetails).then(function(response) {
				$scope.showHomeButton = true;
				$scope.showCreateEventButton = false;
				$scope.showUpdateEventButton = false;
				$scope.presentPage = "events";
				$scope.templateUrl_eventDetails = "logsimulation-savedeventdetails.html";
				self.getSavedEventDetails();
                self.alertMessages.push({ type: 'alert-success', msg: 'Successfully added event' });
                
          	   $timeout(function () {
      			self.alertMessages.splice(0, 1);
      		}, 2000);
          	 
				self.newEventDetails = {"eventName":"", "eventType":"", "logType":"", "messageType":"", "osType":"", "formatType":"PLAIN", "template":""};
				unBlock();
				self.newEvent.$setPristine();
			},function(err){
				unBlock();
				self.alertMessages.push({ type: 'alert-warning', msg: 'Unable to create event' });

           	   $timeout(function () {
       			self.alertMessages.splice(0, 1);
       		}, 2000);
			})
		}
	}
	
	self.getAllSavedFields = function() {
		logsimulationFactory.getAllSavedFields().then(function(response){
			console.log(response.data);
			self.allSavedFields = response.data;
		})
	}
	
	self.editSimulationById = function(id) {
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
		self.openNewSimulation();
		for(var i=0; i<self.allSchedules.length; i++) {
			if(self.allSchedules[i].id == id) {
				angular.copy(self.allSchedules[i], self.newsim);
				break;
			}
		}
	}
	
	self.deleteSimulationById = function(id) {
		
		 $ngConfirm({ 
			 	animation: 'top',
			    closeAnimation: 'bottom',
			    theme: 'material',
	            title: 'Confirm!',
	            content: 'Do you want to delete simulation',
	            scope: $scope,
	            buttons: {
	                delete: {
	                    text: 'YES',
	                    btnClass: 'btn-danger',
	                    action: function(scope, button){
							logsimulationFactory.deleteSimulationById(id).then(function(response){
								console.log(response.data);
								self.getScheduledSimulations();
								self.alertMessages.push({ type: 'alert-success', msg: 'Scheduled Event Deleted' });
								 $timeout(function () {
						      			self.alertMessages.splice(0, 1);
						      		}, 2000);

							},function(err){
								self.alertMessages.push({ type: 'alert-warning', msg: 'Unable to delete Scheduled Event' });
								 $timeout(function () {
						      			self.alertMessages.splice(0, 1);
						      		}, 2000);
							});
							return true;
						}
	                },
	                close: function(scope, button){
	                }
	            }
		 	});                
	}
	
	self.saveNewFieldDetails = function() {
		console.log(self.newField);
		if (self.newField.fieldName == '' || self.newField.fieldValue == ''||
				self.newField.fieldName == undefined || self.newField.fieldValue == undefined) {
			self.alertMessages.push({ type: 'alert-danger', msg: 'All fields are manditory' });

	    	   $timeout(function () {
				self.alertMessages.splice(0, 1);
			}, 2000);
		}
		else{
			logsimulationFactory.saveNewField(self.newField).then(function(response){
				console.log(response.data);
				self.getAllSavedFields();
				self.alertMessages.push({ type: 'alert-success', msg: 'Successfully fields Added' });

		    	   $timeout(function () {
					self.alertMessages.splice(0, 1);
				}, 2000);
				self.newField = {"fieldName":"", "fieldValue":""};
			},function(err){
				self.alertMessages.push({ type: 'alert-warning', msg: 'Warnings' });

		    	   $timeout(function () {
					self.alertMessages.splice(0, 1);
				}, 2000);
			})	
		}	
	}
//	self.getAllSavedFields();
	self.editFieldById = function(id) {
		self.openNewFieldModal();
		console.log(id);
		for(var i=0; i<self.allSavedFields.length; i++) {
			if(self.allSavedFields[i].id == id) {
				self.newField = angular.copy(self.allSavedFields[i]);
				console.log(self.newField);
//				self.openNewFieldDetails();
				break;
			}
		}
	}
	
	self.deleteFieldById = function(id){
		console.log(id);
		$ngConfirm({ 
		 	animation: 'top',
		    closeAnimation: 'bottom',
		    theme: 'material',
            title: 'Confirm!',
            content: 'Do you want to delete Field',
            scope: $scope,
            buttons: {
                delete: {
                    text: 'YES',
                    btnClass: 'btn-danger',
                    action: function(scope, button){
						
						logsimulationFactory.deleteFieldById(id).then(function(response){
							console.log(response.data);
							self.getAllSavedFields();
							self.alertMessages.push({ type: 'alert-success', msg: 'Successfully fields are deleted' });
							 $timeout(function () {
									self.alertMessages.splice(0, 1);
								}, 2000);
						},function(err){
							self.alertMessages.push({ type: 'alert-warning', msg: 'Unable to delete fields' });
							 $timeout(function () {
									self.alertMessages.splice(0, 1);
								}, 2000);
						});
						return true;
					}
                },
                close: function(scope, button){
                }
            }
	 	}); 
	}
	
	self.addEvent = function() {
		self.newAttackDetails.eventDetails.push({"selectEvent":0, "timeFrame":0, "timeMetric":"MINS", "eventCount":1});
	}
	self.removeEvent = function(index){
		self.newAttackDetails.eventDetails.splice(index,1);
	}
	
	self.getAllSavedAttacks = function() {
		logsimulationFactory.getAllSavedAttacks().then(function(response){
			console.log(response.data);
			self.allSavedAttacks = response.data;
			console.log(self.allSavedAttacks);
		})
	}
	self.getAllSavedAttacks();
	
	
	//lone options 
	
	self.cloneEventDetails = function(data){
		console.log(data);
		$scope.showHomeButton = false
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
		$scope.templateUrl_eventDetails="logsimulation-neweventdetails.html"
		self.newEventDetails = angular.copy(data);
//		self.newEventDetails.delete("logType");
		delete self.newEventDetails.eventId;
		console.log(self.newEventDetails)
		self.options = self.newEventDetails.template;
		self.data = JSON.parse(self.newEventDetails.template);
		$scope.obj.data = JSON.parse(self.newEventDetails.template);
	}
	
	self.cloneSimulationDetails = function(data){
			$scope.showHomeButton = false;
			$scope.showCreateEventButton = false;
			$scope.showUpdateEventButton = true;
			self.openNewSimulation();
			self.newsim = angular.copy(data);
			delete self.newsim.id;		
	}
	
	self.cloneAttackDetails = function(data){
		$scope.showHomeButton = false
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
		$scope.templateUrl = "logsimulation-newattackdetails.html";
		self.newAttackDetails = angular.copy(data);
		delete self.newAttackDetails.attackId;
	}
	self.cloneFieldDetails = function(data){
		self.openNewFieldModal();
			self.newField = angular.copy(data);
			delete self.newField.id;
			console.log(self.newField);
	}
	
	self.saveNewAttackDetails = function() {
		if (self.newAttackDetails.attackName == '' || self.newAttackDetails.eventDetails == ''||
				self.newAttackDetails.attackName == undefined || self.newAttackDetails.eventDetails == undefined){
			 self.alertMessages.push({ type: 'alert-danger', msg: 'All fields are manditory' });
	    	   $timeout(function () {
				self.alertMessages.splice(0, 1);
			}, 2000);
		}
		else {
			console.log("newAttackDetails: " + Object.entries(self.newAttackDetails));
			for(var i=0; i<self.newAttackDetails.eventDetails.length; i++) {
				self.newAttackDetails.eventDetails[i].selectEvent = parseInt(self.newAttackDetails.eventDetails[i].selectEvent);
			}
			logsimulationFactory.saveNewAttack(self.newAttackDetails).then(function(response){
				console.log(response.data);
				self.getAllSavedAttacks();
				 self.alertMessages.push({ type: 'alert-success', msg: 'Successfully Added' });
				 $timeout(function () {
						self.alertMessages.splice(0, 1);
					}, 2000);
				self.newAttackDetails = {"attackName":"", "eventDetails":[]}
			},function(err){
				self.alertMessages.push({ type: 'alert-danger', msg: 'Error Creating Attack' });
				 $timeout(function () {
						self.alertMessages.splice(0, 1);
					}, 2000);
			})
		}	
	}
	
	self.editAttackById = function(attackId) {
		$scope.showHomeButton = false
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = true;
		for(var i=0; i<self.allSavedAttacks.length; i++) {
			if(self.allSavedAttacks[i].attackId == attackId) {
				self.newAttackDetails = angular.copy(self.allSavedAttacks[i]);
				$scope.templateUrl = "logsimulation-newattackdetails.html";
				break;
			}
		}
	}
	
//	self.getAllSavedAttacks();
	
	self.allEventDetails=[];
self.addAttack=function(id){
		
		angular.forEach(self.allEventDetails, function(value, key) {
			  if(id.eventId===value.eventId){
			  	//angular.forEach(id.subjects, function(value1, key1) {
			  		var obj={};
			  		//self.attackesName=value.eventId+'';
				  obj.selectEvent = value.eventId;
				  
			  	//});
				self.newAttackDetails.eventDetails.push(obj);  
			  }
		});
	}
$scope.deleteEvent = function (index) {
	self.newAttackDetails.eventDetails.splice(index, 1);
}
	
	self.deleteAttackById = function(id) {
		console.log(id);
		$ngConfirm({ 
		 	animation: 'top',
		    closeAnimation: 'bottom',
		    theme: 'material',
            title: 'Confirm!',
            content: 'Do you want to delete Attack',
            scope: $scope,
            buttons: {
                delete: {
                    text: 'YES',
                    btnClass: 'btn-danger',
                    action: function(scope, button){
						logsimulationFactory.deleteAttackById(id).then(function(response){
							console.log(response.data);
							self.getAllSavedAttacks();
							self.alertMessages.push({ type: 'alert-success', msg: 'Attack Deleted successfully' });
					    	   $timeout(function () {
								self.alertMessages.splice(0, 1);
							}, 2000);
						},function(err){
							self.alertMessages.push({ type: 'alert-success', msg: 'Unable to Delete Attack' });
					    	   $timeout(function () {
								self.alertMessages.splice(0, 1);
							}, 2000);
						});
                        return true; 
                    }
                },
                close: function(scope, button){
                }
            }
        });
	}
	
	
	$(function() {

	    var start = moment().subtract(29, 'days');
	    var end = moment();

	    function cb(start, end) {
	    	self.newsim.simulationDate.range.startDate=start.format('YYYY-MM-DDTHH:mm:ss.sssZ');
	    	self.newsim.simulationDate.range.endDate = end.format('YYYY-MM-DDTHH:mm:ss.sssZ');
	        $('input[name="datetimesFrom"]').html(start.format('YYYY-MM-DDTHH:mm:ss.sssZ') + ' - ' + end.format('YYYY-MM-DDTHH:mm:ss.sssZ'));
	    }

	    $('input[name="datetimesFrom"]').daterangepicker({
	    	parentEl: "#randomTimeModal .modal-body",
	        startDate: start,
	        timePicker: true,
	        endDate: end,
	        opens: "left",
	        locale: {
	            format: 'YYYY-MM-DDTHH:mm:ss.sssZ'
	          },
	        ranges: {
	        	
	           'Today': [moment(), moment()],
	           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
	           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	           'This Month': [moment().startOf('month'), moment().endOf('month')],
	           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	        }
	    }, cb);

	    cb(start, end);

	});
	
	
	self.loadSimulationPage = function(){
		self.getSavedEventDetails();
		self.getScheduledSimulations();
		$scope.showHomeButton = true;
	}
	
	self.loadEventDetailsPage = function(){
		self.getSavedEventDetails();
		self.getSavedLogTypes();
		self.getSavedEventTypes();
		$scope.showHomeButton = true;
	}
	
	self.loadAttackDetailsPage = function(){
		self.getAllSavedAttacks();
		self.getSavedLogTypes();
		self.getSavedEventTypes();
		self.getSavedEventDetails();
		$scope.showHomeButton = true;
		$scope.templateUrl = 'logsimulation-savedattackdetails.html'
	}
	
	self.loadFieldDetailsPage = function(){
		$scope.showHomeButton = true;
		self.getAllSavedFields();
		$scope.templateUrl = 'logsimulation-savedfielddetails.html';		
	}
	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withFixedHeader({
		
    }).withOption('order', [1, 'asc'])
    .withOption('lengthMenu', [25,50, 100, 150, 200]);
	
	
    
	//Selectize configurations
	 self.eventTypeConfig = {
	    maxItems: 1,
	    optgroupField: 'class',
	  	labelField: 'eventTypeName',
	  	searchField: ['eventTypeName'],
	  	valueField: 'eventTypeId',
	  	create: function(value,silent){
	  		self.saveNewEventType(value);
	  		return true;
	  	},onChange: function(value) {
			if(value == undefined && $scope.formRule.$submitted){					
				$(".selectize-control.single .selectize-input").addClass('border-danger');
			}else{
				$(".selectize-input.items.ng-valid.has-options.border-danger.ng-dirty.full.has-items").removeClass('border-danger');
			}
		}
	  };
	
	 
	 self.logTypeConfig  = {
			 maxItems: 1,
			    optgroupField: 'class',
			  	labelField: 'logTypeName',
			  	searchField: ['logTypeName'],
			  	valueField: 'logTypeId',
			  	create: function(value,silent){
			  		self.saveNewLogType(value);
			  		return true;
			  	},onChange: function(value) {
					if(value == undefined && $scope.formRule.$submitted){					
						$(".selectize-control.single .selectize-input").addClass('border-danger');
					}else{
						$(".selectize-input.items.ng-valid.has-options.border-danger.ng-dirty.full.has-items").removeClass('border-danger');
					}
	    		}
	 }
	 
	 
	 self.ruleNameConfig  = {
			 maxItems: 1,
			    optgroupField: 'class',
			  	labelField: 'correlationName',
			  	searchField: ['correlationName'],
			  	valueField: 'correlationName'
	 }
	 
	 
	 self.eventNameConfig = {
			 maxItems : 1,
			 optgroupField : 'class',
			 labelField : 'eventName',
			 searchField : ['eventName'],
			 valueField : 'eventId',
			 create : false,
			 onChange: function(value) {
				if(value == undefined && $scope.simulation.$submitted){					
					$(".selectize-control.single .selectize-input").addClass('border-danger');
				}else{
					$(".selectize-input.items.ng-valid.has-options.border-danger.ng-dirty.full.has-items").removeClass('border-danger');
				}
	    	}
	 }
	 
	 
	 self.attackNameConfig = {
			 maxItems : 1,
			 optgroupField : 'class',
			 labelField : 'attackName',
			 searchField : ['attackName'],
			 valueField : 'attackId',
			 create : false,
			 onChange: function(value) {
					if(value == undefined && $scope.simulation.$submitted){					
						$(".selectize-control.single .selectize-input").addClass('border-danger');
					}else{
						$(".selectize-input.items.ng-valid.has-options.border-danger.ng-dirty.full.has-items").removeClass('border-danger');
					}
		    	}
	 }
	 
	 
	 self.historyBack = function(){
		 window.history.back();
	 }
	 
	 
    
}]);
app.filter('cartypefilter', function() {
	return function(items, search) {
		if (!search) {
			return items;
		}

		var carType = search;
		if (!carType || '' === carType) {
			return items;
		}
		var object = new Object();
		angular.forEach(items, function(value, key){
			for(var i=0;i<value.length;i++){
				if(value[i].conditionName.indexOf(search)!=-1){
					value[i].expanded = true;
					object[key] = items[key];
				}
			}
		});
		return object;

	};
	
});
