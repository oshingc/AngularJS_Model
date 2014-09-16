'use strict';

define(['app'], function (app) {

    var CookieRestManager = function ($sessionStorage) {  
        var cookieFactory = {};

        cookieFactory.setCookieRest = function(new_cookie){
            $sessionStorage['JSESSION'] = new_cookie;
        };

        cookieFactory.cookieRest = function (){
            return $sessionStorage['JSESSION'];
        };

        cookieFactory.cookieUser = function(){
            return $sessionStorage['user'];
        };

        cookieFactory.cleanStorage = function (){
            delete $sessionStorage['JSESSION'] ;
            delete $sessionStorage['user'];    
        };

        cookieFactory.setCookieUser = function(user){
            $sessionStorage['user'] = user;
        };

        cookieFactory.encodeCrendentialsForJavaSecurity = function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        };

        return cookieFactory;

    };

    app.factory('CookieRestManager', ['$sessionStorage',CookieRestManager]);

});