var Show = require('../models/show').Show,
    episode = require('../models/episode'),
    form = require("express-form"),
    _ = require('underscore');


exports.create = function(req, res) {
    if (req.form.isValid) {
        Show.findById(req.body.show, function(err, show) {
            var season = req.body.season;
            var episode = req.body.episode;
            var videoPath = req.files.video.path;
            var subtitlePath = req.files.subtitle.path;
            show.addEpisode(season, episode, videoPath, subtitlePath, function(show) {
                if (!err) {
                    res.redirect('/');
                } else {
                    res.send(err);
                }
            });
        });
    } else {
        req.flash('errors', req.form.errors);
        res.redirect('/')
    }
};


exports.createValidator = form(
    form.filter('season').trim().required(),
    form.filter('episode').trim().required(),
    form.filter('video').required(),
    form.filter('subtitle').required()
);


exports.show = function(req, res) {
    var filename = req.params.video;
    var seconds = req.query.s;
    episode.metadata(filename, function(err, file) {
        if (err) { next(err); }
        res.render('episode/main', { video:filename, type: file.metadata.contentType , seconds: seconds});
    });

};


exports.get = function(req, res) {
    var filename = req.params.video;
    episode.load(filename, function(err, metadata, stream) {
        if (err) { next(err); }
        if (metadata && stream) {
            res.status(200);
            res.set({
                'Accept-Ranges': 'bytes',
                'Content-Type': metadata.metadata.contentType,
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