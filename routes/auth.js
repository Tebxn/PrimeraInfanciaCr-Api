const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword
} = require('../controllers/auth');

const router = express.Router();

const { protect,authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/getMe', protect,authorize(1, 2), getMe);
router.post('/forgotPassword', forgotPassword);

module.exports = router;