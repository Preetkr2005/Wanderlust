const express = require("express");
const User = require("../models/User");
const router = express.Router();
const AsyncWrap = require("../utils/AsyncWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware.js");
const UserController = require("../Controllers/User.js")

router.get("/signup", UserController.RenderSignupform);

router.post(
  "/signup",
  AsyncWrap(UserController.Signupform),
);

router.get("/login", UserController.LoginRenderfrom);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 UserController.LoginFrom
);

router.get("/logout", UserController.LogoutForm);

module.exports = router;
