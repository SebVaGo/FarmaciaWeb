const express = require('express');
const { createUser, findAllUsers, findUserByGuid, updateUser } = require('../controllers/user/index.controller.js');
const { guidToId } = require('../middlewares/guidToId.middleware.js');

const userRouter = express.Router();

userRouter.post('/create', createUser);
userRouter.get('/find', findAllUsers);
userRouter.get('/find/:usuario_guid', guidToId, findUserByGuid);
userRouter.put('/update', guidToId, updateUser);

module.exports = userRouter;

