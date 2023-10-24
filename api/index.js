const router = require('express').Router();
require("dotenv").config();

router.use('/getRepo', require('./getRepo'));

module.exports = router;