var config = require('./config'),
    db = require('./db'),
    sitemap = require('./sitemap')
    express = require('express'),
    http = require('http'),
    path = require('path');



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
if ('development' === config.env) {
    app.use(express.errorHandler());
}


sitemap.addRoutes(app);

http.createServer(app).listen(config.port, function(){
    console.log('Express server listening on port ' + config.port);
});