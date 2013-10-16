// default configuration file (development is default)
var config = module.exports = {};

config.env = 'development';
config.baseUrl = 'http://localhost:3000';
config.port = 3000;
config.cookieSecret = 'lsdkdslkjdsklsjfoee239-092fewjwefkmf';

//mongo database
config.mongo = {
    uri: 'mongodb://localhost/mongo-tv'
};