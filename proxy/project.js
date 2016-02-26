var models = require('../models');
var Project = models.Project;

exports.addProject = function (name, introduce, type, plugin_id, callback){
    var project = new Project();
    project.name = name;
    project.introduce = introduce;
    project.type = type;
    project.plugin_id = plugin_id;

    project.save(callback);
};

exports.updateProject = function(conditions, update, opt, callback){
    Project.update(conditions,update,opt,callback);
};


exports.getNamesByQuery = function (query, opt, callback){
    Project.find(query, '', opt, callback);
};