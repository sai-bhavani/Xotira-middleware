var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    var http = require("http");

    var options = {
        "method": "GET",
        "hostname": "localhost",
        "port": "3000",
        "path": "/data/question/getall?sub=M1"
    };

    var req1 = http.request(options, function (res1) {
        var questions = [];

        res1.on("data", function (chunk) {
            questions.push(chunk);
        });

        res1.on("end", function () {
            res.render('paper', {title: 'Xotira', questions: JSON.parse(questions)});
        });
    });

    req1.end();
});
router.get("/submit", function (req, res, next) {
    var respponses=req.query;
    res.send(respponses);
});
module.exports = router;

