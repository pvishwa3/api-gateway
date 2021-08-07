app.factory("networkZonesFactory",['$http',function($http){
	var baseUrl = "siem-core/asset/"
	return {
		saveNetworkZone : function(data){
			return $http.post(baseUrl+"networkzones/saveNetworkZones",data)
		},
		getSavedNetworkDetails :function(name){
			return $http.get(baseUrl+"networkzones/getSavedNetworkZones/"+name)
		},
		deleteNetworkZones : function(id){
			return $http.delete(baseUrl+"networkzones/delete/"+id);
		}
	}
}]);