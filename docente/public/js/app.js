'use strict';

define(['services/routeResolver','socketio','ngStorage','ngSanitize', 'ngTouch'], function (route,io) {

    var app = angular.module('myApp', ['routeResolverServices','ngStorage','ui.router','ngAnimate','ngSanitize', 'ngTouch', 'mgcrea.ngStrap','blockUI'])
                     .run(function($rootScope){
                        $rootScope.currentTime = new Date();
                        $rootScope.showClassAlert="none";
                    });
    
    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'routeResolverProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider', '$asideProvider','$timepickerProvider','blockUIConfigProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, $asideProvider,$timepickerProvider,blockUIConfigProvider) {
            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };


            var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};

            $provide.value("$locale", {
              "DATETIME_FORMATS": {
                "AMPMS": [
                  "a.m.",
                  "p.m."
                ],
                "DAY": [
                  "domingo",
                  "lunes",
                  "martes",
                  "mi\u00e9rcoles",
                  "jueves",
                  "viernes",
                  "s\u00e1bado"
                ],
                "MONTH": [
                  "enero",
                  "febrero",
                  "marzo",
                  "abril",
                  "mayo",
                  "junio",
                  "julio",
                  "agosto",
                  "septiembre",
                  "octubre",
                  "noviembre",
                  "diciembre"
                ],
                "SHORTDAY": [
                  "dom",
                  "lun",
                  "mar",
                  "mi\u00e9",
                  "jue",
                  "vie",
                  "s\u00e1b"
                ],
                "SHORTMONTH": [
                  "ene",
                  "feb",
                  "mar",
                  "abr",
                  "may",
                  "jun",
                  "jul",
                  "ago",
                  "sep",
                  "oct",
                  "nov",
                  "dic"
                ],
                "fullDate": "EEEE, d 'de' MMMM 'de' y",
                "longDate": "d 'de' MMMM 'de' y",
                "medium": "dd/MM/yyyy HH:mm:ss",
                "mediumDate": "dd/MM/yyyy",
                "mediumTime": "HH:mm:ss",
                "short": "d/MM/yy HH:mm",
                "shortDate": "d/MM/yy",
                "shortTime": "HH:mm"
              },
              "NUMBER_FORMATS": {
                "CURRENCY_SYM": "\u20ac",
                "DECIMAL_SEP": ",",
                "GROUP_SEP": ".",
                "PATTERNS": [
                  {
                    "gSize": 3,
                    "lgSize": 3,
                    "macFrac": 0,
                    "maxFrac": 3,
                    "minFrac": 0,
                    "minInt": 1,
                    "negPre": "-",
                    "negSuf": "",
                    "posPre": "",
                    "posSuf": ""
                  },
                  {
                    "gSize": 3,
                    "lgSize": 3,
                    "macFrac": 0,
                    "maxFrac": 2,
                    "minFrac": 2,
                    "minInt": 1,
                    "negPre": "-",
                    "negSuf": "\u00a0\u00a4",
                    "posPre": "",
                    "posSuf": "\u00a0\u00a4"
                  }
                ]
              },
              "id": "es-pe",
              "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
            });

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;
            /*$routeProvider
                .when('/intro', route.resolve('Intro'))
                .when('/subgrupos', route.resolve('SubGrupos'))
                .when('/view2', route.resolve('View2'))
                .when('/login', route.resolve('Login'))
                .otherwise({redirectTo : '/login'}); */


            var access = routingConfig.accessLevels;

            //console.log($locationProvider);
            // Public routes
            $stateProvider
                .state('public', {
                    abstract: true,
                    template: "<ui-view/>",
                    data: {
                        access: access.public
                    }
                })
                .state('public.404', {
                    url: '/404',
                    templateUrl: VarsApp.rootUrl + '/views/404.html'
                })
                .state('public.home', route.resolve('/intro', 'Intro'));

            // Anonymous routes
            $stateProvider
                .state('anon', {
                    abstract: true,
                    template: "<ui-view/>",
                    data: {
                        access: access.anon
                    }
                })
                .state('anon.login', route.resolve('/', 'Login'))
                .state('anon.forgotPassword', route.resolve('/forgotPassword', 'ForgotPassword'))
                .state('anon.newPassword', route.resolve('/newPassword/:idKey', 'NewPassword'));        
            // Regular user routes
            $stateProvider
                .state('user', {
                    abstract: true,
                    template: "<ui-view/>",
                    data: {
                        access: access.user
                    }
                })
                .state('user.subgrupos', route.resolve('/subgrupos', 'SubGrupos'))
                .state('user.matricula', route.resolve('/matricula', 'Matricula'))
                .state('user.view2',route.resolve('/view2','View2'))
                .state('user.profile', route.resolve('/profile','Profile')) 
                .state('user.horario',route.resolve('/horario','Horario'))
                .state('user.asistencia', route.resolve('/asistencia','Asistencia'))
                .state('user.asistenciaMultiple', route.resolve('/asistencia-multiple','AsistenciaMultiple'))
                .state('user.asistencias-anteriores', route.resolve('/asistencias-anteriores','AsistenciasAnteriores'))                
                .state('user.alumnos',route.resolve('/alumnos','Alumnos'))
                .state('user.notasAlumnos',route.resolve('/notasAlumnos','NotasAlumnos'));


            $urlRouterProvider.otherwise('/404');

            //$locationProvider.html5Mode(true);

            $urlRouterProvider.rule(function($injector, $location) {
                if($location.protocol() === 'file')
                    return;

                var path = $location.path()
                // Note: misnomer. This returns a query object, not a search string
                    , search = $location.search()
                    , params
                    ;

                // check to see if the path already ends in '/'
                if (path[path.length - 1] === '/') {
                    return;
                }

                // If there was no search string / query params, return with a `/`
                if (Object.keys(search).length === 0) {
                    return path + '/';
                }

            // Otherwise build the search string and return a `/?` prefix
                params = [];
                angular.forEach(search, function(v, k){
                    params.push(k + '=' + v);
                });
                return path + '/?' + params.join('&');
            });

            //$locationProvider.html5Mode(true);

            $httpProvider.defaults.cache = false;
            if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
            }
            // disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

            $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';



            $httpProvider.interceptors.push(function($q, $location) {
                return {
                    'responseError': function(response) {
                        var path = $location.path();
                        if( (response.status === 401 || response.status === 403
                            || response.status === 302 ) && (path!=="/") ) {
                            alert("Su sesión ha finalizado!")
                            sessionStorage.clear(); 
                            window.location.href="/";                           
                            return $q.reject(response);
                        }
                        else {
                            return $q.reject(response);
                        }
                    }
                }
            });
            angular.extend($asideProvider.defaults, {
                container: 'body',
                html: true
            });            

            angular.extend($timepickerProvider.defaults, {
                lang:'en'
            });

            blockUIConfigProvider.message('Cargando..');
            
    }]);     


    app.factory('socket', function($rootScope) {
        var socket = io.connect();
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if(callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };            
    });

    //Only needed for Breeze. Maps Q (used by default in Breeze) to Angular's $q to avoid having to call scope.$apply() 
    app.run(['$q', '$rootScope','$timeout', '$state', 'Auth',
        function ($q, $rootScope,$timeout, $state, Auth) {
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                if (!Auth.authorize(toState.data.access)) {
                   
                    $rootScope.error = "No tienes los permisos suficientes para esta opción.";
                    $timeout(function() {
                        $rootScope.error = null;
                    }, 4000);
                    event.preventDefault();

                    if(Auth.isLoggedIn()) {
                        $state.go('public.home');
                    }
                    else {
                        $state.go('anon.login');
                    }
                }
            });
    }]);

    return app;

});