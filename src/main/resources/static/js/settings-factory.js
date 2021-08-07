app.factory('settingsFactory', [
		'$http',
		function($http) {
			var baseUrl = "/siem-core/user";

			return {
				changePassword : function(data) {
					return $http.post(baseUrl + "/change-password", data);
				},
				getUserInformation : function() {
					return $http.get(baseUrl + "/get-logined-user-details")
				},
				getUsersWithInCompany : function(companyName) {
					return $http.get(baseUrl
							+ "/getAllUsersWithinCompany?company="
							+ companyName)
				},
				createUsers : function(data) {
					return $http.post(baseUrl + "/createlocalusrers", data)
				},
				changePasswordAfterLogin : function(data) {
					return $http.post(baseUrl + "/change-password-after-login",
							data)
				},
				refreshFields : function() {
					return $http.get(baseUrl + "/refresh-mappings")
				},
				
				deleteUser : function(userName) {
					return $http.delete(baseUrl + "/deleteUser/"+userName)
				},
				updateUser : function(data) {
					return $http.post(baseUrl + "/update_User", data)
				},
				getUsageDetails : function(){
					return $http.get(baseUrl + "/get-usage-details")
				},
				getGroups : function(companyName){
					return $http.get("/siem-core/secure/user/groups/company/"+companyName)
				},
				saveGroups : function(groupsData){
					return $http.post("/siem-core/secure/user/groups/save-groups", groupsData)
				},
				deleteGroups : function(id){
					return $http.delete("/siem-core/secure/user/groups/delete-groups/"+id )
				},
				getUsersFromGroup : function(groupName){
					return $http.get("/siem-core/secure/user/groups/"+groupName)
				},
				getRoles : function(){
					return $http.get("/siem-core/secure/roles/company")
				},
				saveRoles:function(data){
					return $http.post("/siem-core/secure/roles/create-role", data)
				},
				getRoleMappings: function(roleName,companyName){
					return $http.get("/siem-core/secure/roles/mapping/"+roleName+"?companyName="+companyName)
				},
				updateRoles:function(data){
					return $http.post("/siem-core/secure/roles/update-role", data)
				},
				deleteRoles:function(roleName){
					return $http.delete("/siem-core/secure/roles/delete-role/"+roleName)
				},
				loadPermissions:function(){
					return $http.get("/siem-core/user/loadPermissions")
				},
				getCurrentOrgs : function(){
					return $http.get("/siem-core/secure/organization/")
				},
				createOrganization: function(data){
					return $http.post('/siem-core/secure/organization/save', data, {
						transformRequest: angular.identity,
						
						headers: {'Content-Type': undefined}
					});
					
					
				},
				getUsersInOrganisation : function(companyName){
					return $http.get("/siem-core/secure/organization/"+companyName)
				},
				getOrgsForCurrentLoginedUser: function(){
					return $http.get("/siem-core/secure/organization/get-company-details")
				},
				switchToDifferentCompany : function(companyName){
					return $http.post("/siem-core/secure/organization/switch-to-different-company/"+companyName)
				},
				getOrgsBasedOnUser : function(userName){
					return $http.get("/siem-core/secure/organization/get-company-details-users?userName="+userName)
				},
				getIndicies : function(){
					return $http.get("/siem-core/user/elasticsearch/getallindices")
				},
				generateToken:function(id){
					return $http.post("/siem-core/secure/organization/generate-token/"+id)
				},
				generateLicence:function(data){
					return $http.post("/siem-core/secure/organization/generate-license",data)
				},
				loadEmailConfig:function(){
					return $http.get("/siem-core/user/stmp/config")
				},
				testEmailConfig:function(data){
					return $http.post("/siem-core/user/stmp/config/test-email",data)
				},
				saveConfig:function(data){
					return $http.post("/siem-core/user/stmp/config/save-email",data)
				},
				enableOrDisable:function(){
					return $http.post("/siem-core/user/stmp/config/enable-or-disable","")
				},

			}
} ]);