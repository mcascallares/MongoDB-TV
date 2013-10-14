var env = process.env.NODE_ENV || 'development',
    cfg = require('./config.' + env);

module.exports = cfg;