'use strict';

define(['app'], function (app) {

    var avisoService = function ($http,$sessionStorage,$rootScope, $q,$window,$timeout,$location,ObjectRestManager,CookieRestManager) {
    	var avisoFactory = {};
	
	   	var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = $sessionStorage['user']

        avisoFactory.accessLevels = accessLevels;
        avisoFactory.userRoles = userRoles;
        avisoFactory.user = currentUser;

        var standardSuccessFunction = function (result){
		    if(result.status==200)
		        return result.data; 
		};

    	avisoFactory.showAvisos = function($scope,$sessionStorage){

    		var cad = "";

	        cad = $sessionStorage['JSESSION'];           

	        $http({
	            method  : 'GET',
	            url     : '/api/docente/avisos',
	            headers : { 'Cookie-REST': cad }  
	        })
	        .success(function(data, status) {
	            if(status == 200) {
	                $scope.avisos = data;
	                $scope.totalAvisos = Object.keys($scope.avisos).length;
	            }
	        });
    	}

    	avisoFactory.enviarMensajeDeTexto = function(message){
    		var cookie = CookieRestManager.cookieRest();   
    		var request;
    		var data={};

    		data.String = message;
    		request = ObjectRestManager.createDataRequest(data);

            return $http({
                method  : 'POST',
                url     : '/api/docente/envioMensaje',
                data 	: request,
                headers : { 'Cookie-REST': cookie } 
            }).then(standardSuccessFunction);
    	}

	    return avisoFactory;
    };  	
    
    app.factory('avisoService', ['$http','$sessionStorage','$rootScope','$q','$window','$timeout','$location','ObjectRestManager','CookieRestManager', avisoService]);
});