const Jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = await Jwt.verify(token, process.env.JWT_SECRET);
        console.log(`DECODED:   ${decoded.userId}`.cyan);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        if (user.idUsers === decoded.userId) {
            req.user = user;
            next();
          } else {
            return next(new ErrorResponse('Not authorized to access this route', 401));
          }
    } catch (error) {
        return next(new ErrorResponse('Unauthorized', 401)); 
    }
};

//Grant access to specific routes
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to acces this route`, 403));
        }
        next();
    }
}