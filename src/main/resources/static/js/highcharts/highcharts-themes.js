/**
 * @license Highcharts JS v7.0.1 (2018-12-19)
 *
 * (c) 2009-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return factory;
		});
	} else {
		factory(typeof Highcharts !== 'undefined' ? Highcharts : undefined);
	}
}(function (Highcharts) {
	(function (Highcharts) {
		/**
		 * (c) 2010-2018 Torstein Honsi
		 *
		 * License: www.highcharts.com/license
		 *
		 * Dark blue theme for Highcharts JS
		 * @author Torstein Honsi
		 */

		var highChartDarkTheme = {
			    colors: ['#006cb1', '#90c8e3', '#009b00', '#9cdd74', '#ff6700', '#ffb600',
			        '#bfb1ea', '#e70818', '#3b3621', '#7798BF', '#aaeeee'],
			    chart: {
			    	backgroundColor:"#16191b",
			        
			        plotBorderColor: '#16191b'
			    },
			    title: {
			        style: {
			            color: '#E0E0E3',
			            textTransform: 'uppercase',
			            fontSize: '20px'
			        }
			    },
			    subtitle: {
			        style: {
			            color: '#E0E0E3',
			            textTransform: 'uppercase'
			        }
			    },
			    xAxis: {
			        gridLineColor: '#707073',
			        labels: {
			            style: {
			                color: '#E0E0E3'
			            }
			        },
			        lineColor: '#707073',
			        minorGridLineColor: '#505053',
			        tickColor: '#707073',
			        title: {
			            style: {
			                color: '#A0A0A3'

			            }
			        }
			    },
			    yAxis: {
			        gridLineColor: '#707073',
			        labels: {
			            style: {
			                color: '#E0E0E3'
			            }
			        },
			        lineColor: '#707073',
			        minorGridLineColor: '#505053',
			        tickColor: '#707073',
			        tickWidth: 1,
			        title: {
			            style: {
			                color: '#A0A0A3'
			            }
			        }
			    },
			    tooltip: {
			        backgroundColor: 'rgba(0, 0, 0, 0.85)',
			        style: {
			            color: '#F0F0F0'
			        }
			    },
			    plotOptions: {
			        series: {
			            dataLabels: {
			                color: '#B0B0B3'
			            },
			            marker: {
			                lineColor: '#333'
			            }
			        },
			        boxplot: {
			            fillColor: '#505053'
			        },
			        candlestick: {
			            lineColor: 'white'
			        },
			        errorbar: {
			            color: 'white'
			        }
			    },
			    legend: {
			        itemStyle: {
			            color: '#E0E0E3'
			        },
			        itemHoverStyle: {
			            color: '#FFF'
			        },
			        itemHiddenStyle: {
			            color: '#606063'
			        }
			    },
			    credits: {
			        style: {
			            color: '#666'
			        }
			    },
			    labels: {
			        style: {
			            color: '#707073'
			        }
			    },

			    drilldown: {
			        activeAxisLabelStyle: {
			            color: '#F0F0F3'
			        },
			        activeDataLabelStyle: {
			            color: '#F0F0F3'
			        }
			    },

			    navigation: {
			        buttonOptions: {
			            symbolStroke: '#DDDDDD',
			            theme: {
			                fill: '#505053'
			            }
			        }
			    },

			    // scroll charts
			    rangeSelector: {
			        buttonTheme: {
			            fill: '#505053',
			            stroke: '#000000',
			            style: {
			                color: '#CCC'
			            },
			            states: {
			                hover: {
			                    fill: '#707073',
			                    stroke: '#000000',
			                    style: {
			                        color: 'white'
			                    }
			                },
			                select: {
			                    fill: '#000003',
			                    stroke: '#000000',
			                    style: {
			                        color: 'white'
			                    }
			                }
			            }
			        },
			        inputBoxBorderColor: '#505053',
			        inputStyle: {
			            backgroundColor: '#333',
			            color: 'silver'
			        },
			        labelStyle: {
			            color: 'silver'
			        }
			    },

			    navigator: {
			        handles: {
			            backgroundColor: '#666',
			            borderColor: '#AAA'
			        },
			        outlineColor: '#CCC',
			        maskFill: 'rgba(255,255,255,0.1)',
			        series: {
			            color: '#7798BF',
			            lineColor: '#A6C7ED'
			        },
			        xAxis: {
			            gridLineColor: '#505053'
			        }
			    },

			    scrollbar: {
			        barBackgroundColor: '#808083',
			        barBorderColor: '#808083',
			        buttonArrowColor: '#CCC',
			        buttonBackgroundColor: '#606063',
			        buttonBorderColor: '#606063',
			        rifleColor: '#FFF',
			        trackBackgroundColor: '#404043',
			        trackBorderColor: '#404043'
			    },

			    // special colors for some of the
			    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
			    background2: '#16191b',
			    dataLabelsColor: '#B0B0B3',
			    textColor: '#C0C0C0',
			    contrastTextColor: '#F0F0F3',
			    maskColor: 'rgba(255,255,255,0.3)'
			};

			var highChartLightTheme = {
					  "colors": ["#d35400", "#2980b9", "#2ecc71", "#f1c40f", "#2c3e50", "#7f8c8d"],
					  "chart": {
					    "style": {
					      "fontFamily": "Roboto",
					      "color": "#666666"
					    }
					  },
					  "title": {
					    "align": "left",
					    "style": {
					      "fontFamily": "Roboto Condensed",
					      "fontWeight": "bold"
					    }
					  },
					  "subtitle": {
					    "align": "left",
					    "style": {
					      "fontFamily": "Roboto Condensed"
					    }
					  },
					  "legend": {
					    "align": "right",
					    "verticalAlign": "bottom"
					  },
					  "xAxis": {
					    "gridLineWidth": 1,
					    "gridLineColor": "#F3F3F3",
					    "lineColor": "#F3F3F3",
					    "minorGridLineColor": "#F3F3F3",
					    "tickColor": "#F3F3F3",
					    "tickWidth": 1
					  },
					  "yAxis": {
					    "gridLineColor": "#F3F3F3",
					    "lineColor": "#F3F3F3",
					    "minorGridLineColor": "#F3F3F3",
					    "tickColor": "#F3F3F3",
					    "tickWidth": 1
					  },
					  "plotOptions": {
					    "line": {
					      "marker": {
					        "enabled": false
					      }
					    },
					    "spline": {
					      "marker": {
					        "enabled": false
					      }
					    },
					    "area": {
					      "marker": {
					        "enabled": false
					      }
					    },
					    "areaspline": {
					      "marker": {
					        "enabled": false
					      }
					    },
					    "arearange": {
					      "marker": {
					        "enabled": false
					      }
					    },
					    "bubble": {
					      "maxSize": "10%"
					    }
					  }
					}
			
			

		// Apply the theme
			var themeName = localStorage.getItem("dashboard-themeType");
			if(themeName && themeName==='theme-dark-full'){
				//Highcharts.setOptions(highChartLightTheme);
			}else{
			//	Highcharts.setOptions(highChartLightTheme);
			}

	}(Highcharts));
	return (function () {


	}());
}));
