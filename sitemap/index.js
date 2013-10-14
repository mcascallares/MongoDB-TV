var home = require('../routes/home'),
    show = require('../routes/show');

exports.addRoutes = function(app, passport) {
    app.get('/', home.show);
};