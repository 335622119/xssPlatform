var eventproxy = require('eventproxy');
var pc = require('../proxy').pc;
var moment = require('moment');

exports.DynamicPCIndex = function(req, res, next){
    pc.getNamesByQuery({},{},function(err, data){
        if(err){
            next(err);
        }
        res.render('pages/PC', {
            title: 'Express',
            pcList: data,
            changeItem: 'PC,DynamicPC'
        });
    });

};