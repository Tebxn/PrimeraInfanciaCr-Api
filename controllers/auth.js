const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Tools = require('../utils/jwt');
const Jwt = require('../utils/jwt');

// @desc    Register user
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Encriptar la contraseña
        const encryptedPassword = await Tools.encryptPassword(password);

        // Crear Usuario con la contraseña encriptada
        User.register({ name, email, password, role }, encryptedPassword, (err, result) => {
            if (err) {
                console.error('Error registering user: ' + err);
                return res.status(500).json({ success: false, error: 'Server error' });
            }
            res.status(200).json({ success: true, data: result });
        });
    } catch (error) {
        console.error('Error registering user: ' + error);
        return next(error);
    }
};

// @desc    Login user
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        User.login(email, password, async (err, result, userId) => { // Cambiado el uso de User.login y los parámetros de entrada
            if (!result) {
                return next(new ErrorResponse('Invalid Credentials', 401));
            }

            const payload = { userId };
            await sendTokenResponse(payload, 200, res);
        });
    } catch (error) {
        console.error('Login Error: ' + error);
        return next(error);
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = async (payload, statusCode, res) => {
    try {
        const token = await Jwt.generateJWT(payload);

        const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        if(process.env.NODE_ENV === 'production'){
            options.secure = true;
        }

        res
            .status(statusCode)
            .cookie('token', token, options)
            .json({
                success: true,
                token
            });
    } catch (error) {
        console.error('Error generating JWT: ', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Login user
// @route   GET /api/v1/auth/login
// @access  Public
exports.getMe = async (req, res, next) => {
    try {
        User.getMe(req.user.idUsers, (err, result) => {
            if (err) {
                console.error('Error getting profile: ' + err);
                return res.status(500).json({ success: false, error: 'Server error' });
            }
            res.status(200).json({ success: true, data: result });
        });
    } catch (error) {
        console.error('Error getting profile: ' + error);
        return next(error);
    }
};

  