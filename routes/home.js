var Show = require('../models/show').Show;


exports.show = function(req, res) {
    var latestEpisodesLimit = 5;
    Show.all('_id name', function(errShows, shows) {
        if (errShows) { next(errShows) };
        Show.latests(latestEpisodesLimit, function(errLatests, latests) {
            if (errLatests) { next(errLatests) };
            res.render('home/main', { shows: shows, latests: latests });
        })
    });
};