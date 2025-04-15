const {Router} = require ('express');

const verificarToken  = require('../middlewares/verificiar-login');
const {check} = require ('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {createEvent, getEventoCreadoId, deportesGetFavorito, todosEventos,eventoPut, eventoDelete,
    eventoPorId, eventoPorIDEvento,EventoQueParticipaElUser,eventoPutEstado,
buscarCreador} = require('../ controllers/event')

const router = Router();

router.post('/',[
check('nombre', 'El nombre es obligatorio').not().isEmpty(),
check('fecha_inicio', 'La fecha es obligatorio').not().isEmpty(),
check('participantes', 'Los Participantes es obligatoria y deben ser maximo 10').isLength({max:10}).not().isEmpty(),
check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
validarCampos,
],
verificarToken,
createEvent);

router.get('/EventosCreados', verificarToken, getEventoCreadoId)

router.get('/EventosFavoritos', verificarToken, deportesGetFavorito)

router.get('/TodosEventos', verificarToken, todosEventos)

router.get('/eventoPorId/:id_deporte', verificarToken,eventoPorId)

router.get('/eventoPorIDevento/:id_evento', verificarToken,eventoPorIDEvento)

router.get('/creador/:id_evento', verificarToken, buscarCreador)


router.get('/EventoUnidoUser', verificarToken, EventoQueParticipaElUser)

router.put('/:id_evento', verificarToken, eventoPut)

router.put('/finalizar/:id_evento', verificarToken, eventoPutEstado)

router.delete('/:id_evento', verificarToken,eventoDelete)



module.exports = router;
