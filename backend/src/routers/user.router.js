const express = require('express');
const { createUser, findAllUsers } = require('../controllers/user/index.controller.js');


const userRouter = express.Router();

userRouter.post('/create', createUser);
userRouter.get('/find', findAllUsers);

module.exports = userRouter;

