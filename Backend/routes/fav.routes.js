
const {Router} = require ('express');
const verificarToken  = require('../middlewares/verificiar-login');

const {userFav} = require('../ controllers/fav.js');
const router = Router();

// Ruta para agregar deportes favoritos
router.post('/favoritos', verificarToken, userFav);

module.exports = router;