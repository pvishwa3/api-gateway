
'use strict';


app.service('chartTableService', function () {

    this.render = function (containerDom, option, scope, persist, drill) {
        if (option == null) {
            containerDom.html("<div class=\"alert alert-danger\" role=\"alert\">No Data!</div>");
            return;
        }
        var height;
        
        scope ? height = scope.myheight - 20 : null;
        if(option.chartConfig.tableType == 'corssTable'){
        	 return new CBoardTableRender(containerDom, option, drill).do(height, persist);
        }else{
        	 return new CBoardTableRender(containerDom, option, drill).doDataTable(height, persist,scope,option);
        }
    };

    this.parseOption = function (data) {
        var tableOption = chartDataProcess(data.chartConfig, data.keys, data.series, data.data, data.seriesConfig);
       
        return tableOption;
    };
});