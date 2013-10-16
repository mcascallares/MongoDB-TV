var config = require('../config'),
    subtitle = require('../routes/subtitle'),
    home = require('../routes/home'),
    episode = require('../routes/episode');

exports.addRoutes = function(app) {
    app.get('/', home.show);
    app.post('/episodes/new', episode.create);
    app.get('/episodes/raw/:video', episode.get)
    app.get('/subtitles/search', subtitle.search)
};

exports.episodeUrl = function(video) {
    return config.baseUrl + '/episodes/' + video;
};

exports.episodeRawUrl = function(video) {
    return config.baseUrl + '/episodes/raw/' + video;
};