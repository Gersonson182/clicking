const jwt = require('jsonwebtoken');

function verifySocketToken(socket, next) {
    const token = socket.handshake.query.token;

    if (!token) {
        return next(new Error('Token no proporcionado'));
    }

    try {
        const decoded = jwt.verify(token, 'mi_secreto_secreto');
        socket.usuario = decoded; // Asociar la información decodificada con el socket
        next();
    } catch (error) {
        next(new Error('Token inválido'));
    }
}

module.exports = verifySocketToken;
