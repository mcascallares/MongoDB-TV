 var Show = require('../models/show').Show,
    Subtitle = require('../models/subtitle').Subtitle,
    _ = require('underscore');


var toStrTime = function(timestamp) {
    var date = new Date(timestamp);
    var h = date.getUTCHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
};


exports.search = function(req, res) {
    Subtitle.search(req.query.q, function(err, textResults) {
        if (err) { next(err); }

        var episodeIds = _.map(textResults.results, function(r) {
            return r.obj.episode.toString();
        });
        var episodeIds = _.uniq(episodeIds);

        Show.findByEpisodes(episodeIds, function(err, shows) {
            var showsByEpisode = {}; //cache scheme episodeId -> showObject
            for (var i = 0; i < shows.length; i++) {
                var currentShow = shows[i];
                for (var j = 0; j < currentShow.episodes.length; j++) {
                    var currentEpisode = currentShow.episodes[j];
                    showsByEpisode[currentEpisode._id.toString()] = currentShow;
                }
            }

            console.log('----- cache --------');
            console.log(showsByEpisode);

            var ret = { stats: textResults.stats, results: [] };
            for (var i = 0; i < textResults.results.length; i++) {
                var current = textResults.results[i];
                var s = showsByEpisode[current.obj.episode.toString()];
                ret.results.push({
                    score: current.score,
                    text: current.obj.text,
                    time: toStrTime(current.obj.start),
                    show: s.name,
                    showId: s._id,
                    season: s.episodes[0].season,
                    number: s.episodes[0].number,
                    video: s.episodes[0].video,
                });
            }
            res.render('subtitle/result', ret);
        });
    });
};