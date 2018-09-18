// modules
// if (process.env.NODE_ENV !== 'production') {
//   require('@glimpse/glimpse').init();
// }

//require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const compression = require('compression');
const sslRedirect = require('heroku-ssl-redirect');
const cluster = require('cluster');
const db = require('./api/lib/mongolib');
const logger = require('./api/lib/logger.js');
const numCPUs = process.env.WORKER_COUNT || require('os').cpus().length;


if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}

cluster.on('exit', (worker) => {
  logger.error(`Worker ${worker.id} has terminated`);
  logger.debug("Creating a new worker");
  cluster.fork()
})

function masterProcess() {
  logger.info(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    logger.info(`Forking process number ${i}...`);
    cluster.fork();
  }
}

function childProcess() {

// express config

  const app = express();
  const port = process.env.PORT || 3001;

// middleware

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(compression({filter: shouldCompress}));
  app.use(sslRedirect());

  app.use(function (req, res, next) {
    if (req.url === '/')
      res.redirect('/app');
    next();
  });

  app.use('/api', function (req, res, next) {
    if (req.url.indexOf('auth') === -1) {
      if (req.method === 'OPTIONS') {
        let headers = {};
        headers["Access-Control-Allow-Origin"] = req.get("Origin");
        headers["Access-Control-Allow-Methods"] = "POST, PUT, DELETE, GET, OPTIONS";
        //headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization";
        res.writeHead(200, headers);
        res.end();
      }
      else {
        logger.info(req.method + " request");
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
        res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        //res.set("Access-Control-Allow-Credentials", false);
        if (!req.get("Authorization")) {
          res.sendStatus(401);
        } else {
          next();
        }
      }
    } else {
      if (req.method === 'OPTIONS') {
        let headers = {};
        headers["Access-Control-Allow-Origin"] = req.get("Origin");
        headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
        //headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization";
        res.writeHead(200, headers);
        res.end();
      } else {
        next();
      }
    }
  });

  function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }
    if (req.originalUrl.indexOf("api") > -1) {
      // don't compress api responses
      return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res)
  }

// routers

  const searchRouter = require('./api/routes/searchRoute.js');
  const authRouter = require('./api/routes/authRoute.js');
  const adminRouter = require('./api/routes/adminRoute.js');
  const monitorRouter = require('./api/routes/monitorRoute.js');

// routes

  app.use('/app', express.static(__dirname + "/ui/public"));
  app.use('/api/search', searchRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/monitor', monitorRouter);

// startup
  db.connect();
  app.listen(port);
  console.log(`Listening on port ${port}`);
}
