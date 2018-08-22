const express = require("express");
const auth = require('../lib/auth.js');
const config = require('./configs/authRoute.json');
const constants = require('../config/enums.json');
const authRouter = new express.Router();
const logger = require('../lib/logger.js');

let jwtArray = [];

authRouter.use(function (req, res, next) {


next();
});

authRouter.post("/", function (req, res) {
    let username = req.body.username;
    let hashedPassword = req.body.password;

    res.set("Access-Control-Allow-Origin", req.get("Origin"));

    try {
        auth.authenticateUser(username, hashedPassword, function (jwt) {
            if (jwt instanceof Error) {
                res.status(500).json(jwt);
                return;
            }
            if (jwt === constants.credentialsIncorrect) {
                res.status(jwt.httpCode).json(jwt.message);
            } else if (jwt === constants.authError) {
                res.status(jwt.httpCode).json(jwt.message);
            } else {
                res.json(jwt);
            }
        })
    }
    catch (err) {
        logger.error(err);
        res.status(constants.genericError.httpCode).json(constants.genericError.message);
    }
});

authRouter.get("/callback", function(req,res){

})

module.exports = authRouter;
