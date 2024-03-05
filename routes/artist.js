var express = require ('express')
var api=express.Router();
var artistController = require('../controllers/artist');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'uploads/artists'});
var md_auth = require('../middlewares/authenticated');

api.get('/artists/:id?',[md_auth.Auth], artistController.list);
api.post('/artists',[md_auth.Auth], artistController.save);
api.delete('/artists/:id',[md_auth.Auth], artistController.delete);
api.put('/artists/:id', [md_auth.Auth], artistController.update);
// api.post('/login', userController.login);
api.post('/artists/:id', [md_auth.Auth, md_upload], artistController.uploadImage);
api.get('/artists/image/:image', artistController.getImage);
api.delete('/artists/image/:id',[md_auth.Auth], artistController.delImage);

module.exports = api; 