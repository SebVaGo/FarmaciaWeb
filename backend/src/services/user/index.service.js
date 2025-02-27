const { createUser } = require('./createUser.service');
const { createUserGUID } = require('./createUserGuid.service');
const { createUserPassword } = require('./createUserPassword.service');

module.exports = {
    createUser,
    createUserGUID,
    createUserPassword
};

