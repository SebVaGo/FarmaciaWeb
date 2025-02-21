const express = require('express');
const userRouter = require('./user.router');

const router = express.Router();

router.use('/api/user', userRouter);

module.exports = router;