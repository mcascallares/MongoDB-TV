var config = require('../config'),
    about = require('../routes/about'),
    home = require('../routes/home'),
    show = require('../routes/show'),
    subtitle = require('../routes/subtitle'),
    episode = require('../routes/episode');


exports.addRoutes = function(app) {
    app.get('/', home.show);
    app.get('/about', about.show);
    app.get('/shows', show.list);
    app.get('/shows/:show', show.get);
    app.post('/episodes/new', episode.createValidator, episode.create);
    app.get('/episodes/:video', episode.show);
    app.get('/episodes/raw/:video', episode.get);
    app.get('/subtitles/search', subtitle.search);
};

exports.rootUrl = function() {
    return config.baseUrl;
};

exports.episodeUrl = function(video, seconds) {
    var ret = config.baseUrl + '/episodes/' + video;
    return seconds ? ret + '?s=' + seconds : ret;
};

exports.episodeRawUrl = function(video) {
    return config.baseUrl + '/episodes/raw/' + video;
};

exports.showUrl = function(showId) {
    return config.baseUrl + '/shows/' + showId;
};