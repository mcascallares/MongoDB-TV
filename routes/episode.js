var Show = require('../models/show').Show;

exports.new = function(req, res) {
    Show.findById(req.body.show, function(err, show) {

        var season = req.body.season;
        var episode = req.body.episode;
        var path = req.files.video.path;

        show.addEpisode(season, episode, path, function(err, fileId) {
            if (err) throw err;
            res.send(fileId);
        });
    });
};