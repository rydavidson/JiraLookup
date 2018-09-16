function authenticateUser(username, passhash, callback) {

  username = username.toLowerCase();

  var api = window.location.href.split("/")[0] + "/api";

  if (username.length > 0) {
    if (passhash.length > 0) {

      var xhr = createCORSRequest("POST", api + "/auth");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {

        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            var res = JSON.parse(this.responseText);
            callback(res);
          }
          else {
            if (this.status === 403) {
              callback(new Error(JSON.parse(this.responseText)));
            }
            else {
              callback(new Error("Something went wrong"));
              console.error(JSON.parse(this.responseText));
            }
          }
        }
      }

      xhr.send("username=" + username + "&password=" + passhash);

    }
    else {
      callback(new Error("Password cannot be empty"));
    }
  }
  else {
    callback(new Error("Username cannot be empty"));
  }
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest !== "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function authenticateSalesforce() {
  var key = "3MVG9dZJodJWITSsbGTC9oiHE5.rEyTmmyCamx9VJSIGtRcosTdhiFpMDAH2LOUEyrQgjqonHITspTCnJ0hJS";
  var callback_uri = window.location.href.split("/")[0] + "/auth_callback";
  var oauthApi = "https://login.salesforce.com/services/oauth2";

  var xhr = createCORSRequest("GET", oauthApi + `/authorize?response_type=authorization_code&client_id=${key}&redirect_uri=${callback_uri}`);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {


    // if (this.readyState === XMLHttpRequest.DONE) {
    //   if (this.status === 200) {
    //     var res = JSON.parse(this.responseText);
    //
    //   }
    //   else {
    //     if (this.status === 403) {
    //
    //     }
    //     else {
    //
    //
    //     }
    //   }
    // }
  }

  xhr.send();

}

export {authenticateUser, createCORSRequest, authenticateSalesforce};

