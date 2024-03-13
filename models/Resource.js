const db = require('../config/db');

const Resource = {
  create: (data, callback) => {
    const connection = db();
    connection.query('INSERT INTO resources SET ?', data, callback);
  },
  findAll: (callback) => {
    const connection = db();
    connection.query('SELECT idResources, name, url, imageURL, category, resourceType FROM resources', callback);
  },
  findById: (id, callback) => {
    const connection = db();
    connection.query('SELECT idResources, name, url, imageURL, category, resourceType FROM resources WHERE idResources = ?', id, callback);
  },
  update: (id, data, callback) => {
    const connection = db();
    connection.query('UPDATE resources SET ? WHERE idResources = ?', [data, id], callback); // Corrección de la consulta SQL y los parámetros
  },
  delete: (id, callback) => {
    const connection = db();
    connection.query('DELETE from resources WHERE idResources = ?', id, callback);
  }
};

module.exports = Resource;

