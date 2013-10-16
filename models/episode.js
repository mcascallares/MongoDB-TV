var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    fs = require('fs');

var chunkSize = 8 * 1024 * 1024; // 8 megs
var collection = 'episodes';


exports.save = function(path, filename, callback) {
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var writestream = gfs.createWriteStream({
        root: collection,
        filename: filename,
        chunkSize: chunkSize
    });
    fs.createReadStream(path)
    .on('error', function() {
        throw new Error('An error occured when saving the file to GridFS');
    })
    .on('close', function() {
        callback();
    })
    .pipe(writestream);
};



exports.load = function(filename, callback) {
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection(collection).find({filename:filename}).toArray(function (err, files) {
        if (err) {
            console.log(err);
            callback(new Error('An error occurred when retrieving video from MongoDB'));
        }

        if (files && files.length > 0) {
            var metadata = files[0];
            var options = {
                filename: filename,
                root: collection
            };
            var readstream = gfs.createReadStream(options);
            callback(null, metadata, readstream);
        } else {
            callback(null, null, null);
        }
    })

};