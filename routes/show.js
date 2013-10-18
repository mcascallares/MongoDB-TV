Show = require('../models/show').Show,
    _ = require('underscore');


exports.get = function(req, res) {
    var showId = req.params.show;
    Show.findById(showId, function(err, show) {
        if (err) { next(err); }
        show.episodes = _.sortBy(show.episodes, function(i) {
            return i.season + ',' + i.number;
        });
        console.log(show);
        res.render('show/main', { show: show});
    });
};