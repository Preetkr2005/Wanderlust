const isloggedin = (req, res, next) => {
  console.log("middleware");
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //make a new property in session object where we store user want to access path before login
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports = {
  isloggedin,
  saveRedirectUrl,
};
