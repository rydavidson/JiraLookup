const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const db = require('../lib/mongolib.js');
const logger = require('../lib/logger.js');
require('./role.js').getModel();
require('./scope.js').getModel();

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    roles: [{type: ObjectId, ref: "role"}],
    refreshToken: {type: String, required: false}
});

function getSchema() {
    return userSchema;
}

function getModel() {
    return mongoose.model('user', getSchema());
}

function getUser(username, callback) {
    if (!db.connected) {
        db.connect().then(
            () => {
                db.connected = true;
                getUser(username, callback);
            },
            err => {
                logger.error(err);
                callback(err);
            }
        ).catch(
            (err) => {
                logger.error(err);
                callback(err);
            }
        )
    } else {
        let userModel = getModel();

        logger.debug("Finding user: " + username);

        userModel.findOne({username: username})
            .populate({
                path: 'roles',
                select: '-_id',
                populate: {
                    path: 'scopes',
                    select: '-_id',
                    populate: {
                        path: 'inheritedScopes',
                        select: '-_id'
                    }
                }
            }).exec((err, user) => {
                if(!err){
                    callback(user);
                } else {
                    logger.error(err);
                    callback(err);
                }
        });
    }
}

module.exports.userSchema = userSchema;
module.exports.getUser = getUser;
