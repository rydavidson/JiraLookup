exports.info = function (message) {
  message = `${process.pid} - ` + message;
  console.log('info', message);
};
exports.error = function (message) {
  message = `${process.pid} - ` + message;
  console.log('error', message);
};
exports.warn = function (message) {
  message = `${process.pid} - ` + message;
  console.log('warn', message);
};
exports.debug = function (message) {
  message = `${process.pid} - ` + message;
  console.log('debug', message);
};

exports.silly = function(message) {
  message = `${process.pid} - ` + message;
  console.log('silly', message);
};

process.on('uncaughtException', function (err) {
  console.log(process.pid + " - " + err);
  console.log('fatal', `${process.pid} - UncaughtException`, err);
  // logzIOTransport.flush( function(callback) {
  //     process.exit(1);
  //   });
});
