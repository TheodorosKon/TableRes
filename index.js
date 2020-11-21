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

  let reserve = req.body.reservations;

  db.serialize(() => {
    db.all(`SELECT * FROM Tables WHERE ID=`+parseInt(reserve), (err, data) => {
      if (err) {
        console.error(err.message);
      }
      let h = '<h1 style="background:red;color:whitesmoke;margin:20px solid red;">Waiting for response for Table ' + parseInt(reserve) + '</h1>';
      let str = data.ID;
      console.table(data);
      res.send(h+str);
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

  let reqData = req.query.rest;

  db.serialize(() => {
    db.all(`SELECT * FROM Tables WHERE RestaurantID=`+parseInt(reqData)+` AND Reserved=0`, (err, data) => {
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

const webserver = app.listen(8080, function () {
    console.log("Node Web Server is running..")
});

/*const https = require('https');
            https.get('https://localhost:8080?rest1=1', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
                console.log(data);
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(JSON.parse(data).explanation);
            });

            }).on("error", (err) => {
            console.log("Error: " + err.message);*/