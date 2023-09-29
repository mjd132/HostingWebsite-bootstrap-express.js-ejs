const router = require("express").Router();
const database = require("./database");
// Middleware to verify Session
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    // User is an admin, allow access
    next();
  } else {
    // User is not authorized to access this route
    res.status(403).send("Access forbidden");
  }
}

router.use("/dashboard/", isAuthenticated);
router.use("/admin/", isAdmin);
// router.get("/dashboard", (req, res) => {
//   const user = req.session.user;
//   res.render("dashboard", { user, section: "main" });
// });

router
  .route(["/dashboard/:section", "/dashboard"])
  .get((req, res) => {
    const user = req.session.user;
    const section = req.params.section;
    if (section) res.render("dashboard", { user, section: section });
    else res.render("dashboard", { user, section: "main" });
  })
  .post((req, res) => {});

router.route(["/admin/:section", "/admin"]).get((req, res) => {
  const user = req.session.user;
  const section = req.params.session;
  if (section) red.render("adminDashboard", { user, section: section });
  else res.render("adminDashboard", { user, section: "main" });
});

module.exports = router;
