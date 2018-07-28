'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveSong(req, res) {
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStore) => {
        if (err) {
            return res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!songStore) {
                return res.status(404).send({message: 'Sem Musica...'});
            } else {
                res.status(200).send({ song: songStore });
            }
        }
    })
}

function getSong(req, res) {
    var songId = req.params.id;
    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if (err) {
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!song) {
                res.status(404).send({message: 'Música existe'});
            } else {
                res.status(200).send({song});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.artist;
    if(!albumId){
        var find = Song.find({}).sort('number')
    }else{
        var find = Song.find({album: albumId}).sort('number')
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }}).exec((err, songs) => {
        if (err) {
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!songs) {
                res.status(404).send({message: 'Sem Musicas...'});
            } else {
                res.status(200).send({songs});
            }
        }
    })
}

function updateSong(req, res) {
    var song = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(song, update, (err, songUpdate) => {
        if (err) {
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if (!songUpdate) {
                res.status(404).send({message: 'Sem Música...'});
            } else {
                res.status(200).send({songUpdate});
            }
        }
    })
}

function deleteSong(req, res){
    var song = req.params.id;
        Song.findByIdAndRemove(song, (err, song) => {
            if (err) {
                return res.status(500).send({message: 'Erro na requisição'});
            } else {
                if (!song) {
                    res.status(500).send({message: 'Erro na requisição'});
                } else {
                    res.status(200).send({song: song});
                }
            }
        });
}


function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'Sem upload';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg'){

            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdate) => {
                if(err){
                    res.status(500).send({message: 'Erro ao cadastrar imagem'})
                }else{
                    res.status(200).send({song: songUpdate})
                }
            });
        }else{
            res.status(200).send({message: 'Extensão inválida'})
        }
    }else {
        res.status(200).send({message: 'Sem imagem'   })
    }
}


function getSongFile(req, res){
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/'+songFile;

    fs.exists(path_file, function (exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Sem Audio'   })
        }
    })
}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};