const { response, request} = require ('express');

const {buscarDeportes, insertarDeporte, verificarDeporte, actualizarDeporte, eliminarDeporte} = require('../db/sportdb-validation');



const sportGet = async (req = request, res = response) => {
    try {
      const { page = 1, perPage = 10 } = req.query;
      const pageInt = parseInt(page);
      const perPageInt = parseInt(perPage);
  
      // Verifica que los parámetros sean números válidos
      if (isNaN(pageInt) || isNaN(perPageInt) || pageInt <= 0 || perPageInt <= 0) {
        return res.status(400).json({ error: 'Parámetros de paginación inválidos.' });
      }
  
      const { totalCount, deporte } = await buscarDeportes(pageInt, perPageInt);
  
      res.json({
        msg: 'Página de Deportes',
        page: pageInt,
        perPage: perPageInt,
        deporteTotal: totalCount,
        deporte: deporte
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al recuperar deportes.' });
      console.error(error);
    }
  };
  
  

const sportPost = async (req, res) => {

    try {
      const { nombre } = req.body;
     
      const deporteExiste = await verificarDeporte(nombre);
  
      if (deporteExiste) {
        res.status(400).json({ error: 'El deporte ya esta registrado' });
      } else {
        const estado = 1; // Asigna 1 aquí
        const deporteInsertado = await insertarDeporte(nombre,estado);

        res.json({
          msg: 'Se insertó correctamente',
          id: deporteInsertado.insertId,
          nombre: nombre
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar deportes. Comuníquese con el administrador del sistema.' });
      console.error(error);
    }
  };
  

const sportPut = async (req = request, res = response) =>{

    try{

    const {id} = req.params;
    const {nombre, estado} = req.body;

    
    const deporteActualizado = await actualizarDeporte(id, nombre, estado);

    if (deporteActualizado) {
        // Devuelve una respuesta exitosa
        res.json({
          msg: 'Deporte actualizado correctamente',
          id: id
        });
      } else {
        // Si no se actualizó ningún registro (porque el ID no existe, por ejemplo), devuelve un error
        res.status(404).json({ error: 'El Deporte no se encontró o no tiene los permisos para hacer esta acción.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar deporte. Comuníquese con el administrador del sistema.' });
      console.error(error);
    }
  };


const sportDelete = async (req = request, res = response) =>{

    try {
    
        const {id} = req.params;
        const deporteEliminar = await eliminarDeporte(0, id); // Establece estado en 0 para eliminar o 1 para desactivar, según corresponda.

        if (deporteEliminar) {
            // Devuelve una respuesta exitosa
            res.json({
              msg: 'Deporte eliminado correctamente',
              id: id
            });
          } else {
            // Si no se actualizó ningún registro (porque el ID no existe, por ejemplo), devuelve un error
            res.status(404).json({ error: 'El Deporte no se encontró o no tiene los permisos para hacer esta acción.' });
          }
        
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar deporte. Comuníquese con el administrador del sistema.' });
        console.error(error);
    }
}

// const sportGetbyID = async (req = request, res = response) => {
//   try {
//     const { id_deporte } = req.params;
//     const deporte = await buscarDeporteID(id_deporte);

//     if (deporte) {
//       // Devuelve una respuesta exitosa con los detalles del deporte
//       res.json({
//         msg: 'Deporte encontrado correctamente',
//         deporte: deporte, // Agrega los detalles del deporte a la respuesta
//       });
//     } else {
//       // Si no se encontró el deporte, devuelve un error
//       res.status(404).json({ error: 'El Deporte no se encontró o no tiene los permisos para hacer esta acción.' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error al buscar deporte. Comuníquese con el administrador del sistema.' });
//     console.error(error);
//   }
// };


const sportPath = (req = request, res = response) =>{

    res.json({
        msg: 'Peticion path - controlador'
    });
}

module.exports = {
    sportGet,
    sportPost,
    sportPut,
    sportDelete,
    sportPath,
    
}