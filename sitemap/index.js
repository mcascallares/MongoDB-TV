var subtitle = require('../routes/subtitle'),
    home = require('../routes/home'),
    episode = require('../routes/episode');

exports.addRoutes = function(app, passport) {
    app.get('/', home.show);
    app.post('/episodes/new', episode.create);
    app.get('/episodes/:video', episode.show)
    app.get('/episodes/raw/:video', episode.get)
    app.get('/subtitles/search', subtitle.search)
};