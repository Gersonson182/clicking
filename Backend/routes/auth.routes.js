const {Router} = require ('express');
const {check} = require ('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');


const { login } = require('../ controllers/auth');

const router = Router();

router.post('/login',[
    check('correo', 'Correo no valido').isEmail(),
    check('password', 'Contraseña no valida').not().isEmpty(),
    validarCampos
], login  )



module.exports = router;