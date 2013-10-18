var mongoose = require('mongoose'),
    config = require('../config');

if ('development' === config.env) {
    //mongoose.set('debug', true);
}

mongoose.connect(config.mongo.uri, {replSet: {socketOptions: {socketTimeoutMS: 200000}}});
