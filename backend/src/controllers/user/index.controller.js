const { create } = require('./createUser.controller');
const { findAllUsers, findUserByGuid } = require('./findUser.controller');
const { update } = require('./updateUser.controller');

module.exports = {
    createUser: create,
    findAllUsers,
    findUserByGuid,
    updateUser: update
};
