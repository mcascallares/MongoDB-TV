var mongoose = require('mongoose'),
    config = require('../config');


var conn = mongoose.createConnection(config.mongo.uri, {replSet: {socketOptions: {socketTimeoutMS: 200000}}});

conn.on('error', function (err) {
    console.log('Error! DB Connection failed.');
});

conn.once('open', function () {
    console.log('DB Connection open!');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports.conn = conn;