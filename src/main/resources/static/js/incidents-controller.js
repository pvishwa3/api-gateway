app.controller("incidentsController", ['$scope', 'conditionFactory','$rootScope','$timeout','$uibModal','corrleationFactory', function ($scope, conditionFactory,$rootScope, $timeout,$uibModal,corrleationFactory) {

	var self = this;
	
	$rootScope.$broadcast('changeThemeToNormal');
	$scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value},
                showValues: true,
                duration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
            }
        };

        
	
	self.drillDownToRulesDetails = function(data){
		console.log(data)
	}
	
	
	corrleationFactory.getRecentIncidents().then(function (response){
		self.recentIncidents = response.data.data;
		var tempvalues= [];
		for(var i=0;i<response.data.data.length;i++){
			var tempObj = {"label":response.data.data[i].ruleName,"value":response.data.data[i].count}
			tempvalues.push(tempObj);
		}
		
		$scope.data = [
            {
                key: "Cumulative Return",
                values: tempvalues
            }
        ]
		
	},function(error){

	});

}]);
