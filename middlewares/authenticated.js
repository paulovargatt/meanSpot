'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'vargatt_chave';

exports.ensureAuth = function (req, res, next) {
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Sem authorization Header'})
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    console.log(token);
    try {
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token Expirado'});
        }
    }catch (e) {
        return res.status(404).send({message: 'Token Inválido'});
    }
    req.user = payload;
    next();
};