const express = require('express');
const userRouter = require('./typeUser.router');

const router = express.Router();

router.use('/api/user', userRouter);

module.exports = router;