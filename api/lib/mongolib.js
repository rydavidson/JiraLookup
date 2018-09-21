const mongoose = require('mongoose');
const config = require('../config/db.json');
const logger = require('./logger.js');

let connected = false;

function getConnectionString(){

    let cfg = config.dev;

    if (process.env.NODE_ENV === 'production')
        cfg = config.prod;

    cfg.password = process.env.ATLAS_PASSWORD;

    let conn = `${cfg.prefix}${cfg.user}:${cfg.password}@${cfg.host}/${cfg.database}?retryWrites=${cfg.retryWrites}`;
    logger.debug("Obtained connection string: " + conn);
    return conn;
}

exports.connect = function() {
    return new Promise(function (resolve, reject) {
        mongoose.connect(getConnectionString(),{ useNewUrlParser: true }).then(
            () => {
                mongoose.set('debug', true);
                logger.info("Database connection established");
                resolve();
            },
            err => {
                logger.error(err);
                reject(err);
            }
        )
    });
};
exports.connected = connected;

