
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('error-handler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');
  compression = require('compression'),
  request = require('request');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  //app.use(express.errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/**11
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('/push', routes.push);

// JSON API
app.get('/api/name', api.name);

app.get('/tweet', routes.tweet);

app.post('/imgupdate', routes.imgupdate);

// redirect all others to the index (HTML5 history)
app.get('*', routes.push);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Amelia Earbot is chilling on port: ' + app.get('port'));
});
