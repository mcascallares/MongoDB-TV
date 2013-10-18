Show = require('../models/show').Show;


exports.get = function(req, res) {
    var showId = req.params.showId;
    Show.findById(showId, function(err, show) {
        if (err) { next(err); }
        res.render('show/main', {show:show});
    });
};