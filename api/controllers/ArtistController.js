'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if (err) {
            return res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!artist) {
                return res.status(404).send({message: 'Artista não existe'});
            } else {
                return res.status(200).send({artist});
            }
        }
    });
}

function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artist, total) {
        if (err) {
            return res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!artist) {
                return res.status(404).send({message: 'Sem artistas...'});
            } else {
                return res.status(200).send({
                    total: total,
                    artists: artist
                });
            }
        }
    })
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artist) => {
        if (err) {
            return res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!artist) {
                return res.status(404).send({message: 'nao encontrado o usuario para atualizar'});
            } else {
                return res.status(200).send({artis: artist});
            }
        }
    })
}

function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;
    console.log(params);
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artist) => {
        if (err) {
            return res.status(500).send({message: 'Não foi porssível salvar'});
        } else {
            if (!artist) {
                return res.status(404).send({message: 'Artista não foi salvo'});
            } else {
                return res.status(200).send({artist: artist});
            }
        }
    })
}

function deleteArtist(req, res) {
    var artist = req.params.id;
    Artist.findByIdAndRemove(artist, (err, artistRemove) => {
        if (err) {
            return res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!artistRemove) {
                return res.status(500).send({message: 'Não foi possível deletar'});
            } else {
                Album.find({artist: artistRemove._id}).remove((err, album) => {
                    if (err) {
                        return res.status(500).send({message: 'Erro na requisição'});
                    } else {
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
                                        res.status(200).send({artist: artistRemove});

                                    }
                                }
                            });
                        }
                    }
                })
            }
        }
    })
}

function uploadImage(req, res){
    var artist = req.params.id;
    var file_name = 'Sem upload'

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Artist.findByIdAndUpdate(artist, {image:file_name}, (err, artist) => {
                if(err){
                    res.status(500).send({message: 'Erro ao cadastrar imagem'})
                }else{
                    res.status(200).send({artist: artist})
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
    var path_file = './uploads/artists/'+imageFile;

    fs.exists(path_file, function (exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Sem imagem'   })
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};