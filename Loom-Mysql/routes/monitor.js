const express = require('express');

const router = express.Router();
const controller = require('../controllers/monitor');

router.get('/service', controller.getServiceMonitor);
router.get('/db', controller.getDbMonitor);
router.get('/rpc', controller.getRpcMonitor);
router.get('/syncing', controller.getSyncingMonitor);

module.exports = router;
