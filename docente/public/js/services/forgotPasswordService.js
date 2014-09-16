'use strict';

define(['app'], function (app) {

	var forgotPasswordService = function ($http,$sessionStorage,$rootScope, $q,$window,$timeout,$location, ObjectRestManager ) {
		var forgotPasswordFactory = {};

		var standardSuccessFunction = function (result){
		    if(result.status==200)
		        return result.data; 
		};

		forgotPasswordFactory.recuperaPassword=function(emailValidado){  
			console.log(emailValidado);
			var data={};
			data.String = emailValidado;
			console.log(data);
			var request = ObjectRestManager.createDataRequest(data); 
			console.log(request);
		 	return $http({
				method  : 'POST',
				url     : '/api/public/docenteRecuperacionPassword',
				data: request   
			})
			.then(standardSuccessFunction);
		};

		forgotPasswordFactory.verificarURL=function(concatenado){  
			console.log(concatenado);
			var data={};
			data.String = concatenado;
			console.log(data);
			var request = ObjectRestManager.createDataRequest(data); 
			console.log(request);
		 	return $http({
				method  : 'POST',
				url     : '/api/public/docenteValidarURL',
				data: request   
			})
			.then(standardSuccessFunction);
		};

		forgotPasswordFactory.updatePassword=function(idKey,docente){  
			console.log(idKey+'-----'+docente);
			var data={};
			data.String = idKey;
			data.AiDocenteSeguridad= docente;
			console.log(data);
			var request = ObjectRestManager.createDataRequest(data); 
			console.log(request);
		 	return $http({
				method  : 'POST',
				url     : '/api/public/docenteNewPassword',
				data: request   
			})
			.then(standardSuccessFunction);
		};
		return forgotPasswordFactory;
	};  	
	
	app.factory('forgotPasswordService', ['$http','$sessionStorage','$rootScope','$q','$window','$timeout','$location','ObjectRestManager',forgotPasswordService]);

});