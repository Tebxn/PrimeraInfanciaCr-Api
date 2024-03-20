const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Bcrypt = require('../utils/bcrypt');

// @desc    Update Password
// @route   GET /api/v1/user/updatePassword
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

// @desc    Get all users
// @route   GET /api/v1/user/getAllUsers
// @access  Private
exports.getAllUsers = async (req, res, next) => {
    try {
        const user = await User.getAllUsers();
        res.status(200).json({ success: true, data:user });
    } catch (error) {
        console.error('Error updating password: ' + error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Get single user
// @route   GET /api/v1/user/:id
// @access  Private
exports.getSingleUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId); 
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error obtaining single user: ' + error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Update User
// @route   PUT /api/v1/user/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const user = await User.updateUser(userId, userData); 
        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        console.error('Error updating user: ' + error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Disable - enable user
// @route   PUT /api/v1/user/changeStatus/:id
// @access  Private
exports.changeStatus = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await User.changeStatus(userId); 
        res.status(200).json({ success: true, message: 'User status changed successfully' });
    } catch (error) {
        console.error('Error changing status of user: ' + error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

