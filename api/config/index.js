var env = process.env.NODE_ENV || 'development'
    console.log("envvvv:",env);
  var cfg = require('./config.'+env);

module.exports = cfg;