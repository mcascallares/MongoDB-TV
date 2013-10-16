var Subtitle = require('../models/subtitle').Subtitle;

exports.search = function(req, res) {
    var q = req.query.q;
    Subtitle.search(q, function(err, ret) {
        if (err) { next(err); }
        res.render('subtitle/result', {
            results: ret.results,
            stats: ret.stats
        })
    })
};