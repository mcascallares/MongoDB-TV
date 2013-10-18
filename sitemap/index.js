var config = require('../config'),
    show = require('../routes/show'),
    subtitle = require('../routes/subtitle'),
    home = require('../routes/home'),
    episode = require('../routes/episode');


exports.addRoutes = function(app) {
    app.get('/', home.show);
    app.get('/shows/:show', show.get);
    app.get('/episodes/:video', episode.get)
    app.post('/episodes/new', episode.create);
    app.get('/subtitles/search', subtitle.search)
};


exports.episodeUrl = function(video) {
    return config.baseUrl + '/episodes/' + video;
};


exports.showUrl = function(showId) {
    return config.baseUrl + '/shows/' + showId;
};