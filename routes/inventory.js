let express = require('express');
let router = express.Router();
let cardController = require('../controllers/cardController');

router.get('/', cardController.index);

router.get('/cards', cardController.cardList);

router.get('/card/create_creature', cardController.cardCreateCreatureGet);

router.get('/card/delete/:id', cardController.cardDeleteGet);

router.post('/card/delete/:id', cardController.cardDeletePost);
// Card detail router
router.get('/card/:id', cardController.cardDetail);

router.post('/card/create_creature', cardController.creatureCardCreatePost);

module.exports = router;