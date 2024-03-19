const express = require('express');
const {
    updatePassword,
    getAllUsers,
    getSingleUser
} = require('../controllers/user');

const router = express.Router();

const { protect,authorize } = require('../middleware/auth');

router.route('/')
    .put(protect,authorize(1, 2),updatePassword);

router.get('/getAllUsers', getAllUsers);
router.route('/:id')
    .get(getSingleUser);




module.exports = router;