const express = require('express');
const {
    updatePassword,
    getAllUsers,
    getSingleUser,
    updateUser,
    changeStatus
} = require('../controllers/user');

const router = express.Router();

const { protect,authorize } = require('../middleware/auth');

router.route('/')
    .put(protect,authorize(1, 2),updatePassword);

router.get('/getAllUsers', getAllUsers);
router.put('/changeStatus/:id', changeStatus);
router.route('/:id')
    .get(getSingleUser)
    .put(updateUser);





module.exports = router;