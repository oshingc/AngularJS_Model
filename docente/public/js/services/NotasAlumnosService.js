'use strict';

define(['app'], function (app) {
	 var notasAlumnosService = function ($http,$alert,$sessionStorage,$rootScope, $q,$window,$timeout,$location ) {
	 	var notasAlumnosFactory = {};

		//Obtiene las notas de promedio de un grupo de alumnos específico

		notasAlumnosFactory.obtenerAlumnos = function($scope, $idCurso,alumnos){
			var cad = "", i = 0, listaIdAlumnos = [];

			cad = $sessionStorage['JSESSION'];

			for(i=0;i<alumnos.length;i++){
				listaIdAlumnos.push(alumnos[i].aiAlumnoCarrera.aiAlumno.idAlumno);
			}
			console.log(listaIdAlumnos);

			return $http({
				method : 'POST',
				data: listaIdAlumnos,
				url : '/api/docente/notas'+'/'+$idCurso,
				headers : { 'Cookie-REST': cad }
			})
			.then (function(result) {
				return result.data;
			});
		};

		//Edita las notas del promedio a u grupo de alumnos específico

		notasAlumnosFactory.updateNotas =function (datos){
    		var cad = "";
	        cad = $sessionStorage['JSESSION'];
	        $http({
	            method  : 'POST',
	            url     : '/api/docente/notas/update',
	            data    : datos,
	            headers : { 'Cookie-REST': cad }
	        })
	        .success(function(status) {
	            if(status==200){
	                //$scope.name = user.nombre;
	            }                                
	        });

	    };

	    //Obtiene las notas de prácitcas de un grupo de alumnos específico

	    notasAlumnosFactory.getNotasDetalles =function (datos){
	    	$("body").css("cursor", "wait");
    		var cad = "";
	        cad = $sessionStorage['JSESSION'];
	        return $http({
	            method  : 'POST',
	            url     : '/api/docente/notas/getDetallesNotas',
	            data    : datos,
	            headers : { 'Cookie-REST': cad }
	        })
	        .then(function(result) {
	            return result.data;
	        });

	    };

	    //Inserta en la BD las notas de practicas de un grupo de alumnos específico

	    notasAlumnosFactory.insertNotasDetalles =function (datos,$scope){
    		var cad = "";
	        cad = $sessionStorage['JSESSION'];
	        $http({
	            method  : 'POST',
	            url     : '/api/docente/notas/insertDetallesNotas',
	            data    : datos,
	            headers : { 'Cookie-REST': cad }
	        })
	        .success(function(status) {
	        	console.log($scope);
            	var alert = $scope.alert;
				alert.title = "Registro Notas";
				alert.content = "<br/>Las notas han sido registradas satisfactoriamente.";
				alert.duration = 2;
         		$scope.showAlert(alert);
	            if(status==200){
	                //$scope.name = user.nombre;
	                /*var alert = $scope.alert;
					alert.title = "Guardar Cambios";
					alert.content = "<br/>Los cambios has sido guardados satisfactoriamente.";
					console.log("alerta:"+alert);
             		$scope.showAlert(alert);*/
             		//$('.alert.alert-dismissable.ng-scope.top-right.am-fade.alert-success').css('background-color','#212222');
	                //console.log(data);
	            }                                
	        });

	    };


		return notasAlumnosFactory;
	};

	app.factory('NotasAlumnosService', ['$http','$alert','$sessionStorage','$rootScope','$q','$window','$timeout','$location',notasAlumnosService]);

});