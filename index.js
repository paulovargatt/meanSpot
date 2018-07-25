'use strict';
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;



mongoose.connect('mongodb://localhost:27017/mean_spot', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("tudo ok")
        app.listen(port,function () {
           console.log("servidor API")
        });
    }
})