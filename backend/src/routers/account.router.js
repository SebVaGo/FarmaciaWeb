const express = require('express');
const { guidToId } = require('../middlewares/guidToId.middleware.js');

const {
    confirmAccountCode,
    confirmDeviceCode,
    sendCodeAccountConfirmation,
    sendCodeDeviceConfirmation
} = require('../controllers/account/index.controller.js');

const accountRouter = express.Router();

accountRouter.get('/account/device/sendCode/:email', sendCodeDeviceConfirmation);
accountRouter.post('/account/device/confirmCode', confirmDeviceCode);

/*accountRouter.get('/account/sendCode/:usuario_guid', guidToId, sendCodeEmailVerification);
accountRouter.post('/account/confirmCode' , guidToId, confirmCodeVerification);
accountRouter*/

module.exports = accountRouter;