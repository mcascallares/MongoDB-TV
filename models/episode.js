var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    fs = require('fs');

var chunkSize = 8 * 1024 * 1024; // 8 megs
var collection = 'episodes';


exports.save = function(path, filename, callback) {
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var fileId = mongoose.Types.ObjectId();
    var writestream = gfs.createWriteStream({
        _id: fileId,
        root: collection,
        filename: filename,
        chunkSize: chunkSize
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



exports.load = function(filename, callback) {
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var metadata = null;

    gfs.collection(collection).find({filename:filename}).toArray(function (err, files) {
        metadata = files[0];
        var options = {
            filename: filename,
            root: collection
        };
        var readstream = gfs.createReadStream(options);
        callback(metadata, readstream);
    })

};