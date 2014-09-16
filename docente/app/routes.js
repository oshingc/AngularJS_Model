var Todo = require('./models/todo');
var service = require('../app/ext_service/sgaService.js'); 		
var client = service.setClient();
var request = require('request');

module.exports = function(app) {


	app.post('/api/login-rest', function(req, res) {
		var args_js ={
	        headers:{'Content-Type': 'application/x-www-form-urlencoded',
	        'Accept':'application/json; charset=UTF-8'}
	    };
	    args_js.headers['tipo']='D';
	    args_js.headers['Idioma']= req.body.idioma;
	    args_js.headers['Connection'] = 'keep-alive';
	    args_js.data= 'j_username='+req.body.user+'&'+'j_password='+ req.body.password;//+'&'+'_spring_security_remember_me=true';
		
		/*var req2=client.methods.login(args_js,function(data,response){
			/*res.setHeader('Content-Type', 'application/json');
			res.setHeader('Content-Length', 0);
			if(response.headers['set-cookie']!=null)
				res.setHeader('set-cookie-rest',response.headers['set-cookie']);
			if(response.headers.errormessage!=null)
				res.setHeader('errorMessage',response.headers.errormessage);
			res.statusCode = response.statusCode;*/
			//res.statusCode = 200;
				//res.type('application/json');
	  			
		/*
    	});

		

		req2.on('error',function(err){
			console.log(err);
			res.statusCode = 401;
			res.setHeader('errorMessage',"Error en el servidor.");
  			res.send("Login Failed!");
		});

		*/

		var options = {
		    url: 'http://localhost:8080/sga/api/j_login_rest',
		    headers:{'Content-Type': 'application/x-www-form-urlencoded',
	        'Accept':'application/json; charset=UTF-8'},
		    body : args_js.data,
		    method : 'POST'
		};

		options.headers  =  args_js.headers;

		
		request(options,function(error,response,body) {

				if(!error){
					console.log(body);
					if(response.headers['set-cookie']!=null)
						res.setHeader('set-cookie-rest',response.headers['set-cookie']);
					if(response.headers.errormessage!=null)
						res.setHeader('errorMessage',response.headers.errormessage);
					res.statusCode = response.statusCode;
					res.send(body);
				}else{
					console.log(error);
					res.send("Error");
				}
			}	
		);

		//res.send("OK!");

	});

	app.get('/api/subgrupos', function(req, res) {
		var args_js ={
	        headers:{'Accept':'application/json',}
	    };

	    args_js.headers['Cookie'] = req.headers['cookie-rest'];
	    
		client.methods.jsonMethod(args_js,function(data,response){
			res.statusCode = response.statusCode;
			res.type('application/json');
  			res.send(data);
    	});
	});

	app.get('/api/logout', function(req, res) {
		var args_js ={
	        headers:{}
	    };
	    args_js.headers['Cookie'] = req.headers['cookie-rest'];
	    
		client.methods.logout(args_js,function(data,response){
			if(response.statusCode=302)
				res.statusCode = 200;
			else
				res.statusCode=302;
  			res.send(data);
    	});
	});

	app.get('/api/docente/**', function(req, res) {
		var args_js ={
	        headers:{'Accept':'application/json',}
	    };

	    console.info(req.params);

	    args_js.headers['Cookie'] = req.headers['cookie-rest'];

	    var req = client.get(client.webSeviceRoute+'docente/'+req.params[0],args_js,
	    	function(data,response){
				res.statusCode = response.statusCode;
				res.type('application/json');
	  			res.send(data);
    	});

		req.on('error',function(err){
  			res.send("Failed!");
		});
	});

	app.post('/api/docente/**', function(req, res) {
		var args_js ={
	        headers:{'Content-Type':'application/json',}
	    };

	    console.info(req.body);

	    args_js.headers['Cookie'] = req.headers['cookie-rest'];
	    args_js.data = req.body;


	    var req = client.post(client.webSeviceRoute+'docente/'+req.params[0],args_js,
	    	function(data,response) {
				res.statusCode = response.statusCode;
	  			res.send(data);	  			
    	});

		req.on('error',function(err) {
			res.statusCode = 500;
  			res.send('{"message": "Error en el proceso.", "resultado": 0}');
		});
	});

	app.get('/api/public/**', function(req, res) {
		var args_js ={
	        headers:{'Accept':'application/json',}
	    };

	    console.info(req.params);

	    //args_js.headers['Cookie'] = req.headers['cookie-rest'];

	    var req = client.get(client.webSeviceRoute+'public/'+req.params[0],args_js,
	    	function(data,response){
				res.statusCode = response.statusCode;
				res.type('application/json');
	  			res.send(data);
    	});

		req.on('error',function(err){
  			res.send("Failed!");
		});
	});

	app.post('/api/public/**', function(req, res) {
		var args_js ={
	        headers:{'Content-Type':'application/json',}
	    };

	    //console.info(req.body);

	    //args_js.headers['Cookie'] = req.headers['cookie-rest'];
	    args_js.data = req.body;


	    var req = client.post(client.webSeviceRoute+'public/'+req.params[0],args_js,
	    	function(data,response){
				res.statusCode = response.statusCode;
	  			res.send(data);	  			
    	});

		req.on('error',function(err){
  			res.send("Failed!");
		});
	});

};