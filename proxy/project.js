var models = require('../models');
var DynamicProject = models.DynamicProject;

exports.addDynamicProject = function (name, introduce, callback){
    var dynamicProject = new DynamicProject();
    dynamicProject.name = name;
    dynamicProject.introduce = introduce;

    dynamicProject.save(callback);
};

exports.getNamesByDynamicQuery = function (query, opt, callback){
    DynamicProject.find(query, '', opt, callback);
};