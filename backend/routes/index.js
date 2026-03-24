var express = require('express');
var router = express.Router();
const jwtAuth = require("../middleware/authMiddleware");
const register = require("../controller/usercontroller");
const word = require("../controller/wordController");
const gamestatusController = require("../controller/gamestatuscontroller");

router.post("/register", register.registeruser);
router.post("/login", register.loginUser);
router.post("/forgot-password", register.forgotpassword);
router.get("/getuser",register.getuser);

router.post("/addword",word.addwords)
router.get("/getword/:level",jwtAuth,word.getwordsbylevel);
router.get("/getallword",word.getwords)

router.post("/gamestatus", gamestatusController.saveGameResult);
router.get("/gamestatus/:difficulty", gamestatusController.getGameStats);

module.exports = router;
