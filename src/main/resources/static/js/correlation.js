app.controller("correlationController", ['$scope', 'corrleationFactory','$rootScope','$timeout','$uibModal', function ($scope, corrleationFactory,$rootScope, $timeout,$uibModal) {

	
	$rootScope.$broadcast('changeThemeToNormal');
	
	var self = this;
	$scope.indexes = [];
	//$scope.loggedIndex = "";
	$scope.logTypes = [];
	$scope.customindexes = ["apps","corp","homeadvisor","vimeo"];
	$scope.isFiterAdvanced = "false";
	self.correlationData = {id:'',correlationName:'',correlationDesc:'',filterQuery:'',index:'',logType:'',matchCriteria:[{"metricName":"","operator":"","value":""}],filterFields:[{"fieldName":"","fieldTitle":"","aggType":""}],joinInfo:[],correlationFilterFields:[{"filterField":"","operator":"","filterValue":""}]};
	self.correlationData.filterFields.aggType = "GroupBy";
	self.selectedFilter = '';
	$scope.advanceConfig =[];
	self.alertMessagaes =[];
	self.elasticFields = [''];
	self.tableData = [];
	self.tableHeaders = [];
	$scope.preFilters = [];
	$scope.correlationFields = [];
	document.getElementById("loadingIndicatorCtn").style.display = 'none';
	$scope.sortType     = 'correlationName';
	$scope.sortReverse  = false;
	
	$scope.rulesToExcel=[];
	$scope.excelHeader = ["Rule Name"];
	$scope.excelColumns = ["correlationName"];
	var currentTimestamp = new Date().toJSON().slice(0,19);
	$scope.ruleListExcelFileName = "RuleList_"+currentTimestamp+".csv";
	
	$scope.loadDefaultTheme("body","html");
	
	corrleationFactory.getAllCorrelationDetails().then(function(response){
		$scope.rowCollection = response.data.tableData;
		self.correlationDatatemp = response.data.tableData;
		$scope.filters = response.data.filters;
		/* Prepare rules list excel data to export to csv */
		for(var i=0; i < $scope.rowCollection.length;i++){
			$scope.rulesToExcel[i] = [];
			for(var j=0; j < $scope.excelColumns.length;j++){
				var ruleExcelData = $scope.rowCollection[i][$scope.excelColumns[j]];
				$scope.rulesToExcel[i].push(ruleExcelData);
			}
		}
	});
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

	corrleationFactory.getAllIndexes().then(function(response){
		$scope.indexes = response.data;
	});
	
	corrleationFactory.getLoggedIndex().then(function(response){
		//$scope.loggedIndex = response.data;
		self.correlationData.index = response.data;
		$scope.getAllFieldsBasedOnIndex();
	});
	
	

	self.refreshAddresses = function(address) {
		corrleationFactory.getAllFieldsForIndex(address).then(function(response){
			self.fields = response.data;
			var tempArray = [];
			for(var i=0;i<response.data.length;i++){
				tempArray.push({name:response.data[i]})
			}
			$scope.$watch('fields', function (newValue) {
				$scope.fields = tempArray
			}, true);

		});

	};
	
	self.runQuery = function(){
		document.getElementById("loadingIndicatorCtn").style.display = 'inline-block';
		document.getElementById("noDataDiv").style.display = 'none';
		document.getElementById("queryData").style.display = 'none';
		
		self.queryExecTime = "";
		self.hits = "";
		console.log("correlationData: " + self.correlationData.toString());
		for(var i=0;i<self.correlationData.filterFields.length;i++)
		{
			if(self.correlationData.filterFields[i].fieldTitle=="" || self.correlationData.filterFields[i].fieldTitle==null || self.correlationData.filterFields[i].fieldTitle==''){
				self.correlationData.filterFields[i].fieldTitle = self.correlationData.filterFields[i].fieldName;
			}
		}
		for(var i=0;i<self.correlationData.joinInfo.length;i++)
		{
			for(var j=0;j<self.correlationData.joinInfo[i].joinFields.length;j++)
			{
				if(self.correlationData.joinInfo[i].joinFields[j].fieldTitle=="" || self.correlationData.joinInfo[i].joinFields[j].fieldTitle==null || self.correlationData.joinInfo[i].joinFields[j].fieldTitle==''){
					self.correlationData.joinInfo[i].joinFields[j].fieldTitle = self.correlationData.joinInfo[i].joinFields[j].fieldName;
				}
			}	
		}
		self.tableHeaders = [];
		corrleationFactory.runQuery(self.correlationData).then(function(response){
			self.queryExecTime = msToTime(response.data.took);
			self.hits = response.data.hits;
			self.fieldTitles = response.data.fieldDetails;
			if(response.data.alertHeader != null) {
				self.tableHeaders = [];
				for(var i=0;i<response.data.alertHeader.length;i++){
					/*var fieldHeader = response.data.alertHeader[i];
					var fieldTitle = response.data.fieldDetails[fieldHeader];
					if(fieldTitle == undefined || fieldTitle == ""){
						fieldTitle = fieldHeader;
					}*/
					self.tableHeaders.push(response.data.alertHeader[i]);
				}
				
			}
			if(response.data.queryResults != null) {
				self.tableData = [];
				for(var i=0;i<response.data.queryResults.length;i++){
					self.tableData.push(response.data.queryResults[i]);
				}
				
			}				
			document.getElementById("loadingIndicatorCtn").style.display = 'none';
			if(self.tableData.length == 0){
				document.getElementById("noDataDiv").style.display = 'inline-block';
			}else{
				document.getElementById("queryData").style.display = 'inline-block';
			}	
		}, function (error) {
			document.getElementById("loadingIndicatorCtn").style.display = 'none';
			document.getElementById("noDataDiv").style.display = 'inline-block';	
		});
	}
	
	$scope.getKibanaLink = function(kibanaData) {
    	console.log("KibanaData:"+kibanaData);
    	var matchCriteriaLength = self.correlationData.matchCriteria.length;
    	for(var i=0;i<matchCriteriaLength;i++){
    		var metricName = self.correlationData.matchCriteria[i].metricName;
    		var timeframe = "";
    		if(metricName == "Occurred"){
    			timeframe = self.correlationData.matchCriteria[i].value;
    		}
    	}
    	$scope.kibanaURL = "http://35.165.7.68:5601/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-"+timeframe+",mode:quick,to:now))&_a=(columns:!(_source),index:'"+self.correlationData.index+"-*"+"',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'"+kibanaData+"')),sort:!('@timestamp',desc))";
    	console.log("KibanaLink:"+$scope.kibanaURL);
    }
	
	$scope.getSubAAg = function(value,key) {

		if(typeof value == "object") {
			var values=[];
			var len=value.length;
			if(value.buckets != null){

				for(var i=0;i<value.buckets.length;i++){
					if(typeof value.buckets[i].key_as_string == "undefined"){
						values.push(value.buckets[i].key);
					}else{
						values.push(value.buckets[i].key_as_string);
					}
	
				}
			}else{
				for(var i=0;i<value.length;i++){
					if(typeof value.key_as_string == "undefined"){
						values.push(value.key);
					}else{
						values.push(value.key_as_string);
					}
	
				}
			}

		}


		return values;
	}
	
	self.submit = function(){
		if(!self.correlationData.id){
			console.log("calling submitData():::");
			self.submitData();
		}else{
			console.log("calling updateData():::");
			self.updateData();
		}
		
	}
	
	self.submitData = function(){
		console.log("correlationData: " + self.correlationData.toString());
		for(var i=0;i<self.correlationData.filterFields.length;i++)
		{
			if(self.correlationData.filterFields[i].fieldTitle=="" || self.correlationData.filterFields[i].fieldTitle==null || self.correlationData.filterFields[i].fieldTitle==''){
				self.correlationData.filterFields[i].fieldTitle = self.correlationData.filterFields[i].fieldName;
			}
		}
		for(var i=0;i<self.correlationData.joinInfo.length;i++)
		{
			for(var j=0;j<self.correlationData.joinInfo[i].joinFields.length;j++)
			{
				if(self.correlationData.joinInfo[i].joinFields[j].fieldTitle=="" || self.correlationData.joinInfo[i].joinFields[j].fieldTitle==null || self.correlationData.joinInfo[i].joinFields[j].fieldTitle==''){
					self.correlationData.joinInfo[i].joinFields[j].fieldTitle = self.correlationData.joinInfo[i].joinFields[j].fieldName;
				}
			}
			
		}
			
		corrleationFactory.saveCorrleation(self.correlationData).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Correlation was created successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}else{
				self.alertMessagaes.push({ type: 'success', msg: 'Unable to create Rule. Correlation Rule name should be unique' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
				
			}
				corrleationFactory.getAllCorrelationDetails().then(function (response){
					$scope.rowCollection = response.data.tableData;
				},function(data){
					$scope.status = 'Unable to load customer data: ' + error.message;
					self.alertMessagaes.push({ type: 'success', msg: 'Unable to create Condition. Filter name should be unique.' });
				});
				
		}, function (error) {
			console.log("at error::: ");
			$scope.status = 'Unable to load customer data: ' + error.message;
			self.alertMessagaes.push({ type: 'success', msg: 'Unable to create Rule. Rule name should be unique.' });
		});


	}
	
	//updateData - starts
	
	self.updateData = function(){
		console.log("correlationData: " + self.correlationData.toString());
		for(var i=0;i<self.correlationData.filterFields.length;i++)
		{
			if(self.correlationData.filterFields[i].fieldTitle=="" || self.correlationData.filterFields[i].fieldTitle==null || self.correlationData.filterFields[i].fieldTitle==''){
				self.correlationData.filterFields[i].fieldTitle = self.correlationData.filterFields[i].fieldName;
			}
		}
		for(var i=0;i<self.correlationData.joinInfo.length;i++)
		{
			for(var j=0;j<self.correlationData.joinInfo[i].joinFields.length;j++)
			{
				if(self.correlationData.joinInfo[i].joinFields[j].fieldTitle=="" || self.correlationData.joinInfo[i].joinFields[j].fieldTitle==null || self.correlationData.joinInfo[i].joinFields[j].fieldTitle==''){
					self.correlationData.joinInfo[i].joinFields[j].fieldTitle = self.correlationData.joinInfo[i].joinFields[j].fieldName;
				}
			}	
		}
		corrleationFactory.updateCorrleation(self.correlationData.id,self.correlationData).then(function (response) {
			if(response.data.status){
				self.alertMessagaes.push({ type: 'success', msg: 'Correlation was created successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}else{
				self.alertMessagaes.push({ type: 'success', msg: 'Unable to create Rule. Correlation Rule name should be unique' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
				
			}
				corrleationFactory.getAllCorrelationDetails().then(function (response){
					$scope.rowCollection = response.data.tableData;
				},function(data){
					$scope.status = 'Unable to load customer data: ' + error.message;
					self.alertMessagaes.push({ type: 'success', msg: 'Unable to create Condition. Filter name should be unique.' });
				});
				
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
			self.alertMessagaes.push({ type: 'success', msg: 'Unable to create Rule. Rule name should be unique.' });
		});
	}
	
	//updateData - ends
	
	$scope.displayUpdate = function(alertId){
		self.correlationData=[];
		$scope.preFilters=[];
		for(var i = 0; i < $scope.rowCollection.length; i++){
			if($scope.rowCollection[i].id === alertId) {
				self.correlationData = angular.copy($scope.rowCollection[i]);
				break;
			}
		}
		$scope.getAllFieldsBasedOnIndex();
		if($scope.preFilters.indexOf(self.correlationData.filterQuery) == -1){
			$scope.preFilters.push(self.correlationData.filterQuery);
		}
			self.correlationData.matchCriteria=angular.copy(JSON.parse(self.correlationData.matchCriteria));
			self.correlationData.filterFields=angular.copy(JSON.parse(self.correlationData.filterFields));
			self.correlationData.correlationFilterFields=angular.copy(JSON.parse(self.correlationData.correlationFilterFields));
			self.correlationData.joinInfo=angular.copy(JSON.parse(self.correlationData.joinInfo));
			for(var i=0;i<self.correlationData.joinInfo.length;i++){
				for(var j=0;j<self.correlationData.joinInfo[i].joinCond.length;j++){
					console.log(self.correlationData.joinInfo[i].joinCond[j].prevFilter);
					if($scope.preFilters.indexOf(self.correlationData.joinInfo[i].joinCond[j].prevFilter) == -1){
						$scope.preFilters.push(self.correlationData.joinInfo[i].joinCond[j].prevFilter);
					}
					if($scope.preFilters.indexOf(self.correlationData.joinInfo[i].joinCond[j].nextFilter) == -1){
						$scope.preFilters.push(self.correlationData.joinInfo[i].joinCond[j].nextFilter);
					}
				}
			}
	};

	$scope.duplicateRule = function(alertId){
		$scope.displayUpdate(alertId);
		self.correlationData.id = null;
		self.correlationData.correlationName = null;
	};
	
	$scope.deleteRules = function(alertId){
		swal({
			  title: 'Are you sure?',
			  text: "You won't be able to revert this!",
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, delete it!'
			}).then(function () {
				corrleationFactory.deleteRules(alertId).then(function (response) {
					if(response.data.status){
						self.alertMessagaes.push({ type: 'success', msg: 'Rule was deleted successfully' });
						swal(
							    'Deleted!',
							    'Rule has been deleted.',
								'success'
								)
						corrleationFactory.getAllCorrelationDetails().then(function (response){
							$scope.rowCollection = response.data.tableData;
						},function(error){

				});
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}

				}, function (error) {
					$scope.status = 'Unable to load customer data: ' + error.message;
				});
			})
	}

	self.checkForValidIndex = function(){
		console.log(self.alertData.indexPattern)

		alertsFactory.checkForValidIndex(self.alertData.indexPattern).then(function (response) {
			self.elasticFields = response.data.data;
			self.elasticFields.push("")
			if(!response.data.data){
				self.alertMessagaes.push({ type: 'error', msg: 'invalid index' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
			}
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	$scope.indexName = "";
	$scope.joinIndexName="";
	$scope.getAllFieldsBasedOnIndex = function(){
		if(self.correlationData.index == "*") {
			$scope.getAllFieldsForAllIndexes();	
			
		}else {
			//corrleationFactory.getAllFieldsForIndex($scope.indexName).then(function(response){
			console.log("Current Index in Rules:"+self.correlationData.index);
			corrleationFactory.getAllFieldsForIndex(self.correlationData.index).then(function(response){
				$scope.indexFields =response.data;
				console.log("$scope.indexFields size is:"+$scope.indexFields.length);
			});
		}
		corrleationFactory.getAllLogTypes(self.correlationData.index).then(function(response){
			$scope.logTypes = response.data;
		});
	}
	
//	$scope.getAllFieldsBasedOnIndexFor = function(index){
//		if($scope.indexName == "*") {
//			$scope.getAllFieldsForAllIndexes();	
//		}else {
//			corrleationFactory.getAllFieldsForIndex(self.correlationData.join_info[index].join_index).then(function(response){
//				$scope.indexFields = response.data;
//			});
//		}
//	}


	$scope. getAllFieldsBasedOnIndex_Join = function(index){
		console.log("Join_index:"+self.correlationData.joinInfo[index].joinIndex);
		if(self.correlationData.joinInfo[index].joinIndex == "*") {
			$scope.getAllFieldsForAllIndexes();	
			$scope.indexFieldsJoin = $scope.indexFields;
		}else {
			corrleationFactory.getAllFieldsForIndex(self.correlationData.joinInfo[index].joinIndex).then(function(response){
				$scope.indexFieldsJoin = response.data;
			});
		}
	}
	
	$scope.getAllFieldsForAllIndexes = function() {
		//$scope.tempFields = [];
		var indexset = new Set();
		for(var i=0; i < $scope.customindexes.length; i++){
			var index = $scope.customindexes[i];
			corrleationFactory.getAllFieldsForIndex(index).then(function successCallback(response){
				$scope.tempFields = response.data;	
				for(var j=0;j < $scope.tempFields.length;j++) {
					indexset.add($scope.tempFields[j]);
				}
				$scope.indexFields = Array.from(indexset).sort();	
			});		
		}
		 
	}
	
	var data = '{"group": {"operator": "AND","rules": []}}';
	
	var i=0;
	
	$scope.addField = function(){
		self.correlationData.filterFields.push({"fieldName":"","fieldTitle":"","aggType":""});
		console.log("Added Field:"+self.correlationData.filterFields[i].fieldName);
		//$scope.correlationFields.push(self.correlationData.filterFields[i].fieldName);
		i++;
	}
	
	var j = 0;
	$scope.addFilterField = function(){
		self.correlationData.correlationFilterFields.push({"fieldName":"","operator":"","filterValue":""});
		console.log("Added Filter Field:"+self.correlationData.correlationFilterFields[j].fieldName);
		$scope.correlationFields.push(self.correlationData.correlationFilterFields[i].fieldName);
		j++;
	}
	
	//var j = 0;
	$scope.addJoinField = function(joinIndex){
		self.correlationData.joinInfo[joinIndex].joinFields.aggType = "GroupBy";
		self.correlationData.joinInfo[joinIndex].joinFields.push({"fieldName":"","fieldTitle":"","aggType":""});
		/*console.log("Added Join Field:"+self.correlationData.joinInfo[joinIndex].joinFields[j].fieldName);
		$scope.correlationFields.push(self.correlationData.joinInfo[joinIndex].joinFields[j].fieldName);
		j++;*/
	}
	
	$scope.removeField = function(index){
		if(index==0){
			
		}else{
			self.correlationData.filterFields.splice(index,1);	
			//$scope.correlationFields.splice(index,1);
		}
	}
	
	$scope.removeFilterField = function(index){
		if(index==0){
			
		}else{
			self.correlationData.correlationFilterFields.splice(index,1);	
			//$scope.correlationFields.splice(index,1);
		}
	}
	
	$scope.removeJoinField = function(joinIndex,index){
		if(index==0){
			
		}else{
			self.correlationData.joinInfo[joinIndex].joinFields.splice(index,1);		
		}
	}
	

	$scope.addMatchCriteria = function(){
		self.correlationData.matchCriteria.push({"metricName":"","operator":"","value":""});
	}
	
	$scope.removeMatchCriteria= function(index){
		if(index==0){
			
		}else{
			self.correlationData.matchCriteria.splice(index,1);	
		}
	}
	
	$scope.addJoinMatchCriteria = function(joinIndex){
		self.correlationData.joinInfo[joinIndex].joinMatchCriteria.push({"metricName":"","operator":"","value":""});
	}
	
	$scope.removeJoinMatchCriteria = function(joinIndex,index){
		if(index==0){
					
		}else{
			self.correlationData.joinInfo[joinIndex].joinMatchCriteria.splice(index,1);	
		}
	}
	
	var flag=false;
	$scope.addJoin = function(){
		flag=true;
		if(self.correlationData.filterQuery==null || self.correlationData.filterQuery=='' || self.correlationData.filterQuery=="" )
		{
			//swal('Select Event Filter first..!','','error');
			flag=false;
		}else{
			if(self.correlationData.joinInfo.length==0)
			{
				console.log("self.correlationData.filterQuery::: " + self.correlationData.filterQuery);
				$scope.preFilters.push(self.correlationData.filterQuery);
				self.correlationData.joinInfo.push({joinCond:[{logicalOperator:'',nextFilter:'',nextField:'',prevFilter:'',prevField:''}],joinIndex:'',joinLogType:'',joinMatchCriteria:[{metricName:'',operator:'',value:''}],joinFields:[{fieldName:'',fieldTitle:'',aggType:''}]});
				flag=false;
			}
			else
			{
				loop1:
				for(var i=0;i<self.correlationData.joinInfo.length;i++)
				{
					loop2:
					for(var j=0;j<self.correlationData.joinInfo[i].joinCond.length;j++)
					{
						if(self.correlationData.joinInfo[i].joinCond[j].nextFilter == null || self.correlationData.joinInfo[i].joinCond[j].nextFilter == '' || self.correlationData.joinInfo[i].joinCond[j].nextFilter == "")
						{
							console.log(self.correlationData.joinInfo[i].joinCond[j].nextFilter);
							//swal("please select additional filter","","error");
							flag=false;
							break loop1;
						}
					}
				}
				
				$scope.preFilters=[];
				$scope.preFilters.push(self.correlationData.filterQuery);
				for(var i=0;i<self.correlationData.joinInfo.length;i++)
				{
					for(var j=0;j<self.correlationData.joinInfo[i].joinCond.length;j++)
					{
						if($scope.preFilters.indexOf(self.correlationData.joinInfo[i].joinCond[j].nextFilter) == -1){
							$scope.preFilters.push(self.correlationData.joinInfo[i].joinCond[j].nextFilter);
						}
					}
				}
				if(flag==true){
					self.correlationData.joinInfo.push({joinCond:[{logicalOperator:'',nextFilter:'',nextField:'',prevFilter:'',prevField:''}],joinIndex:'',joinLogType:'',joinMatchCriteria:[{metricName:'',operator:'',value:''}],joinFields:[{fieldName:'',fieldTitle:'',aggType:''}]});
				}
			}
		}
	}
	
	//inner join starts
	$scope.addJoinCond = function(joinIndex){
		self.correlationData.joinInfo[joinIndex].joinCond.push({"logicalOperator":"","nextFilter":"","nextField":"","prevFilter":"","prevField":""});
		$scope.preFilters=[];
		$scope.preFilters.push(self.correlationData.filterQuery);
		for(var i=0;i<self.correlationData.joinInfo.length;i++)
		{
			for(var j=0;j<self.correlationData.joinInfo[i].joinCond.length;j++)
			{
				
				if($scope.preFilters.indexOf(self.correlationData.joinInfo[i].joinCond[j].nextFilter) == -1){
					$scope.preFilters.push(self.correlationData.joinInfo[i].joinCond[j].nextFilter);
				}
				
			}
		}
	}
	
	$scope.removeJoinCond = function(joinIndex,index){
		if(index==0){
			
		}else{
			self.correlationData.joinInfo[joinIndex].joinCond.splice(index,1);
		}
	}
	
	//inner join ends
	

	$scope.removeJoin = function(index) {
		self.correlationData.joinInfo.splice(index,1);
		//joinCount--;
		//$scope.preFilters.splice(joinCount,1);
	};
	$scope.removeJoinMetric = function(joinIndex,index) {
		if(index==0){
			isDisabled=true;
		}else{
			isDisabled=false;
			$scope.join[joinIndex].joinMetric.splice(index,1);
		}
	};
	
	function htmlEntities(str) {
		return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function computed(group) {
		
		if (!group) return "";
		for (var str = "(", i = 0; i < group.rules.length; i++) {
			i > 0 && (str += " " + group.operator + " ");
			str += group.rules[i].group ?
					computed(group.rules[i].group) :
						group.rules[i].field + " " + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data;
		}
		//self.correlationData.filterQuery = str + ")"
		return str + ")";
	}

	$scope.json = null;

	$scope.filter = JSON.parse(data);

	$scope.$watch('filter', function (newValue) {
		$scope.json = JSON.stringify(newValue, null, 2);
		$scope.output = computed(newValue.group);
	}, true);




}]);

function msToTime (ms) {
	var seconds = (ms/1000);
	var minutes = parseInt(seconds/60, 10);
	seconds = seconds%60;
	var hours = parseInt(minutes/60, 10);
	minutes = minutes%60;

	return hours + ':' + minutes + ':' + seconds;
}

function formatSeconds (e) {
	var t=parseInt(e,10)%60,             // Seconds
	n=parseInt(e/3600,10),           // Hours
	r=parseInt((e-n*3600)/60,10);    // Minutes

	return n<10&&(n="0"+n),r<10&&(r="0"+r),t<10&&(t="0"+t),parseInt(n,10)>0?n+":"+r+":"+t:r+":"+t
}

