app.controller("dashboardReportController", ['$scope', 'widgetService','$rootScope','$timeout','$uibModal','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','$ngConfirm','$location','$routeParams','Fullscreen','$route','$interval','$window','colorConfigurationFactory','$filter','alertsFactory','chartService','$compile','investigationPanelFactory','logDevicesFactory','$sessionStorage',function ($scope, widgetService,$rootScope, $timeout,$uibModal,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$ngConfirm,$location,$routeParams,Fullscreen,$route,$interval,$window,colorConfigurationFactory,$filter,alertsFactory,chartService,$compile,investigationPanelFactory,logDevicesFactory,$sessionStorage) {

	var self = this;

	$scope.editMode = false;
	var data = this.data = {};

	$scope.from = 0;
	$scope.treeData = [];

//	$scope.themeName = localStorage.getItem("dashboard-themeType");

	$scope.currentCompany = "All";

	$scope.currentDate = new Date();





	self.workBench = {id:0,workBenchName:"",description:"",status:"",userNames:"",artifacts:"",createdDate:"",lastupdateDate:"",networkJson:"",suspicious:""};

	self.caseErrorMessages =[];
	$scope.alertNames = [];
	$scope.Timer = null;
	$scope.widgets = [
		{ x:0, y:0, width:0, height:0 }, 
		{ x:0, y:0, width:1, height:1 },
		{ x:0, y:0, width:1, height:1 }

		];



	$scope.showSingleEventDetails = function(data){
		$scope.singleEventDetails = data;
	}

	$('.grid-stack').on('gsresizestop', function(event, elem) {
		var newHeight = $(elem).attr('data-gs-height');
		console.log(newHeight);
	});




	$scope.dashboardTabs = [];

	$scope.dashboard = {};

	$scope.dashboardContainsTable = false;














//	$scope.startDate = moment(new Date()).subtract(24, 'hours').valueOf();
//	$scope.endDate = moment(new Date()).valueOf();

	$scope.labelName = "Last 24 hours"
		$scope.dateLable = "last24Hours";




	$scope.showLegends = true;



	$scope.logFields = [];

	$scope.logFieldsOptions = [];


	$scope.canEditDashboards = false;


	$scope.gridStackOptions = {
			cellHeight: 100,
			verticalMargin: 5,
			handle: '.panel-heading',

	};


	$scope.isRepotsEditable = false;

	$scope.enableReport = function(){
		$scope.isRepotsEditable = false;
	}
	
	self.query = {};
	
	$scope.loadDashboard = function(dashboard){
		$scope.displayStartDate = "";
		$scope.displayEndDate = "";


		$scope.switchedWidgetDetails = [];

		$scope.dashboard = dashboard;
		//$scope.existingDashboards.push(dashboard.name);




		$scope.kpiWidgets= [];
		self.widgets= [];
		//data['updateFromDashboard'] = false;
		//$("#dashboardsWidgets").css("height",$( window ).height()-100);
		widgetService.loadSingleDashboardForReport($scope.dashboard.id).then(function (response) {
			$scope.name = response.data.name;
			$scope.description = response.data.description
			$scope.model = response.data.config;
			$scope.model["id"] = $scope.dashboard.id;
			$scope.model["tableDataHeaders"] = [];
			$scope.model["tableData"] = [];
			$scope.model['createdBy'] = response.data.createdBy;
			$scope.model['isAdmin'] = response.data.isAdmin;
			$scope.model['isOwner'] = response.data.isOwner;
			$scope.model['isEditor'] = response.data.access;
			$scope.model['existingRoles'] = response.data.existingRoles;



//			$scope.setRelativeTimeForDashboards(dashboard.dateLable,dashboard.dateLable);

			data.query =  [];
			data["fields"] = {};
			if($routeParams.filterQuery){
				var routerQuery = $routeParams.filterQuery;
				var obje = {"bool":{"must":[{"term":{}}]}}
				obje.bool.must[0].term[routerQuery.split(":")[0]+".keyword"] = routerQuery.split(":")[1];
				self.query = obje;
			}else{
				if(dashboard.filterQuery){
					var obje = {"bool":{"must":[{"term":{}}]}};
					obje.bool.must[0].term[dashboard.filterQuery.split("=")[0]+".keyword"] = dashboard.filterQuery.split("=")[1];
					data.query.push(obje);

				}else if(response.data.dashboardQuery){
					self.query = JSON.parse(response.data.dashboardQuery);
					//				data.query.push(JSON.parse(response.data.dashboardQuery));
					//data['updateFromDashboard'] = true;
				}
			}
			$scope.logFieldsFilter = [];
			for(var i=0;i<response.data.config.filterFields.length;i++){

				if(response.data.config.filterFields[i]==='events_tags' || response.data.config.filterFields[i]==='rules_tags'){
					data.fields[response.data.config.filterFields[i]+".keyword"] = { type: 'multi',title:response.data.config.filterFields[i],field:response.data.config.filterFields[i]+".keyword",choices:self.tagDetails};
				}else{
					data.fields[response.data.config.filterFields[i]+".keyword"] = { type: 'term',title:response.data.config.filterFields[i],field:response.data.config.filterFields[i]+".keyword"};

				}

				$scope.logFields.push({fieldName:response.data.config.filterFields[i]})
				$scope.logFieldsFilter.push({fieldName:response.data.config.filterFields[i]+".keyword"});


			}
			data.fields['log_device.keyword'] = { type: 'term',title:'log_device',field:"log_device.keyword"};
			data['updateFromDashboard'] = true;






//			var queryToShow = {
//			size: 0,
//			filter: { and : data.query }
//			};
			if($routeParams.filterQuery){
				$scope.output = JSON.stringify(self.query);
			}else{
				$scope.output =	JSON.stringify(parseFilterGroup(self.data.fields,$filter,self.query));
			}





			//$scope.startDate = dashboard.startDate;
			//$scope.endDate  = dashboard.endDate;
			$scope.labelName = dashboard.labelName;
			$scope.dateLable = dashboard.dataLable;

			$scope.dashboard['tabClass'] = "active";

			$scope.options = { 
					startDate:$scope.startDate , 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:'teest',
					filter : $scope.output,
					color:self.colors,
					companyName:$scope.currentCompany,
					requestFrom:'reports'
			}





			var tempWidgets = response.data.config.widgets;

			var tempKpiWidgets = response.data.config.kpiwidgets;

			if(tempKpiWidgets){
				for(var j=0;j<tempKpiWidgets.length;j++){
					if(typeof  tempKpiWidgets[j].options == 'string'){					
						tempKpiWidgets[j].options = JSON.parse(tempKpiWidgets[j].options);
						if(tempKpiWidgets[j].options.config.chart_type != "kpi"){
							self.widgets.push(tempWidgets[j]);
						}else{
							$scope.kpiWidgets.push(tempKpiWidgets[j]);
						}
					}else{
						if(tempKpiWidgets[j].options.config.chart_type != "kpi"){
							self.widgets.push(tempWidgets[j]);
						}else{
							$scope.kpiWidgets.push(tempKpiWidgets[j]);
						}
					}
				}
			}



			for(var j=0;j<tempWidgets.length;j++){
				if(typeof  tempWidgets[j].options == 'string'){					
					tempWidgets[j].options = JSON.parse(tempWidgets[j].options);
					if(tempWidgets[j].options.config.chart_type != "kpi"){
						self.widgets.push(tempWidgets[j]);
					}else{
						$scope.kpiWidgets.push(tempWidgets[j]);
					}
				}
			}

			for(var i=0;i<$scope.kpiWidgets.length;i++){

				widgetService.loadSingleWidgetForReport($scope.kpiWidgets[i].id,$scope.startDate,$scope.endDate,$scope.options.filter,$scope.options.queryString,$scope.currentCompany).then(function (response) {

					if(response.data.data.length!=0){

						var curWidget = JSON.parse(response.data.cfg);

						var data1 = {
								config: curWidget.config,
								data: response
						}

						var chartData =chartService.getSeriesData(data1,$scope);

						$(".kpi-"+response.data.widgetId).empty();

						var containerDom = $(".kpi-"+response.data.widgetId);




						var render = new CBoardKpiRender(containerDom, chartData);
						var html = render.html(false);
						if ($scope) {
							containerDom.append($compile(html)($scope));
						} else {
							containerDom.html(html);
						}
					}





				}, function (error) {

				});


			}



			setTimeout(function(){

				for(var i=0;i<self.widgets.length;i++){

					if(self.widgets[i].options.config.chart_type==='table'){
						$scope.dashboardContainsTable = true;
					}

					widgetService.loadSingleWidgetForReport(self.widgets[i].id,$scope.startDate,$scope.endDate,$scope.options.filter,$scope.options.queryString,$scope.currentCompany).then(function (response) {

						var container =  $("#chart-"+response.data.widgetId);

						var parentHeight = $(container).parent().parent().parent().parent().height();
						//$(container).parent().parent().parent().height(parentHeight);

						//$(container).parent().parent().parent().parent().height(parentHeight)

						container.height(parentHeight-50);

						if(response.data.data.length!=0){

							var curWidget = JSON.parse(response.data.cfg);
							curWidget.config['startDate'] = $scope.startDate;
							curWidget.config['endDate'] = $scope.endDate;
							curWidget.config['requestFrom'] = 'reports';
							//curWidget.config['widgetId'] = response.data.widgetId

							chartService.renderWithOutDataService(container, {
								config: curWidget.config,
								datasource: $scope.datasource ? $scope.datasource.id : null,
										query: curWidget.query,
										datasetId: $scope.customDs ? undefined : curWidget.datasetId,
												widgetId : parseInt(curWidget.dataSetId),
												data: response
							}, function (option) {
								switch (curWidget.config.chart_type) {
								case 'line':
									$scope.previewDivWidth = 12;
									option.toolbox = {
											feature: {
												dataView: {
													show: true,
													readOnly: true
												}
											}
									};
									break;
								case 'pie':
									$scope.previewDivWidth = 12;
									option.toolbox = {
											feature: {
												dataView: {
													show: true,
													readOnly: true
												}
											}
									};
									break;
								case 'kpi':
									$scope.previewDivWidth = 6;
									break;
								case 'table':
									$scope.previewDivWidth = 12;
									break;
								case 'funnel':
									$scope.previewDivWidth = 12;
									option.toolbox = {
											feature: {
												dataView: {
													show: true,
													readOnly: true
												}
											}
									};
									break;
								case 'sankey':
									$scope.previewDivWidth = 12;
									option.toolbox = {
											feature: {
												dataView: {
													show: true,
													readOnly: true
												}
											}
									};
									break;
								case 'map':
									$scope.previewDivWidth = 12;
									break;
								case 'areaMap':
									$scope.previewDivWidth = 12;
									break;
								case 'chinaMap':
									$scope.previewDivWidth = 12;
									break;
								case 'relation':
									$scope.previewDivWidth = 12;
									break;
								}
								$scope.loadingPre = false;



							}, $scope, !$scope.loadFromCache);chartService.renderWithOutDataService(container, {
								config: curWidget.config,
								datasource: $scope.datasource ? $scope.datasource.id : null,
										query: curWidget.query,
										datasetId: $scope.customDs ? undefined : curWidget.datasetId,
												widgetId : parseInt(curWidget.dataSetId),
												data: parentresponse
							}, function (option) {
								switch (curWidget.config.chart_type) {
								case 'line':
									$scope.previewDivWidth = 12;
									option.toolbox = {
											feature: {
												dataView: {
													show: true,
													readOnly: true
												}
											}
									};
									break;
								case 'pie':
									$scope.previewDivWidth = 12;
									option.toolbox = {
											feature: {
												dataView: {
													show: true,
													readOnly: true
												}
											}
									};
									break;
								case 'kpi':
									$scope.previewDivWidth = 6;
									break;
								case 'table':
									$scope.previewDivWidth = 12;
									break;
								case 'funnel':
									$scope.previewDivWidth = 12;
									option.toolbox = {
											feature: {
												dataView: {
													show: true,
													readOnly: true
												}
											}
									};
									break;
								case 'sankey':
									$scope.previewDivWidth = 12;
									option.toolbox = {
											feature: {
												dataView: {
													show: true,
													readOnly: true
												}
											}
									};
									break;
								case 'map':
									$scope.previewDivWidth = 12;
									break;
								case 'areaMap':
									$scope.previewDivWidth = 12;
									break;
								case 'chinaMap':
									$scope.previewDivWidth = 12;
									break;
								case 'relation':
									$scope.previewDivWidth = 12;
									break;
								}
								$scope.loadingPre = false;



							}, $scope, !$scope.loadFromCache);



						}





					}, function (error) {

					});


				}



			}, 500);





		}, function (error) {

		});
	}

	$scope.setRelativeTimeForDashboards = function(option,labelName){

		var startDate =moment(new Date());
		var endDate = moment(new Date());

		$scope.labelName = labelName;

		if(option==='last2Days'){
			startDate = moment(new Date()).subtract(2, 'days');
		}
		if(option==='last7Days'){
			startDate = moment(new Date()).subtract(7, 'days');
		}
		if(option==='last30Days'){
			startDate = moment(new Date()).subtract(30, 'days');
		}
		if(option==='last90Days'){
			startDate = moment(new Date()).subtract(90, 'days');
		}
		if(option==='last6months'){
			startDate = moment(new Date()).subtract(6, 'months');
		}
		if(option==='last1year'){
			startDate = moment(new Date()).subtract(1, 'years');
		}
		if(option==='last2years'){
			startDate = moment(new Date()).subtract(2, 'years');
		}
		if(option==='last5years'){
			startDate = moment(new Date()).subtract(2, 'years');
		}
		if(option==='yesterday'){
			startDate = moment(new Date()).subtract(1, 'days').startOf('day');
			endDate = moment(new Date()).subtract(1, 'days').endOf('day');
		}
		if(option==='dayBeforeYesterday'){
			startDate = moment(new Date()).subtract(2, 'days').startOf('day');
			endDate = moment(new Date()).subtract(2, 'days').endOf('day');
		}
		if(option==='thisLastWeek'){
			startDate = moment(new Date()).subtract(7, 'days').startOf('week');
			endDate = moment(new Date()).subtract(7, 'days').endOf('week');
		}
		if(option==='perviousWeek'){
			startDate = moment(new Date()).subtract(1, 'weeks').startOf('week');
			endDate = moment(new Date()).subtract(1, 'weeks').endOf('week');
		}
		if(option==='today'){
			startDate = moment(new Date()).startOf('day');
			endDate = moment(new Date()).endOf('day');
		}
		if(option==='todaySoFar'){
			startDate = moment(new Date()).startOf('day');
		}
		if(option==='thisWeek'){
			startDate = moment(new Date()).startOf('week');
			endDate = moment(new Date()).endOf('week');
		}
		if(option==='thisWeekSoFar'){
			startDate = moment(new Date()).startOf('week');

		}
		if(option==='thisMonth'){
			startDate = moment(new Date()).startOf('month');
			endDate = moment(new Date()).endOf('month');
		}
		if(option==='thisMonthSoFar'){
			startDate = moment(new Date()).startOf('month');

		}
		if(option==='thisYear'){
			startDate = moment(new Date()).startOf('year');
			endDate = moment(new Date()).endOf('year');
		}
		if(option==='thisYearSoFar'){
			startDate = moment(new Date()).startOf('year');
		}

		if(option==='last15Minutes'){
			startDate = moment(new Date()).subtract(15, 'minutes');;

		}

		if(option==='last30Minutes'){
			startDate = moment(new Date()).subtract(30, 'minutes');;

		}

		if(option==='last1Hour'){
			startDate = moment(new Date()).subtract(1, 'hours');;
		}


		if(option==='last3Hours'){
			startDate = moment(new Date()).subtract(3, 'hours');;
		}

		if(option==='last6Hours'){
			startDate = moment(new Date()).subtract(6, 'hours');
		}

		if(option==='last12Hours'){
			startDate = moment(new Date()).subtract(12, 'hours');;
		}

		if(option==='last24Hours'){
			startDate = moment(new Date()).subtract(24, 'hours');;
		}
		$scope.startDate = startDate.valueOf();
		$scope.endDate = endDate.valueOf();
		$scope.dashboard.dateLable = option; 
		$scope.dateLable = option;
		//$scope.apply();
	}

	$scope.openAdvancedFilter = function(){
		$("#showAdvancedFilter").modal();
	}

	$scope.loadFirstDashboad = function(){

		if(window.location.href.indexOf("id")!=-1){



			var dashboardId =  	location.search.split('id=')[1].split("&")[0];
			var startDate =  	location.search.split('startDate=')[1].split("&")[0]
			$scope.startDate = location.search.split('startDate=')[1].split("&")[0];
			
			var endDate =  	location.search.split('endDate=')[1].split("&")[0];
			$scope.endDate = location.search.split('endDate=')[1].split("&")[0].replace("'","").trim();
			var filterQuery = $routeParams.filterQUery;



			var temp = new Object();

			temp['startDate'] = startDate;
			temp['endDate'] =  endDate;
			temp['labelName'] = "Last 24 hours";
			temp['dateLable'] = "last24Hours";
			temp['tabClass'] =  $scope.dashboardTabs.length == 0 ? "":"active"; 
			temp['filterQuery'] = filterQuery;
			temp['id'] = dashboardId;

			$scope.loadDashboard(temp);

		}
	}

	$scope.loadFirstDashboad();

	self.closeTab = function(index,dashboardName){
		$scope.dashboardTabs.splice(index,1);
		$scope.loadDashboard($scope.dashboardTabs[index-1])

		for(var i=0;i<$scope.existingDashboards.length;i++){
			if($scope.existingDashboards[i]===dashboardName){
				self.removeDashboards(dashboardName);
				$scope.existingDashboards.splice(i,1);
			}
		}

	}


	this.getNodeInfo = function(e,item){
		$timeout(function() {

			if(item.node.type!="default"){

				for(var i=0;i<$scope.currentDashboards.length;i++){
					if(parseInt(item.node.id) === $scope.currentDashboards[i].id){
						$scope.addDashboadToTab($scope.currentDashboards[i]);
					}
				}

			}

		});
	}













	var self = this;


	$scope.loadSingleWidget = function(id){
		$scope.options = { 
				startDate: $scope.startDate, 
				endDate: $scope.endDate,
				renderAllWidgets:false,
				dateLabel:$scope.dateLable,
				filter : $scope.output,
				singleWidget:id,
				color:self.colors,
				queryString : $scope.searchQueryString,
				companyName:$scope.currentCompany
		}
		widgetService.loadSingleWidget(id,$scope.startDate,$scope.endDate,"","").then(function (response) {						
			for(var i=0;i<self.widgets.length;i++){
				if(self.widgets[i].id == id){
					response.data['col'] =self.widgets[i].col;
					response.data['row'] =self.widgets[i].row;
					response.data['sizeX'] =self.widgets[i].sizeX; 
					response.data['sizeY'] = self.widgets[i].sizeY;
					response.data['id'] = self.widgets[i].id;
					response.data['options'] = widgetOptions;
					self.widgets[i] = response.data;
					break;
				}
			}
		}, function (error) {

		});

	}




}]);


app.directive('popover', function($compile,$timeout){
	return {
		restrict : 'A',
//		scope: {
//		setFn: '&'
//		},
//		scope: { data: '=popover'},
		link : function(scope, elem){
			var content = $("#FilterOverlay").html();
//			var content = $("#timeControlOverlay").html();
			var compileContent = $compile(content)(scope);
			var options = {
					content: compileContent,
					placement: 'bottom',
					html: true,
					container: 'body',
					trigger: 'manual'

			};

			$(elem).popover(options);
//			scope.setFn({theDirFn: scope.closePopup});
			$(elem).bind('click', function() {
				$(elem).popover('toggle');
			});
			scope.closePopup = function(){
				$(elem).popover('hide');
			};
		}
	}
});

app.directive('popover1', function($compile,$timeout){
	return {
		restrict : 'A',
//		scope: {
//		setFn: '&'
//		},
//		scope: { data: '=popover'},
		link : function(scope, elem){
//			var content = $("#FilterOverlay").html();
			var content = $("#timeControlOverlay").html();
			var compileContent = $compile(content)(scope);
			var options = {
					content: compileContent,
					placement: 'right',
					html: true,
					container: 'body',
					trigger: 'manual'

			};

			$(elem).popover(options);
//			scope.setFn({theDirFn: scope.closePopup});
			$(elem).bind('click', function() {
				$(elem).popover('toggle');
			});
			scope.closePopup1 = function(){
				$(elem).popover('hide');
			};
		}
	}
});

app.directive('dashboardqueryBuilder', ['$compile','conditionFactory', function ($compile,conditionFactory) {
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
					{ name: 'Equal TO', value:"==" },
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
						if(!(scope.$parent.model.filterFields === undefined)){
							for(var i=0;i<scope.$parent.model.filterFields.length;i++){
								tempArray.push({name:scope.$parent.model.filterFields[i]})
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


app.directive('gridsterDynamicHeight', gridsterDynamicHeight);

gridsterDynamicHeight.$inject = [];
function gridsterDynamicHeight(){

	var directive = {
			scope: {
				item: "=" //gridster item
			},
			link: link,
			restrict: 'A'
	};
	return directive;

	function link(scope, element, attrs) {

		scope.$watch(function() {

			return element[0].scrollHeight;
		},
		function(newVal, oldVal) { 

			var rowHeightOption = 75; // Change this value with your own rowHeight option
			var height = rowHeightOption * scope.item.sizeY;
			if(newVal > height){

				var div = Math.floor(newVal / rowHeightOption);
				div++;
				scope.item.sizeY = div; 
			}
		});
	}


}




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
	var fieldName = fieldData.field;

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


$(window).on('resize', function(){
	setTimeout(function(){ 
		$("div.chart").each(function(){
			var chartId = $(this)[0].id;



			var id = $(this).attr('_echarts_instance_');
			if(window.echarts.getInstanceById(id)){
				window.echarts.getInstanceById(id).resize();
			}



		});
	}, 400);
});

app.directive('search', function () {
	return function ($scope, element) {
		element.bind("keyup", function (event) {
			var val = element.val();
			if(val.length > 2) {
				$scope.search(val);
			}
		});
	};
});


