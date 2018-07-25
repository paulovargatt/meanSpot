'use strict';

var express = require('express');
var userController = require('../controllers/UserController');
var api = express.Router();

api.get('/user-cont', userController.prova);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);

module.exports = api;