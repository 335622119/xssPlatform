var config = require('../config');

var env = process.env.NODE_ENV || 'development'

var log4js = require('log4js');
log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'file', filename: 'logs/my.log', category: 'my'}
    ]
});

var logger = log4js.getLogger('my');
logger.setLevel(config.debug && env != 'test' ? 'DEBUG' : 'ERROR');

module.exports = logger;