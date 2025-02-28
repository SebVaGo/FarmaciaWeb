const { create } = require('./createUser.controller');
const { findAllUsers, findUserByGuid } = require('./findUser.controller');

module.exports = {
    createUser: create,
    findAllUsers,
    findUserByGuid
};
