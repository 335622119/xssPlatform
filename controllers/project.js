var eventproxy = require('eventproxy');
var Project = require('../proxy').project;
var validator = require('validator');

exports.DynamicIndex = function(req, res, next){
    var ep = new eventproxy();
    ep.fail(next);
    //show plugin
    //[{name:,age:,gejk},{},{}]
    (ep.done(function (){
        Project.getNamesByDynamicQuery({},{},function(err, data){
            if(err){
                return next(err);
            }
            //show webviews
            console.log(data);
            res.render('pages/project',{
                changeItem: 'project,DynamicProject',
                projectList: data
            });
        });
    }))();

};

exports.addDynamicProject = function(req, res, next){
    //req 进行验证
    var projectName = validator.trim(req.body.projectName);
    var projectIntro = validator.trim(req.body.projectIntro);
    //正确性验证
    var ep = new eventproxy();

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
    //验证数据的唯一性
    Project.getNamesByDynamicQuery({name: projectName},{},function(err, projects){
        console.log(err);
        if(err){
            return next(err);
        }
        if(projects.length > 0){
            ep.emit('prop_err', '插件名称存在');
            return;
        }else{
            Project.addDynamicProject(projectName, projectIntro, function (err){
                if(err){
                    return next(err);
                }
                res.send({status:'success'});
            });
        }
    });
};

exports.StaticIndex = function(req, res, next){
  res.render('pages/project',{
      changeItem: 'project,StaticProject'
  })
};