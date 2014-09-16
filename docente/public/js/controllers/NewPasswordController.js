'use strict';

define(['app'], function (app) {

    var newPasswordController = function ($scope, $location, $stateParams, $http, $sessionStorage, $filter, $alert, $modal, forgotPasswordService) {

        var idKey = $stateParams.idKey;

        $scope.docente = { };

        var modal = $modal({
            template : '/views/template/ConfirmacionResetPassword.html',
            persist : false,
            show : false,
            esc: false,
            backdrop : 'static',
            scope : $scope
        });

        $scope.alert = {
            "content": "...",
            "container" : "#changePasswordMensaje",
            "type": "success",
            "duration" : 4
        }; 

        $scope.init = function(){
            console.log('idKey:   '+idKey);    
            $scope.cargando=false;
            $scope.verificaLink();
        }

        $scope.verificaLink= function(){
            forgotPasswordService.verificarURL(idKey)
            .then(function(data){
                if(data.result){
                    console.log('????????');
                    $scope.hasError=false;
                }else{
                    console.log('yeeeeeeee');
                    console.log(data.message);
                    $scope.hasError=true;
                    $scope.mensajeError=data.message;
                }
            });
        }

        $scope.guardarNvaClave=function(nuevaClave,repiteNvaClave){
            console.log(nuevaClave);
            console.log(repiteNvaClave);
            if(nuevaClave==repiteNvaClave){
                console.log('iguales');
                $scope.diferentes=false;
                $scope.actualizarClave();
            }
            else{
                console.log('diferentes');
                $scope.diferentes=true;
            }
        }

        $scope.actualizarClave = function (){
            $('#btnMsg').prop('disabled',true);
            $('#nvaClave').prop('disabled',true);
            $('#repNvaClave').prop('disabled',true);
            $scope.cargando=true;
            $scope.docente.clave=$scope.nuevaClave; 
            console.log('docente clave:  ' +$scope.docente.clave);           
            forgotPasswordService.updatePassword(idKey,$scope.docente)
            .then(function(data){
                if(data.result){
                    console.log('update');
                    $scope.successMessage=data.message;
                    $scope.showModal();
                }
                else{
                    console.log('no update');     
                    console.log('create error');
                    $scope.alert.title = "Error al guardar";
                    $scope.alert.content = "<br/>"+data.message;
                    $scope.alert.type="danger";
                    $scope.showAlert();    
                }
            });   
        }

        $scope.showAlert = function(){
            $alert($scope.alert);
        }
        $scope.showModal = function() {
            modal.$promise.then(modal.show);
        }

        $scope.init(); 
    };

    app.register.controller('NewPasswordController', ['$scope', '$location','$stateParams','$http','$sessionStorage', '$filter','$alert','$modal','forgotPasswordService',newPasswordController]);

});