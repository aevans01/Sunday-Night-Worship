const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const Pool = require('pg').Pool;

app.use(cors());
app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port}`))
app.get('/', (req,res) => res.send(`Site working port listening on port: ${port}`))

const pool = new Pool({
    connectionLimit: 100,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
});

app.post('/insertVids', (req, res) => {
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
app.get('/getVids', (req, res) => {
    res.send("reached API");
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