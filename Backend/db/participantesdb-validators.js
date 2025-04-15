const obtenerConexion = require('../db/db');


async function esParticipanteRegistrado(idUsuario, idEvento) {

    console.log('idUsuario:', idUsuario, 'idEvento:', idEvento);

    const connection = await obtenerConexion();

    try {
        const [result] = await connection.query('SELECT 1 FROM participantes WHERE id_usuario = ? AND id_evento = ?', [idUsuario, idEvento]);
        console.log('Resultado de la consulta de esParticipanteRegistrado:', result);
        return result.length > 0;
    } catch (error) {
        console.error('Error al verificar si el usuario es participante:', error.message);
        throw new Error('Error al verificar si el usuario es participante');
    } finally {
        connection.release();
    }
}


async function obtenerEvento(idEvento) {
    const connection = await obtenerConexion();

    try {
        const [eventos] = await connection.query('SELECT participantes FROM evento WHERE id_evento = ?', [idEvento]);
        console.log('Resultado de la consulta de obtenerEvento:', eventos);
        return eventos[0];
    } catch (error) {
        console.error('Error al obtener el evento:', error.message);
        throw new Error('Error al obtener el evento');
    }finally {
        connection.release();
    }
}

async function contarParticipantes(idEvento) {

    const connection = await obtenerConexion();
    try {
        const [result] = await connection.query('SELECT COUNT(*) AS count FROM participantes WHERE id_evento = ?', [idEvento]);
        console.log('Resultado de la consulta de contarParticipantes:', result);
        // Devuelve el número real de participantes, no si hay un registro o no.
        return result[0].count; 
    } catch (error) {
        console.error('Error al contar los participantes:', error.message);
        throw new Error('Error al contar los participantes');
    }finally{
        connection.release();
    }
}


async function insertarParticipante(idUsuario, idEvento) {

    const connection = await obtenerConexion();
    
    try {
        await connection.query('INSERT INTO participantes (id_usuario, id_evento) VALUES (?, ?)', [idUsuario, idEvento]);
        console.log('Participante insertado exitosamente');
    } catch (error) {
        console.error('Error al insertar el participante:', error.message);
        throw new Error('Error al registrar al participante');
    }finally{
        connection.release();
    }
}

async function eliminarParticipante(id_usuario, idEvento) {
    const connection = await obtenerConexion();
  
    try {
        await connection.query('DELETE FROM participantes WHERE id_usuario = ? AND id_evento = ?', [id_usuario, idEvento]);
        console.log('Participante eliminado exitosamente');
    } catch (error) {
        console.error('Error al expulsar el participante:', error.message);
        throw new Error('Error al expulsar al participante');
    }finally{
        connection.release();
    }
}

async function obtenerEventosPorUsuarioYFecha(idUsuario, fechaActual) {
    const connection = await obtenerConexion();
  
    const query = `
        SELECT e.* 
        FROM evento e
        JOIN participantes p ON e.id_evento = p.id_evento
        WHERE p.id_usuario = ? AND DATE(e.fecha_inicio) = ?
    `;
    try {
        const [eventos] = await connection.query(query, [idUsuario, fechaActual]);
        console.log('Resultado de la consulta de obtenerEventosPorUsuarioYFecha:', eventos);
        return eventos;
    } catch (error) {
        console.error('Error al obtener eventos por usuario y fecha:', error.message);
        throw new Error('Error al obtener eventos por usuario y fecha');
    }finally{
        connection.release();
    }
}

async function obtenerCreadorDelEvento (idEvento) {
    console.log('ID del evento pasado hacia la base de datos', idEvento);
    const connection = await obtenerConexion();
   
    try {
        const [result] = await connection.query('SELECT id_creador FROM evento WHERE id_evento = ?', [idEvento]);
        console.log('Resultado de la consulta de obtenerCreadorDelEvento:', result);
        return result[0]?.id_creador;
    } catch (error) {
        console.error('Error al obtener el creador del evento:', error.message);
        throw new Error('Error al obtener el creador del evento');
    }finally{
        connection.release();
    }
}



async function obtenerParticipantesYConteo(id_evento) {
    const connection = await obtenerConexion();
    
    try {
      const [result] = await connection.query(
        `SELECT 
        u.id_usuario,
        u.nombre,
        (SELECT COUNT(*) FROM participantes WHERE id_evento = p.id_evento) AS total_participantes
    FROM 
        participantes p
    JOIN 
        usuarios u ON p.id_usuario = u.id_usuario
    WHERE 
        p.id_evento = ?
    GROUP BY 
        u.id_usuario, u.nombre
    `,
         [id_evento]
      );
  
      return result;
    } catch (error) {
      throw error; // Lanzar el error para manejarlo en el catch de contarParticipantesEventoID
    } finally {
      connection.release();
    }
  }



    async function obtenerParticipantes(id_usuario, id_evento) {
        const connection = await obtenerConexion();
        try {
          const query = 'SELECT 1 FROM participantes WHERE id_usuario = ? AND id_evento = ? LIMIT 1';
          const [result] = await connection.query(query, [id_usuario, id_evento]);
          return result;
        } catch (error) {
          throw error;
        } finally {
          connection.release();
        }
      }
    
  


module.exports = {
    obtenerEvento,
    contarParticipantes,
    insertarParticipante,
    esParticipanteRegistrado,
    eliminarParticipante,
    obtenerEventosPorUsuarioYFecha,
    obtenerCreadorDelEvento,
    obtenerParticipantesYConteo,
    obtenerParticipantes
};
