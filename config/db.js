const mysql = require('mysql');

const connectDB = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'primerainfanciacr'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log(`MySQL Connected: ${connection.config.host}`);
    });

    return connection;
};

module.exports = connectDB;


