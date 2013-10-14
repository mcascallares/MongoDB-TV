var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    fs = require('fs');

var collection = 'episodes';

exports.save = function(path, filename, metadata, onEnd, onError) {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
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