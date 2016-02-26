function execJS(){
    var jsCode = $('#jsCode').val();
    var socket = io('/admin');
    socket.emit('execJSServer',jsCode);

    //socket.on('exec', function (data) {
    //    console.log(data);
    //    var callbackData = eval(data);
    //    socket.emit('callbackExec', callbackData);
    //});
}