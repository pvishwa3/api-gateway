var ruleScope;

var groupIndex = 0 ;

var conditionIndex = 0;

app.controller("ruleController", ['$scope', 'conditionFactory','$rootScope','$timeout','$uibModal','corrleationFactory','conditionCategoryFactory','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','conditionTypeFactory', '$ngConfirm','$filter','miterFactory','$window',function ($scope, conditionFactory,$rootScope, $timeout,$uibModal,corrleationFactory,conditionCategoryFactory,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,conditionTypeFactory,$ngConfirm,$filter,miterFactory,$window) {

	$rootScope.$broadcast('changeThemeToNormal');
	var self = this;

	
	
	ruleScope = $scope;
	
	$scope.groupIndex = 0;
	
	self.active = false;
	self.conditions = [];
	self.perviousCondition =[];
	$scope.currentConditions = {};
	self.filterConditios = [];
	self.finalFilterConditions = {};
	self.alertMessagaes =[];
	
	self.currentEvents = [];

	self.operationType = "";
	var dataTable ;
	self.conditionMessages =[];
	self.category = {categoryName:''};

	$scope.showHomeButton = true;
	$scope.showCreateEventButton = false;
	$scope.showUpdateEventButton = false;

	self.conditionForms = {correlationId:'',correlationName:'',correlationDescription:'',ruleCategory:'',conditions:[],rulePriority:'',oldcorrelationName:'',categoryType:'',tatic:'',technique:'',leveOfCoverage:'',analyticType:''};

	self.compliance = "none";
	self.ruleCategory = {ruleCategoryName:''};
	$scope.dtInstance = {};
	$scope.templateUrl = "rule.html";
	$scope.fields = [];

	$scope.finalConditions = [];
	
	
	
	self.conditions = [];

	self.nextPage = function(){
		$scope.templateUrl = "ruleDetails.html";
		self.operationType = "insert";
		self.conditionForms = {correlationId:'',correlationName:'',correlationDescription:'',ruleCategory:'',conditions:[],rulePriority:'',categoryType:''};
		self.conditions = [];
		self.alertMessagaes =[];
		self.loadTopic();

		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;

		
		
		angular.forEach(self.conditionDetails,function(value,key){
			for(var i=0;i<value.length;i++){
				$scope.finalConditions.push(value[i]);
				self.conditions.push(value[i].conditionName);

				value[i]['checked'] = false;
			}
		});
//		var value = self.conditionDetails;
//		Object.keys(self.conditionDetails).forEach(function(key) {
//		var values = self.conditionDetails[key];
//		for(var i =0;i<values.length;i++){
//		values[i].expanded = false;
//		}
//		})


	}

	self.canCreateRule = false;
	self.canUpdateRule = false;
	self.canDeleteRule = false;

	self.loadPermissions = function(){

		corrleationFactory.loadPermissions().then(function (response) {
			if(response.data.indexOf("add rules")!=-1){
				self.canCreateRule = true;
			}
			if(response.data.indexOf("update rules")!=-1){
				self.canUpdateRule = true;
			}

			if(response.data.indexOf("delete rules")!=-1){
				self.canDeleteRule = true;
			}



		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

	}

	self.loadPermissions();

	self.openConditionForm = function(){
		$("#createCondition").modal();
		self.category = {categoryName:''};
		self.conditionMessages = [];


		toastr.clear();
	}




	var format = function ( d ) {
		// `d` is the original data object for the row

		var ruleName = d[1];
		var str = [];
		for(var i=0;i<self.ruleDetails.length;i++){
			if(self.ruleDetails[i].correlationName===ruleName){

				str.push("<table class='innerTable'>");
				str.push("<tbody>")
				str.push("<tr>")

				str.push("<td class='rowExpanded' style='border-top:none;border-right:transparent'>")
				str.push("<div class='dt-container'> ")

				str.push("<div class='dt-title'>")
				str.push("Description")

				str.push("</div>")

				str.push("<div class='dt-data'>")
				str.push(self.ruleDetails[i].correlationDesc)

				str.push("</div>")

				str.push("</div> ")

				str.push("</td>")

				str.push("<td class='rowExpanded' style='border-top:none;border-right:transparent'>")
				str.push("<div class='dt-container'> ")

				str.push("<div class='dt-title'>")
				str.push("Assoicated Events")

				str.push("</div>")

				str.push("<div class='dt-data'>")
				str.push(self.ruleDetails[i].correlationName)
//				str.push("An unusual event or trend has been detected that could indicate the presence of a threat or misconfiguration. Malicious actors often hide their activity by piggybacking onto benign and normal payload/protocol traffic.")

				str.push("</div>")

				str.push("</div> ")

				str.push("</td>")

				str.push("<td class='rowExpanded' style='border-top:none;border-right:transparent'> ")
				str.push("<div class='dt-container'> ")

				str.push("<div class='dt-title'>")
				str.push("Strategy description")

				str.push("</div>")

				str.push("<div class='dt-data'>")
				str.push(self.ruleDetails[i].correlationDesc)
//				str.push("An unusual event or trend has been detected that could indicate the presence of a threat or misconfiguration. Malicious actors often hide their activity by piggybacking onto benign and normal payload/protocol traffic.")

				str.push("</div>")

				str.push("</div> ")

				str.push("</td>")

				str.push("</tbody>")
				str.push("</tr>")

				str.push("</table>")
			}

		}




		return str.join(" ");
	}


	$scope.expandRow = function(data){
		if(!data.expanded){
			data["expanded"] = true;
		}else{
			data["expanded"] = false;
		}
	}

	$('body').on('click', '.details-control', function() {
		var tr = $(this).closest('tr');
		var row =$scope.vm.dtInstance.DataTable.row( tr );
		if ( row.child.isShown() ) {
			// This row is already open - close it
			row.child.hide();
			tr.find("#i").addClass('ion-plus-circled');
			tr.find("#i").removeClass('ion-minus-circled');
		} else {
			// Open this row
			row.child( format(row.data()) ).show();
			tr.find("#i").addClass('ion-minus-circled');
			tr.find("#i").removeClass('ion-plus-circled');

		}
	})  

	self.openTypeForm = function(){
		$("#createType").modal();
		self.type = {typeName:''};

		toastr.clear();
	}

	self.category = {categoryName:'',categoryType:''};
	self.saveCategory = function(value){
		loader("body");;
		self.category.categoryType = "rule";
		self.category.categoryName = value;
		conditionCategoryFactory.saveConditionCategroy(self.category).then(function (response) {

			if(response.data.status){
				$("#createCondition").modal('hide');
				self.conditionMessages.push({ type: 'success', msg: "Condition category was created successfully" });
				self.loadConditionCategoryDetails();
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){
						self.conditionMessages.push({ type: 'danger', msg: response.data.errors[i].defaultMessage});
					}
				}else{
					self.conditionMessages.push({ type: 'danger', msg:response.data.data});
				}
			}
			unloader("body");;
		},function(error){
			unloader("body");;
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	};

	self.ruleTypedata={type:'',typeName:''};

	self.saveRuleType = function(name){


		self.ruleTypedata.type="rule";
		self.ruleTypedata.typeName=name;
		if(self.ruleTypedata.typeName == '' ||self.ruleTypedata.typeName === undefined){
			self.conditionMessages.push({ type: 'danger', msg: "please enter all the values" });
			$timeout(function () {
				self.conditionMessages.splice(0, 1);
			}, 2000);
		}else{
			loader("body");;
			conditionTypeFactory.saveConditionType(self.ruleTypedata).then(function(response){
				if(response.data.status){
					self.conditionForms.categoryType = name;
					self.loadRuleTypes();

					//self.getAllType();
				}else{
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
				unloader("body");;
			},function(error){
				unloader("body");;
				if(error.status== 403){
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
				}
			});
		}
	}





	self.loadConditionCategoryDetails = function(){
		loader("body");
		conditionCategoryFactory.getConditionCategories().then(function (response){
			unloader("body");
			var tempCategories = [];
			for(var i=0;i<response.data.length;i++){
				if(response.data[i].categoryType==='Rule'){
					tempCategories.push(response.data[i]);
				}
				self.conditionCategories = tempCategories;
			}
		},function(error){
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}
	self.ruleType=[];

	self.loadRuleTypes = function(){

		conditionTypeFactory.getAllTypes().then(
				function(response){
//					console.log(response.data)
					var tempCategories = [];
					for(var i=0;i<response.data.length;i++){
						if(response.data[i].type == 'rule'){
							tempCategories.push(response.data[i]);
						}
					}
					self.ruleType = tempCategories;
//					console.log(self.ruleType)
				},function(error){
					unloader("body");;
					if(error.status== 403){
						self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
						$timeout(function () {
							self.alertMessagaes = [];
						}, 2000);
					}
				});


	}
	self.loadRuleTypes();





	self.openRuleCategoryForm = function(){
		self.ruleCategory = {ruleCategoryName:''};
		$("#filterModal").modal();
	}

	self.back = function(){
		$scope.templateUrl = "rule.html";

		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;

	}

	self.addCondition = function(condition){

		for(var i=0;i<self.conditions.length;i++){
			if(self.conditions[i].conditionName === condition ){
				self.alertMessagaes.push({ type: 'danger', msg: 'Condition Already exists' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
				return false;
			}

		}
		if(self.conditions.length>0){
			condition.displayCorrelation = true;
		}else{
			condition.displayCorrelation = false;
		}



		
		



		console.log(condition);
		self.conditions.push(condition);

	}

	self.expandChilds = function(key1,value1){
		angular.forEach(self.conditionDetails,function(value,key){
			if(!(angular.equals(value,value1))){
				for(var i=0;i<value.length;i++){					
					value[i].expanded = false;
				}
			}
		});
		for(var i=0;i<value1.length;i++){
			if(value1[i].expanded){
				value1[i].expanded = false;
			}else{
				value1[i].expanded = true;
			}
		}
	}



	self.tagTransform = function (newTag) {
		var item = {

				ruleCategoryName: newTag.toLowerCase(),

		};

		return item;
	};




	self.loadTopic = function(){
		corrleationFactory.getAllTopics().then(function (response) {
			$scope.topics = response.data;
		},function(error){
			unloader("body");;
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}




	self.loadAllCorrelationDetails = function(){
		corrleationFactory.getAllCorrelationDetails().then(function (response) {

			self.ruleDetails = response.data.tableData;
		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});;
	}
	self.loadConditionCategoryDetails();
	self.loadAllCorrelationDetails();


	self.ruleAlertMessagaes = [];
	self.ruleCondition  ="";
	self.existingConditions = [];
	self.openFilterForm = function(condition){

		var isExists = false;

		if(self.existingConditions.length!=0){
			for(var i=0;i<self.existingConditions.length;i++){
				if(condition.conditionId===self.existingConditions[i].conditionId){
					if(self.existingConditions[i].actualQuery){
						isExists = true;
						$scope.filter = JSON.parse(self.existingConditions[i].actualQuery);
					}

				}
			}
		}
		if(!isExists){
			var data = '{"group": {"operator": "AND","rules": []}}';
			$scope.filter = JSON.parse(data);
		}

		$scope.filter.fields = [];

		angular.forEach(condition.fields, function(value, key) {
			$scope.filter.fields.push({name:key,value:value});
		});

		self.ruleCondition  = condition;
		$("#filterModal").modal();
	}

	self.openFieldFilterForm = function(field,condition){
		var isExists = false;

		if(self.existingConditions.length!=0){
			for(var i=0;i<self.existingConditions.length;i++){
				if(condition.conditionId===self.existingConditions[i].conditionId){
					if(self.existingConditions[i].actualQuery){
						isExists = true;
						$scope.filter = JSON.parse(self.existingConditions[i].actualQuery);
					}

				}
			}
		}
		if(!isExists){
			var data = '{"group": {"operator": "AND","rules": []}}';
			$scope.filter = JSON.parse(data);
		}

		$scope.filter.fields = [];

		angular.forEach(condition.fields, function(value, key) {
			$scope.filter.fields.push({name:key,value:value});
		});

		self.ruleCondition  = condition;
		$("#filterModal").modal();
	}



	self.showFilters = function (condition){	


		if(condition.showFilter){
			condition.showFilter = false;
		}else{
			var isExists = false;

			if(condition.actualQuery){
				isExists = true;
				$scope.filter = JSON.parse(condition.actualQuery);
			}

			if(!isExists){

				//var data = '{"group": {"operator": "AND","rules": [{"condition":":","field":"","data":""}]}}';
				var data = '{"group": {"operator": "AND","rules": [{"condition":":","field":"","data":""}]}}';

				$scope.filter = JSON.parse(data);
			}

			$scope.filter.fields = [];

			angular.forEach(condition.fields, function(value, key) {
				$scope.filter.fields.push({name:key,value:value});
			});

			self.ruleCondition  = condition;

			condition.showFilter = true;

		}
		self.colseRemainingFilters(condition.conditionId);
	}

	self.colseRemainingFilters = function(conditionId){
		for(var i=0;i<self.conditions.length;i++){
			if(self.conditions[i].conditionId!=conditionId){
				self.conditions[i].showFilter = false;
			}
		}
	}


	self.displayForEdit = function(ruleName){
		$(".fixedHeader-floating").hide();
		self.compliance = "none";
		self.conditions = [];
		self.existingConditions = [];
		self.categoryType={typeName:''}
		self.rulecategoryType ={categoryName:''}
		for(var i=0;i<self.ruleDetails.length;i++){
			if(self.ruleDetails[i].correlationName === ruleName){
				self.operationType = "update";
				self.conditionForms =angular.copy(self.ruleDetails[i]);
				self.rulecategoryType={categoryName:self.ruleDetails[i].ruleCategory};
				loader("body");
				corrleationFactory.getRuleNameBasedOnName(ruleName).then(function (response) {
					self.conditionForms.correlationName = response.data.tableData[0].corrleationName;
					self.conditionForms.oldcorrelationName = response.data.tableData[0].corrleationName;
					self.conditionForms.correlationDescription = response.data.tableData[0].correlationDescription;
					self.conditionForms.rulePriority = response.data.tableData[0].rulePriority;
					self.conditionForms.tatic = response.data.tableData[0].tatic;
					self.conditionForms.technique = response.data.tableData[0].technique;
					if(!(self.conditionForms.tatic  == undefined || self.conditionForms.tatic  == "")) {
						self.compliance = "miter";
					}
					self.loadTechniques();

					self.conditionForms.leveOfCoverage = response.data.tableData[0].leveOfCoverage;
					self.conditionForms.analyticType = response.data.tableData[0].analyticType;
					self.categoryType={typeName:response.data.tableData[0].categoryType};

					unloader("body");
					for(var i=0;i<response.data.tableData.length;i++){

						var tempArray = [];

						var existingFields = [];

						for(var j=0;j<response.data.tableData[i].aggergationField.split(",").length;j++){
							existingFields.push({"fieldName":response.data.tableData[i].aggergationField.split(",")[j]});
						}

						Object.keys(response.data.tableData[i].fields).forEach(key => {

							tempArray.push({"fieldName":key});


							//use key and value here
						});

						if(i>0){
							self.conditions.push({aggergationType:response.data.tableData[i].aggergationType,aggTempFiled:existingFields,operator:response.data.tableData[i].operator,value:response.data.tableData[i].value,timeType:response.data.tableData[i].timeType,timeValue:response.data.tableData[i].timeValue,description:response.data.tableData[i].conditionDesc,displayCorrelation:true,fields:tempArray,conditionId:response.data.tableData[i].conditionId})
						}else{
							self.conditions.push({aggergationType:response.data.tableData[i].aggergationType,aggTempFiled:existingFields,operator:response.data.tableData[i].operator,value:response.data.tableData[i].value,timeType:response.data.tableData[i].timeType,timeValue:response.data.tableData[i].timeValue,description:response.data.tableData[i].conditionDesc,displayCorrelation:false,fields:tempArray,conditionId:response.data.tableData[i].conditionId})
						}

						angular.forEach(self.conditionDetails, function(value, key) {
							for(var j=0;j<value.length;j++){
								if(value[j].conditionId === response.data.tableData[i].conditionId){
									self.existingConditions.push({conditionId:value[j].conditionId,actualQuery:response.data.tableData[i].actualQuery});
								}
							}
						});
					}

					for(var i=0;i<response.data.tableData.length;i++){
						if(i+1<response.data.tableData.length) {
							self.filterConditios.push({currentConditionFields:response.data.tableData[i].mappingFields,perviousConditionFeilds:response.data.tableData[i+1].mappingFields})
						}
					}

					if(response.data.tableData[0].actualQuery){
						$scope.filter = JSON.parse(response.data.tableData[0].actualQuery);
						self.conditions[0].showFilter=true;
						console.log(self.condition);
					}

				},function(error){
					unloader("body");
					if(error.status== 403){
						self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
						$timeout(function () {
							self.alertMessagaes = [];
						}, 2000);
					}
				});

				self.loadTopic();
				$scope.templateUrl = "ruleDetails.html";
				$scope.showHomeButton = false;
				$scope.showCreateEventButton = false;
				$scope.showUpdateEventButton = true;
			}
		}
	}

	self.loadAllTatics = function(){
		miterFactory.getAllTactics().then(function(response){

			self.miterDetails = response.data;

		});
	}
	self.loadAllTatics();


	self.loadTechniques = function(){

		self.techniques = [];

		for(var i=0;i<self.miterDetails.length;i++){
			if(self.miterDetails[i].tacticsName===self.conditionForms.tatic){
				self.techniques = self.miterDetails[i].techniquesDetails;
				break;
			}
		}
	}

	self.cloneRuleDetails = function(ruleName){
		self.conditions = [];
		self.compliance = "none";
		self.existingConditions = [];
		self.categoryType={typeName:''}
		self.rulecategoryType ={categoryName:''}
		for(var i=0;i<self.ruleDetails.length;i++){
			if(self.ruleDetails[i].correlationName === ruleName){
				self.operationType = "update";
				self.conditionForms =angular.copy(self.ruleDetails[i]);
				self.rulecategoryType={categoryName:self.ruleDetails[i].ruleCategory};
				loader("body");;
				corrleationFactory.getRuleNameBasedOnName(ruleName).then(function (response) {
					self.conditionForms.correlationName = response.data.tableData[0].corrleationName;
					self.conditionForms.oldcorrelationName = response.data.tableData[0].corrleationName;
					self.conditionForms.correlationDescription = response.data.tableData[0].correlationDescription;
					self.conditionForms.rulePriority = response.data.tableData[0].rulePriority;
					self.conditionForms.tatic = response.data.tableData[0].tatic;
					self.conditionForms.technique = response.data.tableData[0].technique;
					if(!(self.conditionForms.tatic  == undefined || self.conditionForms.tatic  == "")){
						self.compliance = "miter";
					}
					self.loadTechniques();

					self.conditionForms.leveOfCoverage = response.data.tableData[0].leveOfCoverage;
					self.conditionForms.analyticType = response.data.tableData[0].analyticType;
					self.categoryType={typeName:response.data.tableData[0].categoryType};
					for(var i=0;i<response.data.tableData.length;i++){

						if(i>0){
							self.conditions.push({aggergationType:response.data.tableData[i].aggergationType,aggergationFiled:response.data.tableData[i].aggergationField,operator:response.data.tableData[i].operator,value:response.data.tableData[i].value,timeType:response.data.tableData[i].timeType,timeValue:response.data.tableData[i].timeValue,description:response.data.tableData[i].conditionDesc,displayCorrelation:true,fields:response.data.tableData[i].fields,conditionId:response.data.tableData[i].conditionId})
						}else{
							self.conditions.push({aggergationType:response.data.tableData[i].aggergationType,aggergationFiled:response.data.tableData[i].aggergationField,operator:response.data.tableData[i].operator,value:response.data.tableData[i].value,timeType:response.data.tableData[i].timeType,timeValue:response.data.tableData[i].timeValue,description:response.data.tableData[i].conditionDesc,displayCorrelation:false,fields:response.data.tableData[i].fields,conditionId:response.data.tableData[i].conditionId})
						}

						angular.forEach(self.conditionDetails, function(value, key) {
							for(var j=0;j<value.length;j++){
								if(value[j].conditionId === response.data.tableData[i].conditionId){
									self.existingConditions.push({conditionId:value[j].conditionId,actualQuery:response.data.tableData[i].actualQuery});
								}
							}
						});
					}

					for(var i=0;i<response.data.tableData.length;i++){
						if(i+1<response.data.tableData.length) {
							self.filterConditios.push({currentConditionFields:response.data.tableData[i].mappingFields,perviousConditionFeilds:response.data.tableData[i+1].mappingFields})
						}
					}

					if(response.data.tableData[0].actualQuery){
						$scope.filter = JSON.parse(response.data.tableData[0].actualQuery);
						self.conditions[0].showFilter=true;
						console.log(self.condition);
					}

					var temp = self.conditionForms.correlationName;
					if(temp.startsWith('Clone_')){
						self.conditionForms.correlationName = angular.copy("Clone_"+(parseInt(temp.split("_")[1])+1)+"_"+temp.replace('Clone_'+parseInt(temp.split("_")[1])+'_',''));
					}else{
						self.conditionForms.correlationName = angular.copy("Clone_1_"+temp);
					}

					unloader("body");;
				},function(error){
					unloader("body");;
					if(error.status== 403){
						self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
						$timeout(function () {
							self.alertMessagaes = [];
						}, 2000);
					}
				});

				self.loadTopic();
				$scope.templateUrl = "ruleDetails.html";
				$scope.showHomeButton = false;
				$scope.showCreateEventButton = false;
				$scope.showUpdateEventButton = true;
			}
		}

	}


	self.disableRule = function(correlationName,status){


		self.conditionForms.correlationName = correlationName;
		self.conditionForms.status = status;
		loader("body");;
		corrleationFactory.disableOrEnableLogs(self.conditionForms).then(function (response) {
			if(response.data.status){
				self.ruleAlertMessagaes.push({ type: 'success', msg: "Successfully "+ status + " rule " + correlationName});

				corrleationFactory.getAllCorrelationDetails().then(function (response) {
					self.ruleDetails = response.data.tableData;
				});

			}else{
				self.ruleAlertMessagaes.push({ type: 'danger', msg: "unable to create the rule category reason " + response.data.error });
			}

			$timeout(function () {
				self.ruleAlertMessagaes.splice(0, 1);
			}, 2000);

			unloader("body");;

		},function(error){
			unloader("body");;
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});

	}


	self.saveRuleCategory = function(){

		corrleationFactory.saveRuleCategory(self.ruleCategory).then(function (response) {
			if(response.data.status){
				self.ruleAlertMessagaes.push({ type: 'success', msg: "Rule Category was successfully created" });
				$("#filterModal").modal('hide');
				corrleationFactory.getRuleCategories().then(function (response) {
					self.ruleCategories = response.data;
				});


			}else{
				self.ruleAlertMessagaes.push({ type: 'danger', msg: "unable to create the rule category reason " + response.data.error });
			}

			$timeout(function () {
				self.ruleAlertMessagaes.splice(0, 1);
			}, 2000);

		},function(error){
			unloader("body");;
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});

	}

	$scope.addCorrleationForEvents = function(condition,index){
		if(self.operationType != "update"){
			self.perviousCondition = [];
			self.currentCondition = [];
			self.filterConditios = [];
		}
		self.perviousCondition.push(self.currentEvents[index-2]);
		self.currentCondition.push(condition);

		$("#correlationModal").modal()

		//console.log(self.perviousCondition);
	}

	self.updateCorrleation = function(condition){
		$("#correlationModal").modal();
	}
	self.removeFilter = function(index){
		self.filterConditios.splice(index, 1);
	}

	self.saveRuleQuery = function(){


		for(var i=0;i<self.conditions.length;i++){
			if(self.conditions[i].id === self.ruleCondition.id){
				self.conditions[i].additionalFilter =  $scope.output;
				self.conditions[i].actualQuery =  $scope.json
			}
		}

		$("#filterModal").modal('hide');


	}

	self.addFieldsToCorrelation = function(){
		$scope.flag= true;
		if(self.filterConditios.length > 0){
			for(var i=0;i<self.filterConditios.length;i++){

				if(self.filterConditios[i].currentConditionFields == undefined	 || self.filterConditios[i].perviousConditionFeilds == undefined ){
					$scope.flag = false;
					$scope.isError=true;
					$timeout(function () {
						$scope.isError=false;
					}, 2000);
				}
			}
//			console.log($scope.flag)
			if($scope.flag == true){
				var object = new Object();
				self.filterConditios.push(object);
			}

		}else{
			var object = new Object();
			self.filterConditios.push(object);
		}

		//filterConditios.push();
	}

	$scope.correlationConditions = "";

	self.saveMappings = function(previousConditionId,currentConditionId){
		for(var i=0;i<self.filterConditios.length;i++){
			if(self.filterConditios[i].currentConditionFields == undefined	 || self.filterConditios[i].perviousConditionFeilds == undefined ){
				$scope.isError=true;

				$timeout(function () {
					$scope.isError=false;
				}, 2000);
				return false;
			}
		}
		$('#correlationModal').modal('toggle');

		var previousConditionKeys = [];
		var currentConditionKeys = [];

		for(var i=0;i<self.filterConditios.length;i++){
			self.filterConditios[i]['perviousConditionId'] = previousConditionId;
			previousConditionKeys.push(self.filterConditios[i].perviousConditionFeilds)
			currentConditionKeys.push(self.filterConditios[i].currentConditionFields)
		}
		
		var corrleationFiels = "";
		
		for(var i=0;i<self.currentEvents.length;i++){
			var nextConditionIndex = i+1;
			if(self.currentEvents[i].conditionId===previousConditionId){
				self.currentEvents[i]['mappings'] = previousConditionKeys;
				
				if($scope.correlationConditions!=""){
					$scope.correlationConditions += " AND group"+groupIndex+".c"+i+"."+previousConditionKeys +" = " + "group"+groupIndex+".c"+nextConditionIndex+"."+currentConditionKeys;
				}else{
					$scope.correlationConditions += "group"+groupIndex+".c"+i+"."+previousConditionKeys +" = " + "group"+groupIndex+".c"+nextConditionIndex+"."+currentConditionKeys;
				}
				
				
			}
			if(self.currentEvents[i].conditionId===currentConditionId){
				self.currentEvents[i]['mappings'] = currentConditionKeys;
				corrleationFiels = groupIndex+"."+i+"."+previousConditionKeys;
			}
		}
		console.log($scope.correlationConditions)
		
	}

	self.deleteRule = function(ruleName){

		loader("body");
		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+ruleName+'</b> Type ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						corrleationFactory.deleteRules(ruleName).then(function (response) {
							if(response.data.status){
								self.ruleAlertMessagaes.push({ type: 'success', msg: 'Rule was deleted successfully' });

								corrleationFactory.getAllCorrelationDetails().then(function (response) {
									self.ruleDetails = response.data.tableData;
								});

								$timeout(function () {
									self.ruleAlertMessagaes.splice(0, 1);
								}, 3000);
							}else{
								self.ruleAlertMessagaes.push({ type: 'danger', msg: 'Unable to delete rule reason ' +response.data.error  });
								$timeout(function () {
									self.ruleAlertMessagaes.splice(0, 1);
								}, 3000);
							}
							unloader("body");;
						},function(error){
							unloader("body");;
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
						});
						return true; 
					}
				},
				close: function(scope, button){
					unloader("body")
				}
			}
		});

	}

	self.correlationData = function(){

		
		
		self.conditionForms.conditions = self.conditions;

		console.log($scope)
		
		if( self.conditionForms.correlationName == undefined || self.conditionForms.correlationName=='' ||self.conditionForms.correlationDescription==undefined||self.conditionForms.correlationDescription=='' || self.conditionForms.ruleCategory === '' || self.conditionForms.categoryType === ''){
			self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the highlighted fields' });
			$(".selectize-input.items.ng-valid.has-options.ng-pristine.not-full").addClass('border-danger');
			$(".selectize-input.items.ng-valid.has-options.border-danger.ng-dirty.full.has-items").removeClass('border-danger');
			$timeout(function () {
				self.alertMessagaes.splice(0, 1);
			}, 3000);

		}else{
			var flag=true;
			$(".selectize-control.single .selectize-input").removeClass('border-danger');
			if(self.conditionForms.conditions.length == 0){
				flag=false;
				self.alertMessagaes.push({ type: 'danger', msg: 'Please select atleast one condition.' });

				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 3000);
			}else{

				if(self.conditionForms.conditions.length>1){
					for(var i=1;i<self.conditionForms.conditions.length;i++){
						if(self.conditionForms.conditions[i].mappings == undefined || self.conditionForms.conditions[i].mappings.length==0){

							flag=false;
							self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the highlighted fields' });
							$timeout(function () {
								self.alertMessagaes.splice(0, 1);
							}, 3000);
							return false;
						}
					}
				}

				for(var i=0;i<self.conditionForms.conditions.length;i++){

					if(self.conditionForms.conditions[i].aggTempFiled == undefined){
						flag=false;
						self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the highlighted fields' });
						$timeout(function () {
							self.alertMessagaes.splice(0, 1);
						}, 3000);
					}


					if(self.conditionForms.conditions[i].aggergationType == undefined||self.conditionForms.conditions[i].aggergationType==''||self.conditionForms.conditions[i].operator==undefined||self.conditionForms.conditions[i].operator==''||
							self.conditionForms.conditions[i].value==undefined||self.conditionForms.conditions[i].value === ""||self.conditionForms.conditions[i].timeValue==undefined||self.conditionForms.conditions[i].timeValue==null||self.conditionForms.conditions[i].timeValue === ""||self.conditionForms.conditions[i].timeType==undefined||self.conditionForms.conditions[i].timeType==''){
						flag=false;
						self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the highlighted fields' });
						$timeout(function () {
							self.alertMessagaes.splice(0, 1);
						}, 3000);
					}

				}
			}

			if(self.compliance == "miter"){
				if(self.conditionForms.tatic == undefined || self.conditionForms.technique == undefined || self.conditionForms.leveOfCoverage == undefined || self.conditionForms.analyticType == undefined ||
						self.conditionForms.tatic == "" || self.conditionForms.technique == "" || self.conditionForms.leveOfCoverage == "" || self.conditionForms.analyticType == ""){
					flag = false;
					self.alertMessagaes.push({ type: 'danger', msg: 'Please fill the miter fields' });
					$timeout(function () {
						self.alertMessagaes.splice(0, 1);
					}, 3000);
				} 	
			}

			for(var i=0;i<self.conditionForms.conditions.length;i++){
				var tempFields = [];

				for(var j=0;j<self.conditionForms.conditions[i].aggTempFiled.length;j++){
					tempFields.push(self.conditionForms.conditions[i].aggTempFiled[j].fieldName);
				}
				self.conditionForms.conditions[i].aggergationFiled = tempFields.join(',')
			}
			if(flag == true){

				console.log(self.conditionForms)

				if(self.operationType==="insert"){
					self.createRule();
				}else{
					self.updateRule();
				}
			} 
		}
	}

	self.createRule = function(){

		//console.log(self.conditionForms)
		loader("body");;
		corrleationFactory.saveCorrleation(self.conditionForms).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Rule was created successful' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 3000);
				self.loadAllCorrelationDetails();
				self.back();
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to create rule reason ' +response.data.error  });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 3000);
				//self.loadAllCorrelationDetails();
			}
			unloader("body");
		},function(error){
			unloader("body");;
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.openEventModal = function(){
		$('#addCondition').modal('toggle');
	};



	self.updateRule = function(){
		loader("body");;
		corrleationFactory.updateCorrleation(self.conditionForms).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Rule was created successful' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 3000);
				self.loadAllCorrelationDetails();
				self.back();
			}else{
				self.alertMessagaes.push({ type: 'danger', msg: 'Unable to create rule reason ' +response.data.error  });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 3000);

			}
			unloader("body");;
		},function(error){
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });
				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	conditionFactory.getConditionsWithCategory().then(function (response){
		self.conditionDetails = response.data;
		angular.forEach(self.conditionDetails,function(value,key){
			for(var i=0;i<value.length;i++){
				value[i]['checked'] = false;
			}
		});
	},function(error){

	});

	var data = '{"group": {"operator": "AND","rules": []}}';

	function htmlEntities(str) {
		return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	var gourpCounter = 0; 
	
	
	// Applicant((actions.get(0).isExected && actions.get(1).isExected) && (actions.get(2).isExected && actions.get(3).isExected))

	function conditionComputed(group) {
		if (!group) return "";
		for (var str = "(", i = 0; i < group.rules.length; i++) {
			i > 0 && (str += " " + group.operator + " ");
			if(group.rules[i].group){
				str += conditionComputed(group.rules[i].group);
			}else{
				//event_data['TargetUserName']
				if(group.rules[i].field){
					str += group.rules[i].group ?
							conditionComputed(group.rules[i].group) :"actions.get("+i+").isExected";
				}
			}
		}
		return str + ")";
	}


	function computed(group) {
		if (!group) return "";
		for (var str = "(", i = 0; i < group.rules.length; i++) {
			i > 0 && (str += " " + group.operator + " ");
			if(group.rules[i].group){
				str += computed(group.rules[i].group);
			}else{

				//event_data['TargetUserName']
				if(group.rules[i].field){
					if( group.rules[i].field.indexOf(".") > -1){
						if(group.rules[i].condition === "%%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + " " + " like '%" + group.rules[i].data+"%'";

						}else if(group.rules[i].condition === "_%") {
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + " " + " like '" + group.rules[i].data+"%'";
						}else if(group.rules[i].condition === "%_"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + " " + " like '%" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + "  = "  + " '" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										group.rules[i].field.split(".")[1] + "  != "  + " '" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"column_in("+group.rules[i].field.split(".")[1] + " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "not_in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"notin("+group.rules[i].field.split(".")[1] + " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "ip_range" && group.rules[i].fromIP && group.rules[i].toIP ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"iprange("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromIP+"','"+group.rules[i].toIP+"')";
						}
						else if(group.rules[i].condition === "time_range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"time_range("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"range("+group.rules[i].field.split(".")[1] + " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "threat_matcher" && group.rules[i].numberOfSources){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"threat_matcher("+group.rules[i].field.split(".")[1] + " , '"  + group.rules[i].numberOfSources+"')";
						}
						//range


					}else{
						if(group.rules[i].condition === "%%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"LCASE(event_data['"+group.rules[i].field +"']) like '%" + group.rules[i].data+"%'";
						}
						else if(group.rules[i].condition === "_%"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"LCASE(event_data['"+group.rules[i].field +"']) like '" + group.rules[i].data+"%'";
						}
						else if(group.rules[i].condition === "%_"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"LCASE(event_data['"+group.rules[i].field +"']) like '%" + group.rules[i].data+"'";
						}else if(group.rules[i].condition === "="){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"LCASE(event_data['"+group.rules[i].field +"']) like '%" + group.rules[i].data+"%'";
						}else if(group.rules[i].condition === "in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"column_in("+group.rules[i].field+ " , '"  + group.rules[i].data+"')";
						}
						else if(group.rules[i].condition === "not_in"){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"notin("+group.rules[i].field+ " , '"  + group.rules[i].data+"')";

						}
						else if(group.rules[i].condition === "ip_range" && group.rules[i].fromIP && group.rules[i].toIP ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :

										"iprange("+group.rules[i].field+ " , '"+group.rules[i].fromIP+"','"+group.rules[i].toIP+"')";
						}
						else if(group.rules[i].condition === "time_range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"timerange("+group.rules[i].field+", '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}
						else if(group.rules[i].condition === "range" && group.rules[i].fromTimeRange && group.rules[i].toTimeRange ){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"range("+group.rules[i].field+ " , '"+group.rules[i].fromTimeRange+"','"+group.rules[i].toTimeRange+"')";
						}

						else if(group.rules[i].condition === "threat_matcher" && group.rules[i].numberOfSources){
							str += group.rules[i].group ?
									computed(group.rules[i].group) :
										"threat_matcher("+group.rules[i].field + " , '"+group.rules[i].numberOfSources+"')";
						}

					}
				}

			}
		}

		return str + ")";
	}


	$scope.json = null;

	$scope.filter = JSON.parse(data);
	
	
	$scope.$on('addConditionFilter', function(event, args) {

		$scope.currentConditions = args;
	});

	
	$scope.addConditionFilter = function(data){
		console.log(data);
		
		$scope.currentConditions = {};
		
		$scope.currentConditions = data;
		
		var tempArray = [];
		
		

		
		
		self.currentEvents.push($scope.currentConditions);
		
	}
	
	$scope.$watch('filter', function (newValue) {
		$scope.json = JSON.stringify(newValue, null, 2);
		
		console.log($scope.json);
		
		$scope.fields = newValue.fields;
		$scope.output = conditionComputed(newValue.group);

		console.log($scope.output);

		self.ruleCondition.additionalFilter =  $scope.output;
		self.ruleCondition.actualQuery =  $scope.json;
//		console.log(self.ruleCondition);

	}, true);


	$scope.$watch('ruleConditionFilter', function (newValue) {
		$scope.json = JSON.stringify(newValue, null, 2);
		$scope.fields = newValue.fields;
		$scope.output = computed(newValue.group);

		console.log($scope.output);

		self.ruleCondition.additionalFilter =  $scope.output;
		self.ruleCondition.actualQuery =  $scope.json;
//		console.log(self.ruleCondition);

	}, true);





	$scope.searchRule = function(search){
		if(search.length == 0){
			angular.forEach(self.conditionDetails,function(value,key){
				for(var i=0;i<value.length;i++){
					value[i].expanded = false;
				}
			});
		}
	}

	self.ruleTypeConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'typeName',
			searchField: ['typeName'],
			valueField: 'typeName',
			create: function(value,silent){
				self.saveRuleType(value);
				return true;	
			},onChange: function(value) {
				if(value == undefined && $scope.formRule.$submitted){					
					$(".selectize-control.single .selectize-input").addClass('border-danger');
				}else{
					$(".selectize-input.items.ng-valid.has-options.border-danger.ng-dirty.full.has-items").removeClass('border-danger');
				}
			}
	};

	$scope.vm = {};
	$scope.vm.dtInstance = {};  
	$scope.vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(25).withOption('order', [1, 'asc'])
	.withOption('lengthMenu', [25,50, 100, 150, 200]);
	$scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(0).notSortable()];

	
	

	$(document).ready(function() {
		$('#conditionSelection').DataTable( {
			columnDefs: [ {
				orderable: false,
				className: 'select-checkbox',
				targets:   0
			} ],
			select: {
				style:    'os',
				selector: 'td:first-child'
			}
		} );
	} );

	self.rulecategoryConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'categoryName',
			searchField: ['categoryName'],
			valueField: 'categoryName',
			create: function(value,silent){
				self.saveCategory(value);
				return true;	
			},onChange: function(value) {
				if(value == undefined && $scope.formRule.$submitted){					
					$(".selectize-control.single .selectize-input").addClass('border-danger');
				}else{
					$(".selectize-input.items.required.ng-valid.has-options.ng-dirty.full.has-items").removeClass('border-danger');
				}
			}
	};


	$scope.toggleAll = function(flag){
		angular.forEach(self.conditionDetails, function(value,key){
			for(var i=0;i<value.length;i++){
				value[i].checked = flag;
			}
		});
	}

	self.addConditionsToRule = function(){
		angular.forEach(self.conditionDetails, function(value,key){
			for(var i=0;i<value.length;i++){
				if(value[i].checked){
					self.addCondition(value[i]);
				}
			}
		});
		$("#addCondition").modal('hide');
	};

	self.goBackHistory = function(){
		$window.history.back();
	}

}]);

app.filter('eventFilter', function() {
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
				if(value[i].conditionName.toLowerCase().includes(search.toLowerCase())){
					value[i].expanded = true;
					object[key] = items[key];
				}
			}
		});
		return object;

	};
});


