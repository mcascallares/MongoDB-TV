var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    sitemap = require('./sitemap'),
    config = require('./config');


console.log('Connecting to MongoDB');
mongoose.connect(config.mongo.uri, {replSet: {socketOptions: {socketTimeoutMS: 200000}}});

console.log('Initializing Express App');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
    secret: config.cookieSecret,
    maxAge: new Date(Date.now() + 3600000)
}));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

sitemap.addRoutes(app);

http.createServer(app).listen(config.port, function(){
  console.log('Express server listening on port ' + config.port);
});
