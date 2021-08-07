
Highcharts.SparkLine = function (a, b, c) {
	var hasRenderToArg = typeof a === 'string' || a.nodeName,
	options = arguments[hasRenderToArg ? 1 : 0],
	defaultOptions = {
			chart: {
				renderTo: (options.chart && options.chart.renderTo) || this,
				backgroundColor: null,
				borderWidth: 0,
				type: 'area',
				margin: [2, 0, 2, 0],
				width: 120,
				height: 20,
				style: {
					overflow: 'visible'
				},

				// small optimalization, saves 1-2 ms each sparkline
				skipClone: true
			},
			title: {
				text: ''
			},
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			xAxis: {
				labels: {
					enabled: false
				},
				title: {
					text: null
				},
				startOnTick: false,
				endOnTick: false,
				tickPositions: []
			},
			yAxis: {
				endOnTick: false,
				startOnTick: false,
				labels: {
					enabled: false
				},
				title: {
					text: null
				},
				tickPositions: [0]
			},
			legend: {
				enabled: false
			},
			tooltip: {
				hideDelay: 0,
				outside: true,
				shared: true
			},
			plotOptions: {
				series: {
					animation: false,
					lineWidth: 1,
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					},
					marker: {
						radius: 1,
						states: {
							hover: {
								radius: 2
							}
						}
					},
					fillOpacity: 0.25
				},
				column: {
					negativeColor: '#910000',
					borderColor: 'silver'
				}
			}
	};

	options = Highcharts.merge(defaultOptions, options);

	return hasRenderToArg ?
			new Highcharts.Chart(a, options, c) :
				new Highcharts.Chart(options, b);
};

var currentScope;


var CBoardTableRender = function (jqContainer, options, drill) {
	this.container = jqContainer; // jquery object
	this.options = options;
	this.tall;
	this.drill = drill;
	var _this = this;
	$(this.container).resize(function (e) {
		_this.resize(e.target);
	});
};



CBoardTableRender.prototype.resize = function (container) {
	var wrapper = $(container).find('.table_wrapper');
	wrapper.css('width', 'auto');
	if (wrapper.width() < $(container).width()) {
		wrapper.css('width', '100%');
	}
};

CBoardTableRender.prototype.do = function (tall, persist) {
	this.tall = tall;
	tall = _.isUndefined(tall) ? 500 : tall;
	var divHeight = tall - 110;
	var _this = this;



	var render = function (o, drillConfig) {
		_this.options = o;
		_this.drill.config = drillConfig;
		_this.do(_this.tall);
	};
	var args = {
			tall: divHeight,
			chartConfig: this.options.chartConfig,
			data: this.options.data,
			container: this.container,
			drill: this.drill,
			render: render
	};
	crossTable.table(args);
	$(this.container).css({
		height: tall + "px"
	});
	this.resize(this.container);
	if (persist) {
		persist.data = this.options.data;
		persist.type = "table"
	}
	return render;
};

CBoardTableRender.prototype.doDataTable = function (tall, persist,scope,widget) {
	this.tall = tall;
	tall = _.isUndefined(tall) ? 500 : tall;
	var divHeight = tall - 110;
	var _this = this;
	var render = function (o, drillConfig) {
		_this.options = o;
		_this.drill.config = drillConfig;
		_this.do(_this.tall);
	};

	currentScope = scope;

	var id = "chart-table-"+Math.random();
	


	

	if(widget.chartConfig.requestFrom!="reports"){
		var presentUrl =  window.location.hash;
		var className = localStorage.getItem("themeType") === 'white'? 'ag-theme-balham':'ag-theme-balham-dark';
//		if(presentUrl && presentUrl.includes("dashboard-new") || presentUrl.includes("reports") || presentUrl.includes("load-report") || presentUrl.includes("alerts") || presentUrl.includes("cases") ){
//			className = (localStorage.getItem("dashboard-themeType") === 'theme-dark-full') ? 'ag-theme-balham-dark' : 'ag-theme-balham';
//		}else{
//			className = 'ag-theme-balham-dark' ;
//		}1


		$(this.container).append("<div id='"+id+"' style = 'height: 100%; width: 100%;' class='"+className+"'></div>");

	}
	
	var isSparkLineEnabled = this.options.chartConfig.sparkLine === 'Yes';


	var cols = [];
	var isGroupEnable = this.options.chartConfig.groups.length!=0;

       for(var i=0;i<this.options.chartConfig.groups.length;i++){


                     var headerName = "";
        			if(this.options.chartConfig.groups[i].col === 'title'){
        				headerName = "Title";
        			}else if(this.options.chartConfig.groups[i].col === 'caseType'){
        				headerName = "Case Type";
        			}
        			else if(this.options.chartConfig.groups[i].col === 'createdBy'){
        				headerName = "Created By";
        			}
        			else if(this.options.chartConfig.groups[i].col === 'assignedUser'){
        				headerName = "Owner";
        			}
        			else if(this.options.chartConfig.groups[i].col === 'respondedDate'){
        				headerName = "Responded On";
        			}
        			else if(this.options.chartConfig.groups[i].col === 'closedDate'){
        				headerName = "Closed Date";
        			}
        			else if(this.options.chartConfig.groups[i].col === 'reslovedDate'){
        				headerName = "Resloved On";
        			}
        			else if(this.options.chartConfig.groups[i].col === 'isSLABreched'){
        				headerName = "Over Due";
        			}
        			else if(this.options.chartConfig.groups[i].col === 'isResponded'){
        				headerName = "Is Responded";
        			}

        			else{
        				headerName = this.options.chartConfig.groups[i].col;
        			}
        			var key = "";
        			if(this.options.chartConfig.groups[i].col.includes("rule_data.event_data.")){
        				key = this.options.chartConfig.groups[i].col.replace("rule_data.event_data.","");
        			}else if (this.options.chartConfig.groups[i].col.includes("event_data.")){
        				key = this.options.chartConfig.groups[i].col.replace("event_data.","");
        			}else{
        				key = this.options.chartConfig.groups[i].col;
        			}
        			cols.push({ headerName:headerName, field:key,pivot: true})


     }

        var sparklineCols = [];

		for(var i=0;i<this.options.chartConfig.keys.length;i++){

			var headerName = "";
			if(isSparkLineEnabled){
				if(this.options.chartConfig.keys[i].col != '@timestamp'){
				    sparklineCols.push(i);
				}
			}
			if(this.options.chartConfig.keys[i].col === 'title'){
				headerName = "Title";
			}else if(this.options.chartConfig.keys[i].col === 'caseType'){
				headerName = "Case Type";
			}
			else if(this.options.chartConfig.keys[i].col === 'createdBy'){
				headerName = "Created By";
			}
			else if(this.options.chartConfig.keys[i].col === 'assignedUser'){
				headerName = "Owner";
			}
			else if(this.options.chartConfig.keys[i].col === 'respondedDate'){
				headerName = "Responded On";
			}
			else if(this.options.chartConfig.keys[i].col === 'closedDate'){
				headerName = "Closed Date";
			}
			else if(this.options.chartConfig.keys[i].col === 'reslovedDate'){
				headerName = "Resloved On";
			}
			else if(this.options.chartConfig.keys[i].col === 'isSLABreched'){
				headerName = "Over Due";
			}
			else if(this.options.chartConfig.keys[i].col === 'isResponded'){
				headerName = "Is Responded";
			}

			else{
				headerName = this.options.chartConfig.keys[i].col;
			}
			var key = "";
			if(this.options.chartConfig.keys[i].col.includes("rule_data.event_data.")){
				key = this.options.chartConfig.keys[i].col.replace("rule_data.event_data.","");
			}else if (this.options.chartConfig.keys[i].col.includes("event_data.")){
				key = this.options.chartConfig.keys[i].col.replace("event_data.","");
			}else{
				key = this.options.chartConfig.keys[i].col;
			}
			cols.push(
                    { headerName:headerName,
                     field:key,rowGroup: isGroupEnable,
                     filter: 'agTextColumnFilter',
                     filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true}

                   }
		    )
		}
        var values = this.options.chartConfig.values[0].cols;

		for(var i=0;i<values.length;i++){
		     var headerName = "";

                 headerName = values[i].col+"_"+values[i].aggregate_type;



            			cols.push(
                                { headerName:headerName,
                                 field:headerName,
                                 enableValue: true,
                                 filter: 'agTextColumnFilter',
                                 aggFunc: 'min',
                                 filterParams: {filterOptions: ['contains'],suppressAndOrCondition: true},
                                 cellStyle: (function(params) {
                                    if(this.options.chartConfig.thresholds){
                                        for(var j=0;j<this.options.chartConfig.thresholds.length;j++){
                                            if(isNumeric(params.value)){
                                                if(this.options.chartConfig.thresholds[j+1]){
                                                    var x = parseInt(params.value);
                                                    if(x > this.options.chartConfig.thresholds[j].fromValue && x < this.options.chartConfig.thresholds[j+1].fromValue){
                                                          if(this.options.chartConfig.tableType === 'color_text'){
                                                              return {color: this.options.chartConfig.thresholds[j].color};
                                                          }else if(this.options.chartConfig.tableType === 'color_background'){
                                                             return {color: 'white',backgroundColor:this.options.chartConfig.thresholds[j].color};
                                                          }

                                                    }
                                                }else{
                                                     if(this.options.chartConfig.tableType === 'color_text'){
                                                           return {color: this.options.chartConfig.thresholds[j].color};
                                                      }else if(this.options.chartConfig.tableType === 'color_background'){{
                                                          return {color: 'white',backgroundColor:this.options.chartConfig.thresholds[j].color};
                                                      }
                                                }


                                            }

                                        }
                                    }
                                    }

                                 }).bind(this)
                               }
            		    )
		}



		//cols.push({title:this.options.data[0][i].data})



    if(isSparkLineEnabled){
    	cols.push(
            {
        headerName: 'Trend',
        field: 'trend',
        width: 150,
        resizable: false,
        suppressSizeToFit: true,
        cellRenderer: 'lineChartLineRenderer'
    }
    	);
    }



	var data = [];
	for(var i=0;i<this.options.data.data.length;i++){
		var data1 = new Object();
		for(var j=0;j<this.options.data.data[i].length;j++){
		    if(isNumeric(this.options.data.data[i][j])){
		        data1[cols[j].field] = parseInt(this.options.data.data[i][j]);
		    }else{
		        data1[cols[j].field] = this.options.data.data[i][j];
		    }


		}
		if(isSparkLineEnabled && cols.length>0){

			data1['trend'] = this.options.data.sparkLineData[this.options.data.data[i][sparklineCols[0]]];
		}
		data.push(data1)
	}

function LineChartLineRenderer() {
}

LineChartLineRenderer.prototype.init = function(params) {

    var eGui = document.createElement('div');
    this.eGui = eGui;

    // sparklines requires the eGui to be in the dom - so we put into a timeout to allow
    // the grid to complete it's job of placing the cell into the browser.
    setTimeout(function() {
        var values = params.value;

        if(values.length<=1){
            values.unshift(100);
        }

        $(eGui).sparkline(values, { height: 20, width: 130,lineColor: '#05a934',
    fillColor: '#141619' });
    }, 0);
};

LineChartLineRenderer.prototype.getGui = function() {
    return this.eGui;
};



	if(widget.chartConfig.requestFrom!="reports"){

		var gridOptions = {
				defaultColDef:{
					editable: false,
					enableRowGroup:true,
					enablePivot:true,
					enableValue:true,
					sortable: true,
					resizable: true,
					filter: true
				},
				autoGroupColumnDef: {
					width: 180
				},

				animateRows: true,
				debug: false,
				suppressAggFuncInHeader: true,
				pivotMode: isGroupEnable,


				rowSelection: 'single',
				columnDefs: cols,
				rowData: data,
				floatingFilter:true,
				paginationAutoPageSize:true,
				pagination: true,
				components: {
                    lineChartLineRenderer: LineChartLineRenderer,

                },
				onGridReady: function (params) {
			        window.onresize = () => {
			        	setTimeout(function(){
				           params.api.sizeColumnsToFit();
			        	},500);
			        }
				},
				onFirstDataRendered(params) {
					params.api.sizeColumnsToFit();
				}
		}
		var eGridDiv = $(this.container).find("div")[0];


		new agGrid.Grid(eGridDiv, gridOptions);


		$(this.container).css({
			height: tall + "px"
		});
		this.resize(this.container);
		if (persist) {
			persist.data = this.options.data;
			persist.type = "table"
		}
		gridOptions.onCellClicked = function(params){
			 scope.$emit('apply-fliter',[{field:params.column.colId,value:params.value}]);
		}
	}else{
		
		
		
		var str = [];
		str.push("<table class = 'table'>");
		str.push("<thead>")
		str.push("<tr>");

		for(var i=0;i<cols.length;i++){
			str.push("<th> "+cols[i].headerName+"</th>")
		}

		str.push("</tr>");


		str.push("</thead>");
		str.push("<tbody>");
		

		for(var i=0;i<data.length;i++){
			str.push("<tr>");


			for (var k in data[i]){
				if (data[i].hasOwnProperty(k)) {

					str.push("<td>"+data[i][k]+"</td>");
				}
			}






			str.push("</tr>");

		}


		str.push("</tbody>")
		str.push("</table>")

		
		
		console.log("generated")

		//gridOptions.api.setDomLayout('autoHeight');

		//$(this.container).find("div").parent().height(gridOptions.rowData.length*20)

		$(this.container).css("height", "auto");

		$(this.container).append(str.join(" "));
		
		//gridOptions.api.setDomLayout('autoHeight');


	}


















//	crossTable.table(args);


	return render;
};

 function isNumeric(value) {
        return /^-?\d+$/.test(value);
}




