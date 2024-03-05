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
//         name = data.name;
//         description = data.description;

//         conexion.query(
//             'INSERT INTO artist (name, description) VALUES (?, ?)',
//             [name, description],
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
//             'SELECT * FROM artist',
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
//     //     conexion.query('DELETE FROM artist WHERE id = ?', [id], function (err, results, fields) {
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
//         const idArtista = req.params.id;
//         conexion.query('DELETE FROM song WHERE album_id IN (SELECT id FROM album WHERE artist_id = ?)', [idArtista], function (err, resultadosCanciones) {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).send({ message: 'Error al eliminar canciones relacionadas con el artista' });
//             }
//             conexion.query('DELETE FROM album WHERE artist_id = ?', [idArtista], function (err, resultadosAlbumes) {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).send({ message: 'Error al eliminar álbumes relacionados con el artista' });
//                 }
//                 conexion.query('DELETE FROM artist WHERE id = ?', [idArtista], function (err, resultadosArtista) {
//                     if (!err) {
//                         if (resultadosArtista.affectedRows != 0) {
//                             console.log(resultadosArtista);
//                             res.status(200).send({ message: 'Artista, albums y canciones eliminados' });
//                         } else {
//                             console.log(resultadosArtista);
//                             res.status(200).send({ message: 'No se encontró artista para eliminar' });
//                         }
//                     } else {
//                         console.log(err);
//                         res.status(500).send({ message: 'Error al eliminar artista' });
//                     }
//                 });
//             });
//         });
//     },    
//     update(req, res) {
//         const id = req.params.id;
//         const data = req.body;
//         const sql = 'UPDATE artist SET ? WHERE id=?';

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
//     uploadImage(req, res) {
//         var id = req.params.id;
//         var file = 'Sin imagen...';
//         console.log(req.files);
//         if (req.files) {
//             var file_path = req.files.image.path;
//             var file_split = file_path.split('\\');
//             console.log(file_split);
//             var file_name = file_split[2];
//             console.log(file_name);
//             var ext = file_name.split('\.');
//             var file_ext = ext[1];
//             if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif' || file_ext == 'jpeg') {
//                 conexion.query('UPDATE artist SET image="' + file_name + '" WHERE id=' + id,
//                     function (err, results, fields) {
//                         if (!err) {
//                             if (results.affectedRows != 0) {
//                                 res.status(200).send({ message: 'Imagen actualizada' });
//                             } else {
//                                 res.status(200).send({ message: 'Error al actualizar' });
//                             }
//                         } else {
//                             console.log(err);
//                             res.status(500).send({ message: 'Inténtelo más tarde' });
//                         }
//                     });
//             } else {
//                 res.status(400).send({ message: 'Formato de imagen no válido. Utilice jpg, png, gif o jpeg.' });
//             }
//         } else {
//             res.status(400).send({ message: 'No se proporcionó ninguna imagen.' });
//         }
//     }    
// };

const conn = require('mysql2');
const bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

const conexion = conn.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'mydb'
});

module.exports = {
    save(req, res) {
        data = req.body;
        name = data.name;
        description = data.description;

        // Check user permissions
        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para crear artistas" });
        }

        conexion.query(
            'INSERT INTO artist (name, description) VALUES (?, ?)',
            [name, description],
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
        if(req.params.id){
            console.log(req.params.id);
            sql = 'SELECT * FROM artist WHERE id='+ req.params.id;
        }else{
            sql = 'SELECT * FROM artist';
        }
        console.log(req.artist);
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
    delete(req, res) {
        const idArtista = req.params.id;

        // Check user permissions
        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para eliminar artistas" });
        }

        conexion.query('DELETE FROM song WHERE album_id IN (SELECT id FROM album WHERE artist_id = ?)', [idArtista], function (err, resultadosCanciones) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'Error al eliminar canciones relacionadas con el artista' });
            }
            conexion.query('DELETE FROM album WHERE artist_id = ?', [idArtista], function (err, resultadosAlbumes) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: 'Error al eliminar álbumes relacionados con el artista' });
                }
                conexion.query('DELETE FROM artist WHERE id = ?', [idArtista], function (err, resultadosArtista) {
                    if (!err) {
                        if (resultadosArtista.affectedRows !== 0) {
                            console.log(resultadosArtista);
                            res.status(200).send({ message: 'Artista, albums y canciones eliminados' });
                        } else {
                            console.log(resultadosArtista);
                            res.status(200).send({ message: 'No se encontró artista para eliminar' });
                        }
                    } else {
                        console.log(err);
                        res.status(500).send({ message: 'Error al eliminar artista' });
                    }
                });
            });
        });
    },
    update(req, res) {
        const id = req.params.id;
        const data = req.body;
        const sql = 'UPDATE artist SET ? WHERE id=?';

        // Check user permissions
        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para actualizar artistas" });
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
    //     var id = req.params.id;
    //     var file = 'Sin imagen...';
    //     console.log(req.files);

    //     if (req.user.rol !== 'creator' && req.user.rol !== 'admin') {
    //         return res.status(403).send({ message: "No tienes permisos para actualizar la imagen" });
    //     }

    //     if (req.files) {
    //         var file_path = req.files.image.path;
    //         var file_split = file_path.split('\\');
    //         console.log(file_split);
    //         var file_name = file_split[2];
    //         console.log(file_name);
    //         var ext = file_name.split('\.');
    //         var file_ext = ext[1];
    //         if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif' || file_ext == 'jpeg') {
    //             conexion.query('UPDATE artist SET image="' + file_name + '" WHERE id=' + id,
    //                 function (err, results, fields) {
    //                     if (!err) {
    //                         if (results.affectedRows !== 0) {
    //                             res.status(200).send({ message: 'Imagen actualizada' });
    //                         } else {
    //                             res.status(200).send({ message: 'Error al actualizar' });
    //                         }
    //                     } else {
    //                         console.log(err);
    //                         res.status(500).send({ message: 'Inténtelo más tarde' });
    //                     }
    //                 });
    //         } else {
    //             res.status(400).send({ message: 'Formato de imagen no válido. Utilice jpg, png, gif o jpeg.' });
    //         }
    //     } else {
    //         res.status(400).send({ message: 'No se proporcionó ninguna imagen.' });
    //     }
    // }
    uploadImage(req, res) {
        const id = req.params.id;
    
        // Verificar el rol del usuario
        if (req.user.rol !== 'creator' && req.user.rol !== 'admin') {
            return res.status(403).send({ message: "No tienes permisos para actualizar la imagen" });
        }
    
        console.log(req.files);
    
        if (req.files) {
            const file_path = req.files.image.path;
            const file_split = file_path.split(path.sep);
            console.log(file_split);
            const file_name = file_split[2];
            console.log(file_name);
            const ext = file_name.split('.');
            const file_ext = ext[1];
    
            // Consultar la imagen actual del artista
            conexion.query('SELECT image FROM artist WHERE id = ?', [id], function (err, results, fields) {
                if (!err) {
                    if (results.length !== 0 && results[0].image !== null) {
                        // Si ya hay una imagen, eliminarla antes de subir la nueva
                        const previousImage = results[0].image;
                        const previousImagePath = './uploads/artists/' + previousImage;
    
                        // Eliminar la imagen anterior
                        fs.unlink(previousImagePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.log(unlinkErr);
                                res.status(500).send({ message: 'Error al eliminar la imagen anterior' });
                            } else {
                                // Actualizar la base de datos con la nueva imagen
                                conexion.query('UPDATE artist SET image="' + file_name + '" WHERE id=' + id,
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
                        conexion.query('UPDATE artist SET image="' + file_name + '" WHERE id=' + id,
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
                    res.status(500).send({ message: 'Error al obtener la imagen actual del artista' });
                }
            });
        } else {
            res.status(400).send({ message: 'No se proporcionó ninguna imagen.' });
        }
    },
    getImage(req, res) {
        const image = req.params.image;
        const path_file = './uploads/artists/' + image;
        console.log(path_file);

        if (fs.existsSync(path_file)) {
            res.sendFile(path.resolve(path_file));
        } else {
            console.log("Error: Image not found");
            res.status(404).send({ message: 'No existe el archivo' });
        }
    },

    delImage(req, res) {
        const id = req.params.id;
        const sql = "SELECT image FROM artist WHERE id = " + id;

        // Check user permissions
        if (req.user.rol !== 'creator' && req.user.rol !== 'admin') {
            return res.status(403).send({ message: "No tienes permisos para eliminar la imagen" });
        }

        conexion.query(sql, function (err, results, fields) {
            if (!err) {
                if (results.length !== 0) {
                    if (results[0].image !== null) {
                        console.log(results);

                        const path_file = './uploads/artists/' + results[0].image;
                        try {
                            fs.unlinkSync(path_file);

                            const updateSql = "UPDATE artist SET image = NULL WHERE id = " + id;
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
                            res.status(200).send({ message: "No se pudo eliminar la imagen, intenta más tarde" });
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
    },
};
