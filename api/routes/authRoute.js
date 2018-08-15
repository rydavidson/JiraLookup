    const express = require("express");
    const auth = require('../lib/auth.js');
    const config = require('./configs/authRoute.json');
    const constants = require('../config/enums.json');
    const authRouter = new express.Router();

    let jwtArray = [];

    // authRouter.use(function (req, res, next) {

    //     if (req.method === 'OPTIONS') {
    //         console.log('OPTIONS request');
    //         let headers = {};
    //         headers["Access-Control-Allow-Origin"] = req.get("Origin");
    //         headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    //         headers["Access-Control-Allow-Credentials"] = false;
    //         headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    //         headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization";
    //         res.writeHead(200, headers);
    //         res.end();
    //     }
    //     else {

    //         console.log(req.method + " request");
    //         res.set("Access-Control-Allow-Origin", req.get("Origin"));
    //         res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    //         res.set("Access-Control-Allow-Credentials", false);
    //         if (jwtArray.length === 0) {
    //             res.sendStatus(403);
    //         } else if (!req.get("Authorization")) {
    //             res.sendStatus(403);
    //         } else {
    //             let token = req.get("Authorization");
    //             let authenticated = function (e) {
    //                 return e.ip === req.connection.remoteAddress && e.token === token;
    //             }
    //             if (jwtArray.some(authenticated)) {
    //                 next();
    //             } else {
    //                 res.sendStatus(401);
    //             }
    //         }
    //     }

    // });

    authRouter.post("/",function (req, res) {
        let username = req.body.username;
        let hashedPassword = req.body.password;

        res.set("Access-Control-Allow-Origin", req.get("Origin"));

        try {
            auth.authenticateUser(username, hashedPassword, function (jwt) {
                if(jwt instanceof Error){
                    res.status(500).json(jwt);
                    return;
                }
                if (jwt === constants.credentialsIncorrect) {
                    res.status(jwt.httpCode).json(jwt.message);
                } else if (jwt === constants.authError) {
                    res.status(jwt.httpCode).json(jwt.message);
                } else {
                    try {
                        jwtArray.push({
                            ip: req.connection.remoteAddress,
                            token: jwt
                        });
                        jwtArray.forEach(function (e) {
                            console.log(JSON.stringify(e));
                        })
                        res.json(jwt);
                    }
                    catch (err) {
                        res.status(500).json(jwt);
                    }
                }
            })
        }
        catch (err) {
            console.error(err);
            res.status(constants.genericError.httpCode).json(constants.genericError.message);
        }
    });

module.exports = authRouter;