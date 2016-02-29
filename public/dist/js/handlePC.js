var socket = io('/admin');
socket.on('updatePC',function(data){
    //data {}
    if(data.name == undefined){
        console.log('error!');
    }else{
        updateTable();
    }
});

function appendTable(){
    //
}


    //$('#example1 tbody tr').remove();
    //var test = "<tr><td>Trident</td><td>0</td><td>I.0</td><td>Win 95+</td><td> 4</td><td>X</td></tr>";
    //$('#pc_table tbody tr:last').after(test);
    //$('#example1 tbody').append(test)

function updateTable(){
    //如果没有了 刷新页面 如果有 也是remove 再append.

}

//新增一行
//var test = "<tr><td>Trident</td><td>0</td><td>I.0</td><td>Win 95+</td><td> 4</td><td>X</td></tr>";
//$('#pc_table tbody tr:last').after(test);