const winston = require('winston');
const logzioWinstonTransport = require('winston-logzio');

const winstonFactory = ({token}) => {
    const loggerOptions = {
        token: token,
        host: "listener.logz.io",
        type: "nodejs"
    };

    winston.add(logzioWinstonTransport, loggerOptions);

    return winston;
};

const logger = winstonFactory({token: process.env.LOGZIO_TOKEN})

exports.info = function (message) {
    logger.log('info', message);
}
exports.error = function (message) {
    logger.log('error', message);
}
exports.warn = function (message) {
    logger.log('warn', message);
}
exports.debug = function (message) {
    logger.log('debug', message);
}

process.on('uncaughtException', function (err) {
    console.log(err);
    logger.log('fatal', "UncaughtException: %s", err);
    // logzIOTransport.flush( function(callback) {
    //     process.exit(1);
    //   });
});
