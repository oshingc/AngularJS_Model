'use strict';

define(['app'], function (app) {

    var profileService = function ($http,$sessionStorage,$rootScope, $q,$window,$timeout,$location,CookieRestManager, ObjectRestManager ) {
    	var profileFactory = {};
	
	   	var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = $sessionStorage['user']

        profileFactory.accessLevels = accessLevels;
        profileFactory.userRoles = userRoles;
        profileFactory.user = currentUser;

        var standardSuccessFunction = function (result){
		    if(result.status==200)
		        return result.data; 
		};
		
    	profileFactory.showProfile = function($scope,$sessionStorage){

    		var cad = "";

	        cad = $sessionStorage['JSESSION'];

	        console.log($scope);           
	        console.log($sessionStorage);

	        $http({
	            method  : 'GET',
	            url     : '/api/docente/profile',
	            headers : { 'Cookie-REST': cad }  
	        })
	        .success(function(data, status) {
	            if(status==200){
	                console.log('llegue');
	                console.log(data);
	                $scope.datos = data;
	                $scope.fullname = $scope.datos.nombre+" "+$scope.datos.apellidoPaterno+" "+$scope.datos.apellidoMaterno;           	               
	                if($scope.datos.sexo == 'F'){
	                	$scope.sexo = 'Femenino';
	                }else if($scope.datos.sexo == 'M'){
	                	$scope.sexo = 'Masculino';
	                }

	            }
	        }).
            error(function(data, status, headers, config) {
                $scope.alert.content = data.message;
                $scope.alert.type = "danger";
                $scope.showAlert();
            });
    	};

    	profileFactory.updateProfile =function (datos,$scope){
    		
    		var cad = "";
	        cad = $sessionStorage['JSESSION'];             

	        $http({
	            method  : 'POST',
	            url     : '/api/docente/update',	            
	            data    : datos,
	            headers : { 'Cookie-REST': cad }  
	        })
	        .success(function(data, status) {
	            if(status==200){
	                console.log('update....');
	                $scope.alert.content = "cambios guardados correctamente";
	                $scope.alert.type = "success";
	                $scope.showAlert();
	            }                                
	        }).
            error(function(data, status, headers, config) {
                $scope.alert.content = data.message;
                $scope.alert.type = "danger";
                $scope.showAlert();
            });

	    };
	    profileFactory.validacionClave =function (validarEntrada){
		 	var cookie = CookieRestManager.cookieRest();     
			return $http({
				method  : 'GET',
				url     : '/api/docente/seguridad/'+validarEntrada,	            
				headers : { 'Cookie-REST': cookie }  
			})
			.then(standardSuccessFunction);
		};
		profileFactory.updateClave =function (validarString){
		 	var cookie = CookieRestManager.cookieRest();  
		 	var data={};
			data.String = validarString;
			var request = ObjectRestManager.createDataRequest(data); 
		 	console.log('1111111111111111111');     
			return $http({
				method  : 'POST',
				url     : '/api/docente/seguridad/cambioClave'	, 
				data: request ,          
				headers : { 'Cookie-REST': cookie }  
			})
			.then(standardSuccessFunction);
		};
	    return profileFactory;

    };  	
    
    app.factory('profileService', ['$http','$sessionStorage','$rootScope','$q','$window','$timeout','$location','CookieRestManager','ObjectRestManager',profileService]);

});