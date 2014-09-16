module.exports = {
  setClient: function () {
    var Client = require('node-rest-client').Client;
    // direct way
    client = new Client();
    client.webSeviceRoute = "http://localhost:8080/sga/api/";
    var route = client.webSeviceRoute;

    client.registerMethod("jsonMethod", route + "subgrupo/9", "GET");
    client.registerMethod("login", route + "j_login_rest", "POST");
    client.registerMethod("logout", route + "j_logout_rest", "GET");
      
  
    return client;
  }
};