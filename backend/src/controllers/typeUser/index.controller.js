const {create} = require('./create.controller');
const {alter} = require('./alter.controller');
const {getAllRoles, getRoleById} = require('./find.controller');
const { deleteTypeUser } = require('./delete.controller');

module.exports = {
    typeUserController: create, 
    alterUserController: alter, 
    findAllTypeUserController: getAllRoles, 
    findOneTypeUserController: getRoleById,
    deleteTypeUser : deleteTypeUser
};