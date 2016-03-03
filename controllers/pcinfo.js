var eventproxy = require('eventproxy');
var pcinfo = require('../proxy').pc_info;
var moment = require('moment');

exports.getPCInfo = function(req, res, next){
    var pc_socket_id = req.query.id;
    pcinfo.getNamesByQuery({'pc_id':pc_socket_id},{},function(err, data){
        if(err){
            next(err);
        }
        res.send(data);
    });

};