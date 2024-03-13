const express = require('express');
const {
    getResources, 
    getResource, 
    createResource, 
    updateResource, 
    deleteResource
} = require('../controllers/resources');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(getResources)
    .post(protect, createResource);

router.route('/:id')
    .get(getResource)
    .put(protect, updateResource)
    .delete(protect, deleteResource)

module.exports = router;