var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../common/logger');

mongoose.connect(config.db, {
    server: {poolSize: 20}
}, function(err){
    if(err){
        logger.error('connect to $s error: ', config.db, err.message);
        process.exit(1);
    }
});

//models
require('./plugin');
require('./project');
require('./pc');
require('./pc_info');

exports.Plugin = mongoose.model('Plugin');
exports.Project = mongoose.model('Project');
exports.PC = mongoose.model('PC');
exports.PCInfo = mongoose.model('PC_Info');
