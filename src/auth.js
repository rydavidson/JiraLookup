import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'

function authenticateUser (username, passhash, callback) {

  if(process.env.USERNAME === null || process.env.PASSWORD === null){
    //console.log("Empty username or password, returning");
    callback(jwt.sign({user: 'accela'}, process.env.SECRET || "secret"));
  }

  var hash1 = crypto.createHash('sha256');

  //console.log("Trying to calculate env pass hash");
  hash1.update(process.env.PASSWORD.trim());
  var pass = hash1.digest('hex');
  //console.log("Env pass hash: " + pass);


    if(username === process.env.USERNAME){
      if(passhash === pass){
        callback(jwt.sign({user: 'accela'}, process.env.SECRET || "secret"))
      }
      else{
        callback(new Error("Incorrect username or password"));
        //console.log("Invalid password");
        //console.log("Expected: " + process.env.PASSWORD);
      }
    }
    else{
      callback(new Error("Incorrect username or password"));
      //console.log("Invalid username");
    }
  }

  export {authenticateUser};

