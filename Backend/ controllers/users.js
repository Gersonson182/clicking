const { response, request} = require ('express');
const bcryptjs = require('bcryptjs');
const {insertarUsuario,insertarUsuario_admin, verificarCorreoExistente, actualizarUsuario,buscarUsuariosAleatorios,eliminarUsuario,
  buscarUsuariosPorID,actualizarUser, buscarPerfil} = require('../db/userdb-validators');



  const usersGet = async (req, res) => {
    try {
      // Obtén el ID del usuario autenticado a través del middleware 'verificarToken'
      const idUsuarioAutenticado = req.usuario.id;

      // Pasa el ID del usuario autenticado a la función
      const usuarios = await buscarUsuariosAleatorios(10, idUsuarioAutenticado);

      res.json({
        msg: 'Usuarios aleatorios',
        usuarios: usuarios
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al recuperar usuarios.' });
      console.error(error);
    }
};


  const usersGetPoID = async (req = request, res = response) => {
    try {
      const id_usuario = req.params.id_usuario;
      const usuarios = await buscarUsuariosPorID(id_usuario);
      res.json({
        msg: `Usuario con ID ${id_usuario} obtenidos con éxito`,
        usuarios: usuarios
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al recuperar usuarios.' });
      console.error(error);
    }
  };


  const userPerfil = async (req = request, res = response) => {
    try {
      const id_usuario = req.usuario.id;
      const usuarios = await buscarPerfil(id_usuario);
      res.json({
        msg: `Usuario con ID ${id_usuario} obtenidos con éxito`,
        usuarios: usuarios
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al recuperar usuarios.' });
      console.error(error);
    }
  };
  
  

const usersPostAdmin = async (req, res) => {

    try {
      const { nombre, id_rol, correo, password, edad, google, img} = req.body;
      const hashedContraseña = await bcryptjs.hash(password, 10);
      const correoExistente = await verificarCorreoExistente(correo);
  
      if (correoExistente) {
        res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      } else {
        const estado = 1; // Asigna 1 aquí
        const usuarioInsertado = await insertarUsuario_admin(nombre, id_rol, correo, hashedContraseña, edad, google, img, estado);

        
        res.json({
          msg: 'Se insertó correctamente',
          id: usuarioInsertado.insertId,
          correo: correo
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar usuario. Comuníquese con el administrador del sistema.' });
      console.error(error);
    }
  };


  const userPost = async (req, res) => {
    try {
      const { nombre, correo, password, edad, google, img, genero} = req.body;
      const hashedContraseña = await bcryptjs.hash(password, 10);
      const correoExistente = await verificarCorreoExistente(correo);
  
      if (correoExistente) {
        res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      } else {
        const estado = 0; // Se asigna 0 aquí
        const usuarioInsertado = await insertarUsuario(nombre, correo, hashedContraseña, edad, google, img, estado, genero);

        
        res.json({
          msg: 'Se insertó correctamente',
          id: usuarioInsertado.insertId,
          correo: correo
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar usuario. Comuníquese con el administrador del sistema.' });
      console.error(error);
    }
  };
  
  

const usersPut = async (req = request, res = response) =>{

    try{

    const {id} = req.params;
    const { nombre, id_rol, correo, password, edad, google, img } = req.body;
    const hashedContraseña = await bcryptjs.hash(password, 10);
    
    const usuarioActualizado = await actualizarUsuario(nombre, id_rol, correo, hashedContraseña, edad, google, img, id);

    if (usuarioActualizado && id_rol == 1) {
        // Devuelve una respuesta exitosa
        res.json({
          msg: 'Usuario actualizado correctamente',
          id: id
        });
      } else {
        // Si no se actualizó ningún registro (porque el ID no existe, por ejemplo), devuelve un error
        res.status(404).json({ error: 'El usuario no se encontró o no tiene los permisos para hacer esta acción.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario. Comuníquese con el administrador del sistema.' });
      console.error(error);
    }
  };


  const userPutEstado = async (req = request, res = response) =>{

    try{

    const {id} = req.params;
    
    const estadoActualizado = await actualizarUser(id);

    if (estadoActualizado) {
        // Devuelve una respuesta exitosa
        res.json({
          msg: 'Usuario actualizado correctamente en el estado = 1',
          id: id
        });
      } else {
        // Si no se actualizó ningún registro (porque el ID no existe, por ejemplo), devuelve un error
        res.status(404).json({ error: 'El usuario no se encontró o no tiene los permisos para hacer esta acción.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario. Comuníquese con el administrador del sistema.' });
      console.error(error);
    }
  };


const usersDelete = async (req = request, res = response) =>{

    try {
    
        const {id} = req.params;
        const usuarioEliminar = await eliminarUsuario(0, id); // Establece estado en 0 para eliminar o 1 para desactivar, según corresponda.

        if (usuarioEliminar) {
            // Devuelve una respuesta exitosa
            res.json({
              msg: 'Usuario eliminado correctamente',
              id: id
            });
          } else {
            // Si no se actualizó ningún registro (porque el ID no existe, por ejemplo), devuelve un error
            res.status(404).json({ error: 'El usuario no se encontró o no tiene los permisos para hacer esta acción.' });
          }
        
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario. Comuníquese con el administrador del sistema.' });
        console.error(error);
    }

    
}

const usersPath = (req = request, res = response) =>{

    res.json({
        msg: 'Peticion path - controlador'
    });
}

module.exports = {
    usersGet,
    usersPostAdmin,
    usersPut,
    usersDelete,
    usersPath,
    userPost,
    usersGetPoID,
    userPutEstado,
    userPerfil

}