var Show = require('../models/show').Show,
    episode = require('../models/episode'),
    _ = require('underscore');


exports.create = function(req, res) {
    Show.findById(req.body.show, function(err, show) {
        var season = req.body.season;
        var episode = req.body.episode;
        var videoPath = req.files.video.path;
        var subtitlePath = req.files.subtitle.path;
        show.addEpisode(season, episode, videoPath, subtitlePath, function(show) {
            if (!err) {
                res.send(show);
            } else {
                res.send("Error")
            }
        });
    });
};


exports.show = function(req, res) {
    videoUrl = 'http://localhost:3000/episodes/raw/' + req.params.video;
    res.render('episode/show', { videoUrl: videoUrl });
};


exports.get = function(req, res) {
    var filename = req.params.video;
    var range = req.headers.range;
    console.log(range);
    episode.load(filename, function(metadata, stream) {
        if (!range) {
            console.log('---200---');
            res.status(200);
            res.set({'Content-Type': 'video/mp4'}); // TODO hardcoded?
            stream.pipe(res);
        } else {
            console.log('---206---');
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];

            var total = metadata.length;
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total - 1;
            var chunksize = (end - start) + 1;
            console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

            res.status(206);
            res.set({
                'Accept-Ranges': 'bytes',
                'Content-Type': 'video/mp4', // TODO hardcoded
                'Content-Length': chunksize,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                'Etag': metadata.md5,
                'Last-Modified': metadata.uploadDate
            });
            stream.pipe(res);
        }


        // TODO not found? 404?
    });
};