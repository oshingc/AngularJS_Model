'use strict';

define(['app'], function (app) {

    var asistenciaService = function ($http,$alert,$sessionStorage,$rootScope,$q,$window,$timeout,$location,ObjectRestManager,CookieRestManager ) {
    	var asistenciaFactory = {};
    	var datos;
	
	   	var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = $sessionStorage['user']

        asistenciaFactory.accessLevels = accessLevels;
        asistenciaFactory.userRoles = userRoles;
        asistenciaFactory.user = currentUser;

        var standardSuccessFunction = function (result){
            if(result.status==200)
                return result.data; 
        };

         var standardSuccessFunctionPost = function (result){
            if(result.status==200)
            	return result.data;
        };

        asistenciaFactory.obtenerHoraDelSistema = function($scope){
        	//console.log('obtenerHoraDelSistema');

        	 var cad = $sessionStorage['JSESSION'];           

	        $http({
	            method  : 'POST',
	            url     : '/api/docente/asistencia/horaDelSistema',
	            headers : { 'Cookie-REST': cad }  
	        })
	        .success(function(data,status) {
	            if(status==200){
	                //console.log('hora del sistema');
	             	$rootScope.currentTime = data;
	            }
	             	
	        });
        }
    
        
         asistenciaFactory.createJson = function($scope,asistencias){

         	//console.log('asistencias');
         	//console.log(asistencias);




         	if(asistencias==false){


         	//console.log('claseActual');
         	//console.log($scope.claseActual);
         	
	        datos = {
	        	"aiAsistencia": {
	        		"aiCurso"      		  : {"idCurso": $scope.claseActual[0].aiAlumnoAsistencia.aiAsistencia.aiCurso.idCurso},
	        		"aiPeriodo"    		  : {"idPeriodo": $scope.claseActual[0].aiAlumnoAsistencia.aiAsistencia.aiPeriodo.idPeriodo},
	        		"aula"         		  : {"idAula" :  $scope.claseActual[0].aiAlumnoAsistencia.aiAsistencia.aula.idAula},
	        		"horaInicio"   		  : $scope.claseActual[0].aiAlumnoAsistencia.aiAsistencia.horaInicio,
					"horaFin"      		  : $scope.claseActual[0].aiAlumnoAsistencia.aiAsistencia.horaFin
				
	        	},
	        	"alumnosAsistencia" : $scope.claseActual
	        	}    

	        }else{

	        datos = {
	        	"aiAsistencia": {
	        		"aiCurso"      		  : {"idCurso": asistencias[0].aiAlumnoAsistencia.aiAsistencia.aiCurso.idCurso},
	        		"aiPeriodo"    		  : {"idPeriodo": asistencias[0].aiAlumnoAsistencia.aiAsistencia.aiPeriodo.idPeriodo},
	        		"aula"         		  : {"idAula" :  asistencias[0].aiAlumnoAsistencia.aiAsistencia.aula.idAula},
	        		"horaInicio"   		  : asistencias[0].aiAlumnoAsistencia.aiAsistencia.horaInicio,
					"horaFin"      		  : asistencias[0].aiAlumnoAsistencia.aiAsistencia.horaFin				
	        	},
	        	"alumnosAsistencia" : asistencias
	        	}    
	        }
        }

        asistenciaFactory.registrarAsistencia = function(idAsistencia,date,idCurso,asistencias,$scope){
        	
        	asistenciaFactory.createJson($scope,asistencias);
        	datos.aiAsistencia.idAsistencia = idAsistencia;        	

    		var cad = "";    		        	
	        cad = $sessionStorage['JSESSION'];          

			var data = {};

			var AiAsistenciaContainer = new Object();
			AiAsistenciaContainer.aiAsistencia = datos.aiAsistencia;
			AiAsistenciaContainer.alumnosAsistencia = datos.alumnosAsistencia;

        	data.AiAsistenciaContainer = AiAsistenciaContainer;

			var request = ObjectRestManager.createDataRequest(data);
			console.log(request);

			//console.log(idCurso);
			//console.log(date);

	        return $http({
	        	method  : 'POST',
	            url     : '/api/docente/asistencia/saveAsistenciaActual/'+date+'/'+idCurso,
	            data    : request,
	            headers : { 'Cookie-REST': cad }  
	        })
	         .then(standardSuccessFunctionPost); 
    	}

    	asistenciaFactory.obtenerClasesActuales = function(date,$scope,$sessionStorage){

    		var cad = "";

    		//console.log(date);
	        cad = $sessionStorage['JSESSION'];           

	        return $http({
	            method  : 'GET',
	            url     : '/api/docente/asistencia/clases/'+date,
	            headers : { 'Cookie-REST': cad }  
	        })
	        .then(standardSuccessFunction); 

    	}

    	asistenciaFactory.obtenerClases = function(date){

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

        asistenciaFactory.obtenerClaseActual = function(idAsistencia,fecha,idCurso,horaDate,$scope,$sessionStorage){

    		var cad = "";

	        cad = $sessionStorage['JSESSION'];   
	        //console.log(fecha);        
	        //console.log(horaDate);


	        return $http({
	            method  : 'GET',
	            url     : 'api/docente/asistencia/asistencias/'+idAsistencia+'/'+fecha+'/'+idCurso+'/'+horaDate,
	            headers : { 'Cookie-REST': cad }  
	        })
	        .then(standardSuccessFunction); 	      

    	}

    	asistenciaFactory.obtenerAsistenciasPorMes = function(idAsistencia,idCurso,dia,horaInicioInt,horaFinInt,tipoSesion,fecha,secciones,grupos,mesSelecionado){

	        var cookie = CookieRestManager.cookieRest();   

	        var data = {};

	        data.idAsistencia = idAsistencia;
			data.idCurso = idCurso;
			data.dia = dia;
			data.horaInicioInt = horaInicioInt;
			data.horaFinInt = horaFinInt;
			data.tipoSesion = tipoSesion;
			data.fecha = fecha;
			data.secciones = secciones;
			data.grupos = grupos;

			if(mesSelecionado!=null && mesSelecionado!=undefined){
				data.mesSelecionado = mesSelecionado;
			}

			var request = ObjectRestManager.createDataRequest(data,"Request Asistencia Multiple");			

	        return $http({
	            method  : 'POST',
	            url     : 'api/docente/asistencia/multiple',
	            data    : request,
	            headers : { 'Cookie-REST': cookie }  

	        })
	        .then(standardSuccessFunction); 	      

    	}

    	asistenciaFactory.actualizarAsistenciasPorMes = function (asistencias,estadosAsistencias,fechasClase){
    		
    		console.log(asistencias);
    		var cookie = CookieRestManager.cookieRest();   

	        var data = {};

	        data.asistencias = asistencias;
	        data.estadosAsistencias = estadosAsistencias;
	        data.fechasClase = fechasClase;

			var request = ObjectRestManager.createDataRequest(data,"Actualizacion Asistencia Multiple");			

	        return $http({
	        	method  : 'POST',
	            url     : '/api/docente/asistencia/multiple/actualizar',
	            data    : request,
	            headers : { 'Cookie-REST': cookie }  
	        })
	         .then(standardSuccessFunctionPost);

    	}

    	asistenciaFactory.registrarAsistenciaDocente = function(idAsistencia,$scope,$sessionStorage){

    		var cad = "";
	        cad = $sessionStorage['JSESSION'];     
	        //console.log(cad);
	        //console.log('en el servicio');      

	        return $http({
	        	method  : 'POST',
	            url     : '/api/docente/asistencia/registrarAsistenciaDocente/'+idAsistencia+'/'+1,
	            data    : datos,
	            headers : { 'Cookie-REST': cad }  
	        })
	         .then(standardSuccessFunctionPost);
	       
    	}      

	    return asistenciaFactory;

    };  	
    
    app.factory('asistenciaService', ['$http','$alert','$sessionStorage','$rootScope','$q','$window','$timeout','$location','ObjectRestManager','CookieRestManager',asistenciaService]);

});