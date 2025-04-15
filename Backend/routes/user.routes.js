const {Router} = require ('express');
const {check} = require ('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {verificarRolAdministrador} = require('../middlewares/rol-admin')
const verificarToken  = require('../middlewares/verificiar-login');

 
const {usersGet, 
       usersPostAdmin, 
       usersPut, 
       usersDelete, 
       userPost,
       usersGetPoID,
       userPutEstado,
       userPerfil } = require('../ controllers/users.js');


const router = Router();

router.get('/', 
verificarToken,
usersGet )

router.get('/usuario/:id_usuario', verificarToken, usersGetPoID)

router.get('/perfil', verificarToken, userPerfil)

router.put('/admin/:id',verificarRolAdministrador,[
    check('correo', 'El correo no es valido').isEmail(),
    check('id_rol', 'No es un rol válido').isIn([1]), 
],usersPut)

router.put('/estado/:id', verificarToken, userPutEstado)


router.post('/admin',verificarRolAdministrador,[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({min:6}).not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('id_rol', 'No es un rol válido').isIn([1,2]), 
    validarCampos
], usersPostAdmin)


router.delete('/admin/:id', 
verificarRolAdministrador,
usersDelete)

router.post('/',[
    check('correo', 'El correo no es valido o no puede estar vacio').isEmail().not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({min:6}).not().isEmpty(),
    validarCampos
], userPost)

module.exports = router;