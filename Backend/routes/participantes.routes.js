const {Router} = require ('express');
const verificarToken  = require('../middlewares/verificiar-login');

const {
    participantePost,
    expulsarParticipante,
    contarParticipantesEventoID,
    salirDelEvento,
    participantesEventos
} = require('../ controllers/participantes')

const router = Router();

router.post('/:idEvento', verificarToken, participantePost);
router.delete('/expulsar/:id_evento/:id_usuario',verificarToken, expulsarParticipante);
router.delete('/salir/:id_evento',verificarToken, salirDelEvento);
router.get('/eventoPorIDevento/:id_evento/participantes/contar', verificarToken, contarParticipantesEventoID);
router.get('/eventos/:id_evento', verificarToken, participantesEventos);

module.exports = router; 