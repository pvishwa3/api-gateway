
'use strict';
app.service('chartKpiService', function (dataService, $compile, $filter) {

	var translate = $filter('translate');

	this.render = function (containerDom, option, scope, persist) {

	    const FONT_SCALE = 1;

        var height = $(containerDom).parent().parent().height();
        var width = $(containerDom).parent().parent().width();
        const dimension = Math.min(width, height);

       //

        $(containerDom).append("<div style = 'position: absolute;right: 0px;bottom: 0px;' ><div style='position:relative;' class='sparkline'></div></div>");
        var fontScale
        if(option.kpiValue.length>12){
          fontScale =  FONT_SCALE - (length * 5) / 110;
        }else{
           fontScale = FONT_SCALE - (length * 5) / 101;
        }

        let fontSize = Math.min(dimension / 4, 100) * (fontScale);
        if(fontSize<30){
            fontSize = 30;
        }
        var finalHeight = calculateFontSize(containerDom);
		var render = new CBoardKpiRender(containerDom, option);
		var html = render.html(persist);
		var backGround = "#141619";
		var fontColor = option.color;
		var chartColor = "#141619";
        var fillColor = "#141619";

        if(option.colorType==='color_background'){
                   backGround = 'transparent';
                   var radiantColor = shadeColor(option.color,40);
                   fillColor = shadeColor(option.color,80);
                   $(containerDom).parent().parent().css("background", "linear-gradient(120deg, "+option.color+", "+radiantColor+")");
                   fontColor = "white"
      }

        var currentHeight = height/2;

        if(!option.sparkLineData || (option.sparkLineData && option.sparkLineData.length<=1)){
            currentHeight = height;
        }

        var finalWidth = width-50;
		var layout = {
          width: width,
          height: currentHeight+30,
          paper_bgcolor: backGround,
          margin: { t: 0, b: 0, l: 0, r: 2 }
        };


        var data = [
          {
            type: "indicator",
            mode: "number+delta",
            value: option.kpiValue,
            number: {font:{
              color:fontColor,
              size:fontSize
            } },
            font:{
              color:'red'
            },
            delta: { position: "bottom", reference: option.kpiPercentageOfChange },
            domain: { x: [0, 1], y: [0, 1] }
          }
        ];
        Plotly.newPlot(containerDom[0], data,layout);
        if(height>100){
                var currentWidth = Math.round(width);
                      var finalColor = shadeColor(fontColor,120);
                      $(containerDom).find("div.sparkline").sparkline(option.sparkLineData, {

                          type: 'line',
                          width: currentWidth,
                          height:height/2,
                          lineColor: fontColor,
                          fillColor: fillColor

                          }
                          );
        }


		return render.realTimeTicket();
	};

	function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;
        G = (G<255)?G:255;
        B = (B<255)?B:255;

        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }


	function calculateFontSize(el) {
	    var height = $(el).parent().parent().height();
            var width = $(el).parent().parent().width();
	    const dimension = Math.min(width, height * 1.3);
        const fontScale = parseInt(80, 10) / 100;
        const fontSize = Math.min(dimension / 5, 100) * fontScale;
        return fontSize;
    }

    function calcTextSize(text) {
        const parentContainerWidth = text[0].parentNode.parentNode.clientWidth;
        const currentTextWidth = text[0].scrollWidth;
        const currentFontSize = parseInt(window.getComputedStyle(text).fontSize);
        const newValue = Math.min(Math.max(16, (parentContainerWidth / currentTextWidth) * currentFontSize), 500)
        return newValue;
     }

	this.parseOption = function (data) {
		var option = {};
		var config = data.chartConfig;
		var casted_keys = data.keys;
		var casted_values = data.series;

		var color = "";

		var cols = config.values[0].cols;

		if(data.chartConfig.values[0].cols[0].configuration){
			color = data.chartConfig.values[0].cols[0].configuration.color;
		}

		//var color = data.chartConfig.values[0].cols[0].configuration.color;

		if(color === ''){
			color = "#fff"
		}



		if(data.data == undefined){
			var aggregate_data = data;
		}else{
			var aggregate_data = data.data;
		}

		var newValuesConfig = data.seriesConfig;

		option.sparkLineData = data.sparkLineData;

		option.kpiValue = aggregate_data.length > 0 ? aggregate_data[0][0] : 'N/A';

		option['color'] = getColor(data,option.kpiValue);
		option['colorType'] = data.chartConfig.tableType;

		if(option.kpiValue.length==1 || option.kpiValue.length==2){
			option['margin'] = '15%'
		}else{
			option['margin'] = '0%'
		}
		if(aggregate_data[0][1]){
			option['kpiPercentageOfChange'] = aggregate_data.length > 0 ? Math.abs(aggregate_data[0][1]) : 'N/A'

				if(option.kpiPercentageOfChange == 0){
					option['textColor'] = "";
					option['class'] = "text-success";
				}else if(parseInt(option.kpiPercentageOfChange) < parseInt(aggregate_data[0][0])  ){
					option['image'] = "icon";
					option['textColor'] = "fa fa-sort-asc";
					option['class'] = "text-danger";

				}else if(parseInt(option.kpiPercentageOfChange)>parseInt(aggregate_data[0][0])  ){
					option['image'] = "icon";
					option['textColor'] = "fa fa-sort-down";
					option['class'] = "text-success";
				}
				else if(parseInt(option.kpiPercentageOfChange)===parseInt(aggregate_data[0][0])  ){
					option['image'] = "icon";
					option['textColor'] = "fa fa-window-minimize";
					option['class'] = "text-primary";
				}
			if(option['kpiPercentageOfChange'].length ===1){
				option['padding'] = '2%'
			}else{
				option['padding'] = '0%'
			}

			option.kpiPercentageOfChange = numbro(option.kpiPercentageOfChange).format("0a.[00]");;

		}else{
			option['kpiPercentageOfChange'] = "";
		}


		if(data.title){
			option['title'] = data.title;
		}else{
			option['title'] = "";
		}
		var formatterType = "number";

		if(cols[0].configuration && cols[0].configuration.format){
			formatterType = cols[0].configuration.format;
		}



		if(formatterType && formatterType==='bytes'){
			option.kpiValue = numbro(option.kpiValue).format("0 b");
			if(option.kpiPercentageOfChange){
				option.kpiPercentageOfChange = numbro(option.kpiPercentageOfChange).format("0 b");
			}

		}



		if(data.chartConfig.option.subTitle){
			option['subTitle'] = data.chartConfig.option.subTitle;
		}else{
			option['subTitle'] = "";
		}
		if(option.kpiValue.indexOf(".")!=-1){
			option['kpiClass'] = "test-with-4"
		}else{

			option['kpiClass'] = "test-with-3"
		}


		//option.kpiPercentageOfChange = numbro(option.kpiPercentageOfChange).format("0a.[00]");;

		option.kpiName = config.values[0].name;
		option.style = config.values[0].style;
		option.edit = translate("COMMON.EDIT");
		option.refresh = translate("COMMON.REFRESH");
		return option;
	};

	function getColor(options,value){
     if(options.chartConfig.thresholds){
                                            for(var j=0;j<options.chartConfig.thresholds.length;j++){
    if(options.chartConfig.thresholds[j+1]){
                                                            var x = parseInt(value);
                                                            if(x > options.chartConfig.thresholds[j].fromValue && x < options.chartConfig.thresholds[j+1].fromValue){
                                                                  if(options.chartConfig.tableType === 'color_text'){
                                                                      return options.chartConfig.thresholds[j].color;
                                                                  }else if(options.chartConfig.tableType === 'color_background'){
                                                                     return options.chartConfig.thresholds[j].color;
                                                                  }

                                                            }
                                                        }else{
                                                             if(options.chartConfig.tableType === 'color_text'){
                                                                   return options.chartConfig.thresholds[j].color;
                                                              }else if(options.chartConfig.tableType === 'color_background'){{
                                                                  return options.chartConfig.thresholds[j].color;
                                                              }
                                                        }

            return "#65b153";
    	}
    	}
     }}
});

