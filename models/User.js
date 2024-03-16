const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('../utils/crypto');
const { promisify } = require('util');

const User = {
  register: (data, encryptedPassword) => {
    return new Promise((resolve, reject) => {
      const connection = db();
      data.password = encryptedPassword;
      connection.query('INSERT INTO users SET ?', data, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  login: (email, password) => {
    return new Promise((resolve, reject) => {
      const connection = db();
      connection.query('SELECT idUsers, name, email, password, role FROM users WHERE email = ?', email, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null);
          } else {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err || !isMatch) {
                resolve(null);
              } else {
                resolve(user);
              }
            });
          }
        }
      });
    });
  },

  findById: (idUser) => {
    return new Promise((resolve, reject) => {
      const connection = db();
      connection.query('SELECT * FROM users WHERE idUsers = ?', idUser, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length === 0 ? null : results[0]);
        }
      });
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const connection = db();
      connection.query('SELECT * FROM users WHERE email = ?', email, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length === 0 ? null : results[0]);
        }
      });
    });
  },

  getMe: (idUsers) => {
    return new Promise((resolve, reject) => {
        const connection = db();
        connection.query('SELECT * FROM users WHERE idUsers = ?', idUsers, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length === 0 ? null : results[0]);
            }
        });
    });
},

  forgotPassword: (email, passwordToken) => {
    return new Promise((resolve, reject) => {
      const passwordTokenExpiration = crypto.getPasswordTokenExpiration();
      const connection = db();
      connection.query('UPDATE users SET passwordToken = ?, passwordTokenExpiration = ? WHERE email = ?', [passwordToken, passwordTokenExpiration, email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows === 0 ? null : { email, passwordToken, passwordTokenExpiration });
        }
      });
    });
  }
};

module.exports = User;


