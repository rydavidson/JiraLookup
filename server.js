// modules

require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const db = require('./api/lib/mongolib');

// express config

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// routers

const searchRouter = require('./api/routes/searchRoute.js');
const authRouter = require('./api/routes/authRoute.js');
const adminRouter = require('./api/routes/adminRoute.js');

// middleware

app.use(function(req, res, next){
if(req.url === '/')
    res.redirect('/app');
    next();
});

// routes

app.use('/app',express.static(__dirname + "/ui/public"));
app.use('/api/search', searchRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// startup

db.connect();
app.listen(port);
console.log("Server listening on port " + port);