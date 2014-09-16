'use strict';

define(['app'], function (app) {

    var ObjectRestManager = function ($sessionStorage) {  
        var ObjectFactory = {};

        ObjectFactory.createDataRequest = function(data,message){
                var response={};               

                response.data = data;

                if(message != undefined){
                    response.message = message;
                }

                return response;
        };

        return ObjectFactory;

    };

    app.factory('ObjectRestManager', ['$sessionStorage',ObjectRestManager]);

});