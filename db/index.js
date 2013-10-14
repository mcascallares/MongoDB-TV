var mongoose = require('mongoose'),
    config = require('../config');


var conn = mongoose.createConnection(config.mongo.uri, {replSet: {socketOptions: {socketTimeoutMS: 200000}}});

conn.on('error', function (err) {
    console.log('Error! DB Connection failed.');
});

conn.once('open', function () {
    console.log('DB Connection open!');
});

module.exports.conn = conn;