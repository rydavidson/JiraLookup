const express = require("express");
const constants = require('../config/enums.json');
const adminRouter = new express.Router();

adminRouter.get('/user', function(req,res){

});

adminRouter.post('/user', function(req,res){

});

module.exports = adminRouter;
