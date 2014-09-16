
var VarsApp = {
    rootUrl : '',
    baseUrl : '/js',
    libUrl : '../../bower_components',
    autor : "Promotora Miraflores"
};


require.config({
	
	baseUrl: VarsApp.baseUrl,

	paths: {
		angular: VarsApp.libUrl +'/angular/angular',
		angularRoute: VarsApp.libUrl +'/angular-route/angular-route',
		angularMocks: VarsApp.libUrl +'/angular-mocks/angular-mocks',
		angularSocket : VarsApp.libUrl + '/angular-socket-io/socket',
		text: VarsApp.libUrl +'/requirejs-text/text',
		jquery: VarsApp.libUrl +'/jquery/jquery.min',
		socketio : VarsApp.libUrl +'/socket.io-client/dist/socket.io',
		ngStorage : VarsApp.libUrl + '/ngstorage/ngStorage.min',
		uiRouter : VarsApp.libUrl + '/angular-ui-router/release/angular-ui-router.min',
		MainController : '../../js/controllers/MainController',
		angularAnimate: VarsApp.libUrl +'/angular-animate/angular-animate.min',
		angularStrap : VarsApp.libUrl +'/angular-strap/dist/angular-strap.min',
		angularStrapTpl : VarsApp.libUrl +'/angular-strap/dist/angular-strap.tpl.min',
		angularBlockUi: VarsApp.libUrl +'/angular-block-ui/dist/angular-block-ui.min',
		ngSanitize : VarsApp.libUrl + '/angular-sanitize/angular-sanitize',
		ngTouch : VarsApp.libUrl + '/angular-touch/angular-touch.min',
		jqueryUI: VarsApp.libUrl+ '/jquery-ui/ui/jquery-ui',
		fullCalendar : VarsApp.libUrl+ '/fullcalendar/dist/fullcalendar.min',
		moment: VarsApp.libUrl+'/moment/min/moment.min',
		momentEs: VarsApp.libUrl+'/moment/locale/es',
		html2canvas : VarsApp.libUrl+'/html2canvas/build/html2canvas.min',
		jsPDF : '/js/lib/jsPDF',
		jsPDFAutoTable : '/js/lib/jspdf.plugin.autotable',
		floatThead : VarsApp.libUrl + '/floatThead/dist/jquery.floatThead'
	
	},	
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		},	
		'socketio': {
	      exports: 'io'
	    },
		'jquery': {'exports' : 'jquery'},	
		'angularSocket' : ['angular'],
		'ngStorage' : { deps:['angular']},
		'uiRouter' : { deps:['angular']},
		'services/routeResolver' : { deps:['angular']},
		'MainController' : ['app'],
		'angularStrap' : ['angular'],
		'angularStrapTpl' : ['angular','angularStrap'],
		'angularBlockUi' : ['angular'],
		'angularAnimate' : ['angular'],
		'ngSanitize' : { deps:['angular']},
		'ngTouch' : { deps:['angular']},
		'jqueryUI' :['jquery'],
		'fullCalendar' :['jquery'],
		'floatThead' :['jquery'],
		'momentEs' : ['moment'],
		'jsPDFAutoTable' : ['jsPDF']
	},
	priority: [
		"jquery","angular"
	]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'jquery',
	'services/routeResolver',
	'uiRouter',
	'app',
	'conf/routing',
	'utils/CookieRestManager',
	'utils/ObjectRestManager',
	'directives/accessLevel',
	'directives/fallbackSrc',
	'directives/scrollTo',
	'directives/barraInasistencia',
	'directives/utilDirectives',
	'services/loginService',
	'services/profileService',
	'services/horarioService',
	'services/avisoService',
	'services/NotasAlumnosService',
	'services/asistenciaService',
	'services/asistenciasAnterioresService',
	'services/alumnosService',
	'services/forgotPasswordService',
	'filters/asistenciaFilter',
	'angularRoute',
	'MainController',
	'angularAnimate',
	'angularStrap',
	'angularStrapTpl',
	'angularBlockUi',
	'ngSanitize',
	'jqueryUI',
	'fullCalendar',
	'moment',
	'momentEs',
	'html2canvas',
	'jsPDF',
	'jsPDFAutoTable',
	'floatThead'
], function(angular,jquery,routeResolver,app) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);
	angular.element().ready(function() {
		angular.bootstrap(document, ['myApp']);
	});
});
