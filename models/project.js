var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    name: {type:String},
    introduce: {type: String},
    address: {type: String},
    type: {type:String},
    plugin_id:[{type:String}]
});


mongoose.model('Project', projectSchema);
