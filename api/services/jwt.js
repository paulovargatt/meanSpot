'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'vargatt_chave';

exports.createToken = function(user){
    var payload = {
        sub: user.id,
        name: user.name,
        username: user.username,
        email:user.email,
        role: user.role,
        image: user.image,
        iad: moment().unix(),
        exp: moment().add(30,'days').unix
    };

    return jwt.encode(payload, secret);
};


