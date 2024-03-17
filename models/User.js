const db = require('../config/db');
const bcrypt = require('../utils/bcrypt');
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
      connection.query('SELECT idUsers, name, email, password, role FROM users WHERE email = ?', email, async (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null);
          } else {
            const user = results[0];
            try {
              const isMatch = await bcrypt.matchPassword(password, user.password);
              if (isMatch) {
                resolve(user);
              } else {
                resolve(null);
              }
            } catch (error) {
              reject(error);
            }
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
  },
  changePassword: async (email, newPassword) => {
    try {
        const hashPassword = await bcrypt.encryptPassword(newPassword); 

        if (!hashPassword) {
            throw new Error('Hashed password is empty');
        }

        const connection = db();
        const results = await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashPassword, email]);
        
        return results.affectedRows === 0 ? null : results;
    } catch (error) {
        throw error;
    }
},

  getPasswordToken: (email) => {
    return new Promise((resolve, reject) => {
      const passwordTokenExpiration = crypto.getPasswordTokenExpiration();
      const connection = db();
      connection.query('SELECT passwordToken, passwordTokenExpiration FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows === 0 ? null : { passwordToken, passwordTokenExpiration });
        }
      });
    });
  }
};

module.exports = User;


