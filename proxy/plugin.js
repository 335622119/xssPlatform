var models = require('../models');
var Plugin = models.Plugin;

exports.addPlugin = function (name, introduce, code, callback){
    var plugin = new Plugin();
    plugin.name = name;
    plugin.introduce = introduce;
    plugin.code = code;

    plugin.save(callback);
};

exports.getNamesByQuery = function (query,opt,callback){
    Plugin.find(query, '', opt, callback);
};
