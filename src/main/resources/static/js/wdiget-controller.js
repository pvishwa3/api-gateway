var myChart ;



app.controller("widgetCtrl", ['$scope', 'widgetService','$rootScope','$timeout','$uibModal','$filter','chartService','dataSetFactory','$ngConfirm','$routeParams','conditionFactory','tagService','alertsFactory','DTColumnBuilder','DTOptionsBuilder','DTColumnDefBuilder','$document',function ($scope, widgetService,$rootScope, $timeout,$uibModal,$filter,chartService,dataSetFactory,$ngConfirm,$routeParams,conditionFactory,tagService,alertsFactory,DTColumnBuilder,DTOptionsBuilder,DTColumnDefBuilder,$document) {

	$rootScope.$broadcast('changeThemeToNormal');
	$scope.queryAceOpt = cbAcebaseOption;
	var translate = $filter('translate');
	$scope.mapOptions = [];
	var self = this; 
	var data = this.data = {}; 
	$scope.canCreateVis = false;
	$scope.canUpdateVis = false;
	$scope.canDeleteVis = false;
	$scope.conditions = [];
	$scope.rules = [];

	$scope.theme = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
	$scope.showHomeButton = true;
	$scope.showCreateEventButton = false;
	$scope.showUpdateEventButton = false;

	$scope.navType = "chartContainer";

	$scope.openTab = function(navType){
		$scope.navType  = navType;
	}
	self.tagDetails = [];
	self.loadAllTags = function(){
		self.tagDetails = [];
		tagService.getTags().then(function(response){
			for(var i=0;i<response.data.length;i++){
				self.tagDetails.push(response.data[i].tagName);
			}

		});
	}
	self.loadAllTags();



	self.loadAlertsByCategory = function(){

		alertsFactory.getAlertsByCategory().then(function (response) {
			self.alertCategoies = response.data;
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
		loader("body");
		widgetService.loadRules().then(function (response) {
			$scope.rules = response.data.tableData;
			unloader("body");
		}, function (error) {
			unloader("body");
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}


	$scope.getAllDataSets = function(){
		dataSetFactory.getAllDataSets().then(function (response) {
			$scope.dataSets = response.data;
		}, function (error) {
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
		loader("body");
		widgetService.loadRules().then(function (response) {
			$scope.rules = response.data.tableData;
			unloader("body");
		}, function (error) {
			unloader("body");
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

	}

	$scope.loadConditions = function(){
		loader("body");
		widgetService.getAllConditions().then(function (response) {
			$scope.conditions = response.data;
			unloader("body");
		}, function (error) {
			unloader("body");
			$scope.status = 'Unable to load customer data: ' + error.message;
		});
	}

	$scope.addThresholds = function(){
        if(!$scope.curWidget.config['thresholds']){
             $scope.curWidget.config['thresholds'] = [];
          }else{
             $scope.curWidget.config['thresholds'].push({color:'',value:''})
        }

	}

	$scope.ruleConfig = {
			maxItems : 1,
			optgroupField : 'class',
			labelField : 'correlationName',
			searchField : ['correlationName'],
			valueField : 'correlationName',
			create : false,
			onChange: function(value) {
				if(value == undefined && $scope.widget.$submitted){                    
					$(".selectize-control.single .selectize-input").addClass('border-danger');
				}else{
					$(".selectize-input.items.ng-valid.has-options.border-danger.ng-dirty.full.has-items").removeClass('border-danger');
				}
			}
	}

	$scope.eventConfig = {
			maxItems : 1,
			optgroupField : 'class',
			labelField : 'conditionName',
			searchField : ['conditionName'],
			valueField : 'id',
			create : false,
			onChange: function(value) {
				if(value == undefined && $scope.widget.$submitted){                    
					$(".selectize-control.single .selectize-input").addClass('border-danger');
				}else{
					$(".selectize-input.items.ng-valid.has-options.border-danger.ng-dirty.full.has-items").removeClass('border-danger');
				}
			}
	}

	$scope.loadPermissions = function(){
		loader("body");
		widgetService.loadPermissions().then(function (response) {
			if(response.data.indexOf("add visualizations")!=-1){
				$scope.canCreateVis = true;
			}
			if(response.data.indexOf("update visualizations")!=-1){
				$scope.canUpdateVis = true;
			}
			if(response.data.indexOf("delete visualizations")!=-1){
				$scope.canDeleteVis = true;
			}
			unloader("body");

		}, function (error) {
			unloader("body");
			$scope.status = 'Unable to load customer data: ' + error.message;
		});

	}

	$scope.getAllDataSets();
	$scope.loadConditions();	
	$scope.loadPermissions();



	// 图表类型初始化
	$scope.chart_types = [
		{
			name: translate('Table'), value: 'table', class: 'cTable',
			row: translate('TIPS_DIM_NUM_0_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_0_MORE')
		},
		{
			name: translate('Line Chart'), value: 'line', class: 'cLine',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1_MORE')
		},
		{
			name: translate('Contrast'), value: 'contrast', class: 'cContrast',
			row: translate('TIPS_DIM_NUM_1'),
			column: translate('TIPS_DIM_NUM_0'),
			measure: translate('TIPS_DIM_NUM_2')
		},
		{
			name: translate('SCATTER'), value: 'scatter', class: 'cScatter',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1_MORE')
		},
		{
			name: translate('PIE'), value: 'pie', class: 'cPie',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1_MORE')
		},
		{
			name: translate('KPI'), value: 'kpi', class: 'cKpi',
			row: translate('TIPS_DIM_NUM_0'),
			column: translate('TIPS_DIM_NUM_0'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('FUNNEL'), value: 'funnel', class: 'cFunnel',
			row: translate('TIPS_DIM_NUM_0_MORE'),
			column: translate('TIPS_DIM_NUM_0'),
			measure: translate('TIPS_DIM_NUM_1_MORE')
		},
		{
			name: translate('SANKEY'), value: 'sankey', class: 'cSankey',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('RADAR'), value: 'radar', class: 'cRadar',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1_MORE')
		},
		{
			name: translate('MAP'), value: 'map', class: 'cMap',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1_MORE')
		},
		{
			name: translate('GAUGE'), value: 'gauge', class: 'cGauge',
			row: translate('TIPS_DIM_NUM_0'),
			column: translate('TIPS_DIM_NUM_0'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('WORD_CLOUD'), value: 'wordCloud', class: 'cWordCloud',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('TREE_MAP'), value: 'treeMap', class: 'cTreeMap',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('HEAT_MAP_CALENDER'), value: 'heatMapCalendar', class: 'cHeatMapCalendar',
			row: translate('TIPS_DIM_NUM_1'),
			column: translate('TIPS_DIM_NUM_0'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('HEAT_MAP_TABLE'), value: 'heatMapTable', class: 'cHeatMapTable',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_1_MORE'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('LIQUID_FILL'), value: 'liquidFill', class: 'cLiquidFill',
			row: translate('TIPS_DIM_NUM_0'),
			column: translate('TIPS_DIM_NUM_0'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('AREA_MAP'), value: 'areaMap', class: 'cAreaMap',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('CHINA_MAP'), value: 'chinaMap', class: 'cChinaMap',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1_MORE')
		},
		{
			name: translate('CHINA_MAP_BMAP'), value: 'chinaMapBmap', class: 'cChinaMapBmap',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1_MORE')
		},
		{
			name: translate('RELATION'), value: 'relation', class: 'cRelation',
			row: translate('TIPS_DIM_NUM_1_2'),
			column: translate('TIPS_DIM_NUM_1_2'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('WORLD_MAP'), value: 'worldMap', class: 'cWorldMap',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1')
		},
		{
			name: translate('WORLD_MAP'), value: 'kpiPie', class: 'ckpi-pie',
			row: translate('TIPS_DIM_NUM_1_MORE'),
			column: translate('TIPS_DIM_NUM_0_MORE'),
			measure: translate('TIPS_DIM_NUM_1')
		}
		];

	$scope.chart_types_status = {
			"line": true, "pie": true, "kpi": true, "table": true,
			"funnel": true, "sankey": true, "radar": true, "map": true,
			"scatter": true, "gauge": true, "wordCloud": true, "treeMap": true,
			"heatMapCalendar": true, "heatMapTable": true, "liquidFill": true,
			"areaMap": true, "contrast": true,"chinaMap":true,"chinaMapBmap":true,"relation":true,"kpi-pie":true
	};

	$scope.value_series_types = [
		{name: translate('Line'), value: 'line'},
		{name: translate('AREA_LINE'),value:'arealine'},
		{name: translate('STACKED_LINE'),value:'stackline'},
		{name: translate('PERCENT_LINE'),value:'percentline'},
		{name: translate('HORIZONTAL_BAR'), value: 'bar'},
		{name: translate('HORIZONTAL_STACKED_BAR'), value: 'stackbar'},
		{name: translate('PERCENT_BAR'), value: 'percentbar'}
		];


	$scope.china_map_types = [
		{name: translate('SCATTER_MAP'), value: 'scatter'},
		{name: translate('HEAT_MAP'), value: 'heat'},
		{name: translate('MARK_LINE_MAP'), value: 'markLine'}
		];

	$scope.value_aggregate_types = [
		{name: 'sum', value: 'sum'},
		{name: 'count', value: 'count'},
		{name: 'avg', value: 'avg'},
		{name: 'max', value: 'max'},
		{name: 'min', value: 'min'},
		{name: 'distinct', value: 'distinct'},
		{name: 'percentile', value: 'percentile'},
		{name: 'SKEWNESS', value: 'SKEWNESS'},
		{name: 'KURTOSIS', value: 'KURTOSIS'},
		{name: 'MAD', value: 'MAD'},
		{name: 'SKEWNESS', value: 'SKEWNESS'},
		{name: 'STDDEV_POP', value: 'STDDEV_POP'},
		{name: 'SUM_OF_SQUARES', value: 'SUM_OF_SQUARES'},
		{name: 'VAR_POP', value: 'VAR_POP'},
		
		
		//{name: 'std deviation', value: 'std deviation'},

		//{name: 'top hit', value: 'top hit'},
		{name: 'calculate', value: 'calculate'},
		

		];

	$scope.value_pie_types = [
		{name: translate('PIE'), value: 'pie'},
		{name: translate('DOUGHNUT'), value: 'doughnut'},
		{name: translate('COXCOMB'), value: 'coxcomb'}
		]

	$scope.kpi_styles = [
		{name: translate('AQUA'), value: 'bg-aqua'},
		{name: translate('RED'), value: 'bg-red'},
		{name: translate('GREEN'), value: 'bg-green'},
		{name: translate('YELLOW'), value: 'bg-yellow'}
		];

	$.getJSON('plugins/FineMap/mapdata/citycode.json', function (data) {
		$scope.provinces = data.provinces;
	});





	$scope.treemap_styles = [
		{name: translate('RANDOM'), value: 'random'},
		{name: translate('MULTI'), value: 'multi'},
		{name: translate('BLUE'), value: 'blue'},
		{name: translate('RED'), value: 'red'},
		{name: translate('GREEN'), value: 'green'},
		{name: translate('YELLOW'), value: 'yellow'},
		{name: translate('PURPLE'), value: 'purple'}
		];

	$scope.heatmap_styles = [
		{name: translate('BLUE'), value: '#2777b6'},
		{name: translate('RED'), value: '#e62109'},
		{name: translate('GREEN'), value: '#2d981d'},
		{name: translate('YELLOW'), value: '#f67f03'},
		{name: translate('PURPLE'), value: '#b85cff'}
		];

	$scope.heatmap_date_format = [
		{name: 'yyyy-MM-dd', value: 'yyyy-MM-dd'},
		{name: 'yyyy/MM/dd', value: 'yyyy/MM/dd'},
		{name: 'yyyyMMdd', value: 'yyyyMMdd'}
		];

	$scope.liquid_fill_style = [
		{name: translate('CIRCLE'), value: 'circle'},
		{name: translate('PIN'), value: 'pin'},
		{name: translate('RECT'), value: 'rect'},
		{name: translate('ARROW'), value: 'arrow'},
		{name: translate('TRIANGLE'), value: 'triangle'},
		{name: translate('ROUND_RECT'), value: 'roundRect'},
		{name: translate('SQUARE'), value: 'square'},
		{name: translate('DIAMOND'), value: 'diamond'},
		{name: translate('Pie'), value: 'pie'}
		];

	/***************************************************************************
	 * 0: None items 1: only 1 item -1: None Restrict 2: 1 or more
	 **************************************************************************/
	$scope.configRule = {
			line: {keys: 2, groups: -1, filters: -1, values: 2},
			pie: {keys: 2, groups: -1, filters: -1, values: 2},
			kpi: {keys: 0, groups: 0, filters: -1, values: 1},
			table: {keys: -1, groups: -1, filters: -1, values: -1},
			funnel: {keys: -1, groups: 0, filters: -1, values: 2},
			sankey: {keys: 2, groups: 2, filters: -1, values: 1},
			radar: {keys: 2, groups: -1, filters: -1, values: 2},
			map: {keys: 2, groups: -1, filters: -1, values: 2},
			scatter: {keys: 2, groups: -1, filters: -1, values: 2},
			gauge: {keys: 0, groups: 0, filters: -1, values: 1},
			wordCloud: {keys: 2, groups: 0, filters: -1, values: 1},
			treeMap: {keys: 2, groups: 0, filters: -1, values: 1},
			areaMap: {keys: 2, groups: -1, filters: -1, values: 1},
			heatMapCalendar: {keys: 1, groups: 0, filters: -1, values: 1},
			heatMapTable: {keys: 2, groups: 2, filters: -1, values: 1},
			liquidFill: {keys: 0, groups: 0, filters: -1, values: 1},
			contrast: {keys: 1, groups: 0, filters: -1, values: 2},
			chinaMap:{keys: 2, groups: -1, filters: -1, values: 2},
			chinaMapBmap:{keys: 2, groups: -1, filters: -1, values: 2},
			relation: {keys: 2, groups: 2, filters: -1, values: 1}
	};

	$scope.switchLiteMode = function (mode) {
		if (mode) {
			$scope.liteMode = mode;
			$scope.$parent.$parent.liteMode = mode;
		} else {
			$scope.liteMode = !$scope.liteMode;
			$scope.$parent.$parent.liteMode = $scope.liteMode;
		}
	}


	$scope.currentPercentile = {};



	$scope.deletePercentile = function(data,index){
		data.splice(index, 1);
	}

	$scope.addPercentil = function(data){
		data.push({name:'',value:''})
	}



	$scope.changeChart = function (chart_type) {
		if (!$scope.chart_types_status[chart_type]) {
			return;
		}
		var oldConfig = angular.copy($scope.curWidget.config);
		$scope.curWidget.config = {};
		$scope.curWidget.config.option = {};
		$scope.curWidget.config.chart_type = chart_type;
		// loadDsExpressions();
		cleanPreview();

		$scope.curWidget.config.selects = oldConfig.selects;
		$scope.curWidget.config.keys = oldConfig.keys;
		$scope.curWidget.config.groups = oldConfig.groups;
		$scope.curWidget.config.values = [];

		// addHelpMessage();

		$scope.curWidget.config.filters = oldConfig.filters;
		switch ($scope.curWidget.config.chart_type) {
		case 'line':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.valueAxis = 'vertical';
			_.each($scope.curWidget.config.values, function (v) {
				v.series_type = 'line';
				v.type = 'value';
			});
			break;
		case 'pie':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			_.each($scope.curWidget.config.values, function (v) {
				v.series_type = 'pie';
				v.type = 'value';
			});
			break;
		case 'kpi':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.selects = angular.copy($scope.columns);
			_.each($scope.curWidget.config.values, function (v) {
				v.style = 'bg-aqua';
			});
			break;
		case 'kpi-pie':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.selects = angular.copy($scope.columns);
			_.each($scope.curWidget.config.values, function (v) {
				v.style = 'bg-aqua';
			});
			break;
		case 'scatter':
			var i = 0;
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					if (i >= 3) {
						$scope.curWidget.config.selects.push(c.col);
						return;
					}
					if (!$scope.curWidget.config.values[i]) {
						$scope.curWidget.config.values[i] = {name: '', cols: []};
					}
					$scope.curWidget.config.values[i].cols.push(c);
					i++
				});
			});
			for (var i = 0; i < 3; i++) {
				if (!$scope.curWidget.config.values[i]) {
					$scope.curWidget.config.values[i] = {name: '', cols: []};
				}
			}
			break;
		case 'gauge':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.selects = angular.copy($scope.columns);
			$scope.curWidget.config.styles = [
				{proportion: '0.2', color: '#228b22'},
				{proportion: '0.8', color: '#48b'},
				{proportion: '1', color: '#ff4500'}
				];
			break;
		case 'heatMapCalendar':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.selects = angular.copy($scope.columns);
			_.each($scope.curWidget.config.values, function (v) {
				v.dateFormat = 'yyyy-MM-dd';
				v.style = 'blue';
			});
			break;
		case 'heatMapTable':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.selects = angular.copy($scope.columns);
			_.each($scope.curWidget.config.values, function (v) {
				v.style = 'blue';
			});
			break;

		case 'liquidFill':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.selects = angular.copy($scope.columns);
			$scope.curWidget.config.animation = 'static';
			_.each($scope.curWidget.config.values, function (v) {
				v.style = 'circle';
			});
			break;
		case 'chinaMap':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.valueAxis = 'vertical';
			_.each($scope.curWidget.config.values, function (v) {
				v.series_type = 'scatter';
				v.type = 'value';
			});
			break;
		case 'chinaMapBmap':
			$scope.curWidget.config.values.push({name: '', cols: []});
			_.each(oldConfig.values, function (v) {
				_.each(v.cols, function (c) {
					$scope.curWidget.config.values[0].cols.push(c);
				});
			});
			$scope.curWidget.config.valueAxis = 'vertical';
			_.each($scope.curWidget.config.values, function (v) {
				v.series_type = 'scatter';
				v.type = 'value';
			});
			break;
		default:
			$scope.curWidget.config.values.push({name: '', cols: []});
		_.each(oldConfig.values, function (v) {
			_.each(v.cols, function (c) {
				$scope.curWidget.config.values[0].cols.push(c);
			});
		});
		break;
		}
		_.each($scope.curWidget.config.values, function (v) {
			_.each(v.cols, function (c) {
				delete c.formatter;
			});
		});
		$scope.preview();
		$scope.getChartView();
	};



	$scope.addOptionsToGuage = function(){

		$scope.curWidget.config.guageOptions.push({
			from: 0,
			to: 0,
			color: '' // green
		});

	}

	$scope.removeOptionsFromGuage= function(index){

		$scope.curWidget.config.guageOptions.splice(index,1)

	}


	$scope.preview = function () {
		$timeout(function () {
			angular.element('#preview_widget_tab').trigger('click');
		});




		var charType = $scope.curWidget.config.chart_type;
		if (charType == 'chinaMapBmap') {
			chartService.render($('#preview'), {
				config: $scope.curWidget.config,
				datasource: $scope.datasource ? $scope.datasource.id : null,
						query: $scope.curWidget.query,
						datasetId: $scope.customDs ? undefined : $scope.curWidget.datasetId
			});
			$scope.loadingPre = false;
		} else {
			chartService.render($('#preview'), {
				config: $scope.curWidget.config,
				datasource: $scope.datasource ? $scope.datasource.id : null,
						query: $scope.curWidget.query,
						datasetId: $scope.customDs ? undefined : $scope.curWidget.datasetId
			}, function (option) {


				switch ($scope.curWidget.config.chart_type) {
				case 'line':
					$scope.previewDivWidth = 12;
					option.toolbox = {
							feature: {
								dataView: {
									show: false,
									readOnly: false
								}
							}
					};
					break;
				case 'pie':
					$scope.previewDivWidth = 12;
					option.toolbox = {
							feature: {
								dataView: {
									show: false,
									readOnly: false
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
				case 'scatter':
					$scope.previewDivWidth = 13;
					option.toolbox = {
							feature: {
								dataView: {
									show: true,
									readOnly: true
								}
							}
					};
					break;
				}
				$scope.loadingPre = false;
			}, null, !$scope.loadFromCache);
		}
	};

	var addWatch = function () {
		$scope.$watch('curWidget.config.keys', changeChartStatus, true);
		$scope.$watch('curWidget.config.groups', changeChartStatus, true);
		$scope.$watch('curWidget.config.values', changeChartStatus, true);
		$scope.$watch('curWidget.config.filters', changeChartStatus, true);
		// addHelpMessage();
		// addValidateWatch();
	};

	var changeChartStatus = function () {
		for (var type in $scope.chart_types_status) {
			var rule = $scope.configRule[type];
			var config = $scope.curWidget.config;
			var flattenValues = [];


			angular.forEach(config.values, function (v) {
				flattenValues = flattenValues.concat(v.cols);
			});
			if (_.size(config.keys) == 0 && _.size(config.groups) == 0 && _.size(flattenValues) == 0) {
				r = false;
			} else {
				for (var k in rule) {
					var r = true;
					if (rule[k] == 2) {
						if (k == 'values') {
							r = (_.size(flattenValues) >= 1);
							if (type == 'contrast') {
								r = (_.size(flattenValues) == 2); // 限制values数量为2
							}
						} else {
							r = (_.size(config[k]) >= 1);
						}
					} else if (rule[k] != -1) {
						if (k == 'values') {
							r = (_.size(flattenValues) == rule[k]);
						} else {
							r = (_.size(config[k]) == rule[k]);
						}
					}
					if (!r) {
						$scope.chart_types_status[type] = r;
						break;
					}
				}
			}
			$scope.chart_types_status[type] = r;
		}
	};

	$scope.cleanVSort = function () {
		angular.forEach($scope.curWidget.config.values, function (v) {
			angular.forEach(v.cols, function (c) {
				c.sort = undefined;
			});
		});
	};

	var cleanPreview = function () {
		$('#preview_widget').html("");
		$('#viewQuery_widget').html("");
		$scope.viewQueryMoal = false;
	};

	$scope.curWidget = {};

	$scope.editSort = function (o) {
		switch (o.sort) {
		case 'asc':
			o.sort = 'desc';
			break;
		case 'desc':
			o.sort = undefined;
			break;
		default:
			o.sort = 'asc';
		break;
		}
	};


	$scope.newConfig = function () {
		$scope.curWidget.config = {};
		$scope.curWidget.config.option = {};
		$scope.curWidget.config.option['legendShow'] = false;
		$scope.curWidget.config['legend']= {align:"",verticalAlign:"",layout:"",itemStyle:{width:100,textOverflow: 'ellipsis',overflow: 'hidden'}};
		$scope.curWidget.config.chart_type = 'table';
		$scope.curWidget.config.dataSetId = '';
		// cleanPreview();
		$scope.curWidget.config.selects = angular.copy($scope.columns);
		$scope.curWidget.config.keys = [];
		$scope.curWidget.config.groups = [];
		$scope.curWidget.config.values = [{name: '', cols: []}];
		$scope.curWidget.config.filters = [];
		$scope.curWidget.config.numberformater = [{type:''}];
		$scope.curWidget.config.thresholds = [];
		$scope.curWidget.config.tableColAlignment = "auto";
		addWatch();
	};



	$scope.dndTransfer = {
			toCol: function (list, index, item, type) {
				if (type == 'key' || type == 'group' || type == 'filter') {
					list[index] = {col: item.col, aggregate_type: 'sum'};
				} else if (type == 'select' || type == 'measure') {
					list[index] = {col: item.column, aggregate_type: 'sum'};
				}
				$scope.onDragCancle();
			},
			toSelect: function (list, index, item, type) {
				if (type == 'col') {
					list[index] = item.col;
				} else if (type == 'key' || type == 'group' || type == 'filter') {
					list[index] = item.col;
				}
			},
			toKeysGroups: function (list, index, item, type) {
				if (type == 'col') {
					list[index] = {col: item.col, type: 'eq', values: [], sort: 'asc'};
				} else if (type == 'dimension' || type == 'select') {
					list[index] = {
							alias: item.alias,
							col: item.column,
							level: item.level,
							type: 'eq',
							values: [],
							sort: 'asc'
					};
					if (type == 'dimension') {
						list[index].id = item.id;
					}
				}
			},
			attachLevel: function (column, level) {
				column.level = level.alias;
				return column;
			}
	};

	$scope.getChartView = function () {
		if ($scope.curWidget.config && $scope.curWidget.config.chart_type) {
			$scope.chartTypeTemplate =  'templates/chart/' + $scope.curWidget.config.chart_type + '.html';
		}
	};

	var self = this;

	self.widget= {id:0,title:"",type:"",query:"",chartSubType:"",options:"",elasticseachFields:'',requriedDrillDown:'',drillDownId:'',mapConfiguration:'',dataSetTitle:'',columns:'',logType:'',option:'',existing:'',streamName:'',operationType : ''};

	self.alertMessagaes =[];

	$scope.templateUrl = "viewWidgets.html"

		$scope.showPerview = false;

	self.goBack = function(){
		$scope.templateUrl = "viewWidgets.html";
		self.loadAgGrid();
		$scope.showHomeButton = true;
		$scope.showCreateEventButton = false;
		$scope.showUpdateEventButton = false;
	}
	self.openWidgetCreateForm = function(){
		self.widget= {id:0,title:"",type:"",query:"",chartSubType:"",options:"",elasticseachFields:'',requriedDrillDown:'',drillDownId:'',mapConfiguration:'',dataSetTitle:'',columns:'',logType:'',option:'',existing:'',streamName:'',operationType : 'insert'};
		$scope.templateUrl = "createCategoryConditions.html";
		$("#deleteButton").hide();
		$("#editButton").hide();
		$scope.loadAllTopics();
		$scope.loadConditions();
		$scope.showHomeButton = false;
		$scope.showCreateEventButton = true;
		$scope.showUpdateEventButton = false;
		data.query = {"bool":{"must":[]}};
	}


	$scope.addRow = function(){

		$scope.mapOptions.push({
			ipAddress: '',
			category: '',
			color : ''

		});
	}

	$scope.saveMapConfiguration = function(){

		self.widget.mapConfiguration = $scope.mapOptions;
		$("#mapConfigurationModal").modal('hide');
	}

	$scope.openMapConfiguration = function(){


		$("#mapConfigurationModal").modal();
	}


	self.loadMappingFields = function(){
		widgetService.loadMappingFields().then(function (response) {
			self.elasticsearchFields = response.data.elasticsearchFields;
		}, function (error) {

		});
	}

	$scope.loadAllTopics = function(){
		widgetService.getAllTopics().then(function (response) {
			$scope.topics = response.data;
		}, function (error) {

		});
	}

	$scope.dashboards = [];

	self.loadDashboards = function(){
		widgetService.loadAllDashboards().then(function (response) {
			$scope.dashboards = response.data;
		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.loadWidgets = function(){
		widgetService.loadWidgets().then(function (response) {
			$scope.widgets = response.data;
			self.loadAgGrid();
			$timeout(function(){				
				$scope.editWidget();
			},1000);
		}, function (error) {
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
			}
		});
	}

	self.init = function(){
		self.loadWidgets();
		self.loadMappingFields();
		self.loadDashboards();
	}


	self.edit = function(id){
		$scope.tableDataHeaders = [];
		$scope.tableData = [];
		$scope.curWidget = {};
		for(var i = 0; i < $scope.widgets.length; i++){
			if($scope.widgets[i].id === id) {
//				$(document).ready(function(){
//				$("#demo-sw-checked").prop("checked", true);
//				});

				self.widget = angular.copy($scope.widgets[i]);

				self.widget.operationType = 'update';
				self.widget.option = self.widget.type;
				if(self.widget.options){
					$scope.curWidget = JSON.parse(self.widget.options);

					if($scope.curWidget.config.actualFilter){
						$scope.dashboardfilter = $scope.curWidget.config.actualFilter;
					}
					if($scope.curWidget.config.chart_type  === 'gauge'){
						$scope.curWidget.config['guageOptions'] = [{
							from: 0,
							to: 0,
							color: '' // green
						}]
					}


					if($scope.curWidget.config.colors){
						$scope.colors = [];
						for(var j=0;j<$scope.curWidget.config.colors.length;j++){
							$scope.colors.push($scope.curWidget.config.colors[j]);
						}
					}
					data.query = []; 	
					// $scope.templateUrl = "editWidgetDetails.html";
					// self.widget.fields = JSON.stringify($scope.schema);
					if(self.widget.query){
						data.query.push(JSON.parse(self.widget.query));
					}else{
						data.query = {"bool":{"must":[]}}
					}


					data.needsUpdate = true;
					$scope.schema = JSON.parse(self.widget.fields)
					data["fields"] = {};
					for(var j=0;j<$scope.schema.selects.length;j++){
						let key =$scope.schema.selects[j].column;
						let  keyValue = "";
						try{
						if(key.includes("rule_data.event_data.")){
							keyValue = key.replace("rule_data.event_data.","");
						}else if(key.includes("event_data.")){
							keyValue = key.replace("event_data.","");
						}else{
							keyValue = angular.copy(key);
						}
						}catch(err){console.log(err)};
						// $scope.schema.selects.push({column:uniqueArray[i]} );
						data.fields[keyValue] = { type: 'term',title:keyValue,field:keyValue};
					}

					self.showCategories();
					$scope.loadEventsOrRules();
					$scope.templateUrl = "editWidgetDetails.html"
						$("#editButton").hide();
					$("#deleteButton").hide();
					$scope.getChartView();
					$timeout(function(){						
						$scope.doPreviewForChart();
					},250);

				}else{
					$scope.templateUrl = "createCategoryConditions.html"
				}

				$scope.showHomeButton = false;
				$scope.showCreateEventButton = false;
				$scope.showUpdateEventButton = true;




			}
		}

//		$('head').append('<link id="theme"
//		href="assets/css/themes/type-full/theme-dark-full.css" rel="stylesheet">');

	}




	self.deleteWidget = function(widgetName,widgetId){

		$ngConfirm({ 
			animation: 'top',
			closeAnimation: 'bottom',
			theme: 'material',
			title: 'Confirm!',
			content: 'Do you want to delete <b>'+widgetName+'</b> Widget ',
			scope: $scope,
			buttons: {
				delete: {
					text: 'YES',
					btnClass: 'btn-danger',
					action: function(scope, button){
						loader("body");
						widgetService.deleteWidget(widgetId).then(function (response) {
							if(response.data.status){
								self.alertMessagaes.push({ type: 'success', msg: 'Successfully delete the widget' });

								self.loadWidgets();
							}
							unloader("body");
							$timeout(function () {
								self.alertMessagaes.splice(0, 1);
							}, 2000);
						}, function (error) {
							if(error.status== 403){
								self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

								$timeout(function () {
									self.alertMessagaes = [];
								}, 2000);
							}
							unloader("body");
						});
					}

				},
				close: function(scope, button){
				}




			}
		});
	}

	$scope.colors = [{colorName:''}];
	$scope.topleftsettings = {
			position: 'top left'
	};

	$scope.addColor = function(){
		$scope.colors.push({colorName:''});
	}

	$scope.removeColor = function(index){
		$scope.colors.splice(index, 1);  
	}



	$scope.getOptionsView = function () {
		var basePath = '/templates/chart/options/';
		if ($scope.curWidget.config && $scope.curWidget.config.chart_type) {
			return basePath + $scope.curWidget.config.chart_type + '.html';
		}
	}




	self.doSave = function(){

		var regex = new RegExp("^[A-Za-z0-9-_\\s-]+$"); 	

		if(typeof self.widget.title === "undefined" || self.widget.title==="" ){
			self.alertMessagaes.push({ type: 'danger', msg: "Title Can't be empty" });
			return false;
		}
		if(!regex.test(self.widget.title)){
			self.alertMessagaes.push({ type: 'danger', msg: "Title should not contain special characters." });
			return false;
		}


		if( self.widget.requriedDrillDown === ''){
			self.alertMessagaes.push({ type: 'danger', msg: 'Please Select Is Requried DrillDown' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			return false;
		}	

		if(self.widget.requriedDrillDown==='Yes' && self.widget.drillDownId==="" ){

			self.alertMessagaes.push({ type: 'danger', msg: 'Please Select Existing Widget' });
			$timeout(function () {
				self.alertMessagaes = [];
			}, 2000);
			return false;
		}	







		var dataSeries = getDataSeries($scope.curWidget.config);
		var cfg = {rows: [], columns: [], filters: []};
		cfg.rows = getDimensionConfig($scope.curWidget.config.keys);
		cfg.columns = getDimensionConfig($scope.curWidget.config.groups);
		cfg.filters = getDimensionConfig($scope.curWidget.config.filters);
		cfg.filters = cfg.filters.concat(getDimensionConfig($scope.curWidget.config.boardFilters));
		cfg.filters = cfg.filters.concat(getDimensionConfig($scope.curWidget.config.boardWidgetFilters));
		cfg.values = _.map(dataSeries, function (s) {
			return {column: s.name, aggType: s.aggregate,configuration:s.configuration};
		});

		self.widget.columns = JSON.stringify(cfg);
		if($scope.output!='()'){
			$scope.curWidget.config['query'] = $scope.output;
			// $scope.curWidget.config['actualFilter'] = $scope.dashboardfilter;

		}

		self.widget.options = JSON.stringify($scope.curWidget);

		self.widget.fields = JSON.stringify($scope.schema);
		$scope.output =	data.query[0];
		self.widget.query = JSON.stringify($scope.output);

		self.widget['limit'] = $scope.curWidget.config.limit;
		loader("body");
		widgetService.saveDetails(self.widget).then(function (response) {
			if(response.data.status){
				
				self.alertMessagaes.push({ type: 'success', msg: 'Widget Was Created Successfully' });
				$timeout(function () {
					self.alertMessagaes.splice(0, 1);
				}, 2000);
				self.loadWidgets();
				self.goBack();
			}else{
				if(response.data.errors){
					for(var i=0;i<response.data.errors.length;i++){

						self.alertMessagaes.push({ type: 'danger', msg: response.data.errors[i].defaultMessage });
					}
					}else{
						self.alertMessagaes.push({ type: 'danger', msg: response.data.data });
					}
				}
			unloader("body");
		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				unloader("body");
			}
		});
	}

	$scope.doPreviewForChart = function(){

		$('#chartContainer').html("<div id='preview' style='min-height: 450px; user-select: text;'></div>");
		var charType = $scope.curWidget.config.chart_type;

		$scope.curWidget.dataSetId = parseInt(self.widget.dataSetTitle);

		$scope.curWidget['option'] = self.widget.option;

		$scope.output =	data.query[0];	

		if (charType == 'chinaMapBmap') {
			chartService.render($('#preview'), {
				config: $scope.curWidget.config,
				datasource: $scope.datasource ? $scope.datasource.id : null,
						query: $scope.output,
						widgetId : self.widget.existing,
						option:self.widget.option,
			});
			$scope.loadingPre = false;
		} else {
			loader("body");
			chartService.render($('#preview'), {
				config: $scope.curWidget,

				datasource: $scope.datasource ? $scope.datasource.id : null,
						query: $scope.output,
						datasetId: self.widget.existing,
						widgetId : self.widget.streamName,
						option:self.widget.option
			}, function (option) {
				unloader("body");
				switch ($scope.curWidget.config.chart_type) {
				case 'line':
					$scope.previewDivWidth = 12;
					option.toolbox = {
							feature: {
								dataView: {
									show: false,
									readOnly: false
								}
							}
					};
					break;
				case 'pie':
					$scope.previewDivWidth = 12;
					option.toolbox = {
							feature: {
								dataView: {
									show: false,
									readOnly: false
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
									show: false,
									readOnly: false
								}
							}
					};
					break;
				case 'sankey':
					$scope.previewDivWidth = 12;
					option.toolbox = {
							feature: {
								dataView: {
									show: false,
									readOnly: false
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
				case 'scatter':
					$scope.previewDivWidth = 13;
					option.toolbox = {
							feature: {
								dataView: {
									show: false,
									readOnly: false
								}
							}
					};
					break;
				default:
					$scope.previewDivWidth = 12;
				}
				$scope.loadingPre = false;
				unloader("body");
			}, null, !$scope.loadFromCache);
			unloader("body");
		}
	}

	$scope.closeAlert = function(index) {
		self.alertMessagaes.splice(index, 1);
	};


	$scope.add_value = function () {
		$scope.curWidget.config.values.push({
			name: '',
			series_type: 'line',
			type: 'value',
			cols: []
		});
	};


	$scope.add_pie_value = function () {
		$scope.curWidget.config.values.push({
			name: '',
			series_type: 'pie',
			type: 'value',
			cols: []
		});
	}

	$scope.editFilterGroup = function (col) {
		var columnObjs = schemaToSelect($scope.schema);
		$uibModal.open({
			templateUrl: 'templates/chart/filterGroup.html',
			windowTemplateUrl: 'templates/chart/window.html',
			backdrop: false,
			scope: $scope,
			controller: function ($scope, $uibModalInstance) {
				if (col) {
					$scope.data = angular.copy(col);
				} else {
					$scope.data = {group: '', filters: []};
				}
				$scope.columnObjs = columnObjs;
				$scope.close = function () {
					$uibModalInstance.close();
				};
				$scope.addColumn = function (str) {
					$scope.data.filters.push({col: str, type: '=', values: []})
				};
				$scope.ok = function () {
					if (col) {
						col.group = $scope.data.group;
						col.filters = $scope.data.filters;
					} else {
						$scope.curWidget.filterGroups.push($scope.data);
					}
					$uibModalInstance.close();
				};
				$scope.editFilter = function (filter) {
					$uibModal.open({
						templateUrl: 'templates/chart/param.html',
						windowTemplateUrl: 'templates/chart/window.html',
						backdrop: false,
						size: 'lg',
						resolve: {
							param: function () {
								return angular.copy(filter);
							},
							filter: function () {
								return false;
							},
							getSelects: function () {
								return function (byFilter, column, callback) {
									dataService.getDimensionValues($scope.datasource ? $scope.datasource.id : null, $scope.curWidget.query, $scope.curWidget.datasetId, column, undefined, function (filtered) {
										callback(filtered);
									});
								};
							},
							ok: function () {
								return function (param) {
									filter.type = param.type;
									filter.values = param.values;
								}
							}
						},
						controller: 'paramSelector'
					});
				};
			}
		});
	};

	var schemaToSelect = function (schema) {
		if (schema.selects) {
			return angular.copy(schema.selects);
		} else {
			var selects = [];
			selects = selects.concat(schema.measure);
			_.each(schema.dimension, function (e) {
				if (e.type == 'level') {
					_.each(e.columns, function (c) {
						selects.push(c);
					});
				} else {
					selects.push(e);
				}
			});
			return angular.copy(selects);
		}
	};

	$scope.editVFilter = function (o) {
		$uibModal.open({
			templateUrl: 'templates/chart/vfilter.html',
			windowTemplateUrl: 'templates/chart/window.html',
			backdrop: false,
			size: 'lg',
			controller: function ($scope, $uibModalInstance) {
				$scope.type = ['=', '≠', '>', '<', '≥', '≤', '(a,b]', '[a,b)', '(a,b)', '[a,b]'];
				$scope.f_type = o.f_type ? o.f_type : '>';
				$scope.f_values = o.f_values ? o.f_values : [];
				$scope.f_top = o.f_top ? o.f_top : '';
				$scope.close = function () {
					$uibModalInstance.close();
				};
				$scope.ok = function () {
					o.f_type = $scope.f_type;
					o.f_values = $scope.f_values;
					o.f_top = $scope.f_top;
					$uibModalInstance.close();
				};
			}
		});
	};

	$scope.currentCol = {};
	
	$scope.openPercentile = function (o) {
		var parentElem = angular.element($document[0].querySelector('.content-wrapper ')) 
	    $scope.currentCol = o;
		$("#percentile-modal").modal();
		
	};
	
	$scope.currentWidgetConfig = {};
	
	$scope.editConfiguration = function(o,widgetConfig){
		 $scope.currentCol = o;
		 $scope.currentWidgetConfig = widgetConfig;
		 $("#configuration-modal").modal();
	}
	
	$scope.percentilOK = function(o){
		var existingAggType = o.aggregate_type;
		o.aggregate_type = o.percentile+"-"+existingAggType;
		$("#percentile-modal").modal('hide');
	}
	
	$scope.configurationOK = function(o){
		//var existingAggType = o.aggregate_type;
		//o.aggregate_type = o.percentile+"-"+existingAggType;
		$("#configuration-modal").modal('hide');
	}
	
	$scope.opencalculate = function (o) {
		var parentElem = angular.element($document[0].querySelector('.content-wrapper ')) 
	    $scope.currentCol = o;
		$("#calculate-modal").modal();
		
	};
	
	

	$scope.editFormat = function (o) {
		$uibModal.open({
			templateUrl: 'templates/chart/vFromatter.html',
			windowTemplateUrl: 'templates/chart/window.html',
			backdrop: false,
			size: 'lg',
			controller: function ($scope, $uibModalInstance) {
				$scope.type = ['number','size','date'];
				$scope.c_type = o.c_type ? o.c_type : 'number';

				$scope.close = function () {
					$uibModalInstance.close();
				};
				$scope.ok = function () {
					o.c_type = $scope.c_type;

					$uibModalInstance.close();
				};
			}
		});
	};

	self.categories = [];
	$scope.oneAtATime = true;
	$scope.status = {
			isCustomHeaderOpen: false,
			isFirstOpen: true,
			isFirstDisabled: false
	};
	self.conditionDetails = [] ;

	$scope.loadEventsOrRules = function(){
		if(self.widget.option === 'events'){
			var data = self.categoryInformation[self.widget.category];
			self.conditionDetails = [] ;
			if(data){
				for(var i=0;i<data.length;i++){
					self.conditionDetails.push(data[i].conditionName);
				}
			}
			var args = {
					field:"event_category",
					value:self.widget.category
			}
			args['subType'] = "equals"
				$rootScope.$broadcast('widget-apply-filter', args);
		}else if(self.widget.option === 'rules'){
			var data = self.categoryInformation[self.widget.category];
			self.conditionDetails = [] ;
			if(data){
				for(var i=0;i<data.length;i++){
					self.conditionDetails.push(data[i].correlationName);
				}
			}
			var args = {
					field:"rule_category",
					value:self.widget.category
			}
			args['subType'] = "equals"
				$rootScope.$broadcast('widget-apply-filter', args);
		}if(self.widget.option === 'alert'){
			var data = self.categoryInformation[self.widget.category];
			self.conditionDetails = [] ;
			if(data){
				for(var i=0;i<data.length;i++){
					self.conditionDetails.push(data[i].alertName);
				}
			}
			var args = {
					field:"alert_category",
					value:self.widget.category
			}
			args['subType'] = "equals"
				$rootScope.$broadcast('widget-apply-filter', args);
		}
	}

	$scope.changeEventCategoryType = function(){

		if(self.widget.option === 'events'){
			var args = {
					field:"event_name",
					value:self.widget.categoryType
			}

			args['subType'] = "equals"
				$rootScope.$broadcast('widget-apply-filter', args);
		}else if(self.widget.option === 'rules'){
			var args = {
					field:"rule_name",
					value:self.widget.categoryType
			}

			args['subType'] = "equals"
				$rootScope.$broadcast('widget-apply-filter', args);
		}
		else if(self.widget.option === 'alert'){
			var args = {
					field:"name",
					value:self.widget.categoryType
			}

			args['subType'] = "equals"
				$rootScope.$broadcast('widget-apply-filter', args);
		}




	}


	$scope.filterFileds = function(){
		var tempArray = [];
		if(self.widget.option === 'events' && self.widget.category!= 'All' && self.widget.categoryType==='All'){
			var category = self.categoryInformation[self.widget.category];
			$scope.schema.selects = [];
			for(var i=0;i<category.length;i++){
				var keys = Object.keys(category[i].fields);
				for(var j=0;j<keys.length;j++){

					tempArray.push(keys[j].toLowerCase());
					// $scope.schema.selects.push({column:keys[j].toUpperCase()}
					// );
				}

			}
		}
		if(self.widget.option === 'events' && self.widget.category!= 'All' && self.widget.categoryType!='All'){
			var category = self.categoryInformation[self.widget.category];
			$scope.schema.selects = [];
			for(var i=0;i<category.length;i++){
				if(category[i].conditionName===self.widget.categoryType){
					var keys = Object.keys(category[i].fields);
					for(var j=0;j<keys.length;j++){
						tempArray.push(keys[j].toLowerCase());

					}
				}
			}
		}

		if(self.widget.option === 'rules' && self.widget.category!= 'All' && self.widget.categoryType==='All'){
			var category = self.categoryInformation[self.widget.category];
			$scope.schema.selects = [];
			for(var i=0;i<category.length;i++){
				var keys = category[i].aggergationField.split(",");
				for(var j=0;j<keys.length;j++){

					tempArray.push(keys[j].toLowerCase());
					// $scope.schema.selects.push({column:keys[j].toUpperCase()}
					// );
				}

			}
		}
		if(self.widget.option === 'rules' && self.widget.category!= 'All' && self.widget.categoryType!='All'){
			var category = self.categoryInformation[self.widget.category];
			$scope.schema.selects = [];
			for(var i=0;i<category.length;i++){
				if(category[i].correlationName===self.widget.categoryType){
					var keys = category[i].aggergationField.split(",");
					for(var j=0;j<keys.length;j++){
						tempArray.push(keys[j].toLowerCase());

					}
				}
			}
		}

		var uniqueArray = Array.from(new Set(tempArray));
		if(uniqueArray.legth!=0 && self.widget.option === 'events'){
			uniqueArray.push("event_name".toLowerCase());
			uniqueArray.push("event_category".toLowerCase());
			uniqueArray.push("event_time".toLowerCase());
			uniqueArray.push("events_tags".toLowerCase());

		}
		if(uniqueArray.legth!=0 && self.widget.option === 'rules'){
			uniqueArray.push("rule_name".toLowerCase());
			uniqueArray.push("rule_category".toLowerCase());
			uniqueArray.push("event_time".toLowerCase());
			uniqueArray.push("rules_tags".toLowerCase());

		}

		if(uniqueArray.legth!=0 && self.widget.option === 'alert'){
			uniqueArray.push("name".toLowerCase());
			uniqueArray.push("alert_category".toLowerCase());
			uniqueArray.push("priroirty".toLowerCase());
			uniqueArray.push("rule".toLowerCase());
			uniqueArray.push("TATIC".toLowerCase());
			uniqueArray.push("TECHNIQUE".toLowerCase());
			uniqueArray.push("LEVEL_OF_COVERAGE".toLowerCase());
			uniqueArray.push("ANALYTIC_TYPE".toLowerCase());



		}
		data["fields"] = {};

		for(var i=0;i<uniqueArray.length;i++){
			$scope.schema.selects.push({column:uniqueArray[i]} );
			if(uniqueArray[i] === 'event_tags' || uniqueArray[i] === 'rule_tags'){
				data.fields[uniqueArray[i]] = { type: 'multi',title:uniqueArray[i],field:uniqueArray[i]};
			}else{
				data.fields[uniqueArray[i]] = { type: 'term',title:uniqueArray[i],field:uniqueArray[i]};
			}


		}
	}



	self.categoryInformation  ;

	self.showCategories = function(){

		self.categoryInformation = {};
		self.categories = [];

		if(self.widget.option === 'events'){

			conditionFactory.getConditionsWithCategory().then(function (response) {
				unloader("body");
				self.categoryInformation = response.data;
				var keys = Object.keys(response.data);
				for(var i = 0 ;i<keys.length;i++){
					self.categories.push(keys[i]);
				}


			}, function (error) {
				unloader("body");
				if(error.status== 403){
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
					unloader("body");
				}
			});

		}else if(self.widget.option === 'rules'){
			conditionFactory.getRulesWithCategory().then(function (response) {
				unloader("body");
				self.categoryInformation = response.data.ruleDetails;
				var keys = Object.keys(response.data.ruleDetails);
				for(var i = 0 ;i<keys.length;i++){
					self.categories.push(keys[i]);
				}


			}, function (error) {
				unloader("body");
				if(error.status== 403){
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
					unloader("body");
				}
			});
		}	
		else if(self.widget.option === 'alert'){
			alertsFactory.getAlertsByCategory().then(function (response) {
				unloader("body");
				self.categoryInformation = response.data;
				var keys = Object.keys(response.data);
				for(var i = 0 ;i<keys.length;i++){
					self.categories.push(keys[i]);
				}


			}, function (error) {
				unloader("body");
				if(error.status== 403){
					self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

					$timeout(function () {
						self.alertMessagaes = [];
					}, 2000);
					unloader("body");
				}
			});
		}	
	}




	self.doPreview = function(){
		$scope.schema = {selects: []};




		var regex = new RegExp("^[A-Za-z0-9-\\s_ ]+$"); 	

		if(typeof self.widget.title === "undefined" || self.widget.title==="" ){
			self.alertMessagaes.push({ type: 'danger', msg: "Title Can't be empty" });
			return false;
		}

		if(typeof self.widget.option === "undefined" || self.widget.option==="" ){
			self.alertMessagaes.push({ type: 'danger', msg: "Choose One of the following Can't be empty" });
			return false;
		}






		if(!regex.test(self.widget.title)){
			self.alertMessagaes.push({ type: 'danger', msg: "Title should not contain special characters.  " });
			return false;
		}

		$timeout(function () {
			self.alertMessagaes.splice(0, 1);
		}, 2000);


		self.widget.dataSetTitle = parseInt(self.widget.dataSetTitle);
		loader("body");
		widgetService.preview(self.widget).then(function (response) {
			unloader("body");
			$scope.showPerview = true;
			$scope.schema = {selects: []};

			data["fields"] = {};



			angular.forEach(response.data.data, function (key) {
				$scope.schema.selects.push({column: key});
				try{
					var keyValue = "";
				if(key.includes("rule_data.event_data.")){
					keyValue = key.replace("rule_data.event_data.","");
				}else if(key.includes("event_data.")){
					keyValue = key.replace("event_data.","");
				}else{
					keyValue = angular.copy(key);
				}
				}catch(err){console.log(err)};
				if(keyValue==='event_tags'){
					data.fields[keyValue] = { type: 'multi',title:keyValue,field:keyValue,choices:self.tagDetails};
				}else{
					data.fields[keyValue] = { type: 'term',title:keyValue,field:keyValue};
				}

			});

			// self.widget.streamName =
			// response.data.streamName.replace(";","");
			// self.widget.id = self.widget
			$scope.newConfig();
			$scope.templateUrl = "editWidgetDetails.html"
				$scope.getChartView();
			self.showCategories();
			data.needsUpdate = true;


		}, function (error) {
			unloader("body");
			if(error.status== 403){
				self.alertMessagaes.push({ type: 'danger', msg: error.data.data });

				$timeout(function () {
					self.alertMessagaes = [];
				}, 2000);
				unloader("body");
			}
		});








	}

	$scope.targetHighlight = {
			row: false, column: false, value: false, filter: false
	};

	$scope.onDragstart = function (type) {
		switch (type) {
		case 'dimension':
			$scope.targetHighlight = {row: true, column: true, value: false, filter: true};
			break;
		case 'measure':
		case 'exp':
			$scope.targetHighlight = {row: false, column: false, value: true, filter: false};
			break;
		case 'filterGroup':
			$scope.targetHighlight.filter = true;
			break;
		case 'select':
			$scope.targetHighlight = {row: true, column: true, value: true, filter: true};
			break;
		}
	};

	$scope.onDragCancle = function () {
		$timeout($scope.targetHighlight = {
				row: false, column: false, value: false, filter: false
		}, 500);
	};

	var configToDataSeries = function (config) {
		switch (config.type) {
		case 'exp':
			return getExpSeries(config.exp);
			break;
		default:
			return [{
				name: config.col,
				aggregate: config.aggregate_type,
				percentile: config.percentile,
				calculate: config.calculate,
				configuration:config.configuration
			}];
		break;
		}
	};


	var getDataSeries = function (chartConfig) {
		var result = [];
		_.each(chartConfig.values, function (v) {
			_.each(v.cols, function (c) {
				var series = configToDataSeries(c);
				_.each(series, function (s) {
					if (!_.find(result, function (e) {
						return JSON.stringify(e) == JSON.stringify(s);
					})) {
						result.push(s);
					}
				});
			});
		});
		return result;
	};


	var getDimensionConfig = function (array) {
		var result = [];
		if (array) {
			_.each(array, function (e) {
				if (_.isUndefined(e.group)) {
					result.push({columnName: e.col, filterType: e.type, values: e.values, id: e.id});
				} else {
					_.each(e.filters, function (f) {
						result.push({columnName: f.col, filterType: f.type, values: f.values});
					});
				}
			});
		}
		return result;
	};

	function  generateMapData(chartContainer,chartData){
		myChart = echarts.init(chartContainer, 'chalk');

		var siersMap = [];
		var lables = [];
		for(var i=0;i<chartData.length;i++){

			lables.push(chartData[i].name);
			siersMap.push({
				name: chartData[i].name,
				type: 'effectScatter',
				coordinateSystem: 'geo',
				data: chartData[i].data,
				symbolSize: function (val) {
					return 20;
				},
				showEffectOn: 'render',
				rippleEffect: {
					brushType: 'stroke'
				},
				label: {
					normal: {
						formatter: '{b}',
						position: 'right',
						show: false
					}
				},
				itemStyle: {
					normal: {
						color: chartData[i].color,
						shadowBlur: 10,
						shadowColor: '#333'
					}
				},
			})



		}

		option = {
				backgroundColor: '#404a59',
				title: {

					left: 'center',
					textStyle: {
						color: '#fff'
					}
				},
				tooltip : {
					trigger: 'item'
				},
				legend: {
					orient: 'vertical',
					y: 'bottom',
					x:'right',
					data:lables,
					textStyle: {
						color: 'black'
					}
				},
				geo: {
					map: 'world',
					label: {
						emphasis: {
							show: false
						}
					},
					center : [115.97, 29.71],
					zoom:4,
					roam: true,
					itemStyle: {
						normal: {
							areaColor: '#323c48',
							borderColor: '#111'
						},
						emphasis: {
							areaColor: '#2a333d'
						}
					}
				},
				series:siersMap

		}



		console.log(option)
		// use configuration item and data specified to show chart
		myChart.setOption(option);
		self.widget.options =  JSON.stringify(option);
	}

	function generateAreaChart(chartContainer,chartData){

		myChart = echarts.init(chartContainer, 'chalk')

		// specify chart configuration item and data
		var option = {
			grid: {
				x: 40,
				x2: 20,
				y: 35,
				y2: 25
			},

			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data:chartData.catgories
			},
			toolbox: {
				show: true,
				orient: 'horizontal',
				right:12,
				feature: {


					saveAsImage: {
						show: true,
						title: 'Download',
						lang: ['Save']
					},
					iconStyle : {
						textAlign : 'right'
					}

				}
			},

			xAxis : [
				{
					type : 'category',
					boundaryGap : false,
					data : chartData.legend,
					axisLabel : {"margin":4}
				}
				],
				yAxis : [
					{
						type : 'value',
						axisLabel : {"margin":4}
					}
					],
					series : chartData.series
		};

		// use configuration item and data specified to show chart
		myChart.setOption(option);
		self.widget.options =  JSON.stringify(option);

	}


	function generateVerticalBarChart(chartContainer,chartData){
		myChart = echarts.init(chartContainer, 'walden')
		myChart.clear();
		var tempData = [];
		for(var i=0;i<chartData.series.length;i++){
			tempData.push({
				type: 'bar',
				itemStyle: {
					normal: {
						label: {
							show: true,
							textStyle: {
								fontWeight: 500
							}
						}
					}
				},
				animation: true,
				data : chartData.series[i].data
			});

		}

		basic_columns_options = {
				grid: {
					x: 40,
					x2: 40,
					y: 35,
					y2: 25
				},
				tooltip: {
					trigger: 'axis'
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					data : chartData.catgories,
					axisLabel : {"margin":4}
				}],
				yAxis: [{
					type: 'value',
					axisLabel : {"margin":4}
				}],
				toolbox: {
					show: true,
					orient: 'horizontal',
					right:12,
					feature: {



						saveAsImage: {
							show: true,
							title: 'Download',
							lang: ['Save']
						}
					}
				},
				series : tempData
		}

		myChart.setOption(basic_columns_options);
		self.widget.options =JSON.stringify(basic_columns_options);



	}

	function generateBarChart(chartContainer,chartData){

		myChart = echarts.init(chartContainer, 'walden')
		myChart.clear();
		var tempData = [];
		for(var i=0;i<chartData.series.length;i++){

			if(self.widget.chartSubType=="basic"){
				tempData.push({
					name : chartData.catgories[i],
					type: 'bar',
					itemStyle: {
						normal: {
							label: {
								show: true,
								textStyle: {
									fontWeight: 500
								}
							}
						}
					},
					animation: true,
					data : chartData.series[i].data
				});
			}if(self.widget.chartSubType=="stacked"){
				tempData.push({
					name : chartData.catgories[i],
					type: 'bar',
					stack: 'Total',
					itemStyle: {
						normal: {
							label: {
								show: true,
								textStyle: {
									fontWeight: 500
								}
							}
						}
					},
					animation: true,
					data : chartData.series[i].data
				});
			}
		}

		stacked_bars_options = {

				// Setup grid
				grid: {
					x: 75,
					x2: 25,
					y: 35,
					y2: 25
				},

				// Add tooltip
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},

				// Add legend
				legend: {
					data:chartData.catgories
				},

				// Enable drag recalculate
				calculable: true,
				toolbox: {
					show: true,
					orient: 'horizontal',
					right:12,
					feature: {


						saveAsImage: {
							show: true,
							title: 'Download',
							lang: ['Save']
						}
					}
				},
				// Horizontal axis
				xAxis: [{
					type: 'value',
					axisLabel : {"margin":4}
				}],

				// Vertical axis
				yAxis: [{
					type: 'category',
					data: chartData.legend,
					axisLabel : {"margin":4}
				}],

				// Add series
				series: tempData
		};


		myChart.setOption(stacked_bars_options);
		self.widget.options =JSON.stringify(stacked_bars_options);

	}

	function generatePieChart(chartContainer,chartData){

		myChart = echarts.init(chartContainer, 'walden')

		var tempData = [];
		for(var i=0;i<chartData.series.length;i++){
			if(self.widget.chartSubType!="pie"){
				tempData.push({
					name : self.widget.title,
					type: 'pie',
					radius: ['50%', '70%'],
					center: ['50%', '57.5%'],
					itemStyle: {
						normal: {
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						}

					},
					// color : chartData.series[i].color,
					data : chartData.series[i].data
				});
			}else{
				tempData.push({
					name : self.widget.title,
					type: 'pie',

					itemStyle: {
						normal: {
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						}
					},
					// color : chartData.series[i].color,
					data : chartData.series[i].data
				});
			}

		}

		basic_donut_options = {



				// Add legend
				legend: {
					orient: 'vertical',
					x: 'left',
					data: chartData.catgories
				},

				// Display toolbox
				toolbox: {
					show: true,
					orient: 'horizontal',
					right:12,
					feature: {

						saveAsImage: {
							show: true,
							title: 'Download',
							lang: ['Save']
						}
					}
				},

				// Enable drag recalculate
				calculable: true,

				// Add series


				series: tempData
		};


		myChart.setOption(basic_donut_options);
		self.widget.options =JSON.stringify(basic_donut_options);

	}



	$(window).on('resize', function(){
		if(myChart != null && myChart != undefined){
			myChart.resize();
		}
	});

	$scope.queryAceOpt = datasetEditorOptions();

	$scope.filterData = '{"group": {"operator": "AND","rules": []}}';

	function htmlEntities(str) {
		return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}	

	function computed(group) {
		console.log("test>>>"+group)
		if (!group) return "";
		for (var str = "(", i = 0; i < group.rules.length; i++) {
			i > 0 && (str += " " + group.operator + " ");
			if(group.rules[i].field.name){
				if( group.rules[i].field.name.indexOf(".") > -1){

					// event_data['TargetUserName'] = 'administrator')
					str += group.rules[i].group ?
							computed(group.rules[i].group) :
								group.rules[i].field.name.split(".")[0]+"['"+group.rules[i].field.name.split(".")[1]+"']" + " " + htmlEntities(group.rules[i].condition) + " '" + group.rules[i].data+"'";
				}else{

					if(group.rules[i].condition === "%%"){
						str += group.rules[i].group ?
								computed(group.rules[i].group) :
									group.rules[i].field.name +  " like '%" + group.rules[i].data+"%'";
					}
					else if(group.rules[i].condition === "_%"){
						str += group.rules[i].group ?
								computed(group.rules[i].group) :
									group.rules[i].field.name +  " like '" + group.rules[i].data+"%'";
					}
					else if(group.rules[i].condition === "%_"){
						str += group.rules[i].group ?
								computed(group.rules[i].group) :
									group.rules[i].field.name +  " like '%" + group.rules[i].data+"'";
					}else if(group.rules[i].condition === "in"){

						var inData = [];
						var tempData = group.rules[i].data.split(",");
						for(var j=0;j<tempData.length;j++){
							inData.push("'"+tempData[j]+"'");
						}
						str += group.rules[i].group ?
								computed(group.rules[i].group) :
									group.rules[i].field.name+ " in ("+inData.join(',')+")";
					}
					else if(group.rules[i].condition === "not_in"){
						var inData = [];
						var tempData = group.rules[i].data.split(",");
						for(var j=0;j<tempData.length;j++){
							inData.push("'"+tempData[j]+"'");
						}
						str += group.rules[i].group ?
								computed(group.rules[i].group) :
									group.rules[i].field.name+ " not in ("+inData.join(',')+")";

					}else{
						str += group.rules[i].group ?
								computed(group.rules[i].group) :
									group.rules[i].field.name + htmlEntities(group.rules[i].condition) + " '" + group.rules[i].data+"'";
					}



				}
			}


		}

		return str + ")";
	}
	$scope.dashboardfilter = JSON.parse($scope.filterData);
	self.selectFields = [];
	$scope.$watch('dashboardfilter', function (newValue) {
		$scope.json = JSON.stringify(newValue, null, 2);
		$scope.output = computed(newValue.group);

		for(var i=0;i<newValue.group.rules.length;i++){
			if(self.selectFields.indexOf(newValue.group.rules[i].field)==-1){
				if(newValue.group.rules[i].field.name){
					if( newValue.group.rules[i].field.name.indexOf(".") > -1){
						self.selectFields.push(newValue.group.rules[i].field.name.split(".")[0]);
					}else{
						self.selectFields.push(newValue.group.rules[i].field.name);
					}
				}


			}
		}

	}, true);


	$scope.editWidget = function(){
		if($routeParams.widgetId){
			console.log(parseInt($routeParams.widgetId));
			self.edit(parseInt($routeParams.widgetId));
		}
	}




	self.historyBack = function(){
		window.history.back();
	}


	self.columnDefs = [
		{headerName: "Title",field: "title",width: 150,checkboxSelection: true,sort: 'asc',enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Created By",field: "createdBy",width: 150,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}},
		{headerName: "Updated At",field: "updatedAt", valueGetter: function(params) {
			if(params.data != undefined && params.data.updatedAt != null){
				return moment(params.data.updatedAt).format("L LT");
			}
		},comparator: dateComparator,width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		{headerName: "Updated By",field: "updatedBy",width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		{headerName: "Created At",field: "createdDate",valueGetter: function(params) {
			if(params.data != undefined && params.data.createdDate != null){
				return moment(params.data.createdDate).format("L LT");
			}
		},comparator: dateComparator,width: 150,hide: false,enableRowGroup: true,filter: 'agTextColumnFilter',filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true,hide: true}},
		]

	
	
	self.loadAgGrid = function(){


		$timeout(function(){


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

//						defaultToolPanel: 'columns'
					},
					rowData: $scope.widgets,
					rowSelection: 'single',
					floatingFilter:true,
					rowGroupPanelShow: 'always',
					onSelectionChanged: self.onSelectionChanged,
					onFirstDataRendered(params) {
						params.api.sizeColumnsToFit();
					},
					onGridReady: function (params) {
				        window.onresize = () => {
				        	setTimeout(function(){
					           params.api.sizeColumnsToFit();
					           $("#widgetContent").css("height",$(window).height()-250+"px");
				        	},500);
				        }
					}
			}
			$("#widgetContent").empty();
			self.widgetId = [];
			$("#editButton").hide();
			$("#deleteButton").hide();
			$("#widgetContent").css("height",$(window).height()-250+"px");
			if(self.eventGrid.api != undefined && self.eventGrid.api.getSelectedRows().length > 0){			
				self.eventGrid.api.deselectAll();
			}
			var eGridDiv =  document.querySelector('#widgetContent');
			new agGrid.Grid(eGridDiv, self.eventGrid );
		},250);
	}


	self.onSelectionChanged = function() {
		self.widgetId = [];
		$("#editButton").hide();
		$("#deleteButton").hide();
		self.widgetId = angular.copy(self.eventGrid.api.getSelectedRows());
		if(self.widgetId.length > 0){			
			$("#editButton").show();
			$("#deleteButton").show();
		}else{
			$("#editButton").hide();
			$("#deleteButton").hide();
		}
	}
	
	$(window).resize(function() {
		setTimeout(function() {
			self.eventGrid.api.sizeColumnsToFit();
			$("#widgetContent").css("height",$(window).height()-250+"px");
		}, 500);
	});

}]);

app.directive('widgetqueryBuilder', ['$compile','conditionFactory', function ($compile,conditionFactory) {
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

				// scope.addCondition(scope.group);
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

