
// Dependencies
// ======================================================
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var passport        = require('passport');
var expressSession  = require('express-session');
var routes          = require('./routes');
var api             = require('./routes/api');
var posts           = require('./routes/posts');
var comments        = require('./routes/comments');
var auth            = require('./routes/auth')(passport);
var authCtrl        = require('./controllers/passport')(passport);
var mongoose        = require('mongoose');
var flash           = require('connect-flash');
var http            = require('http');


// Initialize the server
// ======================================================
var app = express();


// Configure mongoose
// ======================================================
var config = require('./config/modulus');
mongoose.connect(config.url);


// View engine setup
app.locals.pretty = true;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


// Configure passort
// ======================================================
app.use(expressSession({
    secret: 'multipass'
    ,saveUninitialized: true
    ,resave: true
    ,cookie: {
        maxAge: 60*60*24
    }
}));
app.use(passport.initialize());
app.use(passport.session());


// Initialize passort
// ======================================================
//authCtrl(passport);


// Handle routes
// ======================================================
app.use('/', routes);
app.use('/api', api);
app.use('/posts', posts);
app.use('/comments', comments);
app.use('/auth', auth);


// Handle errors
// ======================================================
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});







//======================================================================
// Contents from bin/www
var debug = require('debug')('Reddit_Clone');
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});


var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

// Export the app
// ======================================================
module.exports = app;