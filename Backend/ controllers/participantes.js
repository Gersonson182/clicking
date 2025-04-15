const { obtenerEvento, contarParticipantes, insertarParticipante, esParticipanteRegistrado, 
    eliminarParticipante , obtenerEventosPorUsuarioYFecha, obtenerCreadorDelEvento,obtenerParticipantesYConteo,
    obtenerParticipantes} = require('../db/participantesdb-validators');


    const { getIo } = require('../helpers/ioInstance');
   
  
  const participantePost = async (req, res) => {
    try {
      const idUsuario = req.usuario.id;
      const idEvento = parseInt(req.params.idEvento, 10); 
      const fechaActual = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato 'YYYY-MM-DD'
  
      console.log('Iniciando función participantePost');
      console.log('ID del usuario:', idUsuario);
      console.log('ID del evento:', idEvento);
      console.log('Fecha actual:', fechaActual);
  
      const idCreador = await obtenerCreadorDelEvento(idEvento);
  
      console.log('ID del creador del evento:', idCreador);
  
      if (idUsuario === idCreador) {
        console.log('El usuario intentó unirse a su propio evento.');
        return res.status(400).json({ error: 'No puedes unirte a tu propio evento.' });
      }
  
      const eventosDelDia = await obtenerEventosPorUsuarioYFecha(idUsuario, fechaActual);
  
      console.log('Eventos del día para el usuario:', eventosDelDia);
  
      if (eventosDelDia.length >= 2) {
        console.log('El usuario ya tiene 2 eventos registrados para hoy.');
        return res.status(400).json({ error: 'Solo puedes unirte a un máximo de 2 eventos por día.' });
      }
  
      if (isNaN(idUsuario) || isNaN(idEvento)) {
        console.log('ID de usuario o evento no válido.');
        return res.status(400).json({ error: 'ID de usuario o evento no válido' });
      } 


      console.log('ID del usuario:', idUsuario);
      console.log('ID del evento:', idEvento);

      console.log('Tipo de ID del usuario:', typeof idUsuario);
      console.log('Tipo de ID del evento:', typeof idEvento);

      if (typeof idUsuario !== 'number' || typeof idEvento !== 'number') {
        // Manejar error, uno de los parámetros no es un número
        return res.status(400).json({ error: 'Parámetros inválidos' });
      }
      
      
      const yaRegistrado = await esParticipanteRegistrado(idEvento);
;
  
      console.log('¿El usuario ya está registrado en el evento?', yaRegistrado);
  
      if (yaRegistrado) {
        console.log('El usuario ya está registrado en este evento.');
        return res.status(400).json({ error: 'El usuario ya está registrado en este evento.' });
      }
  
      const evento = await obtenerEvento(idEvento);
  
      console.log('Información del evento obtenida:', evento);
  
      if (!evento) {
        console.log('El evento no se encuentra disponible.');
        return res.status(400).json({ error: 'El evento no se encuentra disponible' });
      }
  
      const cantidadParticipantes = await contarParticipantes(idEvento);

      console.log('Cantidad de participantes en el evento:', cantidadParticipantes);
      console.log('Capacidad máxima de participantes en el evento:', evento.participantes);

// Comprueba si la cantidad de participantes es mayor o igual a la capacidad máxima.
      if (cantidadParticipantes >= evento.participantes) {
      console.log('El evento ha superado la capacidad máxima de participantes.');
      return res.status(400).json({ error: 'El evento ha superado la capacidad máxima' });
      }

// Si no se ha superado la capacidad, procede a insertar el participante.
      await insertarParticipante(idUsuario, idEvento);

  console.log('El participante se ha registrado exitosamente.');
  res.status(200).json({ msg: 'Participante añadido exitosamente' });
  

  const io = getIo();
  io.emit('eventoParticipado', { idEvento });
  
    } catch (error) {
      console.error('Error en la función participantePost:', error);
      res.status(500).json({ error: 'Error al registrar el participante. Comuníquese con el administrador del sistema.' });
    }
    
  };
  
  

const expulsarParticipante = async (req, res) => {
    try {
        const id_evento = req.params.id_evento;
        const id_usuario = req.params.id_usuario;

        // Validar que idUsuarioAEspulsar y idEvento son números válidos
        if (isNaN(id_evento) || isNaN(id_usuario)) {
            return res.status(400).json({ error: 'ID de usuario o evento no válido' });
        }

        // Confirmar que el usuario a expulsar está registrado en el evento
        const estaRegistrado = await esParticipanteRegistrado(id_usuario, id_evento);
        if (!estaRegistrado) {
            return res.status(404).json({ error: 'El usuario no está registrado en este evento' });
        }

        // Expulsar al participante (eliminar de la BD)
        await eliminarParticipante(id_usuario, id_evento);

        res.status(200).json({ msg: 'Participante expulsado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al expulsar al participante. Comuníquese con el administrador del sistema.' });
    }
};

const salirDelEvento = async (req, res) => {
  try {
      const id_evento = req.params.id_evento;
      const id_participante = req.usuario.id;

      // Validar que idUsuarioAEspulsar y idEvento son números válidos
      if (isNaN(id_participante) || isNaN(id_evento)) {
          return res.status(400).json({ error: 'ID de usuario o evento no válido' });
      }

      // Confirmar que el usuario a expulsar está registrado en el evento
      const estaRegistrado = await esParticipanteRegistrado(id_participante, id_evento);
      if (!estaRegistrado) {
          return res.status(404).json({ error: 'El usuario no está registrado en este evento' });
      }

      // Expulsar al participante (eliminar de la BD)
      await eliminarParticipante(id_participante, id_evento);

      res.status(200).json({ msg: 'Has salido con exito' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al salir del evento. Comuníquese con el administrador del sistema.' });
  }
};

const contarParticipantesEventoID = async (req, res) => {
  try {
    const { id_evento } = req.params;
    const participantes = await obtenerParticipantesYConteo(id_evento);
    if (participantes.length > 0) {
      const totalParticipantes = participantes[0].total_participantes;
      res.json({
        msg: 'Información de participantes por ID de evento',
        totalParticipantes: totalParticipantes,
        participantes: participantes.map(p => ({ id: p.id_usuario, nombre: p.nombre }))
      });
    } else {
      res.json({
        msg: 'No hay participantes en este evento',
        totalParticipantes: 0,
        participantes: []
      });
    }

    const io = getIo();
    io.emit('participantesActualizar', { id_evento });
  } catch (error) {
    console.error('Error al obtener información de participantes:', error);
    res.status(500).json({ error: 'Error al obtener información de los participantes del evento.' });
  }
};


const participantesEventos = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const id_evento = req.params.id_evento; 

    const participantes = await obtenerParticipantes(id_usuario, id_evento);

    // Si hay al menos un registro, el usuario está participando en el evento
    if (participantes.length > 0) {
      res.json({ estaParticipando: true });
    } else {
      res.json({ estaParticipando: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al verificar los participantes del evento');
  }
};

module.exports = {
    participantePost,
    expulsarParticipante,
    contarParticipantesEventoID,
    salirDelEvento,
    participantesEventos
}
