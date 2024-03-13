const bcrypt = require('bcryptjs');


async function encryptPassword(password) {
    try {
        // Generar el salt para encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        
        // Encriptar la contraseña con el salt generado
        const hashedPassword = await bcrypt.hash(password, salt);
        
        return hashedPassword;
    } catch (error) {
        throw new Error('Error encrypting password: ' + error.message);
    }
}
async function matchPassword(enteredPassword, hashedPassword) {
    try {
        return await bcrypt.compare(enteredPassword, hashedPassword);

    } catch (error) {
        throw new Error('matching password: ' + error.message);
    }
}

module.exports = {
    encryptPassword,
    matchPassword
};
