var home = require('../routes/home'),
    episode = require('../routes/episode');

exports.addRoutes = function(app, passport) {
    app.get('/', home.show);
    app.post('/episodes/new', episode.new)
};