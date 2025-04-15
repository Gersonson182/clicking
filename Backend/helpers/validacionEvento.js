// validation.js
// Tama anda a bañarte
const validarFormatoFechaHora = (fecha_final) => {
  const expresionRegularFechaHora = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  return expresionRegularFechaHora.test(fecha_final);
};

module.exports = {
  validarFormatoFechaHora,
};








