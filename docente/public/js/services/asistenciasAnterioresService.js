'use strict';

define(['app'], function (app) {

    var asistenciasAnterioresService = function ($http,$alert,$sessionStorage,$q,$window,$timeout,$location ) {
    	var asistenciasAnterioresFactory = {};
    	var datos;

        var standardSuccessFunction = function (result){
            if(result.status==200)
                return result.data; 
        };

		/**
		Método para obtener la lista de clases actuales según selección de fecha,
		la selección de fecha puede ser elegida por la vista de horario (cajita de horario)
		o por la fecha del filtro de la vista de asistencia anteriores
		**/
    	asistenciasAnterioresFactory.obtenerClases = function(date){

    		var cad = "";
    		var actualDate = new Date(date);
    		//console.log(actualDate);
	        cad = $sessionStorage['JSESSION'];    

	        return $http({
	        	method  : 'GET',
	            url     : '/api/docente/asistencia/clases/'+actualDate,
	            headers : { 'Cookie-REST': cad }  
	        }).then(standardSuccessFunction);
    	}


	
	    asistenciasAnterioresFactory.obtenerAsistencias = function(idAsistencia,date,idCurso,horaDate){
	    	var cad = "";

	        cad = $sessionStorage['JSESSION'];   


	        return $http({
	            method  : 'GET',
	            url     : '/api/docente/asistencia/asistencias/'+idAsistencia+'/'+date+'/'+idCurso+'/'+horaDate,
	            headers : { 'Cookie-REST': cad }  
	        })
	        .then(standardSuccessFunction);         
	       
	    }

	    return asistenciasAnterioresFactory;

    };  	
    
    app.factory('asistenciasAnterioresService', ['$http','$alert','$sessionStorage','$q','$window','$timeout','$location',asistenciasAnterioresService]);

});