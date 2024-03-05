// const conn = require('mysql2');

// const conexion = conn.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'mysql',
//     database:'mydb'
// });


// module.exports={
//     save(req, res){
//         console.log(req.body);
//         res.status(200).send({message: 'Guardar canciones'})
//     },
//     list(reeq, res){
//         conexion.query(
//             'SELECT * FROM song',
//             function(err, results, fields) {
//                 if(results){
//                     res.status(200).send({data: results})
//                 }else{
//                     res.status(500).send({message:'ERROR: Intentalo más tarde'})
//                 }
//             }
//         );
//         // res.status(200).send({message: 'Listado de canciones'})
//     },
//     delete(req,res){
//         id = req.params.id;
//         conexion.query('DELETE FROM song WHERE id = '+id,function (err, results, fields){

//             if(!err){
//                 if(results.affectedRows!=0){
//                     console.log(err);
//                     res.status(200).send({message:"Registro eliminado"})
//                 }else{
//                     console.log(err);
//                     res.status(200).send({message:"No se elimino nada"})
//                 }
//             }else{
//                 console.log(err);
//                 res.status(500).send({message:"Intentalo más tarde"})
//             }
//         })
//     },
//     update(req, res) {
//         id = req.params.id;
//         data = req.body;
//         var sql = 'UPDATE song SET ? WHERE id=?';
//         if (data.password) {
//             bcrypt.hash(data.password, null, null, function (err, hash) {
//                 if (!err) {
//                     data.password = hash;
//                     conexion.query(sql, [data, id],
//                         function (err, results, fields) {
//                             if (!err) {
//                                 console.log(results);
//                             } else {
//                                 console.log(err);
//                             }
//                         });
//                 }
//             })
//         } else {
//             conexion.query(sql, [data, id],
//                 function (err, results, fields) {
//                     if (!err) {
//                         console.log(results);
//                     } else {
//                         console.log(err);
//                     }
//                 });
//         }
//     }
// }

// const conn = require('mysql2');
// const bcrypt = require('bcrypt-nodejs');
// var jwt = require('../services/jwt');
// var fs = require('fs');// Manejo de archivos fileSystem
// var path = require('path'); // Rutas o Ubicaciones  
// const { error } = require('console');

// const conexion = conn.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'mysql',
//     database: 'mydb'
// });

// module.exports = {
//     save(req, res) {
//         const data = req.body;
//         const number = data.number;
//         const name = data.name;
//         const duration = data.duration;
//         const file = data.file;
//         const album_id = data.album_id;

//         const sql = 'INSERT INTO song (number, name, duration, file, album_id) VALUES (?, ?, ?, ?, ?)';

//         conexion.query(sql, [number, name, duration, file, album_id], function (err, results, fields) {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send({ message: 'Error, inténtalo más tarde' });
//             } else {
//                 console.log(results);
//                 res.status(201).send({ message: 'Datos guardados' });
//             }
//         });
//     },
//     list(req, res) {
//         conexion.query(
//             'SELECT * FROM song',
//             function (err, results, fields) {
//                 if (results) {
//                     res.status(200).send({ data: results });
//                 } else {
//                     res.status(500).send({ message: 'ERROR: Inténtalo más tarde' });
//                 }
//             }
//         );
//         // res.status(200).send({ message: 'Listado de canciones' });
//     },
//     delete(req, res) {
//         const id = req.params.id;
//         conexion.query('DELETE FROM song WHERE id = ?', [id], function (err, results, fields) {
//             if (!err) {
//                 if (results.affectedRows != 0) {
//                     console.log(results);
//                     res.status(200).send({ message: 'Registro eliminado' });
//                 } else {
//                     console.log(err);
//                     res.status(200).send({ message: 'No se eliminó nada' });
//                 }
//             } else {
//                 console.log(err);
//                 res.status(500).send({ message: 'Inténtalo más tarde' });
//             }
//         });
//     },
//     update(req, res) {
//         const id = req.params.id;
//         const data = req.body;
//         const sql = 'UPDATE song SET ? WHERE id=?';

//         conexion.query(sql, [data, id], function (err, results, fields) {
//             if (!err) {
//                 if (results.affectedRows > 0) {
//                     console.log(results);
//                     res.status(200).send({ message: 'Registro actualizado' });
//                 } else {
//                     console.log(err);
//                     res.status(404).send({ message: 'No se encontró el registro para actualizar' });
//                 }
//             } else {
//                 console.log(err);
//                 res.status(500).send({ message: 'Error al actualizar el registro' });
//             }
//         });
//     },
//     // uploadSong(req, res) {
//     //     var id = req.params.id;
//     //     var file = 'Sin audio...';
//     //     console.log(req.files);
//     //     if (req.files && req.files.audio) {
//     //         var file_path = req.files.audio.path;
//     //         var file_split = file_path.split('\\');  
//     //         console.log(file_split);
//     //         var file_name = file_split[2];
//     //         console.log(file_name);
//     //         var ext = file_name.split('\.');
//     //         var file_ext = ext[1];
//     //         if (file_ext == 'mp3') {
//     //             conexion.query('UPDATE song SET file="' + file_name + '" WHERE id=' + id,
//     //                 function (err, results, fields) {
//     //                     if (!err) {
//     //                         if (results.affectedRows != 0) {
//     //                             res.status(200).send({ message: 'Audio actualizado' });
//     //                         } else {
//     //                             console.log(err)
//     //                             res.status(200).send({ message: 'Error al actualizar' });
//     //                         }
//     //                     } else {
//     //                         console.log(err);
//     //                         res.status(500).send({ message: 'Inténtelo más tarde' });
//     //                     }
//     //                 });
//     //         } else {
//     //             console.log(error)
//     //             res.status(400).send({ message: 'Formato de audio no válido. Utilice mp3.' });
//     //         }
//     //     } else {
//     //         console.log(error);
//     //         res.status(400).send({ message: 'No se proporcionó ningún archivo de audio.' });
//     //     }
//     // }        
//     uploadSong(req, res) {
//         var id = req.params.id;
//         var file = 'Sin canción...';
//         console.log(req.files);
    
//         if (req.files) {
//             var file_path = req.files.file.path;
//             var file_split = file_path.split('\\'); // En caso de usar linux cambiaría a ('\/')
//             var file_name = file_split[2];
//             var ext = file_name.split('\.');
//             var file_ext = ext[1];
    
//             if (file_ext == 'mp3' || file_ext == 'wav' || file_ext == 'ogg' || file_ext == 'flac') {
//                 conexion.query('UPDATE song SET file = "' + file_name + '" WHERE id =' + id,
//                     function (err, results, fields) {
//                         if (!err) {
//                             if (results.affectedRows != 0) {
//                                 res.status(200).send({ message: 'Canción actualizada' });
//                             } else {
//                                 res.status(200).send({ message: 'Error al actualizar' });
//                             }
//                         } else {
//                             console.log(err);
//                             res.status(200).send({ message: 'Inténtalo más tarde' });
//                         }
//                     });
//             } else {
//                 res.status(200).send({ message: 'Formato de audio no válido' });
//             }
//         }
//     }

//     //borre la cancion y borre tambien el archivo
// };
const conn = require('mysql2');
const bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
const { error } = require('console');

const conexion = conn.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'mydb'
});

module.exports = {
    save(req, res) {
        const data = req.body;
        const number = data.number;
        const name = data.name;
        const duration = data.duration;
        const file = data.file;
        const album_id = data.album_id;

        // Verificar permisos del usuario
        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para crear canciones" });
        }

        const sql = 'INSERT INTO song (number, name, duration, file, album_id) VALUES (?, ?, ?, ?, ?)';

        conexion.query(sql, [number, name, duration, file, album_id], function (err, results, fields) {
            if (err) {
                console.log(err);
                res.status(500).send({ message: 'Error, inténtalo más tarde' });
            } else {
                console.log(results);
                res.status(201).send({ message: 'Datos guardados' });
            }
        });
    },
    list(req, res) {
        if (req.params.id){
            console.log(req.params.id);
            sql='SELECT * FROM song WHERE id=' + req.params.id;
        }else{
            sql= 'SELECT * FROM song';
        }
        console.log(req.song)
        conexion.query(
            sql,
            function (err, results, fields) {
                if (results) {
                    res.status(200).send({ data: results });
                } else {
                    res.status(500).send({ message: 'ERROR: Inténtalo más tarde' });
                }
            }
        );
    },
    listSongs(req, res){
        console.log(req.params.id);
        var id= parseInt(req.params.id)
        var sql='SELECT * FROM song WHERE album_id=' + id;
        
        console.log(req.song);
        conexion.query(
            sql,
            console.log(sql),
            function (err, results, fields) {
                if (results) {
                    console.log(results)
                    res.status(200).send({ data: results });
                } else {
                    res.status(500).send({ message: 'ERROR: Inténtelo más tarde' });
                }
            }
        );
    },
    delete(req, res) {
        const id = req.params.id;

        // Verificar permisos del usuario
        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para eliminar canciones" });
        }

        conexion.query('DELETE FROM song WHERE id = ?', [id], function (err, results, fields) {
            if (!err) {
                if (results.affectedRows !== 0) {
                    console.log(results);
                    res.status(200).send({ message: 'Registro eliminado' });
                } else {
                    console.log(err);
                    res.status(200).send({ message: 'No se eliminó nada' });
                }
            } else {
                console.log(err);
                res.status(500).send({ message: 'Inténtalo más tarde' });
            }
        });
    },
    update(req, res) {
        const id = req.params.id;
        const data = req.body;
        const sql = 'UPDATE song SET ? WHERE id=?';

        // Verificar permisos del usuario
        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para actualizar canciones" });
        }

        conexion.query(sql, [data, id], function (err, results, fields) {
            if (!err) {
                if (results.affectedRows > 0) {
                    console.log(results);
                    res.status(200).send({ message: 'Registro actualizado' });
                } else {
                    console.log(err);
                    res.status(404).send({ message: 'No se encontró el registro para actualizar' });
                }
            } else {
                console.log(err);
                res.status(500).send({ message: 'Error al actualizar el registro' });
            }
        });
    },
    uploadSong(req, res) {
        const id = req.params.id;
        const file = 'Sin canción...';
        console.log(req.files);

        // Verificar permisos del usuario
        if (req.user.rol !== 'creator' && req.user.rol !== 'admin') {
            return res.status(403).send({ message: "No tienes permisos para actualizar la canción" });
        }

        if (req.files) {
            const file_path = req.files.file.path;
            const file_split = file_path.split('\\'); // En caso de usar linux cambiaría a ('\/')
            const file_name = file_split[2];
            const ext = file_name.split('\.');
            const file_ext = ext[1];

            if (file_ext == 'mp3' || file_ext == 'wav' || file_ext == 'ogg' || file_ext == 'flac') {
                // Consultar la canción actual
                conexion.query('SELECT file FROM song WHERE id = ?', [id], function (selectErr, selectResults, selectFields) {
                    if (!selectErr) {
                        if (selectResults.length !== 0 && selectResults[0].file !== null) {
                            // Si ya hay una canción, eliminarla antes de subir la nueva
                            const previousFile = selectResults[0].file;
                            const previousFilePath = './uploads/songs/' + previousFile;

                            // Eliminar la canción anterior
                            fs.unlink(previousFilePath, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.log(unlinkErr);
                                    res.status(500).send({ message: 'Error al eliminar la canción anterior' });
                                } else {
                                    // Actualizar la base de datos con la nueva canción
                                    conexion.query('UPDATE song SET file = "' + file_name + '" WHERE id =' + id,
                                        function (updateErr, updateResults, updateFields) {
                                            if (!updateErr) {
                                                res.status(200).send({ message: 'Canción actualizada' });
                                            } else {
                                                console.log(updateErr);
                                                res.status(500).send({ message: 'Error al actualizar la canción en la base de datos' });
                                            }
                                        });
                                }
                            });
                        } else {
                            // Si no hay canción previa, simplemente actualizar la base de datos
                            conexion.query('UPDATE song SET file = "' + file_name + '" WHERE id =' + id,
                                function (updateErr, updateResults, updateFields) {
                                    if (!updateErr) {
                                        res.status(200).send({ message: 'Canción actualizada' });
                                    } else {
                                        console.log(updateErr);
                                        res.status(500).send({ message: 'Error al actualizar la canción en la base de datos' });
                                    }
                                });
                        }
                    } else {
                        console.log(selectErr);
                        res.status(500).send({ message: 'Error al obtener la canción actual' });
                    }
                });
            } else {
                res.status(200).send({ message: 'Formato de audio no válido' });
            }
        } else {
            res.status(200).send({ message: 'No se proporcionó ninguna canción.' });
        }
    },
    getSong(req, res) {
        const file = req.params.file;
        const path_file = './uploads/songs/' + file;
    
        if (fs.existsSync(path_file)) {
            res.sendFile(path.resolve(path_file));
        } else {
            console.log(error);
            res.status(404).send({ message: 'No existe el archivo' });
        }
    },
    
    delSong(req, res) {
        const id = req.params.id;
        const sql = "SELECT file FROM song WHERE id = " + id;
    
        conexion.query(sql, function (err, results, fields) {
            if (!err) {
                if (results.length != 0) {
                    if (results[0].file != null) {
                        console.log(results);
                        // Eliminar el archivo físico
                        const path_file = './uploads/songs/' + results[0].file;
                        try {
                            // Una vez que lo borras, actualizar y poner null
                            fs.unlinkSync(path_file);
                            const updateSql = "UPDATE song SET file = NULL WHERE id = " + id;
                            conexion.query(updateSql, function (updateErr, updateResults) {
                                if (!updateErr) {
                                    console.log("Base de datos actualizada con éxito");
                                    res.status(200).send({ message: "Canción eliminada" });
                                } else {
                                    console.log(updateErr);
                                    res.status(500).send({ message: "Error al actualizar la base de datos" });
                                }
                            });
    
                        } catch (error) {
                            console.log(error);
                            res.status(200).send({ message: "No se pudo eliminar, intenta más tarde" });
                        }
                    } else {
                        res.status(404).send({ message: "Canción no encontrada" });
                    }
                } else {
                    res.status(404).send({ message: "Canción no encontrada" });
                }
            } else {
                console.log(err);
                res.status(500).send({ message: "Intenta más tarde" });
            }
        });
    }
};

