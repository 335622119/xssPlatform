function addPlugin(url){
    $.post(url, $("#addPluginForm").serialize()+mainEditor.doc.getValue(), function(res){
        if (res == 'success'){
            alert('success!');
        }else {
            alert('failed');
        }
    });
}