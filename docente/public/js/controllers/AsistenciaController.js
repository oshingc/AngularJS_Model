'use strict';

define(['app'], function (app) {

    var asistenciaController = function ($scope, $alert,$location,$sessionStorage,$rootScope,$filter,asistenciaService,$http) {
        var appTitle = 'Intro';
        $scope.claseActual = {};
        $scope.defaultValue = false;
        $scope.appTitle = appTitle;
        $scope.btnMessage = 'Registrar Asistencia';
        $scope.tableEmpty = 'No hay clase cronogramada';
        $scope.noClasesMessage = 'No se dictan clases en este momento';
        $scope.claseSinAlumnos="La clase actual no tiene alumnos matriculados.";

        $scope.getCurrentTime = function() {
            return $rootScope.currentTime;
        };

        $scope.changeCurrentTime = function() {
            $rootScope.currentTime = new Date();
        };

        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        }

        $scope.millisToHourFormat = function(millis){
            var date = new Date(millis);
            var hour = date.getHours();
            var minutes = date.getMinutes();
            if(minutes==0){
                minutes = '00';
            }else{
                if(minutes<10){
                    minutes = '0'+minutes;
                }
            }
            if(hour<10){
                hour = '0'+hour;
            }
            return hour+':'+minutes;
        }



        /**
          * @Autor: oshingc (Alejandra Gómez)
          * Método para obtener lista de alumnos (clase seleccionada)
         **/

        $scope.obtenerClaseActual = function(idAsistencia,fecha,idCurso,horaDate, idPeriodo){
            $scope.idAsistencia = idAsistencia;
            $scope.fecha = fecha;
            asistenciaService.obtenerClaseActual(idAsistencia,fecha,idCurso,horaDate,$scope,$sessionStorage).then(function(data){
                $scope.showAlert = false;//revisar
                $rootScope.showAlert = false;
                //console.log('llegue claseActual');
                $scope.claseActual = data;
                //console.log(data);
                
                if($scope.claseActual.length>0){
                    //console.log($scope.claseActual.length);     

                    //testing
                    /*console.log('set 1');
                     if($scope.asistencias!=undefined){
                        for(var i=0; i<$scope.asistencias.length; i++){
                          if($scope.asistencias[i].asistioAnterior == null && $scope.asistencias[i].aiAlumnoAsistencia.asistio == false){
                            $scope.asistencias[i].clasesAsistidas =1;
                          }
                        }
                    }*/
                   
                    $scope.showAlert = true;  //revisar
                    $rootScope.showAlert = true;
                    $scope.showRegistrarAsistencia = true;
                }else{
                    $scope.showAlert = false;//revisar
                    $rootScope.showAlert = false;
                    $scope.showRegistrarAsistencia = false;                                             
                }     

            });    
        }


        $scope.elegirClaseActual = function(a){            
            if(a!=undefined){                

                /*console.log('id asistencia: ');
                console.log(a);
                console.log(a.idAsistencia);
                console.log(a.aiCurso.idCurso);*/
                $scope.claseActualSelected = a;


                //console.log('ingreso a registrarAsistenciaDocente');
                //testear
                if($scope.clasesActuales.length>0){
                    //$scope.registrarAsistenciaDocente(a.idAsistencia);
                }

                //a.fecha o a.horaInicio
                $scope.obtenerClaseActual(a.idAsistencia,new Date(a.horaInicio),a.aiCurso.idCurso,new Date(a.horaInicio),a.aiPeriodo.idPeriodo);
                
            }
        };   

       
        /**
         * @Autor: oshingc (Alejandra Gómez)
         * Método que obtiene la lista de clases del día de hoy dictadas en este momento según la hora del sistema.
        **/
        $scope.obtenerClasesActuales = function(){
            //console.log($rootScope.currentTime);
            //console.log('obtenerClasesActuales');
            asistenciaService.obtenerClasesActuales($rootScope.currentTime,$scope,$sessionStorage).then(function(data){
                //console.log(data);
                //console.log('data');
                $scope.clasesActuales = {};
                $scope.clasesActuales = data;

                if($scope.clasesActuales.length>0){
                    $rootScope.claseActualScope = "block !important;";
                }else{
                    $rootScope.claseActualScope = "none;";
                }

                 $rootScope.mensajeDeClasesActuales="";

                for(var i=0; i<$scope.clasesActuales.length; i++){

                    var horai = new Date($scope.clasesActuales[i].horaInicio);                    
                    var horaii = horai.getHours()*100+horai.getMinutes();

                    var horaa = new Date($rootScope.currentTime);
                    var horaaa = horaa.getHours()*100+horaa.getMinutes();

                    var horaf = new Date($scope.clasesActuales[i].horaFin);
                    var horaff = horaf.getHours()*100+horaf.getMinutes();

                    if(horaii<=horaaa&&horaff>horaaa){    
                        $rootScope.mensajeDeClasesActuales += $scope.clasesActuales[i].aiCurso.nombre;   
                        $rootScope.mensajeDeClasesActuales +="\n";                                                                 
                    }else{
                        $scope.clasesActuales.splice(i,1);
                        i--;
                    }
                }
               
                if($scope.clasesActuales.length>0){

                    //console.log('clases actuales'); 
                    //console.log($scope.clasesActuales);    
                    $scope.c = $scope.clasesActuales[0];
                    $scope.elegirClaseActual($scope.c);  
                    //console.log($scope.claseActual);
                    $scope.showRegistrarAsistencia = true;            
                }else{
                    $scope.showRegistrarAsistencia = false;
                }
                
            });

        }

         $scope.habilitarRegistroDeAsistencia = function(){
            return ($scope.claseActual.length>0)?true:false;          
        }  

        $scope.registrarAsistenciaDocente = function(idAsistencia){

            //console.log(idAsistencia);
            asistenciaService.registrarAsistenciaDocente(idAsistencia,$scope,$sessionStorage).then(function(){
                //console.log('asistencia docente registrada');
            });
        }

        /**
         * @Autor: oshingc (Alejandra Gómez)
         * Método que llama al servicio de registro de asistencia para una fecha seleccionada
        **/
        $scope.edit = function(){
            //console.log('save asistencia');     


            //testing
            console.log("set 1");
            if($scope.asistencias!=undefined){
                    for(var i=0; i<$scope.asistencias.length; i++){
                        if($scope.asistencias[i].asistioAnterior == null && $scope.asistencias[i].aiAlumnoAsistencia.asistio == false){
                         $scope.asistencias[i].clasesAsistidas =1;
                    }
                }
            }

            //testing fin



             if($scope.asistencias!=undefined){
                for(var i=0; i<$scope.asistencias.length; i++){
                  if($scope.asistencias[i].asistioAnterior == null && $scope.asistencias[i].aiAlumnoAsistencia.asistio == false){
                    $scope.asistencias[i].clasesAsistidas +=1;
                  }
                }
            }

            asistenciaService.registrarAsistencia($scope.idAsistencia,$rootScope.currentTime,$scope.claseActualSelected.aiCurso.idCurso,false,$scope).then(function(data){

                //console.log(data);

                if(data.result){
                    $scope.claseActual = data.data.asistencias;

                    $scope.alert = {};
                    $scope.alert.content = data.message;
                    $scope.alert.type='alert alert-color-verde';                      
                    $scope.alert.placement='green-alert final-state';
                    $scope.alert.duration = 6;
                    $alert($scope.alert);

                }else{

                    $scope.alert={};
                    $scope.alert.content = data.message;
                    $scope.alert.type = 'alert alert-color-red ';
                    $scope.alert.placement='green-alert final-state';
                    $scope.alert.duration = 6;
                    $alert($scope.alert);

                }
                
            });

        }

        /** Método para validar un formato correcto de los campos de nombre del alumno
         *  @author oshingc (Alejandra Gómez)
        **/
        $scope.nombreCompleto = function(apellido1, apellido2,nombre){


            if(apellido1===undefined){
                apellido1='';
            }
            if(apellido2===undefined){
                apellido2 = '';
            }
            if(nombre===undefined){
                nombre = '';
            }

            if(apellido1==undefined){
                apellido1='';
            }
            if(apellido2==undefined){
                apellido2 = '';
            }
            if(nombre==undefined){
                nombre = '';
            }
        if(apellido2=='.' || apellido2=='*'){
          apellido2="";
        }
        return apellido1+' '+apellido2+', '+nombre;
       }


        /**Método para que cambia el estado del check de asistencia a true si el de tardanza es marcado como true
         * @author oshingc (Alejandra Gómez)
        **/
        $scope.changeCheckTardanza = function(a){ 
        

           if(a.aiAlumnoAsistencia.tardanza == true){

            if(a.asistioAnterior!=null){

                  if(a.clasesAsistidas>0){   
                    if(a.aiAlumnoAsistencia.asistio == false){ 
                      a.clasesAsistidas -= 1;                                        
                    }
                  }
                }  

                a.aiAlumnoAsistencia.asistio = true;                    
            }         
        }

        /**Método para que cambia el estado del check de tardanza a false
         * @author oshingc (Alejandra Gómez)
        **/
        $scope.changeCheckAsistencia = function(a){
            a.aiAlumnoAsistencia.tardanza = false;
        }

         /**Método para que cambia el estado de todos los check de asistencia a un estado, true o false
          * y desmarca los de tardanza si asistencia es false
         * @author oshingc (Alejandra Gómez)
        **/
        $scope.triggerAll = function(elements){
            angular.forEach(elements, function(value){
                if(!$scope.isPorcentajeInasistenciaMaximo(value)){


                  
                    if($scope.defaultValue==true){

                        //incrementa

                         if(value.aiAlumnoAsistencia.asistio == $scope.defaultValue){
                            if(value.asistioAnterior!=null){
                                value.clasesAsistidas +=1;
                            }
                        }

                        value.aiAlumnoAsistencia.tardanza = !$scope.defaultValue;
                    }
                    else{

                          if(value.aiAlumnoAsistencia.asistio == $scope.defaultValue){
                            
                            //decrementa
                            if(value.asistioAnterior!=null){
                              if(value.clasesAsistidas>0){
                                value.clasesAsistidas -= 1;
                              }else{
                              }
                            }
                          }

                    }


                    value.aiAlumnoAsistencia.asistio = !$scope.defaultValue;
                }
            });

            $scope.defaultValue = !$scope.defaultValue;
            
        }

        $scope.updateSelectedTardanza = function(a) {
            //console.log(a);
            if(a.aiAlumnoAsistencia.asistio==null){
                a.aiAlumnoAsistencia.asistio =false;
            }else{
                if(a.aiAlumnoAsistencia.tardanza==null){
                    a.aiAlumnoAsistencia.tardanza =false;
                }else{
                }
            }
            $scope.changeCheckTardanza(a);
          
        }

        $scope.updateSelectedAsistencia = function(a){
            if(a.aiAlumnoAsistencia.asistio == false){

                if(a.asistioAnterior != null){
                    a.clasesAsistidas +=1;
                }

                $scope.changeCheckAsistencia(a);
            }
            else{
              if(a.aiAlumnoAsistencia.asistio == true){
                              
               if(a.asistioAnterior != null){

                  if(a.clasesAsistidas>0){
                    a.clasesAsistidas -=1;
                  }
                }
              
              }

            }
        }

        /**Método que verifica el estado crítico o aceptable de porcentaje de inasistencia
         * @author czegarram (César Zegarra)
        **/
        $scope.isPorcentajeInasistenciaMaximo = function(value){
            return (value.aiAlumnoMatriculaCurso.porcentajeInasistencia>=30)?true:false;          
        }
       

        $scope.asignarClaseActualPorHoraDelSistema = function(){
            //console.log('asignar clasesactuales');
            //console.log($scope.clasesActuales);

            $rootScope.claseActualPorHoraDelSistema = 'haha';
        }

        $scope.getTimeMillis = function(){
            $scope.asignarClaseActualPorHoraDelSistema();
            return $rootScope.getTimeMillis();
        }

        $scope.obtenerClasesActuales();
    };

    app.register.controller('AsistenciaController', ['$scope', '$alert','$location','$sessionStorage','$rootScope','$filter','asistenciaService','$http',asistenciaController]);
    
});

