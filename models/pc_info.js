var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pcSchema = new Schema({
    pc_id:{type:String},
    pc_info: {type:Object}
});

mongoose.model('PC_Info', pcSchema);