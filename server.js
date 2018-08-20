// modules
if (process.env.NODE_ENV !== 'production') {
    require('@glimpse/glimpse').init();
}

require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const compression = require('compression');
const sslRedirect = require('heroku-ssl-redirect');
const db = require('./api/lib/mongolib');

// express config

const app = express();
const port = process.env.PORT || 3001;

// middleware

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compression({filter: shouldCompress}));
app.use(sslRedirect());

app.use(function(req, res, next){
if(req.url === '/')
    res.redirect('/app');
    next();
});

function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}
// routers

const searchRouter = require('./api/routes/searchRoute.js');
const authRouter = require('./api/routes/authRoute.js');
const adminRouter = require('./api/routes/adminRoute.js');

// routes

app.use('/app',express.static(__dirname + "/ui/public"));
app.use('/api/search', searchRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// startup

db.connect();
app.listen(port);
console.log("Server listening on port " + port);