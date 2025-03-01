const express = require('express');
const { guidToId } = require('../middlewares/guidToId.middleware.js');

const {
    sendCodeEmailVerification,
    confirmCodeVerification
    
} = require('../controllers/account/index.controller.js');

const accountRouter = express.Router();

accountRouter.get('/account/sendCode/:usuario_guid', guidToId, sendCodeEmailVerification);
accountRouter.post('/account/confirmCode' , guidToId, confirmCodeVerification);

module.exports = accountRouter;