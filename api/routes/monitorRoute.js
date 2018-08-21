const express = require("express");
const constants = require('../config/enums.json');
const monitorRouter = new express.Router();
const logger = require('../lib/logger.js');

module.exports = monitorRouter;

monitorRouter.post('/webhook', function(req,res){

});

monitorRouter.get('/webhook', function(req,res){

});

monitorRouter.get('/webhook/:id', function(req,res){

});


monitorRouter.put('/webhook/:id', function(req,res){

});

monitorRouter.delete('/webhook/:id', function(req,res){

});
