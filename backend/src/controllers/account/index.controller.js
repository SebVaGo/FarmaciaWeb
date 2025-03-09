const { sendCodeAccountConfirmation, sendCodeDeviceConfirmation } = require('./sendCode.controller.js');
const { confirmDeviceCode, confirmAccountCode, confirmCode } = require('./confirmationAccount.controller.js');

module.exports = {
    confirmDeviceCode,
    confirmAccountCode,
    sendCodeAccountConfirmation,
    sendCodeDeviceConfirmation,
    confirmCodeVerification : confirmCode,
};
