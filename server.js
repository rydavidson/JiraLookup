var express = require("express");

var app = express();

var router = new express.Router();

app.use(express.static(__dirname + '/public/'));

app.use(router);

router.get('/',function(req,res){
  res.sendFile('index.html');
});

app.listen(3000);

console.log("Running at Port 3000");
