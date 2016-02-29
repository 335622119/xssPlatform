var models = require('../models');
var PC = models.PC;

exports.addPC = function (project_name,update_time, zombie_url,zombie_ua, status,socket_id, callback){
    var pc = new PC();
    pc.project_name = project_name;
    pc.update_time = update_time;
    pc.zombie_url = zombie_url;
    pc.zombie_ua = zombie_ua;
    pc.status = status;
    pc.socket_id = socket_id;

    pc.save(callback);
};

exports.getNamesByQuery = function (query,opt,callback){
    PC.find(query, '', opt, callback);
};

exports.updatePC = function(query,data,opt,callback){
    PC.update(query,{$set:data},opt).exec(callback);
};