// followers.controller.js
const { response, request } = require('express');
const { agregarSeguidor, obtenerAmigos } = require('../db/followersdb-validators');
const io = require('../helpers/ioInstance').getIo(); 

const followerPost = async (req = request, res = response) => {
  try {
    const uid =  req.usuario.id; // ID del seguidor, extraído del token JWT
    const {followingId}  = req.body; // ID del usuario a seguir

    const resultado = await agregarSeguidor(uid, followingId);

    if (resultado.success) {
           // Notificar a los clientes a través de Socket.IO
      io.emit('update', { type: 'new_follower', data: { followerId: uid, followingId } });
      res.json({ msg: 'Seguidor agregado correctamente' });
    } else {
      res.status(400).json({ msg: resultado.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno al agregar seguidor.' });
    console.error(error);
  }
};

const buscarAmigos = async (req, res) => {
  try {
    const id = req.params.id; // Asumiendo que tienes el ID del usuario en req.usuario.id

    const resultado = await obtenerAmigos(id);

    if (resultado.success) {
      // Enviar los amigos al cliente
      res.json({ amigos: resultado.amigos });
    } else {
      res.status(400).json({ msg: resultado.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno al buscar amigos.' });
    console.error(error);
  }
};

module.exports = {
  followerPost,
  buscarAmigos
};
