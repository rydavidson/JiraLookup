const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../lib/mongolib.js');
const role = require('./role.js');
const roleSchema = role.roleSchema;

const userSchema = new Schema({
    username: { type: String, required: true},
    password: {type: String, required: true},
    roles: [roleSchema]
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
                getUser(username, callback);
                return;
            },
            err => {
                console.log(err);
            }
        )
    } else {
        let userModel = getModel();

        userModel.findOne({ username: username}, function(err, user){
            if(!err){
                callback(user);
            } else {
                callback(err);
            }
        });
    }
}

module.exports= getUser();