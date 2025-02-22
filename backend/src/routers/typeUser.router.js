const express = require('express');
const {typeUserController, alterUserController} = require('../controllers/typeUser/index.controller.js');
const {getAllRoles, getRoleById} = require('../controllers/typeUser/find.controller.js');
const {deleteTypeUser} = require('../controllers/typeUser/delete.controller.js');

const userRouter = express.Router();

userRouter.post('/type/create', typeUserController);
userRouter.put('/type/alter', alterUserController);
userRouter.get('/type/all', getAllRoles);
userRouter.get('/type/:roleId', getRoleById);
userRouter.delete('/type/delete/:roleId', deleteTypeUser);

module.exports = userRouter;