const express = require("express");
const jira = require('../lib/jiraclient.js');
const config = require('./configs/searchRoute.json');
const constants = require('../config/enums.json');
const searchRouter = new express.Router();
const logger = require('../lib/logger.js');

searchRouter.get('/case/:id', function (req, res) {

  let searchKey = req.params.id.trim().toLowerCase();

  if (searchKey === undefined) {
    res.sendStatus(400);
  }

  let sfReg = /[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]/gmi;
  let sfReg2 = /[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][0-9][0-9][0-9][0-9][0-9][0-9]/gmi;



  if (searchKey.length > 0) {


    if(sfReg.exec(searchKey) === null){
      if(sfReg2.exec(searchKey) !== null){
        searchKey = searchKey.slice(0,5) + "-" + searchKey.slice(5);
        console.log(searchKey);
      }
    }


    jira.getJiraItem(constants.sfSearchType.searchType, searchKey, function (err, result) {
      if (isErr(err)) {
        handleErr(err, res);
      } else if (err === constants.emptyResponse) {
        res.status(err.httpCode).json(err.message);
      } else {
        res.status(203).json(result);
      }
    });
  } else {
    res.sendStatus(400);
  }
});


searchRouter.get('/jira/:id', function (req, res) {

  let searchKey = req.params.id.trim().toLowerCase();

  if (searchKey === undefined) {
    res.sendStatus(400);
  }

  if (searchKey.length > 0) {

    let jiraReg = /^[a-z]*-[0-9]+$/gmi;
    let jiraReg2 = /^[a-z]*[0-9]+$/gmi;

    if(jiraReg.exec(searchKey) === null){
      if(jiraReg2.exec(searchKey) !== null){
        let tempReg = /[0-9]+/gm;
        let index = tempReg.exec(searchKey).index;
        searchKey = searchKey.slice(0,index) + "-" + searchKey.slice(index);
      }
    }

    jira.getJiraItem(constants.jiraSearchType.searchType, searchKey, function (err, result) {
      if (isErr(err)) {
        handleErr(err, res);
      } else if (err === constants.emptyResponse) {
        res.status(err.httpCode).json(err.message);
      } else {
        res.status(203).json(result);
      }
    });
  } else {
    res.sendStatus(400);
  }
});


function isErr(err) {

  if (err == null) {
    return false;
  }
  if (err instanceof Error) {
    return true;
  }
  if (typeof err.type !== undefined) {
    if (err.type === "error") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function handleErr(err, res) {

  if (typeof err.type !== undefined) {
    res.status(err.httpCode).json(err.message);
  } else {
    res.sendStatus(500);
  }

  try {
    logger.error(JSON.stringify(err));
  } catch (error) {
    logger.error(err);
  }
}


module.exports = searchRouter;
