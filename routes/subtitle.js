 var Show = require('../models/show').Show,
    Subtitle = require('../models/subtitle').Subtitle,
    _ = require('underscore');


var toStrTime = function(totalMilliSeconds) {
    var totalSeconds = totalMilliSeconds / 1000;
    var hours = parseInt(totalSeconds / 3600, 10) % 24;
    var minutes = parseInt(totalSeconds / 60, 10) % 60;
    seconds = parseInt(totalSeconds % 60, 10);
    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
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

            var ret = { stats: textResults.stats, results: [] };
            for (var i = 0; i < textResults.results.length; i++) {
                var current = textResults.results[i];
                var s = showsByEpisode[current.obj.episode.toString()];
                if (s) {
                    var currentEpisode = _.find(s.episodes, function(i) {
                        return i._id.equals(current.obj.episode);
                    });
                    ret.results.push({
                        score: current.score,
                        text: current.obj.text,
                        strTime: toStrTime(current.obj.start),
                        seconds: parseInt(current.obj.start/1000),
                        show: s.name,
                        showId: s._id,
                        season: currentEpisode.season,
                        number: currentEpisode.number,
                        video: currentEpisode.video,
                    });
                }
            }

            console.log(ret);
            res.render('subtitle/result', ret);
        });
    });
};