const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  register: (data, encryptedPassword, callback) => {
    const connection = db();
    data.password = encryptedPassword;
    connection.query('INSERT INTO users SET ?', data, callback);
  },
  login: (email, password, callback) => { // Cambiado el parámetro de entrada
    const connection = db();
    connection.query('SELECT idUsers, name, email, password, role FROM users WHERE email = ?', email, (err, results) => { // Cambiado la consulta SQL y el parámetro de entrada
      if (err) {
        return callback(err, null);
      }

      if (results.length === 0) {
        return callback(null, null, null);
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return callback(err, null, null);
        }

        if (!isMatch) {
          return callback(null, null, null);
        }

        callback(null, user, user.idUsers);
      });
    });
  },
  findById: (idUser) => {
    return new Promise((resolve, reject) => {
        const connection = db();
        connection.query('SELECT * FROM users WHERE idUsers = ?', idUser, (error, results) => {
            if (error) {
                reject(error);
            }
            if (results.length === 0) {
                resolve(null); // Devuelve null en lugar de undefined
            }
            const user = results[0];
            console.log('USER DATA: ',user);
            resolve(user); // Devuelve el objeto user correctamente
        });
    });
},
getMe: (idUsers, callback) => {
  console.log(idUsers);
  const connection = db();
  connection.query('SELECT * FROM users WHERE idUsers = ?', idUsers, (error, results) => {
      if (error) {
          callback(error, null);
      }
      if (results.length === 0) {
          callback(null, null); // Devuelve null en lugar de undefined
      }
      const user = results[0];
      console.log('USER DATA: ',user);
      callback(null, user); // Devuelve el objeto user correctamente
  });
}
}; 

module.exports = User;

