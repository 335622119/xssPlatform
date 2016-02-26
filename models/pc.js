var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pcSchema = new Schema({
    name:{type:String},
    project_name: {type:String},
    create_time: {type: Date,default: Date.now},
    update_time: {type: Date,default: Date.now}
});

mongoose.model('PC', pcSchema);