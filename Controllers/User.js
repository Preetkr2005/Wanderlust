const User = require("../models/User");

const RenderSignupform = (req, res) => {
  res.render("Users/signup.ejs");
};

const Signupform = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

const LoginRenderfrom = (req, res) => {
  res.render("Users/login.ejs");
};

const LoginFrom = (req, res) => {
  req.flash("success", "welcome to wanderlust");
  const redirectUrl = res.locals.redirectUrl || "/listings";

  // this is solve the flaw when someone login redirct from login button its shows page don not found on res.locals.redirectUrl its not rediect on listings so we make this flow

  res.redirect(redirectUrl);

  // req.session.redirectUrl this line give the error because passport reset the session so if any property we create its reset
};

const LogoutForm = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
}

module.exports = {
  RenderSignupform,
  Signupform,
  LoginRenderfrom,
  LoginFrom,
  LogoutForm
};
