const express = require('express');

const { scanBarcodeController } = require('../controllers/scanController');

const router = express.Router();

router.post('/scan', scanBarcodeController);

module.exports = router;
