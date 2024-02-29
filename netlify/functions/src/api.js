const express = require('express');
const serverless = require('serverless-http')
const router = express.Router();
const app = express();
const port = 26257;
const Pool = require('pg').Pool;

app.use('/.netlify/functions/api',router);
app.listen(port, () => console.log(`Listening on port ${port}`))
router.get('/', (req,res) => res.send(`Site working port listening on port: ${port}`))

const pool = new Pool({
    connectionLimit: 100,
    host: "mauve-cuscus-13569.7tt.aws-us-east-1.cockroachlabs.cloud",
    user: "evansaustin28",
    password: "Q2pSP6Y1OjbcpooedEOrNQ",
    database: "defaultdb",
    multipleStatements: true
});

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
        if (err) {
            res.send(err.message);
            console.log(err.message);
        } else {
            res.send(rows);
            console.log(rows);
        }
    })
});

module.exports.handler = serverless(app);