var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var testRoutes = require('./routes/test')

var app = express();

//for cookie session
var settings = require('./settings');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


if (process.env.SERVER_SOFTWARE == 'bae/3.0') {
  app.use(session({
    secret: settings.cookieSecret,
    key: 'hole',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
      host: settings.db_host,
      port: settings.db_port,
      username: settings.username,
      password: settings.password,
      auto_reconnect: true,
      db: settings.db_name
    })
  }));
}
else {
  app.use(session({
    secret: settings.cookieSecret,
    key: 'hole',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
      db: 'hole'
    })
  }));
}
app.use(flash());

app.use('/', routes);
app.use('/test', testRoutes);

/// catch 404 and forward to error handler
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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
