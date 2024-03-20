const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword,
    changePassword,
    logOut
} = require('../controllers/auth');

const router = express.Router();

const { protect,authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logOut', logOut);
router.get('/getMe', protect,authorize(1, 2), getMe);
router.post('/forgotPassword', forgotPassword);
router.put('/changePassword', changePassword);

module.exports = router;