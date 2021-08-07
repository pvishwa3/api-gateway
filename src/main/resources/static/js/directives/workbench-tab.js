

'use strict';

app.directive('workbenchTab', function(investigationPanelFactory) {

	return {
		restrict: 'E',
		scope: {
			filter: '=fitler',
			panel:"=panel"
		},
		templateUrl: 'templates/workbench/widgetpannel.html',
		link: function(scope) {

		
			
			scope.$on('workbenchTabReload', function(event, opt) {

				//opt.panel = scope.panel;

				//self.filter = {startDate:$scope.startDate,endDate:$scope.endDate,query:"",panel:""}
				var dataForm = {startDate:opt.startDate,endDate:opt.endDate,query:opt.query,panel:scope.panel};
				
				investigationPanelFactory.loadPanelDetails(dataForm).then(function (response){
					if(response.data.data.length>0){
						scope.pannelId = scope.panel.replace(/ /g,"_");
						scope.tableDetails = response.data.data;
						scope.panelHeader = response.data.data[0];


						var str = [];

						var tempValues = [];

						for (var key in scope.panelHeader) {
							if(key!="$$hashKey"){
								tempValues.push(key);
							}
						}	




						var tableHeader = [];



						tableHeader.push("<div class='table-responsive' style='height: 300px'>")
						tableHeader.push("<table class='table dataTable table-bordered table-framed table-fixed'  id='"+scope.pannelId+"'>");
						tableHeader.push("<thead>");
						tableHeader.push("<tr>");
						for(var i=0;i<tempValues.length;i++){
							tableHeader.push("<th  > "+tempValues[i]+"</th>");
						}
						tableHeader.push("</tr>");
						tableHeader.push("</thead>");

						tableHeader.push("<tbody>");

						for(var i=0;i<scope.tableDetails.length;i++){
							tableHeader.push("<tr>");
							for (var key in scope.tableDetails[i]) {
								if(key!="$$hashKey"){
									tableHeader.push("<td>"+scope.tableDetails[i][key]+"</td>");
								}
							}
							tableHeader.push("</tr>");
						}
						tableHeader.push("</tbody>");



						tableHeader.push("</table>")
						tableHeader.push("</div>")
						tableHeader.push("</div>")
						tableHeader.push("</div>");
						
						$("#table-div-"+scope.pannelId).empty();

						if ( $.fn.DataTable.isDataTable( '#'+scope.pannelId ) ) {
							$('#'+scope.pannelId).DataTable().clear().destroy();
						}

						

						$('#'+scope.pannelId).empty();


						


						$("#table-div-"+scope.pannelId).append(tableHeader.join(''))



						
						//unloader($("body"));



					
					}else{
						$("#table-div-"+scope.pannelId).empty();
					
						$("#table-div-"+scope.pannelId).append("<h4>")
						$("#table-div-"+scope.pannelId).append("<h4> No Data Found</h4>")

					}






				},function(error){
					unloader("body");
				});


			})


		}

	}

});
