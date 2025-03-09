const express = require('express');
const {
    getTypeCode
} = require('../controllers/typeVerificationCode/index.controller');

const typeCodeRouter = express.Router();

typeCodeRouter.get('/code/:codeId', getTypeCode);

module.exports = typeCodeRouter;