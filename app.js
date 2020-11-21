const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res){
    console.log('Request for index received');
    res.sendFile(path.join(__dirname + '/admin.html'));
});

app.get('/Reservations', function (req, res) {
	console.log('Request for Tables received');
	const sqlite3 = require('sqlite3').verbose();
  
	const dbPath = path.resolve(__dirname, 'restdatabase.db');
  
	let db = new sqlite3.Database(dbPath, (err) => {
	  if(err) console.log(err);
	  console.log("Connected to the database")
	});
  
	let reqData = req.query.rest;
  
	db.serialize(() => {
	  db.all(`SELECT * FROM Tables WHERE RestaurantID=`+parseInt(reqData)+` AND Waiting=1`, (err, data) => {
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

app.post('/Reserve', function (req, res){
	console.log('Request for Reserve received');
	const sqlite3 = require('sqlite3').verbose();
  
	const dbPath = path.resolve(__dirname, 'restdatabase.db');
  
	let db = new sqlite3.Database(dbPath, (err) => {
	  if(err) console.log(err);
	  console.log("Connected to the database")
	});

	let reqData = req.body.tables;
	console.log(reqData);
	db.serialize(() => {
	  db.run(`UPDATE Tables SET Reserved=1, Waiting=0 WHERE TableNumber=`+parseInt(reqData)+` AND RestaurantID=1`, (err, data) => {
		if (err) {
		  console.error(err.message);
		}
		res.send('Table ' + parseInt(reqData) + ' reserved.');
	  });
	});
	  
	db.close((err) => {
	  if (err) {
		console.error(err.message);
	}});
});

const webserver = app.listen(8081, function () {
    console.log("Node Web Server is running..")
});