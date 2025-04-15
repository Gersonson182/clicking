const { response, request } = require('express');
const { insertarEvento, buscarEventosCreados, buscarEventosFavoritos,
  buscarTodosEventos,buscarEventoPorId,
  actualizarEvento,eliminarEventoYParticipantes, buscarEventosId,
  buscarEventosIdEvento, verificarCreador,buscarEventoUnido,
  actualizarEstadoEvento } = require('../db/eventodb-validation');

const { getIo } = require('../helpers/ioInstance');

const createEvent = async (req = request, res = response) => {
  try {

    const { nombre, id_deporte, participantes, descripcion, img, direccion } = req.body;
    const id_creador = req.usuario.id;

    const expresionRegularFecha = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;

    const expresionRegularHora = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

     // Constante de la fecha_inicio
    const fecha_inicio = req.body.fecha_inicio;

    const hora_inicio = req.body.hora_inicio

    // Validar fecha_inicio
if (!expresionRegularFecha.test(fecha_inicio)) {
  res.status(400).json({ error: 'El formato de fecha (YYYY-MM-DD)' });
  return;
}

if (!expresionRegularHora.test(hora_inicio)) {
  res.status(400).json({ error: 'El formato de hora de inicio (HH:MM) no es válido' });
  return;
}
const eventoInsertado = await insertarEvento(nombre, id_creador,id_deporte, participantes,descripcion,img,direccion,hora_inicio,fecha_inicio);

const eventData = {
  id_evento: eventoInsertado, 
  nombre,
  id_deporte,
  participantes,
  descripcion,
  img,
  direccion,
  hora_inicio,
  fecha_inicio
 
};

// Obtén la instancia de 'io' y emite el evento
const io = getIo();
console.log('Evento a emitir:', eventData);
io.emit('evento-creado', eventData);

      res.json({
        msg: 'Se insertó correctamente',
        id: eventoInsertado.insertId,
      });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar evento. Comuníquese con el administrador del sistema.' });
    console.error(error);
  }
};


// Buscara los eventos creados DEL USUARIO
const getEventoCreadoId = async (req, res) => {
  // Definición de las funciones formatDate y formatTime
const formatDate = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const formatTime = (time) => {
  return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
};

  try {
    const id_creador = req.usuario.id; 
    const fechaHoy = formatDate(new Date()); // Obtiene la fecha de hoy en el formato correcto.
    const eventosEncontrado = await buscarEventosCreados(id_creador, fechaHoy);

    if (eventosEncontrado.length > 0) { 
      const eventosMapeados = eventosEncontrado.map((evento) => {
      
        const fecha_inicio = evento.fecha_inicio; 
        const hora_inicio = formatTime(new Date(`1970-01-01T${evento.hora_inicial}`)); // Convierte la hora a formato 'HH:MM:SS'.

        return {
          id_evento: evento.id_evento,
          nombre: evento.nombre,
          fecha_inicio: fecha_inicio, // Ya debe estar en formato 'YYYY-MM-DD'.
          hora_inicio: hora_inicio,
          participantes: evento.participantes,
          descripcion: evento.descripcion,
          direccion: evento.direccion,
          img: evento.img,
          nombre_deporte: evento.nombre_deporte
        };
      });

      res.json({
        msg: 'Evento encontrado correctamente',
        id: id_creador,
        fecha: fechaHoy,
        eventos: eventosMapeados,
      });
    } else {
      res.json({
        msg: 'No se encontraron eventos',
        id: id_creador,
        fecha: fechaHoy,
        eventos: [],
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar eventos. Comuníquese con el administrador del sistema.' });
    console.error(error);
  }
};





const deportesGetFavorito = async (req = request, res = response) => {
  
  try {
    const id_usuario  = req.usuario.id; // Obtén el ID del usuario desde los datos de la solicitud

    // Realiza la consulta SQL para obtener los eventos favoritos del usuario
    const eventosFavoritos = await buscarEventosFavoritos(id_usuario);

    res.json({
      msg: 'Eventos favoritos del usuario',
      eventos: eventosFavoritos,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar eventos favoritos.' });
    console.error(error);
  }
};

const todosEventos= async (req = request, res = response) => {
  try {
    const id_usuario  = req.usuario.id; // Obtén el ID del usuario desde los datos de la solicitud

    // Realiza la consulta SQL para obtener los eventos favoritos del usuario
    const todosEventos = await buscarTodosEventos(id_usuario);

    res.json({
      msg: 'Todos los eventos exceptuando sus favoritos del usuario',
      eventos: todosEventos,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar eventos favoritos.' });
    console.error(error);
  }
};

const eventoPorId = async (req, res) => {
  try {
    const id_deporte = req.params.id_deporte;
    const id_usuario = req.usuario.id; // Obtiene el id del usuario del JWT

    const eventos = await buscarEventosId(id_deporte, id_usuario);

    res.json({
      msg: `Eventos del deporte con ID ${id_deporte} obtenidos con éxito`,
      eventos: eventos,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar eventos.' });
    console.error(error);
  }
};


const eventoPorIDEvento= async (req = request, res = response) => {
  try {
    const id_evento = req.params.id_evento;
    // Obtén el ID del usuario desde los datos de la solicitud

    // Realiza la consulta SQL para obtener los eventos favoritos del usuario
    const eventoporIDevento = await buscarEventosIdEvento(id_evento);

    res.json({
      msg: 'Eventos por id evento',
      eventos: eventoporIDevento,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar eventos Padel.' });
    console.error(error);
  }
};




const EventoQueParticipaElUser= async (req = request, res = response) => {
  try {
    const id_usuario  = req.usuario.id; // Obtén el ID del usuario desde los datos de la solicitud

    // Realiza la consulta SQL para obtener los eventos favoritos del usuario
    const evento = await buscarEventoUnido(id_usuario);

    res.json({
      msg: 'Eventos unido por el usuario',
      eventos: evento,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar eventos unido por el usuario.' });
    console.error(error);
  }
};


const eventoPut = async (req = request, res = response) =>{

  try {
    const id_usuario = req.usuario.id;
    const id_evento = req.params.id_evento;
    const { nombre,fecha_final, participantes, descripcion, img } = req.body;

    // Verifica si el evento existe y si el usuario actual es el creador
    const evento = await buscarEventoPorId(id_evento);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    if (evento.id_creador !== id_usuario) {
      return res.status(403).json({ error: 'No tiene permiso para editar este evento' });
    }

    // lógica de actualización del evento aquí
    const resultado = await actualizarEvento(id_evento, nombre,fecha_final, participantes, descripcion, img );

    res.json({ message: 'Evento actualizado con éxito',
               resultado: resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el evento' });
    console.error(error);
  }

}


const eventoPutEstado = async (req = request, res = response) =>{

  try {
    const id_usuario = req.usuario.id;
    const id_evento = req.params.id_evento;
    const estado = 2;

    // Verifica si el evento existe y si el usuario actual es el creador
    const evento = await buscarEventoPorId(id_evento);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    if (evento.id_creador !== id_usuario) {
      return res.status(403).json({ error: 'No tiene permiso para editar este evento' });
    }

    // lógica de actualización del evento aquí
    const resultado = await actualizarEstadoEvento(estado, id_evento);

    res.json({ message: 'Estado actualizado con éxito',
               resultado: resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado' });
    console.error(error);
  }

}

const eventoDelete = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const id_evento = req.params.id_evento;

    const evento = await buscarEventoPorId(id_evento);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (evento.id_creador !== id_usuario) {
      return res.status(403).json({ error: 'No tiene permiso para eliminar este evento' });
    }

    const eliminado = await eliminarEventoYParticipantes(id_evento);
    if (eliminado) {
      return res.json({ message: 'Evento y participantes eliminados con éxito' });
    } else {
      return res.status(500).json({ error: 'Error al eliminar el evento y participantes' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el evento' });
  }
};


const buscarCreador = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const id_evento = req.params.id_evento;

    const evento = await buscarEventoPorId(id_evento);
    if (!evento) {
      return res.status(404).json({ esCreador: false });
    }

    const esCreador = evento.id_creador === id_usuario;
    return res.json({ esCreador });

  } catch (error) {
    console.error('Error al buscar creador:', error);
    return res.status(500).json({ esCreador: false });
  }
};


module.exports = {
  createEvent,
  getEventoCreadoId,
  deportesGetFavorito,
  todosEventos,
  eventoPut,
  eventoDelete,
  eventoPorId,
  eventoPorIDEvento,
  EventoQueParticipaElUser,
  eventoPutEstado,
  buscarCreador
};