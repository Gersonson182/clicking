const { insertDeportesFavoritos } = require('../db/userdb-validators');
const {actualizarUser} = require('../db/userdb-validators')
const { response, request } = require('express');


const userFav = async (req = request, res = response) => {
    try {
      // Accede al ID del usuario desde req.usuario
      const idUsuario = req.usuario.id;

      const { ids_deportes } = req.body;

      console.log('Estos son los IDs de deportes:', ids_deportes);
      console.log('ID del usuario autenticado:', idUsuario);

      if (ids_deportes.length === 0) {
        // Si el array está vacío, no se realiza la inserción y se responde con un mensaje apropiado.
        res.status(400).json({ msg: 'No se han proporcionado deportes para agregar a favoritos' });
        return;
      }
  
      // Aquí puedes usar el ID del usuario (idUsuario) en tu lógica
      const resultados = await insertDeportesFavoritos(idUsuario, ids_deportes);
      const modificarUsuario = await actualizarUser(idUsuario);
  
      // Envía una respuesta exitosa con un código 200 y un mensaje
      res.status(200).json({ 
        msg: 'Deportes agregados a favoritos y usuario actualizado', 
        resultados, 
        modificarUsuario 
    });
      console.log('Agregado correctamente');
    } catch (error) {
      console.error('Error al agregar deportes a favoritos:', error);
      console.log('Error en agregar', error)
  
      // Envía una respuesta de error con un código 500 y un mensaje
      res.status(500).json({ error: 'Error en el servidor', error });
      console.log('Error en el servidor', error);
    }
};

module.exports = {
  userFav
};
