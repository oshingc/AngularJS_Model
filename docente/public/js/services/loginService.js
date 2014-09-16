'use strict';

define(['app'], function (app) {

    var loginService = function ($http,$sessionStorage,$rootScope, $q,$window,$timeout,$location ) {
        var loginFactory = {};

        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = $sessionStorage['user'] || { username: 'Invitado', role: userRoles.public };
        
        function changeUser(user) {
            $sessionStorage['user']= user;
            angular.copy(user,currentUser);
        };

        function cleanStorage(){
            delete $sessionStorage['JSESSION'] ;
            delete $sessionStorage['user'];
        };

        loginFactory.accessLevels = accessLevels;
        loginFactory.userRoles= userRoles;
        loginFactory.user = currentUser;


        loginFactory.authorize= function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;
            return accessLevel.bitMask & role.bitMask;
        };

        loginFactory.isLoggedIn= function(user) {
            if(user === undefined)
                user = currentUser;
            console.info(user);
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        };

        loginFactory.callLogin = function (data,$scope) {
            
            var user = data.user;
            data.idioma="es";
            $http({
                method  : 'POST',
                url     : '/api/login-rest',
                data    : data,  // pass in data as stlterrings
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data, status, headers, config) {
                if(status==200){
                    $sessionStorage['clase'] = null;
                    var response=data;
                    $rootScope.currentTime = new Date(response.data.fechaActual);
                    $rootScope.showClassAlert="block"; 
                    $sessionStorage['JSESSION'] = headers('set-cookie-rest');                    
                    var loginUser ={ username: user, role: userRoles.user, codigo:response.data.codigo,nombre:response.data.nombre,apellidoPaterno:response.data.apellidoPaterno };               
                    changeUser(loginUser);           
                    $location.path("/horario");
                }                               
            }).
            error(function(data, status, headers, config) {
                $scope.alert.content = headers('errorMessage');
                $scope.showAlert();
                $scope.processing=false;
                $location.path("/");
            });
        };

        loginFactory.callLogout = function(success){
            var cad = $sessionStorage['JSESSION'];           
            var user= $sessionStorage['user'];
            
            $http({
                method  : 'GET',
                url     : '/api/logout',
                headers : { 'Cookie-REST': cad ,'User':user.username}  
            })
            .success(function(data, status) {
                if(status==200){
                    $sessionStorage.$reset();
                    changeUser({ username: '', role: userRoles.public });
                    $rootScope.hayClasesEnEsteMomento = false;
                }   
                success(data, status);                             
            });
        };

        loginFactory.deleteLocalCredentials = function(){
            cleanStorage();
        };

        return loginFactory;

    };

    app.factory('Auth', ['$http','$sessionStorage','$rootScope','$q','$window','$timeout','$location',loginService]);

});