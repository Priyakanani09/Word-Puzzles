var express = require('express');
var router = express.Router();
const jwtAuth = require("../middleware/authMiddleware");
const register = require("../controller/usercontroller");

router.post("/register", register.registeruser);
router.post("/login", register.loginUser);

module.exports = router;
