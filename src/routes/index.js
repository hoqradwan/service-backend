const express = require('express');
const router = express.Router();

const test = require('../modules/user/user.route');

 router.use("/example",test)


module.exports = router