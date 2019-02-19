const express = require('express');
const router = express.Router();
const controller = require('../controllers/game');

router.get('/data', controller.getAllGames);
router.get('/data/:gameAddr', controller.getGame);
router.get('/items', controller.getAllItems);
router.get('/items/highestPriced', controller.getHighestPricedItems);
router.get('/items/gameAddr/:gameAddr', controller.getGameItems);
router.get('/search', controller.getSearch);
router.get('/search/items', controller.getSearchItems);

module.exports = router;
