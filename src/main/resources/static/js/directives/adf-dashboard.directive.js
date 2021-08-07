/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc directive
 * @name adf.directive:adfDashboard
 * @element div
 * @restrict EA
 * @scope
 * @description
 *
 * `adfDashboard` is a directive which renders the dashboard with all its
 * components. The directive requires a name attribute. The name of the
 * dashboard can be used to store the model.
 *
 * @param {string} name name of the dashboard. This attribute is required.
 * @param {boolean=} editable false to disable the editmode of the dashboard.
 * @param {boolean=} collapsible true to make widgets collapsible on the dashboard.
 * @param {boolean=} maximizable true to add a button for open widgets in a large modal panel.
 * @param {boolean=} enableConfirmDelete true to ask before remove an widget from the dashboard.
 * @param {string=} structure the default structure of the dashboard.
 * @param {object=} adfModel model object of the dashboard.
 * @param {function=} adfWidgetFilter function to filter widgets on the add dialog.
 * @param {boolean=} continuousEditMode enable continuous edit mode, to fire add/change/remove
 *                   events during edit mode not reset it if edit mode is exited.
 * @param {boolean=} categories enable categories for the add widget dialog.
 */

angular.module('adf')
.directive('adfDashboard', function ($rootScope, $log, $timeout, $uibModal, dashboard, adfTemplatePath, adfDashboardService, adfUtilsService,widgetService) {
	'use strict';

	return {
		replace: true,
		restrict: 'EA',
		transclude : false,
		scope: {
			structure: '@',
			name: '@',
			collapsible: '@',
			editable: '@',
			editMode: '@',
			continuousEditMode: '=',
			maximizable: '@',
			adfModel: '=',
			adfWidgetFilter: '=',
			categories: '@'
		},
		controller: controller,
		link: link,
		templateUrl: adfTemplatePath + 'dashboard.html'

	};


	/**
	 * Opens the edit mode of the specified widget.
	 *
	 * @param dashboard scope
	 * @param widget
	 */
	function _openEditMode($scope, widget){
		// wait some time before fire enter edit mode event
		$timeout(function(){
			$scope.$broadcast('adfWidgetEnterEditMode', widget);
		}, 200);
	}

	/**
	 * Directive controller function.
	 *
	 * @param dashboard scope
	 */
	var promise;
	function controller($scope, $interval,$location){
		var model = {};
		var structure = {};
		var widgetFilter = null;
		var structureName = {};
		var name = $scope.name;
		var count = 0;
		var self = this;

		var threeRow = {"rows":[{"columns" : [{"styleClass":"col-md-4",widgets:[]},{"styleClass":"col-md-4",widgets:[]},{"styleClass":"col-md-4",widgets:[]}]}]};


		dashboard.structures["3-3-3"] = threeRow;




		$scope.addFilter = function(){
			var opt = { 
					startDate: $scope.startDate, 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:$scope.dateLable,
					filter : $scope.output

			}
			$scope.$broadcast('widgetReload',opt);


		}

		$scope.clearFilter = function(){

			model['filter']= "";
			var opt = { 
					startDate: $scope.startDate, 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:$scope.dateLable,
					filter : ""

			}
			$scope.$broadcast('widgetReload',opt);
			var data = '{"group": {"operator": "AND","rules": []}}';
			$scope.dashboardfilter = JSON.parse(data);
		}



		var promise ;

		$scope.live = false;


		$scope.switchOnLive = function(){
			if(!$scope.live){
				promise =	$interval(function() {
					$scope.refreshData();
				}, 30000);
				$scope.live = true;
				return false;
			}
			if($scope.live){
				if (angular.isDefined(promise)) {
					$interval.cancel(promise);
					promise = undefined;
					$scope.live = false;
					return false;
				}
			}

		}





		$scope.refreshData = function(){
			var startDate = moment(new Date()).subtract(15, 'minutes');

			var endDate = moment(new Date());

			for(var i=0;i<model.rows.length;i++){
				for(var j=0;j<model.rows[i].columns.length;j++){
					for(var k=0;k<model.rows[i].columns[j].widgets.length;k++){
						model.rows[i].columns[j].widgets[k]["timeRange"] = {"startDate":startDate.valueOf(),"endDate":endDate.valueOf(), "label":startDate.format('YYYY/MM/DD HH:mm:ss') + ' - ' + moment(endDate).format('YYYY/MM/DD HH:mm:ss')};
					}

				}
			}

			$rootScope.$broadcast('widgetReload');
		}

		$scope.$on('$destroy', function(){

			$interval.cancel(promise);
			promise = undefined;

		});

		// Watching for changes on adfModel
		$scope.$watch('adfModel', function(oldVal, newVal) {
			// has model changed or is the model attribute not set
			if (newVal !== null || (oldVal === null && newVal === null)) {
				model = $scope.adfModel;
				widgetFilter = $scope.adfWidgetFilter;
				if ( ! model || ! model.rows ){
					structureName = $scope.structure;
					structure = dashboard.structures[structureName];
					if (structure){
						if (model){
							model.rows = angular.copy(structure).rows;
						} else {
							model = angular.copy(structure);
						}
						model.structure = structureName;
					} else {
						$log.error( 'could not find structure ' + structureName);
					}
				}

				if (model) {
					if (!model.title){
						model.title = 'Dashboard';
					}
					if (!model.titleTemplateUrl) {
						model.titleTemplateUrl = adfTemplatePath + 'dashboard-title.html';

					}
					//model["tableDataHeaders"] = ["col"]
					//model["tableData"] = [];
					$scope.model = model;

				} else {
					$log.error('could not find or create model');
				}
			}

		}, true);

		// edit mode
		$scope.editMode = false;
		$scope.editClass = '';

		//passs translate function from dashboard so we can translate labels inside html templates
		$scope.translate = dashboard.translate;

		function getNewModalScope() {
			var scope = $scope.$new();
			//pass translate function to the new scope so we can translate the labels inside the modal dialog
			scope.translate = dashboard.translate;
			return scope;
		}

		$scope.alertMessagaes = [];
		$scope.toggleEditMode = function(){
			$scope.editMode = ! $scope.editMode;


			if ($scope.editMode){
				if (!$scope.continuousEditMode) {
					$scope.modelCopy = angular.copy($scope.adfModel, {});
					$rootScope.$broadcast('adfIsEditMode');
				}
			}

			if (!$scope.editMode){


				$rootScope.$broadcast('widgetReload');

				widgetService.saveDashboard(model).then(function (response) {						
					if(response.data.status){			
						model["id"] = response.data.id;
						$scope.alertMessagaes.push({type:"success",msg:"Dashboard saved successfully"});						
					}

					if(!response.data.status){
						$scope.alertMessagaes.push({type:"danger",msg:"Something went wrong please try again.."});						
					}
					$timeout(function(){
						$scope.alertMessagaes= [];
					},2500);

				}, function (error) {
					$scope.alertMessagaes.push({type:"danger",msg:"Something went wrong please try again.."});
					$timeout(function(){
						$scope.alertMessagaes= [];
					},2500);
				});



				$rootScope.$broadcast('adfDashboardChanged', name, model);
			}
		};

		$scope.$on('adfToggleEditMode', function() {
			$scope.toggleEditMode();
		});

		$scope.collapseAll = function(collapseExpandStatus){
			$rootScope.$broadcast('adfDashboardCollapseExpand',{collapseExpandStatus : collapseExpandStatus});
		};

		$scope.cancelEditMode = function(){
			$scope.editMode = false;
			if (!$scope.continuousEditMode) {
				$scope.modelCopy = angular.copy($scope.modelCopy, $scope.adfModel);
			}
			$rootScope.$broadcast('adfDashboardEditsCancelled');
		};

		// edit dashboard settings
		$scope.editDashboardDialog = function(){
			var editDashboardScope = getNewModalScope();
			// create a copy of the title, to avoid changing the title to
			// "dashboard" if the field is empty
			editDashboardScope.copy = {
					title: model.title
			};

			widgetService.loadAllThemes().then(function (response) {

				var themes = response.data.themes;

				var widgets = response.data.widgets;

				var roles =  response.data.roles;
				var rolesArray = [];
				for(let i=0;i<roles.length;i++){
					rolesArray.push(roles[i].rolename);
				}

				model['themes'] = themes;
				model['widgets'] = widgets;
				model['roles'] = roles;
				model['rolesArray'] = angular.copy(rolesArray);


			}, function (error) {

			});

			// pass dashboard structure to scope
			editDashboardScope.structures = dashboard.structures;

			// pass split function to scope, to be able to display structures in multiple columns
			editDashboardScope.split = adfUtilsService.split;

			var adfEditTemplatePath = adfTemplatePath + 'dashboard-edit.html';
			if(model.editTemplateUrl) {
				adfEditTemplatePath = model.editTemplateUrl;
			}
			var instance = $uibModal.open({
				scope: editDashboardScope,
				templateUrl: adfEditTemplatePath,
				backdrop: 'static',
				windowClass: 'adf-edit-dashboard-modal',
				size: 'lg'
			});
			editDashboardScope.changeStructure = function(name, structure){
				$log.info('change structure to ' + name);
				adfDashboardService.changeStructure(model, structure);
				if (model.structure !== name){
					model.structure = name;
				}
			};



			editDashboardScope.closeDialog = function(){
				// copy the new title back to the model
				model.title = editDashboardScope.copy.title;
				// close modal and destroy the scope
				instance.close();
				editDashboardScope.$destroy();
			};
		};

		$scope.showFilter = false;

		$scope.openFliter = function(){
			$scope.showFilter = ! $scope.showFilter;
			if($scope.showFilter){
				$scope.showFilter = false;
			}else{
				$scope.showFilter = true;
			}
		}
		
		
		



		$scope.exportToPdf = function(title){
			html2canvas(document.getElementById('dashboard'), {
				onrendered: function (canvas) {
					var data = canvas.toDataURL();
					var docDefinition = {
							content: [{
								image: data,
								width: 500,
							}]
					};
					pdfMake.createPdf(docDefinition).download(title+".pdf");
				}
			});
		}
		
		$scope.json = null;
		$scope.output= "";



		$scope.$on('reloadDashboard', function(event, opt) {

			$rootScope.$broadcast('widgetReload',opt);
		})

		$scope.changeTheme = function(themeName){
			$scope.$parent.$parent.themeName = themeName;
			$scope.$parent.$parent.$broadcast('themeChanged');
			if(angular.equals(themeName,"Theme-green.css")){
				model.theme = "wonderland";
			}else if(angular.equals(themeName,"Theme-blue.css")){
				model.theme = "walden";
			}else if(angular.equals(themeName,"black-theme.css")){
				model.theme = "chalk";
			}
			if(Array.isArray(model.rows)){
				for(var i=0;i<model.rows.length;i++){
					for(var j=0;j<model.rows[i].columns.length;j++){
						for(var k=0;k<model.rows[i].columns[j].widgets.length;k++){
							model.rows[i].columns[j].widgets[k]["timeRange"] = null;
							model.rows[i].columns[j].widgets[k]["renderAllWidgets"] = true;
							model.rows[i].columns[j].widgets[k]["singelWidget"] = false;

						}

					}
				}
			}



//			widgetService.saveDashboard(model).then(function (response) {						
//			if(response.data.status){			
//			model["id"] = response.data.id;
//			}else{
//			}
//			}, function (error) {
//			});
//			$rootScope.$broadcast('widgetReload');
		}

		$scope.startDate = "";
		$scope.endDate = "";

		$scope.labelName = "Last 24 hours"
			$scope.dateLable = "last24Hours"

		$scope.setRelativeTime = function(option,labelName){

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
			$scope.dateLable = option;
			$scope.applyWithOutCustomRagne();
		}





		$scope.apply = function(){

			$scope.labelName = moment(parseInt($scope.startDate)).format('MM/DD/YYYY HH:mm:ss') + ' - ' + moment(parseInt($scope.endDate)).format('MM/DD/YYYY HH:mm:ss');


			var opt = { 
					startDate: $scope.startDate, 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:$scope.dateLable,
					filter : $scope.output
			}
			$scope.$broadcast('widgetReload',opt);
		}

		$scope.applyWithOutCustomRagne = function(){



			var opt = { 
					startDate: $scope.startDate, 
					endDate: $scope.endDate,
					renderAllWidgets:true,
					dateLabel:$scope.dateLable,
					filter : $scope.output
			}
			$scope.$broadcast('widgetReload',opt);
		}

		$scope.setRelativeTime($scope.dateLable,$scope.labelName);


		var filterQUery = $location.search().filterQUery; 
		var startDate = $location.search().startDate; 
		var endDate = $location.search().endDate; 
		$scope.filterData = '{"group": {"operator": "AND","rules": []}}';
		if(typeof filterQUery != 'undefined'){
			var querykey = filterQUery.split("=")[0];
			var queryValue = filterQUery.split("=")[1];



			if(typeof startDate != 'undefined' && typeof startDate != 'undefined'){
				$scope.startDate = parseInt(startDate);
				$scope.endDate = parseInt(endDate);
				$scope.labelName = 		moment($scope.startDate).format('MM/DD/YYYY HH:mm:ss') + ' - ' + moment($scope.endDate).format('MM/DD/YYYY HH:mm:ss');

				$scope.displayStartDate = moment($scope.startDate).format('MM/DD/YYYY HH:mm:ss');
				$scope.displayEndDate = moment($scope.endDate).format('MM/DD/YYYY HH:mm:ss');

				$scope.dateLable = "last24Hours"
			}



			$scope.filterData = '{"group":{"operator":"AND","rules":[{"condition":"=","field":{"name":"'+querykey+'","$$hashKey":"object:296572"},"data":"'+queryValue+'"}]}}';

			setTimeout(function(){
				$scope.apply();		

			}, 3000);

		}else{
			setTimeout(function(){
				$scope.applyWithOutCustomRagne();		

			}, 3000);
		}





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

						//event_data['TargetUserName'] = 'administrator')
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

		self.callDatePicker =  function(){

			setTimeout(function(){ 

				$('#from-date').datepicker({
					format: {

						toDisplay: function (date, format, language) {
							var d = new Date(date);

							d.setDate(d.getDate() + 1);
							$scope.displayStartDate =  moment(d).format('MM/DD/YYYY HH:mm:ss');
							$scope.startDate = moment(d).valueOf();
							return $scope.displayStartDate;
						},
						toValue: function (date, format, language) {
							var d = new Date(date);

							d.setDate(d.getDate() + 1);

							$scope.displayStartDate =  moment(d).format('MM/DD/YYYY HH:mm:ss');
							$scope.startDate = moment(d).valueOf();
							return $scope.startDate;
						}
					},
					todayBtn: "linked",
					autoclose: true,
					todayHighlight: true
				});

				$('#to-date').datepicker({
					format: {

						toDisplay: function (date, format, language) {
							var d = new Date(date);
							d.setDate(d.getDate() + 1);
							$scope.endDate = moment(d).valueOf();
							$scope.displayEndDate = moment(d).format('MM/DD/YYYY HH:mm:ss')
							return $scope.displayEndDate;
						},
						toValue: function (date, format, language) {
							var d = new Date(date);
							d.setDate(d.getDate() + 1);
							$scope.endDate = moment(d).format('MM/DD/YYYY HH:mm:ss')
							return $scope.endDate;
						}
					},
					todayBtn: "linked",
					autoclose: true,
					todayHighlight: true
				});

			}, 3000);


		}

		self.callDatePicker();

		$scope.dashboardfilter = JSON.parse($scope.filterData);
		self.selectFields = [];
		$scope.$watch('dashboardfilter', function (newValue) {
			$scope.json = JSON.stringify(newValue, null, 2);
			$scope.output = computed(newValue.group);
			console.log($scope.output)
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
		// add widget dialog
		$scope.addWidgetDialog = function(){
			var addScope = getNewModalScope();
			var model = $scope.model;
			$scope.model["renderAllWidgets"] =true;
			var widgets;
			if (angular.isFunction(widgetFilter)){
				widgets = {};
				angular.forEach(dashboard.widgets, function(widget, type){
					if (widgetFilter(widget, type, model)){
						widgets[type] = widget;
					}
				});
			} else {

				widgetService.loadWidgets().then(function (response) {
					widgets = {};

					for(var i=0;i<response.data.length;i++){
						var jsonData = {};
						var tempJson = {};
						jsonData["title"] = response.data[i].title;
						jsonData["config"] = response.data[i].options;


						widgets[response.data[i].id] = jsonData;

					}
					addScope.widgets = widgets;
					var adfAddTemplatePath = adfTemplatePath + 'widget-add.html';
					if(model.addTemplateUrl) {
						adfAddTemplatePath = model.addTemplateUrl;
					}

					var opts = {
							scope: addScope,
							templateUrl: adfAddTemplatePath,
							windowClass: 'adf-add-widget-modal',
							backdrop: 'static'
					};

					var instance = $uibModal.open(opts);
					addScope.addWidget = function(widget){
						var w = {
								type: widget,
								config: adfDashboardService.createConfiguration(widget)
						};
						adfDashboardService.addNewWidgetToModel(model, w, name);
						// close and destroy
						instance.close();
						addScope.$destroy();

						// check for open edit mode immediately
						if (adfDashboardService.isEditModeImmediate(widget)){
							_openEditMode($scope, w);
						}
					};
					addScope.closeDialog = function(){
						// close and destroy
						instance.close();
						addScope.$destroy();
					};


				}, function (error) {

				});
				//widgets = dashboard.widgets;
			}

			//addScope.widgets = widgets;
			//pass translate function to the new scope so we can translate the labels inside the modal dialog
			addScope.translate = $scope.translate;

			// pass createCategories function to scope, if categories option is enabled
			if ($scope.options.categories){
				$scope.createCategories = adfDashboardService.createCategories;
			}



		};

		$scope.addNewWidgetToModel = adfDashboardService.addNewWidgetToModel;
	}





	$('li a[id^="downloadPNG_"]').click(function() {
	    var chart = $('#' + $(this).attr('id').replace("downloadPNG_", "")).highcharts();
	    chart.exportChartLocal({
	        type: 'image/png'
	    });
	});

	$('li a[id^="viewDataTable_"]').click(function() {
	    var chart = $('#' + $(this).attr('id').replace("viewDataTable_", "")).highcharts();
	        chartDiv = $(chart.renderTo);

	    if (chartDiv.is(":visible")) {
	        chartDiv.hide();
	        if (!chart.dataTableDiv) {
	            chart.update({
	                exporting: {
	                    showTable: true
	                }
	            });
	        } else {
	            $(chart.dataTableDiv).show();
	        }
	    } else {
	        chartDiv.show();
	        $(chart.dataTableDiv).hide();
	    }
	});
	
	var refreshData = function(){
		$rootScope.$broadcast('widgetReload');
	}





	function callWidgetsPicker (model,$scope){



	}



	/**
	 * Directive link function.
	 *
	 * @param dashboard scope
	 * @param directive DOM element
	 * @param directive attributes
	 */
	function link($scope, $element, $attr) {
		// pass options to scope
		var options = {
				name: $attr.name,
				editable: true,
				enableConfirmDelete: adfUtilsService.stringToBoolean($attr.enableConfirmDelete),
				maximizable: adfUtilsService.stringToBoolean($attr.maximizable),
				collapsible: adfUtilsService.stringToBoolean($attr.collapsible),
				categories: adfUtilsService.stringToBoolean($attr.categories)
		};
		if (angular.isDefined($attr.editable)){
			options.editable = adfUtilsService.stringToBoolean($attr.editable);
		}
		$scope.options = options;
	}
});


window.onresize = function() {


	



};


