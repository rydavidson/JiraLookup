function authenticateUser(username, passhash, callback) {

  username = username.toLowerCase();

  const api = window.location.href.split("/")[0] + "/api";

  if (username.length > 0) {
    if (passhash.length > 0) {

      const xhr = createCORSRequest("POST", api + "/auth");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {

        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            const res = JSON.parse(this.responseText);
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
      };

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
  let xhr = new XMLHttpRequest();
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

export {authenticateUser, createCORSRequest};

