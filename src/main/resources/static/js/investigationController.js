app.controller("investigationController",['$scope','$sessionStorage','$location','investigstionFactory','caseFactory',function($scope,$sessionStorage,$location,investigstionFactory,caseFactory){
	
	var self = this;
	$scope.showDetails = false;
	$scope.jsonEditor = {options: {mode: 'view'}};
	self.deleteJobById = function(id){
		block();
		cortexJobsFactory.deleteJobById(id).then(function(response){
			console.log(response.data);
			unBlock();
		});
	}
	$(document).ready(function(){
		if ($location.absUrl().includes("?")){
			self.selectedCase = $location.absUrl().split('?')[1]; 
			investigstionFactory.getNetworkAnalysisMessages({"userName":$sessionStorage.user.userName,"id":self.selectedCase})
				.then(function(response){
						loadNetworkChart(response.data.result, investigstionFactory, this, $scope);
				},function(error){
					
				});
		}
	});
	
	
	
	self.allCases = [];
	caseFactory.getAllCases().then(function(response){
		if(response.data.status){			
			self.allCases =angular.copy(response.data.resultData);
			
		}
	},function(error){
		
	});
	self.showChart = false;
	self.caseTypeConfig = {
			maxItems: 1,
			optgroupField: 'class',
			labelField: 'title',
			searchField: ['title'],
			valueField: '_id',
			closeAfterSelect:true,
			create:false,
			onChange: function(value){
				investigstionFactory.getNetworkAnalysisMessages({"userName":$sessionStorage.user.userName,"id":value})
				.then(function(response){
						loadNetworkChart(response.data.result, investigstionFactory, this, $scope);
				},function(error){
					
				});	
			}
	};
	
}]);




function loadNetworkChart(newData, investigstionFactory, asdf, scope) {
	
	var config = {
            container_id: "workflow-graph",
            server_url: "bolt://localhost:7687",
            server_user: "neo4j",
            server_password: "admin",
            labels: {
                "IP": {
                    "caption": "name",
                    "size": "pagerank",
                    "community": "community"
                },
                "ip_address": {
                    "caption": "name",
                    "size": "pagerank",
                    "community": "community"
                },
                "user_name": {
                    "caption": "name",
                    "size": "pagerank",
                    "community": "community"
                },
                
            },
            relationships: {
                "has": {
                    "thickness": "weight",
                    "caption": false
                }
            },
            initial_cypher: "MATCH (n)-[r:has]->(m) RETURN *"
        };

        viz = new NeoVis.default(config);
        viz.render();
}