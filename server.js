var config = require('./config'),
    db = require('./db'),
    express = require('express'),
    flash = require('express-flash'),
    http = require('http'),
    path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.limit('1024mb'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookieSecret));
app.use(express.session({
    secret: config.cookieSecret,
    maxAge: new Date(Date.now() + 3600000)
}));
app.use(flash());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === config.env) {
    app.use(express.errorHandler());
}

var db = db.mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('Database connection pool stablished!');

    // map URLs
    var sitemap = require('./sitemap');
    sitemap.addRoutes(app);

    // wire url generator in templates
    app.locals.rootUrl = sitemap.rootUrl;
    app.locals.showUrl = sitemap.showUrl;
    app.locals.episodeUrl = sitemap.episodeUrl;
    app.locals.episodeRawUrl = sitemap.episodeRawUrl;

    // start the server
    http.createServer(app).listen(config.port, function(){
        console.log('MongoDB-TV server listening on port ' + config.port);
    });
});

