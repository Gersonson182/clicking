// follower.router.js
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const verificarToken  = require('../middlewares/verificiar-login');
const { followerPost, buscarAmigos } = require('../ controllers/followers');

const router = Router();

router.post('/follower', [
  verificarToken,
  check('followingId', 'El ID del usuario a seguir es obligatorio y debe ser numérico').isNumeric(),
  validarCampos
], followerPost);

router.get('/buscarAmigos/:id', 
  verificarToken,
  validarCampos,
  buscarAmigos);

module.exports = router;
