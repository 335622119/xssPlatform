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
}

function verifyName(){
    if($('#projectName').val() == ''){
        $("#projectNameDiv").removeClass("has-error");
        $("#projectNameDiv").removeClass("has-success");
        $("#projectAlert").html("");
        return;
    }
    $.get('/verifyName?name='+$('#projectName').val(),function(res){
        if(res == 'success') {
            $("#projectNameDiv").removeClass("has-error");
            $('#projectNameDiv').addClass('has-success');
            $('#projectitle').css('color', 'black');
            $("#projectAlert").html("恭喜可以使用此名称!");
        }else{
            $("#projectNameDiv").removeClass("has-success");
            $('#projectNameDiv').addClass('has-error');
            $('#projectitle').css('color', 'black');
            $("#projectAlert").html("对不起,名称已重复!");
        }
    })
}
