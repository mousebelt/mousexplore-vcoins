const express = require('express');

const router = express.Router();
const controller = require('../controllers/loom');

router.get('/blocks', controller.getBlocks);
router.get('/block/:hash', controller.getBlockByHash);
router.get('/blockdetails/:hash', controller.getBlockDetails);
router.get('/transactions', controller.getTransactions);
router.get('/tx/:hash', controller.getTransactionInfo);
router.get('/search/:key', controller.getSearch);

module.exports = router;
