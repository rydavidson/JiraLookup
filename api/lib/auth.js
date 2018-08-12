const jwt = require('jsonwebtoken');
const constants = require('../config/enums.json');
const user = require('../model/user.js');
const scope = require('../model/scope.js');

exports.authenticateUser = function(username, hashedPassword, callback){

    const hasher = crypto.createHash('sha256');

    user.getUser(username, function(userObj){

        if(isErr(userObj)){
            callback(userObj);
            return;
        }
        if(process.env.NODE_ENV === "development"){
            try{
                if(username === process.env.ACCELADEVUSER){
                    console.debug("Attempting password validation");
                    if(hashedPassword === hasher.update(process.env.DEVPASSWORD).digest('hex')){
                        callback(jwt.sign({"user": username}, process.env.SECRET));
                    }
                    else{
                        callback(constants.credentialsIncorrect);
                    }
                }
                else{
                    console.debug("username: " + username + " is incorrect, expected " + process.env.ACCELAUSER)
                    callback(constants.credentialsIncorrect);
                }
            }
            catch(err){
                callback(constants.authError);
            }
        } else {
            try{
                if(userObj.username === process.env.ACCELAUSER){
                    console.debug("Attempting password validation");
                    if(hashedPassword === hasher.update(process.env.PASSWORD).digest('hex')){
                        callback(jwt.sign({"user": username}, process.env.SECRET));
                    }
                    else{
                        callback(constants.credentialsIncorrect);
                    }
                }
                else{
                    console.debug("username: " + username + " is incorrect, expected " + process.env.ACCELAUSER)
                    callback(constants.credentialsIncorrect);
                }
            }
            catch(err){
                callback(constants.authError);
            }
        }
    })


}

exports.authenticateUserLocal = function(username, hashedPassword, callback){

    const hasher = crypto.createHash('sha256');

    if(process.env.NODE_ENV === "development"){
        try{
            if(username === process.env.ACCELADEVUSER){
                console.debug("Attempting password validation");
                if(hashedPassword === hasher.update(process.env.DEVPASSWORD).digest('hex')){
                    callback(jwt.sign({"user": username}, process.env.SECRET));
                }
                else{
                    callback(constants.credentialsIncorrect);
                }
            }
            else{
                console.debug("username: " + username + " is incorrect, expected " + process.env.ACCELAUSER)
                callback(constants.credentialsIncorrect);
            }
        }
        catch(err){
            callback(constants.authError);
        }
    } else {
        try{
            if(username === process.env.ACCELAUSER){
                console.debug("Attempting password validation");
                if(hashedPassword === hasher.update(process.env.PASSWORD).digest('hex')){
                    callback(jwt.sign({"user": username}, process.env.SECRET));
                }
                else{
                    callback(constants.credentialsIncorrect);
                }
            }
            else{
                console.debug("username: " + username + " is incorrect, expected " + process.env.ACCELAUSER)
                callback(constants.credentialsIncorrect);
            }
        }
        catch(err){
            callback(constants.authError);
        }
    }
}


function isErr(err) {

    if (err == null) {
        return false;
    }
    if (err instanceof Error) {
        return true;
    }
    if (typeof err.type !== undefined) {
        if (err.type === "error") {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
