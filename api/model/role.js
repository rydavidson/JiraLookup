const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const roleSchema = new Schema({
    name: { type: String, required: true},
    scopes: [{type: ObjectId, ref: "scope"}]
});

exports.getModel = function(callback){
    callback(mongoose.model('role', roleSchema));
}

exports.getSchema = function(){
    return roleSchema;
}

exports.getScopes = function(roleObjectId){
    return new Promise(function(resolve, reject){
        
    })
}

exports.roleSchema = roleSchema;