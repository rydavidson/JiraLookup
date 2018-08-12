const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const scopeSchema = new Schema({
    id: { type: String, required: true},
    inheritedScopes: [scopeSchema]
})

function getModel(callback){
    callback(mongoose.model('scope', scopeSchema));
}

function getSchema(callback){
    callback(scopeSchema);
}


module.exports = {
    scopeSchema: scopeSchema,
    getSchema: getSchema,
    getModel: getModel
};