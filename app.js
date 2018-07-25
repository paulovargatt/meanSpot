'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());


app.get('/provas', function (req, res) {
    res.status(200).send({message: 'Bem vindo'})
});

module.exports = app;