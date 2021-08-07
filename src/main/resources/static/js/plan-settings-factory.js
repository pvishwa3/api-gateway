app.factory('planFactory', [
	'$http',
	function($http) {
		var baseUrl = "/user/plan";

		return {
			getPlanDetails : function(data) {
				return $http.get(baseUrl + "/get-plan-details");
			},
			upgradeAccount : function(planId){
				return $http.post(baseUrl + "/change-current-plan?planId="+planId);
			}
		}
	} ]);