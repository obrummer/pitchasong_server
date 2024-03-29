var express = require('express');
var app = express();
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var parser = bodyParser.urlencoded({ extended: true });

const Pool = require('pg').Pool;
const conopts = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
}

const pool = new Pool(conopts);

app.use(cors());
app.use(express.static('public'));

app.get ('/api', function(req, res) {
    console.log("GET");

    let sqlInsert = 'INSERT INTO test (text) VALUES ($1)';
    let sqlInsertAttr = [req.query.text];
    pool.connect((err, client) => {
        if (err) throw err;
        client.query(sqlInsert, sqlInsertAttr,
        (err, data) => {
            if(err) throw err;
            client.release();
            console.log("Inserted: ", req.query.text);
        });
    });

    var response = {text: req.query.text};
    res.json(response);
});

var port = process.env.PORT || 3001;
var server = app.listen(port, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Now listening at http://%s:%s", host, port )
});