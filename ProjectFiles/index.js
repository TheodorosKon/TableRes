const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { Console } = require('console');

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
  let id = '';
  db.serialize(() => {
    console.log('select');
    db.all(`SELECT * FROM Tables WHERE TableNumber=`+ parseInt(req.body.tables) + ` AND RestaurantID=1` , (err, data) => {
      if (err) {
        console.error(err.message);
      }
      id = data[0]['ID'];
    });
    let date = req.body.day + '-' + req.body.month;
    console.log('insert');
    db.run(`INSERT INTO Reservations (RestID, TableNum, FirstName, LastName, Date) VALUES (` + req.body.rest + `, '` + req.body.tables + `', '` + req.body.firstName + `', '` + req.body.lastName + `', '` + date + `')`, (err, data) => {
      if (err) {
        console.error(err.message);
      }
      //let h = '<h1 style="background:red;color:whitesmoke;margin:20px solid red;">Waiting for response for Table ' + parseInt(reserve) + '</h1><script></script>';
      //let str = reserve;
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
  console.log(rest);
  db.serialize(() => {
    db.all(`SELECT * FROM Tables LEFT JOIN Reservations ON Reservations.TableNum = Tables.TableNumber WHERE RestaurantID=` + parseInt(rest) + ` AND Reservations.ID IS NULL`, (err, data) => {
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
  console.log(req.query);
  db.serialize(() => {
    db.all(`SELECT * FROM Reservations WHERE TableNum=` + req.query.table + ` AND Date=` + req.query.day + '-' + req.query.month + ' AND RestID=' + req.query.rest, (err, data) => {
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