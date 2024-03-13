const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message;
    // Log to console for dev
    console.log(err);
    console.log(err.name);

    if(err.name === 'CastError'){ //ejemplo con error de mongoose no funciona con mysql
        const message = `Resource not found with id o ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    if (err.code === 'RNFONC') {//RESOURCE_NOT_FOUND_OR_NO_CHANGES
        return res.status(404).json({
            success: false,
            error: err.message
        });
    }

    res.status(error.statusCode || 500).json({
        sucess: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;