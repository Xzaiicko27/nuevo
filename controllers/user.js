var bcrypt = require('bcrypt-nodejs'); // 
const conn = require('mysql2'); // Libreria para conectar la base de datos 
var jwt = require('../services/jwt'); //importamos el servicio
var fs = require('fs');// Manejo de archivos fileSystem
var path = require('path'); // Rutas o Ubicaciones  
const { error } = require('console');
const { update } = require('./album');

const conexion = conn.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'mydb'
});

module.exports={
    save(req, res) {
        console.log(req.body);
        data = req.body;
        name = data.name;
        username = data.username;
        password = data.password;
        email = data.email;
        if(data.password!='' && data.password!=null && data.username!='' && data.username!=null && data.email!='' && data.email!=null && data.name!='' && data.name!=null){     
            password = bcrypt.hash(data.password, null, null, function (err, hash) {
                if (err) {
                    res.status(500).send({ message: "Intenta nuevamente" });
                } else {
                    password = hash;
                    conexion.query(
                        'INSERT INTO user (username, password, email, name) VALUES("' + username + '", "' + password + '", "' + email + '", "' + name + '")',
                        function (err, results, fields) {
                            if (err) {
                                console.log(err)
                                res.status(200).send({ message: 'Error, algun campo ya está en uso' })
                            } else {
                                res.status(201).send({ message: 'datos guardados' })
                            }
                        }
                    )
                }
            })
        }else{
            res.status(201).send({ message: 'Introduce todos los datos' })
        }
    },
    list(req, res){
        if (req.params.id) {
            console.log(req.params.id);
            sql = 'SELECT * FROM user WHERE id=' + req.params.id;
          } else {
            if (req.user.rol === 'admin') {
              // mostrar toda la info
              sql = 'SELECT * FROM user';
            } else {
              // mostrar su info
              sql = 'SELECT * FROM user WHERE id=' + req.user.sub;
            }
          }
        console.log(req.user);
        conexion.query(
            // 'SELECT * FROM user',
            sql,
            function(err, results, fields) {
                if(results){
                    res.status(200).send({data: results})
                }else{
                    res.status(500).send({message:'ERROR: Intentalo más tarde'})
                }
            }
        );
        // res.status(200).send({message: 'Listado de usuarios'})
    },
    listById(req, res){
        const user = req.user;
        const id = user.sub;
        const sql = `SELECT * FROM user WHERE id = ${id}`;
        conexion.query(sql, (err, results, fields) =>{
            if(!err){
                res.status(200).send({data: results});
            }else{
                res.status(500).send({message: "Volver a intentar"});
            }
        })
    },
    login(req, res) {
        var data = req.body;
        var username = data.username;
        var password = data.password;
        var token = data.token;
    
        conexion.query('SELECT * FROM user WHERE username = ? LIMIT 1', [username], function (err, results, fields) {
            console.log(results);
            if (!err) {
                if (results.length == 1) {
                    bcrypt.compare(password, results[0].password, function (err, check) {
                        if (check) {
                            if (token) {
                                res.status(200).send({ token: jwt.createToken(results[0]) });
                            } else {
                                res.status(200).send({ message: 'Datos correctos' });
                            }
                        } else {
                            res.status(200).send({ message: 'Datos incorrectos' });
                        }
                    });
                } else {
                    console.log(err)
                    res.status(200).send({ message: 'Datos Incorrectos' });
                }
                console.log(err)
                // console.log(results[0].password);
            } else {
                console.log(err)
                res.status(500).send({ message: 'Inténtalo más tarde' });
            }
        });
    },
    // delete(req,res){
    //     id = req.params.id;
        
    //     conexion.query('DELETE FROM user WHERE id = '+id,function (err, results, fields){

    //         if(!err){
    //             if(results.affectedRows!=0){
    //                 console.log(err);
    //                 res.status(200).send({message:"Registro eliminado"})
    //             }else{
    //                 console.log(err);
    //                 res.status(200).send({message:"No se elimino nada"})
    //             }
    //         }else{
    //             console.log(err);
    //             res.status(500).send({message:"Intentalo más tarde"})
    //         }
    //     })
    // },
    delete(req, res) {
        id = req.params.id;

        if (req.user.rol == 'admin') {
            sql = 'DELETE FROM user WHERE id = ' + id;
        } else if (req.user.rol == 'user' || req.user.rol == 'creator') {
            sql = 'DELETE FROM user WHERE id = ' + req.user.sub;
        } else {
            console.log(error);
            return res.status(403).send({ message: "No tienes permisos para realizar esta acción" });
        }
            conexion.query(sql, function (err, results, fields) {
                if (!err) {
                    if (results.affectedRows !== 0) {
                        console.log(err);
                        res.status(200).send({ message: "Registro eliminado" });
                    } else {
                        console.log(err);
                        res.status(200).send({ message: "No se eliminó nada" });
                    }
                } else {
                    console.log(err);
                    res.status(500).send({ message: "Inténtalo más tarde" });
                }
            });
    },
    // update(req, res) {
    //     id = req.params.id;
    //     data = req.body;
    //     var sql = 'UPDATE user SET ? WHERE id=?';
    //     if (data.password) {
    //         bcrypt.hash(data.password, null, null, function (err, hash) {
    //             if (!err) {
    //                 data.password = hash;
    //                 conexion.query(sql, [data, id],
    //                     function (err, results, fields) {
    //                         if (!err) {
    //                             console.log(results);
    //                         } else {
    //                             console.log(err);
    //                         }
    //                     });
    //             }
    //         })
    //     } else {
    //         conexion.query(sql, [data, id],
    //             function (err, results, fields) {
    //                 if (!err) {
    //                     console.log(results);
    //                 } else {
    //                     console.log(err);
    //                 }
    //             });
    //     }
    // },
    update(req, res) {
        console.log(req.params)
        const id = req.params.id;
        const data = req.body;
        console.log(data)
    
        let sql = '';
    
        if (req.user.rol == 'admin') {
            sql = 'UPDATE user SET ? WHERE id = ?';
        } else if (req.user.rol == 'user' || req.user.rol == 'creator') {
            sql = 'UPDATE user SET ? WHERE id = ? AND id = ' + req.user.sub;
        } else {
            console.log(error);
            return res.status(403).send({ message: "No tienes permisos para realizar esta acción" });
        }
    
        if (data.password && data.password!='') {
            bcrypt.hash(data.password, null, null, function (err, hash) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: "Error al cifrar la contraseña" });
                }
                
                data.password = hash;
                
                conexion.query(sql, [data, id], function (err, results, fields) {
                    if (!err) {
                        if (results.changedRows > 0) {
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
            });
        } else {
            // delete data.password;
            console.log(data);
            conexion.query(sql, [data, id], function (err, results, fields) {
                if (!err) {
                    if (results.changedRows > 0) {
                        console.log(results);
                        res.status(200).send({ message: 'Registro actualizado' });
                        console.log(data)
                    } else {
                        console.log(err);
                        res.status(404).send({ message: 'No se encontró el registro para actualizar' });
                    }
                } else {
                    console.log(err);
                    res.status(500).send({ message: 'Error al actualizar el registro' });
                }
            });
        }
    },
    // uploadImage(req, res){
    //     var id = req.params.id;
    //     var file = 'Sin imagen...';
    //     console.log(req.files);
    //     if(req.files){
    //         var file_path= req.files.image.path;
    //         var file_split= file_path.split('\\');
    //         console.log(file_split);
    //         var file_name= file_split[2];
    //         console.log(file_name);
    //         var ext= file_name.split('\.');
    //         var file_ext= ext[1];
    //         if(file_ext=='jpg' ||file_ext=='png' || file_ext=='gif' || file_ext=='jpeg'){
    //             conexion.query('UPDATE user SET imagen="'+file_name+'" WHERE id='+id,
    //             function(err, results, fields){
    //                 if(!err){
    //                     if(results.affectedRows!=0){
    //                         res.status(200).send({message: 'Imagen actualizada'})
    //                     }else{
    //                         res.status(200).send({message: 'Error al actualizar'})
    //                     }
    //                 }else{
    //                     console.log(err);
    //                     res.status(200).send({message: 'intentelo mas tarde'})
    //                 }
    //             });
    //         }else {
    //             res.status(400).send({message: 'Formato de imagen no válido. Utilice jpg, png, gif o jpeg.'});
    //         }
    //     }else {
    //         res.status(400).send({message: 'No se proporcionó ninguna imagen.'});
    //     }
    // },
    // uploadImage(req, res) {
    //     const userId = req.params.id;
    //     const file = 'Sin imagen...';
    
    //     // Verificar el rol del usuario
    //     if (req.user.rol == 'user') {
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
    //             conexion.query('UPDATE user SET imagen="' + fileName + '" WHERE id=' + userId,
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
    uploadImage(req, res) {
        const userId = req.params.id;
    
        // Verificar el rol del usuario
        if (req.user.rol == 'user') {
            return res.status(403).send({ message: "No tienes permisos para actualizar la imagen" });
        }
    
        console.log(req.files);
    
        if (req.files) {
            const filePath = req.files.image.path;
            const fileSplit = filePath.split('\\');
            const fileName = fileSplit[2];
            const ext = fileName.split('\.');
            const fileExt = ext[1];
    
            // Consultar la imagen actual del usuario
            conexion.query('SELECT imagen FROM user WHERE id = ?', [userId], function (err, results, fields) {
                if (!err) {
                    if (results.length !== 0 && results[0].imagen !== null) {
                        // Si ya hay una imagen, eliminarla antes de subir la nueva
                        const previousImage = results[0].imagen;
                        const previousImagePath = './uploads/users/' + previousImage;
    
                        // Eliminar la imagen anterior
                        fs.unlink(previousImagePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.log(unlinkErr);
                                res.status(500).send({ message: 'Error al eliminar la imagen anterior' });
                            } else {
                                // Actualizar la base de datos con la nueva imagen
                                conexion.query('UPDATE user SET imagen="' + fileName + '" WHERE id=' + userId,
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
                        conexion.query('UPDATE user SET imagen="' + fileName + '" WHERE id=' + userId,
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
                    res.status(500).send({ message: 'Error al obtener la imagen actual del usuario' });
                }
            });
        } else {
            res.status(400).send({ message: 'No se proporcionó ninguna imagen.' });
        }
    },        
    getImage(req, res){
        var image = req.params.image;
        var path_file = './uploads/users/'+image;
        console.log(path_file)
        if(fs.existsSync(path_file)){
            res.sendFile(path.resolve(path_file))
        }else{
            console.log(error);
            res.status(404).send({message: 'No existe el archivo'})
        }
    },
    // delImage(req, res){
    //     id=req.params.id; //el usuario no puede borrar la imagen de otro usuario solo la de el, el admin si puede borrar todo
    //     var sql="SELECT imagen from user WHERE id="+id;
    //     conexion.query(sql, function(err, results, fields){
    //         if(!err){
    //             if(results.length!=0){
    //                 //validacion para preguntar al usuario si tiene imagen(que no sea nulo)
    //                 console.log(results);
    //                 if(results[0].imagen!=null){
                    
    //                     var path_file = './uploads/users/'+ results[0].imagen;   
                        
    //                     try {
    //                         fs.unlinkSync(path_file);
    //                         res.status(200).send({message: 'Imagen borrada'})
    //                         //agregar un update para que actualice a null
    //                     } catch (error) {
    //                         console.log(err);
    //                         res.status(200).send({message: 'No se elimino nada'})
    //                     }
    //                 }else{
    //                     console.log(err);
    //                     res.status(404).send({message: 'No encontrado'})
    //                 }
    //             }else{
    //                 console.log(err);
    //                 res.status(404).send({message: 'No encontrado'})
    //             }
    //         }else{
    //             console.log(err);
    //             res.status(500).send({message: 'Intenta más tarde'})
    //         }
    //     })
    // }
    delImage(req, res) {
        id = req.params.id;
        var sql = "SELECT imagen FROM user WHERE id = " + id;
        
        conexion.query(sql, function (err, results, fields) {
            if (!err) {
                if (results.length != 0) {
                    if (results[0].imagen != null) {
                        console.log(results);
                        // Eliminar la imagen física
                        var path_file = './uploads/users/' + results[0].imagen;
                        try {
                            // Una vez que la borraste, actualizar y poner un null
                            fs.unlinkSync(path_file);  
                            const updateSql = "UPDATE user SET imagen = NULL WHERE id = " + id;
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
    },
    
    
}