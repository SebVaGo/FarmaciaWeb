const { sendCode } = require('./sendCode.service');
const { generateCode } = require('./generateCode.service');
const { confirmAccount } = require('./confirmationAccount.service');


module.exports = {
    sendCodeEmailVerification: sendCode,
    generateCodeEmailVerification: generateCode,
    confirmCodeVerification: confirmAccount
};

