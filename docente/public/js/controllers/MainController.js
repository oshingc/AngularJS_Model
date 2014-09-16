'use strict';

define(['app'], function (app) {

    var mainController = function ($scope, $location , $state, $sessionStorage, $rootScope, $timeout, $aside, $alert, avisoService, asistenciaService, Auth) {
        var appTitle = 'Home';
        $scope.message = '';
        $scope.hayClasesEnEsteMomento=false;
        $rootScope.hayClasesEnEsteMomento = false;
        $scope.modalOpened = false;


        //$rootScope.showClassAlert="none !important;";
        $scope.showAlert = "none !important;";
        
        $scope.popover = {
          "title": "Title",
          "content": "This is the <b>body</b> of Popover"
        };

        $scope.tooltipMenu = {
            perfil: {
                "title": "Datos personales, y edición de información.",
                "html": true
            }
            ,horario: {
                "title": "Horario del Periodo Actual, ver lista de alumnos e ingreso de Notas.",
                "html": true
            }
            ,asistenciaHoy: {
                "title": "Toma de asistencia si tuviera clase en este momento.",
                "html": true
            }
            ,asistenciaAnterior: {
                "title": "Registro de asistencia de clases pasadas.",
                "html": true
            }
        };

        $scope.avisoEmail = {
            "title" : "Éxito",
            "content": "<br/>La nueva oferta has sido guardada satisfactoriamente.",
            "type": "success",
            "duration" : 3,
            //"type": "alert alert-success bg-info lter",
            "placement": "top-right"
        };  

        $scope.avisos = {};
        $scope.totalAvisos = 0;
        $scope.notifications = [{"tema":'notification 1'},{"tema": 'notificacion 2'}];
        $scope.appTitle = appTitle;
        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;
        $scope.claseActualTitulo = "Clase Actual";
        var bodyElement = angular.element(document.querySelector( 'body' ));
        

        var init = function (){
           
            $(document).ready(function () {
                $(window).scroll(function () {
                    if ($(this).scrollTop() > 100) {
                        $('.scrollup').show();
                    } else {
                        $('.scrollup').hide();
                    }
                });

            });  


            if ($scope.estaLogueado()) {
                //console.log('logueado')
                bodyElement.addClass('inlogin');
            } else {
                bodyElement.addClass('nologin');
            }   

            $scope.showAvisos();
            $timeout(verificarHoraDelSistema,1000);

            $rootScope.recuperarClasesActuales = recuperarClasesActuales;
        };

        $scope.toggleModal = function (){
            $scope.modalOpened = !$scope.modalOpened;
            console.log("hola");
        }


        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        }

        $scope.getShowClassAlert = function(){
            return $rootScope.showClassAlert;
        }

        $scope.logout = function(){
            console.log('logout');
            //$scope.showAlert = "none";
            Auth.callLogout(
                function(data, status) {
                    if(status == 200){
                        
                        $location.path("/");
                        bodyElement.addClass('nologin');
                        $scope.showAlert="none !important;";
                        $scope.hayClasesEnEsteMomento=false;
                        $rootScope.hayClasesEnEsteMomento = false;
                        //$scope.showAlert=undefined;

                    }
                }
            );            
            bodyElement.addClass('nologin');
            //$rootScope.showClassAlert="none !important";
            
        
        };

        $scope.showAvisos = function(){
            //avisoService.showAvisos($scope,$sessionStorage);
        };

        $scope.showModal = function(element){                        
            
            $scope.titulo = element.titulo;
            $scope.detalle = element.detalle;   
            $scope.archivo = element.archivo;  

            $('#det').html($scope.detalle);
            $('#arc').html($scope.archivo);
                                                        
            
            if(element.archivo == null){
                $scope.archivo = 'No hay archivo adjunto';
            }else{
                $scope.archivo = element.archivo;
            }
        };

        $scope.concatZero = function(number){
            if(number<10){
                return '0'+number;
            }else{
                if(number==0){
                    return '00';
                }
            }
            return number+'';
        }

        $scope.timeFormat = function(time){
            var day = time.getDate();
            var month = (time.getMonth()+1);
            var year = (time.getYear()+1900);
            var hour = time.getHours();
            var minutes = time.getMinutes();
            var seconds = time.getSeconds();
            day = $scope.concatZero(day);
            month = $scope.concatZero(month);
            hour = $scope.concatZero(hour);
            minutes = $scope.concatZero(minutes);
            seconds = $scope.concatZero(seconds);
            return day+'-'+month+'-'+year+' '+hour+':'+minutes+':'+seconds;
        }

        $scope.getClaseActualScope = function(){
            return $rootScope.claseActualScope;
        }


        $scope.getCurrentTime = function() {
            return $rootScope.currentTime;
        };

        var changeCurrentTime = function() { 
            $scope.hallarClasesActuales();       
            var t = $rootScope.currentTime;
            t.setSeconds(t.getSeconds() + 1);     
            $rootScope.currentTime = t;            
            $timeout(changeCurrentTime,1000);
        };

        $scope.hora = function(){
            $timeout(changeCurrentTime,1000);
            recuperarClasesActuales();
        }

        var recuperarClasesActuales = function (){
            $rootScope.hayClasesEnEsteMomento = false;
            asistenciaService.obtenerClasesActuales($rootScope.currentTime,$scope,$sessionStorage).then(function(data){
                $rootScope.clasesActuales = data;  
                //console.log(data);             
                $scope.hallarClasesActuales();
            }); 
        };

       

        $scope.redirectToAsistencia = function(fromClaseActual){            
            var width = screen.width;
            var params ={
                    reload: true,
                    inherit: false,
                    notify: true
                }; 

            if(width<=767){
                $rootScope.fromClaseActual = fromClaseActual;
                $state.transitionTo("user.asistencias-anteriores", {}, params);              
            }else{
                $rootScope.fromClaseActual = fromClaseActual;
                $state.transitionTo("user.asistenciaMultiple", {}, params);        
            }
        }

        $scope.hallarClasesActuales = function(){

            var claseActualDefaultIndex = null;
            $scope.mensajeDeClasesActuales = "";
            $scope.hayClasesEnEsteMomento = false;
            $rootScope.hayClasesEnEsteMomento = false;
            if($rootScope.clasesActuales!=undefined && $rootScope.clasesActuales.length>0){
               
                for(var i=0; i<$rootScope.clasesActuales.length; i++){
                
                    var horai = new Date($rootScope.clasesActuales[i].horaInicio);                    
                    var horaii = horai.getHours()*100+horai.getMinutes();

                    var horaa = new Date($rootScope.currentTime);
                    var horaaa = horaa.getHours()*100+horaa.getMinutes();

                    var horaf = new Date($rootScope.clasesActuales[i].horaFin);
                    var horaff = horaf.getHours()*100+horaf.getMinutes();                    
                    
                    if(horaii<=horaaa&&horaff>horaaa){                                            
                        
                        if(claseActualDefaultIndex==null){
                            claseActualDefaultIndex = i;
                        }

                        $scope.mensajeDeClasesActuales += $rootScope.clasesActuales[i].aiCurso.nombre;
                        $scope.mensajeDeClasesActuales += "\n";
                        $scope.hayClasesEnEsteMomento = true;
                        $rootScope.hayClasesEnEsteMomento = true;
                        $scope.showAlert = "block !important;";//mostrar
                    }                                 
                }

                if(claseActualDefaultIndex!=null){
                    $rootScope.claseActualDefaultIndex = claseActualDefaultIndex;
                }
            }else{
                $scope.showAlert = "none !important;";
                $scope.hayClasesEnEsteMomento=false;
                $rootScope.hayClasesEnEsteMomento = false;
            }
            $rootScope.mensajeDeClasesActuales = $scope.mensajeDeClasesActuales;           
        }


        $scope.getHayClasesEnEsteMomento = function(){
            return $rootScope.hayClasesEnEsteMomento;
        }

        $scope.getMensajeDeClasesActuales = function(){
            return $rootScope.mensajeDeClasesActuales;
        }

        $scope.getShowAlert = function(){
            //console.log('show alert: ');
            //console.log($scope.showAlert);
            return $scope.showAlert;
        }


        $scope.estaLogueado = function() {
            return Auth.isLoggedIn();
        }

        var verificarHoraDelSistema = function(){
            if(!$scope.estaLogueado()){
                bodyElement.addClass('nologin');
                $timeout(verificarHoraDelSistema,1000);
            }
            else{
                $scope.hora();
                bodyElement.addClass('inlogin');
            }
        }        

        $scope.formatoFecha = function(fecha) {
            var fechaNormal = new Date(fecha);
            return fechaNormal.toLocaleDateString();
        }

        $scope.estaLogueado = function() {
            return $scope.user.role.title != "public"
        }          

        //Funcion usada para los links del menu principal
        $scope.linkMenuPrin = function(state) {
            $timeout(function() {
                $state.go(state);
            }, 300);

        }

        //Funcion usada para el envío de mensajes por parte del usuario
        $scope.enviarMensajeDeTexto = function(){
            var alert = $scope.avisoEmail;
            
            alert.title = "Enviando";
            alert.content = "";
            $scope.showAvisoEmail();
            avisoService.enviarMensajeDeTexto($scope.message).then(function (resp){
                console.log(resp);
                if(resp.result){
                    alert.title = "Éxito";
                    alert.content = "<br/>El mensaje ha sido enviado.";
                }else{
                    alert.title = "Aviso";
                    alert.content = "<br/>El mensaje no pudo ser enviado.";
                    alert.type = "danger";
                }
                $scope.showAvisoEmail(alert);
                $scope.toggleModal();
            });
        }

        $scope.showAvisoEmail = function(){
            $alert($scope.avisoEmail);
        };              

        init();

    };

    app.controller('MainController', ['$scope', '$location', '$state', '$sessionStorage','$rootScope','$timeout', '$aside', '$alert', 'avisoService','asistenciaService','Auth', mainController]);
});
