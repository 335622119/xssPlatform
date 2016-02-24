var models = require('../models');
var DynamicProject = models.DynamicProject;

exports.addDynamicProject = function (name, introduce, address, callback){
    var dynamicProject = new DynamicProject();
    dynamicProject.name = name;
    dynamicProject.introduce = introduce;
    dynamicProject.address = address;

    dynamicProject.save(callback);
};

exports.getOneByDynamicProject = function(name, callback){
    DynamicProject.findOne({name: name}, callback);
};

exports.getNamesByDynamicQuery = function (query, opt, callback){
    DynamicProject.find(query, '', opt, callback);
};