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
    videoUrl = 'http://localhost:3000/episodes/raw/' + req.params.video; // TODO hardcoded URL
    res.render('episode/show', { videoUrl: videoUrl });
};


exports.get = function(req, res) {
    var filename = req.params.video;
    episode.load(filename, function(err, metadata, stream) {
        if (err) { next(err); }
        if (metadata && stream) {
            res.status(200);
            res.set({
                'Accept-Ranges': 'bytes',
                'Content-Type': 'video/mp4', // TODO hardcoded
                'Content-Length': metadata.length,
                'Etag': metadata.md5,
                'Last-Modified': metadata.uploadDate
            });
            stream.pipe(res);
        } else {
            res.status(404).send('Not found');
        }
    });
};