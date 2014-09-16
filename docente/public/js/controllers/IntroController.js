'use strict';

define(['app'], function (app) {

    var mainController = function ($scope, $location,$sessionStorage,$rootScope,$http,asistenciaService) {
        var appTitle = 'Intro';
        $scope.appTitle = appTitle;
        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        }
        /*retirar del controller*/
        $scope.obtenerClaseActual = function(){            
            asistenciaService.obtenerClaseActual($scope,$sessionStorage);           
        }

        $scope.obtenerClasesActuales = function(){
            var date = new Date();
            $scope.otroScope = asistenciaService.obtenerClasesActuales(date,$scope,$sessionStorage);
        }
        $scope.getShowClassAlert = function(){
            return $rootScope.showClassAlert;
        }

        $rootScope.showClassAlert="block";
        $scope.obtenerClasesActuales();

    };

    app.register.controller('IntroController', ['$scope', '$location','$sessionStorage','$rootScope','$http','asistenciaService',mainController]);
    
});