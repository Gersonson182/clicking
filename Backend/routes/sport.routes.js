const {Router} = require ('express');
const {check} = require ('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {verificarRolAdministrador} = require('../middlewares/rol-admin')

 
const {sportGet, 
       sportPost, 
       sportPut, 
       sportDelete, 
      } = require('../ controllers/sports.js');


const router = Router();

router.get('/', 
verificarRolAdministrador,
sportGet )

router.put('/:id',verificarRolAdministrador, sportPut)

router.post('/',[
    verificarRolAdministrador,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], 
sportPost)

router.delete('/:id', 
verificarRolAdministrador,
sportDelete)


module.exports = router;