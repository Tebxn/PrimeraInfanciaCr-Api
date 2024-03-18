const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Bcrypt = require('../utils/bcrypt');

// @desc    Get profile
// @route   GET /api/v1/auth/updatePassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {

        const { password, newPassword } = req.body;

        const user = await User.getMe(req.user.idUsers);

        const isMatch = await Bcrypt.matchPassword(password, user.password);
        if(!isMatch){
            return next(new ErrorResponse('Password is incorrect', 401));
        }
        await User.changePassword(user.email, newPassword);

        res.status(200).json({ success: true, data:'Password updated' });
    } catch (error) {
        console.error('Error updating password: ' + error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};