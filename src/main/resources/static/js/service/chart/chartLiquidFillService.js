
'use strict';
app.service('chartLiquidFillService', function () {

	this.render = function (containerDom, option, scope, persist) {
		if (option == null) {
			containerDom.html("<div class=\"alert alert-danger\" role=\"alert\">No Data!</div>");
			return;
		}
		if(option.type){
			
			
			
			
			var tempValue = option.value*0.50;
			
			var levelColors  =  [
	            "#00fff6",
	            "#ff00fc",
	            "#1200ff"
	          ];

			var color = "#333";
			var valueFontColor = "#333";
			if(localStorage.getItem("dashboard-themeType")!='theme-navy'){
				color = "#ffffff";
				valueFontColor = "#ffffff";
				levelColors = [
		            "#31bfff",
		            "#2599cc",
		            "#0f5470"
		          ];
			}
			
			new JustGage({
		        id: containerDom[0].id,
		        value: option.value,
		        min: 0,
		        max: Math.round(option.value+tempValue),
		      
		        label: option.label,
		        labelFontColor: color,
		        valueFontColor: valueFontColor,
		        levelColors: levelColors,
		        gaugeWidthScale: 1.2,
		        relativeGaugeSize: true,
		      });

			// update

		}else{
			var height;
			scope ? height = scope.myheight - 20 : null;
			return new CBoardEChartRender(containerDom, option).chart(height, persist);
		}

	};

	this.parseOption = function (data) {
		var config = data.chartConfig;
		var maxValue = config.values[0].maxValue ? config.values[0].maxValue : 100;
		console.log(maxValue);

		var animation = true;
		if (config.animation == 'static') {
			animation = false;
		}

		var style = config.values[0].style ? config.values[0].style : "circle";
		
		var label = config.values[0].label ? config.values[0].label : "";
		
		

		var datas = [];
		var value = data.data.length > 0 ? data.data[0][0] : 'N/A';
		if (value != 'N/A' && value < maxValue) {
			for (var i = 1; i < 5; i++) {
				var percent = 1;
				for (var j = 1; j < i; j++) {
					percent = percent * 0.95;
				}
				datas.push(value * percent / maxValue);
			}
		}
		if(value != 'N/A' && value >= maxValue){
			for( var i = 0;i < 5;i ++){
				datas.push(1)
			}
		}

		var option = {};

		if(style === 'pie'){
			option = {

					type:'pie',
					value: parseInt(value),
					maxValue:maxValue,
					label:label
					
			}
		}else{
			option = {
					series: [{
						type: 'liquidFill',
						shape: style,
						data: datas,
						waveAnimation: animation,
						radius: '70%',
						backgroundStyle: {
							borderWidth: 2,
							borderColor: '#156ACF'
						},
						outline: {
							show: false
						}
					}],
					label:{
						textStyle: {
							fontSize: 35,
							fontFamily: 'Lobster Two',
							color:"#000"
						}
					}
			};
		}

		if(style !='pie'){

			if(datas[0] == 1){
				option.label.normal = {
						formatter:"I'm full."
				}
			}
		}
		return option;
	};
});