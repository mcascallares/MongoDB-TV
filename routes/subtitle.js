var Subtitle = require('../models/subtitle').Subtitle,
    sitemap = require('../sitemap'),
    _ = require('underscore');


var toStrTime = function(timestamp) {
    var date = new Date(timestamp);
    var h = date.getUTCHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
};

exports.search = function(req, res) {
    var q = req.query.q;
    Subtitle.search(q, function(err, ret) {
        if (err) { next(err); }

        console.log(ret);
        res.render('subtitle/result', {
            results: _.map(ret.results, function(r) {
                return {
                    score: r.score,
                    show: r.obj.show,
                    season: r.obj.season,
                    number: r.obj.number,
                    time: toStrTime(r.obj.start),
                    text: r.obj.text,
                    link: sitemap.episodeRawUrl(r.obj.video)
                }
            }),
            stats: ret.stats
        })
    })
};