const jwt = require('jsonwebtoken');
const { obtenerRolUsuarioPorId } = require('../db/userdb-validators'); // Importa la función

async function verificarRolAdministrador(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'mi_secreto_secreto');

    const usuarioId = decoded.id; // Asume que el token incluye el ID del usuario
 
    // Usa la función obtenerRolUsuarioPorId para obtener el rol, nombre y correo del usuario
    const usuario = await obtenerRolUsuarioPorId(usuarioId);
  

    if (!usuario || usuario.id_rol !== 1) {
      return res.status(403).json({ msg: 'No tienes permisos de administrador para realizar esta acción' });
    }

    req.usuario = {
      id: usuarioId,
      rol: usuario.id_rol,
      nombre: usuario.nombre,
      correo: usuario.correo,
    };

    console.log(req.usuario);

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'Token no válido' });
  }
}

module.exports = {
  verificarRolAdministrador,
};
