const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'mi_secreto_secreto');
    req.usuario = decoded; 
    // El objeto de usuario ahora está disponible en req.usuario
    next();
  } catch (error) {
    res.status(403).json({ mensaje: 'Token inválido' });
    console.log(error);
  }
}

module.exports = verificarToken;
    