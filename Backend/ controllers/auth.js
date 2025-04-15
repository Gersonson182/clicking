
const { verificarUsuario } = require('../db/userdb-validators');
const { validationResult } = require('express-validator');
const generarJWT = require('../helpers/generar-jwt');

const { response } = require('express');
const { OAuth2Client } = require('google-auth-library');
const bcryptjs = require('bcryptjs');

const client = new OAuth2Client('464908573272-am7l8a12cgtilgeghvp1mc8gumrbtsi3.apps.googleusercontent.com');
const obtenerConexion = require('../db/db');

const login = async (req, res = response) => {
    // Manejo de errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { correo, password } = req.body;

    try {
        const usuarioValido = await verificarUsuario(correo, password);
        if (!usuarioValido) {
            return res.status(401).json({ msg: 'Credenciales inválidas o usuario inactivo' });
        }
        
        const token = await generarJWT(usuarioValido.id_usuario);
        return res.json({
            token,
            usuario: usuarioValido,
            msg: 'Usuario conectado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor', error: error.message });
    }
};



const googleAuth = async (req, res = response) => {

    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '464908573272-am7l8a12cgtilgeghvp1mc8gumrbtsi3.apps.googleusercontent.com',
        });

        const { email, name, picture } = ticket.getPayload();

        // Obtener conexión a la base de datos
        const connection = await obtenerConexion();

        // Verificar si el usuario ya existe
        let [rows] = await connection.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
        let usuario;

        if (rows.length === 0) {
            // El usuario no existe, crear un nuevo usuario
            const hashedPassword = await bcryptjs.hash('random', 10); // Genera un password aleatorio para cumplir con la estructura de la tabla
            [rows] = await connection.query('INSERT INTO usuarios (nombre, correo, password, google, img, estado, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, hashedPassword, true, picture, 1, 2 /* id_rol de usuario regular */]);
            usuario = { id_usuario: rows.insertId, nombre: name, correo: email, img: picture };
        } else {
            // El usuario ya existe
            usuario = rows[0];
        }

        // Generar el JWT
        const jwtToken = await generarJWT(usuario.id_usuario);
        return res.json({ token: jwtToken, usuario });

    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: 'Token de Google no es válido' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    login,
    googleAuth
};
