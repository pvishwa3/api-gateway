
'use strict';

app.directive('pannelContent', function($log, $q, widgetService, $compile, $controller, $injector, dashboard,chartService) {

	return {
		replace: true,
		restrict: 'EA',
		transclude: false,
		scope: {
			adfModel: '=',
			model: '=',
			content: '='
		},
		link: link
	};

	function renderError($element, msg){
		$log.warn(msg);
		$element.html(dashboard.messageTemplate.replace(/{}/g, msg));
	}

	function compileWidget($scope, $element, currentScope,opt) {
		var model = $scope.model;
		var content = $scope.content;
	

		if(opt.renderAllWidgets){
			var newScope = currentScope;
			if (!model){
				renderError($element, 'model is undefined')
			} else if (!content){
				var msg = 'widget content is undefined, please have a look at your browser log';
				renderError($element, msg);
			} else {
				newScope = renderWidget($scope, $element, currentScope, model, content,opt);
			}
		}else{
			if($scope.model.singleWidget){
				var newScope = currentScope;
				if (!model){
					renderError($element, 'model is undefined')
				} else if (!content){
					var msg = 'widget content is undefined, please have a look at your browser log';
					renderError($element, msg);
				} else {
					newScope = renderWidget($scope, $element, currentScope, model, content,opt);
				}
			}
		}


		return newScope;
	}

	function compileWidgetTimeRangeWidget($scope, $element, currentScope) {
		var model = $scope.model;
		var content = $scope.content;

		var newScope = currentScope;
		if (!model){
			renderError($element, 'model is undefined')
		} else if (!content){
			var msg = 'widget content is undefined, please have a look at your browser log';
			renderError($element, msg);
		} else {
			newScope = renderTimeBasedWidget($scope, $element, currentScope, model, content);
		}
		return newScope;
	}

	function renderTimeBasedWidget($scope, $element, currentScope, model, content) {
		// display loading template

		var startDate =  $scope.model.timeRange.startDate
		var endDate =  $scope.model.timeRange.endDate

		setTimeout(function() {
			widgetService.loadSingleWidget($scope.content.id,startDate,endDate).then(function (response) {

//				alert();

				var id = $scope.content.id;
				model.title = response.data.title;
				
				var parentresponse = response;
				var width = $element.context.parentElement.offsetWidth;

				var heigth = width/2;

				var str =  '<div>'

					str+= '<div id = '+id+'/>'
					str+= "</div>"

						widgetService.loadSingleTheme($scope.$parent.adfModel.theme).then(function (response) {		
							var svg = 	angular.element(str);
							$element.html(svg)

							var container = document.getElementById(id)
							echarts.registerTheme($scope.$parent.adfModel.theme, response.data)
							var	myChart = echarts.init(container, $scope.$parent.adfModel.theme)


							myChart.setOption(parentresponse.data.options);

							myChart.on('click', function (params,startDate,endData) {



								$scope.$parent.adfModel["showDrillDown"] = true;
								$scope.$parent.adfModel["drillDownTitle"] = model.title;
								$scope.$parent.adfModel['tableDataHeaders'] = [];
								$scope.$parent.adfModel['tableData'] = [];
								loadDrillDown(params);


							});

							model['url'] =  $(container).find("canvas")[0].toDataURL();
						}, function (error) {

						});




			}, function (error) {

			}); 
		}, 1000);




		function loadDrillDown(params,model){




			if(params){
				var startDate =  $scope.$parent.adfModel.timeRange.startDate.valueOf();
				var endDate =  $scope.$parent.adfModel.timeRange.endDate.valueOf();

				widgetService.loadDrillDownForWidget($scope.model.type,startDate,endDate,params.name).then(function (response) {

					if(response.data.tableData){

						var tempValues = [];

						for (var key in response.data.tableData[0]) {
							if(key!="$$hashKey"){
								tempValues.push(key);
							}
						}	


						$scope.$parent.adfModel.tableDataHeaders  = tempValues;
						$scope.$parent.adfModel.tableData  = response.data.tableData;

						$("#modal_full").modal();

						/*setTimeout(function(){ 

							 //$('#drillDownTable').DataTable().clear().destroy();


						var table = 	$("#drillDownTable").DataTable({
							fixedHeader: true,
							responsive: {
					            details: {
					                type: 'column'
					            }
					        }

						});
						var i=0;
						for (var key in response.data.tableData[0]) {
							if(key!="$$hashKey"){
								  table.columns(i).header().to$().text(key);
								    i++;
							}

						}   



						table.columns.adjust().draw();


						}, 200);*/


					}


				}, function (error) {

				});
			}



		}


		// create new scope
		var templateScope = $scope.$new();

		// pass config object to scope
		if (!model.config) {
			model.config = {};
		}

		templateScope.config = model.config;

		// local injections
		var base = {
				$scope: templateScope,
				widget: model,
				config: model.config
		};

		// get resolve promises from content object
		var resolvers = {};





		// destroy old scope
		if (currentScope) {
			currentScope.$destroy();
		}

		return templateScope;
	}

	function renderWidget($scope, $element, currentScope, model, content,options) {
		// display loading template

		var startDate = options.startDate;
		var endDate= options.endDate;

		var requestFrom = options.requestFrom;


		//loader($("body"));
//		alert($scope.model.type);

		var filter = "";
		if(options.filter && options.filter!="()"){
			filter = options.filter;
		}
		var queryString 
		if(options.queryString){
			queryString = options.queryString;
		
		}
		
		if(requestFrom==='reports'){
			
			widgetService.loadSingleWidgetForReport($scope.content.id,startDate,endDate,filter,queryString,options.companyName).then(function (response) {


				var id = $scope.content.id;
				model.title = response.data.title;

				
				response.data['colors'] = options.color;
//				response.data.cfg = JSON.stringify($scope.content.options);
				
				var parentresponse = response;


				console.log("parentresponse>>>>>"+parentresponse)

				var width = $element[0].parentElement.offsetWidth;
				var height = $element[0].parentElement.offsetHeight;

				var parentHeight = $($element).parent().parent().parent().height()-50;
				
				var themeName = "";

				if(sessionStorage.getItem("themeType")==='theme-dark-full'){
					themeName = "chalk"
				}else{
					themeName = "infographic"
				}

				var curWidget = JSON.parse(parentresponse.data.cfg);

				if(response.data.data === undefined || response.data.data.length === 0){
					var str =  '<div class="chart-container">'
						str+= '<div class="chart has-fixed-height" style="text-align:center;padding-top: 120px;"> <h4 class="text-semibold">No Data Found</h4></div>'
							str+= "</div>"
				}else if(curWidget.config.chart_type != 'kpi'){
					var str =  '<div>'
						str+= '<div class = "chart" style = "height:'+parentHeight+'px; width: 100%" id = '+id+' />'
						str+= "</div>"
				}else{
					var str =  '<div class = "kpi"/>'
						
				}

				var svg = 	angular.element(str);
				
				$element.html(svg);
				var container = $('#'+id);
				
				if(curWidget.config.chart_type === 'kpi'){
					container = $element.find("div.kpi")
				}
				
				
				

				//curWidget.config['themeOptions'] = response.data;
				//curWidget.config['themeName'] = $scope.$parent.adfModel.theme;
				curWidget.config['drillDownWidgetId'] = parentresponse.data.drillDownWidgetId;
				curWidget.config['startDate'] = startDate;
				curWidget.config['endDate'] = endDate;
				curWidget.config['dateLabel'] = options.dateLabel


				var charType = curWidget.config.chart_type;

				if (charType == 'chinaMapBmap') {
					
				} else {
					
					//containerDom, widget, optionFilter, scope, reload, persist, relations,topicId,data
					
					chartService.renderWithOutDataService(container, {
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
			
		}else{
			
				var str= `<div style="display: block; opacity: 0.6;"><div class = "chart" style = "width: 100%;display:block" id = `+$scope.content.id+`> <div class="loader14">
                    <div class="loader-inner">
                        <div class="box-1"></div>	
                        <div class="box-2"></div>
                        <div class="box-3"></div>
                        <div class="box-4"></div>
                    </div>
                    <span class="text">Loading</span>
                </div></div></div>`					
				var svg = 	angular.element(str);
				$element.html(svg);
				var parentHeight = $($element).parent().parent().parent().height();
				$("#"+$scope.content.id).height(Number(parentHeight));
				$("#"+$scope.content.id).parent().height(Number(parentHeight));
				$("#"+$scope.content.id).css("margin-top",Number(parentHeight)/2);
			widgetService.loadSingleWidget($scope.content.id,startDate,endDate,filter,queryString,options.companyName).then(function (response) {


				var parentHeight = $($element).parent().parent().parent().height()-50;
				$("#"+$scope.content.id).height(Number(parentHeight));
				$("#"+$scope.content.id).parent().height(Number(parentHeight));
				$("#"+$scope.content.id).css("margin-top",(Number(parentHeight)/2));
				var id = $scope.content.id;
				model.title = response.data.title;

				
				response.data['colors'] = options.color;
//				response.data.cfg = JSON.stringify($scope.content.options);
				
				var parentresponse = response;


				console.log("parentresponse>>>>>"+parentresponse)

				var width = $element[0].parentElement.offsetWidth;
				var height = $element[0].parentElement.offsetHeight;

				var themeName = "";

				if(sessionStorage.getItem("themeType")==='theme-dark-full'){
					themeName = "chalk"
				}else{
					themeName = "infographic"
				}

				var curWidget = JSON.parse(parentresponse.data.cfg);

				if(response.data.data === undefined || response.data.data.length === 0 ){
					var str =  '<div class="chart-container">'
						str+= '<div class="chart has-fixed-height" style="text-align:center;padding-top: 120px;"> <h4 class="text-semibold">No Data Found</h4></div>'
							str+= "</div>"
				}else if(curWidget.config.chart_type != 'kpi'){
					var str =  '<div>'
						str+= '<div class = "chart" style = "height:'+parentHeight+'px; width: 100%" id = '+id+' />'
						str+= "</div>"
				}else{
					var str =  '<div class = "kpi"></div>'
						
						
				}



				widgetService.loadSingleTheme(themeName).then(function (response) {	

					$element.html('')
					var svg = 	angular.element(str);
					
					$element.html(svg);
					var container = $('#'+id);
					
					if(curWidget.config.chart_type === 'kpi'){
						container = $element.find("div.kpi")
					}
					
					
					

					curWidget.config['themeOptions'] = response.data;
					//curWidget.config['themeName'] = $scope.$parent.adfModel.theme;
					curWidget.config['drillDownWidgetId'] = parentresponse.data.drillDownWidgetId;
					curWidget.config['startDate'] = startDate;
					curWidget.config['endDate'] = endDate;
					curWidget.config['dateLabel'] = options.dateLabel


					var charType = curWidget.config.chart_type;

					if (charType == 'chinaMapBmap') {
						
					} else {
						
						//containerDom, widget, optionFilter, scope, reload, persist, relations,topicId,data
						try{
							
						
						chartService.renderWithOutDataService(container, {
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
						}catch(err){
//							console.log(err);
						}
					}

				}, function (error) {
					unloader("#widget-"+$scope.content.id);
					unloader("#"+$scope.content.id);
					console.log(error)
					unloader("body");
				});		

			}, function (error) {
				unloader("#widget-"+$scope.content.id);
				unloader("#"+$scope.content.id);
				unloader("body");
			});
			
		}
		
		


		function loadDrillDown(params,model){




			if(params){
				var startDate =  $scope.$parent.adfModel.timeRange.startDate.valueOf();
				var endDate =  $scope.$parent.adfModel.timeRange.endDate.valueOf();

				widgetService.loadDrillDownForWidget($scope.model.type,startDate,endDate,params.name).then(function (response) {

					if(response.data.tableData){

						var tempValues = [];

						for (var key in response.data.tableData[0]) {
							if(key!="$$hashKey"){
								tempValues.push(key);
							}
						}	


						$scope.$parent.adfModel.tableDataHeaders  = tempValues;
						$scope.$parent.adfModel.tableData  = response.data.tableData;

						var tableHeader = [];

						tableHeader.push("<div class='panel' style =''>")
						tableHeader.push("<div class='panel-heading' style='2px solid #ebf0f4'>")
						tableHeader.push("<h6 class='panel-title dashboad-panel-title'>"+model.title+"</h6>");


						tableHeader.push("<div  class='heading-elements'>")

						tableHeader.push("<ul class='icons-list'> <li> <a href ='javascript:void('0')'><i class='icon-cross3' id='closeIconForDirllDown'></i>  </a></li></ul> ");	

						tableHeader.push("</div>")

						tableHeader.push("</div>")


						tableHeader.push("<div class='panel-body drill-down-panelbody'>")

						tableHeader.push("<div class='table-responsive' style='height: 300px'>")
						tableHeader.push("<table class='table dataTable table-bordered table-framed table-fixed'  id='drillDownTable'>");
						tableHeader.push("<thead>");
						tableHeader.push("<tr>");
						for(var i=0;i<tempValues.length;i++){
							tableHeader.push("<th  > "+tempValues[i]+"</th>");
						}
						tableHeader.push("</tr>");
						tableHeader.push("</thead>");

						tableHeader.push("<tfoot>");
						tableHeader.push("<tr>");
						for(var i=0;i<tempValues.length;i++){
							tableHeader.push("<th><input style='border:0px;background:#f9f3f4;height:2px' type='text' class='form-control' placeholder  = 'Search Here'/>  </th>");
						}
						tableHeader.push("</tr>");
						tableHeader.push("</tfoot>");

						tableHeader.push("<tbody>");

						for(var i=0;i<response.data.tableData.length;i++){
							tableHeader.push("<tr>");
							for (var key in response.data.tableData[i]) {
								if(key!="$$hashKey"){
									tableHeader.push("<td>"+response.data.tableData[i][key]+"</td>");
								}
							}
							tableHeader.push("</tr>");
						}
						tableHeader.push("</tbody>");



						tableHeader.push("</table>")
						tableHeader.push("</div>")
						tableHeader.push("</div>")
						tableHeader.push("</div>")

						if ( $.fn.DataTable.isDataTable( '#drillDownTable' ) ) {
							$('#drillDownTable').DataTable().clear().destroy();
						}



						$("#drillDownTable").empty();





						$("#main-dashboard").append(tableHeader.join(''))

						$("#dasboard-rows").css({ 'height': "600px",'overflow': "auto" });

						$("#closeIconForDirllDown").on('click',function(){
							$(this).parent().parent().parent().parent().parent().parent().remove();
							$("#dasboard-rows").css({ 'height' : '', 'overflow' : '' });
						});


						setTimeout(function(){ 
							var table=	$("body").find("#drillDownTable").DataTable({
								fixedHeader: true,
								responsive: {
									details: {
										type: 'column'
									}
								},
								"paging":   false,
								"info":     false


							});

							$("#drillDownTable_filter").hide();

							table.columns().every( function () {
								var that = this;

								$( 'input',this.footer()  ).on( 'keyup change', function () {
									if ( that.search() !== this.value ) {
										that
										.search( this.value )
										.draw();
									}
								} );
							} );

						}, 200);
						//unloader($("body"));
					}


				}, function (error) {

				});
			}



		}


		// create new scope
		var templateScope = $scope.$new();

		// pass config object to scope
		if (!model.config) {
			model.config = {};
		}

		templateScope.config = model.config;

		// local injections
		var base = {
				$scope: templateScope,
				widget: model,
				config: model.config
		};

		// get resolve promises from content object
		var resolvers = {};





		// destroy old scope
		if (currentScope) {
			currentScope.$destroy();
		}

		return templateScope;
	}

	function link($scope, $element) {
		$scope.$on('panelConfigChanged', function() {
			consoel.log("test")
			//currentScope = compileWidget($scope, $element, currentScope);
		});
		$scope.$on('panelConfigReload', function(event, opt) {
			console.log("reloaded");
			//compileWidget($scope, $element, null,opt);
		})

		compileWidget($scope, $element, null,$scope.model);
	}



});
