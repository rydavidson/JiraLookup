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
const auth = require('./api/lib/auth.js');

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
    logger.debug(req.method + " request");
    if (req.url.indexOf('auth') === -1) {
      if (req.method === 'OPTIONS') {
        res.writeHead(200, getCORSHeaders(req, "POST, GET, OPTIONS"));
        res.end();
      }
      else {
        if (!req.get("Authorization")) {
          res.status(401).json("Missing Authorization token");
        } else {
          let authorized = auth.authorizeUser(req.get("Authorization"));
          if (!authorized) {
            res.status(403).json("Invalid or expired Authorization token");
          } else {
            next();
          }
        }
      }
    } else { // the request is /auth
      if (req.method === 'OPTIONS') {
        res.writeHead(200, getCORSHeaders("POST, OPTIONS"));
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

  function getCORSHeaders(req, verbs) {
    let headers = {};
    headers["Access-Control-Allow-Origin"] = req.get("Origin");
    headers["Access-Control-Allow-Methods"] = verbs;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization";
    return headers;
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
