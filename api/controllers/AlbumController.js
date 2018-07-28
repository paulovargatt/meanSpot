'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if (err) {
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!album) {
                res.status(404).send({message: 'Album não existe'});
            } else {
                res.status(200).send({album});
            }
        }
    });
}

function getAlbums(req, res){
    var artist = req.params.artist;
    if(!artist){
        var find = Album.find({}).sort('title')
    }else{
        var find = Album.find({artist: artist}).sort('year')
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if (err) {
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!albums) {
                res.status(404).send({message: 'Sem albums...'});
            } else {
                res.status(200).send({albums});
            }
        }
    })
}

function updateAlbum(req, res) {
    var album = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(album, update, (err, albumUpdate) => {
        if (err) {
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!albumUpdate) {
                res.status(404).send({message: 'Sem albums...'});
            } else {
                res.status(200).send({albumUpdate});
            }
        }
    })
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            return res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!albumStored) {
                return res.status(404).send({message: 'Sem Album...'});
            } else {
                return res.status(200).send({
                    album: albumStored
                });
            }
        }
    })
}

function deleteAlbum(req, res){
    var album = req.params.id;
    Album.findByIdAndRemove(album, (err, album) => {
        if (err) {
            res.status(500).send({message: 'Erro na requisição'});
        }else {
            if (!album) {
                return res.status(500).send({message: 'Não foi possível deletar'});
            } else {
                Song.find({artist: album._id}).remove((err, song) => {
                    if (err) {
                        return res.status(500).send({message: 'Erro na requisição'});
                    } else {
                        if (!song) {
                            res.status(500).send({message: 'Erro na requisição'});
                        } else {
                            res.status(200).send({album: album});
                        }
                    }
                });
            }
        }
    })
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'Sem upload';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, album) => {
                if(err){
                    res.status(500).send({message: 'Erro ao cadastrar imagem'})
                }else{
                    res.status(200).send({album: album})
                }
            });
        }else{
            res.status(200).send({message: 'Extensão inválida'})
        }
    }else {
        res.status(200).send({message: 'Sem imagem'   })
    }
}


function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/'+imageFile;

    fs.exists(path_file, function (exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Sem imagem'   })
        }
    })
}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};