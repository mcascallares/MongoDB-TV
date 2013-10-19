Show = require('../models/show').Show,
    _ = require('underscore');


exports.list = function(req, res) {
    Show.all('_id name', function(err, shows) {
        res.render('show/list', { shows: shows});
    });
};

exports.get = function(req, res) {
    var showId = req.params.show;
    Show.findById(showId, function(err, show) {
        if (err) { next(err); }
        show.episodes = _.sortBy(show.episodes, function(i) {
            return i.season + ',' + i.number;
        });
        res.render('show/main', { show: show});
    });
};