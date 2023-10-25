const router = require('express').Router();
require("dotenv").config();

router.use('/getRepo', require('./getRepo'));
//router.use('/getrateLimit', require('./getrateLimit'));

module.exports = router;