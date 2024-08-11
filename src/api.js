var mysql = require("mysql");
const express = require("express");
const router = express.Router;
var hostname = "j72.h.filess.io";
var database = "ChurchDB_alivebowl";
var port = "3305";
var username = "ChurchDB_alivebowl";
var password = "6d6808d12befcac5b455ead86e8d7156a5a10e03";

var pool = mysql.createPool({
  host: hostname,
  user: username,
  password,
  database,
  port,
});``


router.post('/insertVids', (req, res) => {
    console.log("API Works");
    pool.query('INSERT INTO SONGS(VIDEOSOURCE,VIDEOTITLE,VIDEOTITLESHORTENED,VIDEODESCRIPTION,VIDEOIMAGE) VALUES(?,?,?,?,?)', ['https://youtu.be/' + req.body.VideoSource, req.body.VideoTitle, req.body.VideoTitle, req.body.VideoDescription, req.body.VideoImage], (err) => {
        if (err) {
            console.log(err.message);
        } else {
            res.send("Inserted 1 Record");
            console.log("Inserted 1 Record");
        }
    })
});
router.get('/getVids', (req, res) => {
    console.log("reached API");
    pool.query('SELECT * FROM SONGS', (err, rows) => {
        // res.send(rows);
        if (err) {
            res.send(err.message);
            console.log(err.message);
        } else {
            res.send(rows);
            console.log(rows);
        }
    })
});