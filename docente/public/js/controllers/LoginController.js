'use strict';

define(['app'], function (app) {

    var loginController = function ($scope, $location , $sessionStorage, $rootScope, $alert, avisoService,Auth) {
        var appTitle = 'Home';
        $scope.appTitle = appTitle;
        $rootScope.showClassAlert="none";
        $scope.alert = {
            "content": "...",
            "container" : "#panelMensaje",
            "type": "danger",
            "duration" : 5
        };  
        $scope.processing = false;

        var alert = null;

        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        }

        $scope.login=function(){   
            $scope.processing = true;
            Auth.callLogin($scope.formData,$scope);          
        };

        $scope.cancelLogin = function(){
            Auth.deleteLocalCredentials();
            $scope.formData.password="";
            $rootScope.showClassAlert="none";  
        }

        $scope.showAlert = function(){
            if(alert==null){
                alert = $alert($scope.alert);
                
            }else{
                alert.hide();
                alert = $alert($scope.alert);
            }
        }

    };


    app.register.controller('LoginController', ['$scope', '$location','$sessionStorage','$rootScope','$alert', 'avisoService','Auth', loginController]);
});
