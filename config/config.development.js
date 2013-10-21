// default configuration file (development is default)
var config = module.exports = {};

config.env = 'development';
config.baseUrl = 'http://localhost:3000';
config.port = 3000;
config.cookieSecret = 'lsdkdslkjdsklsjfoee239-092fewjwefkmf';

//mongo database
config.mongo = {
    uri: 'mongodb://127.0.0.1/mongodb-tv',
    options: {
        db: { native_parser: true },
        server: {
            poolSize: 32,
            socketOptions: { keepAlive: 1}
        },

        replset: {
          socketOptions: { keepAlive: 1}
        }
    }
};