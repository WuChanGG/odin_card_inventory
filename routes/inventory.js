let express = require('express');
let router = express.Router();
let cardController = require('../controllers/cardController');

router.get('/', cardController.index);

router.get('/cards', cardController.cardList);

// Card detail router
router.get('/card/:id', cardController.cardDetail)

module.exports = router;