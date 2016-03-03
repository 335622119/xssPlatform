var socket = io('/admin');
socket.on('updatePC',function(data){
    //在主机页面的话 就刷新
    if(location.pathname == '/DynamicPC'){
        location.reload();
    }
});

$('#pcInfo').on('hide.bs.modal',function(){
   location.reload();
});

function updatePCInfo(pc_id){
    //callback $('#pcinfolist').append('<div>1.获取cookie信息</div><pre>zhjk:asdfsdf</pre>')
    $.get('/getPCInfo?id='+pc_id,function(data){
        for(var i=1;i<data.length+1;i++){
            var data_code = data[i-1].pc_info.data == ''?'空':data[i-1].pc_info.data;
            $('#pcinfolist').append('<div>'+i+'.'+data[i-1].pc_info.plugin_name+'</div><pre>'+data_code+'</pre>')
        }
    })
}