const express = require ('express');
const app = express();
const logger = require('morgan');
require('dotenv').config()

const port = process.env.PORT;
const conn = require('mysql2');
const bodyParser = require('body-parser');
const cors=require('cors');

const conexion = conn.createConnection({
    host:process.env.DB_HOST || "localhost",
    user:process.env.DB_USER ,
    database:process.env.DB_NAME ,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT ,
});

app.use(cors()),
app.use(logger('dev'));
app.use(express.urlencoded({extended:true})); //permite el intercambio de datos
app.use(bodyParser.json());
//rutas de user
var user_routes=require('./routes/user');
app.use(user_routes);

//rutas de album
var album_routes=require('./routes/album');
app.use(album_routes);

//rutas de artistas
var artist_routes=require('./routes/artist');
app.use(artist_routes);

//rutas de canciones
var song_routes=require('./routes/song');
app.use(song_routes);

app.get('*', (req, res) => {
    res.send({mesage: 'Ruta no valida'})
})

// Verificamos que podemos conectar a la base de datos y si se conecta iniciamos el servidor
conexion.connect((error)=>{
    if(error){
        console.log('No se puede conectar a la base de datos')
    }else{
        console.log('Conectado a la base de datos');
        app.listen(port, () => {
            console.log(`Servidor Api ejecutado en el puerto ${port}`);
        });        
    }
});