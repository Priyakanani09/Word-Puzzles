var express = require('express');
var router = express.Router();
const jwtAuth = require("../middleware/authMiddleware");
const register = require("../controller/usercontroller");

router.post("/register", register.registeruser);
router.post("/login", register.loginUser);
router.post("/forgot-password", register.forgotpassword);
router.get("/getuser",register.getuser);

module.exports = router;
