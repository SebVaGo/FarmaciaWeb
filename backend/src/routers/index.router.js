const express = require('express');
const typeUserRouter = require('./typeUser.router');
const userRouter = require('./user.router');
const accountRouter = require('./account.router');
const loginRouter = require('./login.router');

const router = express.Router();

router.use('/api/user', typeUserRouter);
router.use('/api/user', userRouter);
router.use('/api/account', accountRouter);
router.use('/api/login', loginRouter);

module.exports = router;