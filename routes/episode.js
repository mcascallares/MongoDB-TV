var episode = require('../models/episode');

exports.new = function(req, res) {
    var path = req.files.episode.path;
    var filename = req.files.episode.name;

    episode.save(path, filename, {},
        function() {
            res.send('OK');
        },
        function() {
            res.send('ERROR');
        }
    );
};