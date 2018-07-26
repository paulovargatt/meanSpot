'use strict';
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function prova( req, res) {
    res.status(200).send({
        message: 'Controller aki'
    })
}

function saveUser(req, res){
    var user = new User();
    var params = req.body;
    user.name = params.name;
    user.username = params.username;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';
    console.log(params)
    if(params.password){
        bcrypt.hash(params.password, null, null, function (err,hash) {
            user.password = hash;
            if(user.name != null && user.username != null && user.email != null){
                user.save((err, userStored) => {
                   if(err){
                       res.status(500).send({message: 'Erro ao salvar' })
                   } else{
                       if(!userStored){
                           res.status(404).send({message: 'Não foi possível salvar' })
                       }else{
                           res.status(200).send({user: userStored})
                       }
                   }
                });
            }else{
                res.status(200).send({message: 'Insira todos os campos' })
            }
        })
    }else{
        res.status(200).send({
            message: 'Insira a senha'
        })
    }
}

function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Erro ao buscar'   })
        }else{
            if(!user){
                res.status(404).send({message: 'Usuário não existe'   })
            }else{
                bcrypt.compare(password, user.password, function (err, check) {
                    if(check){
                        if(params.gethash){
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(404).send({user})
                        }
                    }else{
                        res.status(404).send({message: 'Usuário não pode logar'   })
                    }
                })
            }
        }
    })
}


module.exports = {
    prova,
    saveUser,
    loginUser
};