var express = require ('express')
var api=express.Router();
var albumController = require('../controllers/album');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'uploads/albums'});
var md_auth = require('../middlewares/authenticated');

api.get('/albums/:id?',[md_auth.Auth], albumController.list);
api.get('/albumss/:id?',[md_auth.Auth], albumController.listAlbumsArtistas);
api.post('/albums',[md_auth.Auth], albumController.save);
api.delete('/albums/:id',[md_auth.Auth], albumController.delete);
api.put('/albums/:id',[md_auth.Auth], albumController.update);
// api.post('/login', userController.login);
api.post('/albums/:id', [md_auth.Auth, md_upload], albumController.uploadImage);
api.get('/albums/image/:image', albumController.getImage);
api.delete('/albums/image/:id',[md_auth.Auth], albumController.delImage);

module.exports = api; 