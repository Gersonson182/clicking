const obtenerConexion = require('../db/db');

async function insertarEvento(nombre, id_creador, id_deporte, participantes, descripcion, img, direccion, hora_inicio, fecha_inicio) {
  const connection = await obtenerConexion();
  estado = 1;

  try {
      const [rows] = await connection.query(
          'INSERT INTO evento (nombre, id_creador, id_deporte, participantes, descripcion, img, direccion, hora, fecha_inicio, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [nombre, id_creador, id_deporte, participantes, descripcion, img, direccion, hora_inicio, fecha_inicio, estado]
      );
      
      // Devuelve el insertId
      return rows.insertId;
  } catch (error) {
      // Asegúrate de manejar los errores aquí
      throw error;
  } finally {
      connection.release();
  }
}




async function buscarEventosCreados(id_creador, fechaHoy) {
  let connection;
  try {
    connection = await obtenerConexion();
    const [eventos] = await connection.query(
      `SELECT e.id_evento, e.nombre, e.fecha_inicio, e.hora as hora_inicial, e.participantes, e.descripcion, e.img, e.direccion, d.nombre_deporte
       FROM evento e
       JOIN deportes d ON e.id_deporte = d.id_deporte
       WHERE e.id_creador = ? AND DATE(e.fecha_inicio) = DATE(?) AND e.estado = 1`,
      [id_creador, fechaHoy]
    );
    return eventos;
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release(); // Asegúrate de liberar la conexión en el bloque finally.
  }
}



async function buscarEventosFavoritos(id_usuario) {
  let connection;
  try {

    const fechaActual = new Date().toISOString().split('T')[0];

    connection = await obtenerConexion();
    const [result] = await connection.query(
      `SELECT DISTINCT e.id_evento, e.nombre AS nombre_evento, d.nombre_deporte, u.nombre AS nombre_creador
      FROM favoritos AS f
      JOIN evento AS e ON f.id_deporte = e.id_deporte
      JOIN deportes AS d ON e.id_deporte = d.id_deporte
      JOIN usuarios AS u ON e.id_creador = u.id_usuario
      WHERE f.id_usuario = ?
      AND e.id_creador != ?
      AND e.fecha_inicio = ?
      AND e.estado = 1
      `,
      [id_usuario, id_usuario, fechaActual]
    );
  
    return result;
    
  } catch (error) {
    throw error;
    } finally {
        if (connection) connection.release();
    }
  }
    

  async function buscarTodosEventos(id_usuario) {
    const connection = await obtenerConexion();
  
    const [result] = await connection.query(
      `
      SELECT e.*
      FROM evento AS e
     WHERE e.id_creador != ?
     AND e.estado = 1

      `,
      [id_usuario]
    );
  
    return result;
  }


  async function buscarEventosId(id_deporte, id_usuario) {
    const connection = await obtenerConexion();
    const fechaActual = new Date().toISOString().split('T')[0];
    
    try {
        const [result] = await connection.query(
            `SELECT e.*
            FROM evento e
            JOIN deportes d ON e.id_deporte = d.id_deporte
            WHERE e.id_deporte = ?
                AND e.id_creador != ?
                AND d.estado = 1
                AND e.fecha_inicio = ?
                AND e.estado = 1   
            `,
            [id_deporte, id_usuario,fechaActual]
        );

        return result;
    } finally {
        // Asegurarse de liberar la conexión
        connection.release();
    }
}

async function buscarEventosIdEvento(id_evento) {
  const connection = await obtenerConexion();
  
  try {
      const [result] = await connection.query(
          `SELECT 
          e.id_evento,
          e.nombre,
          e.id_creador,
          e.participantes,
          e.fecha_inicio,
          e.hora,
          e.id_deporte,
          e.descripcion,
          e.direccion,
          e.img,
          d.nombre_deporte
      FROM evento e
      JOIN deportes d ON e.id_deporte = d.id_deporte
      WHERE e.id_evento = ? 
      AND e.estado = 1       
          `,
          [id_evento]
      );

      return result;
  } finally {
      // Asegurarse de liberar la conexión
      connection.release();
  }
}

  

  async function BuscarEventosPadel(id_usuario) {
    const connection = await obtenerConexion();
  
    const [result] = await connection.query(
      `SELECT e.*
      FROM evento e
      JOIN deportes d ON e.id_deporte = d.id_deporte
      WHERE e.id_deporte = 2
        AND e.id_creador != ?
        AND d.estado = 1
        AND e.estado = 1    
      `,
      [id_usuario]
    );
  
    return result;
  }

  async function verificarCreador(id_usuario, id_evento) {
    const connection = await obtenerConexion();

    try {
        const [result] = await connection.query(
            'SELECT 1 FROM evento WHERE id_evento = ? AND id_creador = ?',
            [id_evento, id_usuario]
        );

        console.log('Resultado de la consulta de verificarCreadorEvento:', result);
        return result.length > 0;
    } catch (error) {
        console.error('Error al verificar el creador del evento:', error.message);
        throw new Error('Error al verificar el creador del evento');
    } finally {
        connection.release();
    }
}

  async function buscarEventoUnido(id_usuario) {
    const connection = await obtenerConexion();
  
    const [result] = await connection.query(
      `SELECT 
      e.id_evento,
      e.nombre AS nombre_evento,
      e.fecha_inicio,
      e.hora,
      e.direccion,
      e.descripcion,
      e.img AS imagen_evento,
      u.nombre AS nombre_creador,
      u.img AS imagen_creador
  FROM 
      evento e
  INNER JOIN 
      participantes p ON e.id_evento = p.id_evento
  INNER JOIN 
      usuarios u ON e.id_creador = u.id_usuario
  WHERE 
      p.id_usuario = ?
      AND
      e.estado = 1;
      
      `,
      [id_usuario]
    );
  
    return result;
  }


  async function buscarEventoPorId(id_evento) {
    const connection = await obtenerConexion();
    try {
        const [rows] = await connection.query('SELECT * FROM evento WHERE id_evento = ?', [id_evento]);
        // rows contendrá la información del evento o un arreglo vacío si no se encontró
        if (rows.length > 0) {
            return rows[0];
        }
        // Si el evento no se encuentra, puedes devolver null u otra indicación de que no se encontró
        return null;
    } catch (error) {
        console.error('Error al buscar evento por ID:', error);
        throw error; // O maneja el error como consideres apropiado
    } finally {
        connection.release(); // Asegúrate de liberar la conexión en el bloque finally
    }
}


  async function actualizarEvento(id_evento, nombre, fecha_final, participantes, descripcion, img) {
    const connection = await obtenerConexion();
    try {
    const [result] = await connection.query(
      `UPDATE evento SET nombre = ?, fecha_final = ?, participantes = ?, descripcion = ?, img = ? WHERE id_evento = ?`,
      [nombre, fecha_final, participantes, descripcion, img, id_evento]
    );
    return result.affectedRows > 0;

  } catch (error) {
      
  } finally{
    connection.release();
  }
  } 

  async function actualizarEstadoEvento(estado, id_evento) {
    const connection = await obtenerConexion();
    try {
    const [result] = await connection.query(
      `UPDATE evento SET estado = ? WHERE id_evento = ?`,
      [estado, id_evento]
    );
    return result.affectedRows > 0;

  } catch (error) {
    console.log('el error es: ', error)
      
  } finally{
    connection.release();
  }
  } 
  

  async function eliminarEventoYParticipantes(id_evento) {
    const connection = await obtenerConexion();
    try {
      await connection.beginTransaction();
      await connection.query('DELETE FROM participantes WHERE id_evento = ?', [id_evento]);
      const [resultEvento] = await connection.query('DELETE FROM evento WHERE id_evento = ?', [id_evento]);
      await connection.commit();
      return resultEvento.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
     connection.release();
    }
  }
  
  
module.exports = {
    insertarEvento,
    buscarEventosCreados,
    buscarEventosFavoritos,
    buscarTodosEventos,
    buscarEventoPorId,
    actualizarEvento,
    eliminarEventoYParticipantes,
    buscarEventosId,
    BuscarEventosPadel,
    verificarCreador,
    buscarEventoUnido,
    buscarEventosIdEvento,
    actualizarEstadoEvento
    
}



