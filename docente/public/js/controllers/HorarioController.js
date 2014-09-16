'use strict';

define(['app'], function (app) {

    var horarioController = function ($scope,$state,$location,$compile,$modal,$alert,$rootScope,HorarioService) {

        var appTitle = 'Horario';


        $rootScope.vista = 1;
        $scope.appTitle = appTitle;
        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        }
        $scope.horario = [];
        $scope.alumno=[];
        var modal = $modal({
            template : '/views/template/HorarioDetalle.html',
            persist : false,
            show : false,
            backdrop : 'static',
            scope : $scope
        });

        $scope.enviarHaciaAsistencias = function(){
            var width = screen.width;
            var params ={
                    reload: true,
                    inherit: false,
                    notify: true
                }; 

            if(width<=767){
                $state.transitionTo("user.asistencias-anteriores", {}, params);              
            }else{
                $state.transitionTo("user.asistenciaMultiple", {}, params);        
            }
        }

        $scope.dropdown = [
          {
            "text": "<i class=\"glyphicon glyphicon-ok\"></i>&nbsp;Registro de Asistencias",
            "click":$scope.enviarHaciaAsistencias
           } 
        ];

        

        $scope.formatoHoraDeHorarioBox = function(hour, minutes){
            
            if(minutes==0){
                minutes = '00';
            }
            return hour+minutes;            
            
        }

        $scope.getModal = function (){
            return modal;
        }

        modal.showDetails = function(evento) {
            $scope.selectedHorario = evento;                 
            var startTime = $scope.formatoHoraDeHorarioBox(evento.start.getHours(), evento.start.getMinutes());
            var endTime = $scope.formatoHoraDeHorarioBox(evento.end.getHours(),evento.end.getMinutes());
            HorarioService.obtenerAlumnosHorario(evento.start.getDay(),startTime,endTime,evento.idCurso,$scope);
        }
        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        }

        $scope.loadSchedule = function() {
            console.log('loadSchedule');
            HorarioService.obtenerHorariosDocente($scope,$compile);
        };

        $scope.showAlert = function(alert){
            $alert(alert);
        }

        $scope.hourFormat = function(hora){
            
            var horas= hora/100;            
            var minutos= hora%100;
            if(horas < 10) { horas = '0' + horas; }
            if(minutos < 10) { minutos = '0' + minutos; }
            return horas+':'+minutos;

        }

        $scope.capitalize = function(a){
            var cadena = a.aiAlumnoCarrera.aiCarrera.nombre;            
            if(cadena.length>0){
                return angular.uppercase(cadena.charAt(0))+angular.lowercase(cadena.slice(1));
            }else{
                return '';
            }
        }

        $scope.obtenerAlumnosHorario = function(dia,horaInicio, horaFin, idCurso){
            HorarioService.obtenerAlumnosHorario(dia,horaInicio, horaFin, idCurso, $scope);
        }

        $scope.loadSchedule();
        $rootScope.recuperarClasesActuales();


};

app.register.controller('HorarioController', ['$scope', '$state','$location','$compile','$modal','$alert','$rootScope','HorarioService',horarioController]);

});


