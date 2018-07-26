var express = require("express");

var app = express();

var router = new express.Router();

app.use(express.static(__dirname + '/public/'));

var port = process.env.PORT || 3000;

app.use(router);

router.get('/',function(req,res){
  res.sendFile('index.html');
});

app.listen(port);

console.log("Running at Port 3000");
console.log("Dumping environment variables");
console.log("process.env.NODE_ENV: " + process.env.NODE_ENV);
console.log("process.env.USERNAME: " + process.env.USERNAME);
console.log("process.env.PASSWORD: " + process.env.PASSWORD);
console.log("process.env.SECRET: " + process.env.SECRET);


