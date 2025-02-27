const express = require('express');
const typeUserRouter = require('./typeUser.router');
const userRouter = require('./user.router');

const router = express.Router();

router.use('/api/user', typeUserRouter);
router.use('/api/user', userRouter);

module.exports = router;