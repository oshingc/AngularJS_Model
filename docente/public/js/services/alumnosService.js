
'use strict';

define(['app'], function (app) {

    var alumnosService = function ($http,$sessionStorage,$location,$rootScope ) {
        var alumnosFactory = {};

        return alumnosFactory;

    };

    app.factory('alumnosService', ['$http','$sessionStorage','$location','$rootScope',alumnosService]);

});