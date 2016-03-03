var models = require('../models');
var PC_Info = models.PCInfo;

exports.addPC_Info = function (pc_id, pc_info, callback){
    var pcinfo = new PC_Info();
    pcinfo.pc_id = pc_id;
    pcinfo.pc_info = pc_info;

    pcinfo.save(callback);
};

exports.getNamesByQuery = function (query,opt,callback){
    PC_Info.find(query, '', opt, callback);
};
//
//exports.updatePC = function(query,data,opt,callback){
//    PC.update(query,{$set:data},opt).exec(callback);
//};