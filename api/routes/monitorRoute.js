const express = require("express");
const constants = require('../config/enums.json');
const monitorRouter = new express.Router();
const logger = require('../lib/logger.js');

module.exports = monitorRouter;

monitorRouter.get('/key', function(req,res){
  res.json({ consumerkey: "3MVG9dZJodJWITSsbGTC9oiHE5.rEyTmmyCamx9VJSIGtRcosTdhiFpMDAH2LOUEyrQgjqonHITspTCnJ0hJS"});
});

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
