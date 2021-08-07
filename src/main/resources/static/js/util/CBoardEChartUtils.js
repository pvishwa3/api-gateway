/**
 * Created by peter on 2017/8/3.
 */
var updateEchartOptions = function(tuningOpt, rawOpt) {
    if (tuningOpt) {
    	try{
	    	if(tuningOpt.legendType == 'labels' && rawOpt.series[0].type == 'pie'){
	    		rawOpt.series[0].itemStyle.normal.label.show = true;
	    		rawOpt.series[0].itemStyle.normal.labelLine.show = true;
	    		rawOpt.legend.show = false;
	    		return "";
	    	}
    	}catch(err){
    		
    	}
        if (tuningOpt.dataZoom == true) {
            rawOpt.dataZoom = {
                show: true,
                start : 0,
                end: 100
            };
        }
        
        // legend
        rawOpt.grid === undefined ? rawOpt.grid = angular.copy(echartsBasicOption.grid) : null;
        if (tuningOpt.legendShow == false) {
            rawOpt.grid.top = '5%';
            rawOpt.legend.show =false;
        } else {
            rawOpt.legend === undefined ? rawOpt.legend = angular.copy(echartsBasicOption.legend) : null;
            tuningOpt.legendX ? rawOpt.legend.x = tuningOpt.legendX : null;
            tuningOpt.legendY ? rawOpt.legend.y = tuningOpt.legendY : null;
            tuningOpt.legendOrient ? rawOpt.legend.orient = tuningOpt.legendOrient : null;
        }

        // grid
        if (tuningOpt.gridCustom == true) {
            tuningOpt.gridTop ? rawOpt.grid.top = tuningOpt.gridTop : null;
            tuningOpt.gridBottom ? rawOpt.grid.bottom = tuningOpt.gridBottom : null;
            tuningOpt.gridLeft ? rawOpt.grid.left = tuningOpt.gridLeft : null;
            tuningOpt.gridRight ? rawOpt.grid.right = tuningOpt.gridRight : null;
        }
    }
};
