const crypto = require('crypto');

//Generate password token
function getPasswordToken(){
    const resetToken = crypto.randomBytes(5).toString('hex');
    return resetToken;
  }
  //Generate password token expiration
  function getPasswordTokenExpiration() {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 10);

    // Formatear la fecha y hora en el formato YYYY-MM-DD HH:MM:SS
    const formattedExpiration = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    return formattedExpiration;
}


  module.exports = {
    getPasswordToken,
    getPasswordTokenExpiration
};