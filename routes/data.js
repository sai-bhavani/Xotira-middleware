var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/xotira";
mongo.connect(url, function (error, conn) {
    if (error)
        console.log(error);

    /* GET users listing. */
    router.get('/', function (req, res, next) {
        var reply = {
            status: "success"
        };
        res.send(reply);
    });

    router.get('/question/create', function (req, res, next) {
        var question = req.query;
        question.correct = eval(question.correct)

        conn.db("xotira").collection("question")
            .insertOne(question, function (error2, result) {
                if (error2)
                    next(error2)
                res.send(result)
            })
    })

    router.get('/question/get', function (req, res, next) {
        conn.db("xotira").collection("question")
            .find({subject: req.query.sub})
            .toArray(function (error2, result) {
                if (error2)
                    next(error2)
                res.send(result[req.query.id])
                })

    })


    router.get('/question/getall', function (req, res, next) {
        conn.db("xotira").collection("question")
            .find({subject: req.query.sub})
            .toArray(function (error2, result) {
                if (error2)
                    next(error2)
                res.send(result)
            })

    })

});


module.exports = router;

