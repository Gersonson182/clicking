const obtenerFechaHoy = () => {
    const fechaHoy = new Date();
    return fechaHoy.toISOString().slice(0, 10);
  };
  
  module.exports = {
    obtenerFechaHoy,
  };