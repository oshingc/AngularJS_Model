'use strict';

define(['app'], function (app) {

    var asistenciasAnterioresController = function ($scope, $alert,$location,$sessionStorage,$modal,asistenciaService,asistenciasAnterioresService,$http,$rootScope,blockUI) {
       
       $scope.selectedDate=new Date();
       $scope.asistencias = {};
       $scope.defaultValue = false;
       $scope.clickActive = false;
       $scope.tableEmpty='La clase actual no tiene alumnos matriculados.';
       $scope.noHayClases = 'No hay clases en el día';
       $scope.c;
       blockUI.message("Cargando..");
      /**Retorna formato de una hora según sea el caso a partir del número de 
      millisegundos de una hora**/
      $scope.toHourFormat = function(millis){
        var date = new Date(millis);
        var hour = date.getHours();
        var minutes = date.getMinutes();        
        return $scope.formatAMPM(hour,minutes);
      };

      /**Retorna formato de hora AM o PM según sea el caso a partir del número de 
      minutos y horas**/
      $scope.formatAMPM =  function(hour, minutes){
        var hourNumber = hour;
        var minutesNumber = minutes;

        var hourCadena = hour;
        var minutesCadena = minutes;
        if(minutes==0){
          minutesCadena = '00';
        }else{
          if(minutes>0&&minutes<10){
            minutesCadena = '0'+minutesNumber;
          }else{
            minutesCadena = minutesNumber;
          }
        }

        var timeNumber = hourNumber*100+minutesNumber;
        if(timeNumber>=100 && timeNumber<=1159){
          return hourNumber+':'+minutesCadena+' AM';
        }else{
          if(timeNumber>=1200 && timeNumber<2359){
            if(timeNumber>=1300 && timeNumber<2359){
              hourNumber -=12;
            }
            return hourNumber+':'+minutesCadena+' PM';
            
          }else{

            if(timeNumber>=0 && timeNumber<=59){
              return '12:'+minutesCadena+'AM';
            }
          }
        }
      };

      /**Método que retorna una hora en formato de hola militar a partir de millisegundos**/
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
      };

       $scope.obtenerClases = function(){
          //$scope.selectedDate = $sessionStorage['startDate'];
          asistenciasAnterioresService.obtenerClases($scope.selectedDate);
       };

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

       $scope.elegirClase = function(a){
         //console.log('elegirClase');
        //console.log(a);


        if(a!=null){
          blockUI.start();
          $scope.selectedDate = new Date(a.horaInicio);
          //console.log($scope.selectedDate);
          asistenciasAnterioresService.obtenerAsistencias(a.idAsistencia,$scope.selectedDate,a.aiCurso.idCurso,new Date(a.horaInicio)).then(function(data){
            var showAlert = false;
            //console.log('mira');
            //console.log(data);
              $scope.asistencias = data;
              //console.log($scope.asistencias);

              //testing
                    /*console.log('set 1');
                     if($scope.asistencias!=undefined){
                        for(var i=0; i<$scope.asistencias.length; i++){
                          if($scope.asistencias[i].asistioAnterior == null && $scope.asistencias[i].aiAlumnoAsistencia.asistio == false){
                            $scope.asistencias[i].clasesAsistidas =1;
                          }
                        }
                    }*/
                
               if($scope.asistencias.length>0){

                if($scope.asistencias[0].fecha!=null){                    
                  $scope.btnMessage = 'Actualizar Asistencia';
                }else{
                  $scope.btnMessage = 'Registrar Asistencia';
                }
                //console.log($scope.asistencias);
                $scope.showAlert = true;                    
                    
              }else{
                $scope.showAlert = false;                 
                 
              } 

              blockUI.stop();         

          });
          
        }else{
          $scope.asistencias = {};
          $scope.asistencias.length = 0;
        }
       
          

       }

      /*$scope.alumnoNuevo = function(alumno){
        //console.log(alumno.aiAlumnoAsistencia);
        //console.log(alumno.aiAlumnoAsistencia.id);
        if(alumno.aiAlumnoAsistencia.id == undefined){
          return 'Sí'
        }
        else{
          return 'No';
        }
       }*/

      $scope.triggerAll = function(elements){
          //console.log('triggerAll');
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
                  
                }else{

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


      /**
       * @Autor: María Alejandra Gómez Casani (oshingc)
       * Método que llama al servicio de registro de asistencia para una fecha seleccionada
      **/
      $scope.edit = function(){
           

          //testing
            //console.log("set 1");
            if($scope.asistencias!=undefined){
                    for(var i=0; i<$scope.asistencias.length; i++){
                        if($scope.asistencias[i].asistioAnterior == null && $scope.asistencias[i].aiAlumnoAsistencia.asistio == false){
                         $scope.asistencias[i].clasesAsistidas +=1;
                    }
                }
            }


            //se borrará
          /*Se considera como falta a aquellas inasistencias sin check, se realiza un incremento para asistencias que aun no ha sido registrada*/
          /*if($scope.asistencias!=undefined){
            for(var i=0; i<$scope.asistencias.length; i++){
              if($scope.asistencias[i].asistioAnterior == null && $scope.asistencias[i].aiAlumnoAsistencia.asistio == false){
                $scope.asistencias[i].clasesAsistidas +=1;
              }
            }
          }*/

            $scope.idAsistencia = $scope.c.idAsistencia;
            blockUI.start();
            asistenciaService.registrarAsistencia($scope.idAsistencia,$scope.selectedDate,$scope.c.aiCurso.idCurso,$scope.asistencias,$scope).then(function(data){

               if(data.result){

                //console.log(data);
                  $scope.asistencias = data.data.asistencias;
                  //console.log($scope.asistencias);
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
               
               blockUI.stop();
              

            });//fin de registrar asistencia
            //promise
            
     
      }

      /**
        * @Autor: María Alejandra Gómez Casani (oshingc)
        * @Param: a es un json AiAlumnoAsistencia con datos de alumno de una fila de la lista de asistencia
        * Método para cambio del check tardanza
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

      /**
       * @Autor: María Alejandra Gómez Casani (oshingc)
       * @Param: a es un json AiAlumnoAsistencia con datos de alumno de una fila de la lista de asistencia
       * Método que cambia el valor del check asistencia a marcado al marcar el de tardanza.
      **/

       $scope.updateSelectedTardanza = function(a) {
          //console.log(a);
            //console.log('updateSelectedTardanza');
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
            }else{
              if(a.aiAlumnoAsistencia.asistio == true){
                              
               if(a.asistioAnterior != null){

                  if(a.clasesAsistidas>0){
                    a.clasesAsistidas -=1;
                  }
                }
              
              }

            }
        }
        
      $scope.changeCheckAsistencia = function(a){
            a.aiAlumnoAsistencia.tardanza = false;
      }
    
      $scope.habilitarRegistroDeAsistencia = function(){
        return ($scope.asistencias.length>0)?true:false;          
      }   

      $scope.isPorcentajeInasistenciaMaximo = function(value){
        return (value.aiAlumnoMatriculaCurso.porcentajeInasistencia>=30)?true:false;          
      }  

      $scope.dateToMilitarHour = function(hora){
            
            var militarHour = 0;
            var mydate = new Date(hora);
            var horas = mydate.getHours();
            var minutos = mydate.getMinutes();
            militarHour = horas*100;
            militarHour += minutos;
            return militarHour;
      }


      /**
       * @Autor: María Alejandra Gómez Casani (oshingc)
       * Método para la carga en la vista de la lista de alumnos de la primera clase de 
       * clases dictadas en una fecha .
      **/
      $scope.obtenerClasesInicio = function(){
        

          var vista = $rootScope.vista;
          var date = $rootScope.date;
          var horaInicio = $rootScope.horaInicio;          
          var horaFin = $rootScope.horaFin;
          var idCursoSeleccionado = $rootScope.idCursoSeleccionado;
          var lastWeek = $rootScope.lastWeek;
          var fromClaseActual = $rootScope.fromClaseActual;

          if(lastWeek!=undefined && lastWeek!=null){
            horaInicio = moment (horaInicio).subtract('days',7).toDate();
            horaFin = moment (horaFin).subtract('days',7).toDate();
          }

          delete $rootScope.lastWeek;
          delete $rootScope.vista;
          delete $rootScope.date;
          delete $rootScope.horaInicio;
          delete $rootScope.horaFin;
          delete $rootScope.idCursoSeleccionado;
          delete $rootScope.fromClaseActual;


          if(fromClaseActual){
            
            var clase = $rootScope.clasesActuales[$rootScope.claseActualDefaultIndex];

            $sessionStorage['fecha-aa'] = new Date($scope.currentTime);
            $sessionStorage['horaInicio-aa'] = clase.horaInicio;
            $sessionStorage['horaFin-aa'] = clase.horaFin;
            $sessionStorage['idCursoSelecionado-aa'] =  clase.aiCurso.idCurso;
            vista=undefined;
          }

          /*Si hay una lista de clases de una fecha determinada en la vista*/
          if($scope.clasesAnteriores != undefined && $scope.clasesAnteriores.length>0){
            $scope.getClick();

          }else{
          /*Se recargó la página de asistencias anteriores*/
          if(vista ==undefined){
            vista = 2;            
            var fecha_temp = new Date($sessionStorage['fecha-aa']);
            date = fecha_temp;

            var horaInicio_temp = new Date($sessionStorage['horaInicio-aa']);
            horaInicio = horaInicio_temp;

            var horaFin_temp = new Date($sessionStorage['horaFin-aa']);
            horaFin = horaFin_temp;

            var idCursoSeleccionado_temp = $sessionStorage['idCursoSelecionado-aa'];
            idCursoSeleccionado = idCursoSeleccionado_temp;

            mywatcher();
          }

          /*Se proviene de la vista de horario*/
          if(vista ==1){
            //console.log('vista 1');
            mywatcher();
            //guardo mi fecha y horaInicio y horaFin

            //console.log(date);
            //console.log(horaInicio);
            //console.log(horaFin);
            //console.log(idCursoSeleccionado);

            if(date != undefined){        

              $sessionStorage['fecha-aa'] = date;
              $sessionStorage['horaInicio-aa'] = horaInicio;
              $sessionStorage['horaFin-aa'] = horaFin;
              $sessionStorage['idCursoSelecionado-aa'] = idCursoSeleccionado;
            }else{

              var currentTime_temp = new Date($rootScope.currentTime);
              //console.log($rootScope.currentTime);
              //console.log(currentTime_temp);
              date = $rootScope.currentTime;
            }

            vista = 2;
            
          }

          $scope.selectedDate = date;
          //console.log($scope.selectedDate);

          asistenciasAnterioresService.obtenerClases($scope.selectedDate).then(

              function(data){
                $scope.clasesAnteriores = data;//revisar la data retornada
                
                if($scope.clasesAnteriores.length>0){

                    if($scope.clasesAnteriores.length==1){                   
                      $scope.c = $scope.clasesAnteriores[0];
                      $scope.elegirClase($scope.c);

                    }else{                     

                      //console.log($scope.dateToMilitarHour(horaInicio));
                      //console.log($scope.dateToMilitarHour(horaFin));
                      //console.log(idCursoSeleccionado);


                      for(var i=0; i<$scope.clasesAnteriores.length>0; i++){

                        /*Elegimos la clase que este de acuerdo a los parámetros enviados desde horario*/
                        if($scope.clasesAnteriores[i].horaInicioInt == $scope.dateToMilitarHour(horaInicio)
                        && $scope.clasesAnteriores[i].horaFinInt == $scope.dateToMilitarHour(horaFin)
                        &&    $scope.clasesAnteriores[i].aiCurso.idCurso == idCursoSeleccionado){
                          $scope.c = $scope.clasesAnteriores[i];
                          $scope.elegirClase($scope.c);

                        }
                      }
                    }
                
                    $scope.showAlert = true;    
                                                  
                }else{
                  $scope.showAlert = false; 
                  $scope.asistencias = {};                                  
                }  
                
                }  

          
          );

          

        }


      }


      

      /**
       * @Autor: María Alejandra Gómez Casani (oshingc)
       * Método que marca en $sessionStorage que no se accedió a la vista asistencia anteriores
       * desde horario.
      **/
      $scope.getClick = function(idCursoDefault){
        if($scope.c!=undefined){

          $scope.c.fecha = $scope.selectedDate;
        }        

        asistenciasAnterioresService.obtenerClases($scope.selectedDate).then(

              function(data){
                $scope.clasesAnteriores = data;//revisar la data retornada
                
                if($scope.clasesAnteriores.length>0){

                  $scope.c = $scope.clasesAnteriores[0];
                  $scope.elegirClase($scope.c);

                  $scope.showAlert = true;                                      
                }else{
                  $scope.showAlert = false; 
                  $scope.asistencias = {};                                  
                }  
              }  
          
          );


        //$scope.elegirClase($scope.c);
      }


    	/**
       * @Autor: María Alejandra Gómez Casani (oshingc)
       * Método que según elección de la fecha obtiene la lista de clase de clases dictadas en esa fecha,
       * muestra la lista de alumnos de la primera clase de la lista de clases cargadas en la vista.
      **/

      var mywatcher = $scope.$watch('selectedDate', function() {

          asistenciasAnterioresService.obtenerClases($scope.selectedDate).then(

              function(data){
                $scope.clasesAnteriores = data;
                
                if($scope.clasesAnteriores.length>0){

                  $scope.c = $scope.clasesAnteriores[0];
                   $sessionStorage['clase'] = $scope.c;
                  $scope.elegirClase($scope.c);
                  $scope.showAlert = true;                    
                 
                }else{
                  $scope.showAlert = false; 
                  $scope.asistencias = {};                                  
                  }  
                }  

          
          );
    	},true);

      $scope.showModal = function() {
        modal.$promise.then(modal.show);
      }
      
      $scope.obtenerClasesInicio();

    };

    app.register.controller('AsistenciasAnterioresController', ['$scope', '$alert','$location','$sessionStorage','$modal','asistenciaService','asistenciasAnterioresService','$http','$rootScope','blockUI',asistenciasAnterioresController]);
    
});

