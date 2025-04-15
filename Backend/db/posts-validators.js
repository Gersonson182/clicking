// posts-validators.js
const obtenerConexion = require('../db/db');

const insertarPost = async (idUsuario, titulo, contenido) => {
  const conexion = await obtenerConexion();

  try {
    const resultado = await conexion.query('INSERT INTO posts (id_usuario, titulo, contenido) VALUES (?, ?, ?)', [idUsuario, titulo, contenido]);
    console.log('Post insertado exitosamente');
    return resultado[0];
  } catch (error) {
    console.error('Error al insertar el post:', error.message);
    throw new Error('Error al registrar el post');
  } finally {
    conexion.release();
  }
};


const buscarTodosPosts = async (idUsuario) => {
    const conexion = await obtenerConexion();
  
    try {
      const consulta = `
      SELECT p.*, u.nombre AS nombreUsuario
      FROM posts p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_usuario != ?;
      `;
      const [posts] = await conexion.query(consulta, [idUsuario]);
      return posts;
    } catch (error) {
      console.error('Error al buscar todos los posts:', error);
      throw error;
    } finally {
      conexion.release();
    }
  };

  const buscarPostsTodosUser = async (idUsuario) => {
    const conexion = await obtenerConexion();
  
    try {
      const consulta = `
      SELECT p.*, u.nombre AS nombreUsuario
      FROM posts p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_usuario = ?;
      `;
      const [posts] = await conexion.query(consulta, [idUsuario]);
      return posts;
    } catch (error) {
      console.error('Error al buscar los posts del usuario:', error);
      throw error;
    } finally {
      conexion.release();
    }
  };

module.exports = { insertarPost,buscarTodosPosts, buscarPostsTodosUser };
