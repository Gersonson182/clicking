
// followers.service.js
const obtenerConexion = require('../db/db');

const agregarSeguidor = async (uid, followingId) => {

  console.log(uid, followingId);

  if (uid === followingId) {
    return { success: false, message: 'No puedes seguirte a ti mismo.' };
  }

  const conexion = await obtenerConexion();

  try {
    // Verificar que ambos usuarios existen
    const existenUsuarios = 'SELECT COUNT(*) as count FROM usuarios WHERE id_usuario IN (?, ?)';
    const [usuarios] = await conexion.query(existenUsuarios, [uid, followingId]);

    if (usuarios[0].count !== 2) {
      conexion.release(); // Asegúrate de liberar la conexión
      return { success: false, message: 'Uno o ambos usuarios no existen.' };
    }

    // Verificar que no exista ya el seguimiento
    const seguimientoExistente = 'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?';
    const [seguimiento] = await conexion.query(seguimientoExistente, [uid, followingId]);

    if (seguimiento.length > 0) {
      conexion.release(); // Asegúrate de liberar la conexión
      return { success: false, message: 'Ya estás siguiendo a este usuario.' };
    }

    // Insertar el nuevo seguimiento
    const insertSeguimiento = 'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)';
    await conexion.query(insertSeguimiento, [uid, followingId]);
    
    conexion.release(); // Asegúrate de liberar la conexión
    return { success: true };
  } catch (error) {
    conexion.release(); // Asegúrate de liberar la conexión en caso de error
    throw error;
  }
};


const obtenerAmigos = async (id) => {

  const conexion = await obtenerConexion();

  try {
    const consulta = `
      SELECT u.*
      FROM usuarios u
      JOIN followers f ON u.id_usuario = f.following_id
      WHERE f.follower_id = ?
    `;
    const [amigos] = await conexion.query(consulta, [id]);
    conexion.release();
    return { success: true, amigos };
  } catch (error) {
    conexion.release();
    console.error('Error en obtenerAmigos:', error);
    return { success: false, message: 'Error al obtener amigos' };
  }
};


module.exports = { agregarSeguidor,obtenerAmigos };
