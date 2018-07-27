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

console.log("Running");


