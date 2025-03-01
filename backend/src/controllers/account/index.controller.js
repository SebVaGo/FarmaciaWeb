const { sendCode } = require('./sendCode.controller.js');
const { confirmCode } = require('./confirmationAccount.controller.js');

module.exports = {
    sendCodeEmailVerification: sendCode,
    confirmCodeVerification : confirmCode,
};
