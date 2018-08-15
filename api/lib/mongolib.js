const mongoose = require('mongoose');
const config = require('../config/db.json');

var connected = false;

function getConnectionString(){

    let cfg = config.dev;

    if (process.env.NODE_ENV === 'production')
        cfg = config.prod;

    cfg.password = process.env.ATLAS_PASSWORD;

    let conn = `${cfg.prefix}${cfg.user}:${cfg.password}@${cfg.host}/${cfg.database}?retryWrites=${cfg.retryWrites}`
    console.log(conn);
    return conn;
}

exports.connect = function() {
    return new Promise(function (resolve, reject) {
        mongoose.connect(getConnectionString()).then(
            () => {
                console.log("Database connection established");
                resolve();
            },
            err => {
                console.log(err);
                reject(err);
            }
        )
    });
}
exports.connected = connected;

