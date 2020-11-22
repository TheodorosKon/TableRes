const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res){
    console.log('Request for index received');
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/Restaurant', function (req, res) {
  console.log("Request for Restaunt received");
  const sqlite3 = require('sqlite3').verbose();

  const dbPath = path.resolve(__dirname, 'restdatabase.db');

  let db = new sqlite3.Database(dbPath, (err) => {
      if(err) console.log(err);
      console.log("Connected to the database")
  });

  let reqData = req.body.restaurant;

  console.log(req.body.restaurant);

  db.serialize(() => {
    db.all(`SELECT * FROM Tables WHERE RestaurantID=`+parseInt(reqData)+` AND Reserved=0`, (err, data) => {
      if (err) {
        console.error(err.message);
      }
      //let h = '<h1 style="background:Green;color:whitesmoke;margin:20px solid red;">Select a table for Restaurant ' + parseInt(reqData) + '</h1>';
      let str = data;
      console.table(data);

      res.sendFile(path.join(__dirname + "/restaurant.html"));
    });
  });
    
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
});

app.post('/Reservations', function (req, res) {
  
  console.log("Request for Reservations received");
  const sqlite3 = require('sqlite3').verbose();

  const dbPath = path.resolve(__dirname, 'restdatabase.db');

  let db = new sqlite3.Database(dbPath, (err) => {
      if(err) console.log(err);
      console.log("Connected to the database")
  });
  console.log(req.body.tables);
  let reserve = req.body.tables;
  db.serialize(() => {
    db.run(`UPDATE Tables SET Waiting=1 WHERE TableNumber=`+ reserve +` AND RestaurantID=1 AND Waiting=0`, (err, data) => {
      if (err) {
        console.error(err.message);
      }
      let h = '<h1 style="background:red;color:whitesmoke;margin:20px solid red;">Waiting for response for Table ' + parseInt(reserve) + '</h1><script></script>';
      let str = reserve;
      //res.send(h+str);
      res.sendFile(path.join(__dirname + "/reservations.html"));
    });
  });
    
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
});

app.get('/Tables', function (req, res) {
  console.log('Request for Tables received');
  const sqlite3 = require('sqlite3').verbose();

  const dbPath = path.resolve(__dirname, 'restdatabase.db');

  let db = new sqlite3.Database(dbPath, (err) => {
    if(err) console.log(err);
    console.log("Connected to the database")
  });

  let rest = req.query.rest;
  let day = req.query.day;
  let month = req.query.month;

  db.serialize(() => {
    db.all(`SELECT * FROM Tables LEFT JOIN Reservations ON Reservations.TableID = Tables.ID WHERE RestaurantID=` + parseInt(rest) + ` AND Reservations.ID IS NULL`, (err, data) => {
      if (err) {
        console.error(err.message);
      }
      let str = data;
      res.send(data);
    });
  });
    
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }});
});

app.get('/CheckTable', function (req, res) {
  console.log('Request for Check received');
  const sqlite3 = require('sqlite3').verbose();

  const dbPath = path.resolve(__dirname, 'restdatabase.db');

  let db = new sqlite3.Database(dbPath, (err) => {
    if(err) console.log(err);
    console.log("Connected to the database")
  });

  let reqData = req.query.table;
  console.log(reqData);
  db.serialize(() => {
    db.all(`SELECT * FROM Tables WHERE RestaurantID=1 AND Reserved=1 AND TableNumber=`+parseInt(reqData), (err, data) => {
      if (err) {
        console.error(err.message);
      }
      let str = data;
      console.log(data);
      if(data.length == 1){
        res.send('Reserved');
      }
    });
  });
    
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }});
});

const webserver = app.listen(8080, function () {
    console.log("Node Web Server is running..")
});