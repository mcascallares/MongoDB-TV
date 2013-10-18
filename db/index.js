var mongoose = require('mongoose'),
    config = require('../config');

if ('development' === config.env) {
    mongoose.set('debug', true);
}

var options = {
  db: { native_parser: true },
  server: { poolSize: 10 },
  replset: {}
};

options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };
mongoose.connect(config.mongo.uri, options);
