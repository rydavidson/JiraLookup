const mongoose = require('mongoose');
const config = require('../config/db.json');

let connected = false;

function connect() {
    return new Promise(function (resolve, reject) {
        mongoose.connect(getConnectionString()).then(
            () => {
                connected = true;
                console.log("Database connection established");
                resolve();
            },
            err => {
                reject(err);
            }
        )
    });
}

function getConnectionString() {

    let cfg = config.dev;

    if (process.env.NODE_ENV === 'production')
        cfg = config.prod;

    cfg.password = process.env.ATLAS_PASSWORD;

    let conn = `${cfg.prefix}${cfg.user}:${cfg.password}@${cfg.host}/${cfg.database}retryWrites=${cfg.retryWrites}`
    console.log(conn);
    return conn;
}

module.exports = {
    connect: connect(),
    getConnectionString: getConnectionString(),
    connected: connected
}

