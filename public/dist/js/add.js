$('#addProjectDiv').on('hide.bs.modal',function(){
    location.reload();
});

$('#addPluginDiv').on('hide.bs.modal',function(){
    location.reload();
});


function addPlugin(url){
    var trans_data = encodeURIComponent(mainEditor.doc.getValue());
    $.post(url, $("#addPluginForm").serialize()+trans_data, function(res){
        if (res.status == 'success'){
            alert('success!');
        }else {
            alert(res.msg);
        }
    });
}

function addProject(url){
    if($('#projectNameDiv').attr('class') != 'form-group has-success'){
        alert('请注意红色提示!');
        return;
    }
    $.post(url, $("#addProjectForm").serialize(), function(res){
        if (res.status == 'success'){
            alert('success!');
        }else {
            alert(res.msg);
        }
    });
}

function verifyName(name){
    if ($('#' + name + 'Name').val() == '') {
        $('#' + name + 'NameDiv').removeClass("has-error");
        $("#" + name + "NameDiv").removeClass("has-success");
        $("#" + name + "Alert").html("");
        return;
    }
    $.get('/verifyName?name='+$('#'+name+'Name').val(),function(res){
        if(res == 'success') {
            $('#'+name+'NameDiv').removeClass("has-error");
            $('#'+name+'NameDiv').addClass('has-success');
            $('#'+name+'title').css('color', 'black');
            $('#'+name+'Alert').html("恭喜可以使用此名称!");
        }else{
            $('#'+name+'NameDiv').removeClass("has-success");
            $('#'+name+'NameDiv').addClass('has-error');
            $('#'+name+'title').css('color', 'black');
            $('#'+name+'Alert').html("对不起,名称已重复!");
        }
    });
}
