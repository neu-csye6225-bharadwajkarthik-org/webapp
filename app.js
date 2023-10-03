const express = require('express');
const routes = require('./routes/index');
const {removeCacheFromResponse} = require('./utils/middlewares');
const apiErrorHandler = require('./error/api-error-handler')
// Initialize app
const app = express();

// add route-independent middlewares to app
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(removeCacheFromResponse);

// add routes to app
routes(app);

// add error handling middleware after routes
app.use(apiErrorHandler);

module.exports = app;