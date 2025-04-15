const jwt = require('jsonwebtoken');


const generarJWT = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject('ID no proporcionado');
        } else {
            const payload = { id };

            jwt.sign(payload, 'mi_secreto_secreto', {
                expiresIn: '4h'
            }, (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            });
        }
    });
}

module.exports = generarJWT;