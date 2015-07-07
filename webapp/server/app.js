#!/usr/bin/env node

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var expressWinston = require('express-winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var busboy = require('connect-busboy');
var global = require('./global').getGlobal();
var FileUtil = require('./common/file_util');
var logger = require('./common/logger_util').getLogger();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'client/views'));
app.set('view engine', 'ejs');
app.engine('htm', require('ejs').renderFile);

app.use(favicon());
app.use(expressWinston.logger(logger.expressLogger()));
app.use(expressWinston.errorLogger(logger.expressLogger()));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'client/public')));
app.use(session({
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK',
  //store: sessionStore,
  cookie: {maxAge: global.getServer().session_expired}
}));
//app.use(bodyParser({uploadDir: global.getServer().upload_path, keepExtensions: true }));
app.use(busboy());
FileUtil.mkdir(global.getServer().upload_path);
var image_upload_path = path.join(__dirname, '..', 'client/public/'+global.getServer().image_upload_path);
FileUtil.mkdir(image_upload_path);
global.getServer().image_upload_path = image_upload_path;

// routes
var Routes = require('./action/routes');
var routes = new Routes(app);
routes.create();

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.htm', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.htm', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
