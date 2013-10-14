var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    fs = require('fs');

var collection = 'episodes';


exports.save = function(path, filename, callback) {
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var fileId = mongoose.Types.ObjectId();
    var writestream = gfs.createWriteStream({
        _id: fileId,
        root: collection,
        filename: filename
    });
    fs.createReadStream(path)
    .on('error', function() {
        callback(true);
    })
    .on('close', function() {
        callback(false, fileId);
    })
    .pipe(writestream);
};



exports.load = function(fileId, callback) {
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var readstream = gfs.createReadStream({
        _id: fileId,
        root: collection
    });
    callback(readstream);
};