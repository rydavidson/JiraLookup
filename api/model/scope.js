const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const scopeSchema = new Schema();

scopeSchema.add({
    id: { type: String, required: true },
    inheritedScopes: [{type: ObjectId, ref: "scope"}]
})

exports.getModel = function (callback) {
    return mongoose.model('scope', scopeSchema);
}

exports.getSchema = function () {
    return scopeSchema;
}

module.exports.scopeSchema = scopeSchema;