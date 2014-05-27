var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var global = require('./global').getGlobal();;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'client/views'));
app.set('view engine', 'ejs');
app.engine('htm', require('ejs').renderFile);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'client/public')));
app.use(session({
	secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK',
	//store: sessionStore,
	cookie: {maxAge: global.getServer().session_expired}
}));

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
