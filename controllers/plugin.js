var eventproxy = require('eventproxy');
var validator = require('validator');
var Plugin = require('../proxy').Plugin;

exports.index = function(req, res, next){
    that = this;
    var ep = new eventproxy();
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
    //req 进行验证
    var pluginName = validator.trim(req.body.pluginName);
    var pluginIntro = validator.trim(req.body.pluginIntro);
    //正确性验证
    var ep = new eventproxy();

    ep.fail(next);
    ep.on('prop_err', function (msg){
        res.send({status:'failed', msg: msg});
    });
    //开始验证
    if([pluginIntro, pluginName, req.body.pluginCode].some(function (item){return item === '';})){
        ep.emit('prop_err', '信息不完整!');
        return;
    }
    if(pluginName.length > 15){
        ep.emit('prop_err', '插件名称不能超过15个字符');
        return;
    }
    if(pluginIntro.length > 30){
        ep.emit('prop_err', '插件简介不能超过30个字符');
        return;
    }
    //验证数据的唯一性
    Plugin.getNamesByQuery({name: pluginName},{},function(err, plugins){
        if(err){
            return next(err);
        }
        if(plugins.length > 0){
            ep.emit('prop_err', '插件名称存在');
            return;
        }
    });
    //验证成功后
    (ep.done(function (){
        Plugin.addPlugin(pluginName, pluginIntro, req.body.pluginCode, function (err){
            if(err){
                return next(err);
            }
            res.send({status:'success'});
        });
    }))();





};