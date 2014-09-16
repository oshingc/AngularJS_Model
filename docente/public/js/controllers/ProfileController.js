'use strict';

define(['app'], function (app) {

    var profileController = function ($scope, $location, $http, $sessionStorage, $filter, $alert,profileService) {

        $scope.datos = {};
        $scope.message = 'Profile';
        $scope.btnMessage = 'Editar Perfil';  
        $scope.alert = {
            "content": "Datos actualizados ",
//            "container": "#profile-messages",
            "type": "success",
            "placement": "top-right",
            "duration" : 5
        };
        $scope.boxcontent = '<div>box!</div>'   
        var tabPath = 'views/template/Perfil/';
        $scope.showAlert = function(){
            $alert($scope.alert);
        }

        $scope.showProfile = function(){
            profileService.showProfile($scope,$sessionStorage);
        
        }

        $scope.habilitarInputs = function(){

        }
        $scope.edit = function(message){
         
            console.log(message);
            console.log("actualmessage "+$scope.btnMessage);
            if($scope.btnMessage == 'Editar Perfil'){
                $('#movil').removeAttr('disabled',false);
                $('#correoPer').removeAttr('disabled',false);
                $('#tel').removeAttr('disabled',false);
                $scope.btnMessage = 'Guardar Cambios';

               return 1;
                
            }else{
                if($scope.btnMessage == 'Guardar Cambios'){
                    
                    $('#movil').prop('disabled',true);
                    $('#correoPer').prop('disabled',true);
                    $('#tel').prop('disabled',true);
                    $scope.btnMessage = 'Editar Perfil';
                    $('#profile-messages').show();
                    return 2;
                    
                }
            }            
          
               
        }

        $scope.updateProfile = function (message){            
            if($scope.edit(message)==2){
                profileService.updateProfile($scope.datos,$scope);   

            }     
            

        }

        $scope.init = function(){
            $scope.showProfile();
            $scope.tabs = [
                {
                  "title": "Datos generales",
                  "template":tabPath + "General.html"               
                }
                /*,
                {
                    "title": "Cambiar contraseña",
                    "template": tabPath + "CambioPassword.html"
                }
                */
            ];
            $scope.tabs.activeTab = 0;
        }

        
        function verifyEmail(){
            var status = false;     
            var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (document.myform.email1.value.search(emailRegEx) == -1) {
                emailvalide = false;
            }else{
                emailvalide = true;
            }
            
        }

        $scope.verificarClave=function(inputClave){
            if(inputClave===undefined){
            }else{
                console.log(inputClave);
                 profileService.validacionClave(inputClave)
                 .then(function(data){
                        console.log(data)
                        if(data==='true'){
                            $scope.invalidClaveAntigua=false;
                            console.log('valido')
                        }
                        else{
                            console.log('invalido')
                            $scope.invalidClaveAntigua=true;
                        }
                        console.log($scope.invalidClaveAntigua+"BOOOOOOOOOOOOOOOOOOOOLEAN");
                 });
             }
        }

        $scope.guardarNvaClave=function(nvaClave,repiteNvaClave){
            console.log(nvaClave);
            console.log(repiteNvaClave);
            if(nvaClave==repiteNvaClave){
                console.log('iguales');
                $scope.diferentes=false;
                $scope.actualizarClave(nvaClave);
            }
            else{
                console.log('diferentes');
                $scope.diferentes=true;
            }
        }

        $scope.actualizarClave = function (clave){            
            profileService.updateClave(clave)
            .then(function(data){
                console.log('update');
                var alert = $scope.alert;
                alert.title = "Guardar clave";
                alert.content = "<br/>Los nueva contraseña ha sido guardada satisfactoriamente.";
                alert.duration = 3;
                $scope.showAlert();
            });   
        }

        $scope.init();           

    };

    app.register.controller('ProfileController', ['$scope', '$location','$http','$sessionStorage', '$filter','$alert','profileService',profileController]);

});
