
'use strict';
app.service('chartPieService', function ($state, $window) {

	this.render = function (containerDom, option, scope, persist, drill, relations, chartConfig) {
		var render = new CBoardEChartRender(containerDom, option,scope);
		render.addClick(chartConfig, relations, $state, $window,scope);
		return render.chart(null, persist);
	};

	this.parseOption = function (data) {
		var chartConfig = data.chartConfig;
		var casted_keys = data.keys;
		var casted_values = data.series;
		var aggregate_data = data.data;
		var newValuesConfig = data.seriesConfig;

		var series = new Array();
		var string_keys = _.map(casted_keys, function (key) {
			return key.join('-');
		});
		var string_value = _.map(casted_values, function (value) {
			return value.join('-');
		});
		var b = 100 / (casted_values.length * 9 + 1);
		var titles = [];
		for (var i = 0; i < aggregate_data.length; i++) {
			var joined_values = casted_values[i].join('-');
			var realType = angular.copy(newValuesConfig[joined_values]).type;
			var s = {
					name: string_value[i],
					type: 'pie',
					realType: realType,
					center: [5 * b + i * 9 * b + '%', '50%'],
					data: [],
					//roseType: 'angle'
					itemStyle: {
						normal: {
							label: {
								show: false,
								//position:'inside',
								formatter: '{b}: {d}%'
							},
							labelLine : {
								show : false
							}

						},
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						},
						labelLine: {show: true}
					}
			};
			if (realType == 'coxcomb') {
				s.roseType = 'angle';
			}
			titles.push({
				textAlign: 'center', textStyle: {
					fontSize: 12,
					fontWeight: 'normal'
				}, text: string_value[i], left: 5 * b + i * 9 * b + '%', top: '90%'
			});
			for (var j = 0; j < aggregate_data[i].length; j++) {
				s.data.push({
					name: string_keys[j],
					value: _.isUndefined(aggregate_data[i][j]) ? 0 : aggregate_data[i][j]
				});
			}
			series.push(s);
		}
		var echartOption = {
				title: titles,
				legend: {
					type: 'scroll',
					orient: 'horizontal',
					data: string_keys
				},

				tooltip: {
					trigger: 'item',
					formatter: function (params) {

						var name = params.data.name;

						
try{
	
						var cols = chartConfig.values[0].cols[0];
						var formatterType = cols.configuration.format;


						if(formatterType && formatterType==='bytes'){
							return params.seriesName+" <br/> "+name+" : "+params.percent+"("+formatBytes(parseInt(params.data.value))+")";
						}
						if(formatterType && formatterType==='number'){
							//numbro(option.kpiPercentageOfChange).format("0a.[00]");;
							return params.seriesName+" <br/> "+name+" : "+params.percent+"("+numbro(parseInt(params.data.value)).format("0a.[00]")+")";
						}
						if(formatterType && formatterType==='percent'){
							//numbro(option.kpiPercentageOfChange).format("0a.[00]");;
							return params.seriesName+" <br/> "+name+" : "+params.percent+"("+numbro(parseInt(params.data.value)).format("(0.000 %)")+")";
						}

}catch(err){console.log(err)};


						return params.seriesName+" <br/> "+name+" : "+params.data.value+"("+params.percent+")";
					},
					position: ['10%', '50%'],
					textStyle: {
						fontSize:10
					}
				},

				series: series
		};
		
		

		updateEchartOptions(chartConfig.option, echartOption);

		return echartOption;
	};
});