'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    role: String,
    iamge: String,

});

module.exports = mongoose.model('User', UserSchema);