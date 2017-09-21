require('dotenv').config();

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());

var user = require('./user');
app.use('/user', user);

app.listen(3000, function() {
	console.log('Application started on port 3000');
});

module.exports = app;