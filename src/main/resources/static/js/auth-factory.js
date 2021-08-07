app.factory('Auth', function($resource, $rootScope, $sessionStorage, $q){
     
    /**
     *  User profile resource
     */
    var Profile = $resource('/siem-core/user/get-logined-user-details', {}, {
        login: {
            method: "GET",
            isArray : false
        }
    });
     
    var auth = {};
     
    /**
     *  Saves the current user in the root scope
     *  Call this in the app run() method
     */
    auth.init = function(){
        if (auth.isLoggedIn()){
            $rootScope.user = auth.currentUser();
        }
    };
         
    auth.login = function(username, password){
        return $q(function(resolve, reject){
            Profile.login().$promise
            .then(function(data) {    
            	delete data.shared;
            	delete data.dashboarDetails
            	delete data.defaultCompany
            	delete data['public']
            	delete data.permissions
                $sessionStorage.user = data;    
                $rootScope.user = $sessionStorage.user;
                resolve();
            }, function() {
                reject();
            });
        });
    };
     
 
    auth.logout = function() {
        delete $sessionStorage.user;
        delete $rootScope.user;
        delete $window.localStorage;
    };
     
     
    auth.checkPermissionForView = function(view) {
        if (!view.requiresAuthentication) {
            return true;
        }
         
        return userHasPermissionForView(view);
    };
     
     
    var userHasPermissionForView = function(view){
        if(!auth.isLoggedIn()){
            return false;
        }
         
        if(!view.permissions || !view.permissions.length){
            return true;
        }
         
        return auth.userHasPermission(view.permissions);
    };
     
     
    auth.userHasPermission = function(permissions){
        if(!auth.isLoggedIn()){
            return false;
        }
         
        var found = false;
        angular.forEach(permissions, function(permission, index){
            if ($sessionStorage.user.user_permissions.indexOf(permission) >= 0){
                found = true;
                return;
            }                        
        });
         
        return found;
    };
     
     
    
    auth.currentUser = function(){
        return $sessionStorage.user;
    };
     
     
    auth.isLoggedIn = function(){
        return $sessionStorage.user != null;
    };
     
 
    return auth;
});