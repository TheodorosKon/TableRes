const express = require('express');
const app = express();

app.get('/', function (req, res){
    res.send("Hello");
});

const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const dbPath = path.resolve(__dirname, 'restdatabase.db');

let db = new sqlite3.Database(dbPath, (err) => {
    if(err) console.log(err);
    console.log("Connected to the database")
});

db.serialize(() => {
    db.all(`SELECT * FROM Restaurants`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.table(row);
    });
  });
  
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });

const webserver = app.listen(8080, function () {
    console.log("Node Web Server is running..")
});