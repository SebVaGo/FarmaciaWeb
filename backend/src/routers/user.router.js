const express = require('express');
const { createUser, findAllUsers, findUserByGuid } = require('../controllers/user/index.controller.js');
const { guidToId } = require('../middlewares/guidToId.middleware.js');

const userRouter = express.Router();

userRouter.post('/create', createUser);
userRouter.get('/find', findAllUsers);
userRouter.get('/find/:usuario_guid', guidToId, findUserByGuid);

module.exports = userRouter;

