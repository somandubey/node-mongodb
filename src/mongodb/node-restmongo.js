/**
 * Created by Soman Dubey on 12/27/13.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set(path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

var routes = require('./route/routes');
routes.init(app).connect("localhost", "test").initRoutes();

http.createServer(app).listen(app.get('port'), function(){
    console.log('server listening on port ' + app.get('port'));
});

process.on('uncaughtException', function(err) {
    console.error(err);
    console.error(err.stack);
});
