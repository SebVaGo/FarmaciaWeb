const { create } = require('./createUser.controller');
const { findAllUsers } = require('./findUser.controller');

module.exports = {
    createUser: create,
    findAllUsers
};
