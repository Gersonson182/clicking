// follower.router.js
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const verificarToken  = require('../middlewares/verificiar-login');
const { userPost, todosPosts,getIDposts } = require('../ controllers/posts');

const router = Router();

router.post('/', verificarToken, userPost);

router.get('/', verificarToken, todosPosts);

router.get('/getTodo', verificarToken, getIDposts);



module.exports = router;