app.controller("conditionController", ['$scope', 'conditionFactory','$rootScope','$timeout','$uibModal','conditionCategoryFactory','conditionCategoryFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder' ,'conditionTypeFactory','$ngConfirm','$window','tagService','fieldExtractorFactory',function ($scope, conditionFactory,$rootScope, $timeout,$uibModal,conditionCategoryFactory,conditionCategoryFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,conditionTypeFactory,$ngConfirm,$window,tagService,fieldExtractorFactory) {

	var self = this;

	$rootScope.$broadcast('changeThemeToNormal');
	$scope.rule = {};

	self.elasticseachFields = [];

	self.lookupdetails = [];

	self.tags ;

	self.category = {categoryId:"",categoryName:"",categoryType:"category",operationType:"insert",subCategoryId:0};



	self.condition = {id:0,conditionName:"",filterQuery:"",lookupTablesFields:"",categoryId:"",description:"",reportingFields:'',conditionActualQuery:'',operationType:'',displayFilter:'',tags:''};
	self.reportingFields = [];
	$scope.fields =[];
	self.alertMessagaes =[];
	self.conditionMessages =[];
	self.selectFields = [];

	$scope.canCreateCondition = false;
	$scope.canDeleteCondition = false;
	$scope.canEditCondition = false;
	$scope.canCreateType = false;
	$scope.canCreateCategory = false;
	$scope.showCreateEventButton = false;
	$scope.showUpdateEventButton = false;
	$scope.showHomeButton = true;

	$scope.fieldData = {logType:'',logDevice:'',eventCategory:''};


	self.filterBasedOnEventCategory = function(){
		self.filterConditions  = [];
		
		if(!$scope.fieldData.logType){
			$scope.fieldData.logType = '';
		}
		
		if($scope.fieldData.eventCategory!='' && $scope.fieldData.logDevice!='' && $scope.fieldData.logType!=''){
			for(var i=0;i<self.conditionDetails.length;i++){
				if(self.conditionDetails[i].categoryName === $scope.fieldData.eventCategory && self.conditionDetails[i].logDevice === $scope.fieldData.logDevice && self.conditionDetails[i].logType === $scope.fieldData.logType ){
					self.filterConditions.push(self.conditionDetails[i]);
				}
			}
		}else if($scope.fieldData.eventCategory!='' && $scope.fieldData.logDevice === '' && $scope.fieldData.logType!=''){
			for(var i=0;i<self.conditionDetails.length;i++){
				if(self.conditionDetails[i].categoryName === $scope.fieldData.eventCategory  && self.conditionDetails[i].logType === $scope.fieldData.logType ){
					self.filterConditions.push(self.conditionDetails[i]);
				}
			}
		}else if($scope.fieldData.eventCategory!='' && $scope.fieldData.logDevice === '' && $scope.fieldData.logType===''){
			for(var i=0;i<self.conditionDetails.length;i++){
				if(self.conditionDetails[i].categoryName === $scope.fieldData.eventCategory){
					self.filterConditions.push(self.conditionDetails[i]);
				}
			}
		}else{
			self.filterConditions = self.conditionDetails;
		}

	}
	
	self.filterBasedOnEventLogDevice = function(){
		self.filterConditions  = [];
		
		if(!$scope.fieldData.logType){
			$scope.fieldData.logType = '';
		}
		
		if($scope.fieldData.eventCategory!='' && $scope.fieldData.logDevice!='' && $scope.fieldData.logType.length!=0){
			for(var i=0;i<self.conditionDetails.length;i++){
				if(self.conditionDetails[i].categoryName === $scope.fieldData.eventCategory && self.conditionDetails[i].logDevice === $scope.fieldData.logDevice && self.conditionDetails[i].logType === $scope.fieldData.logType ){
					self.filterConditions.push(self.conditionDetails[i]);
				}
			}
		}else if($scope.fieldData.eventCategory!='' && $scope.fieldData.logDevice === '' && $scope.fieldData.logType!=''){
			for(var i=0;i<self.conditionDetails.length;i++){
				if(self.conditionDetails[i].categoryName === $scope.fieldData.eventCategory  && self.conditionDetails[i].logType === $scope.fieldData.logType ){
					self.filterConditions.push(self.conditionDetails[i]);
				}
			}
		}else if($scope.fieldData.eventCategory!='' && $scope.fieldData.logDevice === '' && $scope.fieldData.logType===''){
			for(var i=0;i<self.conditionDetails.length;i++){
				if(self.conditionDetails[i].categoryName === $scope.fieldData.eventCategory){
					self.filterConditions.push(self.conditionDetails[i]);
				}
			}
		}else if($scope.fieldData.eventCategory!='' && $scope.fieldData.logDevice!=''){
			for(var i=0;i<self.conditionDetails.length;i++){
				if(self.conditionDetails[i].categoryName === $scope.fieldData.eventCategory && self.conditionDetails[i].logDevice === $scope.fieldData.logDevice){
					self.filterConditions.push(self.conditionDetails[i]);
				}
			}
		}else{
			self.filterConditions = self.conditionDetails;
		}

	}

	self.getDataBasedOnLogDevice = function(){
		fieldExtractorFactory.getLogTypes($scope.fieldData.logDevice).then(function(response) {
			$scope.logType = response.data;
			self.filterBasedOnEventLogDevice();

		}, function(err) {
			console.log(err);
		});
	}

	self.getDataBasedOnLogType = function(){

	}


	self.loadPermissions = function(){

		loader("body");

		conditionFactory.loadPermissions().then(function (response){

			if(response.data.indexOf("add events")!=-1){
				$scope.canCreateCondition = true;
			}

			if(response.data.indexOf("update events")!=-1){
				$scope.canEditCondition = true;
			}
			if(response.data.indexOf("delete events")!=-1){
				$scope.canDeleteCondition = true;
			}
			if(response.data.indexOf("add category")!=-1){
				$scope.canCreateCategory = true;
			}

			unloader("body");

			fieldExtractorFactory.getLogDevices().then(function(response) {
				$scope.logDevices = response.data;
				//$scope.fieldData.logType = $scope.logTypes[0];
				//self.getDataBasedOnLogType();

			}, function(err) {
				console.log(err);
			});


		},function(error){
			unloader("body");
		});
	}

	self.operationType = "";

	self.loadTags = function(){
		tagService.getTags().then(function(response){
			self.tagDetails = response.data;

		});
	}

	self.loadTags();

	self.saveCategory = function(value){
		loader("body");
		self.category.categoryType = "Event";
		self.category.operationType = "insert";
		self.category.categoryName = value;
		conditionCategoryFactory.saveConditionCategroy(self.category).then(function (response) {

			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Condition was created successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
				self.loadConditionCategoryDetails();
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
				}

				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
			unloader("body");
		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}else if(error.status== 500){
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to create Category. Category Name should be unique.' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		});
	}

	self.conditionTypedata = {type :'' ,typeName : ''};



	self.loadSubCategoryDetails = function(){


		conditionCategoryFactory.getConditionSubCategories().then(function(response){

			self.conditionSubCategories = response.data;
		},function(Err){
			unloader("body");
		});
	}

	self.loadSubCategoryDetails();

	self.saveCustomType = function(){
		self.conditionTypedata.type="condition";
		if(self.condition.categoryType == '' ||self.condition.categoryType === undefined){

			self.conditionMessages.push({ type: 'danger', msg: 'Please enter all the values' });
			$timeout(function () {
				self.conditionMessages.splice(0, 1);
			}, 2000);
		}else{

			loader("body");
			conditionTypeFactory.saveConditionType(self.condition.categoryType).then(function(response){

				if(response.data.status){
					self.loadRuleTypes();
					$("#conditionType").modal('hide');

					self.conditionMessages.push({ type: 'success', msg: 'Condition was created successfully' });
					$timeout(function () {
						self.conditionMessages.pop();
					}, 2000);

					self.getAllType();
				}else{
					self.conditionMessages.push({ type: 'danger', msg: "unable to create condition reason : "+response.data.error});
					if(response.data.errors){
						for(var i=0;i<response.data.errors.length;i++){

							self.conditionMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
						}
					}else{
						self.conditionMessages.push({ type: 'danger', msg: response.data.data });
					}


					$timeout(function () {
						self.conditionMessages.splice(0, 1);
					}, 2000);
				}
				unloader("body");
			},function(err){
				unloader("body");
			});
		}
	}

	self.conditionType=[];



	self.loadRuleTypes = function(){
		conditionTypeFactory.getAllTypes().then(
				function(response){
//					console.log(response.data)
					var tempCategories = [];
					for(var i=0;i<response.data.length;i++){
						if(response.data[i].type == 'condition'){
							tempCategories.push(response.data[i]);
						}
					}
					self.conditionType = tempCategories;
				},function(Err){
					unloader("body");
				});


	}
	self.loadRuleTypes();
	self.loadPermissions();

	self.addFiled = function(){
		self.lookupdetails.push({elasticseachFields:'',displayName:'',logType:''});
	}

	self.addReportingFields = function(){
		self.reportingFields.push({elasticseachFields:'',displayName:'',logType:''});
	}

	self.deleteRow  = function(index){
		self.lookupdetails.splice(index, 1);
	}
	self.deleteReportingFeilds  = function(index){
		self.reportingFields.splice(index, 1);
	}


	self.elasticsearchFields = [];

	$scope.templateUrl = "viewCategories.html"

		self.openCreateCategoryPage = function(){
		self.condition = {id:0,conditionName:"",filterQuery:"",lookupTablesFields:"",categoryId:"",description:"",reportingFields:'',conditionActualQuery:"",operationType:'insert'};
		self.reportingFields = [];
		self.lookupdetails = [];

		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;
		$scope.showHomeButton = false;

		var data = '{"group": {"operator": "AND","rules": []}}';
		$scope.filter = JSON.parse(data);
		$scope.templateUrl = "createCategory.html"
			self.buttonName="Insert";
		self.loadConditionCategoryDetails();

	}

	self.goBack = function(){
		$scope.templateUrl = "viewCategories.html";
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
		$scope.showHomeButton = true;
//		self.loadAllConditions();

	}

	self.loadConditionCategoryDetails = function(){
		conditionCategoryFactory.getConditionCategories().then(function (response){
			self.customTypes=[];
			var tempCategories = [];
			for(var i=0;i<response.data.length;i++){
				if(response.data[i].categoryType==='Event'){
					tempCategories.push(response.data[i]);
				}
			}
			self.conditionCategories = tempCategories;
		},function(error){
			unloader("body");
		});
	}



	$scope.elasticBuilderData = {};
	$scope.elasticBuilderData.query = [];
	$scope.elasticBuilderData.fields = {};

	self.saveFilter = function(){

		self.condition.filterQuery = $scope.output;
		var tempFilter = $scope.output;
		self.condition.displayFilter = tempFilter;
		self.elasticseachFields = [];
		$scope.elasticBuilderData.query  = []
		$scope.elasticBuilderData.needsUpdate = true;
		$("#filterModal").modal('hide');
		//console.log(self.condition.filterQuery);
		self.addLookUpFields($scope.filter.group);
		self.condition.conditionActualQuery =  JSON.stringify($scope.filter);

	}

	self.addLookUpFields = function(group){
		var temp =[];
		for(var i=0;i<group.rules.length;i++){
			if(!(group.rules[i].hasOwnProperty("group")) && (!(group.rules[i].field == undefined)) && (!(group.rules[i].logType == undefined))){
				temp.push({elasticseachFields:group.rules[i].field.name,displayName:group.rules[i].field.name,logType:group.rules[i].logType});
			}else if(group.rules[i].hasOwnProperty("group")){
				self.addLookUpFields(group.rules[i].group);
			}
		}


		for(var i=0;i<temp.length;i++){
			var flag = false;
			for(var j=0;j<self.lookupdetails.length;j++){
				if(self.lookupdetails[j].elasticseachFields == temp[i].elasticseachFields){
					var flag = true;
					break;
				}
			}
			if(!flag){				
				self.lookupdetails.push(temp[i]);
			}
		}

		self.clone();
	}


	$scope.navigation = function(navigationUrl){
		window.location.href = navigationUrl;
	}

	conditionFactory.getAllFieldsForIndex('compaylogofmlrzgmvgamzofwqsrh').then(function(response){
		self.logTypes = response.data.logTypes;
		self.elasticsearchFields = response.data.elasticsearchFields;
	});

	self.getGetFileds = function(index){
		getFieldsBasedOnLogType(self.lookupdetails[index].logType)
	}

	self.getFieldsForReporting = function(index){
		getFieldsBasedOnLogType(self.reportingFields[index].logType)
	}

	self.openFilterForm = function(){

		$("#filterModal").modal();
	}

	self.conditionDetails = {};

	
	self.loadAllConditions = function(){
		conditionFactory.getAllConditions().then(function (response){
			self.conditionDetails = angular.copy(response.data);
			
			self.filterConditions = self.conditionDetails;


		},function(error){
			console.log(error);
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}


	self.cloneConditionDetails = function(id){
		for(var i = 0; i < self.conditionDetails.length; i++){
			if(self.conditionDetails[i].id === id) {
				self.condition = angular.copy(self.conditionDetails[i]);
				$scope.showCreateEventButton = false;
				$scope.showUpdateEventButton = true;
				$scope.showHomeButton = false;

				//    self.elasticseachFields = self.condition.lookupTablesFields.split(",");
				self.lookupdetails = [];
				self.reportingFields = [];
				self.condition.filterQuery = self.conditionDetails[i].filterQuery;
				if(!self.conditionDetails[i].displayFilter){
					self.condition.displayFilter = self.conditionDetails[i].filterQuery;
				}else{
					self.condition.displayFilter = self.conditionDetails[i].displayFilter;
				}


				angular.forEach(self.condition.fields, function(value, key) {
					self.lookupdetails.push({elasticseachFields:value.elasticseachFields,displayName:value.displayName,logType:value.logType});
				});

				angular.forEach(self.condition.reportingFields, function(value, key) {
					console.log(key + ': ' + value);

					self.reportingFields.push({elasticseachFields:value.elasticseachFields,displayName:value.displayName,logType:value.logType});
				});
				if(self.conditionDetails[i].conditionActualQuery!='NA'){
					$scope.filter = JSON.parse(self.conditionDetails[i].conditionActualQuery);
				}
				self.condition.id = '';
				var temp = self.condition.conditionName;
				if(temp.startsWith('Clone_')){
					self.condition.conditionName = angular.copy("Clone "+(parseInt(temp.split(" ")[1])+1)+" "+temp.replace('Clone '+parseInt(temp.split(" ")[1])+' ',''));
				}else{
					self.condition.conditionName = angular.copy("Clone 1 "+temp);
				}


				$scope.templateUrl = "createCategory.html";
				self.condition.operationType =  "insert";
				self.loadConditionCategoryDetails();

				break;
			}
		}
		self.buttonName="Save";
	}

	self.clone = function(){
		self.reportingFields = angular.copy(self.lookupdetails);
	}



	self.openConditionForm = function(){
		$("#createCondition").modal();
		self.category = {categoryName:''};
		self.conditionMessages = [];
	}

	self.openConditionType = function(){
		$("#conditionType").modal();
	}


	function getFieldsBasedOnLogType(logType){
		conditionFactory.getFieldsBasedOnLogType(logType).then(function (response){
			self.elasticsearchFields = response.data.elasticsearchFields;
		},function(data){

		});
	}


	self.submitData = function(){
		var tempArray = [];
		var selectFileds = self.selectFields.unique();
		for(var i=0;i<selectFileds.length;i++){
			if(selectFileds[i]!=""){
				tempArray.push(selectFileds[i]);
			}

		}
		//self.condition.lookupTablesFields = self.elasticseachFields.join(',');
		if(self.lookupdetails.length==0){
			self.condition.lookupTablesFields ="";
		}else{
			self.condition.lookupTablesFields = JSON.stringify(self.lookupdetails);
		}

		if(self.reportingFields.length==0){
			self.condition.reportingFields = "";
		}else{

			self.condition.reportingFields = JSON.stringify(self.reportingFields);

		}



		self.condition.selectFileds = tempArray.join(",");
		if(self.condition.conditionActualQuery == "" || self.condition.conditionName == "" || self.condition.description == ""  || self.condition.filterQuery == ""  ){ 

			self.alertMessagaes.push({ type: 'danger', msg: 'All fields are mandatory' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 3000);

		}else{
			let flag=true;
			var regex = new RegExp("^[A-Za-z0-9- ]+$"); 	
			if(!regex.test(self.condition.conditionName)){
				self.alertMessagaes.push({ type: 'danger', msg: 'Special charectors not allowed' });
				flag=false;
				$timeout(function () {
					self.alertMessagaes = [];
				}, 3000);
			} else if(self.lookupdetails.length == 0){
				self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the all fields in condition tab' });
				flag=false;
				$timeout(function () {
					self.alertMessagaes = [];
				}, 3000);
			}else if(self.reportingFields.length == 0){
				self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the all fields in reporting tab' });
				flag=false;
				$timeout(function () {
					self.alertMessagaes = [];
				}, 3000);
			}
			if(flag){
				for(var i=0;i<self.lookupdetails.length;i++){
					if(self.lookupdetails[i].displayName == "" || self.lookupdetails[i].elasticseachFields == "" || self.lookupdetails[i].logType == ""){
						self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the all fields in Events tab' });
						flag=false;
						break;
						$timeout(function () {
							self.alertMessagaes = [];
						}, 3000);
					}

					if(!regex.test(self.lookupdetails[i].displayName)){
						self.alertMessagaes.push({ type: 'danger', msg: 'Special charectors not allowed for name' });
						flag=false;
						break;
						$timeout(function () {
							self.alertMessagaes = [];
						}, 3000);
					}
				}

				for(var i=0;i<self.reportingFields.length;i++){
					if(self.reportingFields[i].displayName == "" || self.reportingFields[i].elasticseachFields == "" || self.reportingFields[i].logType == ""){
						self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the all fields in Reporting tab' });
						flag=false;
						break;
						$timeout(function () {
							self.alertMessagaes = [];
						}, 3000);
					}

					if(!regex.test(self.reportingFields[i].displayName)){
						self.alertMessagaes.push({ type: 'danger', msg: 'Special charectors not allowed for name' });
						flag=false;
						break;
						$timeout(function () {
							self.alertMessagaes = [];
						}, 3000);
					}
				}
			}

			if(flag){
				loader("body");

				self.condition.tags = self.tags.join(',');

				conditionFactory.saveCondition(self.condition).then(function (response) {
					if(response.data.status){

						self.alertMessagaes.push({ type: 'success', msg: 'Event was created successfully' });
						self.loadAllConditions();
						$scope.showCreateEventButton = false;
						$scope.showUpdateEventButton = false;
						$scope.showHomeButton = true;

						$scope.templateUrl = "viewCategories.html";

						$timeout(function () {
							self.alertMessagaes = [];
						}, 2000);
					}else{

						if(response.data.errors){
							for(var i=0;i<response.data.errors.length;i++){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
							}
						}else{
							self.alertMessagaes.push({ type: 'danger', msg: response.data.data });

						}
						$timeout(function () {
							self.alertMessagaes = [];
						}, 2000);
					}


					unloader("body");
				}, function (error) {
					unloader("body");

					self.alertMessagaes.push({ type: 'success', msg: 'Unable to create Condition. Filter name should be unique.' });
				});
			}	
		}

	}


	self.editCondition = function(id){
		self.loadConditionCategoryDetails();
		for(var i = 0; i < self.conditionDetails.length; i++){
			if(self.conditionDetails[i].id === id) {
				self.condition = angular.copy(self.conditionDetails[i]);
				if(self.conditionDetails[i].tags){
					self.tags = self.conditionDetails[i].tags.split(",");
				}

				console.log(self.condition);
				$scope.showCreateEventButton = false;
				$scope.showUpdateEventButton = true;
				$scope.showHomeButton = false;

				//	self.elasticseachFields = self.condition.lookupTablesFields.split(",");
				self.lookupdetails = [];
				self.reportingFields = [];
				self.condition.filterQuery = self.conditionDetails[i].filterQuery;
				if(!self.conditionDetails[i].displayFilter){
					self.condition.displayFilter = self.conditionDetails[i].filterQuery;
				}else{
					self.condition.displayFilter = self.conditionDetails[i].displayFilter;
				}


				angular.forEach(self.condition.fields, function(value, key) {
					self.lookupdetails.push({elasticseachFields:value.elasticseachFields,displayName:value.displayName,logType:value.logType});
				});

				angular.forEach(self.condition.reportingFields, function(value, key) {

					self.reportingFields.push({elasticseachFields:value.elasticseachFields,displayName:value.displayName,logType:value.logType});
				});
				if(self.conditionDetails[i].conditionActualQuery!='NA'){
					$scope.filter = JSON.parse(self.conditionDetails[i].conditionActualQuery);
				}


				// self.lookupdetails = JSON.pars(self.condition.fields);
				//$scope.elasticBuilderData.query  = JSON.parse(self.condition.filterQuery);
				//$scope.elasticBuilderData.needsUpdate = true;
				$scope.templateUrl = "createCategory.html";
				self.condition.operationType =  "update";
				console.log(self.condition);
				break;
			}
		}
		self.buttonName="Update";
	}

	function dispaly() {
		$('.select-size-xs').select2();
	}

	self.editRestoreFilter = function(){
		console.log("editRestoreFilter::" + alertId_edit);
		for(var i = 0; i < self.editfilter.length; i++){
			if(self.editfilter[i].id === alertId_edit) {
				self.condition = angular.copy(self.editfilter[i]);

				break;
			}
		}
	}

	self.deleteCondition = function(alertId,alertName){


		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+alertName+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						conditionFactory.deleteCondition(alertId).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Condition was deleted successfully' });
								//toastr.success("Condition was deleted successfully")
								self.loadAllConditions();
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							if(!response.data.status){
								self.alertMessagaes.push({ type: 'danger', msg: response.data.message });
								//toastr.success("Condition was deleted successfully")

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							unloader("body");

						}, function (error) {
							unloader("body");
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}

							$timeout(function () {
								self.alertMessagaes.splice(0, 1);
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

	var data = '{"group": {"operator": "AND","rules": []}}';

	function htmlEntities(str) {
		return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function computed(group) {
		if (!group) return "";
		for (var str = "(", i = 0; i < group.rules.length; i++) {
			i > 0 && (str += " " + group.operator + " ");
			if(group.rules[i].group){
				str += computed(group.rules[i].group);
			}else{
				if(group.rules[i].field.name){
					if( group.rules[i].field.name.indexOf(".") > -1){
						if(group.rules[i].condition === "%%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.name.split(".")[1] + " " + " like '%" + group.rules[i].data+"%'";

						}else if(group.rules[i].condition === "_%") {
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.name.split(".")[1] + " " + " like '" + group.rules[i].data+"%'";
						}else if(group.rules[i].condition === "%_"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.name.split(".")[1] + " " + " like '%" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.name.split(".")[1] + "  = "  + " '" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.name.split(".")[1] + "  != "  + " '" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"column_in("+group.rules[i].field.name.split(".")[1] + " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "not_in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"notin("+group.rules[i].field.name.split(".")[1] + " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "ip_range" && group.rules[i].fromIP && group.rules[i].toIP ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"iprange("+group.rules[i].field.name.split(".")[1] + " , '"+group.rules[i].fromIP+"','"+group.rules[i].toIP+"')";
						}
						else if(group.rules[i].condition === "time_range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"time_range("+group.rules[i].field.name.split(".")[1] + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"range("+group.rules[i].field.name.split(".")[1] + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "threat_matcher" && group.rules[i].numberOfSources){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"threat_matcher("+group.rules[i].field.name.split(".")[1] + " , '"  + group.rules[i].numberOfSources+"')";
						}
						//range


					}else{
						if(group.rules[i].condition === "%%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"LCASE(event_data['"+group.rules[i].field.name +"']) like '%" + group.rules[i].data.toLowerCase()+"%'";
						}
						else if(group.rules[i].condition === "_%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"LCASE(event_data['"+group.rules[i].field.name +"']) like '" + group.rules[i].data.toLowerCase()+"%'";
						}
						else if(group.rules[i].condition === "%_"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"LCASE(event_data['"+group.rules[i].field.name +"']) like '%" + group.rules[i].data.toLowerCase()+"'";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"LCASE(event_data['"+group.rules[i].field.name +"']) like '%" + group.rules[i].data.toLowerCase()+"%'";
						}else if(group.rules[i].condition === "in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"column_in("+group.rules[i].field.name+ " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "not_in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"notin("+group.rules[i].field.name+ " , '"  + group.rules[i].data+"')";

						}
						else if(group.rules[i].condition === "ip_range" && group.rules[i].fromIP && group.rules[i].toIP ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :

										"iprange("+group.rules[i].field.name+ " , '"+group.rules[i].fromIP+"','"+group.rules[i].toIP+"')";
						}
						else if(group.rules[i].condition === "time_range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"timerange("+group.rules[i].field.name+", '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"range("+group.rules[i].field.name+ " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}

						else if(group.rules[i].condition === "threat_matcher" && group.rules[i].numberOfSources){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"threat_matcher("+group.rules[i].field.name + " , '"+group.rules[i].numberOfSources+"')";
						}

					}
				}

			}
		}

		return str + ")";
	}

	$scope.addToLookupFields = function(elasticField,topic){
		if(!(topic == undefined || elasticField == undefined || topic == '' || elasticField == '')){
			if(self.lookupdetails.length > 0){
				for(var i=0;i<self.lookupdetails.length;i++){
					if(!(angular.equals(self.lookupdetails[i].elasticseachFields,elasticField))){
						self.lookupdetails.push({elasticseachFields:elasticField,displayName:elasticField,logType:topic});
					}
				}
			}else{
				self.lookupdetails.push({elasticseachFields:elasticField,displayName:elasticField,logType:topic});
			}
		}
	}
	$scope.json = null;

	$scope.filter = JSON.parse(data);

	$scope.$watch('filter', function (newValue) {
		$scope.json = JSON.stringify(newValue, null, 2);
		$scope.output = computed(newValue.group);
		for(var i=0;i<newValue.group.rules.length;i++){
			if(self.selectFields.indexOf(newValue.group.rules[i].field)==-1){
				if(newValue.group.rules[i].hasOwnProperty("field").hasOwnProperty("name")){
					if( newValue.group.rules[i].field.name.indexOf(".") > -1){
						self.selectFields.push(newValue.group.rules[i].field.name.split(".")[0]);
					}else{
						self.selectFields.push(newValue.group.rules[i].field.name);
					}
				}
			}
		}
	}, true);

	self.eventTypeConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'typeName',
			searchField: ['typeName'],
			valueField: 'typeName',
			create: function(value,silent){
				self.saveCustomType(value);
				return true;	
			},
	};

	self.saveTags = function(){

		tagService.saveTags(self.tag).then(function (response) {
			if(response.data.status){
				self.conditionMessagesModal.push({ type: 'success', msg: 'Subcategor  was Created Successfully' });
				$timeout(function () {
					self.conditionMessagesModal.splice(0, 1);
					$("#createNewTag").modal('hide');
				},3000);

				self.loadAllTags();
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


	self.tag = {id:0,tagName:""}

	self.tagConfig = {

			optgroupField: 'class',
			labelField: 'tagName',
			searchField: ['tagName'],
			valueField: 'tagName',
			create: function(value,silent){
				self.tag.tagName = value;
				self.saveTags(self.tag);
				self.tagDetails.push({id:0,tagName:value})

				return true;	
			},
	};


	self.conditionCategoryConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'categoryName',
			searchField: ['categoryName'],
			valueField: 'categoryId',
			create: function(value,silent){
				self.saveCategory(value);

				return true;	
			},
	}

	self.conditionSubCategoryConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'name',
			searchField: ['name'],
			valueField: 'id',
			create: function(value,silent){
				self.saveSubCategory(value);
				return true;	
			},
	}

	self.conditionSubCategory = {id:0,name:""}

	self.saveSubCategory = function(value){
		self.conditionSubCategory.name = value;

		conditionCategoryFactory.saveConditionCategory(self.conditionSubCategory).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Condition was created successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);

				},3000);

				self.loadSubCategoryDetails();
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
				}else{
					self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
				}
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}


		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);

			}else{
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);

			}

		});

	}

	self.historyBack = function(){
		$window.history.back();
	}

}]);


Array.prototype.unique = function() {
	return this.filter(function (value, index, self) { 
		return self.indexOf(value) === index;
	});
}
