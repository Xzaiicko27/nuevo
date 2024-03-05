var express = require ('express')
var api=express.Router();
var songController = require('../controllers/song')
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'uploads/songs'});
var md_auth = require('../middlewares/authenticated');

api.get('/songs/:id?',[md_auth.Auth], songController.list);
api.get('/songss/:id?',[md_auth.Auth], songController.listSongs);
api.post('/songs',[md_auth.Auth], songController.save);
api.delete('/songs/:id',[md_auth.Auth], songController.delete);
api.put('/songs/:id',[md_auth.Auth], songController.update);
// api.post('/login', userController.login);
api.post('/songs/:id', [md_auth.Auth, md_upload], songController.uploadSong);
api.get('/songs/file/:file', songController.getSong);
api.delete('/songs/file/:id',[md_auth.Auth], songController.delSong);

module.exports = api; 