const express = require("express");
const jira = require('../lib/jiraclient.js');
const config = require('./configs/searchRoute.json');
const constants = require('../config/enums.json');
const searchRouter = new express.Router();

searchRouter.get('/case/:id', function (req, res) {

    let searchKey = req.params.id.trim().toLowerCase();

    if (searchKey === undefined) {
        res.sendStatus(400);
    }

    let reg1 = /[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]/gm;

    if (searchKey.length > 0) {

        let m = reg1.exec(searchKey);
        if (m !== null) {
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
            console.error("Bad request: " + searchKey);
            res.sendStatus(400);
        }
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
        let reg1 = /(.*[a-z])-(.*[0-9])/gm

        let m = reg1.exec(searchKey);
        if (m !== null) {
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
            console.error("Bad request: " + searchKey);
            res.sendStatus(400);
        }
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
        console.error(JSON.stringify(err));
    } catch (error) {
        console.log(err);
    }
}


module.exports = searchRouter;