const request = require('request');
const constants = require('../config/enums.json');
const mappings = require('./jiraStatusMappings.js');
const config = require('./configs/jiraConfig.json');
const logger = require('../lib/logger.js');
// require('request').debug = true

exports.getJiraItem = function (searchType, searchKey, callback) {

    let jiraKeyOptions = {
        uri: config.jiraKeyUrl + searchKey,
        method: 'GET',
        headers: {
            "Authorization": "Basic " + process.env.JIRA_AUTH_TOKEN,
            "Content-Type": "application/json"
        }
    };

    let sfidOptions = {
        uri: config.sfidUrl + searchKey,
        method: 'GET',
        headers: {
            "Authorization": "Basic " + process.env.JIRA_AUTH_TOKEN,
            "Content-Type": "application/json"
        }
    }

    let options;

    switch(String(searchType)){
        case String(constants.sfSearchType.searchType): {
            options = sfidOptions;
            break;
        }
        case String(constants.jiraSearchType.searchType): {
            options = jiraKeyOptions;
            break;
        }
        default: {
            logger.warn("Unable to determine search type for key " + searchKey);
            let reg1 = /[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]/gm;

            let m = reg1.exec(searchKey);

            if(m !== null) {
               options = sfidOptions;
            } else {
                options = jiraKeyOptions;
            }
            break;
        }

    }

    logger.debug(options.method + " " + options.uri);

    request(options, function (err, res, body) {

        //console.log("Res" + JSON.stringify(res));
        //console.log("Body: " +  JSON.stringify(body));

        body = JSON.parse(body);

        if (!err && res.statusCode == 200) {
            if (body.total > 0) {

                let resultArray = {results: []};

                let resultsProcessed = 0;

                body.issues.forEach(function (issue) {
                    let jira_item = {};

                    jira_item.key = issue.key;
                    jira_item.title = issue.fields.description;
                    jira_item.priority = issue.fields.priority.name;
                    jira_item.sfid = issue.fields.customfield_10600;
                    jira_item.sfuri = issue.fields.customfield_10906;
                    jira_item.summary = issue.fields.summary;
                    jira_item.jirauri = config.rootUrl + "browse/" + issue.key;
                    jira_item.updated = new Date(issue.fields.updated).toDateString();
                    if(issue.fields.assignee !== null){
                      jira_item.assignee = issue.fields.assignee.displayName;
                    } else {
                      jira_item.assignee = "Unassigned";
                    }
                    if (issue.fields.fixVersions.length > 0) {
                        jira_item.fixtarget = issue.fields.fixVersions[0].name;
                        jira_item.released = issue.fields.fixVersions[0].released;
                    }
                    else {
                        jira_item.fixtarget = "TBD";
                        jira_item.released = false;
                    }
                    mapStatus(issue, function (stat) {
                        jira_item.status = stat;
                        resultArray.results.push(jira_item);
                    });

                    resultsProcessed++;

                    if (resultsProcessed === body.issues.length){
                      stripENGSUPP(resultArray, function(arr){
                        callback(null, arr);
                      });
                    }
                });
                //console.log(JSON.stringify(issue));
            }
            else {
                //console.log(body);
                callback(constants.emptyResponse, constants.emptyResponse.message);
            }
        } else {
            console.error(err);
            try {
                callback(err, err.message);
            } catch (error) {
                logger.error(error);
                try {
                    callback(err, "");
                } catch (error2) {
                    logger.error(error2);
                    logger.error("If this error is logged, something is very wrong");
                    callback(new Error("If this error is logged, something is very wrong"), constants.genericError);
                }
            }
        }
    })

}

function mapStatus(issue, callback) {

    for (let stat in mappings) {
        if (issue.fields.status.name === mappings[stat].name) {
            if (issue.fields.project.key === "ENGSUPP") {
                callback(mappings["ENGSUPP"]);
                return;
            }
            callback(mappings[stat]);
            return;
        } else {
            if (issue.fields.project.key === "ENGSUPP") {
                callback(mappings["ENGSUPP"]);
                return;
            }
        }
    }

    callback({
        name: issue.fields.status.name,
        publicStatus: issue.fields.status.name,
        description: ""
    });

}

function stripENGSUPP(issueArray, callback){
  if(issueArray.results.length < 2){
    callback(issueArray);
  } else {
    let tempArr = {results: []};
    tempArr.results = issueArray.results.filter(issue => issue.status !== mappings["ENGSUPP"]);
    if(tempArr.results.length > 0){
      callback(tempArr);
    } else {
      callback(issueArray);
    }
  }
}
