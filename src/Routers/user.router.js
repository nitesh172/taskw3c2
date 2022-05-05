const { Router } = require("express");

const router = Router()

const { create, verifyOtp } = require("../controllers/user.contoller");

router.route("/create").post(create);
router.route("/verify").post(verifyOtp);

module.exports = router;
