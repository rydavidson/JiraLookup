const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const db = require('../lib/mongolib.js');

const userSchema = new Schema({
    username: { type: String, required: true},
    password: {type: String, required: true},
    roles: [{type: ObjectId, ref: "role"}]
});

function getSchema(){
    return userSchema;
}

function getModel(){
    return mongoose.model('user', getSchema());
}

function getUser(username, callback){
    if (!db.connected) {
        db.connect().then(
            () => {
                db.connected = true;
                getUser(username, callback);
                return;
            },
            err => {
                console.log(err);
            }
        )
    } else {
        let userModel = getModel();
        console.log("Finding user");
        userModel.findOne({ username: username})
        .populate({
            path: 'roles',
            populate: {
                path: 'scopes',
                populate: {
                    path: 'inheritedScopes'
                }
            }
        })
        .exec(function(err, user){
            if(!err){
                console.log("Got user");
                console.log(JSON.stringify(user));
                callback(user);
            } else {
                console.log(err);
                callback(err);
            }
        });
    }
}

module.exports.userSchema = userSchema;
module.exports.getUser = getUser;