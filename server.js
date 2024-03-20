const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xss = require('xss-clean');
const cookieParser=require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');



// Load env vars
dotenv.config({ path: './config/config.env' });

//  Connect to database
try {
    connectDB();
} catch (err) {
    console.error(`Error connecting to the database: ${err.message}`);
    process.exit(1);
}

// Route files
const resources = require('./routes/resources');
const auth = require('./routes/auth');
const user = require('./routes/user');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
app.use(morgan('dev'));

// Sanitize data

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Mount routes
app.use('/api/v1/resources', resources);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);

// Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow)
);

//  Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    //  Close server & exit process
    server.close(() => process.exit(1));
});
