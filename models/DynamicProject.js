var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DynamicProjectSchema = new Schema({
    name: {type: String},
    introduce: {type: String},
    address: {type: String}
});

mongoose.model('DynamicProject', DynamicProjectSchema);

