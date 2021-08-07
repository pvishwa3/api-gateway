

var doubleClicker = {
		clickedOnce : false,
		timer : null,
		timeBetweenClicks : 400
};

var resetDoubleClick = function() {
	clearTimeout(doubleClicker.timer);
	doubleClicker.timer = null;
	doubleClicker.clickedOnce = false;
};



//the actual callback for a double-click event
var ondbclick = function(options, point) {

	var optionContext  = point;

	if(optionContext.option.drillDownType==='search'){

		var startDate = optionContext.startDate;
		var endDate = optionContext.endDate;
		var eventId = 765;
		var query = event.point.series.name.toLowerCase()+":"+event.point.name;
		window.location.href = "/configuration#!/search?query="+query+"&startDate="+startDate+"&endDate="+endDate;
	}else if(optionContext.option.drillDownType==='dashboard'){
	
			
		
		if(options.length!=0){
			var query = options[0].field+':'+options[0].value
			var dashboardId  = optionContext.option.dashboardName
			window.location.href = "/configuration#!/dashboard-new?id="+dashboardId+"&filterQuery="+query

		}
	}else if(optionContext.option.drillDownType==='alert'){
		var startDate =optionContext.startDate;
		var endDate = optionContext.endDate;
		
		var query = event.point.series.name+"="+event.point.name;
		
		window.location.href = "/configuration#!/alerts?query="+query+"&startDate="+startDate+"&endDate="+endDate;
	}else if(optionContext.option.drillDownType==='case'){
		var query = event.point.name
		window.location.href = "/configuration#!/cases?query="+query;

	}else{

		var startDate = optionContext.startDate;
		var endDate = optionContext.endDate;
		var eventId = 765;
		if(options.length!=0){
			var query = options[0].field+':"'+options[0].value+'"'
			window.location.href = "/configuration#!/search?query="+query+"&startDate="+startDate+"&endDate="+endDate;

		}
	
		
	}
};




var lightColorPalette = [
	'#1D71F2','#1C9CF6','#19C3FB','#5EBD3E','#0088FF','#FFAA00','#FF7700','#FF0033','#AADD22'
];

var lightTheme = {

    color: lightColorPalette,

    title: {
        textStyle: {
            fontWeight: 'normal'
        }
    },

    visualMap: {
        color:['#1790cf','#a2d4e6']
    },

    toolbox: {
        iconStyle: {
            normal: {
                borderColor: '#06467c'
            }
        }
    },

    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.6)'
    },

    dataZoom: {
        dataBackgroundColor: '#dedede',
        fillerColor: 'rgba(154,217,247,0.2)',
        handleColor: '#005eaa'
    },

    timeline: {
        lineStyle: {
            color: '#005eaa'
        },
        controlStyle: {
            normal: {
                color: 'white',
                borderColor: 'white'
            }
        }
    },

    candlestick: {
        itemStyle: {
            normal: {
                color: '#c12e34',
                color0: '#2b821d',
                lineStyle: {
                    width: 1,
                    color: '#c12e34',
                    color0: '#2b821d'
                }
            }
        }
    },

    graph: {
        color: lightColorPalette
    },

    map: {
        label: {
            normal: {
                textStyle: {
                    color: '#c12e34'
                }
            },
            emphasis: {
                textStyle: {
                    color: '#c12e34'
                }
            }
        },
        itemStyle: {
            normal: {
                borderColor: '#eee',
                areaColor: '#ddd'
            },
            emphasis: {
                areaColor: '#e6b600'
            }
        }
    },

    gauge: {
        axisLine: {
            show: true,
            lineStyle: {
                color: [[0.2, '#2b821d'],[0.8, '#005eaa'],[1, '#c12e34']],
                width: 5
            }
        },
        axisTick: {
            splitNumber: 10,
            length:8,
            lineStyle: {
                color: 'auto'
            }
        },
        axisLabel: {
            textStyle: {
                color: 'auto'
            }
        },
        splitLine: {
            length: 12,
            lineStyle: {
                color: 'auto'
            }
        },
        pointer: {
            length: '90%',
            width: 3,
            color: 'auto'
        },
        title: {
            textStyle: {
                color: '#333'
            }
        },
        detail: {
            textStyle: {
                color: 'auto'
            }
        }
    }
};

var darkTheme2 =

{
//	multi color
//	"color": ['#005EAA','#E6B600','#0098D9','#2B821D','#C12E34','#339CA8','#CDA819','#32A487'],
//		"color":["#826af9","#9e86ff","#d0aeff","#f7d2ff"],
	//blue
    "color":[
        "#4ba06a",
        "#da9f62",
        "#6742b4",
        "#447fb9",
        "#58140b",
        "#5f73b1",
        "#6b399d",
        "#3da748",
        "#f89a96",
        "#c38f4b"],
//	"color":["#adb5eb","#99a2e6","#858fe0","#707ddb","#6b78da","#5c6ad6","#4757d1","#3345cc","#2e3eb8","#2937a3","#24308f"],	
	//green
//	color: ['#26734d','#2d8659','#339966','#39ac73','#40bf80','#53c68c','#66cc99','#79d2a6','#8cd9b3','#9fdfbf','#b3e6cc','#c6ecd9' ],	
	//yellow
//	color:['#997300','#b38600','#cc9900','#e6ac00','#ffbf00','#ffc61a','#ffcc33','#ffd24d','#ffd966','#ffdf80','#ffe699','#ffecb3','#fff2cc' ],		  
	//yellow2
//	color:[ '#653c00','#804d00','#995c00','#b36b00','#cc7a00','#e68a00','#ff9900','#ffa31a','#ffad33','#ffb84d','#ffc266','#ffcc80','#ffd699' ],
    //green2 
//color:[ ' #023334',' #03494a',' #046162',' #04797b',' #059194',' #06a9ac',' #07c2c5',' #08dadd',' #09f2f6',' #22f3f7',' #3af5f8',' #53f6f9',' #6bf7fa',' #84f9fb','#9dfafb' ],
   "backgroundColor": "#141619",
    "textStyle": {},
    "title": {
        "textStyle": {
            "color": "#eeeeee"
        },
        "subtextStyle": {
            "color": "#aaaaaa"
        }
    },
    "line": {
        "itemStyle": {
            "normal": {
                "borderWidth": 1
            }
        },
        "lineStyle": {
            "normal": {
                "width": 2
            }
        },
        "symbolSize": "4",
        "symbol": "roundRect",
        "smooth": true
    },
    "radar": {
        "itemStyle": {
            "normal": {
                "borderWidth": 1
            }
        },
        "lineStyle": {
            "normal": {
                "width": 2
            }
        },
        "symbolSize": "4",
        "symbol": "roundRect",
        "smooth": true
    },
    "bar": {
        "itemStyle": {
            "normal": {
                "barBorderWidth": 0,
                "barBorderColor": "#393939"
            },
            "emphasis": {
                "barBorderWidth": 0,
                "barBorderColor": "#393939"
            }
        }
    },
    "pie": {
        "itemStyle": {
            "normal": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "emphasis": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        }
    },
    "scatter": {
        "itemStyle": {
            "normal": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "emphasis": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        }
    },
    "boxplot": {
        "itemStyle": {
            "normal": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "emphasis": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        }
    },
    "parallel": {
        "itemStyle": {
            "normal": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "emphasis": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        }
    },
    "sankey": {
        "itemStyle": {
            "normal": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "emphasis": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        }
    },
    "funnel": {
        "itemStyle": {
            "normal": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "emphasis": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        }
    },
    "gauge": {
        "itemStyle": {
            "normal": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "emphasis": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        }
    },
    "candlestick": {
        "itemStyle": {
            "normal": {
                "color": "#fd1050",
                "color0": "#0cf49b",
                "borderColor": "#fd1050",
                "borderColor0": "#0cf49b",
                "borderWidth": 1
            }
        }
    },
    "graph": {
        "itemStyle": {
            "normal": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "lineStyle": {
            "normal": {
                "width": 1,
                "color": "#aaaaaa"
            }
        },
        "symbolSize": "4",
        "symbol": "roundRect",
        "smooth": true,
        "color": [
            "#187671",
            "#2d981d",
            "#a5cee4",
            "#2777b6",
            "#3cb6c5",
            "#6b399c",
            "#f67f03",
            "#b1e086",
            "#b85cff",
            "#e62109",
            "#91ca8c",
            "#f49f42"
        ],
        "label": {
            "normal": {
                "textStyle": {
                    "color": "#eeeeee"
                }
            }
        }
    },
    "map": {
        "itemStyle": {
            "normal": {
                "areaColor": "#eeeeee",
                "borderColor": "#444444",
                "borderWidth": 0.5
            },
            "emphasis": {
                "areaColor": "rgba(255,215,0,0.8)",
                "borderColor": "#444444",
                "borderWidth": 1
            }
        },
        "label": {
            "normal": {
                "textStyle": {
                    "color": "#000000"
                }
            },
            "emphasis": {
                "textStyle": {
                    "color": "rgb(100,0,0)"
                }
            }
        }
    },
    "geo": {
        "itemStyle": {
            "normal": {
                "areaColor": "#eeeeee",
                "borderColor": "#444444",
                "borderWidth": 0.5
            },
            "emphasis": {
                "areaColor": "rgba(255,215,0,0.8)",
                "borderColor": "#444444",
                "borderWidth": 1
            }
        },
        "label": {
            "normal": {
                "textStyle": {
                    "color": "#000000"
                }
            },
            "emphasis": {
                "textStyle": {
                    "color": "rgb(100,0,0)"
                }
            }
        }
    },
    "categoryAxis": {
        "axisLine": {
            "show": true,
            "lineStyle": {
                "color": "#464647"
            }
        },
        "axisTick": {
            "show": true,
            "lineStyle": {
                "color": "#101010"
            }
        },
        "axisLabel": {
            "show": true,
            "textStyle": {
                "color": "#eeeeee"
            }
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color": [
                    "#393939"
                ]
            }
        },
        "splitArea": {
            "show": false,
            "areaStyle": {
                "color": [
                    "#eeeeee"
                ]
            }
        }
    },
    "valueAxis": {
        "axisLine": {
            "show": true,
            "lineStyle": {
                "color": "#464647"
            }
        },
        "axisTick": {
            "show": true,
            "lineStyle": {
                "color": "#eeeeee"
            }
        },
        "axisLabel": {
            "show": true,
            "textStyle": {
                "color": "#eeeeee"
            }
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color": [
                    "#464647"
                ]
            }
        },
        "splitArea": {
            "show": false,
            "areaStyle": {
                "color": [
                    "#eeeeee"
                ]
            }
        }
    },
    "logAxis": {
        "axisLine": {
            "show": true,
            "lineStyle": {
                "color": "#eeeeee"
            }
        },
        "axisTick": {
            "show": true,
            "lineStyle": {
                "color": "#eeeeee"
            }
        },
        "axisLabel": {
            "show": true,
            "textStyle": {
                "color": "#eeeeee"
            }
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color": [
                    "#464647"
                ]
            }
        },
        "splitArea": {
            "show": false,
            "areaStyle": {
                "color": [
                    "#eeeeee"
                ]
            }
        }
    },
    "timeAxis": {
        "axisLine": {
            "show": true,
            "lineStyle": {
                "color": "#eeeeee"
            }
        },
        "axisTick": {
            "show": true,
            "lineStyle": {
                "color": "#eeeeee"
            }
        },
        "axisLabel": {
            "show": true,
            "textStyle": {
                "color": "#eeeeee"
            }
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color": [
                    "#464647"
                ]
            }
        },
        "splitArea": {
            "show": false,
            "areaStyle": {
                "color": [
                    "#eeeeee"
                ]
            }
        }
    },
    "toolbox": {
        "iconStyle": {
            "normal": {
                "borderColor": "#999999"
            },
            "emphasis": {
                "borderColor": "#666666"
            }
        }
    },
    "legend": {
        "textStyle": {
            "color": "#eeeeee"
        }
    },
    "tooltip": {
        "axisPointer": {
            "lineStyle": {
                "color": "#eeeeee",
                "width": "1"
            },
            "crossStyle": {
                "color": "#eeeeee",
                "width": "1"
            }
        }
    },
    "timeline": {
        "lineStyle": {
            "color": "#eeeeee",
            "width": 1
        },
        "itemStyle": {
            "normal": {
                "color": "#dd6b66",
                "borderWidth": 1
            },
            "emphasis": {
                "color": "#a9334c"
            }
        },
        "controlStyle": {
            "normal": {
                "color": "#eeeeee",
                "borderColor": "#eeeeee",
                "borderWidth": 0.5
            },
            "emphasis": {
                "color": "#eeeeee",
                "borderColor": "#eeeeee",
                "borderWidth": 0.5
            }
        },
        "checkpointStyle": {
            "color": "#e43c59",
            "borderColor": "rgba(194,53,49,0.5)"
        },
        "label": {
            "normal": {
                "textStyle": {
                    "color": "#eeeeee"
                }
            },
            "emphasis": {
                "textStyle": {
                    "color": "#eeeeee"
                }
            }
        }
    },
    "visualMap": {
        "color": [
            "#ebf001",
            "#d88273",
            "#f6efa6",
            "#f50b0b",
            "#18d490",
            "#e0b418"
        ]
    },
    "dataZoom": {
        "backgroundColor": "rgba(47,69,84,0)",
        "dataBackgroundColor": "rgba(255,255,255,0.3)",
        "fillerColor": "rgba(167,183,204,0.4)",
        "handleColor": "#a7b7cc",
        "handleSize": "100%",
        "textStyle": {
            "color": "#eeeeee"
        }
    },
    "markPoint": {
        "label": {
            "normal": {
                "textStyle": {
                    "color": "#eeeeee"
                }
            },
            "emphasis": {
                "textStyle": {
                    "color": "#eeeeee"
                }
            }
        }
    }
}




var echartsBasicOption = {
		title: {},
		grid: {
			left: '50',
			right: '20',
			bottom: '15%',
			top: '15%',
			containLabel: false
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			x: 'left',
			itemWidth: 15,
			itemHeight: 10
		}
};

var CBoardEChartRender = function (jqContainer, options, isDeepSpec,scope) {
	this.container = jqContainer; // jquery object
	
	
//	var presentUrl =  window.location.pathname;
//	
//	
//	var c
//	if(presentUrl){
//		if(presentUrl == "/dashboard-report.html"){
//			echarts.registerTheme('shine', lightTheme);
//		}else{
//			echarts.registerTheme('shine', darkTheme);
//		}
//	}
	echarts.registerTheme('shine',darkTheme2);
	


	this.ecc = echarts.init(jqContainer.get(0), 'shine');
	this.isDeppSpec = isDeepSpec;

	this.basicOption = echartsBasicOption;
	this.options = options;
	this.scope = scope;
};

CBoardEChartRender.prototype.theme = "theme-fin1"; // 主题

CBoardEChartRender.prototype.chart = function (group, persist) {
	var self = this;
	var options = this.isDeppSpec == true ? self.options : $.extend(true, {}, self.basicOption, self.options);
	if (options.visualMap != undefined) {
		$(this.container).css({
			height: 500 + "px",
			width: '100%'
		});
	}

	if (options.legend.data && options.legend.data.length > 35) {
		options.grid.top = '5%';
		options.legend.show =false;
	}
	if(persist){
		options.animation = false;
	}
	self.ecc.setOption(options);
	
	if(options.requestFrom != 'reports'){
		self.changeSize(self.ecc);
		self.container.resize(function (e) {
			self.ecc.resize();
			self.changeSize(self.ecc);
		}); // 图表大小自适应
	}
	
	
	
	
	
	if (group) {
		self.ecc.group = group;
		echarts.connect(group);
	}
	if (persist) {
		setTimeout(function () {
			persist.data = self.ecc.getDataURL({
				type: 'jpeg',
				pixelRatio: 2,
				backgroundColor: '#fff'
			});
			persist.type = "jpg";
			persist.widgetType = "echarts";
		}, 1000);
	}
	return function (o) {
		o = $.extend(true, {}, self.basicOption, o);
		self.ecc.setOption(o, true);
	}
};

CBoardEChartRender.prototype.changeSize = function (instance) {
	var o = instance.getOption();
	if ((o.series[0] ? o.series[0].type : null) == 'pie') {
		var l = o.series.length;
		var b = instance.getWidth() / (l + 1 + l * 8)
		for (var i = 0; i < l; i++) {
			var seriesType = o.series[i] ? o.series[i].realType : null;
			if ((b * 8) < (instance.getHeight() * 0.75)) {
				if (seriesType == 'doughnut') {
					o.series[i].radius = [b * 3, b * 4];
				} else if (seriesType == 'coxcomb') {
					o.series[i].radius = [b * 0.8, b * 4];
				} else {
					o.series[i].radius = [0, b * 4];
				}

			} else {
				if (seriesType == 'doughnut') {
					o.series[i].radius = ['50%', '75%'];
				} else if (seriesType == 'coxcomb') {
					o.series[i].radius = ['15%', '75%']
				} else {
					o.series[i].radius = ['0', '75%'];
				}
			}
		}
		instance.setOption(o);
	}

};

//{"sourceField":[],"relations":[{},{}]}
CBoardEChartRender.prototype.addClick = function (chartConfig, relations, $state, $window,scope) {
	if(!chartConfig){
		return;
	}
	var self = this;

	
	self.ecc.on('click', function (param){
		
		setTimeout(function(){

		var groups = _.map(chartConfig.groups, function(group, index){
			return {"index":index, "name":group.col};
		});
		var keys = _.map(chartConfig.keys, function(key, index){
			return {"index":index, "name":key.col};
		});

		var paramValues = [];

		switch (chartConfig.chart_type) {
		case 'line':
		case 'contrast':
		case 'scatter':
		case 'pie':

			var chartOptions = [];

			
			if (doubleClicker.clickedOnce === true && doubleClicker.timer) {
				resetDoubleClick();
				
				if(groups.length!=0){
					_.each(groups, function (group) {
						if(param.seriesName.lastIndexOf("-")!=-1){
							chartOptions.push({field:group.name,value:param.seriesName.substring(0, param.seriesName.lastIndexOf("-"))})
						}else{
							chartOptions.push({field:group.name,value:param.seriesName})
						}
						
					});
				}else{
					var i=0;
					_.each(keys, function (key) {
						if(i==0){
							if(param.seriesName.lastIndexOf("-")!=-1){
								chartOptions.push({field:key.name,value:param.name.substring(0, param.seriesName.lastIndexOf("-"))})
							}else{
								chartOptions.push({field:key.name,value:param.name})
							}
							
							i++;
						}
						
					});
				}
				
				ondbclick(chartOptions, chartConfig);
			} else {
				doubleClicker.clickedOnce = true;
				var options = this;
				doubleClicker.timer = setTimeout(function(options){
					if(groups.length!=0){
						_.each(groups, function (group) {
							if(param.seriesName.lastIndexOf("-")!=-1){
								chartOptions.push({field:group.name,value:param.seriesName.substring(0, param.seriesName.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
							}else{
								chartOptions.push({field:group.name,value:param.seriesName,type:self.isDeppSpec.content.options.option})
							}
						});
					}else{
						var i=0;
						_.each(keys, function (key) {
							if(i==0){
								if(param.name.lastIndexOf("-")!=-1){
									chartOptions.push({field:key.name,value:param.name.substring(0, param.name.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
								}else{
									chartOptions.push({field:key.name,value:param.name,type:self.isDeppSpec.content.options.option})
								}
								
								i++;
							}
							
						});
					}
					self.isDeppSpec.$root.$broadcast('apply-fliter', chartOptions);
					resetDoubleClick();
				}, doubleClicker.timeBetweenClicks,options);
			}

			
			

			break;

		case 'funnel':
			var chartOptions = [];

			_.each(keys, function (key) {
				//param.seriesName.substring(0, param.seriesName.lastIndexOf("-"))
				chartOptions.push({field:key.name,value:param.seriesName.substring(0, param.seriesName.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
			});
			break;

		case 'sankey':
			if (param.dataType == 'edge') {
				var chartOptions = [];

				
				if (doubleClicker.clickedOnce === true && doubleClicker.timer) {
					resetDoubleClick();
					
					_.each(groups, function (group) {
						if(param.data.target.lastIndexOf("-")!=-1){
							chartOptions.push({field:group.name,value:param.data.target.substring(0, param.data.target.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
						}else{
							chartOptions.push({field:group.name,value:param.data.target,type:self.isDeppSpec.content.options.option})
						}
						
					});

					_.each(keys, function (key) {
						if(param.data.target.lastIndexOf("-")!=-1){
							chartOptions.push({field:group.name,value:param.data.target.substring(0, param.data.target.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
						}else{
							chartOptions.push({field:group.name,value:param.data.target,type:self.isDeppSpec.content.options.option})
						}
					});

					
					
					ondbclick(chartOptions, chartConfig);
				} else {
					doubleClicker.clickedOnce = true;
					var options = this;
					doubleClicker.timer = setTimeout(function(options){
						_.each(groups, function (group) {
							if(param.data.target.lastIndexOf("-")!=-1){
								chartOptions.push({field:group.name,value:param.data.target.substring(0, param.data.target.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
							}else{
								chartOptions.push({field:group.name,value:param.data.target,type:self.isDeppSpec.content.options.option})
							}
							
						});

						_.each(keys, function (key) {
							if(param.data.target.lastIndexOf("-")!=-1){
								chartOptions.push({field:group.name,value:param.data.target.substring(0, param.data.target.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
							}else{
								chartOptions.push({field:group.name,value:param.data.target,type:self.isDeppSpec.content.options.option})
							}
						});

						if(chartOptions.length!=0){
							self.isDeppSpec.$root.$broadcast('apply-fliter', chartOptions);
						}
						resetDoubleClick();
					}, doubleClicker.timeBetweenClicks,options);
				}
				
				
				



			}
			break;

		case 'radar':
			var chartOptions = [];
			
			if (doubleClicker.clickedOnce === true && doubleClicker.timer) {
				resetDoubleClick();
				
				
				if(chartConfig.asRow){
					_.each(keys,function(key){
						
						chartOptions.push({field:key.name,value:param.name.substring(0, param.name.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
					});
				}else{
					_.each(groups,function(group){
						chartOptions.push({field:key.name,value:param.name.substring(0, param.name.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})							
					});
				}
				
				
				
				ondbclick(chartOptions, chartConfig);
			} else {
				doubleClicker.clickedOnce = true;
				var options = this;
				doubleClicker.timer = setTimeout(function(options){
					if(chartConfig.asRow){
						_.each(keys,function(key){
							chartOptions.push({field:key.name,value:param.name.substring(0, param.name.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
						});
					}else{
						_.each(groups,function(group){
							chartOptions.push({field:key.name,value:param.name.substring(0, param.name.lastIndexOf("-")),type:self.isDeppSpec.content.options.option})
						});
					}
					if(chartOptions.length!=0){
						self.isDeppSpec.$root.$broadcast('apply-fliter', chartOptions);
					}
					
					resetDoubleClick();
				}, doubleClicker.timeBetweenClicks,options);
			}
			
			
			

			break;

		case 'wordCloud':
			_.each(sourceField, function(field){
				if($.inArray(field, _.map(keys, function(key){return key.name;}))!=-1){
					_.each(keys,function(key){
						if(key.name == field){
							paramValues.push(param.name.split("-")[key.index]);
						}
					});
				}else{
					paramValues.push("noMatch");
				}
			});
			break;

		case 'treeMap':
			var chartOptions = [];
			
			if (doubleClicker.clickedOnce === true && doubleClicker.timer) {
				resetDoubleClick();
				
				_.each(keys,function(key){
					if(param.treePathInfo[key.index+1]){
						chartOptions.push({field:key.name,value:param.treePathInfo[key.index+1].name,type:self.isDeppSpec.content.options.option})
					}
				});
				self.isDeppSpec.$root.$broadcast('apply-fliter', chartOptions);
				
				
				
				ondbclick(chartOptions, chartConfig);
			} else {
				doubleClicker.clickedOnce = true;
				var options = this;
				doubleClicker.timer = setTimeout(function(options){
					_.each(keys,function(key){
						if(param.treePathInfo[key.index+1]){
							chartOptions.push({field:key.name,value:param.treePathInfo[key.index+1].name,type:self.isDeppSpec.content.options.option})
						}
					});
					self.isDeppSpec.$root.$broadcast('apply-fliter', chartOptions);
					
					resetDoubleClick();
				}, doubleClicker.timeBetweenClicks,options);
			}
			
			

			break;

		default:
			break;
		}
		loader("body");
		if($("#menuInfoTabs").attr("is-expanded")==="false"){
			$("#menuInfo").css({"bottom":"0"});
			$("#menuInfoTabs").attr("is-expanded","true");
			$("#logViewDiv").slideToggle("slow");
		}
		
		setTimeout(function(){
			$("#dashboardsWidgets").css("height",$( window ).height()-$('#menuInfoWrapper').height()-80);
			$("#dashboardsWidgets").css("overflow-x","hidden");
			$("#dashboardsWidgets").css("overflow-y","scroll");
		},2000);

		
	},800);
	});

	self.ecc.on('datazoom', function (evt) {
		var axis = self.ecc.getModel().option.xAxis[0];
		var starttime = axis.data[axis.rangeStart];
		var endtime = axis.data[axis.rangeEnd];
		var opt = { 
				startDate:parseInt(starttime), 
				endDate: parseInt(endtime),
				renderAllWidgets:true,
				dateLabel:'teest'
		}
		self.isDeppSpec.$root.$broadcast('apply-time-filter', opt);
	});
	
	self.ecc.on('restore', function (evt) {
		console.log(evt)
	});

	

	function suppressSelection(chart, params) {
		chart.setOption({ animation: false });

		// Re-select what the user unselected
		chart.dispatchAction({
			type: 'legendSelect',
			name: params.name
		});   

		chart.setOption({ animation: true });
	}
};