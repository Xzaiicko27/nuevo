// const conn = require('mysql2');
// const bcrypt = require('bcrypt-nodejs');
// var jwt = require('../services/jwt');
// var fs = require('fs');// Manejo de archivos fileSystem
// var path = require('path'); // Rutas o Ubicaciones  

// const conexion = conn.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'mysql',
//     database: 'mydb'
// });

// module.exports = {
//     save(req, res) {
//         data = req.body;
//         title = data.title;
//         description = data.description;
//         year = data.year;
//         artist_id = data.artist_id;

//         conexion.query(
//             'INSERT INTO album (title, description, year, artist_id) VALUES (?, ?, ?, ?)',
//             [title, description, year, artist_id],
//             function (err, results, fields) {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).send({ message: 'Error, inténtelo más tarde' });
//                 } else {
//                     res.status(201).send({ message: 'Datos guardados' });
//                 }
//             }
//         );
//     },
//     list(req, res) {
//         conexion.query(
//             'SELECT * FROM album',
//             function (err, results, fields) {
//                 if (results) {
//                     res.status(200).send({ data: results });
//                 } else {
//                     res.status(500).send({ message: 'ERROR: Inténtelo más tarde' });
//                 }
//             }
//         );
//     },
//     // delete(req, res) {
//     //     const id = req.params.id;
//     //     conexion.query('DELETE FROM album WHERE id = ?', [id], function (err, results, fields) {
//     //         if (!err) {
//     //             if (results.affectedRows != 0) {
//     //                 console.log(results);
//     //                 res.status(200).send({ message: 'Registro eliminado' });
//     //             } else {
//     //                 console.log(results);
//     //                 res.status(200).send({ message: 'No se eliminó nada' }); 
//     //             }
//     //         } else {
//     //             console.log(err);
//     //             res.status(500).send({ message: 'Inténtelo más tarde' });
//     //         }
//     //     });
//     // },
//     delete(req, res) {
//         const idAlbum = req.params.id;
//         conexion.query('DELETE FROM song WHERE album_id = ?', [idAlbum], function (err, resultadosCanciones) {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).send({ message: 'Error al eliminar canciones relacionadas con el álbum' });
//             }
//             conexion.query('DELETE FROM album WHERE id = ?', [idAlbum], function (err, resultadosAlbum) {
//                 if (!err) {
//                     if (resultadosAlbum.affectedRows != 0) {
//                         console.log(resultadosAlbum);
//                         res.status(200).send({ message: 'Álbum y canciones eliminados' });
//                     } else {
//                         console.log(resultadosAlbum);
//                         res.status(200).send({ message: 'No se encontró álbum para eliminar' });
//                     }
//                 } else {
//                     console.log(err);
//                     res.status(500).send({ message: 'Error al eliminar álbum' });
//                 }
//             });
//         });
//     },        
//     update(req, res) {
//         const id = req.params.id;
//         const data = req.body;
//         const sql = 'UPDATE album SET ? WHERE id=?';

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
//     uploadImage(req, res){
//         var id = req.params.id;
//         var file = 'Sin imagen...';
//         console.log(req.files);
//         if(req.files){
//             var file_path = req.files.image.path;
//             var file_split = file_path.split('\\');
//             console.log(file_split);
//             var file_name = file_split[2];
//             console.log(file_name);
//             var ext = file_name.split('\.');
//             var file_ext = ext[1];
//             if(file_ext=='jpg' || file_ext=='png' || file_ext=='gif' || file_ext=='jpeg'){
//                 conexion.query('UPDATE album SET image="'+file_name+'" WHERE id='+id,
//                 function(err, results, fields){
//                     if(!err){
//                         if(results.affectedRows!=0){
//                             res.status(200).send({message: 'Imagen actualizada'});
//                         }else{
//                             res.status(200).send({message: 'Error al actualizar'});
//                         }
//                     }else{
//                         console.log(err);
//                         res.status(500).send({message: 'Intentelo más tarde'});
//                     }
//                 });
//             } else {
//                 res.status(400).send({message: 'Formato de imagen no válido. Utilice jpg, png, gif o jpeg.'});
//             }
//         } else {
//             res.status(400).send({message: 'No se proporcionó ninguna imagen.'});
//         }
//     }    
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
        if (req.user.rol == 'user' ) {
            return res.status(403).send({ message: "No tienes permisos para crear álbumes" });
        }

        data = req.body;
        title = data.title;
        description = data.description;
        year = data.year;
        artist_id = data.artist_id;

        conexion.query(
            'INSERT INTO album (title, description, year, artist_id) VALUES (?, ?, ?, ?)',
            [title, description, year, artist_id],
            function (err, results, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ message: 'Error, inténtelo más tarde' });
                } else {
                    res.status(201).send({ message: 'Datos guardados' });
                }
            }
        );
    },

    list(req, res) {
        if (req.params.id){
            console.log(req.params.id);
            sql='SELECT * FROM album WHERE id=' + req.params.id;
        }else{
            sql= 'SELECT * FROM album';
        }
        console.log(req.album);
        conexion.query(
            sql,
            function (err, results, fields) {
                if (results) {
                    res.status(200).send({ data: results });
                } else {
                    res.status(500).send({ message: 'ERROR: Inténtelo más tarde' });
                }
            }
        );
    },
    listAlbumsArtistas(req, res) {
        console.log(req.params.id);
     
        var sql='SELECT * FROM album WHERE artist_id=' + req.params.id;
        
        console.log(req.album);
        conexion.query(
            sql,
            function (err, results, fields) {
                if (results) {
                    res.status(200).send({ data: results });
                } else {
                    res.status(500).send({ message: 'ERROR: Inténtelo más tarde' });
                }
            }
        );
    },
    // list(req, res) {
    //     if(req.user.rol=='admin'){
    //         // mostrar toda la info
    //         sql='SELECT * FROM user'
    //     }else{
    //         // mostrar su info
    //         sql='SELECT * FROM user WHERE id='+req.user.sub
    //     }

    //     conexion.query(
    //         'SELECT * FROM album',
    //         function (err, results, fields) {
    //             if (results) {
    //                 res.status(200).send({ data: results });
    //             } else {
    //                 res.status(500).send({ message: 'ERROR: Inténtelo más tarde' });
    //             }
    //         }
    //     );
    // },
    delete(req, res) {
        const idAlbum = req.params.id;

        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para eliminar álbumes" });
        }

        conexion.query('DELETE FROM song WHERE album_id = ?', [idAlbum], function (err, resultadosCanciones) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'Error al eliminar canciones relacionadas con el álbum' });
            }
            conexion.query('DELETE FROM album WHERE id = ?', [idAlbum], function (err, resultadosAlbum) {
                if (!err) {
                    if (resultadosAlbum.affectedRows !== 0) {
                        console.log(resultadosAlbum);
                        res.status(200).send({ message: 'Álbum y canciones eliminados' });
                    } else {
                        console.log(resultadosAlbum);
                        res.status(200).send({ message: 'No se encontró álbum para eliminar' });
                    }
                } else {
                    console.log(err);
                    res.status(500).send({ message: 'Error al eliminar álbum' });
                }
            });
        });
    },
    update(req, res) {
        const id = req.params.id;
        const data = req.body;
        const sql = 'UPDATE album SET ? WHERE id=?';

        // Verificar el rol del usuario
        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para actualizar álbumes" });
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
    // uploadImage(req, res) {
    //     const userId = req.params.id;
    //     const file = 'Sin imagen...';

    //     if (req.user.rol !== 'creator' && req.user.rol !== 'admin') {
    //         return res.status(403).send({ message: "No tienes permisos para actualizar la imagen" });
    //     }

    //     console.log(req.files);

    //     if (req.files) {
    //         const filePath = req.files.image.path;
    //         const fileSplit = filePath.split('\\');
    //         const fileName = fileSplit[2];
    //         const ext = fileName.split('\.');
    //         const fileExt = ext[1];

    //         if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif' || fileExt === 'jpeg') {
    //             conexion.query('UPDATE album SET image="' + fileName + '" WHERE id=' + userId,
    //                 function (err, results, fields) {
    //                     if (!err) {
    //                         if (results.affectedRows !== 0) {
    //                             res.status(200).send({ message: 'Imagen actualizada' });
    //                         } else {
    //                             res.status(200).send({ message: 'Error al actualizar' });
    //                         }
    //                     } else {
    //                         console.log(err);
    //                         res.status(500).send({ message: 'Intentelo más tarde' });
    //                     }
    //                 });
    //         } else {
    //             res.status(400).send({ message: 'Formato de imagen no válido. Utilice jpg, png, gif o jpeg.' });
    //         }
    //     } else {
    //         res.status(400).send({ message: 'No se proporcionó ninguna imagen.' });
    //     }
    // },
    // getImage(req, res) {
    //     var image = req.params.image;
    //     var path_file = './uploads/albums/' + image;
    //     console.log(path_file)
    //     if (fs.existsSync(path_file)) {
    //         res.sendFile(path.resolve(path_file));
    //     } else {
    //         console.log(error);
    //         res.status(404).send({ message: 'No existe el archivo' });
    //     }
    // }
    uploadImage(req, res) {
        const albumId = req.params.id;

        // Verificar el rol del usuario
        if (req.user.rol !== 'creator' && req.user.rol !== 'admin') {
            return res.status(403).send({ message: "No tienes permisos para actualizar la imagen" });
        }

        console.log(req.files);

        if (req.files) {
            const filePath = req.files.image.path;
            const fileSplit = filePath.split('\\');
            const fileName = fileSplit[2];
            const ext = fileName.split('\.');
            const fileExt = ext[1];

            if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif' || fileExt === 'jpeg') {
                // Consultar la imagen actual del álbum
                conexion.query('SELECT image FROM album WHERE id = ?', [albumId], function (err, results, fields) {
                    if (!err) {
                        if (results.length !== 0 && results[0].image !== null) {
                            // Si ya hay una imagen, eliminarla antes de subir la nueva
                            const previousImage = results[0].image;
                            const previousImagePath = './uploads/albums/' + previousImage;

                            // Eliminar la imagen anterior
                            fs.unlink(previousImagePath, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.log(unlinkErr);
                                    res.status(500).send({ message: 'Error al eliminar la imagen anterior' });
                                } else {
                                    // Actualizar la base de datos con la nueva imagen
                                    conexion.query('UPDATE album SET image="' + fileName + '" WHERE id=' + albumId,
                                        function (updateErr, updateResults, updateFields) {
                                            if (!updateErr) {
                                                res.status(200).send({ message: 'Imagen actualizada' });
                                            } else {
                                                console.log(updateErr);
                                                res.status(500).send({ message: 'Error al actualizar la imagen en la base de datos' });
                                            }
                                        }
                                    );
                                }
                            });
                        } else {
                            // Si no hay imagen previa, simplemente actualizar la base de datos
                            conexion.query('UPDATE album SET image="' + fileName + '" WHERE id=' + albumId,
                                function (updateErr, updateResults, updateFields) {
                                    if (!updateErr) {
                                        res.status(200).send({ message: 'Imagen actualizada' });
                                    } else {
                                        console.log(updateErr);
                                        res.status(500).send({ message: 'Error al actualizar la imagen en la base de datos' });
                                    }
                                }
                            );
                        }
                    } else {
                        console.log(err);
                        res.status(500).send({ message: 'Error al obtener la imagen actual del álbum' });
                    }
                });
            } else {
                res.status(400).send({ message: 'Formato de imagen no válido. Utilice jpg, png, gif o jpeg.' });
            }
        } else {
            res.status(400).send({ message: 'No se proporcionó ninguna imagen.' });
        }
    },

    getImage(req, res) {
        var image = req.params.image;
        var path_file = './uploads/albums/' + image;
        console.log(path_file)
        if (fs.existsSync(path_file)) {
            res.sendFile(path.resolve(path_file));
        } else {
            console.log(error);
            res.status(404).send({ message: 'No existe el archivo' });
        }
    },

    delImage(req, res) {
        id = req.params.id;
        var sql = "SELECT image FROM album WHERE id = " + id;
        
        conexion.query(sql, function (err, results, fields) {
            if (!err) {
                if (results.length != 0) {
                    if (results[0].image != null) {
                        console.log(results);
                        // Eliminar la imagen física
                        var path_file = './uploads/albums/' + results[0].image;
                        try {
                            // Una vez que la borraste, actualizar y poner un null
                            fs.unlinkSync(path_file);  
                            const updateSql = "UPDATE album SET image = NULL WHERE id = " + id;
                            conexion.query(updateSql, function (updateErr, updateResults) {
                                if (!updateErr) {
                                    console.log("Base de datos actualizada con éxito");
                                    res.status(200).send({ message: "Imagen eliminada" });
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
                        res.status(404).send({ message: "Imagen no encontrada" });
                    }
                } else {
                    res.status(404).send({ message: "Imagen no encontrada" });
                }
            } else {
                console.log(err);
                res.status(500).send({ message: "Intenta más tarde" });
            }
        });
    }
};
