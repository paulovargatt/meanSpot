'use strict';
var fs = require('fs');
var path = require('path');

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
                            res.status(200).send({user})
                        }
                    }else{
                        res.status(404).send({message: 'Usuário não pode logar'   })
                    }
                })
            }
        }
    })
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;
    console.log(update);

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
       if(err){
           res.status(500).send({message: 'Erro ao atualizar'   })
       }else{
           if(!userUpdated){
               res.status(404).send({message: 'Não é possível atualizar'   })
           }else{
               res.status(200).send({user: userUpdated })
           }
       }
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'Upload';
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            User.findByIdAndUpdate(userId, {image:file_name}, (err, userUpdated) => {
                if(err){
                    res.status(500).send({message: 'Erro ao cadastrar imagem'})
                }else{
                    res.status(200).send({user: userUpdated})
                }
            })

        }else{
            res.status(200).send({message: 'Extensão inválida'})
        }
    }else {
        res.status(200).send({message: 'Sem imagem'   })
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, function (exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Sem imagem'   })
        }
    })
}

module.exports = {
    prova,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};