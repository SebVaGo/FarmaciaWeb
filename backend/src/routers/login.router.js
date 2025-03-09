const express = require('express');
const { getIpInformation } = require('../middlewares/ipInformation.middleware.js');

const {
    loginUserHandler
} = require('../controllers/login/index.controller.js');

const loginRouter = express.Router();

loginRouter.post('/user', getIpInformation, loginUserHandler);

module.exports = loginRouter;