function execJS(){
    var jsCode = $('#jsCode').val();
    var pcID = $('#pcID').val();

    var socket = io('/admin');
    //pc 的id.
    var pc_data = {
        'jsCode': jsCode,
        'pcID': pcID
    };
    socket.emit('execJSServer',pc_data);

    //socket.on('exec', function (data) {
    //    console.log(data);
    //    var callbackData = eval(data);
    //    socket.emit('callbackExec', callbackData);
    //});
}