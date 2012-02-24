
/**
 * Module dependencies.
 */

var express = require('express')
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
  app.use(express.session({ secret: '####secret####' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
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

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
