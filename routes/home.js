var Show = require('../models/show').Show;

exports.show = function(req, res) {
    Show.listNames(function(err, shows) {
        if (err) return handleError(err);
        res.render('home/main', { shows: shows });
    });
};