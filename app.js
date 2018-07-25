'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Routes
var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

//Middleare API
app.use('/api', user_routes);


module.exports = app;