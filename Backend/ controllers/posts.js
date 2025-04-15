// Controlador de posts
const { response, request } = require('express');
const { insertarPost,buscarTodosPosts,buscarPostsTodosUser } = require('../db/posts-validators');

const userPost = async (req = request, res = response) => {
  try {
    const idUsuario = req.usuario.id; // Asumiendo que el ID del usuario está disponible en req.usuario.id
    const { titulo, contenido } = req.body;

    const postInsertado = await insertarPost(idUsuario, titulo, contenido);

    res.json({
      msg: 'Post insertado correctamente',
      id: postInsertado.insertId,
      titulo: titulo
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar post. Comuníquese con el administrador del sistema.' });
    console.error(error);
  }
};

const todosPosts = async (req = request, res = response) => {
    try {
      const idUsuario = req.usuario.id; // Asumiendo que tienes el ID del usuario en req.usuario.id
  
      const posts = await buscarTodosPosts(idUsuario);
  
      res.json({
        msg: 'Todos los posts excepto los del usuario',
        posts: posts,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al recuperar posts.' });
      console.error(error);
    }
  };

  const getIDposts = async (req = request, res = response) => {
    try {
      const idUsuario = req.usuario.id; // Asumiendo que tienes el ID del usuario en req.usuario.id
  
      const posts = await buscarPostsTodosUser(idUsuario);
  
      res.json({
        msg: 'Todos los posts incluyendo los del usuario',
        posts: posts,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al recuperar posts.' });
      console.error(error);
    }
  };

module.exports = { userPost,todosPosts, getIDposts };