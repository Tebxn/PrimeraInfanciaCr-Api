const express = require('express');
const {
    getResources, 
    getResource, 
    createResource, 
    updateResource, 
    deleteResource
} = require('../controllers/resources');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getResources)
    .post(protect,authorize(1), createResource);

router.route('/:id')
    .get(getResource)
    .put(protect, authorize(1, 2), updateResource)
    .delete(protect,authorize(1), deleteResource)

module.exports = router;