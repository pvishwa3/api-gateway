
'use strict';
app.service('chartLineService', function ($state, $window) {

	this.render = function (containerDom, option, scope, persist, drill, relations, chartConfig) {
		var render = new CBoardEChartRender(containerDom, option,scope);
		render.addClick(chartConfig, relations, $state, $window,scope);
		return render.chart(null, persist);
	};

	this.parseOption = function (data,scope,widget) {

		var chartConfig = data.chartConfig;
		var casted_keys = data.keys;
		var casted_values = data.series;
		var aggregate_data = data.data;
		var newValuesConfig = data.seriesConfig;
		var series_data = [];
		var isStepWasEnabled = false;
        var smooth = true;
		if(chartConfig.stairCase && chartConfig.stairCase==='true'){
		    isStepWasEnabled = true;
		    smooth = false;
		}



		var string_keys = _.map(casted_keys, function (key) {
			return key.join('-');
		});
		var tunningOpt = chartConfig.option;

		var zipDataWithCfg = _.chain(aggregate_data)
		.map(function (data, i) {
			var joined_values = casted_values[i].join('-');
			var s = newValuesConfig[joined_values];
			s.key =joined_values;
			s.data = data;
			return s;
		}).value()

		var sum_data =_.chain(zipDataWithCfg)
		.groupBy(function (item) {
			return item.valueAxisIndex;
		})
		.map(function (axisSeries) {
			var sumArr = [];
			for (var i = 0; i < axisSeries[0].data.length; i++) {
				var sumItem = 0;
				for (var j = 0; j < axisSeries.length; j++) {
					var cell = axisSeries[j].data[i];
					sumItem += cell? Number(cell) : 0;
				}
				sumArr.push(sumItem)
			}
			return sumArr;
		})
		.value();

		for (var j = 0; aggregate_data[0] && j < aggregate_data[0].length; j++) {
			for (var i = 0; i < aggregate_data.length; i++) {
				aggregate_data[i][j] = aggregate_data[i][j] ? Number(aggregate_data[i][j]) : 0;
			}
		}

		for (var i = 0; i < zipDataWithCfg.length; i++) {
			var s = zipDataWithCfg[i];
			s.name = s.key;
			s.label = false;
			var sumData = sum_data[s.valueAxisIndex];
			if (s.type.indexOf('percent') > -1) {
				if (chartConfig.valueAxis === 'horizontal') {
					s.data = _.map(s.data, function (e, i) {
						return (e / sumData[i] * 100).toFixed(2);
					})
				} else {
					s.data = _.map(s.data, function (e, i) {
						return [i, (e / sumData[i] * 100).toFixed(2), e];
					});
				}
			}
			s.coordinateSystem = chartConfig.coordinateSystem;

			if (s.type == 'stackbar') {
				s.type = 'bar';
				s.stack = s.valueAxisIndex.toString();
			} else if (s.type == 'percentbar') {
				s.type = 'bar';
				s.stack = s.valueAxisIndex.toString();
			} else if (s.type == "arealine") {
				s.type = "line";
				s.step = isStepWasEnabled;
				s.areaStyle = {normal: {}};
				 s.smooth = smooth;
			} else if (s.type == "stackline") {
				s.type = "line";
				s.step = isStepWasEnabled;
				s.stack = s.valueAxisIndex.toString();
				s.areaStyle = {normal: {}};
				 s.smooth = smooth;
			} else if (s.type == 'percentline') {
				s.type = "line";
				s.step = isStepWasEnabled;
				s.stack = s.valueAxisIndex.toString();
				s.areaStyle = {normal: {}};
				 s.smooth = smooth;

			}else if(s.type == 'line'){
			    s.type = "line";
                s.step = isStepWasEnabled,
                s.smooth = smooth;
			}
			if (chartConfig.valueAxis == 'horizontal') {
				s.xAxisIndex = s.valueAxisIndex;
			} else {
				s.yAxisIndex = s.valueAxisIndex;
			}
			series_data.push(s);
		}

		var valueAxis = angular.copy(chartConfig.values);
		_.each(valueAxis, function (axis, index) {

			_.each(axis.cols, function (col, colIndex) {
				if(col.configuration && col.configuration.color){
					series_data[colIndex].color = col.configuration.color;
				}
				if(col.configuration && col.configuration.stacktype){
					series_data[colIndex].stack = col.configuration.stacktype;

				}
				if(col.configuration && col.configuration.stacktype &&  col.configuration.stacktype === 'confidence-band'){
					series_data[colIndex].lineStyle = {
							normal: {
								opacity: 0
							}
					};

					series_data[colIndex].symbol = 'none'

				}
				if(col.configuration && col.configuration.areaStyle &&  col.configuration.areaStyle != ''){
					series_data[colIndex].areaStyle= {
							normal: {
								color: col.configuration.areaStyle
							}
					},

					series_data[colIndex].symbol = 'none'

				}

				if(col.configuration && col.configuration.displaySeries &&  col.configuration.displaySeries === 'no'){
					series_data[colIndex].lineStyle = {
							normal: {
								opacity: 0
							}
					};

					series_data[colIndex].symbol = 'none'

				}

				if(col.configuration && col.configuration.format === 'bytes'){
					axis.axisLabel = {
							formatter: function (value) {
								return numbro(value).format("0 b");
							}
					};
				}else if(col.configuration && col.configuration.format === 'number'){
					axis.axisLabel = {
							formatter: function (value) {
								return numbro(value).format("0a.[0000]");
							}
					};
				}
				else if(col.configuration && col.configuration.format === 'percent'){
					axis.axisLabel = {
							formatter: function (value) {
								return numbro(value).format("(0.000 %)");
							}
					};
				}


			});


		


			if (axis.series_type == "percentbar" || axis.series_type == "percentline") {
				axis.min = 0;
				axis.max = 100;
			} else {
				axis.min = axis.min ? axis.min : null;
				axis.max = axis.max ? axis.max : null;
			}
			if (index > 0) {
				axis.splitLine = false;
			}
			axis.scale = true;
		});

		if (tunningOpt) {
			var labelInterval, labelRotate;
			tunningOpt.ctgLabelInterval ? labelInterval = tunningOpt.ctgLabelInterval : 'auto';
			tunningOpt.ctgLabelRotate ? labelRotate = tunningOpt.ctgLabelRotate : 0;
		}
		var categoryAxis = {};

		var toolbox = {};



		if(chartConfig.option.xAxisType === 'Time'){

			 var format = calculateTimeRange(parseInt(casted_keys[0]),parseInt(casted_keys[casted_keys.length-1]))


			categoryAxis = {	
				type: 'category',
				data: string_keys,
				axisLabel: {
					interval: labelInterval,
					rotate: labelRotate,
					formatter: function (params) {
						return echarts.format.formatTime(format, parseInt(params));
					}
				},
				boundaryGap: false
			};
		}else{
			categoryAxis = {
					type: 'category',
					data: string_keys,
					axisLabel: {
						interval: labelInterval,
						rotate: labelRotate,

					},
					boundaryGap: false
			};
		}





		_.each(valueAxis, function (axis) {
			var _stype = axis.series_type;
			if (_stype.indexOf('bar') !== -1) {
				categoryAxis.boundaryGap = true;

			}



		});



		var echartOption = {
				grid: angular.copy(echartsBasicOption.grid),
				legend: {
					type: 'scroll',
					orient: 'horizontal',
					width:'50%',
					data: _.map(casted_values, function (v) {
						return v.join('-');
					})
				},


				tooltip: {
					formatter: function (params) {

						var name = params[0].name;

						var cols = chartConfig.values[0].cols;

						if(chartConfig.option.xAxisType === 'Time'){
							 var format = calculateTimeRange(parseInt(casted_keys[0]),parseInt(casted_keys[casted_keys.length-1]))
try{
	
							name = echarts.format.formatTime(format, parseInt(params[0].name));
}catch(err){};



						}
						var formatterType = 'number';

						if(cols[0].configuration && cols[0].configuration.format){
							formatterType = cols[0].configuration.format;
						}





						var s = name + "</br>";
						for (var i = 0; i < params.length; i++) {
							if(params[i].value instanceof Array){
								if(params[i].value[1] == 0){
									continue;
								}
							}else if(params[i].value == 0){
								continue;
							}else{
								s += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>';
								if (params[i].value instanceof Array) {


									if(formatterType && formatterType==='bytes'){
										s += params[i].seriesName + " : " + params[i].value[1] + "% (" + numbro(params[i].value[2]).format("0 b") + ")<br>";
									}else if(formatterType && formatterType==='number'){
										//numbro(value).format("0a.[0000]");
										s += params[i].seriesName + " : " + params[i].value[1] + "% (" + numbro(params[i].value[2]).format("0a.[0000]") + ")<br>";
									}
									else if(formatterType && formatterType==='percent'){
										//numbro(value).format("0a.[0000]");
										s += params[i].seriesName + " : " + params[i].value[1] + "% (" + numbro(params[i].value[2]).format("(0.000 %)") + ")<br>";
									}
								}else {

									if(formatterType && formatterType==='bytes'){
										s += params[i].seriesName + " : " + numbro(params[i].value).format("0 b")+"<br>";
									}else if(formatterType && formatterType==='number'){
										//numbro(value).format("0a.[0000]");
										s += params[i].seriesName + " : " + numbro(params[i].value).format("0a.[0000]") + "<br>";
									}
									else if(formatterType && formatterType==='percent'){
										//numbro(value).format("0a.[0000]");
										s += params[i].seriesName + " : " + numbro(params[i].value).format("(0.000 %)") + "<br>";
									}


								}
							}

						}
						return s;
					},


					textStyle: {
						fontSize:10
					}


				},
				series: series_data
		};
		if (chartConfig.coordinateSystem == 'polar') {
			echartOption.angleAxis = chartConfig.valueAxis == 'horizontal' ? valueAxis : categoryAxis;
			echartOption.radiusAxis = chartConfig.valueAxis == 'horizontal' ? categoryAxis : valueAxis;
			echartOption.polar = {};
		} else {
			echartOption.xAxis = chartConfig.valueAxis == 'horizontal' ? valueAxis : categoryAxis;
			echartOption.yAxis = chartConfig.valueAxis == 'horizontal' ? categoryAxis : valueAxis;

		}

		if (chartConfig.valueAxis === 'horizontal') {
			echartOption.grid.left = 'left';
			echartOption.grid.containLabel = true;
			echartOption.grid.bottom = '5%';
		}
		if (chartConfig.valueAxis === 'vertical' && chartConfig.values.length > 1) {
			echartOption.grid.right = 40;
		}
		var darkTheme = 'image://data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDQ4NS4yMTMgNDg1LjIxMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg1LjIxMyA0ODUuMjEzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+PGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMzYzLjkwOSwxODEuOTU1QzM2My45MDksODEuNDczLDI4Mi40NCwwLDE4MS45NTYsMEM4MS40NzQsMCwwLjAwMSw4MS40NzMsMC4wMDEsMTgxLjk1NXM4MS40NzMsMTgxLjk1MSwxODEuOTU1LDE4MS45NTEgICAgQzI4Mi40NCwzNjMuOTA2LDM2My45MDksMjgyLjQzNywzNjMuOTA5LDE4MS45NTV6IE0xODEuOTU2LDMxOC40MTZjLTc1LjI1MiwwLTEzNi40NjUtNjEuMjA4LTEzNi40NjUtMTM2LjQ2ICAgIGMwLTc1LjI1Miw2MS4yMTMtMTM2LjQ2NSwxMzYuNDY1LTEzNi40NjVjNzUuMjUsMCwxMzYuNDY4LDYxLjIxMywxMzYuNDY4LDEzNi40NjUgICAgQzMxOC40MjQsMjU3LjIwOCwyNTcuMjA2LDMxOC40MTYsMTgxLjk1NiwzMTguNDE2eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojNkU2RDZEIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCI+PC9wYXRoPgoJCTxwYXRoIGQ9Ik00NzEuODgyLDQwNy41NjdMMzYwLjU2NywyOTYuMjQzYy0xNi41ODYsMjUuNzk1LTM4LjUzNiw0Ny43MzQtNjQuMzMxLDY0LjMyMWwxMTEuMzI0LDExMS4zMjQgICAgYzE3Ljc3MiwxNy43NjgsNDYuNTg3LDE3Ljc2OCw2NC4zMjEsMEM0ODkuNjU0LDQ1NC4xNDksNDg5LjY1NCw0MjUuMzM0LDQ3MS44ODIsNDA3LjU2N3oiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6IzZFNkQ2RCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiPjwvcGF0aD4KCTwvZz4KPC9nPjwvZz4gPC9zdmc+';
		var whiteTheme = 'image://data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDQ4NS4yMTMgNDg1LjIxMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg1LjIxMyA0ODUuMjEzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+PGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMzYzLjkwOSwxODEuOTU1QzM2My45MDksODEuNDczLDI4Mi40NCwwLDE4MS45NTYsMEM4MS40NzQsMCwwLjAwMSw4MS40NzMsMC4wMDEsMTgxLjk1NXM4MS40NzMsMTgxLjk1MSwxODEuOTU1LDE4MS45NTEgICAgQzI4Mi40NCwzNjMuOTA2LDM2My45MDksMjgyLjQzNywzNjMuOTA5LDE4MS45NTV6IE0xODEuOTU2LDMxOC40MTZjLTc1LjI1MiwwLTEzNi40NjUtNjEuMjA4LTEzNi40NjUtMTM2LjQ2ICAgIGMwLTc1LjI1Miw2MS4yMTMtMTM2LjQ2NSwxMzYuNDY1LTEzNi40NjVjNzUuMjUsMCwxMzYuNDY4LDYxLjIxMywxMzYuNDY4LDEzNi40NjUgICAgQzMxOC40MjQsMjU3LjIwOCwyNTcuMjA2LDMxOC40MTYsMTgxLjk1NiwzMTguNDE2eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojM0Y5RUNEIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCI+PC9wYXRoPgoJCTxwYXRoIGQ9Ik00NzEuODgyLDQwNy41NjdMMzYwLjU2NywyOTYuMjQzYy0xNi41ODYsMjUuNzk1LTM4LjUzNiw0Ny43MzQtNjQuMzMxLDY0LjMyMWwxMTEuMzI0LDExMS4zMjQgICAgYzE3Ljc3MiwxNy43NjgsNDYuNTg3LDE3Ljc2OCw2NC4zMjEsMEM0ODkuNjU0LDQ1NC4xNDksNDg5LjY1NCw0MjUuMzM0LDQ3MS44ODIsNDA3LjU2N3oiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6IzNGOUVDRCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiPjwvcGF0aD4KCTwvZz4KPC9nPjwvZz4gPC9zdmc+'
			if(chartConfig.option.xAxisType === 'Time' ){

				echartOption.yAxis['axisLabel'] = {

						formatter: function (value, index) {
							var format = calculateTimeRange(parseInt(chartConfig.startDate),parseInt(chartConfig.endDate))
							var formatedDate = echarts.format.formatTime(format, parseInt(value))
							return formatedDate;
						}
				};

				echartOption['toolbox']= {
						show : true,
						feature : {
							dataZoom : {
								yAxisIndex: false,
								title:{
									back:'',
									zoom:'Area Zooming'
								},
								icon:{
									back:'a',
									zoom:(localStorage.getItem("dashboard-themeType") === 'theme-dark-full') ? darkTheme : whiteTheme
								}
							},
							magicType: {
								show: true, 
								title:{
									line:'Switch Line',
									bar:'Switch Bar',
									stack:'Stack',
									tiled:'Titled',
								},
								type: ['line', 'bar','stack','tiled']
							}
						}
				}
			}else{
				echartOption['toolbox']= {
						show : true,
						feature : {
							magicType: {
								show: true, 
								title:{
									line:'Switch Line',
									bar:'Switch Bar',
									stack:'Stack',
									titled:'Titled',
								},
								type: ['line', 'bar']
							},
						}
				}
			}



		if(chartConfig.requestFrom === 'reports'){
			echartOption['legend'] = {
					type: 'scroll',
					orient: 'horizontal',
					width:'100%',
					data: _.map(casted_values, function (v) {
						return v.join('-');
					})
			},



			echartOption['toolbox'] = {}
		}


		if(chartConfig.inculdeVisualMap === 'yes'){
			
			var tempArray = [];
			for(var i=0;i<series_data.length;i++){
				for(var j=0;j<series_data[i].data.length;j++){
					tempArray.push(series_data[i].data[j]);
				}
			}
			var maxNumber = _.max(tempArray);
			var minNumber = _.min(tempArray);
			var maxNumberBound = maxNumber * chartConfig.visualMapBound;
			var minNumberBound = minNumber - chartConfig.visualMapBound;
			
			echartOption['visualMap'] = {
					top: 10,
					right: 10,
					type: 'continuous',
					max: maxNumberBound,
					min: minNumberBound,
					inRange: {
						color: ['orange', 'blue', 'red']
		            }
					
					
			}
		}

		// Apply tunning options
		updateEchartOptions(tunningOpt, echartOption);
		try{
			if(chartConfig.valueAxis == 'horizontal'){
				echartOption['yAxis']['splitLine'] = {'show':false};
				echartOption['xAxis'][0]['showGrid'] = {'show':true};
			}else{
				echartOption['yAxis'][0]['showGrid'] = {'show':true};
				echartOption['xAxis']['splitLine'] = {'show':false};
			}
		}catch(err){
			console.log(err);
		}
		return echartOption;
	};


	function bytesToSize(bytes, precision)
	{  
		var kilobyte = 1024;
		var megabyte = kilobyte * 1024;
		var gigabyte = megabyte * 1024;
		var terabyte = gigabyte * 1024;

		if ((bytes >= 0) && (bytes < kilobyte)) {
			return bytes + ' B';

		} else if ((bytes >= kilobyte) && (bytes < megabyte)) {
			return (bytes / kilobyte).toFixed(precision) + ' KB';

		} else if ((bytes >= megabyte) && (bytes < gigabyte)) {
			return (bytes / megabyte).toFixed(precision) + ' MB';

		} else if ((bytes >= gigabyte) && (bytes < terabyte)) {
			return (bytes / gigabyte).toFixed(precision) + ' GB';

		} else if (bytes >= terabyte) {
			return (bytes / terabyte).toFixed(precision) + ' TB';

		} else {
			return bytes + ' B';
		}
	}

	function calculateTimeRange(startDate,endDate){

		var a = moment(startDate);
		var b = moment(endDate);

		var diff = b.diff(a,'days');
		if(diff==0){
			return "hh:mm:ss";
		}else if(diff>=1 && diff<=30){
			return "MM/dd hh:mm";
		}else if(diff>=30 && diff<=365){
			return "MM/dd";
		}
		else if(diff>=365){
			return "yyyy/MM/dd";
		}






	}
	function adjust(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }
});
