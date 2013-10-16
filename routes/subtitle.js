var Subtitle = require('../models/subtitle').Subtitle;

exports.search = function(req, res) {
    var q = req.query.q;
    Subtitle.search(q, function(err, result) {
        if (err) { next(err); }
        res.render('subtitle/result', { result: result})
    })
};