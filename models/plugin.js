var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PluginSchema = new Schema({
    name: {type: String},
    introduce: {type: String},
    code: {type: String}
});

mongoose.model('Plugin', PluginSchema);


