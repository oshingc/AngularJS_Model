// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
//var mongoose = require('mongoose'); 					// mongoose for mongodb
var http 	 = require('http');
var port  	 = process.env.PORT || 8085; 				// set the port
//var database = require('./config/database'); 			// load the database config
var io 		 = require('socket.io');							// load socket.io

// configuration ===============================================================
//mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	app.set('port', process.env.PORT || 4004);
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	/*app.use(function(err, req, res, next) {
		console.log("Error");
	  if (req.is('json')) {
		try {
		    JSON.parse(req.body);
		    next();
		} catch (e) {
			res.charset = 'UTF-8'
			res.statusCode = 400;
  			res.send('{"message": "Error en el proceso. La información no se envió correctamente ", "resultado": 0}');
		}	  	
	  }
	});*/
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

var server = http.createServer(app);
io = io.listen(server);

var Client = require('node-rest-client').Client;
// direct way
var client = new Client();
client.registerMethod("saveInscripcion", "http://localhost:8080/sga/api/subgrupo/save", "POST");

io.sockets.on('connection', function(socket) {

	socket.on('updateSg', function(data) {
		
		args_js ={
	        headers:{'Content-Type': 'application/json'}
	    };

	    args_js.data = JSON.stringify(data.id);

	    /*client.methods.saveInscripcion(args_js,function(data,response){		   
			console.info(data);
		});*/
			
		socket.broadcast.emit('onSgUpdated', data);
	});
});

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

