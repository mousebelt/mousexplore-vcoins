const express = require('express');
const router = express.Router();
const controller = require('../controllers/game');

router.get('/data/:gameAddr', controller.getGame);
router.get('/data', controller.getAllGames);
router.get('/items/:gameAddr', controller.getGameItems);
router.get('/items', controller.getAllItems);
router.get('/search', controller.getSearch);

module.exports = router;
