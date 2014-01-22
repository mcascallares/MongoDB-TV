var Show = require('../models/show').Show,
    episode = require('../models/episode'),
    form = require("express-form"),
    _ = require('underscore');


exports.create = function(req, res) {
    var handleErrors = function(errors) {
        req.flash('errors', errors);
        res.redirect('/')
    };

    // validator does not work with file input :(
    var errors = [];
    var video = req.files.video, subtitle = req.files.subtitle;
    if (!video || video.name === '') { errors.push('You should specify a video'); };
    if (!subtitle || subtitle.name === '') { errors.push('You should specify a subtitle'); };

    if (errors.length == 0 && req.form.isValid) {
        Show.findById(req.body.show, function(err, show) {
            var season = req.body.season;
            var episode = req.body.episode;

            var videoPath = req.files.video.path;
            var subtitlePath = req.files.subtitle.path;
            show.addEpisode(season, episode, videoPath, subtitlePath, function(errAdd, show) {
                if (!errAdd) {
                    res.redirect('/');
                } else {
                    handleErrors(errAdd.message);
                }
            });
        });
    } else {
        handleErrors(errors.concat(req.form.errors));
    }
};


exports.createValidator = form(
    form.validate('show', 'Show').trim().required(),
    form.validate('season', 'Season').trim().required().isInt(),
    form.validate('episode', 'Episode').trim().required().isInt()
);


exports.show = function(req, res) {
    var filename = req.params.video;
    var secondsStr = req.query.s;
    episode.metadata(filename, function(err, file) {
        if (err) { next(err); }
        var ctx = {
            video:filename,
            type: file.metadata.contentType
        };
        if (secondsStr) {
            ctx["secondsToSeek"] = parseInt(secondsStr, 10);
        }
        res.render('episode/main', ctx);

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