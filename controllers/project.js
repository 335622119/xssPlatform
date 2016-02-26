var eventproxy = require('eventproxy');
var Project = require('../proxy').project;
var Plugin = require('../proxy').Plugin;
var validator = require('validator');
var config = require('../config');

exports.DynamicIndex = function(req, res, next){
    var ep = new eventproxy();
    ep.all('project','plugin',function(project, plugin){
        res.render('pages/project',{
            changeItem: 'project,DynamicProject',
            projectList: project,
            pluginList: plugin
        });
    });
    ep.fail(next);
    //show project
    //[{name:,age:,gejk},{},{}]
    Project.getNamesByQuery({type:'Dynamic'},{},function(err, data){
        if(err){
            return next(err);
        }
        //show webviews
        ep.emit('project', data);
    });
    //get plugin
    Plugin.getNamesByQuery({},{},function(err, data){
        if(err){
            return next(err);
        }
        ep.emit('plugin',data);
    });

};

exports.addDynamicProject = function(req, res, next){
    //req 进行验证
    var projectName = validator.trim(req.body.projectName);
    var projectIntro = validator.trim(req.body.projectIntro);
    //正确性验证
    var ep = new eventproxy();
    ep.all('onlyname',function(){
        Project.addProject(projectName, projectIntro, 'Dynamic', function (err){
            if(err){
                return next(err);
            }
            res.send({status:'success'});
        });
    });
    
    ep.fail(next);
    ep.on('prop_err', function (msg){
        res.send({status:'failed', msg: msg});
    });
    //开始验证
    if([projectIntro, projectName].some(function (item){return item === '';})){
        ep.emit('prop_err', '信息不完整!');
        return;
    }
    if(projectName.length > 15){
        ep.emit('prop_err', '项目名称不能超过15个字符');
        return;
    }
    if(projectIntro.length > 30){
        ep.emit('prop_err', '项目简介不能超过30个字符');
        return;
    }

    Project.getNamesByQuery({name: projectName,type:'Dynamic'},{},function(err, projects){
        if(err){
            return next(err);
        }
        if(projects.length > 0){
            ep.emit('prop_err','项目名称重复');
            return;
        }else{
            ep.emit('onlyname');
        }
    });
    //生成地址
};

exports.verifyName = function(req,res,next){
    //验证数据的唯一性

    var projectName = validator.trim(req.query.name);
    Project.getNamesByQuery({name: projectName, type: 'Dynamic'},{},function(err, projects){
        if(err){
            return next(err);
        }
        if(projects.length > 0){
            res.send('failed');
            return;
        }
        res.send('success');
    });
};

exports.StaticIndex = function(req, res, next){
  res.render('pages/project',{
      changeItem: 'project,StaticProject'
  })
};