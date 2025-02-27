const express = require('express');
const {
    typeUserController, 
    alterUserController, 
    findAllTypeUserController, 
    findOneTypeUserController, 
    deleteTypeUser
} = require('../controllers/typeUser/index.controller.js');

const typeUserRouter = express.Router();

typeUserRouter.post('/type/create', typeUserController);
typeUserRouter.put('/type/alter', alterUserController);
typeUserRouter.get('/type/all', findAllTypeUserController);
typeUserRouter.get('/type/:roleId', findOneTypeUserController);
typeUserRouter.delete('/type/delete/:roleId', deleteTypeUser);

module.exports = typeUserRouter;