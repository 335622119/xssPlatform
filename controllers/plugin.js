var EventProxy = require('eventproxy');

var Plugin = require('../proxy').Plugin;

exports.index = function(req, res, next){
    that = this;
    var ep = new EventProxy();
    ep.all('testDb', function(testdb){
        res.render('pages/plugin',{
            changeItem: 'plugins',
            name: testdb
        });
    });
    Plugin.testDb(1, function (name){
        ep.emit('testDb', name);
    });

};

exports.addPlugin = function (req, res, next){
    Plugin.addPlugin(req.body.pluginName, req.body.pluginIntro, req.body.pluginCode, function (err,plugin){
        res.send('success');
    });

};