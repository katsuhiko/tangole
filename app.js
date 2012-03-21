
/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('config') 
  , fs = require('fs')
  , middleware = require('./middleware');

require('./db-connect');

// Bootstrap models
var modelsPath = __dirname + '/app/models';
var modelFiles = fs.readdirSync(modelsPath);
modelFiles.forEach(function(file) {
  require(modelsPath + '/' + file);
});

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.enable('jsonp callback');
  // not use view.
  //app.set('views', __dirname + '/app/views');
  //app.set('view engine', 'ejs');
  // not use POST.
  //app.use(express.bodyParser());
  //app.use(express.methodOverride());
  app.use(middleware.getMethodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.session.secret
  }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Bootstrap controllers
var controllersPath = __dirname + '/app/controllers';
var controllerFiles = fs.readdirSync(controllersPath);
controllerFiles.forEach(function(file) {
  require(controllersPath + '/' + file)(app);
});

// 404
app.get('*', function(req, res){
  res.send(404);
});

app.listen(config.www.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
