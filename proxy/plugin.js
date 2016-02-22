var models = require('../models');
var Plugin = models.Plugin;
//var doc = {
//    age: 1,
//    name: 'zhjk'
//};
//
//Plugin.create(doc, function(error){console.log(error);});

exports.testDb = function (age, callback){
    name1='';
    Plugin.find({name: 'zhjk'}, function(err, res){
        callback(res[0].name);
    });
    return name1;
};

exports.addPlugin = function (name, introduce, code, callback){
    var plugin = new Plugin();
    plugin.name = name;
    plugin.introduce = introduce;
    plugin.code = code;

    plugin.save(callback);
};