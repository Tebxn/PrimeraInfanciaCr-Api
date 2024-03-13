const ErrorResponse = require('../utils/errorResponse');
const Resource = require('../models/Resource');


// @desc    Get all resources
// @route   GET /api/v1/resources
// @access  Public
exports.getResources = (req, res, next) => {
    try {
        Resource.findAll((err, resources) => {

            res.status(200).json({ success: true, count: resources.length, data: resources });
        });
    } catch (error) {
        return next(error);
    }
}

// @desc    Get one resources
// @route   GET /api/v1/resources/:id
// @access  Public
exports.getResource = (req, res, next) => {
    try {
        const resourceId = req.params.id;
        Resource.findById(resourceId, (err, resource) => {

            if (Array.isArray(resource) && resource.length === 0) {
                return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
            }

            res.status(200).json({ success: true, data: resource });
        });
    } catch (error) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }
}

// @desc    Create resource
// @route   POST /api/v1/resources
// @access  Public
exports.createResource = (req, res) => {
    try {
        const resourceData = req.body;
        Resource.create(resourceData, (err, result) => {
            res.status(201).json({ success: true, data: resourceData }); // Devolver result en lugar de resourceData
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

// @desc    Update Resource
// @route   PUT /api/v1/resources
// @access  Public
exports.updateResource = (req, res, next) => {
    try {
        const resourceId = req.params.id;
        const resourceData = req.body;
        Resource.update(resourceId, resourceData, (err, result) => {
            console.log('Resource:', result);
            
            if (result && result.affectedRows === 0) {
                const error = new Error('Resource not found or no changes made');
                error.code = 'RNFONC';
                return next(error); 
            }

            res.status(200).json({ success: true });
        });
    } catch (error) {
        return next(error);
    }
}

// @desc    Delete Resource
// @route   DELETE /api/v1/resources
// @access  Public
exports.deleteResource = (req, res, next) => {
    try {
        const resourceId = req.params.id;
        Resource.delete(resourceId, (err, result) => {

            if (result && result.affectedRows === 0) {
                const error = new Error('Resource not found or no changes made');
                error.code = 'RNFONC';
                return next(error); 
            }
            res.status(200).json({ success: true });
        });
    } catch (error) {
        return next(error);
    }
}
