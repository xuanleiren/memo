/* Homework 11 (memo_service.js), by Xuanlei Ren
   CSc 337, Spring 2019 
   Purpose: this is a web service file for javascript use. */

const express = require("express");
const app = express();
const fs = require("fs");

//app.use(express.static('public'));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.post('/', jsonParser, function (req, res) {
	const when = req.body.when;
	const what = req.body.what;
	const where = req.body.where;
	let filecontent = when + "*" + what + "*" + where + "\r\n";
	if (fs.existsSync("memos.txt")) {
    	fs.appendFile("memos.txt", filecontent, function (err) {
  			if (err) throw err;
  			console.log('Saved!');
		});
	} else {
		fs.writeFile('memos.txt', filecontent, function (err) {
  			if (err) throw err;
  			console.log('Saved!');
		});
	}
	
	res.send();
});

app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let lines = fs.readFileSync("memos.txt", 'utf8').split("\r\n");
	let json = {};
	let memos = [];
	for (let i = 0; i < lines.length-1; i++){
		let memo = {};
		let line = lines[i].split("*");
		memo["when"] = line[0];
		memo["what"] = line[1];
		memo["where"] = line[2];
		memos.push(memo);
	}

	json["memos"] = memos;

	res.send(JSON.stringify(json));	
})

app.listen(process.env.PORT);
