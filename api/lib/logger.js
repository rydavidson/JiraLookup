const winston = require('winston');
const logzioWinstonTransport = require('winston-logzio');

const winstonFactory = ({token}) => {
  const loggerOptions = {
    token: token,
    host: "listener.logz.io",
    type: "nodejs"
  };

  let logzIOTransport = new logzioWinstonTransport(loggerOptions);

  return new (winston.Logger)({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
      logzIOTransport,
      new (winston.transports.Console)()
    ]
  });
};

const logger = winstonFactory({token: process.env.LOGZIO_TOKEN});
//logger.transports.logzIOTransport.level = process.env.LOV_EVEL || 'info';

exports.info = function (message) {
  message = `${process.pid} - ` + message;
  logger.log('info', message);
}
exports.error = function (message) {
  message = `${process.pid} - ` + message;
  logger.log('error', message);
}
exports.warn = function (message) {
  message = `${process.pid} - ` + message;
  logger.log('warn', message);
}
exports.debug = function (message) {
  message = `${process.pid} - ` + message;
  logger.log('debug', message);
}

exports.silly = function(message) {
  message = `${process.pid} - ` + message;
  logger.log('silly', message);
}

process.on('uncaughtException', function (err) {
  console.log(process.pid + " - " + err);
  logger.log('fatal', `${process.pid} - UncaughtException`, err);
  // logzIOTransport.flush( function(callback) {
  //     process.exit(1);
  //   });
});
