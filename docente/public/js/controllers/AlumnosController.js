'use strict';

define(['app'], function (app) {

    var alumnosController = function ($scope,$location,$compile,$modal,$alert,$sessionStorage,alumnosService, HorarioService) {

        var appTitle = 'Alumnos';
        //$(window).off("scroll");

        $scope.hourFormat = function(hora){
            
            var horas= hora/100;            
            var minutos= hora%100;
            if(horas < 10) { horas = '0' + horas; }
            if(minutos < 10) { minutos = '0' + minutos; }
            return horas+':'+minutos;

        }

        $scope.formatoHoraDeHorarioBox = function(hour, minutes){
            
            if(minutes==0){
                minutes = '00';
            }
            return hour+minutes;            
            
        }

        $scope.loadAlumnos = function(){
        	 $scope.alumnos = $sessionStorage['alumnos'];
        	 $scope.clase = $sessionStorage['clase'];
        	 //$scope.selectedClass = $sessionStorage['']
        	 console.log('show clase');
        	 console.log($scope.clase);

        	 console.log('show alumnos');
        	 console.log($scope.alumnos);
        }

        $scope.loadAlumnos();
        /*$scope.loadAlumnos = function(horaInicio, horaFin, dia, idCurso){
            console.log('load Alumnos');

            //se pasan horaInicio, horaFin, dia, idCurso, //$scope
            //por la cajita
            HorarioService.obtenerAlumnosHorario(dia, horaInicio, horaFin, idCurso,$scope);

        }*/
        //$scope.loadAlumnos();
};

app.register.controller('AlumnosController', ['$scope', '$location','$compile','$modal','$alert','$sessionStorage','alumnosService','HorarioService',alumnosController]);

});


