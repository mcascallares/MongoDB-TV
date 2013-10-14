var Show = require('../models/show').Show,
    episode = require('../models/episode');


exports.new = function(req, res) {
    Show.findById(req.body.show, function(err, show) {
        var season = req.body.season;
        var episode = req.body.episode;
        var path = req.files.video.path;
        show.addEpisode(season, episode, path, function(err, fileId) {
            if (!err) {
                res.send(fileId);
            } else {
                res.send("Error")
            }
        });
    });
};


exports.get = function(req, res) {
    var id = req.params.id;
    episode.load(id, function(stream) {
        stream.pipe(res);
    });
};