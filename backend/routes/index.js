var express = require('express');
var router = express.Router();
const register = require("../controller/usercontroller");

router.post("/register", register.registeruser);

module.exports = router;
