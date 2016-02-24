function addPlugin(url){
    $.post(url, $("#addPluginForm").serialize()+mainEditor.doc.getValue(), function(res){
        if (res.status == 'success'){
            alert('success!');
        }else {
            alert(res.msg);
        }
    });
}

function addProject(url){
    $.post(url, $("#addProjectForm").serialize(), function(res){
        if (res.status == 'success'){
            alert('success!');
        }else {
            alert(res.msg);
        }
    });
};
