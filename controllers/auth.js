const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Jwt = require('../utils/jwt');
const Bcrypt = require('../utils/bcrypt');
const Crypto = require('../utils/crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Encriptar la contraseña
        const encryptedPassword = await Bcrypt.encryptPassword(password); // 10 es el número de rondas de hashing

        // Crear Usuario con la contraseña encriptada
        await User.register({ name, email, password, role }, encryptedPassword);

        res.status(200).json({ success: true, data: req.body }); // Aquí se utiliza req.body en lugar de result
    } catch (error) {
        console.error('Error registering user: ' + error);
        return res.status(500).json({ success: false, error: 'Server error' });
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

        const result = await User.login(email, password); // Usar await para obtener el resultado de User.login

        if (!result) {
            return next(new ErrorResponse('Invalid Credentials', 401));
        }

        const payload = { userId: result.idUsers }; // Asumiendo que `result` tiene una propiedad `idUsers` que representa el ID del usuario
        await sendTokenResponse(payload, 200, res);
    } catch (error) {
        console.error('Login Error: ' + error);
        return next(error);
    }
};

// @desc    Get profile
// @route   GET /api/v1/auth/getMe
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const result = await User.getMe(req.user.idUsers);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error getting profile: ' + error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logOut = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        res.status(200).json({ success: true});
    } catch (error) {
        console.error('Error logging out ' + error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Forgot Password
// @route   GET /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const resourceData = req.body;

        // Obtener el usuario por su correo electrónico
        const user = await User.findByEmail(resourceData.email);

        if (!user) {
            return next(new ErrorResponse('There is no user with that email', 404));
        }

        // Generar el token de contraseña
        const passwordToken = Crypto.getPasswordToken();

        // Actualizar el token de contraseña en la base de datos
        const updatedUser = await User.forgotPassword(resourceData.email, passwordToken);

        if (!updatedUser) {
            return next(new ErrorResponse('Failed to update password token', 500));
        }

        // Enviar el correo electrónico de recuperación de contraseña
        const message = `Has recibido este mensaje debido a que has solicitado el acceso a tu cuenta o cambiar tu contraseña. Por favor ingresa el siguiente codigo de activacion: ${passwordToken}`;
        await sendEmail({
            email: user.email,
            subject: 'Codigo de verificacion de cuenta',
            message
        });

        res.status(200).json({ success: true, data: 'Email Sent' });
    } catch (error) {
        console.error('Error resetting password: ' + error);
        return next(new ErrorResponse('Failed to reset password', 500));
    }
};

// @desc    Change Password
// @route   put /api/v1/auth/changePassword
// @access  Public
exports.changePassword = async (req, res, next) => {
    try {
        const { email, password, passwordToken } = req.body;
        console.log(passwordToken);
        
        if (!email || !password || !passwordToken) {
            return next(new ErrorResponse('Please provide an email, password, and activation code', 400));
        }

        const user = await User.findByEmail(email);

        if (!user) {
            return next(new ErrorResponse('There is no user with that email', 404));
        }

        if (passwordToken !== user.passwordToken) {
            return next(new ErrorResponse('Activation code: Not valid', 401));
        }

        if (new Date(user.passwordToken) > new Date()) {
            return next(new ErrorResponse('Activation code: Valid time passed', 401));
        }

        await User.changePassword(email, password);

        res.status(200).json({ success: true, data: 'Password changed' });
    } catch (error) {
        console.error('Error resetting password: ', error);
        return next(new ErrorResponse('Failed to reset password', 500));
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
  