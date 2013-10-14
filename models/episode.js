var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    fs = require('fs'),
    conn = require('../db').conn;

var collection = 'episodes';

exports.save = function(path, filename, metadata, onEnd, onError) {
    gfs = Grid(conn.db, mongoose.mongo);
    var writestream = gfs.createWriteStream({
        root: collection,
        filename: filename,
        metadata: metadata
    });
    fs.createReadStream(path)
    .on('end', function() {
        onEnd();
    })
    .on('error', function() {
        onError();
    })
    .pipe(writestream);
};