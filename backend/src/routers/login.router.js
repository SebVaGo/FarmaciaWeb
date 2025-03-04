const express = require('express');
const { extractUserInfo } = require('../middlewares/ipInformation.middleware.js');

const {
    loginUserHandler
} = require('../controllers/login/index.controller.js');

const loginRouter = express.Router();

loginRouter.post('/user', loginUserHandler);

module.exports = loginRouter;