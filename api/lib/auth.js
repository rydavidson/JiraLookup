const jwt = require('jsonwebtoken');
const constants = require('../config/enums.json');
const user = require('../model/user.js');
const crypto = require('crypto');
const logger = require('./logger.js');

exports.authenticateUser = function (username, hashedPassword, callback) {

  if(proccess.env.AUTH_MODE === "local"){
    authenticateUserLocal(username, password, callback);
  }

  user.getUser(username, function (userObj) {

    if (isErr(userObj)) {
      logger.error(userObj);
      callback(userObj);
      return;
    }
    try {
      logger.debug("Checking password");

      if (hashedPassword.toUpperCase() === userObj.password.toUpperCase()) {
        callback(jwt.sign({"user": username, "roles": userObj.roles}, process.env.SECRET, {expiresIn: 3600}));
      }
      else {
        logger.error(constants.credentialsIncorrect);
        callback(constants.credentialsIncorrect);
      }
    }
    catch (err) {
      logger.error(err);
      callback(constants.authError);
    }
  });
};

exports.authorizeUser = function (_jwt) {
  let secret = process.env.SECRET;
  try{
    return jwt.verify(_jwt, secret, {clockTolerance: 10}) !== null;
  } catch(err) {
    logger.error("JWT verification error: " + err);
    return false;
  }
};

exports.authenticateUserLocal = function (username, hashedPassword, callback) {

  const hasher = crypto.createHash('sha256');

  if (process.env.NODE_ENV === "development") {
    try {
      if (username === process.env.ACCELADEVUSER) {
        console.debug("Attempting password validation");
        if (hashedPassword === hasher.update(process.env.DEVPASSWORD).digest('hex')) {
          callback(jwt.sign({"user": username}, process.env.SECRET));
        }
        else {
          callback(constants.credentialsIncorrect);
        }
      }
      else {
        console.debug("username: " + username + " is incorrect, expected " + process.env.ACCELAUSER);
        callback(constants.credentialsIncorrect);
      }
    }
    catch (err) {
      callback(constants.authError);
    }
  } else {
    try {
      if (username === process.env.ACCELAUSER) {
        console.debug("Attempting password validation");
        if (hashedPassword === hasher.update(process.env.PASSWORD).digest('hex')) {
          callback(jwt.sign({"user": username}, process.env.SECRET));
        }
        else {
          callback(constants.credentialsIncorrect);
        }
      }
      else {
        console.debug("username: " + username + " is incorrect, expected " + process.env.ACCELAUSER);
        callback(constants.credentialsIncorrect);
      }
    }
    catch (err) {
      callback(constants.authError);
    }
  }
};


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
