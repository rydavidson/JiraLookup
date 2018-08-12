const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const scope = require('./scope.js');
const scopeSchema = scope.scopeSchema;

const roleSchema = new Schema({
    name: { type: String, required: true},
    scopes: [scopeSchema]
});

function getModel(callback){
    callback(mongoose.model('role', roleSchema));
}

function getSchema(callback){
    callback(roleSchema);
}

module.exports=roleSchema;