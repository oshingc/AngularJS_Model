'use strict';

define(['app'], function (app) {

    var matriculaController = function ($scope, $location) {
        var appTitle = 'Matricula';
        $scope.appTitle = appTitle;
        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        }

    };


    app.register.controller('MatriculaController', ['$scope', '$location', matriculaController]);
    
});