const express = require('express');
const {
    updatePassword
} = require('../controllers/user');

const router = express.Router();

const { protect,authorize } = require('../middleware/auth');

router.put('/updatePassword',protect, authorize(1, 2), updatePassword);

module.exports = router;